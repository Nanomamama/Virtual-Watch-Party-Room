import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Copy, Headphones, Mic, MoreHorizontal, Pause, Play, Send, Settings, Smile, Volume2, X } from 'lucide-react';
import './styles.css';

const people = [
  { name:'Mina', handle:'@mina', initials:'M', color:'#f1a47b', status:'Watching' },
  { name:'Keen', handle:'@keen', initials:'K', color:'#95b5ff', status:'Watching' },
  { name:'Tao', handle:'@tao', initials:'T', color:'#dca6ec', status:'Away' },
  { name:'Nina', handle:'@nina', initials:'N', color:'#e7cf76', status:'Watching' },
];
const messages = [
  { name:'Mina', time:'9:42 PM', text:'the color grading in this scene is unreal', avatar:'M', color:'#f1a47b' },
  { name:'Keen', time:'9:43 PM', text:'right?? feels like a dream', avatar:'K', color:'#95b5ff' },
  { name:'Nina', time:'9:44 PM', text:'wait for the next shot 👀', avatar:'N', color:'#e7cf76' },
];

function App(){
  const [playing,setPlaying] = useState(true);
  const [chat,setChat] = useState('');
  const [chatMessages,setChatMessages] = useState(messages);
  const [reactions,setReactions] = useState<string[]>([]);
  const send = () => { if(chat.trim()){ setChatMessages([...chatMessages,{name:'You',time:'now',text:chat,avatar:'Y',color:'#c8b6ff'}]); setChat(''); }};
  const react = (emoji:string) => { setReactions([...reactions,emoji]); setTimeout(()=>setReactions(r=>r.slice(1)), 1800); };
  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">◒</span><span>ORBIT</span></div><div className="room-meta"><span className="live-dot"/> ROOM <b>late-night cinema</b><span className="divider"/> <span className="lock">⌁</span> PRIVATE</div><div className="top-actions"><button className="icon-btn"><Headphones size={16}/></button><button className="share"><Copy size={15}/> Copy invite</button><div className="avatar small" style={{background:'#c8b6ff'}}>Y</div></div></header>
    <div className="workspace">
      <section className="stage-section">
        <div className="stage-head"><div><p className="eyebrow">NOW WATCHING</p><h1>After Yang</h1></div><div className="sync"><span className="sync-dot"/> synced <b>00:42:18</b></div></div>
        <div className="video-frame">
          <div className="film-bg"><div className="sun"/><div className="film-copy"><span>A film by<br/><strong>KOGONADA</strong></span><em>AFTER<br/>YANG</em></div><div className="grain"/></div>
          <div className="reaction-layer">{reactions.map((r,i)=><span key={i} className="float-reaction" style={{left:`${25+i*17}%`}}>{r}</span>)}</div>
          <div className="video-top"><span>HD</span><span>1:18:34</span></div>
          <div className="video-bottom"><div className="progress"><span/></div><div className="controls"><button onClick={()=>setPlaying(!playing)}>{playing?<Pause fill="white"/>:<Play fill="white"/>}</button><span className="time">42:18 / 1:18:34</span><span className="control-spacer"/><button><Volume2/></button><button><Settings/></button><button className="fullscreen">⛶</button></div></div>
        </div>
        <div className="quick-reactions"><span>React</span>{['❤️','😂','👏','😮','🔥'].map(e=><button key={e} onClick={()=>react(e)}>{e}</button>)}<button className="add-react"><Smile size={15}/></button></div>
      </section>
      <aside className="side-panel">
        <div className="panel-tabs"><button className="active">CHAT <span>{chatMessages.length}</span></button><button>PEOPLE <span>{people.length}</span></button></div>
        <div className="presence"><div className="presence-avatars">{people.map(p=><div className="avatar mini" key={p.name} style={{background:p.color}}>{p.initials}</div>)}</div><span><b>{people.length} people</b> in the room</span></div>
        <div className="chat-list">{chatMessages.map((m,i)=><div className="message" key={i}><div className="avatar mini" style={{background:m.color}}>{m.avatar}</div><div><div className="message-meta"><b>{m.name}</b><span>{m.time}</span></div><p>{m.text}</p></div></div>)}</div>
        <div className="chat-compose"><div className="input-wrap"><input value={chat} onChange={e=>setChat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Say something..."/><button><Smile size={17}/></button></div><button className="send" onClick={send}><Send size={16}/></button></div>
      </aside>
    </div>
    <footer className="footer"><div className="footer-left"><span className="pulse"/> Playback is synced for everyone</div><div className="footer-center">You joined <b>12 minutes ago</b></div><div className="footer-right"><button><Mic size={15}/> Mute</button><button><MoreHorizontal size={17}/></button></div></footer>
  </main>
}
createRoot(document.getElementById('root')!).render(<App/>);
