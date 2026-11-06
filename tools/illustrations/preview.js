// Screenshot an illustration preview page so the illustrator (and reviewer) can look at it.
//   node tools/illustrations/preview.js preview.html out-dir
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const [page, out = 'svg-preview'] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1250, height: 900 } });
  await p.goto('file://' + path.resolve(page));
  await p.waitForTimeout(800);
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i * 900 < h; i++) {
    await p.evaluate((y) => window.scrollTo(0, y), i * 900);
    await p.waitForTimeout(100);
    await p.screenshot({ path: path.join(out, `p${i}.png`) });
  }
  console.log(`saved ${Math.ceil(h / 900)} screenshot(s) to ${out}`);
  await b.close();
})();
