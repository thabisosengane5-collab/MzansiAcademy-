// One-off clean-up: the public `leaderboard` collection used to store learners'
// full names. New saves store "First L." (see DB.saveProfile in index.html);
// this rewrites the existing docs the same way.
//
// Usage (needs a Firebase service account with Firestore access):
//   FIREBASE_SERVICE_ACCOUNT="$(cat key.json)" node scripts/shorten-leaderboard-names.js          # preview
//   FIREBASE_SERVICE_ACCOUNT="$(cat key.json)" node scripts/shorten-leaderboard-names.js --apply  # write
// Never commit the key file.
const { GoogleAuth } = require('google-auth-library');

const PROJECT = 'edusa-a6efe';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const APPLY = process.argv.includes('--apply');

// Same rule as lbName() / DB.saveProfile in index.html
function shortName(n) {
  const p = String(n || 'Learner').trim().split(/\s+/);
  return p[0] + (p.length > 1 ? ' ' + p[p.length - 1].charAt(0) + '.' : '');
}

async function main() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) throw new Error('Set FIREBASE_SERVICE_ACCOUNT to the service-account JSON');
  const auth = new GoogleAuth({
    credentials: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT),
    scopes: ['https://www.googleapis.com/auth/datastore'],
  });
  const client = await auth.getClient();

  let pageToken = '', checked = 0, changed = 0;
  do {
    const res = await client.request({ url: `${BASE}/leaderboard?pageSize=300${pageToken ? '&pageToken=' + pageToken : ''}` });
    for (const doc of res.data.documents || []) {
      checked++;
      const current = doc.fields && doc.fields.displayName && doc.fields.displayName.stringValue;
      if (!current) continue;
      const next = shortName(current);
      if (next === current) continue;
      changed++;
      console.log(`${doc.name.split('/').pop()}: "${current}" -> "${next}"`);
      if (APPLY) {
        await client.request({
          url: `https://firestore.googleapis.com/v1/${doc.name}?updateMask.fieldPaths=displayName`,
          method: 'PATCH',
          data: { fields: { displayName: { stringValue: next } } },
        });
      }
    }
    pageToken = res.data.nextPageToken || '';
  } while (pageToken);

  console.log(`${checked} docs checked, ${changed} ${APPLY ? 'updated' : 'would change (run with --apply to write)'}`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
