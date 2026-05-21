/* ===== ORGANIZER (Mobile) ===== */
const ScreenOrganizer = () => {
  const { back } = useRoute();

  // Sparkline
  const Spark = ({ data, w = 100, h = 32, color = "var(--accent)" }) => {
    const max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h - ((v-min)/(max-min || 1))*h}`).join(' ');
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <div className="screen-enter" style={{paddingBottom:120}}>
      <ScreenHeader title="Promoter Hub" onBack={back} right={<button className="icon-btn" style={{width:34, height:34}}><Icon name="plus" size={16}/></button>}/>

      <div style={{padding:'8px 16px 0'}}>
        {/* Event selector */}
        <div className="mcard" style={{padding:14}}>
          <div className="row gap-2 mb-1">
            <span className="dot dot-live"/>
            <span className="text-xs muted">Live · on sale</span>
          </div>
          <div className="h-3">Asake — Lungu Boy Tour</div>
          <div className="text-xs muted mt-1">Sun 07 Jun · Tafawa Balewa Sq · 17 days left</div>
        </div>

        {/* KPIs */}
        <div className="row gap-2 mt-4">
          {[
            {l:"Revenue", v:"₦4.8M", d:"+24%", spark:[10,14,12,18,22,28,32,38,44,52]},
            {l:"Tickets", v:"21,030", d:"+12%", spark:[12,14,18,20,24,28,30,34,38,42]},
          ].map(k => (
            <div key={k.l} className="f1 mcard" style={{padding:14}}>
              <div className="eyebrow">{k.l}</div>
              <div className="h-2 tnum mt-2" style={{fontSize:22}}>{k.v}</div>
              <div className="between mt-2">
                <span className="text-xs accent-text fw-600">{k.d}</span>
                <Spark data={k.spark} w={56} h={20}/>
              </div>
            </div>
          ))}
        </div>

        {/* Sales chart */}
        <Section eyebrow="Sales velocity" title="Daily vs forecast" sub="On track · selling out 2 days early">
          <div className="mcard" style={{padding:16}}>
            <svg viewBox="0 0 320 140" width="100%" height="140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="oareaM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--accent)" stopOpacity=".35"/>
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0,1,2,3].map(i => (
                <line key={i} x1="0" x2="320" y1={35*i} y2={35*i} stroke="var(--line)" strokeDasharray="3 5"/>
              ))}
              {/* Forecast (dashed) */}
              <path d="M0,110 C40,100 80,90 120,80 C160,68 200,55 240,40 C280,28 300,22 320,18"
                stroke="oklch(0.65 0.18 180)" strokeWidth="2" strokeDasharray="5 5" fill="none"/>
              {/* Actual */}
              <path d="M0,120 C40,115 80,108 120,95 C160,80 200,60 240,42 C280,28 300,18 320,12"
                stroke="var(--accent)" strokeWidth="3" fill="none"/>
              <path d="M0,120 C40,115 80,108 120,95 C160,80 200,60 240,42 C280,28 300,18 320,12 L320,140 L0,140 Z" fill="url(#oareaM)"/>
              <circle cx="320" cy="12" r="5" fill="var(--accent)" stroke="white" strokeWidth="2"/>
            </svg>
            <div className="row gap-3 mt-3" style={{flexWrap:'wrap'}}>
              <span className="row gap-1 text-xs muted"><span className="dot" style={{background:'var(--accent)'}}/> Actual</span>
              <span className="row gap-1 text-xs muted"><span className="dot" style={{background:'oklch(0.65 0.18 180)'}}/> Forecast</span>
              <span style={{flex:1}}/>
              <span className="ai-pill"><span className="ai-dot" style={{width:12, height:12}}/>Sell-out: 2d early</span>
            </div>
          </div>
        </Section>

        {/* Tier breakdown */}
        <Section title="Tiers · 95.6% sold">
          <div className="mcard" style={{padding:16}}>
            <div className="col gap-3">
              {[
                {l:"Diamond Booth", s:97, c:"oklch(0.65 0.20 30)"},
                {l:"VIP Lounge",    s:88, c:"var(--accent)"},
                {l:"Premium",       s:92, c:"oklch(0.65 0.18 180)"},
                {l:"Regular",       s:99, c:"oklch(0.60 0.16 230)"},
              ].map(t => (
                <div key={t.l}>
                  <div className="between mb-1">
                    <span className="text-sm fw-500">{t.l}</span>
                    <span className="text-xs muted tnum">{t.s}%</span>
                  </div>
                  <div className="bar"><div style={{width:`${t.s}%`, background:t.c}}/></div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Live scans */}
        <Section title="Live entry · QR scans" eyebrow="Real-time">
          <div className="mcard" style={{padding:16}}>
            <div className="row mb-3" style={{gap:16}}>
              <div className="f1">
                <div className="text-xs muted">Scanned in</div>
                <div className="h-3 tnum mt-1">14,820</div>
              </div>
              <div className="f1">
                <div className="text-xs muted">Pending</div>
                <div className="h-3 tnum mt-1">6,210</div>
              </div>
              <div className="f1">
                <div className="text-xs muted">Flagged</div>
                <div className="h-3 tnum mt-1" style={{color:'var(--danger)'}}>3</div>
              </div>
            </div>
            <div className="col gap-2">
              {[
                {n:"Gate A · 2", c:"VIP · Row B",  t:"2s", ok:true},
                {n:"Gate B · 1", c:"Premium",      t:"4s", ok:true},
                {n:"Gate B · 3", c:"Dup QR flagged", t:"11s", ok:false},
              ].map((r,i) => (
                <div key={i} className="row" style={{padding:'8px 10px', borderRadius:10, background:'var(--surface-2)', fontSize:13, alignItems:'center'}}>
                  <Icon name={r.ok?'check':'info'} size={14} stroke={2.5} style={{color: r.ok?'var(--accent)':'var(--danger)'}}/>
                  <span className="fw-500">{r.n}</span>
                  <span className="muted text-xs">{r.c}</span>
                  <span style={{flex:1}}/>
                  <span className="mono text-xs muted">{r.t}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* AI insights */}
        <Section eyebrow="✦ Compass insights" title="Moves to make in 48h">
          <div className="col gap-3">
            {[
              {i:"chart", t:"Drop Diamond by 8%",     v:"+₦4.6M projected"},
              {i:"send",  t:"Push Abuja audience",    v:"+820 tickets est."},
              {i:"shield",t:"Open scan lanes early",  v:"Risk ↓ 47%"},
            ].map((c,i) => (
              <div key={i} style={{
                padding:14, borderRadius:14,
                background:'linear-gradient(135deg, var(--accent-soft), transparent)',
                border:'1px solid oklch(0.62 0.18 152 / .25)',
              }}>
                <div className="row gap-3" style={{alignItems:'center'}}>
                  <div style={{width:34, height:34, borderRadius:10, background:'var(--surface)', color:'var(--accent)', display:'grid', placeItems:'center'}}>
                    <Icon name={c.i} size={16}/>
                  </div>
                  <div style={{flex:1}}>
                    <div className="fw-600 text-sm">{c.t}</div>
                    <div className="text-xs accent-text fw-600 mt-1">{c.v}</div>
                  </div>
                  <button className="text-sm fw-600">Apply →</button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

window.ScreenOrganizer = ScreenOrganizer;
