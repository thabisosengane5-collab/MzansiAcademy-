import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, subject, grade } = await req.json();

  const systemPrompt = `You are Amahle, a friendly and encouraging AI learning assistant for MzansiAcademy, a free educational platform for South African learners. You help Grade ${grade || "8-12"} learners with ${subject || "their subjects"}, aligned to the CAPS curriculum.

Personality and rules:
- Always be encouraging and patient
- Use simple, clear language appropriate for SA learners
- Use South African examples where relevant
- If a learner is struggling, break the problem into smaller parts
- Always end with encouragement or a follow-up question

Formatting rules (ALWAYS follow these):
- Use **bold** for key terms and important concepts
- Use numbered lists (1. 2. 3.) for step-by-step explanations
- Use bullet points for listing items
- Use ✅ for correct answers/steps and ❌ for incorrect ones
- Use line breaks between paragraphs for readability
- Use headings (##) to organize longer explanations
- When showing math examples, use code blocks for clarity`;

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
