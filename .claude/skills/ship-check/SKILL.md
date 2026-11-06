---
name: ship-check
description: The quality gate before a MzansiAcademy PR is merged or anything is published — content checks, browser checks, hard rules and a plain summary for the owner. Use before asking to merge, and whenever the owner asks "is it ready?".
---
# Ship check

Run all of these on the current branch and report each as PASS / FAIL / NOT TESTED:

1. `node tools/qa/check-content.js` — 0 errors. List new warnings the change added (compare with `main` if unsure).
2. `node tools/qa/check-site.js --shots <scratchpad>/shots` — all pass. Look at the screenshots.
3. Diff review (`git diff main...HEAD`):
   - No secrets, keys, `.env` or service-account files.
   - index.html: backtick count even, ids unique, no broad regex edits, no `index.html.bak`.
   - User content escaped before `innerHTML`.
   - `vercel.json` unchanged unless the owner asked.
4. For lesson/quiz changes: the `reviewer` agent's PASS is in this conversation.

Then tell the owner in plain words: what learners will see differently, what was checked,
what wasn't (e.g. Google sign-in, push), and any risk. **Never merge, deploy, delete data,
or send messages to users without the owner's explicit OK in this conversation.**
