/* ----- Compass AI Co-pilot (floating) ----- */
const Copilot = ({ enabled = true }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { go } = useRoute();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-copilot', handler);
    return () => window.removeEventListener('open-copilot', handler);
  }, []);

  if (!enabled) return null;

  const suggestions = [
    { icon:"music",  text:"What's hot tonight in Lagos?",                 to:{ name:"search", q:"tonight" } },
    { icon:"plane",  text:"Cheapest LOS → ABV flight this Friday",        to:{ name:"flights" } },
    { icon:"bed",    text:"Romantic weekend stay near the beach",         to:{ name:"hotels" } },
    { icon:"sparkle",text:"Plan a Detty December trip for 4 people",      to:{ name:"search", q:"detty" } },
    { icon:"bus",    text:"Bus to PHC tomorrow under ₦20,000",            to:{ name:"buses" } },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position:'fixed', right:24, bottom:24, zIndex:60,
          width:60, height:60, borderRadius:'50%',
          background:'linear-gradient(135deg, var(--accent), oklch(0.55 0.18 180), oklch(0.50 0.18 200))',
          boxShadow:'0 20px 40px -10px oklch(0.50 0.18 152 / .55), 0 0 60px -10px var(--accent-glow)',
          display:'grid', placeItems:'center',
          color:'white', border:'2px solid oklch(1 0 0 / .15)',
        }}
        aria-label="Open Compass AI"
      >
        <Icon name="sparkle" size={22}/>
      </button>

      {open && (
        <div className="glass" style={{
          position:'fixed', right:24, bottom:96, zIndex:60,
          width:420, maxHeight:'70vh',
          borderRadius:'var(--r-5)',
          boxShadow:'var(--shadow-lg)',
          display:'flex', flexDirection:'column',
          overflow:'hidden',
        }}>
          <div style={{padding:'18px 20px', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', gap:12}}>
            <div className="ai-dot" style={{width:28, height:28}}/>
            <div style={{flex:1}}>
              <div className="h-4">Compass</div>
              <div className="text-xs muted">Your AI booking assistant</div>
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)} style={{width:32, height:32}}>
              <Icon name="close" size={14}/>
            </button>
          </div>

          <div style={{padding:'20px', flex:1, overflowY:'auto'}}>
            <div className="card" style={{padding:16, background:'var(--surface-2)', marginBottom:18}}>
              <div className="row gap-3" style={{alignItems:'flex-start'}}>
                <div className="ai-dot" style={{width:22, height:22, flexShrink:0, marginTop:2}}/>
                <div style={{fontSize:13.5, lineHeight:1.55}}>
                  Welcome back, <span className="fw-600">Adaeze</span>. I noticed you saved <span className="accent-text">Asake — Lungu Boy Tour</span>. Want me to:
                  <ul style={{margin:'10px 0 0', paddingLeft:18, color:'var(--ink-2)'}}>
                    <li>Pair it with a Lagos hotel stay?</li>
                    <li>Find a flight from Abuja for that weekend?</li>
                    <li>Group your friends for VIP table booking?</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="eyebrow mb-3">Suggested prompts</div>
            <div className="col gap-2">
              {suggestions.map((s, i) => (
                <button key={i} className="card" style={{
                  padding:'12px 14px', textAlign:'left',
                  display:'flex', alignItems:'center', gap:12,
                  cursor:'pointer',
                }}
                  onClick={() => { setOpen(false); go(s.to); }}>
                  <Icon name={s.icon} size={16} />
                  <span style={{flex:1, fontSize:13.5}}>{s.text}</span>
                  <Icon name="arrow" size={14}/>
                </button>
              ))}
            </div>
          </div>

          <div style={{padding:14, borderTop:'1px solid var(--line)'}}>
            <div style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'8px 8px 8px 14px', borderRadius:'var(--r-pill)',
              background:'var(--surface-2)', border:'1px solid var(--line)',
            }}>
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Ask Compass anything…"
                style={{flex:1, background:'transparent', border:0, outline:'none', fontSize:14}}
              />
              <button className="icon-btn" style={{width:32, height:32}}>
                <Icon name="mic" size={14}/>
              </button>
              <button className="btn btn-accent btn-sm" style={{padding:'8px 12px'}}>
                <Icon name="send" size={13}/>
              </button>
            </div>
            <div className="row gap-3 mt-3" style={{justifyContent:'center', fontSize:11, color:'var(--ink-4)'}}>
              <span>Powered by Compass Intelligence · NDPR safe</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

window.Copilot = Copilot;
