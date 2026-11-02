import { GoogleAuth } from 'google-auth-library';

// Sends FCM push. Secrets come from Vercel env vars, never from the repo:
//   FIREBASE_SERVICE_ACCOUNT  — service-account key JSON, used only to send through FCM
//   SUPABASE_SERVICE_ROLE_KEY — reads push tokens and the admin flag (server only)
// Callers must send their Supabase access token:
//   { title, body, data }                  → to the caller's own devices (push_tokens)
//   { title, body, data, broadcast:true }  → to every device; caller needs profiles.is_admin
const PROJECT = 'edusa-a6efe';
const SUPABASE_URL = 'https://kxndcjzntrthwwnookgt.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_ow1NvVwxtHCEm-iD5sOvVA_8-1z8FKg';

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT),
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
  });
  const client = await auth.getClient();
  const t = await client.getAccessToken();
  return t.token;
}

// Returns the user id for a valid Supabase access token
async function verifyUser(accessToken) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${accessToken}` } });
  if (!r.ok) return null;
  return (await r.json()).id || null;
}

async function rest(path) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!r.ok) throw new Error(`Supabase ${r.status}`);
  return r.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({error:'Push not configured'});
  const userToken = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!userToken) return res.status(401).json({error:'Sign in required'});
  const {title, body, data, broadcast} = req.body || {};
  if (!title || !body) return res.status(400).json({error:'title and body required'});
  try {
    const uid = await verifyUser(userToken);
    if (!uid) return res.status(401).json({error:'Invalid sign-in'});

    let rows;
    if (broadcast) {
      const me = await rest(`profiles?id=eq.${uid}&select=is_admin`);
      if (!me.length || me[0].is_admin !== true) return res.status(403).json({error:'Admins only'});
      rows = await rest('push_tokens?select=token&limit=10000');
    } else {
      rows = await rest(`push_tokens?user_id=eq.${uid}&select=token`);
    }
    const tokens = rows.map(r => r.token);
    const accessToken = await getAccessToken();

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
