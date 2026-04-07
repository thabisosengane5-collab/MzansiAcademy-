'use client'
import { useRouter } from 'next/navigation'

export default function RoomsPage() {
  const router = useRouter()
  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',padding:'1.25rem'}}>
      <div style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:900,color:'var(--txt)',marginBottom:'0.375rem'}}>Study Groups 📚</div>
      <div style={{fontSize:'0.78rem',color:'var(--txt-3)',marginBottom:'1.5rem'}}>Learn together, grow together</div>
      <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'2rem',textAlign:'center'}}>
        <div style={{fontSize:'2.5rem',marginBottom:'0.875rem'}}>🚧</div>
        <div style={{fontWeight:800,color:'var(--txt)',marginBottom:'0.375rem'}}>Coming in Phase 5</div>
        <div style={{fontSize:'0.78rem',color:'var(--txt-3)',marginBottom:'1.25rem'}}>Study groups with persistent chat, moderation, and debates</div>
        <button onClick={() => router.push('/friends')} style={{background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',padding:'0.625rem 1.25rem',color:'#000',fontWeight:800,fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font)'}}>Go to Friends →</button>
      </div>
    </div>
  )
}
