/* ----- Shared mobile components ----- */
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

const RouterCtx = createContext({ route: { name: "home" }, go: () => {}, back: () => {}, platform: "ios", dark: false });
const useRoute = () => useContext(RouterCtx);

/* ----- Status icons for hero overlays (white on photo) ----- */

/* ----- Tab bar ----- */
const TabBar = () => {
  const { route, go, platform } = useRoute();
  const tabs = [
    { id: "home",      l: "Discover", i: "home" },
    { id: "search",    l: "Explore",  i: "search" },
    { id: "ai",        l: "Compass",  i: "sparkle" },
    { id: "tickets",   l: "Tickets",  i: "ticket" },
    { id: "dashboard", l: "Profile",  i: "user" },
  ];
  const active = route.name === "home" ? "home"
                : route.name === "search" ? "search"
                : route.name === "ticket" ? "tickets"
                : route.name === "dashboard" ? "dashboard"
                : null;

  const onTap = (t) => {
    if (t.id === "ai") {
      go({ name: "compass" });
      return;
    }
    go({ name: t.id === "tickets" ? "ticket" : t.id === "dashboard" ? "dashboard" : t.id });
  };

  if (platform === "android") {
    return (
      <div className="tabbar tabbar-android">
        {tabs.map(t => (
          <button key={t.id} className={`tab tab-android ${active === t.id ? 'active' : ''}`} onClick={() => onTap(t)}>
            <div className="pill">
              <Icon name={t.i} size={20} stroke={t.id === "ai" ? 0 : 1.7}/>
            </div>
            <span style={{fontSize:12, fontWeight:500}}>{t.l}</span>
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <button key={t.id} className={`tab ${active === t.id ? 'active' : ''}`} onClick={() => onTap(t)}>
          {t.id === "ai" ? (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'conic-gradient(from 0deg, var(--accent), oklch(0.70 0.18 170), oklch(0.65 0.18 200), oklch(0.60 0.16 230), var(--accent))',
              animation: 'rotate 5s linear infinite',
            }}/>
          ) : (
            <Icon name={t.i} size={22} stroke={active === t.id ? 2.2 : 1.7}/>
          )}
          <span style={{fontSize:10, fontWeight:500}}>{t.l}</span>
        </button>
      ))}
    </div>
  );
};

/* ----- Screen header (back arrow + title) ----- */
const ScreenHeader = ({ title, onBack, right, dark = false, transparent = false, scrolled = false }) => {
  const { back } = useRoute();
  return (
    <div style={{
      position:'sticky', top:0, zIndex:20,
      background: transparent && !scrolled ? 'transparent' : 'var(--surface)',
      backdropFilter: scrolled || !transparent ? 'blur(20px) saturate(140%)' : 'none',
      borderBottom: scrolled || !transparent ? '0.5px solid var(--line)' : 'none',
      padding:'12px 8px 12px',
      display:'flex', alignItems:'center', gap:8,
      color: dark && transparent && !scrolled ? 'white' : 'var(--ink)',
      transition: 'all .2s',
    }}>
      <button onClick={onBack || back} style={{
        width:40, height:40, display:'grid', placeItems:'center', borderRadius:'50%',
        background: dark && transparent && !scrolled ? 'oklch(0 0 0 / .35)' : 'transparent',
        color: 'inherit',
      }}>
        <Icon name="chevronLeft" size={22}/>
      </button>
      <div style={{flex:1, textAlign:'center', fontSize:16, fontWeight:600}}>{title}</div>
      <div style={{width:40, display:'flex', justifyContent:'flex-end'}}>{right}</div>
    </div>
  );
};

/* ----- Event card (mobile) ----- */
const EventCardMobile = ({ e, w = 260 }) => {
  const { go } = useRoute();
  return (
    <button onClick={() => go({ name:"event", id: e.id })}
      style={{
        width:w, padding:0, textAlign:'left',
        background:'var(--surface)', border:'1px solid var(--line)',
        borderRadius:'var(--r-4)', overflow:'hidden',
      }}>
      <div className={`ph ${e.ph} ph-noise`} style={{height: w*0.95, position:'relative'}}>
        <div style={{position:'absolute', top:10, left:10, display:'flex', gap:6}}>
          {e.live && <span className="badge badge-live"><span className="dot" style={{background:'white'}}/>Live</span>}
          {e.vip && <span className="badge badge-vip">VIP</span>}
          {e.almostSold && <span className="badge" style={{background:'var(--danger)', color:'white'}}>Almost sold out</span>}
        </div>
        <button style={{position:'absolute', top:10, right:10, width:34, height:34, borderRadius:'50%', background:'oklch(0 0 0 / .35)', backdropFilter:'blur(10px)', color:'white', display:'grid', placeItems:'center'}}>
          <Icon name="heart" size={15}/>
        </button>
        <div style={{position:'absolute', left:14, right:14, bottom:14, color:'white'}}>
          <div className="mono text-xs" style={{opacity:.85, letterSpacing:'.14em', textTransform:'uppercase'}}>{e.tag}</div>
          <div className="serif" style={{fontSize:20, lineHeight:1.05, marginTop:4, textWrap:'pretty'}}>{e.title}</div>
        </div>
      </div>
      <div style={{padding:'14px 14px 16px'}}>
        <div className="between mb-2" style={{fontSize:12, color:'var(--ink-3)'}}>
          <span><Icon name="pin" size={11}/> {e.city}</span>
          <span className="mono">{e.date}</span>
        </div>
        <div className="between">
          <div>
            <div className="text-xs muted">From</div>
            <div className="h-4 tnum mt-1">{formatNGN(e.priceFrom)}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="text-xs muted">Countdown</div>
            <div className="mono text-xs accent-text mt-1">{e.countdown}</div>
          </div>
        </div>
        <div className="bar mt-3"><div style={{width: `${Math.min(100, (e.attending / e.capacity) * 100)}%`}}/></div>
      </div>
    </button>
  );
};

/* ----- Section header within a screen ----- */
const Section = ({ eyebrow, title, sub, action, onAction, children, hpad = true }) => (
  <section style={{marginTop:24}}>
    <div className="between" style={{padding:'0 16px 12px'}}>
      <div>
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h2 className="h-3" style={{fontSize:20, fontWeight:600, letterSpacing:'-0.02em'}}>{title}</h2>
        {sub && <p className="text-sm muted mt-1" style={{maxWidth:280, textWrap:'pretty'}}>{sub}</p>}
      </div>
      {action && <button className="text-sm accent-text fw-500" onClick={onAction}>{action}</button>}
    </div>
    <div style={{padding: hpad ? '0 16px' : 0}}>{children}</div>
  </section>
);

/* ----- Helpers ----- */
const Hero = ({ph, title, subtitle, action, height = 280, badges}) => (
  <div className={`ph ${ph} ph-noise`} style={{height, position:'relative'}}>
    <div className="overlay-grad"/>
    <div className="stars"/>
    <div style={{position:'absolute', left:16, right:16, bottom:20, color:'white'}}>
      {badges && <div className="row mb-2">{badges}</div>}
      {subtitle && <div className="mono text-xs" style={{opacity:.85, letterSpacing:'.14em', textTransform:'uppercase'}}>{subtitle}</div>}
      <div className="serif" style={{fontSize:30, lineHeight:1.05, marginTop:6, textWrap:'pretty'}}>{title}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  </div>
);

window.RouterCtx = RouterCtx;
window.useRoute = useRoute;
window.TabBar = TabBar;
window.ScreenHeader = ScreenHeader;
window.EventCardMobile = EventCardMobile;
window.Section = Section;
window.Hero = Hero;
