# Moving MzansiAcademy from Firebase to Supabase

**Why:** Supabase is a Postgres database Claude can connect to and manage directly (tables, security
rules, queries, logs), so data problems can be checked and fixed without anyone exporting anything.
It also lets us move points and admin rights to the server, which closes the biggest cheating hole
in the Firebase setup (points and `isAdmin` are written by the browser today).

**Project:** `MzansiAcademy` (ref `kxndcjzntrthwwnookgt`, region eu-west-1, free plan).
Restored from pause on 30 Oct 2026.

## Phase 1 — Database (done, 30 Oct 2026)

Schema in `db/supabase/001_core_schema.sql`. Every table has row-level security.

| Firebase today | Supabase table / function |
|---|---|
| `users/{uid}` profile fields | `profiles` (auto-created on sign-up) |
| `usernames/{name}` | `profiles.username` (unique, case-insensitive) |
| `users.progress.{sid}.{mi}.{ti}` | `lesson_progress` |
| `users/{uid}/quizHistory` | `quiz_attempts` |
| `users/{uid}/pointsHistory` + `pts` | `points_ledger` + `award_points()` (1–200 per call, 2 000 per day) |
| `leaderboard/{uid}` | `leaderboard` view + `leaderboard_since()` for weekly/monthly |
| `users/{uid}/friends`, `friendRequests`, `sentRequests`, `mutedRequests` | `friendships`, `friend_requests` + `accept_friend_request()` |
| `users/{uid}/notifications` | `notifications` (realtime) |
| `groups`, `members`, `joinRequests`, RTDB `groupChats` | `study_groups`, `study_group_members`, `study_group_join_requests`, `study_group_messages` (realtime) |
| RTDB DMs | `direct_messages` (friends only, realtime) |
| `announcements` | `announcements` (admins write) |
| `partnershipInquiries` | `partnership_inquiries` (anyone submits, admins read) |
| `fcmTokens` | `push_tokens` |
| RTDB `presence`, `battles/queue` | Supabase Realtime presence/broadcast channels (no table needed) |

Tested as two fake users in a rolled-back transaction: profile auto-created, points only via
`award_points()`, users can't raise their own points or make themselves admin, DMs blocked until
friends, accepting a request creates both friendship rows, leaderboard shows first name + initial.

## Phase 2 — Switch the app (done on the branch, 3 Nov 2026)

- Decisions: start fresh (no Firebase accounts imported), Google sign-in only, no phone sign-in.
- `index.html`: the Firebase block is replaced by the Supabase data layer (see CLAUDE.md §6);
  every Firestore / Realtime Database call now goes through it. Phone and email sign-in screens
  were removed. Firebase stays only for push delivery (FCM).
- `admin.html`: same console, Supabase data; admins are `profiles.is_admin`.
- `api/notify.js`: verifies the Supabase access token and reads `push_tokens` with the
  service-role key.
- Extra tables and functions: `db/supabase/002_app_switch.sql`.
- 10 demo learners (with points, friendships, a study group and announcements) seed the app.

## Before it goes live (owner)

1. Google sign-in: in Google Cloud Console create an OAuth client (Web), add the redirect URI
   `https://kxndcjzntrthwwnookgt.supabase.co/auth/v1/callback`; then in Supabase →
   Authentication → Providers → Google paste the client ID and secret and enable it.
2. Supabase → Authentication → URL Configuration: Site URL `https://www.mzansiacademysa.co.za`,
   add it (and `https://mzansiacademysa.co.za`) to Redirect URLs.
3. Vercel → Environment Variables: add `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Settings → API
   keys → secret key) for push notifications.
4. Make yourself admin: Supabase → Table editor → profiles → your row → `is_admin` = true.
