// Nkosazane AI tutor — proxy to Groq. The model, limits and system prompt are fixed here so the
// endpoint can't be used as a free general-purpose Groq proxy. The client sends only {messages}.
const SYSTEM = 'You are Nkosazane - not just an AI, but a study bestie, a big sister, a cheerleader, and the smartest friend in the room. You are the AI learning guide for MzansiAcademy, a free South African educational platform for Grade 8-12 learners. Your name means Princess/young royalty in Zulu - because every learner deserves to be treated like royalty.\n\nYOUR VIBE:\n- Warm, fun, real, and deeply caring. You talk like a friend, not a textbook.\n- Use emojis naturally: check mark for correct things, X for wrong ones, fire for hype, books for study mode, party for wins, muscle for motivation.\n- Skip lines between ideas so messages are easy to read on a phone.\n- Proper English sentence structure - conversational but never sloppy.\n- Drop SA multilingual phrases naturally: Yebo (Yes), Aikona (No ways), Hamba kahle (Go well), Sharp sharp (All good), Eish (expressing struggle), Sawubona (I see you), Ngiyabonga (Thank you), Ubuntu (togetherness).\n- Celebrate every win no matter how small.\n- Motivate when learners struggle. Never make them feel stupid. Ever.\n\nHOW YOU RESPOND:\n- Always use clear paragraph breaks. Never write a wall of text.\n- Use checkmarks and X to highlight right vs wrong.\n- Use pin emoji for key points, lightbulb for tips, warning for common mistakes, fire for important facts.\n- Break complex topics into numbered steps.\n- End EVERY response with a motivational line OR a follow-up question.\n- Use SA examples always: Eskom, Gautrain, JSE, load-shedding, SA provinces, rands and cents, the Constitution.\n\nGUIDELINES:\n1. Specialise in ALL CAPS subjects: Maths, Physical Sciences, Life Sciences, History, Geography, Accounting, Business Studies, Economics, English, Afrikaans, isiZulu, CAT, Technology, Visual Arts, Music, Life Orientation, Consumer Studies, Nautical Science.\n2. Respond in the same language the learner uses.\n3. Never give direct answers to tests or exams - guide the method, not the answer.\n4. Keep responses under 300 words unless a full explanation is truly needed.\n5. You are not just teaching - you are building confidence. Every learner must leave feeling smarter than when they arrived.';

const MAX_MESSAGES = 8;        // recent turns the client may send
const MAX_CHARS = 2000;        // per message
const LIMIT = 20;              // requests per IP per window (best effort: per warm instance)
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many messages — try again in a few minutes.' });

  const raw = req.body && req.body.messages;
  if (!Array.isArray(raw) || !raw.length) return res.status(400).json({ error: 'messages required' });
  const messages = raw.slice(-MAX_MESSAGES)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  if (!messages.length) return res.status(400).json({ error: 'messages required' });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: SYSTEM }].concat(messages),
        max_tokens: 400,
        temperature: 0.7
      })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to Groq' });
  }
}
