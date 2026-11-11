import Pusher from 'pusher-js';

export const pusher = import.meta.env.VITE_PUSHER_KEY
  ? new Pusher(import.meta.env.VITE_PUSHER_KEY, { cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'ap1' })
  : null;

export type RoomEvent =
  | { type: 'play'; position: number }
  | { type: 'pause'; position: number }
  | { type: 'seek'; position: number }
  | { type: 'chat'; body: string; userId: string }
  | { type: 'reaction'; emoji: string; userId: string };

export function subscribeToRoom(roomId: string, onEvent: (event: RoomEvent) => void) {
  if (!pusher) return () => undefined;
  const channel = pusher.subscribe(`private-room-${roomId}`);
  const events = ['play', 'pause', 'seek', 'chat', 'reaction'];
  events.forEach(type => channel.bind(`client-${type}`, (payload: Omit<RoomEvent, 'type'>) => onEvent({ type, ...payload } as RoomEvent)));
  return () => { events.forEach(type => channel.unbind(`client-${type}`)); pusher.unsubscribe(`private-room-${roomId}`); };
}
