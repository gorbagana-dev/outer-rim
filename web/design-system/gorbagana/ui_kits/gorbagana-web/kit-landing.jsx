const { Button, Badge, Card, Tag, Icon } = window.GorbaganaDesignSystem_e5ff07;
function Hero({ onNav }) {
  return <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--gradient-void)', borderBottom: '1px solid var(--border-subtle)' }}>
    <div style={{ position: 'absolute', left: '50%', top: 60, width: 520, height: 520, marginLeft: -260, borderRadius: '50%', background: 'var(--gradient-sunset)', opacity: .9 }} /><div style={{ position: 'absolute', left: '50%', top: 60, width: 520, height: 520, marginLeft: -260, borderRadius: '50%', background: 'var(--gradient-sunset-stripes)' }} />
    <div style={{ position: 'absolute', left: -200, right: -200, bottom: 0, height: 380, backgroundImage: 'var(--bg-grid)', backgroundSize: '56px 56px', transform: 'perspective(400px) rotateX(58deg)', transformOrigin: 'bottom', opacity: .8 }} />
    <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: 200, background: 'linear-gradient(180deg,transparent,var(--void-1))' }} />
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center', maxWidth: 'var(--container-lg)', margin: '0 auto', padding: '88px 32px 120px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 10 }}><Tag variant="sticker" tilt={-3}>Trash people</Tag><Tag variant="sticker" tilt={2}>Better people</Tag></div>
        <h1 style={{ margin: 0, font: 'var(--type-display)', fontSize: 'var(--text-6xl)', color: 'var(--acid-500)', textShadow: 'var(--text-glow-acid)', textTransform: 'uppercase', lineHeight: .95 }}>Gorbagana</h1>
        <p style={{ margin: 0, font: 'var(--type-h3)', fontWeight: 500, color: 'var(--text-primary)', maxWidth: 520 }}>A high-performance L1 forked from Solana. Gas is <span style={{ color: 'var(--pink-500)', fontFamily: 'var(--font-display)', textShadow: 'var(--text-glow-pink)' }}>$GOR</span>. Serious infrastructure, garbage civilization.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><Button size="lg" iconRight="arrow-right" onClick={() => onNav('explorer')}>Enter the landfill</Button><Button size="lg" variant="secondary" iconLeft="recycle">Bridge $GOR</Button><Button size="lg" variant="ghost" iconLeft="book-open">Docs</Button></div>
        <div style={{ display: 'flex', gap: 24, font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-secondary)' }}><span><Icon name="git-fork" size={14} color="var(--cyan-500)" /> forked from Solana</span><span><Icon name="fuel" size={14} color="var(--acid-500)" /> gas: $GOR</span><span><Icon name="skull" size={14} color="var(--pink-500)" /> 4,444 Gorbagios</span></div>
      </div>
      <div style={{ position: 'relative', justifySelf: 'center' }}><img src="../../assets/brand/gorbagana-pfp.png" alt="Gorbagio in a bin" style={{ width: 380, height: 380, display: 'block', borderRadius: 'var(--radius-lg)', border: '2px solid var(--acid-500)', boxShadow: 'var(--glow-acid-strong)', transform: 'rotate(2deg)' }} /><div style={{ position: 'absolute', right: -24, bottom: 24 }}><Tag variant="sticker" tilt={-6} style={{ background: 'var(--sunset-600)', color: 'var(--white)' }}>Good trash only</Tag></div></div>
    </div>
  </section>;
}
function Marquee() {
  const s = ['BUILD. DUMP. REPEAT.', 'GAS: $GOR', 'TRASH HAS FINALITY', 'WELCOME TO THE LANDFILL', 'NO ROADMAP. CHECK THE DUMPSTER.', 'MEME TO MOMENTUM'];
  return <div style={{ overflow: 'hidden', borderTop: '1px solid var(--pink-500)', borderBottom: '1px solid var(--pink-500)', background: 'var(--void-0)', padding: '10px 0', whiteSpace: 'nowrap' }}><div style={{ display: 'inline-flex', gap: 48, animation: 'gor-marquee 28s linear infinite', fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--pink-500)', textShadow: 'var(--text-glow-pink)' }}>{[...s, ...s].map((t, i) => <span key={i}>{t} <span style={{ color: 'var(--acid-500)', margin: '0 8px' }}>✕</span></span>)}</div><style>{'@keyframes gor-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}</style></div>;
}
function Pillars() {
  const items = [['zap', 'Fast blocks', 'Solana-grade throughput and finality, without the premium lounge.', 'acid'], ['recycle', 'Bridge in', 'Move assets over the scrap-metal border. A Gorbagio checks your papers.', 'cyan'], ['hammer', 'Build anything', 'Same tooling you know. RPCs, programs, the works — smelling faintly of landfill.', 'pink']];
  return <section style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: '80px 32px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}><h2 style={{ margin: 0, font: 'var(--type-h1)', color: 'var(--text-primary)' }}>One dev's trash…</h2><span style={{ font: 'var(--type-h2)', color: 'var(--acid-500)', textShadow: 'var(--text-glow-acid)' }}>…is our infrastructure.</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>{items.map(([ic, t, d, a], i) => <Card key={t} variant={i === 0 ? 'neon' : 'default'} accent={a} interactive><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><Icon name={ic} size={28} color={`var(--${a}-500)`} glow /><div style={{ font: 'var(--type-h3)' }}>{t}</div><p style={{ margin: 0, color: 'var(--text-secondary)', font: 'var(--type-body-sm)' }}>{d}</p><Button variant="ghost" size="sm" iconRight="arrow-right" style={{ alignSelf: 'flex-start', marginLeft: -12 }}>Read more</Button></div></Card>)}</div>
  </section>;
}
function Notice() {
  return <section style={{ maxWidth: 'var(--container-md)', margin: '0 auto', padding: '0 32px 96px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
    <Card variant="sticker" tilt={-2} header="Trash Council · Public notice" footer={<Button variant="sticker" size="sm">Join the council</Button>}><p style={{ margin: 0, font: 'var(--type-sticker)', fontSize: 22, lineHeight: 1.25 }}>Governance continues over a visibly burning dumpster. Bring your own lid.</p></Card>
    <Card variant="cardboard" tilt={2} header="Fuel depot"><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ font: 'var(--type-sticker)', fontSize: 22 }}>GAS: $GOR</div><p style={{ margin: 0, font: 'var(--type-body-sm)', color: 'var(--ink-900)' }}>Fill the truck. Every transaction on Gorbagana burns a little $GOR — the way the sanitation gods intended.</p><Badge tone="danger" variant="solid">Verify live facts before publishing</Badge></div></Card>
  </section>;
}
function Landing({ onNav }) { return <main><Hero onNav={onNav} /><Marquee /><Pillars /><Notice /></main>; }
Object.assign(window, { Landing });
