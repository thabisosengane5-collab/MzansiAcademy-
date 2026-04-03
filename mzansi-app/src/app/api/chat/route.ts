import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GROQ_API_KEY || "NOT_SET";
  return NextResponse.json({ keyPrefix: key.substring(0, 8) + "...", keyLength: key.length });
}

export async function POST(req: NextRequest) {
  const { message, subject, grade } = await req.json();

  const systemPrompt = `You are Amahle, a friendly and encouraging AI learning assistant for MzansiAcademy, a free educational platform for South African learners. You help Grade ${grade || "8-12"} learners with ${subject || "their subjects"}, aligned to the CAPS curriculum. Always be encouraging, use simple language, give step-by-step explanations, and use South African examples where relevant.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
