/* ----- Mobile icons (compact set) ----- */
const Icon = ({ name, size = 20, stroke = 1.7 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    heart: <path d="M12 21s-7-4.5-9-9c-1.5-3.4 1-7 4.5-7 2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5 20 5 22.5 8.6 21 12c-2 4.5-9 9-9 9Z"/>,
    music: <><path d="M9 17V5l12-2v12"/><circle cx="6" cy="17" r="3"/><circle cx="18" cy="15" r="3"/></>,
    plane: <path d="M2 16l9-5V4.5a1.5 1.5 0 0 1 3 0V11l9 5v2l-9-3v5l2 1.5V22l-3.5-1L9 22v-1.5L11 19v-5l-9 3v-2Z"/>,
    bus: <><rect x="4" y="4" width="16" height="14" rx="2"/><path d="M4 12h16M8 18v2M16 18v2M8 8h8"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></>,
    bed: <><path d="M3 18v-7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7"/><path d="M3 18h18M3 14h18"/><circle cx="8" cy="11" r="1.5"/></>,
    film: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 8h4M17 8h4M3 16h4M17 16h4M3 12h18"/></>,
    map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    chevron: <path d="m9 6 6 6-6 6"/>,
    chevronDown: <path d="m6 9 6 6 6-6"/>,
    chevronLeft: <path d="m15 6-6 6 6 6"/>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    arrowDown: <path d="M12 5v14m6-6-6 6-6-6"/>,
    arrowUp: <path d="M12 19V5m-6 6 6-6 6 6"/>,
    check: <path d="m5 12 5 5 9-11"/>,
    close: <path d="M6 6l12 12M18 6 6 18"/>,
    star: <path d="M12 3.5 14.6 9l5.9.9-4.3 4.2 1 5.9L12 17.3 6.7 20l1-5.9L3.5 9.9 9.4 9 12 3.5Z"/>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    shield: <><path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12Z"/><path d="m9 12 2 2 4-4"/></>,
    qr: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/></>,
    wallet: <><path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v3"/><path d="M3 7v10a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-3h-5a2 2 0 1 1 0-4h5"/></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 13h18M12 9v12M8 9a3 3 0 1 1 0-6c2 0 4 3 4 6M16 9a3 3 0 1 0 0-6c-2 0-4 3-4 6"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-4M12 16V8M16 16v-7"/></>,
    play: <path d="M6 4v16l14-8L6 4Z"/>,
    pin: <><path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></>,
    send: <path d="M22 3 2 11l8 3 3 8 9-19Z"/>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></>,
    ticket: <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Zm9 0v8"/>,
    fingerprint: <><path d="M12 11v5"/><path d="M16 13v3a8 8 0 0 1-.5 3"/><path d="M8 13a4 4 0 1 1 8 0v3"/><path d="M19 11a7 7 0 0 0-14 0v6"/><path d="M5 17a2 2 0 0 1-2-2"/></>,
    faceid: <><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M9 14s1 2 3 2 3-2 3-2M12 10v4"/></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M4.2 4.2l4.2 4.2M15.6 15.6l4.2 4.2M1 12h6M17 12h6M4.2 19.8l4.2-4.2M15.6 8.4l4.2-4.2"/></>,
    filter: <path d="M3 5h18l-7 9v5l-4 2v-7L3 5Z"/>,
    plus: <path d="M12 5v14m-7-7h14"/>,
    minus: <path d="M5 12h14"/>,
    wifi: <><path d="M2 9a16 16 0 0 1 20 0M5 13a11 11 0 0 1 14 0M8.5 16.5a6 6 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/></>,
    ac: <><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.info}
    </svg>
  );
};

/* ----- App icon brand mark ----- */
const Brand = ({ size = 32 }) => (
  <img src="../assets/app-icon.png" alt="Computicket NG"
    style={{
      width: size, height: size,
      borderRadius: size * 0.22,
      display: 'block',
      boxShadow: '0 2px 8px oklch(0.40 0.15 152 / .25)',
    }}/>
);

window.Icon = Icon;
window.Brand = Brand;

window.formatNGN = (n) => "₦" + n.toLocaleString("en-NG");
