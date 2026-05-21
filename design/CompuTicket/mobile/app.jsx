/* ===== APP SHELL — platform switcher + router ===== */
const MobileApp = () => {
  const [platform, setPlatform] = useState("ios");
  const [theme, setTheme] = useState("light");
  const [stack, setStack] = useState([{ name: "home" }]);
  const route = stack[stack.length - 1];

  // Apply theme + platform globally
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.platform = platform;
  }, [theme, platform]);

  const go = (next) => {
    setStack(s => [...s, next]);
  };
  const back = () => {
    setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  };

  let screen;
  switch (route.name) {
    case "search":    screen = <ScreenSearch/>; break;
    case "event":     screen = <ScreenEvent id={route.id}/>; break;
    case "checkout":  screen = <ScreenCheckout/>; break;
    case "ticket":    screen = <ScreenTicket/>; break;
    case "compass":   screen = <ScreenCompass/>; break;
    case "dashboard": screen = <ScreenDashboard/>; break;
    case "organizer": screen = <ScreenOrganizer/>; break;
    case "hotels":    screen = <ScreenHotels/>; break;
    case "flights":   screen = <ScreenFlights/>; break;
    case "buses":     screen = <ScreenBuses/>; break;
    case "home":
    default:          screen = <ScreenHome/>;
  }

  const hideTabBar = route.name === "ticket" || route.name === "checkout" || route.name === "event" || route.name === "compass";

  const content = (
    <RouterCtx.Provider value={{ route, go, back, platform }}>
      <div className="mscreen" key={route.name + (route.id || '')} style={{minHeight:'100%'}}>
        {screen}
        {!hideTabBar && <TabBar/>}
      </div>
    </RouterCtx.Provider>
  );

  return (
    <>
      {/* Platform + theme switcher */}
      <div className="platform-switch">
        <button className={platform === "ios" ? "active" : ""} onClick={() => setPlatform("ios")}>
          <Icon name="sparkle" size={12} stroke={0}/>  iOS
        </button>
        <button className={platform === "android" ? "active" : ""} onClick={() => setPlatform("android")}>
          Android
        </button>
        <span style={{width:1, background:'oklch(0 0 0 / .12)', margin:'4px 4px'}}/>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{padding:'8px 12px'}}>
          <Icon name={theme === "light" ? "sun" : "moon"} size={14}/>
        </button>
        <span style={{width:1, background:'oklch(0 0 0 / .12)', margin:'4px 4px'}}/>
        <button onClick={() => setStack([{name:"home"}])} title="Reset" style={{padding:'8px 12px'}}>
          <Icon name="home" size={14}/>
        </button>
      </div>

      <div className="stage">
        {platform === "ios" ? (
          <IOSDevice width={392} height={836} dark={theme === "dark"}>
            {content}
          </IOSDevice>
        ) : (
          <AndroidDevice width={412} height={892} dark={theme === "dark"}>
            {content}
          </AndroidDevice>
        )}

        {/* Right-side: Screen jumper */}
        <ScreenJumper route={route} go={go} setStack={setStack}/>
      </div>
    </>
  );
};

/* ----- Quick screen jumper for review ----- */
const ScreenJumper = ({ route, go, setStack }) => {
  const screens = [
    { id:"home",      l:"Home"},
    { id:"search",    l:"Search"},
    { id:"event",     l:"Event detail", a:{ id:"e3" }},
    { id:"checkout",  l:"Checkout (Face ID)"},
    { id:"ticket",    l:"QR ticket at gate"},
    { id:"compass",   l:"Compass AI chat"},
    { id:"dashboard", l:"Dashboard"},
    { id:"organizer", l:"Organizer"},
    { id:"hotels",    l:"Hotels"},
    { id:"flights",   l:"Flights"},
    { id:"buses",     l:"Bus travel"},
  ];
  return (
    <div style={{
      display:'flex', flexDirection:'column', gap:6,
      maxWidth:240,
    }}>
      <div style={{fontSize:11, fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'.16em', color:'oklch(0.40 0.04 152)', marginBottom:8}}>
        Jump to screen
      </div>
      {screens.map(s => (
        <button key={s.id} onClick={() => setStack([{ name: s.id, ...(s.a || {}) }])}
          style={{
            padding:'10px 14px', borderRadius:10,
            background: route.name === s.id ? 'oklch(0.18 0.04 152)' : 'oklch(1 0 0 / .65)',
            color: route.name === s.id ? 'white' : 'oklch(0.32 0.04 152)',
            fontSize:13, fontWeight: route.name === s.id ? 600 : 500,
            textAlign:'left',
            border: route.name === s.id ? 0 : '1px solid oklch(0 0 0 / .08)',
            backdropFilter: 'blur(10px)',
            display:'flex', alignItems:'center', gap:8,
          }}>
          {route.name === s.id && <Icon name="check" size={12}/>}
          {s.l}
        </button>
      ))}
      <div style={{
        marginTop:12, padding:12,
        background:'oklch(1 0 0 / .65)', backdropFilter:'blur(10px)',
        borderRadius:10, border:'1px solid oklch(0 0 0 / .08)',
      }}>
        <div className="row gap-2" style={{alignItems:'center'}}>
          <Brand size={28}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12, fontWeight:600, color:'oklch(0.20 0.04 152)'}}>Computicket NG</div>
            <div style={{fontSize:10, color:'oklch(0.45 0.04 152)'}}>Mobile prototype</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MobileApp/>);
