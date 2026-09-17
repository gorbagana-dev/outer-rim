/* @ds-bundle: {"format":4,"namespace":"GorbaganaDesignSystem_e5ff07","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Tooltip","sourcePath":"components/display/Tooltip.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Button.jsx":"969db1112702","components/core/Icon.jsx":"a1b691419bf8","components/core/IconButton.jsx":"187426573ef5","components/display/Badge.jsx":"84dcb86ec8ff","components/display/Card.jsx":"53b9acb1ef73","components/display/Tag.jsx":"5f75d00e3b70","components/display/Tooltip.jsx":"910f9155d969","components/feedback/Dialog.jsx":"3f5fa879b109","components/feedback/Toast.jsx":"023941ff14a9","components/forms/Checkbox.jsx":"ad2ea173b9b5","components/forms/Input.jsx":"3a9e7c6c5318","components/forms/Radio.jsx":"2a2e73aeb8e5","components/forms/Select.jsx":"3f39c5081d32","components/forms/Switch.jsx":"78b8baa193e7","components/navigation/Tabs.jsx":"071af0d13fc2","ui_kits/gorbagana-web/kit-explorer.jsx":"f21c13e56ba4","ui_kits/gorbagana-web/kit-gallery.jsx":"d87cfe7663d7","ui_kits/gorbagana-web/kit-landing.jsx":"e1bc9a388232","ui_kits/gorbagana-web/kit-nav.jsx":"f2c9af17ab90"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GorbaganaDesignSystem_e5ff07 = window.GorbaganaDesignSystem_e5ff07 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const pascal = n => n.split(/[-_ ]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
/** Lucide icon rendered from the window.lucide UMD (load https://unpkg.com/lucide@0.475.0/dist/umd/lucide.min.js). */
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  glow = false,
  style,
  ...rest
}) {
  const lib = typeof window !== 'undefined' && window.lucide && window.lucide.icons;
  const node = lib ? lib[pascal(name)] : null;
  const svgStyle = {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
    filter: glow ? 'drop-shadow(0 0 4px currentColor)' : undefined,
    ...style
  };
  if (!node) return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeDasharray: "3 3",
    style: svgStyle
  }, rest), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2"
  }));
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: svgStyle,
    "aria-hidden": "true"
  }, rest), node.map(([tag, attrs], i) => React.createElement(tag, {
    key: i,
    ...attrs
  })));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: {
    h: 'var(--control-sm)',
    px: '12px',
    fs: 'var(--text-xs)',
    icon: 14
  },
  md: {
    h: 'var(--control-md)',
    px: '18px',
    fs: 'var(--text-sm)',
    icon: 16
  },
  lg: {
    h: 'var(--control-lg)',
    px: '24px',
    fs: 'var(--text-md)',
    icon: 18
  }
};
function variantStyle(v, hover, active) {
  switch (v) {
    case 'secondary':
      return {
        background: hover ? 'var(--pink-500)' : 'transparent',
        color: hover ? 'var(--text-on-pink)' : 'var(--pink-500)',
        border: '2px solid var(--pink-500)',
        boxShadow: hover ? 'var(--glow-pink)' : 'none'
      };
    case 'ghost':
      return {
        background: hover ? 'var(--white-6)' : 'transparent',
        color: hover ? 'var(--text-primary)' : 'var(--text-secondary)',
        border: '2px solid transparent',
        boxShadow: 'none'
      };
    case 'outline':
      return {
        background: hover ? 'rgba(25,230,255,.1)' : 'transparent',
        color: 'var(--cyan-500)',
        border: '2px solid var(--cyan-500)',
        boxShadow: hover ? 'var(--glow-cyan)' : 'none'
      };
    case 'danger':
      return {
        background: hover ? 'var(--sunset-500)' : 'var(--sunset-600)',
        color: 'var(--white)',
        border: '2px solid transparent',
        boxShadow: hover ? 'var(--glow-pink)' : 'none'
      };
    case 'sticker':
      return {
        background: 'var(--surface-sticker)',
        color: 'var(--text-on-sticker)',
        border: '2px solid var(--ink-900)',
        boxShadow: active ? '1px 1px 0 var(--ink-900)' : 'var(--shadow-sticker)',
        borderRadius: 'var(--radius-xs)',
        fontFamily: 'var(--font-display)',
        letterSpacing: 0,
        textTransform: 'uppercase',
        transform: active ? 'translate(2px,2px) rotate(var(--tilt-2))' : `rotate(${hover ? '0deg' : 'var(--tilt-2)'})`
      };
    default:
      return {
        background: hover ? 'var(--brand-primary-hover)' : active ? 'var(--brand-primary-active)' : 'var(--brand-primary)',
        color: 'var(--text-on-acid)',
        border: '2px solid transparent',
        boxShadow: hover ? 'var(--glow-acid-strong)' : 'var(--glow-acid)'
      };
  }
}
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  fullWidth = false,
  children,
  style,
  onClick,
  type = 'button',
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const base = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: s.h,
    padding: `0 ${s.px}`,
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: s.fs,
    letterSpacing: 'var(--tracking-caps)',
    textTransform: 'uppercase',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all var(--dur-fast) var(--ease-out)',
    transform: active && variant !== 'sticker' ? 'scale(.97)' : undefined,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    outline: 'none'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      ...base,
      ...variantStyle(variant, hover && !disabled, active && !disabled),
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SZ = {
  sm: ['var(--control-sm)', 16],
  md: ['var(--control-md)', 20],
  lg: ['var(--control-lg)', 24]
};
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  active = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [h, i] = SZ[size] || SZ.md;
  const v = {
    ghost: {
      background: hover || active ? 'var(--white-6)' : 'transparent',
      color: active ? 'var(--acid-500)' : hover ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: '2px solid transparent',
      boxShadow: 'none'
    },
    outline: {
      background: hover ? 'rgba(154,77,255,.15)' : 'transparent',
      color: 'var(--text-primary)',
      border: '2px solid var(--border-default)',
      boxShadow: hover ? 'var(--glow-purple)' : 'none'
    },
    primary: {
      background: 'var(--brand-primary)',
      color: 'var(--text-on-acid)',
      border: '2px solid transparent',
      boxShadow: hover ? 'var(--glow-acid-strong)' : 'var(--glow-acid)'
    },
    pink: {
      background: hover ? 'var(--pink-500)' : 'transparent',
      color: hover ? 'var(--white)' : 'var(--pink-500)',
      border: '2px solid var(--pink-500)',
      boxShadow: hover ? 'var(--glow-pink)' : 'none'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: h,
      height: h,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transition: 'all var(--dur-fast) var(--ease-out)',
      outline: 'none',
      ...v,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: i
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const TONES = {
  acid: ['var(--acid-500)', 'var(--status-success-bg)'],
  pink: ['var(--pink-500)', 'rgba(255,45,170,.14)'],
  cyan: ['var(--cyan-500)', 'var(--status-info-bg)'],
  yellow: ['var(--yellow-500)', 'var(--status-warning-bg)'],
  danger: ['var(--sunset-600)', 'var(--status-danger-bg)'],
  purple: ['var(--purple-300)', 'rgba(154,77,255,.16)'],
  neutral: ['var(--text-secondary)', 'var(--white-6)']
};
function Badge({
  tone = 'acid',
  variant = 'soft',
  dot = false,
  pulse = false,
  children,
  style
}) {
  const [fg, bg] = TONES[tone] || TONES.acid;
  const v = variant === 'solid' ? {
    background: fg,
    color: tone === 'pink' || tone === 'danger' || tone === 'purple' ? 'var(--white)' : 'var(--ink-900)',
    border: '1px solid transparent'
  } : variant === 'outline' ? {
    background: 'transparent',
    color: fg,
    border: `1px solid ${fg}`,
    boxShadow: `0 0 8px ${fg.startsWith('var') ? 'transparent' : fg}`
  } : {
    background: bg,
    color: fg,
    border: '1px solid transparent'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 8px',
      borderRadius: 'var(--radius-xs)',
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...v,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: variant === 'solid' ? 'currentColor' : fg,
      boxShadow: `0 0 6px ${fg}`,
      animation: pulse ? 'gor-pulse 1.4s ease-in-out infinite' : undefined
    }
  }), children, pulse && /*#__PURE__*/React.createElement("style", null, '@keyframes gor-pulse{0%,100%{opacity:1}50%{opacity:.35}}'));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
const {
  useState
} = React;
/** Card surfaces: default (void + purple border), neon (glow border, accent color), sticker (paper, hard shadow, tilt), cardboard. */
function Card({
  variant = 'default',
  accent = 'acid',
  padding = 'var(--space-5)',
  tilt = 0,
  interactive = false,
  header,
  footer,
  children,
  style,
  onClick
}) {
  const [hover, setHover] = useState(false);
  const acc = {
    acid: 'var(--acid-500)',
    pink: 'var(--pink-500)',
    cyan: 'var(--cyan-500)',
    yellow: 'var(--yellow-500)',
    purple: 'var(--purple-400)'
  }[accent] || accent;
  const glow = {
    acid: 'var(--glow-acid)',
    pink: 'var(--glow-pink)',
    cyan: 'var(--glow-cyan)',
    yellow: 'var(--glow-yellow)',
    purple: 'var(--glow-purple)'
  }[accent] || 'none';
  const v = {
    default: {
      background: 'var(--surface-1)',
      border: `1px solid ${hover && interactive ? 'var(--border-strong)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)',
      boxShadow: hover && interactive ? 'var(--glow-purple)' : 'none'
    },
    neon: {
      background: 'var(--surface-1)',
      border: `2px solid ${acc}`,
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)',
      boxShadow: hover && interactive ? glow.replace(')', ')') : glow
    },
    sticker: {
      background: 'var(--surface-sticker)',
      border: '2px solid var(--ink-900)',
      borderRadius: 'var(--radius-xs)',
      color: 'var(--text-on-sticker)',
      boxShadow: 'var(--shadow-sticker-lg)',
      transform: `rotate(${hover && interactive ? 0 : tilt}deg)`
    },
    cardboard: {
      background: 'var(--surface-cardboard)',
      border: '2px solid var(--card-700)',
      borderRadius: 'var(--radius-xs)',
      color: 'var(--ink-900)',
      boxShadow: 'var(--shadow-sticker)',
      transform: `rotate(${tilt}deg)`,
      backgroundImage: 'repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 2px,transparent 2px 9px)'
    },
    glass: {
      background: 'rgba(21,10,38,.6)',
      backdropFilter: 'var(--blur-overlay)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)'
    }
  }[variant];
  const paper = variant === 'sticker' || variant === 'cardboard';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      transition: 'all var(--dur-base) var(--ease-out)',
      cursor: onClick ? 'pointer' : undefined,
      overflow: 'hidden',
      ...v,
      ...style
    }
  }, header && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `var(--space-3) ${padding}`,
      borderBottom: `1px ${paper ? 'dashed var(--ink-900)' : 'solid var(--border-subtle)'}`,
      font: paper ? 'var(--type-sticker)' : 'var(--type-label)',
      letterSpacing: paper ? 0 : 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: paper ? 'inherit' : 'var(--text-muted)'
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      padding,
      flex: 1
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `var(--space-3) ${padding}`,
      borderTop: `1px ${paper ? 'dashed var(--ink-900)' : 'solid var(--border-subtle)'}`
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
const {
  useState
} = React;
/** Tag: removable/selectable chip. `sticker` variant is a tilted paper label for lore words. */
function Tag({
  children,
  selected = false,
  onRemove,
  onClick,
  variant = 'chip',
  icon,
  tilt = 0,
  style
}) {
  const [hover, setHover] = useState(false);
  const sticker = variant === 'sticker';
  const base = sticker ? {
    background: 'var(--surface-sticker)',
    color: 'var(--text-on-sticker)',
    border: '1.5px solid var(--ink-900)',
    boxShadow: '2px 2px 0 var(--ink-900)',
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-sm)',
    textTransform: 'uppercase',
    transform: `rotate(${tilt}deg)`,
    borderRadius: 'var(--radius-xs)'
  } : {
    background: selected ? 'rgba(57,255,20,.14)' : hover ? 'var(--white-6)' : 'var(--surface-2)',
    color: selected ? 'var(--acid-500)' : 'var(--text-secondary)',
    border: `1px solid ${selected ? 'var(--acid-500)' : 'var(--border-default)'}`,
    boxShadow: selected ? 'var(--glow-acid)' : 'none',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    borderRadius: 'var(--radius-pill)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 28,
      padding: '0 10px',
      lineHeight: 1,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all var(--dur-fast) var(--ease-out)',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      ...base,
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'inline-flex',
      background: 'none',
      border: 0,
      padding: 0,
      margin: '0 -4px 0 0',
      color: 'inherit',
      cursor: 'pointer',
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/display/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  content,
  side = 'top',
  children,
  tone = 'default'
}) {
  const [open, setOpen] = useState(false);
  const pos = {
    top: {
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    bottom: {
      top: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    left: {
      right: 'calc(100% + 8px)',
      top: '50%',
      transform: 'translateY(-50%)'
    },
    right: {
      left: 'calc(100% + 8px)',
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }[side];
  const skin = tone === 'sticker' ? {
    background: 'var(--surface-sticker)',
    color: 'var(--text-on-sticker)',
    border: '1.5px solid var(--ink-900)',
    boxShadow: '2px 2px 0 var(--ink-900)',
    font: 'var(--type-sticker)',
    fontSize: 'var(--text-sm)'
  } : {
    background: 'var(--void-4)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
    boxShadow: 'var(--glow-purple)',
    font: 'var(--type-body-sm)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      zIndex: 'var(--z-overlay)',
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: open ? 1 : 0,
      transition: 'opacity var(--dur-fast) var(--ease-out)',
      ...skin,
      ...pos
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
const {
  useEffect
} = React;
/** Modal dialog. `inline` renders it in-flow (for cards/specimens) instead of fixed to the viewport. */
function Dialog({
  open = true,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  width = 480,
  variant = 'default',
  inline = false,
  style
}) {
  useEffect(() => {
    if (!open || inline) return;
    const k = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose, inline]);
  if (!open) return null;
  const sticker = variant === 'sticker';
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": !inline,
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      display: 'flex',
      flexDirection: 'column',
      background: sticker ? 'var(--surface-sticker)' : 'var(--void-2)',
      color: sticker ? 'var(--text-on-sticker)' : 'var(--text-primary)',
      border: sticker ? '2px solid var(--ink-900)' : '1px solid var(--border-strong)',
      borderRadius: sticker ? 'var(--radius-xs)' : 'var(--radius-lg)',
      boxShadow: sticker ? 'var(--shadow-sticker-lg)' : 'var(--shadow-elevated), var(--glow-purple)',
      transform: sticker ? 'rotate(var(--tilt-1))' : 'none',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '20px 20px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: sticker ? 'var(--card-700)' : 'var(--pink-500)',
      marginBottom: 6
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--type-h2)',
      textShadow: sticker ? 'none' : 'var(--text-glow-acid)',
      color: sticker ? 'inherit' : 'var(--acid-500)'
    }
  }, title)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    size: "sm",
    onClick: onClose,
    style: sticker ? {
      color: 'var(--ink-900)'
    } : undefined
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      font: 'var(--type-body)',
      color: sticker ? 'inherit' : 'var(--text-secondary)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '0 20px 20px'
    }
  }, footer));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 'var(--z-overlay)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--surface-overlay)',
      backdropFilter: 'var(--blur-overlay)'
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONE = {
  success: ['var(--acid-500)', 'check-circle-2', 'var(--glow-acid)'],
  info: ['var(--cyan-500)', 'info', 'var(--glow-cyan)'],
  warning: ['var(--yellow-500)', 'triangle-alert', 'var(--glow-yellow)'],
  danger: ['var(--sunset-600)', 'skull', 'var(--glow-pink)'],
  gor: ['var(--pink-500)', 'zap', 'var(--glow-pink)']
};
function Toast({
  tone = 'success',
  title,
  description,
  action,
  onDismiss,
  icon,
  style
}) {
  const [c, defIcon, glow] = TONE[tone] || TONE.success;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      width: 360,
      maxWidth: '100%',
      padding: '12px 12px 12px 14px',
      background: 'var(--void-3)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      borderLeft: `3px solid ${c}`,
      boxShadow: `var(--shadow-elevated), ${glow}`,
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || defIcon,
    size: 20,
    color: c,
    glow: true,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      fontWeight: 700
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, description), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, action)), onDismiss && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Dismiss",
    size: "sm",
    onClick: onDismiss
  }));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  indeterminate = false,
  style
}) {
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: 20,
      flexShrink: 0,
      marginTop: 1,
      borderRadius: 'var(--radius-xs)',
      background: on ? 'var(--acid-500)' : 'var(--void-0)',
      border: `2px solid ${on ? 'var(--acid-500)' : 'var(--border-strong)'}`,
      boxShadow: on ? 'var(--glow-acid)' : 'var(--shadow-inset-bin)',
      color: 'var(--ink-900)',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 2.5,
      background: 'var(--ink-900)'
    }
  }) : checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 3.5
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      lineHeight: 1.4
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Input({
  label,
  hint,
  error,
  iconLeft,
  suffix,
  size = 'md',
  mono = false,
  disabled = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  const border = error ? 'var(--status-danger)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: h,
      padding: '0 12px',
      background: 'var(--void-0)',
      border: `2px solid ${border}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focus ? error ? 'var(--glow-pink)' : 'var(--glow-cyan)' : 'var(--shadow-inset-bin)',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: 16,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      background: 'none',
      border: 0,
      outline: 'none',
      color: 'var(--text-primary)',
      font: mono ? 'var(--type-mono)' : 'var(--type-body)',
      fontSize: size === 'sm' ? 'var(--text-sm)' : undefined
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-muted)',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, suffix)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--status-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  options = [],
  value,
  onChange,
  name,
  direction = 'column',
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 20 : 10,
      ...style
    }
  }, options.map(o => {
    const on = o.value === value;
    return /*#__PURE__*/React.createElement("label", {
      key: o.value,
      style: {
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .5 : 1,
        userSelect: 'none'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: name,
      checked: on,
      disabled: disabled,
      onChange: () => onChange && onChange(o.value),
      style: {
        position: 'absolute',
        opacity: 0,
        width: 0,
        height: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        flexShrink: 0,
        marginTop: 1,
        borderRadius: '50%',
        background: 'var(--void-0)',
        border: `2px solid ${on ? 'var(--pink-500)' : 'var(--border-strong)'}`,
        boxShadow: on ? 'var(--glow-pink)' : 'var(--shadow-inset-bin)',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--pink-500)',
        transform: on ? 'scale(1)' : 'scale(0)',
        transition: 'transform var(--dur-fast) var(--ease-snap)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-primary)',
        lineHeight: 1.4
      }
    }, o.label), o.description && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, o.description)));
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState
} = React;
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  size = 'md',
  style
}) {
  const [open, setOpen] = useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  const current = options.find(o => o.value === value);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      position: 'relative',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    onBlur: () => setTimeout(() => setOpen(false), 120),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      height: h,
      padding: '0 12px',
      background: 'var(--void-0)',
      border: `2px solid ${open ? 'var(--border-focus)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: open ? 'var(--glow-cyan)' : 'var(--shadow-inset-bin)',
      color: current ? 'var(--text-primary)' : 'var(--text-muted)',
      font: 'var(--type-body)',
      cursor: 'pointer',
      textAlign: 'left',
      outline: 'none',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, current && current.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: current.icon,
    size: 16
  }), current ? current.label : placeholder), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--text-muted)",
    style: {
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur-fast)'
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    role: "listbox",
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 4,
      zIndex: 'var(--z-overlay)',
      background: 'var(--void-3)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-elevated)',
      padding: 4,
      maxHeight: 240,
      overflowY: 'auto'
    }
  }, options.map(o => /*#__PURE__*/React.createElement(Option, {
    key: o.value,
    o: o,
    selected: o.value === value,
    onPick: () => {
      onChange && onChange(o.value);
      setOpen(false);
    }
  }))));
}
function Option({
  o,
  selected,
  onPick
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    role: "option",
    "aria-selected": selected,
    onMouseDown: onPick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 10px',
      borderRadius: 'var(--radius-xs)',
      cursor: 'pointer',
      color: selected ? 'var(--acid-500)' : 'var(--text-primary)',
      background: hover ? 'var(--white-6)' : 'transparent',
      font: 'var(--type-body-sm)'
    }
  }, o.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: o.icon,
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, o.label), selected && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  style
}) {
  const w = size === 'sm' ? 32 : 44,
    h = size === 'sm' ? 18 : 24,
    k = h - 6;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      width: w,
      height: h,
      flexShrink: 0,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--acid-500)' : 'var(--bin-600)',
      border: `2px solid ${checked ? 'var(--acid-500)' : 'var(--bin-500)'}`,
      boxShadow: checked ? 'var(--glow-acid)' : 'var(--shadow-inset-bin)',
      transition: 'all var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 1,
      left: checked ? w - k - 5 : 1,
      width: k,
      height: k,
      borderRadius: '50%',
      background: checked ? 'var(--ink-900)' : 'var(--text-secondary)',
      transition: 'left var(--dur-base) var(--ease-snap), background var(--dur-base)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const {
  useState
} = React;
function Tabs({
  tabs = [],
  value,
  onChange,
  variant = 'underline',
  size = 'md',
  style
}) {
  const [hoverKey, setHoverKey] = useState(null);
  const pill = variant === 'pill';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: pill ? 4 : 0,
      padding: pill ? 4 : 0,
      background: pill ? 'var(--void-0)' : 'transparent',
      border: pill ? '1px solid var(--border-default)' : 'none',
      borderBottom: pill ? undefined : '1px solid var(--border-subtle)',
      borderRadius: pill ? 'var(--radius-sm)' : 0,
      width: pill ? 'fit-content' : '100%',
      ...style
    }
  }, tabs.map(t => {
    const on = t.value === value,
      hv = hoverKey === t.value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": on,
      type: "button",
      disabled: t.disabled,
      onClick: () => onChange && onChange(t.value),
      onMouseEnter: () => setHoverKey(t.value),
      onMouseLeave: () => setHoverKey(null),
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: size === 'sm' ? 32 : 40,
        padding: pill ? '0 14px' : '0 16px',
        background: pill && on ? 'var(--acid-500)' : pill && hv ? 'var(--white-6)' : 'transparent',
        border: 0,
        borderRadius: pill ? 'var(--radius-xs)' : 0,
        color: pill && on ? 'var(--ink-900)' : on ? 'var(--acid-500)' : hv ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        cursor: t.disabled ? 'not-allowed' : 'pointer',
        opacity: t.disabled ? .4 : 1,
        transition: 'all var(--dur-fast) var(--ease-out)',
        boxShadow: pill && on ? 'var(--glow-acid)' : 'none',
        textShadow: !pill && on ? 'var(--text-glow-acid)' : 'none',
        outline: 'none',
        whiteSpace: 'nowrap'
      }
    }, t.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 16
    }), t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-mono)',
        fontSize: 'var(--text-2xs)',
        padding: '2px 6px',
        borderRadius: 'var(--radius-xs)',
        background: pill && on ? 'rgba(0,0,0,.2)' : 'var(--white-6)',
        color: 'inherit'
      }
    }, t.count), !pill && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        background: 'var(--acid-500)',
        boxShadow: 'var(--glow-acid)',
        transform: on ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform var(--dur-base) var(--ease-out)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/gorbagana-web/kit-explorer.jsx
try { (() => {
const {
  Button,
  IconButton,
  Badge,
  Card,
  Tabs,
  Input,
  Select,
  Tooltip,
  Icon
} = window.GorbaganaDesignSystem_e5ff07;
const TXS = [['5Kd9…mQ2r', 'Transfer', 'gor1…4x9B', 'gor7…Lm3e', '420.00', 'ok'], ['9pZa…c7Wn', 'Bridge in', 'sol…bridge', 'gor2…Qw8t', '1,337.50', 'ok'], ['2bXq…eR5v', 'Mint Gorbagio', 'gor4…Hn1k', 'gorbagio…', '—', 'ok'], ['7mLc…Ty0p', 'Swap', 'gor9…Bv6s', 'dump.exe', '69.42', 'fail'], ['4hRe…Wk3j', 'Stake', 'gor3…Pz2d', 'validator·07', '10,000.00', 'pending'], ['8qNv…Ue9x', 'Transfer', 'gor6…Cf4a', 'gor1…4x9B', '4.44', 'ok']];
function Stat({
  label,
  value,
  sub,
  accent
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: "16px 20px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-mono)',
      fontSize: 26,
      fontWeight: 700,
      color: accent ? `var(--${accent}-500)` : 'var(--text-primary)',
      textShadow: accent ? `var(--text-glow-${accent})` : 'none'
    }
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-sm)',
      fontSize: 12,
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, sub));
}
function Explorer() {
  const [tab, setTab] = React.useState('tx');
  const [net, setNet] = React.useState('main');
  const [q, setQ] = React.useState('');
  const rows = TXS.filter(r => !q || r.join(' ').toLowerCase().includes(q.toLowerCase()));
  const st = {
    ok: ['acid', 'Confirmed'],
    fail: ['danger', 'Dumped'],
    pending: ['yellow', 'Pending']
  };
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 'var(--container-lg)',
      margin: '0 auto',
      padding: '40px 32px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--pink-500)',
      marginBottom: 8
    }
  }, "Landfill explorer"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--type-h1)',
      color: 'var(--acid-500)',
      textShadow: 'var(--text-glow-acid)'
    }
  }, "Every block, every bag.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: net,
    onChange: setNet,
    size: "sm",
    options: [{
      value: 'main',
      label: 'Mainnet',
      icon: 'zap'
    }, {
      value: 'test',
      label: 'Testnet',
      icon: 'flask-conical'
    }],
    style: {
      width: 150
    }
  }), /*#__PURE__*/React.createElement(Input, {
    iconLeft: "search",
    size: "sm",
    placeholder: "Search tx, block, address\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: 320
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Latest slot",
    value: "4,444,201",
    sub: "412ms ago",
    accent: "acid"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "TPS (illustrative)",
    value: "2,187",
    sub: "sample data \u2014 verify live"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "$GOR burned today",
    value: "12,904",
    sub: "\u2248 one dumpster fire",
    accent: "pink"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Validators",
    value: "\u2014",
    sub: "fetch from RPC"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    header: /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      size: "sm",
      style: {
        borderBottom: 0,
        margin: '-12px -20px',
        padding: '0 12px'
      },
      tabs: [{
        value: 'tx',
        label: 'Transactions',
        count: rows.length
      }, {
        value: 'blocks',
        label: 'Blocks'
      }, {
        value: 'programs',
        label: 'Programs'
      }, {
        value: 'validators',
        label: 'Validators',
        icon: 'server'
      }]
    })
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      font: 'var(--type-body-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      textAlign: 'left'
    }
  }, ['Signature', 'Type', 'From', 'To', 'Amount ($GOR)', 'Status', ''].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '12px 20px',
      borderBottom: '1px solid var(--border-subtle)',
      fontWeight: 700
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement(Row, {
    key: r[0],
    r: r,
    st: st[r[5]]
  })))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40,
      textAlign: 'center',
      color: 'var(--text-muted)',
      font: 'var(--type-sticker)'
    }
  }, "Nothing in this bin."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      borderTop: '1px solid var(--border-subtle)',
      font: 'var(--type-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "showing ", rows.length, " of 4,444,201"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    label: "Prev",
    size: "sm",
    variant: "outline"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-right",
    label: "Next",
    size: "sm",
    variant: "outline"
  })))));
}
function Row({
  r,
  st
}) {
  const [h, setH] = React.useState(false);
  const td = {
    padding: '12px 20px',
    borderBottom: '1px solid var(--border-subtle)',
    whiteSpace: 'nowrap'
  };
  return /*#__PURE__*/React.createElement("tr", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: h ? 'var(--white-6)' : 'transparent',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      font: 'var(--type-mono)',
      color: 'var(--cyan-500)'
    }
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    style: td
  }, r[1]), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      font: 'var(--type-mono)',
      color: 'var(--text-secondary)'
    }
  }, r[2]), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      font: 'var(--type-mono)',
      color: 'var(--text-secondary)'
    }
  }, r[3]), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      font: 'var(--type-mono)',
      textAlign: 'right'
    }
  }, r[4]), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: st[0],
    dot: true,
    pulse: r[5] === 'pending'
  }, st[1])), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    content: "Copy signature",
    side: "left"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "copy",
    label: "Copy",
    size: "sm"
  }))));
}
Object.assign(window, {
  Explorer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/gorbagana-web/kit-explorer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/gorbagana-web/kit-gallery.jsx
try { (() => {
const {
  Button,
  IconButton,
  Badge,
  Card,
  Tag,
  Tabs,
  Dialog,
  Toast,
  Checkbox,
  Switch,
  Icon
} = window.GorbaganaDesignSystem_e5ff07;
const GORBS = [[2702, 'Teal bin', 'golden eyes'], [3136, 'Teal bin', 'rainbow eyes'], [1511, 'Blue bin', 'ice pop'], [565, 'Blue bin', 'crown and fist'], [348, 'Black bag', 'hand gesture'], [4051, 'Mattress', 'glasses'], [208, 'Brown block', 'closed eyes'], [1783, 'Capsule', 'star eyes'], [3196, 'Shaggy form', 'extra eyes'], [153, 'Gray rounded', 'cap'], [1268, 'Stacked packaging', 'pizza'], [2989, 'Cereal box', 'Gorbi-O\'s']];
const FAMILIES = ['Teal bin', 'Blue bin', 'Black bag', 'Mattress', 'Brown block', 'Capsule', 'Shaggy form', 'Gray rounded'];
function Gallery() {
  const [fam, setFam] = React.useState([]);
  const [view, setView] = React.useState('grid');
  const [sel, setSel] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [listed, setListed] = React.useState(false);
  const items = GORBS.filter(g => fam.length === 0 || fam.includes(g[1]));
  const toggle = f => setFam(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f]);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 'var(--container-lg)',
      margin: '0 auto',
      padding: '40px 32px 80px',
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      position: 'sticky',
      top: 88,
      alignSelf: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Body family"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, FAMILIES.map(f => /*#__PURE__*/React.createElement(Tag, {
    key: f,
    selected: fam.includes(f),
    onClick: () => toggle(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginTop: 8
    }
  }, "Status"), /*#__PURE__*/React.createElement(Checkbox, {
    checked: listed,
    onChange: setListed,
    label: "Listed only"
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: false,
    label: "Show clover badges",
    disabled: true
  }), /*#__PURE__*/React.createElement(Card, {
    variant: "sticker",
    tilt: -2,
    padding: "14px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-sticker)',
      fontSize: 15
    }
  }, "4,444 citizens. One body per character. Never average them."))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--pink-500)',
      marginBottom: 8
    }
  }, "Collection"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--type-h1)',
      color: 'var(--acid-500)',
      textShadow: 'var(--text-glow-acid)'
    }
  }, "Gorbagios")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, items.length, " shown"), /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    size: "sm",
    value: view,
    onChange: setView,
    tabs: [{
      value: 'grid',
      label: 'Grid',
      icon: 'layout-grid'
    }, {
      value: 'list',
      label: 'List',
      icon: 'list'
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: view === 'grid' ? 'repeat(4,1fr)' : '1fr',
      gap: 16
    }
  }, items.map(g => /*#__PURE__*/React.createElement(GorbCard, {
    key: g[0],
    g: g,
    list: view === 'list',
    onOpen: () => setSel(g)
  })))), sel && /*#__PURE__*/React.createElement(Dialog, {
    open: true,
    onClose: () => setSel(null),
    eyebrow: `Gorbagio · ${sel[1]}`,
    title: `#${sel[0]}`,
    width: 560,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setSel(null)
    }, "Close"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: "zap",
      onClick: () => {
        setSel(null);
        setToast(sel);
      }
    }, "Make offer in $GOR"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `../../assets/gorbagios/gorbagio-${sel[0]}.jpg`,
    alt: "",
    style: {
      width: 200,
      height: 200,
      borderRadius: 'var(--radius-sm)',
      border: '2px solid var(--pink-500)',
      boxShadow: 'var(--glow-pink)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "cyan"
  }, sel[1]), /*#__PURE__*/React.createElement(Badge, {
    tone: "pink",
    variant: "outline"
  }, sel[2])), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-sm)'
    }
  }, "Screenshot-derived reference. Preserve body family, face patch, eye geometry and signature prop when remixing. Ignore the clover badge."), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "owner gor1\u20264x9B")))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 'var(--z-toast)'
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "gor",
    title: `Offer sent on #${toast[0]}`,
    description: "The bin will consider it.",
    onDismiss: () => setToast(null)
  })));
}
function GorbCard({
  g,
  list,
  onOpen
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    interactive: true,
    onClick: onOpen,
    style: {
      flexDirection: list ? 'row' : 'column',
      alignItems: list ? 'center' : 'stretch'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `../../assets/gorbagios/gorbagio-${g[0]}.jpg`,
    alt: `Gorbagio #${g[0]}`,
    style: {
      width: list ? 72 : '100%',
      aspectRatio: '1',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: list ? 'row' : 'column',
      alignItems: list ? 'center' : 'stretch',
      gap: list ? 20 : 6,
      padding: '12px 14px',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      fontWeight: 700
    }
  }, "#", g[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-sm)',
      fontSize: 12,
      color: 'var(--text-secondary)',
      flex: 1
    }
  }, g[1], " \xB7 ", g[2]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: list ? 0 : 4,
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono)',
      fontSize: 12,
      color: 'var(--acid-500)'
    }
  }, "\u2014 $GOR"), /*#__PURE__*/React.createElement(IconButton, {
    icon: "heart",
    label: "Like",
    size: "sm"
  }))));
}
Object.assign(window, {
  Gallery
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/gorbagana-web/kit-gallery.jsx", error: String((e && e.message) || e) }); }

// ui_kits/gorbagana-web/kit-landing.jsx
try { (() => {
const {
  Button,
  Badge,
  Card,
  Tag,
  Icon
} = window.GorbaganaDesignSystem_e5ff07;
function Hero({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--gradient-void)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 60,
      width: 520,
      height: 520,
      marginLeft: -260,
      borderRadius: '50%',
      background: 'var(--gradient-sunset)',
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 60,
      width: 520,
      height: 520,
      marginLeft: -260,
      borderRadius: '50%',
      background: 'var(--gradient-sunset-stripes)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: -200,
      right: -200,
      bottom: 0,
      height: 380,
      backgroundImage: 'var(--bg-grid)',
      backgroundSize: '56px 56px',
      transform: 'perspective(400px) rotateX(58deg)',
      transformOrigin: 'bottom',
      opacity: .8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 'auto 0 0 0',
      height: 200,
      background: 'linear-gradient(180deg,transparent,var(--void-1))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 48,
      alignItems: 'center',
      maxWidth: 'var(--container-lg)',
      margin: '0 auto',
      padding: '88px 32px 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "sticker",
    tilt: -3
  }, "Trash people"), /*#__PURE__*/React.createElement(Tag, {
    variant: "sticker",
    tilt: 2
  }, "Better people")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--type-display)',
      fontSize: 'var(--text-6xl)',
      color: 'var(--acid-500)',
      textShadow: 'var(--text-glow-acid)',
      textTransform: 'uppercase',
      lineHeight: .95
    }
  }, "Gorbagana"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-h3)',
      fontWeight: 500,
      color: 'var(--text-primary)',
      maxWidth: 520
    }
  }, "A high-performance L1 forked from Solana. Gas is ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pink-500)',
      fontFamily: 'var(--font-display)',
      textShadow: 'var(--text-glow-pink)'
    }
  }, "$GOR"), ". Serious infrastructure, garbage civilization."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconRight: "arrow-right",
    onClick: () => onNav('explorer')
  }, "Enter the landfill"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    iconLeft: "recycle"
  }, "Bridge $GOR"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    iconLeft: "book-open"
  }, "Docs")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      font: 'var(--type-mono)',
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "git-fork",
    size: 14,
    color: "var(--cyan-500)"
  }), " forked from Solana"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "fuel",
    size: 14,
    color: "var(--acid-500)"
  }), " gas: $GOR"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "skull",
    size: 14,
    color: "var(--pink-500)"
  }), " 4,444 Gorbagios"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      justifySelf: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/gorbagana-pfp.png",
    alt: "Gorbagio in a bin",
    style: {
      width: 380,
      height: 380,
      display: 'block',
      borderRadius: 'var(--radius-lg)',
      border: '2px solid var(--acid-500)',
      boxShadow: 'var(--glow-acid-strong)',
      transform: 'rotate(2deg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -24,
      bottom: 24
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "sticker",
    tilt: -6,
    style: {
      background: 'var(--sunset-600)',
      color: 'var(--white)'
    }
  }, "Good trash only")))));
}
function Marquee() {
  const s = ['BUILD. DUMP. REPEAT.', 'GAS: $GOR', 'TRASH HAS FINALITY', 'WELCOME TO THE LANDFILL', 'NO ROADMAP. CHECK THE DUMPSTER.', 'MEME TO MOMENTUM'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      borderTop: '1px solid var(--pink-500)',
      borderBottom: '1px solid var(--pink-500)',
      background: 'var(--void-0)',
      padding: '10px 0',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 48,
      animation: 'gor-marquee 28s linear infinite',
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      color: 'var(--pink-500)',
      textShadow: 'var(--text-glow-pink)'
    }
  }, [...s, ...s].map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, t, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--acid-500)',
      margin: '0 8px'
    }
  }, "\u2715")))), /*#__PURE__*/React.createElement("style", null, '@keyframes gor-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}'));
}
function Pillars() {
  const items = [['zap', 'Fast blocks', 'Solana-grade throughput and finality, without the premium lounge.', 'acid'], ['recycle', 'Bridge in', 'Move assets over the scrap-metal border. A Gorbagio checks your papers.', 'cyan'], ['hammer', 'Build anything', 'Same tooling you know. RPCs, programs, the works — smelling faintly of landfill.', 'pink']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-lg)',
      margin: '0 auto',
      padding: '80px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--type-h1)',
      color: 'var(--text-primary)'
    }
  }, "One dev's trash\u2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h2)',
      color: 'var(--acid-500)',
      textShadow: 'var(--text-glow-acid)'
    }
  }, "\u2026is our infrastructure.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 20
    }
  }, items.map(([ic, t, d, a], i) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    variant: i === 0 ? 'neon' : 'default',
    accent: a,
    interactive: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 28,
    color: `var(--${a}-500)`,
    glow: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-secondary)',
      font: 'var(--type-body-sm)'
    }
  }, d), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconRight: "arrow-right",
    style: {
      alignSelf: 'flex-start',
      marginLeft: -12
    }
  }, "Read more"))))));
}
function Notice() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-md)',
      margin: '0 auto',
      padding: '0 32px 96px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "sticker",
    tilt: -2,
    header: "Trash Council \xB7 Public notice",
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "sticker",
      size: "sm"
    }, "Join the council")
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-sticker)',
      fontSize: 22,
      lineHeight: 1.25
    }
  }, "Governance continues over a visibly burning dumpster. Bring your own lid.")), /*#__PURE__*/React.createElement(Card, {
    variant: "cardboard",
    tilt: 2,
    header: "Fuel depot"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-sticker)',
      fontSize: 22
    }
  }, "GAS: $GOR"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-sm)',
      color: 'var(--ink-900)'
    }
  }, "Fill the truck. Every transaction on Gorbagana burns a little $GOR \u2014 the way the sanitation gods intended."), /*#__PURE__*/React.createElement(Badge, {
    tone: "danger",
    variant: "solid"
  }, "Verify live facts before publishing"))));
}
function Landing({
  onNav
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(Marquee, null), /*#__PURE__*/React.createElement(Pillars, null), /*#__PURE__*/React.createElement(Notice, null));
}
Object.assign(window, {
  Landing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/gorbagana-web/kit-landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/gorbagana-web/kit-nav.jsx
try { (() => {
const DS = window.GorbaganaDesignSystem_e5ff07;
const {
  Button,
  IconButton,
  Badge,
  Icon
} = DS;
function Wordmark({
  size = 22
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: size,
      color: 'var(--acid-500)',
      textShadow: 'var(--text-glow-acid)',
      letterSpacing: '.02em',
      lineHeight: 1,
      textTransform: 'uppercase'
    }
  }, "Gorbagana");
}
function TopNav({
  screen,
  onNav,
  connected,
  onConnect
}) {
  const items = [['landing', 'Home'], ['explorer', 'Explorer'], ['gallery', 'Gorbagios'], ['docs', 'Docs']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      height: 64,
      padding: '0 32px',
      background: 'rgba(13,6,25,.75)',
      backdropFilter: 'var(--blur-overlay)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('landing');
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/gorbagana-pfp.png",
    alt: "",
    style: {
      width: 32,
      height: 32,
      borderRadius: 4,
      border: '1px solid var(--acid-500)'
    }
  }), /*#__PURE__*/React.createElement(Wordmark, null)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4,
      flex: 1
    }
  }, items.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: "#",
    onClick: e => {
      e.preventDefault();
      if (k !== 'docs') onNav(k);
    },
    style: {
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--type-label)',
      fontSize: 12,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: screen === k ? 'var(--acid-500)' : 'var(--text-secondary)',
      textShadow: screen === k ? 'var(--text-glow-acid)' : 'none',
      textDecoration: 'none'
    }
  }, l))), /*#__PURE__*/React.createElement(Badge, {
    dot: true,
    pulse: true
  }, "Mainnet"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "search",
    label: "Search"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "sun-moon",
    label: "Theme"
  }), connected ? /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    iconLeft: "wallet"
  }, "gor\u20264x9B") : /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    iconLeft: "wallet",
    onClick: onConnect
  }, "Connect")));
}
function Footer() {
  const cols = [['Network', ['Explorer', 'Validators', 'Bridge', 'Status']], ['Build', ['Docs', 'RPC', 'GitHub', 'Grants']], ['Trash', ['Gorbagios', 'Memes', 'Trash Council', 'Merch']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 32px 32px',
      background: 'var(--void-0)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: 32,
      maxWidth: 'var(--container-lg)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 28
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-muted)',
      font: 'var(--type-body-sm)',
      maxWidth: 300
    }
  }, "Serious tech. Garbage civilization. Built by degens for dreamers."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "twitter",
    label: "X",
    variant: "outline",
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "github",
    label: "GitHub",
    variant: "outline",
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "message-circle",
    label: "Discord",
    variant: "outline",
    size: "sm"
  }))), cols.map(([h, ls]) => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--pink-500)'
    }
  }, h), ls.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: 'var(--text-secondary)',
      font: 'var(--type-body-sm)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      maxWidth: 'var(--container-lg)',
      margin: '40px auto 0',
      paddingTop: 20,
      borderTop: '1px solid var(--border-subtle)',
      font: 'var(--type-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 Gorbagana \xB7 no roadmap, check the dumpster"), /*#__PURE__*/React.createElement("span", null, "THE CHAIN IS TRASH. THAT'S THE POINT.")));
}
Object.assign(window, {
  Wordmark,
  TopNav,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/gorbagana-web/kit-nav.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
