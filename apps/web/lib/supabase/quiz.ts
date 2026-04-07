import { supabase } from './client'

export async function saveQuizResult(uid: string, subjectId: string, score: number, total: number, ptsEarned: number) {
  try {
    await supabase.from('quiz_history').insert({ uid, subject_id: subjectId, score, total, pts_earned: ptsEarned, created_at: new Date().toISOString() })
  } catch (e) { console.warn('saveQuizResult:', e) }
}
