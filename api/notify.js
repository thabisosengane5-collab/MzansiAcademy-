import { GoogleAuth, OAuth2Client } from 'google-auth-library';

// Sends FCM push. The service account comes from the FIREBASE_SERVICE_ACCOUNT env var (the
// key JSON), never from the repo. Callers must send a Firebase ID token:
//   { title, body, data }                  → to the caller's own device (fcmTokens/{uid})
//   { title, body, data, broadcast:true }  → to every device; caller needs users/{uid}.isAdmin
const PROJECT = 'edusa-a6efe';
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const CERTS = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT),
    scopes: ['https://www.googleapis.com/auth/firebase.messaging', 'https://www.googleapis.com/auth/datastore']
  });
  const client = await auth.getClient();
  const t = await client.getAccessToken();
  return t.token;
}

async function verifyIdToken(idToken) {
  const certs = await (await fetch(CERTS)).json();
  const ticket = await new OAuth2Client().verifySignedJwtWithCertsAsync(
    idToken, certs, PROJECT, [`https://securetoken.google.com/${PROJECT}`]);
  return ticket.getPayload().sub;
}

async function getDocFields(accessToken, path) {
  const r = await fetch(`${FIRESTORE}/${path}`, { headers: { Authorization: `Bearer ${accessToken}` } });
  return r.ok ? ((await r.json()).fields || {}) : null;
}

async function allTokens(accessToken) {
  const tokens = [];
  let pageToken = '';
  do {
    const r = await fetch(`${FIRESTORE}/fcmTokens?pageSize=300${pageToken ? '&pageToken=' + pageToken : ''}`,
      { headers: { Authorization: `Bearer ${accessToken}` } });
    const j = await r.json();
    (j.documents || []).forEach(d => { if (d.fields && d.fields.token) tokens.push(d.fields.token.stringValue); });
    pageToken = j.nextPageToken || '';
  } while (pageToken);
  return tokens;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) return res.status(503).json({error:'Push not configured'});
  const idToken = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!idToken) return res.status(401).json({error:'Sign in required'});
  const {title, body, data, broadcast} = req.body || {};
  if (!title || !body) return res.status(400).json({error:'title and body required'});
  try {
    let uid;
    try { uid = await verifyIdToken(idToken); } catch (e) { return res.status(401).json({error:'Invalid sign-in'}); }
    const accessToken = await getAccessToken();

    let tokens;
    if (broadcast) {
      const user = await getDocFields(accessToken, `users/${uid}`);
      if (!user || !user.isAdmin || user.isAdmin.booleanValue !== true) return res.status(403).json({error:'Admins only'});
      tokens = await allTokens(accessToken);
    } else {
      const own = await getDocFields(accessToken, `fcmTokens/${uid}`);
      tokens = own && own.token ? [own.token.stringValue] : [];
    }

    const strData = {};
    Object.keys(data || {}).forEach(k => { strData[k] = String(data[k]); });
    const notification = { title: String(title).slice(0, 100), body: String(body).slice(0, 500) };
    const results = await Promise.allSettled(tokens.map(token =>
      fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT}/messages:send`, {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':`Bearer ${accessToken}`},
        body: JSON.stringify({message:{token, notification, data: strData}})
      }).then(r => r.ok)));
    res.status(200).json({sent: results.filter(r => r.status === 'fulfilled' && r.value).length, total: tokens.length});
  } catch(err) {
    res.status(500).json({error:err.message});
  }
}
