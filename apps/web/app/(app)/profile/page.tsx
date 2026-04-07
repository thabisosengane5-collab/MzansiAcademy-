'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.replace('/login')
  }

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',padding:'1.25rem'}}>
      <div style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:900,color:'var(--txt)',marginBottom:'1.5rem'}}>Profile 👤</div>

      <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.5rem',textAlign:'center',marginBottom:'1rem'}}>
        <div style={{fontSize:'3rem',marginBottom:'0.75rem'}}>{user?.avatar||'🧬'}</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'1.2rem',fontWeight:900,color:'var(--txt)',marginBottom:'0.25rem'}}>{user?.displayName||'Learner'}</div>
        <div style={{fontSize:'0.75rem',color:'var(--txt-3)',marginBottom:'0.75rem'}}>@{user?.username||'—'} · Grade {user?.grade||'—'}</div>
        <div style={{display:'flex',justifyContent:'center',gap:'1rem'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'var(--mono)',fontWeight:800,color:'var(--dna-gold)',fontSize:'1.1rem'}}>{(user?.pts||0).toLocaleString()}</div>
            <div style={{fontSize:'0.62rem',color:'var(--txt-3)'}}>Points</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'var(--mono)',fontWeight:800,color:'var(--dna-green)',fontSize:'1.1rem'}}>{user?.streak||0}</div>
            <div style={{fontSize:'0.62rem',color:'var(--txt-3)'}}>Streak</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'var(--mono)',fontWeight:800,color:'var(--dna-teal)',fontSize:'1.1rem'}}>{user?.totalQuizzes||0}</div>
            <div style={{fontSize:'0.62rem',color:'var(--txt-3)'}}>Quizzes</div>
          </div>
        </div>
      </div>

      <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',marginBottom:'1rem'}}>
        {[
          {label:'Province', value: user?.province||'—'},
          {label:'School', value: user?.school||'—'},
          {label:'Email', value: user?.email||'—'},
          {label:'Auth', value: user?.authProvider||'—'},
        ].map((item,i) => (
          <div key={i} style={{padding:'0.875rem 1.25rem',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:'0.78rem',color:'var(--txt-3)'}}>{item.label}</div>
            <div style={{fontSize:'0.78rem',fontWeight:600,color:'var(--txt)'}}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',overflow:'hidden',marginBottom:'1.5rem'}}>
        <div style={{padding:'0.875rem 1.25rem',borderBottom:'1px solid var(--border)'}}>
          <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--txt)',marginBottom:'0.5rem'}}>My Subjects</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.375rem'}}>
            {(user?.subjects||[]).map((s:string) => (
              <span key={s} style={{background:'var(--bg-3)',border:'1px solid var(--border)',borderRadius:'20px',padding:'2px 10px',fontSize:'0.65rem',color:'var(--txt-3)'}}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSignOut} style={{width:'100%',padding:'0.875rem',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'var(--radius)',color:'var(--dna-red)',fontWeight:800,fontSize:'0.88rem',cursor:'pointer',fontFamily:'var(--font)'}}>
        🚪 Sign Out
      </button>
    </div>
  )
}
