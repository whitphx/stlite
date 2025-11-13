import { br as ce, bx as pe, by as fe, bz as ge, bA as ye, bB as me, ao as ve, ac as be, aG as he, bC as Se, ap as Oe, bD as Ce, b1 as K, bE as Ie, s as ae, bF as Pe, bG as $e, r as H, M as _e, k as J, u as Te, j, W as Ee, l as Re, Q as we, T as De, P as xe, Y as Ae } from "./index-COqA-032.js";
import { u as We } from "./useBasicWidgetState-Hu_BQk7V.js";
import { T as Be } from "./timepicker-BW7SE972.js";
var Me = ce.Consumer;
const Ne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ThemeConsumer: Me,
  ThemeProvider: pe,
  createThemedStyled: fe,
  createThemedUseStyletron: ge,
  createThemedWithStyle: ye,
  expandBorderStyles: me,
  hexToRgb: ve,
  styled: be,
  useStyletron: he,
  withStyle: Se,
  withWrapper: Oe
}, Symbol.toStringTag, { value: "Module" }));
var C = {};
const Y = /* @__PURE__ */ Ce(Ne);
var w = {}, Q;
function Le() {
  if (Q) return w;
  Q = 1, Object.defineProperty(w, "__esModule", {
    value: !0
  }), w.STATE_CHANGE_TYPE = w.SIZE = w.ENHANCER_POSITION = w.CUSTOM_INPUT_TYPE = w.ADJOINED = void 0;
  var f = {
    change: "change"
  };
  w.STATE_CHANGE_TYPE = f;
  var c = {
    textarea: "textarea"
  };
  w.CUSTOM_INPUT_TYPE = c;
  var h = {
    none: "none",
    left: "left",
    right: "right",
    both: "both"
  };
  w.ADJOINED = h;
  var m = {
    mini: "mini",
    default: "default",
    compact: "compact",
    large: "large"
  };
  w.SIZE = m;
  var b = {
    start: "start",
    end: "end"
  };
  return w.ENHANCER_POSITION = b, w;
}
var Z = {}, A = {}, k = {}, X;
function Fe() {
  if (X) return k;
  X = 1, Object.defineProperty(k, "__esModule", {
    value: !0
  }), k.default = c;
  function f(m) {
    "@babel/helpers - typeof";
    return f = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(b) {
      return typeof b;
    } : function(b) {
      return b && typeof Symbol == "function" && b.constructor === Symbol && b !== Symbol.prototype ? "symbol" : typeof b;
    }, f(m);
  }
  function c(m) {
    m = m || {};
    for (var b = arguments.length <= 1 ? 0 : arguments.length - 1, v, y, S = 0; S < b; S++) {
      v = (S + 1 < 1 || arguments.length <= S + 1 ? void 0 : arguments[S + 1]) || {};
      for (var g in v)
        f(v[g]) !== void 0 && (y = v[g], h(y) ? m[g] = c(
          /* eslint-disable-next-line no-mixed-operators */
          m[g] || Array.isArray(y) && [] || {},
          y
        ) : m[g] = y);
    }
    return m;
  }
  function h(m) {
    return Array.isArray(m) || {}.toString.call(m) == "[object Object]";
  }
  return k;
}
var ee;
function le() {
  if (ee) return A;
  ee = 1, Object.defineProperty(A, "__esModule", {
    value: !0
  }), A.getOverride = E, A.getOverrideProps = _, A.getOverrides = L, A.mergeConfigurationOverrides = N, A.mergeOverride = x, A.mergeOverrides = M, A.toObjectOverride = D, A.useOverrides = F;
  var f = v(K()), c = Ie(), h = m(/* @__PURE__ */ Fe());
  function m(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function b(i) {
    if (typeof WeakMap != "function") return null;
    var t = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap();
    return (b = function(r) {
      return r ? u : t;
    })(i);
  }
  function v(i, t) {
    if (i && i.__esModule)
      return i;
    if (i === null || P(i) !== "object" && typeof i != "function")
      return { default: i };
    var u = b(t);
    if (u && u.has(i))
      return u.get(i);
    var s = {}, r = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var a in i)
      if (a !== "default" && Object.prototype.hasOwnProperty.call(i, a)) {
        var l = r ? Object.getOwnPropertyDescriptor(i, a) : null;
        l && (l.get || l.set) ? Object.defineProperty(s, a, l) : s[a] = i[a];
      }
    return s.default = i, u && u.set(i, s), s;
  }
  function y() {
    return y = Object.assign ? Object.assign.bind() : function(i) {
      for (var t = 1; t < arguments.length; t++) {
        var u = arguments[t];
        for (var s in u)
          Object.prototype.hasOwnProperty.call(u, s) && (i[s] = u[s]);
      }
      return i;
    }, y.apply(this, arguments);
  }
  function S(i, t) {
    var u = Object.keys(i);
    if (Object.getOwnPropertySymbols) {
      var s = Object.getOwnPropertySymbols(i);
      t && (s = s.filter(function(r) {
        return Object.getOwnPropertyDescriptor(i, r).enumerable;
      })), u.push.apply(u, s);
    }
    return u;
  }
  function g(i) {
    for (var t = 1; t < arguments.length; t++) {
      var u = arguments[t] != null ? arguments[t] : {};
      t % 2 ? S(Object(u), !0).forEach(function(s) {
        $(i, s, u[s]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(u)) : S(Object(u)).forEach(function(s) {
        Object.defineProperty(i, s, Object.getOwnPropertyDescriptor(u, s));
      });
    }
    return i;
  }
  function $(i, t, u) {
    return t in i ? Object.defineProperty(i, t, { value: u, enumerable: !0, configurable: !0, writable: !0 }) : i[t] = u, i;
  }
  function P(i) {
    "@babel/helpers - typeof";
    return P = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    }, P(i);
  }
  function E(i) {
    return (0, c.isValidElementType)(i) ? i : i && P(i) === "object" ? i.component : i;
  }
  function _(i) {
    return i && P(i) === "object" ? P(i.props) === "object" ? g(g({}, i.props), {}, {
      $style: i.style
    }) : {
      $style: i.style
    } : {};
  }
  function D(i) {
    return (0, c.isValidElementType)(i) ? {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component: i
    } : i || {};
  }
  function L(i, t) {
    var u = E(i) || t;
    if (i && P(i) === "object" && typeof i.props == "function") {
      var s = /* @__PURE__ */ f.forwardRef(function(a, l) {
        var n = i.props(a), e = _(g(g({}, i), {}, {
          props: n
        }));
        return /* @__PURE__ */ f.createElement(u, y({
          ref: l
        }, e));
      });
      return s.displayName = u.displayName, [s, {}];
    }
    var r = _(i);
    return [u, r];
  }
  function M() {
    var i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = Object.assign({}, i, t), s = Object.keys(u);
    return s.reduce(function(r, a) {
      return r[a] = x(D(i[a]), D(t[a])), r;
    }, {});
  }
  function x(i, t) {
    var u = g(g({}, i), t);
    return i.props && t.props && (u.props = N(i.props, t.props)), i.style && t.style && (u.style = N(i.style, t.style)), u;
  }
  function N(i, t) {
    return P(i) === "object" && P(t) === "object" ? (0, h.default)({}, i, t) : function() {
      return (0, h.default)({}, typeof i == "function" ? i.apply(void 0, arguments) : i, typeof t == "function" ? t.apply(void 0, arguments) : t);
    };
  }
  function F(i) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return f.useMemo(function() {
      return Object.keys(i).reduce(function(u, s) {
        return u[s] = L(t[s], i[s]), u;
      }, {});
    }, [t]);
  }
  return A;
}
var q = {}, z = {}, te;
function je() {
  if (te) return z;
  te = 1, Object.defineProperty(z, "__esModule", {
    value: !0
  }), z.Svg = void 0, z.getSvgStyles = c;
  var f = Y;
  function c(m) {
    var b = m.$theme, v = m.$size, y = m.$color, S = b.sizing.scale600;
    v && (b.sizing[v] ? S = b.sizing[v] : typeof v == "number" ? S = "".concat(v, "px") : S = v);
    var g = "currentColor";
    return y && (b.colors[y] ? g = b.colors[y] : g = y), {
      display: "inline-block",
      fill: g,
      color: g,
      height: S,
      width: S
    };
  }
  var h = (0, f.styled)("svg", c);
  return z.Svg = h, h.displayName = "Svg", h.displayName = "Svg", z;
}
var V = {}, re;
function ze() {
  if (re) return V;
  re = 1, Object.defineProperty(V, "__esModule", {
    value: !0
  }), V.default = f;
  function f(c) {
    var h = {};
    for (var m in c)
      m[0] !== "$" && (h[m] = c[m]);
    return h;
  }
  return V;
}
var ne;
function Ze() {
  if (ne) return q;
  ne = 1;
  function f(r) {
    "@babel/helpers - typeof";
    return f = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
      return typeof a;
    } : function(a) {
      return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
    }, f(r);
  }
  Object.defineProperty(q, "__esModule", {
    value: !0
  }), q.default = void 0;
  var c = g(K()), h = /* @__PURE__ */ le(), m = /* @__PURE__ */ je(), b = y(/* @__PURE__ */ ze()), v = ["children", "title", "size", "color", "overrides"];
  function y(r) {
    return r && r.__esModule ? r : { default: r };
  }
  function S(r) {
    if (typeof WeakMap != "function") return null;
    var a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap();
    return (S = function(e) {
      return e ? l : a;
    })(r);
  }
  function g(r, a) {
    if (r && r.__esModule)
      return r;
    if (r === null || f(r) !== "object" && typeof r != "function")
      return { default: r };
    var l = S(a);
    if (l && l.has(r))
      return l.get(r);
    var n = {}, e = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var o in r)
      if (o !== "default" && Object.prototype.hasOwnProperty.call(r, o)) {
        var p = e ? Object.getOwnPropertyDescriptor(r, o) : null;
        p && (p.get || p.set) ? Object.defineProperty(n, o, p) : n[o] = r[o];
      }
    return n.default = r, l && l.set(r, n), n;
  }
  function $() {
    return $ = Object.assign ? Object.assign.bind() : function(r) {
      for (var a = 1; a < arguments.length; a++) {
        var l = arguments[a];
        for (var n in l)
          Object.prototype.hasOwnProperty.call(l, n) && (r[n] = l[n]);
      }
      return r;
    }, $.apply(this, arguments);
  }
  function P(r, a) {
    var l = Object.keys(r);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(r);
      a && (n = n.filter(function(e) {
        return Object.getOwnPropertyDescriptor(r, e).enumerable;
      })), l.push.apply(l, n);
    }
    return l;
  }
  function E(r) {
    for (var a = 1; a < arguments.length; a++) {
      var l = arguments[a] != null ? arguments[a] : {};
      a % 2 ? P(Object(l), !0).forEach(function(n) {
        _(r, n, l[n]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(l)) : P(Object(l)).forEach(function(n) {
        Object.defineProperty(r, n, Object.getOwnPropertyDescriptor(l, n));
      });
    }
    return r;
  }
  function _(r, a, l) {
    return a in r ? Object.defineProperty(r, a, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : r[a] = l, r;
  }
  function D(r, a) {
    return F(r) || N(r, a) || M(r, a) || L();
  }
  function L() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function M(r, a) {
    if (r) {
      if (typeof r == "string") return x(r, a);
      var l = Object.prototype.toString.call(r).slice(8, -1);
      if (l === "Object" && r.constructor && (l = r.constructor.name), l === "Map" || l === "Set") return Array.from(r);
      if (l === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(l)) return x(r, a);
    }
  }
  function x(r, a) {
    (a == null || a > r.length) && (a = r.length);
    for (var l = 0, n = new Array(a); l < a; l++)
      n[l] = r[l];
    return n;
  }
  function N(r, a) {
    var l = r == null ? null : typeof Symbol < "u" && r[Symbol.iterator] || r["@@iterator"];
    if (l != null) {
      var n = [], e = !0, o = !1, p, d;
      try {
        for (l = l.call(r); !(e = (p = l.next()).done) && (n.push(p.value), !(a && n.length === a)); e = !0)
          ;
      } catch (O) {
        o = !0, d = O;
      } finally {
        try {
          !e && l.return != null && l.return();
        } finally {
          if (o) throw d;
        }
      }
      return n;
    }
  }
  function F(r) {
    if (Array.isArray(r)) return r;
  }
  function i(r, a) {
    if (r == null) return {};
    var l = t(r, a), n, e;
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(r);
      for (e = 0; e < o.length; e++)
        n = o[e], !(a.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(r, n) && (l[n] = r[n]);
    }
    return l;
  }
  function t(r, a) {
    if (r == null) return {};
    var l = {}, n = Object.keys(r), e, o;
    for (o = 0; o < n.length; o++)
      e = n[o], !(a.indexOf(e) >= 0) && (l[e] = r[e]);
    return l;
  }
  var u = function(a, l) {
    var n = a.children, e = a.title, o = a.size, p = a.color, d = a.overrides, O = d === void 0 ? {} : d, I = i(a, v), R = (0, h.getOverrides)(O.Svg, m.Svg), W = D(R, 2), T = W[0], B = W[1], U = T.__STYLETRON__ ? E(E({
      title: e,
      $color: p,
      $size: o
    }, I), B) : E(E({
      title: e,
      color: p,
      size: o
    }, (0, b.default)(I)), (0, b.default)(B));
    return /* @__PURE__ */ c.createElement(T, $({
      "data-baseweb": "icon",
      ref: l
    }, U), e ? /* @__PURE__ */ c.createElement("title", null, e) : null, n);
  }, s = /* @__PURE__ */ c.forwardRef(u);
  return q.default = s, q;
}
var oe;
function qe() {
  if (oe) return Z;
  oe = 1;
  function f(t) {
    "@babel/helpers - typeof";
    return f = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(u) {
      return typeof u;
    } : function(u) {
      return u && typeof Symbol == "function" && u.constructor === Symbol && u !== Symbol.prototype ? "symbol" : typeof u;
    }, f(t);
  }
  Object.defineProperty(Z, "__esModule", {
    value: !0
  }), Z.default = void 0;
  var c = g(K()), h = Y, m = /* @__PURE__ */ le(), b = y(/* @__PURE__ */ Ze()), v = ["title", "size", "color", "overrides"];
  function y(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function S(t) {
    if (typeof WeakMap != "function") return null;
    var u = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap();
    return (S = function(a) {
      return a ? s : u;
    })(t);
  }
  function g(t, u) {
    if (t && t.__esModule)
      return t;
    if (t === null || f(t) !== "object" && typeof t != "function")
      return { default: t };
    var s = S(u);
    if (s && s.has(t))
      return s.get(t);
    var r = {}, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var l in t)
      if (l !== "default" && Object.prototype.hasOwnProperty.call(t, l)) {
        var n = a ? Object.getOwnPropertyDescriptor(t, l) : null;
        n && (n.get || n.set) ? Object.defineProperty(r, l, n) : r[l] = t[l];
      }
    return r.default = t, s && s.set(t, r), r;
  }
  function $() {
    return $ = Object.assign ? Object.assign.bind() : function(t) {
      for (var u = 1; u < arguments.length; u++) {
        var s = arguments[u];
        for (var r in s)
          Object.prototype.hasOwnProperty.call(s, r) && (t[r] = s[r]);
      }
      return t;
    }, $.apply(this, arguments);
  }
  function P(t, u) {
    if (t == null) return {};
    var s = E(t, u), r, a;
    if (Object.getOwnPropertySymbols) {
      var l = Object.getOwnPropertySymbols(t);
      for (a = 0; a < l.length; a++)
        r = l[a], !(u.indexOf(r) >= 0) && Object.prototype.propertyIsEnumerable.call(t, r) && (s[r] = t[r]);
    }
    return s;
  }
  function E(t, u) {
    if (t == null) return {};
    var s = {}, r = Object.keys(t), a, l;
    for (l = 0; l < r.length; l++)
      a = r[l], !(u.indexOf(a) >= 0) && (s[a] = t[a]);
    return s;
  }
  function _(t, u) {
    return N(t) || x(t, u) || L(t, u) || D();
  }
  function D() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function L(t, u) {
    if (t) {
      if (typeof t == "string") return M(t, u);
      var s = Object.prototype.toString.call(t).slice(8, -1);
      if (s === "Object" && t.constructor && (s = t.constructor.name), s === "Map" || s === "Set") return Array.from(t);
      if (s === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)) return M(t, u);
    }
  }
  function M(t, u) {
    (u == null || u > t.length) && (u = t.length);
    for (var s = 0, r = new Array(u); s < u; s++)
      r[s] = t[s];
    return r;
  }
  function x(t, u) {
    var s = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
    if (s != null) {
      var r = [], a = !0, l = !1, n, e;
      try {
        for (s = s.call(t); !(a = (n = s.next()).done) && (r.push(n.value), !(u && r.length === u)); a = !0)
          ;
      } catch (o) {
        l = !0, e = o;
      } finally {
        try {
          !a && s.return != null && s.return();
        } finally {
          if (l) throw e;
        }
      }
      return r;
    }
  }
  function N(t) {
    if (Array.isArray(t)) return t;
  }
  function F(t, u) {
    var s = (0, h.useStyletron)(), r = _(s, 2), a = r[1], l = t.title, n = l === void 0 ? "Delete Alt" : l, e = t.size, o = t.color, p = t.overrides, d = p === void 0 ? {} : p, O = P(t, v), I = (0, m.mergeOverride)(
      // Icons from the theme target the SVG override in the underlying Icon component
      {
        component: a.icons && a.icons.DeleteAlt ? a.icons.DeleteAlt : null
      },
      d && d.Svg ? (0, m.toObjectOverride)(d.Svg) : {}
    );
    return /* @__PURE__ */ c.createElement(b.default, $({
      viewBox: "0 0 24 24",
      ref: u,
      title: n,
      size: e,
      color: o,
      overrides: {
        Svg: I
      }
    }, O), /* @__PURE__ */ c.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12 20C16.4183 20 20 16.4183 20 12C20 7.58173 16.4183 4 12 4C7.58173 4 4 7.58173 4 12C4 16.4183 7.58173 20 12 20ZM10.0303 8.96967C9.73743 8.67679 9.26257 8.67679 8.96967 8.96967C8.67676 9.26257 8.67676 9.73743 8.96967 10.0303L10.9393 12L8.96967 13.9697C8.67676 14.2626 8.67676 14.7374 8.96967 15.0303C9.26257 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9697 15.0303C14.2626 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2626 15.0303 13.9697L13.0607 12L15.0303 10.0303C15.3232 9.73743 15.3232 9.26257 15.0303 8.96967C14.7374 8.67679 14.2626 8.67679 13.9697 8.96967L12 10.9393L10.0303 8.96967Z"
    }));
  }
  var i = /* @__PURE__ */ c.forwardRef(F);
  return Z.default = i, Z;
}
var ie;
function ke() {
  if (ie) return C;
  ie = 1, Object.defineProperty(C, "__esModule", {
    value: !0
  }), C.getRootStyles = C.getInputStyles = C.getInputContainerStyles = C.StyledMaskToggleButton = C.StyledClearIconContainer = C.StyledClearIcon = C.Root = C.InputEnhancer = C.InputContainer = C.Input = void 0;
  var f = Y, c = /* @__PURE__ */ Le(), h = m(/* @__PURE__ */ qe());
  function m(n) {
    return n && n.__esModule ? n : { default: n };
  }
  function b(n, e) {
    var o = Object.keys(n);
    if (Object.getOwnPropertySymbols) {
      var p = Object.getOwnPropertySymbols(n);
      e && (p = p.filter(function(d) {
        return Object.getOwnPropertyDescriptor(n, d).enumerable;
      })), o.push.apply(o, p);
    }
    return o;
  }
  function v(n) {
    for (var e = 1; e < arguments.length; e++) {
      var o = arguments[e] != null ? arguments[e] : {};
      e % 2 ? b(Object(o), !0).forEach(function(p) {
        y(n, p, o[p]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(o)) : b(Object(o)).forEach(function(p) {
        Object.defineProperty(n, p, Object.getOwnPropertyDescriptor(o, p));
      });
    }
    return n;
  }
  function y(n, e, o) {
    return e in n ? Object.defineProperty(n, e, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : n[e] = o, n;
  }
  var S = (0, f.styled)("button", function(n) {
    var e, o = n.$theme, p = n.$size, d = n.$isFocusVisible, O = (e = {}, y(e, c.SIZE.mini, o.sizing.scale400), y(e, c.SIZE.compact, o.sizing.scale400), y(e, c.SIZE.default, o.sizing.scale300), y(e, c.SIZE.large, o.sizing.scale200), e)[p];
    return {
      display: "flex",
      alignItems: "center",
      borderTopStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderRightStyle: "none",
      background: "none",
      paddingLeft: O,
      paddingRight: O,
      outline: d ? "solid 3px ".concat(o.colors.accent) : "none",
      color: o.colors.contentPrimary
    };
  });
  C.StyledMaskToggleButton = S, S.displayName = "StyledMaskToggleButton", S.displayName = "StyledMaskToggleButton";
  var g = (0, f.styled)("div", function(n) {
    var e, o = n.$alignTop, p = o === void 0 ? !1 : o, d = n.$size, O = n.$theme, I = (e = {}, y(e, c.SIZE.mini, O.sizing.scale200), y(e, c.SIZE.compact, O.sizing.scale200), y(e, c.SIZE.default, O.sizing.scale100), y(e, c.SIZE.large, O.sizing.scale0), e)[d];
    return {
      display: "flex",
      alignItems: p ? "flex-start" : "center",
      paddingLeft: I,
      paddingRight: I,
      paddingTop: p ? O.sizing.scale500 : "0px",
      color: O.colors.contentPrimary
    };
  });
  C.StyledClearIconContainer = g, g.displayName = "StyledClearIconContainer", g.displayName = "StyledClearIconContainer";
  var $ = (0, f.styled)(h.default, function(n) {
    var e = n.$theme, o = n.$isFocusVisible;
    return {
      cursor: "pointer",
      outline: o ? "solid 3px ".concat(e.colors.accent) : "none"
    };
  });
  C.StyledClearIcon = $, $.displayName = "StyledClearIcon", $.displayName = "StyledClearIcon";
  function P(n, e) {
    var o;
    return (o = {}, y(o, c.SIZE.mini, {
      paddingTop: e.scale100,
      paddingBottom: e.scale100,
      paddingLeft: e.scale550,
      paddingRight: e.scale550
    }), y(o, c.SIZE.compact, {
      paddingTop: e.scale200,
      paddingBottom: e.scale200,
      paddingLeft: e.scale550,
      paddingRight: e.scale550
    }), y(o, c.SIZE.default, {
      paddingTop: e.scale400,
      paddingBottom: e.scale400,
      paddingLeft: e.scale550,
      paddingRight: e.scale550
    }), y(o, c.SIZE.large, {
      paddingTop: e.scale550,
      paddingBottom: e.scale550,
      paddingLeft: e.scale550,
      paddingRight: e.scale550
    }), o)[n];
  }
  function E(n, e, o, p, d) {
    var O = n === c.ADJOINED.both || n === c.ADJOINED.left && p !== "rtl" || n === c.ADJOINED.right && p === "rtl" || d && p === "rtl", I = n === c.ADJOINED.both || n === c.ADJOINED.right && p !== "rtl" || n === c.ADJOINED.left && p === "rtl" || d && p !== "rtl";
    return {
      paddingLeft: O ? o.scale550 : "0px",
      paddingRight: I ? o.scale550 : "0px"
    };
  }
  function _(n, e) {
    var o;
    return (o = {}, y(o, c.SIZE.mini, e.font100), y(o, c.SIZE.compact, e.font200), y(o, c.SIZE.default, e.font300), y(o, c.SIZE.large, e.font400), o)[n];
  }
  function D(n, e, o) {
    var p = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1, d = arguments.length > 4 ? arguments[4] : void 0;
    return n ? {
      borderLeftColor: d.inputFillDisabled,
      borderRightColor: d.inputFillDisabled,
      borderTopColor: d.inputFillDisabled,
      borderBottomColor: d.inputFillDisabled,
      backgroundColor: d.inputFillDisabled
    } : e ? {
      borderLeftColor: d.borderSelected,
      borderRightColor: d.borderSelected,
      borderTopColor: d.borderSelected,
      borderBottomColor: d.borderSelected,
      backgroundColor: d.inputFillActive
    } : o ? {
      borderLeftColor: d.inputBorderError,
      borderRightColor: d.inputBorderError,
      borderTopColor: d.inputBorderError,
      borderBottomColor: d.inputBorderError,
      backgroundColor: d.inputFillError
    } : p ? {
      borderLeftColor: d.inputBorderPositive,
      borderRightColor: d.inputBorderPositive,
      borderTopColor: d.inputBorderPositive,
      borderBottomColor: d.inputBorderPositive,
      backgroundColor: d.inputFillPositive
    } : {
      borderLeftColor: d.inputBorder,
      borderRightColor: d.inputBorder,
      borderTopColor: d.inputBorder,
      borderBottomColor: d.inputBorder,
      backgroundColor: d.inputFill
    };
  }
  function L(n, e) {
    var o = e.inputBorderRadius;
    return n === c.SIZE.mini && (o = e.inputBorderRadiusMini), {
      borderTopLeftRadius: o,
      borderBottomLeftRadius: o,
      borderTopRightRadius: o,
      borderBottomRightRadius: o
    };
  }
  var M = function(e) {
    var o = e.$isFocused, p = e.$adjoined, d = e.$error, O = e.$disabled, I = e.$positive, R = e.$size, W = e.$theme, T = e.$theme, B = T.borders, U = T.colors, ue = T.sizing, se = T.typography, G = T.animation, de = e.$hasIconTrailing;
    return v(v(v(v({
      boxSizing: "border-box",
      display: "flex",
      overflow: "hidden",
      width: "100%",
      borderLeftWidth: "2px",
      borderRightWidth: "2px",
      borderTopWidth: "2px",
      borderBottomWidth: "2px",
      borderLeftStyle: "solid",
      borderRightStyle: "solid",
      borderTopStyle: "solid",
      borderBottomStyle: "solid",
      transitionProperty: "border",
      transitionDuration: G.timing200,
      transitionTimingFunction: G.easeOutCurve
    }, L(R, B)), _(R, se)), D(O, o, d, I, U)), E(p, R, ue, W.direction, de));
  };
  C.getRootStyles = M;
  var x = (0, f.styled)("div", M);
  C.Root = x, x.displayName = "Root", x.displayName = "Root";
  function N(n, e) {
    var o;
    return (o = {}, y(o, c.SIZE.mini, {
      paddingRight: e.scale400,
      paddingLeft: e.scale400
    }), y(o, c.SIZE.compact, {
      paddingRight: e.scale400,
      paddingLeft: e.scale400
    }), y(o, c.SIZE.default, {
      paddingRight: e.scale300,
      paddingLeft: e.scale300
    }), y(o, c.SIZE.large, {
      paddingRight: e.scale200,
      paddingLeft: e.scale200
    }), o)[n];
  }
  function F(n, e, o, p, d) {
    return n ? {
      color: d.inputEnhancerTextDisabled,
      backgroundColor: d.inputFillDisabled
    } : e ? {
      color: d.contentPrimary,
      backgroundColor: d.inputFillActive
    } : o ? {
      color: d.contentPrimary,
      backgroundColor: d.inputFillError
    } : p ? {
      color: d.contentPrimary,
      backgroundColor: d.inputFillPositive
    } : {
      color: d.contentPrimary,
      backgroundColor: d.inputFill
    };
  }
  var i = (0, f.styled)("div", function(n) {
    var e = n.$size, o = n.$disabled, p = n.$isFocused, d = n.$error, O = n.$positive, I = n.$theme, R = I.colors, W = I.sizing, T = I.typography, B = I.animation;
    return v(v(v({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transitionProperty: "color, background-color",
      transitionDuration: B.timing200,
      transitionTimingFunction: B.easeOutCurve
    }, _(e, T)), N(e, W)), F(o, p, d, O, R));
  });
  C.InputEnhancer = i, i.displayName = "InputEnhancer", i.displayName = "InputEnhancer";
  function t(n, e, o, p, d) {
    return n ? {
      color: d.inputTextDisabled,
      backgroundColor: d.inputFillDisabled
    } : e ? {
      color: d.contentPrimary,
      backgroundColor: d.inputFillActive
    } : o ? {
      color: d.contentPrimary,
      backgroundColor: d.inputFillError
    } : p ? {
      color: d.contentPrimary,
      backgroundColor: d.inputFillPositive
    } : {
      color: d.contentPrimary,
      backgroundColor: d.inputFill
    };
  }
  var u = function(e) {
    var o = e.$isFocused, p = e.$error, d = e.$disabled, O = e.$positive, I = e.$size, R = e.$theme, W = R.colors, T = R.typography, B = R.animation;
    return v(v({
      display: "flex",
      width: "100%",
      transitionProperty: "background-color",
      transitionDuration: B.timing200,
      transitionTimingFunction: B.easeOutCurve
    }, _(I, T)), t(d, o, p, O, W));
  };
  C.getInputContainerStyles = u;
  var s = (0, f.styled)("div", u);
  C.InputContainer = s, s.displayName = "InputContainer", s.displayName = "InputContainer";
  function r(n, e, o, p) {
    return n ? {
      color: p.inputTextDisabled,
      "-webkit-text-fill-color": p.inputTextDisabled,
      caretColor: p.contentPrimary,
      "::placeholder": {
        color: p.inputPlaceholderDisabled
      }
    } : {
      color: p.contentPrimary,
      caretColor: p.contentPrimary,
      "::placeholder": {
        color: p.inputPlaceholder
      }
    };
  }
  var a = function(e) {
    var o = e.$disabled, p = e.$isFocused, d = e.$error, O = e.$size, I = e.$theme, R = I.colors, W = I.sizing, T = I.typography;
    return v(v(v({
      boxSizing: "border-box",
      backgroundColor: "transparent",
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftStyle: "none",
      borderRightStyle: "none",
      borderTopStyle: "none",
      borderBottomStyle: "none",
      outline: "none",
      width: "100%",
      // See https://stackoverflow.com/a/33811151
      minWidth: 0,
      maxWidth: "100%",
      cursor: o ? "not-allowed" : "text",
      margin: "0",
      paddingTop: "0",
      paddingBottom: "0",
      paddingLeft: "0",
      paddingRight: "0"
    }, _(O, T)), P(O, W)), r(o, p, d, R));
  };
  C.getInputStyles = a;
  var l = (0, f.styled)("input", a);
  return C.Input = l, l.displayName = "Input", l.displayName = "Input", C;
}
var Ve = /* @__PURE__ */ ke();
const He = /* @__PURE__ */ ae("div", {
  target: "e1ipygm11"
})({
  name: "1ucqwki",
  styles: "position:absolute;top:50%;right:2.05em"
}), Ue = /* @__PURE__ */ ae($e, {
  shouldForwardProp: Pe,
  target: "e1ipygm10"
})(({
  theme: f,
  $isHighlighted: c
}) => ({
  paddingRight: f.spacing.lg,
  paddingLeft: f.spacing.lg,
  paddingTop: f.spacing.sm,
  paddingBottom: f.spacing.sm,
  background: c ? f.colors.darkenedBgMix15 : void 0,
  "&:hover, &:active, &:focus-visible": {
    background: f.colors.darkenedBgMix15
  }
}), "");
function Je({
  disabled: f,
  element: c,
  widgetMgr: h,
  fragmentId: m
}) {
  const [b, v] = We({
    getStateFromWidgetMgr: Ke,
    getDefaultStateFromProto: Ye,
    getCurrStateFromProto: Ge,
    updateWidgetMgrState: Qe,
    element: c,
    widgetMgr: h,
    fragmentId: m
  }), y = H.useContext(_e), S = J(c.default) && !f, g = Te(), $ = {
    Select: {
      props: {
        disabled: f,
        overrides: {
          ControlContainer: {
            style: {
              height: g.sizes.minElementHeight,
              // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
              borderLeftWidth: g.sizes.borderWidth,
              borderRightWidth: g.sizes.borderWidth,
              borderTopWidth: g.sizes.borderWidth,
              borderBottomWidth: g.sizes.borderWidth
            }
          },
          IconsContainer: {
            style: () => ({
              paddingRight: g.spacing.sm
            })
          },
          ValueContainer: {
            style: () => ({
              lineHeight: g.lineHeights.inputWidget,
              // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
              paddingRight: g.spacing.sm,
              paddingLeft: g.spacing.md,
              paddingBottom: g.spacing.sm,
              paddingTop: g.spacing.sm
            })
          },
          SingleValue: {
            style: {
              fontWeight: g.fontWeights.normal
            },
            props: {
              "data-testid": "stTimeInputTimeDisplay"
            }
          },
          Dropdown: {
            style: () => ({
              paddingTop: g.spacing.none,
              paddingBottom: g.spacing.none,
              // Somehow this adds an additional shadow, even though we already have
              // one on the popover, so we need to remove it here.
              boxShadow: "none",
              maxHeight: g.sizes.maxDropdownHeight
            })
          },
          DropdownListItem: {
            component: Ue
          },
          // Nudge the dropdown menu by 1px so the focus state doesn't get cut off
          Popover: {
            props: {
              ignoreBoundary: y,
              overrides: {
                Body: {
                  style: () => ({
                    marginTop: g.spacing.px
                  })
                }
              }
            }
          },
          Placeholder: {
            style: () => ({
              color: g.colors.fadedText60
            })
          },
          SelectArrow: {
            component: Ae,
            props: {
              overrides: {
                Svg: {
                  style: () => ({
                    width: g.iconSizes.xl,
                    height: g.iconSizes.xl
                  })
                }
              }
            }
          }
        }
      }
    }
  }, P = H.useCallback((_) => {
    const D = _ === null ? null : Xe(_);
    v({
      value: D,
      fromUi: !0
    });
  }, [v]), E = H.useCallback(() => {
    P(null);
  }, [P]);
  return /* @__PURE__ */ j.jsxs("div", { className: "stTimeInput", "data-testid": "stTimeInput", children: [
    /* @__PURE__ */ j.jsx(Ee, { label: c.label, disabled: f, labelVisibility: Re(c.labelVisibility?.value), children: c.help && /* @__PURE__ */ j.jsx(we, { children: /* @__PURE__ */ j.jsx(De, { content: c.help, placement: xe.TOP_RIGHT }) }) }),
    /* @__PURE__ */ j.jsx(
      Be,
      {
        format: "24",
        step: c.step ? Number(c.step) : 900,
        value: J(b) ? void 0 : et(b),
        onChange: P,
        overrides: $,
        nullable: S,
        creatable: !0,
        "aria-label": c.label
      }
    ),
    S && !J(b) && // The time picker doesn't have a built-in clearable functionality.
    // Therefore, we are adding the clear button here.
    /* @__PURE__ */ j.jsx(He, { onClick: E, "data-testid": "stTimeInputClearButton", children: /* @__PURE__ */ j.jsx(Ve.StyledClearIcon, { overrides: {
      Svg: {
        style: {
          color: g.colors.grayTextColor,
          // setting this width and height makes the clear-icon align with dropdown arrows of other input fields
          padding: g.spacing.threeXS,
          height: g.sizes.clearIconSize,
          width: g.sizes.clearIconSize,
          ":hover": {
            fill: g.colors.bodyText
          }
        }
      }
    }, $isFocusVisible: !1 }) })
  ] });
}
function Ke(f, c) {
  return f.getStringValue(c) ?? null;
}
function Ye(f) {
  return f.default ?? null;
}
function Ge(f) {
  return f.value ?? null;
}
function Qe(f, c, h, m) {
  c.setStringValue(f, h.value, {
    fromUi: h.fromUi
  }, m);
}
function Xe(f) {
  const c = f.getHours().toString().padStart(2, "0"), h = f.getMinutes().toString().padStart(2, "0");
  return `${c}:${h}`;
}
function et(f) {
  if (f === null)
    return null;
  const [c, h] = f.split(":").map(Number), m = /* @__PURE__ */ new Date();
  return m.setHours(c), m.setMinutes(h), m;
}
const ot = H.memo(Je);
export {
  ot as default
};
//# sourceMappingURL=index-BPUzPqrC.js.map
