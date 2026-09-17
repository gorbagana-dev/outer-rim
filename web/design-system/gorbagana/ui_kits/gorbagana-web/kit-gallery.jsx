const { Button, IconButton, Badge, Card, Tag, Tabs, Dialog, Toast, Checkbox, Switch, Icon } = window.GorbaganaDesignSystem_e5ff07;
const GORBS = [[2702, 'Teal bin', 'golden eyes'], [3136, 'Teal bin', 'rainbow eyes'], [1511, 'Blue bin', 'ice pop'], [565, 'Blue bin', 'crown and fist'], [348, 'Black bag', 'hand gesture'], [4051, 'Mattress', 'glasses'], [208, 'Brown block', 'closed eyes'], [1783, 'Capsule', 'star eyes'], [3196, 'Shaggy form', 'extra eyes'], [153, 'Gray rounded', 'cap'], [1268, 'Stacked packaging', 'pizza'], [2989, 'Cereal box', 'Gorbi-O\'s']];
const FAMILIES = ['Teal bin', 'Blue bin', 'Black bag', 'Mattress', 'Brown block', 'Capsule', 'Shaggy form', 'Gray rounded'];
function Gallery() {
  const [fam, setFam] = React.useState([]); const [view, setView] = React.useState('grid'); const [sel, setSel] = React.useState(null); const [toast, setToast] = React.useState(null); const [listed, setListed] = React.useState(false);
  const items = GORBS.filter(g => fam.length === 0 || fam.includes(g[1]));
  const toggle = f => setFam(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f]);
  return <main style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: '40px 32px 80px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 88, alignSelf: 'start' }}>
      <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Body family</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{FAMILIES.map(f => <Tag key={f} selected={fam.includes(f)} onClick={() => toggle(f)}>{f}</Tag>)}</div>
      <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 8 }}>Status</div>
      <Checkbox checked={listed} onChange={setListed} label="Listed only" /><Switch checked={false} label="Show clover badges" disabled />
      <Card variant="sticker" tilt={-2} padding="14px"><div style={{ font: 'var(--type-sticker)', fontSize: 15 }}>4,444 citizens. One body per character. Never average them.</div></Card>
    </aside>
    <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}><div><div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--pink-500)', marginBottom: 8 }}>Collection</div><h1 style={{ margin: 0, font: 'var(--type-h1)', color: 'var(--acid-500)', textShadow: 'var(--text-glow-acid)' }}>Gorbagios</h1></div><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{items.length} shown</span><Tabs variant="pill" size="sm" value={view} onChange={setView} tabs={[{ value: 'grid', label: 'Grid', icon: 'layout-grid' }, { value: 'list', label: 'List', icon: 'list' }]} /></div></div>
      <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(4,1fr)' : '1fr', gap: 16 }}>{items.map(g => <GorbCard key={g[0]} g={g} list={view === 'list'} onOpen={() => setSel(g)} />)}</div>
    </section>
    {sel && <Dialog open onClose={() => setSel(null)} eyebrow={`Gorbagio · ${sel[1]}`} title={`#${sel[0]}`} width={560} footer={<><Button variant="ghost" onClick={() => setSel(null)}>Close</Button><Button iconLeft="zap" onClick={() => { setSel(null); setToast(sel); }}>Make offer in $GOR</Button></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}><img src={`../../assets/gorbagios/gorbagio-${sel[0]}.jpg`} alt="" style={{ width: 200, height: 200, borderRadius: 'var(--radius-sm)', border: '2px solid var(--pink-500)', boxShadow: 'var(--glow-pink)' }} /><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><Badge tone="cyan">{sel[1]}</Badge><Badge tone="pink" variant="outline">{sel[2]}</Badge></div><p style={{ margin: 0, font: 'var(--type-body-sm)' }}>Screenshot-derived reference. Preserve body family, face patch, eye geometry and signature prop when remixing. Ignore the clover badge.</p><div style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-muted)' }}>owner gor1…4x9B</div></div></div>
    </Dialog>}
    {toast && <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 'var(--z-toast)' }}><Toast tone="gor" title={`Offer sent on #${toast[0]}`} description="The bin will consider it." onDismiss={() => setToast(null)} /></div>}
  </main>;
}
function GorbCard({ g, list, onOpen }) {
  return <Card padding="0" interactive onClick={onOpen} style={{ flexDirection: list ? 'row' : 'column', alignItems: list ? 'center' : 'stretch' }}>
    <img src={`../../assets/gorbagios/gorbagio-${g[0]}.jpg`} alt={`Gorbagio #${g[0]}`} style={{ width: list ? 72 : '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
    <div style={{ display: 'flex', flexDirection: list ? 'row' : 'column', alignItems: list ? 'center' : 'stretch', gap: list ? 20 : 6, padding: '12px 14px', flex: 1 }}><div style={{ font: 'var(--type-body)', fontWeight: 700 }}>#{g[0]}</div><div style={{ font: 'var(--type-body-sm)', fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{g[1]} · {g[2]}</div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: list ? 0 : 4, gap: 12 }}><span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--acid-500)' }}>— $GOR</span><IconButton icon="heart" label="Like" size="sm" /></div></div>
  </Card>;
}
Object.assign(window, { Gallery });
