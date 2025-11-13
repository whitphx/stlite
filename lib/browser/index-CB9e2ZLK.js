import { ac as q, o as J, r as s, au as Q, u as Y, av as ee, aw as l, j as g, ax as te, W as re, l as ne, g as oe, T as ie, P as ae, ay as ue, c as le, B as P, d as U, D as se } from "./index-COqA-032.js";
import { u as ce } from "./useBasicWidgetState-Hu_BQk7V.js";
var fe = {
  secondary: "secondary"
}, N = {
  default: "default"
}, pe = {
  default: "default"
}, j = Object.freeze({
  radio: "radio",
  checkbox: "checkbox"
}), x = q("div", function(e) {
  var t = e.$shape, r = e.$length, n = e.$theme, o = r === 1 ? void 0 : t !== N.default ? "-".concat(n.sizing.scale100) : "-0.5px";
  return {
    display: "flex",
    marginLeft: o,
    marginRight: o
  };
});
x.displayName = "StyledRoot";
x.displayName = "StyledRoot";
function M(e) {
  "@babel/helpers - typeof";
  return M = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, M(e);
}
function G() {
  return G = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, G.apply(this, arguments);
}
function X(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function de(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? X(Object(r), !0).forEach(function(n) {
      z(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : X(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ye(e, t) {
  return Se(e) || be(e, t) || me(e, t) || he();
}
function he() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function me(e, t) {
  if (e) {
    if (typeof e == "string") return K(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return K(e, t);
  }
}
function K(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++)
    n[r] = e[r];
  return n;
}
function be(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n = [], o = !0, i = !1, a, d;
    try {
      for (r = r.call(e); !(o = (a = r.next()).done) && (n.push(a.value), !(t && n.length === t)); o = !0)
        ;
    } catch (c) {
      i = !0, d = c;
    } finally {
      try {
        !o && r.return != null && r.return();
      } finally {
        if (i) throw d;
      }
    }
    return n;
  }
}
function Se(e) {
  if (Array.isArray(e)) return e;
}
function ge(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function ve(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function Oe(e, t, r) {
  return t && ve(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Ee(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && $(e, t);
}
function $(e, t) {
  return $ = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, $(e, t);
}
function _e(e) {
  var t = Le();
  return function() {
    var n = k(e), o;
    if (t) {
      var i = k(this).constructor;
      o = Reflect.construct(n, arguments, i);
    } else
      o = n.apply(this, arguments);
    return we(this, o);
  };
}
function we(e, t) {
  if (t && (M(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return F(e);
}
function F(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Le() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function k(e) {
  return k = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, k(e);
}
function z(e, t, r) {
  return t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Re(e, t) {
  return !Array.isArray(e) && typeof e != "number" ? !1 : Array.isArray(e) ? e.includes(t) : e === t;
}
var H = /* @__PURE__ */ (function(e) {
  Ee(r, e);
  var t = _e(r);
  function r() {
    var n;
    ge(this, r);
    for (var o = arguments.length, i = new Array(o), a = 0; a < o; a++)
      i[a] = arguments[a];
    return n = t.call.apply(t, [this].concat(i)), z(F(n), "childRefs", {}), n;
  }
  return Oe(r, [{
    key: "render",
    value: function() {
      var o = this, i = this.props, a = i.overrides, d = a === void 0 ? {} : a, c = i.mode, y = c === void 0 ? j.checkbox : c, v = i.children, h = i.selected, _ = i.disabled, f = i.onClick, m = i.kind, O = i.shape, b = i.size, B = J(d.Root, x), w = ye(B, 2), T = w[0], R = w[1], L = this.props["aria-label"] || this.props.ariaLabel, p = y === j.radio, V = s.Children.count(v);
      return /* @__PURE__ */ s.createElement(Q.Consumer, null, function(Z) {
        return /* @__PURE__ */ s.createElement(T, G({
          "aria-label": L || Z.buttongroup.ariaLabel,
          "data-baseweb": "button-group",
          role: p ? "radiogroup" : "group",
          $shape: O,
          $length: v.length
        }, R), s.Children.map(v, function(S, C) {
          if (!/* @__PURE__ */ s.isValidElement(S))
            return null;
          var I = S.props.isSelected ? S.props.isSelected : Re(h, C);
          return p && (o.childRefs[C] = /* @__PURE__ */ s.createRef()), /* @__PURE__ */ s.cloneElement(S, {
            disabled: _ || S.props.disabled,
            isSelected: I,
            ref: p ? o.childRefs[C] : void 0,
            tabIndex: !p || I || p && (!h || h === -1) && C === 0 ? 0 : -1,
            onKeyDown: function(u) {
              if (p) {
                var E = Number(h) ? Number(h) : 0;
                if (u.key === "ArrowUp" || u.key === "ArrowLeft") {
                  u.preventDefault && u.preventDefault();
                  var A = E - 1 < 0 ? V - 1 : E - 1;
                  f && f(u, A), o.childRefs[A].current && o.childRefs[A].current.focus();
                }
                if (u.key === "ArrowDown" || u.key === "ArrowRight") {
                  u.preventDefault && u.preventDefault();
                  var D = E + 1 > V - 1 ? 0 : E + 1;
                  f && f(u, D), o.childRefs[D].current && o.childRefs[D].current.focus();
                }
              }
            },
            kind: m,
            onClick: function(u) {
              _ || (S.props.onClick && S.props.onClick(u), f && f(u, C));
            },
            shape: O,
            size: b,
            overrides: de({
              BaseButton: {
                style: function(u) {
                  var E = u.$theme;
                  return v.length === 1 ? {} : O !== N.default ? {
                    marginLeft: E.sizing.scale100,
                    marginRight: E.sizing.scale100
                  } : {
                    marginLeft: "0.5px",
                    marginRight: "0.5px"
                  };
                },
                props: {
                  "aria-checked": I,
                  role: p ? "radio" : "checkbox"
                }
              }
            }, S.props.overrides)
          });
        }));
      });
    }
  }]), r;
})(s.Component);
z(H, "defaultProps", {
  disabled: !1,
  onClick: function() {
  },
  shape: N.default,
  size: pe.default,
  kind: fe.secondary
});
function Ce(e, t) {
  return t.includes(e) ? t.filter((r) => r !== e) : [...t, e];
}
function Pe(e, t, r) {
  return e == l.ClickMode.MULTI_SELECT ? Ce(t, r ?? []) : r?.includes(t) ? [] : [t];
}
function je(e) {
  return e.length === 0 ? -1 : e[0];
}
function ke(e, t, r, n) {
  t.setIntArrayValue(e, r.value, {
    fromUi: r.fromUi
  }, n);
}
function Be(e, t, r) {
  const n = r === l.Style.PILLS ? P.PILLS : r === l.Style.BORDERLESS ? P.BORDERLESS_ICON : P.SEGMENTED_CONTROL, o = r === l.Style.BORDERLESS ? U.XSMALL : U.MEDIUM, i = n === P.PILLS || n === P.SEGMENTED_CONTROL, a = r === l.Style.BORDERLESS ? "lg" : "base";
  return {
    element: /* @__PURE__ */ g.jsx(se, { icon: t, label: e, iconSize: a, useSmallerFont: i }),
    kind: n,
    size: o
  };
}
function Te(e, t, r, n) {
  return r.indexOf(n) > -1 ? !0 : t !== l.ClickMode.SINGLE_SELECT || e !== l.SelectionVisualization.ALL_UP_TO_SELECTED ? !1 : r.length > 0 && n < r[0];
}
function Ie(e, t) {
  return e && (t = `${t}Active`), t;
}
function Ae(e, t, r) {
  const n = {
    flexWrap: "wrap",
    maxWidth: "100%",
    // This ensures that the button
    // group does not overflow the container due
    // to the negative margins that BaseWeb adds.
    // When maxWidth is set to 100%, without this,
    // the buttons will wrap to the next line.
    margin: "0 0"
  }, o = r ? "100%" : "auto", i = r ? {} : {
    content: "''",
    flex: 1e4
  };
  switch (e) {
    case l.Style.BORDERLESS:
      return {
        ...n,
        columnGap: t.threeXS,
        rowGap: t.threeXS
      };
    case l.Style.PILLS:
      return {
        ...n,
        columnGap: t.twoXS,
        rowGap: t.twoXS,
        width: o
      };
    case l.Style.SEGMENTED_CONTROL:
      return {
        ...n,
        columnGap: t.none,
        rowGap: t.twoXS,
        // Adding an empty pseudo-element after the last button in the group.
        // This will make buttons only as big as needed without stretching to the whole container width (aka let them 'hug' to the side)
        // This is only needed if the button group has content width.
        "::after": i,
        width: o
      };
    default:
      return n;
  }
}
function De(e, t, r, n, o, i, a) {
  const d = Te(r, n, o, t);
  let c = e.content, y = e.contentIcon;
  return d && (c = e.selectedContent ? e.selectedContent : c, y = e.selectedContentIcon ? e.selectedContentIcon : y), s.forwardRef(function(h, _) {
    const {
      element: f,
      kind: m,
      size: O
    } = Be(c ?? "", y ?? void 0, i), b = Ie(!!(d && !e.selectedContent && !e.selectedContentIcon), m);
    return /* @__PURE__ */ g.jsx(le, { ...h, size: O, kind: b, containerWidth: a, children: f });
  });
}
function Me(e, t) {
  return e.getIntArrayValue(t);
}
function Ge(e) {
  return e.default ?? null;
}
function $e(e) {
  return e.value ?? null;
}
function Ne(e) {
  const {
    disabled: t,
    element: r,
    fragmentId: n,
    widgetMgr: o,
    widthConfig: i
  } = e, {
    clickMode: a,
    options: d,
    selectionVisualization: c,
    style: y,
    label: v,
    labelVisibility: h,
    help: _
  } = r, f = Y(), [m, O] = ce({
    getStateFromWidgetMgr: Me,
    getDefaultStateFromProto: Ge,
    getCurrStateFromProto: $e,
    updateWidgetMgrState: ke,
    element: r,
    widgetMgr: o,
    fragmentId: n
  }), b = ee(i), B = (R, L) => {
    const p = Pe(a, L, m);
    O({
      value: p,
      fromUi: !0
    });
  };
  let w;
  a === l.ClickMode.SINGLE_SELECT ? w = j.radio : a === l.ClickMode.MULTI_SELECT && (w = j.checkbox);
  const T = s.useMemo(() => d.map((R, L) => {
    const p = De(R, L, c, a, m, y, b);
    return /* @__PURE__ */ g.jsx(p, {}, `${R.content}-${L}`);
  }), [a, d, c, y, m, b]);
  return /* @__PURE__ */ g.jsxs(te, { className: "stButtonGroup", "data-testid": "stButtonGroup", containerWidth: b, children: [
    /* @__PURE__ */ g.jsx(re, { label: v, disabled: t, labelVisibility: ne(h?.value ?? ue.LabelVisibilityOptions.COLLAPSED), children: _ && /* @__PURE__ */ g.jsx(oe, { children: /* @__PURE__ */ g.jsx(ie, { content: _, placement: ae.TOP }) }) }),
    /* @__PURE__ */ g.jsx(H, { disabled: t, mode: w, onClick: B, selected: a === l.ClickMode.MULTI_SELECT ? m : je(m), overrides: {
      Root: {
        style: s.useCallback(() => Ae(y, f.spacing, b), [y, f.spacing, b])
      }
    }, children: T })
  ] });
}
const Ve = s.memo(Ne);
export {
  Ve as default
};
//# sourceMappingURL=index-CB9e2ZLK.js.map
