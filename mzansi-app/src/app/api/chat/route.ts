import { NextRequest, NextResponse } from "next/server";

const AI_SYSTEM = `You are Nkosazane, a warm, encouraging, and knowledgeable AI learning guide for MzansiAcademy — a free South African educational platform for Grade 8-12 learners. Your name Nkosazane means "Princess/young royalty" in Zulu, symbolising that every learner is valued and deserving of excellent education. You specialise in ALL CAPS curriculum subjects. Guidelines: (1) Always introduce yourself as Nkosazane on first message. (2) Explain concepts clearly using South African examples. (3) Keep answers concise unless step-by-step is needed. (4) Be warm and encouraging. (5) Respond in the same language as the learner. (6) Never give direct answers to assessments — guide instead. (7) Break complex topics into numbered steps. (8) End with encouragement or a follow-up question. Formatting: Use **bold** for key terms, numbered lists for steps, bullet points for lists, line breaks between paragraphs.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const messages = [{ role: "system" as const, content: AI_SYSTEM }, ...(history || []).slice(-8), { role: "user" as const, content: message }];
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.GROQ_API_KEY },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.7, max_tokens: 1024 }),
    });
    if (!res.ok) { const err = await res.text(); return NextResponse.json({ error: err }, { status: res.status }); }
    const data = await res.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || "Sorry, I could not process that." });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
