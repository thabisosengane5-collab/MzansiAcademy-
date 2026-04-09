import { GoogleAuth } from 'google-auth-library';

const serviceAccount = {
  type: "service_account",
  project_id: "edusa-a6efe",
  private_key_id: "00be5b5a763a6847f3afcc45998eb481749548e1",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDoLToE8Tjn0In\nn8CU8vgKoqbHsRHAzOVTS8L4Tx7RFNXZSZU6ETxiGfb79xOuCRYW+l18zA2aKkCI\nNX9yYxfTtmhd+nOD8KLSIwECM1Z8+7umkrU9cYxz1YBGBaa2ApfX3Is7kvMHharG\njU9WXs9RuKtuOhzQh6VzVTfoTNRX4+J0GxtnWw+FKXJygPsunQtbTLzs0SQ1snWX\n/OfSqP27/iqqvIdpRa/xpswalBkTMFWMg2KWl7Kp0h4LYNJBzNt+NC++ZlWwgB6o\n1Ftzqe3PkV6DjbESCgi8y8wXMCNcsc6p+dFHamlo0yjvUdb9tE7QGBCegOyquVMS\n5deCBOnnAgMBAAECggEAHO7eWBALHTKXPrQGcCEqpVa0EwccczxP/eH6e+4mcSbt\n5UgC7ZvR/J0O0JTqO2G1piqw+/2pVK/uFmx5z9RZwvgQoeGiXGpmh8Ih6o48Ou+i\nVnsOmiqlQBaHdRPDOdp9VFxBLXZI7R0MX8xTkRh5p4JdZx0/g2n52D/LgoHRIA8J\nNlXIJeJAHmoo+rZSlb5bgZrUV6N1LLVj67QjwUROX+VkocVrfYUuR62+Re7rYQM8\nZozSsN0v4R/8f6sKX4kQs2AAuW9vS7wv8M44ELF9NaYrqXj+qsJGxMaW6/ARpP4q\nzz4Eu8JThfmKTQHRyEJj5YDADyilyf7sVJGsznUYbQKBgQDjdclQMAqz0lfudJaR\nlxaqBJaaO/NyjVxsJHEj7T3QRnqUdcaIhVx+8IE3OimbqD3EtUJV4KQ1h2lL0wEb\nQ/9Qxm7DhZtdUcldAWRFHtXJ8MOH1gFRO4+Ds2GHJ1GDRz4WCaRwqHOhSd3YPcL5\n+bMVsoqOL77Hgr75eGdkQC2VJQKBgQDcLHApri40NrV7mvHW4mXiJJ9YD2JNEx14\nKRYrjvbT62TEudosXP5Eu6Y7asDLLuGAgti6Q1aYVYyztyxf5xUAB4uh3ECb0gaj\nGK5EZRnZzzqeTb8Ch2Z9ixyDgks/j+vxEu/AfazoBs7RYri+dKqRal/3Tg5G6Q5o\n2O83Zr/DGwKBgCo194/7+mB4jnzgAfkusrQGefRRX9JITXh8IsrqAeiey6y1VoyL\nQykDdNdM4d/TDvNsN808DP0qDe5WUARBUCYrTO7X4ock4Ft0IKl7GW2KUp7opgHv\nLajhJx4vu77C/9CTJYMKn7q0vIienYpKPmOuaGwOjDb2Gn6tS3KdPlhJAoGAWupm\nrm9kWN82dYH31xnJpGYm/j/sAZOhGZstsnLobX3IMIvmEWec/1jVPbfJQJ1tNJnT\nUKa5vVGmNhevVTKgs1BqUj4W18EUSIjKfSeaUxyFQhUsiKjMo46sCYnl9KtDbFq7\ncarzmSQmhsPTMaIPRNi+I+qxboqSDq11qlTdXn0CgYEAuzRNbD6FGEdtUdYd3LgG\nrMOchNPJtm87nflj/OIBQIfeXh38iCTcBRP6sqM2402AZi7PCyWz57vBQZ0ycd4C\n44+TTEzifvWOLx4LkYZCNpjPPR5Y9RVMRxmOhsG+6tx/Nx99vJfXoDDTtdwV/ZXH\n7bqo5pZhNjGqoYB80w3lhMU=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@edusa-a6efe.iam.gserviceaccount.com",
  client_id: "102643165468416058618",
  token_uri: "https://oauth2.googleapis.com/token"
};

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { token, title, body, data } = req.body;
  if (!token) return res.status(400).json({ error: 'No token' });
  try {
    const accessToken = await getAccessToken();
    const response = await fetch('https://fcm.googleapis.com/v1/projects/edusa-a6efe/messages:send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        message: { token, notification: { title, body }, data: data || {} }
      })
    });
    const result = await response.json();
    res.status(200).json(result);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
