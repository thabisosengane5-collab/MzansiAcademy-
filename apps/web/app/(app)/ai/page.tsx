'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AmahleePage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<{role:string;text:string}[]>([
    {role:'amahle', text:`Hey ${user?.firstName||'Learner'}! 👋 I'm Amahle, your AI tutor. I'm powered by Groq and will be fully wired up in Phase 5. For now, I'm here to say hello! Ask me anything about your CAPS subjects.`}
  ])
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    const q = input.trim()
    setInput('')
    setMessages(prev => [...prev,
      {role:'user', text: q},
      {role:'amahle', text:`Great question about "${q}"! Amahle AI (Groq) will be fully connected in Phase 5. The Cloudflare Worker proxy is being set up to keep your API key secure. 🧬`}
    ])
  }

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',flexDirection:'column'}}>
      <div style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'0.875rem 1.25rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
        <div style={{fontSize:'1.5rem'}}>🤖</div>
        <div>
          <div style={{fontWeight:800,color:'var(--txt)',fontSize:'0.92rem'}}>Amahle</div>
          <div style={{fontSize:'0.65rem',color:'var(--dna-green)'}}>● AI Tutor · CAPS Aligned</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'1rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        {messages.map((m,i) => {
          const mine = m.role === 'user'
          return (
            <div key={i} style={{display:'flex',alignItems:'flex-end',gap:'0.5rem',flexDirection:mine?'row-reverse':'row'}}>
              {!mine && <div style={{fontSize:'1.2rem',flexShrink:0}}>🤖</div>}
              <div style={{
                maxWidth:'80%',padding:'0.75rem 1rem',
                borderRadius:mine?'var(--radius-sm) 4px var(--radius-sm) var(--radius-sm)':'4px var(--radius-sm) var(--radius-sm) var(--radius-sm)',
                background:mine?'linear-gradient(135deg,var(--dna-green),var(--dna-teal))':'var(--bg-3)',
                color:mine?'#000':'var(--txt)',fontSize:'0.85rem',lineHeight:1.6
              }}>{m.text}</div>
            </div>
          )
        })}
      </div>

      <div style={{padding:'0.875rem 1rem',background:'var(--bg-2)',borderTop:'1px solid var(--border)',display:'flex',gap:'0.625rem',paddingBottom:'calc(0.875rem + var(--bottom-nav))'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} placeholder="Ask Amahle anything..." style={{flex:1,background:'var(--bg-3)',border:'1.5px solid var(--border-2)',borderRadius:'var(--radius-sm)',padding:'0.625rem 1rem',fontFamily:'var(--font)',fontSize:'0.88rem',color:'var(--txt)',outline:'none'}}/>
        <button onClick={handleSend} style={{background:'var(--dna-green)',color:'#000',border:'none',borderRadius:'var(--radius-sm)',width:'40px',height:'40px',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>→</button>
      </div>
    </div>
  )
}
