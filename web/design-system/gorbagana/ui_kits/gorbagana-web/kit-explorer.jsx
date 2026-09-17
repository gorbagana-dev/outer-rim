const { Button, IconButton, Badge, Card, Tabs, Input, Select, Tooltip, Icon } = window.GorbaganaDesignSystem_e5ff07;
const TXS = [['5Kd9…mQ2r', 'Transfer', 'gor1…4x9B', 'gor7…Lm3e', '420.00', 'ok'], ['9pZa…c7Wn', 'Bridge in', 'sol…bridge', 'gor2…Qw8t', '1,337.50', 'ok'], ['2bXq…eR5v', 'Mint Gorbagio', 'gor4…Hn1k', 'gorbagio…', '—', 'ok'], ['7mLc…Ty0p', 'Swap', 'gor9…Bv6s', 'dump.exe', '69.42', 'fail'], ['4hRe…Wk3j', 'Stake', 'gor3…Pz2d', 'validator·07', '10,000.00', 'pending'], ['8qNv…Ue9x', 'Transfer', 'gor6…Cf4a', 'gor1…4x9B', '4.44', 'ok']];
function Stat({ label, value, sub, accent }) {
  return <Card padding="16px 20px"><div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div><div style={{ font: 'var(--type-mono)', fontSize: 26, fontWeight: 700, color: accent ? `var(--${accent}-500)` : 'var(--text-primary)', textShadow: accent ? `var(--text-glow-${accent})` : 'none' }}>{value}</div>{sub && <div style={{ font: 'var(--type-body-sm)', fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{sub}</div>}</Card>;
}
function Explorer() {
  const [tab, setTab] = React.useState('tx'); const [net, setNet] = React.useState('main'); const [q, setQ] = React.useState('');
  const rows = TXS.filter(r => !q || r.join(' ').toLowerCase().includes(q.toLowerCase()));
  const st = { ok: ['acid', 'Confirmed'], fail: ['danger', 'Dumped'], pending: ['yellow', 'Pending'] };
  return <main style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: '40px 32px 80px', display: 'flex', flexDirection: 'column', gap: 28 }}>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
      <div><div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--pink-500)', marginBottom: 8 }}>Landfill explorer</div><h1 style={{ margin: 0, font: 'var(--type-h1)', color: 'var(--acid-500)', textShadow: 'var(--text-glow-acid)' }}>Every block, every bag.</h1></div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}><Select value={net} onChange={setNet} size="sm" options={[{ value: 'main', label: 'Mainnet', icon: 'zap' }, { value: 'test', label: 'Testnet', icon: 'flask-conical' }]} style={{ width: 150 }} /><Input iconLeft="search" size="sm" placeholder="Search tx, block, address…" value={q} onChange={e => setQ(e.target.value)} style={{ width: 320 }} /></div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}><Stat label="Latest slot" value="4,444,201" sub="412ms ago" accent="acid" /><Stat label="TPS (illustrative)" value="2,187" sub="sample data — verify live" /><Stat label="$GOR burned today" value="12,904" sub="≈ one dumpster fire" accent="pink" /><Stat label="Validators" value="—" sub="fetch from RPC" /></div>
    <Card padding="0" header={<Tabs value={tab} onChange={setTab} size="sm" style={{ borderBottom: 0, margin: '-12px -20px', padding: '0 12px' }} tabs={[{ value: 'tx', label: 'Transactions', count: rows.length }, { value: 'blocks', label: 'Blocks' }, { value: 'programs', label: 'Programs' }, { value: 'validators', label: 'Validators', icon: 'server' }]} />}>
      <table style={{ width: '100%', borderCollapse: 'collapse', font: 'var(--type-body-sm)' }}>
        <thead><tr style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left' }}>{['Signature', 'Type', 'From', 'To', 'Amount ($GOR)', 'Status', ''].map(h => <th key={h} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map(r => <Row key={r[0]} r={r} st={st[r[5]]} />)}</tbody>
      </table>
      {rows.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', font: 'var(--type-sticker)' }}>Nothing in this bin.</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-muted)' }}><span>showing {rows.length} of 4,444,201</span><div style={{ display: 'flex', gap: 6 }}><IconButton icon="chevron-left" label="Prev" size="sm" variant="outline" /><IconButton icon="chevron-right" label="Next" size="sm" variant="outline" /></div></div>
    </Card>
  </main>;
}
function Row({ r, st }) {
  const [h, setH] = React.useState(false);
  const td = { padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  return <tr onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? 'var(--white-6)' : 'transparent', transition: 'background var(--dur-fast)' }}>
    <td style={{ ...td, font: 'var(--type-mono)', color: 'var(--cyan-500)' }}>{r[0]}</td><td style={td}>{r[1]}</td><td style={{ ...td, font: 'var(--type-mono)', color: 'var(--text-secondary)' }}>{r[2]}</td><td style={{ ...td, font: 'var(--type-mono)', color: 'var(--text-secondary)' }}>{r[3]}</td><td style={{ ...td, font: 'var(--type-mono)', textAlign: 'right' }}>{r[4]}</td><td style={td}><Badge tone={st[0]} dot pulse={r[5] === 'pending'}>{st[1]}</Badge></td>
    <td style={{ ...td, textAlign: 'right' }}><Tooltip content="Copy signature" side="left"><IconButton icon="copy" label="Copy" size="sm" /></Tooltip></td>
  </tr>;
}
Object.assign(window, { Explorer });
