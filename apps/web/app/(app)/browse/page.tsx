'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadSubjects, loadSubjectMeta } from '@/lib/content/loader'
import type { Subject, SubjectMeta } from '@/lib/content/types'

const GROUPS = [
  {label:'STEM',ids:['math','math_lit','science','lifesci','technology','cat','webprog'],color:'#3B9EFF'},
  {label:'Humanities',ids:['history','geography','lifeori'],color:'#FFB800'},
  {label:'Business & Finance',ids:['accounting','business','economics','consumer'],color:'#FF6B35'},
  {label:'Languages',ids:['english_hl','afrikaans','isizulu'],color:'#7C5CFC'},
  {label:'Arts & Technical',ids:['arts','music','adv_mech','nautical'],color:'#A855F7'},
]

export default function BrowsePage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [meta, setMeta]         = useState<Record<string, SubjectMeta>>({})
  const [search, setSearch]     = useState('')

  useEffect(() => {
    loadSubjects().then(setSubjects)
    loadSubjectMeta().then(setMeta)
  }, [])

  const filtered = search ? subjects.filter(s => s.label.toLowerCase().includes(search.toLowerCase())) : subjects

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',padding:'1.25rem'}}>
      <div style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:900,color:'var(--txt)',marginBottom:'1rem'}}>All Subjects 📚</div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search subjects..." style={{width:'100%',padding:'0.7rem 1rem',background:'var(--bg-2)',border:'1.5px solid var(--border-2)',borderRadius:'var(--radius-sm)',color:'var(--txt)',fontFamily:'var(--font)',fontSize:'0.85rem',outline:'none',marginBottom:'1.5rem',display:'block'}}/>
      {search ? (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
          {filtered.map(s=><Card key={s.id} s={s} meta={meta[s.id]} onClick={()=>router.push(`/course/${s.id}`)}/>)}
        </div>
      ) : GROUPS.map(g=>{
        const items=subjects.filter(s=>g.ids.includes(s.id))
        if(!items.length) return null
        return (
          <div key={g.label} style={{marginBottom:'1.75rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.875rem'}}>
              <div style={{width:'10px',height:'10px',borderRadius:'50%',background:g.color}}/>
              <div style={{fontWeight:800,fontSize:'0.82rem',color:'var(--txt)'}}>{g.label}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
              {items.map(s=><Card key={s.id} s={s} meta={meta[s.id]} onClick={()=>router.push(`/course/${s.id}`)}/>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Card({s,meta,onClick}:{s:Subject;meta?:SubjectMeta;onClick:()=>void}) {
  return (
    <button onClick={onClick} style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1rem',textAlign:'left',cursor:'pointer',borderTop:`3px solid ${s.color}`,width:'100%'}}>
      <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{s.icon}</div>
      <div style={{fontWeight:800,fontSize:'0.78rem',color:'var(--txt)',lineHeight:1.3}}>{s.label}</div>
      {meta&&<div style={{fontSize:'0.62rem',color:'var(--txt-3)',marginTop:'3px'}}>{meta.grades.map(g=>`Gr ${g}`).join(' · ')}</div>}
    </button>
  )
}
