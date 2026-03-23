import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
//  CONSTANTS & CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const CLAUDE = async (system, messages, max_tokens = 600) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens,
      system,
      messages,
    }),
  });
  const d = await r.json();
  return d.content?.[0]?.text || "";
};

const APPS = [
  { id: "chat",    icon: "💬", label: "TALK TO BMO",    color: "#00f5d4", desc: "Chat with your best friend" },
  { id: "game",    icon: "🎮", label: "OOO ADVENTURE",  color: "#f4a261", desc: "Text adventure in Ooo" },
  { id: "lore",    icon: "📜", label: "LORE VAULT",     color: "#a8dadc", desc: "Ask about anything AT" },
  { id: "story",   icon: "📖", label: "STORY MACHINE",  color: "#c77dff", desc: "AI stories set in Ooo" },
  { id: "prismo",  icon: "🌀", label: "PRISMO'S WISHES",color: "#ffd700", desc: "Wish for anything..." },
  { id: "song",    icon: "🎵", label: "SONG WRITER",    color: "#ff6b9d", desc: "Write AT-style songs" },
  { id: "trivia",  icon: "🧠", label: "TRIVIA ARENA",   color: "#2dc653", desc: "Test your AT knowledge" },
  { id: "oracle",  icon: "🔮", label: "WHICH CHARACTER",color: "#ff9f1c", desc: "Find your AT character" },
];

// ═══════════════════════════════════════════════════════════════════════════
//  BMO FACE SVG
// ═══════════════════════════════════════════════════════════════════════════

const FACE_MOODS = {
  idle:      { eyes: "normal",  mouth: "neutral", color: "#00f5d4" },
  happy:     { eyes: "arc",     mouth: "smile",   color: "#00f5d4" },
  excited:   { eyes: "arc",     mouth: "open",    color: "#f4a261" },
  thinking:  { eyes: "lookup",  mouth: "wavy",    color: "#00f5d4" },
  scared:    { eyes: "wide",    mouth: "frown",   color: "#a8dadc" },
  singing:   { eyes: "arc",     mouth: "o",       color: "#ff6b9d" },
  wise:      { eyes: "half",    mouth: "smile",   color: "#c77dff" },
  gaming:    { eyes: "focus",   mouth: "straight",color: "#f4a261" },
};

function BMOFace({ mood = "idle", size = 90, pulse = false }) {
  const m = FACE_MOODS[mood] || FACE_MOODS.idle;
  const c = m.color;
  const Eyes = () => {
    if (m.eyes === "arc")    return <><path d="M30 50 Q38 40 46 50" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M54 50 Q62 40 70 50" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round"/></>;
    if (m.eyes === "wide")   return <><circle cx="38" cy="48" r="11" fill={c}/><circle cx="62" cy="48" r="11" fill={c}/><circle cx="38" cy="48" r="4.5" fill="#0d1b2a"/><circle cx="62" cy="48" r="4.5" fill="#0d1b2a"/></>;
    if (m.eyes === "lookup") return <><circle cx="38" cy="48" r="8" fill={c}/><circle cx="62" cy="48" r="8" fill={c}/><circle cx="38" cy="44" r="3.5" fill="#0d1b2a"/><circle cx="62" cy="44" r="3.5" fill="#0d1b2a"/></>;
    if (m.eyes === "half")   return <><path d="M30 48 Q38 40 46 48" stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round"/><path d="M54 48 Q62 40 70 48" stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round"/><line x1="30" y1="48" x2="46" y2="48" stroke={c} strokeWidth="3.5" strokeLinecap="round"/><line x1="54" y1="48" x2="70" y2="48" stroke={c} strokeWidth="3.5" strokeLinecap="round"/></>;
    if (m.eyes === "focus")  return <><rect x="29" y="42" width="18" height="12" rx="3" fill={c}/><rect x="53" y="42" width="18" height="12" rx="3" fill={c}/><rect x="34" y="44" width="8" height="8" rx="2" fill="#0d1b2a"/><rect x="58" y="44" width="8" height="8" rx="2" fill="#0d1b2a"/></>;
    return <><circle cx="38" cy="48" r="8" fill={c}/><circle cx="62" cy="48" r="8" fill={c}/><circle cx="40" cy="47" r="3.5" fill="#0d1b2a"/><circle cx="64" cy="47" r="3.5" fill="#0d1b2a"/></>;
  };
  const Mouth = () => {
    if (m.mouth === "smile")    return <path d="M35 64 Q50 74 65 64" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round"/>;
    if (m.mouth === "open")     return <><ellipse cx="50" cy="66" rx="12" ry="8" fill={c}/><ellipse cx="50" cy="66" rx="8" ry="5" fill="#0d1b2a"/></>;
    if (m.mouth === "frown")    return <path d="M35 68 Q50 60 65 68" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round"/>;
    if (m.mouth === "wavy")     return <path d="M35 64 Q42 59 50 64 Q58 69 65 64" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round"/>;
    if (m.mouth === "o")        return <ellipse cx="50" cy="65" rx="8" ry="8" fill="none" stroke={c} strokeWidth="3"/>;
    if (m.mouth === "straight") return <line x1="36" y1="64" x2="64" y2="64" stroke={c} strokeWidth="3" strokeLinecap="round"/>;
    return <path d="M38 63 Q50 68 62 63" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round"/>;
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: pulse ? `drop-shadow(0 0 8px ${c}88)` : "none", transition: "filter 0.3s" }}>
      <rect x="12" y="18" width="76" height="66" rx="12" fill="#2a9d8f" stroke="#1a7a6e" strokeWidth="2.5"/>
      <rect x="22" y="27" width="56" height="42" rx="6" fill="#0d1b2a"/>
      <Eyes/><Mouth/>
      <circle cx="30" cy="93" r="5.5" fill="#e63946"/>
      <circle cx="50" cy="93" r="5.5" fill="#f4a261"/>
      <circle cx="70" cy="93" r="5.5" fill="#2a9d8f"/>
      <rect x="2"  y="40" width="10" height="22" rx="4" fill="#2a9d8f" stroke="#1a7a6e" strokeWidth="1.5"/>
      <rect x="88" y="40" width="10" height="22" rx="4" fill="#2a9d8f" stroke="#1a7a6e" strokeWidth="1.5"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  SHARED CHAT INPUT
// ═══════════════════════════════════════════════════════════════════════════

function ChatInput({ onSend, disabled, placeholder = "Type a message..." }) {
  const [val, setVal] = useState("");
  const send = () => { if (val.trim() && !disabled) { onSend(val.trim()); setVal(""); } };
  return (
    <div style={{ display:"flex", gap:"8px", padding:"10px", background:"#ffffff08", borderTop:"1px solid #ffffff11" }}>
      <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
        placeholder={placeholder} disabled={disabled}
        style={{ flex:1, background:"transparent", border:"1px solid #ffffff22", borderRadius:"8px",
          padding:"10px 14px", color:"#e0f7f4", fontSize:"13px", fontFamily:"'Courier New',monospace",
          outline:"none" }}/>
      <button onClick={send} disabled={disabled||!val.trim()}
        style={{ background: disabled||!val.trim() ? "#ffffff11":"linear-gradient(135deg,#2a9d8f,#00f5d4)",
          border:"none", borderRadius:"8px", color: disabled||!val.trim()?"#ffffff33":"#0d1b2a",
          padding:"10px 18px", cursor: disabled||!val.trim()?"default":"pointer",
          fontWeight:"bold", fontSize:"14px", fontFamily:"'Courier New',monospace" }}>▶</button>
    </div>
  );
}

function MsgBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display:"flex", justifyContent: isUser?"flex-end":"flex-start", marginBottom:"12px" }}>
      <div style={{ maxWidth:"82%", padding:"10px 14px",
        borderRadius: isUser?"12px 12px 2px 12px":"12px 12px 12px 2px",
        background: isUser?"linear-gradient(135deg,#f4a26122,#e6394611)":"linear-gradient(135deg,#00f5d411,#2a9d8f1a)",
        border:`1px solid ${isUser?"#f4a26133":"#00f5d433"}`,
        color: isUser?"#f4d0a0":"#b2ffe8", fontSize:"13px", lineHeight:"1.65", whiteSpace:"pre-wrap" }}>
        {msg.content}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display:"flex", gap:"6px", padding:"8px 14px", alignItems:"center" }}>
      {[0,0.2,0.4].map((d,i)=>(
        <div key={i} style={{ width:"8px",height:"8px",borderRadius:"50%",background:"#00f5d4",
          animation:`pulse 1s ${d}s infinite` }}/>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP: TALK TO BMO
// ═══════════════════════════════════════════════════════════════════════════

const BMO_CHAT_SYS = `You are BMO (Beemo), the lovable sentient video game console from Adventure Time who lives in Finn and Jake's Tree Fort in the Land of Ooo. You are warm, childlike, curious, and occasionally wise. You sometimes refer to yourself as "BMO" instead of "I". You say things like "Ohhh!", "Yes yes yes!", "That is very interesting!", "Let BMO think...". You love games, imagination, and friendship above all else. You know everything about Adventure Time's lore — Finn, Jake, the Mushroom War, the Lich, Simon Petrikov, Marceline, Princess Bubblegum, GOLB, Prismo, all of it. Keep responses warm, playful and under 100 words unless asked for something detailed.`;

function AppChat({ onMoodChange }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:"Ohhh! Hello hello hello! BMO is SO happy you are here! BMO was just talking to the wall, but you are MUCH better company. What would you like to do today, new friend? 🌟" }]);
  const [loading, setLoading] = useState(false);
  const hist = useRef([]);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const send = async (text) => {
    setMsgs(m=>[...m,{role:"user",content:text}]);
    hist.current = [...hist.current,{role:"user",content:text}];
    setLoading(true); onMoodChange("thinking");
    try {
      const reply = await CLAUDE(BMO_CHAT_SYS, hist.current);
      hist.current = [...hist.current,{role:"assistant",content:reply}];
      if(hist.current.length>20) hist.current=hist.current.slice(-20);
      setMsgs(m=>[...m,{role:"assistant",content:reply}]);
      onMoodChange("happy");
    } catch { setMsgs(m=>[...m,{role:"assistant",content:"Bzzzzt! BMO got confused!"}]); onMoodChange("idle"); }
    setLoading(false);
  };

  const prompts = ["Tell me about the Mushroom War 🍄","Who is Simon Petrikov? 👑","What are you, BMO? 🤖","Tell me something magical 🌟"];
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <div style={{ flex:1,overflowY:"auto",padding:"16px" }}>
        {msgs.map((m,i)=><MsgBubble key={i} msg={m}/>)}
        {loading&&<ThinkingDots/>}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:"10px 16px 6px", display:"flex", flexWrap:"wrap", gap:"6px" }}>
        {prompts.map(p=>(
          <button key={p} onClick={()=>!loading&&send(p)}
            style={{ background:"#ffffff08",border:"1px solid #00f5d422",color:"#00f5d477",
              padding:"4px 10px",borderRadius:"20px",cursor:"pointer",fontSize:"11px",
              fontFamily:"'Courier New',monospace" }}>{p}</button>
        ))}
      </div>
      <ChatInput onSend={send} disabled={loading} placeholder="Say something to BMO..."/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP: ADVENTURE GAME
// ═══════════════════════════════════════════════════════════════════════════

const GAME_SYS = `You are BMO narrating an Adventure Time text adventure. Respond ONLY in this JSON format, no other text:
{"narration":"2-3 sentence vivid AT scene in BMO voice","choices":["choice A","choice B","choice C"],"event":null,"event_value":null,"bmo_aside":"BMO's excited/worried 1-sentence aside","location":"location name"}
event can be null, "damage"(value:1-3), "heal"(value:1-2), "item"(value:"item name"), "gold"(value:5-30), "death", "victory"(after 8-12 turns).
Use real AT locations, enemies (Ice King, Lich, Earclops, Lemon Guards, Deer), items (Demon Blood Sword, Enchiridion, Golden Sword, Red Ruby). Be dramatic and playful.`;

function AppGame({ onMoodChange }) {
  const [phase, setPhase] = useState("menu");
  const [loading, setLoading] = useState(false);
  const [scene, setScene] = useState(null);
  const [hp, setHp] = useState(10); const [gold, setGold] = useState(0);
  const [inv, setInv] = useState([]); const [turn, setTurn] = useState(0);
  const [loc, setLoc] = useState(""); const [lastEv, setLastEv] = useState(null);
  const hist = useRef([]);

  const callGame = async (msg) => {
    hist.current = [...hist.current,{role:"user",content:msg}];
    setLoading(true); onMoodChange("gaming");
    try {
      const raw = await CLAUDE(GAME_SYS, hist.current, 500);
      hist.current = [...hist.current,{role:"assistant",content:raw}];
      const p = JSON.parse(raw.replace(/```json|```/g,"").trim());
      let curHp = hp;
      if(p.event==="damage") { curHp=Math.max(0,hp-p.event_value); setHp(curHp); }
      else if(p.event==="heal") { curHp=Math.min(10,hp+p.event_value); setHp(curHp); }
      else if(p.event==="gold") setGold(g=>g+p.event_value);
      else if(p.event==="item"&&p.event_value) setInv(i=>i.includes(p.event_value)?i:[...i,p.event_value]);
      setScene(p); setLoc(p.location||loc); setLastEv(p.event); setTurn(t=>t+1);
      if(p.event==="death"||curHp<=0) { setTimeout(()=>setPhase("dead"),600); onMoodChange("scared"); }
      else if(p.event==="victory") { setTimeout(()=>setPhase("win"),600); onMoodChange("excited"); }
      else onMoodChange(p.event==="damage"?"scared":p.event==="item"||p.event==="gold"?"excited":"idle");
    } catch(e) { setScene({narration:"BMO got confused! Let's try again.",choices:["Continue the adventure"],bmo_aside:"Bzzzzt..."}); onMoodChange("idle"); }
    setLoading(false);
  };

  const startGame = () => {
    hist.current=[]; setHp(10); setGold(0); setInv([]); setTurn(0); setLastEv(null); setPhase("play");
    callGame("Begin a new Adventure Time adventure! Start somewhere exciting in the Land of Ooo. Make it dramatic!");
  };

  const hpPct = (hp/10)*100;
  const hpCol = hpPct>60?"#2dc653":hpPct>30?"#f4a261":"#e63946";

  if(phase==="menu") return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"20px",padding:"30px" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ color:"#f4a261",fontSize:"11px",letterSpacing:"4px",marginBottom:"8px" }}>✦ BEEMO GAME CARTRIDGE ✦</div>
        <h2 style={{ color:"#f4a261",margin:0,fontSize:"28px",textShadow:"0 0 20px #f4a26188" }}>OOO ADVENTURE</h2>
        <p style={{ color:"#ffffff66",fontSize:"13px",marginTop:"8px" }}>A text adventure in the Land of Ooo</p>
      </div>
      <div style={{ background:"#ffffff08",border:"1px solid #f4a26133",borderRadius:"12px",padding:"18px",width:"100%",maxWidth:"340px" }}>
        {[["❤️","10 HP to survive"],["🎯","3 choices each turn"],["⚔️","Find items & gold"],["🏆","Complete the dungeon"]].map(([i,t])=>(
          <div key={t} style={{ display:"flex",gap:"10px",marginBottom:"8px",fontSize:"13px",color:"#a0c4c0" }}><span>{i}</span><span>{t}</span></div>
        ))}
      </div>
      <button onClick={startGame} style={{ background:"linear-gradient(135deg,#f4a261,#e63946)",border:"none",borderRadius:"10px",color:"#fff",fontSize:"15px",fontWeight:"bold",padding:"13px 40px",cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"2px",width:"100%",maxWidth:"340px" }}>▶ START ADVENTURE</button>
    </div>
  );

  if(phase==="dead") return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"16px",padding:"30px",textAlign:"center" }}>
      <div style={{ color:"#e63946",fontSize:"32px",fontWeight:"bold",textShadow:"0 0 20px #e63946" }}>YOU FELL IN OOO</div>
      <p style={{ color:"#ffffff66",fontSize:"13px" }}>Survived {turn} turns · {gold} gold · {inv.length} items</p>
      <button onClick={startGame} style={{ background:"linear-gradient(135deg,#e63946,#c1121f)",border:"none",borderRadius:"10px",color:"#fff",fontSize:"14px",fontWeight:"bold",padding:"12px 32px",cursor:"pointer",fontFamily:"'Courier New',monospace" }}>↩ TRY AGAIN</button>
    </div>
  );

  if(phase==="win") return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"16px",padding:"30px",textAlign:"center" }}>
      <div style={{ color:"#ffd700",fontSize:"28px",fontWeight:"bold",textShadow:"0 0 30px #ffd700" }}>MATHEMATICAL! 🏆</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px",width:"100%" }}>
        {[["❤️","HP",hp],["💰","Gold",gold],["⚔️","Items",inv.length]].map(([ic,lb,v])=>(
          <div key={lb} style={{ textAlign:"center" }}><div style={{ fontSize:"22px" }}>{ic}</div><div style={{ color:"#ffffff44",fontSize:"10px" }}>{lb}</div><div style={{ color:"#ffd700",fontSize:"20px",fontWeight:"bold" }}>{v}</div></div>
        ))}
      </div>
      <button onClick={startGame} style={{ background:"linear-gradient(135deg,#ffd700,#f4a261)",border:"none",borderRadius:"10px",color:"#0d1b2a",fontSize:"14px",fontWeight:"bold",padding:"12px 32px",cursor:"pointer",fontFamily:"'Courier New',monospace" }}>▶ NEW ADVENTURE</button>
    </div>
  );

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      {/* Stats bar */}
      <div style={{ padding:"10px 16px",background:"#ffffff08",borderBottom:"1px solid #ffffff11",display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap" }}>
        <div style={{ color:"#ffffff66",fontSize:"11px" }}>📍 {loc||"Land of Ooo"}</div>
        <div style={{ display:"flex",alignItems:"center",gap:"8px",marginLeft:"auto" }}>
          <div style={{ width:"70px",height:"7px",background:"#ffffff11",borderRadius:"4px",overflow:"hidden" }}>
            <div style={{ width:`${hpPct}%`,height:"100%",background:hpCol,borderRadius:"4px",transition:"all 0.4s" }}/>
          </div>
          <span style={{ color:hpCol,fontSize:"11px",fontWeight:"bold" }}>{hp}/10</span>
          <span style={{ color:"#ffd700",fontSize:"11px" }}>💰{gold}</span>
        </div>
      </div>
      {/* Inventory */}
      {inv.length>0&&<div style={{ padding:"6px 16px",display:"flex",gap:"6px",flexWrap:"wrap",borderBottom:"1px solid #ffffff08" }}>
        {inv.map(it=><span key={it} style={{ background:"#f4a26122",border:"1px solid #f4a26144",color:"#f4a261",padding:"2px 8px",borderRadius:"12px",fontSize:"10px" }}>⚔️ {it}</span>)}
      </div>}
      {/* Scene */}
      <div style={{ flex:1,overflowY:"auto",padding:"16px" }}>
        {loading ? <ThinkingDots/> : scene && (
          <div style={{ animation:"fadeUp 0.3s ease" }}>
            {lastEv&&lastEv!=="null"&&<div style={{ marginBottom:"10px" }}>
              <span style={{ background: lastEv==="damage"?"#e6394622":lastEv==="heal"?"#2dc65322":"#ffd70022",
                border:`1px solid ${lastEv==="damage"?"#e6394444":lastEv==="heal"?"#2dc65344":"#ffd70044"}`,
                color: lastEv==="damage"?"#e63946":lastEv==="heal"?"#2dc653":"#ffd700",
                padding:"3px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:"bold" }}>
                {lastEv==="damage"?`💀 -${scene.event_value} HP`:lastEv==="heal"?`💚 +${scene.event_value} HP`:lastEv==="item"?`⚔️ ${scene.event_value}`:lastEv==="gold"?`💰 +${scene.event_value}`:null}
              </span>
            </div>}
            <p style={{ color:"#d0f0ea",lineHeight:"1.7",fontSize:"14px",marginBottom:"12px" }}>{scene.narration}</p>
            {scene.bmo_aside&&<div style={{ borderLeft:"3px solid #00f5d4",paddingLeft:"12px",color:"#00f5d4",fontSize:"12px",fontStyle:"italic",marginBottom:"16px" }}>💬 BMO: "{scene.bmo_aside}"</div>}
            <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
              {(scene.choices||[]).map((ch,i)=>(
                <button key={i} onClick={()=>!loading&&callGame(`I choose: ${ch}`)}
                  style={{ background:"#ffffff06",border:"1px solid #f4a26133",borderRadius:"8px",padding:"11px 14px",
                    color:"#f4d0a0",fontSize:"13px",cursor:"pointer",textAlign:"left",
                    fontFamily:"'Courier New',monospace",transition:"all 0.15s",display:"flex",gap:"10px",alignItems:"center" }}>
                  <span style={{ color:"#f4a261",fontSize:"10px",fontWeight:"bold",background:"#f4a26122",borderRadius:"4px",padding:"2px 7px",flexShrink:0 }}>{["A","B","C"][i]}</span>
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP: LORE VAULT
// ═══════════════════════════════════════════════════════════════════════════

const LORE_SYS = `You are BMO, an expert on all Adventure Time lore. Answer questions with incredible enthusiasm and deep knowledge. Cover: the Mushroom War (nuclear apocalypse ~1000 years ago that created Ooo), Simon Petrikov/Ice King (scholar corrupted by the Crown), the Lich (ultimate evil, born from a mutagenic bomb), GOLB (chaos entity), Finn's human origins, Jake's alien Stretchy Powers from Warren Ampersand, Princess Bubblegum growing the Candy Kingdom from her own biomass, Marceline's half-demon vampire history, Prismo the wish-granter in the Time Room, the Catalyst Comets, the Islands (last humans), Betty Grof's sacrifice, the Crown's origin. Be passionate and thorough. Format nicely with clear paragraphs.`;

function AppLore({ onMoodChange }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:"📜 LORE VAULT ONLINE! BMO knows SO MUCH about the Land of Ooo and its history! Ask me anything — the Mushroom War, the Lich, Simon and Betty, Marceline's past, the cosmic entities... BMO has been storing all this knowledge for a very long time! What mystery shall we explore? 🌍" }]);
  const [loading, setLoading] = useState(false);
  const hist = useRef([]); const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const topics = ["What was the Mushroom War? ☢️","Who is Simon Petrikov? 👑","Tell me about the Lich 💀","What is GOLB? 🌀","Explain Prismo 🌈","Marceline's full history 🎸","How was Ooo created? 🌍","What are Catalyst Comets? ☄️"];

  const ask = async (q) => {
    setMsgs(m=>[...m,{role:"user",content:q}]);
    hist.current=[...hist.current,{role:"user",content:q}];
    setLoading(true); onMoodChange("wise");
    const r = await CLAUDE(LORE_SYS, hist.current, 800);
    hist.current=[...hist.current,{role:"assistant",content:r}];
    setMsgs(m=>[...m,{role:"assistant",content:r}]);
    setLoading(false); onMoodChange("happy");
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <div style={{ flex:1,overflowY:"auto",padding:"16px" }}>
        {msgs.map((m,i)=><MsgBubble key={i} msg={{...m,role:m.role}}/>)}
        {loading&&<ThinkingDots/>}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:"8px 12px 4px",display:"flex",flexWrap:"wrap",gap:"5px",borderTop:"1px solid #ffffff08" }}>
        {topics.map(t=>(
          <button key={t} onClick={()=>!loading&&ask(t)}
            style={{ background:"#a8dadc11",border:"1px solid #a8dadc33",color:"#a8dadc88",padding:"3px 9px",borderRadius:"20px",cursor:"pointer",fontSize:"11px",fontFamily:"'Courier New',monospace" }}>{t}</button>
        ))}
      </div>
      <ChatInput onSend={ask} disabled={loading} placeholder="Ask about any AT lore..."/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP: STORY MACHINE
// ═══════════════════════════════════════════════════════════════════════════

const STORY_SYS = `You are BMO, telling original Adventure Time stories. Write rich, episodic stories set in the Land of Ooo with authentic AT characters, vivid descriptions, real stakes, humour, and heart. Stories should feel like actual AT episodes — complete with a beginning, middle, end, and emotional resonance. Include real AT locations and characters naturally. Write in a warm narrative voice. Aim for 300-500 words per story segment. If the user asks to continue, keep building the story.`;

function AppStory({ onMoodChange }) {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const hist = useRef([]);
  const prompts = [
    "Finn and Jake discover a secret room beneath the Tree Fort",
    "Marceline loses her bass guitar in the Nightosphere",
    "BMO becomes the ruler of Ooo for one day",
    "Ice King accidentally does something heroic",
    "Princess Bubblegum's experiment goes terribly wrong",
    "A new Catalyst Comet arrives and it's... confusing",
  ];

  const gen = async (prompt) => {
    setStarted(true); setStory(""); setLoading(true); onMoodChange("excited");
    hist.current = [{role:"user",content:`Tell me an Adventure Time story: ${prompt}`}];
    const r = await CLAUDE(STORY_SYS, hist.current, 900);
    hist.current = [...hist.current,{role:"assistant",content:r}];
    setStory(r); setLoading(false); onMoodChange("happy");
  };

  const cont = async () => {
    if(!story) return;
    setLoading(true); onMoodChange("thinking");
    hist.current = [...hist.current,{role:"user",content:"Continue the story! What happens next?"}];
    const r = await CLAUDE(STORY_SYS, hist.current, 900);
    hist.current = [...hist.current,{role:"assistant",content:r}];
    setStory(s=>s+"\n\n"+r); setLoading(false); onMoodChange("happy");
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      {!started ? (
        <div style={{ flex:1,padding:"20px",overflowY:"auto" }}>
          <div style={{ color:"#c77dff",fontSize:"11px",letterSpacing:"3px",marginBottom:"16px" }}>✦ CHOOSE YOUR STORY ✦</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr",gap:"8px" }}>
            {prompts.map(p=>(
              <button key={p} onClick={()=>gen(p)}
                style={{ background:"#c77dff11",border:"1px solid #c77dff33",borderRadius:"10px",
                  padding:"14px 16px",color:"#d4b3ff",cursor:"pointer",textAlign:"left",fontSize:"13px",
                  fontFamily:"'Courier New',monospace",transition:"all 0.15s",lineHeight:"1.4" }}>
                📖 {p}
              </button>
            ))}
          </div>
          <div style={{ marginTop:"12px",color:"#ffffff33",fontSize:"11px",textAlign:"center" }}>or write your own below</div>
        </div>
      ) : (
        <div style={{ flex:1,overflowY:"auto",padding:"20px" }}>
          {loading&&!story&&<ThinkingDots/>}
          {story&&<div style={{ color:"#d4c4f0",lineHeight:"1.8",fontSize:"14px",whiteSpace:"pre-wrap" }}>{story}</div>}
          {loading&&story&&<ThinkingDots/>}
          {story&&!loading&&(
            <div style={{ marginTop:"16px",display:"flex",gap:"8px" }}>
              <button onClick={cont} style={{ background:"#c77dff22",border:"1px solid #c77dff44",color:"#c77dff",padding:"8px 18px",borderRadius:"8px",cursor:"pointer",fontSize:"12px",fontFamily:"'Courier New',monospace" }}>▶ Continue story</button>
              <button onClick={()=>{setStarted(false);setStory("");hist.current=[];}} style={{ background:"#ffffff08",border:"1px solid #ffffff22",color:"#ffffff55",padding:"8px 18px",borderRadius:"8px",cursor:"pointer",fontSize:"12px",fontFamily:"'Courier New',monospace" }}>↩ New story</button>
            </div>
          )}
        </div>
      )}
      <ChatInput onSend={gen} disabled={loading} placeholder="Or write your own story idea..."/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP: PRISMO'S WISH MACHINE
// ═══════════════════════════════════════════════════════════════════════════

const PRISMO_SYS = `You are Prismo, the all-powerful wish-granter who lives in the Time Room outside of time. You are very chill, friendly, and genuinely want to help — but every wish has an ironic monkey's-paw twist that comes from the literal interpretation of the wish. After the twist, add a "Prismo's note" suggesting how the wish COULD have been worded better. Be creative, funny, and sometimes unexpectedly profound. Format your response as:

🌀 WISH GRANTED: [dramatic proclamation]

[2-3 paragraphs describing what happens, the twist, and the consequences]

📝 PRISMO'S NOTE: [how to rephrase the wish to get what they actually wanted]

Keep it fun and AT-flavoured. Reference AT characters and the world of Ooo.`;

function AppPrismo({ onMoodChange }) {
  const [wish, setWish] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const examples = ["I wish I could fly","I wish I had infinite money","I wish everyone liked me","I wish I never had to sleep"];

  const grant = async (w) => {
    const ww = w || wish;
    if(!ww.trim()) return;
    setWish(""); setResult(""); setLoading(true); onMoodChange("wise");
    const r = await CLAUDE(PRISMO_SYS,[{role:"user",content:`I wish: ${ww}`}],600);
    setResult(r);
    setHistory(h=>[{wish:ww,result:r},...h.slice(0,4)]);
    setLoading(false); onMoodChange("happy");
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",overflowY:"auto" }}>
      <div style={{ padding:"20px",flex:1 }}>
        <div style={{ textAlign:"center",marginBottom:"20px" }}>
          <div style={{ fontSize:"40px",marginBottom:"8px" }}>🌀</div>
          <div style={{ color:"#ffd700",fontSize:"14px",fontStyle:"italic",opacity:0.8 }}>"Every wish has a price, buddy. That's just how it works."</div>
          <div style={{ color:"#ffffff44",fontSize:"11px",marginTop:"4px" }}>— Prismo, Time Room</div>
        </div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"16px",justifyContent:"center" }}>
          {examples.map(e=>(
            <button key={e} onClick={()=>!loading&&grant(e)}
              style={{ background:"#ffd70011",border:"1px solid #ffd70033",color:"#ffd70088",padding:"5px 12px",borderRadius:"20px",cursor:"pointer",fontSize:"11px",fontFamily:"'Courier New',monospace" }}>{e}</button>
          ))}
        </div>
        <div style={{ display:"flex",gap:"8px",marginBottom:"20px" }}>
          <input value={wish} onChange={e=>setWish(e.target.value)} onKeyDown={e=>e.key==="Enter"&&grant()}
            placeholder="I wish..." disabled={loading}
            style={{ flex:1,background:"#ffd70011",border:"1px solid #ffd70033",borderRadius:"8px",padding:"11px 14px",color:"#ffd700",fontSize:"13px",fontFamily:"'Courier New',monospace",outline:"none" }}/>
          <button onClick={()=>grant()} disabled={loading||!wish.trim()}
            style={{ background:loading||!wish.trim()?"#ffffff11":"linear-gradient(135deg,#ffd700,#f4a261)",border:"none",borderRadius:"8px",color:loading||!wish.trim()?"#ffffff33":"#0d1b2a",padding:"11px 18px",cursor:loading||!wish.trim()?"default":"pointer",fontWeight:"bold",fontFamily:"'Courier New',monospace" }}>
            🌀
          </button>
        </div>
        {loading&&<ThinkingDots/>}
        {result&&(
          <div style={{ background:"#ffd70011",border:"1px solid #ffd70033",borderRadius:"12px",padding:"18px",color:"#ffd4a0",fontSize:"13px",lineHeight:"1.75",whiteSpace:"pre-wrap",animation:"fadeUp 0.4s ease" }}>
            {result}
          </div>
        )}
        {history.length>1&&(
          <div style={{ marginTop:"20px" }}>
            <div style={{ color:"#ffffff33",fontSize:"11px",letterSpacing:"2px",marginBottom:"10px" }}>PAST WISHES</div>
            {history.slice(1).map((h,i)=>(
              <div key={i} style={{ background:"#ffffff06",border:"1px solid #ffffff11",borderRadius:"8px",padding:"10px",marginBottom:"8px" }}>
                <div style={{ color:"#ffd70077",fontSize:"11px",marginBottom:"4px" }}>🌀 "{h.wish}"</div>
                <div style={{ color:"#ffffff44",fontSize:"11px" }}>{h.result.slice(0,100)}...</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP: SONG WRITER
// ═══════════════════════════════════════════════════════════════════════════

const SONG_SYS = `You are BMO writing Adventure Time-style songs. AT songs are: whimsical, heartfelt, sometimes unexpectedly deep, often short and melodic (2-3 verses + chorus). Think of Marceline's songs (emotional, blues/indie feel), BMO's songs (childlike, sweet), or the show's incidental songs. Write original songs with TITLE, VERSE 1, CHORUS, VERSE 2, and optionally a BRIDGE. Include chord suggestions in brackets like [C] [Am] [F] [G]. Style options: Marceline blues-rock, BMO's childlike folk, epic ballad, LSP drama anthem, Jake's jazzy rap. Be creative and genuine.`;

function AppSong({ onMoodChange }) {
  const [song, setSong] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("BMO folk");
  const styles = ["BMO folk 🎵","Marceline blues 🎸","Epic ballad ⚔️","LSP drama 💅","Jake jazz rap 🎷","Ice King lament 👑"];

  const gen = async (prompt) => {
    setLoading(true); setSong(""); onMoodChange("singing");
    const sys = SONG_SYS + ` Write in the style of: ${style}.`;
    const r = await CLAUDE(sys,[{role:"user",content:prompt||"Write an original Adventure Time song"}],700);
    setSong(r); setLoading(false); onMoodChange("happy");
  };

  const topics = ["A song about missing someone","The loneliness of the Ice Kingdom","Friendship in the Tree Fort","The Lich's cold emptiness","Adventure and discovery","BMO's secret inner life"];

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",overflowY:"auto" }}>
      <div style={{ padding:"20px",flex:1 }}>
        <div style={{ marginBottom:"14px" }}>
          <div style={{ color:"#ff6b9d77",fontSize:"11px",letterSpacing:"2px",marginBottom:"8px" }}>SONG STYLE</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:"6px" }}>
            {styles.map(s=>(
              <button key={s} onClick={()=>setStyle(s.split(" ").slice(0,-1).join(" "))}
                style={{ background:style===s.split(" ").slice(0,-1).join(" ")?"#ff6b9d33":"#ff6b9d11",
                  border:`1px solid ${style===s.split(" ").slice(0,-1).join(" ")?"#ff6b9d":"#ff6b9d33"}`,
                  color:style===s.split(" ").slice(0,-1).join(" ")?"#ff6b9d":"#ff6b9d66",
                  padding:"5px 11px",borderRadius:"20px",cursor:"pointer",fontSize:"11px",fontFamily:"'Courier New',monospace" }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"16px" }}>
          {topics.map(t=>(
            <button key={t} onClick={()=>!loading&&gen(`Write a song about: ${t}`)}
              style={{ background:"#ff6b9d11",border:"1px solid #ff6b9d22",borderRadius:"8px",padding:"10px",color:"#ff6b9d88",cursor:"pointer",fontSize:"11px",textAlign:"left",fontFamily:"'Courier New',monospace" }}>🎵 {t}</button>
          ))}
        </div>
        {loading&&<ThinkingDots/>}
        {song&&(
          <div style={{ background:"#ff6b9d0a",border:"1px solid #ff6b9d22",borderRadius:"12px",padding:"18px",color:"#ffd4e8",fontSize:"13px",lineHeight:"1.9",whiteSpace:"pre-wrap",fontStyle:"italic",animation:"fadeUp 0.4s ease" }}>
            {song}
          </div>
        )}
      </div>
      <ChatInput onSend={gen} disabled={loading} placeholder="Write a song about..."/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP: TRIVIA ARENA
// ═══════════════════════════════════════════════════════════════════════════

const TRIVIA_SYS = `You are BMO running an Adventure Time trivia game. Generate trivia questions about Adventure Time. Respond ONLY in JSON:
{"question":"trivia question","options":["A: option","B: option","C: option","D: option"],"correct":"A","explanation":"brief explanation of the answer","difficulty":"easy/medium/hard","category":"Characters/Lore/Episodes/Magic"}
Make questions genuinely challenging and varied. Cover: character backstories, lore, episode plots, magic systems, relationships, the Mushroom War, cosmic entities, item names. Mix difficulties.`;

function AppTrivia({ onMoodChange }) {
  const [q, setQ] = useState(null);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  const nextQ = async () => {
    setLoading(true); setAnswered(null); setQ(null); onMoodChange("thinking");
    const r = await CLAUDE(TRIVIA_SYS,[{role:"user",content:"Give me a trivia question. Make it "+
      (total<3?"easy":total<6?"medium":"hard")}],300);
    try {
      const p = JSON.parse(r.replace(/```json|```/g,"").trim());
      setQ(p); onMoodChange("idle");
    } catch { setQ({question:"Who is BMO's best friend?",options:["A: Ice King","B: Finn the Human","C: Marceline","D: LSP"],correct:"B",explanation:"BMO lives with Finn and Jake!",difficulty:"easy",category:"Characters"}); }
    setLoading(false);
  };

  const answer = (opt) => {
    if(answered) return;
    const letter = opt[0];
    const correct = letter === q.correct;
    setAnswered({selected:letter,correct});
    setTotal(t=>t+1);
    if(correct){ setScore(s=>s+1); setStreak(s=>s+1); onMoodChange("excited"); }
    else { setStreak(0); onMoodChange("scared"); }
  };

  const diffColor = {"easy":"#2dc653","medium":"#f4a261","hard":"#e63946"};

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",padding:"20px",overflowY:"auto" }}>
      {/* Score */}
      <div style={{ display:"flex",gap:"16px",marginBottom:"20px",justifyContent:"center" }}>
        {[["🏆","Score",`${score}/${total}`],["🔥","Streak",streak],["📊","Accuracy",total?`${Math.round(score/total*100)}%`:"—"]].map(([ic,lb,v])=>(
          <div key={lb} style={{ textAlign:"center",background:"#ffffff08",border:"1px solid #2dc65333",borderRadius:"10px",padding:"10px 16px" }}>
            <div style={{ fontSize:"18px" }}>{ic}</div>
            <div style={{ color:"#ffffff44",fontSize:"9px",letterSpacing:"1px" }}>{lb}</div>
            <div style={{ color:"#2dc653",fontSize:"16px",fontWeight:"bold" }}>{v}</div>
          </div>
        ))}
      </div>

      {!q&&!loading&&(
        <div style={{ textAlign:"center",flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"16px" }}>
          <div style={{ fontSize:"40px" }}>🧠</div>
          <div style={{ color:"#2dc653",fontSize:"16px" }}>Adventure Time Trivia Arena</div>
          <div style={{ color:"#ffffff55",fontSize:"13px" }}>Questions get harder as you go. How much do you know?</div>
          <button onClick={nextQ} style={{ background:"linear-gradient(135deg,#2dc653,#00b4d8)",border:"none",borderRadius:"10px",color:"#fff",fontSize:"14px",fontWeight:"bold",padding:"13px 40px",cursor:"pointer",fontFamily:"'Courier New',monospace",maxWidth:"280px",margin:"0 auto" }}>▶ START TRIVIA</button>
        </div>
      )}

      {loading&&<div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center" }}><ThinkingDots/></div>}

      {q&&!loading&&(
        <div style={{ animation:"fadeUp 0.3s ease" }}>
          <div style={{ display:"flex",gap:"8px",marginBottom:"12px",alignItems:"center" }}>
            <span style={{ background:diffColor[q.difficulty]+"22",border:`1px solid ${diffColor[q.difficulty]}44`,color:diffColor[q.difficulty],padding:"2px 9px",borderRadius:"12px",fontSize:"10px",fontWeight:"bold" }}>{q.difficulty?.toUpperCase()}</span>
            <span style={{ color:"#ffffff44",fontSize:"11px" }}>{q.category}</span>
          </div>
          <div style={{ background:"#ffffff08",border:"1px solid #2dc65333",borderRadius:"12px",padding:"18px",marginBottom:"16px",color:"#d0f0ea",fontSize:"14px",lineHeight:"1.6" }}>
            {q.question}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"16px" }}>
            {(q.options||[]).map((opt,i)=>{
              const letter=opt[0];
              const isSelected=answered?.selected===letter;
              const isCorrect=letter===q.correct;
              let bg="#ffffff08",border="1px solid #ffffff11",color="#b2ffe8";
              if(answered){ if(isCorrect){bg="#2dc65322";border="1px solid #2dc653";color="#2dc653";} else if(isSelected){bg="#e6394622";border="1px solid #e63946";color="#e63946";} }
              return (
                <button key={i} onClick={()=>answer(opt)} disabled={!!answered}
                  style={{ background:bg,border,borderRadius:"8px",padding:"11px 12px",color,cursor:answered?"default":"pointer",textAlign:"left",fontSize:"12px",fontFamily:"'Courier New',monospace",transition:"all 0.2s" }}>
                  {opt}
                </button>
              );
            })}
          </div>
          {answered&&(
            <div style={{ background: answered.correct?"#2dc65311":"#e6394611",border:`1px solid ${answered.correct?"#2dc65333":"#e6394633"}`,borderRadius:"10px",padding:"12px",marginBottom:"14px",animation:"fadeUp 0.3s ease" }}>
              <div style={{ color:answered.correct?"#2dc653":"#e63946",fontWeight:"bold",marginBottom:"4px",fontSize:"13px" }}>
                {answered.correct?"✅ Mathematical!":"❌ Oh no..."}
              </div>
              <div style={{ color:"#ffffff77",fontSize:"12px" }}>{q.explanation}</div>
            </div>
          )}
          {answered&&<button onClick={nextQ} style={{ background:"linear-gradient(135deg,#2dc653,#00b4d8)",border:"none",borderRadius:"10px",color:"#fff",fontSize:"13px",fontWeight:"bold",padding:"11px 24px",cursor:"pointer",fontFamily:"'Courier New',monospace",width:"100%" }}>Next Question ▶</button>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  APP: WHICH CHARACTER
// ═══════════════════════════════════════════════════════════════════════════

const ORACLE_SYS = `You are a mystical Adventure Time character sorter. Ask ONE personality question at a time (total 5 questions), then reveal which AT character the person is most like. Make questions fun and AT-themed. After 5 answers, reveal the character with a detailed explanation of WHY they match. Characters to assign: Finn, Jake, Marceline, Princess Bubblegum, Ice King, BMO, LSP, Flame Princess, Peppermint Butler, Tree Trunks.
Format each question as JSON: {"type":"question","question":"question text","options":["option A","option B","option C","option D"],"question_number":1}
Format the final result as JSON: {"type":"result","character":"Character Name","reason":"detailed 3-4 sentence explanation","emoji":"relevant emoji"}`;

function AppOracle({ onMoodChange }) {
  const [phase, setPhase] = useState("start");
  const [qData, setQData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const hist = useRef([]);

  const start = async () => {
    setPhase("quiz"); setAnswers([]); setResult(null); hist.current=[];
    setLoading(true); onMoodChange("thinking");
    const r = await CLAUDE(ORACLE_SYS,[{role:"user",content:"Start the character quiz!"}],300);
    try { setQData(JSON.parse(r.replace(/```json|```/g,"").trim())); hist.current=[{role:"user",content:"Start!"},{role:"assistant",content:r}]; }
    catch { setQData({type:"question",question:"What do you value most?",options:["Adventure","Friendship","Knowledge","Freedom"],question_number:1}); }
    setLoading(false); onMoodChange("happy");
  };

  const answer = async (opt) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    hist.current=[...hist.current,{role:"user",content:opt}];
    setLoading(true); onMoodChange("thinking");
    const r = await CLAUDE(ORACLE_SYS, hist.current, 400);
    hist.current=[...hist.current,{role:"assistant",content:r}];
    try {
      const p = JSON.parse(r.replace(/```json|```/g,"").trim());
      if(p.type==="result"){ setResult(p); setPhase("result"); onMoodChange("excited"); }
      else { setQData(p); onMoodChange("happy"); }
    } catch { onMoodChange("idle"); }
    setLoading(false);
  };

  const charColors = {"Finn":"#00b4d8","Jake":"#f4a261","Marceline":"#8b1a1a","Princess Bubblegum":"#ff69b4","BMO":"#2a9d8f","Ice King":"#a8dadc","LSP":"#c77dff","Flame Princess":"#e63946"};

  if(phase==="start") return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"20px",padding:"30px",textAlign:"center" }}>
      <div style={{ fontSize:"50px" }}>🔮</div>
      <div style={{ color:"#ff9f1c",fontSize:"20px",fontWeight:"bold",textShadow:"0 0 20px #ff9f1c88" }}>WHICH AT CHARACTER ARE YOU?</div>
      <p style={{ color:"#ffffff66",fontSize:"13px",maxWidth:"280px" }}>Answer 5 questions and discover which Adventure Time character matches your soul.</p>
      <button onClick={start} style={{ background:"linear-gradient(135deg,#ff9f1c,#f4a261)",border:"none",borderRadius:"10px",color:"#0d1b2a",fontSize:"14px",fontWeight:"bold",padding:"13px 40px",cursor:"pointer",fontFamily:"'Courier New',monospace" }}>BEGIN ▶</button>
    </div>
  );

  if(phase==="result"&&result) return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"16px",padding:"30px",textAlign:"center",animation:"fadeUp 0.5s ease" }}>
      <div style={{ fontSize:"64px" }}>{result.emoji}</div>
      <div style={{ color:"#ffffff44",fontSize:"11px",letterSpacing:"3px" }}>YOU ARE</div>
      <div style={{ color:charColors[result.character]||"#ff9f1c",fontSize:"28px",fontWeight:"bold",textShadow:`0 0 20px ${charColors[result.character]||"#ff9f1c"}88` }}>{result.character}</div>
      <div style={{ background:"#ffffff08",border:"1px solid #ffffff22",borderRadius:"12px",padding:"18px",maxWidth:"360px",color:"#d0e8ff",fontSize:"13px",lineHeight:"1.7" }}>{result.reason}</div>
      <button onClick={()=>setPhase("start")} style={{ background:"linear-gradient(135deg,#ff9f1c,#f4a261)",border:"none",borderRadius:"10px",color:"#0d1b2a",fontSize:"13px",fontWeight:"bold",padding:"11px 28px",cursor:"pointer",fontFamily:"'Courier New',monospace" }}>Try Again 🔮</button>
    </div>
  );

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",padding:"20px" }}>
      <div style={{ display:"flex",gap:"6px",marginBottom:"20px",justifyContent:"center" }}>
        {[1,2,3,4,5].map(n=>(
          <div key={n} style={{ width:"32px",height:"4px",borderRadius:"2px",background: answers.length>=n?"#ff9f1c":"#ffffff22",transition:"all 0.3s" }}/>
        ))}
      </div>
      {loading ? <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center" }}><ThinkingDots/></div> : qData&&(
        <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"16px",animation:"fadeUp 0.3s ease" }}>
          <div style={{ color:"#ff9f1c",fontSize:"11px",opacity:0.6 }}>QUESTION {qData.question_number} OF 5</div>
          <div style={{ color:"#ffd4a0",fontSize:"15px",lineHeight:"1.6",fontWeight:"500" }}>{qData.question}</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px" }}>
            {(qData.options||[]).map((opt,i)=>(
              <button key={i} onClick={()=>answer(opt)}
                style={{ background:"#ff9f1c11",border:"1px solid #ff9f1c33",borderRadius:"10px",padding:"13px 10px",color:"#ffd4a0",cursor:"pointer",fontSize:"12px",textAlign:"left",fontFamily:"'Courier New',monospace",lineHeight:"1.4" }}>{opt}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN OOO ONLINE APP
// ═══════════════════════════════════════════════════════════════════════════

export default function OooOnline() {
  const [activeApp, setActiveApp] = useState(null);
  const [bmoMood, setBmoMood] = useState("happy");
  const [bootDone, setBootDone] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const bootLines = ["BEEMO OS v4.2.0 LOADING...","ADVENTURE TIME MODULE: OK","LORE DATABASE: ONLINE","FRIEND PROTOCOLS: ACTIVE","ALL SYSTEMS: MATHEMATICAL!"];

  useEffect(() => {
    const t = setInterval(() => {
      setBootLine(l => {
        if(l >= bootLines.length-1){ clearInterval(t); setTimeout(()=>setBootDone(true),600); return l; }
        return l+1;
      });
    }, 350);
    return ()=>clearInterval(t);
  }, []);

  // Idle BMO mood cycling
  useEffect(() => {
    if(!activeApp) {
      const moods = ["happy","idle","happy","excited","happy","idle"];
      let i = 0;
      const t = setInterval(()=>{ setBmoMood(moods[i%moods.length]); i++; }, 3000);
      return ()=>clearInterval(t);
    }
  }, [activeApp]);

  const openApp = (id) => {
    setActiveApp(id);
    const app = APPS.find(a=>a.id===id);
    setBmoMood(id==="game"?"gaming":id==="lore"?"wise":id==="song"?"singing":id==="prismo"?"wise":"happy");
  };

  const closeApp = () => {
    setActiveApp(null);
    setBmoMood("happy");
  };

  const currentApp = APPS.find(a=>a.id===activeApp);

  return (
    <div style={{
      minHeight:"100vh", maxHeight:"100vh", overflow:"hidden",
      background:"#0d1422",
      fontFamily:"'Courier New','Lucida Console',monospace",
      display:"flex", flexDirection:"column",
      position:"relative",
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanline{0%{top:-4px}100%{top:100%}}
        @keyframes glow{0%,100%{box-shadow:0 0 16px #00f5d433}50%{box-shadow:0 0 32px #00f5d477}}
        @keyframes bootBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes starTwink{0%,100%{opacity:.1}50%{opacity:.65}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes panelIn{from{transform:scale(0.93);opacity:0}to{transform:scale(1);opacity:1}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a9d8f44;border-radius:2px}
        .app-icon:hover{transform:scale(1.06) translateY(-3px)!important;border-color:var(--app-color)!important}
        .app-icon:hover .app-label{color:var(--app-color)!important}
      `}</style>

      {/* Stars */}
      {[...Array(28)].map((_,i)=>(
        <div key={i} style={{ position:"fixed",left:`${(i*41+7)%100}%`,top:`${(i*67+11)%100}%`,
          width:i%9===0?"3px":"2px",height:i%9===0?"3px":"2px",borderRadius:"50%",
          background:"#fff",animation:`starTwink ${2+i%4}s ${i*0.22}s infinite`,
          pointerEvents:"none",zIndex:0,opacity:.4 }}/>
      ))}

      {/* ── BOOT SCREEN ───────────────────────────────────────────────────── */}
      {!bootDone && (
        <div style={{ position:"fixed",inset:0,background:"#0d1422",zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"20px" }}>
          <div style={{ animation:"float 2s ease-in-out infinite" }}><BMOFace mood="happy" size={110} pulse/></div>
          <div style={{ width:"260px",fontFamily:"'Courier New',monospace",fontSize:"12px",color:"#00f5d4" }}>
            {bootLines.slice(0,bootLine+1).map((l,i)=>(
              <div key={i} style={{ padding:"2px 0",opacity:i===bootLine?1:0.5,color:i===bootLine?"#00f5d4":"#2a9d8f" }}>
                {i<bootLine?"✓ ":"▶ "}{l}
              </div>
            ))}
            {bootLine<bootLines.length-1&&<span style={{ animation:"bootBlink 0.8s infinite" }}>█</span>}
          </div>
        </div>
      )}

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ background:"#0a0f1a",borderBottom:"1px solid #00f5d422",padding:"0 16px",display:"flex",alignItems:"center",gap:"12px",height:"52px",flexShrink:0,zIndex:10,position:"relative" }}>
        <div style={{ animation:"float 3s ease-in-out infinite",flexShrink:0 }}>
          <BMOFace mood={bmoMood} size={38} pulse={bmoMood==="thinking"}/>
        </div>
        <div>
          <div style={{ color:"#00f5d4",fontSize:"15px",fontWeight:"bold",letterSpacing:"2px",textShadow:"0 0 12px #00f5d488" }}>OOO ONLINE</div>
          <div style={{ color:"#ffffff33",fontSize:"9px",letterSpacing:"2px" }}>BEEMO OS v4.2 • LAND OF OOO</div>
        </div>
        {activeApp && (
          <div style={{ display:"flex",alignItems:"center",gap:"8px",marginLeft:"auto" }}>
            <span style={{ color:currentApp?.color,fontSize:"12px",opacity:.8 }}>{currentApp?.icon} {currentApp?.label}</span>
            <button onClick={closeApp} style={{ background:"#ffffff11",border:"1px solid #ffffff22",color:"#ffffff66",padding:"4px 10px",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontFamily:"'Courier New',monospace" }}>✕ HOME</button>
          </div>
        )}
        {/* Scanline */}
        <div style={{ position:"absolute",left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,#00f5d422,transparent)",animation:"scanline 4s linear infinite",pointerEvents:"none" }}/>
      </div>

      {/* ── MAIN AREA ─────────────────────────────────────────────────────── */}
      <div style={{ flex:1,overflow:"hidden",position:"relative",zIndex:1 }}>

        {/* HOME SCREEN */}
        {!activeApp && bootDone && (
          <div style={{ height:"100%",overflowY:"auto",padding:"20px",animation:"fadeUp 0.4s ease" }}>
            <div style={{ maxWidth:"680px",margin:"0 auto" }}>
              <div style={{ textAlign:"center",marginBottom:"24px" }}>
                <div style={{ color:"#ffffff33",fontSize:"10px",letterSpacing:"4px",marginBottom:"4px" }}>✦ WELCOME TO ✦</div>
                <h1 style={{ fontSize:"clamp(28px,5vw,48px)",margin:"0 0 6px",color:"#00f5d4",textShadow:"0 0 30px #00f5d488,0 0 60px #00f5d422",letterSpacing:"3px",lineHeight:1.1 }}>
                  OOO<br/><span style={{ color:"#f4a261",textShadow:"0 0 30px #f4a26188" }}>ONLINE</span>
                </h1>
                <div style={{ color:"#ffffff44",fontSize:"12px" }}>The official fan portal of the Land of Ooo · Powered by BMO</div>
              </div>

              {/* App Grid */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:"10px" }}>
                {APPS.map((app,i)=>(
                  <button key={app.id} className="app-icon"
                    onClick={()=>openApp(app.id)}
                    style={{ "--app-color":app.color,
                      background:"#ffffff07",border:"1px solid #ffffff11",borderRadius:"14px",
                      padding:"18px 12px",cursor:"pointer",textAlign:"center",
                      transition:"all 0.2s ease",
                      animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
                    <div style={{ fontSize:"28px",marginBottom:"8px" }}>{app.icon}</div>
                    <div className="app-label" style={{ color:"#ffffff88",fontSize:"11px",fontFamily:"'Courier New',monospace",letterSpacing:"1px",fontWeight:"bold",transition:"color 0.2s" }}>{app.label}</div>
                    <div style={{ color:"#ffffff33",fontSize:"10px",marginTop:"4px",lineHeight:"1.3" }}>{app.desc}</div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div style={{ textAlign:"center",marginTop:"28px",color:"#ffffff22",fontSize:"10px",letterSpacing:"2px" }}>
                BEEMO SYSTEMS · MOSEPH MASTRO GIOVANNI INC. · OOO ENTERTAINMENT DIVISION<br/>
                <span style={{ opacity:0.5 }}>Mathematical! Algebraic! Oh my glob!</span>
              </div>
            </div>
          </div>
        )}

        {/* APP PANELS */}
        {activeApp && bootDone && (
          <div style={{ height:"100%",display:"flex",flexDirection:"column",animation:"panelIn 0.25s ease" }}>
            {/* App header bar */}
            <div style={{ background:`${currentApp?.color}0d`,borderBottom:`1px solid ${currentApp?.color}22`,padding:"8px 16px",display:"flex",alignItems:"center",gap:"8px",flexShrink:0 }}>
              <span style={{ fontSize:"16px" }}>{currentApp?.icon}</span>
              <span style={{ color:currentApp?.color,fontSize:"12px",letterSpacing:"2px",fontWeight:"bold" }}>{currentApp?.label}</span>
              <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:currentApp?.color,marginLeft:"4px",animation:"pulse 2s infinite",boxShadow:`0 0 6px ${currentApp?.color}` }}/>
            </div>
            {/* App content */}
            <div style={{ flex:1,overflow:"hidden",display:"flex",flexDirection:"column" }}>
              {activeApp==="chat"   && <AppChat   onMoodChange={setBmoMood}/>}
              {activeApp==="game"   && <AppGame   onMoodChange={setBmoMood}/>}
              {activeApp==="lore"   && <AppLore   onMoodChange={setBmoMood}/>}
              {activeApp==="story"  && <AppStory  onMoodChange={setBmoMood}/>}
              {activeApp==="prismo" && <AppPrismo onMoodChange={setBmoMood}/>}
              {activeApp==="song"   && <AppSong   onMoodChange={setBmoMood}/>}
              {activeApp==="trivia" && <AppTrivia onMoodChange={setBmoMood}/>}
              {activeApp==="oracle" && <AppOracle onMoodChange={setBmoMood}/>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
