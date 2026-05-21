/* ===== USER DASHBOARD ===== */
const PageDashboard = () => {
  const { go } = useRoute();
  const [tab, setTab] = useState("overview");

  return (
    <div className="page-enter">
      {/* Hero strip */}
      <section style={{position:'relative', overflow:'hidden', borderBottom:'1px solid var(--line)'}} className="nebula">
        <div className="wrap" style={{paddingTop:48, paddingBottom:40, position:'relative'}}>
          <div className="between">
            <div>
              <div className="eyebrow mb-2">Welcome back</div>
              <h1 className="h-1" style={{margin:0, fontSize:56}}>
                Hey <span className="serif accent-text">Adaeze</span>, three things deserve your attention.
              </h1>
            </div>
            <div className="row gap-3">
              <span className="pill-stat">Gold tier</span>
              <span className="pill-stat"><Icon name="gift" size={12}/> 2,847 pts</span>
              <button className="btn btn-ghost"><Icon name="settings" size={14}/> Preferences</button>
            </div>
          </div>

          {/* Stat row */}
          <div className="row mt-8" style={{gap:16}}>
            {[
              {l:"Upcoming",  v:"3",   s:"events & trips", i:"calendar"},
              {l:"Wallet",    v:"₦18,540", s:"available", i:"wallet"},
              {l:"Compass pts", v:"2,847", s:"153 to Platinum", i:"gift"},
              {l:"Saved",     v:"24",  s:"events watched", i:"heart"},
              {l:"This year", v:"₦284k", s:"booked", i:"chart"},
            ].map(s => (
              <div key={s.l} className="card glass" style={{flex:1, padding:18}}>
                <div className="row gap-2 muted" style={{alignItems:'center', fontSize:11}}>
                  <Icon name={s.i} size={12}/> <span className="eyebrow">{s.l}</span>
                </div>
                <div className="h-2 tnum mt-2" style={{fontSize:28}}>{s.v}</div>
                <div className="text-xs muted mt-1">{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap" style={{paddingTop:32, paddingBottom:96}}>
        {/* Tabs */}
        <div className="row" style={{borderBottom:'1px solid var(--line)', marginBottom:32}}>
          {[
            {id:"overview", l:"Overview"},
            {id:"tickets",  l:"My tickets"},
            {id:"trips",    l:"Trips"},
            {id:"wallet",   l:"Wallet"},
            {id:"rewards",  l:"Rewards"},
            {id:"history",  l:"History"},
            {id:"settings", l:"Settings"},
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:'14px 18px',
              borderBottom:`2px solid ${tab===t.id?'var(--accent)':'transparent'}`,
              color: tab===t.id ? 'var(--ink)' : 'var(--ink-3)',
              fontSize:13.5, fontWeight: tab===t.id ? 600 : 500,
            }}>{t.l}</button>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr)', gap:32, alignItems:'flex-start'}}>
          <div className="col gap-6">
            {/* Next up */}
            <div className="card" style={{padding:0, overflow:'hidden'}}>
              <div className="ph ph-3 ph-noise" style={{height:200, position:'relative'}}>
                <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 30%, oklch(0 0 0 / .85))'}}/>
                <div style={{position:'absolute', left:24, right:24, bottom:24, color:'white', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                  <div>
                    <div className="mono text-xs" style={{opacity:.85, letterSpacing:'.16em'}}>NEXT UP · IN 2 DAYS · 14h</div>
                    <div className="serif" style={{fontSize:36, lineHeight:1.05, marginTop:6}}>Burna Boy — African Giant Returns</div>
                    <div className="text-sm mt-1" style={{opacity:.85}}>Eko Convention Centre · Sat 23 May, 9:00 PM</div>
                  </div>
                  <div className="card glass" style={{padding:10, borderRadius:'var(--r-2)'}}>
                    <svg viewBox="0 0 20 20" width="56" height="56">
                      {Array.from({length:20*20}).map((_, i) => {
                        const x = i%20, y = Math.floor(i/20);
                        const on = (x*5+y*7+x*y)%3 === 0 || (x<5&&y<5) || (x>15&&y<5) || (x<5&&y>15);
                        return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="white"/> : null;
                      })}
                    </svg>
                  </div>
                </div>
              </div>
              <div style={{padding:24, display:'grid', gridTemplateColumns:'repeat(4, 1fr) auto', gap:20, alignItems:'center'}}>
                <div>
                  <div className="text-xs muted">Tickets</div>
                  <div className="h-4 mt-1">VIP × 2</div>
                </div>
                <div>
                  <div className="text-xs muted">Seats</div>
                  <div className="h-4 mt-1">Row E · 8, 9</div>
                </div>
                <div>
                  <div className="text-xs muted">Doors</div>
                  <div className="h-4 mt-1">7:00 PM</div>
                </div>
                <div>
                  <div className="text-xs muted">Companion</div>
                  <div className="h-4 mt-1">Tobi A.</div>
                </div>
                <div className="row gap-2">
                  <button className="btn btn-ghost btn-sm">Transfer</button>
                  <button className="btn btn-accent btn-sm">View QR <Icon name="qr" size={13}/></button>
                </div>
              </div>
            </div>

            {/* Upcoming list */}
            <div className="card" style={{padding:24}}>
              <div className="between mb-4">
                <div className="h-3">Upcoming · 3</div>
                <button className="text-sm muted">View all</button>
              </div>
              <div className="col gap-3">
                {[
                  {t:"Basketmouth Live", d:"Fri 29 May", v:"Landmark Centre", ph:"ph-3", c:"in 8 days", k:"Ticket"},
                  {t:"LOS → ABV · Air Peace AP-2031", d:"Fri 06 Jun · 18:25", v:"Murtala Mohammed Intl", ph:"ph-7", c:"in 16 days", k:"Flight"},
                  {t:"Eko Hotel & Suites · 2 nights", d:"Fri 06 Jun – Sun 08 Jun", v:"Victoria Island", ph:"ph-2", c:"in 16 days", k:"Stay"},
                ].map((b,i) => (
                  <div key={i} style={{display:'grid', gridTemplateColumns:'80px minmax(0,1fr) auto auto', gap:16, alignItems:'center', padding:'12px', borderRadius:'var(--r-3)', background:'var(--surface-2)'}}>
                    <div className={`ph ${b.ph} ph-noise`} style={{aspectRatio:'1.4', borderRadius:'var(--r-2)', position:'relative'}}>
                      <span className="badge badge-soon" style={{position:'absolute', top:6, left:6, background:'oklch(0 0 0 / .6)', color:'white', fontSize:9}}>{b.k}</span>
                    </div>
                    <div>
                      <div className="fw-600" style={{fontSize:14}}>{b.t}</div>
                      <div className="text-xs muted mt-1">{b.v} · {b.d}</div>
                    </div>
                    <div className="text-xs accent-text mono">{b.c}</div>
                    <button className="icon-btn"><Icon name="chevron" size={13}/></button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI suggestions */}
            <div className="card" style={{padding:24, background:'linear-gradient(135deg, var(--accent-soft), transparent)', border:'1px solid oklch(0.68 0.18 152 / .3)'}}>
              <div className="row gap-3 mb-4">
                <div className="ai-dot" style={{width:24, height:24}}/>
                <div>
                  <div className="eyebrow accent-text">Compass intelligence</div>
                  <div className="h-3 mt-1">Three things I think you'll love this weekend</div>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
                {[
                  {t:"Sunset cruise · Sat 6pm", s:"Pairs with your Asake Sunday show", price:"₦35,000", m:"96%"},
                  {t:"Nike Art Gallery tour", s:"You saved 3 art events recently", price:"₦8,000", m:"91%"},
                  {t:"Quilox brunch · Sun 1pm", s:"Walking distance from Eko Hotel", price:"₦28,000", m:"88%"},
                ].map((s,i) => (
                  <div key={i} className="card" style={{padding:16, background:'var(--surface)'}}>
                    <div className="ai-pill" style={{fontSize:10}}><span className="ai-dot"/> {s.m} match</div>
                    <div className="fw-600 mt-3" style={{fontSize:14}}>{s.t}</div>
                    <div className="text-xs muted mt-1">{s.s}</div>
                    <div className="between mt-4">
                      <span className="tnum fw-500 text-sm">{s.price}</span>
                      <button className="text-sm accent-text fw-500">Book ↗</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket vault */}
            <div className="card" style={{padding:24}}>
              <div className="between mb-4">
                <div>
                  <div className="eyebrow mb-2">Digital Ticket Vault</div>
                  <div className="h-3">7 active passes</div>
                </div>
                <button className="btn btn-ghost btn-sm">Add to wallet app</button>
              </div>
              <div className="rail">
                {["ph-1","ph-2","ph-3","ph-4","ph-5","ph-6"].map((p, i) => (
                  <div key={p} className="card" style={{width:200, padding:0, overflow:'hidden', flexShrink:0}}>
                    <div className={`ph ${p} ph-noise`} style={{height:100, position:'relative'}}>
                      <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 40%, oklch(0 0 0 / .85))'}}/>
                      <div style={{position:'absolute', left:10, bottom:8, color:'white', fontSize:11, fontFamily:'var(--font-mono)'}}>EVENT · {String(i+1).padStart(2,'0')}/07</div>
                    </div>
                    <div style={{padding:'12px 14px', display:'grid', gridTemplateColumns:'minmax(0,1fr) auto', gap:8, alignItems:'center'}}>
                      <div>
                        <div className="text-xs fw-600">Burna · Eko</div>
                        <div className="text-xs muted">23 May · VIP</div>
                      </div>
                      <Icon name="qr" size={20}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="col gap-4">
            {/* Wallet card */}
            <div className="card" style={{padding:0, overflow:'hidden', border:0}}>
              <div style={{
                padding:24, position:'relative', overflow:'hidden',
                background:'linear-gradient(135deg, oklch(0.18 0.12 152), oklch(0.16 0.12 175), oklch(0.18 0.15 200))',
                color:'white', minHeight:180,
              }}>
                <div className="stars"/>
                <div className="between" style={{position:'relative'}}>
                  <div>
                    <div className="mono text-xs" style={{opacity:.7, letterSpacing:'.18em'}}>WALLET BALANCE</div>
                    <div className="h-1 tnum mt-2" style={{fontSize:40}}>{formatNGN(18540)}</div>
                  </div>
                  <Icon name="wallet" size={22}/>
                </div>
                <div className="between mt-6" style={{position:'relative'}}>
                  <div className="text-xs" style={{opacity:.8}}>Card · •••• 2847</div>
                  <div className="text-xs" style={{opacity:.8}}>Adaeze Okafor</div>
                </div>
              </div>
              <div className="row" style={{padding:12, gap:8}}>
                <button className="btn btn-ghost btn-sm" style={{flex:1}}><Icon name="plus" size={13}/> Top up</button>
                <button className="btn btn-ghost btn-sm" style={{flex:1}}>Send</button>
                <button className="btn btn-ghost btn-sm" style={{flex:1}}>Cash out</button>
              </div>
            </div>

            {/* Compass points */}
            <div className="card" style={{padding:20}}>
              <div className="between mb-3">
                <div className="eyebrow">Compass Rewards</div>
                <span className="chip chip-accent">Gold</span>
              </div>
              <div className="h-1 tnum" style={{fontSize:32}}>2,847</div>
              <div className="text-xs muted">points · 153 to Platinum</div>
              <div className="mt-4" style={{height:6, background:'var(--surface-2)', borderRadius:99}}>
                <div style={{width:'94%', height:'100%', borderRadius:99, background:'linear-gradient(90deg, var(--accent), oklch(0.65 0.18 180))'}}/>
              </div>
              <div className="row gap-2 mt-4" style={{flexWrap:'wrap'}}>
                {["Free flight upgrade", "VIP table draw", "Spa voucher", "Wallet ₦"].map(p => (
                  <span key={p} className="chip" style={{fontSize:11}}>{p}</span>
                ))}
              </div>
            </div>

            {/* Saved */}
            <div className="card" style={{padding:20}}>
              <div className="between mb-3">
                <div className="eyebrow">Watching · 24</div>
                <button className="text-xs accent-text">See all</button>
              </div>
              <div className="col gap-3">
                {[
                  {t:"Tems · Born In The Wild",  s:"Tickets drop in 4 days", ph:"ph-2"},
                  {t:"Davido · Timeless Tour",    s:"Price ↓ 12% this week",  ph:"ph-4"},
                  {t:"Wizkid · Morayo World Tour",s:"VIP now available",      ph:"ph-1"},
                ].map(s => (
                  <div key={s.t} className="row gap-3" style={{alignItems:'center'}}>
                    <div className={`ph ${s.ph} ph-noise`} style={{width:54, height:54, borderRadius:'var(--r-2)', flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div className="fw-600" style={{fontSize:13}}>{s.t}</div>
                      <div className="text-xs muted mt-1">{s.s}</div>
                    </div>
                    <Icon name="bell" size={14}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="card" style={{padding:20}}>
              <div className="eyebrow mb-3">Recent activity</div>
              <div className="col gap-3 text-sm">
                {[
                  {t:"Payment confirmed", s:"Asake VIP × 2 · ₦117,388", d:"2 min ago", a:"check"},
                  {t:"Price alert", s:"LOS→ABV dropped ₦8,500", d:"1h", a:"arrowDown"},
                  {t:"Earned 1,174 pts", s:"From Asake checkout", d:"5h", a:"gift"},
                  {t:"Group invite", s:"Tobi added you to Burna VIP",d:"yesterday", a:"user"},
                ].map((n,i) => (
                  <div key={i} className="row gap-3" style={{alignItems:'flex-start'}}>
                    <div style={{width:30, height:30, borderRadius:'50%', background:'var(--accent-soft)', color:'var(--accent)', display:'grid', placeItems:'center', flexShrink:0}}>
                      <Icon name={n.a} size={14}/>
                    </div>
                    <div style={{flex:1}}>
                      <div className="fw-500" style={{fontSize:13}}>{n.t}</div>
                      <div className="text-xs muted">{n.s}</div>
                    </div>
                    <div className="text-xs muted-2">{n.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <button className="text-sm muted row gap-2" style={{justifyContent:'center', padding:14}}>
              <Icon name="logout" size={13}/> Sign out
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
};

window.PageDashboard = PageDashboard;
