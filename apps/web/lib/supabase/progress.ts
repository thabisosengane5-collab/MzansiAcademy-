import { supabase } from './client'

export async function markTopicDone(uid: string, subjectId: string, moduleIdx: number, topicIdx: number) {
  try {
    await supabase.from('progress').upsert({ uid, subject_id: subjectId, module_idx: moduleIdx, topic_idx: topicIdx, completed: true, completed_at: new Date().toISOString() }, { onConflict: 'uid,subject_id,module_idx,topic_idx' })
  } catch (e) { console.warn('markTopicDone:', e) }
}

export async function getSubjectProgress(uid: string, subjectId: string) {
  try {
    const { data } = await supabase.from('progress').select('module_idx,topic_idx').eq('uid', uid).eq('subject_id', subjectId).eq('completed', true)
    return data || []
  } catch { return [] }
}
