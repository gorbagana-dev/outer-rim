import React, { useState } from 'react';
export function Tooltip({ content, side = 'top', children, tone = 'default' }) {
  const [open, setOpen] = useState(false);
  const pos = { top: { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }, bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }, left: { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }, right: { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' } }[side];
  const skin = tone === 'sticker' ? { background: 'var(--surface-sticker)', color: 'var(--text-on-sticker)', border: '1.5px solid var(--ink-900)', boxShadow: '2px 2px 0 var(--ink-900)', font: 'var(--type-sticker)', fontSize: 'var(--text-sm)' } : { background: 'var(--void-4)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)', boxShadow: 'var(--glow-purple)', font: 'var(--type-body-sm)' };
  return <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
    {children}
    <span role="tooltip" style={{ position: 'absolute', zIndex: 'var(--z-overlay)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', pointerEvents: 'none', opacity: open ? 1 : 0, transition: 'opacity var(--dur-fast) var(--ease-out)', ...skin, ...pos }}>{content}</span>
  </span>;
}
