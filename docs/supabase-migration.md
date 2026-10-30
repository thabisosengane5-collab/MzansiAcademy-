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

## Phase 2 — Switch the app (next)

1. Add the Supabase JS client and the project URL + publishable key to `index.html`
   (publishable keys are safe in the browser; the service-role key never is).
2. Replace `window.DB` / `window.FB` calls feature by feature: auth → profile → progress and
   points → leaderboard → friends → DMs and groups → announcements → admin.
3. Move `api/notify.js` to read tokens from `push_tokens` (FCM can keep sending pushes).
4. Keep Firebase running read-only during the switch; remove it when everything works.

## Decisions needed from the owner

1. **Existing accounts.** Either (a) import Firebase users and their points/progress — needs a
   Firebase export (`firebase auth:export` with password hashes, plus a Firestore export) run by
   the owner, or (b) ask learners to create a new account (simplest; progress is lost).
2. **Sign-in methods.** Email and Google work on the free plan (Google needs an OAuth client in
   Google Cloud). **Phone OTP needs a paid SMS provider** (e.g. Twilio) — keep it or drop it?
3. **Old test tables.** `dm_messages`, `group_messages`, `progress`, `quiz_history` and
   `analytics_events` are empty leftovers from the `apps/web` rebuild; four have RLS disabled.
   Recommended: drop them (they hold no data).
