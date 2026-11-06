---
name: content-pipeline
description: Use for any course, lesson or quiz work on MzansiAcademy (write, rewrite, fix, add a subject, improve quizzes). Runs the AI team in order — plan, write, review, illustrate, QA — and stops for the owner's approval before anything is published.
---
# Content pipeline

MzansiAcademy is a free education business: the lessons and quizzes ARE the product. Every
change goes through the whole team. Don't skip a step because the change looks small.

1. **Plan** — `curriculum-planner` agent: brief per topic (CAPS facts, exam skills, mistakes, hook ideas).
   Show the owner the list of topics you'll touch if it is more than one subject.
2. **Write** — `lesson-writer` agent, from the brief.
3. **Review** — `reviewer` agent on the diff. Send every BLOCKER and FIX back to the
   lesson-writer; repeat until the reviewer says PASS. Max 3 rounds, then ask the owner.
4. **Illustrate** — `illustrator` agent for any lesson without a good `svg`.
5. **QA** — `qa-tester` agent. Any FAIL goes back to whoever owns it.
6. **Approval** — show the owner: what changed (subjects, lessons, quiz count), the
   reviewer's PASS, the QA results, 1–2 screenshots, and anything not tested.
   Ask before committing to a new branch, pushing, or opening a PR.
7. **Ship** — branch → commit → push → draft PR. Merging to `main` publishes to every
   learner: only the owner says when (run `ship-check` first).

Escalate to the owner, don't decide alone, when: CAPS is unclear, a topic is sensitive
(politics, religion, health, sexuality), content would be removed, or something costs money.
