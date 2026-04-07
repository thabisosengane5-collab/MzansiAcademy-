'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { loadCourse } from '@/lib/content/loader'
import type { Course } from '@/lib/content/types'

export default function CoursePage() {
  const { sid } = useParams() as { sid: string }
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourse(sid).then(c => { setCourse(c); setLoading(false) })
  }, [sid])

  if (loading) return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'0.75rem'}}>
      <div style={{fontSize:'2rem'}}>📚</div>
      <div style={{fontSize:'0.8rem',color:'var(--txt-3)'}}>Loading course...</div>
    </div>
  )

  if (!course) return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1rem',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'2.5rem'}}>🚧</div>
      <div style={{fontWeight:800,color:'var(--txt)'}}>Content coming soon</div>
      <div style={{fontSize:'0.8rem',color:'var(--txt-3)'}}>This subject is being loaded by Opus 4. Check back soon!</div>
      <button onClick={() => router.back()} style={{background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',padding:'0.625rem 1.25rem',color:'#000',fontWeight:800,fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font)'}}>← Go Back</button>
    </div>
  )

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)'}}>
      <div style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'1.25rem'}}>
        <button onClick={() => router.back()} style={{background:'none',border:'none',color:'var(--txt-3)',fontSize:'0.8rem',cursor:'pointer',fontFamily:'var(--font)',padding:0,marginBottom:'0.875rem'}}>← Back</button>
        <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
          <div style={{fontSize:'2.5rem'}}>{course.icon}</div>
          <div>
            <div style={{fontFamily:'var(--serif)',fontSize:'1.2rem',fontWeight:900,color:'var(--txt)'}}>{course.title}</div>
            <div style={{fontSize:'0.72rem',color:'var(--txt-3)',marginTop:'2px'}}>{course.modules.length} modules · {course.modules.reduce((a,m)=>a+m.topics.length,0)} topics</div>
          </div>
        </div>
      </div>
      <div style={{padding:'1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        {course.modules.map((mod, mi) => (
          <div key={mod.id} style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden'}}>
            <div style={{padding:'1rem',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div style={{fontSize:'1.3rem'}}>{mod.icon}</div>
              <div>
                <div style={{fontWeight:800,fontSize:'0.88rem',color:'var(--txt)'}}>{mod.title}</div>
                <div style={{fontSize:'0.65rem',color:'var(--txt-3)',marginTop:'2px'}}>{mod.topics.length} topics</div>
              </div>
            </div>
            {mod.topics.map((topic, ti) => (
              <button key={ti} onClick={() => router.push(`/course/${sid}/${mi}/${ti}`)} style={{width:'100%',padding:'0.75rem 1rem',display:'flex',alignItems:'center',gap:'0.75rem',background:'none',border:'none',borderBottom:'1px solid var(--border)',cursor:'pointer',textAlign:'left'}}>
                <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'var(--bg-3)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,color:'var(--txt-3)',flexShrink:0}}>{mi+1}.{ti+1}</div>
                <div style={{flex:1,fontSize:'0.82rem',fontWeight:600,color:'var(--txt)'}}>{typeof topic === 'string' ? topic : topic.title}</div>
                <div style={{color:'var(--txt-4)',fontSize:'0.8rem'}}>→</div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
