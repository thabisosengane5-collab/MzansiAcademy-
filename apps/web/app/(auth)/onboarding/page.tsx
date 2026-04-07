'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'

const GRADES = ['8','9','10','11','12']
const PROVINCES = ['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape']
const AVATARS = ['🧬','🦁','🐘','🦅','🌍','⚡','🔥','🧠','🎯','🚀','💎','🌊']
const SUBJECTS_LIST = [
  {id:'math',label:'Mathematics',icon:'➗'},
  {id:'math_lit',label:'Math Literacy',icon:'📊'},
  {id:'science',label:'Physical Sciences',icon:'⚗️'},
  {id:'lifesci',label:'Life Sciences',icon:'🧬'},
  {id:'history',label:'History',icon:'📜'},
  {id:'geography',label:'Geography',icon:'🌍'},
  {id:'accounting',label:'Accounting',icon:'💰'},
  {id:'business',label:'Business Studies',icon:'💼'},
  {id:'economics',label:'Economics',icon:'📈'},
  {id:'english_hl',label:'English HL',icon:'📖'},
  {id:'lifeori',label:'Life Orientation',icon:'🌱'},
  {id:'cat',label:'CAT',icon:'💻'},
  {id:'webprog',label:'Web Programming',icon:'🌐'},
]

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep]         = useState(0)
  const [firstName, setFirst]   = useState('')
  const [lastName, setLast]     = useState('')
  const [username, setUsername] = useState('')
  const [grade, setGrade]       = useState('')
  const [province, setProv]     = useState('')
  const [avatar, setAvatar]     = useState('🧬')
  const [subjects, setSubjects] = useState<string[]>([])
  const [saving, setSaving]     = useState(false)

  function toggleSubject(id: string) {
    setSubjects(prev => prev.includes(id) ? prev.filter(s=>s!==id) : [...prev, id])
  }

  async function finish() {
    if (!user?.uid) return
    setSaving(true)
    try {
      const displayName = `${firstName} ${lastName}`.trim()
      await setDoc(doc(db, 'users', user.uid), {
        firstName, lastName, displayName,
        username: username.toLowerCase(),
        usernameSearch: username.toLowerCase(),
        grade, province, avatar, subjects,
        pts: 0, streak: 0, battleWins: 0, totalQuizzes: 0,
        authProvider: user.authProvider || 'email',
        email: user.email || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        online: true,
      }, { merge: true })

      await setDoc(doc(db, 'leaderboard', user.uid), {
        displayName, avatar, pts: 0, grade, province,
        updatedAt: serverTimestamp(),
      }, { merge: true })

      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        uid: user.uid, createdAt: serverTimestamp()
      })

      router.replace('/home')
    } catch (e) {
      console.warn('onboarding:', e)
    }
    setSaving(false)
  }

  const steps = [
    // Step 0: Name
    <div key={0}>
      <div style={{fontSize:'2rem',marginBottom:'0.875rem',textAlign:'center'}}>👋</div>
      <h2 style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:900,color:'var(--txt)',textAlign:'center',marginBottom:'0.375rem'}}>Welcome to MzansiAcademy!</h2>
      <p style={{fontSize:'0.78rem',color:'var(--txt-3)',textAlign:'center',marginBottom:'1.5rem'}}>Let's set up your profile</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.625rem',marginBottom:'0.75rem'}}>
        <div>
          <label style={labelStyle}>First Name *</label>
          <input value={firstName} onChange={e=>setFirst(e.target.value)} placeholder="Sipho" style={inputStyle}/>
        </div>
        <div>
          <label style={labelStyle}>Last Name *</label>
          <input value={lastName} onChange={e=>setLast(e.target.value)} placeholder="Ndlovu" style={inputStyle}/>
        </div>
      </div>
      <label style={labelStyle}>Username *</label>
      <input value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))} placeholder="sipho_ndlovu" style={inputStyle}/>
      <div style={{fontSize:'0.65rem',color:'var(--txt-3)',marginTop:'0.25rem'}}>Shown on leaderboard. Letters, numbers and _ only.</div>
      <button onClick={() => firstName && lastName && username.length >= 3 && setStep(1)} disabled={!firstName||!lastName||username.length<3} style={{...nextBtnStyle,marginTop:'1.25rem'}}>Next →</button>
    </div>,

    // Step 1: Grade + Province
    <div key={1}>
      <div style={{fontSize:'2rem',marginBottom:'0.875rem',textAlign:'center'}}>🎓</div>
      <h2 style={{fontFamily:'var(--serif)',fontSize:'1.2rem',fontWeight:900,color:'var(--txt)',textAlign:'center',marginBottom:'1.5rem'}}>Your Grade & Province</h2>
      <label style={labelStyle}>Grade</label>
      <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        {GRADES.map(g=>(
          <button key={g} onClick={()=>setGrade(g)} style={{padding:'0.5rem 1rem',borderRadius:'20px',border:'1.5px solid',borderColor:grade===g?'var(--dna-green)':'var(--border-2)',background:grade===g?'rgba(0,214,143,0.1)':'transparent',color:grade===g?'var(--dna-green)':'var(--txt-2)',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font)'}}>
            Grade {g}
          </button>
        ))}
      </div>
      <label style={labelStyle}>Province</label>
      <select value={province} onChange={e=>setProv(e.target.value)} style={{...inputStyle,marginBottom:'1.25rem'}}>
        <option value=''>Select province</option>
        {PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}
      </select>
      <div style={{display:'flex',gap:'0.625rem'}}>
        <button onClick={()=>setStep(0)} style={backBtnStyle}>← Back</button>
        <button onClick={()=>grade&&province&&setStep(2)} disabled={!grade||!province} style={nextBtnStyle}>Next →</button>
      </div>
    </div>,

    // Step 2: Avatar
    <div key={2}>
      <div style={{fontSize:'2rem',marginBottom:'0.875rem',textAlign:'center'}}>✨</div>
      <h2 style={{fontFamily:'var(--serif)',fontSize:'1.2rem',fontWeight:900,color:'var(--txt)',textAlign:'center',marginBottom:'1.5rem'}}>Pick your avatar</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.625rem',marginBottom:'1.5rem'}}>
        {AVATARS.map(a=>(
          <button key={a} onClick={()=>setAvatar(a)} style={{padding:'0.875rem',background:avatar===a?'rgba(0,214,143,0.12)':'var(--bg-3)',border:`2px solid ${avatar===a?'var(--dna-green)':'var(--border)'}`,borderRadius:'var(--radius-sm)',fontSize:'1.75rem',cursor:'pointer',transition:'all 0.15s'}}>
            {a}
          </button>
        ))}
      </div>
      <div style={{display:'flex',gap:'0.625rem'}}>
        <button onClick={()=>setStep(1)} style={backBtnStyle}>← Back</button>
        <button onClick={()=>setStep(3)} style={nextBtnStyle}>Next →</button>
      </div>
    </div>,

    // Step 3: Subjects
    <div key={3}>
      <div style={{fontSize:'2rem',marginBottom:'0.875rem',textAlign:'center'}}>📚</div>
      <h2 style={{fontFamily:'var(--serif)',fontSize:'1.2rem',fontWeight:900,color:'var(--txt)',textAlign:'center',marginBottom:'0.375rem'}}>Pick your subjects</h2>
      <p style={{fontSize:'0.75rem',color:'var(--txt-3)',textAlign:'center',marginBottom:'1.25rem'}}>Select all that apply — you can change later</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginBottom:'1.5rem',maxHeight:'320px',overflowY:'auto'}}>
        {SUBJECTS_LIST.map(s=>{
          const active = subjects.includes(s.id)
          return (
            <button key={s.id} onClick={()=>toggleSubject(s.id)} style={{padding:'0.75rem',background:active?'rgba(0,214,143,0.1)':'var(--bg-3)',border:`1.5px solid ${active?'var(--dna-green)':'var(--border)'}`,borderRadius:'10px',display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer',textAlign:'left'}}>
              <span style={{fontSize:'1.1rem'}}>{s.icon}</span>
              <span style={{fontSize:'0.72rem',fontWeight:700,color:active?'var(--dna-green)':'var(--txt-2)',lineHeight:1.2}}>{s.label}</span>
            </button>
          )
        })}
      </div>
      <div style={{display:'flex',gap:'0.625rem'}}>
        <button onClick={()=>setStep(2)} style={backBtnStyle}>← Back</button>
        <button onClick={finish} disabled={saving||subjects.length===0} style={nextBtnStyle}>
          {saving ? '⏳ Saving...' : "Let's Go 🚀"}
        </button>
      </div>
    </div>,
  ]

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
      <div style={{width:'100%',maxWidth:'420px',background:'var(--bg-2)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)',padding:'1.5rem'}}>
        {/* Step indicator */}
        <div style={{display:'flex',gap:'0.375rem',marginBottom:'1.5rem'}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{flex:1,height:'3px',borderRadius:'2px',background:i<=step?'var(--dna-green)':'var(--bg-4)',transition:'background 0.3s'}}/>
          ))}
        </div>
        {steps[step]}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {display:'block',fontSize:'0.72rem',fontWeight:700,color:'var(--txt-2)',marginBottom:'0.35rem',textTransform:'uppercase',letterSpacing:'0.05em'}
const inputStyle: React.CSSProperties = {width:'100%',padding:'0.65rem 0.875rem',background:'var(--bg-3)',border:'1.5px solid var(--border-2)',borderRadius:'10px',color:'var(--txt)',fontFamily:'var(--font)',fontSize:'0.85rem',outline:'none',display:'block',marginBottom:'0.75rem'}
const nextBtnStyle: React.CSSProperties = {flex:2,padding:'0.75rem',background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',color:'#000',fontWeight:800,fontSize:'0.88rem',cursor:'pointer',fontFamily:'var(--font)'}
const backBtnStyle: React.CSSProperties = {flex:1,padding:'0.75rem',background:'var(--bg-3)',border:'1px solid var(--border-2)',borderRadius:'10px',color:'var(--txt-2)',fontWeight:700,fontSize:'0.85rem',cursor:'pointer',fontFamily:'var(--font)'}
