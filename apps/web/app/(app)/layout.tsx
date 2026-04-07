'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import BottomNav from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!loading && !user) router.replace('/login')
    if (!loading && user?.isNew) router.replace('/onboarding')
  }, [user, loading, router])
  if (loading) return (
    <div style={{minHeight:'100dvh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-root)',flexDirection:'column',gap:'0.75rem'}}>
      <div style={{fontSize:'2.5rem'}}>🧬</div>
      <div style={{fontSize:'0.8rem',color:'var(--txt-3)'}}>Loading MzansiAcademy...</div>
    </div>
  )
  if (!user) return null
  return (
    <div style={{paddingBottom:'var(--bottom-nav)'}}>
      {children}
      <BottomNav />
      <div id="recaptcha-container" />
    </div>
  )
}
