/* ===== HOME ===== */
const ScreenHome = () => {
  const { go } = useRoute();
  const [city, setCity] = useState("Lagos");
  const [scrolled, setScrolled] = useState(false);
  return (
    <div className="screen-enter" style={{paddingBottom:120, position:'relative'}}
      onScroll={(e) => setScrolled(e.target.scrollTop > 30)}>

      {/* Top bar with brand */}
      <div style={{
        padding:'12px 16px 8px',
        display:'flex', alignItems:'center', gap:12,
      }}>
        <Brand size={36}/>
        <div style={{flex:1}}>
          <div className="text-xs muted">Good evening, Adaeze</div>
          <button onClick={() => {}} style={{display:'flex', alignItems:'center', gap:4, fontWeight:600, fontSize:15}}>
            <Icon name="pin" size={14}/> {city} <Icon name="chevronDown" size={14}/>
          </button>
        </div>
        <button className="icon-btn" style={{position:'relative'}}>
          <Icon name="bell" size={18}/>
          <span style={{position:'absolute', top:6, right:8, width:7, height:7, borderRadius:'50%', background:'var(--danger)'}}/>
        </button>
      </div>

      {/* Search field */}
      <div style={{padding:'8px 16px 12px'}}>
        <button onClick={() => go({name:"search"})}
          style={{
            width:'100%', display:'flex', alignItems:'center', gap:10,
            padding:'14px 16px',
            background:'var(--surface)', border:'1px solid var(--line)',
            borderRadius:'var(--r-pill)',
            color:'var(--ink-3)', textAlign:'left',
            boxShadow:'0 2px 8px oklch(0 0 0 / .04)',
          }}>
          <Icon name="search" size={18}/>
          <span style={{flex:1, fontSize:14}}>Search events, flights, stays…</span>
          <Icon name="mic" size={16}/>
        </button>
      </div>

      {/* Hero feature */}
      <div style={{padding:'4px 16px 0'}}>
        <button onClick={() => go({name:"event", id:"e3"})} style={{
          width:'100%', padding:0, textAlign:'left',
          borderRadius:'var(--r-5)', overflow:'hidden',
          position:'relative',
          boxShadow:'0 12px 30px oklch(0 0 0 / .15)',
        }}>
          <div className="ph ph-1 ph-noise" style={{height:340, position:'relative'}}>
            <div className="stars"/>
            <div className="overlay-grad"/>
            <div style={{position:'absolute', top:14, left:14, display:'flex', gap:6}}>
              <span className="badge badge-vip">VIP table</span>
              <span className="badge" style={{background:'oklch(0 0 0 / .35)', color:'white'}}>Featured</span>
            </div>
            <div style={{position:'absolute', left:18, right:18, bottom:18, color:'white'}}>
              <div className="mono text-xs" style={{opacity:.85, letterSpacing:'.16em'}}>SUN 07 JUN · 8PM · LAGOS</div>
              <div className="serif" style={{fontSize:34, lineHeight:1.0, marginTop:6}}>Asake — Lungu Boy Tour</div>
              <div className="between mt-4">
                <div>
                  <div className="text-xs" style={{opacity:.7}}>From</div>
                  <div className="h-3 tnum">{formatNGN(30000)}</div>
                </div>
                <span className="mbtn mbtn-primary mbtn-sm" style={{background:'oklch(1 0 0 / .95)', color:'oklch(0.2 0.05 152)'}}>
                  Get tickets <Icon name="arrow" size={13}/>
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Categories */}
      <div className="rail-h" style={{marginTop:20}}>
        {[
          { l:"Events",      i:"calendar",color:"oklch(0.62 0.20 350)", to:{name:"search"} },
          { l:"Concerts",    i:"music",   color:"oklch(0.62 0.18 152)", to:{name:"search"} },
          { l:"Flights",     i:"plane",   color:"oklch(0.60 0.16 230)", to:{name:"flights"} },
          { l:"Stays",       i:"bed",     color:"oklch(0.65 0.15 75)",  to:{name:"hotels"} },
          { l:"Bus",         i:"bus",     color:"oklch(0.62 0.14 200)", to:{name:"buses"} },
          { l:"Cinema",      i:"film",    color:"oklch(0.55 0.18 305)", to:{name:"search"} },
          { l:"Experiences", i:"sparkle", color:"oklch(0.65 0.20 25)",  to:{name:"search"} },
        ].map(c => (
          <button key={c.l} onClick={() => go(c.to)}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:8,
              minWidth:82, padding:'14px 10px',
              background:'var(--surface)', borderRadius:18, border:'1px solid var(--line)',
              position:'relative', overflow:'hidden',
            }}>
            <div style={{
              position:'absolute', top:-20, right:-20,
              width:60, height:60, borderRadius:'50%',
              background: c.color, opacity:.15, filter:'blur(14px)',
              pointerEvents:'none',
            }}/>
            <div style={{
              width:44, height:44, borderRadius:12,
              background: c.color, color:'white',
              display:'grid', placeItems:'center',
              boxShadow:`0 6px 14px -6px ${c.color}, inset 0 1px 0 oklch(1 0 0 / .25)`,
            }}>
              <Icon name={c.i} size={20} stroke={1.8}/>
            </div>
            <span style={{fontSize:12, fontWeight:500, position:'relative'}}>{c.l}</span>
          </button>
        ))}
      </div>

      {/* AI rail */}
      <Section eyebrow="✦ For you · 96% match" title="Compass picks tonight" sub="Built from your last 4 bookings" action="Tune">
        <div className="rail-h" style={{padding:0, margin:'0 -16px'}}>
          {DATA.trending.slice(0, 5).map(e => <EventCardMobile key={e.id} e={e} w={240}/>)}
        </div>
      </Section>

      {/* Trending tonight */}
      <Section eyebrow="Tonight" title="Lagos is loud this weekend" action="See all">
        <div className="col gap-3">
          {DATA.trending.slice(0,3).map(e => (
            <button key={e.id} onClick={() => go({name:"event", id:e.id})}
              style={{
                padding:0, textAlign:'left',
                display:'flex', gap:12, alignItems:'center',
                background:'var(--surface)', borderRadius:14,
                border:'1px solid var(--line)', overflow:'hidden',
              }}>
              <div className={`ph ${e.ph} ph-noise`} style={{width:90, height:90, flexShrink:0}}/>
              <div style={{flex:1, padding:'10px 12px 10px 0'}}>
                <div className="between" style={{alignItems:'flex-start'}}>
                  <div>
                    <div className="text-xs muted">{e.tag} · {e.city}</div>
                    <div className="fw-600" style={{fontSize:14, marginTop:2, textWrap:'pretty'}}>{e.title}</div>
                  </div>
                  {e.almostSold && <span className="badge" style={{background:'var(--danger)', color:'white'}}>Hot</span>}
                </div>
                <div className="between mt-2" style={{fontSize:12}}>
                  <span className="muted">{e.date}</span>
                  <span className="fw-600 tnum">{formatNGN(e.priceFrom)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Flight deals */}
      <Section eyebrow="Flight Deals" title="Drops today" action="All" onAction={() => go({name:"flights"})}>
        <div className="rail-h" style={{padding:0, margin:'0 -16px'}}>
          {DATA.flights.slice(0,4).map(f => (
            <button key={f.id} onClick={() => go({name:"flights"})}
              style={{
                width:220, padding:0, textAlign:'left',
                background:'var(--surface)', border:'1px solid var(--line)',
                borderRadius:16, overflow:'hidden',
              }}>
              <div className={`ph ${f.ph} ph-noise`} style={{height:90, position:'relative'}}>
                <div className="overlay-grad"/>
                <div style={{position:'absolute', left:12, bottom:8, color:'white', display:'flex', alignItems:'center', gap:8}}>
                  <span className="mono fw-600">{f.from}</span>
                  <Icon name="arrow" size={13}/>
                  <span className="mono fw-600">{f.to}</span>
                </div>
              </div>
              <div style={{padding:'10px 12px 12px'}}>
                <div className="text-xs muted">{f.airline} · {f.duration}</div>
                <div className="between mt-2">
                  <span className="h-4 tnum">{formatNGN(f.price)}</span>
                  <span style={{fontSize:11, fontFamily:'var(--font-mono)', color: f.trend==='down'?'var(--accent)':f.trend==='up'?'var(--danger)':'var(--ink-3)'}}>
                    {f.change}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Weekend bundle */}
      <Section title="Weekend getaways" eyebrow="Bundle & save">
        <button onClick={() => go({name:"hotels"})} style={{
          width:'100%', padding:0, textAlign:'left',
          borderRadius:20, overflow:'hidden', position:'relative',
        }}>
          <div className="ph ph-5 ph-noise" style={{height:220, position:'relative'}}>
            <div className="overlay-grad"/>
            <div style={{position:'absolute', left:18, right:18, bottom:18, color:'white'}}>
              <span className="badge badge-vip">Editor's pick</span>
              <div className="serif mt-2" style={{fontSize:24, lineHeight:1.1}}>La Campagne Tropicana</div>
              <div className="between mt-3">
                <span className="text-xs" style={{opacity:.8}}>Lekki · 2 nights</span>
                <span className="h-4 tnum">{formatNGN(98000)}/night</span>
              </div>
            </div>
          </div>
        </button>
      </Section>

      {/* Trust strip */}
      <div style={{padding:'24px 16px 0'}}>
        <div style={{
          padding:16, borderRadius:16,
          background:'var(--surface)', border:'1px solid var(--line)',
        }}>
          <div className="row gap-2 mb-2">
            <Icon name="shield" size={16}/>
            <span className="fw-600 text-sm">Verified · Insured · Refundable</span>
          </div>
          <p className="text-xs muted" style={{lineHeight:1.5}}>
            QR-secured tickets, PCI-DSS payments, refund if event cancels. Buyer protection on every booking.
          </p>
        </div>
      </div>
    </div>
  );
};

window.ScreenHome = ScreenHome;
