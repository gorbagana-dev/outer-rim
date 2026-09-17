import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({ label, options = [], value, onChange, placeholder = 'Select…', disabled = false, size = 'md', style }) {
  const [open, setOpen] = useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  const current = options.find(o => o.value === value);
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', opacity: disabled ? .5 : 1, ...style }}>
    {label && <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{label}</span>}
    <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)} onBlur={() => setTimeout(() => setOpen(false), 120)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, height: h, padding: '0 12px', background: 'var(--void-0)', border: `2px solid ${open ? 'var(--border-focus)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-sm)', boxShadow: open ? 'var(--glow-cyan)' : 'var(--shadow-inset-bin)', color: current ? 'var(--text-primary)' : 'var(--text-muted)', font: 'var(--type-body)', cursor: 'pointer', textAlign: 'left', outline: 'none', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{current && current.icon && <Icon name={current.icon} size={16} />}{current ? current.label : placeholder}</span>
      <Icon name="chevron-down" size={16} color="var(--text-muted)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }} />
    </button>
    {open && <div role="listbox" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 'var(--z-overlay)', background: 'var(--void-3)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-elevated)', padding: 4, maxHeight: 240, overflowY: 'auto' }}>
      {options.map(o => <Option key={o.value} o={o} selected={o.value === value} onPick={() => { onChange && onChange(o.value); setOpen(false); }} />)}
    </div>}
  </div>;
}
function Option({ o, selected, onPick }) {
  const [hover, setHover] = useState(false);
  return <div role="option" aria-selected={selected} onMouseDown={onPick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 'var(--radius-xs)', cursor: 'pointer', color: selected ? 'var(--acid-500)' : 'var(--text-primary)', background: hover ? 'var(--white-6)' : 'transparent', font: 'var(--type-body-sm)' }}>
    {o.icon && <Icon name={o.icon} size={16} />}<span style={{ flex: 1 }}>{o.label}</span>{selected && <Icon name="check" size={14} />}
  </div>;
}
