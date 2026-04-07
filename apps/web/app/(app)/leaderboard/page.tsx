'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'

interface LeaderEntry { uid: string; displayName: string; avatar: string; pts: number; grade: string; province: string }

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [data, setData]         = useState<LeaderEntry[]>([])
  const [loading, setLoading]   = useState(true)
  const [gradeFilter, setGrade] = useState('')
  const [provFilter, setProv]   = useState('')

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, 'leaderboard'), orderBy('pts', 'desc'), limit(100)))
        setData(snap.docs.map(d => ({ uid: d.id, ...d.data() } as LeaderEntry)))
      } catch (e) { console.warn('leaderboard:', e) }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = data.filter(r =>
    (!gradeFilter || r.grade === gradeFilter) &&
    (!provFilter  || r.province === provFilter)
  )

  const myRank = filtered.findIndex(r => r.uid === user?.uid) + 1
  const medals = ['🥇','🥈','🥉']

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',padding:'1.25rem'}}>
      <div style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:900,color:'var(--txt)',marginBottom:'1rem'}}>Leaderboard 🏆</div>

      {/* Filters */}
      <div style={{display:'flex',gap:'0.625rem',marginBottom:'1.25rem'}}>
        <select value={gradeFilter} onChange={e=>setGrade(e.target.value)} style={{flex:1,padding:'0.55rem 0.75rem',background:'var(--bg-2)',border:'1px solid var(--border-2)',borderRadius:'8px',color:'var(--txt)',fontFamily:'var(--font)',fontSize:'0.78rem',outline:'none'}}>
          <option value=''>All Grades</option>
          {['8','9','10','11','12'].map(g=><option key={g} value={g}>Grade {g}</option>)}
        </select>
        <select value={provFilter} onChange={e=>setProv(e.target.value)} style={{flex:1,padding:'0.55rem 0.75rem',background:'var(--bg-2)',border:'1px solid var(--border-2)',borderRadius:'8px',color:'var(--txt)',fontFamily:'var(--font)',fontSize:'0.78rem',outline:'none'}}>
          <option value=''>All Provinces</option>
          {['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape'].map(p=><option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* My rank */}
      {user && myRank > 0 && (
        <div style={{background:'rgba(0,214,143,0.08)',border:'1px solid rgba(0,214,143,0.25)',borderRadius:'var(--radius)',padding:'0.875rem 1rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{fontFamily:'var(--mono)',fontWeight:800,color:'var(--dna-green)',fontSize:'1.1rem'}}>#{myRank}</div>
          <div style={{flex:1,fontSize:'0.82rem',fontWeight:700,color:'var(--txt)'}}>Your rank</div>
          <div style={{fontFamily:'var(--mono)',fontWeight:800,color:'var(--dna-gold)'}}>{user.pts?.toLocaleString()} pts</div>
        </div>
      )}

      {loading ? (
        <div style={{textAlign:'center',padding:'2rem',color:'var(--txt-3)'}}>Loading...</div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          {filtered.slice(0,50).map((r,i) => {
            const isMe = r.uid === user?.uid
            return (
              <div key={r.uid} style={{
                background: isMe ? 'rgba(0,214,143,0.06)' : 'var(--bg-2)',
                border: `1px solid ${isMe ? 'rgba(0,214,143,0.25)' : 'var(--border)'}`,
                borderRadius:'var(--radius-sm)',padding:'0.75rem 1rem',
                display:'flex',alignItems:'center',gap:'0.75rem',
              }}>
                <div style={{fontFamily:'var(--mono)',fontSize:i<3?'1.2rem':'0.82rem',fontWeight:800,color:'var(--txt-3)',width:'28px',textAlign:'center',flexShrink:0}}>
                  {i < 3 ? medals[i] : `#${i+1}`}
                </div>
                <div style={{fontSize:'1.3rem'}}>{r.avatar || '🧬'}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:'0.82rem',color:isMe?'var(--dna-green)':'var(--txt)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.displayName || 'Learner'}{isMe?' (You)':''}</div>
                  <div style={{fontSize:'0.63rem',color:'var(--txt-3)'}}>{r.grade?`Gr ${r.grade}`:''}{r.grade&&r.province?' · ':''}{r.province||''}</div>
                </div>
                <div style={{fontFamily:'var(--mono)',fontWeight:800,color:'var(--dna-gold)',fontSize:'0.82rem',flexShrink:0}}>{(r.pts||0).toLocaleString()}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
