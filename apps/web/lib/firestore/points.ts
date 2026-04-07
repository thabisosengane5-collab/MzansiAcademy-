import { doc, updateDoc, increment, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase/client'

export async function addPoints(uid: string, pts: number, reason: string) {
  try {
    await updateDoc(doc(db, 'users', uid), { pts: increment(pts) })
    await updateDoc(doc(db, 'leaderboard', uid), { pts: increment(pts) })
    await addDoc(collection(db, 'users', uid, 'pointsHistory'), { pts, reason, ts: new Date().toISOString() })
  } catch (e) { console.warn('addPoints:', e) }
}
