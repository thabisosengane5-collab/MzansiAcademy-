export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { token, title, body, data } = req.body;
  if (!token) return res.status(400).json({ error: 'No token provided' });

  try {
    const response = await fetch(`https://fcm.googleapis.com/v1/projects/edusa-a6efe/messages:send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIREBASE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          data: data || {}
        }
      })
    });
    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
