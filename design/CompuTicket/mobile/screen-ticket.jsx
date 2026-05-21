/* ===== TICKET QR AT THE GATE ===== */
const ScreenTicket = () => {
  const { back, go } = useRoute();
  const [scanned, setScanned] = useState(false);
  const [brightness, setBrightness] = useState(true);

  useEffect(() => {
    // Auto-scan after 4s for demo
    const t = setTimeout(() => setScanned(true), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="screen-enter" style={{
      minHeight:'100%',
      background: scanned
        ? 'linear-gradient(180deg, oklch(0.55 0.18 152), oklch(0.40 0.15 152))'
        : 'linear-gradient(180deg, oklch(0.06 0.02 152), oklch(0.10 0.04 152))',
      color: 'white',
      paddingBottom:80,
      transition:'background .6s',
    }}>
      {/* Header */}
      <div style={{
        padding:'12px 8px',
        display:'flex', alignItems:'center', gap:8,
      }}>
        <button onClick={back} style={{
          width:40, height:40, display:'grid', placeItems:'center', borderRadius:'50%',
          background:'oklch(1 0 0 / .15)', color:'white',
        }}>
          <Icon name="chevronLeft" size={22}/>
        </button>
        <div style={{flex:1, textAlign:'center', fontSize:15, fontWeight:600}}>My Tickets</div>
        <button style={{
          width:40, height:40, display:'grid', placeItems:'center', borderRadius:'50%',
          background:'oklch(1 0 0 / .15)', color:'white',
        }}>
          <Icon name="settings" size={18}/>
        </button>
      </div>

      <div style={{padding:'8px 16px'}}>
        {/* Pass selector pill */}
        <div className="row gap-1" style={{justifyContent:'center', marginBottom:12}}>
          <span style={{width:24, height:4, borderRadius:2, background:'oklch(1 0 0 / .85)'}}/>
          <span style={{width:8, height:4, borderRadius:2, background:'oklch(1 0 0 / .35)'}}/>
          <span style={{width:8, height:4, borderRadius:2, background:'oklch(1 0 0 / .35)'}}/>
        </div>
        <div className="text-xs text-c" style={{opacity:.75, marginBottom:14}}>1 of 3 active passes · Swipe →</div>

        {/* The pass */}
        <div style={{
          background:'white',
          borderRadius:24,
          padding:0,
          overflow:'hidden',
          color:'oklch(0.18 0.04 152)',
          boxShadow:'0 30px 80px oklch(0 0 0 / .35)',
        }}>
          {/* Header band */}
          <div className="ph ph-1 ph-noise" style={{height:120, position:'relative'}}>
            <div className="stars"/>
            <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 30%, oklch(0 0 0 / .65))'}}/>
            <div style={{position:'absolute', top:12, left:14, right:14, display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <Brand size={28}/>
              <span className="badge badge-vip">VIP × 2</span>
            </div>
            <div style={{position:'absolute', left:14, right:14, bottom:12, color:'white'}}>
              <div className="mono text-xs" style={{opacity:.85, letterSpacing:'.14em'}}>EVENT</div>
              <div className="serif" style={{fontSize:24, lineHeight:1.0, marginTop:2}}>Burna Boy — African Giant Returns</div>
            </div>
          </div>

          {/* Details */}
          <div style={{padding:'18px 20px 0'}}>
            <div className="row" style={{gap:0}}>
              <div style={{flex:1}}>
                <div className="text-xs muted">Date</div>
                <div className="fw-600 mt-1" style={{fontSize:14, color:'oklch(0.18 0.04 152)'}}>Sat 23 May</div>
                <div className="text-xs muted mt-1">9:00 PM · Doors 7</div>
              </div>
              <div style={{flex:1}}>
                <div className="text-xs muted">Venue</div>
                <div className="fw-600 mt-1" style={{fontSize:14, color:'oklch(0.18 0.04 152)'}}>Eko Convention</div>
                <div className="text-xs muted mt-1">Victoria Island</div>
              </div>
            </div>
            <div className="row mt-3" style={{gap:0}}>
              <div style={{flex:1}}>
                <div className="text-xs muted">Holder</div>
                <div className="fw-600 mt-1" style={{fontSize:14, color:'oklch(0.18 0.04 152)'}}>Adaeze Okafor</div>
              </div>
              <div style={{flex:1}}>
                <div className="text-xs muted">Gate</div>
                <div className="fw-600 mt-1 mono" style={{fontSize:14, color:'oklch(0.18 0.04 152)'}}>A · Lane 2</div>
              </div>
              <div style={{flex:1}}>
                <div className="text-xs muted">Seats</div>
                <div className="fw-600 mt-1 mono" style={{fontSize:14, color:'oklch(0.18 0.04 152)'}}>E·8, E·9</div>
              </div>
            </div>
          </div>

          {/* Perforation */}
          <div style={{
            position:'relative', height:32, margin:'18px 0 0',
          }}>
            <div style={{position:'absolute', top:'50%', left:-10, width:20, height:20, background:scanned?'oklch(0.55 0.18 152)':'oklch(0.06 0.02 152)', borderRadius:'50%', transform:'translateY(-50%)'}}/>
            <div style={{position:'absolute', top:'50%', right:-10, width:20, height:20, background:scanned?'oklch(0.55 0.18 152)':'oklch(0.06 0.02 152)', borderRadius:'50%', transform:'translateY(-50%)'}}/>
            <div style={{position:'absolute', top:'50%', left:20, right:20, height:1, borderTop:'1.5px dashed var(--line)', transform:'translateY(-50%)'}}/>
          </div>

          {/* QR */}
          <div style={{padding:'8px 20px 24px'}}>
            <div style={{
              padding:16, background:'white', borderRadius:14, border:'1px solid var(--line)',
              display:'grid', placeItems:'center', position:'relative',
            }}>
              <svg viewBox="0 0 33 33" width={200} height={200} className="qr-svg">
                {Array.from({length:33*33}).map((_, i) => {
                  const x = i%33, y = Math.floor(i/33);
                  const on = ((x*7+y*11+x*y) % 3 === 0) || (x<7&&y<7) || (x>25&&y<7) || (x<7&&y>25);
                  return on ? <rect key={i} x={x} y={y} width="1" height="1"/> : null;
                })}
                {/* finder squares */}
                <rect x="1" y="1" width="5" height="5" fill="none" stroke="oklch(0.18 0.04 152)" strokeWidth="1"/>
                <rect x="27" y="1" width="5" height="5" fill="none" stroke="oklch(0.18 0.04 152)" strokeWidth="1"/>
                <rect x="1" y="27" width="5" height="5" fill="none" stroke="oklch(0.18 0.04 152)" strokeWidth="1"/>
                <rect x="14" y="14" width="5" height="5" fill="white"/>
                <circle cx="16.5" cy="16.5" r="2" fill="oklch(0.55 0.18 152)"/>
              </svg>

              {/* Scan animation */}
              {!scanned && (
                <div style={{
                  position:'absolute', left:24, right:24, height:2,
                  background:'linear-gradient(90deg, transparent, var(--accent), transparent)',
                  boxShadow:'0 0 20px var(--accent)',
                  animation: 'scanline 2.5s ease-in-out infinite',
                  pointerEvents:'none',
                }}/>
              )}

              {/* Success overlay */}
              {scanned && (
                <div style={{
                  position:'absolute', inset:0,
                  background:'oklch(0.55 0.18 152 / .95)',
                  borderRadius:14,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexDirection:'column', color:'white',
                  animation:'screenIn .3s ease-out both',
                }}>
                  <div style={{
                    width:72, height:72, borderRadius:'50%',
                    background:'oklch(1 0 0 / .2)', border:'2.5px solid white',
                    display:'grid', placeItems:'center',
                  }}>
                    <Icon name="check" size={40} stroke={3}/>
                  </div>
                  <div className="serif mt-3" style={{fontSize:24}}>Welcome, Adaeze</div>
                  <div className="mono text-xs mt-1" style={{opacity:.85, letterSpacing:'.12em'}}>SCANNED · 9:12 PM</div>
                </div>
              )}
            </div>

            <div className="between mt-4">
              <div className="text-xs muted">Ticket ID</div>
              <div className="mono text-xs">CT-A7K2J-08291</div>
            </div>
          </div>
        </div>

        {/* Compass tip */}
        <div className="mt-4" style={{
          padding:14, borderRadius:16,
          background:'oklch(1 0 0 / .12)', backdropFilter:'blur(20px)',
          border:'1px solid oklch(1 0 0 / .15)',
        }}>
          <div className="row gap-2"><div className="ai-dot" style={{width:18, height:18}}/><span className="fw-600 text-sm">Compass tip</span></div>
          <p className="text-xs mt-2" style={{opacity:.85, lineHeight:1.5}}>
            Doors open in 92 min. Park at Lot 3 for ₦2k flat. Bring ID matching the ticket holder name.
          </p>
        </div>

        {/* Brightness boost */}
        <button onClick={() => setBrightness(!brightness)} className="mt-4" style={{
          width:'100%', padding:14, borderRadius:14,
          background:'oklch(1 0 0 / .12)', backdropFilter:'blur(20px)',
          border:'1px solid oklch(1 0 0 / .15)',
          color:'white',
          display:'flex', alignItems:'center', gap:12,
        }}>
          <Icon name="sun" size={18}/>
          <span style={{flex:1, fontSize:14, fontWeight:500}}>Auto-brighten for scanning</span>
          <span className={`toggle ${brightness?'on':''}`}/>
        </button>

        <div className="row gap-2 mt-4">
          <button className="mbtn mbtn-ghost f1" style={{background:'oklch(1 0 0 / .15)', color:'white', borderColor:'oklch(1 0 0 / .15)'}}>
            <Icon name="send" size={15}/> Transfer
          </button>
          <button className="mbtn mbtn-ghost f1" style={{background:'oklch(1 0 0 / .15)', color:'white', borderColor:'oklch(1 0 0 / .15)'}}>
            <Icon name="wallet" size={15}/> Add to Wallet
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 24px; }
          50% { top: calc(100% - 24px); }
          100% { top: 24px; }
        }
      `}</style>
    </div>
  );
};

window.ScreenTicket = ScreenTicket;
