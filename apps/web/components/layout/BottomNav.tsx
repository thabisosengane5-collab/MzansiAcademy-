'use client'
import { usePathname, useRouter } from 'next/navigation'
const NAV = [{href:'/home',icon:'🏠',label:'Home'},{href:'/browse',icon:'📚',label:'Browse'},{href:'/quiz',icon:'⚡',label:'Quiz'},{href:'/friends',icon:'👥',label:'Friends'},{href:'/profile',icon:'👤',label:'Profile'}]
export default function BottomNav() {
  const pathname = usePathname(); const router = useRouter()
  return (
    <nav style={{position:'fixed',bottom:0,left:0,right:0,height:'var(--bottom-nav)',background:'var(--bg-1)',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',paddingBottom:'env(safe-area-inset-bottom)',zIndex:100}}>
      {NAV.map(item => { const active = pathname.startsWith(item.href); return (
        <button key={item.href} onClick={() => router.push(item.href)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'3px',background:'none',border:'none',cursor:'pointer',padding:'0.5rem 0',color:active?'var(--dna-green)':'var(--txt-3)',transition:'color 0.15s'}}>
          <span style={{fontSize:'1.25rem'}}>{item.icon}</span>
          <span style={{fontSize:'0.6rem',fontWeight:700,fontFamily:'var(--font)',letterSpacing:'0.03em'}}>{item.label}</span>
        </button>
      )})}
    </nav>
  )
}
