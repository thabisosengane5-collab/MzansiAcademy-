# CLAUDE.md — MzansiAcademy Project Guidelines

Behavioral guidelines + project context for Claude Code.

---

## 1. Think Before Coding

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.

## 2. Simplicity First

- Minimum code that solves the problem. No speculative features, abstractions or config.
- No error handling for impossible scenarios.

## 3. Surgical Changes

- Touch only what the request needs. Match existing style.
- Don't refactor or "improve" adjacent code. Mention unrelated dead code — don't delete it.
- Remove only the orphans YOUR change created.

## 4. Goal-Driven Execution

For multi-step tasks, state a brief plan with a verify step for each.

---

## 5. What is live

**Production = the static root `index.html` deployed on Vercel** at
`https://www.mzansiacademysa.co.za`. Every file in the repo root is served as-is, plus the
serverless functions in `api/`. `vercel.json` has only an `ignoreCommand` that skips the
build when the Vercel project is `pulsify` (prj_Mw2nEB…). That project was wrongly
Git-linked to this repo and overwrote pulsefy.co.za; the link was removed on 22 Oct 2026.
Keep the rule as a backstop.

| Path | What it is | Live? |
|---|---|---|
| `index.html` (~820 KB, ~11k lines) | The whole learner app: HTML + CSS + JS + subject content in one file | **Yes** |
| `admin.html` | Admin console (Firebase; gated on `users/{uid}.isAdmin`) | Yes |
| `api/chat.js` | Proxy to Groq chat completions (`GROQ_API_KEY`) — powers the Amahle/Nkosazane AI tutor | Yes |
| `api/notify.js` | Sends FCM push (service account from `FIREBASE_SERVICE_ACCOUNT` env var; needs a Firebase ID token; `broadcast` is admin-only) | Yes |
| `firebase-messaging-sw.js` | FCM background-push service worker | Yes |
| `manifest.json` | PWA manifest | Yes |
| `dashboard.html`, `seed.html` | "TUBS" founder dashboard / board seeder — internal tools, not part of the app | No — excluded by `.vercelignore` |
| `CAPS *.pdf`, `NAUTICAL SCIENCE.pdf` | DBE CAPS curriculum documents (~65 MB) — not linked from the app | Served |
| `apps/web/` | Next.js 14 rebuild (Firebase + Supabase, Amahle AI) | **No** — work in progress |
| `mzansi-app/` | Next.js 16 rebuild + Cloudflare worker | **No** — work in progress |
| `app/` | Two-file Next.js stub | No — leftover |

Unless the user names `apps/web` or `mzansi-app`, "the website" means root `index.html`.
`mzansi-app/AGENTS.md` applies inside that folder (Next.js 16 — read its bundled docs first).

## 6. Stack (live site)

- **Firebase project `edusa-a6efe`** — Auth (email, Google, phone OTP), Firestore,
  Realtime Database (DMs, rooms), Storage, Analytics, Cloud Messaging.
  SDK v10 loaded from `gstatic.com` in the `<script type="module">` at the top of
  `index.html`, then exposed as globals: `window.FB`, `window.DB`, `window.AUTH`,
  `window.rtdb` / `window.rt*`.
- Firestore collections: `users`, `users/{uid}/quizHistory`, `users/{uid}/pointsHistory`,
  `leaderboard`, `fcmTokens`, `announcements`. RTDB: `dms/{chatId}/messages`, rooms.
- **Firestore/RTDB security rules are NOT in this repo** — they live in the Firebase
  console. Points, leaderboard and `isAdmin` are written client-side, so the rules are
  the only thing stopping cheating / privilege escalation. Check them before touching
  any of that.
- AI tutor: `sendAiMessage()` → `/api/chat` → Groq `openai/gpt-oss-120b`. Model, limits and the
  Nkosazane system prompt live in `api/chat.js`; the client sends only `messages`.
- Firebase web `apiKey` in HTML is public by design — that's fine. Anything server-side
  (service accounts, Groq key) is not.

## 7. Course content

- Subjects → modules → topic titles live in `COURSE_DATA` (`index.html`).
- Lesson text: `getLesson()` uses a hand-written lesson from `LESSON_DB[sid]['m'+mi][ti]`
  if one exists, otherwise a **generic template** (the same paragraphs with the topic
  name swapped in). Replacing template lessons with real ones is ongoing.
- Real lessons for a subject go in `content/lessons/<sid>.js` (assigns
  `LESSON_DB.<sid>.m<N> = {…}`) and the subject id is added to `LESSON_FILES` in
  `index.html`. The file loads on demand when the course opens. Done: `math` (56),
  `science` (24), `lifesci` (46), `math_lit` (18), `english_hl` (24), `geography` (30), `accounting` (18), `history` (24), `business` (12),
  `economics` (12), `lifeori` (30), `cat` (24), `technology` (18), `arts` (18), `music` (30). If a subject already has lessons inside
  `index.html`, merge into them (see `_lsAdd` in `lifesci.js`, `_geoAdd` in `geography.js`, `_loAdd` in `lifeori.js`, `_muAdd` in `music.js`) instead of overwriting.
- **House style — CAPS, twisted.** Every lesson covers what CAPS and the NSC exam require
  (the topic, key facts, terms and exam skills) but is taught through South African real
  life, not textbook language: open with a hook from today's world (taxis, load shedding,
  stokvels, SASSA, a news story, a song), use local names and places, link the past to the
  present, and finish with exam technique. Never drop CAPS content to fit the twist, and
  never let a lesson read like a DBE textbook. This is what makes the platform different.
- Lesson shape: see any entry in `content/lessons/math.js`. Every lesson needs a
  real-life South African `hook`, worked `examples` with answers, `mistakes`,
  `activity` + `activityAnswer`, `examTip`, `keyterms` and a 3-question `quiz`
  (`{q,opts,a,et}`, same shape as `QBANK`). Module quizzes draw from these.
- Join digit groups in amounts with a no-break space (R6\u00a0000, not R6 000) so they don't
  wrap on phones — not inside the SVG strings.
- Check numbers in examples by calculation before committing; keep the CAPS grade in
  `subtitle`; mark anything beyond CAPS as enrichment.
- Quizzes: `QBANK` (in `index.html`) holds per-subject questions; `content/quiz/bank.js`
  (loaded with `defer`) adds `GK_QUESTIONS` — fun mixed questions with a `cat` tag and a fun
  fact in `et` — for Battle Trivia's General Knowledge mode, plus banks for subjects that had
  none. Quick quizzes and subject challenges also draw from the lesson quizzes. Keep battle
  questions interesting, not just hard: a surprising fact in every `et`.
- Validate a content file: `node -e "global.LESSON_DB={};require('./content/lessons/math.js')"`.

## 8. Hard rules

1. **Never commit secrets.** No service-account JSON, private keys, `GROQ_API_KEY` or
   `.env*` files. Server code reads `process.env.*`; set values in Vercel env vars.
2. **Escape user content before `innerHTML`.** DM text, room messages, names, push
   titles and AI replies must be escaped (or use `textContent`). Never build HTML from
   Firestore/RTDB data with raw string concatenation.
3. **Never run broad regex replacements on `index.html`.** Make targeted edits; back up
   first (`cp index.html index.html.bak`, don't commit the backup).
4. After editing `index.html`: backtick count must stay even and element ids must stay
   unique. (The file currently ends without `</body></html>` — see the review doc.)
5. Keep `index.html` working as a single static file — no build step on the live site.
6. Don't add a root `index.html` rewrite or framework config to `vercel.json` without
   asking — it would replace the live site with one of the Next.js rebuilds.
7. All Python helper scripts use `encoding='utf-8'`.

## 9. Workflow

- Branch → commit → push → draft PR. There's no GitHub Actions workflow; production
  deploys come from Vercel's Git integration on `main`.
- No test suite or linter. Verify `index.html` changes by loading the page (Playwright
  + Chromium are available in cloud sessions) and checking the console for errors.
- Known issues and the fix backlog: `docs/site-review.md`.
