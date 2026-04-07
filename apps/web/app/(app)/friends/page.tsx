'use client'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useDm, getDmChatId } from '@/lib/hooks/useDm'
import {
  listenFriends, listenFriendRequests, sendFriendRequest,
  acceptFriendRequest, declineFriendRequest, removeFriend, searchByUsername
} from '@/lib/firestore/friends'
import { ref, onValue } from 'firebase/database'
import { rtdb } from '@/lib/firebase/client'

type Tab = 'friends' | 'requests' | 'find'

export default function FriendsPage() {
  const { user } = useAuth()
  const [tab, setTab]               = useState<Tab>('friends')
  const [friends, setFriends]       = useState<any[]>([])
  const [requests, setRequests]     = useState<any[]>([])
  const [searchQ, setSearchQ]       = useState('')
  const [searchResults, setResults] = useState<any[]>([])
  const [searching, setSearching]   = useState(false)
  const [sentTo, setSentTo]         = useState<string[]>([])
  const [activeDm, setActiveDm]     = useState<any>(null)
  const [dmInput, setDmInput]       = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, loading: dmLoading, openDm, sendDm, closeDm } = useDm(user?.uid || '')

  useEffect(() => {
    if (!user?.uid) return
    const u1 = listenFriends(user.uid, setFriends)
    const u2 = listenFriendRequests(user.uid, setRequests)
    return () => { u1(); u2() }
  }, [user?.uid])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSearch() {
    if (!searchQ.trim()) return
    setSearching(true)
    const results = await searchByUsername(searchQ.trim())
    setResults(results.filter(r => r.uid !== user?.uid))
    setSearching(false)
  }

  async function handleSendReq(toUser: any) {
    if (!user?.uid) return
    const res = await sendFriendRequest(user.uid, user, toUser.uid, toUser.displayName)
    if (res === 'sent') setSentTo(p => [...p, toUser.uid])
  }

  async function handleAccept(req: any) {
    if (!user?.uid) return
    await acceptFriendRequest(user.uid, user, req.fromUid, req)
  }

  async function handleDecline(req: any) {
    if (!user?.uid) return
    await declineFriendRequest(user.uid, req.fromUid)
  }

  async function handleOpenDm(friend: any) {
    setActiveDm(friend)
    await openDm(friend.uid)
  }

  async function handleSendDm() {
    if (!activeDm || !dmInput.trim()) return
    const text = dmInput.trim()
    setDmInput('')
    await sendDm(activeDm.uid, text)
  }

  const statusColor: Record<string, string> = {
    online: '#22C55E', away: '#FFB800', busy: '#EF4444', offline: '#555'
  }

  // DM Panel
  if (activeDm) return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',flexDirection:'column'}}>
      <div style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'0.875rem 1.25rem',display:'flex',alignItems:'center',gap:'0.75rem',flexShrink:0}}>
        <button onClick={() => { setActiveDm(null); closeDm() }} style={{background:'none',border:'none',color:'var(--txt-3)',cursor:'pointer',fontFamily:'var(--font)',fontSize:'0.8rem',padding:0}}>← Back</button>
        <div style={{fontSize:'1.3rem'}}>{activeDm.avatar || '🧬'}</div>
        <div>
          <div style={{fontWeight:800,fontSize:'0.88rem',color:'var(--txt)'}}>{activeDm.displayName}</div>
          <div style={{fontSize:'0.65rem',color:statusColor[activeDm.status] || '#555'}}>{activeDm.status || 'offline'}</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'1rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        {dmLoading && <div style={{textAlign:'center',color:'var(--txt-3)',fontSize:'0.75rem'}}>Loading messages...</div>}
        {messages.length === 0 && !dmLoading && (
          <div style={{textAlign:'center',color:'var(--txt-4)',fontSize:'0.75rem',padding:'2rem'}}>Start of your conversation</div>
        )}
        {messages.map((m, i) => {
          const mine = m.sender_uid === user?.uid
          return (
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:mine?'flex-end':'flex-start'}}>
              <div style={{
                maxWidth:'75%',padding:'0.625rem 0.875rem',borderRadius:mine?'var(--radius-sm) 4px var(--radius-sm) var(--radius-sm)':'4px var(--radius-sm) var(--radius-sm) var(--radius-sm)',
                background:mine?'linear-gradient(135deg,var(--dna-green),var(--dna-teal))':'var(--bg-3)',
                color:mine?'#000':'var(--txt)',fontSize:'0.85rem',lineHeight:1.5
              }}>
                {m.text}
                <div style={{fontSize:'0.6rem',opacity:0.6,marginTop:'3px'}}>
                  {new Date(m.sent_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef}/>
      </div>

      <div style={{padding:'0.875rem 1rem',background:'var(--bg-2)',borderTop:'1px solid var(--border)',display:'flex',gap:'0.625rem',flexShrink:0,paddingBottom:'calc(0.875rem + var(--bottom-nav))'}}>
        <input
          value={dmInput} onChange={e => setDmInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendDm()}
          placeholder="Type a message..."
          style={{flex:1,background:'var(--bg-3)',border:'1.5px solid var(--border-2)',borderRadius:'var(--radius-sm)',padding:'0.625rem 1rem',fontFamily:'var(--font)',fontSize:'0.88rem',color:'var(--txt)',outline:'none'}}
        />
        <button onClick={handleSendDm} style={{background:'var(--dna-green)',color:'#000',border:'none',borderRadius:'var(--radius-sm)',width:'40px',height:'40px',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>→</button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',padding:'1.25rem'}}>
      <div style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:900,color:'var(--txt)',marginBottom:'1rem'}}>Friends 👥</div>

      {/* Tabs */}
      <div style={{display:'flex',background:'var(--bg-3)',borderRadius:'10px',padding:'3px',marginBottom:'1.25rem',gap:'3px'}}>
        {(['friends','requests','find'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1,padding:'0.45rem',fontSize:'0.7rem',fontWeight:700,border:'none',
            borderRadius:'8px',cursor:'pointer',fontFamily:'var(--font)',
            background:tab===t?'var(--dna-green)':'transparent',
            color:tab===t?'#000':'var(--txt-3)',transition:'all 0.15s'
          }}>
            {t==='friends'?`Friends (${friends.length})`:t==='requests'?`Requests${requests.length?` (${requests.length})`:''}`:' Find'}
          </button>
        ))}
      </div>

      {/* Friends tab */}
      {tab==='friends' && (
        <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
          {friends.length === 0 && (
            <div style={{textAlign:'center',padding:'2.5rem 1rem',color:'var(--txt-4)'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.875rem'}}>👥</div>
              <p>No friends yet. Find them in the Find tab!</p>
            </div>
          )}
          {friends.map(f => (
            <div key={f.uid} style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'0.875rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div style={{position:'relative',flexShrink:0}}>
                <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'var(--bg-3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',border:'2px solid var(--border)'}}>{f.avatar||'🧬'}</div>
                <div style={{position:'absolute',bottom:0,right:0,width:'11px',height:'11px',borderRadius:'50%',background:statusColor[f.status]||'#555',border:'2px solid var(--bg-2)'}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:'0.82rem',color:'var(--txt)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.displayName||'Friend'}</div>
                <div style={{fontSize:'0.65rem',color:'var(--txt-3)'}}>@{f.username||'—'} {f.grade?`· Gr ${f.grade}`:''}</div>
              </div>
              <button onClick={() => handleOpenDm(f)} style={{background:'rgba(0,214,143,0.1)',border:'1px solid rgba(0,214,143,0.3)',borderRadius:'8px',padding:'0.35rem 0.75rem',fontSize:'0.7rem',fontWeight:700,color:'var(--dna-green)',cursor:'pointer',fontFamily:'var(--font)'}}>💬 DM</button>
            </div>
          ))}
        </div>
      )}

      {/* Requests tab */}
      {tab==='requests' && (
        <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
          {requests.length === 0 && (
            <div style={{textAlign:'center',padding:'2.5rem 1rem',color:'var(--txt-4)'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.875rem'}}>📨</div>
              <p>No friend requests</p>
            </div>
          )}
          {requests.map(req => (
            <div key={req.reqId} style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'0.875rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div style={{fontSize:'1.5rem'}}>{req.avatar||'🧬'}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:'0.82rem',color:'var(--txt)'}}>{req.displayName||'Someone'}</div>
                <div style={{fontSize:'0.65rem',color:'var(--txt-3)'}}>wants to be friends</div>
              </div>
              <div style={{display:'flex',gap:'0.375rem'}}>
                <button onClick={() => handleAccept(req)} style={{background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'8px',padding:'0.35rem 0.75rem',fontSize:'0.7rem',fontWeight:700,color:'#000',cursor:'pointer',fontFamily:'var(--font)'}}>✓ Accept</button>
                <button onClick={() => handleDecline(req)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'0.35rem 0.75rem',fontSize:'0.7rem',fontWeight:700,color:'var(--dna-red)',cursor:'pointer',fontFamily:'var(--font)'}}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Find tab */}
      {tab==='find' && (
        <div>
          <div style={{display:'flex',gap:'0.625rem',marginBottom:'1rem'}}>
            <input
              value={searchQ} onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => e.key==='Enter' && handleSearch()}
              placeholder="Search by username..."
              style={{flex:1,padding:'0.7rem 1rem',background:'var(--bg-2)',border:'1.5px solid var(--border-2)',borderRadius:'var(--radius-sm)',color:'var(--txt)',fontFamily:'var(--font)',fontSize:'0.85rem',outline:'none'}}
            />
            <button onClick={handleSearch} disabled={searching} style={{background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'var(--radius-sm)',padding:'0 1rem',color:'#000',fontWeight:800,cursor:'pointer',fontFamily:'var(--font)',fontSize:'0.85rem'}}>
              {searching?'...':'🔍'}
            </button>
          </div>

          <div style={{background:'rgba(0,214,143,0.06)',border:'1px solid rgba(0,214,143,0.2)',borderRadius:'10px',padding:'0.75rem',marginBottom:'1rem',fontSize:'0.75rem',color:'var(--txt-3)'}}>
            💡 Share your username <strong style={{color:'var(--dna-green)'}}>@{user?.username||user?.displayName}</strong> with friends so they can find you
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
            {searchResults.map(u => {
              const isFriend = friends.some(f => f.uid === u.uid)
              const isSent = sentTo.includes(u.uid)
              return (
                <div key={u.uid} style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'0.875rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <div style={{fontSize:'1.5rem'}}>{u.avatar||'🧬'}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:'0.82rem',color:'var(--txt)'}}>{u.displayName||'Learner'}</div>
                    <div style={{fontSize:'0.65rem',color:'var(--txt-3)'}}>@{u.username||'—'} {u.grade?`· Gr ${u.grade}`:''}</div>
                  </div>
                  {isFriend ? (
                    <div style={{fontSize:'0.7rem',color:'var(--dna-green)',fontWeight:700}}>Friends ✓</div>
                  ) : isSent ? (
                    <div style={{fontSize:'0.7rem',color:'var(--txt-3)',fontWeight:700}}>Sent ✓</div>
                  ) : (
                    <button onClick={() => handleSendReq(u)} style={{background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'8px',padding:'0.35rem 0.875rem',fontSize:'0.72rem',fontWeight:800,color:'#000',cursor:'pointer',fontFamily:'var(--font)'}}>+ Add</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
