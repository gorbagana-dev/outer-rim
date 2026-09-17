import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
const TONE = { success: ['var(--acid-500)', 'check-circle-2', 'var(--glow-acid)'], info: ['var(--cyan-500)', 'info', 'var(--glow-cyan)'], warning: ['var(--yellow-500)', 'triangle-alert', 'var(--glow-yellow)'], danger: ['var(--sunset-600)', 'skull', 'var(--glow-pink)'], gor: ['var(--pink-500)', 'zap', 'var(--glow-pink)'] };
export function Toast({ tone = 'success', title, description, action, onDismiss, icon, style }) {
  const [c, defIcon, glow] = TONE[tone] || TONE.success;
  return <div role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: 360, maxWidth: '100%', padding: '12px 12px 12px 14px', background: 'var(--void-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', borderLeft: `3px solid ${c}`, boxShadow: `var(--shadow-elevated), ${glow}`, color: 'var(--text-primary)', ...style }}>
    <Icon name={icon || defIcon} size={20} color={c} glow style={{ marginTop: 1 }} />
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {title && <div style={{ font: 'var(--type-body)', fontWeight: 700 }}>{title}</div>}
      {description && <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{description}</div>}
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
    {onDismiss && <IconButton icon="x" label="Dismiss" size="sm" onClick={onDismiss} />}
  </div>;
}
