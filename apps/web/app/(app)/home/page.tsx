'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { loadSubjects, loadSubjectMeta } from '@/lib/content/loader'
import type { Subject, SubjectMeta } from '@/lib/content/types'

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [meta, setMeta] = useState<Record<string, SubjectMeta>>({})
  useEffect(() => {
    loadSubjects().then(setSubjects)
    loadSubjectMeta().then(setMeta)
  }, [])
  const enrolled = subjects.filter(s => user?.subjects?.includes(s.id))
  const firstName = user?.firstName || user?.displayName?.split(' ')[0] || 'Learner'
  const streak = user?.streak || 0
  const pts = user?.pts || 0
  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',paddingBottom:'1rem'}}>
      <div style={{padding:'1.25rem 1.25rem 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'var(--serif)',fontSize:'1.4rem',fontWeight:900,color:'var(--txt)'}}>Hey {firstName} 👋</div>
          <div style={{fontSize:'0.72rem',color:'var(--txt-3)',marginTop:'2px'}}>It's in our DNA 🧬</div>
        </div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          {streak > 0 && <div style={{background:'rgba(255,184,0,0.1)',border:'1px solid rgba(255,184,0,0.3)',borderRadius:'20px',padding:'0.35rem 0.75rem',fontSize:'0.72rem',fontWeight:700,color:'var(--dna-gold)'}}>🔥 {streak}d</div>}
          <div style={{background:'rgba(0,214,143,0.1)',border:'1px solid rgba(0,214,143,0.3)',borderRadius:'20px',padding:'0.35rem 0.75rem',fontSize:'0.72rem',fontWeight:700,color:'var(--dna-green)'}}>⚡ {pts.toLocaleString()} pts</div>
        </div>
      </div>
      <div style={{margin:'1.25rem 1.25rem 0'}}>
        <button onClick={() => router.push('/ai')} style={{width:'100%',background:'linear-gradient(135deg,rgba(0,214,143,0.1),rgba(0,194,212,0.1))',border:'1px solid var(--border-glow)',borderRadius:'var(--radius)',padding:'0.875rem 1.25rem',display:'flex',alignItems:'center',gap:'0.875rem',cursor:'pointer',textAlign:'left'}}>
          <div style={{fontSize:'1.75rem'}}>🤖</div>
          <div>
            <div style={{fontWeight:800,color:'var(--txt)',fontSize:'0.88rem'}}>Ask Amahle</div>
            <div style={{fontSize:'0.7rem',color:'var(--txt-3)',marginTop:'2px'}}>Your AI tutor — CAPS aligned, always available</div>
          </div>
          <div style={{marginLeft:'auto',color:'var(--dna-green)',fontSize:'1.1rem'}}>→</div>
        </button>
      </div>
      <div style={{margin:'1.5rem 1.25rem 0'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.875rem'}}>
          <div style={{fontWeight:800,fontSize:'0.88rem',color:'var(--txt)'}}>My Subjects</div>
          <button onClick={() => router.push('/browse')} style={{background:'none',border:'none',color:'var(--dna-green)',fontSize:'0.75rem',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}}>Browse All →</button>
        </div>
        {enrolled.length === 0 ? (
          <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.5rem',textAlign:'center'}}>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>📚</div>
            <div style={{fontWeight:700,color:'var(--txt)',marginBottom:'0.25rem',fontSize:'0.88rem'}}>No subjects yet</div>
            <div style={{fontSize:'0.75rem',color:'var(--txt-3)',marginBottom:'1rem'}}>Pick your subjects to start learning</div>
            <button onClick={() => router.push('/browse')} style={{background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',padding:'0.625rem 1.25rem',color:'#000',fontWeight:800,fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font)'}}>Browse Subjects</button>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
            {enrolled.map(s => (
              <button key={s.id} onClick={() => router.push(`/course/${s.id}`)} style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1rem',textAlign:'left',cursor:'pointer',borderTop:`3px solid ${s.color}`}}>
                <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{s.icon}</div>
                <div style={{fontWeight:800,fontSize:'0.78rem',color:'var(--txt)',lineHeight:1.3}}>{s.label}</div>
                <div style={{fontSize:'0.65rem',color:'var(--txt-3)',marginTop:'0.25rem'}}>{meta[s.id]?.grades?.map(g=>`Gr ${g}`).join(' · ')}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{margin:'1.5rem 1.25rem 0'}}>
        <div style={{fontWeight:800,fontSize:'0.88rem',color:'var(--txt)',marginBottom:'0.875rem'}}>Quick Actions</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
          {[
            {icon:'⚡',label:"Today's Quiz",sub:'Daily challenge',href:'/quiz'},
            {icon:'⚔️',label:'Battle',sub:'Challenge learners',href:'/quiz'},
            {icon:'🏆',label:'Leaderboard',sub:'See your rank',href:'/leaderboard'},
            {icon:'👥',label:'Study Groups',sub:'Learn together',href:'/rooms'},
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.href)} style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'0.875rem',textAlign:'left',cursor:'pointer'}}>
              <div style={{fontSize:'1.4rem',marginBottom:'0.375rem'}}>{item.icon}</div>
              <div style={{fontWeight:800,fontSize:'0.78rem',color:'var(--txt)'}}>{item.label}</div>
              <div style={{fontSize:'0.63rem',color:'var(--txt-3)',marginTop:'2px'}}>{item.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
