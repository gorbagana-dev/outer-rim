import React from 'react';
const TONES = {
  acid: ['var(--acid-500)', 'var(--status-success-bg)'], pink: ['var(--pink-500)', 'rgba(255,45,170,.14)'], cyan: ['var(--cyan-500)', 'var(--status-info-bg)'], yellow: ['var(--yellow-500)', 'var(--status-warning-bg)'], danger: ['var(--sunset-600)', 'var(--status-danger-bg)'], purple: ['var(--purple-300)', 'rgba(154,77,255,.16)'], neutral: ['var(--text-secondary)', 'var(--white-6)'],
};
export function Badge({ tone = 'acid', variant = 'soft', dot = false, pulse = false, children, style }) {
  const [fg, bg] = TONES[tone] || TONES.acid;
  const v = variant === 'solid' ? { background: fg, color: tone === 'pink' || tone === 'danger' || tone === 'purple' ? 'var(--white)' : 'var(--ink-900)', border: '1px solid transparent' } : variant === 'outline' ? { background: 'transparent', color: fg, border: `1px solid ${fg}`, boxShadow: `0 0 8px ${fg.startsWith('var') ? 'transparent' : fg}` } : { background: bg, color: fg, border: '1px solid transparent' };
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px', borderRadius: 'var(--radius-xs)', font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', whiteSpace: 'nowrap', ...v, ...style }}>
    {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: variant === 'solid' ? 'currentColor' : fg, boxShadow: `0 0 6px ${fg}`, animation: pulse ? 'gor-pulse 1.4s ease-in-out infinite' : undefined }} />}{children}
    {pulse && <style>{'@keyframes gor-pulse{0%,100%{opacity:1}50%{opacity:.35}}'}</style>}
  </span>;
}
