'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { loadSubjects } from '@/lib/content/loader'
import type { Subject } from '@/lib/content/types'

export default function QuizLandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [enrolled, setEnrolled] = useState<Subject[]>([])

  useEffect(() => {
    loadSubjects().then(all => {
      setSubjects(all)
      setEnrolled(all.filter(s => user?.subjects?.includes(s.id)))
    })
  }, [user])

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',padding:'1.25rem'}}>
      <div style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:900,color:'var(--txt)',marginBottom:'0.375rem'}}>Quiz ⚡</div>
      <div style={{fontSize:'0.78rem',color:'var(--txt-3)',marginBottom:'1.5rem'}}>Test your knowledge — earn points</div>

      {/* My subjects */}
      {enrolled.length > 0 && (
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{fontWeight:800,fontSize:'0.82rem',color:'var(--txt)',marginBottom:'0.875rem'}}>My Subjects</div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
            {enrolled.map(s => (
              <button key={s.id} onClick={() => router.push(`/quiz/${s.id}`)} style={{
                background:'var(--bg-2)',border:'1px solid var(--border)',
                borderRadius:'var(--radius)',padding:'1rem 1.25rem',
                display:'flex',alignItems:'center',gap:'0.875rem',
                cursor:'pointer',textAlign:'left',
                borderLeft:`4px solid ${s.color}`,
              }}>
                <div style={{fontSize:'1.5rem'}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:'0.88rem',color:'var(--txt)'}}>{s.label}</div>
                  <div style={{fontSize:'0.68rem',color:'var(--txt-3)',marginTop:'2px'}}>10 questions · Earn up to 50 pts</div>
                </div>
                <div style={{background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',borderRadius:'8px',padding:'0.35rem 0.75rem',fontSize:'0.72rem',fontWeight:800,color:'#000'}}>Start</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All subjects */}
      <div>
        <div style={{fontWeight:800,fontSize:'0.82rem',color:'var(--txt)',marginBottom:'0.875rem'}}>All Subjects</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.625rem'}}>
          {subjects.map(s => (
            <button key={s.id} onClick={() => router.push(`/quiz/${s.id}`)} style={{
              background:'var(--bg-2)',border:'1px solid var(--border)',
              borderRadius:'var(--radius)',padding:'0.875rem',
              textAlign:'left',cursor:'pointer',
              borderTop:`3px solid ${s.color}`,
            }}>
              <div style={{fontSize:'1.3rem',marginBottom:'0.375rem'}}>{s.icon}</div>
              <div style={{fontWeight:800,fontSize:'0.75rem',color:'var(--txt)',lineHeight:1.3}}>{s.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
