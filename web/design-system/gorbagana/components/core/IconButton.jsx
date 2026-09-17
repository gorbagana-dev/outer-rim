import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
const SZ = { sm: ['var(--control-sm)', 16], md: ['var(--control-md)', 20], lg: ['var(--control-lg)', 24] };
export function IconButton({ icon, label, variant = 'ghost', size = 'md', active = false, disabled = false, onClick, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const [h, i] = SZ[size] || SZ.md;
  const v = {
    ghost: { background: hover || active ? 'var(--white-6)' : 'transparent', color: active ? 'var(--acid-500)' : hover ? 'var(--text-primary)' : 'var(--text-secondary)', border: '2px solid transparent', boxShadow: 'none' },
    outline: { background: hover ? 'rgba(154,77,255,.15)' : 'transparent', color: 'var(--text-primary)', border: '2px solid var(--border-default)', boxShadow: hover ? 'var(--glow-purple)' : 'none' },
    primary: { background: 'var(--brand-primary)', color: 'var(--text-on-acid)', border: '2px solid transparent', boxShadow: hover ? 'var(--glow-acid-strong)' : 'var(--glow-acid)' },
    pink: { background: hover ? 'var(--pink-500)' : 'transparent', color: hover ? 'var(--white)' : 'var(--pink-500)', border: '2px solid var(--pink-500)', boxShadow: hover ? 'var(--glow-pink)' : 'none' },
  }[variant];
  return <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: h, height: h, borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .4 : 1, transition: 'all var(--dur-fast) var(--ease-out)', outline: 'none', ...v, ...style }} {...rest}><Icon name={icon} size={i} /></button>;
}
