import React, { useEffect } from 'react';
import { IconButton } from '../core/IconButton.jsx';
/** Modal dialog. `inline` renders it in-flow (for cards/specimens) instead of fixed to the viewport. */
export function Dialog({ open = true, onClose, title, eyebrow, children, footer, width = 480, variant = 'default', inline = false, style }) {
  useEffect(() => { if (!open || inline) return; const k = e => { if (e.key === 'Escape' && onClose) onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open, onClose, inline]);
  if (!open) return null;
  const sticker = variant === 'sticker';
  const panel = <div role="dialog" aria-modal={!inline} onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: width, display: 'flex', flexDirection: 'column', background: sticker ? 'var(--surface-sticker)' : 'var(--void-2)', color: sticker ? 'var(--text-on-sticker)' : 'var(--text-primary)', border: sticker ? '2px solid var(--ink-900)' : '1px solid var(--border-strong)', borderRadius: sticker ? 'var(--radius-xs)' : 'var(--radius-lg)', boxShadow: sticker ? 'var(--shadow-sticker-lg)' : 'var(--shadow-elevated), var(--glow-purple)', transform: sticker ? 'rotate(var(--tilt-1))' : 'none', overflow: 'hidden', ...style }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '20px 20px 0' }}>
      <div style={{ flex: 1, minWidth: 0 }}>{eyebrow && <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: sticker ? 'var(--card-700)' : 'var(--pink-500)', marginBottom: 6 }}>{eyebrow}</div>}{title && <h2 style={{ margin: 0, font: 'var(--type-h2)', textShadow: sticker ? 'none' : 'var(--text-glow-acid)', color: sticker ? 'inherit' : 'var(--acid-500)' }}>{title}</h2>}</div>
      {onClose && <IconButton icon="x" label="Close" size="sm" onClick={onClose} style={sticker ? { color: 'var(--ink-900)' } : undefined} />}
    </div>
    <div style={{ padding: 20, font: 'var(--type-body)', color: sticker ? 'inherit' : 'var(--text-secondary)' }}>{children}</div>
    {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '0 20px 20px' }}>{footer}</div>}
  </div>;
  if (inline) return panel;
  return <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--surface-overlay)', backdropFilter: 'var(--blur-overlay)' }}>{panel}</div>;
}
