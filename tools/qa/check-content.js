// Content check — no browser needed.
//   node tools/qa/check-content.js            → every subject in LESSON_FILES
//   node tools/qa/check-content.js math history
// Checks every lesson against the house rules in CLAUDE.md §7 and index.html against §8.
// Exit code 1 if any ERROR; WARN lines are worth fixing but don't fail the check.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const errors = [], warns = [];
const err = (m) => errors.push(m), warn = (m) => warns.push(m);

// ── index.html rules (CLAUDE.md §8.4) ───────────────────────────────────────
const ticks = (html.match(/`/g) || []).length;
if (ticks % 2) err(`index.html: odd backtick count (${ticks})`);
const markup = html.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<style\b[\s\S]*?<\/style>/g, '');
const ids = {};
(markup.match(/\sid="([^"]+)"/g) || []).forEach((m) => { const id = m.slice(5, -1); ids[id] = (ids[id] || 0) + 1; });
Object.keys(ids).filter((k) => ids[k] > 1).forEach((k) => err(`index.html: duplicate element id "${k}" (${ids[k]}×)`));

// ── COURSE_DATA and LESSON_FILES from index.html ────────────────────────────
function objectLiteral(marker) {
  const i = html.indexOf(marker);
  if (i < 0) throw new Error('not found in index.html: ' + marker);
  let j = html.indexOf('{', i), depth = 0, k = j;
  for (; k < html.length; k++) { if (html[k] === '{') depth++; else if (html[k] === '}' && --depth === 0) break; }
  return (new Function('return ' + html.slice(j, k + 1)))();
}
const COURSE_DATA = objectLiteral('var COURSE_DATA = {');
const LESSON_FILES = objectLiteral('var LESSON_FILES={');

const subjects = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LESSON_FILES);
const REQUIRED = ['emoji', 'subtitle', 'illusText', 'hook', 'intro', 'concepts', 'examples', 'mistakes', 'activity',
                  'activityAnswer', 'examTip', 'keyterms', 'quiz', 'conclusion', 'svg'];
const TEXT_FIELDS = ['illusText', 'intro', 'activity', 'activityAnswer', 'examTip', 'conclusion'];

// Start from the lessons written inline in index.html, as the site does, then merge the files
global.LESSON_DB = objectLiteral('var LESSON_DB = {');
let totalLessons = 0, totalTopics = 0;
const wordCounts = [];
function lessonWords(L) {
  const count = (x) => (typeof x === 'string' ? x : x ? JSON.stringify(x) : '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const parts = [L.illusText, L.intro, L.activity, L.activityAnswer, L.examTip, L.conclusion, L.hook && L.hook.body, L.callout && (L.callout.body || L.callout)];
  (L.concepts || []).forEach((c) => parts.push(typeof c === 'string' ? c : c.body));
  (L.examples || []).forEach((e) => parts.push(e.body, e.answer));
  (L.mistakes || []).forEach((m) => parts.push(m));
  return parts.reduce((a, x) => a + count(x), 0);
}
for (const sid of subjects) {
  const file = path.join(ROOT, 'content', 'lessons', sid + '.js');
  if (!fs.existsSync(file)) { err(`${sid}: no file content/lessons/${sid}.js`); continue; }
  if (!LESSON_FILES[sid]) warn(`${sid}: not listed in LESSON_FILES (the course won't load the file)`);
  try { require(file); } catch (e) { err(`${sid}: file does not load — ${e.message}`); continue; }
  const course = COURSE_DATA[sid];
  if (!course) { err(`${sid}: not in COURSE_DATA`); continue; }
  const db = LESSON_DB[sid] || {};
  const questions = {};
  let real = 0, topics = 0;
  course.modules.forEach((m, mi) => {
    m.topics.forEach((topic, ti) => {
      topics++;
      const L = db['m' + mi] && db['m' + mi][ti];
      const at = `${sid} m${mi}[${ti}] "${topic}"`;
      if (!L) return;
      real++;
      REQUIRED.forEach((k) => { if (L[k] === undefined || L[k] === '' || (Array.isArray(L[k]) && !L[k].length)) err(`${at}: missing ${k}`); });
      if (L.hook && (!L.hook.title || !L.hook.body)) err(`${at}: hook needs title and body`);
      if (Array.isArray(L.concepts) && L.concepts.length !== 3) err(`${at}: needs 3 concepts (has ${L.concepts.length})`);
      if (Array.isArray(L.examples)) {
        if (L.examples.length !== 3) err(`${at}: needs 3 worked examples (has ${L.examples.length})`);
        L.examples.forEach((e, i) => { if (!e.title || !e.body || !e.answer) err(`${at}: example ${i + 1} needs title, body and answer`); });
      }
      if (Array.isArray(L.quiz)) {
        if (L.quiz.length !== 3) err(`${at}: needs 3 quiz questions (has ${L.quiz.length})`);
        L.quiz.forEach((q, i) => {
          if (!q.q || !Array.isArray(q.opts) || q.opts.length !== 4) err(`${at}: quiz ${i + 1} needs a question and 4 options`);
          else if (!(q.a >= 0 && q.a <= 3)) err(`${at}: quiz ${i + 1} answer index ${q.a} is not 0–3`);
          else if (new Set(q.opts).size !== 4) err(`${at}: quiz ${i + 1} has duplicate options`);
          if (!q.et) warn(`${at}: quiz ${i + 1} has no explanation (et)`);
          if (q.q && questions[q.q]) warn(`${at}: quiz question repeats ${questions[q.q]}`);
          if (q.q) questions[q.q] = `m${mi}[${ti}]`;
        });
      }
      if (typeof L.svg === 'string' && !/^<svg viewBox="0 0 400 220"/.test(L.svg)) err(`${at}: svg must start with <svg viewBox="0 0 400 220"`);
      if (L.subtitle && !/Grade|Enrichment|Project/.test(L.subtitle)) warn(`${at}: subtitle should name the CAPS grade (or say Enrichment)`);
      // CLAUDE.md §7: digit groups joined with a no-break space (not inside svg)
      const texts = TEXT_FIELDS.map((k) => L[k] || '').concat(
        (L.examples || []).map((e) => e.body + ' ' + e.answer),
        L.hook ? [L.hook.body] : []);
      texts.forEach((s) => { const m = /\d \d{3}(?!\d)/.exec(String(s).replace(/<[^>]*>/g, '')); if (m) warn(`${at}: digit group "${m[0]}" uses a normal space — use \\u00a0`); });
      // Depth: teaching text (everything except quiz, keyterms and svg), target 700–900 words
      const words = lessonWords(L);
      if (words < 700) warn(`${at}: short lesson (${words} words; aim for 700–900)`);
      wordCounts.push(words);
    });
  });
  totalLessons += real; totalTopics += topics;
  console.log(`${sid.padEnd(12)} ${String(real).padStart(3)}/${topics} topics have real lessons`);
}

console.log(`\n${totalLessons}/${totalTopics} topics have real lessons in the checked subjects`);
if (wordCounts.length) {
  const w = wordCounts.slice().sort((a, b) => a - b);
  console.log(`Lesson length (words): shortest ${w[0]}, median ${w[w.length >> 1]}, longest ${w[w.length - 1]}; ${w.filter((x) => x >= 700).length}/${w.length} at 700+`);
}
warns.forEach((w) => console.log('WARN  ' + w));
errors.forEach((e) => console.log('ERROR ' + e));
console.log(`\n${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
