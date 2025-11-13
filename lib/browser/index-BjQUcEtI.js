import { r as y, aG as tn, aH as rn, aI as nn, aJ as an, b1 as Cn, bH as In, a3 as En, ac as ee, ae as Fe, af as Be, bI as Hn, ad as on, o as Y, bJ as sn, bK as xn, ai as ln, Y as Or, br as An, au as Qe, aL as Tn, aM as Rn, R as Ln, bL as un, bM as jn, u as Dr, M as Fn, L as Bn, bt as Xe, k as cn, j as Me, W as Wn, l as Yn, Q as Nn, T as Vn, P as Sr, am as zn, an as qn, f as Un, h as Qn } from "./index-COqA-032.js";
import { u as Xn } from "./useBasicWidgetState-Hu_BQk7V.js";
import { D as Re, a as Le, T as Kn } from "./timepicker-BW7SE972.js";
import { I as Gn } from "./input-BCJbpYBC.js";
import { d as Jn } from "./base-input-D8uW1Tz_.js";
import { E as Zn } from "./ErrorOutline.esm-DMtjQMqW.js";
var ea = ["title", "size", "color", "overrides"];
function Mt() {
  return Mt = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, Mt.apply(this, arguments);
}
function ta(e, r) {
  if (e == null) return {};
  var n = ra(e, r), a, t;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (t = 0; t < o.length; t++)
      a = o[t], !(r.indexOf(a) >= 0) && Object.prototype.propertyIsEnumerable.call(e, a) && (n[a] = e[a]);
  }
  return n;
}
function ra(e, r) {
  if (e == null) return {};
  var n = {}, a = Object.keys(e), t, o;
  for (o = 0; o < a.length; o++)
    t = a[o], !(r.indexOf(t) >= 0) && (n[t] = e[t]);
  return n;
}
function na(e, r) {
  return sa(e) || ia(e, r) || oa(e, r) || aa();
}
function aa() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function oa(e, r) {
  if (e) {
    if (typeof e == "string") return wr(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return wr(e, r);
  }
}
function wr(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function ia(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function sa(e) {
  if (Array.isArray(e)) return e;
}
function la(e, r) {
  var n = tn(), a = na(n, 2), t = a[1], o = e.title, i = o === void 0 ? "Left" : o, s = e.size, u = e.color, d = e.overrides, f = d === void 0 ? {} : d, c = ta(e, ea), h = rn(
    // Icons from the theme target the SVG override in the underlying Icon component
    {
      component: t.icons && t.icons.ChevronLeft ? t.icons.ChevronLeft : null
    },
    f && f.Svg ? nn(f.Svg) : {}
  );
  return /* @__PURE__ */ y.createElement(an, Mt({
    viewBox: "0 0 24 24",
    ref: r,
    title: i,
    size: s,
    color: u,
    overrides: {
      Svg: h
    }
  }, c), /* @__PURE__ */ y.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M9 12C9 12.2652 9.10536 12.5196 9.29289 12.7071L13.2929 16.7071C13.6834 17.0976 14.3166 17.0976 14.7071 16.7071C15.0976 16.3166 15.0976 15.6834 14.7071 15.2929L11.4142 12L14.7071 8.70711C15.0976 8.31658 15.0976 7.68342 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12Z"
  }));
}
const kr = /* @__PURE__ */ y.forwardRef(la);
var ua = ["title", "size", "color", "overrides"];
function Pt() {
  return Pt = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, Pt.apply(this, arguments);
}
function ca(e, r) {
  if (e == null) return {};
  var n = da(e, r), a, t;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (t = 0; t < o.length; t++)
      a = o[t], !(r.indexOf(a) >= 0) && Object.prototype.propertyIsEnumerable.call(e, a) && (n[a] = e[a]);
  }
  return n;
}
function da(e, r) {
  if (e == null) return {};
  var n = {}, a = Object.keys(e), t, o;
  for (o = 0; o < a.length; o++)
    t = a[o], !(r.indexOf(t) >= 0) && (n[t] = e[t]);
  return n;
}
function pa(e, r) {
  return ya(e) || ga(e, r) || ha(e, r) || fa();
}
function fa() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ha(e, r) {
  if (e) {
    if (typeof e == "string") return _r(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _r(e, r);
  }
}
function _r(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function ga(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function ya(e) {
  if (Array.isArray(e)) return e;
}
function ma(e, r) {
  var n = tn(), a = pa(n, 2), t = a[1], o = e.title, i = o === void 0 ? "Right" : o, s = e.size, u = e.color, d = e.overrides, f = d === void 0 ? {} : d, c = ca(e, ua), h = rn(
    // Icons from the theme target the SVG override in the underlying Icon component
    {
      component: t.icons && t.icons.ChevronRight ? t.icons.ChevronRight : null
    },
    f && f.Svg ? nn(f.Svg) : {}
  );
  return /* @__PURE__ */ y.createElement(an, Pt({
    viewBox: "0 0 24 24",
    ref: r,
    title: i,
    size: s,
    color: u,
    overrides: {
      Svg: h
    }
  }, c), /* @__PURE__ */ y.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M9.29289 7.29289C8.90237 7.68342 8.90237 8.31658 9.29289 8.70711L12.5858 12L9.29289 15.2929C8.90237 15.6834 8.90237 16.3166 9.29289 16.7071C9.68342 17.0976 10.3166 17.0976 10.7071 16.7071L14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12C15 11.7348 14.8946 11.4804 14.7071 11.2929L10.7071 7.29289C10.3166 6.90237 9.68342 6.90237 9.29289 7.29289Z"
  }));
}
const $r = /* @__PURE__ */ y.forwardRef(ma);
var yt = { exports: {} }, mt, Mr;
function va() {
  if (Mr) return mt;
  Mr = 1;
  function e(p) {
    return p && typeof p == "object" && "default" in p ? p.default : p;
  }
  var r = e(Cn()), n = In();
  function a(p, O) {
    for (var w = Object.getOwnPropertyNames(O), g = 0; g < w.length; g++) {
      var l = w[g], P = Object.getOwnPropertyDescriptor(O, l);
      P && P.configurable && p[l] === void 0 && Object.defineProperty(p, l, P);
    }
    return p;
  }
  function t() {
    return (t = Object.assign || function(p) {
      for (var O = 1; O < arguments.length; O++) {
        var w = arguments[O];
        for (var g in w) Object.prototype.hasOwnProperty.call(w, g) && (p[g] = w[g]);
      }
      return p;
    }).apply(this, arguments);
  }
  function o(p, O) {
    p.prototype = Object.create(O.prototype), a(p.prototype.constructor = p, O);
  }
  function i(p, O) {
    if (p == null) return {};
    var w, g, l = {}, P = Object.keys(p);
    for (g = 0; g < P.length; g++) w = P[g], 0 <= O.indexOf(w) || (l[w] = p[w]);
    return l;
  }
  function s(p) {
    if (p === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return p;
  }
  var u = function(p, O, w, g, l, P, q, ae) {
    if (!p) {
      var x;
      if (O === void 0) x = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
      else {
        var F = [w, g, l, P, q, ae], W = 0;
        (x = new Error(O.replace(/%s/g, function() {
          return F[W++];
        }))).name = "Invariant Violation";
      }
      throw x.framesToPop = 1, x;
    }
  }, d = u;
  function f(p, O, w) {
    if ("selectionStart" in p && "selectionEnd" in p) p.selectionStart = O, p.selectionEnd = w;
    else {
      var g = p.createTextRange();
      g.collapse(!0), g.moveStart("character", O), g.moveEnd("character", w - O), g.select();
    }
  }
  function c(p) {
    var O = 0, w = 0;
    if ("selectionStart" in p && "selectionEnd" in p) O = p.selectionStart, w = p.selectionEnd;
    else {
      var g = document.selection.createRange();
      g.parentElement() === p && (O = -g.moveStart("character", -p.value.length), w = -g.moveEnd("character", -p.value.length));
    }
    return { start: O, end: w, length: w - O };
  }
  var h = { 9: "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]" }, m = "_";
  function v(p, O, w) {
    var g = "", l = "", P = null, q = [];
    if (O === void 0 && (O = m), w == null && (w = h), !p || typeof p != "string") return { maskChar: O, formatChars: w, mask: null, prefix: null, lastEditablePosition: null, permanents: [] };
    var ae = !1;
    return p.split("").forEach(function(x) {
      ae = !ae && x === "\\" || (ae || !w[x] ? (q.push(g.length), g.length === q.length - 1 && (l += x)) : P = g.length + 1, g += x, !1);
    }), { maskChar: O, formatChars: w, prefix: l, mask: g, lastEditablePosition: P, permanents: q };
  }
  function b(p, O) {
    return p.permanents.indexOf(O) !== -1;
  }
  function D(p, O, w) {
    var g = p.mask, l = p.formatChars;
    if (!w) return !1;
    if (b(p, O)) return g[O] === w;
    var P = l[g[O]];
    return new RegExp(P).test(w);
  }
  function S(p, O) {
    return O.split("").every(function(w, g) {
      return b(p, g) || !D(p, g, w);
    });
  }
  function k(p, O) {
    var w = p.maskChar, g = p.prefix;
    if (!w) {
      for (; O.length > g.length && b(p, O.length - 1); ) O = O.slice(0, O.length - 1);
      return O.length;
    }
    for (var l = g.length, P = O.length; P >= g.length; P--) {
      var q = O[P];
      if (!b(p, P) && D(p, P, q)) {
        l = P + 1;
        break;
      }
    }
    return l;
  }
  function $(p, O) {
    return k(p, O) === p.mask.length;
  }
  function _(p, O) {
    var w = p.maskChar, g = p.mask, l = p.prefix;
    if (!w) {
      for ((O = H(p, "", O, 0)).length < l.length && (O = l); O.length < g.length && b(p, O.length); ) O += g[O.length];
      return O;
    }
    if (O) return H(p, _(p, ""), O, 0);
    for (var P = 0; P < g.length; P++) b(p, P) ? O += g[P] : O += w;
    return O;
  }
  function A(p, O, w, g) {
    var l = w + g, P = p.maskChar, q = p.mask, ae = p.prefix, x = O.split("");
    if (P) return x.map(function(W, oe) {
      return oe < w || l <= oe ? W : b(p, oe) ? q[oe] : P;
    }).join("");
    for (var F = l; F < x.length; F++) b(p, F) && (x[F] = "");
    return w = Math.max(ae.length, w), x.splice(w, l - w), O = x.join(""), _(p, O);
  }
  function H(p, O, w, g) {
    var l = p.mask, P = p.maskChar, q = p.prefix, ae = w.split(""), x = $(p, O);
    return !P && g > O.length && (O += l.slice(O.length, g)), ae.every(function(F) {
      for (; ue = F, b(p, U = g) && ue !== l[U]; ) {
        if (g >= O.length && (O += l[g]), W = F, oe = g, P && b(p, oe) && W === P) return !0;
        if (++g >= l.length) return !1;
      }
      var W, oe, U, ue;
      return !D(p, g, F) && F !== P || (g < O.length ? O = P || x || g < q.length ? O.slice(0, g) + F + O.slice(g + 1) : (O = O.slice(0, g) + F + O.slice(g), _(p, O)) : P || (O += F), ++g < l.length);
    }), O;
  }
  function R(p, O, w, g) {
    var l = p.mask, P = p.maskChar, q = w.split(""), ae = g;
    return q.every(function(x) {
      for (; W = x, b(p, F = g) && W !== l[F]; ) if (++g >= l.length) return !1;
      var F, W;
      return (D(p, g, x) || x === P) && g++, g < l.length;
    }), g - ae;
  }
  function j(p, O) {
    for (var w = O; 0 <= w; --w) if (!b(p, w)) return w;
    return null;
  }
  function C(p, O) {
    for (var w = p.mask, g = O; g < w.length; ++g) if (!b(p, g)) return g;
    return null;
  }
  function L(p) {
    return p || p === 0 ? p + "" : "";
  }
  function I(p, O, w, g, l) {
    var P = p.mask, q = p.prefix, ae = p.lastEditablePosition, x = O, F = "", W = 0, oe = 0, U = Math.min(l.start, w.start);
    return w.end > l.start ? oe = (W = R(p, g, F = x.slice(l.start, w.end), U)) ? l.length : 0 : x.length < g.length && (oe = g.length - x.length), x = g, oe && (oe === 1 && !l.length && (U = l.start === w.start ? C(p, w.start) : j(p, w.start)), x = A(p, x, U, oe)), x = H(p, x, F, U), (U += W) >= P.length ? U = P.length : U < q.length && !W ? U = q.length : U >= q.length && U < ae && W && (U = C(p, U)), F || (F = null), { value: x = _(p, x), enteredString: F, selection: { start: U, end: U } };
  }
  function E() {
    var p = new RegExp("windows", "i"), O = new RegExp("phone", "i"), w = navigator.userAgent;
    return p.test(w) && O.test(w);
  }
  function T(p) {
    return typeof p == "function";
  }
  function X() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  }
  function z() {
    return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;
  }
  function J(p) {
    return (z() ? X() : function() {
      return setTimeout(p, 1e3 / 60);
    })(p);
  }
  function K(p) {
    (z() || clearTimeout)(p);
  }
  var G = (function(p) {
    function O(g) {
      var l = p.call(this, g) || this;
      l.focused = !1, l.mounted = !1, l.previousSelection = null, l.selectionDeferId = null, l.saveSelectionLoopDeferId = null, l.saveSelectionLoop = function() {
        l.previousSelection = l.getSelection(), l.saveSelectionLoopDeferId = J(l.saveSelectionLoop);
      }, l.runSaveSelectionLoop = function() {
        l.saveSelectionLoopDeferId === null && l.saveSelectionLoop();
      }, l.stopSaveSelectionLoop = function() {
        l.saveSelectionLoopDeferId !== null && (K(l.saveSelectionLoopDeferId), l.saveSelectionLoopDeferId = null, l.previousSelection = null);
      }, l.getInputDOMNode = function() {
        if (!l.mounted) return null;
        var M = n.findDOMNode(s(s(l))), B = typeof window < "u" && M instanceof window.Element;
        if (M && !B) return null;
        if (M.nodeName !== "INPUT" && (M = M.querySelector("input")), !M) throw new Error("react-input-mask: inputComponent doesn't contain input node");
        return M;
      }, l.getInputValue = function() {
        var M = l.getInputDOMNode();
        return M ? M.value : null;
      }, l.setInputValue = function(M) {
        var B = l.getInputDOMNode();
        B && (l.value = M, B.value = M);
      }, l.setCursorToEnd = function() {
        var M = k(l.maskOptions, l.value), B = C(l.maskOptions, M);
        B !== null && l.setCursorPosition(B);
      }, l.setSelection = function(M, B, Q) {
        Q === void 0 && (Q = {});
        var N = l.getInputDOMNode(), te = l.isFocused();
        N && te && (Q.deferred || f(N, M, B), l.selectionDeferId !== null && K(l.selectionDeferId), l.selectionDeferId = J(function() {
          l.selectionDeferId = null, f(N, M, B);
        }), l.previousSelection = { start: M, end: B, length: Math.abs(B - M) });
      }, l.getSelection = function() {
        return c(l.getInputDOMNode());
      }, l.getCursorPosition = function() {
        return l.getSelection().start;
      }, l.setCursorPosition = function(M) {
        l.setSelection(M, M);
      }, l.isFocused = function() {
        return l.focused;
      }, l.getBeforeMaskedValueChangeConfig = function() {
        var M = l.maskOptions, B = M.mask, Q = M.maskChar, N = M.permanents, te = M.formatChars;
        return { mask: B, maskChar: Q, permanents: N, alwaysShowMask: !!l.props.alwaysShowMask, formatChars: te };
      }, l.isInputAutofilled = function(M, B, Q, N) {
        var te = l.getInputDOMNode();
        try {
          if (te.matches(":-webkit-autofill")) return !0;
        } catch {
        }
        return !l.focused || N.end < Q.length && B.end === M.length;
      }, l.onChange = function(M) {
        var B = s(s(l)).beforePasteState, Q = s(s(l)).previousSelection, N = l.props.beforeMaskedValueChange, te = l.getInputValue(), ge = l.value, ye = l.getSelection();
        l.isInputAutofilled(te, ye, ge, Q) && (ge = _(l.maskOptions, ""), Q = { start: 0, end: 0, length: 0 }), B && (Q = B.selection, ge = B.value, ye = { start: Q.start + te.length, end: Q.start + te.length, length: 0 }, te = ge.slice(0, Q.start) + te + ge.slice(Q.end), l.beforePasteState = null);
        var $e = I(l.maskOptions, te, ye, ge, Q), Je = $e.enteredString, be = $e.selection, He = $e.value;
        if (T(N)) {
          var je = N({ value: He, selection: be }, { value: ge, selection: Q }, Je, l.getBeforeMaskedValueChangeConfig());
          He = je.value, be = je.selection;
        }
        l.setInputValue(He), T(l.props.onChange) && l.props.onChange(M), l.isWindowsPhoneBrowser ? l.setSelection(be.start, be.end, { deferred: !0 }) : l.setSelection(be.start, be.end);
      }, l.onFocus = function(M) {
        var B = l.props.beforeMaskedValueChange, Q = l.maskOptions, N = Q.mask, te = Q.prefix;
        if (l.focused = !0, l.mounted = !0, N) {
          if (l.value) k(l.maskOptions, l.value) < l.maskOptions.mask.length && l.setCursorToEnd();
          else {
            var ge = _(l.maskOptions, te), ye = _(l.maskOptions, ge), $e = k(l.maskOptions, ye), Je = C(l.maskOptions, $e), be = { start: Je, end: Je };
            if (T(B)) {
              var He = B({ value: ye, selection: be }, { value: l.value, selection: null }, null, l.getBeforeMaskedValueChangeConfig());
              ye = He.value, be = He.selection;
            }
            var je = ye !== l.getInputValue();
            je && l.setInputValue(ye), je && T(l.props.onChange) && l.props.onChange(M), l.setSelection(be.start, be.end);
          }
          l.runSaveSelectionLoop();
        }
        T(l.props.onFocus) && l.props.onFocus(M);
      }, l.onBlur = function(M) {
        var B = l.props.beforeMaskedValueChange, Q = l.maskOptions.mask;
        if (l.stopSaveSelectionLoop(), l.focused = !1, Q && !l.props.alwaysShowMask && S(l.maskOptions, l.value)) {
          var N = "";
          T(B) && (N = B({ value: N, selection: null }, { value: l.value, selection: l.previousSelection }, null, l.getBeforeMaskedValueChangeConfig()).value);
          var te = N !== l.getInputValue();
          te && l.setInputValue(N), te && T(l.props.onChange) && l.props.onChange(M);
        }
        T(l.props.onBlur) && l.props.onBlur(M);
      }, l.onMouseDown = function(M) {
        if (!l.focused && document.addEventListener) {
          l.mouseDownX = M.clientX, l.mouseDownY = M.clientY, l.mouseDownTime = (/* @__PURE__ */ new Date()).getTime();
          var B = function Q(N) {
            if (document.removeEventListener("mouseup", Q), l.focused) {
              var te = Math.abs(N.clientX - l.mouseDownX), ge = Math.abs(N.clientY - l.mouseDownY), ye = Math.max(te, ge), $e = (/* @__PURE__ */ new Date()).getTime() - l.mouseDownTime;
              (ye <= 10 && $e <= 200 || ye <= 5 && $e <= 300) && l.setCursorToEnd();
            }
          };
          document.addEventListener("mouseup", B);
        }
        T(l.props.onMouseDown) && l.props.onMouseDown(M);
      }, l.onPaste = function(M) {
        T(l.props.onPaste) && l.props.onPaste(M), M.defaultPrevented || (l.beforePasteState = { value: l.getInputValue(), selection: l.getSelection() }, l.setInputValue(""));
      }, l.handleRef = function(M) {
        l.props.children == null && T(l.props.inputRef) && l.props.inputRef(M);
      };
      var P = g.mask, q = g.maskChar, ae = g.formatChars, x = g.alwaysShowMask, F = g.beforeMaskedValueChange, W = g.defaultValue, oe = g.value;
      l.maskOptions = v(P, q, ae), W == null && (W = ""), oe == null && (oe = W);
      var U = L(oe);
      if (l.maskOptions.mask && (x || U) && (U = _(l.maskOptions, U), T(F))) {
        var ue = g.value;
        g.value == null && (ue = W), U = F({ value: U, selection: null }, { value: ue = L(ue), selection: null }, null, l.getBeforeMaskedValueChangeConfig()).value;
      }
      return l.value = U, l;
    }
    o(O, p);
    var w = O.prototype;
    return w.componentDidMount = function() {
      this.mounted = !0, this.getInputDOMNode() && (this.isWindowsPhoneBrowser = E(), this.maskOptions.mask && this.getInputValue() !== this.value && this.setInputValue(this.value));
    }, w.componentDidUpdate = function() {
      var g = this.previousSelection, l = this.props, P = l.beforeMaskedValueChange, q = l.alwaysShowMask, ae = l.mask, x = l.maskChar, F = l.formatChars, W = this.maskOptions, oe = q || this.isFocused(), U = this.props.value != null, ue = U ? L(this.props.value) : this.value, M = g ? g.start : null;
      if (this.maskOptions = v(ae, x, F), this.maskOptions.mask) {
        !W.mask && this.isFocused() && this.runSaveSelectionLoop();
        var B = this.maskOptions.mask && this.maskOptions.mask !== W.mask;
        if (W.mask || U || (ue = this.getInputValue()), (B || this.maskOptions.mask && (ue || oe)) && (ue = _(this.maskOptions, ue)), B) {
          var Q = k(this.maskOptions, ue);
          (M === null || Q < M) && (M = $(this.maskOptions, ue) ? Q : C(this.maskOptions, Q));
        }
        !this.maskOptions.mask || !S(this.maskOptions, ue) || oe || U && this.props.value || (ue = "");
        var N = { start: M, end: M };
        if (T(P)) {
          var te = P({ value: ue, selection: N }, { value: this.value, selection: this.previousSelection }, null, this.getBeforeMaskedValueChangeConfig());
          ue = te.value, N = te.selection;
        }
        this.value = ue;
        var ge = this.getInputValue() !== this.value;
        ge ? (this.setInputValue(this.value), this.forceUpdate()) : B && this.forceUpdate();
        var ye = !1;
        N.start != null && N.end != null && (ye = !g || g.start !== N.start || g.end !== N.end), (ye || ge) && this.setSelection(N.start, N.end);
      } else W.mask && (this.stopSaveSelectionLoop(), this.forceUpdate());
    }, w.componentWillUnmount = function() {
      this.mounted = !1, this.selectionDeferId !== null && K(this.selectionDeferId), this.stopSaveSelectionLoop();
    }, w.render = function() {
      var g, l = this.props, P = (l.mask, l.alwaysShowMask, l.maskChar, l.formatChars, l.inputRef, l.beforeMaskedValueChange, l.children), q = i(l, ["mask", "alwaysShowMask", "maskChar", "formatChars", "inputRef", "beforeMaskedValueChange", "children"]);
      if (P) {
        T(P) || d(!1);
        var ae = ["onChange", "onPaste", "onMouseDown", "onFocus", "onBlur", "value", "disabled", "readOnly"], x = t({}, q);
        ae.forEach(function(W) {
          return delete x[W];
        }), g = P(x), ae.filter(function(W) {
          return g.props[W] != null && g.props[W] !== q[W];
        }).length && d(!1);
      } else g = r.createElement("input", t({ ref: this.handleRef }, q));
      var F = { onFocus: this.onFocus, onBlur: this.onBlur };
      return this.maskOptions.mask && (q.disabled || q.readOnly || (F.onChange = this.onChange, F.onPaste = this.onPaste, F.onMouseDown = this.onMouseDown), q.value != null && (F.value = this.value)), g = r.cloneElement(g, F);
    }, O;
  })(r.Component);
  return mt = G, mt;
}
var Pr;
function ba() {
  return Pr || (Pr = 1, yt.exports = va()), yt.exports;
}
var Oa = ba();
const Da = /* @__PURE__ */ En(Oa);
var Sa = ["startEnhancer", "endEnhancer", "error", "positive", "onChange", "onFocus", "onBlur", "value", "disabled", "readOnly"], wa = ["Input"], ka = ["mask", "maskChar", "overrides"];
function Cr(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    r && (a = a.filter(function(t) {
      return Object.getOwnPropertyDescriptor(e, t).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function vt(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r] != null ? arguments[r] : {};
    r % 2 ? Cr(Object(n), !0).forEach(function(a) {
      _a(e, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Cr(Object(n)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return e;
}
function _a(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
function rt(e) {
  "@babel/helpers - typeof";
  return rt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, rt(e);
}
function Ke() {
  return Ke = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, Ke.apply(this, arguments);
}
function Ct(e, r) {
  if (e == null) return {};
  var n = $a(e, r), a, t;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (t = 0; t < o.length; t++)
      a = o[t], !(r.indexOf(a) >= 0) && Object.prototype.propertyIsEnumerable.call(e, a) && (n[a] = e[a]);
  }
  return n;
}
function $a(e, r) {
  if (e == null) return {};
  var n = {}, a = Object.keys(e), t, o;
  for (o = 0; o < a.length; o++)
    t = a[o], !(r.indexOf(t) >= 0) && (n[t] = e[t]);
  return n;
}
var dn = /* @__PURE__ */ y.forwardRef(function(e, r) {
  e.startEnhancer, e.endEnhancer, e.error, e.positive;
  var n = e.onChange, a = e.onFocus, t = e.onBlur, o = e.value, i = e.disabled, s = e.readOnly, u = Ct(e, Sa);
  return /* @__PURE__ */ y.createElement(Da, Ke({
    onChange: n,
    onFocus: a,
    onBlur: t,
    value: o,
    disabled: i,
    readOnly: s
  }, u), function(d) {
    return /* @__PURE__ */ y.createElement(Jn, Ke({
      ref: r,
      onChange: n,
      onFocus: a,
      onBlur: t,
      value: o,
      disabled: i,
      readOnly: s
    }, d));
  });
});
dn.displayName = "MaskOverride";
function pn(e) {
  var r = e.mask, n = e.maskChar, a = e.overrides;
  a = a === void 0 ? {} : a;
  var t = a.Input, o = t === void 0 ? {} : t, i = Ct(a, wa), s = Ct(e, ka), u = dn, d = {}, f = {};
  typeof o == "function" ? u = o : rt(o) === "object" && (u = o.component || u, d = o.props || {}, f = o.style || {}), rt(d) === "object" && (d = vt(vt({}, d), {}, {
    mask: d.mask || r,
    maskChar: d.maskChar || n
  }));
  var c = vt({
    Input: {
      component: u,
      props: d,
      style: f
    }
  }, i);
  return /* @__PURE__ */ y.createElement(Gn, Ke({}, s, {
    overrides: c
  }));
}
pn.defaultProps = {
  maskChar: " "
};
var Kt = Object.freeze({
  horizontal: "horizontal",
  vertical: "vertical"
}), fn = [0, 1, 2, 3, 4, 5, 6], Ma = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], le = {
  high: "high",
  default: "default"
}, _e = {
  startDate: "startDate",
  endDate: "endDate"
}, Pa = {
  locked: "locked"
};
function Ir(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    r && (a = a.filter(function(t) {
      return Object.getOwnPropertyDescriptor(e, t).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function Te(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r] != null ? arguments[r] : {};
    r % 2 ? Ir(Object(n), !0).forEach(function(a) {
      Ca(e, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ir(Object(n)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return e;
}
function Ca(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var Gt = ee("label", function(e) {
  var r = e.$disabled, n = e.$theme, a = n.colors, t = n.typography;
  return Te(Te({}, t.font250), {}, {
    width: "100%",
    color: r ? a.contentSecondary : a.contentPrimary,
    display: "block",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  });
});
Gt.displayName = "Label";
Gt.displayName = "Label";
var Jt = ee("span", function(e) {
  var r = e.$theme.sizing;
  return {
    display: "flex",
    width: "100%",
    marginTop: r.scale300,
    marginRight: 0,
    marginBottom: r.scale300,
    marginLeft: 0
  };
});
Jt.displayName = "LabelContainer";
Jt.displayName = "LabelContainer";
var Zt = ee("span", function(e) {
  var r = e.$disabled, n = e.$counterError, a = e.$theme, t = a.colors, o = a.typography;
  return Te(Te({}, o.font100), {}, {
    flex: 0,
    width: "100%",
    color: n ? t.negative400 : r ? t.contentSecondary : t.contentPrimary
  });
});
Zt.displayName = "LabelEndEnhancer";
Zt.displayName = "LabelEndEnhancer";
var er = ee("div", function(e) {
  var r = e.$error, n = e.$positive, a = e.$theme, t = a.colors, o = a.sizing, i = a.typography, s = t.contentSecondary;
  return r ? s = t.negative400 : n && (s = t.positive400), Te(Te({}, i.font100), {}, {
    color: s,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginTop: o.scale300,
    marginRight: 0,
    marginBottom: o.scale300,
    marginLeft: 0
  });
});
er.displayName = "Caption";
er.displayName = "Caption";
var tr = ee("div", function(e) {
  var r = e.$theme.sizing;
  return {
    width: "100%",
    marginBottom: r.scale600
  };
});
tr.displayName = "ControlContainer";
tr.displayName = "ControlContainer";
function Ee() {
  return Ee = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, Ee.apply(this, arguments);
}
function nt(e) {
  "@babel/helpers - typeof";
  return nt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, nt(e);
}
function Ia(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function Ea(e, r) {
  for (var n = 0; n < r.length; n++) {
    var a = r[n];
    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
  }
}
function Ha(e, r, n) {
  return r && Ea(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function xa(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), r && It(e, r);
}
function It(e, r) {
  return It = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(a, t) {
    return a.__proto__ = t, a;
  }, It(e, r);
}
function Aa(e) {
  var r = La();
  return function() {
    var a = at(e), t;
    if (r) {
      var o = at(this).constructor;
      t = Reflect.construct(a, arguments, o);
    } else
      t = a.apply(this, arguments);
    return Ta(this, t);
  };
}
function Ta(e, r) {
  if (r && (nt(r) === "object" || typeof r == "function"))
    return r;
  if (r !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return Ra(e);
}
function Ra(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function La() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function at(e) {
  return at = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, at(e);
}
function ja(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
function Fa(e, r, n, a) {
  return r && typeof r != "boolean" ? typeof r == "function" ? r(a) : r : n && typeof n != "boolean" ? typeof n == "function" ? n(a) : n : e ? typeof e == "function" ? e(a) : e : null;
}
var Et = /* @__PURE__ */ (function(e) {
  xa(n, e);
  var r = Aa(n);
  function n() {
    return Ia(this, n), r.apply(this, arguments);
  }
  return Ha(n, [{
    key: "render",
    value: function() {
      var t = this.props, o = t.overrides, i = o.Label, s = o.LabelEndEnhancer, u = o.LabelContainer, d = o.Caption, f = o.ControlContainer, c = t.label, h = t.caption, m = t.disabled, v = t.error, b = t.positive, D = t.htmlFor, S = t.children, k = t.counter, $ = y.Children.only(S).props, _ = {
        $disabled: !!m,
        $error: !!v,
        $positive: !!b
      }, A = Fe(i) || Gt, H = Fe(s) || Zt, R = Fe(u) || Jt, j = Fe(d) || er, C = Fe(f) || tr, L = Fa(h, v, b, _), I = this.props.labelEndEnhancer;
      if (k) {
        var E = null, T = null, X = null;
        nt(k) === "object" && (T = k.length, E = k.maxLength, X = k.error), E = E || $.maxLength, T == null && typeof $.value == "string" && (T = $.value.length), T == null && (T = 0), _.$length = T, E == null ? I || (I = "".concat(T)) : (_.$maxLength = T, I || (I = "".concat(T, "/").concat(E)), T > E && X == null && (X = !0)), X && (_.$error = !0, _.$counterError = !0);
      }
      return /* @__PURE__ */ y.createElement(y.Fragment, null, c && /* @__PURE__ */ y.createElement(R, Ee({}, _, Be(u)), /* @__PURE__ */ y.createElement(A, Ee({
        "data-baseweb": "form-control-label",
        htmlFor: D || $.id
      }, _, Be(i)), typeof c == "function" ? c(_) : c), !!I && /* @__PURE__ */ y.createElement(H, Ee({}, _, Be(s)), typeof I == "function" ? I(_) : I)), /* @__PURE__ */ y.createElement(Hn, null, function(z) {
        return /* @__PURE__ */ y.createElement(C, Ee({
          "data-baseweb": "form-control-container"
        }, _, Be(f)), y.Children.map(S, function(J, K) {
          if (J) {
            var G = J.key || String(K);
            return /* @__PURE__ */ y.cloneElement(J, {
              key: G,
              "aria-errormessage": v ? z : null,
              "aria-describedby": h || b ? z : null,
              disabled: $.disabled || m,
              error: typeof $.error < "u" ? $.error : _.$error,
              positive: typeof $.positive < "u" ? $.positive : _.$positive
            });
          }
        }), (!!h || !!v || b) && /* @__PURE__ */ y.createElement(j, Ee({
          "data-baseweb": "form-control-caption",
          id: z
        }, _, Be(d)), L));
      }));
    }
  }]), n;
})(y.Component);
ja(Et, "defaultProps", {
  overrides: {},
  label: null,
  caption: null,
  disabled: !1,
  counter: !1
});
function Er(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    r && (a = a.filter(function(t) {
      return Object.getOwnPropertyDescriptor(e, t).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function Hr(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r] != null ? arguments[r] : {};
    r % 2 ? Er(Object(n), !0).forEach(function(a) {
      Ba(e, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Er(Object(n)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return e;
}
function Ba(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var Wa = function(r) {
  return Ma.map(function(n) {
    return {
      id: n.toString(),
      label: r(n)
    };
  });
}, Ya = function(r, n) {
  return r.map(function(a) {
    return n.includes(Number(a.id)) ? a : Hr(Hr({}, a), {}, {
      disabled: !0
    });
  });
}, Na = function(r) {
  var n = r.filterMonthsList, a = r.formatMonthLabel, t = Wa(a);
  return n && (t = Ya(t, n)), t;
};
function Va(e) {
  var r = e.$range, n = r === void 0 ? !1 : r, a = e.$disabled, t = a === void 0 ? !1 : a, o = e.$isHighlighted, i = o === void 0 ? !1 : o, s = e.$isHovered, u = s === void 0 ? !1 : s, d = e.$selected, f = d === void 0 ? !1 : d, c = e.$hasRangeSelected, h = c === void 0 ? !1 : c, m = e.$startDate, v = m === void 0 ? !1 : m, b = e.$endDate, D = b === void 0 ? !1 : b, S = e.$pseudoSelected, k = S === void 0 ? !1 : S, $ = e.$hasRangeHighlighted, _ = $ === void 0 ? !1 : $, A = e.$pseudoHighlighted, H = A === void 0 ? !1 : A, R = e.$hasRangeOnRight, j = R === void 0 ? !1 : R, C = e.$startOfMonth, L = C === void 0 ? !1 : C, I = e.$endOfMonth, E = I === void 0 ? !1 : I, T = e.$outsideMonth, X = T === void 0 ? !1 : T;
  return "".concat(+n).concat(+t).concat(+(i || u)).concat(+f).concat(+h).concat(+v).concat(+D).concat(+k).concat(+_).concat(+H).concat(+(_ && !H && j)).concat(+(_ && !H && !j)).concat(+L).concat(+E).concat(+X);
}
function za(e, r) {
  return Xa(e) || Qa(e, r) || Ua(e, r) || qa();
}
function qa() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ua(e, r) {
  if (e) {
    if (typeof e == "string") return xr(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return xr(e, r);
  }
}
function xr(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function Qa(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function Xa(e) {
  if (Array.isArray(e)) return e;
}
function Ar(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    r && (a = a.filter(function(t) {
      return Object.getOwnPropertyDescriptor(e, t).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function ie(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r] != null ? arguments[r] : {};
    r % 2 ? Ar(Object(n), !0).forEach(function(a) {
      qe(e, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ar(Object(n)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return e;
}
function qe(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var rr = ee("div", function(e) {
  var r = e.$separateRangeInputs;
  return ie({
    width: "100%"
  }, r ? {
    display: "flex",
    justifyContent: "center"
  } : {});
});
rr.displayName = "StyledInputWrapper";
rr.displayName = "StyledInputWrapper";
var nr = ee("div", function(e) {
  var r = e.$theme;
  return ie(ie({}, r.typography.LabelMedium), {}, {
    marginBottom: r.sizing.scale300
  });
});
nr.displayName = "StyledInputLabel";
nr.displayName = "StyledInputLabel";
var ar = ee("div", function(e) {
  var r = e.$theme;
  return {
    width: "100%",
    marginRight: r.sizing.scale300
  };
});
ar.displayName = "StyledStartDate";
ar.displayName = "StyledStartDate";
var or = ee("div", function(e) {
  return e.$theme, {
    width: "100%"
  };
});
or.displayName = "StyledEndDate";
or.displayName = "StyledEndDate";
var ir = ee("div", function(e) {
  var r = e.$theme, n = r.typography, a = r.colors, t = r.borders;
  return ie(ie({}, n.font200), {}, {
    color: a.calendarForeground,
    backgroundColor: a.calendarBackground,
    textAlign: "center",
    borderTopLeftRadius: t.surfaceBorderRadius,
    borderTopRightRadius: t.surfaceBorderRadius,
    borderBottomRightRadius: t.surfaceBorderRadius,
    borderBottomLeftRadius: t.surfaceBorderRadius,
    display: "inline-block"
  });
});
ir.displayName = "StyledRoot";
ir.displayName = "StyledRoot";
var sr = ee("div", function(e) {
  var r = e.$orientation;
  return {
    display: "flex",
    flexDirection: r === Kt.vertical ? "column" : "row"
  };
});
sr.displayName = "StyledMonthContainer";
sr.displayName = "StyledMonthContainer";
var lr = ee("div", function(e) {
  var r = e.$theme.sizing, n = e.$density;
  return {
    paddingTop: r.scale300,
    paddingBottom: n === le.high ? r.scale400 : r.scale300,
    paddingLeft: r.scale500,
    paddingRight: r.scale500
  };
});
lr.displayName = "StyledCalendarContainer";
lr.displayName = "StyledCalendarContainer";
var ot = ee("div", function(e) {
  var r = e.$theme, n = r.direction === "rtl" ? "right" : "left";
  return {
    marginBottom: r.sizing.scale600,
    paddingLeft: r.sizing.scale600,
    paddingRight: r.sizing.scale600,
    textAlign: n
  };
});
ot.displayName = "StyledSelectorContainer";
ot.displayName = "StyledSelectorContainer";
var ur = ee("div", function(e) {
  var r = e.$theme, n = r.typography, a = r.borders, t = r.colors, o = r.sizing, i = e.$density;
  return ie(ie({}, i === le.high ? n.LabelMedium : n.LabelLarge), {}, {
    color: t.calendarHeaderForeground,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: o.scale600,
    paddingBottom: o.scale300,
    paddingLeft: o.scale600,
    paddingRight: o.scale600,
    backgroundColor: t.calendarHeaderBackground,
    borderTopLeftRadius: a.surfaceBorderRadius,
    borderTopRightRadius: a.surfaceBorderRadius,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    // account for the left/right arrow heights
    minHeight: i === le.high ? "calc(".concat(o.scale800, " + ").concat(o.scale0, ")") : o.scale950
  });
});
ur.displayName = "StyledCalendarHeader";
ur.displayName = "StyledCalendarHeader";
var cr = ee("div", function(e) {
  return {
    color: e.$theme.colors.calendarHeaderForeground,
    backgroundColor: e.$theme.colors.calendarHeaderBackground,
    whiteSpace: "nowrap"
  };
});
cr.displayName = "StyledMonthHeader";
cr.displayName = "StyledMonthHeader";
var dr = ee("button", function(e) {
  var r = e.$theme, n = r.typography, a = r.colors, t = e.$isFocusVisible, o = e.$density;
  return ie(ie({}, o === le.high ? n.LabelMedium : n.LabelLarge), {}, {
    alignItems: "center",
    backgroundColor: "transparent",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    color: a.calendarHeaderForeground,
    cursor: "pointer",
    display: "flex",
    outline: "none",
    ":focus": {
      boxShadow: t ? "0 0 0 3px ".concat(a.accent) : "none"
    }
  });
});
dr.displayName = "StyledMonthYearSelectButton";
dr.displayName = "StyledMonthYearSelectButton";
var pr = ee("span", function(e) {
  var r = e.$theme.direction === "rtl" ? "marginRight" : "marginLeft";
  return qe({
    alignItems: "center",
    display: "flex"
  }, r, e.$theme.sizing.scale500);
});
pr.displayName = "StyledMonthYearSelectIconContainer";
pr.displayName = "StyledMonthYearSelectIconContainer";
function hn(e) {
  var r = e.$theme, n = e.$disabled, a = e.$isFocusVisible;
  return {
    boxSizing: "border-box",
    display: "flex",
    color: n ? r.colors.calendarHeaderForegroundDisabled : r.colors.calendarHeaderForeground,
    cursor: n ? "default" : "pointer",
    backgroundColor: "transparent",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingTop: "0",
    paddingBottom: "0",
    paddingLeft: "0",
    paddingRight: "0",
    marginBottom: 0,
    marginTop: 0,
    outline: "none",
    ":focus": n ? {} : {
      boxShadow: a ? "0 0 0 3px ".concat(r.colors.accent) : "none"
    }
  };
}
var fr = ee("button", hn);
fr.displayName = "StyledPrevButton";
fr.displayName = "StyledPrevButton";
var hr = ee("button", hn);
hr.displayName = "StyledNextButton";
hr.displayName = "StyledNextButton";
var gr = ee("div", function(e) {
  return {
    display: "inline-block"
  };
});
gr.displayName = "StyledMonth";
gr.displayName = "StyledMonth";
var yr = ee("div", function(e) {
  var r = e.$theme.sizing;
  return {
    whiteSpace: "nowrap",
    display: "flex",
    marginBottom: r.scale0
  };
});
yr.displayName = "StyledWeek";
yr.displayName = "StyledWeek";
function Z(e, r) {
  var n, a = e.substr(0, 12) + "1" + e.substr(13), t = e.substr(0, 13) + "1" + e.substr(14);
  return n = {}, qe(n, e, r), qe(n, a, r), qe(n, t, r), n;
}
function bt(e, r) {
  var n = r.colors, a = {
    ":before": {
      content: null
    },
    ":after": {
      content: null
    }
  }, t = a, o = {
    color: n.calendarForegroundDisabled,
    ":before": {
      content: null
    },
    ":after": {
      content: null
    }
  }, i = {
    color: n.calendarForegroundDisabled,
    ":before": {
      borderTopStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderRightStyle: "none",
      backgroundColor: "transparent"
    },
    ":after": {
      borderTopLeftRadius: "0%",
      borderTopRightRadius: "0%",
      borderBottomLeftRadius: "0%",
      borderBottomRightRadius: "0%",
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: "transparent",
      borderLeftColor: "transparent"
    }
  }, s = {
    ":before": {
      content: null
    }
  }, u = 1;
  e && e[u] === "1" && (t = o);
  var d = Object.assign(
    {},
    // highlighted date
    Z("001000000000000", {
      color: n.calendarDayForegroundPseudoSelected
    }),
    // selected date
    Z("000100000000000", {
      color: n.calendarDayForegroundSelected
    }),
    // selected highlighted date
    Z("001100000000000", {
      color: n.calendarDayForegroundSelectedHighlighted
    }),
    // disabled date
    {
      "010000000000000": {
        color: n.calendarForegroundDisabled,
        ":after": {
          content: null
        }
      }
    },
    // disabled highlighted date
    {
      "011000000000000": {
        color: n.calendarForegroundDisabled,
        ":after": {
          content: null
        }
      }
    },
    // date outside of the currently displayed month (when peekNextMonth is true)
    Z("000000000000001", i),
    // Range Datepicker
    // range: highlighted date outside of a selected range
    Z("101000000000000", s),
    Z("101010000000000", s),
    // range: selected date
    Z("100100000000000", {
      color: n.calendarDayForegroundSelected
    }),
    // range: selected highlighted date
    // when single date selected in a range
    Z("101100000000000", {
      color: n.calendarDayForegroundSelectedHighlighted,
      ":before": {
        content: null
      }
    }),
    // range: selected start and end dates are the same
    Z("100111100000000", {
      color: n.calendarDayForegroundSelected,
      ":before": {
        content: null
      }
    }),
    Z("101111100000000", {
      color: n.calendarDayForegroundSelectedHighlighted,
      ":before": {
        content: null
      }
    }),
    // range: selected start date
    Z("100111000000000", {
      color: n.calendarDayForegroundSelected
    }),
    // range: selected end date
    Z("100110100000000", {
      color: n.calendarDayForegroundSelected,
      ":before": {
        left: null,
        right: "50%"
      }
    }),
    // range: first selected date while a range is highlighted but no second date selected yet
    // highlighted range on the right from the selected
    Z("100100001010000", {
      color: n.calendarDayForegroundSelected
    }),
    // highlighted range on the left from the selected
    Z("100100001001000", {
      color: n.calendarDayForegroundSelected,
      ":before": {
        left: null,
        right: "50%"
      }
    }),
    // range: second date in a range that is highlighted but not selected
    Z("101000001010000", {
      ":before": {
        left: null,
        right: "50%"
      }
    }),
    {
      "101000001001000": {}
    },
    {
      "101000001001100": {}
    },
    {
      "101000001001010": {}
    },
    // range: pseudo-selected date
    Z("100010010000000", {
      color: n.calendarDayForegroundPseudoSelected,
      ":before": {
        left: "0",
        width: "100%"
      },
      ":after": {
        content: null
      }
    }),
    // range: pseudo-highlighted date (in a range where only one date is
    // selected and second date is highlighted)
    {
      "101000001100000": {
        color: n.calendarDayForegroundPseudoSelected,
        ":before": {
          left: "0",
          width: "100%"
        },
        ":after": {
          content: null
        }
      }
    },
    Z("100000001100000", {
      color: n.calendarDayForegroundPseudoSelected,
      ":before": {
        left: "0",
        width: "100%"
      },
      ":after": {
        content: null
      }
    }),
    // highlighted start date in a range
    Z("101111000000000", {
      color: n.calendarDayForegroundSelectedHighlighted
    }),
    // highlighted end date in a range
    Z("101110100000000", {
      color: n.calendarDayForegroundSelectedHighlighted,
      ":before": {
        left: null,
        right: "50%"
      }
    }),
    // range: pseudo-selected date
    Z("101010010000000", {
      color: n.calendarDayForegroundPseudoSelectedHighlighted,
      ":before": {
        left: "0",
        width: "100%"
      }
    }),
    // Range is true Date outside current month (when peekNextMonth is true)
    Z("100000000000001", i),
    // peekNextMonth is true, date is outside month, start date is selected and range is highlighted is on right
    Z("100000001010001", i),
    // peekNextMonth is true, date is outside month, start date is selected and range is highlighted is on left
    Z("100000001001001", i),
    // peekNextMonth is true, date is outside month, range is selected
    Z("100010000000001", i)
  );
  return d[e] || t;
}
var mr = ee("div", function(e) {
  var r = e.$disabled, n = e.$isFocusVisible, a = e.$isHighlighted, t = e.$peekNextMonth, o = e.$pseudoSelected, i = e.$range, s = e.$selected, u = e.$outsideMonth, d = e.$outsideMonthWithinRange, f = e.$hasDateLabel, c = e.$density, h = e.$hasLockedBehavior, m = e.$selectedInput, v = e.$value, b = e.$theme, D = b.colors, S = b.typography, k = b.sizing, $ = Va(e), _;
  f ? c === le.high ? _ = "60px" : _ = "70px" : c === le.high ? _ = "40px" : _ = "48px";
  var A = Array.isArray(v) ? v : [v, null], H = za(A, 2), R = H[0], j = H[1], C = m === _e.startDate ? j !== null && typeof j < "u" : R !== null && typeof R < "u", L = i && !(h && !C);
  return ie(ie(ie({}, c === le.high ? S.ParagraphSmall : S.ParagraphMedium), {}, {
    boxSizing: "border-box",
    position: "relative",
    cursor: r || !t && u ? "default" : "pointer",
    color: D.calendarForeground,
    display: "inline-block",
    width: c === le.high ? "42px" : "50px",
    height: _,
    // setting lineHeight equal to the contents height to vertically center the text
    lineHeight: c === le.high ? k.scale700 : k.scale900,
    textAlign: "center",
    paddingTop: k.scale300,
    paddingBottom: k.scale300,
    paddingLeft: k.scale300,
    paddingRight: k.scale300,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    outline: "none",
    backgroundColor: "transparent",
    // `transform` creates a stacking context so
    // a z-index used on its' children doesn't
    // interfere with anything outside the component
    transform: "scale(1)"
  }, bt($, e.$theme)), {}, {
    // :after pseudo element defines the selected
    // or highlighted day's circle styles
    ":after": ie(ie({
      zIndex: -1,
      content: '""',
      boxSizing: "border-box",
      display: "inline-block",
      boxShadow: n && (!u || t) ? "0 0 0 3px ".concat(D.accent) : "none",
      backgroundColor: s ? D.calendarDayBackgroundSelectedHighlighted : o && a ? D.calendarDayBackgroundPseudoSelectedHighlighted : D.calendarBackground,
      height: f ? "100%" : c === le.high ? "42px" : "50px",
      width: "100%",
      position: "absolute",
      top: f ? 0 : "-1px",
      left: 0,
      paddingTop: k.scale200,
      paddingBottom: k.scale200,
      borderLeftWidth: "2px",
      borderRightWidth: "2px",
      borderTopWidth: "2px",
      borderBottomWidth: "2px",
      borderLeftStyle: "solid",
      borderRightStyle: "solid",
      borderTopStyle: "solid",
      borderBottomStyle: "solid",
      borderTopColor: D.borderSelected,
      borderBottomColor: D.borderSelected,
      borderRightColor: D.borderSelected,
      borderLeftColor: D.borderSelected,
      borderTopLeftRadius: f ? k.scale800 : "100%",
      borderTopRightRadius: f ? k.scale800 : "100%",
      borderBottomLeftRadius: f ? k.scale800 : "100%",
      borderBottomRightRadius: f ? k.scale800 : "100%"
    }, bt($, e.$theme)[":after"] || {}), d ? {
      content: null
    } : {})
  }, L ? {
    // :before pseudo element defines a grey background style that extends
    // the selected/highlighted day's circle and spans through a range
    ":before": ie(ie({
      zIndex: -1,
      content: '""',
      boxSizing: "border-box",
      display: "inline-block",
      backgroundColor: D.mono300,
      position: "absolute",
      height: "100%",
      width: "50%",
      top: 0,
      left: "50%",
      borderTopWidth: "2px",
      borderBottomWidth: "2px",
      borderLeftWidth: "0",
      borderRightWidth: "0",
      borderTopStyle: "solid",
      borderBottomStyle: "solid",
      borderLeftStyle: "solid",
      borderRightStyle: "solid",
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: "transparent",
      borderRightColor: "transparent"
    }, bt($, e.$theme)[":before"] || {}), d ? {
      backgroundColor: D.mono300,
      left: "0",
      width: "100%",
      content: '""'
    } : {})
  } : (
    // a hack to make flow happy, otherwise it complains about complexity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {}
  ));
});
mr.displayName = "StyledDay";
mr.displayName = "StyledDay";
var vr = ee("div", function(e) {
  var r = e.$theme, n = r.typography, a = r.colors, t = e.$selected;
  return ie(ie({}, n.ParagraphXSmall), {}, {
    color: t ? a.contentInverseTertiary : a.contentTertiary
  });
});
vr.displayName = "StyledDayLabel";
vr.displayName = "StyledDayLabel";
var br = ee("div", function(e) {
  var r = e.$theme, n = r.typography, a = r.colors, t = r.sizing, o = e.$density;
  return ie(ie({}, n.LabelMedium), {}, {
    color: a.contentTertiary,
    boxSizing: "border-box",
    position: "relative",
    cursor: "default",
    display: "inline-block",
    width: o === le.high ? "42px" : "50px",
    height: o === le.high ? "40px" : "48px",
    textAlign: "center",
    // setting lineHeight equal to the contents height to vertically center the text
    lineHeight: t.scale900,
    paddingTop: t.scale300,
    paddingBottom: t.scale300,
    paddingLeft: t.scale200,
    paddingRight: t.scale200,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: "transparent"
  });
});
br.displayName = "StyledWeekdayHeader";
br.displayName = "StyledWeekdayHeader";
function Ht(e) {
  "@babel/helpers - typeof";
  return Ht = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, Ht(e);
}
function me() {
  return me = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, me.apply(this, arguments);
}
function Oe(e, r) {
  return Za(e) || Ja(e, r) || Ga(e, r) || Ka();
}
function Ka() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ga(e, r) {
  if (e) {
    if (typeof e == "string") return Tr(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Tr(e, r);
  }
}
function Tr(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function Ja(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function Za(e) {
  if (Array.isArray(e)) return e;
}
function Rr(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    r && (a = a.filter(function(t) {
      return Object.getOwnPropertyDescriptor(e, t).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function Ze(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r] != null ? arguments[r] : {};
    r % 2 ? Rr(Object(n), !0).forEach(function(a) {
      se(e, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Rr(Object(n)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return e;
}
function eo(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function to(e, r) {
  for (var n = 0; n < r.length; n++) {
    var a = r[n];
    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
  }
}
function ro(e, r, n) {
  return r && to(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function no(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), r && xt(e, r);
}
function xt(e, r) {
  return xt = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(a, t) {
    return a.__proto__ = t, a;
  }, xt(e, r);
}
function ao(e) {
  var r = io();
  return function() {
    var a = it(e), t;
    if (r) {
      var o = it(this).constructor;
      t = Reflect.construct(a, arguments, o);
    } else
      t = a.apply(this, arguments);
    return oo(this, t);
  };
}
function oo(e, r) {
  if (r && (Ht(r) === "object" || typeof r == "function"))
    return r;
  if (r !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return ce(e);
}
function ce(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function io() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function it(e) {
  return it = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, it(e);
}
function se(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var Lr = function(r) {
  return r.$theme, {
    cursor: "pointer"
  };
}, Ot = 2e3, Dt = 2030, jr = 0, Fr = 11, St = {
  NEXT: "next",
  PREVIOUS: "previous"
};
function Br(e) {
  return e.split("-").map(Number);
}
var gn = /* @__PURE__ */ (function(e) {
  no(n, e);
  var r = ao(n);
  function n(a) {
    var t;
    return eo(this, n), t = r.call(this, a), se(ce(t), "dateHelpers", void 0), se(ce(t), "monthItems", void 0), se(ce(t), "yearItems", void 0), se(ce(t), "state", {
      isMonthDropdownOpen: !1,
      isYearDropdownOpen: !1,
      isFocusVisible: !1
    }), se(ce(t), "getDateProp", function() {
      return t.props.date || t.dateHelpers.date();
    }), se(ce(t), "getYearItems", function() {
      var o = t.getDateProp(), i = t.props.maxDate, s = t.props.minDate, u = i ? t.dateHelpers.getYear(i) : Dt, d = s ? t.dateHelpers.getYear(s) : Ot, f = t.dateHelpers.getMonth(o);
      t.yearItems = Array.from({
        length: u - d + 1
      }, function(D, S) {
        return d + S;
      }).map(function(D) {
        return {
          id: D.toString(),
          label: D.toString()
        };
      });
      var c = i ? t.dateHelpers.getMonth(i) : Fr, h = s ? t.dateHelpers.getMonth(s) : jr, m = Array.from({
        length: c + 1
      }, function(D, S) {
        return S;
      }), v = Array.from({
        length: 12 - h
      }, function(D, S) {
        return S + h;
      });
      if (f > m[m.length - 1]) {
        var b = t.yearItems.length - 1;
        t.yearItems[b] = Ze(Ze({}, t.yearItems[b]), {}, {
          disabled: !0
        });
      }
      f < v[0] && (t.yearItems[0] = Ze(Ze({}, t.yearItems[0]), {}, {
        disabled: !0
      }));
    }), se(ce(t), "getMonthItems", function() {
      var o = t.getDateProp(), i = t.dateHelpers.getYear(o), s = t.props.maxDate, u = t.props.minDate, d = s ? t.dateHelpers.getYear(s) : Dt, f = u ? t.dateHelpers.getYear(u) : Ot, c = s ? t.dateHelpers.getMonth(s) : Fr, h = Array.from({
        length: c + 1
      }, function(k, $) {
        return $;
      }), m = u ? t.dateHelpers.getMonth(u) : jr, v = Array.from({
        length: 12 - m
      }, function(k, $) {
        return $ + m;
      }), b = h.filter(function(k) {
        return v.includes(k);
      }), D = i === d && i === f ? b : i === d ? h : i === f ? v : null, S = function($) {
        return t.dateHelpers.getMonthInLocale($, t.props.locale);
      };
      t.monthItems = Na({
        filterMonthsList: D,
        formatMonthLabel: S
      });
    }), se(ce(t), "increaseMonth", function() {
      t.props.onMonthChange && t.props.onMonthChange({
        date: t.dateHelpers.addMonths(
          t.getDateProp(),
          // in a multi-month context, `order` is the number months ahead of
          // the root Calendar month that this CalendarHeader displays. We account
          // for this by incrementing the month by 1, less the value of `order`.
          1 - t.props.order
        )
      });
    }), se(ce(t), "decreaseMonth", function() {
      t.props.onMonthChange && t.props.onMonthChange({
        date: t.dateHelpers.subMonths(t.getDateProp(), 1)
      });
    }), se(ce(t), "isMultiMonthHorizontal", function() {
      var o = t.props, i = o.monthsShown, s = o.orientation;
      return i ? s === Kt.horizontal && i > 1 : !1;
    }), se(ce(t), "isHiddenPaginationButton", function(o) {
      var i = t.props, s = i.monthsShown, u = i.order;
      if (s && t.isMultiMonthHorizontal())
        if (o === St.NEXT) {
          var d = u === s - 1;
          return !d;
        } else {
          var f = u === 0;
          return !f;
        }
      return !1;
    }), se(ce(t), "handleFocus", function(o) {
      on(o) && t.setState({
        isFocusVisible: !0
      });
    }), se(ce(t), "handleBlur", function(o) {
      t.state.isFocusVisible !== !1 && t.setState({
        isFocusVisible: !1
      });
    }), se(ce(t), "renderPreviousMonthButton", function(o) {
      var i = o.locale, s = o.theme, u = t.getDateProp(), d = t.props, f = d.overrides, c = f === void 0 ? {} : f, h = d.density, m = t.dateHelpers.monthDisabledBefore(u, t.props), v = !1;
      m && (v = !0);
      var b = t.dateHelpers.subMonths(u, 1), D = t.props.minDate ? t.dateHelpers.getYear(t.props.minDate) : Ot;
      t.dateHelpers.getYear(b) < D && (v = !0);
      var S = t.isHiddenPaginationButton(St.PREVIOUS);
      S && (v = !0);
      var k = Y(c.PrevButton, fr), $ = Oe(k, 2), _ = $[0], A = $[1], H = Y(c.PrevButtonIcon, s.direction === "rtl" ? $r : kr), R = Oe(H, 2), j = R[0], C = R[1], L = t.decreaseMonth;
      return m && (L = null), /* @__PURE__ */ y.createElement(_, me({
        "aria-label": i.datepicker.previousMonth,
        tabIndex: 0,
        onClick: L,
        disabled: v,
        $isFocusVisible: t.state.isFocusVisible,
        type: "button",
        $disabled: v,
        $order: t.props.order
      }, A), S ? null : /* @__PURE__ */ y.createElement(j, me({
        size: h === le.high ? 24 : 36,
        overrides: {
          Svg: {
            style: Lr
          }
        }
      }, C)));
    }), se(ce(t), "renderNextMonthButton", function(o) {
      var i = o.locale, s = o.theme, u = t.getDateProp(), d = t.props, f = d.overrides, c = f === void 0 ? {} : f, h = d.density, m = t.dateHelpers.monthDisabledAfter(u, t.props), v = !1;
      m && (v = !0);
      var b = t.dateHelpers.addMonths(u, 1), D = t.props.maxDate ? t.dateHelpers.getYear(t.props.maxDate) : Dt;
      t.dateHelpers.getYear(b) > D && (v = !0);
      var S = t.isHiddenPaginationButton(St.NEXT);
      S && (v = !0);
      var k = Y(c.NextButton, hr), $ = Oe(k, 2), _ = $[0], A = $[1], H = Y(c.NextButtonIcon, s.direction === "rtl" ? kr : $r), R = Oe(H, 2), j = R[0], C = R[1], L = t.increaseMonth;
      return m && (L = null), /* @__PURE__ */ y.createElement(_, me({
        "aria-label": i.datepicker.nextMonth,
        tabIndex: 0,
        onClick: L,
        disabled: v,
        type: "button",
        $disabled: v,
        $isFocusVisible: t.state.isFocusVisible,
        $order: t.props.order
      }, A), S ? null : /* @__PURE__ */ y.createElement(j, me({
        size: h === le.high ? 24 : 36,
        overrides: {
          Svg: {
            style: Lr
          }
        }
      }, C)));
    }), se(ce(t), "canArrowsOpenDropdown", function(o) {
      return !t.state.isMonthDropdownOpen && !t.state.isYearDropdownOpen && (o.key === "ArrowUp" || o.key === "ArrowDown");
    }), se(ce(t), "renderMonthYearDropdown", function() {
      var o = t.getDateProp(), i = t.dateHelpers.getMonth(o), s = t.dateHelpers.getYear(o), u = t.props, d = u.locale, f = u.overrides, c = f === void 0 ? {} : f, h = u.density, m = Y(c.MonthYearSelectButton, dr), v = Oe(m, 2), b = v[0], D = v[1], S = Y(c.MonthYearSelectIconContainer, pr), k = Oe(S, 2), $ = k[0], _ = k[1], A = Y(c.MonthYearSelectPopover, sn), H = Oe(A, 2), R = H[0], j = H[1], C = Y(c.MonthYearSelectStatefulMenu, xn), L = Oe(C, 2), I = L[0], E = L[1];
      E.overrides = ln({
        List: {
          style: {
            height: "auto",
            maxHeight: "257px"
          }
        }
      }, E && E.overrides);
      var T = t.monthItems.findIndex(function(K) {
        return K.id === t.dateHelpers.getMonth(o).toString();
      }), X = t.yearItems.findIndex(function(K) {
        return K.id === t.dateHelpers.getYear(o).toString();
      }), z = "".concat(t.dateHelpers.getMonthInLocale(t.dateHelpers.getMonth(o), d)), J = "".concat(t.dateHelpers.getYear(o));
      return t.isMultiMonthHorizontal() ? /* @__PURE__ */ y.createElement("div", null, "".concat(z, " ").concat(J)) : /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(R, me({
        placement: "bottom",
        autoFocus: !0,
        focusLock: !0,
        isOpen: t.state.isMonthDropdownOpen,
        onClick: function() {
          t.setState(function(G) {
            return {
              isMonthDropdownOpen: !G.isMonthDropdownOpen
            };
          });
        },
        onClickOutside: function() {
          return t.setState({
            isMonthDropdownOpen: !1
          });
        },
        onEsc: function() {
          return t.setState({
            isMonthDropdownOpen: !1
          });
        },
        content: function() {
          return /* @__PURE__ */ y.createElement(I, me({
            initialState: {
              highlightedIndex: T,
              isFocused: !0
            },
            items: t.monthItems,
            onItemSelect: function(p) {
              var O = p.item, w = p.event;
              w.preventDefault();
              var g = Br(O.id), l = t.dateHelpers.set(o, {
                year: s,
                month: g
              });
              t.props.onMonthChange && t.props.onMonthChange({
                date: l
              }), t.setState({
                isMonthDropdownOpen: !1
              });
            }
          }, E));
        }
      }, j), /* @__PURE__ */ y.createElement(b, me({
        "aria-live": "polite",
        type: "button",
        $isFocusVisible: t.state.isFocusVisible,
        $density: h,
        onKeyUp: function(G) {
          t.canArrowsOpenDropdown(G) && t.setState({
            isMonthDropdownOpen: !0
          });
        },
        onKeyDown: function(G) {
          t.canArrowsOpenDropdown(G) && G.preventDefault(), G.key === "Tab" && t.setState({
            isMonthDropdownOpen: !1
          });
        }
      }, D), z, /* @__PURE__ */ y.createElement($, _, /* @__PURE__ */ y.createElement(Or, {
        title: "",
        overrides: {
          Svg: {
            props: {
              role: "presentation"
            }
          }
        },
        size: h === le.high ? 16 : 24
      })))), /* @__PURE__ */ y.createElement(R, me({
        placement: "bottom",
        focusLock: !0,
        isOpen: t.state.isYearDropdownOpen,
        onClick: function() {
          t.setState(function(G) {
            return {
              isYearDropdownOpen: !G.isYearDropdownOpen
            };
          });
        },
        onClickOutside: function() {
          return t.setState({
            isYearDropdownOpen: !1
          });
        },
        onEsc: function() {
          return t.setState({
            isYearDropdownOpen: !1
          });
        },
        content: function() {
          return /* @__PURE__ */ y.createElement(I, me({
            initialState: {
              highlightedIndex: X,
              isFocused: !0
            },
            items: t.yearItems,
            onItemSelect: function(p) {
              var O = p.item, w = p.event;
              w.preventDefault();
              var g = Br(O.id), l = t.dateHelpers.set(o, {
                year: g,
                month: i
              });
              t.props.onYearChange && t.props.onYearChange({
                date: l
              }), t.setState({
                isYearDropdownOpen: !1
              });
            }
          }, E));
        }
      }, j), /* @__PURE__ */ y.createElement(b, me({
        "aria-live": "polite",
        type: "button",
        $isFocusVisible: t.state.isFocusVisible,
        $density: h,
        onKeyUp: function(G) {
          t.canArrowsOpenDropdown(G) && t.setState({
            isYearDropdownOpen: !0
          });
        },
        onKeyDown: function(G) {
          t.canArrowsOpenDropdown(G) && G.preventDefault(), G.key === "Tab" && t.setState({
            isYearDropdownOpen: !1
          });
        }
      }, D), J, /* @__PURE__ */ y.createElement($, _, /* @__PURE__ */ y.createElement(Or, {
        title: "",
        overrides: {
          Svg: {
            props: {
              role: "presentation"
            }
          }
        },
        size: h === le.high ? 16 : 24
      })))));
    }), t.dateHelpers = new Re(a.adapter), t.monthItems = [], t.yearItems = [], t;
  }
  return ro(n, [{
    key: "componentDidMount",
    value: function() {
      this.getYearItems(), this.getMonthItems();
    }
  }, {
    key: "componentDidUpdate",
    value: function(t) {
      var o = this.dateHelpers.getMonth(this.props.date) !== this.dateHelpers.getMonth(t.date), i = this.dateHelpers.getYear(this.props.date) !== this.dateHelpers.getYear(t.date);
      o && this.getYearItems(), i && this.getMonthItems();
    }
  }, {
    key: "render",
    value: function() {
      var t = this, o = this.props, i = o.overrides, s = i === void 0 ? {} : i, u = o.density, d = Y(s.CalendarHeader, ur), f = Oe(d, 2), c = f[0], h = f[1], m = Y(s.MonthHeader, cr), v = Oe(m, 2), b = v[0], D = v[1], S = Y(s.WeekdayHeader, br), k = Oe(S, 2), $ = k[0], _ = k[1], A = this.dateHelpers.getStartOfWeek(this.getDateProp(), this.props.locale);
      return /* @__PURE__ */ y.createElement(An.Consumer, null, function(H) {
        return /* @__PURE__ */ y.createElement(Qe.Consumer, null, function(R) {
          return /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(c, me({}, h, {
            $density: t.props.density,
            onFocus: Rn(h, t.handleFocus),
            onBlur: Tn(h, t.handleBlur)
          }), t.renderPreviousMonthButton({
            locale: R,
            theme: H
          }), t.renderMonthYearDropdown(), t.renderNextMonthButton({
            locale: R,
            theme: H
          })), /* @__PURE__ */ y.createElement(b, me({
            role: "presentation"
          }, D), fn.map(function(j) {
            var C = t.dateHelpers.addDays(A, j);
            return /* @__PURE__ */ y.createElement($, me({
              key: j,
              alt: t.dateHelpers.getWeekdayInLocale(C, t.props.locale)
            }, _, {
              $density: u
            }), t.dateHelpers.getWeekdayMinInLocale(C, t.props.locale));
          })));
        });
      });
    }
  }]), n;
})(y.Component);
se(gn, "defaultProps", {
  adapter: Le,
  locale: null,
  maxDate: null,
  minDate: null,
  onYearChange: function() {
  },
  overrides: {}
});
function At(e) {
  "@babel/helpers - typeof";
  return At = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, At(e);
}
function Ue() {
  return Ue = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, Ue.apply(this, arguments);
}
function We(e, r) {
  return co(e) || uo(e, r) || lo(e, r) || so();
}
function so() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lo(e, r) {
  if (e) {
    if (typeof e == "string") return Wr(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Wr(e, r);
  }
}
function Wr(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function uo(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function co(e) {
  if (Array.isArray(e)) return e;
}
function po(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function fo(e, r) {
  for (var n = 0; n < r.length; n++) {
    var a = r[n];
    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
  }
}
function ho(e, r, n) {
  return r && fo(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function go(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), r && Tt(e, r);
}
function Tt(e, r) {
  return Tt = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(a, t) {
    return a.__proto__ = t, a;
  }, Tt(e, r);
}
function yo(e) {
  var r = vo();
  return function() {
    var a = st(e), t;
    if (r) {
      var o = st(this).constructor;
      t = Reflect.construct(a, arguments, o);
    } else
      t = a.apply(this, arguments);
    return mo(this, t);
  };
}
function mo(e, r) {
  if (r && (At(r) === "object" || typeof r == "function"))
    return r;
  if (r !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return de(e);
}
function de(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function vo() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function st(e) {
  return st = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, st(e);
}
function pe(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var yn = /* @__PURE__ */ (function(e) {
  go(n, e);
  var r = yo(n);
  function n(a) {
    var t;
    return po(this, n), t = r.call(this, a), pe(de(t), "dayElm", void 0), pe(de(t), "state", {
      isHovered: !1,
      isFocusVisible: !1
    }), pe(de(t), "dateHelpers", void 0), pe(de(t), "getDateProp", function() {
      return t.props.date === void 0 ? t.dateHelpers.date() : t.props.date;
    }), pe(de(t), "getMonthProp", function() {
      return t.props.month === void 0 || t.props.month === null ? t.dateHelpers.getMonth(t.getDateProp()) : t.props.month;
    }), pe(de(t), "onSelect", function(o) {
      var i = t.props, s = i.range, u = i.value, d;
      if (Array.isArray(u) && s && t.props.hasLockedBehavior) {
        var f = t.props.value, c = null, h = null;
        t.props.selectedInput === _e.startDate ? (c = o, h = Array.isArray(f) && f[1] ? f[1] : null) : t.props.selectedInput === _e.endDate && (c = Array.isArray(f) && f[0] ? f[0] : null, h = o), d = [c], h && d.push(h);
      } else if (Array.isArray(u) && s && !t.props.hasLockedBehavior) {
        var m = We(u, 2), v = m[0], b = m[1];
        !v && !b || v && b ? d = [o, null] : !v && b && t.dateHelpers.isAfter(b, o) ? d = [o, b] : !v && b && t.dateHelpers.isAfter(o, b) ? d = [b, o] : v && !b && t.dateHelpers.isAfter(o, v) ? d = [v, o] : d = [o, v];
      } else
        d = o;
      t.props.onSelect({
        date: d
      });
    }), pe(de(t), "onKeyDown", function(o) {
      var i = t.getDateProp(), s = t.props, u = s.highlighted, d = s.disabled;
      o.key === "Enter" && u && !d && (o.preventDefault(), t.onSelect(i));
    }), pe(de(t), "onClick", function(o) {
      var i = t.getDateProp(), s = t.props.disabled;
      s || (t.props.onClick({
        event: o,
        date: i
      }), t.onSelect(i));
    }), pe(de(t), "onFocus", function(o) {
      on(o) && t.setState({
        isFocusVisible: !0
      }), t.props.onFocus({
        event: o,
        date: t.getDateProp()
      });
    }), pe(de(t), "onBlur", function(o) {
      t.state.isFocusVisible !== !1 && t.setState({
        isFocusVisible: !1
      }), t.props.onBlur({
        event: o,
        date: t.getDateProp()
      });
    }), pe(de(t), "onMouseOver", function(o) {
      t.setState({
        isHovered: !0
      }), t.props.onMouseOver({
        event: o,
        date: t.getDateProp()
      });
    }), pe(de(t), "onMouseLeave", function(o) {
      t.setState({
        isHovered: !1
      }), t.props.onMouseLeave({
        event: o,
        date: t.getDateProp()
      });
    }), pe(de(t), "isOutsideMonth", function() {
      var o = t.getMonthProp();
      return o !== void 0 && o !== t.dateHelpers.getMonth(t.getDateProp());
    }), pe(de(t), "getOrderedDates", function() {
      var o = t.props, i = o.highlightedDate, s = o.value;
      if (!s || !Array.isArray(s) || !s[0] || !s[1] && !i)
        return [];
      var u = s[0], d = s.length > 1 && s[1] ? s[1] : i;
      if (!u || !d)
        return [];
      var f = t.clampToDayStart(u), c = t.clampToDayStart(d);
      return t.dateHelpers.isAfter(f, c) ? [c, f] : [f, c];
    }), pe(de(t), "isOutsideOfMonthButWithinRange", function() {
      var o = t.clampToDayStart(t.getDateProp()), i = t.getOrderedDates();
      if (i.length < 2 || t.dateHelpers.isSameDay(i[0], i[1]))
        return !1;
      var s = t.dateHelpers.getDate(o);
      if (s > 15) {
        var u = t.clampToDayStart(t.dateHelpers.addDays(t.dateHelpers.getEndOfMonth(o), 1));
        return t.dateHelpers.isOnOrBeforeDay(i[0], t.dateHelpers.getEndOfMonth(o)) && t.dateHelpers.isOnOrAfterDay(i[1], u);
      } else {
        var d = t.clampToDayStart(t.dateHelpers.subDays(t.dateHelpers.getStartOfMonth(o), 1));
        return t.dateHelpers.isOnOrAfterDay(i[1], t.dateHelpers.getStartOfMonth(o)) && t.dateHelpers.isOnOrBeforeDay(i[0], d);
      }
    }), pe(de(t), "clampToDayStart", function(o) {
      var i = t.dateHelpers, s = i.setSeconds, u = i.setMinutes, d = i.setHours;
      return s(u(d(o, 0), 0), 0);
    }), t.dateHelpers = new Re(a.adapter), t;
  }
  return ho(n, [{
    key: "componentDidMount",
    value: function() {
      this.dayElm && this.props.focusedCalendar && (this.props.highlighted || !this.props.highlightedDate && this.isSelected()) && this.dayElm.focus();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, {
    key: "componentDidUpdate",
    value: function(t) {
      this.dayElm && this.props.focusedCalendar && (this.props.highlighted || !this.props.highlightedDate && this.isSelected()) && this.dayElm.focus();
    }
  }, {
    key: "isSelected",
    value: function() {
      var t = this.getDateProp(), o = this.props.value;
      return Array.isArray(o) ? this.dateHelpers.isSameDay(t, o[0]) || this.dateHelpers.isSameDay(t, o[1]) : this.dateHelpers.isSameDay(t, o);
    }
  }, {
    key: "isPseudoSelected",
    value: (
      // calculated for range case only
      function() {
        var t = this.getDateProp(), o = this.props.value;
        if (Array.isArray(o)) {
          var i = We(o, 2), s = i[0], u = i[1];
          if (!s && !u)
            return !1;
          if (s && u)
            return this.dateHelpers.isDayInRange(this.clampToDayStart(t), this.clampToDayStart(s), this.clampToDayStart(u));
        }
      }
    )
    // calculated for range case only
  }, {
    key: "isPseudoHighlighted",
    value: function() {
      var t = this.getDateProp(), o = this.props, i = o.value, s = o.highlightedDate;
      if (Array.isArray(i)) {
        var u = We(i, 2), d = u[0], f = u[1];
        if (!d && !f)
          return !1;
        if (s && d && !f)
          return this.dateHelpers.isAfter(s, d) ? this.dateHelpers.isDayInRange(this.clampToDayStart(t), this.clampToDayStart(d), this.clampToDayStart(s)) : this.dateHelpers.isDayInRange(this.clampToDayStart(t), this.clampToDayStart(s), this.clampToDayStart(d));
        if (s && !d && f)
          return this.dateHelpers.isAfter(s, f) ? this.dateHelpers.isDayInRange(this.clampToDayStart(t), this.clampToDayStart(f), this.clampToDayStart(s)) : this.dateHelpers.isDayInRange(this.clampToDayStart(t), this.clampToDayStart(s), this.clampToDayStart(f));
      }
    }
  }, {
    key: "getSharedProps",
    value: function() {
      var t = this.getDateProp(), o = this.props, i = o.value, s = o.highlightedDate, u = o.range, d = o.highlighted, f = o.peekNextMonth, c = d, h = this.isSelected(), m = !!(Array.isArray(i) && u && s && (i[0] && !i[1] && !this.dateHelpers.isSameDay(i[0], s) || !i[0] && i[1] && !this.dateHelpers.isSameDay(i[1], s))), v = !f && this.isOutsideMonth(), b = !!(Array.isArray(i) && u && v && !f && this.isOutsideOfMonthButWithinRange());
      return {
        $date: t,
        $density: this.props.density,
        $disabled: this.props.disabled,
        $endDate: Array.isArray(i) && !!(i[0] && i[1]) && u && h && this.dateHelpers.isSameDay(t, i[1]) || !1,
        $hasDateLabel: !!this.props.dateLabel,
        $hasRangeHighlighted: m,
        $hasRangeOnRight: Array.isArray(i) && m && s && (i[0] && this.dateHelpers.isAfter(s, i[0]) || i[1] && this.dateHelpers.isAfter(s, i[1])),
        $hasRangeSelected: Array.isArray(i) ? !!(i[0] && i[1]) : !1,
        $highlightedDate: s,
        $isHighlighted: c,
        $isHovered: this.state.isHovered,
        $isFocusVisible: this.state.isFocusVisible,
        $startOfMonth: this.dateHelpers.isStartOfMonth(t),
        $endOfMonth: this.dateHelpers.isEndOfMonth(t),
        $month: this.getMonthProp(),
        $outsideMonth: v,
        $outsideMonthWithinRange: b,
        $peekNextMonth: f,
        $pseudoHighlighted: u && !c && !h ? this.isPseudoHighlighted() : !1,
        $pseudoSelected: u && !h ? this.isPseudoSelected() : !1,
        $range: u,
        $selected: h,
        $startDate: Array.isArray(i) && i[0] && i[1] && u && h ? this.dateHelpers.isSameDay(t, i[0]) : !1,
        $hasLockedBehavior: this.props.hasLockedBehavior,
        $selectedInput: this.props.selectedInput,
        $value: this.props.value
      };
    }
  }, {
    key: "getAriaLabel",
    value: function(t, o) {
      var i = this.getDateProp();
      return "".concat(t.$selected ? t.$range ? t.$endDate ? o.datepicker.selectedEndDateLabel : o.datepicker.selectedStartDateLabel : o.datepicker.selectedLabel : t.$disabled ? o.datepicker.dateNotAvailableLabel : o.datepicker.chooseLabel, " ").concat(this.dateHelpers.format(i, "fullOrdinalWeek", this.props.locale), ". ").concat(t.$disabled ? "" : o.datepicker.dateAvailableLabel);
    }
  }, {
    key: "render",
    value: function() {
      var t = this, o = this.getDateProp(), i = this.props, s = i.peekNextMonth, u = i.overrides, d = u === void 0 ? {} : u, f = this.getSharedProps(), c = Y(d.Day, mr), h = We(c, 2), m = h[0], v = h[1], b = Y(d.DayLabel, vr), D = We(b, 2), S = D[0], k = D[1], $ = this.props.dateLabel && this.props.dateLabel(o);
      return !s && f.$outsideMonth ? /* @__PURE__ */ y.createElement(m, Ue({
        role: "gridcell"
      }, f, v, {
        onFocus: this.onFocus,
        onBlur: this.onBlur
      })) : (
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        /* @__PURE__ */ y.createElement(Qe.Consumer, null, function(_) {
          return /* @__PURE__ */ y.createElement(m, Ue({
            "aria-label": t.getAriaLabel(f, _),
            ref: function(H) {
              t.dayElm = H;
            },
            role: "gridcell",
            "aria-roledescription": "button",
            tabIndex: t.props.highlighted || !t.props.highlightedDate && t.isSelected() ? 0 : -1
          }, f, v, {
            // Adding event handlers after customers overrides in order to
            // make sure the components functions as expected
            // We can extract the handlers from props overrides
            // and call it along with internal handlers by creating an inline handler
            onFocus: t.onFocus,
            onBlur: t.onBlur,
            onClick: t.onClick,
            onKeyDown: t.onKeyDown,
            onMouseOver: t.onMouseOver,
            onMouseLeave: t.onMouseLeave
          }), /* @__PURE__ */ y.createElement("div", null, t.dateHelpers.getDate(o)), $ ? /* @__PURE__ */ y.createElement(S, Ue({}, f, k), $) : null);
        })
      );
    }
  }]), n;
})(y.Component);
pe(yn, "defaultProps", {
  disabled: !1,
  highlighted: !1,
  range: !1,
  adapter: Le,
  onClick: function() {
  },
  onSelect: function() {
  },
  onFocus: function() {
  },
  onBlur: function() {
  },
  onMouseOver: function() {
  },
  onMouseLeave: function() {
  },
  overrides: {},
  peekNextMonth: !0,
  value: null
});
function Rt(e) {
  "@babel/helpers - typeof";
  return Rt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, Rt(e);
}
function Lt() {
  return Lt = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, Lt.apply(this, arguments);
}
function bo(e, r) {
  return wo(e) || So(e, r) || Do(e, r) || Oo();
}
function Oo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Do(e, r) {
  if (e) {
    if (typeof e == "string") return Yr(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Yr(e, r);
  }
}
function Yr(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function So(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function wo(e) {
  if (Array.isArray(e)) return e;
}
function ko(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function _o(e, r) {
  for (var n = 0; n < r.length; n++) {
    var a = r[n];
    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
  }
}
function $o(e, r, n) {
  return r && _o(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Mo(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), r && jt(e, r);
}
function jt(e, r) {
  return jt = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(a, t) {
    return a.__proto__ = t, a;
  }, jt(e, r);
}
function Po(e) {
  var r = Io();
  return function() {
    var a = lt(e), t;
    if (r) {
      var o = lt(this).constructor;
      t = Reflect.construct(a, arguments, o);
    } else
      t = a.apply(this, arguments);
    return Co(this, t);
  };
}
function Co(e, r) {
  if (r && (Rt(r) === "object" || typeof r == "function"))
    return r;
  if (r !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return Ft(e);
}
function Ft(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Io() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function lt(e) {
  return lt = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, lt(e);
}
function Bt(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var mn = /* @__PURE__ */ (function(e) {
  Mo(n, e);
  var r = Po(n);
  function n(a) {
    var t;
    return ko(this, n), t = r.call(this, a), Bt(Ft(t), "dateHelpers", void 0), Bt(Ft(t), "renderDays", function() {
      var o = t.dateHelpers.getStartOfWeek(t.props.date || t.dateHelpers.date(), t.props.locale), i = [];
      return i.concat(fn.map(function(s) {
        var u = t.dateHelpers.addDays(o, s);
        return (
          // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
          /* @__PURE__ */ y.createElement(yn, {
            adapter: t.props.adapter,
            date: u,
            dateLabel: t.props.dateLabel,
            density: t.props.density,
            disabled: t.dateHelpers.isDayDisabled(u, t.props),
            excludeDates: t.props.excludeDates,
            filterDate: t.props.filterDate,
            highlightedDate: t.props.highlightedDate,
            highlighted: t.dateHelpers.isSameDay(u, t.props.highlightedDate),
            includeDates: t.props.includeDates,
            focusedCalendar: t.props.focusedCalendar,
            range: t.props.range,
            key: s,
            locale: t.props.locale,
            minDate: t.props.minDate,
            maxDate: t.props.maxDate,
            month: t.props.month,
            onSelect: t.props.onChange,
            onBlur: t.props.onDayBlur,
            onFocus: t.props.onDayFocus,
            onClick: t.props.onDayClick,
            onMouseOver: t.props.onDayMouseOver,
            onMouseLeave: t.props.onDayMouseLeave,
            overrides: t.props.overrides,
            peekNextMonth: t.props.peekNextMonth,
            value: t.props.value,
            hasLockedBehavior: t.props.hasLockedBehavior,
            selectedInput: t.props.selectedInput
          })
        );
      }));
    }), t.dateHelpers = new Re(a.adapter), t;
  }
  return $o(n, [{
    key: "render",
    value: function() {
      var t = this.props.overrides, o = t === void 0 ? {} : t, i = Y(o.Week, yr), s = bo(i, 2), u = s[0], d = s[1];
      return /* @__PURE__ */ y.createElement(u, Lt({
        role: "row"
      }, d), this.renderDays());
    }
  }]), n;
})(y.Component);
Bt(mn, "defaultProps", {
  adapter: Le,
  highlightedDate: null,
  onDayClick: function() {
  },
  onDayFocus: function() {
  },
  onDayBlur: function() {
  },
  onDayMouseOver: function() {
  },
  onDayMouseLeave: function() {
  },
  onChange: function() {
  },
  overrides: {},
  peekNextMonth: !1
});
function Wt(e) {
  "@babel/helpers - typeof";
  return Wt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, Wt(e);
}
function Eo(e, r) {
  return To(e) || Ao(e, r) || xo(e, r) || Ho();
}
function Ho() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function xo(e, r) {
  if (e) {
    if (typeof e == "string") return Nr(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Nr(e, r);
  }
}
function Nr(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function Ao(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function To(e) {
  if (Array.isArray(e)) return e;
}
function Ro(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function Lo(e, r) {
  for (var n = 0; n < r.length; n++) {
    var a = r[n];
    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
  }
}
function jo(e, r, n) {
  return r && Lo(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Fo(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), r && Yt(e, r);
}
function Yt(e, r) {
  return Yt = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(a, t) {
    return a.__proto__ = t, a;
  }, Yt(e, r);
}
function Bo(e) {
  var r = Yo();
  return function() {
    var a = ut(e), t;
    if (r) {
      var o = ut(this).constructor;
      t = Reflect.construct(a, arguments, o);
    } else
      t = a.apply(this, arguments);
    return Wo(this, t);
  };
}
function Wo(e, r) {
  if (r && (Wt(r) === "object" || typeof r == "function"))
    return r;
  if (r !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return Ve(e);
}
function Ve(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Yo() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function ut(e) {
  return ut = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, ut(e);
}
function ze(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var No = {
  dateLabel: null,
  density: le.high,
  excludeDates: null,
  filterDate: null,
  highlightDates: null,
  includeDates: null,
  locale: null,
  maxDate: null,
  minDate: null,
  month: null,
  adapter: Le,
  onDayClick: function() {
  },
  onDayFocus: function() {
  },
  onDayBlur: function() {
  },
  onDayMouseOver: function() {
  },
  onDayMouseLeave: function() {
  },
  overrides: {},
  peekNextMonth: !1,
  value: null
}, Vo = 6, vn = /* @__PURE__ */ (function(e) {
  Fo(n, e);
  var r = Bo(n);
  function n(a) {
    var t;
    return Ro(this, n), t = r.call(this, a), ze(Ve(t), "dateHelpers", void 0), ze(Ve(t), "getDateProp", function() {
      return t.props.date || t.dateHelpers.date();
    }), ze(Ve(t), "isWeekInMonth", function(o) {
      var i = t.getDateProp(), s = t.dateHelpers.addDays(o, 6);
      return t.dateHelpers.isSameMonth(o, i) || t.dateHelpers.isSameMonth(s, i);
    }), ze(Ve(t), "renderWeeks", function() {
      for (var o = [], i = t.dateHelpers.getStartOfWeek(t.dateHelpers.getStartOfMonth(t.getDateProp()), t.props.locale), s = 0, u = !0; u || t.props.fixedHeight && t.props.peekNextMonth && s < Vo; )
        o.push(/* @__PURE__ */ y.createElement(mn, {
          adapter: t.props.adapter,
          date: i,
          dateLabel: t.props.dateLabel,
          density: t.props.density,
          excludeDates: t.props.excludeDates,
          filterDate: t.props.filterDate,
          highlightedDate: t.props.highlightedDate,
          includeDates: t.props.includeDates,
          focusedCalendar: t.props.focusedCalendar,
          range: t.props.range,
          key: s,
          locale: t.props.locale,
          minDate: t.props.minDate,
          maxDate: t.props.maxDate,
          month: t.dateHelpers.getMonth(t.getDateProp()),
          onDayBlur: t.props.onDayBlur,
          onDayFocus: t.props.onDayFocus,
          onDayClick: t.props.onDayClick,
          onDayMouseOver: t.props.onDayMouseOver,
          onDayMouseLeave: t.props.onDayMouseLeave,
          onChange: t.props.onChange,
          overrides: t.props.overrides,
          peekNextMonth: t.props.peekNextMonth,
          value: t.props.value,
          hasLockedBehavior: t.props.hasLockedBehavior,
          selectedInput: t.props.selectedInput
        })), s++, i = t.dateHelpers.addWeeks(i, 1), u = t.isWeekInMonth(i);
      return o;
    }), t.dateHelpers = new Re(a.adapter), t;
  }
  return jo(n, [{
    key: "render",
    value: function() {
      var t = this.props.overrides, o = t === void 0 ? {} : t, i = Y(o.Month, gr), s = Eo(i, 2), u = s[0], d = s[1];
      return /* @__PURE__ */ y.createElement(u, d, this.renderWeeks());
    }
  }]), n;
})(y.Component);
ze(vn, "defaultProps", No);
function Nt(e) {
  "@babel/helpers - typeof";
  return Nt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, Nt(e);
}
var zo = ["overrides"];
function qo(e, r) {
  if (e == null) return {};
  var n = Uo(e, r), a, t;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (t = 0; t < o.length; t++)
      a = o[t], !(r.indexOf(a) >= 0) && Object.prototype.propertyIsEnumerable.call(e, a) && (n[a] = e[a]);
  }
  return n;
}
function Uo(e, r) {
  if (e == null) return {};
  var n = {}, a = Object.keys(e), t, o;
  for (o = 0; o < a.length; o++)
    t = a[o], !(r.indexOf(t) >= 0) && (n[t] = e[t]);
  return n;
}
function we(e, r) {
  return Ko(e) || Xo(e, r) || bn(e, r) || Qo();
}
function Qo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xo(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function Ko(e) {
  if (Array.isArray(e)) return e;
}
function wt(e) {
  return Zo(e) || Jo(e) || bn(e) || Go();
}
function Go() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function bn(e, r) {
  if (e) {
    if (typeof e == "string") return Vt(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Vt(e, r);
  }
}
function Jo(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Zo(e) {
  if (Array.isArray(e)) return Vt(e);
}
function Vt(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function ke() {
  return ke = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, ke.apply(this, arguments);
}
function ei(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function ti(e, r) {
  for (var n = 0; n < r.length; n++) {
    var a = r[n];
    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
  }
}
function ri(e, r, n) {
  return r && ti(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function ni(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), r && zt(e, r);
}
function zt(e, r) {
  return zt = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(a, t) {
    return a.__proto__ = t, a;
  }, zt(e, r);
}
function ai(e) {
  var r = ii();
  return function() {
    var a = ct(e), t;
    if (r) {
      var o = ct(this).constructor;
      t = Reflect.construct(a, arguments, o);
    } else
      t = a.apply(this, arguments);
    return oi(this, t);
  };
}
function oi(e, r) {
  if (r && (Nt(r) === "object" || typeof r == "function"))
    return r;
  if (r !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return re(e);
}
function re(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ii() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function ct(e) {
  return ct = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, ct(e);
}
function ne(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var On = /* @__PURE__ */ (function(e) {
  ni(n, e);
  var r = ai(n);
  function n(a) {
    var t;
    ei(this, n), t = r.call(this, a), ne(re(t), "dateHelpers", void 0), ne(re(t), "calendar", void 0), ne(re(t), "getDateInView", function() {
      var c = t.props, h = c.highlightedDate, m = c.value, v = t.dateHelpers.getEffectiveMinDate(t.props), b = t.dateHelpers.getEffectiveMaxDate(t.props), D = t.dateHelpers.date(), S = t.getSingleDate(m) || h;
      return S || (v && t.dateHelpers.isBefore(D, v) ? v : b && t.dateHelpers.isAfter(D, b) ? b : D);
    }), ne(re(t), "handleMonthChange", function(c) {
      t.setHighlightedDate(t.dateHelpers.getStartOfMonth(c)), t.props.onMonthChange && t.props.onMonthChange({
        date: c
      });
    }), ne(re(t), "handleYearChange", function(c) {
      t.setHighlightedDate(c), t.props.onYearChange && t.props.onYearChange({
        date: c
      });
    }), ne(re(t), "changeMonth", function(c) {
      var h = c.date;
      t.setState({
        date: h
      }, function() {
        return t.handleMonthChange(t.state.date);
      });
    }), ne(re(t), "changeYear", function(c) {
      var h = c.date;
      t.setState({
        date: h
      }, function() {
        return t.handleYearChange(t.state.date);
      });
    }), ne(re(t), "renderCalendarHeader", function() {
      var c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : t.state.date, h = arguments.length > 1 ? arguments[1] : void 0;
      return /* @__PURE__ */ y.createElement(gn, ke({}, t.props, {
        key: "month-header-".concat(h),
        date: c,
        order: h,
        onMonthChange: t.changeMonth,
        onYearChange: t.changeYear
      }));
    }), ne(re(t), "onKeyDown", function(c) {
      switch (c.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "Home":
        case "End":
        case "PageUp":
        case "PageDown":
          t.handleArrowKey(c.key), c.preventDefault(), c.stopPropagation();
          break;
      }
    }), ne(re(t), "handleArrowKey", function(c) {
      var h = t.state.highlightedDate, m = h, v = t.dateHelpers.date();
      switch (c) {
        case "ArrowLeft":
          m = t.dateHelpers.subDays(m || v, 1);
          break;
        case "ArrowRight":
          m = t.dateHelpers.addDays(
            // adding `new Date()` as the last option to satisfy Flow
            m || v,
            1
          );
          break;
        case "ArrowUp":
          m = t.dateHelpers.subWeeks(
            // adding `new Date()` as the last option to satisfy Flow
            m || v,
            1
          );
          break;
        case "ArrowDown":
          m = t.dateHelpers.addWeeks(
            // adding `new Date()` as the last option to satisfy Flow
            m || v,
            1
          );
          break;
        case "Home":
          m = t.dateHelpers.getStartOfWeek(
            // adding `new Date()` as the last option to satisfy Flow
            m || v
          );
          break;
        case "End":
          m = t.dateHelpers.getEndOfWeek(
            // adding `new Date()` as the last option to satisfy Flow
            m || v
          );
          break;
        case "PageUp":
          m = t.dateHelpers.subMonths(
            // adding `new Date()` as the last option to satisfy Flow
            m || v,
            1
          );
          break;
        case "PageDown":
          m = t.dateHelpers.addMonths(
            // adding `new Date()` as the last option to satisfy Flow
            m || v,
            1
          );
          break;
      }
      t.setState({
        highlightedDate: m,
        date: m
      });
    }), ne(re(t), "focusCalendar", function() {
      t.state.focused || t.setState({
        focused: !0
      });
    }), ne(re(t), "blurCalendar", function() {
      if (typeof document < "u") {
        var c = document.activeElement;
        t.calendar && !t.calendar.contains(c) && t.setState({
          focused: !1
        });
      }
    }), ne(re(t), "handleTabbing", function(c) {
      if (typeof document < "u" && c.keyCode === 9) {
        var h = document.activeElement, m = t.state.rootElement ? t.state.rootElement.querySelectorAll('[tabindex="0"]') : null, v = m ? m.length : 0;
        c.shiftKey ? m && h === m[0] && (c.preventDefault(), m[v - 1].focus()) : m && h === m[v - 1] && (c.preventDefault(), m[0].focus());
      }
    }), ne(re(t), "onDayFocus", function(c) {
      var h = c.date;
      t.setState({
        highlightedDate: h
      }), t.focusCalendar(), t.props.onDayFocus && t.props.onDayFocus(c);
    }), ne(re(t), "onDayMouseOver", function(c) {
      var h = c.date;
      t.setState({
        highlightedDate: h
      }), t.props.onDayMouseOver && t.props.onDayMouseOver(c);
    }), ne(re(t), "onDayMouseLeave", function(c) {
      var h = c.date, m = t.props.value, v = t.getSingleDate(m);
      t.setState({
        highlightedDate: v || h
      }), t.props.onDayMouseLeave && t.props.onDayMouseLeave(c);
    }), ne(re(t), "handleDateChange", function(c) {
      var h = t.props.onChange, m = h === void 0 ? function($) {
      } : h, v = c.date;
      if (Array.isArray(c.date)) {
        var b = wt(t.state.time), D = c.date[0] ? t.dateHelpers.applyDateToTime(b[0], c.date[0]) : null, S = c.date[1] ? t.dateHelpers.applyDateToTime(b[1], c.date[1]) : null;
        b[0] = D, S ? (v = [D, S], b[1] = S) : v = [D], t.setState({
          time: b
        });
      } else if (!Array.isArray(t.props.value) && c.date) {
        var k = t.dateHelpers.applyDateToTime(t.state.time[0], c.date);
        v = k, t.setState({
          time: [k]
        });
      }
      m({
        date: v
      });
    }), ne(re(t), "handleTimeChange", function(c, h) {
      var m = t.props.onChange, v = m === void 0 ? function(k) {
      } : m, b = wt(t.state.time);
      if (b[h] = t.dateHelpers.applyTimeToDate(b[h], c), t.setState({
        time: b
      }), Array.isArray(t.props.value)) {
        var D = t.props.value.map(function(k, $) {
          return k && h === $ ? t.dateHelpers.applyTimeToDate(k, c) : k;
        });
        v({
          date: [D[0], D[1]]
        });
      } else {
        var S = t.dateHelpers.applyTimeToDate(t.props.value, c);
        v({
          date: S
        });
      }
    }), ne(re(t), "renderMonths", function(c) {
      for (var h = t.props, m = h.overrides, v = m === void 0 ? {} : m, b = h.orientation, D = [], S = Y(v.CalendarContainer, lr), k = we(S, 2), $ = k[0], _ = k[1], A = Y(v.MonthContainer, sr), H = we(A, 2), R = H[0], j = H[1], C = 0; C < (t.props.monthsShown || 1); ++C) {
        var L = [], I = t.dateHelpers.addMonths(t.state.date, C), E = "month-".concat(C);
        L.push(t.renderCalendarHeader(I, C)), L.push(/* @__PURE__ */ y.createElement($, ke({
          key: E,
          ref: function(X) {
            t.calendar = X;
          },
          role: "grid",
          "aria-roledescription": c.ariaRoleDescCalMonth,
          "aria-multiselectable": t.props.range || null,
          onKeyDown: t.onKeyDown
        }, _, {
          $density: t.props.density
        }), /* @__PURE__ */ y.createElement(vn, {
          adapter: t.props.adapter,
          date: I,
          dateLabel: t.props.dateLabel,
          density: t.props.density,
          excludeDates: t.props.excludeDates,
          filterDate: t.props.filterDate,
          highlightedDate: t.state.highlightedDate,
          includeDates: t.props.includeDates,
          focusedCalendar: t.state.focused,
          range: t.props.range,
          locale: t.props.locale,
          maxDate: t.props.maxDate,
          minDate: t.props.minDate,
          month: t.dateHelpers.getMonth(t.state.date),
          onDayBlur: t.blurCalendar,
          onDayFocus: t.onDayFocus,
          onDayClick: t.props.onDayClick,
          onDayMouseOver: t.onDayMouseOver,
          onDayMouseLeave: t.onDayMouseLeave,
          onChange: t.handleDateChange,
          overrides: v,
          value: t.props.value,
          peekNextMonth: t.props.peekNextMonth,
          fixedHeight: t.props.fixedHeight,
          hasLockedBehavior: !!t.props.hasLockedBehavior,
          selectedInput: t.props.selectedInput
        }))), D.push(/* @__PURE__ */ y.createElement("div", {
          key: "month-component-".concat(C)
        }, L));
      }
      return /* @__PURE__ */ y.createElement(R, ke({
        $orientation: b
      }, j), D);
    }), ne(re(t), "renderTimeSelect", function(c, h, m) {
      var v = t.props.overrides, b = v === void 0 ? {} : v, D = Y(b.TimeSelectContainer, ot), S = we(D, 2), k = S[0], $ = S[1], _ = Y(b.TimeSelectFormControl, Et), A = we(_, 2), H = A[0], R = A[1], j = Y(b.TimeSelect, Kn), C = we(j, 2), L = C[0], I = C[1];
      return /* @__PURE__ */ y.createElement(k, $, /* @__PURE__ */ y.createElement(H, ke({
        label: m
      }, R), /* @__PURE__ */ y.createElement(L, ke({
        value: c && t.dateHelpers.date(c),
        onChange: h,
        nullable: !0
      }, I))));
    }), ne(re(t), "renderQuickSelect", function() {
      var c = t.props.overrides, h = c === void 0 ? {} : c, m = Y(h.QuickSelectContainer, ot), v = we(m, 2), b = v[0], D = v[1], S = Y(h.QuickSelectFormControl, Et), k = we(S, 2), $ = k[0], _ = k[1], A = Y(
        //
        h.QuickSelect,
        Ln
      ), H = we(A, 2), R = H[0], j = H[1], C = j.overrides, L = qo(j, zo);
      if (!t.props.quickSelect)
        return null;
      var I = t.dateHelpers.set(t.dateHelpers.date(), {
        hours: 12,
        minutes: 0,
        seconds: 0
      });
      return /* @__PURE__ */ y.createElement(Qe.Consumer, null, function(E) {
        return /* @__PURE__ */ y.createElement(b, D, /* @__PURE__ */ y.createElement($, ke({
          label: E.datepicker.quickSelectLabel
        }, _), /* @__PURE__ */ y.createElement(R, ke({
          "aria-label": E.datepicker.quickSelectAriaLabel,
          labelKey: "id",
          onChange: function(X) {
            X.option ? (t.setState({
              quickSelectId: X.option.id
            }), t.props.onChange && (t.props.range ? t.props.onChange({
              date: [X.option.beginDate, X.option.endDate || I]
            }) : t.props.onChange({
              date: X.option.beginDate
            }))) : (t.setState({
              quickSelectId: null
            }), t.props.onChange && t.props.onChange({
              date: []
            })), t.props.onQuickSelectChange && t.props.onQuickSelectChange(X.option);
          },
          options: t.props.quickSelectOptions || [{
            id: E.datepicker.pastWeek,
            beginDate: t.dateHelpers.subWeeks(I, 1)
          }, {
            id: E.datepicker.pastMonth,
            beginDate: t.dateHelpers.subMonths(I, 1)
          }, {
            id: E.datepicker.pastThreeMonths,
            beginDate: t.dateHelpers.subMonths(I, 3)
          }, {
            id: E.datepicker.pastSixMonths,
            beginDate: t.dateHelpers.subMonths(I, 6)
          }, {
            id: E.datepicker.pastYear,
            beginDate: t.dateHelpers.subYears(I, 1)
          }, {
            id: E.datepicker.pastTwoYears,
            beginDate: t.dateHelpers.subYears(I, 2)
          }],
          placeholder: E.datepicker.quickSelectPlaceholder,
          value: t.state.quickSelectId && [{
            id: t.state.quickSelectId
          }],
          overrides: ln({
            Dropdown: {
              style: {
                textAlign: "start"
              }
            }
          }, C)
        }, L))));
      });
    });
    var o = t.props, i = o.highlightedDate, s = o.value, u = o.adapter;
    t.dateHelpers = new Re(u);
    var d = t.getDateInView(), f = [];
    return Array.isArray(s) ? f = wt(s) : s && (f = [s]), t.state = {
      highlightedDate: t.getSingleDate(s) || (i && t.dateHelpers.isSameMonth(d, i) ? i : t.dateHelpers.date()),
      focused: !1,
      date: d,
      quickSelectId: null,
      rootElement: null,
      time: f
    }, t;
  }
  return ri(n, [{
    key: "componentDidMount",
    value: function() {
      this.props.autoFocusCalendar && this.focusCalendar();
    }
  }, {
    key: "componentDidUpdate",
    value: function(t) {
      if (this.props.highlightedDate && !this.dateHelpers.isSameDay(this.props.highlightedDate, t.highlightedDate) && this.setState({
        date: this.props.highlightedDate
      }), this.props.autoFocusCalendar && this.props.autoFocusCalendar !== t.autoFocusCalendar && this.focusCalendar(), t.value !== this.props.value) {
        var o = this.getDateInView();
        this.isInView(o) || this.setState({
          date: o
        });
      }
    }
  }, {
    key: "isInView",
    value: function(t) {
      var o = this.state.date, i = this.dateHelpers.getYear(t) - this.dateHelpers.getYear(o), s = i * 12 + this.dateHelpers.getMonth(t) - this.dateHelpers.getMonth(o);
      return s >= 0 && s < (this.props.monthsShown || 1);
    }
  }, {
    key: "getSingleDate",
    value: function(t) {
      return Array.isArray(t) ? t[0] || null : t;
    }
  }, {
    key: "setHighlightedDate",
    value: function(t) {
      var o = this.props.value, i = this.getSingleDate(o), s;
      i && this.dateHelpers.isSameMonth(i, t) && this.dateHelpers.isSameYear(i, t) ? s = {
        highlightedDate: i
      } : s = {
        highlightedDate: t
      }, this.setState(s);
    }
  }, {
    key: "render",
    value: function() {
      var t = this, o = this.props.overrides, i = o === void 0 ? {} : o, s = Y(i.Root, ir), u = we(s, 2), d = u[0], f = u[1], c = [].concat(this.props.value), h = we(c, 2), m = h[0], v = h[1];
      return /* @__PURE__ */ y.createElement(Qe.Consumer, null, function(b) {
        return /* @__PURE__ */ y.createElement(d, ke({
          $density: t.props.density,
          "data-baseweb": "calendar",
          role: "application",
          "aria-roledescription": "datepicker",
          ref: function(S) {
            S && S instanceof HTMLElement && !t.state.rootElement && t.setState({
              rootElement: S
            });
          },
          "aria-label": b.datepicker.ariaLabelCalendar,
          onKeyDown: t.props.trapTabbing ? t.handleTabbing : null
        }, f), t.renderMonths({
          ariaRoleDescCalMonth: b.datepicker.ariaRoleDescriptionCalendarMonth
        }), t.props.timeSelectStart && t.renderTimeSelect(m, function(D) {
          return t.handleTimeChange(D, 0);
        }, b.datepicker.timeSelectStartLabel), t.props.timeSelectEnd && t.props.range && t.renderTimeSelect(v, function(D) {
          return t.handleTimeChange(D, 1);
        }, b.datepicker.timeSelectEndLabel), t.renderQuickSelect());
      });
    }
  }]), n;
})(y.Component);
ne(On, "defaultProps", {
  autoFocusCalendar: !1,
  dateLabel: null,
  density: le.default,
  excludeDates: null,
  filterDate: null,
  highlightedDate: null,
  includeDates: null,
  range: !1,
  locale: null,
  maxDate: null,
  minDate: null,
  onDayClick: function() {
  },
  onDayFocus: function() {
  },
  onDayMouseOver: function() {
  },
  onDayMouseLeave: function() {
  },
  onMonthChange: function() {
  },
  onYearChange: function() {
  },
  onChange: function() {
  },
  orientation: Kt.horizontal,
  overrides: {},
  peekNextMonth: !1,
  adapter: Le,
  value: null,
  trapTabbing: !1
});
function kt(e) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return e.replace(/\${(.*?)}/g, function(n, a) {
    return r[a] === void 0 ? "${" + a + "}" : r[a];
  });
}
function qt(e) {
  "@babel/helpers - typeof";
  return qt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, qt(e);
}
function Ae() {
  return Ae = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var a in n)
        Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
  }, Ae.apply(this, arguments);
}
function Vr(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    r && (a = a.filter(function(t) {
      return Object.getOwnPropertyDescriptor(e, t).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function zr(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r] != null ? arguments[r] : {};
    r % 2 ? Vr(Object(n), !0).forEach(function(a) {
      fe(e, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Vr(Object(n)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return e;
}
function _t(e) {
  return ui(e) || li(e) || Dn(e) || si();
}
function si() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function li(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ui(e) {
  if (Array.isArray(e)) return Qt(e);
}
function ci(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function di(e, r) {
  for (var n = 0; n < r.length; n++) {
    var a = r[n];
    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
  }
}
function pi(e, r, n) {
  return r && di(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function fi(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), r && Ut(e, r);
}
function Ut(e, r) {
  return Ut = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(a, t) {
    return a.__proto__ = t, a;
  }, Ut(e, r);
}
function hi(e) {
  var r = yi();
  return function() {
    var a = dt(e), t;
    if (r) {
      var o = dt(this).constructor;
      t = Reflect.construct(a, arguments, o);
    } else
      t = a.apply(this, arguments);
    return gi(this, t);
  };
}
function gi(e, r) {
  if (r && (qt(r) === "object" || typeof r == "function"))
    return r;
  if (r !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return he(e);
}
function he(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function yi() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function dt(e) {
  return dt = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(n) {
    return n.__proto__ || Object.getPrototypeOf(n);
  }, dt(e);
}
function fe(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
function De(e, r) {
  return bi(e) || vi(e, r) || Dn(e, r) || mi();
}
function mi() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Dn(e, r) {
  if (e) {
    if (typeof e == "string") return Qt(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Qt(e, r);
  }
}
function Qt(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, a = new Array(r); n < r; n++)
    a[n] = e[n];
  return a;
}
function vi(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var a = [], t = !0, o = !1, i, s;
    try {
      for (n = n.call(e); !(t = (i = n.next()).done) && (a.push(i.value), !(r && a.length === r)); t = !0)
        ;
    } catch (u) {
      o = !0, s = u;
    } finally {
      try {
        !t && n.return != null && n.return();
      } finally {
        if (o) throw s;
      }
    }
    return a;
  }
}
function bi(e) {
  if (Array.isArray(e)) return e;
}
var et = "yyyy/MM/dd", ve = "–", Oi = function(r) {
  var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", a = arguments.length > 2 ? arguments[2] : void 0, t = r, o = n.split(" ".concat(ve, " ")), i = De(o, 2), s = i[0], u = s === void 0 ? "" : s, d = i[1], f = d === void 0 ? "" : d;
  return a === _e.startDate && f && (t = "".concat(t, " ").concat(ve, " ").concat(f)), a === _e.endDate && (t = "".concat(u, " ").concat(ve, " ").concat(t)), t;
}, Sn = /* @__PURE__ */ (function(e) {
  fi(n, e);
  var r = hi(n);
  function n(a) {
    var t;
    return ci(this, n), t = r.call(this, a), fe(he(t), "calendar", void 0), fe(he(t), "dateHelpers", void 0), fe(he(t), "handleChange", function(o) {
      var i = t.props.onChange, s = t.props.onRangeChange;
      Array.isArray(o) ? (i && o.every(Boolean) && i({
        date: o
      }), s && s({
        date: _t(o)
      })) : (i && i({
        date: o
      }), s && s({
        date: o
      }));
    }), fe(he(t), "onCalendarSelect", function(o) {
      var i = !1, s = !1, u = !1, d = o.date;
      if (Array.isArray(d) && t.props.range) {
        if (!d[0] || !d[1])
          i = !0, s = !0, u = null;
        else if (d[0] && d[1]) {
          var f = d, c = De(f, 2), h = c[0], m = c[1];
          t.dateHelpers.isAfter(h, m) ? t.hasLockedBehavior() ? (d = t.props.value, i = !0) : d = [h, h] : t.dateHelpers.dateRangeIncludesDates(d, t.props.excludeDates) && (d = t.props.value, i = !0), t.state.lastActiveElm && t.state.lastActiveElm.focus();
        }
      } else t.state.lastActiveElm && t.state.lastActiveElm.focus();
      var v = function(S, k) {
        if (!S || !k) return !1;
        var $ = t.dateHelpers.format(S, "keyboardDate"), _ = t.dateHelpers.format(k, "keyboardDate");
        return $ === _ ? t.dateHelpers.getHours(S) !== t.dateHelpers.getHours(k) || t.dateHelpers.getMinutes(S) !== t.dateHelpers.getMinutes(k) : !1;
      }, b = t.props.value;
      Array.isArray(d) && Array.isArray(b) ? d.some(function(D, S) {
        return v(b[S], D);
      }) && (i = !0) : !Array.isArray(d) && !Array.isArray(b) && v(b, d) && (i = !0), t.setState(zr(zr({
        isOpen: i,
        isPseudoFocused: s
      }, u === null ? {} : {
        calendarFocused: u
      }), {}, {
        inputValue: t.formatDisplayValue(d)
      })), t.handleChange(d);
    }), fe(he(t), "formatDisplayValue", function(o) {
      var i = t.props, s = i.displayValueAtRangeIndex, u = i.formatDisplayValue;
      i.range;
      var d = t.normalizeDashes(t.props.formatString);
      if (typeof s == "number" && o && Array.isArray(o)) {
        var f = o[s];
        return u ? u(f, d) : t.formatDate(f, d);
      }
      return u ? u(o, d) : t.formatDate(o, d);
    }), fe(he(t), "open", function(o) {
      t.setState({
        isOpen: !0,
        isPseudoFocused: !0,
        calendarFocused: !1,
        selectedInput: o
      }, t.props.onOpen);
    }), fe(he(t), "close", function() {
      var o = !1;
      t.setState({
        isOpen: !1,
        selectedInput: null,
        isPseudoFocused: o,
        calendarFocused: !1
      }, t.props.onClose);
    }), fe(he(t), "handleEsc", function() {
      t.state.lastActiveElm && t.state.lastActiveElm.focus(), t.close();
    }), fe(he(t), "handleInputBlur", function() {
      t.state.isPseudoFocused || t.close();
    }), fe(he(t), "getMask", function() {
      var o = t.props, i = o.formatString, s = o.mask, u = o.range, d = o.separateRangeInputs;
      return s === null || s === void 0 && i !== et ? null : s ? t.normalizeDashes(s) : u && !d ? "9999/99/99 ".concat(ve, " 9999/99/99") : "9999/99/99";
    }), fe(he(t), "handleInputChange", function(o, i) {
      var s = t.props.range && t.props.separateRangeInputs ? Oi(o.currentTarget.value, t.state.inputValue, i) : o.currentTarget.value, u = t.getMask(), d = t.normalizeDashes(t.props.formatString);
      (typeof u == "string" && s === u.replace(/9/g, " ") || s.length === 0) && (t.props.range ? t.handleChange([]) : t.handleChange(null)), t.setState({
        inputValue: s
      });
      var f = function(X) {
        return d === et ? t.dateHelpers.parse(X, "slashDate", t.props.locale) : t.dateHelpers.parseString(X, d, t.props.locale);
      };
      if (t.props.range && typeof t.props.displayValueAtRangeIndex != "number") {
        var c = t.normalizeDashes(s).split(" ".concat(ve, " ")), h = De(c, 2), m = h[0], v = h[1], b = t.dateHelpers.date(m), D = t.dateHelpers.date(v);
        d && (b = f(m), D = f(v));
        var S = t.dateHelpers.isValid(b) && t.dateHelpers.isValid(D), k = t.dateHelpers.isAfter(D, b) || t.dateHelpers.isEqual(b, D);
        S && k && t.handleChange([b, D]);
      } else {
        var $ = t.normalizeDashes(s), _ = t.dateHelpers.date($), A = t.props.formatString;
        $.replace(/(\s)*/g, "").length < A.replace(/(\s)*/g, "").length ? _ = null : _ = f($);
        var H = t.props, R = H.displayValueAtRangeIndex, j = H.range, C = H.value;
        if (_ && t.dateHelpers.isValid(_))
          if (j && Array.isArray(C) && typeof R == "number") {
            var L = De(C, 2), I = L[0], E = L[1];
            R === 0 ? (I = _, E ? t.dateHelpers.isAfter(E, I) || t.dateHelpers.isEqual(I, E) ? t.handleChange([I, E]) : t.handleChange(_t(C)) : t.handleChange([I])) : R === 1 && (E = _, I ? t.dateHelpers.isAfter(E, I) || t.dateHelpers.isEqual(I, E) ? t.handleChange([I, E]) : t.handleChange(_t(C)) : t.handleChange([E, E]));
          } else
            t.handleChange(_);
      }
    }), fe(he(t), "handleKeyDown", function(o) {
      !t.state.isOpen && o.keyCode === 40 ? t.open() : t.state.isOpen && o.key === "ArrowDown" ? (o.preventDefault(), t.focusCalendar()) : t.state.isOpen && o.keyCode === 9 && t.close();
    }), fe(he(t), "focusCalendar", function() {
      if (typeof document < "u") {
        var o = document.activeElement;
        t.setState({
          calendarFocused: !0,
          lastActiveElm: o
        });
      }
    }), fe(he(t), "normalizeDashes", function(o) {
      return o.replace(/-/g, ve).replace(/—/g, ve);
    }), fe(he(t), "hasLockedBehavior", function() {
      return t.props.rangedCalendarBehavior === Pa.locked && t.props.range && t.props.separateRangeInputs;
    }), t.dateHelpers = new Re(a.adapter), t.state = {
      calendarFocused: !1,
      isOpen: !1,
      selectedInput: null,
      isPseudoFocused: !1,
      lastActiveElm: null,
      inputValue: t.formatDisplayValue(a.value) || ""
    }, t;
  }
  return pi(n, [{
    key: "getNullDatePlaceholder",
    value: function(t) {
      return (this.getMask() || t).split(ve)[0].replace(/[0-9]|[a-z]/g, " ");
    }
  }, {
    key: "formatDate",
    value: function(t, o) {
      var i = this, s = function(c) {
        return o === et ? i.dateHelpers.format(c, "slashDate", i.props.locale) : i.dateHelpers.formatDate(c, o, i.props.locale);
      };
      if (t) {
        if (Array.isArray(t) && !t[0] && !t[1])
          return "";
        if (Array.isArray(t) && !t[0] && t[1]) {
          var u = s(t[1]), d = this.getNullDatePlaceholder(o);
          return [d, u].join(" ".concat(ve, " "));
        } else return Array.isArray(t) ? t.map(function(f) {
          return f ? s(f) : "";
        }).join(" ".concat(ve, " ")) : s(t);
      } else return "";
    }
  }, {
    key: "componentDidUpdate",
    value: function(t) {
      t.value !== this.props.value && this.setState({
        inputValue: this.formatDisplayValue(this.props.value)
      });
    }
  }, {
    key: "renderInputComponent",
    value: function(t, o) {
      var i = this, s = this.props.overrides, u = s === void 0 ? {} : s, d = Y(u.Input, pn), f = De(d, 2), c = f[0], h = f[1], m = this.props.placeholder || this.props.placeholder === "" ? this.props.placeholder : this.props.range && !this.props.separateRangeInputs ? "YYYY/MM/DD ".concat(ve, " YYYY/MM/DD") : "YYYY/MM/DD", v = (this.state.inputValue || "").split(" ".concat(ve, " ")), b = De(v, 2), D = b[0], S = D === void 0 ? "" : D, k = b[1], $ = k === void 0 ? "" : k, _ = o === _e.startDate ? S : o === _e.endDate ? $ : this.state.inputValue;
      return /* @__PURE__ */ y.createElement(c, Ae({
        "aria-disabled": this.props.disabled,
        "aria-label": this.props["aria-label"] || (this.props.range ? t.datepicker.ariaLabelRange : t.datepicker.ariaLabel),
        error: this.props.error,
        positive: this.props.positive,
        "aria-describedby": this.props["aria-describedby"],
        "aria-labelledby": this.props["aria-labelledby"],
        "aria-required": this.props.required || null,
        disabled: this.props.disabled,
        size: this.props.size,
        value: _,
        onFocus: function() {
          return i.open(o);
        },
        onBlur: this.handleInputBlur,
        onKeyDown: this.handleKeyDown,
        onChange: function(H) {
          return i.handleInputChange(H, o);
        },
        placeholder: m,
        mask: this.getMask(),
        required: this.props.required,
        clearable: this.props.clearable
      }, h));
    }
  }, {
    key: "render",
    value: function() {
      var t = this, o = this.props, i = o.overrides, s = i === void 0 ? {} : i, u = o.startDateLabel, d = u === void 0 ? "Start Date" : u, f = o.endDateLabel, c = f === void 0 ? "End Date" : f, h = Y(s.Popover, sn), m = De(h, 2), v = m[0], b = m[1], D = Y(s.InputWrapper, rr), S = De(D, 2), k = S[0], $ = S[1], _ = Y(s.StartDate, ar), A = De(_, 2), H = A[0], R = A[1], j = Y(s.EndDate, or), C = De(j, 2), L = C[0], I = C[1], E = Y(s.InputLabel, nr), T = De(E, 2), X = T[0], z = T[1];
      return /* @__PURE__ */ y.createElement(Qe.Consumer, null, function(J) {
        return /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(v, Ae({
          accessibilityType: jn.none,
          focusLock: !1,
          autoFocus: !1,
          mountNode: t.props.mountNode,
          placement: un.bottom,
          isOpen: t.state.isOpen,
          onClickOutside: t.close,
          onEsc: t.handleEsc,
          content: /* @__PURE__ */ y.createElement(On, Ae({
            adapter: t.props.adapter,
            autoFocusCalendar: t.state.calendarFocused,
            trapTabbing: !0,
            value: t.props.value
          }, t.props, {
            onChange: t.onCalendarSelect,
            selectedInput: t.state.selectedInput,
            hasLockedBehavior: t.hasLockedBehavior()
          }))
        }, b), /* @__PURE__ */ y.createElement(k, Ae({}, $, {
          $separateRangeInputs: t.props.range && t.props.separateRangeInputs
        }), t.props.range && t.props.separateRangeInputs ? /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(H, R, /* @__PURE__ */ y.createElement(X, z, d), t.renderInputComponent(J, _e.startDate)), /* @__PURE__ */ y.createElement(L, I, /* @__PURE__ */ y.createElement(X, z, c), t.renderInputComponent(J, _e.endDate))) : /* @__PURE__ */ y.createElement(y.Fragment, null, t.renderInputComponent(J)))), /* @__PURE__ */ y.createElement("p", {
          id: t.props["aria-describedby"],
          style: {
            position: "fixed",
            width: "0px",
            height: "0px",
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            padding: 0,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            clipPath: "inset(100%)"
          }
        }, J.datepicker.screenReaderMessageInput), /* @__PURE__ */ y.createElement(
          "p",
          {
            "aria-live": "assertive",
            style: {
              position: "fixed",
              width: "0px",
              height: "0px",
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderTopWidth: 0,
              borderBottomWidth: 0,
              padding: 0,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              clipPath: "inset(100%)"
            }
          },
          // No date selected
          !t.props.value || Array.isArray(t.props.value) && !t.props.value[0] && !t.props.value[1] ? "" : (
            // Date selected in a non-range picker
            Array.isArray(t.props.value) ? (
              // Start and end dates are selected in a range picker
              t.props.value[0] && t.props.value[1] ? kt(J.datepicker.selectedDateRange, {
                startDate: t.formatDisplayValue(t.props.value[0]),
                endDate: t.formatDisplayValue(t.props.value[1])
              }) : (
                // A single date selected in a range picker
                "".concat(kt(J.datepicker.selectedDate, {
                  date: t.formatDisplayValue(t.props.value[0])
                }), " ").concat(J.datepicker.selectSecondDatePrompt)
              )
            ) : kt(J.datepicker.selectedDate, {
              date: t.state.inputValue || ""
            })
          )
        ));
      });
    }
  }]), n;
})(y.Component);
fe(Sn, "defaultProps", {
  "aria-describedby": "datepicker--screenreader--message--input",
  value: null,
  formatString: et,
  adapter: Le
});
const wn = 6048e5, Di = 864e5, qr = Symbol.for("constructDateFrom");
function Ce(e, r) {
  return typeof e == "function" ? e(r) : e && typeof e == "object" && qr in e ? e[qr](r) : e instanceof Date ? new e.constructor(r) : new Date(r);
}
function Se(e, r) {
  return Ce(r || e, e);
}
let Si = {};
function ft() {
  return Si;
}
function Ge(e, r) {
  const n = ft(), a = r?.weekStartsOn ?? r?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, t = Se(e, r?.in), o = t.getDay(), i = (o < a ? 7 : 0) + o - a;
  return t.setDate(t.getDate() - i), t.setHours(0, 0, 0, 0), t;
}
function pt(e, r) {
  return Ge(e, { ...r, weekStartsOn: 1 });
}
function kn(e, r) {
  const n = Se(e, r?.in), a = n.getFullYear(), t = Ce(n, 0);
  t.setFullYear(a + 1, 0, 4), t.setHours(0, 0, 0, 0);
  const o = pt(t), i = Ce(n, 0);
  i.setFullYear(a, 0, 4), i.setHours(0, 0, 0, 0);
  const s = pt(i);
  return n.getTime() >= o.getTime() ? a + 1 : n.getTime() >= s.getTime() ? a : a - 1;
}
function Ur(e) {
  const r = Se(e), n = new Date(
    Date.UTC(
      r.getFullYear(),
      r.getMonth(),
      r.getDate(),
      r.getHours(),
      r.getMinutes(),
      r.getSeconds(),
      r.getMilliseconds()
    )
  );
  return n.setUTCFullYear(r.getFullYear()), +e - +n;
}
function wi(e, ...r) {
  const n = Ce.bind(
    null,
    r.find((a) => typeof a == "object")
  );
  return r.map(n);
}
function Qr(e, r) {
  const n = Se(e, r?.in);
  return n.setHours(0, 0, 0, 0), n;
}
function ki(e, r, n) {
  const [a, t] = wi(
    n?.in,
    e,
    r
  ), o = Qr(a), i = Qr(t), s = +o - Ur(o), u = +i - Ur(i);
  return Math.round((s - u) / Di);
}
function _i(e, r) {
  const n = kn(e, r), a = Ce(e, 0);
  return a.setFullYear(n, 0, 4), a.setHours(0, 0, 0, 0), pt(a);
}
function $i(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function Mi(e) {
  return !(!$i(e) && typeof e != "number" || isNaN(+Se(e)));
}
function Pi(e, r) {
  const n = Se(e, r?.in);
  return n.setFullYear(n.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n;
}
const Ci = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, Ii = (e, r, n) => {
  let a;
  const t = Ci[e];
  return typeof t == "string" ? a = t : r === 1 ? a = t.one : a = t.other.replace("{{count}}", r.toString()), n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + a : a + " ago" : a;
};
function $t(e) {
  return (r = {}) => {
    const n = r.width ? String(r.width) : e.defaultWidth;
    return e.formats[n] || e.formats[e.defaultWidth];
  };
}
const Ei = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, Hi = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, xi = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Ai = {
  date: $t({
    formats: Ei,
    defaultWidth: "full"
  }),
  time: $t({
    formats: Hi,
    defaultWidth: "full"
  }),
  dateTime: $t({
    formats: xi,
    defaultWidth: "full"
  })
}, Ti = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Ri = (e, r, n, a) => Ti[e];
function Ye(e) {
  return (r, n) => {
    const a = n?.context ? String(n.context) : "standalone";
    let t;
    if (a === "formatting" && e.formattingValues) {
      const i = e.defaultFormattingWidth || e.defaultWidth, s = n?.width ? String(n.width) : i;
      t = e.formattingValues[s] || e.formattingValues[i];
    } else {
      const i = e.defaultWidth, s = n?.width ? String(n.width) : e.defaultWidth;
      t = e.values[s] || e.values[i];
    }
    const o = e.argumentCallback ? e.argumentCallback(r) : r;
    return t[o];
  };
}
const Li = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, ji = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Fi = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, Bi = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, Wi = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, Yi = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, Ni = (e, r) => {
  const n = Number(e), a = n % 100;
  if (a > 20 || a < 10)
    switch (a % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
    }
  return n + "th";
}, Vi = {
  ordinalNumber: Ni,
  era: Ye({
    values: Li,
    defaultWidth: "wide"
  }),
  quarter: Ye({
    values: ji,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: Ye({
    values: Fi,
    defaultWidth: "wide"
  }),
  day: Ye({
    values: Bi,
    defaultWidth: "wide"
  }),
  dayPeriod: Ye({
    values: Wi,
    defaultWidth: "wide",
    formattingValues: Yi,
    defaultFormattingWidth: "wide"
  })
};
function Ne(e) {
  return (r, n = {}) => {
    const a = n.width, t = a && e.matchPatterns[a] || e.matchPatterns[e.defaultMatchWidth], o = r.match(t);
    if (!o)
      return null;
    const i = o[0], s = a && e.parsePatterns[a] || e.parsePatterns[e.defaultParseWidth], u = Array.isArray(s) ? qi(s, (c) => c.test(i)) : (
      // [TODO] -- I challenge you to fix the type
      zi(s, (c) => c.test(i))
    );
    let d;
    d = e.valueCallback ? e.valueCallback(u) : u, d = n.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      n.valueCallback(d)
    ) : d;
    const f = r.slice(i.length);
    return { value: d, rest: f };
  };
}
function zi(e, r) {
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && r(e[n]))
      return n;
}
function qi(e, r) {
  for (let n = 0; n < e.length; n++)
    if (r(e[n]))
      return n;
}
function Ui(e) {
  return (r, n = {}) => {
    const a = r.match(e.matchPattern);
    if (!a) return null;
    const t = a[0], o = r.match(e.parsePattern);
    if (!o) return null;
    let i = e.valueCallback ? e.valueCallback(o[0]) : o[0];
    i = n.valueCallback ? n.valueCallback(i) : i;
    const s = r.slice(t.length);
    return { value: i, rest: s };
  };
}
const Qi = /^(\d+)(th|st|nd|rd)?/i, Xi = /\d+/i, Ki = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Gi = {
  any: [/^b/i, /^(a|c)/i]
}, Ji = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Zi = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, es = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ts = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, rs = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, ns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, as = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, os = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, is = {
  ordinalNumber: Ui({
    matchPattern: Qi,
    parsePattern: Xi,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: Ne({
    matchPatterns: Ki,
    defaultMatchWidth: "wide",
    parsePatterns: Gi,
    defaultParseWidth: "any"
  }),
  quarter: Ne({
    matchPatterns: Ji,
    defaultMatchWidth: "wide",
    parsePatterns: Zi,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: Ne({
    matchPatterns: es,
    defaultMatchWidth: "wide",
    parsePatterns: ts,
    defaultParseWidth: "any"
  }),
  day: Ne({
    matchPatterns: rs,
    defaultMatchWidth: "wide",
    parsePatterns: ns,
    defaultParseWidth: "any"
  }),
  dayPeriod: Ne({
    matchPatterns: as,
    defaultMatchWidth: "any",
    parsePatterns: os,
    defaultParseWidth: "any"
  })
}, tt = {
  code: "en-US",
  formatDistance: Ii,
  formatLong: Ai,
  formatRelative: Ri,
  localize: Vi,
  match: is,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function ss(e, r) {
  const n = Se(e, r?.in);
  return ki(n, Pi(n)) + 1;
}
function ls(e, r) {
  const n = Se(e, r?.in), a = +pt(n) - +_i(n);
  return Math.round(a / wn) + 1;
}
function _n(e, r) {
  const n = Se(e, r?.in), a = n.getFullYear(), t = ft(), o = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? t.firstWeekContainsDate ?? t.locale?.options?.firstWeekContainsDate ?? 1, i = Ce(r?.in || e, 0);
  i.setFullYear(a + 1, 0, o), i.setHours(0, 0, 0, 0);
  const s = Ge(i, r), u = Ce(r?.in || e, 0);
  u.setFullYear(a, 0, o), u.setHours(0, 0, 0, 0);
  const d = Ge(u, r);
  return +n >= +s ? a + 1 : +n >= +d ? a : a - 1;
}
function us(e, r) {
  const n = ft(), a = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1, t = _n(e, r), o = Ce(r?.in || e, 0);
  return o.setFullYear(t, 0, a), o.setHours(0, 0, 0, 0), Ge(o, r);
}
function cs(e, r) {
  const n = Se(e, r?.in), a = +Ge(n, r) - +us(n, r);
  return Math.round(a / wn) + 1;
}
function V(e, r) {
  const n = e < 0 ? "-" : "", a = Math.abs(e).toString().padStart(r, "0");
  return n + a;
}
const Pe = {
  // Year
  y(e, r) {
    const n = e.getFullYear(), a = n > 0 ? n : 1 - n;
    return V(r === "yy" ? a % 100 : a, r.length);
  },
  // Month
  M(e, r) {
    const n = e.getMonth();
    return r === "M" ? String(n + 1) : V(n + 1, 2);
  },
  // Day of the month
  d(e, r) {
    return V(e.getDate(), r.length);
  },
  // AM or PM
  a(e, r) {
    const n = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (r) {
      case "a":
      case "aa":
        return n.toUpperCase();
      case "aaa":
        return n;
      case "aaaaa":
        return n[0];
      case "aaaa":
      default:
        return n === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(e, r) {
    return V(e.getHours() % 12 || 12, r.length);
  },
  // Hour [0-23]
  H(e, r) {
    return V(e.getHours(), r.length);
  },
  // Minute
  m(e, r) {
    return V(e.getMinutes(), r.length);
  },
  // Second
  s(e, r) {
    return V(e.getSeconds(), r.length);
  },
  // Fraction of second
  S(e, r) {
    const n = r.length, a = e.getMilliseconds(), t = Math.trunc(
      a * Math.pow(10, n - 3)
    );
    return V(t, r.length);
  }
}, xe = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Xr = {
  // Era
  G: function(e, r, n) {
    const a = e.getFullYear() > 0 ? 1 : 0;
    switch (r) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return n.era(a, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return n.era(a, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return n.era(a, { width: "wide" });
    }
  },
  // Year
  y: function(e, r, n) {
    if (r === "yo") {
      const a = e.getFullYear(), t = a > 0 ? a : 1 - a;
      return n.ordinalNumber(t, { unit: "year" });
    }
    return Pe.y(e, r);
  },
  // Local week-numbering year
  Y: function(e, r, n, a) {
    const t = _n(e, a), o = t > 0 ? t : 1 - t;
    if (r === "YY") {
      const i = o % 100;
      return V(i, 2);
    }
    return r === "Yo" ? n.ordinalNumber(o, { unit: "year" }) : V(o, r.length);
  },
  // ISO week-numbering year
  R: function(e, r) {
    const n = kn(e);
    return V(n, r.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(e, r) {
    const n = e.getFullYear();
    return V(n, r.length);
  },
  // Quarter
  Q: function(e, r, n) {
    const a = Math.ceil((e.getMonth() + 1) / 3);
    switch (r) {
      // 1, 2, 3, 4
      case "Q":
        return String(a);
      // 01, 02, 03, 04
      case "QQ":
        return V(a, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return n.ordinalNumber(a, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return n.quarter(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return n.quarter(a, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return n.quarter(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(e, r, n) {
    const a = Math.ceil((e.getMonth() + 1) / 3);
    switch (r) {
      // 1, 2, 3, 4
      case "q":
        return String(a);
      // 01, 02, 03, 04
      case "qq":
        return V(a, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return n.ordinalNumber(a, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return n.quarter(a, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return n.quarter(a, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return n.quarter(a, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(e, r, n) {
    const a = e.getMonth();
    switch (r) {
      case "M":
      case "MM":
        return Pe.M(e, r);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return n.ordinalNumber(a + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return n.month(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return n.month(a, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return n.month(a, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(e, r, n) {
    const a = e.getMonth();
    switch (r) {
      // 1, 2, ..., 12
      case "L":
        return String(a + 1);
      // 01, 02, ..., 12
      case "LL":
        return V(a + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return n.ordinalNumber(a + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return n.month(a, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return n.month(a, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return n.month(a, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(e, r, n, a) {
    const t = cs(e, a);
    return r === "wo" ? n.ordinalNumber(t, { unit: "week" }) : V(t, r.length);
  },
  // ISO week of year
  I: function(e, r, n) {
    const a = ls(e);
    return r === "Io" ? n.ordinalNumber(a, { unit: "week" }) : V(a, r.length);
  },
  // Day of the month
  d: function(e, r, n) {
    return r === "do" ? n.ordinalNumber(e.getDate(), { unit: "date" }) : Pe.d(e, r);
  },
  // Day of year
  D: function(e, r, n) {
    const a = ss(e);
    return r === "Do" ? n.ordinalNumber(a, { unit: "dayOfYear" }) : V(a, r.length);
  },
  // Day of week
  E: function(e, r, n) {
    const a = e.getDay();
    switch (r) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return n.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return n.day(a, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return n.day(a, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return n.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(e, r, n, a) {
    const t = e.getDay(), o = (t - a.weekStartsOn + 8) % 7 || 7;
    switch (r) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(o);
      // Padded numerical value
      case "ee":
        return V(o, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return n.ordinalNumber(o, { unit: "day" });
      case "eee":
        return n.day(t, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return n.day(t, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return n.day(t, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return n.day(t, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(e, r, n, a) {
    const t = e.getDay(), o = (t - a.weekStartsOn + 8) % 7 || 7;
    switch (r) {
      // Numerical value (same as in `e`)
      case "c":
        return String(o);
      // Padded numerical value
      case "cc":
        return V(o, r.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return n.ordinalNumber(o, { unit: "day" });
      case "ccc":
        return n.day(t, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return n.day(t, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return n.day(t, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return n.day(t, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(e, r, n) {
    const a = e.getDay(), t = a === 0 ? 7 : a;
    switch (r) {
      // 2
      case "i":
        return String(t);
      // 02
      case "ii":
        return V(t, r.length);
      // 2nd
      case "io":
        return n.ordinalNumber(t, { unit: "day" });
      // Tue
      case "iii":
        return n.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return n.day(a, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return n.day(a, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return n.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(e, r, n) {
    const t = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (r) {
      case "a":
      case "aa":
        return n.dayPeriod(t, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return n.dayPeriod(t, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return n.dayPeriod(t, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return n.dayPeriod(t, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(e, r, n) {
    const a = e.getHours();
    let t;
    switch (a === 12 ? t = xe.noon : a === 0 ? t = xe.midnight : t = a / 12 >= 1 ? "pm" : "am", r) {
      case "b":
      case "bb":
        return n.dayPeriod(t, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return n.dayPeriod(t, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return n.dayPeriod(t, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return n.dayPeriod(t, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(e, r, n) {
    const a = e.getHours();
    let t;
    switch (a >= 17 ? t = xe.evening : a >= 12 ? t = xe.afternoon : a >= 4 ? t = xe.morning : t = xe.night, r) {
      case "B":
      case "BB":
      case "BBB":
        return n.dayPeriod(t, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return n.dayPeriod(t, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return n.dayPeriod(t, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(e, r, n) {
    if (r === "ho") {
      let a = e.getHours() % 12;
      return a === 0 && (a = 12), n.ordinalNumber(a, { unit: "hour" });
    }
    return Pe.h(e, r);
  },
  // Hour [0-23]
  H: function(e, r, n) {
    return r === "Ho" ? n.ordinalNumber(e.getHours(), { unit: "hour" }) : Pe.H(e, r);
  },
  // Hour [0-11]
  K: function(e, r, n) {
    const a = e.getHours() % 12;
    return r === "Ko" ? n.ordinalNumber(a, { unit: "hour" }) : V(a, r.length);
  },
  // Hour [1-24]
  k: function(e, r, n) {
    let a = e.getHours();
    return a === 0 && (a = 24), r === "ko" ? n.ordinalNumber(a, { unit: "hour" }) : V(a, r.length);
  },
  // Minute
  m: function(e, r, n) {
    return r === "mo" ? n.ordinalNumber(e.getMinutes(), { unit: "minute" }) : Pe.m(e, r);
  },
  // Second
  s: function(e, r, n) {
    return r === "so" ? n.ordinalNumber(e.getSeconds(), { unit: "second" }) : Pe.s(e, r);
  },
  // Fraction of second
  S: function(e, r) {
    return Pe.S(e, r);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, r, n) {
    const a = e.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (r) {
      // Hours and optional minutes
      case "X":
        return Gr(a);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return Ie(a);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return Ie(a, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, r, n) {
    const a = e.getTimezoneOffset();
    switch (r) {
      // Hours and optional minutes
      case "x":
        return Gr(a);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return Ie(a);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return Ie(a, ":");
    }
  },
  // Timezone (GMT)
  O: function(e, r, n) {
    const a = e.getTimezoneOffset();
    switch (r) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + Kr(a, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + Ie(a, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(e, r, n) {
    const a = e.getTimezoneOffset();
    switch (r) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + Kr(a, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + Ie(a, ":");
    }
  },
  // Seconds timestamp
  t: function(e, r, n) {
    const a = Math.trunc(+e / 1e3);
    return V(a, r.length);
  },
  // Milliseconds timestamp
  T: function(e, r, n) {
    return V(+e, r.length);
  }
};
function Kr(e, r = "") {
  const n = e > 0 ? "-" : "+", a = Math.abs(e), t = Math.trunc(a / 60), o = a % 60;
  return o === 0 ? n + String(t) : n + String(t) + r + V(o, 2);
}
function Gr(e, r) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + V(Math.abs(e) / 60, 2) : Ie(e, r);
}
function Ie(e, r = "") {
  const n = e > 0 ? "-" : "+", a = Math.abs(e), t = V(Math.trunc(a / 60), 2), o = V(a % 60, 2);
  return n + t + r + o;
}
const Jr = (e, r) => {
  switch (e) {
    case "P":
      return r.date({ width: "short" });
    case "PP":
      return r.date({ width: "medium" });
    case "PPP":
      return r.date({ width: "long" });
    case "PPPP":
    default:
      return r.date({ width: "full" });
  }
}, $n = (e, r) => {
  switch (e) {
    case "p":
      return r.time({ width: "short" });
    case "pp":
      return r.time({ width: "medium" });
    case "ppp":
      return r.time({ width: "long" });
    case "pppp":
    default:
      return r.time({ width: "full" });
  }
}, ds = (e, r) => {
  const n = e.match(/(P+)(p+)?/) || [], a = n[1], t = n[2];
  if (!t)
    return Jr(e, r);
  let o;
  switch (a) {
    case "P":
      o = r.dateTime({ width: "short" });
      break;
    case "PP":
      o = r.dateTime({ width: "medium" });
      break;
    case "PPP":
      o = r.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      o = r.dateTime({ width: "full" });
      break;
  }
  return o.replace("{{date}}", Jr(a, r)).replace("{{time}}", $n(t, r));
}, ps = {
  p: $n,
  P: ds
}, fs = /^D+$/, hs = /^Y+$/, gs = ["D", "DD", "YY", "YYYY"];
function ys(e) {
  return fs.test(e);
}
function ms(e) {
  return hs.test(e);
}
function vs(e, r, n) {
  const a = bs(e, r, n);
  if (console.warn(a), gs.includes(e)) throw new RangeError(a);
}
function bs(e, r, n) {
  const a = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${r}\`) for formatting ${a} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Os = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Ds = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Ss = /^'([^]*?)'?$/, ws = /''/g, ks = /[a-zA-Z]/;
function Zr(e, r, n) {
  const a = ft(), t = n?.locale ?? a.locale ?? tt, o = n?.firstWeekContainsDate ?? n?.locale?.options?.firstWeekContainsDate ?? a.firstWeekContainsDate ?? a.locale?.options?.firstWeekContainsDate ?? 1, i = n?.weekStartsOn ?? n?.locale?.options?.weekStartsOn ?? a.weekStartsOn ?? a.locale?.options?.weekStartsOn ?? 0, s = Se(e, n?.in);
  if (!Mi(s))
    throw new RangeError("Invalid time value");
  let u = r.match(Ds).map((f) => {
    const c = f[0];
    if (c === "p" || c === "P") {
      const h = ps[c];
      return h(f, t.formatLong);
    }
    return f;
  }).join("").match(Os).map((f) => {
    if (f === "''")
      return { isToken: !1, value: "'" };
    const c = f[0];
    if (c === "'")
      return { isToken: !1, value: _s(f) };
    if (Xr[c])
      return { isToken: !0, value: f };
    if (c.match(ks))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + c + "`"
      );
    return { isToken: !1, value: f };
  });
  t.localize.preprocessor && (u = t.localize.preprocessor(s, u));
  const d = {
    firstWeekContainsDate: o,
    weekStartsOn: i,
    locale: t
  };
  return u.map((f) => {
    if (!f.isToken) return f.value;
    const c = f.value;
    (!n?.useAdditionalWeekYearTokens && ms(c) || !n?.useAdditionalDayOfYearTokens && ys(c)) && vs(c, r, String(e));
    const h = Xr[c[0]];
    return h(s, c, t.localize, d);
  }).join("");
}
function _s(e) {
  const r = e.match(Ss);
  return r ? r[1].replace(ws, "'") : e;
}
const en = (e) => (
  // Casting is necessary here since the types are not yet up-to-date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  e?.getWeekInfo?.() ?? // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  e?.weekInfo ?? null
), $s = (e) => {
  const r = y.useMemo(() => {
    try {
      return en(new Intl.Locale(e));
    } catch {
      return en(new Intl.Locale("en-US"));
    }
  }, [e]);
  if (!r)
    return tt;
  const n = r.firstDay === 7 ? 0 : r.firstDay;
  return {
    ...tt,
    options: {
      ...tt.options,
      weekStartsOn: n
    }
  };
}, ht = "YYYY/MM/DD";
function gt(e) {
  return e.map((r) => new Date(r));
}
function Ms(e) {
  return e ? e.map((r) => Xe(r).format(ht)) : [];
}
function Ps({
  disabled: e,
  element: r,
  widgetMgr: n,
  fragmentId: a
}) {
  const t = Dr(), o = y.useContext(Fn), [i, s] = Xn({
    getStateFromWidgetMgr: Cs,
    getDefaultStateFromProto: Is,
    getCurrStateFromProto: Es,
    updateWidgetMgrState: Hs,
    element: r,
    widgetMgr: n,
    fragmentId: a
  }), [u, d] = y.useState(!1), [f, c] = y.useState(null), {
    colors: h,
    fontSizes: m,
    fontWeights: v,
    lineHeights: b,
    spacing: D,
    sizes: S
  } = Dr(), {
    locale: k
  } = y.useContext(Bn), $ = $s(k), _ = y.useMemo(() => Xe(r.min, ht).toDate(), [r.min]), A = y.useMemo(() => Pn(r), [r]), H = y.useMemo(() => {
    if (!r.isRange)
      return !1;
    const z = Xe().subtract(2, "years").toDate();
    return _ < z;
  }, [r.isRange, _]), R = r.default.length === 0 && !e, j = y.useMemo(() => r.format.replaceAll(/[a-zA-Z]/g, "9"), [r.format]), C = y.useMemo(() => r.format.replaceAll("Y", "y").replaceAll("D", "d"), [r.format]), L = y.useMemo(() => Zr(_, C, {
    locale: $
  }), [_, C, $]), I = y.useMemo(() => A ? Zr(A, C, {
    locale: $
  }) : "", [A, C, $]), E = y.useCallback((z) => {
    if (!z) return null;
    if (r.isRange) {
      const J = z === "End" ? `before ${I}` : `after ${L}`;
      return `**Error**: ${z} date set outside allowed range. Please select a date ${J}.`;
    }
    return `**Error**: Date set outside allowed range. Please select a date between ${L} and ${I}.`;
  }, [r.isRange, I, L]), T = y.useCallback(({
    date: z
  }) => {
    if (c(null), cn(z)) {
      s({
        value: [],
        fromUi: !0
      }), d(!0);
      return;
    }
    const J = Array.isArray(z) ? z.filter((p) => !!p).map((p) => Xt(p)) : Xt(z), {
      errorType: K,
      newDates: G
    } = Mn(J, _, A);
    K && c(E(K)), s({
      value: G,
      fromUi: !0
    }), d(!G);
  }, [s, E, c, _, A]), X = y.useCallback(() => {
    if (!u) return;
    const z = gt(r.default);
    s({
      value: z,
      fromUi: !0
    }), d(!z);
  }, [u, r, s]);
  return /* @__PURE__ */ Me.jsxs("div", { className: "stDateInput", "data-testid": "stDateInput", children: [
    /* @__PURE__ */ Me.jsx(Wn, { label: r.label, disabled: e, labelVisibility: Yn(r.labelVisibility?.value), children: r.help && /* @__PURE__ */ Me.jsx(Nn, { children: /* @__PURE__ */ Me.jsx(Vn, { content: r.help, placement: Sr.TOP_RIGHT }) }) }),
    /* @__PURE__ */ Me.jsx(Sn, { locale: $, density: le.high, formatString: C, mask: r.isRange ? `${j} – ${j}` : j, placeholder: r.isRange ? `${r.format} – ${r.format}` : r.format, disabled: e, onChange: T, onClose: X, quickSelect: H, overrides: {
      Popover: {
        props: {
          ignoreBoundary: o,
          placement: un.bottomLeft,
          overrides: {
            Body: {
              style: {
                marginTop: D.px
              }
            }
          }
        }
      },
      CalendarContainer: {
        style: {
          fontSize: m.sm,
          paddingRight: D.sm,
          paddingLeft: D.sm,
          paddingBottom: D.sm,
          paddingTop: D.sm
        }
      },
      Week: {
        style: {
          fontSize: m.sm
        }
      },
      Day: {
        style: ({
          // Due to a bug in BaseWeb, where the range selection defaults to mono300 and can't be changed, we need to override the background colors for all these shared props:
          // $pseudoHighlighted: Styles the range selection when you click an initial date, and hover over the end one, but NOT click it.
          // $pseudoSelected: Styles when a range was selected, click outide, and click the calendar again.
          // $selected: Styles the background below the red circle from the start and end dates.
          // $isHovered: Styles the background below the end date when hovered.
          $pseudoHighlighted: z,
          $pseudoSelected: J,
          $selected: K,
          $isHovered: G
        }) => ({
          fontSize: m.sm,
          lineHeight: b.base,
          "::before": {
            backgroundColor: K || J || z || G ? `${h.darkenedBgMix15} !important` : h.transparent
          },
          "::after": {
            borderColor: h.transparent
          },
          //Apply background color only when hovering over a date in the range in light theme
          ...Qn(t) && G && J && !K ? {
            color: h.secondaryBg
          } : {}
        })
      },
      PrevButton: {
        style: () => ({
          // Align icon to the center of the button.
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Remove primary-color click effect.
          ":active": {
            backgroundColor: h.transparent
          },
          ":focus": {
            backgroundColor: h.transparent,
            outline: 0
          }
        })
      },
      NextButton: {
        style: {
          // Align icon to the center of the button.
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Remove primary-color click effect.
          ":active": {
            backgroundColor: h.transparent
          },
          ":focus": {
            backgroundColor: h.transparent,
            outline: 0
          }
        }
      },
      Input: {
        props: {
          // The default maskChar ` ` causes empty dates to display as ` / / `
          // Clearing the maskChar so empty dates will not display
          maskChar: null,
          // Passes error icon/tooltip to underlying input in error state
          // otherwise no end enhancer is shown
          endEnhancer: f && /* @__PURE__ */ Me.jsx(zn, { content: /* @__PURE__ */ Me.jsx(Un, { source: f, allowHTML: !1 }), placement: Sr.TOP_RIGHT, error: !0, children: /* @__PURE__ */ Me.jsx(qn, { content: Zn, size: "lg" }) }),
          overrides: {
            EndEnhancer: {
              style: {
                // Match text color with st.error in light and dark mode
                color: h.redTextColor,
                backgroundColor: h.transparent
              }
            },
            Root: {
              style: {
                // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
                borderLeftWidth: S.borderWidth,
                borderRightWidth: S.borderWidth,
                borderTopWidth: S.borderWidth,
                borderBottomWidth: S.borderWidth,
                paddingRight: D.twoXS,
                // Baseweb has an error prop for the input, but its coloring doesn't reconcile
                // with our dark theme - we handle error state coloring manually here
                ...f && {
                  backgroundColor: h.redBackgroundColor
                }
              }
            },
            ClearIcon: {
              props: {
                overrides: {
                  Svg: {
                    style: {
                      color: h.grayTextColor,
                      // setting this width and height makes the clear-icon align with dropdown arrows of other input fields
                      padding: D.threeXS,
                      height: S.clearIconSize,
                      width: S.clearIconSize,
                      ":hover": {
                        fill: h.bodyText
                      }
                    }
                  }
                }
              }
            },
            InputContainer: {
              style: {
                // Explicitly specified so error background renders correctly
                backgroundColor: "transparent"
              }
            },
            Input: {
              style: {
                fontWeight: v.normal,
                // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
                paddingRight: D.sm,
                paddingLeft: D.md,
                paddingBottom: D.sm,
                paddingTop: D.sm,
                lineHeight: b.inputWidget,
                "::placeholder": {
                  color: h.fadedText60
                },
                // Change input value text color in error state - matches st.error in light and dark mode
                ...f && {
                  color: h.redTextColor
                }
              },
              props: {
                "data-testid": "stDateInputField"
              }
            }
          }
        }
      },
      QuickSelect: {
        props: {
          overrides: {
            ControlContainer: {
              style: {
                height: S.minElementHeight,
                // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
                borderLeftWidth: S.borderWidth,
                borderRightWidth: S.borderWidth,
                borderTopWidth: S.borderWidth,
                borderBottomWidth: S.borderWidth
              }
            }
          }
        }
      }
    }, value: i, minDate: _, maxDate: A, range: r.isRange, clearable: R })
  ] });
}
function Cs(e, r) {
  const n = e.getStringArrayValue(r), a = n !== void 0 ? n : r.default || [];
  return gt(a);
}
function Is(e) {
  return gt(e.default) ?? [];
}
function Es(e) {
  return gt(e.value) ?? [];
}
function Hs(e, r, n, a) {
  const t = Xe(e.min, ht).toDate(), o = Pn(e);
  let i = !0;
  const s = (n.value || []).map((d) => Xt(d)), {
    errorType: u
  } = Mn(s, t, o);
  u && (i = !1), i && r.setStringArrayValue(e, Ms(n.value), {
    fromUi: n.fromUi
  }, a);
}
function Mn(e, r, n) {
  const a = [];
  let t = null;
  return cn(e) ? {
    errorType: null,
    newDates: []
  } : (Array.isArray(e) ? e.forEach((o) => {
    o && (n && o > n ? t = "End" : o < r && (t = "Start"), a.push(o));
  }) : e && (n && e > n ? t = "End" : e < r && (t = "Start"), a.push(e)), {
    errorType: t,
    newDates: a
  });
}
function Pn(e) {
  const r = e.max;
  return r && r.length > 0 ? Xe(r, ht).toDate() : void 0;
}
function Xt(e) {
  const r = new Date(e.getTime());
  return r.setHours(0, 0, 0, 0), r;
}
const Fs = y.memo(Ps);
export {
  Fs as default
};
//# sourceMappingURL=index-BjQUcEtI.js.map
