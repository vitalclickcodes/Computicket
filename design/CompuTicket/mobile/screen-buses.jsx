/* ===== BUSES ===== */
const ScreenBuses = () => {
  const { back, go } = useRoute();
  const [sel, setSel] = useState("b1");

  const routes = [
    { id:"b1", op:"GIGM",      dep:"06:30", arr:"15:45", from:"Jibowu", to:"Utako", duration:"9h 15m", price:18500, seats:18, total:22, type:"Coaster · AC · Recliner", best:true },
    { id:"b2", op:"Chisco",    dep:"07:00", arr:"17:00", from:"Yaba",   to:"Wuse",  duration:"10h 00m", price:15200, seats:6,  total:32, type:"Marcopolo · WiFi" },
    { id:"b3", op:"ABC",       dep:"08:15", arr:"18:30", from:"Ojota",  to:"Utako", duration:"10h 15m", price:17000, seats:12, total:22, type:"AC · Snacks" },
    { id:"b4", op:"Peace Mass",dep:"21:00", arr:"06:00", from:"Iyana",  to:"Mararaba",duration:"9h 00m", price:14500, seats:24, total:32, type:"Overnight" },
    { id:"b5", op:"GIGM",      dep:"22:30", arr:"07:30", from:"Jibowu", to:"Utako", duration:"9h 00m", price:22000, seats:8,  total:18, type:"Sienna · Premium", overnight:true },
  ];

  return (
    <div className="screen-enter" style={{paddingBottom:160}}>
      <ScreenHeader title="Bus travel" onBack={back}/>

      <div style={{padding:'8px 16px 0'}}>
        <div className="mcard" style={{padding:14}}>
          <div className="between" style={{fontSize:14}}>
            <div className="row gap-2"><span className="fw-600">Lagos</span><Icon name="arrow" size={14}/><span className="fw-600">Abuja</span></div>
            <span className="text-xs muted">Sat 24 May · 1 adult</span>
          </div>
        </div>

        <div className="between mt-4 mb-3">
          <span className="text-sm muted"><b>14</b> trips</span>
          <div className="row gap-1">
            <button className="chip active" style={{padding:'5px 10px', fontSize:11}}>Cheapest</button>
            <button className="chip" style={{padding:'5px 10px', fontSize:11}}>Premium</button>
          </div>
        </div>

        <div className="col gap-2">
          {routes.map(r => (
            <button key={r.id} onClick={() => setSel(r.id)} style={{
              padding:0, textAlign:'left',
              background: sel===r.id ? 'var(--accent-soft)' : 'var(--surface)',
              border: `1px solid ${sel===r.id ? 'var(--accent)' : 'var(--line)'}`,
              borderRadius:14, overflow:'hidden',
            }}>
              <div style={{padding:14}}>
                <div className="between mb-3">
                  <div className="row gap-2" style={{alignItems:'center'}}>
                    <div style={{
                      width:36, height:36, borderRadius:9,
                      background:'linear-gradient(135deg, oklch(0.18 0.06 152), oklch(0.25 0.10 152))',
                      color:'var(--accent)', display:'grid', placeItems:'center',
                    }}>
                      <Icon name="bus" size={18}/>
                    </div>
                    <div>
                      <div className="row gap-2" style={{alignItems:'center'}}>
                        <span className="fw-600 text-sm">{r.op}</span>
                        {r.best && <span className="badge badge-vip">Best</span>}
                        {r.overnight && <span className="badge badge-soon">Night</span>}
                      </div>
                      <div className="text-xs muted">{r.type}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="h-4 tnum">{formatNGN(r.price)}</div>
                    <div className="text-xs muted mt-1">{r.seats} seats</div>
                  </div>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 80px 1fr', alignItems:'center', gap:8}}>
                  <div>
                    <div className="h-4 tnum">{r.dep}</div>
                    <div className="text-xs muted mt-1">{r.from}</div>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div className="text-xs muted">{r.duration}</div>
                    <div style={{height:1, background:'var(--line)', position:'relative', marginTop:5}}>
                      <div style={{position:'absolute', left:0, top:'50%', width:5, height:5, borderRadius:'50%', background:'var(--accent)', transform:'translateY(-50%)'}}/>
                      <div style={{position:'absolute', right:0, top:'50%', width:5, height:5, borderRadius:'50%', background:'var(--ink-3)', transform:'translateY(-50%)'}}/>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="h-4 tnum">{r.arr}</div>
                    <div className="text-xs muted mt-1">{r.to}</div>
                  </div>
                </div>
              </div>
              {sel === r.id && (
                <div style={{padding:'10px 14px', background:'var(--surface-2)', borderTop:'1px solid var(--line)'}}>
                  <div className="row gap-3" style={{flexWrap:'wrap', fontSize:11, color:'var(--ink-3)'}}>
                    <span className="row gap-1"><Icon name="ac" size={11}/>AC</span>
                    <span className="row gap-1"><Icon name="wifi" size={11}/>WiFi</span>
                    <span className="row gap-1"><Icon name="shield" size={11}/>GPS</span>
                    <span className="row gap-1"><Icon name="clock" size={11}/>Refund 6h</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Seat picker */}
        <Section title="Pick your seat" eyebrow="GIGM Coaster · 22 seats">
          <div className="mcard" style={{padding:16}}>
            <div className="between mb-3 text-xs muted">
              <span className="row gap-1"><Icon name="user" size={11}/> Driver</span>
              <span className="mono">FRONT</span>
            </div>
            <div className="col gap-2" style={{alignItems:'center'}}>
              {Array.from({length:5}).map((_, r) => (
                <div key={r} className="row" style={{gap:5}}>
                  <span className="seat" style={{background: ((r*4)%7<2)?'var(--surface)':'var(--surface-2)', opacity:((r*4)%7<2)?.25:1}}/>
                  <span className="seat" style={{background: ((r*4+1)%7<2)?'var(--surface)':'var(--surface-2)', opacity:((r*4+1)%7<2)?.25:1}}/>
                  <span style={{width:20}}/>
                  <span className={`seat ${r===3?'selected':''}`} style={{background: r===3?'var(--accent)':((r*4+2)%7<2)?'var(--surface)':'var(--surface-2)', opacity:((r*4+2)%7<2)&&r!==3?.25:1}}/>
                  <span className="seat" style={{background: ((r*4+3)%7<2)?'var(--surface)':'var(--surface-2)', opacity:((r*4+3)%7<2)?.25:1}}/>
                </div>
              ))}
              <div className="row" style={{gap:5, marginTop:6}}>
                <span className="seat"/><span className="seat"/><span className="seat sold"/><span className="seat"/>
              </div>
            </div>
            <div className="row gap-3 mt-4" style={{justifyContent:'center', fontSize:11, color:'var(--ink-3)'}}>
              <span className="row gap-1"><span className="seat" style={{width:11, height:11}}/>Open</span>
              <span className="row gap-1"><span className="seat selected" style={{width:11, height:11}}/>Yours</span>
              <span className="row gap-1"><span className="seat sold" style={{width:11, height:11}}/>Taken</span>
            </div>
          </div>
        </Section>
      </div>

      <div style={{
        position:'sticky', bottom:0, marginTop:24,
        background:'var(--surface)', backdropFilter:'blur(20px)',
        borderTop:'0.5px solid var(--line)',
        padding:'14px 16px calc(20px + env(safe-area-inset-bottom))',
      }}>
        <div className="between mb-2">
          <div className="text-xs muted">Seat 14A · window</div>
          <div className="h-3 tnum">{formatNGN(18500)}</div>
        </div>
        <button className="mbtn mbtn-primary mbtn-full" onClick={() => go({name:"checkout"})}>
          Continue <Icon name="arrow" size={15}/>
        </button>
      </div>
    </div>
  );
};

window.ScreenBuses = ScreenBuses;
