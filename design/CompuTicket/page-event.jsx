/* ===== EVENT DETAILS PAGE ===== */
const PageEvent = ({ id = "e3" }) => {
  const e = DATA.trending.find(x => x.id === id) || DATA.trending[2];
  const { go } = useRoute();
  const [tier, setTier] = useState(1);
  const tiers = [
    { id:0, name:"Early Bird",      price:18000, perks:["Standing pit","Entry by 8pm"], soldOut:true },
    { id:1, name:"Regular",         price:30000, perks:["Standing access","Open bar voucher x1"] },
    { id:2, name:"Premium Stand",   price:55000, perks:["Elevated viewing","Express entry","Coat check"] },
    { id:3, name:"VIP Lounge",      price:120000,perks:["Reserved table for 4","Bottle service","Meet-and-greet draw"], vip:true },
    { id:4, name:"Diamond Booth",   price:380000,perks:["Private booth (8)","Dedicated host","Soundcheck access"], vip:true, scarce:true },
  ];

  return (
    <div className="page-enter">
      {/* Cinematic header */}
      <section style={{position:'relative', overflow:'hidden'}}>
        <div className={`ph ${e.ph} ph-noise`} style={{position:'absolute', inset:0, height:640}}/>
        <div style={{position:'absolute', inset:0, height:640, background:'linear-gradient(180deg, oklch(0.06 0.03 285 / .4), oklch(0.06 0.03 285 / .95) 80%, var(--bg-void))'}}/>
        <div className="wrap" style={{position:'relative', paddingTop:80, paddingBottom:60, minHeight:640}}>
          <div className="row gap-2 mb-6">
            {e.live && <span className="badge badge-live"><span className="dot" style={{background:'white'}}/> Live now</span>}
            {e.vip && <span className="badge badge-vip">VIP available</span>}
            <span className="badge badge-soon" style={{background:'oklch(0 0 0 / .4)', color:'white'}}>{e.tag}</span>
            <span className="badge badge-soon" style={{background:'oklch(0 0 0 / .4)', color:'white'}}>18+</span>
          </div>
          <div className="mono text-xs" style={{letterSpacing:'.2em', color:'oklch(1 0 0 / .8)'}}>{e.date.toUpperCase()} · {e.time} · {e.city.toUpperCase()}</div>
          <h1 className="h-1" style={{margin:'14px 0 8px', maxWidth:920, fontSize:88, color:'white'}}>{e.title}</h1>
          <div className="row gap-4" style={{color:'oklch(1 0 0 / .85)'}}>
            <span><Icon name="pin" size={14}/> {e.venue}</span>
            <span>·</span>
            <span><Icon name="clock" size={14}/> Doors 7:00 PM</span>
            <span>·</span>
            <span>Organizer: <b style={{color:'var(--accent)'}}>{e.organizer}</b> {e.verified && <Icon name="check" size={13}/>}</span>
          </div>

          {/* Trailer card */}
          <div style={{marginTop:48, display:'grid', gridTemplateColumns:'minmax(0,1.4fr) minmax(0,1fr)', gap:32}}>
            <div className="card glass" style={{padding:24, color:'white'}}>
              <div className="between mb-4">
                <div className="row gap-3">
                  <button className="icon-btn" style={{width:56, height:56, background:'var(--accent)', border:0, color:'oklch(0.2 0.05 152)'}}><Icon name="play" size={22}/></button>
                  <div>
                    <div className="h-4">Watch the trailer</div>
                    <div className="text-xs muted">1m 24s · 240k views</div>
                  </div>
                </div>
                <button className="btn btn-glass btn-sm"><Icon name="heart" size={13}/> Save</button>
              </div>
              <div className="hr"/>
              <div className="row gap-6 mt-4" style={{flexWrap:'wrap'}}>
                <Stat label="Attending" value={e.attending.toLocaleString()}/>
                <Stat label="Capacity" value={e.capacity.toLocaleString()}/>
                <Stat label="Sold" value={`${Math.round(e.attending/e.capacity*100)}%`}/>
                <Stat label="Time left" value={e.countdown}/>
              </div>
            </div>
            {/* Friends attending */}
            <div className="card glass" style={{padding:20, color:'white'}}>
              <div className="eyebrow mb-3">Friends attending · 12</div>
              <div className="row" style={{gap:-8}}>
                {["AO","TB","CN","EK","FA","BM","NU"].map((n,i) => (
                  <div key={i} style={{
                    width:42, height:42, borderRadius:'50%', border:'2px solid var(--bg-deep)',
                    background:`linear-gradient(135deg, oklch(0.55 0.20 ${140+i*10}), oklch(0.65 0.18 ${170+i*8}))`,
                    display:'grid', placeItems:'center', color:'white', fontSize:13, fontWeight:600,
                    marginLeft: i ? -10 : 0,
                  }}>{n}</div>
                ))}
                <div style={{
                  width:42, height:42, borderRadius:'50%', border:'2px solid var(--bg-deep)',
                  background:'oklch(1 0 0 / .1)', display:'grid', placeItems:'center', fontSize:11, marginLeft:-10,
                }}>+5</div>
              </div>
              <p className="text-sm mt-3" style={{color:'oklch(1 0 0 / .8)', lineHeight:1.5}}>
                <b>Tobi, Chika</b> and 10 more are going. Want to group your seats?
              </p>
              <button className="btn btn-accent btn-sm mt-3">Group seats <Icon name="arrow" size={13}/></button>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="wrap" style={{paddingTop:48, paddingBottom:96, display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:48, alignItems:'flex-start'}}>
        <div>
          {/* About */}
          <div className="card" style={{padding:32}}>
            <div className="eyebrow mb-3">About the show</div>
            <h3 className="h-3">A night of Mr. Money With The Vibe.</h3>
            <p style={{color:'var(--ink-2)', fontSize:15, lineHeight:1.7, marginTop:12, textWrap:'pretty'}}>
              Asake's Lungu Boy World Tour finally lands on home soil. Expect deep cuts, the full
              <span className="serif accent-text"> Mr Money & The Vibe</span> live band, surprise guests across the Afrobeats
              royal court, and one of the most demanding stage productions Tafawa Balewa Square has ever seen.
            </p>
            <div className="row mt-6 gap-3" style={{flexWrap:'wrap'}}>
              {["Afrobeats","Live band","Outdoor","Strictly 18+","Bag policy: small only","No re-entry"].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>

          {/* Lineup */}
          <div className="card mt-6" style={{padding:32}}>
            <div className="eyebrow mb-4">Lineup · 6 acts</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16}}>
              {[
                {n:"Asake",          r:"Headliner",  ph:"ph-3"},
                {n:"Olamide",        r:"Special guest", ph:"ph-1"},
                {n:"Fireboy DML",    r:"Opener",     ph:"ph-2"},
                {n:"Zinoleesky",     r:"Opener",     ph:"ph-6"},
                {n:"Seyi Vibez",     r:"Opener",     ph:"ph-4"},
                {n:"DJ Big N",       r:"Resident DJ",ph:"ph-5"},
              ].map(a => (
                <div key={a.n} className="card-hover" style={{
                  padding:0, borderRadius:'var(--r-3)', overflow:'hidden',
                  border:'1px solid var(--line)', background:'var(--surface-2)',
                }}>
                  <div className={`ph ${a.ph} ph-noise`} style={{aspectRatio:'1', position:'relative'}}>
                    <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 60%, oklch(0 0 0 / .85))'}}/>
                    <div style={{position:'absolute', left:12, bottom:10, color:'white'}}>
                      <div className="h-4">{a.n}</div>
                      <div className="text-xs" style={{opacity:.8}}>{a.r}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seat map */}
          <div className="card mt-6" style={{padding:32}}>
            <div className="between mb-4">
              <div>
                <div className="eyebrow mb-2">Interactive seating</div>
                <div className="h-3">Pick your section</div>
              </div>
              <div className="row gap-3" style={{fontSize:12, color:'var(--ink-3)'}}>
                <span className="row gap-1"><span className="seat" style={{width:14, height:14, cursor:'default'}}/> Available</span>
                <span className="row gap-1"><span className="seat selected" style={{width:14, height:14, cursor:'default'}}/> Selected</span>
                <span className="row gap-1"><span className="seat vip" style={{width:14, height:14, cursor:'default'}}/> VIP</span>
                <span className="row gap-1"><span className="seat sold" style={{width:14, height:14, cursor:'default'}}/> Sold</span>
              </div>
            </div>

            {/* Stage */}
            <div style={{
              padding:'12px 16px', background:'var(--ink)', color:'var(--bg-void)',
              borderRadius:'var(--r-3)', textAlign:'center',
              fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'.3em',
              boxShadow:'0 20px 60px -10px var(--accent-glow)',
            }}>STAGE</div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6, marginTop:16}}>
              {/* Rows */}
              {Array.from({length:10}).map((_, r) => (
                <div key={r} className="row gap-1" style={{justifyContent:'center'}}>
                  <span className="mono text-xs muted" style={{width:18}}>{String.fromCharCode(65+r)}</span>
                  {Array.from({length:r < 2 ? 14 : r < 5 ? 18 : 22}).map((_, c) => {
                    const sold = (r*7 + c*3) % 11 < 3;
                    const vip = r < 2;
                    const sel = r === 4 && (c === 8 || c === 9);
                    return <span key={c} className={`seat ${sold?'sold':''} ${vip?'vip':''} ${sel?'selected':''}`}/>;
                  })}
                </div>
              ))}
            </div>
            <div className="between mt-6" style={{paddingTop:16, borderTop:'1px solid var(--line)'}}>
              <div>
                <div className="text-xs muted">2 seats selected · Row E · 8, 9</div>
                <div className="h-4 tnum mt-1">{formatNGN(60000)}</div>
              </div>
              <button className="btn btn-accent">Continue to checkout <Icon name="arrow" size={14}/></button>
            </div>
          </div>

          {/* Reviews */}
          <div className="card mt-6" style={{padding:32}}>
            <div className="between mb-4">
              <div className="eyebrow">Verified attendee reviews</div>
              <div className="row gap-1"><Icon name="star" size={14}/> <span className="fw-600">4.9</span> <span className="muted">· 312 reviews</span></div>
            </div>
            <div className="col gap-4">
              {[
                {n:"Tobi A.", r:5, t:"Asake delivered. Setlist was tight, sound was insane. VIP table was worth every kobo."},
                {n:"Chika M.", r:5, t:"Group seats worked perfectly. Got 6 of us in row C. Compass tip about Lot 3 saved us 40 mins."},
                {n:"Folake B.", r:4, t:"Show was incredible. Only docking one star because entry queue was slow — bring early entry next time."},
              ].map((r,i) => (
                <div key={i} style={{display:'grid', gridTemplateColumns:'auto minmax(0,1fr)', gap:14}}>
                  <div style={{width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg, oklch(0.55 0.20 ${140+i*20}), var(--accent))`, display:'grid', placeItems:'center', color:'white', fontWeight:600, fontSize:13}}>{r.n[0]}</div>
                  <div>
                    <div className="between">
                      <span className="fw-600">{r.n}</span>
                      <span className="text-xs muted">{Array.from({length:r.r}).map((_,i)=><Icon key={i} name="star" size={11}/>)}</span>
                    </div>
                    <p className="text-sm mt-2" style={{color:'var(--ink-2)', lineHeight:1.6}}>{r.t}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky ticket sidebar */}
        <aside style={{position:'sticky', top: 96, display:'flex', flexDirection:'column', gap:16}}>
          <div className="card" style={{padding:24}}>
            <div className="between mb-3">
              <div className="eyebrow">Select ticket tier</div>
              <span className="ai-pill"><span className="ai-dot"/><span>AI: pick Premium</span></span>
            </div>
            <div className="col gap-2">
              {tiers.map(t => (
                <button key={t.id} disabled={t.soldOut}
                  onClick={() => !t.soldOut && setTier(t.id)}
                  style={{
                    textAlign:'left', padding:'14px 16px',
                    borderRadius:'var(--r-3)',
                    border:`1px solid ${tier===t.id?'var(--accent)':'var(--line)'}`,
                    background: tier===t.id ? 'var(--accent-soft)' : 'var(--surface-2)',
                    opacity: t.soldOut ? 0.5 : 1,
                    cursor: t.soldOut ? 'not-allowed' : 'pointer',
                  }}>
                  <div className="between">
                    <div>
                      <div className="row gap-2" style={{alignItems:'center'}}>
                        <span className="fw-600">{t.name}</span>
                        {t.vip && <span className="badge badge-vip">VIP</span>}
                        {t.scarce && <span className="badge" style={{background:'var(--danger)', color:'white'}}>3 left</span>}
                        {t.soldOut && <span className="badge badge-soon">Sold out</span>}
                      </div>
                      <div className="text-xs muted mt-1">{t.perks.join(' · ')}</div>
                    </div>
                    <div className="h-4 tnum">{formatNGN(t.price)}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="hr mt-4 mb-4"/>

            <div className="between">
              <span className="muted">Quantity</span>
              <div className="row gap-2" style={{alignItems:'center'}}>
                <button className="icon-btn" style={{width:32, height:32}}><Icon name="minus" size={13}/></button>
                <span className="fw-600 tnum">2</span>
                <button className="icon-btn" style={{width:32, height:32}}><Icon name="plus" size={13}/></button>
              </div>
            </div>

            <div className="between mt-4" style={{padding:'14px 0', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
              <span className="fw-500">Total</span>
              <span className="h-3 tnum">{formatNGN(tiers[tier].price * 2)}</span>
            </div>

            <button className="btn btn-accent btn-lg mt-4" style={{width:'100%', justifyContent:'center'}}
              onClick={() => go({name:"checkout", id})}>
              Continue to checkout <Icon name="arrow" size={14}/>
            </button>

            <div className="row gap-2 mt-3" style={{justifyContent:'center', color:'var(--ink-3)', fontSize:11}}>
              <Icon name="shield" size={12}/> Buyer protection · Refund if cancelled
            </div>
          </div>

          {/* Smart upsell */}
          <div className="card" style={{padding:20, border:'1px solid var(--accent-soft)', background:'linear-gradient(135deg, var(--accent-soft), transparent)'}}>
            <div className="row gap-2 mb-3"><span className="ai-dot" style={{width:18, height:18}}/><div className="eyebrow accent-text">Compass smart bundle</div></div>
            <div className="fw-500" style={{fontSize:14}}>Add a night at Eko Hotel for ₦142k</div>
            <p className="text-xs muted mt-2" style={{lineHeight:1.5}}>You'll save ₦18k vs booking separately. Free cancellation up to 24h.</p>
            <button className="btn btn-ghost btn-sm mt-3" style={{width:'100%', justifyContent:'center'}}>Preview bundle</button>
          </div>

          {/* Trust */}
          <div className="card" style={{padding:18}}>
            <div className="row gap-3 mb-2" style={{alignItems:'center'}}>
              <Icon name="shield" size={16}/>
              <span className="fw-600">Why book on Computicket</span>
            </div>
            <ul style={{margin:0, paddingLeft:18, color:'var(--ink-3)', fontSize:12.5, lineHeight:1.7}}>
              <li>Verified organizer & QR ticket</li>
              <li>Refund if event is cancelled</li>
              <li>Pay with Verve, Mastercard, USSD</li>
              <li>Resale-protected — no scalper bots</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="text-xs" style={{opacity:.7}}>{label}</div>
    <div className="h-3 tnum" style={{fontSize:22, marginTop:2}}>{value}</div>
  </div>
);

window.PageEvent = PageEvent;
