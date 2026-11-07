// Site check in a real browser (Playwright + Chromium; preinstalled in Claude cloud sessions).
//   node tools/qa/check-site.js                  → smoke test + every subject in LESSON_FILES
//   node tools/qa/check-site.js math history     → smoke test + only these subjects
//   node tools/qa/check-site.js --smoke          → smoke test only
//   add --shots <dir> to save phone/desktop screenshots of the home page and a lesson
// Serves the repo itself, so no server is needed. Exit code 1 on any failure.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..', '..');
const args = process.argv.slice(2);
const shotsAt = args.indexOf('--shots');
const shots = shotsAt >= 0 ? args.splice(shotsAt, 2)[1] : null;
const smokeOnly = args.includes('--smoke');
const only = args.filter((a) => !a.startsWith('--'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
// Noise that isn't ours: third-party config fetches and missing favicons
const IGNORE = /webConfig|favicon|Failed to load resource|ERR_CERT|net::ERR/;

const fails = [];
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) fails.push(msg); };

const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, r));
  const URL = `http://localhost:${server.address().port}/index.html`;
  const browser = await chromium.launch();
  const errors = [];
  async function open(width, height) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !IGNORE.test(m.text())) errors.push(m.text().slice(0, 200)); });
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    return page;
  }

  // ── Smoke test: guest view on a phone and a desktop ────────────────────────
  const phone = await open(390, 844);
  for (const [name, page] of [['phone', phone], ['desktop', await open(1366, 900)]]) {
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    ok(w <= page.viewportSize().width, `${name}: no sideways scrolling (page ${w}px wide)`);
    if (shots) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, `home-${name}.png`), fullPage: true }); }
  }
  const tabs = await phone.evaluate(() => [...document.querySelectorAll('#bottomNav .bottom-nav-item')].map((b) => b.dataset.bnav));
  ok(tabs.length >= 4 && tabs.length <= 5, `bottom menu has ${tabs.length} tabs (${tabs.join(', ')})`);
  if (await phone.$('#lpQuiz .lp-opt')) {
    const result = await phone.evaluate(() => {
      for (let i = 0; i < 5; i++) { document.querySelector('#lpQuiz .lp-opt').click(); document.querySelector('#lpQuiz .lp-next button').click(); }
      return document.querySelector('.lp-score') && document.querySelector('.lp-score').textContent;
    });
    ok(!!result, `home 15-second challenge plays to the end (${result})`);
  }
  await phone.evaluate(() => goTo('leaderboard'));
  const lbShown = await phone.waitForFunction(() => { const t = document.getElementById('lbTable'); return t && !t.querySelector('.spinner') && t.children.length; }, null, { timeout: 20000 }).then(() => true, () => false);
  ok(lbShown, 'leaderboard loads (no endless spinner)');

  // ── Every lesson, illustration and module test ─────────────────────────────
  if (!smokeOnly) {
    const subjects = only.length ? only : await phone.evaluate(() => Object.keys(LESSON_FILES));
    for (const sid of subjects) {
      await phone.evaluate((s) => openCourse(s), sid);
      await phone.waitForTimeout(1500);
      const r = await phone.evaluate((s) => {
        const bad = [];
        let n = 0;
        COURSE_DATA[s].modules.forEach((m, mi) => m.topics.forEach((t, ti) => {
          n++;
          showLesson(s, mi, ti);
          const c = document.getElementById('uvContent');
          const L = LESSON_DB[s] && LESSON_DB[s]['m' + mi] && LESSON_DB[s]['m' + mi][ti];
          if (!L) { bad.push(`m${mi}[${ti}] uses the generic template`); return; }
          if (!/REAL LIFE FIRST/i.test(c.innerText)) bad.push(`m${mi}[${ti}] has no real-life hook section`);
          if (c.querySelectorAll('.quiz-card').length !== 3) bad.push(`m${mi}[${ti}] does not show 3 quiz questions`);
          const art = c.querySelector('.uv-illus-art svg');
          if (L.svg && !art) bad.push(`m${mi}[${ti}] illustration not shown`);
        }));
        const tests = COURSE_DATA[s].modules.map((m, mi) => {
          openModuleQuiz(s, mi); clearInterval(mq.timer);
          const own = [];
          Object.values(LESSON_DB[s]['m' + mi] || {}).forEach((l) => (l.quiz || []).forEach((q) => own.push(q.q)));
          const fine = mq.qs.length > 0 && mq.qs.every((q) => own.includes(q.q));
          if (typeof closeModal === 'function') try { closeModal('moduleQuizModal'); } catch (e) {}
          return fine;
        });
        return { n, bad, tests };
      }, sid);
      ok(r.bad.length === 0, `${sid}: ${r.n} lessons render with hook, quiz and illustration` + (r.bad.length ? ' — ' + r.bad.slice(0, 5).join('; ') : ''));
      ok(r.tests.every(Boolean), `${sid}: every module test draws only its own lessons' questions (${r.tests.filter(Boolean).length}/${r.tests.length})`);
    }
    if (shots && subjects[0]) {
      await phone.evaluate((s) => { openCourse(s); showLesson(s, 0, 0); }, subjects[0]);
      await phone.waitForTimeout(800);
      await phone.screenshot({ path: path.join(shots, `lesson-${subjects[0]}.png`), fullPage: true });
    }
  }

  ok(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.slice(0, 5).join(' | ') : ''));
  await browser.close();
  server.close();
  console.log(`\n${fails.length ? fails.length + ' check(s) FAILED' : 'All checks passed'}${shots ? ' — screenshots in ' + shots : ''}`);
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); server.close(); process.exit(1); });
