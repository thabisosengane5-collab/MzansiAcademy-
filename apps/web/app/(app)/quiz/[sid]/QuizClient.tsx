'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { addPoints } from '@/lib/firestore/points'
interface Q{q:string;opts:string[];a:number;em:string;et:string}
export default function QuizGame({sid,questions:raw,label}:{sid:string;questions:Q[];label:string}){
  const {user}=useAuth();const router=useRouter()
  const [qs]=useState<Q[]>(()=>[...raw].sort(()=>Math.random()-0.5).slice(0,10))
  const [phase,setPhase]=useState<'q'|'fb'|'done'>('q')
  const [cur,setCur]=useState(0)
  const [sel,setSel]=useState<number|null>(null)
  const [score,setScore]=useState(0)
  const [wrong,setWrong]=useState<Q[]>([])
  if(!qs.length) return(
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🚧</div>
      <div style={{fontWeight:800,color:'var(--txt)',marginBottom:'0.5rem'}}>Quiz coming soon</div>
      <div style={{fontSize:'0.8rem',color:'var(--txt-3)',marginBottom:'1.5rem'}}>Questions for {label} are being generated</div>
      <button onClick={()=>router.back()} style={{background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',padding:'0.625rem 1.25rem',color:'#000',fontWeight:800,cursor:'pointer',fontFamily:'var(--font)'}}>Go Back</button>
    </div>
  )
  async function next(){
    const ok=sel===qs[cur].a
    const ns=ok?score+1:score
    const nw=ok?wrong:[...wrong,qs[cur]]
    setScore(ns);setWrong(nw)
    if(cur+1>=qs.length){
      setPhase('done')
      if(user?.uid){const pct=Math.round((ns/qs.length)*100);const pts=pct===100?50:pct>=70?25:pct>=50?10:5;await addPoints(user.uid,pts,`Quiz: ${label}`)}
    } else {setCur(c=>c+1);setSel(null);setPhase('q')}
  }
  if(phase==='done'){
    const pct=Math.round((score/qs.length)*100)
    const pts=pct===100?50:pct>=70?25:pct>=50?10:5
    return(
      <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem',textAlign:'center'}}>
        <div style={{fontSize:'4rem',marginBottom:'1rem'}}>{pct===100?'🏆':pct>=70?'🎉':pct>=50?'👍':'💪'}</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'1.5rem',fontWeight:900,color:'var(--txt)',marginBottom:'0.25rem'}}>{pct===100?'Perfect!':pct>=70?'Great work!':'Keep going!'}</div>
        <div style={{fontSize:'0.82rem',color:'var(--txt-3)',marginBottom:'1.25rem'}}>{label}</div>
        <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.25rem',width:'100%',maxWidth:'320px',marginBottom:'1.25rem'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'2.5rem',fontWeight:900,color:'var(--dna-green)'}}>{score}/{qs.length}</div>
          <div style={{fontSize:'0.72rem',color:'var(--txt-3)',margin:'0.25rem 0 0.75rem'}}>{pct}%</div>
          <div style={{display:'inline-flex',background:'rgba(0,214,143,0.1)',border:'1px solid rgba(0,214,143,0.3)',borderRadius:'20px',padding:'0.3rem 0.75rem',fontSize:'0.72rem',fontWeight:700,color:'var(--dna-green)'}}>+{pts} pts</div>
        </div>
        {wrong.map((q,i)=>(
          <div key={i} style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'10px',padding:'0.75rem',marginBottom:'0.5rem',textAlign:'left',width:'100%',maxWidth:'320px'}}>
            <div style={{fontSize:'0.72rem',fontWeight:700,color:'var(--dna-red)',marginBottom:'0.25rem'}}>✗ {q.q}</div>
            <div style={{fontSize:'0.7rem',color:'var(--dna-green)'}}>✓ {q.opts[q.a]}</div>
          </div>
        ))}
        <div style={{display:'flex',gap:'0.625rem',width:'100%',maxWidth:'320px',marginTop:'1rem'}}>
          <button onClick={()=>{setCur(0);setScore(0);setSel(null);setWrong([]);setPhase('q')}} style={{flex:1,padding:'0.75rem',background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'10px',color:'var(--txt)',fontWeight:700,fontSize:'0.8rem',cursor:'pointer',fontFamily:'var(--font)'}}>🔄 Retry</button>
          <button onClick={()=>router.push('/home')} style={{flex:1,padding:'0.75rem',background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',color:'#000',fontWeight:800,fontSize:'0.8rem',cursor:'pointer',fontFamily:'var(--font)'}}>🏠 Home</button>
        </div>
      </div>
    )
  }
  const q=qs[cur]
  return(
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',flexDirection:'column'}}>
      <div style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'0.875rem 1.25rem'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.5rem'}}>
          <button onClick={()=>router.back()} style={{background:'none',border:'none',color:'var(--txt-3)',cursor:'pointer',fontFamily:'var(--font)',fontSize:'0.8rem',padding:0}}>✕</button>
          <div style={{fontSize:'0.72rem',fontWeight:700,color:'var(--txt-3)'}}>{cur+1}/{qs.length}</div>
          <div style={{fontSize:'0.72rem',fontWeight:700,color:'var(--dna-green)'}}>⚡{score}</div>
        </div>
        <div style={{height:'4px',background:'var(--bg-4)',borderRadius:'2px',overflow:'hidden'}}>
          <div style={{height:'100%',background:'linear-gradient(90deg,var(--dna-green),var(--dna-teal))',width:`${(cur/qs.length)*100}%`,transition:'width 0.3s'}}/>
        </div>
      </div>
      <div style={{flex:1,padding:'1.5rem',display:'flex',flexDirection:'column'}}>
        <div style={{fontSize:'2rem',marginBottom:'0.75rem',textAlign:'center'}}>{q.em}</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'1.1rem',fontWeight:700,color:'var(--txt)',marginBottom:'1.25rem',textAlign:'center',lineHeight:1.4}}>{q.q}</div>
        <div style={{display:'flex',flexDirection:'column',gap:'0.625rem',flex:1}}>
          {q.opts.map((opt,i)=>{
            let bg='var(--bg-2)',br='var(--border)',col='var(--txt)'
            if(phase==='fb'){if(i===q.a){bg='rgba(0,214,143,0.12)';br='rgba(0,214,143,0.5)';col='var(--dna-green)'}else if(i===sel){bg='rgba(239,68,68,0.12)';br='rgba(239,68,68,0.5)';col='var(--dna-red)'}}
            return(<button key={i} onClick={()=>{if(sel===null){setSel(i);setPhase('fb')}}} style={{padding:'0.875rem 1rem',borderRadius:'var(--radius-sm)',background:bg,border:`1.5px solid ${br}`,color:col,fontFamily:'var(--font)',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',textAlign:'left'}}><span style={{fontFamily:'var(--mono)',fontSize:'0.72rem',color:'var(--txt-4)',marginRight:'0.5rem'}}>{String.fromCharCode(65+i)}.</span>{opt}</button>)
          })}
        </div>
        {phase==='fb'&&(
          <div style={{marginTop:'1rem'}}>
            <div style={{background:sel===q.a?'rgba(0,214,143,0.08)':'rgba(239,68,68,0.08)',border:`1px solid ${sel===q.a?'rgba(0,214,143,0.25)':'rgba(239,68,68,0.25)'}`,borderRadius:'var(--radius-sm)',padding:'0.875rem',marginBottom:'0.75rem'}}>
              <div style={{fontWeight:800,fontSize:'0.8rem',color:sel===q.a?'var(--dna-green)':'var(--dna-red)',marginBottom:'0.375rem'}}>{sel===q.a?'✅ Correct!':'❌ Not quite'}</div>
              <div style={{fontSize:'0.78rem',color:'var(--txt-2)',lineHeight:1.5}}>{q.et}</div>
            </div>
            <button onClick={next} style={{width:'100%',padding:'0.875rem',background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',color:'#000',fontWeight:800,fontSize:'0.88rem',cursor:'pointer',fontFamily:'var(--font)'}}>
              {cur+1>=qs.length?'See Results 🏆':'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
