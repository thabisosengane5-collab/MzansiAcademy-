-- MzansiAcademy — Supabase core schema (project kxndcjzntrthwwnookgt).
-- Applied on 30 Oct 2026 as three migrations: mzansi_core_schema,
-- lock_down_function_grants, restrict_profile_update_columns.
-- Replaces the Firebase Firestore/RTDB data model. Every table has RLS.

-- ── Profiles ────────────────────────────────────────────────────────────────
create extension if not exists citext with schema extensions;

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      extensions.citext unique check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  display_name  text not null default 'Learner' check (char_length(display_name) <= 60),
  avatar        text not null default '🧬' check (char_length(avatar) <= 2000),
  grade         text check (grade in ('8','9','10','11','12')),
  province      text check (char_length(province) <= 40),
  school        text check (char_length(school) <= 120),
  mantra        text check (char_length(mantra) <= 160),
  pts           integer not null default 0,
  is_admin      boolean not null default false,
  firebase_uid  text unique,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- New auth user → profile row
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'full_name',''), nullif(new.raw_user_meta_data->>'display_name',''), 'Learner'));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may not change their own points or admin flag
create or replace function public.guard_profile_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (new.pts is distinct from old.pts) and coalesce(current_setting('app.award', true),'') <> 'on' then
    raise exception 'pts can only change through award_points()';
  end if;
  if (new.is_admin is distinct from old.is_admin) and auth.role() <> 'service_role' then
    raise exception 'is_admin cannot be changed from the client';
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

alter table public.profiles enable row level security;
create policy "profiles readable by signed-in users" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Public leaderboard (first name + initial only)
create or replace view public.leaderboard with (security_invoker = on) as
  select id, split_part(display_name,' ',1) ||
         case when position(' ' in trim(display_name)) > 0
              then ' ' || left(split_part(trim(display_name),' ', array_length(string_to_array(trim(display_name),' '),1)),1) || '.'
              else '' end as display_name,
         avatar, grade, province, pts
  from public.profiles;

-- ── Learning progress ───────────────────────────────────────────────────────
create table public.lesson_progress (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  subject_id   text not null check (char_length(subject_id) <= 40),
  module_idx   smallint not null check (module_idx between 0 and 50),
  topic_idx    smallint not null check (topic_idx between 0 and 50),
  completed_at timestamptz not null default now(),
  primary key (user_id, subject_id, module_idx, topic_idx)
);
alter table public.lesson_progress enable row level security;
create policy "own progress read"   on public.lesson_progress for select to authenticated using (user_id = auth.uid());
create policy "own progress insert" on public.lesson_progress for insert to authenticated with check (user_id = auth.uid());
create policy "own progress delete" on public.lesson_progress for delete to authenticated using (user_id = auth.uid());

create table public.quiz_attempts (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  subject_id  text not null check (char_length(subject_id) <= 40),
  kind        text not null default 'quiz' check (kind in ('quiz','module_test','battle','challenge')),
  score       smallint not null check (score >= 0),
  total       smallint not null check (total > 0 and score <= total),
  created_at  timestamptz not null default now()
);
create index on public.quiz_attempts (user_id, created_at desc);
alter table public.quiz_attempts enable row level security;
create policy "own attempts read"   on public.quiz_attempts for select to authenticated using (user_id = auth.uid());
create policy "own attempts insert" on public.quiz_attempts for insert to authenticated with check (user_id = auth.uid());

-- ── Points: only through award_points(), capped ─────────────────────────────
create table public.points_ledger (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  amount      integer not null,
  reason      text not null check (char_length(reason) <= 60),
  created_at  timestamptz not null default now()
);
create index on public.points_ledger (user_id, created_at desc);
create index on public.points_ledger (created_at);
alter table public.points_ledger enable row level security;
create policy "own ledger read" on public.points_ledger for select to authenticated using (user_id = auth.uid());

create or replace function public.award_points(p_amount integer, p_reason text) returns integer
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); today_total integer; new_pts integer;
begin
  if uid is null then raise exception 'not signed in'; end if;
  if p_amount < 1 or p_amount > 200 then raise exception 'amount out of range'; end if;
  select coalesce(sum(amount),0) into today_total from public.points_ledger
   where user_id = uid and created_at > now() - interval '1 day';
  if today_total + p_amount > 2000 then raise exception 'daily points limit reached'; end if;
  insert into public.points_ledger (user_id, amount, reason) values (uid, p_amount, left(p_reason,60));
  perform set_config('app.award','on', true);
  update public.profiles set pts = pts + p_amount where id = uid returning pts into new_pts;
  perform set_config('app.award','off', true);
  return new_pts;
end $$;
revoke execute on function public.award_points(integer,text) from public, anon;
grant execute on function public.award_points(integer,text) to authenticated;

-- Weekly / monthly leaderboards from the ledger
create or replace function public.leaderboard_since(p_since timestamptz, p_limit integer default 100)
returns table (id uuid, display_name text, avatar text, grade text, province text, pts bigint)
language sql stable security definer set search_path = '' as $$
  select l.user_id, lb.display_name, lb.avatar, lb.grade, lb.province, sum(l.amount)::bigint
  from public.points_ledger l join public.leaderboard lb on lb.id = l.user_id
  where l.created_at >= p_since
  group by l.user_id, lb.display_name, lb.avatar, lb.grade, lb.province
  order by 6 desc limit least(p_limit, 100);
$$;
revoke execute on function public.leaderboard_since(timestamptz,integer) from public;
grant execute on function public.leaderboard_since(timestamptz,integer) to anon, authenticated;

-- ── Friends ─────────────────────────────────────────────────────────────────
create table public.friend_requests (
  from_id    uuid not null references public.profiles(id) on delete cascade,
  to_id      uuid not null references public.profiles(id) on delete cascade,
  status     text not null default 'pending' check (status in ('pending','declined','muted')),
  created_at timestamptz not null default now(),
  primary key (from_id, to_id),
  check (from_id <> to_id)
);
alter table public.friend_requests enable row level security;
create policy "see own requests"  on public.friend_requests for select to authenticated using (auth.uid() in (from_id, to_id));
create policy "send request"      on public.friend_requests for insert to authenticated with check (from_id = auth.uid() and status = 'pending');
create policy "recipient updates" on public.friend_requests for update to authenticated using (to_id = auth.uid()) with check (to_id = auth.uid());
create policy "either deletes"    on public.friend_requests for delete to authenticated using (auth.uid() in (from_id, to_id));

create table public.friendships (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  friend_id  uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);
alter table public.friendships enable row level security;
create policy "see own friendships" on public.friendships for select to authenticated using (user_id = auth.uid());
create policy "unfriend" on public.friendships for delete to authenticated using (auth.uid() in (user_id, friend_id));

create or replace function public.accept_friend_request(p_from uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid();
begin
  delete from public.friend_requests where from_id = p_from and to_id = me;
  if not found then raise exception 'no such request'; end if;
  insert into public.friendships (user_id, friend_id) values (me, p_from), (p_from, me) on conflict do nothing;
end $$;
revoke execute on function public.accept_friend_request(uuid) from public, anon;
grant execute on function public.accept_friend_request(uuid) to authenticated;

-- Unfriending one side removes both rows
create or replace function public.unfriend_both() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.friendships where user_id = old.friend_id and friend_id = old.user_id;
  return old;
end $$;
create trigger friendships_unfriend_both after delete on public.friendships
  for each row execute function public.unfriend_both();

-- ── Direct messages (friends only) ──────────────────────────────────────────
create table public.direct_messages (
  id           bigint generated always as identity primary key,
  sender_id    uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body         text not null check (char_length(body) between 1 and 2000),
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);
create index on public.direct_messages (sender_id, recipient_id, created_at);
create index on public.direct_messages (recipient_id, created_at);
alter table public.direct_messages enable row level security;
create policy "read own dms" on public.direct_messages for select to authenticated using (auth.uid() in (sender_id, recipient_id));
create policy "send dm to friend" on public.direct_messages for insert to authenticated
  with check (sender_id = auth.uid() and exists (select 1 from public.friendships f where f.user_id = auth.uid() and f.friend_id = recipient_id));
create policy "recipient marks read" on public.direct_messages for update to authenticated using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- ── Study groups ────────────────────────────────────────────────────────────
create table public.study_groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 60),
  subject_id  text check (char_length(subject_id) <= 40),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  is_private  boolean not null default false,
  created_at  timestamptz not null default now()
);
create table public.study_group_members (
  group_id  uuid not null references public.study_groups(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  role      text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create table public.study_group_join_requests (
  group_id   uuid not null references public.study_groups(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create table public.study_group_messages (
  id         bigint generated always as identity primary key,
  group_id   uuid not null references public.study_groups(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index on public.study_group_messages (group_id, created_at);

create or replace function public.is_group_member(p_group uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.study_group_members where group_id = p_group and user_id = auth.uid());
$$;
create or replace function public.add_group_owner() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.study_group_members (group_id, user_id, role) values (new.id, new.owner_id, 'owner');
  return new;
end $$;
create trigger study_groups_add_owner after insert on public.study_groups
  for each row execute function public.add_group_owner();

alter table public.study_groups enable row level security;
create policy "see public or joined groups" on public.study_groups for select to authenticated using (not is_private or public.is_group_member(id));
create policy "create group" on public.study_groups for insert to authenticated with check (owner_id = auth.uid());
create policy "owner edits group" on public.study_groups for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner deletes group" on public.study_groups for delete to authenticated using (owner_id = auth.uid());

alter table public.study_group_members enable row level security;
create policy "members see members" on public.study_group_members for select to authenticated using (public.is_group_member(group_id));
create policy "join public group" on public.study_group_members for insert to authenticated
  with check (user_id = auth.uid() and role = 'member' and exists (select 1 from public.study_groups g where g.id = group_id and not g.is_private));
create policy "owner adds member" on public.study_group_members for insert to authenticated
  with check (role = 'member' and exists (select 1 from public.study_groups g where g.id = group_id and g.owner_id = auth.uid()));
create policy "leave or owner removes" on public.study_group_members for delete to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.study_groups g where g.id = group_id and g.owner_id = auth.uid()));

alter table public.study_group_join_requests enable row level security;
create policy "requester or owner sees" on public.study_group_join_requests for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.study_groups g where g.id = group_id and g.owner_id = auth.uid()));
create policy "request to join" on public.study_group_join_requests for insert to authenticated with check (user_id = auth.uid());
create policy "requester or owner removes" on public.study_group_join_requests for delete to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.study_groups g where g.id = group_id and g.owner_id = auth.uid()));

alter table public.study_group_messages enable row level security;
create policy "members read messages" on public.study_group_messages for select to authenticated using (public.is_group_member(group_id));
create policy "members post" on public.study_group_messages for insert to authenticated with check (sender_id = auth.uid() and public.is_group_member(group_id));

-- ── Notifications ───────────────────────────────────────────────────────────
create table public.notifications (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null check (char_length(type) <= 30),
  actor_id   uuid references public.profiles(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.notifications (user_id, created_at desc);
alter table public.notifications enable row level security;
create policy "own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notify others as self" on public.notifications for insert to authenticated with check (actor_id = auth.uid());
create policy "mark own read" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own" on public.notifications for delete to authenticated using (user_id = auth.uid());

-- ── Announcements (admin-written, public) ───────────────────────────────────
create table public.announcements (
  id         bigint generated always as identity primary key,
  title      text not null check (char_length(title) <= 120),
  body       text not null check (char_length(body) <= 4000),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.announcements enable row level security;
create policy "anyone reads announcements" on public.announcements for select to anon, authenticated using (true);
create policy "admins write announcements" on public.announcements for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Partnership enquiries (anyone submits, admins read) ─────────────────────
create table public.partnership_inquiries (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) <= 120),
  email      text not null check (char_length(email) <= 200),
  org        text check (char_length(org) <= 160),
  message    text check (char_length(message) <= 4000),
  created_at timestamptz not null default now()
);
alter table public.partnership_inquiries enable row level security;
create policy "anyone submits" on public.partnership_inquiries for insert to anon, authenticated with check (true);
create policy "admins read" on public.partnership_inquiries for select to authenticated using (public.is_admin());

-- ── Push tokens ─────────────────────────────────────────────────────────────
create table public.push_tokens (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  token      text not null check (char_length(token) <= 4096),
  created_at timestamptz not null default now(),
  primary key (user_id, token)
);
alter table public.push_tokens enable row level security;
create policy "own tokens" on public.push_tokens for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── Realtime for chat and notifications ─────────────────────────────────────
alter publication supabase_realtime add table public.direct_messages, public.study_group_messages, public.notifications;

-- ── Migration 2: lock_down_function_grants ──────────────────────────────────
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.add_group_owner() from public, anon, authenticated;
revoke execute on function public.unfriend_both()   from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon;
grant  execute on function public.is_admin() to authenticated;
revoke execute on function public.is_group_member(uuid) from public, anon;
grant  execute on function public.is_group_member(uuid) to authenticated;
revoke select on public.profiles from anon, authenticated;
grant select (id, username, display_name, avatar, grade, province, school, mantra, pts, is_admin, created_at, updated_at) on public.profiles to authenticated;

-- ── Migration 3: restrict_profile_update_columns ────────────────────────────
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (username, display_name, avatar, grade, province, school, mantra) on public.profiles to authenticated;
