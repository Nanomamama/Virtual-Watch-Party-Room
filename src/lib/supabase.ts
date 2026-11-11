import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export async function createRoom(hostId: string, name = 'late-night cinema') {
  if (!supabase) throw new Error('Missing Supabase environment variables');
  const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
  const { data, error } = await supabase.from('rooms').insert({ host_id: hostId, name, invite_code: inviteCode }).select().single();
  if (error) throw error;
  await supabase.from('room_members').insert({ room_id: data.id, user_id: hostId });
  return data;
}

export async function joinRoom(userId: string, inviteCode: string) {
  if (!supabase) throw new Error('Missing Supabase environment variables');
  const { data: room, error } = await supabase.from('rooms').select('*').eq('invite_code', inviteCode.trim().toUpperCase()).single();
  if (error || !room) throw new Error('Invite code not found');
  const membership = await supabase.from('room_members').upsert({ room_id: room.id, user_id: userId });
  if (membership.error) throw membership.error;
  return room;
}
