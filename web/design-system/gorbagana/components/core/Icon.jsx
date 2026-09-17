import React from 'react';
const pascal = (n) => n.split(/[-_ ]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
/** Lucide icon rendered from the window.lucide UMD (load https://unpkg.com/lucide@0.475.0/dist/umd/lucide.min.js). */
export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2, glow = false, style, ...rest }) {
  const lib = typeof window !== 'undefined' && window.lucide && window.lucide.icons;
  const node = lib ? lib[pascal(name)] : null;
  const svgStyle = { display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', filter: glow ? 'drop-shadow(0 0 4px currentColor)' : undefined, ...style };
  if (!node) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray="3 3" style={svgStyle} {...rest}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={svgStyle} aria-hidden="true" {...rest}>{node.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}</svg>;
}
