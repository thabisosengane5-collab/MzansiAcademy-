'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { loadCourse } from '@/lib/content/loader'
import type { Course, Topic } from '@/lib/content/types'

export default function LessonPage() {
  const { sid, mi, ti } = useParams() as { sid:string; mi:string; ti:string }
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)

  useEffect(() => {
    loadCourse(sid).then(c => {
      if (!c) return
      setCourse(c)
      const mod = c.modules[Number(mi)]
      const t = mod?.topics[Number(ti)]
      if (t && typeof t !== 'string') setTopic(t)
    })
  }, [sid, mi, ti])

  if (!topic || !course) return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'0.75rem'}}>
      <div style={{fontSize:'2rem'}}>📖</div>
      <div style={{fontSize:'0.8rem',color:'var(--txt-3)'}}>Loading lesson...</div>
    </div>
  )

  const mod = course.modules[Number(mi)]
  const isLast = Number(ti) >= mod.topics.length - 1
  const isLastMod = Number(mi) >= course.modules.length - 1
  const cColors: Record<string,string> = {green:'rgba(0,214,143,0.08)',teal:'rgba(0,194,212,0.08)',gold:'rgba(255,184,0,0.08)',red:'rgba(239,68,68,0.08)'}
  const cBorders: Record<string,string> = {green:'rgba(0,214,143,0.25)',teal:'rgba(0,194,212,0.25)',gold:'rgba(255,184,0,0.25)',red:'rgba(239,68,68,0.25)'}

  function goNext() {
    if (!isLast) router.push(`/course/${sid}/${mi}/${Number(ti)+1}`)
    else if (!isLastMod) router.push(`/course/${sid}/${Number(mi)+1}/0`)
    else router.push(`/course/${sid}`)
  }

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)'}}>
      <div style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'0.875rem 1.25rem',display:'flex',alignItems:'center',gap:'0.75rem',position:'sticky',top:0,zIndex:10}}>
        <button onClick={() => router.push(`/course/${sid}`)} style={{background:'none',border:'none',color:'var(--txt-3)',cursor:'pointer',fontFamily:'var(--font)',fontSize:'0.8rem',padding:0}}>← {mod.title}</button>
        <div style={{marginLeft:'auto',fontSize:'0.65rem',color:'var(--txt-3)'}}>{Number(ti)+1} / {mod.topics.length}</div>
      </div>
      <div style={{padding:'1.25rem',maxWidth:'680px',margin:'0 auto'}}>
        <div style={{marginBottom:'1.5rem'}}>
          {topic.emoji && <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>{topic.emoji}</div>}
          <h1 style={{fontFamily:'var(--serif)',fontSize:'1.4rem',fontWeight:900,color:'var(--txt)',marginBottom:'0.375rem'}}>{topic.title}</h1>
          {topic.subtitle && <div style={{fontSize:'0.82rem',color:'var(--txt-3)'}}>{topic.subtitle}</div>}
        </div>
        {topic.intro && <div style={{fontSize:'0.88rem',lineHeight:1.75,color:'var(--txt-2)',marginBottom:'1.5rem'}} dangerouslySetInnerHTML={{__html:topic.intro}}/>}
        {topic.concepts?.map((c,i) => (
          <div key={i} style={{background:cColors[c.type]||cColors.green,border:`1px solid ${cBorders[c.type]||cBorders.green}`,borderRadius:'var(--radius)',padding:'1rem',marginBottom:'0.75rem'}}>
            <div style={{fontWeight:800,fontSize:'0.82rem',color:'var(--txt)',marginBottom:'0.5rem'}}>{c.title}</div>
            <div style={{fontSize:'0.82rem',lineHeight:1.7,color:'var(--txt-2)'}} dangerouslySetInnerHTML={{__html:c.body}}/>
          </div>
        ))}
        {topic.formula && <div style={{background:'var(--bg-3)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1rem',marginBottom:'1.25rem',fontFamily:'var(--mono)',fontSize:'0.82rem',color:'var(--dna-teal)',whiteSpace:'pre-line'}}>📐 {topic.formula}</div>}
        {topic.keyterms && topic.keyterms.length > 0 && (
          <div style={{marginBottom:'1.25rem'}}>
            <div style={{fontWeight:800,fontSize:'0.82rem',color:'var(--txt)',marginBottom:'0.75rem'}}>📖 Key Terms</div>
            {topic.keyterms.map((kt,i) => (
              <div key={i} style={{display:'flex',gap:'0.75rem',marginBottom:'0.5rem',padding:'0.625rem',background:'var(--bg-2)',borderRadius:'10px',border:'1px solid var(--border)'}}>
                <div style={{fontWeight:800,fontSize:'0.78rem',color:'var(--dna-green)',flexShrink:0,minWidth:'80px'}}>{kt.word}</div>
                <div style={{fontSize:'0.78rem',color:'var(--txt-2)',lineHeight:1.5}}>{kt.definition}</div>
              </div>
            ))}
          </div>
        )}
        {topic.callout && <div style={{background:'rgba(255,184,0,0.08)',border:'1px solid rgba(255,184,0,0.25)',borderRadius:'var(--radius)',padding:'1rem',marginBottom:'1.25rem'}}><div style={{fontWeight:800,fontSize:'0.82rem',color:'var(--dna-gold)',marginBottom:'0.5rem'}}>🇿🇦 {topic.callout.title}</div><div style={{fontSize:'0.82rem',lineHeight:1.7,color:'var(--txt-2)'}} dangerouslySetInnerHTML={{__html:topic.callout.body}}/></div>}
        {topic.activity && <div style={{background:'rgba(0,194,212,0.08)',border:'1px solid rgba(0,194,212,0.25)',borderRadius:'var(--radius)',padding:'1rem',marginBottom:'1.25rem'}}><div style={{fontWeight:800,fontSize:'0.82rem',color:'var(--dna-teal)',marginBottom:'0.5rem'}}>✏️ Activity</div><div style={{fontSize:'0.82rem',lineHeight:1.7,color:'var(--txt-2)'}}>{topic.activity}</div></div>}
        {topic.examTip && <div style={{background:'rgba(124,92,252,0.08)',border:'1px solid rgba(124,92,252,0.25)',borderRadius:'var(--radius)',padding:'1rem',marginBottom:'1.5rem'}}><div style={{fontWeight:800,fontSize:'0.82rem',color:'var(--dna-purple)',marginBottom:'0.5rem'}}>🎯 Exam Tip</div><div style={{fontSize:'0.82rem',lineHeight:1.7,color:'var(--txt-2)'}}>{topic.examTip}</div></div>}
        <div style={{display:'flex',gap:'0.75rem',marginTop:'1.5rem',paddingBottom:'1rem'}}>
          {(Number(ti) > 0 || Number(mi) > 0) && (
            <button onClick={() => { if (Number(ti)>0) router.push(`/course/${sid}/${mi}/${Number(ti)-1}`); else router.push(`/course/${sid}/${Number(mi)-1}/0`) }} style={{flex:1,padding:'0.75rem',background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'10px',color:'var(--txt-2)',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font)'}}>← Previous</button>
          )}
          <button onClick={goNext} style={{flex:2,padding:'0.75rem',background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',color:'#000',fontWeight:800,fontSize:'0.85rem',cursor:'pointer',fontFamily:'var(--font)'}}>
            {isLast && isLastMod ? '✅ Complete' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
