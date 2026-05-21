/* ===== ORGANIZER DASHBOARD ===== */
const PageOrganizer = () => {
  const { go } = useRoute();

  // Stylized sparkline
  const Spark = ({ data = [12,18,14,22,28,24,32,30,38,42,48,54], color = "var(--accent)", w = 220, h = 60 }) => {
    const max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h - ((v-min)/(max-min))*h}`).join(' ');
    const area = `M0,${h} L${pts} L${w},${h} Z`;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
        <defs>
          <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".4"/>
            <stop offset="1" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sp)"/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={w} cy={h - ((data[data.length-1]-min)/(max-min))*h} r="4" fill={color} stroke="var(--surface)" strokeWidth="2"/>
      </svg>
    );
  };

  return (
    <div className="page-enter">
      {/* Org sub-nav */}
      <div style={{background:'var(--bg-deep)', borderBottom:'1px solid var(--line)'}}>
        <div className="wrap" style={{display:'flex', alignItems:'center', height:56, gap:24}}>
          <div className="row gap-2">
            <div style={{width:28, height:28, borderRadius:'var(--r-1)', background:'linear-gradient(135deg, var(--accent), oklch(0.55 0.18 180))'}}/>
            <span className="fw-600">Livespot360</span>
            <Icon name="chevronDown" size={13}/>
          </div>
          <nav className="row" style={{gap:0, marginLeft:24}}>
            {["Dashboard","Events","Tickets","Attendees","Scan","Staff","Payouts","Reports","Settings"].map((n,i) => (
              <button key={n} style={{
                padding:'18px 16px', fontSize:13, fontWeight:500,
                color: i===0?'var(--ink)':'var(--ink-3)',
                borderBottom: i===0?'2px solid var(--accent)':'2px solid transparent',
              }}>{n}</button>
            ))}
          </nav>
          <div style={{flex:1}}/>
          <button className="btn btn-ghost btn-sm">Help</button>
          <button className="btn btn-accent btn-sm"><Icon name="plus" size={13}/> Create event</button>
        </div>
      </div>

      <section className="wrap" style={{paddingTop:32, paddingBottom:96}}>
        <div className="between mb-6">
          <div>
            <div className="eyebrow mb-2">Promoter Hub</div>
            <h1 className="h-2">Asake — Lungu Boy Tour</h1>
            <div className="row gap-3 mt-2 muted text-sm">
              <span><Icon name="calendar" size={13}/> Sun 07 Jun · 8:00 PM</span>
              <span><Icon name="pin" size={13}/> Tafawa Balewa Square</span>
              <span className="row gap-1"><span className="dot dot-live"/> On sale · 17 days left</span>
            </div>
          </div>
          <div className="row gap-2">
            <button className="btn btn-ghost btn-sm">Export <Icon name="arrowDown" size={13}/></button>
            <button className="btn btn-ghost btn-sm">Share</button>
            <button className="btn btn-primary btn-sm"><Icon name="eye" size={13}/> Preview public page</button>
          </div>
        </div>

        {/* KPI row */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24}}>
          {[
            {l:"Revenue today",   v:"₦4.8M",   d:"+24%", t:"vs yesterday", spark:[10,14,12,18,22,28,32,38,44,48,52,58]},
            {l:"Tickets sold",    v:"21,030",  d:"+12%", t:"of 22,000 cap", spark:[12,14,18,20,24,28,30,34,38,42,46,52]},
            {l:"Avg ticket price",v:"₦42,580", d:"+3%",  t:"vs last event", spark:[40,42,38,44,42,46,48,44,46,48,50,52]},
            {l:"Conversion",      v:"6.8%",    d:"+0.4", t:"site visit → buy", spark:[4,5,4.8,5.5,6,5.8,6.2,6.4,6.6,6.5,6.7,6.8]},
          ].map(k => (
            <div key={k.l} className="card" style={{padding:20}}>
              <div className="between">
                <div className="eyebrow">{k.l}</div>
                <span className="chip" style={{padding:'2px 8px', fontSize:10, color:'var(--accent)', background:'var(--accent-soft)', border:0}}>{k.d}</span>
              </div>
              <div className="h-1 tnum mt-3" style={{fontSize:32}}>{k.v}</div>
              <div className="text-xs muted">{k.t}</div>
              <div style={{marginTop:8, marginLeft:-4}}>
                <Spark data={k.spark} w={240} h={40}/>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.6fr) minmax(0,1fr)', gap:20}}>
          {/* Sales chart */}
          <div className="card" style={{padding:24}}>
            <div className="between mb-4">
              <div>
                <div className="eyebrow">Sales velocity</div>
                <div className="h-3 mt-1">Daily ticket sales vs forecast</div>
              </div>
              <div className="row gap-2">
                <button className="chip">7d</button>
                <button className="chip active">30d</button>
                <button className="chip">All</button>
              </div>
            </div>

            {/* Mock area chart */}
            <div style={{position:'relative', height:260, marginTop:16}}>
              <svg viewBox="0 0 800 260" width="100%" height="260" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="oarea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity=".35"/>
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="oarea2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--violet)" stopOpacity=".2"/>
                    <stop offset="1" stopColor="var(--violet)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Grid */}
                {[0,1,2,3,4].map(i => (
                  <line key={i} x1="0" x2="800" y1={52*i} y2={52*i} stroke="var(--line)" strokeDasharray="4 6"/>
                ))}
                {/* Forecast (dashed) */}
                <path d="M0,200 C80,180 160,170 240,150 C320,130 400,110 480,90 C560,72 640,60 720,42 L800,32"
                      stroke="var(--violet)" strokeWidth="2" strokeDasharray="6 6" fill="none"/>
                <path d="M0,200 C80,180 160,170 240,150 C320,130 400,110 480,90 C560,72 640,60 720,42 L800,32 L800,260 L0,260 Z" fill="url(#oarea2)"/>
                {/* Actual */}
                <path d="M0,220 C60,205 120,195 180,180 C240,168 300,150 360,128 C420,108 480,80 540,60 C600,42 660,30 720,22 L800,18"
                      stroke="var(--accent)" strokeWidth="3" fill="none"/>
                <path d="M0,220 C60,205 120,195 180,180 C240,168 300,150 360,128 C420,108 480,80 540,60 C600,42 660,30 720,22 L800,18 L800,260 L0,260 Z" fill="url(#oarea)"/>
                {/* Markers */}
                {[
                  {x:180, y:180, t:"VIP launched"},
                  {x:480, y:90,  t:"Compass push"},
                  {x:720, y:22, t:"Now"},
                ].map((m,i) => (
                  <g key={i}>
                    <circle cx={m.x} cy={m.y} r="5" fill="var(--accent)" stroke="var(--bg-base)" strokeWidth="2"/>
                  </g>
                ))}
              </svg>
              {/* Now label */}
              <div style={{position:'absolute', right:0, top:-8, transform:'translateX(50%)'}}>
                <span className="badge" style={{background:'var(--accent)', color:'oklch(0.2 0.05 152)'}}>Now</span>
              </div>
            </div>

            <div className="row mt-6 gap-6" style={{flexWrap:'wrap'}}>
              <span className="row gap-2 text-xs muted"><span className="dot" style={{background:'var(--accent)'}}/> Actual sales</span>
              <span className="row gap-2 text-xs muted"><span className="dot" style={{background:'var(--violet)'}}/> Forecast</span>
              <span className="row gap-2 text-xs muted"><span className="dot" style={{background:'var(--ink-3)'}}/> Industry benchmark</span>
              <span style={{flex:1}}/>
              <span className="ai-pill"><span className="ai-dot"/><span>You'll sell out 2 days early</span></span>
            </div>
          </div>

          {/* Tier breakdown */}
          <div className="card" style={{padding:24}}>
            <div className="eyebrow mb-3">Tier breakdown</div>
            <div className="h-3 mb-4">Inventory · 95.6% sold</div>
            <div className="col gap-4">
              {[
                {l:"Diamond Booth", s:97, sold:147, total:150, p:380000, c:"oklch(0.65 0.20 30)"},
                {l:"VIP Lounge",    s:88, sold:2640, total:3000, p:120000, c:"var(--accent)"},
                {l:"Premium Stand", s:92, sold:6440, total:7000, p:55000,  c:"oklch(0.65 0.18 180)"},
                {l:"Regular",       s:99, sold:11800,total:11850,p:30000,  c:"var(--cyan)"},
              ].map(t => (
                <div key={t.l}>
                  <div className="between mb-2">
                    <span className="fw-500" style={{fontSize:13}}>{t.l}</span>
                    <span className="text-xs muted tnum">{t.sold.toLocaleString()} / {t.total.toLocaleString()}</span>
                  </div>
                  <div style={{height:6, background:'var(--surface-2)', borderRadius:99, position:'relative', overflow:'hidden'}}>
                    <div style={{width:`${t.s}%`, height:'100%', background:t.c, borderRadius:99}}/>
                  </div>
                  <div className="between mt-1 mono text-xs muted-2"><span>{formatNGN(t.p)} · {t.s}% sold</span><span>Rev {formatNGN(t.sold*t.p).replace(/\.\d+/,'')}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Live scan feed */}
          <div className="card" style={{padding:24}}>
            <div className="between mb-3">
              <div>
                <div className="eyebrow">Live entry · QR scans</div>
                <div className="h-3 mt-1">Real-time gate activity</div>
              </div>
              <span className="pill-stat"><span className="dot dot-live"/> Live</span>
            </div>
            <div className="row mt-4 mb-4" style={{gap:24, flexWrap:'wrap'}}>
              <div><div className="eyebrow">Scanned in</div><div className="h-2 tnum mt-1" style={{fontSize:28}}>14,820</div></div>
              <div><div className="eyebrow">Pending</div><div className="h-2 tnum mt-1" style={{fontSize:28}}>6,210</div></div>
              <div><div className="eyebrow">Flagged</div><div className="h-2 tnum mt-1" style={{fontSize:28, color:'var(--danger)'}}>3</div></div>
            </div>
            <div className="col gap-2">
              {[
                {n:"Gate A · Lane 2", c:"Scanned · VIP · Row B",  t:"2s ago", ok:true},
                {n:"Gate B · Lane 1", c:"Scanned · Premium",      t:"4s ago", ok:true},
                {n:"Gate B · Lane 3", c:"Flagged · duplicate QR", t:"11s ago", ok:false},
                {n:"Gate A · Lane 1", c:"Scanned · Diamond",      t:"14s ago", ok:true},
                {n:"Gate C · Lane 2", c:"Scanned · Regular",      t:"15s ago", ok:true},
              ].map((r,i) => (
                <div key={i} className="row gap-3" style={{padding:'8px 12px', borderRadius:'var(--r-2)', background:i%2?'var(--surface-2)':'transparent', fontSize:12.5}}>
                  <Icon name={r.ok?'check':'info'} size={14} stroke={2} style={{color: r.ok?'var(--accent)':'var(--danger)'}}/>
                  <span className="fw-500">{r.n}</span>
                  <span className="muted">{r.c}</span>
                  <span style={{flex:1}}/>
                  <span className="mono text-xs muted-2">{r.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Channel performance */}
          <div className="card" style={{padding:24}}>
            <div className="eyebrow mb-3">Sales by channel</div>
            <div className="h-3 mb-4">Where buyers came from</div>
            <div className="col gap-4">
              {[
                {l:"Compass app (Android)", v:38, c:formatNGN(8000000)},
                {l:"Compass web",           v:24, c:formatNGN(5100000)},
                {l:"Compass app (iOS)",     v:18, c:formatNGN(3800000)},
                {l:"Direct artist link",    v:11, c:formatNGN(2300000)},
                {l:"Instagram (paid)",      v:6,  c:formatNGN(1280000)},
                {l:"USSD · *894#",          v:3,  c:formatNGN(630000)},
              ].map(c => (
                <div key={c.l}>
                  <div className="between mb-1">
                    <span className="text-sm">{c.l}</span>
                    <span className="text-xs muted tnum">{c.v}% · {c.c}</span>
                  </div>
                  <div style={{height:4, background:'var(--surface-2)', borderRadius:99}}>
                    <div style={{width:`${c.v}%`, height:'100%', background:'linear-gradient(90deg, var(--accent), oklch(0.65 0.18 180))', borderRadius:99}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI performance insights */}
          <div className="card" style={{padding:24, gridColumn:'span 2', background:'linear-gradient(135deg, var(--accent-soft), transparent)', border:'1px solid oklch(0.68 0.18 152 / .3)'}}>
            <div className="between mb-4">
              <div className="row gap-3">
                <div className="ai-dot" style={{width:28, height:28}}/>
                <div>
                  <div className="eyebrow accent-text">Compass insights</div>
                  <div className="h-3 mt-1">Three moves to make in the next 48 hours</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">Apply all</button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
              {[
                {i:"chart", t:"Drop Diamond by 8%", s:"Diamond is the only tier behind forecast. A modest cut + countdown banner pushes you over the line.", v:"+₦4.6M projected"},
                {i:"send",  t:"Push Abuja audience", s:"31% of abandoned carts in Abuja. Flight bundle (Air Peace + ticket) closes 64% of them historically.", v:"+820 tickets est."},
                {i:"shield",t:"Open scan lanes early", s:"Last show, 18% of attendees arrived in the last 30 min. Open Gate D from 7pm reduces complaints by half.", v:"Risk ↓ 47%"},
              ].map((c,i) => (
                <div key={i} className="card" style={{padding:18, background:'var(--surface)'}}>
                  <div style={{width:34, height:34, borderRadius:'var(--r-2)', background:'var(--accent-soft)', color:'var(--accent)', display:'grid', placeItems:'center'}}>
                    <Icon name={c.i} size={16}/>
                  </div>
                  <div className="fw-600 mt-3" style={{fontSize:14}}>{c.t}</div>
                  <p className="text-xs muted mt-2" style={{lineHeight:1.6}}>{c.s}</p>
                  <div className="between mt-4">
                    <span className="text-xs accent-text fw-600">{c.v}</span>
                    <button className="text-xs fw-500">Apply →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

window.PageOrganizer = PageOrganizer;
