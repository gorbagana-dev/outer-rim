const DS = window.GorbaganaDesignSystem_e5ff07;
const { Button, IconButton, Badge, Icon } = DS;
function Wordmark({ size = 22 }) {
  return <span style={{ fontFamily: 'var(--font-display)', fontSize: size, color: 'var(--acid-500)', textShadow: 'var(--text-glow-acid)', letterSpacing: '.02em', lineHeight: 1, textTransform: 'uppercase' }}>Gorbagana</span>;
}
function TopNav({ screen, onNav, connected, onConnect }) {
  const items = [['landing', 'Home'], ['explorer', 'Explorer'], ['gallery', 'Gorbagios'], ['docs', 'Docs']];
  return <header style={{ position: 'sticky', top: 0, zIndex: 'var(--z-sticky)', display: 'flex', alignItems: 'center', gap: 32, height: 64, padding: '0 32px', background: 'rgba(13,6,25,.75)', backdropFilter: 'var(--blur-overlay)', borderBottom: '1px solid var(--border-subtle)' }}>
    <a href="#" onClick={e => { e.preventDefault(); onNav('landing'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}><img src="../../assets/brand/gorbagana-pfp.png" alt="" style={{ width: 32, height: 32, borderRadius: 4, border: '1px solid var(--acid-500)' }} /><Wordmark /></a>
    <nav style={{ display: 'flex', gap: 4, flex: 1 }}>{items.map(([k, l]) => <a key={k} href="#" onClick={e => { e.preventDefault(); if (k !== 'docs') onNav(k); }} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', font: 'var(--type-label)', fontSize: 12, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: screen === k ? 'var(--acid-500)' : 'var(--text-secondary)', textShadow: screen === k ? 'var(--text-glow-acid)' : 'none', textDecoration: 'none' }}>{l}</a>)}</nav>
    <Badge dot pulse>Mainnet</Badge>
    <div style={{ display: 'flex', gap: 8 }}><IconButton icon="search" label="Search" /><IconButton icon="sun-moon" label="Theme" />{connected ? <Button variant="outline" size="sm" iconLeft="wallet">gor…4x9B</Button> : <Button size="sm" iconLeft="wallet" onClick={onConnect}>Connect</Button>}</div>
  </header>;
}
function Footer() {
  const cols = [['Network', ['Explorer', 'Validators', 'Bridge', 'Status']], ['Build', ['Docs', 'RPC', 'GitHub', 'Grants']], ['Trash', ['Gorbagios', 'Memes', 'Trash Council', 'Merch']]];
  return <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '48px 32px 32px', background: 'var(--void-0)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, maxWidth: 'var(--container-lg)', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><Wordmark size={28} /><p style={{ margin: 0, color: 'var(--text-muted)', font: 'var(--type-body-sm)', maxWidth: 300 }}>Serious tech. Garbage civilization. Built by degens for dreamers.</p><div style={{ display: 'flex', gap: 6 }}><IconButton icon="twitter" label="X" variant="outline" size="sm" /><IconButton icon="github" label="GitHub" variant="outline" size="sm" /><IconButton icon="message-circle" label="Discord" variant="outline" size="sm" /></div></div>
      {cols.map(([h, ls]) => <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--pink-500)' }}>{h}</div>{ls.map(l => <a key={l} href="#" style={{ color: 'var(--text-secondary)', font: 'var(--type-body-sm)' }}>{l}</a>)}</div>)}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 'var(--container-lg)', margin: '40px auto 0', paddingTop: 20, borderTop: '1px solid var(--border-subtle)', font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-muted)' }}><span>© Gorbagana · no roadmap, check the dumpster</span><span>THE CHAIN IS TRASH. THAT'S THE POINT.</span></div>
  </footer>;
}
Object.assign(window, { Wordmark, TopNav, Footer });
