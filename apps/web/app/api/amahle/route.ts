import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { messages, subject, grade, topic, firstName } = await req.json()

    const systemPrompt = `You are Amahle, a friendly and encouraging AI tutor for MzansiAcademy — a free learning platform for South African Grade 8–12 learners.

You specialize in CAPS (Curriculum Assessment Policy Statements) aligned content.
${subject ? `Current subject: ${subject}` : ''}${grade ? ` | Grade: ${grade}` : ''}${topic ? ` | Topic: ${topic}` : ''}
${firstName ? `Learner's name: ${firstName}` : ''}

Your rules:
- Speak warmly and use South African context in examples (rands, provinces, local places, Eskom, Gautrain, JSE)
- Keep explanations concise and structured with clear steps
- Encourage learners — celebrate effort, not just correct answers
- For maths and science: always show step-by-step working
- Reference real NSC exam technique where relevant
- Never do homework for learners — guide them to the answer
- Use simple language appropriate for high school learners
- Occasionally use SA slang warmly: "sharp sharp", "lekker", "eish"
- Keep responses focused and under 200 words unless asked to explain in detail`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq error:', err)
      return NextResponse.json({ error: 'Groq API error' }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (e) {
    console.error('Amahle route error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
