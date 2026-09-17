import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({ checked = false, onChange, label, description, disabled = false, indeterminate = false, style }) {
  const on = checked || indeterminate;
  return <label style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, userSelect: 'none', ...style }}>
    <input type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
    <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0, marginTop: 1, borderRadius: 'var(--radius-xs)', background: on ? 'var(--acid-500)' : 'var(--void-0)', border: `2px solid ${on ? 'var(--acid-500)' : 'var(--border-strong)'}`, boxShadow: on ? 'var(--glow-acid)' : 'var(--shadow-inset-bin)', color: 'var(--ink-900)', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      {indeterminate ? <span style={{ width: 10, height: 2.5, background: 'var(--ink-900)' }} /> : checked && <Icon name="check" size={14} strokeWidth={3.5} />}
    </span>
    {(label || description) && <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{label && <span style={{ font: 'var(--type-body)', color: 'var(--text-primary)', lineHeight: 1.4 }}>{label}</span>}{description && <span style={{ font: 'var(--type-body-sm)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{description}</span>}</span>}
  </label>;
}
