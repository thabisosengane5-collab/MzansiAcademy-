'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/client'
import { signOut } from '../firebase/auth'

export interface MzansiUser {
  uid: string; email: string; displayName: string; firstName?: string; lastName?: string
  username?: string; avatar?: string; grade?: string; province?: string; school?: string
  subjects?: string[]; pts?: number; streak?: number; battleWins?: number; totalQuizzes?: number
  isAdmin?: boolean; emailVerified?: boolean; authProvider?: string; isNew?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<MzansiUser | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid))
          if (snap.exists()) { setUser({ ...snap.data() as MzansiUser, uid: fbUser.uid, email: fbUser.email ?? '', emailVerified: fbUser.emailVerified }) }
          else { setUser({ uid: fbUser.uid, email: fbUser.email ?? '', displayName: fbUser.displayName ?? '', emailVerified: fbUser.emailVerified, isNew: true }) }
        } catch (e) { console.warn('useAuth:', e) }
      } else { setUser(null) }
      setLoading(false)
    })
    return () => unsub()
  }, [])
  return { user, loading, signOut }
}
