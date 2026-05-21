/* ===== CHECKOUT PAGE ===== */
const PageCheckout = () => {
  const { go } = useRoute();
  const [pay, setPay] = useState("card");
  const [step, setStep] = useState(2); // 1 details, 2 payment, 3 confirm

  return (
    <div className="page-enter">
      <section className="wrap" style={{paddingTop:48, paddingBottom:80}}>
        <button className="btn btn-ghost btn-sm" onClick={() => go({name:"event"})}>
          <Icon name="chevron" size={13} stroke={2} style={{transform:'rotate(180deg)'}}/> Back to event
        </button>

        {/* Step indicator */}
        <div className="row mt-6 mb-8" style={{justifyContent:'center', gap:0}}>
          {["Your details","Payment","Confirmation"].map((s,i) => (
            <div key={s} className="row" style={{gap:12, alignItems:'center'}}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background: step > i ? 'var(--accent)' : step === i+1 ? 'var(--ink)' : 'var(--surface-2)',
                color: step > i ? 'oklch(0.2 0.05 152)' : step === i+1 ? 'var(--bg-void)' : 'var(--ink-3)',
                display:'grid', placeItems:'center', fontSize:12, fontWeight:600,
                border:'1px solid var(--line)',
              }}>
                {step > i ? <Icon name="check" size={14}/> : i+1}
              </div>
              <span className="fw-500" style={{fontSize:13, color: step === i+1 ? 'var(--ink)' : 'var(--ink-3)'}}>{s}</span>
              {i < 2 && <div style={{width:60, height:1, background:'var(--line)', margin:'0 18px'}}/>}
            </div>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:32, alignItems:'flex-start'}}>
          <div className="col gap-4">
            {/* Buyer details (collapsed) */}
            <div className="card" style={{padding:24}}>
              <div className="between">
                <div className="row gap-3">
                  <div style={{width:28, height:28, borderRadius:'50%', background:'var(--accent)', color:'oklch(0.2 0.05 152)', display:'grid', placeItems:'center', fontSize:12, fontWeight:600}}>
                    <Icon name="check" size={14}/>
                  </div>
                  <div>
                    <div className="h-4">Your details</div>
                    <div className="text-xs muted mt-1">Adaeze Okafor · adaeze@example.com · +234 803 ••• 4421</div>
                  </div>
                </div>
                <button className="text-sm accent-text">Edit</button>
              </div>
            </div>

            {/* Payment method */}
            <div className="card" style={{padding:28}}>
              <div className="between mb-5">
                <div>
                  <div className="row gap-3" style={{alignItems:'center'}}>
                    <div style={{width:28, height:28, borderRadius:'50%', background:'var(--ink)', color:'var(--bg-void)', display:'grid', placeItems:'center', fontSize:12, fontWeight:600}}>2</div>
                    <div className="h-3" style={{fontSize:20}}>Payment</div>
                  </div>
                </div>
                <span className="row gap-2 text-xs muted"><Icon name="shield" size={13}/> 256-bit · PCI-DSS</span>
              </div>

              {/* Method selector */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10}}>
                {[
                  {id:"card",   label:"Card",        sub:"Verve · Visa · Mastercard"},
                  {id:"transfer",label:"Transfer",   sub:"Instant bank transfer"},
                  {id:"ussd",   label:"USSD",        sub:"*894# · *901#"},
                  {id:"wallet", label:"Wallet",      sub:"Apple Pay · Opay"},
                ].map(m => (
                  <button key={m.id} onClick={() => setPay(m.id)} style={{
                    textAlign:'left', padding:'14px 16px', borderRadius:'var(--r-3)',
                    border:`1px solid ${pay===m.id?'var(--accent)':'var(--line)'}`,
                    background: pay===m.id ? 'var(--accent-soft)' : 'var(--surface-2)',
                    cursor:'pointer',
                  }}>
                    <div className="fw-600" style={{fontSize:13}}>{m.label}</div>
                    <div className="text-xs muted mt-1">{m.sub}</div>
                  </button>
                ))}
              </div>

              {pay === "card" && (
                <div className="mt-6">
                  <div className="col gap-4">
                    <div>
                      <label className="text-xs muted">Card number</label>
                      <div style={{position:'relative', marginTop:6}}>
                        <input className="input" defaultValue="4539 •••• •••• 2847" style={{paddingLeft:48, fontFamily:'var(--font-mono)'}}/>
                        <div style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:24, height:16, borderRadius:3, background:'linear-gradient(135deg, var(--accent), oklch(0.55 0.18 180))'}}/>
                      </div>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap:12}}>
                      <div>
                        <label className="text-xs muted">Expiry</label>
                        <input className="input mt-1" defaultValue="08 / 28"/>
                      </div>
                      <div>
                        <label className="text-xs muted">CVV</label>
                        <input className="input mt-1" defaultValue="•••"/>
                      </div>
                      <div>
                        <label className="text-xs muted">Save card</label>
                        <div className="row gap-2 mt-2"><Icon name="check" size={13} stroke={2.5} /> <span className="text-sm">Yes, in wallet</span></div>
                      </div>
                    </div>

                    <div className="card" style={{padding:14, background:'var(--surface-2)', border:'1px dashed var(--line-strong)'}}>
                      <div className="row gap-3">
                        <Icon name="lock" size={15}/>
                        <div className="text-sm" style={{flex:1}}>
                          <b>OTP verification</b> — we'll send a 6-digit code to <b>+234 803 ••• 4421</b> after you confirm.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pay === "transfer" && (
                <div className="mt-6 card" style={{padding:20, background:'var(--surface-2)'}}>
                  <div className="text-sm muted">Account number (single-use, expires in 30 min)</div>
                  <div className="h-2 mono mt-2 tnum">8047 392 184</div>
                  <div className="row gap-3 mt-4 muted text-xs"><span>Wema Bank</span>·<span>Computicket NG (Adaeze)</span>·<span>Ref: CT-A7K2J</span></div>
                </div>
              )}

              {pay === "ussd" && (
                <div className="mt-6 card" style={{padding:20, background:'var(--surface-2)', textAlign:'center'}}>
                  <div className="text-sm muted">Dial this on the phone tied to your bank</div>
                  <div className="h-1 mono mt-3 accent-text" style={{fontSize:36}}>*894*60000*8294#</div>
                </div>
              )}

              {pay === "wallet" && (
                <div className="mt-6 row gap-3">
                  <button className="btn btn-primary btn-lg" style={{background:'#000', color:'#fff', flex:1}}>  Apple Pay</button>
                  <button className="btn btn-ghost btn-lg" style={{flex:1}}>Opay</button>
                  <button className="btn btn-ghost btn-lg" style={{flex:1}}>Palmpay</button>
                </div>
              )}
            </div>

            {/* Trust microcopy */}
            <div className="card" style={{padding:20}}>
              <div className="row gap-4" style={{flexWrap:'wrap'}}>
                {[
                  {i:"shield", t:"Buyer protection"},
                  {i:"qr",     t:"Verified QR delivery"},
                  {i:"lock",   t:"AES-256 encrypted"},
                  {i:"check",  t:"NDPR compliant"},
                  {i:"refresh",t:"100% refund if cancelled"},
                ].map(x => (
                  <span key={x.t} className="row gap-2 text-xs" style={{color:'var(--ink-2)'}}>
                    <Icon name={x.i} size={13}/> {x.t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky order summary */}
          <aside style={{position:'sticky', top:96, display:'flex', flexDirection:'column', gap:16}}>
            <div className="card" style={{padding:0, overflow:'hidden'}}>
              <div className="ph ph-2 ph-noise" style={{height:120, position:'relative'}}>
                <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 40%, oklch(0 0 0 / .85))'}}/>
                <div style={{position:'absolute', left:16, bottom:14, color:'white'}}>
                  <div className="mono text-xs" style={{opacity:.8}}>SUN 07 JUN · 8PM · LAGOS</div>
                  <div className="serif" style={{fontSize:22}}>Asake — Lungu Boy Tour</div>
                </div>
              </div>

              <div style={{padding:24}}>
                <div className="eyebrow mb-3">Order summary</div>
                <div className="col gap-3">
                  <div className="between">
                    <div>
                      <div className="fw-500" style={{fontSize:14}}>2 × Premium Stand</div>
                      <div className="text-xs muted">Row E · Seat 8, 9</div>
                    </div>
                    <div className="fw-500 tnum">{formatNGN(110000)}</div>
                  </div>
                  <div className="between">
                    <div className="text-sm">Service fee (3.5%)</div>
                    <div className="text-sm tnum">{formatNGN(3850)}</div>
                  </div>
                  <div className="between">
                    <div className="text-sm">VAT (7.5%)</div>
                    <div className="text-sm tnum">{formatNGN(8538)}</div>
                  </div>
                  <div className="between">
                    <div className="row gap-2" style={{alignItems:'center'}}>
                      <span className="text-sm accent-text">Wallet credit applied</span>
                      <Icon name="wallet" size={13}/>
                    </div>
                    <div className="text-sm tnum accent-text">– {formatNGN(5000)}</div>
                  </div>
                </div>

                <div className="hr mt-4 mb-4"/>

                <div className="between">
                  <div className="fw-600">Total</div>
                  <div className="h-3 tnum">{formatNGN(117388)}</div>
                </div>

                <button className="btn btn-accent btn-lg mt-6" style={{width:'100%', justifyContent:'center'}}>
                  <Icon name="lock" size={14}/> Pay {formatNGN(117388)} securely
                </button>

                <div className="text-xs muted mt-3 text-c">
                  Powered by Paystack & Flutterwave · Refund guarantee
                </div>
              </div>
            </div>

            {/* Loyalty pop */}
            <div className="card" style={{padding:18, background:'var(--accent-soft)', border:'1px solid var(--accent)'}}>
              <div className="row gap-2"><Icon name="gift" size={15}/><span className="fw-600 text-sm">Earn 1,174 Compass Points</span></div>
              <div className="text-xs muted mt-2" style={{lineHeight:1.5}}>= ₦1,174 wallet credit on your next booking. Tier: Gold (2,847/5,000 to Platinum).</div>
            </div>
          </aside>
        </div>

        {/* QR delivery preview */}
        <div className="card mt-8" style={{padding:32, display:'grid', gridTemplateColumns:'auto minmax(0,1fr) auto', gap:32, alignItems:'center'}}>
          <div className="card" style={{padding:18, background:'var(--surface-2)', borderRadius:'var(--r-3)'}}>
            <div style={{width:120, height:120, background:'white', padding:8, borderRadius:8}}>
              <svg viewBox="0 0 30 30" width="104" height="104">
                {Array.from({length:30*30}).map((_, i) => {
                  const x = i%30, y = Math.floor(i/30);
                  const on = (x*7+y*11+x*y)%3 === 0 || (x<7&&y<7) || (x>22&&y<7) || (x<7&&y>22);
                  return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#06030f"/> : null;
                })}
                <rect x="11" y="11" width="8" height="8" fill="white"/>
                <circle cx="15" cy="15" r="2.5" fill="var(--accent)"/>
              </svg>
            </div>
          </div>
          <div>
            <div className="eyebrow accent-text mb-2">After payment</div>
            <div className="h-3">Your QR ticket lands in 3 places</div>
            <p className="text-sm muted mt-2" style={{maxWidth:520, lineHeight:1.6}}>
              Email & WhatsApp instantly. Apple Wallet & Google Pay automatically. Cached offline in your Compass app
              — scans cleanly even when the venue WiFi is rough.
            </p>
            <div className="row gap-2 mt-4" style={{flexWrap:'wrap'}}>
              <span className="chip"><Icon name="check" size={12}/> Email</span>
              <span className="chip"><Icon name="check" size={12}/> WhatsApp</span>
              <span className="chip"><Icon name="check" size={12}/> Apple Wallet</span>
              <span className="chip"><Icon name="check" size={12}/> Google Pay</span>
              <span className="chip"><Icon name="check" size={12}/> Computicket app</span>
            </div>
          </div>
          <div>
            <div className="text-xs muted">Anti-fraud</div>
            <div className="h-4 mt-1">Rotating QR<br/>+ device-bound</div>
          </div>
        </div>
      </section>
    </div>
  );
};

window.PageCheckout = PageCheckout;
