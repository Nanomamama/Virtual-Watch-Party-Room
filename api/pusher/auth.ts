import type { VercelRequest, VercelResponse } from '@vercel/node';
import Pusher from 'pusher';
const pusher = new Pusher({appId:process.env.PUSHER_APP_ID!,key:process.env.VITE_PUSHER_KEY!,secret:process.env.PUSHER_SECRET!,cluster:process.env.VITE_PUSHER_CLUSTER||'ap1',useTLS:true});
export default function handler(req:VercelRequest,res:VercelResponse){if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});const {socket_id,channel_name}=req.body||{};if(!socket_id||!channel_name?.startsWith('private-room-'))return res.status(400).json({error:'Invalid channel'});return res.status(200).send(pusher.authenticate(socket_id,channel_name));}
