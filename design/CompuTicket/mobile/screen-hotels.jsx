/* ===== HOTELS ===== */
const ScreenHotels = () => {
  const { back, go } = useRoute();
  const [view, setView] = useState("list"); // list | map

  return (
    <div className="screen-enter" style={{paddingBottom:120}}>
      <ScreenHeader title="Stays" onBack={back} right={
        <button className="icon-btn" style={{width:34, height:34}}><Icon name="filter" size={16}/></button>
      }/>

      <div style={{padding:'8px 16px 0'}}>
        {/* Search summary card */}
        <div className="mcard" style={{padding:14}}>
          <div className="row gap-2"><Icon name="pin" size={14}/> <span className="fw-600 text-sm">Lagos · Victoria Island</span></div>
          <div className="between mt-3" style={{fontSize:13}}>
            <span className="muted">23 May → 25 May</span>
            <span className="muted">2 guests · 1 room</span>
          </div>
        </div>

        {/* Quick chips */}
        <div className="rail-h" style={{padding:'12px 0 0', margin:'0 -16px', paddingLeft:16, paddingRight:16}}>
          {["Best match","5★","Pool","Beach","Spa","Free cancel","< ₦150k"].map((c,i) => (
            <span key={c} className={`chip ${i===0?'active':''}`}>{c}</span>
          ))}
        </div>

        {/* List / map toggle */}
        <div className="between mt-4 mb-2">
          <span className="text-sm muted"><b className="accent-text">4,920</b> stays</span>
          <div className="row gap-1" style={{padding:3, borderRadius:99, background:'var(--surface-2)'}}>
            <button onClick={() => setView("list")} style={{padding:'6px 12px', borderRadius:99, fontSize:12, fontWeight:600, background: view==="list" ? 'var(--ink)' : 'transparent', color: view==="list" ? 'var(--bg-void)' : 'var(--ink-3)'}}>List</button>
            <button onClick={() => setView("map")} style={{padding:'6px 12px', borderRadius:99, fontSize:12, fontWeight:600, background: view==="map" ? 'var(--ink)' : 'transparent', color: view==="map" ? 'var(--bg-void)' : 'var(--ink-3)'}}>Map</button>
          </div>
        </div>

        {view === "map" && (
          <div style={{height:200, borderRadius:16, position:'relative', overflow:'hidden', marginBottom:16,
            background:`radial-gradient(circle at 30% 40%, oklch(0.92 0.05 152), oklch(0.88 0.04 152))`,
          }}>
            <svg viewBox="0 0 400 200" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
              <path d="M0,60 Q120,40 200,80 T400,120" stroke="oklch(0.78 0.02 152)" strokeWidth="1.5" fill="none"/>
              <path d="M0,140 Q160,160 240,120 T400,160" stroke="oklch(0.78 0.02 152)" strokeWidth="1.5" fill="none"/>
              <path d="M120,0 L160,200" stroke="oklch(0.78 0.02 152)" strokeWidth="1.5" fill="none"/>
            </svg>
            {[
              {x:30, y:35, p:"₦185k", sel:true},
              {x:55, y:55, p:"₦142k"},
              {x:72, y:38, p:"₦135k"},
              {x:42, y:72, p:"₦128k"},
            ].map((m,i) => (
              <div key={i} style={{
                position:'absolute', left:`${m.x}%`, top:`${m.y}%`,
                transform:'translate(-50%, -100%)',
                padding:'4px 8px', borderRadius:99,
                background: m.sel ? 'var(--accent)' : 'var(--ink)',
                color: m.sel ? 'oklch(0.2 0.05 152)' : 'white',
                fontSize:11, fontWeight:600, fontFamily:'var(--font-mono)',
              }}>{m.p}</div>
            ))}
          </div>
        )}

        <div className="col gap-3">
          {DATA.hotels.slice(0, 6).map(h => (
            <button key={h.id} onClick={() => {}} style={{
              padding:0, textAlign:'left',
              background:'var(--surface)', border:'1px solid var(--line)',
              borderRadius:16, overflow:'hidden',
            }}>
              <div className={`ph ${h.ph} ph-noise`} style={{height:160, position:'relative'}}>
                {h.badge && <span className="badge badge-vip" style={{position:'absolute', top:12, left:12}}>{h.badge}</span>}
                <button style={{position:'absolute', top:12, right:12, width:32, height:32, borderRadius:'50%', background:'oklch(0 0 0 / .35)', backdropFilter:'blur(10px)', color:'white', display:'grid', placeItems:'center'}}>
                  <Icon name="heart" size={14}/>
                </button>
              </div>
              <div style={{padding:14}}>
                <div className="between" style={{alignItems:'flex-start'}}>
                  <div style={{flex:1}}>
                    <div className="fw-600" style={{fontSize:15}}>{h.name}</div>
                    <div className="text-xs muted mt-1">{h.city}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="row gap-1" style={{justifyContent:'flex-end', fontSize:13}}>
                      <Icon name="star" size={12}/> <b>{h.rating}</b>
                    </div>
                    <div className="text-xs muted">{h.reviews.toLocaleString()}</div>
                  </div>
                </div>
                <div className="row gap-1 mt-3" style={{flexWrap:'wrap'}}>
                  {h.tags.slice(0,3).map(t => <span key={t} className="chip" style={{padding:'3px 8px', fontSize:10}}>{t}</span>)}
                </div>
                <div className="between mt-3" style={{paddingTop:10, borderTop:'1px solid var(--line)'}}>
                  <div>
                    <div className="text-xs muted">2 nights · taxes incl.</div>
                    <div className="h-4 tnum mt-1">{formatNGN(h.price)}<span className="text-xs muted"> /night</span></div>
                  </div>
                  <div className="mbtn mbtn-primary mbtn-sm">View</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

window.ScreenHotels = ScreenHotels;
