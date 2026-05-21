/* ===== BUS TRAVEL ===== */
const PageBuses = () => {
  const { go } = useRoute();
  const [selected, setSelected] = useState("b1");

  const routes = [
    { id:"b1", op:"GIGM",         dep:"06:30", arr:"15:45", from:"Lagos (Jibowu)",  to:"Abuja (Utako)", duration:"9h 15m", price:18500, seats:18, total:22, type:"Toyota Coaster · AC · Recliner", best:true },
    { id:"b2", op:"Chisco",       dep:"07:00", arr:"17:00", from:"Lagos (Yaba)",     to:"Abuja (Wuse)",  duration:"10h 00m", price:15200, seats:6,  total:32, type:"Marcopolo · WiFi · USB" },
    { id:"b3", op:"ABC Transport",dep:"08:15", arr:"18:30", from:"Lagos (Ojota)",    to:"Abuja (Utako)", duration:"10h 15m", price:17000, seats:12, total:22, type:"Coaster · AC · Snacks" },
    { id:"b4", op:"Peace Mass",   dep:"21:00", arr:"06:00", from:"Lagos (Iyana-Ipaja)",to:"Abuja (Mararaba)",duration:"9h 00m", price:14500, seats:24, total:32, type:"Overnight · AC" },
    { id:"b5", op:"GIGM",         dep:"22:30", arr:"07:30", from:"Lagos (Jibowu)",  to:"Abuja (Utako)", duration:"9h 00m", price:22000, seats:8,  total:18, type:"Sienna · Overnight Premium · WiFi" },
  ];

  return (
    <div className="page-enter">
      {/* Header */}
      <section style={{background:'var(--bg-deep)', borderBottom:'1px solid var(--line)'}}>
        <div className="wrap" style={{paddingTop:32, paddingBottom:32}}>
          <div className="row gap-3 mb-4">
            <button className="chip active">Round trip</button>
            <button className="chip">One way</button>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.4fr) minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) auto', background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'var(--r-4)', padding:8}}>
            {[
              {l:"From", v:"Lagos · all terminals"},
              {l:"To",   v:"Abuja · all terminals"},
              {l:"Depart", v:"Sat 24 May"},
              {l:"Passengers", v:"1 adult"},
            ].map((f,i,a) => (
              <div key={f.l} className="search-field" style={{borderRight: i<a.length-1?'1px solid var(--line)':'none'}}>
                <div className="search-label">{f.l}</div>
                <div className="search-value">{f.v}</div>
              </div>
            ))}
            <button className="btn btn-accent" style={{padding:'18px 28px'}}><Icon name="search" size={16}/></button>
          </div>
        </div>
      </section>

      <section className="wrap" style={{paddingTop:32, paddingBottom:96, display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:32, alignItems:'flex-start'}}>
        <div>
          <div className="between mb-4">
            <span className="text-sm muted"><b className="text-gradient">14 trips</b> · Sat 24 May</span>
            <div className="row gap-2">
              <button className="chip active">Cheapest</button>
              <button className="chip">Fastest</button>
              <button className="chip">Premium</button>
            </div>
          </div>

          <div className="col gap-3">
            {routes.map(r => (
              <button key={r.id} onClick={() => setSelected(r.id)} className="card card-hover"
                style={{padding:0, textAlign:'left', border: selected===r.id?'1px solid var(--accent)':'1px solid var(--line)', overflow:'hidden'}}>
                <div style={{padding:20, display:'grid', gridTemplateColumns:'auto minmax(0,1fr) auto', gap:24, alignItems:'center'}}>
                  <div style={{
                    width:54, height:54, borderRadius:'var(--r-2)',
                    background:'linear-gradient(135deg, oklch(0.15 0.08 285), oklch(0.25 0.10 285))',
                    display:'grid', placeItems:'center', color:'var(--accent)',
                  }}>
                    <Icon name="bus" size={26}/>
                  </div>
                  <div>
                    <div className="row gap-2" style={{alignItems:'center'}}>
                      <span className="fw-600">{r.op}</span>
                      {r.best && <span className="badge badge-vip">Best value</span>}
                    </div>
                    <div className="text-xs muted mt-1">{r.type}</div>
                    <div style={{display:'grid', gridTemplateColumns:'auto minmax(0,1fr) auto', alignItems:'center', gap:14, marginTop:14}}>
                      <div>
                        <div className="h-4 tnum">{r.dep}</div>
                        <div className="text-xs muted mt-1">{r.from}</div>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <div className="text-xs muted">{r.duration}</div>
                        <div style={{height:1, background:'var(--line)', position:'relative', marginTop:6}}>
                          <div style={{position:'absolute', left:0, top:'50%', width:6, height:6, borderRadius:'50%', background:'var(--accent)', transform:'translateY(-50%)'}}/>
                          <div style={{position:'absolute', right:0, top:'50%', width:6, height:6, borderRadius:'50%', background:'var(--ink-3)', transform:'translateY(-50%)'}}/>
                        </div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div className="h-4 tnum">{r.arr}</div>
                        <div className="text-xs muted mt-1">{r.to}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="h-3 tnum">{formatNGN(r.price)}</div>
                    <div className="text-xs muted mt-1">{r.seats} seats left</div>
                    <button className="btn btn-accent btn-sm mt-3">Select <Icon name="arrow" size={12}/></button>
                  </div>
                </div>

                {/* Mini route preview */}
                {selected===r.id && (
                  <div style={{padding:'16px 20px', background:'var(--surface-2)', borderTop:'1px solid var(--line)'}}>
                    <div className="row gap-3 muted text-xs" style={{flexWrap:'wrap'}}>
                      <span className="row gap-1"><Icon name="ac" size={12}/> Air-conditioned</span>
                      <span className="row gap-1"><Icon name="wifi" size={12}/> Free WiFi</span>
                      <span className="row gap-1"><Icon name="shield" size={12}/> Live GPS tracking</span>
                      <span className="row gap-1"><Icon name="clock" size={12}/> Refund up to 6h before</span>
                      <span className="row gap-1"><Icon name="info" size={12}/> 1 rest stop · Ore</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Seat map + summary */}
        <aside style={{position:'sticky', top:96, display:'flex', flexDirection:'column', gap:16}}>
          <div className="card" style={{padding:24}}>
            <div className="between mb-4">
              <div>
                <div className="eyebrow">Pick your seat</div>
                <div className="h-4 mt-1">GIGM · Coaster · 22 seats</div>
              </div>
              <span className="text-xs muted">18 available</span>
            </div>

            {/* Bus seat layout */}
            <div className="card" style={{padding:20, background:'var(--surface-2)', borderRadius:'var(--r-3)'}}>
              {/* Driver */}
              <div className="between mb-4">
                <div className="row gap-2 text-xs muted"><Icon name="user" size={12}/> Driver</div>
                <span className="mono text-xs muted">FRONT</span>
              </div>
              {/* Seats: 5 rows of 4 (2+aisle+2) + back row of 4 */}
              <div className="col gap-3">
                {Array.from({length:5}).map((_, r) => (
                  <div key={r} className="row" style={{justifyContent:'center', gap:6}}>
                    <Seat r={r} c={0}/>
                    <Seat r={r} c={1}/>
                    <span style={{width:24}}/>
                    <Seat r={r} c={2}/>
                    <Seat r={r} c={3}/>
                  </div>
                ))}
                <div className="row" style={{justifyContent:'center', gap:6, marginTop:8}}>
                  <Seat r={5} c={0}/><Seat r={5} c={1}/><Seat r={5} c={2}/><Seat r={5} c={3}/>
                </div>
              </div>

              <div className="row gap-3 mt-5" style={{justifyContent:'center', fontSize:11, color:'var(--ink-3)', flexWrap:'wrap'}}>
                <span className="row gap-1"><span className="seat" style={{width:12, height:12, cursor:'default'}}/> Open</span>
                <span className="row gap-1"><span className="seat selected" style={{width:12, height:12, cursor:'default'}}/> Yours</span>
                <span className="row gap-1"><span className="seat sold" style={{width:12, height:12, cursor:'default'}}/> Taken</span>
              </div>
            </div>

            <div className="between mt-5" style={{paddingTop:16, borderTop:'1px solid var(--line)'}}>
              <div>
                <div className="text-xs muted">Seat 14A · window</div>
                <div className="h-4 tnum mt-1">{formatNGN(18500)}</div>
              </div>
              <button className="btn btn-accent" onClick={() => go({name:"checkout"})}>Continue <Icon name="arrow" size={13}/></button>
            </div>
          </div>

          {/* Route timeline */}
          <div className="card" style={{padding:24}}>
            <div className="eyebrow mb-4">Route · Sat 24 May</div>
            <div className="col gap-0">
              {[
                {t:"06:30", l:"Depart · Jibowu, Lagos", c:"var(--accent)"},
                {t:"09:15", l:"Rest stop · Ore (20 min)", c:"var(--ink-3)"},
                {t:"12:00", l:"Lokoja junction", c:"var(--ink-3)"},
                {t:"15:45", l:"Arrive · Utako, Abuja", c:"var(--accent)"},
              ].map((s,i,a) => (
                <div key={i} className="row" style={{gap:14, alignItems:'flex-start'}}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', minWidth:46}}>
                    <div className="mono text-xs tnum">{s.t}</div>
                    <div style={{width:10, height:10, borderRadius:'50%', background:s.c, marginTop:6, boxShadow:`0 0 0 4px oklch(0.68 0.18 152 / .15)`}}/>
                    {i < a.length-1 && <div style={{width:2, flex:1, background:'var(--line)', marginTop:4, minHeight:36}}/>}
                  </div>
                  <div style={{paddingBottom:24, paddingTop:0}}>
                    <div className="fw-500" style={{fontSize:13}}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

const Seat = ({ r, c }) => {
  // Mock seat states
  const taken = (r*4+c) % 7 < 2;
  const selected = r === 3 && c === 0;
  return (
    <span className={`seat ${taken?'sold':''} ${selected?'selected':''}`} style={{width:28, height:28, borderRadius:6}}/>
  );
};

window.PageBuses = PageBuses;
