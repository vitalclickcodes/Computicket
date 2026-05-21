/* ===== SEARCH ===== */
const ScreenSearch = () => {
  const { go } = useRoute();
  const [q, setQ] = useState("Burna Boy Lagos");
  const [tab, setTab] = useState("all");

  return (
    <div className="screen-enter" style={{paddingBottom:120}}>
      <div style={{padding:'12px 16px 8px', position:'sticky', top:0, background:'var(--bg-base)', zIndex:10}}>
        {/* Search input */}
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'8px 8px 8px 14px', borderRadius:'var(--r-pill)',
          background:'var(--surface)', border:'1px solid var(--line-strong)',
        }}>
          <Icon name="search" size={18}/>
          <input value={q} onChange={e => setQ(e.target.value)}
            style={{flex:1, border:0, outline:'none', background:'transparent', fontSize:15, minWidth:0}}/>
          <button className="icon-btn" style={{width:32, height:32}}>
            <Icon name="mic" size={14}/>
          </button>
        </div>

        {/* Facets */}
        <div className="rail-h" style={{padding:'12px 0 0', margin:'0 -16px', paddingLeft:16, paddingRight:16}}>
          {[
            {id:"all", l:"All", n:124},
            {id:"events", l:"Events", n:46},
            {id:"flights", l:"Flights", n:12},
            {id:"hotels", l:"Stays", n:24},
            {id:"buses", l:"Bus", n:8},
            {id:"x", l:"Experiences", n:10},
          ].map(f => (
            <button key={f.id} onClick={() => setTab(f.id)} className={`chip ${tab===f.id?'active':''}`}>
              {f.l} <span className="text-xs" style={{opacity:.6, marginLeft:2}}>{f.n}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:'12px 16px 0'}}>
        {/* AI synthesis */}
        <div style={{
          padding:14, borderRadius:16,
          background:'linear-gradient(135deg, var(--accent-soft), transparent)',
          border:'1px solid oklch(0.62 0.18 152 / .25)',
        }}>
          <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
            <div style={{
              width:22, height:22, borderRadius:'50%',
              background: 'conic-gradient(from 0deg, var(--accent), oklch(0.70 0.18 170), oklch(0.65 0.18 200), oklch(0.60 0.16 230), var(--accent))',
              animation: 'rotate 5s linear infinite', flexShrink:0,
            }}/>
            <div style={{flex:1, fontSize:13, lineHeight:1.55, color:'var(--ink-2)'}}>
              Found <b style={{color:'var(--ink)'}}>3 Burna Boy shows</b> in Lagos. The closest is "African Giant Returns" on Sat — VIP is 62% sold. Want me to find a flight + hotel bundle?
              <div className="row gap-2 mt-3" style={{flexWrap:'wrap'}}>
                <button className="chip" style={{padding:'5px 10px', fontSize:12}}>Show bundle</button>
                <button className="chip" style={{padding:'5px 10px', fontSize:12}}>Just the event</button>
              </div>
            </div>
          </div>
        </div>

        {/* Top hit */}
        <button onClick={() => go({name:"event", id:"e1"})} style={{
          marginTop:16, width:'100%', padding:0, textAlign:'left',
          background:'var(--surface)', border:'1px solid var(--line)',
          borderRadius:18, overflow:'hidden',
        }}>
          <div className="ph ph-1 ph-noise" style={{height:160, position:'relative'}}>
            <span className="badge" style={{position:'absolute', top:12, left:12, background:'var(--accent)', color:'oklch(0.2 0.05 152)'}}>★ Top result</span>
            <div className="overlay-grad"/>
            <div style={{position:'absolute', left:14, right:14, bottom:12, color:'white'}}>
              <div className="mono text-xs" style={{opacity:.85, letterSpacing:'.14em'}}>SAT 23 MAY · 9PM</div>
              <div className="serif" style={{fontSize:22, lineHeight:1.05, marginTop:4}}>Burna Boy — African Giant Returns</div>
            </div>
          </div>
          <div style={{padding:14}}>
            <div className="between" style={{fontSize:12, color:'var(--ink-3)'}}>
              <span><Icon name="pin" size={11}/> Eko Convention Centre</span>
              <span className="accent-text fw-600">82% sold</span>
            </div>
            <div className="between mt-3">
              <div>
                <div className="text-xs muted">From</div>
                <div className="h-4 tnum">{formatNGN(25000)}</div>
              </div>
              <div className="mbtn mbtn-primary mbtn-sm">View <Icon name="arrow" size={13}/></div>
            </div>
          </div>
        </button>

        {/* Mixed results */}
        <div style={{marginTop:16}}>
          <div className="eyebrow mb-3">More results</div>
          <div className="col gap-3">
            {DATA.trending.slice(1, 5).map(e => (
              <button key={e.id} onClick={() => go({name:"event", id:e.id})}
                style={{padding:0, textAlign:'left', display:'flex', gap:12,
                  background:'var(--surface)', borderRadius:14,
                  border:'1px solid var(--line)', overflow:'hidden'}}>
                <div className={`ph ${e.ph} ph-noise`} style={{width:90, height:90, flexShrink:0}}/>
                <div style={{flex:1, padding:'12px 14px 12px 0'}}>
                  <div className="text-xs muted">{e.tag} · {e.city}</div>
                  <div className="fw-600 mt-1" style={{fontSize:14, textWrap:'pretty'}}>{e.title}</div>
                  <div className="between mt-2 text-xs">
                    <span className="muted">{e.date}</span>
                    <span className="fw-600 tnum">{formatNGN(e.priceFrom)}+</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cross-category */}
        <div style={{marginTop:24}}>
          <div className="between mb-3">
            <div className="eyebrow">Stays near venue</div>
            <button className="text-sm accent-text fw-500" onClick={() => go({name:"hotels"})}>All</button>
          </div>
          <div className="rail-h" style={{margin:'0 -16px', padding:'0 16px'}}>
            {DATA.hotels.slice(0,4).map(h => (
              <button key={h.id} onClick={() => go({name:"hotels"})} style={{
                width:180, padding:0, textAlign:'left',
                background:'var(--surface)', border:'1px solid var(--line)',
                borderRadius:14, overflow:'hidden',
              }}>
                <div className={`ph ${h.ph} ph-noise`} style={{height:100, position:'relative'}}/>
                <div style={{padding:'10px 12px 12px'}}>
                  <div className="fw-600" style={{fontSize:13}}>{h.name}</div>
                  <div className="text-xs muted mt-1">{h.city}</div>
                  <div className="between mt-2 text-xs">
                    <span><Icon name="star" size={10}/> {h.rating}</span>
                    <span className="fw-600 tnum">{formatNGN(h.price)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

window.ScreenSearch = ScreenSearch;
