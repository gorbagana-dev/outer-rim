import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
const SIZES = { sm: { h: 'var(--control-sm)', px: '12px', fs: 'var(--text-xs)', icon: 14 }, md: { h: 'var(--control-md)', px: '18px', fs: 'var(--text-sm)', icon: 16 }, lg: { h: 'var(--control-lg)', px: '24px', fs: 'var(--text-md)', icon: 18 } };
function variantStyle(v, hover, active) {
  switch (v) {
    case 'secondary': return { background: hover ? 'var(--pink-500)' : 'transparent', color: hover ? 'var(--text-on-pink)' : 'var(--pink-500)', border: '2px solid var(--pink-500)', boxShadow: hover ? 'var(--glow-pink)' : 'none' };
    case 'ghost': return { background: hover ? 'var(--white-6)' : 'transparent', color: hover ? 'var(--text-primary)' : 'var(--text-secondary)', border: '2px solid transparent', boxShadow: 'none' };
    case 'outline': return { background: hover ? 'rgba(25,230,255,.1)' : 'transparent', color: 'var(--cyan-500)', border: '2px solid var(--cyan-500)', boxShadow: hover ? 'var(--glow-cyan)' : 'none' };
    case 'danger': return { background: hover ? 'var(--sunset-500)' : 'var(--sunset-600)', color: 'var(--white)', border: '2px solid transparent', boxShadow: hover ? 'var(--glow-pink)' : 'none' };
    case 'sticker': return { background: 'var(--surface-sticker)', color: 'var(--text-on-sticker)', border: '2px solid var(--ink-900)', boxShadow: active ? '1px 1px 0 var(--ink-900)' : 'var(--shadow-sticker)', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-display)', letterSpacing: 0, textTransform: 'uppercase', transform: active ? 'translate(2px,2px) rotate(var(--tilt-2))' : `rotate(${hover ? '0deg' : 'var(--tilt-2)'})` };
    default: return { background: hover ? 'var(--brand-primary-hover)' : active ? 'var(--brand-primary-active)' : 'var(--brand-primary)', color: 'var(--text-on-acid)', border: '2px solid transparent', boxShadow: hover ? 'var(--glow-acid-strong)' : 'var(--glow-acid)' };
  }
}
export function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, disabled = false, fullWidth = false, children, style, onClick, type = 'button', ...rest }) {
  const [hover, setHover] = useState(false); const [active, setActive] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const base = { display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined, alignItems: 'center', justifyContent: 'center', gap: '8px', height: s.h, padding: `0 ${s.px}`, borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: s.fs, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', lineHeight: 1, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition: 'all var(--dur-fast) var(--ease-out)', transform: active && variant !== 'sticker' ? 'scale(.97)' : undefined, whiteSpace: 'nowrap', userSelect: 'none', outline: 'none' };
  return <button type={type} disabled={disabled} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setActive(false); }} onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)} style={{ ...base, ...variantStyle(variant, hover && !disabled, active && !disabled), ...style }} {...rest}>
    {iconLeft && <Icon name={iconLeft} size={s.icon} />}{children}{iconRight && <Icon name={iconRight} size={s.icon} />}
  </button>;
}
