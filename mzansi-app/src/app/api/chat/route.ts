import { NextRequest, NextResponse } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const AI_SYSTEM = "You are Nkosazane, a warm, encouraging AI learning guide for MzansiAcademy. You help Grade 8-12 SA learners with CAPS subjects. Use South African examples. Be encouraging. Use **bold** for key terms, numbered lists for steps. Never give direct test answers. Respond in the learner's language.";

export async function OPTIONS() {
  return new Response(null, { headers: CORS });
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const messages = [{ role: "system" as const, content: AI_SYSTEM }, ...(history || []).slice(-8), { role: "user" as const, content: message }];
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.GROQ_API_KEY },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.7, max_tokens: 1024 }),
    });
    if (!res.ok) { const err = await res.text(); return NextResponse.json({ error: err }, { status: res.status, headers: CORS }); }
    const data = await res.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || "Sorry, I could not process that." }, { headers: CORS });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500, headers: CORS });
  }
}
