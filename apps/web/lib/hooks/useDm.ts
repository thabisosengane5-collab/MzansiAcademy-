'use client'
import { useState, useRef, useCallback } from 'react'
import { ref, onChildAdded, set, off } from 'firebase/database'
import { rtdb } from '../firebase/client'
import { getDmHistory, saveDmMessage } from '../supabase/messages'

export function getDmChatId(uid1: string, uid2: string) {
  return [uid1, uid2].sort().join('_')
}

export function useDm(myUid: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading]   = useState(false)
  const unsubRef = useRef<any>(null)

  const openDm = useCallback(async (friendUid: string) => {
    setLoading(true)
    const chatId = getDmChatId(myUid, friendUid)

    // 1. Load history from Supabase
    const history = await getDmHistory(chatId)
    setMessages(history)
    setLoading(false)

    // 2. Clean up previous listener
    if (unsubRef.current) {
      off(unsubRef.current)
      unsubRef.current = null
    }

    // 3. Listen for new messages via RTDB
    const msgRef = ref(rtdb, `dms/${chatId}/messages`)
    unsubRef.current = msgRef
    onChildAdded(msgRef, (snap) => {
      const m = snap.val()
      if (!m?.text) return
      setMessages(prev => {
        const exists = prev.some(p =>
          p.sender_uid === m.uid &&
          Math.abs(new Date(p.sent_at).getTime() - m.ts) < 3000
        )
        if (exists) return prev
        return [...prev, {
          sender_uid: m.uid, text: m.text,
          sent_at: new Date(m.ts).toISOString()
        }]
      })
    })
  }, [myUid])

  const sendDm = useCallback(async (friendUid: string, text: string) => {
    if (!text.trim()) return
    const chatId = getDmChatId(myUid, friendUid)
    const ts = Date.now()
    const key = `m${ts}_${Math.random().toString(36).slice(2, 6)}`

    // Optimistic UI
    setMessages(prev => [...prev, {
      sender_uid: myUid, text,
      sent_at: new Date(ts).toISOString()
    }])

    // Write to RTDB (real-time delivery)
    await set(ref(rtdb, `dms/${chatId}/messages/${key}`), {
      uid: myUid, text, ts
    })
    // Write to Supabase (persistence)
    await saveDmMessage(chatId, myUid, text)
  }, [myUid])

  const closeDm = useCallback(() => {
    if (unsubRef.current) {
      off(unsubRef.current)
      unsubRef.current = null
    }
    setMessages([])
  }, [])

  return { messages, loading, openDm, sendDm, closeDm }
}
