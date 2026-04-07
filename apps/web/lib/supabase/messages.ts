import { supabase } from './client'

export async function saveDmMessage(chatId: string, senderUid: string, text: string) {
  const { error } = await supabase.from('dm_messages').insert({
    chat_id: chatId, sender_uid: senderUid, text,
    sent_at: new Date().toISOString()
  })
  if (error) console.warn('saveDmMessage:', error.message)
}

export async function getDmHistory(chatId: string, limit = 50) {
  const { data } = await supabase
    .from('dm_messages').select('*')
    .eq('chat_id', chatId)
    .order('sent_at', { ascending: true })
    .limit(limit)
  return data || []
}

export async function saveGroupMessage(
  groupId: string, senderUid: string,
  senderName: string, senderAvatar: string, text: string
) {
  const { error } = await supabase.from('group_messages').insert({
    group_id: groupId, sender_uid: senderUid,
    sender_name: senderName, sender_avatar: senderAvatar,
    text, sent_at: new Date().toISOString()
  })
  if (error) console.warn('saveGroupMessage:', error.message)
}

export async function getGroupHistory(groupId: string, limit = 100) {
  const { data } = await supabase
    .from('group_messages').select('*')
    .eq('group_id', groupId)
    .eq('flagged', false)
    .order('sent_at', { ascending: true })
    .limit(limit)
  return data || []
}
