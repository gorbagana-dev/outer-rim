import React from 'react';
export function Switch({ checked = false, onChange, label, disabled = false, size = 'md', style }) {
  const w = size === 'sm' ? 32 : 44, h = size === 'sm' ? 18 : 24, k = h - 6;
  return <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, userSelect: 'none', ...style }}>
    <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
    <span aria-hidden="true" style={{ position: 'relative', width: w, height: h, flexShrink: 0, borderRadius: 'var(--radius-pill)', background: checked ? 'var(--acid-500)' : 'var(--bin-600)', border: `2px solid ${checked ? 'var(--acid-500)' : 'var(--bin-500)'}`, boxShadow: checked ? 'var(--glow-acid)' : 'var(--shadow-inset-bin)', transition: 'all var(--dur-base) var(--ease-out)' }}>
      <span style={{ position: 'absolute', top: 1, left: checked ? w - k - 5 : 1, width: k, height: k, borderRadius: '50%', background: checked ? 'var(--ink-900)' : 'var(--text-secondary)', transition: 'left var(--dur-base) var(--ease-snap), background var(--dur-base)' }} />
    </span>
    {label && <span style={{ font: 'var(--type-body)', color: 'var(--text-primary)' }}>{label}</span>}
  </label>;
}
