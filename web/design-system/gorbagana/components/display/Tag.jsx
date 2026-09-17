import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
/** Tag: removable/selectable chip. `sticker` variant is a tilted paper label for lore words. */
export function Tag({ children, selected = false, onRemove, onClick, variant = 'chip', icon, tilt = 0, style }) {
  const [hover, setHover] = useState(false);
  const sticker = variant === 'sticker';
  const base = sticker
    ? { background: 'var(--surface-sticker)', color: 'var(--text-on-sticker)', border: '1.5px solid var(--ink-900)', boxShadow: '2px 2px 0 var(--ink-900)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', transform: `rotate(${tilt}deg)`, borderRadius: 'var(--radius-xs)' }
    : { background: selected ? 'rgba(57,255,20,.14)' : hover ? 'var(--white-6)' : 'var(--surface-2)', color: selected ? 'var(--acid-500)' : 'var(--text-secondary)', border: `1px solid ${selected ? 'var(--acid-500)' : 'var(--border-default)'}`, boxShadow: selected ? 'var(--glow-acid)' : 'none', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500, borderRadius: 'var(--radius-pill)' };
  return <span onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', lineHeight: 1, cursor: onClick ? 'pointer' : 'default', transition: 'all var(--dur-fast) var(--ease-out)', whiteSpace: 'nowrap', userSelect: 'none', ...base, ...style }}>
    {icon && <Icon name={icon} size={14} />}{children}
    {onRemove && <button type="button" aria-label="Remove" onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ display: 'inline-flex', background: 'none', border: 0, padding: 0, margin: '0 -4px 0 0', color: 'inherit', cursor: 'pointer', opacity: .7 }}><Icon name="x" size={14} /></button>}
  </span>;
}
