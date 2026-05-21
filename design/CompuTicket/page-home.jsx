/* ===== HOME PAGE ===== */
const HeroCinematic = ({ tweaks }) => {
  const { go, loggedIn } = useRoute();
  const [tab, setTab] = useState("events");
  const tabs = [
    { id:"events",   label:"Events",     icon:"calendar"},
    { id:"concerts", label:"Concerts",   icon:"music"  },
    { id:"flights",  label:"Flights",    icon:"plane"  },
    { id:"buses",    label:"Bus Travel", icon:"bus"    },
    { id:"hotels",   label:"Stays",      icon:"bed"    },
    { id:"cinema",   label:"Cinema",     icon:"film"   },
    { id:"x",        label:"Experiences",icon:"sparkle"},
  ];

  // Field layouts per tab
  const fieldsByTab = {
    events:  [{label:"Find",        value:"Concerts, comedy, theatre…", placeholder:true},
              {label:"City",        value:"Lagos"},
              {label:"When",        value:"This weekend"},
              {label:"Guests",      value:"2 tickets"}],
    concerts:[{label:"Artist or show",value:"Asake, Burna, Tems…", placeholder:true},
              {label:"City",        value:"Lagos"},
              {label:"When",        value:"Next 30 days"},
              {label:"Tier",        value:"Any · VIP available"}],
    flights: [{label:"From",        value:"Lagos (LOS)"},
              {label:"To",          value:"Abuja (ABV)"},
              {label:"Depart",      value:"Fri 23 May"},
              {label:"Passengers",  value:"1 adult, Economy"}],
    buses:   [{label:"From",        value:"Lagos (Jibowu)"},
              {label:"To",          value:"Benin City"},
              {label:"Depart",      value:"Sat 24 May, 07:00"},
              {label:"Passengers",  value:"1 adult"}],
    hotels:  [{label:"Destination", value:"Victoria Island, Lagos"},
              {label:"Check-in",    value:"Fri 23 May"},
              {label:"Check-out",   value:"Sun 25 May"},
              {label:"Guests",      value:"2 guests, 1 room"}],
    cinema:  [{label:"Movie",       value:"What's showing?", placeholder:true},
              {label:"City",        value:"Lagos"},
              {label:"Date",        value:"Today"},
              {label:"Format",      value:"IMAX, 3D, 2D"}],
    x:       [{label:"What",        value:"Yacht cruises, tours…", placeholder:true},
              {label:"Where",       value:"Lagos"},
              {label:"When",        value:"This weekend"},
              {label:"Guests",      value:"4 guests"}],
  };

  return (
    <section className="nebula" style={{position:'relative', overflow:'hidden', paddingTop: 32, paddingBottom: 80}}>
      <div className="stars"/>
      {/* Spotlight */}
      <div style={{
        position:'absolute', top:-200, right:-150, width:700, height:700,
        background:'radial-gradient(circle, oklch(0.55 0.22 152 / .45), transparent 60%)',
        pointerEvents:'none', filter:'blur(20px)',
      }}/>
      <div style={{
        position:'absolute', bottom:-300, left:-200, width:800, height:800,
        background:'radial-gradient(circle, oklch(0.50 0.18 180 / .35), transparent 60%)',
        pointerEvents:'none', filter:'blur(20px)',
      }}/>

      <div className="wrap" style={{position:'relative', paddingTop:60, paddingBottom:60}}>
        {/* Top eyebrow */}
        <div className="between mb-6" style={{alignItems:'center'}}>
          <div className="ai-pill">
            <span className="ai-dot"/>
            {loggedIn
              ? <span>Compass AI is learning your taste — <b style={{color:'var(--accent)'}}>32 picks ready</b></span>
              : <span>Sign in for AI-personalised picks — <b style={{color:'var(--accent)'}}>free</b></span>
            }
          </div>
          <div className="row gap-2" style={{alignItems:'center'}}>
            <span className="pill-stat"><span className="dot dot-live"/> 4,812 booking now</span>
            <span className="pill-stat"><Icon name="shield" size={12}/> Buyer protection on every order</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{maxWidth: 880}}>
          <h1 className="h-1" style={{margin:'0 0 18px'}}>
            <span className="text-gradient">Everywhere you'd rather be —</span><br/>
            <span className="serif" style={{fontSize:'0.92em', color:'var(--ink-2)'}}>booked in one tap.</span>
          </h1>
          <p style={{fontSize:18, color:'var(--ink-2)', maxWidth:620, lineHeight:1.55, textWrap:'pretty'}}>
            Concerts, flights, stays and experiences across Nigeria — curated and AI-personalised by
            <span className="accent-text"> Compass</span>. From Lagos rooftops to Abuja take-offs, your weekend starts here.
          </p>
        </div>

        {/* Tabs */}
        <div className="search-tabs mt-8">
          {tabs.map(t => (
            <button key={t.id} className={`search-tab ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={14}/> {t.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="search-bar" style={{gridTemplateColumns: `repeat(${fieldsByTab[tab].length}, 1fr) auto`}}>
          {fieldsByTab[tab].map((f, i) => (
            <div key={i} className="search-field" style={{borderRight: i < fieldsByTab[tab].length - 1 ? '1px solid var(--line)' : 'none'}}>
              <div className="search-label">{f.label}</div>
              <div className={`search-value ${f.placeholder ? 'placeholder' : ''}`}>{f.value}</div>
            </div>
          ))}
          <button className="btn btn-accent btn-lg" style={{margin:6, padding:'18px 28px'}}
            onClick={() => go({ name: tab === 'flights' ? 'flights' : tab === 'buses' ? 'buses' : tab === 'hotels' ? 'hotels' : 'search', q: tab })}>
            <Icon name="search" size={16}/> Search
          </button>
        </div>

        {/* Quick prompts */}
        <div className="row mt-4 gap-2" style={{flexWrap:'wrap'}}>
          <span className="text-xs muted" style={{alignSelf:'center', marginRight:4}}>Try:</span>
          {["Burna Boy Lagos", "Cheap flights LOS→ABV", "Eko Hotel weekend", "Sunset cruise", "Asake VIP", "Bus to Benin"].map(s => (
            <button key={s} className="chip" style={{fontSize:12}}>
              <Icon name="sparkle" size={11}/> {s}
            </button>
          ))}
        </div>

        {/* Stats below hero */}
        <div className="row mt-8" style={{gap:48, paddingTop:32, borderTop:'1px solid var(--line)', flexWrap:'wrap'}}>
          {[
            {n:"1.2M+", l:"Tickets sold this year"},
            {n:"2,400+",l:"Events on-platform"},
            {n:"38",   l:"Airlines & operators"},
            {n:"4.9",  l:"App rating · 84k reviews"},
            {n:"99.97%", l:"Booking success rate"},
          ].map(s => (
            <div key={s.l} style={{flex:1, minWidth:140}}>
              <div className="h-2 tnum" style={{fontSize:32}}>{s.n}</div>
              <div className="text-xs muted mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HeroEditorial = () => {
  const { go } = useRoute();
  return (
    <section style={{position:'relative', overflow:'hidden', borderBottom:'1px solid var(--line)'}}>
      <div className="wrap" style={{paddingTop:80, paddingBottom:80, display:'grid', gridTemplateColumns:'minmax(0,1.2fr) minmax(0,1fr)', gap:64, alignItems:'center'}}>
        <div>
          <div className="eyebrow mb-4">Issue Nº 47 · Tonight in Lagos</div>
          <h1 className="h-1" style={{margin:0, fontSize:88}}>
            The <span className="serif" style={{color:'var(--accent)'}}>weekend</span><br/>
            edit.
          </h1>
          <p className="mt-6" style={{fontSize:18, color:'var(--ink-2)', maxWidth:480, lineHeight:1.6}}>
            Seven things to do before Monday. Curated by Lagos locals and
            <span className="accent-text"> Compass AI</span> — every pick comes with a flight, stay and dinner pairing.
          </p>
          <div className="row mt-6 gap-3">
            <button className="btn btn-accent btn-lg" onClick={() => go({ name:"search" })}>Read the edit <Icon name="arrow" size={14}/></button>
            <button className="btn btn-ghost btn-lg">Listen <Icon name="play" size={14}/></button>
          </div>
        </div>
        <div className="ph ph-1 ph-noise" style={{aspectRatio:'4/5', borderRadius:'var(--r-5)', position:'relative'}}>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 60%, oklch(0 0 0 / .8))'}}/>
          <div style={{position:'absolute', left:24, right:24, bottom:24, color:'white'}}>
            <div className="mono text-xs" style={{opacity:.8}}>FEATURE · 03 OF 07</div>
            <div className="serif" style={{fontSize:34, marginTop:6, lineHeight:1.05}}>The night Asake set Eko alight.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroSearchLed = () => {
  const { go } = useRoute();
  return (
    <section style={{position:'relative', overflow:'hidden', paddingTop:64, paddingBottom:48, borderBottom:'1px solid var(--line)'}}>
      <div className="wrap" style={{textAlign:'center', maxWidth: 880, position:'relative'}}>
        <div className="ai-pill" style={{margin:'0 auto'}}>
          <span className="ai-dot"/><span>Search 12 categories at once</span>
        </div>
        <h1 className="h-1 mt-6" style={{margin:'24px auto', fontSize:64}}>What are you booking today?</h1>
        <p style={{fontSize:16, color:'var(--ink-3)', maxWidth:520, margin:'0 auto'}}>One search. Events, flights, stays, buses, experiences.</p>
        <div style={{maxWidth:720, margin:'40px auto 0'}}>
          <div style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'8px 8px 8px 24px', borderRadius:'var(--r-pill)',
            background:'var(--surface)', border:'1px solid var(--line-strong)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <Icon name="search" size={18}/>
            <input className="input" placeholder="e.g. Asake Lagos VIP this weekend with hotel"
              style={{border:0, background:'transparent', padding:'14px 0', fontSize:17}}/>
            <button className="btn btn-accent">Search <Icon name="arrow" size={14}/></button>
          </div>
        </div>
        <div className="row mt-8 gap-2" style={{justifyContent:'center', flexWrap:'wrap'}}>
          {["Concerts","Comedy","Flights","Hotels","Cinema","Theatre","Bus","Yacht","Festivals"].map(c => (
            <button key={c} className="chip" onClick={() => go({ name:"search", q:c })}>{c}</button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ----- Category quick tiles ----- */
const CategoryTiles = () => {
  const { go } = useRoute();
  const tiles = [
    { id:"events",   icon:"calendar",title:"Events",      sub:"This weekend",    color:"oklch(0.62 0.20 350)", to:{name:"search",q:"events"} },
    { id:"concerts", icon:"music",  title:"Concerts",    sub:"2,184 live",      color:"oklch(0.62 0.18 152)", to:{name:"search",q:"concerts"} },
    { id:"flights",  icon:"plane",  title:"Flights",     sub:"38 airlines",     color:"oklch(0.60 0.16 230)", to:{name:"flights"} },
    { id:"hotels",   icon:"bed",    title:"Stays",       sub:"4,920 hotels",    color:"oklch(0.65 0.15 75)",  to:{name:"hotels"} },
    { id:"buses",    icon:"bus",    title:"Bus Travel",  sub:"All NG routes",   color:"oklch(0.62 0.14 200)", to:{name:"buses"} },
    { id:"cinema",   icon:"film",   title:"Cinema",      sub:"IMAX · 3D · 2D",  color:"oklch(0.55 0.18 305)", to:{name:"search",q:"cinema"} },
    { id:"x",        icon:"sparkle",title:"Experiences", sub:"Curated weekly",  color:"oklch(0.65 0.20 25)",  to:{name:"search",q:"experiences"} },
  ];
  return (
    <section className="wrap" style={{paddingTop:24, paddingBottom:24}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:14}}>
        {tiles.map(t => (
          <button key={t.id} className="card card-hover" onClick={() => go(t.to)}
            style={{padding:0, cursor:'pointer', textAlign:'left', position:'relative', overflow:'hidden'}}>
            {/* Soft ambient color glow */}
            <div style={{
              position:'absolute', top:-32, right:-32,
              width:120, height:120, borderRadius:'50%',
              background: t.color, opacity:.15,
              filter:'blur(28px)', pointerEvents:'none',
            }}/>
            <div style={{padding:'20px 18px 18px', position:'relative'}}>
              <div style={{
                width:52, height:52, borderRadius:14,
                background: t.color, color:'white',
                display:'grid', placeItems:'center',
                boxShadow: `0 10px 24px -10px ${t.color}, inset 0 1px 0 oklch(1 0 0 / .25)`,
              }}>
                <Icon name={t.icon} size={26} stroke={1.8}/>
              </div>
              <div className="h-4 mt-4">{t.title}</div>
              <div className="text-xs muted mt-1">{t.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

/* ----- Weekend getaway hero block ----- */
const WeekendBlock = () => (
  <section className="wrap section">
    <SectionHead eyebrow="Weekend Experiences" title="Aspirational, Naija-coded." sub="Curated escapes, getaways and lifestyle picks for the weekend ahead." cta="View all" />
    <div style={{display:'grid', gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr) minmax(0,1fr)', gap:24}}>
      <div className="card card-hover" style={{position:'relative', minHeight:520, overflow:'hidden'}}>
        <div className="ph ph-5 ph-noise" style={{position:'absolute', inset:0}}/>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 40%, oklch(0 0 0 / .85))'}}/>
        <div style={{position:'relative', padding:'32px', height:520, display:'flex', flexDirection:'column', justifyContent:'space-between', color:'white'}}>
          <div className="row gap-2">
            <span className="badge badge-vip">Editor's pick</span>
            <span className="badge badge-soon" style={{background:'oklch(1 0 0 / .12)', color:'white'}}>4-night package</span>
          </div>
          <div>
            <div className="mono text-xs" style={{opacity:.8, letterSpacing:'.16em'}}>LA CAMPAGNE TROPICANA · LEKKI</div>
            <div className="serif" style={{fontSize:48, lineHeight:1.0, marginTop:8, maxWidth:480}}>
              Sleep where the ocean meets the lagoon.
            </div>
            <div className="row mt-6 gap-6">
              <div>
                <div className="text-xs" style={{opacity:.7}}>From</div>
                <div className="h-2 tnum">{formatNGN(98000)} <span className="text-sm" style={{opacity:.7}}>/ night</span></div>
              </div>
              <div>
                <div className="text-xs" style={{opacity:.7}}>Includes</div>
                <div className="fw-500">Yacht ride · Spa · Breakfast</div>
              </div>
              <button className="btn btn-accent" style={{marginLeft:'auto'}}>Plan trip <Icon name="arrow" size={14}/></button>
            </div>
          </div>
        </div>
      </div>
      <div className="col gap-4">
        {DATA.experiences.slice(0,2).map(x => (
          <div key={x.id} className="card card-hover" style={{flex:1, position:'relative', overflow:'hidden'}}>
            <div className={`ph ${x.ph} ph-noise`} style={{position:'absolute', inset:0}}/>
            <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 50%, oklch(0 0 0 / .8))'}}/>
            <div style={{position:'relative', padding:20, minHeight:248, display:'flex', flexDirection:'column', justifyContent:'space-between', color:'white'}}>
              <span className="badge badge-soon" style={{background:'oklch(1 0 0 / .15)', color:'white', alignSelf:'flex-start'}}>{x.category}</span>
              <div>
                <div className="serif" style={{fontSize:22, lineHeight:1.1}}>{x.title}</div>
                <div className="between mt-3">
                  <span className="text-xs" style={{opacity:.7}}>{x.duration}</span>
                  <span className="h-4 tnum">{formatNGN(x.price)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card card-hover" style={{position:'relative', overflow:'hidden'}}>
        <div className="ph ph-2 ph-noise" style={{position:'absolute', inset:0}}/>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 30%, oklch(0 0 0 / .85))'}}/>
        <div style={{position:'relative', padding:24, minHeight:520, display:'flex', flexDirection:'column', justifyContent:'space-between', color:'white'}}>
          <div>
            <span className="badge badge-vip">Bundle save 18%</span>
          </div>
          <div>
            <div className="mono text-xs" style={{opacity:.8, letterSpacing:'.18em'}}>FLIGHT + HOTEL + EVENT</div>
            <div className="serif" style={{fontSize:32, lineHeight:1.05, marginTop:8}}>
              Abuja → Lagos for Asake VIP weekend
            </div>
            <p className="text-sm mt-3" style={{opacity:.8, lineHeight:1.5}}>
              Round-trip Air Peace · 2 nights at Eko Hotel · Asake VIP table for 4.
            </p>
            <div className="between mt-4">
              <div>
                <div className="text-xs" style={{opacity:.6}}>Bundle</div>
                <div className="h-3 tnum">{formatNGN(285000)} <span className="text-xs muted" style={{textDecoration:'line-through', opacity:.6}}>{formatNGN(348000)}</span></div>
              </div>
              <button className="btn btn-accent btn-sm">Book bundle</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ----- Trust strip ----- */
const TrustStrip = () => (
  <section className="wrap" style={{paddingTop:32, paddingBottom:32}}>
    <div className="card" style={{padding:24, background:'var(--surface)', borderRadius:'var(--r-4)'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:32}}>
        {[
          {icon:"shield",   t:"Buyer protection",  s:"100% refund if event cancels"},
          {icon:"qr",       t:"Verified QR tickets",s:"Anti-fraud at every venue gate"},
          {icon:"wallet",   t:"Wallet & escrow",    s:"NDIC-protected funds"},
          {icon:"lock",     t:"Bank-grade security", s:"AES-256 · OTP · biometrics"},
          {icon:"check",    t:"24/7 support",       s:"Lagos · Abuja · WhatsApp"},
        ].map(i => (
          <div key={i.t} className="row gap-3" style={{alignItems:'flex-start'}}>
            <div style={{
              width:40, height:40, borderRadius:'var(--r-2)',
              background:'var(--accent-soft)', color:'var(--accent)',
              display:'grid', placeItems:'center', flexShrink:0,
            }}>
              <Icon name={i.icon} size={18}/>
            </div>
            <div>
              <div className="h-4" style={{fontSize:14}}>{i.t}</div>
              <div className="text-xs muted mt-1">{i.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ----- For you (AI rail) ----- */
const ForYouRail = () => {
  const { loggedIn, setLoggedIn } = useRoute();
  return (
    <section className="wrap section">
      <SectionHead
        eyebrow={loggedIn ? "✦ Compass picks for you" : "✦ Trending in Nigeria"}
        title={loggedIn ? "Built around your last 4 bookings." : "What everyone's booking right now."}
        sub={loggedIn
          ? "An AI-blended rail of events, stays and trips matching Adaeze's taste — Afrobeats, Lagos coast, weekend getaways."
          : "Real-time picks across events, stays and travel — based on what 1.2M Nigerians are booking this week."}
        cta={loggedIn ? "Tune my taste" : "Sign up for personal picks"}
        onCta={loggedIn ? undefined : () => setLoggedIn(true)}
      />
    <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20}}>
      {(loggedIn ? [
        { title:"Tems Live · Eko Beach",      sub:"Because you loved Burna Boy 2024",  ph:"ph-2", price:"From ₦45,000", match:"96% match" },
        { title:"Weekend at La Campagne",     sub:"Beach + spa pairing",                ph:"ph-5", price:"From ₦98,000/night", match:"94% match" },
        { title:"Lagos → Abuja · Air Peace",  sub:"Fri evening · 1h 10m",               ph:"ph-7", price:"From ₦62,500", match:"89% match" },
        { title:"Sunset Yacht Cruise",        sub:"Saturday 6pm · Lagos Lagoon",        ph:"ph-3", price:"From ₦35,000", match:"87% match" },
      ] : [
        { title:"Tems Live · Eko Beach",      sub:"Trending · 18k attending",            ph:"ph-2", price:"From ₦45,000", match:"Trending" },
        { title:"Weekend at La Campagne",     sub:"Top-booked resort this month",        ph:"ph-5", price:"From ₦98,000/night", match:"Popular" },
        { title:"Lagos → Abuja · Air Peace",  sub:"Most-booked route in NG",             ph:"ph-7", price:"From ₦62,500", match:"Hot deal" },
        { title:"Sunset Yacht Cruise",        sub:"This weekend in Lagos",               ph:"ph-3", price:"From ₦35,000", match:"Featured" },
      ]).map((p, i) => (
        <div key={i} className="card card-hover" style={{position:'relative', overflow:'hidden'}}>
          <div className={`ph ${p.ph} ph-noise`} style={{height:200, position:'relative'}}>
            <div style={{position:'absolute', top:12, left:12}}>
              <span className="ai-pill" style={{background:'oklch(0 0 0 / .55)', border:'1px solid oklch(1 0 0 / .15)'}}>
                <span className="ai-dot"/>
                <span style={{color:'white'}}>{p.match}</span>
              </span>
            </div>
          </div>
          <div style={{padding:'16px 18px'}}>
            <div className="h-4">{p.title}</div>
            <div className="text-xs muted mt-1">{p.sub}</div>
            <div className="between mt-4">
              <span className="text-sm fw-500">{p.price}</span>
              <button className="icon-btn" style={{width:32, height:32}}><Icon name="arrow" size={14}/></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
  );
};

/* ----- Flights rail ----- */
const FlightRail = () => {
  const { go } = useRoute();
  return (
    <section className="wrap section">
      <SectionHead eyebrow="Flight Deals" title="Domestic deals dropping today." sub="Prices fall fastest 4–6 weeks out. Compass tracks 38 carriers for you." cta="See all flights" onCta={() => go({name:"flights"})}/>
      <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:16}}>
        {DATA.flights.map(f => (
          <button key={f.id} className="card card-hover" style={{padding:0, textAlign:'left', cursor:'pointer'}} onClick={() => go({name:"flights"})}>
            <div className={`ph ${f.ph} ph-noise`} style={{height:120, position:'relative'}}>
              <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 50%, oklch(0 0 0 / .7))'}}/>
              <div style={{position:'absolute', left:12, bottom:10, color:'white', display:'flex', alignItems:'center', gap:10}}>
                <span className="h-3 mono">{f.from}</span>
                <Icon name="arrow" size={14}/>
                <span className="h-3 mono">{f.to}</span>
              </div>
              {f.international && <span className="badge" style={{position:'absolute', top:10, right:10, background:'oklch(0 0 0 / .5)', color:'white'}}>Intl</span>}
            </div>
            <div style={{padding:'14px 16px'}}>
              <div className="text-xs muted">{f.airline} · {f.duration} · {f.direct?'Direct':'1 stop'}</div>
              <div className="between mt-2">
                <span className="h-4 tnum">{formatNGN(f.price)}</span>
                <span style={{
                  fontSize:11, fontFamily:'var(--font-mono)',
                  color: f.trend==='down'?'var(--accent)':f.trend==='up'?'var(--danger)':'var(--ink-3)',
                  display:'flex', alignItems:'center', gap:3,
                }}>
                  <Icon name={f.trend==='down'?'arrowDown':f.trend==='up'?'arrowUp':'minus'} size={11}/>{f.change}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

/* ----- Bus rail ----- */
const BusRail = () => {
  const { go } = useRoute();
  return (
    <section className="wrap section-sm" style={{paddingTop:0}}>
      <SectionHead eyebrow="Bus Travel" title="Comfort class, every major route." sub="GIGM, Chisco, ABC and 12 more — AC, WiFi, recliners." cta="All routes" onCta={() => go({name:"buses"})}/>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16}}>
        {DATA.buses.map(b => (
          <div key={b.id} className="card card-hover" style={{padding:20, cursor:'pointer'}} onClick={() => go({name:"buses"})}>
            <div className="between" style={{alignItems:'flex-start'}}>
              <span className="chip chip-accent">{b.operator}</span>
              <span className="text-xs muted">{b.seats} seats left</span>
            </div>
            <div className="mt-4" style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) auto minmax(0,1fr)', alignItems:'center', gap:12}}>
              <div>
                <div className="mono text-xs muted">FROM</div>
                <div className="h-4" style={{fontSize:15, marginTop:2}}>{b.departure}</div>
                <div className="text-xs muted mt-1">{b.from}</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div className="text-xs muted">{b.duration}</div>
                <div style={{height:1, background:'var(--line)', position:'relative', marginTop:4}}>
                  <div style={{position:'absolute', left:0, top:'50%', width:6, height:6, borderRadius:'50%', background:'var(--accent)', transform:'translateY(-50%)'}}/>
                  <div style={{position:'absolute', right:0, top:'50%', width:6, height:6, borderRadius:'50%', background:'var(--ink-3)', transform:'translateY(-50%)'}}/>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="mono text-xs muted">TO</div>
                <div className="h-4" style={{fontSize:15, marginTop:2}}>{b.arrival}</div>
                <div className="text-xs muted mt-1">{b.to}</div>
              </div>
            </div>
            <div className="between mt-4" style={{paddingTop:12, borderTop:'1px solid var(--line)'}}>
              <div className="row gap-2">
                {b.vehicle.split('·').map((v,i) => <span key={i} className="text-xs muted">{v.trim()}</span>)}
              </div>
              <span className="h-4 tnum">{formatNGN(b.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ----- Big "App / Trust" CTA block ----- */
const AppPromo = () => (
  <section className="wrap section">
    <div className="card" style={{
      position:'relative', overflow:'hidden', padding:0,
      background:'linear-gradient(135deg, oklch(0.16 0.10 152), oklch(0.14 0.10 180))',
      border:'1px solid oklch(1 0 0 / .08)',
    }}>
      <div className="stars" style={{opacity:.6}}/>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.2fr) minmax(0,1fr)', gap:0, position:'relative'}}>
        <div style={{padding:'64px 56px'}}>
          <div className="eyebrow mb-4" style={{color:'var(--accent)'}}>The mobile experience</div>
          <h2 className="h-1" style={{fontSize:56, color:'white', margin:0}}>
            Your tickets live in your pocket — even <span className="serif" style={{color:'var(--accent)'}}>offline</span>.
          </h2>
          <p style={{color:'oklch(1 0 0 / .75)', fontSize:16, maxWidth:480, marginTop:24, lineHeight:1.6}}>
            Cached QR codes that scan without signal. Wallet-grade encryption. Apple Pay, Verve, USSD.
            Built for Naija data realities — works fluidly on 2G.
          </p>
          <div className="row mt-8 gap-3">
            <button className="btn btn-glass btn-lg" style={{color:'white'}}>App Store</button>
            <button className="btn btn-glass btn-lg" style={{color:'white'}}>Google Play</button>
            <button className="btn btn-ghost btn-lg" style={{color:'white', borderColor:'oklch(1 0 0 / .2)'}}>Get SMS link</button>
          </div>
          <div className="row mt-6 gap-4" style={{color:'oklch(1 0 0 / .7)', fontSize:13}}>
            <span><Icon name="star" size={13}/> 4.9 · App Store</span>
            <span>·</span>
            <span>4.8 · Google Play</span>
            <span>·</span>
            <span>240k downloads in Nigeria</span>
          </div>
        </div>
        <div style={{position:'relative', minHeight:480}}>
          <div className="ph ph-4" style={{position:'absolute', right:60, top:40, width:240, height:480, borderRadius:36, border:'8px solid oklch(0 0 0 / .8)', boxShadow:'0 40px 80px -20px oklch(0 0 0 / .8)'}}>
            <div className="ph-noise" style={{position:'absolute', inset:0, borderRadius:28}}/>
            <div style={{position:'absolute', inset:0, padding:24, color:'white', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
              <div className="row gap-2"><Icon name="qr" size={18}/> <span className="mono text-xs">TICKET · 1 OF 2</span></div>
              <div>
                <div className="serif" style={{fontSize:24}}>Asake · Lungu Boy</div>
                <div className="text-xs muted" style={{color:'oklch(1 0 0 / .7)'}}>Tafawa Balewa Square · Sun 07 Jun</div>
              </div>
            </div>
          </div>
          <div className="card glass" style={{position:'absolute', left:20, top:80, padding:14, width:200, transform:'rotate(-4deg)'}}>
            <div className="row gap-2"><span className="ai-dot" style={{width:18, height:18}}/><span className="text-xs fw-600">Compass tip</span></div>
            <div className="text-xs muted mt-2" style={{lineHeight:1.5}}>Doors open 90 min before. Park at Lot 3 for ₦2k flat.</div>
          </div>
          <div className="card glass" style={{position:'absolute', right:30, bottom:60, padding:14, width:180, transform:'rotate(3deg)'}}>
            <div className="row gap-2"><Icon name="shield" size={14}/><span className="text-xs fw-600">Verified at gate</span></div>
            <div className="text-xs muted mt-2">QR scanned · Welcome, Adaeze</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PageHome = ({ heroVariant = "cinematic" }) => {
  const { go } = useRoute();
  return (
    <div className="page-enter">
      {heroVariant === "editorial" ? <HeroEditorial /> :
       heroVariant === "search" ? <HeroSearchLed /> :
       <HeroCinematic />}

      <LiveTicker/>

      <CategoryTiles/>

      <section className="wrap section-sm">
        <SectionHead eyebrow="Trending tonight" title="Lagos is loud this weekend." sub="Real-time demand across events, comedy and theatre. Don't sleep — half are 80%+ sold." cta="See all events" onCta={() => go({name:"search"})}/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))', gap:20}}>
          {DATA.trending.slice(0,4).map(e => <EventCard key={e.id} e={e} size="full"/>)}
        </div>
      </section>

      <ForYouRail/>

      <section className="wrap section-sm" style={{paddingTop:0}}>
        <SectionHead eyebrow="Featured Concerts" title="The tour bus is parked here." sub="Cinema-grade ticketing for the artists Nigeria moves for." cta="All concerts"/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))', gap:20}}>
          {DATA.concerts.slice(0,4).map(c => <ConcertCard key={c.id} c={c} size="full"/>)}
        </div>
      </section>

      <FlightRail/>
      <BusRail/>
      <WeekendBlock/>
      <TrustStrip/>
      <AppPromo/>
    </div>
  );
};

window.PageHome = PageHome;
