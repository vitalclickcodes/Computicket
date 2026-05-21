/* ===== FLIGHTS ===== */
const ScreenFlights = () => {
  const { back, go } = useRoute();
  const [sel, setSel] = useState("f1");

  const results = [
    { id:"f1", airline:"Air Peace",   dep:"06:25", arr:"07:35", duration:"1h 10m", direct:true, price:62500, prev:71000, fare:"Saver" },
    { id:"f2", airline:"Ibom Air",    dep:"09:10", arr:"10:25", duration:"1h 15m", direct:true, price:68900, fare:"Standard" },
    { id:"f3", airline:"Arik Air",    dep:"13:40", arr:"14:55", duration:"1h 15m", direct:true, price:71200, fare:"Standard" },
    { id:"f4", airline:"Green Africa",dep:"17:55", arr:"19:10", duration:"1h 15m", direct:true, price:74500, fare:"Saver" },
    { id:"f5", airline:"Air Peace",   dep:"20:30", arr:"21:55", duration:"1h 25m", direct:true, price:79200, fare:"Flex" },
  ];

  return (
    <div className="screen-enter" style={{paddingBottom:160}}>
      <ScreenHeader title="Flights" onBack={back} right={
        <button className="icon-btn" style={{width:34, height:34}}><Icon name="filter" size={16}/></button>
      }/>

      <div style={{padding:'8px 16px 0'}}>
        {/* Trip summary */}
        <div className="mcard" style={{padding:14}}>
          <div className="between" style={{fontSize:14}}>
            <div className="row gap-2" style={{alignItems:'center'}}>
              <span className="fw-600 mono">LOS</span>
              <Icon name="arrow" size={14}/>
              <span className="fw-600 mono">ABV</span>
            </div>
            <span className="text-xs muted">Round trip · 1 adult</span>
          </div>
          <div className="between mt-2 text-xs muted">
            <span>Fri 23 May → Sun 25 May</span>
            <button className="accent-text fw-500">Edit</button>
          </div>
        </div>

        {/* Price calendar */}
        <Section eyebrow="Price calendar" title="Cheaper midweek" hpad={false}>
          <div className="rail-h" style={{padding:'0 16px'}}>
            {[
              {d:"Mon",n:20, p:55400},
              {d:"Tue",n:21, p:58900},
              {d:"Wed",n:22, p:48200, lowest:true},
              {d:"Thu",n:23, p:54800},
              {d:"Fri",n:24, p:62500, selected:true},
              {d:"Sat",n:25, p:71200},
              {d:"Sun",n:26, p:74900},
            ].map(d => (
              <button key={d.d} style={{
                minWidth:72, padding:'10px 12px', textAlign:'center',
                borderRadius:12,
                background: d.selected ? 'var(--accent-soft)' : 'var(--surface)',
                border: `1px solid ${d.selected?'var(--accent)':'var(--line)'}`,
              }}>
                <div className="text-xs muted">{d.d}</div>
                <div className="fw-600 mt-1">May {d.n}</div>
                <div className={`text-xs mono tnum mt-1 ${d.lowest?'accent-text fw-600':'muted'}`}>₦{Math.round(d.p/1000)}k</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Sort */}
        <div className="between mt-6 mb-3">
          <span className="text-sm muted"><b>12</b> flights · Fri 23 May</span>
          <div className="row gap-1">
            <button className="chip active" style={{padding:'5px 10px', fontSize:11}}>Cheapest</button>
            <button className="chip" style={{padding:'5px 10px', fontSize:11}}>Fastest</button>
          </div>
        </div>

        <div className="col gap-2">
          {results.map(r => (
            <button key={r.id} onClick={() => setSel(r.id)} style={{
              padding:14, textAlign:'left',
              background: sel===r.id ? 'var(--accent-soft)' : 'var(--surface)',
              border: `1px solid ${sel===r.id ? 'var(--accent)' : 'var(--line)'}`,
              borderRadius:14,
            }}>
              <div className="between mb-3">
                <div className="row gap-2">
                  <div style={{
                    width:30, height:30, borderRadius:8,
                    background:'linear-gradient(135deg, var(--accent), oklch(0.55 0.18 180))',
                    display:'grid', placeItems:'center', color:'white', fontWeight:700, fontSize:11,
                  }}>{r.airline.split(' ').map(w=>w[0]).join('')}</div>
                  <div>
                    <div className="fw-600 text-sm">{r.airline}</div>
                    <div className="text-xs muted">{r.fare}</div>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="h-4 tnum">{formatNGN(r.price)}</div>
                  {r.prev && r.prev > r.price && <div className="text-xs accent-text">Was {formatNGN(r.prev)}</div>}
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:12}}>
                <div style={{textAlign:'left'}}>
                  <div className="h-4 tnum">{r.dep}</div>
                  <div className="text-xs mono muted mt-1">LOS</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div className="text-xs muted">{r.duration}</div>
                  <div style={{height:1, background:'var(--line)', position:'relative', marginTop:6}}>
                    <div style={{position:'absolute', left:0, top:'50%', width:5, height:5, borderRadius:'50%', background:'var(--accent)', transform:'translateY(-50%)'}}/>
                    <div style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)', background:'var(--surface)', padding:'2px 6px'}}>
                      <Icon name="plane" size={11}/>
                    </div>
                    <div style={{position:'absolute', right:0, top:'50%', width:5, height:5, borderRadius:'50%', background:'var(--ink-3)', transform:'translateY(-50%)'}}/>
                  </div>
                  <div className="text-xs accent-text mt-2">{r.direct?'Direct':'1 stop'}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="h-4 tnum">{r.arr}</div>
                  <div className="text-xs mono muted mt-1">ABV</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bundle promo */}
        <div className="mt-4" style={{
          padding:14, borderRadius:14,
          background:'linear-gradient(135deg, var(--accent-soft), transparent)',
          border:'1px solid oklch(0.62 0.18 152 / .25)',
        }}>
          <div className="row gap-3" style={{alignItems:'center'}}>
            <div className="ai-dot" style={{width:20, height:20}}/>
            <div style={{flex:1, fontSize:13, lineHeight:1.4}}>
              Bundle with Eko Hotel — <b className="accent-text">save ₦24,300</b>
            </div>
            <button className="text-sm accent-text fw-600">View</button>
          </div>
        </div>
      </div>

      {/* Continue bar */}
      <div style={{
        position:'sticky', bottom:0, marginTop:24,
        background:'var(--surface)', backdropFilter:'blur(20px)',
        borderTop:'0.5px solid var(--line)',
        padding:'14px 16px calc(20px + env(safe-area-inset-bottom))',
      }}>
        <div className="between mb-2">
          <div className="text-xs muted">Round trip · 1 adult</div>
          <div className="h-3 tnum">{formatNGN(125000)}</div>
        </div>
        <button className="mbtn mbtn-primary mbtn-full" onClick={() => go({name:"checkout"})}>
          Continue <Icon name="arrow" size={15}/>
        </button>
      </div>
    </div>
  );
};

window.ScreenFlights = ScreenFlights;
