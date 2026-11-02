-- MzansiAcademy — Supabase changes for switching the app off Firebase.
-- Applied 2–3 Nov 2026 as migrations: app_switch_additions, neutralise_legacy_group_rules,
-- group_member_counts, admin_console_support. Builds on 001_core_schema.sql.

-- ── app_switch_additions ────────────────────────────────────────────────────
-- Extra per-user fields the app keeps (names, matric year, subjects, certs, status, mood, counters…)
alter table public.profiles add column data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 20000);
grant select (data) on public.profiles to authenticated;
grant update (data) on public.profiles to authenticated;

-- Points: battle wins award 500, so up to 500 per award and 3 000 per day
create or replace function public.award_points(p_amount integer, p_reason text) returns integer
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); today_total integer; new_pts integer;
begin
  if uid is null then raise exception 'not signed in'; end if;
  if p_amount < 1 or p_amount > 500 then raise exception 'amount out of range'; end if;
  select coalesce(sum(amount),0) into today_total from public.points_ledger
   where user_id = uid and created_at > now() - interval '1 day';
  if today_total + p_amount > 3000 then raise exception 'daily points limit reached'; end if;
  insert into public.points_ledger (user_id, amount, reason) values (uid, p_amount, left(p_reason,60));
  perform set_config('app.award','on', true);
  update public.profiles set pts = pts + p_amount where id = uid returning pts into new_pts;
  perform set_config('app.award','off', true);
  return new_pts;
end $$;

-- Public all-time leaderboard (guests too)
create or replace function public.leaderboard_top(p_limit integer default 100)
returns table (id uuid, display_name text, avatar text, grade text, province text, pts integer)
language sql stable security definer set search_path = '' as $$
  select id, display_name, avatar, grade, province, pts from public.leaderboard
  order by pts desc limit least(greatest(p_limit,1), 200);
$$;
revoke execute on function public.leaderboard_top(integer) from public;
grant execute on function public.leaderboard_top(integer) to anon, authenticated;

alter table public.announcements add column type text not null default 'info' check (type in ('info','alert','success','event')),
                                 add column target text not null default 'all' check (char_length(target) <= 40);

-- Study groups: open / request / invite and display settings
alter table public.study_groups
  add column join_type text not null default 'open' check (join_type in ('open','request','invite')),
  add column meta jsonb not null default '{}'::jsonb check (pg_column_size(meta) < 10000);
create policy "see discoverable or joined groups" on public.study_groups for select to authenticated
  using (join_type <> 'invite' or public.is_group_member(id));
create policy "join open group" on public.study_group_members for insert to authenticated
  with check (user_id = auth.uid() and role = 'member'
              and exists (select 1 from public.study_groups g where g.id = group_id and g.join_type = 'open'));
create or replace function public.group_member_ids(p_group uuid) returns setof uuid
language sql stable security definer set search_path = '' as $$
  select m.user_id from public.study_group_members m join public.study_groups g on g.id = m.group_id
  where m.group_id = p_group and (g.join_type <> 'invite' or public.is_group_member(p_group));
$$;
revoke execute on function public.group_member_ids(uuid) from public, anon;
grant execute on function public.group_member_ids(uuid) to authenticated;

alter table public.study_group_messages
  add column author_name text not null default 'Learner' check (char_length(author_name) <= 60),
  add column author_avatar text not null default '🧬' check (char_length(author_avatar) <= 2000),
  add column is_ai boolean not null default false;

-- Battle Trivia matchmaking
create table public.battle_rooms (
  id         uuid primary key default gen_random_uuid(),
  status     text not null default 'waiting' check (status in ('waiting','playing','done')),
  mode       text not null default 'general' check (char_length(mode) <= 20),
  rounds     smallint not null default 10 check (rounds between 1 and 50),
  questions  jsonb not null default '[]'::jsonb check (pg_column_size(questions) < 200000),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index on public.battle_rooms (status, created_at desc);
create table public.battle_players (
  room_id   uuid not null references public.battle_rooms(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  name      text not null check (char_length(name) <= 60),
  avatar    text not null default '🧬' check (char_length(avatar) <= 2000),
  score     integer not null default 0 check (score between 0 and 100000),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);
create or replace function public.is_battle_player(p_room uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.battle_players where room_id = p_room and user_id = auth.uid());
$$;
revoke execute on function public.is_battle_player(uuid) from public, anon;
grant execute on function public.is_battle_player(uuid) to authenticated;

alter table public.battle_rooms enable row level security;
create policy "see rooms" on public.battle_rooms for select to authenticated using (true);
create policy "create room" on public.battle_rooms for insert to authenticated with check (created_by = auth.uid() and status = 'waiting');
create policy "players start room" on public.battle_rooms for update to authenticated
  using (public.is_battle_player(id)) with check (public.is_battle_player(id));
alter table public.battle_players enable row level security;
create policy "see players" on public.battle_players for select to authenticated using (true);
create policy "join room" on public.battle_players for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.battle_rooms r where r.id = room_id and r.status = 'waiting'));
create policy "update own score" on public.battle_players for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "leave room" on public.battle_players for delete to authenticated using (user_id = auth.uid());

alter publication supabase_realtime add table public.battle_rooms, public.battle_players, public.friend_requests, public.friendships;

-- ── neutralise_legacy_group_rules ───────────────────────────────────────────
-- The old is_private column and its two policies could not be dropped (the destructive-change
-- approval kept timing out), so is_private now mirrors join_type and only allows open groups.
create or replace function public.sync_group_privacy() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.is_private := (new.join_type <> 'open');
  return new;
end $$;
create trigger study_groups_sync_privacy before insert or update on public.study_groups
  for each row execute function public.sync_group_privacy();
revoke execute on function public.sync_group_privacy() from public, anon, authenticated;

-- Only a group's owner may post messages marked as the AI moderator
create or replace function public.guard_ai_group_message() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.is_ai and not exists (select 1 from public.study_groups g where g.id = new.group_id and g.owner_id = auth.uid()) then
    raise exception 'only the group owner can post moderator messages';
  end if;
  return new;
end $$;
create trigger study_group_messages_guard_ai before insert or update on public.study_group_messages
  for each row execute function public.guard_ai_group_message();
revoke execute on function public.guard_ai_group_message() from public, anon, authenticated;

-- ── group_member_counts ─────────────────────────────────────────────────────
create or replace function public.group_member_counts() returns table (group_id uuid, members bigint)
language sql stable security definer set search_path = '' as $$
  select m.group_id, count(*) from public.study_group_members m join public.study_groups g on g.id = m.group_id
  where g.join_type <> 'invite' or public.is_group_member(g.id)
  group by m.group_id;
$$;
revoke execute on function public.group_member_counts() from public, anon;
grant execute on function public.group_member_counts() to authenticated;

-- ── admin_console_support ───────────────────────────────────────────────────
create or replace function public.admin_learners(p_limit integer default 500)
returns table (id uuid, email text, username text, display_name text, avatar text, grade text, province text, school text,
               mantra text, pts integer, is_admin boolean, created_at timestamptz, data jsonb)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'admins only'; end if;
  return query
    select p.id, u.email::text, p.username::text, p.display_name, p.avatar, p.grade, p.province, p.school, p.mantra, p.pts, p.is_admin, p.created_at, p.data
    from public.profiles p join auth.users u on u.id = p.id
    order by p.pts desc limit least(greatest(p_limit,1), 1000);
end $$;
revoke execute on function public.admin_learners(integer) from public, anon;
grant execute on function public.admin_learners(integer) to authenticated;

create policy "admins delete enquiries" on public.partnership_inquiries for delete to authenticated using (public.is_admin());

-- Demo data (not a migration): 10 demo learners (auth.users ids d0000000-…-0001 to -0010,
-- emails demoN@demo.mzansiacademy.local, profiles.data->>'demo' = true) with points history,
-- 10 friendships, the "Matric Maths Grind" study group and two announcements.
-- Remove later with: delete from auth.users where email like '%@demo.mzansiacademy.local';
