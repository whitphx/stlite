import { ac as _, ad as me, o as R, r as u, u as ye, j as g, W as $e, g as Re, T as Oe, P as _e, f as ne, aE as oe, aF as ie, l as Se } from "./index-COqA-032.js";
import { u as Pe } from "./useBasicWidgetState-Hu_BQk7V.js";
var ae = {
  vertical: "vertical",
  horizontal: "horizontal"
};
function se(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function D(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? se(Object(n), !0).forEach(function(r) {
      O(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : se(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function O(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var I = 0, x = 1, L = 2;
function z(e) {
  return e.$isActive ? L : e.$isHovered ? x : I;
}
function we(e) {
  var t = e.$theme.colors, n = e.$disabled, r = e.$checked, o = e.$isFocusVisible, i = e.$error;
  if (n) return t.tickFillDisabled;
  if (r)
    if (i)
      switch (z(e)) {
        case I:
          return t.tickFillErrorSelected;
        case x:
          return t.tickFillErrorSelectedHover;
        case L:
          return t.tickFillErrorSelectedHoverActive;
      }
    else
      switch (z(e)) {
        case I:
          return t.tickFillSelected;
        case x:
          return t.tickFillSelectedHover;
        case L:
          return t.tickFillSelectedHoverActive;
      }
  else
    return o ? t.borderSelected : i ? t.tickBorderError : t.tickBorder;
  return null;
}
function Me(e) {
  var t = e.$theme.colors;
  if (e.$disabled)
    return t.tickMarkFillDisabled;
  if (e.$checked)
    return t.tickMarkFill;
  if (e.$error)
    switch (z(e)) {
      case I:
        return t.tickFillError;
      case x:
        return t.tickFillErrorHover;
      case L:
        return t.tickFillErrorHoverActive;
    }
  else
    switch (z(e)) {
      case I:
        return t.tickFill;
      case x:
        return t.tickFillHover;
      case L:
        return t.tickFillActive;
    }
}
function ke(e) {
  var t = e.$labelPlacement, n = t === void 0 ? "" : t, r = e.$theme, o;
  switch (n) {
    case "top":
      o = "Bottom";
      break;
    case "bottom":
      o = "Top";
      break;
    case "left":
      o = r.direction === "rtl" ? "Left" : "Right";
      break;
    default:
    case "right":
      o = r.direction === "rtl" ? "Right" : "Left";
      break;
  }
  var i = r.sizing, s = i.scale300;
  return O({}, "padding".concat(o), s);
}
function Fe(e) {
  var t = e.$disabled, n = e.$theme, r = n.colors;
  return t ? r.contentSecondary : r.contentPrimary;
}
var q = _("div", function(e) {
  var t = e.$disabled, n = e.$align;
  return {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: n === "horizontal" ? "row" : "column",
    alignItems: n === "horizontal" ? "center" : "flex-start",
    cursor: t ? "not-allowed" : "pointer",
    "-webkit-tap-highlight-color": "transparent"
  };
});
q.displayName = "RadioGroupRoot";
q.displayName = "RadioGroupRoot";
var X = _("label", function(e) {
  var t, n = e.$disabled, r = e.$hasDescription, o = e.$labelPlacement, i = e.$theme, s = e.$align, a = i.sizing, c = s === "horizontal", p = i.direction === "rtl" ? "Left" : "Right";
  return t = {
    flexDirection: o === "top" || o === "bottom" ? "column" : "row",
    display: "flex",
    alignItems: "center",
    cursor: n ? "not-allowed" : "pointer",
    marginTop: a.scale200
  }, O(t, "margin".concat(p), c ? a.scale200 : null), O(t, "marginBottom", r && !c ? null : a.scale200), t;
});
X.displayName = "Root";
X.displayName = "Root";
var K = _("div", function(e) {
  var t = e.$theme, n = t.animation, r = t.sizing;
  return {
    backgroundColor: Me(e),
    borderTopLeftRadius: "50%",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
    borderBottomLeftRadius: "50%",
    height: e.$checked ? r.scale200 : r.scale550,
    transitionDuration: n.timing200,
    transitionTimingFunction: n.easeOutCurve,
    width: e.$checked ? r.scale200 : r.scale550
  };
});
K.displayName = "RadioMarkInner";
K.displayName = "RadioMarkInner";
var J = _("div", function(e) {
  var t = e.$theme, n = t.animation, r = t.sizing;
  return {
    alignItems: "center",
    backgroundColor: we(e),
    borderTopLeftRadius: "50%",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
    borderBottomLeftRadius: "50%",
    boxShadow: e.$isFocusVisible && e.$checked ? "0 0 0 3px ".concat(e.$theme.colors.accent) : "none",
    display: "flex",
    height: r.scale700,
    justifyContent: "center",
    marginTop: r.scale0,
    marginRight: r.scale0,
    marginBottom: r.scale0,
    marginLeft: r.scale0,
    outline: "none",
    verticalAlign: "middle",
    width: r.scale700,
    flexShrink: 0,
    transitionDuration: n.timing200,
    transitionTimingFunction: n.easeOutCurve
  };
});
J.displayName = "RadioMarkOuter";
J.displayName = "RadioMarkOuter";
var Q = _("div", function(e) {
  var t = e.$theme.typography;
  return D(D({
    verticalAlign: "middle"
  }, ke(e)), {}, {
    color: Fe(e)
  }, t.LabelMedium);
});
Q.displayName = "Label";
Q.displayName = "Label";
var Y = _("input", {
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  clip: "rect(0 0 0 0)",
  position: "absolute"
});
Y.displayName = "Input";
Y.displayName = "Input";
var Z = _("div", function(e) {
  var t, n = e.$theme, r = e.$align, o = r === "horizontal", i = n.direction === "rtl" ? "Right" : "Left", s = n.direction === "rtl" ? "Left" : "Right";
  return D(D({}, n.typography.ParagraphSmall), {}, (t = {
    color: n.colors.contentSecondary,
    cursor: "auto"
  }, O(t, "margin".concat(i), r === "horizontal" ? null : n.sizing.scale900), O(t, "margin".concat(s), o ? n.sizing.scale200 : null), O(t, "maxWidth", "240px"), t));
});
Z.displayName = "Description";
Z.displayName = "Description";
function N(e) {
  "@babel/helpers - typeof";
  return N = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, N(e);
}
function V() {
  return V = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, V.apply(this, arguments);
}
function Ee(e, t) {
  return Te(e) || Le(e, t) || xe(e, t) || Ie();
}
function Ie() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function xe(e, t) {
  if (e) {
    if (typeof e == "string") return le(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return le(e, t);
  }
}
function le(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++)
    r[n] = e[n];
  return r;
}
function Le(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r = [], o = !0, i = !1, s, a;
    try {
      for (n = n.call(e); !(o = (s = n.next()).done) && (r.push(s.value), !(t && r.length === t)); o = !0)
        ;
    } catch (c) {
      i = !0, a = c;
    } finally {
      try {
        !o && n.return != null && n.return();
      } finally {
        if (i) throw a;
      }
    }
    return r;
  }
}
function Te(e) {
  if (Array.isArray(e)) return e;
}
function je(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Ae(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
  }
}
function De(e, t, n) {
  return t && Ae(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function ze(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && U(e, t);
}
function U(e, t) {
  return U = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, o) {
    return r.__proto__ = o, r;
  }, U(e, t);
}
function Be(e) {
  var t = He();
  return function() {
    var r = B(e), o;
    if (t) {
      var i = B(this).constructor;
      o = Reflect.construct(r, arguments, i);
    } else
      o = r.apply(this, arguments);
    return Ce(this, o);
  };
}
function Ce(e, t) {
  if (t && (N(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return j(e);
}
function j(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function He() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function B(e) {
  return B = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, B(e);
}
function A(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var ce = /* @__PURE__ */ (function(e) {
  ze(n, e);
  var t = Be(n);
  function n() {
    var r;
    je(this, n);
    for (var o = arguments.length, i = new Array(o), s = 0; s < o; s++)
      i[s] = arguments[s];
    return r = t.call.apply(t, [this].concat(i)), A(j(r), "state", {
      isFocusVisible: !1,
      focusedRadioIndex: -1
    }), A(j(r), "handleFocus", function(a, c) {
      me(a) && r.setState({
        isFocusVisible: !0
      }), r.setState({
        focusedRadioIndex: c
      }), r.props.onFocus && r.props.onFocus(a);
    }), A(j(r), "handleBlur", function(a, c) {
      r.state.isFocusVisible !== !1 && r.setState({
        isFocusVisible: !1
      }), r.setState({
        focusedRadioIndex: -1
      }), r.props.onBlur && r.props.onBlur(a);
    }), r;
  }
  return De(n, [{
    key: "render",
    value: function() {
      var o = this, i = this.props.overrides, s = i === void 0 ? {} : i, a = R(s.RadioGroupRoot, q), c = Ee(a, 2), p = c[0], b = c[1];
      return /* @__PURE__ */ u.createElement(p, V({
        id: this.props.id,
        role: "radiogroup",
        "aria-describedby": this.props["aria-describedby"],
        "aria-errormessage": this.props["aria-errormessage"],
        "aria-invalid": this.props.error || null,
        "aria-label": this.props["aria-label"],
        "aria-labelledby": this.props["aria-labelledby"],
        $align: this.props.align,
        $disabled: this.props.disabled,
        $error: this.props.error,
        $required: this.props.required
      }, b), u.Children.map(this.props.children, function(f, l) {
        if (!/* @__PURE__ */ u.isValidElement(f))
          return null;
        var d = o.props.value === f.props.value;
        return /* @__PURE__ */ u.cloneElement(f, {
          align: o.props.align,
          autoFocus: o.props.autoFocus,
          checked: d,
          disabled: o.props.disabled || f.props.disabled,
          error: o.props.error,
          isFocused: o.state.focusedRadioIndex === l,
          isFocusVisible: o.state.isFocusVisible,
          tabIndex: l === 0 && !o.props.value || d ? "0" : "-1",
          labelPlacement: o.props.labelPlacement,
          name: o.props.name,
          onBlur: function(v) {
            return o.handleBlur(v, l);
          },
          onFocus: function(v) {
            return o.handleFocus(v, l);
          },
          onChange: o.props.onChange,
          onMouseEnter: o.props.onMouseEnter,
          onMouseLeave: o.props.onMouseLeave
        });
      }));
    }
  }]), n;
})(u.Component);
A(ce, "defaultProps", {
  name: "",
  value: "",
  disabled: !1,
  autoFocus: !1,
  labelPlacement: "right",
  align: "vertical",
  error: !1,
  required: !1,
  onChange: function() {
  },
  onMouseEnter: function() {
  },
  onMouseLeave: function() {
  },
  onFocus: function() {
  },
  onBlur: function() {
  },
  overrides: {}
});
function G(e) {
  "@babel/helpers - typeof";
  return G = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, G(e);
}
function $() {
  return $ = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, $.apply(this, arguments);
}
function M(e, t) {
  return Ge(e) || Ue(e, t) || Ve(e, t) || Ne();
}
function Ne() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ve(e, t) {
  if (e) {
    if (typeof e == "string") return ue(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ue(e, t);
  }
}
function ue(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++)
    r[n] = e[n];
  return r;
}
function Ue(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r = [], o = !0, i = !1, s, a;
    try {
      for (n = n.call(e); !(o = (s = n.next()).done) && (r.push(s.value), !(t && r.length === t)); o = !0)
        ;
    } catch (c) {
      i = !0, a = c;
    } finally {
      try {
        !o && n.return != null && n.return();
      } finally {
        if (i) throw a;
      }
    }
    return r;
  }
}
function Ge(e) {
  if (Array.isArray(e)) return e;
}
function We(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function qe(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
  }
}
function Xe(e, t, n) {
  return t && qe(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Ke(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && W(e, t);
}
function W(e, t) {
  return W = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, o) {
    return r.__proto__ = o, r;
  }, W(e, t);
}
function Je(e) {
  var t = Ye();
  return function() {
    var r = C(e), o;
    if (t) {
      var i = C(this).constructor;
      o = Reflect.construct(r, arguments, i);
    } else
      o = r.apply(this, arguments);
    return Qe(this, o);
  };
}
function Qe(e, t) {
  if (t && (G(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return k(e);
}
function k(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Ye() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function C(e) {
  return C = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, C(e);
}
function F(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ze(e) {
  return e === "top" || e === "left";
}
function et(e) {
  return e === "bottom" || e === "right";
}
var tt = function(t) {
  return t.stopPropagation();
}, pe = /* @__PURE__ */ (function(e) {
  Ke(n, e);
  var t = Je(n);
  function n() {
    var r;
    We(this, n);
    for (var o = arguments.length, i = new Array(o), s = 0; s < o; s++)
      i[s] = arguments[s];
    return r = t.call.apply(t, [this].concat(i)), F(k(r), "state", {
      isActive: !1,
      isHovered: !1
    }), F(k(r), "onMouseEnter", function(a) {
      r.setState({
        isHovered: !0
      }), r.props.onMouseEnter && r.props.onMouseEnter(a);
    }), F(k(r), "onMouseLeave", function(a) {
      r.setState({
        isHovered: !1
      }), r.props.onMouseLeave && r.props.onMouseLeave(a);
    }), F(k(r), "onMouseDown", function(a) {
      r.setState({
        isActive: !0
      }), r.props.onMouseDown && r.props.onMouseDown(a);
    }), F(k(r), "onMouseUp", function(a) {
      r.setState({
        isActive: !1
      }), r.props.onMouseUp && r.props.onMouseUp(a);
    }), r;
  }
  return Xe(n, [{
    key: "componentDidMount",
    value: function() {
      var o;
      this.props.autoFocus && (o = this.props.inputRef) !== null && o !== void 0 && o.current && this.props.inputRef.current.focus();
    }
  }, {
    key: "render",
    value: function() {
      var o = this.props.overrides, i = o === void 0 ? {} : o, s = R(i.Root, X), a = M(s, 2), c = a[0], p = a[1], b = R(i.Label, Q), f = M(b, 2), l = f[0], d = f[1], S = R(i.Input, Y), v = M(S, 2), P = v[0], H = v[1], T = R(i.Description, Z), E = M(T, 2), m = E[0], h = E[1], y = R(i.RadioMarkInner, K), ee = M(y, 2), fe = ee[0], de = ee[1], he = R(i.RadioMarkOuter, J), te = M(he, 2), ge = te[0], be = te[1], w = {
        $align: this.props.align,
        $checked: this.props.checked,
        $disabled: this.props.disabled,
        $hasDescription: !!this.props.description,
        $isActive: this.state.isActive,
        $error: this.props.error,
        $isFocused: this.props.isFocused,
        $isFocusVisible: this.props.isFocused && this.props.isFocusVisible,
        $isHovered: this.state.isHovered,
        $labelPlacement: this.props.labelPlacement,
        $required: this.props.required,
        $value: this.props.value
      }, re = /* @__PURE__ */ u.createElement(l, $({}, w, d), this.props.containsInteractiveElement ? (
        // Prevents the event from bubbling up to the label and moving focus to the radio button
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        /* @__PURE__ */ u.createElement("div", {
          onClick: function(ve) {
            return ve.preventDefault();
          }
        }, this.props.children)
      ) : this.props.children);
      return /* @__PURE__ */ u.createElement(u.Fragment, null, /* @__PURE__ */ u.createElement(c, $({
        "data-baseweb": "radio",
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp
      }, w, p), Ze(this.props.labelPlacement) && re, /* @__PURE__ */ u.createElement(ge, $({}, w, be), /* @__PURE__ */ u.createElement(fe, $({}, w, de))), /* @__PURE__ */ u.createElement(P, $({
        "aria-invalid": this.props.error || null,
        checked: this.props.checked,
        disabled: this.props.disabled,
        name: this.props.name,
        onBlur: this.props.onBlur,
        onFocus: this.props.onFocus,
        onClick: tt,
        onChange: this.props.onChange,
        ref: this.props.inputRef,
        required: this.props.required,
        tabIndex: this.props.tabIndex,
        type: "radio",
        value: this.props.value
      }, w, H)), et(this.props.labelPlacement) && re), !!this.props.description && /* @__PURE__ */ u.createElement(m, $({}, w, h), this.props.description));
    }
  }]), n;
})(u.Component);
F(pe, "defaultProps", {
  overrides: {},
  containsInteractiveElement: !1,
  checked: !1,
  disabled: !1,
  autoFocus: !1,
  inputRef: /* @__PURE__ */ u.createRef(),
  align: "vertical",
  error: !1,
  onChange: function() {
  },
  onMouseEnter: function() {
  },
  onMouseLeave: function() {
  },
  onMouseDown: function() {
  },
  onMouseUp: function() {
  },
  onFocus: function() {
  },
  onBlur: function() {
  }
});
function rt(e) {
  const t = parseFloat(e.sizes.checkbox), n = parseFloat(e.spacing.threeXS), r = oe(t.toString()), o = Math.round(r * 0.375);
  let i = Math.round(oe((t - n).toString()));
  return i >= r && (i -= 1), [ie(o, "px"), ie(i, "px")];
}
function nt({
  disabled: e,
  horizontal: t,
  value: n,
  onChange: r,
  options: o,
  captions: i,
  label: s,
  labelVisibility: a,
  help: c
}) {
  const [p, b] = u.useState(n ?? null);
  u.useEffect(() => {
    n !== p && b(n ?? null);
  }, [n]);
  const f = u.useCallback((m) => {
    const h = parseInt(m.target.value, 10);
    b(h), r(h);
  }, [r]), l = ye(), d = i.length > 0, S = o.length > 0, v = S ? o : ["No options to select."], P = e || !S, H = (m) => m == "" && t && d ? "&nbsp;" : m, [T, E] = rt(l);
  return /* @__PURE__ */ g.jsxs("div", { className: "stRadio", "data-testid": "stRadio", children: [
    /* @__PURE__ */ g.jsx($e, { label: s, disabled: P, labelVisibility: a, children: c && /* @__PURE__ */ g.jsx(Re, { children: /* @__PURE__ */ g.jsx(Oe, { content: c, placement: _e.TOP_RIGHT }) }) }),
    /* @__PURE__ */ g.jsx(ce, { onChange: f, value: p !== null ? p.toString() : void 0, disabled: P, align: t ? ae.horizontal : ae.vertical, "aria-label": s, "data-testid": "stRadioGroup", overrides: {
      RadioGroupRoot: {
        style: {
          gap: d ? l.spacing.sm : l.spacing.none,
          minHeight: l.sizes.minElementHeight
        }
      }
    }, children: v.map((m, h) => /* @__PURE__ */ g.jsxs(
      pe,
      {
        value: h.toString(),
        overrides: {
          Root: {
            style: ({
              $isFocusVisible: y
            }) => ({
              marginBottom: l.spacing.none,
              marginTop: l.spacing.none,
              marginRight: d ? l.spacing.sm : l.spacing.lg,
              // Make left and right padding look the same visually.
              paddingLeft: l.spacing.none,
              alignItems: "start",
              paddingRight: l.spacing.threeXS,
              backgroundColor: y ? l.colors.darkenedBgMix25 : ""
            })
          },
          RadioMarkOuter: {
            style: ({
              $checked: y
            }) => ({
              width: l.sizes.checkbox,
              height: l.sizes.checkbox,
              // The margin top is needed to align the radio buttons
              // with the text label baseline.
              // The text label has a line-height of 1.6
              // making the font height around 1.6rem
              // while the radio icon has a height of 1rem.
              //eslint-disable-next-line streamlit-custom/no-hardcoded-theme-values
              marginTop: "0.35rem",
              marginRight: l.spacing.none,
              marginLeft: l.spacing.none,
              backgroundColor: y && !P ? l.colors.primary : l.colors.fadedText40
            })
          },
          RadioMarkInner: {
            style: ({
              $checked: y
            }) => ({
              height: y ? T : E,
              width: y ? T : E
            })
          },
          Label: {
            style: {
              color: P ? l.colors.fadedText40 : l.colors.bodyText,
              position: "relative",
              top: l.spacing.px
            }
          }
        },
        children: [
          /* @__PURE__ */ g.jsx(ne, { source: m, allowHTML: !1, isLabel: !0, largerLabel: !0 }),
          d && /* @__PURE__ */ g.jsx(ne, { source: H(i[h]), allowHTML: !1, isCaption: !0, isLabel: !0 })
        ]
      },
      h
    )) })
  ] });
}
const ot = u.memo(nt);
function it({
  disabled: e,
  element: t,
  widgetMgr: n,
  fragmentId: r
}) {
  const [o, i] = Pe({
    getStateFromWidgetMgr: at,
    getDefaultStateFromProto: st,
    getCurrStateFromProto: lt,
    updateWidgetMgrState: ut,
    element: t,
    widgetMgr: n,
    fragmentId: r
  }), s = u.useCallback((d) => {
    i({
      value: d,
      fromUi: !0
    });
  }, [i]), {
    horizontal: a,
    options: c,
    captions: p,
    label: b,
    labelVisibility: f,
    help: l
  } = t;
  return /* @__PURE__ */ g.jsx(ot, { label: b, onChange: s, options: c, captions: p, disabled: e, horizontal: a, labelVisibility: Se(f?.value), value: o ?? null, help: l });
}
function at(e, t) {
  return e.getIntValue(t);
}
function st(e) {
  return e.default ?? null;
}
function lt(e) {
  return e.value ?? null;
}
function ut(e, t, n, r) {
  t.setIntValue(e, n.value ?? null, {
    fromUi: n.fromUi
  }, r);
}
const dt = u.memo(it);
export {
  dt as default
};
//# sourceMappingURL=index-HlO5farq.js.map
