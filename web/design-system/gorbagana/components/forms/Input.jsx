import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
export function Input({ label, hint, error, iconLeft, suffix, size = 'md', mono = false, disabled = false, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  const border = error ? 'var(--status-danger)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return <label style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: disabled ? .5 : 1, ...style }}>
    {label && <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{label}</span>}
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, height: h, padding: '0 12px', background: 'var(--void-0)', border: `2px solid ${border}`, borderRadius: 'var(--radius-sm)', boxShadow: focus ? (error ? 'var(--glow-pink)' : 'var(--glow-cyan)') : 'var(--shadow-inset-bin)', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      {iconLeft && <Icon name={iconLeft} size={16} color="var(--text-muted)" />}
      <input disabled={disabled} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{ flex: 1, minWidth: 0, background: 'none', border: 0, outline: 'none', color: 'var(--text-primary)', font: mono ? 'var(--type-mono)' : 'var(--type-body)', fontSize: size === 'sm' ? 'var(--text-sm)' : undefined }} {...rest} />
      {suffix && <span style={{ font: 'var(--type-label)', color: 'var(--text-muted)', letterSpacing: 'var(--tracking-wide)' }}>{suffix}</span>}
    </span>
    {(error || hint) && <span style={{ font: 'var(--type-body-sm)', fontSize: 'var(--text-xs)', color: error ? 'var(--status-danger)' : 'var(--text-muted)' }}>{error || hint}</span>}
  </label>;
}
