import React from 'react';
export function Radio({ options = [], value, onChange, name, direction = 'column', disabled = false, style }) {
  return <div role="radiogroup" style={{ display: 'flex', flexDirection: direction, gap: direction === 'row' ? 20 : 10, ...style }}>
    {options.map(o => { const on = o.value === value; return <label key={o.value} style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, userSelect: 'none' }}>
      <input type="radio" name={name} checked={on} disabled={disabled} onChange={() => onChange && onChange(o.value)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0, marginTop: 1, borderRadius: '50%', background: 'var(--void-0)', border: `2px solid ${on ? 'var(--pink-500)' : 'var(--border-strong)'}`, boxShadow: on ? 'var(--glow-pink)' : 'var(--shadow-inset-bin)', transition: 'all var(--dur-fast) var(--ease-out)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pink-500)', transform: on ? 'scale(1)' : 'scale(0)', transition: 'transform var(--dur-fast) var(--ease-snap)' }} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ font: 'var(--type-body)', color: 'var(--text-primary)', lineHeight: 1.4 }}>{o.label}</span>{o.description && <span style={{ font: 'var(--type-body-sm)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{o.description}</span>}</span>
    </label>; })}
  </div>;
}
