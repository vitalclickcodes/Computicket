/* ===== CHECKOUT with Biometric ===== */
const ScreenCheckout = () => {
  const { go, back } = useRoute();
  const [pay, setPay] = useState("card");
  const [bio, setBio] = useState("idle"); // idle | scanning | success
  const total = 117388;

  const confirm = () => {
    setBio("scanning");
    setTimeout(() => {
      setBio("success");
      setTimeout(() => go({ name:"ticket" }), 900);
    }, 1600);
  };

  return (
    <div className="screen-enter" style={{paddingBottom:120}}>
      <ScreenHeader title="Checkout" onBack={back}/>

      <div style={{padding:'8px 16px'}}>
        {/* Order card */}
        <div className="mcard" style={{padding:0, overflow:'hidden'}}>
          <div className="ph ph-2 ph-noise" style={{height:120, position:'relative'}}>
            <div className="overlay-grad"/>
            <div style={{position:'absolute', left:14, right:14, bottom:12, color:'white'}}>
              <div className="mono text-xs" style={{opacity:.85}}>SUN 07 JUN · 8PM</div>
              <div className="serif" style={{fontSize:20, lineHeight:1.05, marginTop:2}}>Asake — Lungu Boy Tour</div>
            </div>
          </div>
          <div style={{padding:16}}>
            <div className="between">
              <div>
                <div className="fw-600 text-sm">2 × Premium Stand</div>
                <div className="text-xs muted mt-1">Row E · Seat 8, 9</div>
              </div>
              <div className="fw-600 tnum">{formatNGN(110000)}</div>
            </div>
            <div className="between mt-2 text-sm">
              <span className="muted">Service fee (3.5%)</span>
              <span className="tnum">{formatNGN(3850)}</span>
            </div>
            <div className="between mt-2 text-sm">
              <span className="muted">VAT (7.5%)</span>
              <span className="tnum">{formatNGN(8538)}</span>
            </div>
            <div className="between mt-2 text-sm">
              <span className="accent-text">Wallet credit</span>
              <span className="tnum accent-text">– {formatNGN(5000)}</span>
            </div>
            <div className="between mt-3" style={{paddingTop:12, borderTop:'1px solid var(--line)'}}>
              <span className="fw-600">Total</span>
              <span className="h-3 tnum">{formatNGN(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="eyebrow mt-6 mb-3">Payment</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          {[
            {id:"card",      l:"Card",     s:"•••• 2847"},
            {id:"transfer",  l:"Transfer", s:"Wema · single use"},
            {id:"ussd",      l:"USSD",     s:"*894#"},
            {id:"wallet",    l:"Wallet",   s:"Apple Pay"},
          ].map(m => (
            <button key={m.id} onClick={() => setPay(m.id)} style={{
              padding:'14px 16px', textAlign:'left',
              borderRadius:14,
              border: pay===m.id ? '1.5px solid var(--accent)' : '1px solid var(--line)',
              background: pay===m.id ? 'var(--accent-soft)' : 'var(--surface)',
            }}>
              <div className="fw-600 text-sm">{m.l}</div>
              <div className="text-xs muted mt-1">{m.s}</div>
            </button>
          ))}
        </div>

        {pay === "card" && (
          <div className="mcard mt-4" style={{padding:14, background:'var(--surface-2)', border:0}}>
            <div className="row gap-3" style={{alignItems:'center'}}>
              <div style={{width:42, height:28, borderRadius:5, background:'linear-gradient(135deg, var(--accent), oklch(0.55 0.18 180))'}}/>
              <div style={{flex:1}}>
                <div className="fw-600" style={{fontSize:14, fontFamily:'var(--font-mono)'}}>•••• •••• •••• 2847</div>
                <div className="text-xs muted mt-1">Adaeze Okafor · Exp 08/28</div>
              </div>
              <Icon name="check" size={20} stroke={2.5} style={{color:'var(--accent)'}}/>
            </div>
          </div>
        )}

        {/* Trust micro */}
        <div className="row gap-3 mt-4" style={{flexWrap:'wrap'}}>
          {[
            {i:"shield",   t:"Buyer protection"},
            {i:"qr",       t:"Verified QR"},
            {i:"lock",     t:"AES-256"},
            {i:"check",    t:"NDPR safe"},
          ].map(x => (
            <span key={x.t} className="row gap-1 text-xs muted">
              <Icon name={x.i} size={12}/>{x.t}
            </span>
          ))}
        </div>

        {/* Rewards earn */}
        <div className="mt-4" style={{
          padding:14, borderRadius:14,
          background:'var(--accent-soft)', border:'1px solid var(--accent)',
        }}>
          <div className="row gap-2"><Icon name="gift" size={14}/><span className="fw-600 text-sm">Earn 1,174 Compass Points</span></div>
          <p className="text-xs muted mt-1" style={{lineHeight:1.4}}>= ₦1,174 wallet credit next booking</p>
        </div>
      </div>

      {/* Biometric confirm bar */}
      <div style={{
        position:'sticky', bottom:0, marginTop:24,
        background:'var(--surface)', backdropFilter:'blur(20px)',
        borderTop:'0.5px solid var(--line)',
        padding:'14px 16px calc(20px + env(safe-area-inset-bottom))',
      }}>
        {bio === "idle" && (
          <button className="mbtn mbtn-primary mbtn-full mbtn-lg" onClick={confirm}>
            <Icon name="faceid" size={20}/> Pay {formatNGN(total)} with Face ID
          </button>
        )}
        {bio === "scanning" && (
          <button className="mbtn mbtn-primary mbtn-full mbtn-lg" style={{background:'var(--ink)'}}>
            <div style={{
              width:24, height:24, borderRadius:'50%',
              border:'2.5px solid oklch(1 0 0 / .3)', borderTopColor:'white',
              animation:'rotate 1s linear infinite',
            }}/>
            Scanning Face ID…
          </button>
        )}
        {bio === "success" && (
          <button className="mbtn mbtn-primary mbtn-full mbtn-lg" style={{background:'var(--accent)'}}>
            <Icon name="check" size={22} stroke={3}/> Payment confirmed
          </button>
        )}

        <div className="text-xs muted text-c mt-3">
          Powered by Paystack & Flutterwave · OTP backup if biometrics fail
        </div>
      </div>
    </div>
  );
};

window.ScreenCheckout = ScreenCheckout;
