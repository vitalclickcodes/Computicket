/* ===== EVENT DETAIL with Swipe-to-Buy ===== */
const ScreenEvent = ({ id = "e3" }) => {
  const { go, back } = useRoute();
  const e = DATA.trending.find(x => x.id === id) || DATA.trending[2];
  const [tier, setTier] = useState(1);
  const [qty, setQty] = useState(2);
  const [swipe, setSwipe] = useState(0); // 0-1
  const dragRef = useRef({ active:false, startX:0 });

  const tiers = [
    { name:"Regular",       price:30000, perks:"Standing · 1 drink" },
    { name:"Premium",       price:55000, perks:"Elevated view · Express", popular:true },
    { name:"VIP Lounge",    price:120000,perks:"Table for 4 · Bottles", vip:true },
    { name:"Diamond",       price:380000,perks:"Private booth · Host", vip:true, scarce:true },
  ];

  const total = tiers[tier].price * qty;

  const startDrag = (e) => {
    dragRef.current.active = true;
    dragRef.current.startX = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const moveDrag = (e) => {
    if (!dragRef.current.active) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - dragRef.current.startX;
    const max = 220;
    setSwipe(Math.max(0, Math.min(1, dx / max)));
  };
  const endDrag = () => {
    dragRef.current.active = false;
    if (swipe > 0.85) {
      // Confirmed
      setSwipe(1);
      setTimeout(() => {
        go({ name:"checkout" });
        setSwipe(0);
      }, 250);
    } else {
      setSwipe(0);
    }
  };

  return (
    <div className="screen-enter" style={{paddingBottom:160, position:'relative'}}>
      {/* Cinematic header */}
      <div style={{position:'relative'}}>
        <div className={`ph ${e.ph} ph-noise`} style={{height:380, position:'relative'}}>
          <div className="stars"/>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, oklch(0 0 0 / .25) 0%, transparent 30%, oklch(0 0 0 / .85) 100%)'}}/>
          {/* Top bar */}
          <div style={{position:'absolute', top:8, left:0, right:0, display:'flex', alignItems:'center', padding:'0 8px'}}>
            <button onClick={back} style={{
              width:40, height:40, borderRadius:'50%',
              background:'oklch(0 0 0 / .4)', backdropFilter:'blur(10px)',
              color:'white', display:'grid', placeItems:'center',
            }}>
              <Icon name="chevronLeft" size={22}/>
            </button>
            <div style={{flex:1}}/>
            <button style={{
              width:40, height:40, borderRadius:'50%',
              background:'oklch(0 0 0 / .4)', backdropFilter:'blur(10px)',
              color:'white', display:'grid', placeItems:'center', marginRight:8,
            }}>
              <Icon name="heart" size={18}/>
            </button>
            <button style={{
              width:40, height:40, borderRadius:'50%',
              background:'oklch(0 0 0 / .4)', backdropFilter:'blur(10px)',
              color:'white', display:'grid', placeItems:'center',
            }}>
              <Icon name="send" size={16}/>
            </button>
          </div>

          {/* Play button */}
          <button style={{
            position:'absolute', left:'50%', top:'48%', transform:'translate(-50%, -50%)',
            width:64, height:64, borderRadius:'50%',
            background:'oklch(1 0 0 / .2)', backdropFilter:'blur(20px)',
            border:'1.5px solid oklch(1 0 0 / .35)',
            color:'white', display:'grid', placeItems:'center',
          }}>
            <Icon name="play" size={26}/>
          </button>

          <div style={{position:'absolute', left:16, right:16, bottom:18, color:'white'}}>
            <div className="row gap-2 mb-2">
              {e.vip && <span className="badge badge-vip">VIP</span>}
              <span className="badge" style={{background:'oklch(0 0 0 / .4)', color:'white'}}>{e.tag}</span>
              <span className="badge" style={{background:'oklch(0 0 0 / .4)', color:'white'}}>18+</span>
            </div>
            <div className="mono text-xs" style={{opacity:.85, letterSpacing:'.14em'}}>{e.date.toUpperCase()} · {e.time}</div>
            <div className="serif" style={{fontSize:32, lineHeight:1.0, marginTop:4, textWrap:'pretty'}}>{e.title}</div>
            <div className="row gap-2 mt-2" style={{fontSize:13, opacity:.9}}>
              <Icon name="pin" size={13}/>
              <span>{e.venue} · {e.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{padding:'16px', display:'flex', gap:0}}>
        {[
          {l:"Attending", v: e.attending.toLocaleString()},
          {l:"Sold", v: `${Math.round(e.attending/e.capacity*100)}%`},
          {l:"Time left", v: e.countdown.split('·')[0].trim()},
        ].map((s,i) => (
          <div key={s.l} style={{flex:1, textAlign:'center', borderRight: i<2?'1px solid var(--line)':'none'}}>
            <div className="text-xs muted">{s.l}</div>
            <div className="h-4 tnum mt-1" style={{fontSize:18}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{padding:'4px 16px'}}>
        <div className="eyebrow mb-2">About the show</div>
        <p style={{fontSize:14, color:'var(--ink-2)', lineHeight:1.6, textWrap:'pretty'}}>
          Asake's Lungu Boy World Tour finally lands on home soil. Full live band, the
          <span className="serif accent-text"> Mr Money & The Vibe</span> ensemble, and surprise Afrobeats royalty across the night.
        </p>
        <div className="row gap-2 mt-3" style={{flexWrap:'wrap'}}>
          {["Afrobeats","Live band","Outdoor","18+","Doors 7pm"].map(t => (
            <span key={t} className="chip" style={{padding:'5px 10px', fontSize:11}}>{t}</span>
          ))}
        </div>
      </div>

      {/* Friends attending */}
      <Section eyebrow="Friends going · 12" title="Tobi, Chika +10 more">
        <div style={{display:'flex', alignItems:'center'}}>
          {["AO","TB","CN","EK","FA","BM"].map((n,i) => (
            <div key={i} style={{
              width:38, height:38, borderRadius:'50%',
              border:'2px solid var(--bg-base)',
              background:`linear-gradient(135deg, oklch(0.55 0.20 ${140+i*10}), oklch(0.65 0.18 ${170+i*8}))`,
              display:'grid', placeItems:'center', color:'white', fontSize:11, fontWeight:600,
              marginLeft: i ? -8 : 0,
            }}>{n}</div>
          ))}
          <div className="mbtn mbtn-ghost mbtn-sm" style={{marginLeft:8}}>Group seats <Icon name="arrow" size={13}/></div>
        </div>
      </Section>

      {/* Tier picker */}
      <Section eyebrow="Choose your tier" title="Pick a tier" sub="AI suggests Premium — best value tonight">
        <div className="col gap-2">
          {tiers.map((t, i) => (
            <button key={i} onClick={() => setTier(i)} style={{
              padding:'14px 16px', textAlign:'left',
              borderRadius:14,
              border: tier===i ? '1.5px solid var(--accent)' : '1px solid var(--line)',
              background: tier===i ? 'var(--accent-soft)' : 'var(--surface)',
            }}>
              <div className="between">
                <div>
                  <div className="row gap-2" style={{alignItems:'center'}}>
                    <span className="fw-600">{t.name}</span>
                    {t.popular && <span className="badge badge-vip">AI pick</span>}
                    {t.scarce && <span className="badge" style={{background:'var(--danger)', color:'white'}}>3 left</span>}
                  </div>
                  <div className="text-xs muted mt-1">{t.perks}</div>
                </div>
                <div className="h-4 tnum">{formatNGN(t.price)}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Quantity */}
        <div className="between mt-4" style={{
          padding:'14px 16px', background:'var(--surface)',
          borderRadius:14, border:'1px solid var(--line)',
        }}>
          <span className="fw-500">Quantity</span>
          <div className="row gap-3" style={{alignItems:'center'}}>
            <button onClick={() => setQty(Math.max(1, qty-1))} className="icon-btn" style={{width:36, height:36}}><Icon name="minus" size={14}/></button>
            <span className="fw-600 tnum" style={{minWidth:24, textAlign:'center'}}>{qty}</span>
            <button onClick={() => setQty(qty+1)} className="icon-btn" style={{width:36, height:36}}><Icon name="plus" size={14}/></button>
          </div>
        </div>
      </Section>

      {/* Compass bundle */}
      <div style={{padding:'24px 16px 0'}}>
        <div style={{
          padding:14, borderRadius:16,
          background:'linear-gradient(135deg, var(--accent-soft), transparent)',
          border:'1px solid oklch(0.62 0.18 152 / .25)',
          display:'flex', alignItems:'center', gap:12,
        }}>
          <div style={{width:22, height:22, borderRadius:'50%',
            background: 'conic-gradient(from 0deg, var(--accent), oklch(0.70 0.18 170), oklch(0.65 0.18 200), oklch(0.60 0.16 230), var(--accent))',
            animation: 'rotate 5s linear infinite', flexShrink:0,
          }}/>
          <div style={{flex:1, fontSize:13, lineHeight:1.5}}>
            Add Eko Hotel — <b className="accent-text">save ₦18,000</b> on the bundle.
          </div>
          <button className="text-sm accent-text fw-600">Add</button>
        </div>
      </div>

      {/* Bottom: Swipe-to-buy bar */}
      <div style={{
        position:'sticky', bottom:0, marginTop:24,
        background:'var(--surface)', backdropFilter:'blur(20px)',
        borderTop:'0.5px solid var(--line)',
        padding:'14px 16px calc(20px + env(safe-area-inset-bottom))',
        zIndex:30,
      }}>
        <div className="between mb-3">
          <div>
            <div className="text-xs muted">{qty} × {tiers[tier].name}</div>
            <div className="h-3 tnum mt-1">{formatNGN(total)}</div>
          </div>
          <div className="text-xs muted text-c">
            <Icon name="shield" size={12}/><br/>Buyer<br/>protected
          </div>
        </div>

        <div className="swipe-track"
          onMouseDown={startDrag} onMouseMove={moveDrag} onMouseUp={endDrag} onMouseLeave={endDrag}
          onTouchStart={startDrag} onTouchMove={moveDrag} onTouchEnd={endDrag}>
          <div className="label" style={{opacity: 1 - swipe * 1.2}}>Swipe to buy →</div>
          <div className="swipe-thumb" style={{
            transform: `translateX(${swipe * 220}px)`,
            animation: swipe > 0.05 ? 'none' : undefined,
            transition: dragRef.current.active ? 'none' : 'transform .2s',
          }}>
            <Icon name="arrow" size={18}/>
          </div>
        </div>
      </div>
    </div>
  );
};

window.ScreenEvent = ScreenEvent;
