/* ===== USER DASHBOARD ===== */
const ScreenDashboard = () => {
  const { go } = useRoute();
  return (
    <div className="screen-enter" style={{paddingBottom:120}}>
      {/* Top profile bar */}
      <div style={{padding:'16px 16px 0', display:'flex', alignItems:'center', gap:12}}>
        <div style={{
          width:48, height:48, borderRadius:'50%',
          background:'linear-gradient(135deg, var(--accent), oklch(0.55 0.18 180))',
          display:'grid', placeItems:'center', color:'white', fontSize:16, fontWeight:600,
        }}>AO</div>
        <div style={{flex:1}}>
          <div className="text-xs muted">Welcome back</div>
          <div className="fw-600" style={{fontSize:16}}>Adaeze Okafor</div>
        </div>
        <button className="icon-btn"><Icon name="settings" size={18}/></button>
      </div>

      {/* Wallet card */}
      <div style={{padding:'16px'}}>
        <div style={{
          borderRadius:20, overflow:'hidden', position:'relative',
          background:'linear-gradient(135deg, oklch(0.18 0.12 152), oklch(0.16 0.12 175), oklch(0.18 0.15 200))',
          color:'white',
          padding:'20px',
          minHeight:160,
        }}>
          <div className="stars" style={{opacity:.5}}/>
          <div className="between" style={{position:'relative'}}>
            <div>
              <div className="mono text-xs" style={{opacity:.75, letterSpacing:'.18em'}}>WALLET BALANCE</div>
              <div className="h-1 tnum mt-2" style={{fontSize:36}}>{formatNGN(18540)}</div>
            </div>
            <Icon name="wallet" size={22}/>
          </div>
          <div className="row mt-6 gap-2" style={{position:'relative'}}>
            <button className="mbtn mbtn-sm f1" style={{background:'oklch(1 0 0 / .2)', color:'white'}}>
              <Icon name="plus" size={14}/> Top up
            </button>
            <button className="mbtn mbtn-sm f1" style={{background:'oklch(1 0 0 / .2)', color:'white'}}>
              <Icon name="send" size={14}/> Send
            </button>
            <button className="mbtn mbtn-sm f1" style={{background:'oklch(1 0 0 / .2)', color:'white'}}>
              <Icon name="arrowDown" size={14}/> Cash out
            </button>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="rail-h" style={{padding:'0 16px 8px'}}>
        {[
          {l:"Compass pts", v:"2,847", s:"153 to Platinum", i:"gift", to:"rewards"},
          {l:"Saved", v:"24", s:"events watched", i:"heart"},
          {l:"This year", v:"₦284k", s:"booked", i:"chart"},
        ].map(s => (
          <div key={s.l} style={{
            minWidth:140, padding:14,
            background:'var(--surface)', border:'1px solid var(--line)', borderRadius:14,
          }}>
            <div className="row gap-2 muted text-xs"><Icon name={s.i} size={12}/> {s.l}</div>
            <div className="h-3 tnum mt-2" style={{fontSize:22}}>{s.v}</div>
            <div className="text-xs muted mt-1">{s.s}</div>
          </div>
        ))}
      </div>

      {/* Next up — countdown banner */}
      <Section eyebrow="Next up · 2 days · 14h" title="Your headline weekend">
        <button onClick={() => go({name:"ticket"})} style={{
          padding:0, width:'100%', textAlign:'left',
          borderRadius:18, overflow:'hidden', position:'relative',
        }}>
          <div className="ph ph-1 ph-noise" style={{height:200, position:'relative'}}>
            <div className="stars"/>
            <div className="overlay-grad"/>
            <div style={{position:'absolute', top:12, right:12}}>
              <div style={{
                width:48, height:48, borderRadius:10,
                background:'oklch(1 0 0 / .95)', display:'grid', placeItems:'center',
              }}>
                <svg viewBox="0 0 20 20" width={36} height={36}>
                  {Array.from({length:20*20}).map((_, i) => {
                    const x = i%20, y = Math.floor(i/20);
                    const on = (x*5+y*7+x*y)%3===0 || (x<5&&y<5) || (x>15&&y<5) || (x<5&&y>15);
                    return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="oklch(0.18 0.04 152)"/> : null;
                  })}
                </svg>
              </div>
            </div>
            <div style={{position:'absolute', left:16, right:16, bottom:14, color:'white'}}>
              <div className="mono text-xs" style={{opacity:.85}}>SAT 23 MAY · 9PM</div>
              <div className="serif" style={{fontSize:26, lineHeight:1.0, marginTop:4}}>Burna Boy — African Giant Returns</div>
              <div className="text-xs mt-2" style={{opacity:.85}}>VIP × 2 · Row E · Eko Convention</div>
            </div>
          </div>
        </button>
      </Section>

      {/* Upcoming list */}
      <Section title="Upcoming · 3" action="All">
        <div className="col gap-2">
          {[
            {t:"Basketmouth Live", d:"Fri 29 May", v:"Landmark", ph:"ph-3", k:"Ticket", c:"in 8d"},
            {t:"LOS → ABV", d:"Fri 06 Jun · 18:25", v:"Air Peace", ph:"ph-7", k:"Flight", c:"in 16d"},
            {t:"Eko Hotel · 2 nights", d:"Fri 06 – Sun 08", v:"Victoria Island", ph:"ph-2", k:"Stay", c:"in 16d"},
          ].map((b,i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:10, background:'var(--surface)', borderRadius:14, border:'1px solid var(--line)',
            }}>
              <div className={`ph ${b.ph} ph-noise`} style={{width:60, height:60, borderRadius:10, flexShrink:0, position:'relative'}}>
                <span className="badge" style={{position:'absolute', top:4, left:4, background:'oklch(0 0 0 / .55)', color:'white', fontSize:8, padding:'2px 5px'}}>{b.k}</span>
              </div>
              <div style={{flex:1}}>
                <div className="fw-600" style={{fontSize:14}}>{b.t}</div>
                <div className="text-xs muted mt-1">{b.v} · {b.d}</div>
              </div>
              <div className="mono text-xs accent-text">{b.c}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Compass picks */}
      <Section eyebrow="✦ For you" title="3 things this weekend">
        <div className="col gap-3">
          {[
            {t:"Sunset Yacht Cruise · Sat 6pm", s:"Pairs with your Asake show", price:35000, m:"96%", ph:"ph-2"},
            {t:"Nike Art Gallery tour",        s:"You saved 3 art events",      price:8000,  m:"91%", ph:"ph-6"},
          ].map((s,i) => (
            <div key={i} style={{
              padding:14, background:'var(--surface)', borderRadius:14, border:'1px solid var(--line)',
              display:'flex', gap:12, alignItems:'center',
            }}>
              <div className={`ph ${s.ph} ph-noise`} style={{width:60, height:60, borderRadius:10, flexShrink:0}}/>
              <div style={{flex:1}}>
                <span className="ai-pill" style={{fontSize:10}}><span className="ai-dot" style={{width:12, height:12}}/>{s.m} match</span>
                <div className="fw-600 mt-1" style={{fontSize:14}}>{s.t}</div>
                <div className="text-xs muted mt-1">{s.s}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="fw-600 tnum text-sm">{formatNGN(s.price)}</div>
                <button className="text-sm accent-text fw-500 mt-1">Book</button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Quick links */}
      <div style={{padding:'24px 16px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          {[
            {l:"Organizer mode", s:"Sell tickets",  i:"chart", to:"organizer"},
            {l:"Help & support", s:"24/7 WhatsApp", i:"info"},
            {l:"Rewards",        s:"2,847 pts",     i:"gift"},
            {l:"Settings",       s:"Privacy · App", i:"settings"},
          ].map(q => (
            <button key={q.l} onClick={() => q.to && go({name:q.to})} style={{
              padding:14, background:'var(--surface)', borderRadius:14, border:'1px solid var(--line)',
              textAlign:'left',
            }}>
              <Icon name={q.i} size={20}/>
              <div className="fw-600 mt-2" style={{fontSize:13}}>{q.l}</div>
              <div className="text-xs muted mt-1">{q.s}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

window.ScreenDashboard = ScreenDashboard;
