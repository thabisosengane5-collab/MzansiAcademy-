import {
  collection, doc, setDoc, getDoc, getDocs,
  deleteDoc, onSnapshot, serverTimestamp, query, where,
  orderBy, limit
} from 'firebase/firestore'
import { db } from '../firebase/client'

export function listenFriends(uid: string, cb: (friends: any[]) => void) {
  return onSnapshot(collection(db, 'users', uid, 'friends'), snap => {
    cb(snap.docs.map(d => ({ uid: d.id, ...d.data() })))
  })
}

export function listenFriendRequests(uid: string, cb: (reqs: any[]) => void) {
  return onSnapshot(collection(db, 'users', uid, 'friendRequests'), snap => {
    cb(snap.docs.map(d => ({ reqId: d.id, ...d.data() })))
  })
}

export async function sendFriendRequest(myUid: string, myData: any, toUid: string, toName: string) {
  if (myUid === toUid) return
  const existing = await getDoc(doc(db, 'users', myUid, 'friends', toUid))
  if (existing.exists()) return 'already_friends'
  const sent = await getDoc(doc(db, 'users', myUid, 'sentRequests', toUid))
  if (sent.exists()) return 'already_sent'

  await setDoc(doc(db, 'users', toUid, 'friendRequests', myUid), {
    fromUid: myUid, displayName: myData.displayName || '',
    username: myData.username || '', avatar: myData.avatar || '🧬',
    grade: myData.grade || '', sentAt: serverTimestamp()
  })
  await setDoc(doc(db, 'users', myUid, 'sentRequests', toUid), {
    toUid, displayName: toName, sentAt: serverTimestamp()
  })
  await setDoc(doc(db, 'users', toUid, 'notifications', myUid + '_fr'), {
    type: 'friend_request', fromUid: myUid,
    fromName: myData.displayName || 'Someone',
    fromAvatar: myData.avatar || '🧬',
    message: (myData.displayName || 'Someone') + ' sent you a friend request',
    read: false, createdAt: serverTimestamp()
  })
  return 'sent'
}

export async function acceptFriendRequest(myUid: string, myData: any, fromUid: string, fromData: any) {
  await setDoc(doc(db, 'users', myUid, 'friends', fromUid), {
    displayName: fromData.displayName || '', username: fromData.username || '',
    avatar: fromData.avatar || '🧬', grade: fromData.grade || '',
    status: 'online', addedAt: serverTimestamp()
  })
  await setDoc(doc(db, 'users', fromUid, 'friends', myUid), {
    displayName: myData.displayName || '', username: myData.username || '',
    avatar: myData.avatar || '🧬', grade: myData.grade || '',
    status: 'online', addedAt: serverTimestamp()
  })
  await deleteDoc(doc(db, 'users', myUid, 'friendRequests', fromUid))
  await deleteDoc(doc(db, 'users', fromUid, 'sentRequests', myUid))
}

export async function declineFriendRequest(myUid: string, fromUid: string) {
  await deleteDoc(doc(db, 'users', myUid, 'friendRequests', fromUid))
}

export async function removeFriend(myUid: string, friendUid: string) {
  await deleteDoc(doc(db, 'users', myUid, 'friends', friendUid))
  await deleteDoc(doc(db, 'users', friendUid, 'friends', myUid))
}

export async function searchByUsername(q: string) {
  const { getDocs: gd, query: qr, collection: col, where: wh, limit: lm } = await import('firebase/firestore')
  const snap = await getDocs(
    query(collection(db, 'users'),
      where('usernameSearch', '>=', q.toLowerCase()),
      where('usernameSearch', '<=', q.toLowerCase() + '\uf8ff'),
      limit(10)
    )
  )
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}
