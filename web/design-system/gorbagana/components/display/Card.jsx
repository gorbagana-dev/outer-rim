import React, { useState } from 'react';
/** Card surfaces: default (void + purple border), neon (glow border, accent color), sticker (paper, hard shadow, tilt), cardboard. */
export function Card({ variant = 'default', accent = 'acid', padding = 'var(--space-5)', tilt = 0, interactive = false, header, footer, children, style, onClick }) {
  const [hover, setHover] = useState(false);
  const acc = { acid: 'var(--acid-500)', pink: 'var(--pink-500)', cyan: 'var(--cyan-500)', yellow: 'var(--yellow-500)', purple: 'var(--purple-400)' }[accent] || accent;
  const glow = { acid: 'var(--glow-acid)', pink: 'var(--glow-pink)', cyan: 'var(--glow-cyan)', yellow: 'var(--glow-yellow)', purple: 'var(--glow-purple)' }[accent] || 'none';
  const v = {
    default: { background: 'var(--surface-1)', border: `1px solid ${hover && interactive ? 'var(--border-strong)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', boxShadow: hover && interactive ? 'var(--glow-purple)' : 'none' },
    neon: { background: 'var(--surface-1)', border: `2px solid ${acc}`, borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', boxShadow: hover && interactive ? glow.replace(')', ')') : glow },
    sticker: { background: 'var(--surface-sticker)', border: '2px solid var(--ink-900)', borderRadius: 'var(--radius-xs)', color: 'var(--text-on-sticker)', boxShadow: 'var(--shadow-sticker-lg)', transform: `rotate(${hover && interactive ? 0 : tilt}deg)` },
    cardboard: { background: 'var(--surface-cardboard)', border: '2px solid var(--card-700)', borderRadius: 'var(--radius-xs)', color: 'var(--ink-900)', boxShadow: 'var(--shadow-sticker)', transform: `rotate(${tilt}deg)`, backgroundImage: 'repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 2px,transparent 2px 9px)' },
    glass: { background: 'rgba(21,10,38,.6)', backdropFilter: 'var(--blur-overlay)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' },
  }[variant];
  const paper = variant === 'sticker' || variant === 'cardboard';
  return <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', flexDirection: 'column', transition: 'all var(--dur-base) var(--ease-out)', cursor: onClick ? 'pointer' : undefined, overflow: 'hidden', ...v, ...style }}>
    {header && <div style={{ padding: `var(--space-3) ${padding}`, borderBottom: `1px ${paper ? 'dashed var(--ink-900)' : 'solid var(--border-subtle)'}`, font: paper ? 'var(--type-sticker)' : 'var(--type-label)', letterSpacing: paper ? 0 : 'var(--tracking-caps)', textTransform: 'uppercase', color: paper ? 'inherit' : 'var(--text-muted)' }}>{header}</div>}
    <div style={{ padding, flex: 1 }}>{children}</div>
    {footer && <div style={{ padding: `var(--space-3) ${padding}`, borderTop: `1px ${paper ? 'dashed var(--ink-900)' : 'solid var(--border-subtle)'}` }}>{footer}</div>}
  </div>;
}
