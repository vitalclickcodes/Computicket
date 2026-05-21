/* ===== SMART GLOBAL SEARCH PAGE ===== */
const PageSearch = ({ q = "" }) => {
  const { go } = useRoute();
  const [query, setQuery] = useState(q || "Burna Boy Lagos");
  const [filter, setFilter] = useState("all");

  const facets = [
    { id:"all",       label:"All results",  count:124 },
    { id:"events",    label:"Events",       count:46 },
    { id:"concerts",  label:"Concerts",     count:18 },
    { id:"flights",   label:"Flights",      count:12 },
    { id:"hotels",    label:"Stays",        count:24 },
    { id:"buses",     label:"Bus travel",   count:8 },
    { id:"cinema",    label:"Cinema",       count:6 },
    { id:"x",         label:"Experiences",  count:10 },
  ];

  return (
    <div className="page-enter">
      {/* Search header */}
      <section style={{background:'var(--bg-deep)', borderBottom:'1px solid var(--line)', padding:'40px 0 0'}}>
        <div className="wrap">
          <div style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'8px 8px 8px 22px', borderRadius:'var(--r-pill)',
            background:'var(--surface)', border:'1px solid var(--line-strong)',
            boxShadow:'var(--shadow-md)',
          }}>
            <Icon name="search" size={20}/>
            <input value={query} onChange={e => setQuery(e.target.value)}
              style={{flex:1, background:'transparent', border:0, outline:'none', fontSize:18, padding:'12px 0'}}/>
            <span className="ai-pill"><span className="ai-dot"/><span>Compass interpreting</span></span>
            <button className="icon-btn"><Icon name="mic" size={16}/></button>
            <button className="btn btn-accent">Search</button>
          </div>

          {/* AI synthesized answer */}
          <div className="card mt-6" style={{padding:20, background:'linear-gradient(135deg, var(--accent-soft), transparent)', border:'1px solid oklch(0.68 0.18 152 / .3)'}}>
            <div className="row gap-3" style={{alignItems:'flex-start'}}>
              <div className="ai-dot" style={{width:24, height:24, flexShrink:0, marginTop:2}}/>
              <div style={{flex:1}}>
                <div className="row gap-2" style={{alignItems:'center'}}><span className="eyebrow accent-text">Compass answers</span></div>
                <p style={{fontSize:14, lineHeight:1.6, color:'var(--ink-2)', marginTop:6, textWrap:'pretty'}}>
                  I found <b style={{color:'var(--ink)'}}>3 Burna Boy shows</b> in Lagos this year. The closest is <b>"African Giant Returns"</b> at Eko Convention this Saturday — VIP is 62% sold. If you're flying from Abuja, Friday evening Air Peace flights are
                  <span className="accent-text"> ₦12,000 cheaper</span> than Saturday morning. Want me to bundle?
                </p>
                <div className="row gap-2 mt-3">
                  <button className="btn btn-glass btn-sm">Show me the bundle</button>
                  <button className="btn btn-ghost btn-sm">Only the event</button>
                  <button className="btn btn-ghost btn-sm">Set price alert</button>
                </div>
              </div>
            </div>
          </div>

          {/* Facet tabs */}
          <div className="row mt-6" style={{borderBottom:'1px solid var(--line)', overflowX:'auto'}}>
            {facets.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                style={{
                  padding:'14px 18px',
                  borderBottom:`2px solid ${filter===f.id?'var(--accent)':'transparent'}`,
                  color: filter===f.id ? 'var(--ink)' : 'var(--ink-3)',
                  fontSize:13, fontWeight: filter===f.id ? 600 : 500,
                  whiteSpace:'nowrap',
                }}>
                {f.label} <span className="muted-2 mono" style={{fontSize:11, marginLeft:4}}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap" style={{paddingTop:32, paddingBottom:96, display:'grid', gridTemplateColumns:'260px minmax(0,1fr)', gap:32, alignItems:'flex-start'}}>
        {/* Filter rail */}
        <aside style={{position:'sticky', top: 96}}>
          <div className="between mb-4">
            <div className="eyebrow">Filters</div>
            <button className="text-xs muted">Clear all</button>
          </div>

          <FilterGroup title="Price range">
            <div className="between text-xs mono">
              <span>₦0</span><span>₦500k+</span>
            </div>
            <div style={{position:'relative', height:32, marginTop:4}}>
              <div style={{position:'absolute', top:15, left:0, right:0, height:2, background:'var(--surface-2)', borderRadius:99}}/>
              <div style={{position:'absolute', top:15, left:'8%', right:'40%', height:2, background:'var(--accent)', borderRadius:99}}/>
              <div style={{position:'absolute', top:8, left:'8%', width:16, height:16, borderRadius:'50%', background:'var(--ink)', border:'3px solid var(--accent)'}}/>
              <div style={{position:'absolute', top:8, left:'60%', width:16, height:16, borderRadius:'50%', background:'var(--ink)', border:'3px solid var(--accent)'}}/>
            </div>
            <div className="between mt-2 text-sm tnum">
              <span>₦15,000</span> – <span>₦300,000</span>
            </div>
          </FilterGroup>

          <FilterGroup title="When">
            {["Tonight","This weekend","Next 7 days","This month","Pick dates"].map(d => (
              <label key={d} className="row gap-2 mt-2" style={{alignItems:'center', cursor:'pointer'}}>
                <input type="checkbox" defaultChecked={d==="This weekend"} style={{accentColor:'var(--accent)'}}/>
                <span className="text-sm">{d}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="City">
            {["Lagos","Abuja","Port Harcourt","Ibadan","Kano","Calabar"].map(c => (
              <label key={c} className="row gap-2 mt-2" style={{alignItems:'center', cursor:'pointer'}}>
                <input type="checkbox" defaultChecked={c==="Lagos"} style={{accentColor:'var(--accent)'}}/>
                <span className="text-sm">{c}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Genre">
            <div className="row gap-2" style={{flexWrap:'wrap'}}>
              {["Afrobeats","Comedy","Theatre","Jazz","Festival","Gospel","Hip-hop"].map(g => (
                <span key={g} className={`chip ${g==='Afrobeats'?'active':''}`}>{g}</span>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Features" last>
            {["VIP available","Group seating","Wheelchair access","Refundable","Verified organizer"].map(f => (
              <label key={f} className="row gap-2 mt-2" style={{alignItems:'center', cursor:'pointer'}}>
                <input type="checkbox" style={{accentColor:'var(--accent)'}}/>
                <span className="text-sm">{f}</span>
              </label>
            ))}
          </FilterGroup>
        </aside>

        {/* Results */}
        <div>
          <div className="between mb-6">
            <div className="text-sm muted">Showing <b className="text-gradient">124 results</b> for "<span className="accent-text">{query}</span>"</div>
            <div className="row gap-2">
              <button className="chip">Best match <Icon name="chevronDown" size={11}/></button>
              <button className="icon-btn"><Icon name="grid" size={15}/></button>
              <button className="icon-btn"><Icon name="map" size={15}/></button>
            </div>
          </div>

          {/* Top hit */}
          <div className="card card-hover mb-6" style={{display:'grid', gridTemplateColumns:'400px minmax(0,1fr)', overflow:'hidden', cursor:'pointer'}} onClick={() => go({name:"event"})}>
            <div className="ph ph-1 ph-noise" style={{minHeight:280, position:'relative'}}>
              <span className="badge" style={{position:'absolute', top:14, left:14, background:'var(--accent)', color:'oklch(0.2 0.05 152)'}}>★ Top result</span>
            </div>
            <div style={{padding:32}}>
              <div className="row gap-2 mb-3">
                <span className="chip chip-accent">Afrobeats</span>
                <span className="badge badge-vip">VIP</span>
                <span className="text-xs muted">· 14,820 attending</span>
              </div>
              <h3 className="h-3" style={{fontSize:28}}>Burna Boy — African Giant Returns</h3>
              <div className="row gap-3 mt-2 muted text-sm">
                <span><Icon name="pin" size={13}/> Eko Convention Centre · Lagos</span>
                <span><Icon name="calendar" size={13}/> Sat 23 May · 9:00 PM</span>
              </div>
              <p className="text-sm mt-4" style={{color:'var(--ink-2)', lineHeight:1.6, textWrap:'pretty'}}>
                The Grammy winner brings the African Giant production back to Eko. Two-hour set, full live band, expected
                surprise guests across the Mavin and Mr Eazi rosters.
              </p>
              <div className="between mt-6">
                <div>
                  <div className="text-xs muted">From</div>
                  <div className="h-3 tnum">{formatNGN(25000)}</div>
                </div>
                <div>
                  <div className="text-xs muted">Sold</div>
                  <div className="h-4 tnum accent-text">82%</div>
                </div>
                <div>
                  <div className="text-xs muted">Time left</div>
                  <div className="h-4 tnum">2d 14h</div>
                </div>
                <button className="btn btn-accent">View event <Icon name="arrow" size={14}/></button>
              </div>
            </div>
          </div>

          {/* Mixed result grid */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:20}}>
            {DATA.trending.slice(1).concat(DATA.concerts.slice(0,3).map(c => ({
              id:c.id, title:`${c.artist} — ${c.tour}`, venue:c.venue, city:c.city, date:c.date, time:"", priceFrom:c.priceFrom, attending:1200, capacity:5000, ph:c.ph, tag:"Concert", vip:c.vip, countdown:"upcoming"
            }))).map(e => <EventCard key={e.id} e={e} size="full"/>)}
          </div>

          {/* Cross-category strip */}
          <div className="card mt-8" style={{padding:24}}>
            <div className="between mb-4">
              <div>
                <div className="eyebrow mb-2">Also matching "Burna Boy Lagos"</div>
                <div className="h-4">Stays near the venue</div>
              </div>
              <button className="btn btn-ghost btn-sm">See all 24 hotels</button>
            </div>
            <div className="rail">
              {DATA.hotels.slice(0,4).map(h => (
                <div key={h.id} className="card card-hover" style={{width:240}}>
                  <div className={`ph ${h.ph} ph-noise`} style={{height:120, position:'relative'}}>
                    {h.badge && <span className="badge badge-vip" style={{position:'absolute', top:10, left:10}}>{h.badge}</span>}
                  </div>
                  <div style={{padding:14}}>
                    <div className="h-4" style={{fontSize:14}}>{h.name}</div>
                    <div className="text-xs muted mt-1">{h.city}</div>
                    <div className="between mt-3">
                      <span className="text-xs"><Icon name="star" size={11}/> {h.rating} · {h.reviews.toLocaleString()}</span>
                      <span className="text-sm fw-600 tnum">{formatNGN(h.price)}</span>
                    </div>
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

const FilterGroup = ({ title, children, last }) => (
  <div style={{paddingBottom:20, marginBottom:20, borderBottom: last ? 'none' : '1px solid var(--line)'}}>
    <div className="between mb-3">
      <span className="fw-600" style={{fontSize:13}}>{title}</span>
      <Icon name="chevronDown" size={13}/>
    </div>
    {children}
  </div>
);

window.PageSearch = PageSearch;
