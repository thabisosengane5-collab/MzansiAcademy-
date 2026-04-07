'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

interface Message { role: 'user' | 'amahle'; text: string }

export default function AmahlePage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([{
    role: 'amahle',
    text: `Hey ${user?.firstName || 'Learner'}! 👋 I'm Amahle, your AI tutor. CAPS-aligned and always here. What are you studying today? 🧬`
  }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', text }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/amahle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role === 'amahle' ? 'assistant' : 'user', content: m.text })),
          firstName: user?.firstName || user?.displayName,
          grade: user?.grade,
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'amahle', text: data.reply || 'Eish, something went wrong!' }])
    } catch {
      setMessages(prev => [...prev, { role: 'amahle', text: 'No connection. Try again!' }])
    }
    setLoading(false)
  }

  const suggestions = ['Explain Newton\'s 3 laws','Help with quadratic equations','Accounting equation?','How to write a good essay?']

  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100dvh - 68px)',background:'var(--bg-root)'}}>
      {/* Header */}
      <div style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'0.875rem 1.25rem',display:'flex',alignItems:'center',gap:'0.75rem',flexShrink:0}}>
        <div style={{fontSize:'1.5rem'}}>🤖</div>
        <div>
          <div style={{fontWeight:800,color:'var(--txt)',fontSize:'0.92rem'}}>Amahle</div>
          <div style={{fontSize:'0.62rem',color:'var(--dna-green)'}}>● Powered by Groq · CAPS Aligned</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',padding:'1rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        {messages.map((m, i) => {
          const mine = m.role === 'user'
          return (
            <div key={i} style={{display:'flex',alignItems:'flex-end',gap:'0.5rem',flexDirection:mine?'row-reverse':'row'}}>
              {!mine && <div style={{fontSize:'1.2rem',flexShrink:0}}>🤖</div>}
              <div style={{maxWidth:'80%',padding:'0.75rem 1rem',lineHeight:1.6,borderRadius:mine?'var(--radius-sm) 4px var(--radius-sm) var(--radius-sm)':'4px var(--radius-sm) var(--radius-sm) var(--radius-sm)',background:mine?'linear-gradient(135deg,var(--dna-green),var(--dna-teal))':'var(--bg-3)',color:mine?'#000':'var(--txt)',fontSize:'0.85rem'}}>{m.text}</div>
            </div>
          )
        })}
        {loading && (
          <div style={{display:'flex',alignItems:'flex-end',gap:'0.5rem'}}>
            <div style={{fontSize:'1.2rem'}}>🤖</div>
            <div style={{background:'var(--bg-3)',borderRadius:'4px var(--radius-sm) var(--radius-sm) var(--radius-sm)',padding:'0.75rem 1rem',fontSize:'0.85rem',color:'var(--txt-3)'}}>Thinking... ✨</div>
          </div>
        )}
        {messages.length === 1 && !loading && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginTop:'0.5rem'}}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'10px',padding:'0.625rem',fontSize:'0.7rem',color:'var(--txt-2)',cursor:'pointer',fontFamily:'var(--font)',textAlign:'left',lineHeight:1.4}}>{s}</button>
            ))}
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{background:'var(--bg-2)',borderTop:'1px solid var(--border)',padding:'0.75rem 1rem',display:'flex',gap:'0.625rem',flexShrink:0}}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && !loading && handleSend()}
          placeholder="Ask Amahle anything..." disabled={loading}
          style={{flex:1,background:'var(--bg-3)',border:'1.5px solid var(--border-2)',borderRadius:'var(--radius-sm)',padding:'0.625rem 1rem',fontFamily:'var(--font)',fontSize:'0.88rem',color:'var(--txt)',outline:'none'}}
        />
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?'var(--bg-4)':'var(--dna-green)',color:'#000',border:'none',borderRadius:'var(--radius-sm)',width:'40px',height:'40px',cursor:'pointer',fontSize:'1.1rem',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>→</button>
      </div>
    </div>
  )
}
