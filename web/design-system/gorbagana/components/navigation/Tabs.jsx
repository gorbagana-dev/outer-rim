import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
export function Tabs({ tabs = [], value, onChange, variant = 'underline', size = 'md', style }) {
  const [hoverKey, setHoverKey] = useState(null);
  const pill = variant === 'pill';
  return <div role="tablist" style={{ display: 'flex', gap: pill ? 4 : 0, padding: pill ? 4 : 0, background: pill ? 'var(--void-0)' : 'transparent', border: pill ? '1px solid var(--border-default)' : 'none', borderBottom: pill ? undefined : '1px solid var(--border-subtle)', borderRadius: pill ? 'var(--radius-sm)' : 0, width: pill ? 'fit-content' : '100%', ...style }}>
    {tabs.map(t => { const on = t.value === value, hv = hoverKey === t.value; return <button key={t.value} role="tab" aria-selected={on} type="button" disabled={t.disabled} onClick={() => onChange && onChange(t.value)} onMouseEnter={() => setHoverKey(t.value)} onMouseLeave={() => setHoverKey(null)} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, height: size === 'sm' ? 32 : 40, padding: pill ? '0 14px' : '0 16px', background: pill && on ? 'var(--acid-500)' : pill && hv ? 'var(--white-6)' : 'transparent', border: 0, borderRadius: pill ? 'var(--radius-xs)' : 0, color: pill && on ? 'var(--ink-900)' : on ? 'var(--acid-500)' : hv ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', cursor: t.disabled ? 'not-allowed' : 'pointer', opacity: t.disabled ? .4 : 1, transition: 'all var(--dur-fast) var(--ease-out)', boxShadow: pill && on ? 'var(--glow-acid)' : 'none', textShadow: !pill && on ? 'var(--text-glow-acid)' : 'none', outline: 'none', whiteSpace: 'nowrap' }}>
      {t.icon && <Icon name={t.icon} size={16} />}{t.label}
      {t.count != null && <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-2xs)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', background: pill && on ? 'rgba(0,0,0,.2)' : 'var(--white-6)', color: 'inherit' }}>{t.count}</span>}
      {!pill && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'var(--acid-500)', boxShadow: 'var(--glow-acid)', transform: on ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform var(--dur-base) var(--ease-out)' }} />}
    </button>; })}
  </div>;
}
