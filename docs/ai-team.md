# MzansiAcademy AI team

How Claude is set up to work on this site. The short version lives in CLAUDE.md §10.

## Use case

MzansiAcademy is a free learning platform for South African learners in Grades 8–12. Being
free is the mission, not an excuse: lessons must be correct and cover CAPS, quizzes must be
fair and teach, and the app must work well on a cheap phone on mobile data. The team below
makes every change pass the same checks before learners see it.

## Team

| Agent | Role | Input → output | Can edit? |
|---|---|---|---|
| curriculum-planner | Finds CAPS/NSC gaps and thin lessons | subject → brief per topic | No |
| lesson-writer | Writes lessons and quizzes, "CAPS, twisted" | brief → `content/lessons/<sid>.js` | Yes |
| reviewer | Checks facts, maths, CAPS coverage, quiz quality, tone | diff → findings + PASS | No |
| illustrator | Draws the 400×220 teaching diagrams | lesson → `svg` field + screenshots | Yes |
| qa-tester | Tests in a real browser, phone first; hard rules | branch → PASS/FAIL report | No |

Agent prompts: `.claude/agents/*.md`. The reviewer and QA tester can't edit, so they can't
quietly "fix" what they were meant to report.

## Workflow

```
owner request
  → curriculum-planner (brief)
  → lesson-writer ⇄ reviewer (until PASS, max 3 rounds, then ask the owner)
  → illustrator
  → qa-tester
  → owner approval  ← show what changed, review PASS, QA results, screenshots
  → branch, commit, push, draft PR
  → ship-check → owner says merge → main → live
```

Skills: `.claude/skills/content-pipeline` (the whole flow) and `.claude/skills/ship-check`
(the quality gate before merging). UI-only changes skip planner/writer/illustrator but still
go through qa-tester and ship-check.

## Tool stack

| Tool | What it does |
|---|---|
| `node tools/qa/check-content.js [sid…]` | Every lesson: required fields, 3 concepts/examples/quiz questions, 4 unique options, answer index, SVG size, grade in subtitle, no-break spaces in amounts; index.html backticks and duplicate ids. Exit 1 on errors. |
| `node tools/qa/check-site.js [sid…] [--smoke] [--shots dir]` | Serves the repo and opens it in Chromium: no sideways scrolling on phone/desktop, bottom menu, home challenge, leaderboard, every lesson shows hook/quiz/illustration, every module test uses its own questions, no page errors. |
| `tools/illustrations/svglib.py` + `preview.js` | Drawing helpers (titles, plots, steps, boxes, timelines, code windows) and a screenshot previewer. |
| CAPS PDFs (repo root) | The source of truth for what each grade must cover. |
| GitHub (draft PRs), Vercel (deploys from `main`), Supabase | Shipping and data — behind the approval gates. |

## QA plan

Before any PR is marked ready:
1. `check-content.js` has 0 errors and no new warnings from the change.
2. `check-site.js` passes; screenshots looked at.
3. Reviewer PASS for any lesson or quiz change.
4. Diff has no secrets, index.html rules hold (CLAUDE.md §8).
5. The owner is told plainly what was not tested (e.g. Google sign-in, push).

## Quality bar (what "good" means)

- **Courses:** every topic has a real lesson (now 435/435); every number checked; every
  lesson has a South African hook and exam technique.
- **Quizzes:** one clearly right answer, believable wrong answers, an explanation that
  teaches, no repeats in a subject.
- **UI:** works at 390px wide, nothing scrolls sideways, no console errors, works signed out.

## Approval gates

Claude always asks the owner before: merging to `main`, pushing to a new branch, deleting
content or data, sending anything to learners (push, email, announcements), changing the
database, or spending money. Claude never asks for passwords or API keys in chat.

## First week

| Day | Work |
|---|---|
| 1 | Fix the 3 `lifesci` lessons with no conclusion (`check-content.js` errors). |
| 2 | Clear the amount-spacing warnings (no-break spaces) subject by subject. |
| 3 | Reviewer pass on maths and physical science quizzes (most exam weight). |
| 4 | Fix repeated quiz questions; add explanations where `et` is missing. |
| 5 | Phone UI pass with qa-tester screenshots on the 5 main tabs. |
| 6 | Planner gap check for one Grade 12 subject against its CAPS PDF. |
| 7 | Ship-check, owner review, merge what's approved. |

## Start here

Ask Claude, for example:
- "Run the content pipeline on Grade 12 maths — check every quiz answer."
- "Ship-check this branch."
- "Plan what's missing in history against CAPS."
