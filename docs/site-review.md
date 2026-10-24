# MzansiAcademy — Site Review (Oct 2026)

Scope: the live site `https://www.mzansiacademysa.co.za` = root `index.html`, `admin.html`,
`api/*`, `firebase-messaging-sw.js`, `manifest.json`, plus what else the repo root exposes.
Method: read the code at `main@e46397e` and loaded the live page in headless Chromium
(390×844 mobile) watching console and network errors.

The homepage renders cleanly on mobile and loads in ~2.5 s. Most of what needs fixing is
security, not looks.

---

## 🔴 Critical — do these first

### 1. Firebase service-account private key is committed (public repo)
`api/notify.js` hard-codes the full `firebase-adminsdk` service-account JSON, including
`private_key`. The repo is public, so anyone can use it to act as **admin on the whole
Firebase project `edusa-a6efe`**: read/modify/delete every user, Firestore and RTDB doc,
storage file, and send push to every learner.

Fix:
1. **Rotate now** — Google Cloud Console → IAM → Service Accounts →
   `firebase-adminsdk-fbsvc@edusa-a6efe…` → Keys → delete key `00be5b5a…`, create a new one.
   Deleting the file from git does *not* help on its own; it's in history and already public.
2. Put the new JSON in a Vercel env var (e.g. `FIREBASE_SERVICE_ACCOUNT`) and have
   `api/notify.js` read `JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)`.
3. Check Firebase Auth / Firestore for anything unexpected (new admins, mass deletes).

### 2. Groq API key is committed
`apps/web/.env.local` is tracked in git and contains `GROQ_API_KEY` (plus Supabase and
Firebase public config). Rotate the Groq key in the Groq console, `git rm --cached
apps/web/.env.local`, and add `.env*` to `.gitignore`.

### 3. `/api/notify` lets anyone push any notification to any learner
No auth check — any caller can POST `{token, title, body}` and the server signs it with
the admin credential. Combined with item 5 (push toast uses `innerHTML`) this is a
remote script-injection path. Fix: require a Firebase ID token (`Authorization: Bearer`),
verify it server-side, and only allow sending to tokens the caller is entitled to (or
move sending to a trusted backend/admin only).

### 4. `/api/chat` is an open Groq proxy
It forwards the raw request body to Groq. Anyone can call it with any model, any
`max_tokens`, any prompt — on your bill. Fix: build the Groq request server-side (fixed
model, capped `max_tokens`, server-owned system prompt), accept only `messages`, cap their
count/length, and add basic rate limiting.

### 5. Stored XSS in DMs, study rooms, push toast and AI replies
User-supplied text is inserted with `innerHTML` unescaped:
- `index.html:10449` — DM `m.text`
- `index.html:10588-10589` — room message `m.name` and `m.text`
- `index.html:92` — FCM toast `n.title` / `n.body`
- `index.html:9544` — AI reply (only `**bold**` → `<strong>` is intended)
- `index.html:9646` — profile `fullName`

A learner can send a friend `<img src=x onerror=…>` and run code in their session (post as
them, read their DMs, change their profile). Fix: add one `escapeHtml()` helper and use it
on every user/AI string before concatenating into HTML (for the AI reply, escape first,
then apply the `**bold**` replace).

---

## 🟠 High

### 6. Points, leaderboard and admin flag are client-writable — verify the Firebase rules
`DB.saveProfile`, `DB.addPoints`, `DB.saveQuizResult` write `pts` and `leaderboard/{uid}`
straight from the browser, and `admin.html` trusts `users/{uid}.isAdmin`. The security
rules are not in this repo. If the rules let a user write their own `users/{uid}` doc
freely, anyone can run `FB.setDoc(…{isAdmin:true})` from the console and get the admin
panel, or give themselves 1,000,000 points. Fix: in Firestore rules, deny client writes
to `isAdmin` and `pts` (or validate increments), and set admin via custom claims. Commit
`firestore.rules` / `database.rules.json` to the repo so they're reviewable.

### 7. Background push notifications are broken — API key typo
`firebase-messaging-sw.js` has `apiKey: "AIzaSyCS6LZeWXOqmi3O1BN9dD4u8yGVu9NOFi8"` — two
zeros were typed as the letter **O** (compare `index.html:38`, `…WX0qmi…N0Fi8`). Its
`storageBucket` also differs (`appspot.com` vs `firebasestorage.app`) and its SDK
(10.7.0) differs from the page (10.12.0). Copy the config from `index.html` exactly.

### 8. Internal tools are publicly served
`dashboard.html` ("TUBS // FOUNDER DASHBOARD" — plans for MzansiAcademy, Pulsify, Tradi)
and `seed.html` ("TUBS // BOARD SEEDER") return 200 on the live domain. Move them out of
this repo (or behind auth) and add a `.vercelignore`.

---

## 🟡 Medium

9. **Contact emails show "[email protected]" and link to a 404.** The page was saved from a
   Cloudflare-proxied copy: 5 `__cf_email__` spans + `/cdn-cgi/l/email-protection` links,
   and the decoder script `/cdn-cgi/scripts/…/email-decode.min.js` 404s on Vercel. Replace
   with plain `info@mzansiacademy.co.za` / `support@mzansiacademy.co.za` (lines ~3018,
   3202-3203, 3231, 10908) and delete the script tag at line 4335.
   ⚠ The site is `mzansiacademysa.co.za` but the emails are `@mzansiacademy.co.za` —
   confirm those inboxes exist.
10. **Duplicate id `friendSearchInput`** (`index.html:10193` and `11054`). The friends-list
    filter (`renderFriendsList`, line 10191) can read the wrong input.
11. ~~**SVG console error** `<rect> attribute rx: Expected length, "3 3 0 0"`~~ — fixed
    (Rooms tab icon now uses `rx="3"`; the square rect under it keeps the bottom flat).
12. **Two `<link rel="manifest">` tags** (file + data-URL). Keep `/manifest.json` only.
    Its icons point at `ui-avatars.com` (third-party, PNG generated on demand) — ship real
    192/512 PNGs in the repo so installs work offline.
13. **Firebase Analytics config 404** (`…/webConfig`) — the web app ID's Analytics link
    looks broken in the Firebase console; it falls back to `G-N8W3TQ8QVD`. Re-link
    Analytics for the web app.
14. **AI endpoint is hard-coded to `https://www.mzansiacademysa.co.za/api/chat`**
    (`index.html:9485`) — breaks on preview deploys and the apex domain. Use `/api/chat`.

## 🟢 Low / housekeeping

15. **`node_modules/` is committed** (683 files) even though `.gitignore` lists it —
    `git rm -r --cached node_modules`.
16. **~65 MB of CAPS PDFs in the repo root**, served but not linked from the app. Move to
    Firebase Storage (or a `docs/caps/` folder that's linked) and out of git.
17. **`index.html` is missing `</body></html>`** — browsers cope, but add them.
18. **12 `console.log` calls** (FCM token logging etc.) ship to production — trim.
19. **Three app codebases** (`app/`, `apps/web/`, `mzansi-app/`) besides the live one —
    decide which rebuild is the future and delete the rest. `app/` is a 2-file stub.
20. Empty `Untitled-1` file in the root.

---

## 📚 Course content

21. **96% of lessons were template text.** Of 504 topics, only 22 had hand-written
    lessons; the rest come from one generic template per subject with the topic name
    swapped in — the same paragraphs on every page. Now fully written: Mathematics (42),
    Physical Sciences (24), Life Sciences (30), Maths Literacy (18), English Home Language (24),
    Geography (30), Accounting (18), History (24), Business Studies (12) and Economics (12) in
    `content/lessons/`; 11 subjects (~250 lessons) remain.
22. ~~**5 subjects quiz learners on Maths.**~~ Fixed: `content/quiz/bank.js` gives
    `math_lit`, `afrikaans`, `isizulu`, `technology` and `arts` their own banks, and adds
    `GK_QUESTIONS` for Battle Trivia's General Knowledge mode.
23. **Module quizzes weren't about the module** — they drew 8 random questions from the
    whole subject. Fixed for subjects with per-lesson quizzes (Maths so far).
24. **10-second timer on module quiz questions** is too short for calculation questions
    (and the speed bonus divides by 20, not 10).

---

## Suggested order
1. Rotate the service-account key and the Groq key (items 1-2) — today, in the consoles.
2. One PR: env-var the service account, lock down `/api/notify` and `/api/chat`, add
   `escapeHtml()` (items 1-5).
3. Review/commit Firebase rules (6).
4. One PR: SW config, hide internal pages, emails, duplicate id, manifest (7-14).
5. Repo cleanup (15-20).
