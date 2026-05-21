/* ----- Compass AI · Full screen chat route ----- */
const ScreenCompass = () => {
  const { back, go } = useRoute();
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState([
    {
      role:"assistant",
      text:"Hey Adaeze 👋 I noticed you saved Asake's Lungu Boy Tour. Want me to pair it with a Lagos hotel and a flight from Abuja?",
      chips:["Bundle it","Just the event","Find cheaper date"],
    }
  ]);

  const send = (text) => {
    if (!text.trim()) return;
    const next = [...messages, { role: "user", text }];
    next.push({
      role: "assistant",
      text: "I found 3 flights from Abuja on Friday evening — Air Peace is ₦62,500 (down 12%). Pair with 2 nights at Eko Hotel: total ₦285,000 (save ₦18k).",
      chips: ["Show me", "Different dates"],
      card: { title: "Bundle · Asake VIP weekend", price: 285000, savings: 18000 }
    });
    setMessages(next);
    setQ("");
  };

  const suggestions = [
    { icon:"music",   t:"What's hot in Lagos tonight?", to:{name:"search"} },
    { icon:"plane",   t:"Cheap flights LOS → ABV",     to:{name:"flights"} },
    { icon:"bed",     t:"Romantic beach weekend",      to:{name:"hotels"} },
    { icon:"sparkle", t:"Plan Detty December",         to:{name:"search"} },
    { icon:"bus",     t:"Bus to PHC under ₦20k",       to:{name:"buses"} },
  ];

  return (
    <div className="screen-enter" style={{minHeight:'100%', display:'flex', flexDirection:'column'}}>
      {/* Header */}
      <div style={{
        padding:'12px 8px 12px', display:'flex', alignItems:'center', gap:8,
        borderBottom:'0.5px solid var(--line)', background:'var(--surface)',
      }}>
        <button onClick={back} className="icon-btn" style={{border:0, background:'transparent'}}>
          <Icon name="chevronLeft" size={22}/>
        </button>
        <div className="row gap-2" style={{flex:1, alignItems:'center'}}>
          <div style={{
            width:32, height:32, borderRadius:'50%',
            background: 'conic-gradient(from 0deg, var(--accent), oklch(0.70 0.18 170), oklch(0.65 0.18 200), oklch(0.60 0.16 230), var(--accent))',
            animation:'rotate 5s linear infinite',
          }}/>
          <div>
            <div style={{fontWeight:600, fontSize:15}}>Compass</div>
            <div className="text-xs muted">Your AI booking assistant</div>
          </div>
        </div>
        <button className="icon-btn" style={{width:34, height:34}}><Icon name="settings" size={16}/></button>
      </div>

      {/* Messages */}
      <div style={{flex:1, overflowY:'auto', padding:'16px', paddingBottom:24, minHeight:200}}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12, gap:8, alignItems:'flex-end',
          }}>
            {m.role === 'assistant' && (
              <div style={{
                width:24, height:24, borderRadius:'50%', flexShrink:0,
                background: 'conic-gradient(from 0deg, var(--accent), oklch(0.70 0.18 170), oklch(0.65 0.18 200), oklch(0.60 0.16 230), var(--accent))',
                animation:'rotate 5s linear infinite',
              }}/>
            )}
            <div style={{
              maxWidth: '78%',
              padding:'10px 14px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? 'var(--accent)' : 'var(--surface-2)',
              color: m.role === 'user' ? 'white' : 'var(--ink)',
              fontSize:14, lineHeight:1.45,
            }}>
              {m.text}
              {m.card && (
                <button onClick={() => go({name:"event", id:"e3"})} style={{
                  marginTop:10, padding:12, background: m.role === 'user' ? 'oklch(1 0 0 / .12)' : 'var(--surface)',
                  borderRadius:12, color: m.role === 'user' ? 'white' : 'var(--ink)',
                  textAlign:'left', width:'100%',
                }}>
                  <div className="text-xs" style={{opacity:.7}}>{m.card.title}</div>
                  <div className="h-4 tnum mt-1">{formatNGN(m.card.price)}</div>
                  <div className="text-xs accent-text mt-1">Save {formatNGN(m.card.savings)}</div>
                </button>
              )}
              {m.chips && (
                <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:10}}>
                  {m.chips.map(c => (
                    <button key={c} onClick={() => send(c)} style={{
                      padding:'6px 10px', borderRadius:999,
                      background: m.role === 'user' ? 'oklch(1 0 0 / .2)' : 'var(--surface)',
                      color: m.role === 'user' ? 'white' : 'var(--ink)',
                      fontSize:12, fontWeight:500,
                      border: m.role === 'user' ? 0 : '1px solid var(--line)',
                    }}>{c}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {messages.length <= 1 && (
          <div style={{marginTop:16}}>
            <div className="eyebrow mb-3">Try asking</div>
            <div className="col gap-2">
              {suggestions.map(s => (
                <button key={s.t} onClick={() => { send(s.t); }} style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'12px 14px', borderRadius:14,
                  background:'var(--surface)', border:'1px solid var(--line)',
                  textAlign:'left',
                }}>
                  <div style={{width:30, height:30, borderRadius:8, background:'var(--accent-soft)', color:'var(--accent)', display:'grid', placeItems:'center', flexShrink:0}}>
                    <Icon name={s.icon} size={16}/>
                  </div>
                  <span style={{flex:1, fontSize:14}}>{s.t}</span>
                  <Icon name="arrow" size={14}/>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{padding:'10px 12px', borderTop:'0.5px solid var(--line)', background:'var(--surface)'}}>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'6px 6px 6px 14px', borderRadius:24,
          background:'var(--surface-2)', border:'1px solid var(--line)',
        }}>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(q)}
            placeholder="Ask Compass anything…"
            style={{flex:1, background:'transparent', border:0, outline:'none', fontSize:14, minWidth:0}}
          />
          <button className="icon-btn" style={{width:34, height:34}}><Icon name="mic" size={14}/></button>
          <button onClick={() => send(q)} style={{
            width:38, height:38, borderRadius:'50%',
            background:'var(--accent)', color:'white',
            display:'grid', placeItems:'center',
          }}>
            <Icon name="send" size={15}/>
          </button>
        </div>
        <div className="text-xs muted-2 text-c mt-2" style={{fontSize:10}}>Powered by Compass Intelligence · NDPR safe</div>
      </div>
    </div>
  );
};

window.ScreenCompass = ScreenCompass;
