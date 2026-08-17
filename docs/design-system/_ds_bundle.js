/* @ds-bundle: {"format":4,"namespace":"VibeCodersDesignSystem_6b2297","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"MultiSelect","sourcePath":"components/forms/MultiSelect.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Header","sourcePath":"components/layout/Header.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"1dd956a5a240","components/display/Card.jsx":"777f65ba74a9","components/display/Tag.jsx":"2313ebb86ce9","components/forms/Input.jsx":"b35c65e414c6","components/forms/MultiSelect.jsx":"bfe4fe771d0c","components/forms/Select.jsx":"d805cdecd355","components/layout/Header.jsx":"c3eab21fa5cb","ui_kits/website/Landing.jsx":"17d3147a75dc","ui_kits/website/Recap.jsx":"75158e88c326","ui_kits/website/data.js":"940b59c8daa5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VibeCodersDesignSystem_6b2297 = window.VibeCodersDesignSystem_6b2297 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function Button({
  variant = "primary",
  size = "md",
  flavor,
  disabled,
  children,
  onClick,
  type = "button",
  style
}) {
  const pal = {
    primary: {
      bg: "var(--red)",
      fg: "var(--white)"
    },
    secondary: {
      bg: "var(--white)",
      fg: "var(--ink)"
    },
    inverse: {
      bg: "var(--ink)",
      fg: "var(--paper)"
    },
    flavor: {
      bg: flavor || "var(--lime)",
      fg: "var(--ink)"
    }
  }[variant] || {
    bg: "var(--red)",
    fg: "var(--white)"
  };
  const sz = {
    sm: {
      padding: "6px 12px",
      fontSize: "var(--text-xs)"
    },
    md: {
      padding: "10px 20px",
      fontSize: "var(--text-sm)"
    },
    lg: {
      padding: "14px 28px",
      fontSize: "var(--text-base)"
    }
  }[size];
  const [state, setState] = React.useState("idle");
  const lift = state === "hover" ? {
    transform: "translate(-2px,-2px)",
    boxShadow: "var(--shadow-pixel-lg)"
  } : state === "press" ? {
    transform: "translate(2px,2px)",
    boxShadow: "none"
  } : {
    boxShadow: "var(--shadow-pixel)"
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setState("hover"),
    onMouseLeave: () => setState("idle"),
    onMouseDown: () => setState("press"),
    onMouseUp: () => setState("hover"),
    style: {
      fontFamily: "var(--font-pixel)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      background: pal.bg,
      color: pal.fg,
      border: "var(--border-w) solid var(--ink)",
      borderRadius: 0,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "transform var(--dur-fast) var(--ease-snap),box-shadow var(--dur-fast) var(--ease-snap)",
      ...sz,
      ...(disabled ? {
        boxShadow: "var(--shadow-pixel-sm)"
      } : lift),
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  flavor = "var(--paper-2)",
  onRemove,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      fontWeight: 500,
      padding: "3px 8px",
      background: flavor,
      color: "var(--ink)",
      border: "2px solid var(--ink)",
      borderRadius: "var(--radius-px)",
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      all: "unset",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 700,
      lineHeight: 1
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  image,
  imageAlt = "",
  eyebrow,
  title,
  meta,
  children,
  tags,
  footer,
  flavor,
  hoverable,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--surface-card)",
      border: "var(--border-w) solid var(--ink)",
      boxShadow: hoverable && hover ? "var(--shadow-pixel-lg)" : "var(--shadow-pixel)",
      transform: hoverable && hover ? "translate(-2px,-2px)" : "none",
      transition: "transform var(--dur-fast) var(--ease-snap),box-shadow var(--dur-fast) var(--ease-snap)",
      display: "flex",
      flexDirection: "column",
      ...style
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      display: "block",
      width: "100%",
      aspectRatio: "1",
      objectFit: "cover",
      borderBottom: "var(--border-w) solid var(--ink)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      color: flavor ? "var(--ink)" : "var(--red)",
      background: flavor || "transparent",
      alignSelf: "flex-start",
      padding: flavor ? "1px 6px" : 0
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-heading)",
      fontWeight: 700,
      fontSize: "var(--text-xl)",
      lineHeight: "var(--leading-tight)"
    }
  }, title), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      color: "var(--text-faint)"
    }
  }, meta), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      lineHeight: "var(--leading-body)"
    }
  }, children), tags && tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-1)",
      marginTop: "auto",
      paddingTop: "var(--space-2)"
    }
  }, tags.map(t => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: typeof t === "string" ? t : t.label,
    flavor: typeof t === "string" ? undefined : t.flavor
  }, typeof t === "string" ? t : t.label))), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2)"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  hint,
  error,
  prefix,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontFamily: "var(--font-mono)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-pixel)",
      fontWeight: 700,
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: "var(--space-2)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      background: disabled ? "var(--surface-sunken)" : "var(--white)",
      border: `var(--border-w) solid ${error ? "var(--error)" : "var(--ink)"}`,
      boxShadow: focus ? `inset 3px 3px 0 ${error ? "var(--red-tint)" : "var(--paper-3)"}` : "none"
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "0 0 0 12px",
      color: "var(--text-faint)",
      fontSize: "var(--text-sm)"
    }
  }, prefix), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-sm)",
      padding: "10px 12px",
      border: "none",
      outline: "none",
      background: "transparent",
      color: "var(--text-body)"
    }
  })), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: "var(--space-1)",
      fontSize: "var(--text-xs)",
      color: error ? "var(--error)" : "var(--text-faint)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/MultiSelect.jsx
try { (() => {
function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Pick some…",
  disabled,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o);
  const toggle = v => {
    if (!onChange) return;
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      fontFamily: "var(--font-mono)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-pixel)",
      fontWeight: 700,
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: "var(--space-2)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    onClick: () => !disabled && setOpen(o => !o),
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-1)",
      alignItems: "center",
      minHeight: 41,
      padding: "5px 12px 5px 6px",
      background: disabled ? "var(--surface-sunken)" : "var(--white)",
      border: "var(--border-w) solid var(--ink)",
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: open ? "var(--shadow-pixel-sm)" : "none",
      position: "relative"
    }
  }, value.length === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-faint)",
      fontSize: "var(--text-sm)",
      paddingLeft: 6
    }
  }, placeholder), value.map(v => {
    const i = items.find(x => x.value === v);
    return /*#__PURE__*/React.createElement(__ds_scope.Tag, {
      key: v,
      onRemove: e => {
        e.stopPropagation();
        toggle(v);
      }
    }, i ? i.label : v);
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 10
    }
  }, open ? "▴" : "▾")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      zIndex: 20,
      top: "calc(100% + 4px)",
      left: 0,
      right: 0,
      background: "var(--white)",
      border: "var(--border-w) solid var(--ink)",
      boxShadow: "var(--shadow-pixel)",
      maxHeight: 220,
      overflowY: "auto"
    }
  }, items.map(i => {
    const on = value.includes(i.value);
    return /*#__PURE__*/React.createElement("div", {
      key: i.value,
      onClick: () => toggle(i.value),
      onMouseEnter: e => {
        e.currentTarget.style.background = "var(--red-tint)";
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = "var(--white)";
      },
      style: {
        padding: "9px 12px",
        fontSize: "var(--text-sm)",
        cursor: "pointer",
        display: "flex",
        gap: "var(--space-2)",
        alignItems: "center",
        background: "var(--white)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        flex: "0 0 16px",
        border: "2px solid var(--ink)",
        background: on ? "var(--red)" : "var(--white)",
        color: "var(--white)",
        fontSize: 11,
        lineHeight: "12px",
        textAlign: "center",
        fontWeight: 700
      }
    }, on ? "✕" : ""), /*#__PURE__*/React.createElement("span", null, i.label));
  })));
}
Object.assign(__ds_scope, { MultiSelect });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/MultiSelect.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select…",
  disabled,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o);
  const sel = items.find(i => i.value === value);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      fontFamily: "var(--font-mono)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-pixel)",
      fontWeight: 700,
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: "var(--space-2)"
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    style: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "var(--space-2)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-sm)",
      padding: "10px 12px",
      textAlign: "left",
      background: disabled ? "var(--surface-sunken)" : "var(--white)",
      color: sel ? "var(--text-body)" : "var(--text-faint)",
      border: "var(--border-w) solid var(--ink)",
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: open ? "var(--shadow-pixel-sm)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", null, sel ? sel.label : placeholder), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, open ? "▴" : "▾")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      zIndex: 20,
      top: "calc(100% + 4px)",
      left: 0,
      right: 0,
      background: "var(--white)",
      border: "var(--border-w) solid var(--ink)",
      boxShadow: "var(--shadow-pixel)",
      maxHeight: 220,
      overflowY: "auto"
    }
  }, items.map(i => /*#__PURE__*/React.createElement("div", {
    key: i.value,
    onClick: () => {
      onChange && onChange(i.value);
      setOpen(false);
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "var(--red-tint)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = i.value === value ? "var(--paper-2)" : "var(--white)";
    },
    style: {
      padding: "9px 12px",
      fontSize: "var(--text-sm)",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      background: i.value === value ? "var(--paper-2)" : "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("span", null, i.label), i.value === value && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--red)"
    }
  }, "\u25AE")))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/layout/Header.jsx
try { (() => {
function Header({
  logoSrc,
  links = [],
  activeHref,
  cta,
  onCtaClick,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: "var(--paper)",
      borderBottom: "var(--border-w-heavy) solid var(--ink)",
      fontFamily: "var(--font-mono)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "0 var(--space-5)",
      height: 64,
      display: "flex",
      alignItems: "center",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      textDecoration: "none",
      color: "var(--ink)",
      background: "none"
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Vibe Coders Tokyo",
    style: {
      height: 44,
      imageRendering: "pixelated"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-pixel)",
      fontWeight: 700,
      fontSize: "var(--text-base)"
    }
  }, "VIBE CODERS ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--red)"
    }
  }, "TOKYO"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      marginLeft: "auto",
      alignItems: "center"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.href,
    href: l.href,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-sm)",
      fontWeight: l.href === activeHref ? 700 : 400,
      textDecoration: "none",
      color: "var(--ink)",
      padding: "4px 8px",
      background: l.href === activeHref ? "var(--red-tint)" : "none",
      borderBottom: l.href === activeHref ? "2px solid var(--red)" : "2px solid transparent"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "var(--red-tint)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = l.href === activeHref ? "var(--red-tint)" : "none";
    }
  }, l.label)), cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onCtaClick
  }, cta))));
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Landing.jsx
try { (() => {
const {
  Header,
  Button,
  Card,
  Tag,
  Input,
  Select,
  MultiSelect
} = window.VibeCodersDesignSystem_6b2297;
function Blink() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--red)",
      animation: "px-blink 1s steps(1) infinite"
    }
  }, "\u25AE");
}
function SectionTitle({
  children
}) {
  return /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-heading)",
      fontSize: "var(--text-3xl)",
      margin: "0 0 var(--space-5)",
      textTransform: "uppercase"
    }
  }, children);
}
function NewsletterBand() {
  const [email, setEmail] = React.useState("");
  const [city, setCity] = React.useState("");
  const [topics, setTopics] = React.useState([]);
  const [done, setDone] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--ink)",
      borderTop: "3px solid var(--ink)",
      borderBottom: "3px solid var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "var(--space-7) var(--space-5)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-7)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-heading)",
      color: "var(--paper)",
      fontSize: "var(--text-3xl)",
      margin: 0,
      textTransform: "uppercase"
    }
  }, "Get the ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--lime)"
    }
  }, "newsletter")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--paper-3)",
      fontSize: "var(--text-sm)",
      maxWidth: 420
    }
  }, "Once a month: the next meetup, recaps, and whatever the community shipped. No spam, unsubscribe whenever.")), done ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      border: "2px solid var(--lime)",
      boxShadow: "4px 4px 0 var(--lime)",
      padding: "var(--space-5)",
      fontFamily: "var(--font-pixel)",
      fontWeight: 700,
      textTransform: "uppercase"
    }
  }, "You're in! See you at the next one", /*#__PURE__*/React.createElement(Blink, null)) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (email) setDone(true);
    },
    style: {
      background: "var(--paper)",
      border: "2px solid var(--ink)",
      boxShadow: "4px 4px 0 var(--lime)",
      padding: "var(--space-5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "City",
    placeholder: "Pick one",
    value: city,
    onChange: setCity,
    options: [{
      value: "tokyo",
      label: "Tokyo"
    }, {
      value: "singapore",
      label: "Singapore"
    }, {
      value: "else",
      label: "Somewhere else"
    }]
  }), /*#__PURE__*/React.createElement(MultiSelect, {
    label: "Topics",
    placeholder: "Any",
    value: topics,
    onChange: setTopics,
    options: [{
      value: "ai",
      label: "AI tools"
    }, {
      value: "design",
      label: "Design"
    }, {
      value: "models",
      label: "Local models"
    }, {
      value: "agents",
      label: "Agents"
    }]
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "flavor",
    flavor: "var(--lime)"
  }, "Sign me up"))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--paper)",
      borderTop: "3px solid var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "var(--space-5)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "var(--text-xs)",
      color: "var(--text-faint)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-pixel)",
      fontWeight: 700,
      color: "var(--ink)"
    }
  }, "VIBE CODERS ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--red)"
    }
  }, "TOKYO")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-pixel-jp)"
    }
  }, "\u6771\u4EAC \xB7 \u30B7\u30F3\u30AC\u30DD\u30FC\u30EB"), /*#__PURE__*/React.createElement("span", null, "Cozy vibes. No pitching.")));
}
function Landing({
  onOpenRecap
}) {
  const events = window.VBT_EVENTS;
  const next = events[2]; // Design for Vibe Coding as "featured next" demo
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: "radial-gradient(circle at 68% 35%, #efb0a0 0%, #f2cfc2 32%, var(--paper) 68%)",
      borderBottom: "3px solid var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "var(--space-8) var(--space-5)",
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: "var(--space-7)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      marginBottom: "var(--space-3)"
    }
  }, "Tokyo \xB7 Singapore \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-pixel-jp)"
    }
  }, "\u3088\u3046\u3053\u305D")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-pixel)",
      fontSize: "var(--text-4xl)",
      margin: 0,
      textTransform: "uppercase",
      lineHeight: 1.05
    }
  }, "Vibe", /*#__PURE__*/React.createElement("br", null), "C", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--red)"
    }
  }, "o"), "ders", /*#__PURE__*/React.createElement("br", null), "Tokyo", /*#__PURE__*/React.createElement(Blink, null)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-base)",
      maxWidth: 440,
      margin: "var(--space-5) 0"
    }
  }, "A cozy meetup for people who build things with AI \u2014 novices and enthusiasts, fun project shareouts, zero startup pitching."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg"
  }, "RSVP next meetup"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: onOpenRecap
  }, "Past events"))), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.avif",
    alt: "Vibe Coders Tokyo logo",
    style: {
      width: "78%",
      justifySelf: "center",
      imageRendering: "pixelated",
      border: "2px solid var(--ink)",
      boxShadow: "6px 6px 0 var(--ink)",
      background: "#fdfcfa"
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "var(--space-7) var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Next meetup"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "340px 1fr",
      gap: "var(--space-6)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    image: next.img,
    imageAlt: next.title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      background: "var(--gold)",
      border: "2px solid var(--ink)",
      padding: "2px 10px",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)"
    }
  }, "Doors open 6:30"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-heading)",
      fontSize: "var(--text-3xl)",
      margin: "var(--space-3) 0",
      textTransform: "uppercase"
    }
  }, next.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-sm)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-wide)",
      marginBottom: "var(--space-3)"
    }
  }, next.meta), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 520,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, next.blurb, " Bring a laptop and a work-in-progress if you have one \u2014 five-minute shareouts are open to everyone."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      margin: "var(--space-4) 0"
    }
  }, next.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t,
    flavor: next.flavor
  }, t))), /*#__PURE__*/React.createElement(Button, null, "RSVP \u2014 it's free")))), /*#__PURE__*/React.createElement(NewsletterBand, null), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      padding: "var(--space-7) var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Past events"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "var(--space-5)"
    }
  }, events.slice(0, 6).map(ev => /*#__PURE__*/React.createElement("div", {
    key: ev.id,
    onClick: onOpenRecap,
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    image: ev.img,
    imageAlt: ev.title,
    title: ev.title,
    meta: ev.meta,
    tags: ev.tags.map(t => ({
      label: t,
      flavor: ev.flavor
    })),
    hoverable: true
  }, ev.blurb))))), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  Landing,
  NewsletterBand,
  Footer,
  Blink,
  SectionTitle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Recap.jsx
try { (() => {
const {
  Button,
  Card,
  Tag
} = window.VibeCodersDesignSystem_6b2297;
function Recap({
  onBack
}) {
  const ev = window.VBT_EVENTS[4]; // Antigravity Workshop
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-text)",
      margin: "0 auto",
      padding: "var(--space-7) var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onBack();
    },
    style: {
      fontSize: "var(--text-sm)"
    }
  }, "\u2190 All events"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      background: ev.flavor,
      border: "2px solid var(--ink)",
      padding: "2px 10px",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      margin: "var(--space-5) 0 var(--space-3)",
      display: "block",
      width: "fit-content"
    }
  }, "Recap"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-heading)",
      fontSize: "var(--text-3xl)",
      margin: "0 0 var(--space-2)",
      textTransform: "uppercase"
    }
  }, ev.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-sm)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-muted)",
      marginBottom: "var(--space-5)"
    }
  }, ev.meta, " \xB7 42 CODERS SHOWED UP"), /*#__PURE__*/React.createElement("img", {
    src: ev.img,
    alt: ev.title,
    style: {
      width: "100%",
      border: "2px solid var(--ink)",
      boxShadow: "var(--shadow-pixel)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      margin: "var(--space-5) 0"
    }
  }, ev.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t,
    flavor: ev.flavor
  }, t))), /*#__PURE__*/React.createElement("p", null, ev.blurb, " We split into small groups, broke things, fixed some of them, and ate an irresponsible amount of pizza."), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-heading)",
      fontSize: "var(--text-xl)",
      textTransform: "uppercase",
      margin: "var(--space-6) 0 var(--space-3)"
    }
  }, "What got shared"), /*#__PURE__*/React.createElement("ul", {
    style: {
      fontSize: "var(--text-sm)",
      lineHeight: "var(--leading-body)",
      paddingLeft: "1.2em",
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("li", null, "A pixel-art sprite generator built in one prompt session"), /*#__PURE__*/React.createElement("li", null, "Voice-controlled kitchen timer (it mostly listened)"), /*#__PURE__*/React.createElement("li", null, "Three different takes on agent memory \u2014 all cozy, all cursed")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-sunken)",
      border: "2px solid var(--ink)",
      padding: "var(--space-4)",
      margin: "var(--space-6) 0",
      fontSize: "var(--text-sm)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-pixel)",
      fontWeight: 700,
      textTransform: "uppercase",
      fontSize: "var(--text-xs)"
    }
  }, "Photos & slides \u2192 "), "shared in the newsletter. Not on it yet? Scroll down."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onBack
  }, "\u2190 Back to all events")), /*#__PURE__*/React.createElement(NewsletterBand, null), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  Recap
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Recap.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
const DS = window.VibeCodersDesignSystem_6b2297;
window.VBT_EVENTS = [{
  id: 9,
  img: "../../assets/events/vbt-9.avif",
  title: "models models models",
  meta: "JUL 2026 · TOKYO",
  flavor: "var(--navy)",
  tags: ["Local models", "Shareouts"],
  blurb: "A whole night of model talk — local, hosted, and everything between."
}, {
  id: 8,
  img: "../../assets/events/vbt-8.avif",
  title: "Local Models with Gemma 4",
  meta: "GOOGLE SHIBUYA",
  flavor: "var(--blue)",
  tags: ["Local models", "Workshop"],
  blurb: "Hands-on with Gemma 4 on your own machine, hosted by Google."
}, {
  id: 7,
  img: "../../assets/events/vbt-7.avif",
  title: "Design for Vibe Coding",
  meta: "WED, JUN 3 · 7-9PM · LE WAGON MEGURO",
  flavor: "var(--gold)",
  tags: ["Design"],
  blurb: "How designers vibe code — taste, prompts, and shipping pretty things."
}, {
  id: 6,
  img: "../../assets/events/vbt-6.avif",
  title: "Vibe Code with AI Studio",
  meta: "TOKYO",
  flavor: "var(--blue)",
  tags: ["AI tools"],
  blurb: "Building end-to-end with AI Studio, live on stage."
}, {
  id: 4,
  img: "../../assets/events/vbt-4.avif",
  title: "Antigravity Workshop",
  meta: "WED, FEB 25 · GOOGLE SHIBUYA",
  flavor: "var(--purple)",
  tags: ["Workshop", "Free pizza"],
  blurb: "Antigravity coding workshop with free pizza, swag, and Google Cloud credits."
}, {
  id: 3,
  img: "../../assets/events/vbt-3.avif",
  title: "Tokyo Vibe Coders #3",
  meta: "WED, JAN 28 · 7-9PM · MEGURO",
  flavor: "var(--peach)",
  tags: ["Shareouts", "AI tools"],
  blurb: "Our first 2026 meetup — fun project shareouts and AI tools discussions!"
}, {
  id: 2,
  img: "../../assets/events/vbt-2.avif",
  title: "Tokyo Vibe Coders #2",
  meta: "WED, DEC 17 · 6-8PM · GOOGLE SHIBUYA",
  flavor: "var(--red-tint)",
  tags: ["Showcase"],
  blurb: "An in-person vibe coding showcase and discussion on efficient workflows."
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.MultiSelect = __ds_scope.MultiSelect;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Header = __ds_scope.Header;

})();
