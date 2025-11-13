import { r as d, E as Zs, _ as ze, c9 as Jh, a3 as vr, bF as es, b1 as xo, b2 as Qh, ca as eg, cb as tg, cc as td, cd as nd, al as Bt, ce as ng, cf as rd, cg as rg, ch as ig, ci as og, cj as ag, ck as sg, cl as lg, a9 as Dr, a2 as ug, cm as cg, k as Pe, b4 as id, n as st, cn as ao, bt as Xr, co as dg, c6 as ts, j as me, s as tr, cp as fg, cq as hg, aE as an, aT as gg, cr as Ql, cs as pg, ct as mg, cu as vg, bw as bg, cv as wg, cw as yg, cx as od, cy as Cg, cz as Sg, cA as Fs, cB as ad, cC as sd, cD as xg, cE as kg, cF as Mg, cG as Rg, cH as Eg, cI as Ig, cJ as Tg, cK as Dg, cL as Og, cM as ld, cN as Pg, cO as Lg, cP as Fg, cQ as _g, cR as Ag, aR as Hg, aS as zg, cS as Vg, cT as $g, aQ as Ng, cU as Bg, cV as Wg, cW as Ug, aP as jg, u as Qr, cX as sn, x as Js, cY as qg, bN as so, cZ as lr, c_ as Gg, c$ as Yg, d0 as Xg, d1 as Kg, d2 as Zg, d3 as Jg, d4 as ra, d5 as Gi, d6 as Ht, d7 as Qg, d8 as ep, d9 as tp, da as np, db as qr, dc as It, dd as bn, de as eu, df as tu, dg as ca, dh as rp, di as ud, dj as cd, dk as ip, dl as _s, dm as op, dn as ap, dp as dd, dq as sp, dr as nu, ds as lp, dt as fd, du as up, dv as cp, aA as dp, a8 as hd, c3 as Oi, dw as fp, t as ki, dx as hp, dy as gp, aV as ns, bJ as Ea, bL as Ia, dz as gd, h as Ta, y as Zn, dA as pp, bM as pd, dB as mp, f as vp, J as ru, dC as bp, dD as wp, L as yp, dE as Cp, dF as iu } from "./index-COqA-032.js";
import { w as Sp, E as xp } from "./withFullScreenWrapper-Bd7ZpoRc.js";
import { T as kp, a as Si } from "./Toolbar-DRAqg1o6.js";
import { u as Mp } from "./FormClearHelper-DQ1jkgFN.js";
import { s as Rp } from "./sprintf-D5E86llw.js";
import { S as Ep, L as Ip, a as Tp } from "./checkbox-DufG68jn.js";
import { c as Dp } from "./createDownloadLinkElement-CbRjLJ8e.js";
import { _ as gr, C as Op } from "./slicedToArray-CHnELQWR.js";
import { b as Pp, d as Lp, c as Fp } from "./inherits-DZBdSoid.js";
import { _ as _p } from "./createSuper-ZQh_QQod.js";
import { D as Ap, F as Hp } from "./FileDownload.esm-BSuit0oM.js";
var md = /* @__PURE__ */ d.forwardRef(function(e, t) {
  var n = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ d.createElement(Zs, ze({
    iconAttrs: n,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, e, {
    ref: t
  }), /* @__PURE__ */ d.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ d.createElement("path", {
    d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
  }));
});
md.displayName = "Add";
var vd = /* @__PURE__ */ d.forwardRef(function(e, t) {
  var n = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ d.createElement(Zs, ze({
    iconAttrs: n,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, e, {
    ref: t
  }), /* @__PURE__ */ d.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ d.createElement("path", {
    d: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
  }));
});
vd.displayName = "Search";
var bd = /* @__PURE__ */ d.forwardRef(function(e, t) {
  var n = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ d.createElement(Zs, ze({
    iconAttrs: n,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, e, {
    ref: t
  }), /* @__PURE__ */ d.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ d.createElement("path", {
    d: "M12 6a9.77 9.77 0 018.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0112 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 010 5 2.5 2.5 0 010-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"
  }));
});
bd.displayName = "Visibility";
var rs, ou;
function zp() {
  if (ou) return rs;
  ou = 1;
  var e = Object.prototype, t = e.hasOwnProperty;
  function n(r, i) {
    return r != null && t.call(r, i);
  }
  return rs = n, rs;
}
var is, au;
function Vp() {
  if (au) return is;
  au = 1;
  var e = zp(), t = Jh();
  function n(r, i) {
    return r != null && t(r, i, e);
  }
  return is = n, is;
}
var $p = Vp();
const Np = /* @__PURE__ */ vr($p);
function wd(e = "This should not happen") {
  throw new Error(e);
}
function Vn(e, t = "Assertion failed") {
  if (!e)
    return wd(t);
}
function po(e, t) {
  return wd(t ?? "Hell froze over");
}
function Bp(e, t) {
  try {
    return e();
  } catch {
    return t;
  }
}
const su = Object.prototype.hasOwnProperty;
function Li(e, t) {
  let n, r;
  if (e === t)
    return !0;
  if (e && t && (n = e.constructor) === t.constructor) {
    if (n === Date)
      return e.getTime() === t.getTime();
    if (n === RegExp)
      return e.toString() === t.toString();
    if (n === Array) {
      if ((r = e.length) === t.length)
        for (; r-- && Li(e[r], t[r]); )
          ;
      return r === -1;
    }
    if (!n || typeof e == "object") {
      r = 0;
      for (n in e)
        if (su.call(e, n) && ++r && !su.call(t, n) || !(n in t) || !Li(e[n], t[n]))
          return !1;
      return Object.keys(t).length === r;
    }
  }
  return e !== e && t !== t;
}
const da = null, Qs = void 0;
var Z;
(function(e) {
  e.Uri = "uri", e.Text = "text", e.Image = "image", e.RowID = "row-id", e.Number = "number", e.Bubble = "bubble", e.Boolean = "boolean", e.Loading = "loading", e.Markdown = "markdown", e.Drilldown = "drilldown", e.Protected = "protected", e.Custom = "custom";
})(Z || (Z = {}));
var lu;
(function(e) {
  e.HeaderRowID = "headerRowID", e.HeaderCode = "headerCode", e.HeaderNumber = "headerNumber", e.HeaderString = "headerString", e.HeaderBoolean = "headerBoolean", e.HeaderAudioUri = "headerAudioUri", e.HeaderVideoUri = "headerVideoUri", e.HeaderEmoji = "headerEmoji", e.HeaderImage = "headerImage", e.HeaderUri = "headerUri", e.HeaderPhone = "headerPhone", e.HeaderMarkdown = "headerMarkdown", e.HeaderDate = "headerDate", e.HeaderTime = "headerTime", e.HeaderEmail = "headerEmail", e.HeaderReference = "headerReference", e.HeaderIfThenElse = "headerIfThenElse", e.HeaderSingleValue = "headerSingleValue", e.HeaderLookup = "headerLookup", e.HeaderTextTemplate = "headerTextTemplate", e.HeaderMath = "headerMath", e.HeaderRollup = "headerRollup", e.HeaderJoinStrings = "headerJoinStrings", e.HeaderSplitString = "headerSplitString", e.HeaderGeoDistance = "headerGeoDistance", e.HeaderArray = "headerArray", e.RowOwnerOverlay = "rowOwnerOverlay", e.ProtectedColumnOverlay = "protectedColumnOverlay";
})(lu || (lu = {}));
var fa;
(function(e) {
  e.Triangle = "triangle", e.Dots = "dots";
})(fa || (fa = {}));
function Bo(e) {
  return "width" in e && typeof e.width == "number";
}
async function uu(e) {
  return typeof e == "object" ? e : await e();
}
function Mi(e) {
  return !(e.kind === Z.Loading || e.kind === Z.Bubble || e.kind === Z.RowID || e.kind === Z.Protected || e.kind === Z.Drilldown);
}
function Ii(e) {
  return e.kind === qn.Marker || e.kind === qn.NewRow;
}
function Ri(e) {
  if (!Mi(e) || e.kind === Z.Image)
    return !1;
  switch (e.kind) {
    case Z.Text:
    case Z.Number:
    case Z.Markdown:
    case Z.Uri:
    case Z.Custom:
    case Z.Boolean:
      return e.readonly !== !0;
    default:
      po(e, "A cell was passed with an invalid kind");
  }
}
function Wp(e) {
  return Np(e, "editor");
}
function el(e) {
  return !(e.readonly ?? !1);
}
var qn;
(function(e) {
  e.NewRow = "new-row", e.Marker = "marker";
})(qn || (qn = {}));
const ha = {
  shape: "square",
  size: 4,
  offsetX: -2,
  offsetY: -2,
  outline: 0
};
function os(e) {
  if (e.length === 0)
    return [];
  const t = [...e], n = [];
  t.sort(function(r, i) {
    return r[0] - i[0];
  }), n.push([...t[0]]);
  for (const r of t.slice(1)) {
    const i = n[n.length - 1];
    i[1] < r[0] ? n.push([...r]) : i[1] < r[1] && (i[1] = r[1]);
  }
  return n;
}
let cu;
class Qe {
  items;
  constructor(t) {
    this.items = t;
  }
  static create = (t) => new Qe(os(t));
  static empty = () => cu ?? (cu = new Qe([]));
  static fromSingleSelection = (t) => Qe.empty().add(t);
  static fromArray = (t) => {
    if (t.length === 0)
      return Qe.empty();
    const n = t.map((i) => [i, i + 1]), r = os(n);
    return new Qe(r);
  };
  offset(t) {
    if (t === 0)
      return this;
    const n = this.items.map((r) => [r[0] + t, r[1] + t]);
    return new Qe(n);
  }
  add(t) {
    const n = typeof t == "number" ? [t, t + 1] : t, r = os([...this.items, n]);
    return new Qe(r);
  }
  remove(t) {
    const n = [...this.items], r = typeof t == "number" ? t : t[0], i = typeof t == "number" ? t + 1 : t[1];
    for (const [o, s] of n.entries()) {
      const [a, l] = s;
      if (a <= i && r <= l) {
        const u = [];
        a < r && u.push([a, r]), i < l && u.push([i, l]), n.splice(o, 1, ...u);
      }
    }
    return new Qe(n);
  }
  first() {
    if (this.items.length !== 0)
      return this.items[0][0];
  }
  last() {
    if (this.items.length !== 0)
      return this.items.slice(-1)[0][1] - 1;
  }
  hasIndex(t) {
    for (let n = 0; n < this.items.length; n++) {
      const [r, i] = this.items[n];
      if (t >= r && t < i)
        return !0;
    }
    return !1;
  }
  hasAll(t) {
    for (let n = t[0]; n < t[1]; n++)
      if (!this.hasIndex(n))
        return !1;
    return !0;
  }
  some(t) {
    for (const n of this)
      if (t(n))
        return !0;
    return !1;
  }
  equals(t) {
    if (t === this)
      return !0;
    if (t.items.length !== this.items.length)
      return !1;
    for (let n = 0; n < this.items.length; n++) {
      const r = t.items[n], i = this.items[n];
      if (r[0] !== i[0] || r[1] !== i[1])
        return !1;
    }
    return !0;
  }
  // Really old JS wont have access to the iterator and babel will stop people using it
  // when trying to support browsers so old we don't support them anyway. What goes on
  // between an engineer and their bundler in the privacy of their CI server is none of
  // my business anyway.
  toArray() {
    const t = [];
    for (const [n, r] of this.items)
      for (let i = n; i < r; i++)
        t.push(i);
    return t;
  }
  get length() {
    let t = 0;
    for (const [n, r] of this.items)
      t += r - n;
    return t;
  }
  *[Symbol.iterator]() {
    for (const [t, n] of this.items)
      for (let r = t; r < n; r++)
        yield r;
  }
}
var Up = function() {
  const t = Array.prototype.slice.call(arguments).filter(Boolean), n = {}, r = [];
  t.forEach((o) => {
    (o ? o.split(" ") : []).forEach((a) => {
      if (a.startsWith("atm_")) {
        const [, l] = a.split("_");
        n[l] = a;
      } else
        r.push(a);
    });
  });
  const i = [];
  for (const o in n)
    Object.prototype.hasOwnProperty.call(n, o) && i.push(n[o]);
  return i.push(...r), i.join(" ");
}, du = Up, jp = (e) => e.toUpperCase() === e, qp = (e) => (t) => e.indexOf(t) === -1, yd = (e, t) => {
  const n = {};
  return Object.keys(e).filter(qp(t)).forEach((r) => {
    n[r] = e[r];
  }), n;
};
function Gp(e, t, n) {
  const r = yd(t, n);
  if (!e) {
    const i = typeof es == "function" ? { default: es } : es;
    Object.keys(r).forEach((o) => {
      i.default(o) || delete r[o];
    });
  }
  return r;
}
var Yp = (e, t) => {
};
function Xp(e) {
  let t = "";
  return (n) => {
    const r = (o, s) => {
      const { as: a = e, class: l = t } = o, u = n.propsAsIs === void 0 ? !(typeof a == "string" && a.indexOf("-") === -1 && !jp(a[0])) : n.propsAsIs, c = Gp(u, o, [
        "as",
        "class"
      ]);
      c.ref = s, c.className = n.atomic ? du(n.class, c.className || l) : du(c.className || l, n.class);
      const { vars: f } = n;
      if (f) {
        const g = {};
        for (const m in f) {
          const w = f[m], b = w[0], v = w[1] || "", C = typeof b == "function" ? b(o) : b;
          Yp(C, n.name), g[`--${m}`] = `${C}${v}`;
        }
        const h = c.style || {}, p = Object.keys(h);
        p.length > 0 && p.forEach((m) => {
          g[m] = h[m];
        }), c.style = g;
      }
      return e.__wyw_meta && e !== a ? (c.as = a, d.createElement(e, c)) : d.createElement(a, c);
    }, i = d.forwardRef ? d.forwardRef(r) : (
      // React.forwardRef won't available on older React versions and in Preact
      // Fallback to a innerRef prop in that case
      ((o) => {
        const s = yd(o, ["innerRef"]);
        return r(s, o.innerRef);
      })
    );
    return i.displayName = n.name, i.__wyw_meta = {
      className: n.class || t,
      extends: e
    }, i;
  };
}
var fn = Xp;
const Kp = /* @__PURE__ */ fn("div")({
  name: "ImageOverlayEditorStyle",
  class: "gdg-i2iowwq",
  propsAsIs: !1
});
var as = {}, Yi = {}, Wo = {}, Uo = {}, fu;
function Zp() {
  return fu || (fu = 1, (function(e) {
    (function(t, n) {
      n(e, xo(), /* @__PURE__ */ Qh());
    })(Uo, function(t, n, r) {
      Object.defineProperty(t, "__esModule", {
        value: !0
      }), t.setHasSupportToCaptureOption = p;
      var i = s(n), o = s(r);
      function s(v) {
        return v && v.__esModule ? v : {
          default: v
        };
      }
      var a = Object.assign || function(v) {
        for (var C = 1; C < arguments.length; C++) {
          var I = arguments[C];
          for (var E in I)
            Object.prototype.hasOwnProperty.call(I, E) && (v[E] = I[E]);
        }
        return v;
      };
      function l(v, C) {
        var I = {};
        for (var E in v)
          C.indexOf(E) >= 0 || Object.prototype.hasOwnProperty.call(v, E) && (I[E] = v[E]);
        return I;
      }
      function u(v, C) {
        if (!(v instanceof C))
          throw new TypeError("Cannot call a class as a function");
      }
      var c = /* @__PURE__ */ (function() {
        function v(C, I) {
          for (var E = 0; E < I.length; E++) {
            var R = I[E];
            R.enumerable = R.enumerable || !1, R.configurable = !0, "value" in R && (R.writable = !0), Object.defineProperty(C, R.key, R);
          }
        }
        return function(C, I, E) {
          return I && v(C.prototype, I), E && v(C, E), C;
        };
      })();
      function f(v, C) {
        if (!v)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return C && (typeof C == "object" || typeof C == "function") ? C : v;
      }
      function g(v, C) {
        if (typeof C != "function" && C !== null)
          throw new TypeError("Super expression must either be null or a function, not " + typeof C);
        v.prototype = Object.create(C && C.prototype, {
          constructor: {
            value: v,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        }), C && (Object.setPrototypeOf ? Object.setPrototypeOf(v, C) : v.__proto__ = C);
      }
      var h = !1;
      function p(v) {
        h = v;
      }
      try {
        addEventListener("test", null, Object.defineProperty({}, "capture", { get: function() {
          p(!0);
        } }));
      } catch {
      }
      function m() {
        var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { capture: !0 };
        return h ? v : v.capture;
      }
      function w(v) {
        if ("touches" in v) {
          var C = v.touches[0], I = C.pageX, E = C.pageY;
          return { x: I, y: E };
        }
        var R = v.screenX, P = v.screenY;
        return { x: R, y: P };
      }
      var b = (function(v) {
        g(C, v);
        function C() {
          var I;
          u(this, C);
          for (var E = arguments.length, R = Array(E), P = 0; P < E; P++)
            R[P] = arguments[P];
          var x = f(this, (I = C.__proto__ || Object.getPrototypeOf(C)).call.apply(I, [this].concat(R)));
          return x._handleSwipeStart = x._handleSwipeStart.bind(x), x._handleSwipeMove = x._handleSwipeMove.bind(x), x._handleSwipeEnd = x._handleSwipeEnd.bind(x), x._onMouseDown = x._onMouseDown.bind(x), x._onMouseMove = x._onMouseMove.bind(x), x._onMouseUp = x._onMouseUp.bind(x), x._setSwiperRef = x._setSwiperRef.bind(x), x;
        }
        return c(C, [{
          key: "componentDidMount",
          value: function() {
            this.swiper && this.swiper.addEventListener("touchmove", this._handleSwipeMove, m({
              capture: !0,
              passive: !1
            }));
          }
        }, {
          key: "componentWillUnmount",
          value: function() {
            this.swiper && this.swiper.removeEventListener("touchmove", this._handleSwipeMove, m({
              capture: !0,
              passive: !1
            }));
          }
        }, {
          key: "_onMouseDown",
          value: function(E) {
            this.props.allowMouseEvents && (this.mouseDown = !0, document.addEventListener("mouseup", this._onMouseUp), document.addEventListener("mousemove", this._onMouseMove), this._handleSwipeStart(E));
          }
        }, {
          key: "_onMouseMove",
          value: function(E) {
            this.mouseDown && this._handleSwipeMove(E);
          }
        }, {
          key: "_onMouseUp",
          value: function(E) {
            this.mouseDown = !1, document.removeEventListener("mouseup", this._onMouseUp), document.removeEventListener("mousemove", this._onMouseMove), this._handleSwipeEnd(E);
          }
        }, {
          key: "_handleSwipeStart",
          value: function(E) {
            var R = w(E), P = R.x, x = R.y;
            this.moveStart = { x: P, y: x }, this.props.onSwipeStart(E);
          }
        }, {
          key: "_handleSwipeMove",
          value: function(E) {
            if (this.moveStart) {
              var R = w(E), P = R.x, x = R.y, S = P - this.moveStart.x, F = x - this.moveStart.y;
              this.moving = !0;
              var D = this.props.onSwipeMove({
                x: S,
                y: F
              }, E);
              D && E.cancelable && E.preventDefault(), this.movePosition = { deltaX: S, deltaY: F };
            }
          }
        }, {
          key: "_handleSwipeEnd",
          value: function(E) {
            this.props.onSwipeEnd(E);
            var R = this.props.tolerance;
            this.moving && this.movePosition && (this.movePosition.deltaX < -R ? this.props.onSwipeLeft(1, E) : this.movePosition.deltaX > R && this.props.onSwipeRight(1, E), this.movePosition.deltaY < -R ? this.props.onSwipeUp(1, E) : this.movePosition.deltaY > R && this.props.onSwipeDown(1, E)), this.moveStart = null, this.moving = !1, this.movePosition = null;
          }
        }, {
          key: "_setSwiperRef",
          value: function(E) {
            this.swiper = E, this.props.innerRef(E);
          }
        }, {
          key: "render",
          value: function() {
            var E = this.props;
            E.tagName;
            var R = E.className, P = E.style, x = E.children;
            E.allowMouseEvents, E.onSwipeUp, E.onSwipeDown, E.onSwipeLeft, E.onSwipeRight, E.onSwipeStart, E.onSwipeMove, E.onSwipeEnd, E.innerRef, E.tolerance;
            var S = l(E, ["tagName", "className", "style", "children", "allowMouseEvents", "onSwipeUp", "onSwipeDown", "onSwipeLeft", "onSwipeRight", "onSwipeStart", "onSwipeMove", "onSwipeEnd", "innerRef", "tolerance"]);
            return i.default.createElement(
              this.props.tagName,
              a({
                ref: this._setSwiperRef,
                onMouseDown: this._onMouseDown,
                onTouchStart: this._handleSwipeStart,
                onTouchEnd: this._handleSwipeEnd,
                className: R,
                style: P
              }, S),
              x
            );
          }
        }]), C;
      })(n.Component);
      b.displayName = "ReactSwipe", b.propTypes = {
        tagName: o.default.string,
        className: o.default.string,
        style: o.default.object,
        children: o.default.node,
        allowMouseEvents: o.default.bool,
        onSwipeUp: o.default.func,
        onSwipeDown: o.default.func,
        onSwipeLeft: o.default.func,
        onSwipeRight: o.default.func,
        onSwipeStart: o.default.func,
        onSwipeMove: o.default.func,
        onSwipeEnd: o.default.func,
        innerRef: o.default.func,
        tolerance: o.default.number.isRequired
      }, b.defaultProps = {
        tagName: "div",
        allowMouseEvents: !1,
        onSwipeUp: function() {
        },
        onSwipeDown: function() {
        },
        onSwipeLeft: function() {
        },
        onSwipeRight: function() {
        },
        onSwipeStart: function() {
        },
        onSwipeMove: function() {
        },
        onSwipeEnd: function() {
        },
        innerRef: function() {
        },
        tolerance: 0
      }, t.default = b;
    });
  })(Uo)), Uo;
}
var hu;
function Cd() {
  return hu || (hu = 1, (function(e) {
    (function(t, n) {
      n(e, Zp());
    })(Wo, function(t, n) {
      Object.defineProperty(t, "__esModule", {
        value: !0
      });
      var r = i(n);
      function i(o) {
        return o && o.__esModule ? o : {
          default: o
        };
      }
      t.default = r.default;
    });
  })(Wo)), Wo;
}
var Xi = {}, gu;
function Sd() {
  if (gu) return Xi;
  gu = 1, Object.defineProperty(Xi, "__esModule", {
    value: !0
  }), Xi.default = void 0;
  var e = t(eg());
  function t(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function n(i, o, s) {
    return o in i ? Object.defineProperty(i, o, { value: s, enumerable: !0, configurable: !0, writable: !0 }) : i[o] = s, i;
  }
  var r = {
    ROOT: function(o) {
      return (0, e.default)(n({
        "carousel-root": !0
      }, o || "", !!o));
    },
    CAROUSEL: function(o) {
      return (0, e.default)({
        carousel: !0,
        "carousel-slider": o
      });
    },
    WRAPPER: function(o, s) {
      return (0, e.default)({
        "thumbs-wrapper": !o,
        "slider-wrapper": o,
        "axis-horizontal": s === "horizontal",
        "axis-vertical": s !== "horizontal"
      });
    },
    SLIDER: function(o, s) {
      return (0, e.default)({
        thumbs: !o,
        slider: o,
        animated: !s
      });
    },
    ITEM: function(o, s, a) {
      return (0, e.default)({
        thumb: !o,
        slide: o,
        selected: s,
        previous: a
      });
    },
    ARROW_PREV: function(o) {
      return (0, e.default)({
        "control-arrow control-prev": !0,
        "control-disabled": o
      });
    },
    ARROW_NEXT: function(o) {
      return (0, e.default)({
        "control-arrow control-next": !0,
        "control-disabled": o
      });
    },
    DOT: function(o) {
      return (0, e.default)({
        dot: !0,
        selected: o
      });
    }
  };
  return Xi.default = r, Xi;
}
var Ki = {}, Zi = {}, pu;
function Jp() {
  if (pu) return Zi;
  pu = 1, Object.defineProperty(Zi, "__esModule", {
    value: !0
  }), Zi.outerWidth = void 0;
  var e = function(n) {
    var r = n.offsetWidth, i = getComputedStyle(n);
    return r += parseInt(i.marginLeft) + parseInt(i.marginRight), r;
  };
  return Zi.outerWidth = e, Zi;
}
var Ji = {}, mu;
function tl() {
  if (mu) return Ji;
  mu = 1, Object.defineProperty(Ji, "__esModule", {
    value: !0
  }), Ji.default = void 0;
  var e = function(n, r, i) {
    var o = n === 0 ? n : n + r, s = i === "horizontal" ? [o, 0, 0] : [0, o, 0], a = "translate3d", l = "(" + s.join(",") + ")";
    return a + l;
  };
  return Ji.default = e, Ji;
}
var Qi = {}, vu;
function xd() {
  if (vu) return Qi;
  vu = 1, Object.defineProperty(Qi, "__esModule", {
    value: !0
  }), Qi.default = void 0;
  var e = function() {
    return window;
  };
  return Qi.default = e, Qi;
}
var bu;
function kd() {
  if (bu) return Ki;
  bu = 1, Object.defineProperty(Ki, "__esModule", {
    value: !0
  }), Ki.default = void 0;
  var e = l(xo()), t = s(Sd()), n = Jp(), r = s(tl()), i = s(Cd()), o = s(xd());
  function s(x) {
    return x && x.__esModule ? x : { default: x };
  }
  function a() {
    if (typeof WeakMap != "function") return null;
    var x = /* @__PURE__ */ new WeakMap();
    return a = function() {
      return x;
    }, x;
  }
  function l(x) {
    if (x && x.__esModule)
      return x;
    if (x === null || u(x) !== "object" && typeof x != "function")
      return { default: x };
    var S = a();
    if (S && S.has(x))
      return S.get(x);
    var F = {}, D = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var M in x)
      if (Object.prototype.hasOwnProperty.call(x, M)) {
        var T = D ? Object.getOwnPropertyDescriptor(x, M) : null;
        T && (T.get || T.set) ? Object.defineProperty(F, M, T) : F[M] = x[M];
      }
    return F.default = x, S && S.set(x, F), F;
  }
  function u(x) {
    "@babel/helpers - typeof";
    return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? u = function(F) {
      return typeof F;
    } : u = function(F) {
      return F && typeof Symbol == "function" && F.constructor === Symbol && F !== Symbol.prototype ? "symbol" : typeof F;
    }, u(x);
  }
  function c() {
    return c = Object.assign || function(x) {
      for (var S = 1; S < arguments.length; S++) {
        var F = arguments[S];
        for (var D in F)
          Object.prototype.hasOwnProperty.call(F, D) && (x[D] = F[D]);
      }
      return x;
    }, c.apply(this, arguments);
  }
  function f(x, S) {
    if (!(x instanceof S))
      throw new TypeError("Cannot call a class as a function");
  }
  function g(x, S) {
    for (var F = 0; F < S.length; F++) {
      var D = S[F];
      D.enumerable = D.enumerable || !1, D.configurable = !0, "value" in D && (D.writable = !0), Object.defineProperty(x, D.key, D);
    }
  }
  function h(x, S, F) {
    return S && g(x.prototype, S), x;
  }
  function p(x, S) {
    if (typeof S != "function" && S !== null)
      throw new TypeError("Super expression must either be null or a function");
    x.prototype = Object.create(S && S.prototype, { constructor: { value: x, writable: !0, configurable: !0 } }), S && m(x, S);
  }
  function m(x, S) {
    return m = Object.setPrototypeOf || function(D, M) {
      return D.__proto__ = M, D;
    }, m(x, S);
  }
  function w(x) {
    var S = C();
    return function() {
      var D = I(x), M;
      if (S) {
        var T = I(this).constructor;
        M = Reflect.construct(D, arguments, T);
      } else
        M = D.apply(this, arguments);
      return b(this, M);
    };
  }
  function b(x, S) {
    return S && (u(S) === "object" || typeof S == "function") ? S : v(x);
  }
  function v(x) {
    if (x === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return x;
  }
  function C() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function I(x) {
    return I = Object.setPrototypeOf ? Object.getPrototypeOf : function(F) {
      return F.__proto__ || Object.getPrototypeOf(F);
    }, I(x);
  }
  function E(x, S, F) {
    return S in x ? Object.defineProperty(x, S, { value: F, enumerable: !0, configurable: !0, writable: !0 }) : x[S] = F, x;
  }
  var R = function(S) {
    return S.hasOwnProperty("key");
  }, P = /* @__PURE__ */ (function(x) {
    p(F, x);
    var S = w(F);
    function F(D) {
      var M;
      return f(this, F), M = S.call(this, D), E(v(M), "itemsWrapperRef", void 0), E(v(M), "itemsListRef", void 0), E(v(M), "thumbsRef", void 0), E(v(M), "setItemsWrapperRef", function(T) {
        M.itemsWrapperRef = T;
      }), E(v(M), "setItemsListRef", function(T) {
        M.itemsListRef = T;
      }), E(v(M), "setThumbsRef", function(T, O) {
        M.thumbsRef || (M.thumbsRef = []), M.thumbsRef[O] = T;
      }), E(v(M), "updateSizes", function() {
        if (!(!M.props.children || !M.itemsWrapperRef || !M.thumbsRef)) {
          var T = e.Children.count(M.props.children), O = M.itemsWrapperRef.clientWidth, k = M.props.thumbWidth ? M.props.thumbWidth : (0, n.outerWidth)(M.thumbsRef[0]), N = Math.floor(O / k), q = N < T, Y = q ? T - N : 0;
          M.setState(function(ue, ee) {
            return {
              itemSize: k,
              visibleItems: N,
              firstItem: q ? M.getFirstItem(ee.selectedItem) : 0,
              lastPosition: Y,
              showArrows: q
            };
          });
        }
      }), E(v(M), "handleClickItem", function(T, O, k) {
        if (!R(k) || k.key === "Enter") {
          var N = M.props.onSelectItem;
          typeof N == "function" && N(T, O);
        }
      }), E(v(M), "onSwipeStart", function() {
        M.setState({
          swiping: !0
        });
      }), E(v(M), "onSwipeEnd", function() {
        M.setState({
          swiping: !1
        });
      }), E(v(M), "onSwipeMove", function(T) {
        var O = T.x;
        if (!M.state.itemSize || !M.itemsWrapperRef || !M.state.visibleItems)
          return !1;
        var k = 0, N = e.Children.count(M.props.children), q = -(M.state.firstItem * 100) / M.state.visibleItems, Y = Math.max(N - M.state.visibleItems, 0), ue = -Y * 100 / M.state.visibleItems;
        q === k && O > 0 && (O = 0), q === ue && O < 0 && (O = 0);
        var ee = M.itemsWrapperRef.clientWidth, te = q + 100 / (ee / O);
        return M.itemsListRef && ["WebkitTransform", "MozTransform", "MsTransform", "OTransform", "transform", "msTransform"].forEach(function(ce) {
          M.itemsListRef.style[ce] = (0, r.default)(te, "%", M.props.axis);
        }), !0;
      }), E(v(M), "slideRight", function(T) {
        M.moveTo(M.state.firstItem - (typeof T == "number" ? T : 1));
      }), E(v(M), "slideLeft", function(T) {
        M.moveTo(M.state.firstItem + (typeof T == "number" ? T : 1));
      }), E(v(M), "moveTo", function(T) {
        T = T < 0 ? 0 : T, T = T >= M.state.lastPosition ? M.state.lastPosition : T, M.setState({
          firstItem: T
        });
      }), M.state = {
        selectedItem: D.selectedItem,
        swiping: !1,
        showArrows: !1,
        firstItem: 0,
        visibleItems: 0,
        lastPosition: 0
      }, M;
    }
    return h(F, [{
      key: "componentDidMount",
      value: function() {
        this.setupThumbs();
      }
    }, {
      key: "componentDidUpdate",
      value: function(M) {
        this.props.selectedItem !== this.state.selectedItem && this.setState({
          selectedItem: this.props.selectedItem,
          firstItem: this.getFirstItem(this.props.selectedItem)
        }), this.props.children !== M.children && this.updateSizes();
      }
    }, {
      key: "componentWillUnmount",
      value: function() {
        this.destroyThumbs();
      }
    }, {
      key: "setupThumbs",
      value: function() {
        (0, o.default)().addEventListener("resize", this.updateSizes), (0, o.default)().addEventListener("DOMContentLoaded", this.updateSizes), this.updateSizes();
      }
    }, {
      key: "destroyThumbs",
      value: function() {
        (0, o.default)().removeEventListener("resize", this.updateSizes), (0, o.default)().removeEventListener("DOMContentLoaded", this.updateSizes);
      }
    }, {
      key: "getFirstItem",
      value: function(M) {
        var T = M;
        return M >= this.state.lastPosition && (T = this.state.lastPosition), M < this.state.firstItem + this.state.visibleItems && (T = this.state.firstItem), M < this.state.firstItem && (T = M), T;
      }
    }, {
      key: "renderItems",
      value: function() {
        var M = this;
        return this.props.children.map(function(T, O) {
          var k = t.default.ITEM(!1, O === M.state.selectedItem), N = {
            key: O,
            ref: function(Y) {
              return M.setThumbsRef(Y, O);
            },
            className: k,
            onClick: M.handleClickItem.bind(M, O, M.props.children[O]),
            onKeyDown: M.handleClickItem.bind(M, O, M.props.children[O]),
            "aria-label": "".concat(M.props.labels.item, " ").concat(O + 1),
            style: {
              width: M.props.thumbWidth
            }
          };
          return /* @__PURE__ */ e.default.createElement("li", c({}, N, {
            role: "button",
            tabIndex: 0
          }), T);
        });
      }
    }, {
      key: "render",
      value: function() {
        var M = this;
        if (!this.props.children)
          return null;
        var T = e.Children.count(this.props.children) > 1, O = this.state.showArrows && this.state.firstItem > 0, k = this.state.showArrows && this.state.firstItem < this.state.lastPosition, N = {}, q = -this.state.firstItem * (this.state.itemSize || 0), Y = (0, r.default)(q, "px", this.props.axis), ue = this.props.transitionTime + "ms";
        return N = {
          WebkitTransform: Y,
          MozTransform: Y,
          MsTransform: Y,
          OTransform: Y,
          transform: Y,
          msTransform: Y,
          WebkitTransitionDuration: ue,
          MozTransitionDuration: ue,
          MsTransitionDuration: ue,
          OTransitionDuration: ue,
          transitionDuration: ue,
          msTransitionDuration: ue
        }, /* @__PURE__ */ e.default.createElement("div", {
          className: t.default.CAROUSEL(!1)
        }, /* @__PURE__ */ e.default.createElement("div", {
          className: t.default.WRAPPER(!1),
          ref: this.setItemsWrapperRef
        }, /* @__PURE__ */ e.default.createElement("button", {
          type: "button",
          className: t.default.ARROW_PREV(!O),
          onClick: function() {
            return M.slideRight();
          },
          "aria-label": this.props.labels.leftArrow
        }), T ? /* @__PURE__ */ e.default.createElement(i.default, {
          tagName: "ul",
          className: t.default.SLIDER(!1, this.state.swiping),
          onSwipeLeft: this.slideLeft,
          onSwipeRight: this.slideRight,
          onSwipeMove: this.onSwipeMove,
          onSwipeStart: this.onSwipeStart,
          onSwipeEnd: this.onSwipeEnd,
          style: N,
          innerRef: this.setItemsListRef,
          allowMouseEvents: this.props.emulateTouch
        }, this.renderItems()) : /* @__PURE__ */ e.default.createElement("ul", {
          className: t.default.SLIDER(!1, this.state.swiping),
          ref: function(te) {
            return M.setItemsListRef(te);
          },
          style: N
        }, this.renderItems()), /* @__PURE__ */ e.default.createElement("button", {
          type: "button",
          className: t.default.ARROW_NEXT(!k),
          onClick: function() {
            return M.slideLeft();
          },
          "aria-label": this.props.labels.rightArrow
        })));
      }
    }]), F;
  })(e.Component);
  return Ki.default = P, E(P, "displayName", "Thumbs"), E(P, "defaultProps", {
    axis: "horizontal",
    labels: {
      leftArrow: "previous slide / item",
      rightArrow: "next slide / item",
      item: "slide item"
    },
    selectedItem: 0,
    thumbWidth: 80,
    transitionTime: 350
  }), Ki;
}
var eo = {}, wu;
function Qp() {
  if (wu) return eo;
  wu = 1, Object.defineProperty(eo, "__esModule", {
    value: !0
  }), eo.default = void 0;
  var e = function() {
    return document;
  };
  return eo.default = e, eo;
}
var zn = {}, yu;
function Md() {
  if (yu) return zn;
  yu = 1, Object.defineProperty(zn, "__esModule", {
    value: !0
  }), zn.setPosition = zn.getPosition = zn.isKeyboardEvent = zn.defaultStatusFormatter = zn.noop = void 0;
  var e = xo(), t = n(tl());
  function n(l) {
    return l && l.__esModule ? l : { default: l };
  }
  var r = function() {
  };
  zn.noop = r;
  var i = function(u, c) {
    return "".concat(u, " of ").concat(c);
  };
  zn.defaultStatusFormatter = i;
  var o = function(u) {
    return u ? u.hasOwnProperty("key") : !1;
  };
  zn.isKeyboardEvent = o;
  var s = function(u, c) {
    if (c.infiniteLoop && ++u, u === 0)
      return 0;
    var f = e.Children.count(c.children);
    if (c.centerMode && c.axis === "horizontal") {
      var g = -u * c.centerSlidePercentage, h = f - 1;
      return u && (u !== h || c.infiniteLoop) ? g += (100 - c.centerSlidePercentage) / 2 : u === h && (g += 100 - c.centerSlidePercentage), g;
    }
    return -u * 100;
  };
  zn.getPosition = s;
  var a = function(u, c) {
    var f = {};
    return ["WebkitTransform", "MozTransform", "MsTransform", "OTransform", "transform", "msTransform"].forEach(function(g) {
      f[g] = (0, t.default)(u, "%", c);
    }), f;
  };
  return zn.setPosition = a, zn;
}
var Kn = {}, Cu;
function em() {
  if (Cu) return Kn;
  Cu = 1, Object.defineProperty(Kn, "__esModule", {
    value: !0
  }), Kn.fadeAnimationHandler = Kn.slideStopSwipingHandler = Kn.slideSwipeAnimationHandler = Kn.slideAnimationHandler = void 0;
  var e = xo(), t = r(tl()), n = Md();
  function r(f) {
    return f && f.__esModule ? f : { default: f };
  }
  function i(f, g) {
    var h = Object.keys(f);
    if (Object.getOwnPropertySymbols) {
      var p = Object.getOwnPropertySymbols(f);
      g && (p = p.filter(function(m) {
        return Object.getOwnPropertyDescriptor(f, m).enumerable;
      })), h.push.apply(h, p);
    }
    return h;
  }
  function o(f) {
    for (var g = 1; g < arguments.length; g++) {
      var h = arguments[g] != null ? arguments[g] : {};
      g % 2 ? i(Object(h), !0).forEach(function(p) {
        s(f, p, h[p]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(f, Object.getOwnPropertyDescriptors(h)) : i(Object(h)).forEach(function(p) {
        Object.defineProperty(f, p, Object.getOwnPropertyDescriptor(h, p));
      });
    }
    return f;
  }
  function s(f, g, h) {
    return g in f ? Object.defineProperty(f, g, { value: h, enumerable: !0, configurable: !0, writable: !0 }) : f[g] = h, f;
  }
  var a = function(g, h) {
    var p = {}, m = h.selectedItem, w = m, b = e.Children.count(g.children) - 1, v = g.infiniteLoop && (m < 0 || m > b);
    if (v)
      return w < 0 ? g.centerMode && g.centerSlidePercentage && g.axis === "horizontal" ? p.itemListStyle = (0, n.setPosition)(-(b + 2) * g.centerSlidePercentage - (100 - g.centerSlidePercentage) / 2, g.axis) : p.itemListStyle = (0, n.setPosition)(-(b + 2) * 100, g.axis) : w > b && (p.itemListStyle = (0, n.setPosition)(0, g.axis)), p;
    var C = (0, n.getPosition)(m, g), I = (0, t.default)(C, "%", g.axis), E = g.transitionTime + "ms";
    return p.itemListStyle = {
      WebkitTransform: I,
      msTransform: I,
      OTransform: I,
      transform: I
    }, h.swiping || (p.itemListStyle = o(o({}, p.itemListStyle), {}, {
      WebkitTransitionDuration: E,
      MozTransitionDuration: E,
      OTransitionDuration: E,
      transitionDuration: E,
      msTransitionDuration: E
    })), p;
  };
  Kn.slideAnimationHandler = a;
  var l = function(g, h, p, m) {
    var w = {}, b = h.axis === "horizontal", v = e.Children.count(h.children), C = 0, I = (0, n.getPosition)(p.selectedItem, h), E = h.infiniteLoop ? (0, n.getPosition)(v - 1, h) - 100 : (0, n.getPosition)(v - 1, h), R = b ? g.x : g.y, P = R;
    I === C && R > 0 && (P = 0), I === E && R < 0 && (P = 0);
    var x = I + 100 / (p.itemSize / P), S = Math.abs(R) > h.swipeScrollTolerance;
    return h.infiniteLoop && S && (p.selectedItem === 0 && x > -100 ? x -= v * 100 : p.selectedItem === v - 1 && x < -v * 100 && (x += v * 100)), (!h.preventMovementUntilSwipeScrollTolerance || S || p.swipeMovementStarted) && (p.swipeMovementStarted || m({
      swipeMovementStarted: !0
    }), w.itemListStyle = (0, n.setPosition)(x, h.axis)), S && !p.cancelClick && m({
      cancelClick: !0
    }), w;
  };
  Kn.slideSwipeAnimationHandler = l;
  var u = function(g, h) {
    var p = (0, n.getPosition)(h.selectedItem, g), m = (0, n.setPosition)(p, g.axis);
    return {
      itemListStyle: m
    };
  };
  Kn.slideStopSwipingHandler = u;
  var c = function(g, h) {
    var p = g.transitionTime + "ms", m = "ease-in-out", w = {
      position: "absolute",
      display: "block",
      zIndex: -2,
      minHeight: "100%",
      opacity: 0,
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      transitionTimingFunction: m,
      msTransitionTimingFunction: m,
      MozTransitionTimingFunction: m,
      WebkitTransitionTimingFunction: m,
      OTransitionTimingFunction: m
    };
    return h.swiping || (w = o(o({}, w), {}, {
      WebkitTransitionDuration: p,
      MozTransitionDuration: p,
      OTransitionDuration: p,
      transitionDuration: p,
      msTransitionDuration: p
    })), {
      slideStyle: w,
      selectedStyle: o(o({}, w), {}, {
        opacity: 1,
        position: "relative"
      }),
      prevStyle: o({}, w)
    };
  };
  return Kn.fadeAnimationHandler = c, Kn;
}
var Su;
function tm() {
  if (Su) return Yi;
  Su = 1, Object.defineProperty(Yi, "__esModule", {
    value: !0
  }), Yi.default = void 0;
  var e = c(xo()), t = l(Cd()), n = l(Sd()), r = l(kd()), i = l(Qp()), o = l(xd()), s = Md(), a = em();
  function l(D) {
    return D && D.__esModule ? D : { default: D };
  }
  function u() {
    if (typeof WeakMap != "function") return null;
    var D = /* @__PURE__ */ new WeakMap();
    return u = function() {
      return D;
    }, D;
  }
  function c(D) {
    if (D && D.__esModule)
      return D;
    if (D === null || f(D) !== "object" && typeof D != "function")
      return { default: D };
    var M = u();
    if (M && M.has(D))
      return M.get(D);
    var T = {}, O = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var k in D)
      if (Object.prototype.hasOwnProperty.call(D, k)) {
        var N = O ? Object.getOwnPropertyDescriptor(D, k) : null;
        N && (N.get || N.set) ? Object.defineProperty(T, k, N) : T[k] = D[k];
      }
    return T.default = D, M && M.set(D, T), T;
  }
  function f(D) {
    "@babel/helpers - typeof";
    return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? f = function(T) {
      return typeof T;
    } : f = function(T) {
      return T && typeof Symbol == "function" && T.constructor === Symbol && T !== Symbol.prototype ? "symbol" : typeof T;
    }, f(D);
  }
  function g() {
    return g = Object.assign || function(D) {
      for (var M = 1; M < arguments.length; M++) {
        var T = arguments[M];
        for (var O in T)
          Object.prototype.hasOwnProperty.call(T, O) && (D[O] = T[O]);
      }
      return D;
    }, g.apply(this, arguments);
  }
  function h(D, M) {
    var T = Object.keys(D);
    if (Object.getOwnPropertySymbols) {
      var O = Object.getOwnPropertySymbols(D);
      M && (O = O.filter(function(k) {
        return Object.getOwnPropertyDescriptor(D, k).enumerable;
      })), T.push.apply(T, O);
    }
    return T;
  }
  function p(D) {
    for (var M = 1; M < arguments.length; M++) {
      var T = arguments[M] != null ? arguments[M] : {};
      M % 2 ? h(Object(T), !0).forEach(function(O) {
        S(D, O, T[O]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(D, Object.getOwnPropertyDescriptors(T)) : h(Object(T)).forEach(function(O) {
        Object.defineProperty(D, O, Object.getOwnPropertyDescriptor(T, O));
      });
    }
    return D;
  }
  function m(D, M) {
    if (!(D instanceof M))
      throw new TypeError("Cannot call a class as a function");
  }
  function w(D, M) {
    for (var T = 0; T < M.length; T++) {
      var O = M[T];
      O.enumerable = O.enumerable || !1, O.configurable = !0, "value" in O && (O.writable = !0), Object.defineProperty(D, O.key, O);
    }
  }
  function b(D, M, T) {
    return M && w(D.prototype, M), D;
  }
  function v(D, M) {
    if (typeof M != "function" && M !== null)
      throw new TypeError("Super expression must either be null or a function");
    D.prototype = Object.create(M && M.prototype, { constructor: { value: D, writable: !0, configurable: !0 } }), M && C(D, M);
  }
  function C(D, M) {
    return C = Object.setPrototypeOf || function(O, k) {
      return O.__proto__ = k, O;
    }, C(D, M);
  }
  function I(D) {
    var M = P();
    return function() {
      var O = x(D), k;
      if (M) {
        var N = x(this).constructor;
        k = Reflect.construct(O, arguments, N);
      } else
        k = O.apply(this, arguments);
      return E(this, k);
    };
  }
  function E(D, M) {
    return M && (f(M) === "object" || typeof M == "function") ? M : R(D);
  }
  function R(D) {
    if (D === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return D;
  }
  function P() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function x(D) {
    return x = Object.setPrototypeOf ? Object.getPrototypeOf : function(T) {
      return T.__proto__ || Object.getPrototypeOf(T);
    }, x(D);
  }
  function S(D, M, T) {
    return M in D ? Object.defineProperty(D, M, { value: T, enumerable: !0, configurable: !0, writable: !0 }) : D[M] = T, D;
  }
  var F = /* @__PURE__ */ (function(D) {
    v(T, D);
    var M = I(T);
    function T(O) {
      var k;
      m(this, T), k = M.call(this, O), S(R(k), "thumbsRef", void 0), S(R(k), "carouselWrapperRef", void 0), S(R(k), "listRef", void 0), S(R(k), "itemsRef", void 0), S(R(k), "timer", void 0), S(R(k), "animationHandler", void 0), S(R(k), "setThumbsRef", function(q) {
        k.thumbsRef = q;
      }), S(R(k), "setCarouselWrapperRef", function(q) {
        k.carouselWrapperRef = q;
      }), S(R(k), "setListRef", function(q) {
        k.listRef = q;
      }), S(R(k), "setItemsRef", function(q, Y) {
        k.itemsRef || (k.itemsRef = []), k.itemsRef[Y] = q;
      }), S(R(k), "autoPlay", function() {
        e.Children.count(k.props.children) <= 1 || (k.clearAutoPlay(), k.props.autoPlay && (k.timer = setTimeout(function() {
          k.increment();
        }, k.props.interval)));
      }), S(R(k), "clearAutoPlay", function() {
        k.timer && clearTimeout(k.timer);
      }), S(R(k), "resetAutoPlay", function() {
        k.clearAutoPlay(), k.autoPlay();
      }), S(R(k), "stopOnHover", function() {
        k.setState({
          isMouseEntered: !0
        }, k.clearAutoPlay);
      }), S(R(k), "startOnLeave", function() {
        k.setState({
          isMouseEntered: !1
        }, k.autoPlay);
      }), S(R(k), "isFocusWithinTheCarousel", function() {
        return k.carouselWrapperRef ? !!((0, i.default)().activeElement === k.carouselWrapperRef || k.carouselWrapperRef.contains((0, i.default)().activeElement)) : !1;
      }), S(R(k), "navigateWithKeyboard", function(q) {
        if (k.isFocusWithinTheCarousel()) {
          var Y = k.props.axis, ue = Y === "horizontal", ee = {
            ArrowUp: 38,
            ArrowRight: 39,
            ArrowDown: 40,
            ArrowLeft: 37
          }, te = ue ? ee.ArrowRight : ee.ArrowDown, ce = ue ? ee.ArrowLeft : ee.ArrowUp;
          te === q.keyCode ? k.increment() : ce === q.keyCode && k.decrement();
        }
      }), S(R(k), "updateSizes", function() {
        if (!(!k.state.initialized || !k.itemsRef || k.itemsRef.length === 0)) {
          var q = k.props.axis === "horizontal", Y = k.itemsRef[0];
          if (Y) {
            var ue = q ? Y.clientWidth : Y.clientHeight;
            k.setState({
              itemSize: ue
            }), k.thumbsRef && k.thumbsRef.updateSizes();
          }
        }
      }), S(R(k), "setMountState", function() {
        k.setState({
          hasMount: !0
        }), k.updateSizes();
      }), S(R(k), "handleClickItem", function(q, Y) {
        if (e.Children.count(k.props.children) !== 0) {
          if (k.state.cancelClick) {
            k.setState({
              cancelClick: !1
            });
            return;
          }
          k.props.onClickItem(q, Y), q !== k.state.selectedItem && k.setState({
            selectedItem: q
          });
        }
      }), S(R(k), "handleOnChange", function(q, Y) {
        e.Children.count(k.props.children) <= 1 || k.props.onChange(q, Y);
      }), S(R(k), "handleClickThumb", function(q, Y) {
        k.props.onClickThumb(q, Y), k.moveTo(q);
      }), S(R(k), "onSwipeStart", function(q) {
        k.setState({
          swiping: !0
        }), k.props.onSwipeStart(q);
      }), S(R(k), "onSwipeEnd", function(q) {
        k.setState({
          swiping: !1,
          cancelClick: !1,
          swipeMovementStarted: !1
        }), k.props.onSwipeEnd(q), k.clearAutoPlay(), k.state.autoPlay && k.autoPlay();
      }), S(R(k), "onSwipeMove", function(q, Y) {
        k.props.onSwipeMove(Y);
        var ue = k.props.swipeAnimationHandler(q, k.props, k.state, k.setState.bind(R(k)));
        return k.setState(p({}, ue)), !!Object.keys(ue).length;
      }), S(R(k), "decrement", function() {
        var q = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
        k.moveTo(k.state.selectedItem - (typeof q == "number" ? q : 1));
      }), S(R(k), "increment", function() {
        var q = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
        k.moveTo(k.state.selectedItem + (typeof q == "number" ? q : 1));
      }), S(R(k), "moveTo", function(q) {
        if (typeof q == "number") {
          var Y = e.Children.count(k.props.children) - 1;
          q < 0 && (q = k.props.infiniteLoop ? Y : 0), q > Y && (q = k.props.infiniteLoop ? 0 : Y), k.selectItem({
            // if it's not a slider, we don't need to set position here
            selectedItem: q
          }), k.state.autoPlay && k.state.isMouseEntered === !1 && k.resetAutoPlay();
        }
      }), S(R(k), "onClickNext", function() {
        k.increment(1);
      }), S(R(k), "onClickPrev", function() {
        k.decrement(1);
      }), S(R(k), "onSwipeForward", function() {
        k.increment(1), k.props.emulateTouch && k.setState({
          cancelClick: !0
        });
      }), S(R(k), "onSwipeBackwards", function() {
        k.decrement(1), k.props.emulateTouch && k.setState({
          cancelClick: !0
        });
      }), S(R(k), "changeItem", function(q) {
        return function(Y) {
          (!(0, s.isKeyboardEvent)(Y) || Y.key === "Enter") && k.moveTo(q);
        };
      }), S(R(k), "selectItem", function(q) {
        k.setState(p({
          previousItem: k.state.selectedItem
        }, q), function() {
          k.setState(k.animationHandler(k.props, k.state));
        }), k.handleOnChange(q.selectedItem, e.Children.toArray(k.props.children)[q.selectedItem]);
      }), S(R(k), "getInitialImage", function() {
        var q = k.props.selectedItem, Y = k.itemsRef && k.itemsRef[q], ue = Y && Y.getElementsByTagName("img") || [];
        return ue[0];
      }), S(R(k), "getVariableItemHeight", function(q) {
        var Y = k.itemsRef && k.itemsRef[q];
        if (k.state.hasMount && Y && Y.children.length) {
          var ue = Y.children[0].getElementsByTagName("img") || [];
          if (ue.length > 0) {
            var ee = ue[0];
            if (!ee.complete) {
              var te = function he() {
                k.forceUpdate(), ee.removeEventListener("load", he);
              };
              ee.addEventListener("load", te);
            }
          }
          var ce = ue[0] || Y.children[0], le = ce.clientHeight;
          return le > 0 ? le : null;
        }
        return null;
      });
      var N = {
        initialized: !1,
        previousItem: O.selectedItem,
        selectedItem: O.selectedItem,
        hasMount: !1,
        isMouseEntered: !1,
        autoPlay: O.autoPlay,
        swiping: !1,
        swipeMovementStarted: !1,
        cancelClick: !1,
        itemSize: 1,
        itemListStyle: {},
        slideStyle: {},
        selectedStyle: {},
        prevStyle: {}
      };
      return k.animationHandler = typeof O.animationHandler == "function" && O.animationHandler || O.animationHandler === "fade" && a.fadeAnimationHandler || a.slideAnimationHandler, k.state = p(p({}, N), k.animationHandler(O, N)), k;
    }
    return b(T, [{
      key: "componentDidMount",
      value: function() {
        this.props.children && this.setupCarousel();
      }
    }, {
      key: "componentDidUpdate",
      value: function(k, N) {
        !k.children && this.props.children && !this.state.initialized && this.setupCarousel(), !k.autoFocus && this.props.autoFocus && this.forceFocus(), N.swiping && !this.state.swiping && this.setState(p({}, this.props.stopSwipingHandler(this.props, this.state))), (k.selectedItem !== this.props.selectedItem || k.centerMode !== this.props.centerMode) && (this.updateSizes(), this.moveTo(this.props.selectedItem)), k.autoPlay !== this.props.autoPlay && (this.props.autoPlay ? this.setupAutoPlay() : this.destroyAutoPlay(), this.setState({
          autoPlay: this.props.autoPlay
        }));
      }
    }, {
      key: "componentWillUnmount",
      value: function() {
        this.destroyCarousel();
      }
    }, {
      key: "setupCarousel",
      value: function() {
        var k = this;
        this.bindEvents(), this.state.autoPlay && e.Children.count(this.props.children) > 1 && this.setupAutoPlay(), this.props.autoFocus && this.forceFocus(), this.setState({
          initialized: !0
        }, function() {
          var N = k.getInitialImage();
          N && !N.complete ? N.addEventListener("load", k.setMountState) : k.setMountState();
        });
      }
    }, {
      key: "destroyCarousel",
      value: function() {
        this.state.initialized && (this.unbindEvents(), this.destroyAutoPlay());
      }
    }, {
      key: "setupAutoPlay",
      value: function() {
        this.autoPlay();
        var k = this.carouselWrapperRef;
        this.props.stopOnHover && k && (k.addEventListener("mouseenter", this.stopOnHover), k.addEventListener("mouseleave", this.startOnLeave));
      }
    }, {
      key: "destroyAutoPlay",
      value: function() {
        this.clearAutoPlay();
        var k = this.carouselWrapperRef;
        this.props.stopOnHover && k && (k.removeEventListener("mouseenter", this.stopOnHover), k.removeEventListener("mouseleave", this.startOnLeave));
      }
    }, {
      key: "bindEvents",
      value: function() {
        (0, o.default)().addEventListener("resize", this.updateSizes), (0, o.default)().addEventListener("DOMContentLoaded", this.updateSizes), this.props.useKeyboardArrows && (0, i.default)().addEventListener("keydown", this.navigateWithKeyboard);
      }
    }, {
      key: "unbindEvents",
      value: function() {
        (0, o.default)().removeEventListener("resize", this.updateSizes), (0, o.default)().removeEventListener("DOMContentLoaded", this.updateSizes);
        var k = this.getInitialImage();
        k && k.removeEventListener("load", this.setMountState), this.props.useKeyboardArrows && (0, i.default)().removeEventListener("keydown", this.navigateWithKeyboard);
      }
    }, {
      key: "forceFocus",
      value: function() {
        var k;
        (k = this.carouselWrapperRef) === null || k === void 0 || k.focus();
      }
    }, {
      key: "renderItems",
      value: function(k) {
        var N = this;
        return this.props.children ? e.Children.map(this.props.children, function(q, Y) {
          var ue = Y === N.state.selectedItem, ee = Y === N.state.previousItem, te = ue && N.state.selectedStyle || ee && N.state.prevStyle || N.state.slideStyle || {};
          N.props.centerMode && N.props.axis === "horizontal" && (te = p(p({}, te), {}, {
            minWidth: N.props.centerSlidePercentage + "%"
          })), N.state.swiping && N.state.swipeMovementStarted && (te = p(p({}, te), {}, {
            pointerEvents: "none"
          }));
          var ce = {
            ref: function(he) {
              return N.setItemsRef(he, Y);
            },
            key: "itemKey" + Y + (k ? "clone" : ""),
            className: n.default.ITEM(!0, Y === N.state.selectedItem, Y === N.state.previousItem),
            onClick: N.handleClickItem.bind(N, Y, q),
            style: te
          };
          return /* @__PURE__ */ e.default.createElement("li", ce, N.props.renderItem(q, {
            isSelected: Y === N.state.selectedItem,
            isPrevious: Y === N.state.previousItem
          }));
        }) : [];
      }
    }, {
      key: "renderControls",
      value: function() {
        var k = this, N = this.props, q = N.showIndicators, Y = N.labels, ue = N.renderIndicator, ee = N.children;
        return q ? /* @__PURE__ */ e.default.createElement("ul", {
          className: "control-dots"
        }, e.Children.map(ee, function(te, ce) {
          return ue && ue(k.changeItem(ce), ce === k.state.selectedItem, ce, Y.item);
        })) : null;
      }
    }, {
      key: "renderStatus",
      value: function() {
        return this.props.showStatus ? /* @__PURE__ */ e.default.createElement("p", {
          className: "carousel-status"
        }, this.props.statusFormatter(this.state.selectedItem + 1, e.Children.count(this.props.children))) : null;
      }
    }, {
      key: "renderThumbs",
      value: function() {
        return !this.props.showThumbs || !this.props.children || e.Children.count(this.props.children) === 0 ? null : /* @__PURE__ */ e.default.createElement(r.default, {
          ref: this.setThumbsRef,
          onSelectItem: this.handleClickThumb,
          selectedItem: this.state.selectedItem,
          transitionTime: this.props.transitionTime,
          thumbWidth: this.props.thumbWidth,
          labels: this.props.labels,
          emulateTouch: this.props.emulateTouch
        }, this.props.renderThumbs(this.props.children));
      }
    }, {
      key: "render",
      value: function() {
        var k = this;
        if (!this.props.children || e.Children.count(this.props.children) === 0)
          return null;
        var N = this.props.swipeable && e.Children.count(this.props.children) > 1, q = this.props.axis === "horizontal", Y = this.props.showArrows && e.Children.count(this.props.children) > 1, ue = Y && (this.state.selectedItem > 0 || this.props.infiniteLoop) || !1, ee = Y && (this.state.selectedItem < e.Children.count(this.props.children) - 1 || this.props.infiniteLoop) || !1, te = this.renderItems(!0), ce = te.shift(), le = te.pop(), he = {
          className: n.default.SLIDER(!0, this.state.swiping),
          onSwipeMove: this.onSwipeMove,
          onSwipeStart: this.onSwipeStart,
          onSwipeEnd: this.onSwipeEnd,
          style: this.state.itemListStyle,
          tolerance: this.props.swipeScrollTolerance
        }, de = {};
        if (q) {
          if (he.onSwipeLeft = this.onSwipeForward, he.onSwipeRight = this.onSwipeBackwards, this.props.dynamicHeight) {
            var ie = this.getVariableItemHeight(this.state.selectedItem);
            de.height = ie || "auto";
          }
        } else
          he.onSwipeUp = this.props.verticalSwipe === "natural" ? this.onSwipeBackwards : this.onSwipeForward, he.onSwipeDown = this.props.verticalSwipe === "natural" ? this.onSwipeForward : this.onSwipeBackwards, he.style = p(p({}, he.style), {}, {
            height: this.state.itemSize
          }), de.height = this.state.itemSize;
        return /* @__PURE__ */ e.default.createElement("div", {
          "aria-label": this.props.ariaLabel,
          className: n.default.ROOT(this.props.className),
          ref: this.setCarouselWrapperRef,
          tabIndex: this.props.useKeyboardArrows ? 0 : void 0
        }, /* @__PURE__ */ e.default.createElement("div", {
          className: n.default.CAROUSEL(!0),
          style: {
            width: this.props.width
          }
        }, this.renderControls(), this.props.renderArrowPrev(this.onClickPrev, ue, this.props.labels.leftArrow), /* @__PURE__ */ e.default.createElement("div", {
          className: n.default.WRAPPER(!0, this.props.axis),
          style: de
        }, N ? /* @__PURE__ */ e.default.createElement(t.default, g({
          tagName: "ul",
          innerRef: this.setListRef
        }, he, {
          allowMouseEvents: this.props.emulateTouch
        }), this.props.infiniteLoop && le, this.renderItems(), this.props.infiniteLoop && ce) : /* @__PURE__ */ e.default.createElement("ul", {
          className: n.default.SLIDER(!0, this.state.swiping),
          ref: function(L) {
            return k.setListRef(L);
          },
          style: this.state.itemListStyle || {}
        }, this.props.infiniteLoop && le, this.renderItems(), this.props.infiniteLoop && ce)), this.props.renderArrowNext(this.onClickNext, ee, this.props.labels.rightArrow), this.renderStatus()), this.renderThumbs());
      }
    }]), T;
  })(e.default.Component);
  return Yi.default = F, S(F, "displayName", "Carousel"), S(F, "defaultProps", {
    ariaLabel: void 0,
    axis: "horizontal",
    centerSlidePercentage: 80,
    interval: 3e3,
    labels: {
      leftArrow: "previous slide / item",
      rightArrow: "next slide / item",
      item: "slide item"
    },
    onClickItem: s.noop,
    onClickThumb: s.noop,
    onChange: s.noop,
    onSwipeStart: function() {
    },
    onSwipeEnd: function() {
    },
    onSwipeMove: function() {
      return !1;
    },
    preventMovementUntilSwipeScrollTolerance: !1,
    renderArrowPrev: function(M, T, O) {
      return /* @__PURE__ */ e.default.createElement("button", {
        type: "button",
        "aria-label": O,
        className: n.default.ARROW_PREV(!T),
        onClick: M
      });
    },
    renderArrowNext: function(M, T, O) {
      return /* @__PURE__ */ e.default.createElement("button", {
        type: "button",
        "aria-label": O,
        className: n.default.ARROW_NEXT(!T),
        onClick: M
      });
    },
    renderIndicator: function(M, T, O, k) {
      return /* @__PURE__ */ e.default.createElement("li", {
        className: n.default.DOT(T),
        onClick: M,
        onKeyDown: M,
        value: O,
        key: O,
        role: "button",
        tabIndex: 0,
        "aria-label": "".concat(k, " ").concat(O + 1)
      });
    },
    renderItem: function(M) {
      return M;
    },
    renderThumbs: function(M) {
      var T = e.Children.map(M, function(O) {
        var k = O;
        if (O.type !== "img" && (k = e.Children.toArray(O.props.children).find(function(N) {
          return N.type === "img";
        })), !!k)
          return k;
      });
      return T.filter(function(O) {
        return O;
      }).length === 0 ? (console.warn("No images found! Can't build the thumb list without images. If you don't need thumbs, set showThumbs={false} in the Carousel. Note that it's not possible to get images rendered inside custom components. More info at https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md"), []) : T;
    },
    statusFormatter: s.defaultStatusFormatter,
    selectedItem: 0,
    showArrows: !0,
    showIndicators: !0,
    showStatus: !0,
    showThumbs: !0,
    stopOnHover: !0,
    swipeScrollTolerance: 5,
    swipeable: !0,
    transitionTime: 350,
    verticalSwipe: "standard",
    width: "100%",
    animationHandler: "slide",
    swipeAnimationHandler: a.slideSwipeAnimationHandler,
    stopSwipingHandler: a.slideStopSwipingHandler
  }), Yi;
}
var xu = {}, ku;
function nm() {
  return ku || (ku = 1), xu;
}
var Mu;
function rm() {
  return Mu || (Mu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), Object.defineProperty(e, "Carousel", {
      enumerable: !0,
      get: function() {
        return t.default;
      }
    }), Object.defineProperty(e, "CarouselProps", {
      enumerable: !0,
      get: function() {
        return n.CarouselProps;
      }
    }), Object.defineProperty(e, "Thumbs", {
      enumerable: !0,
      get: function() {
        return r.default;
      }
    });
    var t = i(tm()), n = nm(), r = i(kd());
    function i(o) {
      return o && o.__esModule ? o : { default: o };
    }
  })(as)), as;
}
var im = rm(), ss, Ru;
function om() {
  if (Ru) return ss;
  Ru = 1;
  var e = tg(), t = function() {
    return e.Date.now();
  };
  return ss = t, ss;
}
var ls, Eu;
function Rd() {
  if (Eu) return ls;
  Eu = 1;
  var e = td(), t = om(), n = nd(), r = "Expected a function", i = Math.max, o = Math.min;
  function s(a, l, u) {
    var c, f, g, h, p, m, w = 0, b = !1, v = !1, C = !0;
    if (typeof a != "function")
      throw new TypeError(r);
    l = n(l) || 0, e(u) && (b = !!u.leading, v = "maxWait" in u, g = v ? i(n(u.maxWait) || 0, l) : g, C = "trailing" in u ? !!u.trailing : C);
    function I(T) {
      var O = c, k = f;
      return c = f = void 0, w = T, h = a.apply(k, O), h;
    }
    function E(T) {
      return w = T, p = setTimeout(x, l), b ? I(T) : h;
    }
    function R(T) {
      var O = T - m, k = T - w, N = l - O;
      return v ? o(N, g - k) : N;
    }
    function P(T) {
      var O = T - m, k = T - w;
      return m === void 0 || O >= l || O < 0 || v && k >= g;
    }
    function x() {
      var T = t();
      if (P(T))
        return S(T);
      p = setTimeout(x, R(T));
    }
    function S(T) {
      return p = void 0, C && c ? I(T) : (c = f = void 0, h);
    }
    function F() {
      p !== void 0 && clearTimeout(p), w = 0, c = m = f = p = void 0;
    }
    function D() {
      return p === void 0 ? h : S(t());
    }
    function M() {
      var T = t(), O = P(T);
      if (c = arguments, f = this, m = T, O) {
        if (p === void 0)
          return E(m);
        if (v)
          return clearTimeout(p), p = setTimeout(x, l), I(m);
      }
      return p === void 0 && (p = setTimeout(x, l)), h;
    }
    return M.cancel = F, M.flush = D, M;
  }
  return ls = s, ls;
}
var am = Rd();
const Ed = /* @__PURE__ */ vr(am);
function xn(e, t, n, r, i = !1) {
  const o = d.useRef();
  o.current = t, d.useEffect(
    () => {
      if (n === null || n.addEventListener === void 0)
        return;
      const s = n, a = (l) => {
        o.current?.call(s, l);
      };
      return s.addEventListener(e, a, { passive: r, capture: i }), () => {
        s.removeEventListener(e, a, { capture: i });
      };
    },
    [e, n, r, i]
    // Re-run if eventName or element changes
  );
}
function Er(e, t) {
  return e === void 0 ? void 0 : t;
}
const sm = Math.PI;
function Iu(e) {
  return e * sm / 180;
}
const Id = (e, t, n) => ({
  x1: e - n / 2,
  y1: t - n / 2,
  x2: e + n / 2,
  y2: t + n / 2
}), Td = (e, t, n, r, i) => {
  switch (e) {
    case "left":
      return Math.floor(t) + r + i / 2;
    case "center":
      return Math.floor(t + n / 2);
    case "right":
      return Math.floor(t + n) - r - i / 2;
  }
}, Dd = (e, t, n) => Math.min(e, t - n * 2), Od = (e, t, n) => n.x1 <= e && e <= n.x2 && n.y1 <= t && t <= n.y2, nl = (e) => {
  const t = e.fgColor ?? "currentColor";
  return d.createElement(
    "svg",
    { viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    d.createElement("path", { d: "M12.7073 7.05029C7.87391 11.8837 10.4544 9.30322 6.03024 13.7273C5.77392 13.9836 5.58981 14.3071 5.50189 14.6587L4.52521 18.5655C4.38789 19.1148 4.88543 19.6123 5.43472 19.475L9.34146 18.4983C9.69313 18.4104 10.0143 18.2286 10.2706 17.9722L16.9499 11.2929", stroke: t, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", fill: "none", vectorEffect: "non-scaling-stroke" }),
    d.createElement("path", { d: "M20.4854 4.92901L19.0712 3.5148C18.2901 2.73375 17.0238 2.73375 16.2428 3.5148L14.475 5.28257C15.5326 7.71912 16.4736 8.6278 18.7176 9.52521L20.4854 7.75744C21.2665 6.97639 21.2665 5.71006 20.4854 4.92901Z", stroke: t, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", fill: "none", vectorEffect: "non-scaling-stroke" })
  );
}, lm = (e) => {
  const t = e.fgColor ?? "currentColor";
  return d.createElement(
    "svg",
    { viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    d.createElement("path", { d: "M19 6L10.3802 17L5.34071 11.8758", vectorEffect: "non-scaling-stroke", stroke: t, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
  );
};
function um(e, t, n) {
  const [r, i] = d.useState(e), o = d.useRef(!0);
  d.useEffect(() => () => {
    o.current = !1;
  }, []);
  const s = d.useRef(Ed((a) => {
    o.current && i(a);
  }, n));
  return d.useLayoutEffect(() => {
    o.current && s.current(() => e());
  }, t), r;
}
const cm = "֑-߿יִ-﷽ﹰ-ﻼ", dm = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿", fm = new RegExp("^[^" + dm + "]*[" + cm + "]");
function rl(e) {
  return fm.test(e) ? "rtl" : "not-rtl";
}
let jo;
function As() {
  if (typeof document > "u")
    return 0;
  if (jo !== void 0)
    return jo;
  const e = document.createElement("p");
  e.style.width = "100%", e.style.height = "200px";
  const t = document.createElement("div");
  t.id = "testScrollbar", t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.style.visibility = "hidden", t.style.width = "200px", t.style.height = "150px", t.style.overflow = "hidden", t.append(e), document.body.append(t);
  const n = e.offsetWidth;
  t.style.overflow = "scroll";
  let r = e.offsetWidth;
  return n === r && (r = t.clientWidth), t.remove(), jo = n - r, jo;
}
const Gr = Symbol();
function hm(e) {
  const t = d.useRef([Gr, e]);
  t.current[1] !== e && (t.current[0] = e), t.current[1] = e;
  const [n, r] = d.useState(e), [, i] = d.useState(), o = d.useCallback((a) => {
    const l = t.current[0];
    l !== Gr && (a = typeof a == "function" ? a(l) : a, a === l) || (l !== Gr && i({}), r((u) => typeof a == "function" ? a(l === Gr ? u : l) : a), t.current[0] = Gr);
  }, []), s = d.useCallback(() => {
    t.current[0] = Gr, i({});
  }, []);
  return [t.current[0] === Gr ? n : t.current[0], o, s];
}
function Pd(e) {
  if (e.length === 0)
    return "";
  let t = 0, n = 0;
  for (const r of e) {
    if (n += r.length, n > 1e4)
      break;
    t++;
  }
  return e.slice(0, t).join(", ");
}
function gm(e) {
  const t = d.useRef(e);
  return Li(e, t.current) || (t.current = e), t.current;
}
const pm = (e) => {
  const { urls: t, canWrite: n, onEditClick: r, renderImage: i } = e, o = t.filter((a) => a !== "");
  if (o.length === 0)
    return null;
  const s = o.length > 1;
  return d.createElement(
    Kp,
    { "data-testid": "GDG-default-image-overlay-editor" },
    d.createElement(im.Carousel, { showArrows: s, showThumbs: !1, swipeable: s, emulateTouch: s, infiniteLoop: s }, o.map((a) => {
      const l = i?.(a) ?? d.createElement("img", { draggable: !1, src: a });
      return d.createElement("div", { className: "gdg-centering-container", key: a }, l);
    })),
    n && r && d.createElement(
      "button",
      { className: "gdg-edit-icon", onClick: r },
      d.createElement(nl, null)
    )
  );
};
function Ld() {
  return {
    async: !1,
    baseUrl: null,
    breaks: !1,
    extensions: null,
    gfm: !0,
    headerIds: !0,
    headerPrefix: "",
    highlight: null,
    hooks: null,
    langPrefix: "language-",
    mangle: !0,
    pedantic: !1,
    renderer: null,
    sanitize: !1,
    sanitizer: null,
    silent: !1,
    smartypants: !1,
    tokenizer: null,
    walkTokens: null,
    xhtml: !1
  };
}
let ei = Ld();
function mm(e) {
  ei = e;
}
const Fd = /[&<>"']/, vm = new RegExp(Fd.source, "g"), _d = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, bm = new RegExp(_d.source, "g"), wm = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Tu = (e) => wm[e];
function wn(e, t) {
  if (t) {
    if (Fd.test(e))
      return e.replace(vm, Tu);
  } else if (_d.test(e))
    return e.replace(bm, Tu);
  return e;
}
const ym = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function Ad(e) {
  return e.replace(ym, (t, n) => (n = n.toLowerCase(), n === "colon" ? ":" : n.charAt(0) === "#" ? n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1)) : ""));
}
const Cm = /(^|[^\[])\^/g;
function zt(e, t) {
  e = typeof e == "string" ? e : e.source, t = t || "";
  const n = {
    replace: (r, i) => (i = i.source || i, i = i.replace(Cm, "$1"), e = e.replace(r, i), n),
    getRegex: () => new RegExp(e, t)
  };
  return n;
}
const Sm = /[^\w:]/g, xm = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function Du(e, t, n) {
  if (e) {
    let r;
    try {
      r = decodeURIComponent(Ad(n)).replace(Sm, "").toLowerCase();
    } catch {
      return null;
    }
    if (r.indexOf("javascript:") === 0 || r.indexOf("vbscript:") === 0 || r.indexOf("data:") === 0)
      return null;
  }
  t && !xm.test(n) && (n = Em(t, n));
  try {
    n = encodeURI(n).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return n;
}
const qo = {}, km = /^[^:]+:\/*[^/]*$/, Mm = /^([^:]+:)[\s\S]*$/, Rm = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function Em(e, t) {
  qo[" " + e] || (km.test(e) ? qo[" " + e] = e + "/" : qo[" " + e] = ia(e, "/", !0)), e = qo[" " + e];
  const n = e.indexOf(":") === -1;
  return t.substring(0, 2) === "//" ? n ? t : e.replace(Mm, "$1") + t : t.charAt(0) === "/" ? n ? t : e.replace(Rm, "$1") + t : e + t;
}
const ga = { exec: function() {
} };
function Ou(e, t) {
  const n = e.replace(/\|/g, (o, s, a) => {
    let l = !1, u = s;
    for (; --u >= 0 && a[u] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), r = n.split(/ \|/);
  let i = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r[r.length - 1].trim() && r.pop(), r.length > t)
    r.splice(t);
  else
    for (; r.length < t; ) r.push("");
  for (; i < r.length; i++)
    r[i] = r[i].trim().replace(/\\\|/g, "|");
  return r;
}
function ia(e, t, n) {
  const r = e.length;
  if (r === 0)
    return "";
  let i = 0;
  for (; i < r; ) {
    const o = e.charAt(r - i - 1);
    if (o === t && !n)
      i++;
    else if (o !== t && n)
      i++;
    else
      break;
  }
  return e.slice(0, r - i);
}
function Im(e, t) {
  if (e.indexOf(t[1]) === -1)
    return -1;
  const n = e.length;
  let r = 0, i = 0;
  for (; i < n; i++)
    if (e[i] === "\\")
      i++;
    else if (e[i] === t[0])
      r++;
    else if (e[i] === t[1] && (r--, r < 0))
      return i;
  return -1;
}
function Tm(e) {
  e && e.sanitize && !e.silent && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
}
function Pu(e, t) {
  if (t < 1)
    return "";
  let n = "";
  for (; t > 1; )
    t & 1 && (n += e), t >>= 1, e += e;
  return n + e;
}
function Lu(e, t, n, r) {
  const i = t.href, o = t.title ? wn(t.title) : null, s = e[1].replace(/\\([\[\]])/g, "$1");
  if (e[0].charAt(0) !== "!") {
    r.state.inLink = !0;
    const a = {
      type: "link",
      raw: n,
      href: i,
      title: o,
      text: s,
      tokens: r.inlineTokens(s)
    };
    return r.state.inLink = !1, a;
  }
  return {
    type: "image",
    raw: n,
    href: i,
    title: o,
    text: wn(s)
  };
}
function Dm(e, t) {
  const n = e.match(/^(\s+)(?:```)/);
  if (n === null)
    return t;
  const r = n[1];
  return t.split(`
`).map((i) => {
    const o = i.match(/^\s+/);
    if (o === null)
      return i;
    const [s] = o;
    return s.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
class il {
  constructor(t) {
    this.options = t || ei;
  }
  space(t) {
    const n = this.rules.block.newline.exec(t);
    if (n && n[0].length > 0)
      return {
        type: "space",
        raw: n[0]
      };
  }
  code(t) {
    const n = this.rules.block.code.exec(t);
    if (n) {
      const r = n[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: n[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? r : ia(r, `
`)
      };
    }
  }
  fences(t) {
    const n = this.rules.block.fences.exec(t);
    if (n) {
      const r = n[0], i = Dm(r, n[3] || "");
      return {
        type: "code",
        raw: r,
        lang: n[2] ? n[2].trim().replace(this.rules.inline._escapes, "$1") : n[2],
        text: i
      };
    }
  }
  heading(t) {
    const n = this.rules.block.heading.exec(t);
    if (n) {
      let r = n[2].trim();
      if (/#$/.test(r)) {
        const i = ia(r, "#");
        (this.options.pedantic || !i || / $/.test(i)) && (r = i.trim());
      }
      return {
        type: "heading",
        raw: n[0],
        depth: n[1].length,
        text: r,
        tokens: this.lexer.inline(r)
      };
    }
  }
  hr(t) {
    const n = this.rules.block.hr.exec(t);
    if (n)
      return {
        type: "hr",
        raw: n[0]
      };
  }
  blockquote(t) {
    const n = this.rules.block.blockquote.exec(t);
    if (n) {
      const r = n[0].replace(/^ *>[ \t]?/gm, ""), i = this.lexer.state.top;
      this.lexer.state.top = !0;
      const o = this.lexer.blockTokens(r);
      return this.lexer.state.top = i, {
        type: "blockquote",
        raw: n[0],
        tokens: o,
        text: r
      };
    }
  }
  list(t) {
    let n = this.rules.block.list.exec(t);
    if (n) {
      let r, i, o, s, a, l, u, c, f, g, h, p, m = n[1].trim();
      const w = m.length > 1, b = {
        type: "list",
        raw: "",
        ordered: w,
        start: w ? +m.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      m = w ? `\\d{1,9}\\${m.slice(-1)}` : `\\${m}`, this.options.pedantic && (m = w ? m : "[*+-]");
      const v = new RegExp(`^( {0,3}${m})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      for (; t && (p = !1, !(!(n = v.exec(t)) || this.rules.block.hr.test(t))); ) {
        if (r = n[0], t = t.substring(r.length), c = n[2].split(`
`, 1)[0].replace(/^\t+/, (I) => " ".repeat(3 * I.length)), f = t.split(`
`, 1)[0], this.options.pedantic ? (s = 2, h = c.trimLeft()) : (s = n[2].search(/[^ ]/), s = s > 4 ? 1 : s, h = c.slice(s), s += n[1].length), l = !1, !c && /^ *$/.test(f) && (r += f + `
`, t = t.substring(f.length + 1), p = !0), !p) {
          const I = new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), E = new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), R = new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), P = new RegExp(`^ {0,${Math.min(3, s - 1)}}#`);
          for (; t && (g = t.split(`
`, 1)[0], f = g, this.options.pedantic && (f = f.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), !(R.test(f) || P.test(f) || I.test(f) || E.test(t))); ) {
            if (f.search(/[^ ]/) >= s || !f.trim())
              h += `
` + f.slice(s);
            else {
              if (l || c.search(/[^ ]/) >= 4 || R.test(c) || P.test(c) || E.test(c))
                break;
              h += `
` + f;
            }
            !l && !f.trim() && (l = !0), r += g + `
`, t = t.substring(g.length + 1), c = f.slice(s);
          }
        }
        b.loose || (u ? b.loose = !0 : /\n *\n *$/.test(r) && (u = !0)), this.options.gfm && (i = /^\[[ xX]\] /.exec(h), i && (o = i[0] !== "[ ] ", h = h.replace(/^\[[ xX]\] +/, ""))), b.items.push({
          type: "list_item",
          raw: r,
          task: !!i,
          checked: o,
          loose: !1,
          text: h
        }), b.raw += r;
      }
      b.items[b.items.length - 1].raw = r.trimRight(), b.items[b.items.length - 1].text = h.trimRight(), b.raw = b.raw.trimRight();
      const C = b.items.length;
      for (a = 0; a < C; a++)
        if (this.lexer.state.top = !1, b.items[a].tokens = this.lexer.blockTokens(b.items[a].text, []), !b.loose) {
          const I = b.items[a].tokens.filter((R) => R.type === "space"), E = I.length > 0 && I.some((R) => /\n.*\n/.test(R.raw));
          b.loose = E;
        }
      if (b.loose)
        for (a = 0; a < C; a++)
          b.items[a].loose = !0;
      return b;
    }
  }
  html(t) {
    const n = this.rules.block.html.exec(t);
    if (n) {
      const r = {
        type: "html",
        raw: n[0],
        pre: !this.options.sanitizer && (n[1] === "pre" || n[1] === "script" || n[1] === "style"),
        text: n[0]
      };
      if (this.options.sanitize) {
        const i = this.options.sanitizer ? this.options.sanitizer(n[0]) : wn(n[0]);
        r.type = "paragraph", r.text = i, r.tokens = this.lexer.inline(i);
      }
      return r;
    }
  }
  def(t) {
    const n = this.rules.block.def.exec(t);
    if (n) {
      const r = n[1].toLowerCase().replace(/\s+/g, " "), i = n[2] ? n[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "", o = n[3] ? n[3].substring(1, n[3].length - 1).replace(this.rules.inline._escapes, "$1") : n[3];
      return {
        type: "def",
        tag: r,
        raw: n[0],
        href: i,
        title: o
      };
    }
  }
  table(t) {
    const n = this.rules.block.table.exec(t);
    if (n) {
      const r = {
        type: "table",
        header: Ou(n[1]).map((i) => ({ text: i })),
        align: n[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        rows: n[3] && n[3].trim() ? n[3].replace(/\n[ \t]*$/, "").split(`
`) : []
      };
      if (r.header.length === r.align.length) {
        r.raw = n[0];
        let i = r.align.length, o, s, a, l;
        for (o = 0; o < i; o++)
          /^ *-+: *$/.test(r.align[o]) ? r.align[o] = "right" : /^ *:-+: *$/.test(r.align[o]) ? r.align[o] = "center" : /^ *:-+ *$/.test(r.align[o]) ? r.align[o] = "left" : r.align[o] = null;
        for (i = r.rows.length, o = 0; o < i; o++)
          r.rows[o] = Ou(r.rows[o], r.header.length).map((u) => ({ text: u }));
        for (i = r.header.length, s = 0; s < i; s++)
          r.header[s].tokens = this.lexer.inline(r.header[s].text);
        for (i = r.rows.length, s = 0; s < i; s++)
          for (l = r.rows[s], a = 0; a < l.length; a++)
            l[a].tokens = this.lexer.inline(l[a].text);
        return r;
      }
    }
  }
  lheading(t) {
    const n = this.rules.block.lheading.exec(t);
    if (n)
      return {
        type: "heading",
        raw: n[0],
        depth: n[2].charAt(0) === "=" ? 1 : 2,
        text: n[1],
        tokens: this.lexer.inline(n[1])
      };
  }
  paragraph(t) {
    const n = this.rules.block.paragraph.exec(t);
    if (n) {
      const r = n[1].charAt(n[1].length - 1) === `
` ? n[1].slice(0, -1) : n[1];
      return {
        type: "paragraph",
        raw: n[0],
        text: r,
        tokens: this.lexer.inline(r)
      };
    }
  }
  text(t) {
    const n = this.rules.block.text.exec(t);
    if (n)
      return {
        type: "text",
        raw: n[0],
        text: n[0],
        tokens: this.lexer.inline(n[0])
      };
  }
  escape(t) {
    const n = this.rules.inline.escape.exec(t);
    if (n)
      return {
        type: "escape",
        raw: n[0],
        text: wn(n[1])
      };
  }
  tag(t) {
    const n = this.rules.inline.tag.exec(t);
    if (n)
      return !this.lexer.state.inLink && /^<a /i.test(n[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(n[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(n[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(n[0]) && (this.lexer.state.inRawBlock = !1), {
        type: this.options.sanitize ? "text" : "html",
        raw: n[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(n[0]) : wn(n[0]) : n[0]
      };
  }
  link(t) {
    const n = this.rules.inline.link.exec(t);
    if (n) {
      const r = n[2].trim();
      if (!this.options.pedantic && /^</.test(r)) {
        if (!/>$/.test(r))
          return;
        const s = ia(r.slice(0, -1), "\\");
        if ((r.length - s.length) % 2 === 0)
          return;
      } else {
        const s = Im(n[2], "()");
        if (s > -1) {
          const l = (n[0].indexOf("!") === 0 ? 5 : 4) + n[1].length + s;
          n[2] = n[2].substring(0, s), n[0] = n[0].substring(0, l).trim(), n[3] = "";
        }
      }
      let i = n[2], o = "";
      if (this.options.pedantic) {
        const s = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);
        s && (i = s[1], o = s[3]);
      } else
        o = n[3] ? n[3].slice(1, -1) : "";
      return i = i.trim(), /^</.test(i) && (this.options.pedantic && !/>$/.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), Lu(n, {
        href: i && i.replace(this.rules.inline._escapes, "$1"),
        title: o && o.replace(this.rules.inline._escapes, "$1")
      }, n[0], this.lexer);
    }
  }
  reflink(t, n) {
    let r;
    if ((r = this.rules.inline.reflink.exec(t)) || (r = this.rules.inline.nolink.exec(t))) {
      let i = (r[2] || r[1]).replace(/\s+/g, " ");
      if (i = n[i.toLowerCase()], !i) {
        const o = r[0].charAt(0);
        return {
          type: "text",
          raw: o,
          text: o
        };
      }
      return Lu(r, i, r[0], this.lexer);
    }
  }
  emStrong(t, n, r = "") {
    let i = this.rules.inline.emStrong.lDelim.exec(t);
    if (!i || i[3] && r.match(/[\p{L}\p{N}]/u)) return;
    const o = i[1] || i[2] || "";
    if (!o || o && (r === "" || this.rules.inline.punctuation.exec(r))) {
      const s = i[0].length - 1;
      let a, l, u = s, c = 0;
      const f = i[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      for (f.lastIndex = 0, n = n.slice(-1 * t.length + s); (i = f.exec(n)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a) continue;
        if (l = a.length, i[3] || i[4]) {
          u += l;
          continue;
        } else if ((i[5] || i[6]) && s % 3 && !((s + l) % 3)) {
          c += l;
          continue;
        }
        if (u -= l, u > 0) continue;
        l = Math.min(l, l + u + c);
        const g = t.slice(0, s + i.index + (i[0].length - a.length) + l);
        if (Math.min(s, l) % 2) {
          const p = g.slice(1, -1);
          return {
            type: "em",
            raw: g,
            text: p,
            tokens: this.lexer.inlineTokens(p)
          };
        }
        const h = g.slice(2, -2);
        return {
          type: "strong",
          raw: g,
          text: h,
          tokens: this.lexer.inlineTokens(h)
        };
      }
    }
  }
  codespan(t) {
    const n = this.rules.inline.code.exec(t);
    if (n) {
      let r = n[2].replace(/\n/g, " ");
      const i = /[^ ]/.test(r), o = /^ /.test(r) && / $/.test(r);
      return i && o && (r = r.substring(1, r.length - 1)), r = wn(r, !0), {
        type: "codespan",
        raw: n[0],
        text: r
      };
    }
  }
  br(t) {
    const n = this.rules.inline.br.exec(t);
    if (n)
      return {
        type: "br",
        raw: n[0]
      };
  }
  del(t) {
    const n = this.rules.inline.del.exec(t);
    if (n)
      return {
        type: "del",
        raw: n[0],
        text: n[2],
        tokens: this.lexer.inlineTokens(n[2])
      };
  }
  autolink(t, n) {
    const r = this.rules.inline.autolink.exec(t);
    if (r) {
      let i, o;
      return r[2] === "@" ? (i = wn(this.options.mangle ? n(r[1]) : r[1]), o = "mailto:" + i) : (i = wn(r[1]), o = i), {
        type: "link",
        raw: r[0],
        text: i,
        href: o,
        tokens: [
          {
            type: "text",
            raw: i,
            text: i
          }
        ]
      };
    }
  }
  url(t, n) {
    let r;
    if (r = this.rules.inline.url.exec(t)) {
      let i, o;
      if (r[2] === "@")
        i = wn(this.options.mangle ? n(r[0]) : r[0]), o = "mailto:" + i;
      else {
        let s;
        do
          s = r[0], r[0] = this.rules.inline._backpedal.exec(r[0])[0];
        while (s !== r[0]);
        i = wn(r[0]), r[1] === "www." ? o = "http://" + r[0] : o = r[0];
      }
      return {
        type: "link",
        raw: r[0],
        text: i,
        href: o,
        tokens: [
          {
            type: "text",
            raw: i,
            text: i
          }
        ]
      };
    }
  }
  inlineText(t, n) {
    const r = this.rules.inline.text.exec(t);
    if (r) {
      let i;
      return this.lexer.state.inRawBlock ? i = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(r[0]) : wn(r[0]) : r[0] : i = wn(this.options.smartypants ? n(r[0]) : r[0]), {
        type: "text",
        raw: r[0],
        text: i
      };
    }
  }
}
const Ve = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
  html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
  def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
  table: ga,
  lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};
Ve._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
Ve._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
Ve.def = zt(Ve.def).replace("label", Ve._label).replace("title", Ve._title).getRegex();
Ve.bullet = /(?:[*+-]|\d{1,9}[.)])/;
Ve.listItemStart = zt(/^( *)(bull) */).replace("bull", Ve.bullet).getRegex();
Ve.list = zt(Ve.list).replace(/bull/g, Ve.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + Ve.def.source + ")").getRegex();
Ve._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
Ve._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
Ve.html = zt(Ve.html, "i").replace("comment", Ve._comment).replace("tag", Ve._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
Ve.paragraph = zt(Ve._paragraph).replace("hr", Ve.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ve._tag).getRegex();
Ve.blockquote = zt(Ve.blockquote).replace("paragraph", Ve.paragraph).getRegex();
Ve.normal = { ...Ve };
Ve.gfm = {
  ...Ve.normal,
  table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  // Cells
};
Ve.gfm.table = zt(Ve.gfm.table).replace("hr", Ve.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ve._tag).getRegex();
Ve.gfm.paragraph = zt(Ve._paragraph).replace("hr", Ve.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", Ve.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ve._tag).getRegex();
Ve.pedantic = {
  ...Ve.normal,
  html: zt(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Ve._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: ga,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: zt(Ve.normal._paragraph).replace("hr", Ve.hr).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ve.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
};
const be = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: ga,
  tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(ref)\]/,
  nolink: /^!?\[(ref)\](?:\[\])?/,
  reflinkSearch: "reflink|nolink(?!\\()",
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
    //          () Skip orphan inside strong                                      () Consume to delim     (1) #***                (2) a***#, a***                             (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
    rDelimAst: /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
    rDelimUnd: /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
    // ^- Not allowed for _
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: ga,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/
};
be._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
be.punctuation = zt(be.punctuation).replace(/punctuation/g, be._punctuation).getRegex();
be.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
be.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g;
be._comment = zt(Ve._comment).replace("(?:-->|$)", "-->").getRegex();
be.emStrong.lDelim = zt(be.emStrong.lDelim).replace(/punct/g, be._punctuation).getRegex();
be.emStrong.rDelimAst = zt(be.emStrong.rDelimAst, "g").replace(/punct/g, be._punctuation).getRegex();
be.emStrong.rDelimUnd = zt(be.emStrong.rDelimUnd, "g").replace(/punct/g, be._punctuation).getRegex();
be._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
be._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
be._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
be.autolink = zt(be.autolink).replace("scheme", be._scheme).replace("email", be._email).getRegex();
be._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
be.tag = zt(be.tag).replace("comment", be._comment).replace("attribute", be._attribute).getRegex();
be._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
be._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
be._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
be.link = zt(be.link).replace("label", be._label).replace("href", be._href).replace("title", be._title).getRegex();
be.reflink = zt(be.reflink).replace("label", be._label).replace("ref", Ve._label).getRegex();
be.nolink = zt(be.nolink).replace("ref", Ve._label).getRegex();
be.reflinkSearch = zt(be.reflinkSearch, "g").replace("reflink", be.reflink).replace("nolink", be.nolink).getRegex();
be.normal = { ...be };
be.pedantic = {
  ...be.normal,
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: zt(/^!?\[(label)\]\((.*?)\)/).replace("label", be._label).getRegex(),
  reflink: zt(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", be._label).getRegex()
};
be.gfm = {
  ...be.normal,
  escape: zt(be.escape).replace("])", "~|])").getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
be.gfm.url = zt(be.gfm.url, "i").replace("email", be.gfm._extended_email).getRegex();
be.breaks = {
  ...be.gfm,
  br: zt(be.br).replace("{2,}", "*").getRegex(),
  text: zt(be.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
function Om(e) {
  return e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
}
function Fu(e) {
  let t = "", n, r;
  const i = e.length;
  for (n = 0; n < i; n++)
    r = e.charCodeAt(n), Math.random() > 0.5 && (r = "x" + r.toString(16)), t += "&#" + r + ";";
  return t;
}
class Or {
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || ei, this.options.tokenizer = this.options.tokenizer || new il(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const n = {
      block: Ve.normal,
      inline: be.normal
    };
    this.options.pedantic ? (n.block = Ve.pedantic, n.inline = be.pedantic) : this.options.gfm && (n.block = Ve.gfm, this.options.breaks ? n.inline = be.breaks : n.inline = be.gfm), this.tokenizer.rules = n;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Ve,
      inline: be
    };
  }
  /**
   * Static Lex Method
   */
  static lex(t, n) {
    return new Or(n).lex(t);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(t, n) {
    return new Or(n).inlineTokens(t);
  }
  /**
   * Preprocessing
   */
  lex(t) {
    t = t.replace(/\r\n|\r/g, `
`), this.blockTokens(t, this.tokens);
    let n;
    for (; n = this.inlineQueue.shift(); )
      this.inlineTokens(n.src, n.tokens);
    return this.tokens;
  }
  /**
   * Lexing
   */
  blockTokens(t, n = []) {
    this.options.pedantic ? t = t.replace(/\t/g, "    ").replace(/^ +$/gm, "") : t = t.replace(/^( *)(\t+)/gm, (a, l, u) => l + "    ".repeat(u.length));
    let r, i, o, s;
    for (; t; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((a) => (r = a.call({ lexer: this }, t, n)) ? (t = t.substring(r.raw.length), n.push(r), !0) : !1))) {
        if (r = this.tokenizer.space(t)) {
          t = t.substring(r.raw.length), r.raw.length === 1 && n.length > 0 ? n[n.length - 1].raw += `
` : n.push(r);
          continue;
        }
        if (r = this.tokenizer.code(t)) {
          t = t.substring(r.raw.length), i = n[n.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + r.raw, i.text += `
` + r.text, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : n.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.list(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.html(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.def(t)) {
          t = t.substring(r.raw.length), i = n[n.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + r.raw, i.text += `
` + r.raw, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
            href: r.href,
            title: r.title
          });
          continue;
        }
        if (r = this.tokenizer.table(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (o = t, this.options.extensions && this.options.extensions.startBlock) {
          let a = 1 / 0;
          const l = t.slice(1);
          let u;
          this.options.extensions.startBlock.forEach(function(c) {
            u = c.call({ lexer: this }, l), typeof u == "number" && u >= 0 && (a = Math.min(a, u));
          }), a < 1 / 0 && a >= 0 && (o = t.substring(0, a + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(o))) {
          i = n[n.length - 1], s && i.type === "paragraph" ? (i.raw += `
` + r.raw, i.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : n.push(r), s = o.length !== t.length, t = t.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(t)) {
          t = t.substring(r.raw.length), i = n[n.length - 1], i && i.type === "text" ? (i.raw += `
` + r.raw, i.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : n.push(r);
          continue;
        }
        if (t) {
          const a = "Infinite loop on byte: " + t.charCodeAt(0);
          if (this.options.silent) {
            console.error(a);
            break;
          } else
            throw new Error(a);
        }
      }
    return this.state.top = !0, n;
  }
  inline(t, n = []) {
    return this.inlineQueue.push({ src: t, tokens: n }), n;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(t, n = []) {
    let r, i, o, s = t, a, l, u;
    if (this.tokens.links) {
      const c = Object.keys(this.tokens.links);
      if (c.length > 0)
        for (; (a = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; )
          c.includes(a[0].slice(a[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, a.index) + "[" + Pu("a", a[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (a = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; )
      s = s.slice(0, a.index) + "[" + Pu("a", a[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (a = this.tokenizer.rules.inline.escapedEmSt.exec(s)) != null; )
      s = s.slice(0, a.index + a[0].length - 2) + "++" + s.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex), this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
    for (; t; )
      if (l || (u = ""), l = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((c) => (r = c.call({ lexer: this }, t, n)) ? (t = t.substring(r.raw.length), n.push(r), !0) : !1))) {
        if (r = this.tokenizer.escape(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.tag(t)) {
          t = t.substring(r.raw.length), i = n[n.length - 1], i && r.type === "text" && i.type === "text" ? (i.raw += r.raw, i.text += r.text) : n.push(r);
          continue;
        }
        if (r = this.tokenizer.link(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.reflink(t, this.tokens.links)) {
          t = t.substring(r.raw.length), i = n[n.length - 1], i && r.type === "text" && i.type === "text" ? (i.raw += r.raw, i.text += r.text) : n.push(r);
          continue;
        }
        if (r = this.tokenizer.emStrong(t, s, u)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.codespan(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.br(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.del(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.autolink(t, Fu)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (!this.state.inLink && (r = this.tokenizer.url(t, Fu))) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (o = t, this.options.extensions && this.options.extensions.startInline) {
          let c = 1 / 0;
          const f = t.slice(1);
          let g;
          this.options.extensions.startInline.forEach(function(h) {
            g = h.call({ lexer: this }, f), typeof g == "number" && g >= 0 && (c = Math.min(c, g));
          }), c < 1 / 0 && c >= 0 && (o = t.substring(0, c + 1));
        }
        if (r = this.tokenizer.inlineText(o, Om)) {
          t = t.substring(r.raw.length), r.raw.slice(-1) !== "_" && (u = r.raw.slice(-1)), l = !0, i = n[n.length - 1], i && i.type === "text" ? (i.raw += r.raw, i.text += r.text) : n.push(r);
          continue;
        }
        if (t) {
          const c = "Infinite loop on byte: " + t.charCodeAt(0);
          if (this.options.silent) {
            console.error(c);
            break;
          } else
            throw new Error(c);
        }
      }
    return n;
  }
}
class ol {
  constructor(t) {
    this.options = t || ei;
  }
  code(t, n, r) {
    const i = (n || "").match(/\S*/)[0];
    if (this.options.highlight) {
      const o = this.options.highlight(t, i);
      o != null && o !== t && (r = !0, t = o);
    }
    return t = t.replace(/\n$/, "") + `
`, i ? '<pre><code class="' + this.options.langPrefix + wn(i) + '">' + (r ? t : wn(t, !0)) + `</code></pre>
` : "<pre><code>" + (r ? t : wn(t, !0)) + `</code></pre>
`;
  }
  /**
   * @param {string} quote
   */
  blockquote(t) {
    return `<blockquote>
${t}</blockquote>
`;
  }
  html(t) {
    return t;
  }
  /**
   * @param {string} text
   * @param {string} level
   * @param {string} raw
   * @param {any} slugger
   */
  heading(t, n, r, i) {
    if (this.options.headerIds) {
      const o = this.options.headerPrefix + i.slug(r);
      return `<h${n} id="${o}">${t}</h${n}>
`;
    }
    return `<h${n}>${t}</h${n}>
`;
  }
  hr() {
    return this.options.xhtml ? `<hr/>
` : `<hr>
`;
  }
  list(t, n, r) {
    const i = n ? "ol" : "ul", o = n && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + i + o + `>
` + t + "</" + i + `>
`;
  }
  /**
   * @param {string} text
   */
  listitem(t) {
    return `<li>${t}</li>
`;
  }
  checkbox(t) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
  }
  /**
   * @param {string} text
   */
  paragraph(t) {
    return `<p>${t}</p>
`;
  }
  /**
   * @param {string} header
   * @param {string} body
   */
  table(t, n) {
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + n + `</table>
`;
  }
  /**
   * @param {string} content
   */
  tablerow(t) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t, n) {
    const r = n.header ? "th" : "td";
    return (n.align ? `<${r} align="${n.align}">` : `<${r}>`) + t + `</${r}>
`;
  }
  /**
   * span level renderer
   * @param {string} text
   */
  strong(t) {
    return `<strong>${t}</strong>`;
  }
  /**
   * @param {string} text
   */
  em(t) {
    return `<em>${t}</em>`;
  }
  /**
   * @param {string} text
   */
  codespan(t) {
    return `<code>${t}</code>`;
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  /**
   * @param {string} text
   */
  del(t) {
    return `<del>${t}</del>`;
  }
  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  link(t, n, r) {
    if (t = Du(this.options.sanitize, this.options.baseUrl, t), t === null)
      return r;
    let i = '<a href="' + t + '"';
    return n && (i += ' title="' + n + '"'), i += ">" + r + "</a>", i;
  }
  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  image(t, n, r) {
    if (t = Du(this.options.sanitize, this.options.baseUrl, t), t === null)
      return r;
    let i = `<img src="${t}" alt="${r}"`;
    return n && (i += ` title="${n}"`), i += this.options.xhtml ? "/>" : ">", i;
  }
  text(t) {
    return t;
  }
}
class Hd {
  // no need for block level renderers
  strong(t) {
    return t;
  }
  em(t) {
    return t;
  }
  codespan(t) {
    return t;
  }
  del(t) {
    return t;
  }
  html(t) {
    return t;
  }
  text(t) {
    return t;
  }
  link(t, n, r) {
    return "" + r;
  }
  image(t, n, r) {
    return "" + r;
  }
  br() {
    return "";
  }
}
class zd {
  constructor() {
    this.seen = {};
  }
  /**
   * @param {string} value
   */
  serialize(t) {
    return t.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
  }
  /**
   * Finds the next safe (unique) slug to use
   * @param {string} originalSlug
   * @param {boolean} isDryRun
   */
  getNextSafeSlug(t, n) {
    let r = t, i = 0;
    if (this.seen.hasOwnProperty(r)) {
      i = this.seen[t];
      do
        i++, r = t + "-" + i;
      while (this.seen.hasOwnProperty(r));
    }
    return n || (this.seen[t] = i, this.seen[r] = 0), r;
  }
  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
   */
  slug(t, n = {}) {
    const r = this.serialize(t);
    return this.getNextSafeSlug(r, n.dryrun);
  }
}
class Pr {
  constructor(t) {
    this.options = t || ei, this.options.renderer = this.options.renderer || new ol(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new Hd(), this.slugger = new zd();
  }
  /**
   * Static Parse Method
   */
  static parse(t, n) {
    return new Pr(n).parse(t);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(t, n) {
    return new Pr(n).parseInline(t);
  }
  /**
   * Parse Loop
   */
  parse(t, n = !0) {
    let r = "", i, o, s, a, l, u, c, f, g, h, p, m, w, b, v, C, I, E, R;
    const P = t.length;
    for (i = 0; i < P; i++) {
      if (h = t[i], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[h.type] && (R = this.options.extensions.renderers[h.type].call({ parser: this }, h), R !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(h.type))) {
        r += R || "";
        continue;
      }
      switch (h.type) {
        case "space":
          continue;
        case "hr": {
          r += this.renderer.hr();
          continue;
        }
        case "heading": {
          r += this.renderer.heading(
            this.parseInline(h.tokens),
            h.depth,
            Ad(this.parseInline(h.tokens, this.textRenderer)),
            this.slugger
          );
          continue;
        }
        case "code": {
          r += this.renderer.code(
            h.text,
            h.lang,
            h.escaped
          );
          continue;
        }
        case "table": {
          for (f = "", c = "", a = h.header.length, o = 0; o < a; o++)
            c += this.renderer.tablecell(
              this.parseInline(h.header[o].tokens),
              { header: !0, align: h.align[o] }
            );
          for (f += this.renderer.tablerow(c), g = "", a = h.rows.length, o = 0; o < a; o++) {
            for (u = h.rows[o], c = "", l = u.length, s = 0; s < l; s++)
              c += this.renderer.tablecell(
                this.parseInline(u[s].tokens),
                { header: !1, align: h.align[s] }
              );
            g += this.renderer.tablerow(c);
          }
          r += this.renderer.table(f, g);
          continue;
        }
        case "blockquote": {
          g = this.parse(h.tokens), r += this.renderer.blockquote(g);
          continue;
        }
        case "list": {
          for (p = h.ordered, m = h.start, w = h.loose, a = h.items.length, g = "", o = 0; o < a; o++)
            v = h.items[o], C = v.checked, I = v.task, b = "", v.task && (E = this.renderer.checkbox(C), w ? v.tokens.length > 0 && v.tokens[0].type === "paragraph" ? (v.tokens[0].text = E + " " + v.tokens[0].text, v.tokens[0].tokens && v.tokens[0].tokens.length > 0 && v.tokens[0].tokens[0].type === "text" && (v.tokens[0].tokens[0].text = E + " " + v.tokens[0].tokens[0].text)) : v.tokens.unshift({
              type: "text",
              text: E
            }) : b += E), b += this.parse(v.tokens, w), g += this.renderer.listitem(b, I, C);
          r += this.renderer.list(g, p, m);
          continue;
        }
        case "html": {
          r += this.renderer.html(h.text);
          continue;
        }
        case "paragraph": {
          r += this.renderer.paragraph(this.parseInline(h.tokens));
          continue;
        }
        case "text": {
          for (g = h.tokens ? this.parseInline(h.tokens) : h.text; i + 1 < P && t[i + 1].type === "text"; )
            h = t[++i], g += `
` + (h.tokens ? this.parseInline(h.tokens) : h.text);
          r += n ? this.renderer.paragraph(g) : g;
          continue;
        }
        default: {
          const x = 'Token with "' + h.type + '" type was not found.';
          if (this.options.silent) {
            console.error(x);
            return;
          } else
            throw new Error(x);
        }
      }
    }
    return r;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(t, n) {
    n = n || this.renderer;
    let r = "", i, o, s;
    const a = t.length;
    for (i = 0; i < a; i++) {
      if (o = t[i], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[o.type] && (s = this.options.extensions.renderers[o.type].call({ parser: this }, o), s !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type))) {
        r += s || "";
        continue;
      }
      switch (o.type) {
        case "escape": {
          r += n.text(o.text);
          break;
        }
        case "html": {
          r += n.html(o.text);
          break;
        }
        case "link": {
          r += n.link(o.href, o.title, this.parseInline(o.tokens, n));
          break;
        }
        case "image": {
          r += n.image(o.href, o.title, o.text);
          break;
        }
        case "strong": {
          r += n.strong(this.parseInline(o.tokens, n));
          break;
        }
        case "em": {
          r += n.em(this.parseInline(o.tokens, n));
          break;
        }
        case "codespan": {
          r += n.codespan(o.text);
          break;
        }
        case "br": {
          r += n.br();
          break;
        }
        case "del": {
          r += n.del(this.parseInline(o.tokens, n));
          break;
        }
        case "text": {
          r += n.text(o.text);
          break;
        }
        default: {
          const l = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent) {
            console.error(l);
            return;
          } else
            throw new Error(l);
        }
      }
    }
    return r;
  }
}
class Hs {
  constructor(t) {
    this.options = t || ei;
  }
  static passThroughHooks = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess"
  ]);
  /**
   * Process markdown before marked
   */
  preprocess(t) {
    return t;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(t) {
    return t;
  }
}
function Pm(e, t, n) {
  return (r) => {
    if (r.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
      const i = "<p>An error occurred:</p><pre>" + wn(r.message + "", !0) + "</pre>";
      if (t)
        return Promise.resolve(i);
      if (n) {
        n(null, i);
        return;
      }
      return i;
    }
    if (t)
      return Promise.reject(r);
    if (n) {
      n(r);
      return;
    }
    throw r;
  };
}
function Vd(e, t) {
  return (n, r, i) => {
    typeof r == "function" && (i = r, r = null);
    const o = { ...r };
    r = { ...Ne.defaults, ...o };
    const s = Pm(r.silent, r.async, i);
    if (typeof n > "u" || n === null)
      return s(new Error("marked(): input parameter is undefined or null"));
    if (typeof n != "string")
      return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
    if (Tm(r), r.hooks && (r.hooks.options = r), i) {
      const a = r.highlight;
      let l;
      try {
        r.hooks && (n = r.hooks.preprocess(n)), l = e(n, r);
      } catch (f) {
        return s(f);
      }
      const u = function(f) {
        let g;
        if (!f)
          try {
            r.walkTokens && Ne.walkTokens(l, r.walkTokens), g = t(l, r), r.hooks && (g = r.hooks.postprocess(g));
          } catch (h) {
            f = h;
          }
        return r.highlight = a, f ? s(f) : i(null, g);
      };
      if (!a || a.length < 3 || (delete r.highlight, !l.length)) return u();
      let c = 0;
      Ne.walkTokens(l, function(f) {
        f.type === "code" && (c++, setTimeout(() => {
          a(f.text, f.lang, function(g, h) {
            if (g)
              return u(g);
            h != null && h !== f.text && (f.text = h, f.escaped = !0), c--, c === 0 && u();
          });
        }, 0));
      }), c === 0 && u();
      return;
    }
    if (r.async)
      return Promise.resolve(r.hooks ? r.hooks.preprocess(n) : n).then((a) => e(a, r)).then((a) => r.walkTokens ? Promise.all(Ne.walkTokens(a, r.walkTokens)).then(() => a) : a).then((a) => t(a, r)).then((a) => r.hooks ? r.hooks.postprocess(a) : a).catch(s);
    try {
      r.hooks && (n = r.hooks.preprocess(n));
      const a = e(n, r);
      r.walkTokens && Ne.walkTokens(a, r.walkTokens);
      let l = t(a, r);
      return r.hooks && (l = r.hooks.postprocess(l)), l;
    } catch (a) {
      return s(a);
    }
  };
}
function Ne(e, t, n) {
  return Vd(Or.lex, Pr.parse)(e, t, n);
}
Ne.options = Ne.setOptions = function(e) {
  return Ne.defaults = { ...Ne.defaults, ...e }, mm(Ne.defaults), Ne;
};
Ne.getDefaults = Ld;
Ne.defaults = ei;
Ne.use = function(...e) {
  const t = Ne.defaults.extensions || { renderers: {}, childTokens: {} };
  e.forEach((n) => {
    const r = { ...n };
    if (r.async = Ne.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((i) => {
      if (!i.name)
        throw new Error("extension name required");
      if (i.renderer) {
        const o = t.renderers[i.name];
        o ? t.renderers[i.name] = function(...s) {
          let a = i.renderer.apply(this, s);
          return a === !1 && (a = o.apply(this, s)), a;
        } : t.renderers[i.name] = i.renderer;
      }
      if (i.tokenizer) {
        if (!i.level || i.level !== "block" && i.level !== "inline")
          throw new Error("extension level must be 'block' or 'inline'");
        t[i.level] ? t[i.level].unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
      }
      i.childTokens && (t.childTokens[i.name] = i.childTokens);
    }), r.extensions = t), n.renderer) {
      const i = Ne.defaults.renderer || new ol();
      for (const o in n.renderer) {
        const s = i[o];
        i[o] = (...a) => {
          let l = n.renderer[o].apply(i, a);
          return l === !1 && (l = s.apply(i, a)), l;
        };
      }
      r.renderer = i;
    }
    if (n.tokenizer) {
      const i = Ne.defaults.tokenizer || new il();
      for (const o in n.tokenizer) {
        const s = i[o];
        i[o] = (...a) => {
          let l = n.tokenizer[o].apply(i, a);
          return l === !1 && (l = s.apply(i, a)), l;
        };
      }
      r.tokenizer = i;
    }
    if (n.hooks) {
      const i = Ne.defaults.hooks || new Hs();
      for (const o in n.hooks) {
        const s = i[o];
        Hs.passThroughHooks.has(o) ? i[o] = (a) => {
          if (Ne.defaults.async)
            return Promise.resolve(n.hooks[o].call(i, a)).then((u) => s.call(i, u));
          const l = n.hooks[o].call(i, a);
          return s.call(i, l);
        } : i[o] = (...a) => {
          let l = n.hooks[o].apply(i, a);
          return l === !1 && (l = s.apply(i, a)), l;
        };
      }
      r.hooks = i;
    }
    if (n.walkTokens) {
      const i = Ne.defaults.walkTokens;
      r.walkTokens = function(o) {
        let s = [];
        return s.push(n.walkTokens.call(this, o)), i && (s = s.concat(i.call(this, o))), s;
      };
    }
    Ne.setOptions(r);
  });
};
Ne.walkTokens = function(e, t) {
  let n = [];
  for (const r of e)
    switch (n = n.concat(t.call(Ne, r)), r.type) {
      case "table": {
        for (const i of r.header)
          n = n.concat(Ne.walkTokens(i.tokens, t));
        for (const i of r.rows)
          for (const o of i)
            n = n.concat(Ne.walkTokens(o.tokens, t));
        break;
      }
      case "list": {
        n = n.concat(Ne.walkTokens(r.items, t));
        break;
      }
      default:
        Ne.defaults.extensions && Ne.defaults.extensions.childTokens && Ne.defaults.extensions.childTokens[r.type] ? Ne.defaults.extensions.childTokens[r.type].forEach(function(i) {
          n = n.concat(Ne.walkTokens(r[i], t));
        }) : r.tokens && (n = n.concat(Ne.walkTokens(r.tokens, t)));
    }
  return n;
};
Ne.parseInline = Vd(Or.lexInline, Pr.parseInline);
Ne.Parser = Pr;
Ne.parser = Pr.parse;
Ne.Renderer = ol;
Ne.TextRenderer = Hd;
Ne.Lexer = Or;
Ne.lexer = Or.lex;
Ne.Tokenizer = il;
Ne.Slugger = zd;
Ne.Hooks = Hs;
Ne.parse = Ne;
Ne.options;
Ne.setOptions;
Ne.use;
Ne.walkTokens;
Ne.parseInline;
Pr.parse;
Or.lex;
const Lm = /* @__PURE__ */ fn("div")({
  name: "MarkdownContainer",
  class: "gdg-mnuv029",
  propsAsIs: !1
});
class Fm extends Bt.PureComponent {
  targetElement = null;
  renderMarkdownIntoDiv() {
    const { targetElement: t, props: n } = this;
    if (t === null)
      return;
    const { contents: r, createNode: i } = n, o = Ne(r), s = document.createRange();
    s.selectNodeContents(t), s.deleteContents();
    let a = i?.(o);
    if (a === void 0) {
      const u = document.createElement("template");
      u.innerHTML = o, a = u.content;
    }
    t.append(a);
    const l = t.getElementsByTagName("a");
    for (const u of l)
      u.target = "_blank", u.rel = "noreferrer noopener";
  }
  containerRefHook = (t) => {
    this.targetElement = t, this.renderMarkdownIntoDiv();
  };
  render() {
    return this.renderMarkdownIntoDiv(), Bt.createElement(Lm, { ref: this.containerRefHook });
  }
}
const _m = /* @__PURE__ */ fn("textarea")({
  name: "InputBox",
  class: "gdg-izpuzkl",
  propsAsIs: !1
}), Am = /* @__PURE__ */ fn("div")({
  name: "ShadowBox",
  class: "gdg-s69h75o",
  propsAsIs: !1
}), Hm = /* @__PURE__ */ fn("div")({
  name: "GrowingEntryStyle",
  class: "gdg-g1y0xocz",
  propsAsIs: !1
});
let _u = 0;
const ti = (e) => {
  const { placeholder: t, value: n, onKeyDown: r, highlight: i, altNewline: o, validatedSelection: s, ...a } = e, { onChange: l, className: u } = a, c = d.useRef(null), f = n ?? "";
  Vn(l !== void 0, "GrowingEntry must be a controlled input area");
  const [g] = d.useState(() => "input-box-" + (_u = (_u + 1) % 1e7));
  d.useEffect(() => {
    const p = c.current;
    if (p === null || p.disabled)
      return;
    const m = f.toString().length;
    p.focus(), p.setSelectionRange(i ? 0 : m, m);
  }, []), d.useLayoutEffect(() => {
    if (s !== void 0) {
      const p = typeof s == "number" ? [s, null] : s;
      c.current?.setSelectionRange(p[0], p[1]);
    }
  }, [s]);
  const h = d.useCallback((p) => {
    p.key === "Enter" && p.shiftKey && o === !0 || r?.(p);
  }, [o, r]);
  return d.createElement(
    Hm,
    { className: "gdg-growing-entry" },
    d.createElement(Am, { className: u }, f + `
`),
    d.createElement(_m, { ...a, className: (u ?? "") + " gdg-input", id: g, ref: c, onKeyDown: h, value: f, placeholder: t, dir: "auto" })
  );
}, us = {};
let Mr = null;
function zm() {
  const e = document.createElement("div");
  return e.style.opacity = "0", e.style.pointerEvents = "none", e.style.position = "fixed", document.body.append(e), e;
}
function mo(e) {
  const t = e.toLowerCase().trim();
  if (us[t] !== void 0)
    return us[t];
  Mr = Mr || zm(), Mr.style.color = "#000", Mr.style.color = t;
  const n = getComputedStyle(Mr).color;
  Mr.style.color = "#fff", Mr.style.color = t;
  const r = getComputedStyle(Mr).color;
  if (r !== n)
    return [0, 0, 0, 1];
  let i = r.replace(/[^\d.,]/g, "").split(",").map(Number.parseFloat);
  return i.length < 4 && i.push(1), i = i.map((o) => Number.isNaN(o) ? 0 : o), us[t] = i, i;
}
function Jr(e, t) {
  const [n, r, i] = mo(e);
  return `rgba(${n}, ${r}, ${i}, ${t})`;
}
const Au = /* @__PURE__ */ new Map();
function Hu(e, t) {
  const n = `${e}-${t}`, r = Au.get(n);
  if (r !== void 0)
    return r;
  const i = $n(e, t);
  return Au.set(n, i), i;
}
function $n(e, t) {
  if (t === void 0)
    return e;
  const [n, r, i, o] = mo(e);
  if (o === 1)
    return e;
  const [s, a, l, u] = mo(t), c = o + u * (1 - o), f = (o * n + u * s * (1 - o)) / c, g = (o * r + u * a * (1 - o)) / c, h = (o * i + u * l * (1 - o)) / c;
  return `rgba(${f}, ${g}, ${h}, ${c})`;
}
function zs(e) {
  if (e === "transparent")
    return 0;
  function t(o) {
    const s = o / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }
  const [n, r, i] = mo(e);
  return 0.2126 * t(n) + 0.7152 * t(r) + 0.0722 * t(i);
}
var Ei = /* @__PURE__ */ new Map(), Ti = /* @__PURE__ */ new Map(), Vs = /* @__PURE__ */ new Map();
function Vm() {
  Ei.clear(), Vs.clear(), Ti.clear();
}
function $m(e, t, n, r, i) {
  var o, s, a;
  let l = 0, u = {};
  for (let f of e) l += (o = n.get(f)) != null ? o : i, u[f] = ((s = u[f]) != null ? s : 0) + 1;
  let c = t - l;
  for (let f of Object.keys(u)) {
    let g = u[f], h = (a = n.get(f)) != null ? a : i, p = h * g / l, m = c * p * r / g, w = h + m;
    n.set(f, w);
  }
}
function Nm(e, t) {
  var n;
  let r = /* @__PURE__ */ new Map(), i = 0;
  for (let u of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,.-+=?") {
    let c = e.measureText(u).width;
    r.set(u, c), i += c;
  }
  let o = i / r.size, s = 3, a = (t / o + s) / (s + 1), l = r.keys();
  for (let u of l) r.set(u, ((n = r.get(u)) != null ? n : o) * a);
  return r;
}
function co(e, t, n, r) {
  var i, o;
  let s = Ti.get(n);
  if (r && s !== void 0 && s.count > 2e4) {
    let u = Vs.get(n);
    if (u === void 0 && (u = Nm(e, s.size), Vs.set(n, u)), s.count > 5e5) {
      let f = 0;
      for (let g of t) f += (i = u.get(g)) != null ? i : s.size;
      return f * 1.01;
    }
    let c = e.measureText(t);
    return $m(t, c.width, u, Math.max(0.05, 1 - s.count / 2e5), s.size), Ti.set(n, { count: s.count + t.length, size: s.size }), c.width;
  }
  let a = e.measureText(t), l = a.width / t.length;
  if (((o = s?.count) != null ? o : 0) > 2e4) return a.width;
  if (s === void 0) Ti.set(n, { count: t.length, size: l });
  else {
    let u = l - s.size, c = t.length / (s.count + t.length), f = s.size + u * c;
    Ti.set(n, { count: s.count + t.length, size: f });
  }
  return a.width;
}
function Bm(e, t, n, r, i, o, s, a) {
  if (t.length <= 1) return t.length;
  if (i < n) return -1;
  let l = Math.floor(n / i * o), u = co(e, t.slice(0, Math.max(0, l)), r, s);
  if (u !== n) if (u < n) {
    for (; u < n; ) l++, u = co(e, t.slice(0, Math.max(0, l)), r, s);
    l--;
  } else for (; u > n; ) {
    let c = t.lastIndexOf(" ", l - 1);
    c > 0 ? l = c : l--, u = co(e, t.slice(0, Math.max(0, l)), r, s);
  }
  if (t[l] !== " ") {
    let c = 0;
    c = t.lastIndexOf(" ", l), c > 0 && (l = c);
  }
  return l;
}
function Wm(e, t, n, r, i, o) {
  let s = `${t}_${n}_${r}px`, a = Ei.get(s);
  if (a !== void 0) return a;
  if (r <= 0) return [];
  let l = [], u = t.split(`
`), c = Ti.get(n), f = c === void 0 ? t.length : r / c.size * 1.5, g = i && c !== void 0 && c.count > 2e4;
  for (let h of u) {
    let p = co(e, h.slice(0, Math.max(0, f)), n, g), m = Math.min(h.length, f);
    if (p <= r) l.push(h);
    else {
      for (; p > r; ) {
        let w = Bm(e, h, r, n, p, m, g), b = h.slice(0, Math.max(0, w));
        h = h.slice(b.length), l.push(b), p = co(e, h.slice(0, Math.max(0, f)), n, g), m = Math.min(h.length, f);
      }
      p > 0 && l.push(h);
    }
  }
  return l = l.map((h, p) => p === 0 ? h.trimEnd() : h.trim()), Ei.set(s, l), Ei.size > 500 && Ei.delete(Ei.keys().next().value), l;
}
function Um(e, t) {
  return Bt.useMemo(() => e.map((n, r) => ({
    group: n.group,
    grow: n.grow,
    hasMenu: n.hasMenu,
    icon: n.icon,
    id: n.id,
    menuIcon: n.menuIcon,
    overlayIcon: n.overlayIcon,
    sourceIndex: r,
    sticky: r < t,
    indicatorIcon: n.indicatorIcon,
    style: n.style,
    themeOverride: n.themeOverride,
    title: n.title,
    trailingRowOptions: n.trailingRowOptions,
    width: n.width,
    growOffset: n.growOffset,
    rowMarker: n.rowMarker,
    rowMarkerChecked: n.rowMarkerChecked,
    headerRowMarkerTheme: n.headerRowMarkerTheme,
    headerRowMarkerAlwaysVisible: n.headerRowMarkerAlwaysVisible,
    headerRowMarkerDisabled: n.headerRowMarkerDisabled
  })), [e, t]);
}
function jm(e, t) {
  const [n, r] = t;
  if (e.columns.hasIndex(n) || e.rows.hasIndex(r))
    return !0;
  if (e.current !== void 0) {
    if (fo(e.current.cell, t))
      return !0;
    const i = [e.current.range, ...e.current.rangeStack];
    for (const o of i)
      if (n >= o.x && n < o.x + o.width && r >= o.y && r < o.y + o.height)
        return !0;
  }
  return !1;
}
function vo(e, t) {
  return (e ?? "") === (t ?? "");
}
function qm(e, t, n) {
  return n.current === void 0 || e[1] !== n.current.cell[1] ? !1 : t.span === void 0 ? n.current.cell[0] === e[0] : n.current.cell[0] >= t.span[0] && n.current.cell[0] <= t.span[1];
}
function $d(e, t) {
  const [n, r] = e;
  return n >= t.x && n < t.x + t.width && r >= t.y && r < t.y + t.height;
}
function fo(e, t) {
  return e?.[0] === t?.[0] && e?.[1] === t?.[1];
}
function Nd(e) {
  return [e.x + e.width - 1, e.y + e.height - 1];
}
function zu(e, t, n) {
  const r = n.x, i = n.x + n.width - 1, o = n.y, s = n.y + n.height - 1, [a, l] = e;
  if (l < o || l > s)
    return !1;
  if (t.span === void 0)
    return a >= r && a <= i;
  const [u, c] = t.span;
  return u >= r && u <= i || c >= r && u <= i || u < r && c > i;
}
function Gm(e, t, n, r) {
  let i = 0;
  if (n.current === void 0)
    return i;
  const o = n.current.range;
  (r || o.height * o.width > 1) && zu(e, t, o) && i++;
  for (const s of n.current.rangeStack)
    zu(e, t, s) && i++;
  return i;
}
function Bd(e, t) {
  let n = e;
  if (t !== void 0) {
    let r = [...e];
    const i = n[t.src];
    t.src > t.dest ? (r.splice(t.src, 1), r.splice(t.dest, 0, i)) : (r.splice(t.dest + 1, 0, i), r.splice(t.src, 1)), r = r.map((o, s) => ({
      ...o,
      sticky: e[s].sticky
    })), n = r;
  }
  return n;
}
function Fi(e, t) {
  let n = 0;
  const r = Bd(e, t);
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    if (o.sticky)
      n += o.width;
    else
      break;
  }
  return n;
}
function ni(e, t, n) {
  if (typeof n == "number")
    return t * n;
  {
    let r = 0;
    for (let i = e - t; i < e; i++)
      r += n(i);
    return r;
  }
}
function $s(e, t, n, r, i) {
  const o = Bd(e, r), s = [];
  for (const u of o)
    if (u.sticky)
      s.push(u);
    else
      break;
  if (s.length > 0)
    for (const u of s)
      n -= u.width;
  let a = t, l = i ?? 0;
  for (; l <= n && a < o.length; )
    l += o[a].width, a++;
  for (let u = t; u < a; u++) {
    const c = o[u];
    c.sticky || s.push(c);
  }
  return s;
}
function Ym(e, t, n) {
  let r = 0;
  for (const i of t) {
    const o = i.sticky ? r : r + (n ?? 0);
    if (e <= o + i.width)
      return i.sourceIndex;
    r += i.width;
  }
  return -1;
}
function Xm(e, t, n, r, i, o, s, a, l, u) {
  const c = r + i;
  if (n && e <= i)
    return -2;
  if (e <= c)
    return -1;
  let f = t;
  for (let p = 0; p < u; p++) {
    const m = o - 1 - p, w = typeof s == "number" ? s : s(m);
    if (f -= w, e >= f)
      return m;
  }
  const g = o - u, h = e - (l ?? 0);
  if (typeof s == "number") {
    const p = Math.floor((h - c) / s) + a;
    return p >= g ? void 0 : p;
  } else {
    let p = c;
    for (let m = a; m < g; m++) {
      const w = s(m);
      if (h <= p + w)
        return m;
      p += w;
    }
    return;
  }
}
let oa = 0, ho = {};
const Km = typeof window > "u";
async function Zm() {
  Km || document?.fonts?.ready === void 0 || (await document.fonts.ready, oa = 0, ho = {}, Vm());
}
Zm();
function Wd(e, t, n, r) {
  return `${e}_${r ?? t?.font}_${n}`;
}
function Lr(e, t, n, r = "middle") {
  const i = Wd(e, t, r, n);
  let o = ho[i];
  return o === void 0 && (o = t.measureText(e), ho[i] = o, oa++), oa > 1e4 && (ho = {}, oa = 0), o;
}
function Ud(e, t) {
  const n = Wd(e, void 0, "middle", t);
  return ho[n];
}
function nr(e, t) {
  return typeof t != "string" && (t = t.baseFontFull), Jm(e, t);
}
function Vu(e, t) {
  const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  e.save(), e.textBaseline = t;
  const r = e.measureText(n);
  return e.restore(), r;
}
const $u = [];
function Jm(e, t) {
  for (const o of $u)
    if (o.key === t)
      return o.val;
  const n = Vu(e, "alphabetic"), i = -(Vu(e, "middle").actualBoundingBoxDescent - n.actualBoundingBoxDescent) + n.actualBoundingBoxAscent / 2;
  return $u.push({
    key: t,
    val: i
  }), i;
}
function Qm(e, t, n, r, i, o) {
  const { ctx: s, rect: a, theme: l } = e;
  let u = Number.MAX_SAFE_INTEGER;
  const c = 500;
  if (t !== void 0 && (u = n - t, u < c)) {
    const f = 1 - u / c;
    s.globalAlpha = f, s.fillStyle = l.bgSearchResult, s.fillRect(a.x + 1, a.y + 1, a.width - (i ? 2 : 1), a.height - (o ? 2 : 1)), s.globalAlpha = 1, r !== void 0 && (r.fillStyle = l.bgSearchResult);
  }
  return u < c;
}
function ko(e, t, n) {
  const { ctx: r, theme: i } = e, o = t ?? {}, s = n ?? i.textDark;
  return s !== o.fillStyle && (r.fillStyle = s, o.fillStyle = s), o;
}
function al(e, t, n, r, i) {
  const { rect: o, ctx: s, theme: a } = e;
  s.fillStyle = a.textDark, sr({
    ctx: s,
    rect: o,
    theme: a
  }, t, n, r, i);
}
function jd(e, t, n, r, i, o, s, a, l) {
  l === "right" ? e.fillText(t, n + i - (a.cellHorizontalPadding + 0.5), r + o / 2 + s) : l === "center" ? e.fillText(t, n + i / 2, r + o / 2 + s) : e.fillText(t, n + a.cellHorizontalPadding + 0.5, r + o / 2 + s);
}
function sl(e, t) {
  const n = Lr("ABCi09jgqpy", e, t);
  return n.actualBoundingBoxAscent + n.actualBoundingBoxDescent;
}
function e0(e, t) {
  e.includes(`
`) && (e = e.split(/\r?\n/, 1)[0]);
  const n = t / 4;
  return e.length > n && (e = e.slice(0, n)), e;
}
function t0(e, t, n, r, i, o, s, a, l, u) {
  const c = a.baseFontFull, f = Wm(e, t, c, i - a.cellHorizontalPadding * 2, u ?? !1), g = sl(e, c), h = a.lineHeight * g, p = g + h * (f.length - 1), m = p + a.cellVerticalPadding > o;
  m && (e.save(), e.rect(n, r, i, o), e.clip());
  const w = r + o / 2 - p / 2;
  let b = Math.max(r + a.cellVerticalPadding, w);
  for (const v of f)
    if (jd(e, v, n, b, i, g, s, a, l), b += h, b > r + o)
      break;
  m && e.restore();
}
function sr(e, t, n, r, i) {
  const { ctx: o, rect: s, theme: a } = e, { x: l, y: u, width: c, height: f } = s;
  r = r ?? !1, r || (t = e0(t, c));
  const g = nr(o, a), h = rl(t) === "rtl";
  if (n === void 0 && h && (n = "right"), h && (o.direction = "rtl"), t.length > 0) {
    let p = !1;
    n === "right" ? (o.textAlign = "right", p = !0) : n !== void 0 && n !== "left" && (o.textAlign = n, p = !0), r ? t0(o, t, l, u, c, f, g, a, n, i) : jd(o, t, l, u, c, f, g, a, n), p && (o.textAlign = "start"), h && (o.direction = "inherit");
  }
}
function er(e, t, n, r, i, o) {
  typeof o == "number" && (o = { tl: o, tr: o, br: o, bl: o }), o = {
    tl: Math.max(0, Math.min(o.tl, i / 2, r / 2)),
    tr: Math.max(0, Math.min(o.tr, i / 2, r / 2)),
    bl: Math.max(0, Math.min(o.bl, i / 2, r / 2)),
    br: Math.max(0, Math.min(o.br, i / 2, r / 2))
  }, e.moveTo(t + o.tl, n), e.arcTo(t + r, n, t + r, n + o.tr, o.tr), e.arcTo(t + r, n + i, t + r - o.br, n + i, o.br), e.arcTo(t, n + i, t, n + i - o.bl, o.bl), e.arcTo(t, n, t + o.tl, n, o.tl);
}
function n0(e, t, n) {
  e.arc(t, n - 1.25 * 3.5, 1.25, 0, 2 * Math.PI, !1), e.arc(t, n, 1.25, 0, 2 * Math.PI, !1), e.arc(t, n + 1.25 * 3.5, 1.25, 0, 2 * Math.PI, !1);
}
function r0(e, t, n) {
  const r = function(a, l) {
    const u = l.x - a.x, c = l.y - a.y, f = Math.sqrt(u * u + c * c), g = u / f, h = c / f;
    return {
      x: u,
      y: l.y - a.y,
      len: f,
      nx: g,
      ny: h,
      ang: Math.atan2(h, g)
    };
  };
  let i;
  const o = t.length;
  let s = t[o - 1];
  for (let a = 0; a < o; a++) {
    let l = t[a % o];
    const u = t[(a + 1) % o], c = r(l, s), f = r(l, u), g = c.nx * f.ny - c.ny * f.nx, h = c.nx * f.nx - c.ny * -f.ny;
    let p = Math.asin(g < -1 ? -1 : g > 1 ? 1 : g), m = 1, w = !1;
    h < 0 ? p < 0 ? p = Math.PI + p : (p = Math.PI - p, m = -1, w = !0) : p > 0 && (m = -1, w = !0), i = l.radius !== void 0 ? l.radius : n;
    const b = p / 2;
    let v = Math.abs(Math.cos(b) * i / Math.sin(b)), C;
    v > Math.min(c.len / 2, f.len / 2) ? (v = Math.min(c.len / 2, f.len / 2), C = Math.abs(v * Math.sin(b) / Math.cos(b))) : C = i;
    let I = l.x + f.nx * v, E = l.y + f.ny * v;
    I += -f.ny * C * m, E += f.nx * C * m, e.arc(I, E, C, c.ang + Math.PI / 2 * m, f.ang - Math.PI / 2 * m, w), s = l, l = u;
  }
  e.closePath();
}
function Ns(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p) {
  const m = {
    x: 0,
    y: o + u,
    width: 0,
    height: 0
  };
  if (e >= h.length || t >= c || t < -2 || e < 0)
    return m;
  const w = o - i;
  if (e >= f) {
    const b = s > e ? -1 : 1, v = Fi(h);
    m.x += v + l;
    for (let C = s; C !== e; C += b)
      m.x += h[b === 1 ? C : C - 1].width * b;
  } else
    for (let b = 0; b < e; b++)
      m.x += h[b].width;
  if (m.width = h[e].width + 1, t === -1)
    m.y = i, m.height = w;
  else if (t === -2) {
    m.y = 0, m.height = i;
    let b = e;
    const v = h[e].group, C = h[e].sticky;
    for (; b > 0 && vo(h[b - 1].group, v) && h[b - 1].sticky === C; ) {
      const E = h[b - 1];
      m.x -= E.width, m.width += E.width, b--;
    }
    let I = e;
    for (; I + 1 < h.length && vo(h[I + 1].group, v) && h[I + 1].sticky === C; ) {
      const E = h[I + 1];
      m.width += E.width, I++;
    }
    if (!C) {
      const E = Fi(h), R = m.x - E;
      R < 0 && (m.x -= R, m.width += R), m.x + m.width > n && (m.width = n - m.x);
    }
  } else if (t >= c - g) {
    let b = c - t;
    for (m.y = r; b > 0; ) {
      const v = t + b - 1;
      m.height = typeof p == "number" ? p : p(v), m.y -= m.height, b--;
    }
    m.height += 1;
  } else {
    const b = a > t ? -1 : 1;
    if (typeof p == "number") {
      const v = t - a;
      m.y += v * p;
    } else
      for (let v = a; v !== t; v += b)
        m.y += p(v) * b;
    m.height = (typeof p == "number" ? p : p(t)) + 1;
  }
  return m;
}
const ll = 1 << 21;
function Qn(e, t) {
  return (t + 2) * ll + e;
}
function qd(e) {
  return e % ll;
}
function ul(e) {
  return Math.floor(e / ll) - 2;
}
function cl(e) {
  const t = qd(e), n = ul(e);
  return [t, n];
}
class Gd {
  visibleWindow = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  freezeCols = 0;
  freezeRows = [];
  isInWindow = (t) => {
    const n = qd(t), r = ul(t), i = this.visibleWindow, o = n >= i.x && n <= i.x + i.width || n < this.freezeCols, s = r >= i.y && r <= i.y + i.height || this.freezeRows.includes(r);
    return o && s;
  };
  setWindow(t, n, r) {
    this.visibleWindow.x === t.x && this.visibleWindow.y === t.y && this.visibleWindow.width === t.width && this.visibleWindow.height === t.height && this.freezeCols === n && Li(this.freezeRows, r) || (this.visibleWindow = t, this.freezeCols = n, this.freezeRows = r, this.clearOutOfWindow());
  }
}
class i0 extends Gd {
  cache = /* @__PURE__ */ new Map();
  setValue = (t, n) => {
    this.cache.set(Qn(t[0], t[1]), n);
  };
  getValue = (t) => this.cache.get(Qn(t[0], t[1]));
  clearOutOfWindow = () => {
    for (const [t] of this.cache.entries())
      this.isInWindow(t) || this.cache.delete(t);
  };
}
class go {
  cells;
  constructor(t = []) {
    this.cells = new Set(t.map((n) => Qn(n[0], n[1])));
  }
  add(t) {
    this.cells.add(Qn(t[0], t[1]));
  }
  has(t) {
    return t === void 0 ? !1 : this.cells.has(Qn(t[0], t[1]));
  }
  remove(t) {
    this.cells.delete(Qn(t[0], t[1]));
  }
  clear() {
    this.cells.clear();
  }
  get size() {
    return this.cells.size;
  }
  hasHeader() {
    for (const t of this.cells)
      if (ul(t) < 0)
        return !0;
    return !1;
  }
  hasItemInRectangle(t) {
    for (let n = t.y; n < t.y + t.height; n++)
      for (let r = t.x; r < t.x + t.width; r++)
        if (this.cells.has(Qn(r, n)))
          return !0;
    return !1;
  }
  hasItemInRegion(t) {
    for (const n of t)
      if (this.hasItemInRectangle(n))
        return !0;
    return !1;
  }
  *values() {
    for (const t of this.cells)
      yield cl(t);
  }
}
function o0(e) {
  return {
    "--gdg-accent-color": e.accentColor,
    "--gdg-accent-fg": e.accentFg,
    "--gdg-accent-light": e.accentLight,
    "--gdg-text-dark": e.textDark,
    "--gdg-text-medium": e.textMedium,
    "--gdg-text-light": e.textLight,
    "--gdg-text-bubble": e.textBubble,
    "--gdg-bg-icon-header": e.bgIconHeader,
    "--gdg-fg-icon-header": e.fgIconHeader,
    "--gdg-text-header": e.textHeader,
    "--gdg-text-group-header": e.textGroupHeader ?? e.textHeader,
    "--gdg-bg-group-header": e.bgGroupHeader ?? e.bgHeader,
    "--gdg-bg-group-header-hovered": e.bgGroupHeaderHovered ?? e.bgHeaderHovered,
    "--gdg-text-header-selected": e.textHeaderSelected,
    "--gdg-bg-cell": e.bgCell,
    "--gdg-bg-cell-medium": e.bgCellMedium,
    "--gdg-bg-header": e.bgHeader,
    "--gdg-bg-header-has-focus": e.bgHeaderHasFocus,
    "--gdg-bg-header-hovered": e.bgHeaderHovered,
    "--gdg-bg-bubble": e.bgBubble,
    "--gdg-bg-bubble-selected": e.bgBubbleSelected,
    "--gdg-bubble-height": `${e.bubbleHeight}px`,
    "--gdg-bubble-padding": `${e.bubblePadding}px`,
    "--gdg-bubble-margin": `${e.bubbleMargin}px`,
    "--gdg-bg-search-result": e.bgSearchResult,
    "--gdg-border-color": e.borderColor,
    "--gdg-horizontal-border-color": e.horizontalBorderColor ?? e.borderColor,
    "--gdg-drilldown-border": e.drilldownBorder,
    "--gdg-link-color": e.linkColor,
    "--gdg-cell-horizontal-padding": `${e.cellHorizontalPadding}px`,
    "--gdg-cell-vertical-padding": `${e.cellVerticalPadding}px`,
    "--gdg-header-font-style": e.headerFontStyle,
    "--gdg-base-font-style": e.baseFontStyle,
    "--gdg-marker-font-style": e.markerFontStyle,
    "--gdg-font-family": e.fontFamily,
    "--gdg-editor-font-size": e.editorFontSize,
    "--gdg-checkbox-max-size": `${e.checkboxMaxSize}px`,
    ...e.resizeIndicatorColor === void 0 ? {} : { "--gdg-resize-indicator-color": e.resizeIndicatorColor },
    ...e.headerBottomBorderColor === void 0 ? {} : { "--gdg-header-bottom-border-color": e.headerBottomBorderColor },
    ...e.roundingRadius === void 0 ? {} : { "--gdg-rounding-radius": `${e.roundingRadius}px` }
  };
}
const Yd = {
  accentColor: "#4F5DFF",
  accentFg: "#FFFFFF",
  accentLight: "rgba(62, 116, 253, 0.1)",
  textDark: "#313139",
  textMedium: "#737383",
  textLight: "#B2B2C0",
  textBubble: "#313139",
  bgIconHeader: "#737383",
  fgIconHeader: "#FFFFFF",
  textHeader: "#313139",
  textGroupHeader: "#313139BB",
  textHeaderSelected: "#FFFFFF",
  bgCell: "#FFFFFF",
  bgCellMedium: "#FAFAFB",
  bgHeader: "#F7F7F8",
  bgHeaderHasFocus: "#E9E9EB",
  bgHeaderHovered: "#EFEFF1",
  bgBubble: "#EDEDF3",
  bgBubbleSelected: "#FFFFFF",
  bubbleHeight: 20,
  bubblePadding: 6,
  bubbleMargin: 4,
  bgSearchResult: "#fff9e3",
  borderColor: "rgba(115, 116, 131, 0.16)",
  drilldownBorder: "rgba(0, 0, 0, 0)",
  linkColor: "#353fb5",
  cellHorizontalPadding: 8,
  cellVerticalPadding: 3,
  headerIconSize: 18,
  headerFontStyle: "600 13px",
  baseFontStyle: "13px",
  markerFontStyle: "9px",
  fontFamily: "Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif",
  editorFontSize: "13px",
  lineHeight: 1.4,
  //unitless scaler depends on your font
  checkboxMaxSize: 18
};
function Xd() {
  return Yd;
}
const Kd = Bt.createContext(Yd);
function Zd() {
  return Bt.useContext(Kd);
}
function pr(e, ...t) {
  const n = { ...e };
  for (const r of t)
    if (r !== void 0)
      for (const i in r)
        r.hasOwnProperty(i) && (i === "bgCell" ? n[i] = $n(r[i], n[i]) : n[i] = r[i]);
  return (n.headerFontFull === void 0 || e.fontFamily !== n.fontFamily || e.headerFontStyle !== n.headerFontStyle) && (n.headerFontFull = `${n.headerFontStyle} ${n.fontFamily}`), (n.baseFontFull === void 0 || e.fontFamily !== n.fontFamily || e.baseFontStyle !== n.baseFontStyle) && (n.baseFontFull = `${n.baseFontStyle} ${n.fontFamily}`), (n.markerFontFull === void 0 || e.fontFamily !== n.fontFamily || e.markerFontStyle !== n.markerFontStyle) && (n.markerFontFull = `${n.markerFontStyle} ${n.fontFamily}`), n;
}
const Bs = 150;
function a0(e, t, n, r) {
  return r(t)?.measure?.(e, t, n) ?? Bs;
}
function Jd(e, t, n, r, i, o, s, a, l) {
  let u = 0;
  const c = i === void 0 ? [] : i.map((h) => {
    const p = a0(e, h[r], t, l);
    return u = Math.max(u, p), p;
  });
  if (c.length > 5 && a) {
    u = 0;
    let h = 0;
    for (const m of c)
      h += m;
    const p = h / c.length;
    for (let m = 0; m < c.length; m++)
      c[m] >= p * 2 ? c[m] = 0 : u = Math.max(u, c[m]);
  }
  const f = e.font;
  e.font = t.headerFontFull, u = Math.max(u, e.measureText(n.title).width + t.cellHorizontalPadding * 2 + (n.icon === void 0 ? 0 : 28)), e.font = f;
  const g = Math.max(Math.ceil(o), Math.min(Math.floor(s), Math.ceil(u)));
  return {
    ...n,
    width: g
  };
}
function s0(e, t, n, r, i, o, s, a, l) {
  const u = d.useRef(t), c = d.useRef(n), f = d.useRef(s);
  u.current = t, c.current = n, f.current = s;
  const [g, h] = d.useMemo(() => {
    if (typeof window > "u")
      return [null, null];
    const v = document.createElement("canvas");
    return v.style.display = "none", v.style.opacity = "0", v.style.position = "fixed", [v, v.getContext("2d", { alpha: !1 })];
  }, []);
  d.useLayoutEffect(() => (g && document.documentElement.append(g), () => {
    g?.remove();
  }), [g]);
  const p = d.useRef({}), m = d.useRef(), [w, b] = d.useState();
  return d.useLayoutEffect(() => {
    const v = c.current;
    if (v === void 0 || e.every(Bo))
      return;
    let C = Math.max(1, 10 - Math.floor(e.length / 1e4)), I = 0;
    C < u.current && C > 1 && (C--, I = 1);
    const E = {
      x: 0,
      y: 0,
      width: e.length,
      height: Math.min(u.current, C)
    }, R = {
      x: 0,
      y: u.current - 1,
      width: e.length,
      height: 1
    };
    (async () => {
      const x = v(E, l.signal), S = I > 0 ? v(R, l.signal) : void 0;
      let F;
      typeof x == "object" ? F = x : F = await uu(x), S !== void 0 && (typeof S == "object" ? F = [...F, ...S] : F = [...F, ...await uu(S)]), m.current = e, b(F);
    })();
  }, [l.signal, e]), d.useMemo(() => {
    let C = e.every(Bo) ? e : h === null ? e.map((P) => Bo(P) ? P : {
      ...P,
      width: Bs
    }) : (h.font = f.current.baseFontFull, e.map((P, x) => {
      if (Bo(P))
        return P;
      if (p.current[P.id] !== void 0)
        return {
          ...P,
          width: p.current[P.id]
        };
      if (w === void 0 || m.current !== e || P.id === void 0)
        return {
          ...P,
          width: Bs
        };
      const S = Jd(h, s, P, x, w, i, o, !0, a);
      return p.current[P.id] = S.width, S;
    })), I = 0, E = 0;
    const R = [];
    for (const [P, x] of C.entries())
      I += x.width, x.grow !== void 0 && x.grow > 0 && (E += x.grow, R.push(P));
    if (I < r && R.length > 0) {
      const P = [...C], x = r - I;
      let S = x;
      for (let F = 0; F < R.length; F++) {
        const D = R[F], M = (C[D].grow ?? 0) / E, T = F === R.length - 1 ? S : Math.min(S, Math.floor(x * M));
        P[D] = {
          ...C[D],
          growOffset: T,
          width: C[D].width + T
        }, S -= T;
      }
      C = P;
    }
    return {
      sizedColumns: C,
      nonGrowWidth: I
    };
  }, [r, e, h, w, s, i, o, a]);
}
var cs, Nu;
function l0() {
  if (Nu) return cs;
  Nu = 1;
  function e(t, n, r) {
    return t === t && (r !== void 0 && (t = t <= r ? t : r), n !== void 0 && (t = t >= n ? t : n)), t;
  }
  return cs = e, cs;
}
var ds, Bu;
function u0() {
  if (Bu) return ds;
  Bu = 1;
  var e = l0(), t = nd();
  function n(r, i, o) {
    return o === void 0 && (o = i, i = void 0), o !== void 0 && (o = t(o), o = o === o ? o : 0), i !== void 0 && (i = t(i), i = i === i ? i : 0), e(t(r), i, o);
  }
  return ds = n, ds;
}
var c0 = u0();
const jn = /* @__PURE__ */ vr(c0);
var fs, Wu;
function d0() {
  if (Wu) return fs;
  Wu = 1;
  function e() {
  }
  return fs = e, fs;
}
var hs, Uu;
function f0() {
  if (Uu) return hs;
  Uu = 1;
  var e = ng(), t = d0(), n = rd(), r = 1 / 0, i = e && 1 / n(new e([, -0]))[1] == r ? function(o) {
    return new e(o);
  } : t;
  return hs = i, hs;
}
var gs, ju;
function h0() {
  if (ju) return gs;
  ju = 1;
  var e = rg(), t = ig(), n = ag(), r = og(), i = f0(), o = rd(), s = 200;
  function a(l, u, c) {
    var f = -1, g = t, h = l.length, p = !0, m = [], w = m;
    if (c)
      p = !1, g = n;
    else if (h >= s) {
      var b = u ? null : i(l);
      if (b)
        return o(b);
      p = !1, g = r, w = new e();
    } else
      w = u ? [] : m;
    e:
      for (; ++f < h; ) {
        var v = l[f], C = u ? u(v) : v;
        if (v = c || v !== 0 ? v : 0, p && C === C) {
          for (var I = w.length; I--; )
            if (w[I] === C)
              continue e;
          u && w.push(C), m.push(v);
        } else g(w, C, c) || (w !== m && w.push(C), m.push(v));
      }
    return m;
  }
  return gs = a, gs;
}
var ps, qu;
function g0() {
  if (qu) return ps;
  qu = 1;
  var e = h0();
  function t(n) {
    return n && n.length ? e(n) : [];
  }
  return ps = t, ps;
}
var p0 = g0();
const m0 = /* @__PURE__ */ vr(p0);
var v0 = sg();
const Gu = /* @__PURE__ */ vr(v0), Wt = '<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">', b0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}<rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/><path d="M15.75 4h-1.5a.25.25 0 0 0-.177.074L9.308 8.838a3.75 3.75 0 1 0 1.854 1.854l1.155-1.157.967.322a.5.5 0 0 0 .65-.55l-.18-1.208.363-.363.727.331a.5.5 0 0 0 .69-.59l-.254-.904.647-.647A.25.25 0 0 0 16 5.75v-1.5a.25.25 0 0 0-.25-.25zM7.5 13.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z" fill="${t}"/></svg>`;
}, w0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}<rect x="2" y="2" width="16" height="16" rx="4" fill="${n}"/><path d="m12.223 13.314 3.052-2.826a.65.65 0 0 0 0-.984l-3.052-2.822c-.27-.25-.634-.242-.865.022-.232.263-.206.636.056.882l2.601 2.41-2.601 2.41c-.262.245-.288.619-.056.882.231.263.595.277.865.026Zm-4.444.005c.266.25.634.241.866-.027.231-.263.206-.636-.06-.882L5.983 10l2.602-2.405c.266-.25.291-.62.06-.887-.232-.263-.596-.272-.866-.022L4.723 9.51a.653.653 0 0 0 0 .983l3.056 2.827Z" fill="${t}"/></svg>`;
}, y0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
    <path d="M16.22 2H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.77-.8 1.77-1.78L18 3.78C18 2.8 17.2 2 16.22 2z" fill="${n}"/>
    <path d="M6.52 12.78H5.51V8.74l-1.33.47v-.87l2.29-.83h.05v5.27zm5.2 0H8.15v-.69l1.7-1.83a6.38 6.38 0 0 0 .34-.4c.09-.11.16-.22.22-.32s.1-.19.12-.27a.9.9 0 0 0 0-.56.63.63 0 0 0-.15-.23.58.58 0 0 0-.22-.15.75.75 0 0 0-.29-.05c-.27 0-.48.08-.62.23a.95.95 0 0 0-.2.65H8.03c0-.24.04-.46.13-.67a1.67 1.67 0 0 1 .97-.91c.23-.1.49-.14.77-.14.26 0 .5.04.7.11.21.08.38.18.52.32.14.13.25.3.32.48a1.74 1.74 0 0 1 .03 1.13 2.05 2.05 0 0 1-.24.47 4.16 4.16 0 0 1-.35.47l-.47.5-1 1.05h2.32v.8zm1.8-3.08h.55c.28 0 .48-.06.61-.2a.76.76 0 0 0 .2-.55.8.8 0 0 0-.05-.28.56.56 0 0 0-.13-.22.6.6 0 0 0-.23-.15.93.93 0 0 0-.32-.05.92.92 0 0 0-.29.05.72.72 0 0 0-.23.12.57.57 0 0 0-.21.46H12.4a1.3 1.3 0 0 1 .5-1.04c.15-.13.33-.23.54-.3a2.48 2.48 0 0 1 1.4 0c.2.06.4.15.55.28.15.13.27.28.36.47.08.19.13.4.13.65a1.15 1.15 0 0 1-.2.65 1.36 1.36 0 0 1-.58.49c.15.05.28.12.38.2a1.14 1.14 0 0 1 .43.62c.03.13.05.26.05.4 0 .25-.05.47-.14.66a1.42 1.42 0 0 1-.4.49c-.16.13-.35.23-.58.3a2.51 2.51 0 0 1-.73.1c-.22 0-.44-.03-.65-.09a1.8 1.8 0 0 1-.57-.28 1.43 1.43 0 0 1-.4-.47 1.41 1.41 0 0 1-.15-.66h1a.66.66 0 0 0 .22.5.87.87 0 0 0 .58.2c.25 0 .45-.07.6-.2a.71.71 0 0 0 .21-.56.97.97 0 0 0-.06-.36.61.61 0 0 0-.18-.25.74.74 0 0 0-.28-.15 1.33 1.33 0 0 0-.37-.04h-.55V9.7z" fill="${t}"/>
  </svg>`;
}, C0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <path d="M16.222 2H3.778C2.8 2 2 2.8 2 3.778v12.444C2 17.2 2.8 18 3.778 18h12.444c.978 0 1.77-.8 1.77-1.778L18 3.778C18 2.8 17.2 2 16.222 2z" fill="${n}"/>
  <path d="M8.182 12.4h3.636l.655 1.6H14l-3.454-8H9.455L6 14h1.527l.655-1.6zM10 7.44l1.36 3.651H8.64L10 7.441z" fill="${t}"/>
</svg>`;
}, S0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
    <path
        d="M16.2222 2H3.77778C2.8 2 2 2.8 2 3.77778V16.2222C2 17.2 2.8 18 3.77778 18H16.2222C17.2 18 17.9911 17.2 17.9911 16.2222L18 3.77778C18 2.8 17.2 2 16.2222 2Z"
        fill="${n}"
    />
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.66667 6.66669C5.73368 6.66669 4.16667 8.15907 4.16667 10C4.16667 11.841 5.73368 13.3334 7.66667 13.3334H12.3333C14.2663 13.3334 15.8333 11.841 15.8333 10C15.8333 8.15907 14.2663 6.66669 12.3333 6.66669H7.66667ZM12.5 12.5C13.8807 12.5 15 11.3807 15 10C15 8.61931 13.8807 7.50002 12.5 7.50002C11.1193 7.50002 10 8.61931 10 10C10 11.3807 11.1193 12.5 12.5 12.5Z"
        fill="${t}"
    />
</svg>`;
}, Qd = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
<path d="M16.222 2H3.778C2.8 2 2 2.8 2 3.778v12.444C2 17.2 2.8 18 3.778 18h12.444c.978 0 1.77-.8 1.77-1.778L18 3.778C18 2.8 17.2 2 16.222 2z" fill="${n}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.29 4.947a3.368 3.368 0 014.723.04 3.375 3.375 0 01.041 4.729l-.009.009-1.596 1.597a3.367 3.367 0 01-5.081-.364.71.71 0 011.136-.85 1.95 1.95 0 002.942.21l1.591-1.593a1.954 1.954 0 00-.027-2.733 1.95 1.95 0 00-2.732-.027l-.91.907a.709.709 0 11-1.001-1.007l.915-.911.007-.007z" fill="${t}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.55 8.678a3.368 3.368 0 015.082.364.71.71 0 01-1.136.85 1.95 1.95 0 00-2.942-.21l-1.591 1.593a1.954 1.954 0 00.027 2.733 1.95 1.95 0 002.73.028l.906-.906a.709.709 0 111.003 1.004l-.91.91-.008.01a3.368 3.368 0 01-4.724-.042 3.375 3.375 0 01-.041-4.728l.009-.009L6.55 8.678z" fill="${t}"/>
</svg>
  `;
}, x0 = (e) => {
  const t = e.bgColor;
  return `${Wt}
    <path stroke="${t}" stroke-width="2" d="M12 3v14"/>
    <path stroke="${t}" stroke-width="2" stroke-linecap="round" d="M10 4h4m-4 12h4"/>
    <path d="M11 14h4a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-4v2h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4v2ZM9.5 8H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4.5v2H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h4.5v2Z" fill="${t}"/>
  </svg>
`;
}, k0 = Qd, M0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <path d="M16.222 2H3.778C2.8 2 2 2.8 2 3.778v12.444C2 17.2 2.8 18 3.778 18h12.444c.978 0 1.77-.8 1.77-1.778L18 3.778C18 2.8 17.2 2 16.222 2z" fill="${n}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7 13.138a.5.5 0 00.748.434l5.492-3.138a.5.5 0 000-.868L7.748 6.427A.5.5 0 007 6.862v6.276z" fill="${t}"/>
</svg>`;
}, R0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <path d="M10 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 9.17A4.17 4.17 0 0 1 5.83 10 4.17 4.17 0 0 1 10 5.83 4.17 4.17 0 0 1 14.17 10 4.17 4.17 0 0 1 10 14.17z" fill="${t}"/>
    <path d="M8.33 8.21a.83.83 0 1 0-.03 1.67.83.83 0 0 0 .03-1.67zm3.34 0a.83.83 0 1 0-.04 1.67.83.83 0 0 0 .04-1.67z" fill="${t}"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.53 13.9a2.82 2.82 0 0 1-5.06 0l.77-.38a1.97 1.97 0 0 0 3.52 0l.77.39z" fill="${t}"/>
    <path d="M16.22 2H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.77-.8 1.77-1.78L18 3.78C18 2.8 17.2 2 16.22 2z" fill="${n}"/>
    <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 11a5 5 0 1 1 .01-10.01A5 5 0 0 1 10 15z" fill="${t}"/>
    <path d="M8 7.86a1 1 0 1 0-.04 2 1 1 0 0 0 .04-2zm4 0a1 1 0 1 0-.04 2 1 1 0 0 0 .04-2z" fill="${t}"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.53 11.9a2.82 2.82 0 0 1-5.06 0l.77-.38a1.97 1.97 0 0 0 3.52 0l.77.39z" fill="${t}"/>
  </svg>`;
}, E0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <path d="M16.222 2H3.778C2.8 2 2 2.8 2 3.778v12.444C2 17.2 2.8 18 3.778 18h12.444c.978 0 1.77-.8 1.77-1.778L18 3.778C18 2.8 17.2 2 16.222 2z" fill="${n}"/>
  <path opacity=".5" fill-rule="evenodd" clip-rule="evenodd" d="M12.499 10.801a.5.5 0 01.835 0l2.698 4.098a.5.5 0 01-.418.775H10.22a.5.5 0 01-.417-.775l2.697-4.098z" fill="${t}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.07 8.934a.5.5 0 01.824 0l4.08 5.958a.5.5 0 01-.412.782h-8.16a.5.5 0 01-.413-.782l4.08-5.958zM13.75 8.333a2.083 2.083 0 100-4.166 2.083 2.083 0 000 4.166z" fill="${t}"/>
</svg>`;
}, I0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <path fill="${t}" d="M3 3h14v14H3z"/>
    <path d="M16.22 2H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.77-.8 1.77-1.78L18 3.78C18 2.8 17.2 2 16.22 2zm-7.24 9.78h1.23c.15 0 .27.06.36.18l.98 1.28a.43.43 0 0 1-.05.58l-1.2 1.21a.45.45 0 0 1-.6.04A6.72 6.72 0 0 1 7.33 10c0-.61.1-1.2.25-1.78a6.68 6.68 0 0 1 2.12-3.3.44.44 0 0 1 .6.04l1.2 1.2c.16.17.18.42.05.59l-.98 1.29a.43.43 0 0 1-.36.17H8.98A5.38 5.38 0 0 0 8.67 10c0 .62.11 1.23.3 1.79z" fill="${n}"/>
  </svg>`;
}, T0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <path d="M16.22 2H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.77-.8 1.77-1.78L18 3.78C18 2.8 17.2 2 16.22 2z" fill="${n}"/>
    <path d="m13.49 13.15-2.32-3.27h1.4V7h1.86v2.88h1.4l-2.34 3.27zM11 13H9v-3l-1.5 1.92L6 10v3H4V7h2l1.5 2L9 7h2v6z" fill="${t}"/>
  </svg>`;
}, D0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <path d="M16.222 2H3.778C2.8 2 2 2.8 2 3.778v12.444C2 17.2 2.8 18 3.778 18h12.444c.978 0 1.77-.8 1.77-1.778L18 3.778C18 2.8 17.2 2 16.222 2z" fill="${n}"/>
  <path d="M14.8 4.182h-.6V3H13v1.182H7V3H5.8v1.182h-.6c-.66 0-1.2.532-1.2 1.182v9.454C4 15.468 4.54 16 5.2 16h9.6c.66 0 1.2-.532 1.2-1.182V5.364c0-.65-.54-1.182-1.2-1.182zm0 10.636H5.2V7.136h9.6v7.682z" fill="${t}"/>
</svg>`;
}, O0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <path d="M16.22 2H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.77-.8 1.77-1.78L18 3.78C18 2.8 17.2 2 16.22 2z" fill="${n}"/>
    <path d="M10 4a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6zm0 10.8A4.8 4.8 0 0 1 5.2 10a4.8 4.8 0 1 1 4.8 4.8z" fill="${t}"/>
    <path d="M10 7H9v3.93L12.5 13l.5-.8-3-1.76V7z" fill="${t}"/>
  </svg>`;
}, P0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10 8.643a1.357 1.357 0 100 2.714 1.357 1.357 0 000-2.714zM7.357 10a2.643 2.643 0 115.286 0 2.643 2.643 0 01-5.286 0z" fill="${t}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.589 4.898A5.643 5.643 0 0115.643 10v.5a2.143 2.143 0 01-4.286 0V8a.643.643 0 011.286 0v2.5a.857.857 0 001.714 0V10a4.357 4.357 0 10-1.708 3.46.643.643 0 01.782 1.02 5.643 5.643 0 11-5.842-9.582z" fill="${t}"/>
</svg>`;
}, L0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <rect x="2" y="8" width="10" height="8" rx="2" fill="${n}"/>
    <rect x="8" y="4" width="10" height="8" rx="2" fill="${n}"/>
    <path d="M10.68 7.73V6l2.97 3.02-2.97 3.02v-1.77c-2.13 0-3.62.7-4.68 2.2.43-2.15 1.7-4.31 4.68-4.74z" fill="${t}"/>
  </svg>`;
}, F0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <path fill="${t}" d="M4 3h12v14H4z"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.6 2A1.6 1.6 0 002 3.6v12.8A1.6 1.6 0 003.6 18h12.8a1.6 1.6 0 001.6-1.6V3.6A1.6 1.6 0 0016.4 2H3.6zm11.3 10.8a.7.7 0 01.7.7v1.4a.7.7 0 01-.7.7h-1.4a.7.7 0 01-.7-.7v-1.4a.7.7 0 01.6-.693.117.117 0 00.1-.115V10.35a.117.117 0 00-.117-.116h-2.8a.117.117 0 00-.117.116v2.333c0 .064.053.117.117.117h.117a.7.7 0 01.7.7v1.4a.7.7 0 01-.7.7H9.3a.7.7 0 01-.7-.7v-1.4a.7.7 0 01.7-.7h.117a.117.117 0 00.117-.117V10.35a.117.117 0 00-.117-.117h-2.8a.117.117 0 00-.117.117v2.342c0 .058.042.106.1.115a.7.7 0 01.6.693v1.4a.7.7 0 01-.7.7H5.1a.7.7 0 01-.7-.7v-1.4a.7.7 0 01.7-.7h.35a.116.116 0 00.116-.117v-2.45c0-.515.418-.933.934-.933h2.917a.117.117 0 00.117-.117V6.85a.117.117 0 00-.117-.116h-2.45a.7.7 0 01-.7-.7V5.1a.7.7 0 01.7-.7h6.067a.7.7 0 01.7.7v.934a.7.7 0 01-.7.7h-2.45a.117.117 0 00-.118.116v2.333c0 .064.053.117.117.117H13.5c.516 0 .934.418.934.934v2.45c0 .063.052.116.116.116h.35z" fill="${n}"/>
</svg>`;
}, _0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/>
    <path d="M9.98 13.33c.45 0 .74-.3.73-.75l-.01-.1-.16-1.67 1.45 1.05a.81.81 0 0 0 .5.18c.37 0 .72-.32.72-.76 0-.3-.17-.54-.49-.68l-1.63-.77 1.63-.77c.32-.14.49-.37.49-.67 0-.45-.34-.76-.71-.76a.81.81 0 0 0-.5.18l-1.47 1.03.16-1.74.01-.08c.01-.46-.27-.76-.72-.76-.46 0-.76.32-.75.76l.01.08.16 1.74-1.47-1.03a.77.77 0 0 0-.5-.18.74.74 0 0 0-.72.76c0 .3.17.53.49.67l1.63.77-1.62.77c-.32.14-.5.37-.5.68 0 .44.35.75.72.75a.78.78 0 0 0 .5-.17L9.4 10.8l-.16 1.68v.09c-.02.44.28.75.74.75z" fill="${t}"/>
  </svg>`;
}, A0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/>
    <path d="M8 5.83H5.83a.83.83 0 0 0 0 1.67h1.69A4.55 4.55 0 0 1 8 5.83zm-.33 3.34H5.83a.83.83 0 0 0 0 1.66h2.72a4.57 4.57 0 0 1-.88-1.66zM5.83 12.5a.83.83 0 0 0 0 1.67h7.5a.83.83 0 1 0 0-1.67h-7.5zm8.8-2.9a3.02 3.02 0 0 0 .46-1.6c0-1.66-1.32-3-2.94-3C10.52 5 9.2 6.34 9.2 8s1.31 3 2.93 3c.58 0 1.11-.17 1.56-.47l2.04 2.08.93-.94-2.04-2.08zm-2.48.07c-.9 0-1.63-.75-1.63-1.67s.73-1.67 1.63-1.67c.9 0 1.63.75 1.63 1.67s-.73 1.67-1.63 1.67z" fill="${t}"/>
  </svg>`;
}, H0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/>
  <path d="M7.676 4.726V3l2.976 3.021-2.976 3.022v-1.77c-2.125 0-3.613.69-4.676 2.201.425-2.158 1.7-4.316 4.676-4.748zM10.182 14.4h3.636l.655 1.6H16l-3.454-8h-1.091L8 16h1.527l.655-1.6zM12 9.44l1.36 3.65h-2.72L12 9.44z" fill="${t}"/>
</svg>`;
}, z0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.167 5.417a.833.833 0 100 1.666h4.166a.833.833 0 100-1.666H4.167z" fill="${t}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.083 4.167a.833.833 0 10-1.666 0v4.166a.833.833 0 101.666 0V4.167zM11.667 5.417a.833.833 0 100 1.666h4.166a.833.833 0 100-1.666h-4.166zM5.367 11.688a.833.833 0 00-1.179 1.179l2.947 2.946a.833.833 0 001.178-1.178l-2.946-2.947z" fill="${t}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.313 12.867a.833.833 0 10-1.178-1.179l-2.947 2.947a.833.833 0 101.179 1.178l2.946-2.946z" fill="${t}"/>
  <path d="M10.833 12.5c0-.46.373-.833.834-.833h4.166a.833.833 0 110 1.666h-4.166a.833.833 0 01-.834-.833zM10.833 15c0-.46.373-.833.834-.833h4.166a.833.833 0 110 1.666h-4.166a.833.833 0 01-.834-.833z" fill="${t}"/>
</svg>`;
}, V0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <path d="M16.22 2H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.77-.8 1.77-1.78L18 3.78C18 2.8 17.2 2 16.22 2z" fill="${n}"/>
    <path d="M10 8.84a1.16 1.16 0 1 0 0 2.32 1.16 1.16 0 0 0 0-2.32zm3.02 3.61a3.92 3.92 0 0 0 .78-3.28.49.49 0 1 0-.95.2c.19.87-.02 1.78-.58 2.47a2.92 2.92 0 1 1-4.13-4.08 2.94 2.94 0 0 1 2.43-.62.49.49 0 1 0 .17-.96 3.89 3.89 0 1 0 2.28 6.27zM10 4.17a5.84 5.84 0 0 0-5.44 7.93.49.49 0 1 0 .9-.35 4.86 4.86 0 1 1 2.5 2.67.49.49 0 1 0-.4.88c.76.35 1.6.54 2.44.53a5.83 5.83 0 0 0 0-11.66zm3.02 3.5a.7.7 0 1 0-1.4 0 .7.7 0 0 0 1.4 0zm-6.97 5.35a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4z" fill="${t}"/>
  </svg>`;
}, $0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/>
  <path d="M12.4 13.565c1.865-.545 3.645-2.083 3.645-4.396 0-1.514-.787-2.604-2.071-2.604C12.69 6.565 12 7.63 12 8.939c1.114.072 1.865.726 1.865 1.683 0 .933-.8 1.647-1.84 2.023l.375.92zM4 5h6v2H4zM4 9h5v2H4zM4 13h4v2H4z" fill="${t}"/>
</svg>`;
}, N0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `
    ${Wt}
    <rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/>
    <path d="M12.4 13.56c1.86-.54 3.65-2.08 3.65-4.4 0-1.5-.8-2.6-2.08-2.6S12 7.64 12 8.95c1.11.07 1.86.73 1.86 1.68 0 .94-.8 1.65-1.83 2.03l.37.91zM4 5h6v2H4zm0 4h5v2H4zm0 4h4v2H4z" fill="${t}"/>
  </svg>`;
}, B0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <path d="M16.222 2H3.778C2.8 2 2 2.8 2 3.778v12.444C2 17.2 2.8 18 3.778 18h12.444c.978 0 1.77-.8 1.77-1.778L18 3.778C18 2.8 17.2 2 16.222 2z" fill="${n}"/>
  <path d="M10 7a1 1 0 100-2v2zm0 6a1 1 0 100 2v-2zm0-8H7v2h3V5zm-3 6h5V9H7v2zm5 2h-2v2h2v-2zm1-1a1 1 0 01-1 1v2a3 3 0 003-3h-2zm-1-1a1 1 0 011 1h2a3 3 0 00-3-3v2zM4 8a3 3 0 003 3V9a1 1 0 01-1-1H4zm3-3a3 3 0 00-3 3h2a1 1 0 011-1V5z" fill="${t}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.856 12.014a.5.5 0 00-.712.702L5.409 14l-1.265 1.284a.5.5 0 00.712.702l1.255-1.274 1.255 1.274a.5.5 0 00.712-.702L6.813 14l1.265-1.284a.5.5 0 00-.712-.702L6.11 13.288l-1.255-1.274zM12.856 4.014a.5.5 0 00-.712.702L13.409 6l-1.265 1.284a.5.5 0 10.712.702l1.255-1.274 1.255 1.274a.5.5 0 10.712-.702L14.813 6l1.265-1.284a.5.5 0 00-.712-.702L14.11 5.288l-1.255-1.274z" fill="${t}"/>
</svg>`;
}, W0 = (e) => {
  const t = e.fgColor, n = e.bgColor;
  return `${Wt}
  <rect x="2" y="2" width="16" height="16" rx="2" fill="${n}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.25 7.25a.75.75 0 000-1.5h-6.5a.75.75 0 100 1.5h6.5zM15 10a.75.75 0 01-.75.75h-6.5a.75.75 0 010-1.5h6.5A.75.75 0 0115 10zm-.75 4.25a.75.75 0 000-1.5h-6.5a.75.75 0 000 1.5h6.5zm-8.987-7a.75.75 0 100-1.5.75.75 0 000 1.5zm.75 2.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-.75 4.25a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="${t}"/>
</svg>`;
}, U0 = (e) => {
  const t = e.fgColor;
  return `
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 15v1h14v-2.5c0-.87-.44-1.55-.98-2.04a6.19 6.19 0 0 0-1.9-1.14 12.1 12.1 0 0 0-2.48-.67A4 4 0 1 0 5 6a4 4 0 0 0 2.36 3.65c-.82.13-1.7.36-2.48.67-.69.28-1.37.65-1.9 1.13A2.8 2.8 0 0 0 2 13.5V15z" fill="${e.bgColor}" stroke="${t}" stroke-width="2"/>
  </svg>`;
}, j0 = (e) => {
  const t = e.fgColor;
  return `
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.43 6.04v-.18a3.86 3.86 0 0 0-7.72 0v.18A2.15 2.15 0 0 0 3 8.14v5.72C3 15.04 3.96 16 5.14 16H12c1.18 0 2.14-.96 2.14-2.14V8.14c0-1.03-.73-1.9-1.71-2.1zM7.86 6v-.14a.71.71 0 1 1 1.43 0V6H7.86z" fill="${e.bgColor}" stroke="${t}" stroke-width="2"/>
  </svg>
`;
}, q0 = {
  headerRowID: b0,
  headerNumber: y0,
  headerCode: w0,
  headerString: C0,
  headerBoolean: S0,
  headerAudioUri: k0,
  headerVideoUri: M0,
  headerEmoji: R0,
  headerImage: E0,
  headerUri: Qd,
  headerPhone: I0,
  headerMarkdown: T0,
  headerDate: D0,
  headerTime: O0,
  headerEmail: P0,
  headerReference: L0,
  headerIfThenElse: F0,
  headerSingleValue: _0,
  headerLookup: A0,
  headerTextTemplate: H0,
  headerMath: z0,
  headerRollup: V0,
  headerJoinStrings: $0,
  headerSplitString: N0,
  headerGeoDistance: B0,
  headerArray: W0,
  rowOwnerOverlay: U0,
  protectedColumnOverlay: j0,
  renameIcon: x0
};
function G0(e, t) {
  return e === "normal" ? [t.bgIconHeader, t.fgIconHeader] : e === "selected" ? ["white", t.accentColor] : [t.accentColor, t.bgHeader];
}
class Y0 {
  onSettled;
  spriteMap = /* @__PURE__ */ new Map();
  headerIcons;
  inFlight = 0;
  constructor(t, n) {
    this.onSettled = n, this.headerIcons = t ?? {};
  }
  drawSprite(t, n, r, i, o, s, a, l = 1) {
    const [u, c] = G0(n, a), f = s * Math.ceil(window.devicePixelRatio), g = `${u}_${c}_${f}_${t}`;
    let h = this.spriteMap.get(g);
    if (h === void 0) {
      const p = this.headerIcons[t];
      if (p === void 0)
        return;
      h = document.createElement("canvas");
      const m = h.getContext("2d");
      if (m === null)
        return;
      const w = new Image();
      w.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(p({ fgColor: c, bgColor: u }))}`, this.spriteMap.set(g, h);
      const b = w.decode();
      if (b === void 0)
        return;
      this.inFlight++, b.then(() => {
        m.drawImage(w, 0, 0, f, f);
      }).finally(() => {
        this.inFlight--, this.inFlight === 0 && this.onSettled();
      });
    } else
      l < 1 && (r.globalAlpha = l), r.drawImage(h, 0, 0, f, f, i, o, s, s), l < 1 && (r.globalAlpha = 1);
  }
}
function ef(e) {
  if (e.length === 0)
    return;
  let t;
  for (const n of e)
    t = Math.min(t ?? n.y, n.y);
  return t;
}
function Da(e, t, n, r, i, o, s, a, l) {
  a = a ?? t;
  let u = t, c = e;
  const f = r - o;
  let g = !1;
  for (; u < n && c < f; ) {
    const h = i(c);
    if (u + h > a && l(u, c, h, !1, s && c === r - 1) === !0) {
      g = !0;
      break;
    }
    u += h, c++;
  }
  if (!g) {
    u = n;
    for (let h = 0; h < o; h++) {
      c = r - 1 - h;
      const p = i(c);
      u -= p, l(u, c, p, !0, s && c === r - 1);
    }
  }
}
function Fr(e, t, n, r, i, o) {
  let s = 0, a = 0;
  const l = i + r;
  for (const u of e) {
    const c = u.sticky ? a : s + n;
    if (o(u, c, l, u.sticky ? 0 : a, t) === !0)
      break;
    s += u.width, a += u.sticky ? u.width : 0;
  }
}
function tf(e, t, n, r, i) {
  let o = 0, s = 0;
  for (let a = 0; a < e.length; a++) {
    const l = e[a];
    let u = a + 1, c = l.width;
    for (l.sticky && (s += c); u < e.length && vo(e[u].group, l.group) && e[u].sticky === e[a].sticky; ) {
      const m = e[u];
      c += m.width, u++, a++, m.sticky && (s += m.width);
    }
    const f = l.sticky ? 0 : n, g = o + f, h = l.sticky ? 0 : Math.max(0, s - g), p = Math.min(c - h, t - (g + h));
    i([l.sourceIndex, e[u - 1].sourceIndex], l.group ?? "", g + h, 0, p, r), o += c;
  }
}
function nf(e, t, n, r, i, o, s) {
  const [a, l] = e;
  let u, c;
  const f = s.find((g) => !g.sticky)?.sourceIndex ?? 0;
  if (l > f) {
    const g = Math.max(a, f);
    let h = t, p = r;
    for (let m = o.sourceIndex - 1; m >= g; m--)
      h -= s[m].width, p += s[m].width;
    for (let m = o.sourceIndex + 1; m <= l; m++)
      p += s[m].width;
    c = {
      x: h,
      y: n,
      width: p,
      height: i
    };
  }
  if (f > a) {
    const g = Math.min(l, f - 1);
    let h = t, p = r;
    for (let m = o.sourceIndex - 1; m >= a; m--)
      h -= s[m].width, p += s[m].width;
    for (let m = o.sourceIndex + 1; m <= g; m++)
      p += s[m].width;
    u = {
      x: h,
      y: n,
      width: p,
      height: i
    };
  }
  return [u, c];
}
function X0(e, t, n, r) {
  if (r === "any")
    return rf(e, { x: t, y: n, width: 1, height: 1 });
  if (r === "vertical" && (t = e.x), r === "horizontal" && (n = e.y), $d([t, n], e))
    return;
  const i = t - e.x, o = e.x + e.width - t, s = n - e.y + 1, a = e.y + e.height - n, l = Math.min(r === "vertical" ? Number.MAX_SAFE_INTEGER : i, r === "vertical" ? Number.MAX_SAFE_INTEGER : o, r === "horizontal" ? Number.MAX_SAFE_INTEGER : s, r === "horizontal" ? Number.MAX_SAFE_INTEGER : a);
  return l === a ? { x: e.x, y: e.y + e.height, width: e.width, height: n - e.y - e.height + 1 } : l === s ? { x: e.x, y: n, width: e.width, height: e.y - n } : l === o ? { x: e.x + e.width, y: e.y, width: t - e.x - e.width + 1, height: e.height } : { x: t, y: e.y, width: e.x - t, height: e.height };
}
function bo(e, t, n, r, i, o, s, a) {
  return e <= i + s && i <= e + n && t <= o + a && o <= t + r;
}
function Zr(e, t, n) {
  return t >= e.x && t <= e.x + e.width && n >= e.y && n <= e.y + e.height;
}
function rf(e, t) {
  const n = Math.min(e.x, t.x), r = Math.min(e.y, t.y), i = Math.max(e.x + e.width, t.x + t.width) - n, o = Math.max(e.y + e.height, t.y + t.height) - r;
  return { x: n, y: r, width: i, height: o };
}
function K0(e, t) {
  return e.x <= t.x && e.y <= t.y && e.x + e.width >= t.x + t.width && e.y + e.height >= t.y + t.height;
}
function Z0(e, t, n, r) {
  if (e.x > t || e.y > n || e.x < 0 && e.y < 0 && e.x + e.width > t && e.y + e.height > n)
    return;
  if (e.x >= 0 && e.y >= 0 && e.x + e.width <= t && e.y + e.height <= n)
    return e;
  const i = -4, o = -4, s = t + 4, a = n + 4, l = i - e.x, u = e.x + e.width - s, c = o - e.y, f = e.y + e.height - a, g = l > 0 ? e.x + Math.floor(l / r) * r : e.x, h = u > 0 ? e.x + e.width - Math.floor(u / r) * r : e.x + e.width, p = c > 0 ? e.y + Math.floor(c / r) * r : e.y, m = f > 0 ? e.y + e.height - Math.floor(f / r) * r : e.y + e.height;
  return { x: g, y: p, width: h - g, height: m - p };
}
function J0(e, t, n, r, i) {
  const [o, s, a, l] = t, [u, c, f, g] = i, { x: h, y: p, width: m, height: w } = e, b = [];
  if (m <= 0 || w <= 0)
    return b;
  const v = h + m, C = p + w, I = h < o, E = p < s, R = h + m > a, P = p + w > l, x = h >= o && h < a || v > o && v <= a || h < o && v > a, S = p >= s && p < l || C > s && C <= l || p < s && C > l;
  if (x && S) {
    const D = Math.max(h, o), M = Math.max(p, s), T = Math.min(v, a), O = Math.min(C, l);
    b.push({
      rect: { x: D, y: M, width: T - D, height: O - M },
      clip: {
        x: u,
        y: c,
        width: f - u + 1,
        height: g - c + 1
      }
    });
  }
  if (I && E) {
    const D = h, M = p, T = Math.min(v, o), O = Math.min(C, s);
    b.push({
      rect: {
        x: D,
        y: M,
        width: T - D,
        height: O - M
      },
      clip: {
        x: 0,
        y: 0,
        width: u + 1,
        height: c + 1
      }
    });
  }
  if (E && x) {
    const D = Math.max(h, o), M = p, T = Math.min(v, a), O = Math.min(C, s);
    b.push({
      rect: {
        x: D,
        y: M,
        width: T - D,
        height: O - M
      },
      clip: {
        x: u,
        y: 0,
        width: f - u + 1,
        height: c + 1
      }
    });
  }
  if (E && R) {
    const D = Math.max(h, a), M = p, T = v, O = Math.min(C, s);
    b.push({
      rect: {
        x: D,
        y: M,
        width: T - D,
        height: O - M
      },
      clip: {
        x: f,
        y: 0,
        width: n - f + 1,
        height: c + 1
      }
    });
  }
  if (I && S) {
    const D = h, M = Math.max(p, s), T = Math.min(v, o), O = Math.min(C, l);
    b.push({
      rect: {
        x: D,
        y: M,
        width: T - D,
        height: O - M
      },
      clip: {
        x: 0,
        y: c,
        width: u + 1,
        height: g - c + 1
      }
    });
  }
  if (R && S) {
    const D = Math.max(h, a), M = Math.max(p, s), T = v, O = Math.min(C, l);
    b.push({
      rect: {
        x: D,
        y: M,
        width: T - D,
        height: O - M
      },
      clip: {
        x: f,
        y: c,
        width: n - f + 1,
        height: g - c + 1
      }
    });
  }
  if (I && P) {
    const D = h, M = Math.max(p, l), T = Math.min(v, o), O = C;
    b.push({
      rect: {
        x: D,
        y: M,
        width: T - D,
        height: O - M
      },
      clip: {
        x: 0,
        y: g,
        width: u + 1,
        height: r - g + 1
      }
    });
  }
  if (P && x) {
    const D = Math.max(h, o), M = Math.max(p, l), T = Math.min(v, a), O = C;
    b.push({
      rect: {
        x: D,
        y: M,
        width: T - D,
        height: O - M
      },
      clip: {
        x: u,
        y: g,
        width: f - u + 1,
        height: r - g + 1
      }
    });
  }
  if (R && P) {
    const D = Math.max(h, a), M = Math.max(p, l), T = v, O = C;
    b.push({
      rect: {
        x: D,
        y: M,
        width: T - D,
        height: O - M
      },
      clip: {
        x: f,
        y: g,
        width: n - f + 1,
        height: r - g + 1
      }
    });
  }
  return b;
}
const Q0 = {
  kind: Z.Loading,
  allowOverlay: !1
};
function Yu(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m, w, b, v, C, I, E, R, P, x, S, F, D, M, T, O, k, N, q, Y) {
  let ue = C?.size ?? Number.MAX_SAFE_INTEGER;
  const ee = performance.now();
  let te = T.baseFontFull;
  e.font = te;
  const ce = { ctx: e }, le = [0, 0], he = w > 0 ? ni(l, w, u) : 0;
  let de, ie;
  const H = ef(v);
  return Fr(t, a, o, s, i, (L, G, ne, oe, xe) => {
    const ve = Math.max(0, oe - G), et = G + ve, ke = i + 1, bt = L.width - ve, St = r - i - 1;
    if (v.length > 0) {
      let $e = !1;
      for (let _e = 0; _e < v.length; _e++) {
        const tt = v[_e];
        if (bo(et, ke, bt, St, tt.x, tt.y, tt.width, tt.height)) {
          $e = !0;
          break;
        }
      }
      if (!$e)
        return;
    }
    const Ue = () => {
      e.save(), e.beginPath(), e.rect(et, ke, bt, St), e.clip();
    }, re = I.columns.hasIndex(L.sourceIndex), se = f(L.group ?? "").overrideTheme, we = L.themeOverride === void 0 && se === void 0 ? T : pr(T, se, L.themeOverride), fe = we.baseFontFull;
    fe !== te && (te = fe, e.font = fe), Ue();
    let ye;
    return Da(xe, ne, r, l, u, w, b, H, ($e, _e, tt, Re, qe) => {
      if (_e < 0 || (le[0] = L.sourceIndex, le[1] = _e, C !== void 0 && !C.has(le)))
        return;
      if (v.length > 0) {
        let Oe = !1;
        for (let ct = 0; ct < v.length; ct++) {
          const pt = v[ct];
          if (bo(G, $e, L.width, tt, pt.x, pt.y, pt.width, pt.height)) {
            Oe = !0;
            break;
          }
        }
        if (!Oe)
          return;
      }
      const De = I.rows.hasIndex(_e), Ie = h.hasIndex(_e), Le = _e < l ? c(le) : Q0;
      let ht = G, nt = L.width, Xe = !1, kt = !1;
      if (Le.span !== void 0) {
        const [Oe, ct] = Le.span, pt = `${_e},${Oe},${ct},${L.sticky}`;
        if (ie === void 0 && (ie = /* @__PURE__ */ new Set()), ie.has(pt)) {
          ue--;
          return;
        } else {
          const Pn = nf(Le.span, G, $e, L.width, tt, L, n), un = L.sticky ? Pn[0] : Pn[1];
          if (!L.sticky && Pn[0] !== void 0 && (kt = !0), un !== void 0) {
            ht = un.x, nt = un.width, ie.add(pt), e.restore(), ye = void 0, e.save(), e.beginPath();
            const cn = Math.max(0, oe - un.x);
            e.rect(un.x + cn, $e, un.width - cn, tt), de === void 0 && (de = []), de.push({
              x: un.x + cn,
              y: $e,
              width: un.width - cn,
              height: tt
            }), e.clip(), Xe = !0;
          }
        }
      }
      const wt = g?.(_e), Ot = qe && L.trailingRowOptions?.themeOverride !== void 0 ? L.trailingRowOptions?.themeOverride : void 0, Pt = Le.themeOverride === void 0 && wt === void 0 && Ot === void 0 ? we : pr(we, wt, Ot, Le.themeOverride);
      e.beginPath();
      const ln = qm(le, Le, I);
      let Jt = Gm(le, Le, I, m);
      const Dn = Le.span !== void 0 && I.columns.some(
        (Oe) => Le.span !== void 0 && Oe >= Le.span[0] && Oe <= Le.span[1]
        //alloc
      );
      ln && !p && m ? Jt = 0 : ln && m && (Jt = Math.max(Jt, 1)), Dn && Jt++, ln || (De && Jt++, re && !qe && Jt++);
      const Tt = Le.kind === Z.Protected ? Pt.bgCellMedium : Pt.bgCell;
      let gt;
      if ((Re || Tt !== T.bgCell) && (gt = $n(Tt, gt)), Jt > 0 || Ie) {
        Ie && (gt = $n(Pt.bgHeader, gt));
        for (let Oe = 0; Oe < Jt; Oe++)
          gt = $n(Pt.accentLight, gt);
      } else if (E !== void 0) {
        for (const Oe of E)
          if (Oe[0] === L.sourceIndex && Oe[1] === _e) {
            gt = $n(Pt.bgSearchResult, gt);
            break;
          }
      }
      if (R !== void 0)
        for (let Oe = 0; Oe < R.length; Oe++) {
          const ct = R[Oe], pt = ct.range;
          ct.style !== "solid-outline" && pt.x <= L.sourceIndex && L.sourceIndex < pt.x + pt.width && pt.y <= _e && _e < pt.y + pt.height && (gt = $n(ct.color, gt));
        }
      let On = !1;
      if (C !== void 0) {
        const Oe = $e + 1, pt = (Re ? Oe + tt - 1 : Math.min(Oe + tt - 1, r - he)) - Oe;
        (pt !== tt - 1 || ht + 1 <= oe) && (On = !0, e.save(), e.beginPath(), e.rect(ht + 1, Oe, nt - 1, pt), e.clip()), gt = gt === void 0 ? Pt.bgCell : $n(gt, Pt.bgCell);
      }
      const yt = L.sourceIndex === n.length - 1, Qt = _e === l - 1;
      gt !== void 0 && (e.fillStyle = gt, ye !== void 0 && (ye.fillStyle = gt), C !== void 0 ? e.fillRect(ht + 1, $e + 1, nt - (yt ? 2 : 1), tt - (Qt ? 2 : 1)) : e.fillRect(ht, $e, nt, tt)), Le.style === "faded" && (e.globalAlpha = 0.6);
      let kn;
      for (let Oe = 0; Oe < S.length; Oe++) {
        const ct = S[Oe];
        if (ct.item[0] === L.sourceIndex && ct.item[1] === _e) {
          kn = ct;
          break;
        }
      }
      if (nt > Y && !kt) {
        const Oe = Pt.baseFontFull;
        Oe !== te && (e.font = Oe, te = Oe), ye = of(e, Le, L.sourceIndex, _e, yt, Qt, ht, $e, nt, tt, Jt > 0, Pt, gt ?? Pt.bgCell, P, x, kn?.hoverAmount ?? 0, F, M, ee, D, ye, O, k, N, q);
      }
      return On && e.restore(), Le.style === "faded" && (e.globalAlpha = 1), ue--, Xe && (e.restore(), ye?.deprep?.(ce), ye = void 0, Ue(), te = fe, e.font = fe), ue <= 0;
    }), e.restore(), ue <= 0;
  }), de;
}
const to = [0, 0], no = { x: 0, y: 0, width: 0, height: 0 }, ms = [void 0, () => {
}];
let Ws = !1;
function ev() {
  Ws = !0;
}
function of(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m, w, b, v, C, I, E, R, P, x) {
  let S, F;
  w !== void 0 && w[0][0] === n && w[0][1] === r && (S = w[1][0], F = w[1][1]);
  let D;
  to[0] = n, to[1] = r, no.x = s, no.y = a, no.width = l, no.height = u, ms[0] = R.getValue(to), ms[1] = (k) => R.setValue(to, k), Ws = !1;
  const M = {
    //alloc
    ctx: e,
    theme: f,
    col: n,
    row: r,
    cell: t,
    rect: no,
    highlighted: c,
    cellFillColor: g,
    hoverAmount: m,
    frameTime: v,
    hoverX: S,
    drawState: ms,
    hoverY: F,
    imageLoader: h,
    spriteManager: p,
    hyperWrapping: b,
    overrideCursor: S !== void 0 ? x : void 0,
    requestAnimationFrame: ev
  }, T = Qm(M, t.lastUpdated, v, I, i, o), O = P(t);
  if (O !== void 0) {
    I?.renderer !== O && (I?.deprep?.(M), I = void 0);
    const k = O.drawPrep?.(M, I);
    C !== void 0 && !Ii(M.cell) ? C(M, () => O.draw(M, t)) : O.draw(M, t), D = k === void 0 ? void 0 : {
      deprep: k?.deprep,
      fillStyle: k?.fillStyle,
      font: k?.font,
      renderer: O
    };
  }
  return (T || Ws) && E?.(to), D;
}
function dl(e, t, n, r, i, o, s, a, l = -20, u = -20, c = void 0, f = "center", g = "square") {
  const h = Math.floor(i + s / 2), p = g === "circle" ? 1e4 : t.roundingRadius ?? 4;
  let m = Dd(c ?? t.checkboxMaxSize, s, t.cellVerticalPadding), w = m / 2;
  const b = Td(f, r, o, t.cellHorizontalPadding, m), v = Id(b, h, m), C = Od(r + l, i + u, v);
  switch (n) {
    case !0: {
      e.beginPath(), er(e, b - m / 2, h - m / 2, m, m, p), g === "circle" && (w *= 0.8, m *= 0.8), e.fillStyle = a ? t.accentColor : t.textMedium, e.fill(), e.beginPath(), e.moveTo(b - w + m / 4.23, h - w + m / 1.97), e.lineTo(b - w + m / 2.42, h - w + m / 1.44), e.lineTo(b - w + m / 1.29, h - w + m / 3.25), e.strokeStyle = t.bgCell, e.lineJoin = "round", e.lineCap = "round", e.lineWidth = 1.9, e.stroke();
      break;
    }
    case da:
    case !1: {
      e.beginPath(), er(e, b - m / 2 + 0.5, h - m / 2 + 0.5, m - 1, m - 1, p), e.lineWidth = 1, e.strokeStyle = C ? t.textDark : t.textMedium, e.stroke();
      break;
    }
    case Qs: {
      e.beginPath(), er(e, b - m / 2, h - m / 2, m, m, p), e.fillStyle = C ? t.textMedium : t.textLight, e.fill(), g === "circle" && (w *= 0.8, m *= 0.8), e.beginPath(), e.moveTo(b - m / 3, h), e.lineTo(b + m / 3, h), e.strokeStyle = t.bgCell, e.lineCap = "round", e.lineWidth = 1.9, e.stroke();
      break;
    }
    default:
      po();
  }
}
function tv(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m, w, b, v) {
  const C = s + a;
  if (C <= 0)
    return;
  e.fillStyle = f.bgHeader, e.fillRect(0, 0, i, C);
  const I = r?.[0]?.[0], E = r?.[0]?.[1], R = r?.[1]?.[0], P = r?.[1]?.[1], x = f.headerFontFull;
  e.font = x, Fr(t, 0, o, 0, C, (S, F, D, M) => {
    if (w !== void 0 && !w.has([S.sourceIndex, -1]))
      return;
    const T = Math.max(0, M - F);
    e.save(), e.beginPath(), e.rect(F + T, a, S.width - T, s), e.clip();
    const O = m(S.group ?? "").overrideTheme, k = S.themeOverride === void 0 && O === void 0 ? f : pr(f, O, S.themeOverride);
    k.bgHeader !== f.bgHeader && (e.fillStyle = k.bgHeader, e.fill()), k !== f && (e.font = k.headerFontFull);
    const N = c.columns.hasIndex(S.sourceIndex), q = l !== void 0 || u || S.headerRowMarkerDisabled === !0, Y = !q && E === -1 && I === S.sourceIndex, ue = q ? 0 : h.find((he) => he.item[0] === S.sourceIndex && he.item[1] === -1)?.hoverAmount ?? 0, ee = c?.current !== void 0 && c.current.cell[0] === S.sourceIndex, te = N ? k.accentColor : ee ? k.bgHeaderHasFocus : k.bgHeader, ce = n ? a : 0, le = S.sourceIndex === 0 ? 0 : 1;
    N ? (e.fillStyle = te, e.fillRect(F + le, ce, S.width - le, s)) : (ee || ue > 0) && (e.beginPath(), e.rect(F + le, ce, S.width - le, s), ee && (e.fillStyle = k.bgHeaderHasFocus, e.fill()), ue > 0 && (e.globalAlpha = ue, e.fillStyle = k.bgHeaderHovered, e.fill(), e.globalAlpha = 1)), lf(e, F, ce, S.width, s, S, N, k, Y, Y ? R : void 0, Y ? P : void 0, ee, ue, g, b, v), e.restore();
  }), n && nv(e, t, i, o, a, r, f, g, h, p, m, w);
}
function nv(e, t, n, r, i, o, s, a, l, u, c, f) {
  const [h, p] = o?.[0] ?? [];
  let m = 0;
  tf(t, n, r, i, (w, b, v, C, I, E) => {
    if (f !== void 0 && !f.hasItemInRectangle({
      x: w[0],
      y: -2,
      width: w[1] - w[0] + 1,
      height: 1
    }))
      return;
    e.save(), e.beginPath(), e.rect(v, C, I, E), e.clip();
    const R = c(b), P = R?.overrideTheme === void 0 ? s : pr(s, R.overrideTheme), x = p === -2 && h !== void 0 && h >= w[0] && h <= w[1], S = x ? P.bgGroupHeaderHovered ?? P.bgHeaderHovered : P.bgGroupHeader ?? P.bgHeader;
    if (S !== s.bgHeader && (e.fillStyle = S, e.fill()), e.fillStyle = P.textGroupHeader ?? P.textHeader, R !== void 0) {
      let F = v;
      if (R.icon !== void 0 && (a.drawSprite(R.icon, "normal", e, F + 8, (i - 20) / 2, 20, P), F += 26), e.fillText(R.name, F + 8, i / 2 + nr(e, s.headerFontFull)), R.actions !== void 0 && x) {
        const D = af({ x: v, y: C, width: I, height: E }, R.actions);
        e.beginPath();
        const M = D[0].x - 10, T = v + I - M;
        e.rect(M, 0, T, i);
        const O = e.createLinearGradient(M, 0, M + T, 0), k = Jr(S, 0);
        O.addColorStop(0, k), O.addColorStop(10 / T, S), O.addColorStop(1, S), e.fillStyle = O, e.fill(), e.globalAlpha = 0.6;
        const [N, q] = o?.[1] ?? [-1, -1];
        for (let Y = 0; Y < R.actions.length; Y++) {
          const ue = R.actions[Y], ee = D[Y], te = Zr(ee, N + v, q);
          te && (e.globalAlpha = 1), a.drawSprite(ue.icon, "normal", e, ee.x + ee.width / 2 - 10, ee.y + ee.height / 2 - 10, 20, P), te && (e.globalAlpha = 0.6);
        }
        e.globalAlpha = 1;
      }
    }
    v !== 0 && u(w[0]) && (e.beginPath(), e.moveTo(v + 0.5, 0), e.lineTo(v + 0.5, i), e.strokeStyle = s.borderColor, e.lineWidth = 1, e.stroke()), e.restore(), m = v + I;
  }), e.beginPath(), e.moveTo(m + 0.5, 0), e.lineTo(m + 0.5, i), e.moveTo(0, i + 0.5), e.lineTo(n, i + 0.5), e.strokeStyle = s.borderColor, e.lineWidth = 1, e.stroke();
}
const Go = 30;
function rv(e, t, n, r, i) {
  return {
    x: e + n - Go,
    // right align
    y: Math.max(t, t + r / 2 - Go / 2),
    // center vertically
    width: Go,
    height: Math.min(Go, r)
  };
}
function af(e, t) {
  const n = [];
  let r = e.x + e.width - 26 * t.length;
  const i = e.y + e.height / 2 - 13, o = 26, s = 26;
  for (let a = 0; a < t.length; a++)
    n.push({
      x: r,
      y: i,
      width: s,
      height: o
    }), r += 26;
  return n;
}
function ro(e, t, n) {
  return !n || e === void 0 || (e.x = t - (e.x - t) - e.width), e;
}
function sf(e, t, n, r, i, o, s, a) {
  const l = s.cellHorizontalPadding, u = s.headerIconSize, c = rv(n, r, i, o);
  let f = n + l;
  const g = t.icon === void 0 ? void 0 : {
    x: f,
    y: r + (o - u) / 2,
    width: u,
    height: u
  }, h = g === void 0 || t.overlayIcon === void 0 ? void 0 : {
    x: g.x + 9,
    y: g.y + 6,
    width: 18,
    height: 18
  };
  g !== void 0 && (f += Math.ceil(u * 1.3));
  const p = {
    x: f,
    y: r,
    width: i - f,
    height: o
  };
  let m;
  if (t.indicatorIcon !== void 0) {
    const b = e === void 0 ? Ud(t.title, s.headerFontFull)?.width ?? 0 : Lr(t.title, e, s.headerFontFull).width;
    p.width = b, f += b + l, m = {
      x: f,
      y: r + (o - u) / 2,
      width: u,
      height: u
    };
  }
  const w = n + i / 2;
  return {
    menuBounds: ro(c, w, a),
    iconBounds: ro(g, w, a),
    iconOverlayBounds: ro(h, w, a),
    textBounds: ro(p, w, a),
    indicatorIconBounds: ro(m, w, a)
  };
}
function Xu(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m) {
  if (o.rowMarker !== void 0 && o.headerRowMarkerDisabled !== !0) {
    const v = o.rowMarkerChecked;
    v !== !0 && o.headerRowMarkerAlwaysVisible !== !0 && (e.globalAlpha = f);
    const C = o.headerRowMarkerTheme !== void 0 ? pr(a, o.headerRowMarkerTheme) : a;
    dl(e, C, v, t, n, r, i, !1, void 0, void 0, a.checkboxMaxSize, "center", o.rowMarker), v !== !0 && o.headerRowMarkerAlwaysVisible !== !0 && (e.globalAlpha = 1);
    return;
  }
  const w = s ? a.textHeaderSelected : a.textHeader, b = o.hasMenu === !0 && (l || h && s) && m.menuBounds !== void 0;
  if (o.icon !== void 0 && m.iconBounds !== void 0) {
    let v = s ? "selected" : "normal";
    o.style === "highlight" && (v = s ? "selected" : "special"), g.drawSprite(o.icon, v, e, m.iconBounds.x, m.iconBounds.y, m.iconBounds.width, a), o.overlayIcon !== void 0 && m.iconOverlayBounds !== void 0 && g.drawSprite(o.overlayIcon, s ? "selected" : "special", e, m.iconOverlayBounds.x, m.iconOverlayBounds.y, m.iconOverlayBounds.width, a);
  }
  if (b && r > 35) {
    const C = p ? 35 : r - 35, I = p ? 35 * 0.7 : r - 35 * 0.7, E = C / r, R = I / r, P = e.createLinearGradient(t, 0, t + r, 0), x = Jr(w, 0);
    P.addColorStop(p ? 1 : 0, w), P.addColorStop(E, w), P.addColorStop(R, x), P.addColorStop(p ? 0 : 1, x), e.fillStyle = P;
  } else
    e.fillStyle = w;
  if (p && (e.textAlign = "right"), m.textBounds !== void 0 && e.fillText(o.title, p ? m.textBounds.x + m.textBounds.width : m.textBounds.x, n + i / 2 + nr(e, a.headerFontFull)), p && (e.textAlign = "left"), o.indicatorIcon !== void 0 && m.indicatorIconBounds !== void 0 && (!b || !bo(m.menuBounds.x, m.menuBounds.y, m.menuBounds.width, m.menuBounds.height, m.indicatorIconBounds.x, m.indicatorIconBounds.y, m.indicatorIconBounds.width, m.indicatorIconBounds.height))) {
    let v = s ? "selected" : "normal";
    o.style === "highlight" && (v = s ? "selected" : "special"), g.drawSprite(o.indicatorIcon, v, e, m.indicatorIconBounds.x, m.indicatorIconBounds.y, m.indicatorIconBounds.width, a);
  }
  if (b && m.menuBounds !== void 0) {
    const v = m.menuBounds, C = u !== void 0 && c !== void 0 && Zr(v, u + t, c + n);
    if (C || (e.globalAlpha = 0.7), o.menuIcon === void 0 || o.menuIcon === fa.Triangle) {
      e.beginPath();
      const I = v.x + v.width / 2 - 5.5, E = v.y + v.height / 2 - 3;
      r0(e, [
        {
          x: I,
          y: E
        },
        {
          x: I + 11,
          y: E
        },
        {
          x: I + 5.5,
          y: E + 6
        }
      ], 1), e.fillStyle = w, e.fill();
    } else if (o.menuIcon === fa.Dots) {
      e.beginPath();
      const I = v.x + v.width / 2, E = v.y + v.height / 2;
      n0(e, I, E), e.fillStyle = w, e.fill();
    } else {
      const I = v.x + (v.width - a.headerIconSize) / 2, E = v.y + (v.height - a.headerIconSize) / 2;
      g.drawSprite(o.menuIcon, "normal", e, I, E, a.headerIconSize, a);
    }
    C || (e.globalAlpha = 1);
  }
}
function lf(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m) {
  const w = rl(o.title) === "rtl", b = sf(e, o, t, n, r, i, a, w);
  p !== void 0 ? p({
    ctx: e,
    theme: a,
    rect: { x: t, y: n, width: r, height: i },
    column: o,
    columnIndex: o.sourceIndex,
    isSelected: s,
    hoverAmount: g,
    isHovered: l,
    hasSelectedCell: f,
    spriteManager: h,
    menuBounds: b?.menuBounds ?? { x: 0, y: 0, height: 0, width: 0 },
    hoverX: u,
    hoverY: c
  }, () => Xu(e, t, n, r, i, o, s, a, l, u, c, g, h, m, w, b)) : Xu(e, t, n, r, i, o, s, a, l, u, c, g, h, m, w, b);
}
function iv(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m, w, b, v) {
  if (b !== void 0 || t[t.length - 1] !== n[t.length - 1])
    return;
  const C = ef(w);
  Fr(t, l, s, a, o, (I, E, R, P, x) => {
    if (I !== t[t.length - 1])
      return;
    E += I.width;
    const S = Math.max(E, P);
    S > r || (e.save(), e.beginPath(), e.rect(S, o + 1, 1e4, i - o - 1), e.clip(), Da(x, R, i, u, c, p, m, C, (F, D, M, T) => {
      if (!T && w.length > 0 && !w.some((Y) => bo(E, F, 1e4, M, Y.x, Y.y, Y.width, Y.height)))
        return;
      const O = g.hasIndex(D), k = h.hasIndex(D);
      e.beginPath();
      const N = f?.(D), q = N === void 0 ? v : pr(v, N);
      q.bgCell !== v.bgCell && (e.fillStyle = q.bgCell, e.fillRect(E, F, 1e4, M)), k && (e.fillStyle = q.bgHeader, e.fillRect(E, F, 1e4, M)), O && (e.fillStyle = q.accentLight, e.fillRect(E, F, 1e4, M));
    }), e.restore());
  });
}
function ov(e, t, n, r, i, o, s, a, l) {
  let u = !1;
  for (const p of t)
    if (!p.sticky) {
      u = s(p.sourceIndex);
      break;
    }
  const c = l.horizontalBorderColor ?? l.borderColor, f = l.borderColor, g = u ? Fi(t) : 0;
  let h;
  if (g !== 0 && (h = Hu(f, l.bgCell), e.beginPath(), e.moveTo(g + 0.5, 0), e.lineTo(g + 0.5, r), e.strokeStyle = h, e.stroke()), i > 0) {
    const p = f === c && h !== void 0 ? h : Hu(c, l.bgCell), m = ni(o, i, a);
    e.beginPath(), e.moveTo(0, r - m + 0.5), e.lineTo(n, r - m + 0.5), e.strokeStyle = p, e.stroke();
  }
}
const uf = (e, t, n) => {
  let r = 0, i = t, o = 0, s = n;
  if (e !== void 0 && e.length > 0) {
    r = Number.MAX_SAFE_INTEGER, o = Number.MAX_SAFE_INTEGER, i = Number.MIN_SAFE_INTEGER, s = Number.MIN_SAFE_INTEGER;
    for (const a of e)
      r = Math.min(r, a.x - 1), i = Math.max(i, a.x + a.width + 1), o = Math.min(o, a.y - 1), s = Math.max(s, a.y + a.height + 1);
  }
  return { minX: r, maxX: i, minY: o, maxY: s };
};
function av(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p) {
  const m = p.bgCell, { minX: w, maxX: b, minY: v, maxY: C } = uf(a, o, s), I = [], E = s - ni(h, g, u);
  let R = l, P = n, x = 0;
  for (; R + i < E; ) {
    const M = R + i, T = u(P);
    if (M >= v && M <= C - 1) {
      const k = c?.(P)?.bgCell;
      k !== void 0 && k !== m && P >= h - g && I.push({
        x: w,
        y: M,
        w: b - w,
        h: T,
        color: k
      });
    }
    R += T, P < h - g && (x = R), P++;
  }
  let S = 0;
  const F = Math.min(E, C) - x;
  if (F > 0)
    for (let M = 0; M < t.length; M++) {
      const T = t[M];
      if (T.width === 0)
        continue;
      const O = T.sticky ? S : S + r, k = T.themeOverride?.bgCell;
      k !== void 0 && k !== m && O >= w && O <= b && f(M + 1) && I.push({
        x: O,
        y: x,
        w: T.width,
        h: F,
        color: k
      }), S += T.width;
    }
  if (I.length === 0)
    return;
  let D;
  e.beginPath();
  for (let M = I.length - 1; M >= 0; M--) {
    const T = I[M];
    D === void 0 ? D = T.color : T.color !== D && (e.fillStyle = D, e.fill(), e.beginPath(), D = T.color), e.rect(T.x, T.y, T.w, T.h);
  }
  D !== void 0 && (e.fillStyle = D, e.fill()), e.beginPath();
}
function Ku(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m, w, b = !1) {
  if (l !== void 0) {
    e.beginPath(), e.save(), e.rect(0, 0, o, s);
    for (const M of l)
      e.rect(M.x + 1, M.y + 1, M.width - 1, M.height - 1);
    e.clip("evenodd");
  }
  const v = w.horizontalBorderColor ?? w.borderColor, C = w.borderColor, { minX: I, maxX: E, minY: R, maxY: P } = uf(a, o, s), x = [];
  e.beginPath();
  let S = 0.5;
  for (let M = 0; M < t.length; M++) {
    const T = t[M];
    if (T.width === 0)
      continue;
    S += T.width;
    const O = T.sticky ? S : S + r;
    O >= I && O <= E && h(M + 1) && x.push({
      x1: O,
      y1: Math.max(u, R),
      x2: O,
      y2: Math.min(s, P),
      color: C
    });
  }
  let F = s + 0.5;
  for (let M = m - p; M < m; M++) {
    const T = f(M);
    F -= T, x.push({ x1: I, y1: F, x2: E, y2: F, color: v });
  }
  if (b !== !0) {
    let M = c + 0.5, T = n;
    const O = F;
    for (; M + i < O; ) {
      const k = M + i;
      if (k >= R && k <= P - 1) {
        const N = g?.(T);
        x.push({
          x1: I,
          y1: k,
          x2: E,
          y2: k,
          color: N?.horizontalBorderColor ?? N?.borderColor ?? v
        });
      }
      M += f(T), T++;
    }
  }
  const D = lg(x, (M) => M.color);
  for (const M of Object.keys(D)) {
    e.strokeStyle = M;
    for (const T of D[M])
      e.moveTo(T.x1, T.y1), e.lineTo(T.x2, T.y2);
    e.stroke(), e.beginPath();
  }
  l !== void 0 && e.restore();
}
function sv(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m, w, b, v) {
  const C = [];
  e.imageSmoothingEnabled = !1;
  const I = Math.min(i.cellYOffset, s), E = Math.max(i.cellYOffset, s);
  let R = 0;
  if (typeof b == "number")
    R += (E - I) * b;
  else
    for (let O = I; O < E; O++)
      R += b(O);
  s > i.cellYOffset && (R = -R), R += l - i.translateY;
  const P = Math.min(i.cellXOffset, o), x = Math.max(i.cellXOffset, o);
  let S = 0;
  for (let O = P; O < x; O++)
    S += m[O].width;
  o > i.cellXOffset && (S = -S), S += a - i.translateX;
  const F = Fi(w);
  if (S !== 0 && R !== 0)
    return {
      regions: []
    };
  const D = u > 0 ? ni(g, u, b) : 0, M = c - F - Math.abs(S), T = f - h - D - Math.abs(R) - 1;
  if (M > 150 && T > 150) {
    const O = {
      sx: 0,
      sy: 0,
      sw: c * p,
      sh: f * p,
      dx: 0,
      dy: 0,
      dw: c * p,
      dh: f * p
    };
    if (R > 0 ? (O.sy = (h + 1) * p, O.sh = T * p, O.dy = (R + h + 1) * p, O.dh = T * p, C.push({
      x: 0,
      y: h,
      width: c,
      height: R + 1
    })) : R < 0 && (O.sy = (-R + h + 1) * p, O.sh = T * p, O.dy = (h + 1) * p, O.dh = T * p, C.push({
      x: 0,
      y: f + R - D,
      width: c,
      height: -R + D
    })), S > 0 ? (O.sx = F * p, O.sw = M * p, O.dx = (S + F) * p, O.dw = M * p, C.push({
      x: F - 1,
      y: 0,
      width: S + 2,
      // extra width to account for first col not drawing a left side border
      height: f
    })) : S < 0 && (O.sx = (F - S) * p, O.sw = M * p, O.dx = F * p, O.dw = M * p, C.push({
      x: c + S,
      y: 0,
      width: -S,
      height: f
    })), e.setTransform(1, 0, 0, 1, 0, 0), v) {
      if (F > 0 && S !== 0 && R === 0 && (r === void 0 || n?.[1] !== !1)) {
        const k = F * p, N = f * p;
        e.drawImage(t, 0, 0, k, N, 0, 0, k, N);
      }
      if (D > 0 && S === 0 && R !== 0 && (r === void 0 || n?.[0] !== !1)) {
        const k = (f - D) * p, N = c * p, q = D * p;
        e.drawImage(t, 0, k, N, q, 0, k, N, q);
      }
    }
    e.drawImage(t, O.sx, O.sy, O.sw, O.sh, O.dx, O.dy, O.dw, O.dh), e.scale(p, p);
  }
  return e.imageSmoothingEnabled = !0, {
    regions: C
  };
}
function lv(e, t, n, r, i, o, s, a, l, u) {
  const c = [];
  return t !== e.cellXOffset || n !== e.cellYOffset || r !== e.translateX || i !== e.translateY || Fr(l, n, r, i, a, (f, g, h, p) => {
    if (f.sourceIndex === u) {
      const m = Math.max(g, p) + 1;
      return c.push({
        x: m,
        y: 0,
        width: o - m,
        height: s
      }), !0;
    }
  }), c;
}
function uv(e, t) {
  if (t === void 0 || e.width !== t.width || e.height !== t.height || e.theme !== t.theme || e.headerHeight !== t.headerHeight || e.rowHeight !== t.rowHeight || e.rows !== t.rows || e.freezeColumns !== t.freezeColumns || e.getRowThemeOverride !== t.getRowThemeOverride || e.isFocused !== t.isFocused || e.isResizing !== t.isResizing || e.verticalBorder !== t.verticalBorder || e.getCellContent !== t.getCellContent || e.highlightRegions !== t.highlightRegions || e.selection !== t.selection || e.dragAndDropState !== t.dragAndDropState || e.prelightCells !== t.prelightCells || e.touchMode !== t.touchMode || e.maxScaleFactor !== t.maxScaleFactor)
    return !1;
  if (e.mappedColumns !== t.mappedColumns) {
    if (e.mappedColumns.length > 100 || e.mappedColumns.length !== t.mappedColumns.length)
      return !1;
    let n;
    for (let r = 0; r < e.mappedColumns.length; r++) {
      const i = e.mappedColumns[r], o = t.mappedColumns[r];
      if (Li(i, o))
        continue;
      if (n !== void 0 || i.width === o.width)
        return !1;
      const { width: s, ...a } = i, { width: l, ...u } = o;
      if (!Li(a, u))
        return !1;
      n = r;
    }
    return n === void 0 ? !0 : n;
  }
  return !0;
}
function Zu(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m) {
  const w = p?.filter((P) => P.style !== "no-outline");
  if (w === void 0 || w.length === 0)
    return;
  const b = Fi(a), v = ni(h, g, f), C = [l, 0, a.length, h - g], I = [b, 0, t, n - v], E = w.map((P) => {
    const x = P.range, S = P.style ?? "dashed";
    return J0(x, C, t, n, I).map((F) => {
      const D = F.rect, M = Ns(D.x, D.y, t, n, c, u + c, r, i, o, s, h, l, g, a, f), T = D.width === 1 && D.height === 1 ? M : Ns(D.x + D.width - 1, D.y + D.height - 1, t, n, c, u + c, r, i, o, s, h, l, g, a, f);
      return D.x + D.width >= a.length && (T.width -= 1), D.y + D.height >= h && (T.height -= 1), {
        color: P.color,
        style: S,
        clip: F.clip,
        rect: Z0({
          x: M.x,
          y: M.y,
          width: T.x + T.width - M.x,
          height: T.y + T.height - M.y
        }, t, n, 8)
      };
    });
  }), R = () => {
    e.lineWidth = 1;
    let P = !1;
    for (const x of E)
      for (const S of x)
        if (S?.rect !== void 0 && bo(0, 0, t, n, S.rect.x, S.rect.y, S.rect.width, S.rect.height)) {
          const F = P, D = !K0(S.clip, S.rect);
          e.beginPath(), D && (e.save(), e.rect(S.clip.x, S.clip.y, S.clip.width, S.clip.height), e.clip()), S.style === "dashed" && !P ? (e.setLineDash([5, 3]), P = !0) : (S.style === "solid" || S.style === "solid-outline") && P && (e.setLineDash([]), P = !1), e.strokeStyle = S.style === "solid-outline" ? $n($n(S.color, m.borderColor), m.bgCell) : Jr(S.color, 1), e.closePath(), e.strokeRect(S.rect.x + 0.5, S.rect.y + 0.5, S.rect.width - 1, S.rect.height - 1), D && (e.restore(), P = F);
        }
    P && e.setLineDash([]);
  };
  return R(), R;
}
function Ju(e, t, n, r, i) {
  e.beginPath(), e.moveTo(t, n), e.lineTo(t, r), e.lineWidth = 2, e.strokeStyle = i, e.stroke(), e.globalAlpha = 1;
}
function vs(e, t, n, r, i, o, s, a, l, u, c, f, g, h, p, m, w) {
  if (c.current === void 0)
    return;
  const b = m !== !1 && m !== void 0;
  if (!b)
    return;
  const v = typeof m == "object" ? { ...ha, ...m } : ha, C = c.current.range, I = c.current.cell, E = [C.x + C.width - 1, C.y + C.height - 1];
  if (I[1] >= w && E[1] >= w || !s.some((N) => N.sourceIndex === I[0] || N.sourceIndex === E[0]))
    return;
  const [P, x] = c.current.cell, S = g(c.current.cell), F = S.span ?? [P, P], D = x >= w - h, M = h > 0 && !D ? ni(w, h, f) - 1 : 0, T = E[1];
  let O;
  if (Fr(s, r, i, o, u, (N, q, Y, ue, ee) => {
    if (N.sticky && P > N.sourceIndex)
      return;
    const te = N.sourceIndex < F[0], ce = N.sourceIndex > F[1], le = N.sourceIndex === E[0];
    if (!(!le && (te || ce)))
      return Da(ee, Y, n, w, f, h, p, void 0, (he, de, ie) => {
        if (de !== x && de !== T)
          return;
        let H = q, L = N.width;
        if (S.span !== void 0) {
          const ne = nf(S.span, q, he, N.width, ie, N, a), oe = N.sticky ? ne[0] : ne[1];
          oe !== void 0 && (H = oe.x, L = oe.width);
        }
        return de === T && le && b && (O = () => {
          ue > H && !N.sticky && (e.beginPath(), e.rect(ue, 0, t - ue, n), e.clip());
          const ne = v.size, oe = ne / 2, xe = H + L + v.offsetX - oe + 0.5, ve = he + ie + v.offsetY - oe + 0.5;
          e.beginPath(), v.shape === "circle" ? e.arc(xe + oe, ve + oe, oe, 0, Math.PI * 2) : e.rect(xe, ve, ne, ne), e.fillStyle = N.themeOverride?.accentColor ?? l.accentColor, e.fill(), v.outline > 0 && (e.lineWidth = v.outline, e.strokeStyle = l.bgCell, v.shape === "circle" ? (e.beginPath(), e.arc(xe + oe, ve + oe, oe + v.outline / 2, 0, Math.PI * 2), e.stroke()) : e.strokeRect(xe - v.outline / 2, ve - v.outline / 2, ne + v.outline, ne + v.outline));
        }), O !== void 0;
      }), O !== void 0;
  }), O === void 0)
    return;
  const k = () => {
    e.save(), e.beginPath(), e.rect(0, u, t, n - u - M), e.clip(), O?.(), e.restore();
  };
  return k(), k;
}
function cv(e, t, n, r, i, o, s, a, l) {
  l === void 0 || l.size === 0 || (e.beginPath(), tf(t, n, o, r, (u, c, f, g, h, p) => {
    l.hasItemInRectangle({
      x: u[0],
      y: -2,
      width: u[1] - u[0] + 1,
      height: 1
    }) && e.rect(f, g, h, p);
  }), Fr(t, a, o, s, i, (u, c, f, g) => {
    const h = Math.max(0, g - c), p = c + h + 1, m = u.width - h - 1;
    l.has([u.sourceIndex, -1]) && e.rect(p, r, m, i - r);
  }), e.clip());
}
function dv(e, t, n, r, i, o, s, a, l, u) {
  let c = 0;
  return Fr(e, o, r, i, n, (f, g, h, p, m) => (Da(m, h, t, s, a, l, u, void 0, (w, b, v, C) => {
    C || (c = Math.max(b, c));
  }), !0)), c;
}
function Qu(e, t) {
  const { canvasCtx: n, headerCanvasCtx: r, width: i, height: o, cellXOffset: s, cellYOffset: a, translateX: l, translateY: u, mappedColumns: c, enableGroups: f, freezeColumns: g, dragAndDropState: h, theme: p, drawFocus: m, headerHeight: w, groupHeaderHeight: b, disabledRows: v, rowHeight: C, verticalBorder: I, overrideCursor: E, isResizing: R, selection: P, fillHandle: x, freezeTrailingRows: S, rows: F, getCellContent: D, getGroupDetails: M, getRowThemeOverride: T, isFocused: O, drawHeaderCallback: k, prelightCells: N, drawCellCallback: q, highlightRegions: Y, resizeCol: ue, imageLoader: ee, lastBlitData: te, hoverValues: ce, hyperWrapping: le, hoverInfo: he, spriteManager: de, maxScaleFactor: ie, hasAppendRow: H, touchMode: L, enqueue: G, renderStateProvider: ne, getCellRenderer: oe, renderStrategy: xe, bufferACtx: ve, bufferBCtx: et, damage: ke, minimumCellWidth: bt, resizeIndicator: St } = e;
  if (i === 0 || o === 0)
    return;
  const Ue = xe === "double-buffer", re = Math.min(ie, Math.ceil(window.devicePixelRatio ?? 1)), se = xe !== "direct" && uv(e, t), we = n.canvas;
  (we.width !== i * re || we.height !== o * re) && (we.width = i * re, we.height = o * re, we.style.width = i + "px", we.style.height = o + "px");
  const fe = r.canvas, ye = f ? b + w : w, $e = ye + 1;
  (fe.width !== i * re || fe.height !== $e * re) && (fe.width = i * re, fe.height = $e * re, fe.style.width = i + "px", fe.style.height = $e + "px");
  const _e = ve.canvas, tt = et.canvas;
  Ue && (_e.width !== i * re || _e.height !== o * re) && (_e.width = i * re, _e.height = o * re, te.current !== void 0 && (te.current.aBufferScroll = void 0)), Ue && (tt.width !== i * re || tt.height !== o * re) && (tt.width = i * re, tt.height = o * re, te.current !== void 0 && (te.current.bBufferScroll = void 0));
  const Re = te.current;
  if (se === !0 && s === Re?.cellXOffset && a === Re?.cellYOffset && l === Re?.translateX && u === Re?.translateY)
    return;
  let qe = null;
  Ue && (qe = n);
  const De = r;
  let Ie;
  Ue ? ke !== void 0 ? Ie = Re?.lastBuffer === "b" ? et : ve : Ie = Re?.lastBuffer === "b" ? ve : et : Ie = n;
  const Le = Ie.canvas, ht = Ue ? Le === _e ? tt : _e : we, nt = typeof C == "number" ? () => C : C;
  De.save(), Ie.save(), De.beginPath(), Ie.beginPath(), De.textBaseline = "middle", Ie.textBaseline = "middle", re !== 1 && (De.scale(re, re), Ie.scale(re, re));
  const Xe = $s(c, s, i, h, l);
  let kt = [];
  const wt = m && P.current?.cell[1] === a && u === 0;
  let Ot = !1;
  if (Y !== void 0) {
    for (const yt of Y)
      if (yt.style !== "no-outline" && yt.range.y === a && u === 0) {
        Ot = !0;
        break;
      }
  }
  const Pt = () => {
    tv(De, Xe, f, he, i, l, w, b, h, R, P, p, de, ce, I, M, ke, k, L), Ku(De, Xe, a, l, u, i, o, void 0, void 0, b, ye, nt, T, I, S, F, p, !0), De.beginPath(), De.moveTo(0, $e - 0.5), De.lineTo(i, $e - 0.5), De.strokeStyle = $n(p.headerBottomBorderColor ?? p.horizontalBorderColor ?? p.borderColor, p.bgHeader), De.stroke(), Ot && Zu(De, i, o, s, a, l, u, c, g, w, b, C, S, F, Y, p), wt && vs(De, i, o, a, l, u, Xe, c, p, ye, P, nt, D, S, H, x, F);
  };
  if (ke !== void 0) {
    const yt = Xe[Xe.length - 1].sourceIndex + 1, Qt = ke.hasItemInRegion([
      {
        x: s,
        y: -2,
        width: yt,
        height: 2
      },
      {
        x: s,
        y: a,
        width: yt,
        height: 300
      },
      {
        x: 0,
        y: a,
        width: g,
        height: 300
      },
      {
        x: 0,
        y: -2,
        width: g,
        height: 2
      },
      {
        x: s,
        y: F - S,
        width: yt,
        height: S,
        when: S > 0
      }
    ]), kn = (Oe) => {
      Yu(Oe, Xe, c, o, ye, l, u, a, F, nt, D, M, T, v, O, m, S, H, kt, ke, P, N, Y, ee, de, ce, he, q, le, p, G, ne, oe, E, bt);
      const ct = P.current;
      x !== !1 && x !== void 0 && m && ct !== void 0 && ke.has(Nd(ct.range)) && vs(Oe, i, o, a, l, u, Xe, c, p, ye, P, nt, D, S, H, x, F);
    };
    Qt && (kn(Ie), qe !== null && (qe.save(), qe.scale(re, re), qe.textBaseline = "middle", kn(qe), qe.restore()), ke.hasHeader() && (cv(De, Xe, i, b, ye, l, u, a, ke), Pt())), Ie.restore(), De.restore();
    return;
  }
  if ((se !== !0 || s !== Re?.cellXOffset || l !== Re?.translateX || wt !== Re?.mustDrawFocusOnHeader || Ot !== Re?.mustDrawHighlightRingsOnHeader) && Pt(), se === !0) {
    Vn(ht !== void 0 && Re !== void 0);
    const { regions: yt } = sv(Ie, ht, ht === _e ? Re.aBufferScroll : Re.bBufferScroll, ht === _e ? Re.bBufferScroll : Re.aBufferScroll, Re, s, a, l, u, S, i, o, F, ye, re, c, Xe, C, Ue);
    kt = yt;
  } else se !== !1 && (Vn(Re !== void 0), kt = lv(Re, s, a, l, u, i, o, ye, Xe, se));
  ov(Ie, Xe, i, o, S, F, I, nt, p);
  const ln = Zu(Ie, i, o, s, a, l, u, c, g, w, b, C, S, F, Y, p), Jt = m ? vs(Ie, i, o, a, l, u, Xe, c, p, ye, P, nt, D, S, H, x, F) : void 0;
  if (Ie.fillStyle = p.bgCell, kt.length > 0) {
    Ie.beginPath();
    for (const yt of kt)
      Ie.rect(yt.x, yt.y, yt.width, yt.height);
    Ie.clip(), Ie.fill(), Ie.beginPath();
  } else
    Ie.fillRect(0, 0, i, o);
  const Dn = Yu(Ie, Xe, c, o, ye, l, u, a, F, nt, D, M, T, v, O, m, S, H, kt, ke, P, N, Y, ee, de, ce, he, q, le, p, G, ne, oe, E, bt);
  iv(Ie, Xe, c, i, o, ye, l, u, a, F, nt, T, P.rows, v, S, H, kt, ke, p), av(Ie, Xe, a, l, u, i, o, kt, ye, nt, T, I, S, F, p), Ku(Ie, Xe, a, l, u, i, o, kt, Dn, b, ye, nt, T, I, S, F, p), ln?.(), Jt?.(), R && St !== "none" && Fr(Xe, 0, l, 0, ye, (yt, Qt) => yt.sourceIndex === ue ? (Ju(De, Qt + yt.width, 0, ye + 1, $n(p.resizeIndicatorColor ?? p.accentLight, p.bgHeader)), St === "full" && Ju(Ie, Qt + yt.width, ye, o, $n(p.resizeIndicatorColor ?? p.accentLight, p.bgCell)), !0) : !1), qe !== null && (qe.fillStyle = p.bgCell, qe.fillRect(0, 0, i, o), qe.drawImage(Ie.canvas, 0, 0));
  const Tt = dv(Xe, o, ye, l, u, a, F, nt, S, H);
  ee?.setWindow({
    x: s,
    y: a,
    width: Xe.length,
    height: Tt - a
  }, g, Array.from({ length: S }, (yt, Qt) => F - 1 - Qt));
  const gt = Re !== void 0 && (s !== Re.cellXOffset || l !== Re.translateX), On = Re !== void 0 && (a !== Re.cellYOffset || u !== Re.translateY);
  te.current = {
    cellXOffset: s,
    cellYOffset: a,
    translateX: l,
    translateY: u,
    mustDrawFocusOnHeader: wt,
    mustDrawHighlightRingsOnHeader: Ot,
    lastBuffer: Ue ? Le === _e ? "a" : "b" : void 0,
    aBufferScroll: Le === _e ? [gt, On] : Re?.aBufferScroll,
    bBufferScroll: Le === tt ? [gt, On] : Re?.bBufferScroll
  }, Ie.restore(), De.restore();
}
const fv = 80;
function hv(e) {
  const t = e - 1;
  return t * t * t + 1;
}
class gv {
  callback;
  constructor(t) {
    this.callback = t;
  }
  currentHoveredItem = void 0;
  leavingItems = [];
  lastAnimationTime;
  addToLeavingItems = (t) => {
    this.leavingItems.some((r) => fo(r.item, t.item)) || this.leavingItems.push(t);
  };
  /**
   * @returns the hover amount of the item, if it was leaving (0 if not).
   */
  removeFromLeavingItems = (t) => {
    const n = this.leavingItems.find((r) => fo(r.item, t));
    return this.leavingItems = this.leavingItems.filter((r) => r !== n), n?.hoverAmount ?? 0;
  };
  cleanUpLeavingElements = () => {
    this.leavingItems = this.leavingItems.filter((t) => t.hoverAmount > 0);
  };
  shouldStep = () => {
    const t = this.leavingItems.length > 0, n = this.currentHoveredItem !== void 0 && this.currentHoveredItem.hoverAmount < 1;
    return t || n;
  };
  getAnimatingItems = () => this.currentHoveredItem !== void 0 ? [...this.leavingItems, this.currentHoveredItem] : this.leavingItems.map((t) => ({ ...t, hoverAmount: hv(t.hoverAmount) }));
  step = (t) => {
    if (this.lastAnimationTime === void 0)
      this.lastAnimationTime = t;
    else {
      const r = (t - this.lastAnimationTime) / fv;
      for (const o of this.leavingItems)
        o.hoverAmount = jn(o.hoverAmount - r, 0, 1);
      this.currentHoveredItem !== void 0 && (this.currentHoveredItem.hoverAmount = jn(this.currentHoveredItem.hoverAmount + r, 0, 1));
      const i = this.getAnimatingItems();
      this.callback(i), this.cleanUpLeavingElements();
    }
    this.shouldStep() ? (this.lastAnimationTime = t, window.requestAnimationFrame(this.step)) : this.lastAnimationTime = void 0;
  };
  setHovered = (t) => {
    if (!fo(this.currentHoveredItem?.item, t)) {
      if (this.currentHoveredItem !== void 0 && this.addToLeavingItems(this.currentHoveredItem), t !== void 0) {
        const n = this.removeFromLeavingItems(t);
        this.currentHoveredItem = {
          item: t,
          hoverAmount: n
        };
      } else
        this.currentHoveredItem = void 0;
      this.lastAnimationTime === void 0 && window.requestAnimationFrame(this.step);
    }
  };
}
class pv {
  fn;
  val;
  constructor(t) {
    this.fn = t;
  }
  get value() {
    return this.val ?? (this.val = this.fn());
  }
}
function fl(e) {
  return new pv(e);
}
const mv = fl(() => window.navigator.userAgent.includes("Firefox")), pa = fl(() => window.navigator.userAgent.includes("Mac OS") && window.navigator.userAgent.includes("Safari") && !window.navigator.userAgent.includes("Chrome")), ma = fl(() => window.navigator.platform.toLowerCase().startsWith("mac"));
function vv(e) {
  const t = d.useRef([]), n = d.useRef(0), r = d.useRef(e);
  r.current = e;
  const i = d.useCallback(() => {
    const o = () => window.requestAnimationFrame(s), s = () => {
      const a = t.current.map(cl);
      t.current = [], r.current(new go(a)), t.current.length > 0 ? n.current++ : n.current = 0;
    };
    window.requestAnimationFrame(n.current > 600 ? o : s);
  }, []);
  return d.useCallback((o) => {
    t.current.length === 0 && i();
    const s = Qn(o[0], o[1]);
    t.current.includes(s) || t.current.push(s);
  }, [i]);
}
const Ir = "header", Jn = "group-header", va = "out-of-bounds";
var Di;
(function(e) {
  e[e.Start = -2] = "Start", e[e.StartPadding = -1] = "StartPadding", e[e.Center = 0] = "Center", e[e.EndPadding = 1] = "EndPadding", e[e.End = 2] = "End";
})(Di || (Di = {}));
function cf(e, t) {
  return e === t ? !0 : e?.kind === "out-of-bounds" ? e?.kind === t?.kind && e?.location[0] === t?.location[0] && e?.location[1] === t?.location[1] && e?.region[0] === t?.region[0] && e?.region[1] === t?.region[1] : e?.kind === t?.kind && e?.location[0] === t?.location[0] && e?.location[1] === t?.location[1];
}
const bv = (e, t) => e.kind === Z.Custom ? e.copyData : t?.(e)?.getAccessibilityString(e) ?? "", wv = (e, t) => {
  const { width: n, height: r, accessibilityHeight: i, columns: o, cellXOffset: s, cellYOffset: a, headerHeight: l, fillHandle: u = !1, groupHeaderHeight: c, rowHeight: f, rows: g, getCellContent: h, getRowThemeOverride: p, onHeaderMenuClick: m, onHeaderIndicatorClick: w, enableGroups: b, isFilling: v, onCanvasFocused: C, onCanvasBlur: I, isFocused: E, selection: R, freezeColumns: P, onContextMenu: x, freezeTrailingRows: S, fixedShadowX: F = !0, fixedShadowY: D = !0, drawFocusRing: M, onMouseDown: T, onMouseUp: O, onMouseMoveRaw: k, onMouseMove: N, onItemHovered: q, dragAndDropState: Y, firstColAccessible: ue, onKeyDown: ee, onKeyUp: te, highlightRegions: ce, canvasRef: le, onDragStart: he, onDragEnd: de, eventTargetRef: ie, isResizing: H, resizeColumn: L, isDragging: G, isDraggable: ne = !1, allowResize: oe, disabledRows: xe, hasAppendRow: ve, getGroupDetails: et, theme: ke, prelightCells: bt, headerIcons: St, verticalBorder: Ue, drawCell: re, drawHeader: se, onCellFocused: we, onDragOverCell: fe, onDrop: ye, onDragLeave: $e, imageWindowLoader: _e, smoothScrollX: tt = !1, smoothScrollY: Re = !1, experimental: qe, getCellRenderer: De, resizeIndicator: Ie = "full" } = e, Le = e.translateX ?? 0, ht = e.translateY ?? 0, nt = Math.max(P, Math.min(o.length - 1, s)), Xe = d.useRef(null), kt = d.useRef(qe?.eventTarget ?? window), wt = kt.current, Ot = _e, Pt = d.useRef(), [ln, Jt] = d.useState(!1), Dn = d.useRef([]), Tt = d.useRef(), [gt, On] = d.useState(), [yt, Qt] = d.useState(), kn = d.useRef(null), [Oe, ct] = d.useState(), [pt, Pn] = d.useState(!1), un = d.useRef(pt);
  un.current = pt;
  const cn = d.useMemo(() => new Y0(St, () => {
    hn.current = void 0, En.current();
  }), [St]), Ln = b ? c + l : l, en = d.useRef(-1), tn = (qe?.enableFirefoxRescaling ?? !1) && mv.value, Be = (qe?.enableSafariRescaling ?? !1) && pa.value;
  d.useLayoutEffect(() => {
    window.devicePixelRatio === 1 || !tn && !Be || (en.current !== -1 && Jt(!0), window.clearTimeout(en.current), en.current = window.setTimeout(() => {
      Jt(!1), en.current = -1;
    }, 200));
  }, [a, nt, Le, ht, tn, Be]);
  const Mt = Um(o, P), Fn = d.useMemo(() => F ? Fi(Mt, Y) : 0, [Mt, Y, F]), Ft = d.useCallback((V, Q, Me) => {
    const Te = V.getBoundingClientRect();
    if (Q >= Mt.length || Me >= g)
      return;
    const ge = Te.width / n, pe = Ns(Q, Me, n, r, c, Ln, nt, a, Le, ht, g, P, S, Mt, f);
    return ge !== 1 && (pe.x *= ge, pe.y *= ge, pe.width *= ge, pe.height *= ge), pe.x += Te.x, pe.y += Te.y, pe;
  }, [
    n,
    r,
    c,
    Ln,
    nt,
    a,
    Le,
    ht,
    g,
    P,
    S,
    Mt,
    f
  ]), mt = d.useCallback((V, Q, Me, Te) => {
    const ge = V.getBoundingClientRect(), pe = ge.width / n, je = (Q - ge.left) / pe, Ee = (Me - ge.top) / pe, Ze = 5, vt = $s(Mt, nt, n, void 0, Le);
    let gn = 0, jt = 0;
    const Rt = typeof PointerEvent < "u" && Te instanceof PointerEvent && Te.pointerType === "mouse" || typeof MouseEvent < "u" && Te instanceof MouseEvent, ut = typeof PointerEvent < "u" && Te instanceof PointerEvent && Te.pointerType === "touch" || typeof TouchEvent < "u" && Te instanceof TouchEvent;
    Rt && (gn = Te.button, jt = Te.buttons);
    const Ye = Ym(je, vt, Le), dt = Xm(Ee, r, b, l, c, g, f, a, ht, S), $t = Te?.shiftKey === !0, di = Te?.ctrlKey === !0, Vr = Te?.metaKey === !0, rn = [
      je < 0 ? -1 : n < je ? 1 : 0,
      Ee < Ln ? -1 : r < Ee ? 1 : 0
    ];
    let dn;
    if (Ye === -1 || Ee < 0 || je < 0 || dt === void 0 || je > n || Ee > r) {
      const At = je > n ? 1 : je < 0 ? -1 : 0, Wn = Ee > r ? 1 : Ee < 0 ? -1 : 0;
      let pn = At * 2, fi = Wn * 2;
      At === 0 && (pn = Ye === -1 ? Di.EndPadding : Di.Center), Wn === 0 && (fi = dt === void 0 ? Di.EndPadding : Di.Center);
      let fr = !1;
      if (Ye === -1 && dt === -1) {
        const on = Ft(V, Mt.length - 1, -1);
        Vn(on !== void 0), fr = Q < on.x + on.width + Ze;
      }
      const rt = je > n && je < n + As() || Ee > r && Ee < r + As();
      dn = {
        kind: va,
        location: [Ye !== -1 ? Ye : je < 0 ? 0 : Mt.length - 1, dt ?? g - 1],
        region: [pn, fi],
        shiftKey: $t,
        ctrlKey: di,
        metaKey: Vr,
        isEdge: fr,
        isTouch: ut,
        button: gn,
        buttons: jt,
        scrollEdge: rn,
        isMaybeScrollbar: rt
      };
    } else if (dt <= -1) {
      let At = Ft(V, Ye, dt);
      Vn(At !== void 0);
      let Wn = At !== void 0 && At.x + At.width - Q <= Ze;
      const pn = Ye - 1;
      Q - At.x <= Ze && pn >= 0 ? (Wn = !0, At = Ft(V, pn, dt), Vn(At !== void 0), dn = {
        kind: b && dt === -2 ? Jn : Ir,
        location: [pn, dt],
        bounds: At,
        group: Mt[pn].group ?? "",
        isEdge: Wn,
        shiftKey: $t,
        ctrlKey: di,
        metaKey: Vr,
        isTouch: ut,
        localEventX: Q - At.x,
        localEventY: Me - At.y,
        button: gn,
        buttons: jt,
        scrollEdge: rn
      }) : dn = {
        kind: b && dt === -2 ? Jn : Ir,
        group: Mt[Ye].group ?? "",
        location: [Ye, dt],
        bounds: At,
        isEdge: Wn,
        shiftKey: $t,
        ctrlKey: di,
        metaKey: Vr,
        isTouch: ut,
        localEventX: Q - At.x,
        localEventY: Me - At.y,
        button: gn,
        buttons: jt,
        scrollEdge: rn
      };
    } else {
      const At = Ft(V, Ye, dt);
      Vn(At !== void 0);
      const Wn = At !== void 0 && At.x + At.width - Q < Ze;
      let pn = !1;
      if (u !== !1 && u !== void 0 && R.current !== void 0) {
        const fr = typeof u == "object" ? { ...ha, ...u } : ha, rt = fr.size, on = rt / 2, $r = Nd(R.current.range), Cr = Ft(V, $r[0], $r[1]);
        if (Cr !== void 0) {
          const hr = Cr.x + Cr.width + fr.offsetX - on + 0.5, Nt = Cr.y + Cr.height + fr.offsetY - on + 0.5;
          pn = Math.abs(hr - Q) < rt && Math.abs(Nt - Me) < rt;
        }
      }
      dn = {
        kind: "cell",
        location: [Ye, dt],
        bounds: At,
        isEdge: Wn,
        shiftKey: $t,
        ctrlKey: di,
        isFillHandle: pn,
        metaKey: Vr,
        isTouch: ut,
        localEventX: Q - At.x,
        localEventY: Me - At.y,
        button: gn,
        buttons: jt,
        scrollEdge: rn
      };
    }
    return dn;
  }, [
    n,
    Mt,
    nt,
    Le,
    r,
    b,
    l,
    c,
    g,
    f,
    a,
    ht,
    S,
    Ft,
    u,
    R,
    Ln
  ]), [Mn] = gt ?? [], ur = d.useRef(() => {
  }), Nn = d.useRef(gt);
  Nn.current = gt;
  const [B, We] = d.useMemo(() => {
    const V = document.createElement("canvas"), Q = document.createElement("canvas");
    return V.style.display = "none", V.style.opacity = "0", V.style.position = "fixed", Q.style.display = "none", Q.style.opacity = "0", Q.style.position = "fixed", [V.getContext("2d", { alpha: !1 }), Q.getContext("2d", { alpha: !1 })];
  }, []);
  d.useLayoutEffect(() => {
    if (!(B === null || We === null))
      return document.documentElement.append(B.canvas), document.documentElement.append(We.canvas), () => {
        B.canvas.remove(), We.canvas.remove();
      };
  }, [B, We]);
  const Ge = d.useMemo(() => new i0(), []), Lt = tn && ln ? 1 : Be && ln ? 2 : 5, nn = qe?.disableMinimumCellWidth === !0 ? 1 : 10, hn = d.useRef(), Rn = d.useRef(null), yn = d.useRef(null), Ut = d.useCallback(() => {
    const V = Xe.current, Q = kn.current;
    if (V === null || Q === null || (Rn.current === null && (Rn.current = V.getContext("2d", { alpha: !1 }), V.width = 0, V.height = 0), yn.current === null && (yn.current = Q.getContext("2d", { alpha: !1 }), Q.width = 0, Q.height = 0), Rn.current === null || yn.current === null || B === null || We === null))
      return;
    let Me = !1;
    const Te = (je) => {
      Me = !0, ct(je);
    }, ge = hn.current, pe = {
      headerCanvasCtx: yn.current,
      canvasCtx: Rn.current,
      bufferACtx: B,
      bufferBCtx: We,
      width: n,
      height: r,
      cellXOffset: nt,
      cellYOffset: a,
      translateX: Math.round(Le),
      translateY: Math.round(ht),
      mappedColumns: Mt,
      enableGroups: b,
      freezeColumns: P,
      dragAndDropState: Y,
      theme: ke,
      headerHeight: l,
      groupHeaderHeight: c,
      disabledRows: xe ?? Qe.empty(),
      rowHeight: f,
      verticalBorder: Ue,
      isResizing: H,
      resizeCol: L,
      isFocused: E,
      selection: R,
      fillHandle: u,
      drawCellCallback: re,
      hasAppendRow: ve,
      overrideCursor: Te,
      maxScaleFactor: Lt,
      freezeTrailingRows: S,
      rows: g,
      drawFocus: M,
      getCellContent: h,
      getGroupDetails: et ?? ((je) => ({ name: je })),
      getRowThemeOverride: p,
      drawHeaderCallback: se,
      prelightCells: bt,
      highlightRegions: ce,
      imageLoader: Ot,
      lastBlitData: Tt,
      damage: Pt.current,
      hoverValues: Dn.current,
      hoverInfo: Nn.current,
      spriteManager: cn,
      scrolling: ln,
      hyperWrapping: qe?.hyperWrapping ?? !1,
      touchMode: pt,
      enqueue: ur.current,
      renderStateProvider: Ge,
      renderStrategy: qe?.renderStrategy ?? (pa.value ? "double-buffer" : "single-buffer"),
      getCellRenderer: De,
      minimumCellWidth: nn,
      resizeIndicator: Ie
    };
    pe.damage === void 0 ? (hn.current = pe, Qu(pe, ge)) : Qu(pe, void 0), !Me && (pe.damage === void 0 || pe.damage.has(Nn?.current?.[0])) && ct(void 0);
  }, [
    B,
    We,
    n,
    r,
    nt,
    a,
    Le,
    ht,
    Mt,
    b,
    P,
    Y,
    ke,
    l,
    c,
    xe,
    f,
    Ue,
    H,
    ve,
    L,
    E,
    R,
    u,
    S,
    g,
    M,
    Lt,
    h,
    et,
    p,
    re,
    se,
    bt,
    ce,
    Ot,
    cn,
    ln,
    qe?.hyperWrapping,
    qe?.renderStrategy,
    pt,
    Ge,
    De,
    nn,
    Ie
  ]), En = d.useRef(Ut);
  d.useLayoutEffect(() => {
    Ut(), En.current = Ut;
  }, [Ut]), d.useLayoutEffect(() => {
    (async () => {
      document?.fonts?.ready !== void 0 && (await document.fonts.ready, hn.current = void 0, En.current());
    })();
  }, []);
  const In = d.useCallback((V) => {
    Pt.current = V, En.current(), Pt.current = void 0;
  }, []), Ce = vv(In);
  ur.current = Ce;
  const _t = d.useCallback((V) => {
    In(new go(V.map((Q) => Q.cell)));
  }, [In]);
  Ot.setCallback(In);
  const [Kt, Bn] = d.useState(!1), [Zt, Gt] = Mn ?? [], Yt = Zt !== void 0 && Gt === -1 && Zt >= 0 && Zt < Mt.length && Mt[Zt].headerRowMarkerDisabled !== !0, _n = Zt !== void 0 && Gt === -2;
  let Tn = !1, Mo = !1, _r = Oe;
  if (_r === void 0 && Zt !== void 0 && Gt !== void 0 && Gt > -1 && Gt < g) {
    const V = h([Zt, Gt], !0);
    Tn = V.kind === qn.NewRow || V.kind === qn.Marker && V.markerKind !== "number", Mo = V.kind === Z.Boolean && el(V), _r = V.cursor;
  }
  const Ro = G ? "grabbing" : (yt ?? !1) || H ? "col-resize" : Kt || v ? "crosshair" : _r !== void 0 ? _r : Yt || Tn || Mo || _n ? "pointer" : "default", ri = d.useMemo(() => ({
    // width,
    // height,
    contain: "strict",
    display: "block",
    cursor: Ro
  }), [Ro]), Gn = d.useRef("default"), Cn = ie?.current;
  Cn != null && Gn.current !== ri.cursor && (Cn.style.cursor = Gn.current = ri.cursor);
  const ii = d.useCallback((V, Q, Me, Te) => {
    if (et === void 0)
      return;
    const ge = et(V);
    if (ge.actions !== void 0) {
      const pe = af(Q, ge.actions);
      for (const [je, Ee] of pe.entries())
        if (Zr(Ee, Me + Q.x, Te + Ee.y))
          return ge.actions[je];
    }
  }, [et]), cr = d.useCallback((V, Q, Me, Te) => {
    const ge = Mt[Q];
    if (!G && !H && !(yt ?? !1)) {
      const pe = Ft(V, Q, -1);
      Vn(pe !== void 0);
      const je = sf(void 0, ge, pe.x, pe.y, pe.width, pe.height, ke, rl(ge.title) === "rtl");
      if (ge.hasMenu === !0 && je.menuBounds !== void 0 && Zr(je.menuBounds, Me, Te))
        return {
          area: "menu",
          bounds: je.menuBounds
        };
      if (ge.indicatorIcon !== void 0 && je.indicatorIconBounds !== void 0 && Zr(je.indicatorIconBounds, Me, Te))
        return {
          area: "indicator",
          bounds: je.indicatorIconBounds
        };
    }
  }, [Mt, Ft, yt, G, H, ke]), oi = d.useRef(0), br = d.useRef(), ai = d.useRef(!1), si = d.useCallback((V) => {
    const Q = Xe.current, Me = ie?.current;
    if (Q === null || V.target !== Q && V.target !== Me)
      return;
    ai.current = !0;
    const Te = V.clientX, ge = V.clientY;
    if (V.target === Me && Me !== null) {
      const je = Me.getBoundingClientRect();
      if (Te > je.right || ge > je.bottom)
        return;
    }
    const pe = mt(Q, Te, ge, V);
    br.current = pe.location, pe.isTouch && (oi.current = Date.now()), un.current !== pe.isTouch && Pn(pe.isTouch), !(pe.kind === Ir && cr(Q, pe.location[0], Te, ge) !== void 0) && (pe.kind === Jn && ii(pe.group, pe.bounds, pe.localEventX, pe.localEventY) !== void 0 || (T?.(pe), !pe.isTouch && ne !== !0 && ne !== pe.kind && pe.button < 3 && pe.button !== 1 && V.preventDefault()));
  }, [
    ie,
    ne,
    mt,
    ii,
    cr,
    T
  ]);
  xn("pointerdown", si, wt, !1);
  const Ar = d.useRef(0), wr = d.useCallback((V) => {
    const Q = Ar.current;
    Ar.current = Date.now();
    const Me = Xe.current;
    if (ai.current = !1, O === void 0 || Me === null)
      return;
    const Te = ie?.current, ge = V.target !== Me && V.target !== Te, pe = V.clientX, je = V.clientY, Ee = V.pointerType === "mouse" ? V.button < 3 : !0;
    let Ze = mt(Me, pe, je, V);
    Ze.isTouch && oi.current !== 0 && Date.now() - oi.current > 500 && (Ze = {
      ...Ze,
      isLongTouch: !0
    }), Q !== 0 && Date.now() - Q < (Ze.isTouch ? 1e3 : 500) && (Ze = {
      ...Ze,
      isDoubleClick: !0
    }), un.current !== Ze.isTouch && Pn(Ze.isTouch), !ge && V.cancelable && Ee && V.preventDefault();
    const [vt] = Ze.location, gn = cr(Me, vt, pe, je);
    if (Ze.kind === Ir && gn !== void 0) {
      (Ze.button !== 0 || br.current?.[0] !== vt || br.current?.[1] !== -1) && O(Ze, !0);
      return;
    } else if (Ze.kind === Jn) {
      const jt = ii(Ze.group, Ze.bounds, Ze.localEventX, Ze.localEventY);
      if (jt !== void 0) {
        Ze.button === 0 && jt.onClick(Ze);
        return;
      }
    }
    O(Ze, ge);
  }, [O, ie, mt, cr, ii]);
  xn("pointerup", wr, wt, !1);
  const li = d.useCallback((V) => {
    const Q = Xe.current;
    if (Q === null)
      return;
    const Me = ie?.current, Te = V.target !== Q && V.target !== Me;
    let ge, pe, je = !0;
    V instanceof MouseEvent ? (ge = V.clientX, pe = V.clientY, je = V.button < 3) : (ge = V.changedTouches[0].clientX, pe = V.changedTouches[0].clientY);
    const Ee = mt(Q, ge, pe, V);
    un.current !== Ee.isTouch && Pn(Ee.isTouch), !Te && V.cancelable && je && V.preventDefault();
    const [Ze] = Ee.location;
    if (Ee.kind === Ir) {
      const vt = cr(Q, Ze, ge, pe);
      vt !== void 0 && Ee.button === 0 && br.current?.[0] === Ze && br.current?.[1] === -1 && (vt.area === "menu" ? m?.(Ze, vt.bounds) : vt.area === "indicator" && w?.(Ze, vt.bounds));
    }
  }, [ie, mt, cr, m, w]);
  xn("click", li, wt, !1);
  const Fa = d.useCallback((V) => {
    const Q = Xe.current, Me = ie?.current;
    if (Q === null || V.target !== Q && V.target !== Me || x === void 0)
      return;
    const Te = mt(Q, V.clientX, V.clientY, V);
    x(Te, () => {
      V.cancelable && V.preventDefault();
    });
  }, [ie, mt, x]);
  xn("contextmenu", Fa, ie?.current ?? null, !1);
  const Ai = d.useCallback((V) => {
    Pt.current = new go(V.map((Q) => Q.item)), Dn.current = V, En.current(), Pt.current = void 0;
  }, []), He = d.useMemo(() => new gv(Ai), [Ai]), Hi = d.useRef(He);
  Hi.current = He, d.useLayoutEffect(() => {
    const V = Hi.current;
    if (Mn === void 0 || Mn[1] < 0) {
      V.setHovered(Mn);
      return;
    }
    const Q = h(Mn, !0), Me = De(Q), Te = Me === void 0 && Q.kind === Z.Custom || Me?.needsHover !== void 0 && (typeof Me.needsHover == "boolean" ? Me.needsHover : Me.needsHover(Q));
    V.setHovered(Te ? Mn : void 0);
  }, [h, De, Mn]);
  const Eo = d.useRef(), Hr = d.useCallback((V) => {
    const Q = Xe.current;
    if (Q === null)
      return;
    const Me = ie?.current, Te = V.target !== Q && V.target !== Me, ge = mt(Q, V.clientX, V.clientY, V);
    if (ge.kind !== "out-of-bounds" && Te && !ai.current && !ge.isTouch)
      return;
    const pe = (Ee, Ze) => {
      On((vt) => vt === Ee || vt?.[0][0] === Ee?.[0][0] && vt?.[0][1] === Ee?.[0][1] && (vt?.[1][0] === Ee?.[1][0] && vt?.[1][1] === Ee?.[1][1] || !Ze) ? vt : Ee);
    };
    if (!cf(ge, Eo.current))
      ct(void 0), q?.(ge), pe(ge.kind === va ? void 0 : [ge.location, [ge.localEventX, ge.localEventY]], !0), Eo.current = ge;
    else if (ge.kind === "cell" || ge.kind === Ir || ge.kind === Jn) {
      let Ee = !1, Ze = !0;
      if (ge.kind === "cell") {
        const gn = h(ge.location);
        Ze = De(gn)?.needsHoverPosition ?? gn.kind === Z.Custom, Ee = Ze;
      } else
        Ee = !0;
      const vt = [ge.location, [ge.localEventX, ge.localEventY]];
      pe(vt, Ze), Nn.current = vt, Ee && In(new go([ge.location]));
    }
    const je = ge.location[0] >= (ue ? 0 : 1);
    Qt(ge.kind === Ir && ge.isEdge && je && oe === !0), Bn(ge.kind === "cell" && ge.isFillHandle), k?.(V), N(ge);
  }, [
    ie,
    mt,
    ue,
    oe,
    k,
    N,
    q,
    h,
    De,
    In
  ]);
  xn("pointermove", Hr, wt, !0);
  const _a = d.useCallback((V) => {
    const Q = Xe.current;
    if (Q === null)
      return;
    let Me, Te;
    R.current !== void 0 && (Me = Ft(Q, R.current.cell[0], R.current.cell[1]), Te = R.current.cell), ee?.({
      bounds: Me,
      stopPropagation: () => V.stopPropagation(),
      preventDefault: () => V.preventDefault(),
      cancel: () => {
      },
      ctrlKey: V.ctrlKey,
      metaKey: V.metaKey,
      shiftKey: V.shiftKey,
      altKey: V.altKey,
      key: V.key,
      keyCode: V.keyCode,
      rawEvent: V,
      location: Te
    });
  }, [ee, R, Ft]), rr = d.useCallback((V) => {
    const Q = Xe.current;
    if (Q === null)
      return;
    let Me, Te;
    R.current !== void 0 && (Me = Ft(Q, R.current.cell[0], R.current.cell[1]), Te = R.current.cell), te?.({
      bounds: Me,
      stopPropagation: () => V.stopPropagation(),
      preventDefault: () => V.preventDefault(),
      cancel: () => {
      },
      ctrlKey: V.ctrlKey,
      metaKey: V.metaKey,
      shiftKey: V.shiftKey,
      altKey: V.altKey,
      key: V.key,
      keyCode: V.keyCode,
      rawEvent: V,
      location: Te
    });
  }, [te, R, Ft]), zi = d.useCallback((V) => {
    if (Xe.current = V, le !== void 0 && (le.current = V), qe?.eventTarget)
      kt.current = qe.eventTarget;
    else if (V === null)
      kt.current = window;
    else {
      const Q = V.getRootNode();
      Q === document && (kt.current = window), kt.current = Q;
    }
  }, [le, qe?.eventTarget]), Io = d.useCallback((V) => {
    const Q = Xe.current;
    if (Q === null || ne === !1 || H) {
      V.preventDefault();
      return;
    }
    let Me, Te;
    const ge = mt(Q, V.clientX, V.clientY);
    if (ne !== !0 && ge.kind !== ne) {
      V.preventDefault();
      return;
    }
    const pe = (jt, Rt) => {
      Me = jt, Te = Rt;
    };
    let je, Ee, Ze;
    const vt = (jt, Rt, ut) => {
      je = jt, Ee = Rt, Ze = ut;
    };
    let gn = !1;
    if (he?.({
      ...ge,
      setData: pe,
      setDragImage: vt,
      preventDefault: () => gn = !0,
      defaultPrevented: () => gn
    }), !gn && Me !== void 0 && Te !== void 0 && V.dataTransfer !== null)
      if (V.dataTransfer.setData(Me, Te), V.dataTransfer.effectAllowed = "copyLink", je !== void 0 && Ee !== void 0 && Ze !== void 0)
        V.dataTransfer.setDragImage(je, Ee, Ze);
      else {
        const [jt, Rt] = ge.location;
        if (Rt !== void 0) {
          const ut = document.createElement("canvas"), Ye = Ft(Q, jt, Rt);
          Vn(Ye !== void 0);
          const dt = Math.ceil(window.devicePixelRatio ?? 1);
          ut.width = Ye.width * dt, ut.height = Ye.height * dt;
          const $t = ut.getContext("2d");
          $t !== null && ($t.scale(dt, dt), $t.textBaseline = "middle", Rt === -1 ? ($t.font = ke.headerFontFull, $t.fillStyle = ke.bgHeader, $t.fillRect(0, 0, ut.width, ut.height), lf($t, 0, 0, Ye.width, Ye.height, Mt[jt], !1, ke, !1, void 0, void 0, !1, 0, cn, se, !1)) : ($t.font = ke.baseFontFull, $t.fillStyle = ke.bgCell, $t.fillRect(0, 0, ut.width, ut.height), of($t, h([jt, Rt]), 0, Rt, !1, !1, 0, 0, Ye.width, Ye.height, !1, ke, ke.bgCell, Ot, cn, 1, void 0, !1, 0, void 0, void 0, void 0, Ge, De, () => {
          }))), ut.style.left = "-100%", ut.style.position = "absolute", ut.style.width = `${Ye.width}px`, ut.style.height = `${Ye.height}px`, document.body.append(ut), V.dataTransfer.setDragImage(ut, Ye.width / 2, Ye.height / 2), window.setTimeout(() => {
            ut.remove();
          }, 0);
        }
      }
    else
      V.preventDefault();
  }, [
    ne,
    H,
    mt,
    he,
    Ft,
    ke,
    Mt,
    cn,
    se,
    h,
    Ot,
    Ge,
    De
  ]);
  xn("dragstart", Io, ie?.current ?? null, !1, !1);
  const ui = d.useRef(), Aa = d.useCallback((V) => {
    const Q = Xe.current;
    if (ye !== void 0 && V.preventDefault(), Q === null || fe === void 0)
      return;
    const Me = mt(Q, V.clientX, V.clientY), [Te, ge] = Me.location, pe = Te - (ue ? 0 : 1), [je, Ee] = ui.current ?? [];
    (je !== pe || Ee !== ge) && (ui.current = [pe, ge], fe([pe, ge], V.dataTransfer));
  }, [ue, mt, fe, ye]);
  xn("dragover", Aa, ie?.current ?? null, !1, !1);
  const Ha = d.useCallback(() => {
    ui.current = void 0, de?.();
  }, [de]);
  xn("dragend", Ha, ie?.current ?? null, !1, !1);
  const ir = d.useCallback((V) => {
    const Q = Xe.current;
    if (Q === null || ye === void 0)
      return;
    V.preventDefault();
    const Me = mt(Q, V.clientX, V.clientY), [Te, ge] = Me.location, pe = Te - (ue ? 0 : 1);
    ye([pe, ge], V.dataTransfer);
  }, [ue, mt, ye]);
  xn("drop", ir, ie?.current ?? null, !1, !1);
  const yr = d.useCallback(() => {
    $e?.();
  }, [$e]);
  xn("dragleave", yr, ie?.current ?? null, !1, !1);
  const An = d.useRef(R);
  An.current = R;
  const U = d.useRef(null), Vt = d.useCallback((V) => {
    Xe.current === null || !Xe.current.contains(document.activeElement) || (V === null && An.current.current !== void 0 ? le?.current?.focus({
      preventScroll: !0
    }) : V !== null && V.focus({
      preventScroll: !0
    }), U.current = V);
  }, [le]);
  d.useImperativeHandle(t, () => ({
    focus: () => {
      const V = U.current;
      V === null || !document.contains(V) ? le?.current?.focus({
        preventScroll: !0
      }) : V.focus({
        preventScroll: !0
      });
    },
    getBounds: (V, Q) => {
      if (!(le === void 0 || le.current === null))
        return Ft(le.current, V ?? 0, Q ?? -1);
    },
    damage: _t,
    getMouseArgsForPosition: (V, Q, Me) => {
      if (!(le === void 0 || le.current === null))
        return mt(le.current, V, Q, Me);
    }
  }), [le, _t, Ft, mt]);
  const dr = d.useRef(), za = um(() => {
    if (n < 50 || qe?.disableAccessibilityTree === !0)
      return null;
    let V = $s(Mt, nt, n, Y, Le);
    const Q = ue ? 0 : -1;
    !ue && V[0]?.sourceIndex === 0 && (V = V.slice(1));
    const [Me, Te] = R.current?.cell ?? [], ge = R.current?.range, pe = V.map((Ee) => Ee.sourceIndex), je = Dr(a, Math.min(g, a + i));
    return Me !== void 0 && Te !== void 0 && !(pe.includes(Me) && je.includes(Te)) && Vt(null), d.createElement(
      "table",
      { key: "access-tree", role: "grid", "aria-rowcount": g + 1, "aria-multiselectable": "true", "aria-colcount": Mt.length + Q },
      d.createElement(
        "thead",
        { role: "rowgroup" },
        d.createElement("tr", { role: "row", "aria-rowindex": 1 }, V.map((Ee) => d.createElement("th", { role: "columnheader", "aria-selected": R.columns.hasIndex(Ee.sourceIndex), "aria-colindex": Ee.sourceIndex + 1 + Q, tabIndex: -1, onFocus: (Ze) => {
          if (Ze.target !== U.current)
            return we?.([Ee.sourceIndex, -1]);
        }, key: Ee.sourceIndex }, Ee.title)))
      ),
      d.createElement("tbody", { role: "rowgroup" }, je.map((Ee) => d.createElement("tr", { role: "row", "aria-selected": R.rows.hasIndex(Ee), key: Ee, "aria-rowindex": Ee + 2 }, V.map((Ze) => {
        const vt = Ze.sourceIndex, gn = Qn(vt, Ee), jt = Me === vt && Te === Ee, Rt = ge !== void 0 && vt >= ge.x && vt < ge.x + ge.width && Ee >= ge.y && Ee < ge.y + ge.height, ut = `glide-cell-${vt}-${Ee}`, Ye = [vt, Ee], dt = h(Ye, !0);
        return d.createElement("td", { key: gn, role: "gridcell", "aria-colindex": vt + 1 + Q, "aria-selected": Rt, "aria-readonly": Ii(dt) || !Ri(dt), id: ut, "data-testid": ut, onClick: () => {
          const $t = le?.current;
          if ($t != null)
            return ee?.({
              bounds: Ft($t, vt, Ee),
              cancel: () => {
              },
              preventDefault: () => {
              },
              stopPropagation: () => {
              },
              ctrlKey: !1,
              key: "Enter",
              keyCode: 13,
              metaKey: !1,
              shiftKey: !1,
              altKey: !1,
              rawEvent: void 0,
              location: Ye
            });
        }, onFocusCapture: ($t) => {
          if (!($t.target === U.current || dr.current?.[0] === vt && dr.current?.[1] === Ee))
            return dr.current = Ye, we?.(Ye);
        }, ref: jt ? Vt : void 0, tabIndex: -1 }, bv(dt, De));
      }))))
    );
  }, [
    n,
    Mt,
    nt,
    Y,
    Le,
    g,
    a,
    i,
    R,
    Vt,
    h,
    le,
    ee,
    Ft,
    we
  ], 200), zr = P === 0 || !F ? 0 : nt > P ? 1 : jn(-Le / 100, 0, 1), Va = -a * 32 + ht, ci = D ? jn(-Va / 100, 0, 1) : 0, zl = d.useMemo(() => {
    if (!zr && !ci)
      return null;
    const V = {
      position: "absolute",
      top: 0,
      left: Fn,
      width: n - Fn,
      height: r,
      opacity: zr,
      pointerEvents: "none",
      transition: tt ? void 0 : "opacity 0.2s",
      boxShadow: "inset 13px 0 10px -13px rgba(0, 0, 0, 0.2)"
    }, Q = {
      position: "absolute",
      top: Ln,
      left: 0,
      width: n,
      height: r,
      opacity: ci,
      pointerEvents: "none",
      transition: Re ? void 0 : "opacity 0.2s",
      boxShadow: "inset 0 13px 10px -13px rgba(0, 0, 0, 0.2)"
    };
    return d.createElement(
      d.Fragment,
      null,
      zr > 0 && d.createElement("div", { id: "shadow-x", style: V }),
      ci > 0 && d.createElement("div", { id: "shadow-y", style: Q })
    );
  }, [zr, ci, Fn, n, tt, Ln, r, Re]), X = d.useMemo(() => ({
    position: "absolute",
    top: 0,
    left: 0
  }), []);
  return d.createElement(
    d.Fragment,
    null,
    d.createElement("canvas", { "data-testid": "data-grid-canvas", tabIndex: 0, onKeyDown: _a, onKeyUp: rr, onFocus: C, onBlur: I, ref: zi, style: ri }, za),
    d.createElement("canvas", { ref: kn, style: X }),
    zl
  );
}, yv = d.memo(d.forwardRef(wv));
function io(e, t, n, r) {
  return jn(Math.round(t - (e.growOffset ?? 0)), Math.ceil(n), Math.floor(r));
}
const Cv = (e) => {
  const [t, n] = d.useState(), [r, i] = d.useState(), [o, s] = d.useState(), [a, l] = d.useState(), [u, c] = d.useState(!1), [f, g] = d.useState(), [h, p] = d.useState(), [m, w] = d.useState(), [b, v] = d.useState(!1), [C, I] = d.useState(), { onHeaderMenuClick: E, onHeaderIndicatorClick: R, getCellContent: P, onColumnMoved: x, onColumnResize: S, onColumnResizeStart: F, onColumnResizeEnd: D, gridRef: M, maxColumnWidth: T, minColumnWidth: O, onRowMoved: k, lockColumns: N, onColumnProposeMove: q, onMouseDown: Y, onMouseUp: ue, onItemHovered: ee, onDragStart: te, canvasRef: ce } = e, le = (S ?? D ?? F) !== void 0, { columns: he, selection: de } = e, ie = de.columns, H = d.useCallback((re) => {
    const [se, we] = re.location;
    o !== void 0 && a !== se && se >= N ? (c(!0), l(se)) : h !== void 0 && we !== void 0 ? (v(!0), w(Math.max(0, we))) : r === void 0 && !u && !b && ee?.(re);
  }, [o, h, a, ee, N, r, u, b]), L = x !== void 0, G = d.useCallback((re) => {
    if (re.button === 0) {
      const [se, we] = re.location;
      if (re.kind === "out-of-bounds" && re.isEdge && le) {
        const fe = M?.current?.getBounds(he.length - 1, -1);
        fe !== void 0 && (n(fe.x), i(he.length - 1));
      } else if (re.kind === "header" && se >= N) {
        const fe = ce?.current;
        if (re.isEdge && le && fe) {
          n(re.bounds.x), i(se);
          const $e = fe.getBoundingClientRect().width / fe.offsetWidth, _e = re.bounds.width / $e;
          F?.(he[se], _e, se, _e + (he[se].growOffset ?? 0));
        } else re.kind === "header" && L && (g(re.bounds.x), s(se));
      } else re.kind === "cell" && N > 0 && se === 0 && we !== void 0 && k !== void 0 && (I(re.bounds.y), p(we));
    }
    Y?.(re);
  }, [Y, le, N, k, M, he, L, F, ce]), ne = d.useCallback((re, se) => {
    u || b || E?.(re, se);
  }, [u, b, E]), oe = d.useCallback((re, se) => {
    u || b || R?.(re, se);
  }, [u, b, R]), xe = d.useRef(-1), ve = d.useCallback(() => {
    xe.current = -1, p(void 0), w(void 0), I(void 0), v(!1), s(void 0), l(void 0), g(void 0), c(!1), i(void 0), n(void 0);
  }, []), et = d.useCallback((re, se) => {
    if (re.button === 0) {
      if (r !== void 0) {
        if (ie?.hasIndex(r) === !0)
          for (const fe of ie) {
            if (fe === r)
              continue;
            const ye = he[fe], $e = io(ye, xe.current, O, T);
            S?.(ye, $e, fe, $e + (ye.growOffset ?? 0));
          }
        const we = io(he[r], xe.current, O, T);
        if (D?.(he[r], we, r, we + (he[r].growOffset ?? 0)), ie.hasIndex(r))
          for (const fe of ie) {
            if (fe === r)
              continue;
            const ye = he[fe], $e = io(ye, xe.current, O, T);
            D?.(ye, $e, fe, $e + (ye.growOffset ?? 0));
          }
      }
      ve(), o !== void 0 && a !== void 0 && q?.(o, a) !== !1 && x?.(o, a), h !== void 0 && m !== void 0 && k?.(h, m);
    }
    ue?.(re, se);
  }, [
    ue,
    r,
    o,
    a,
    h,
    m,
    ie,
    D,
    he,
    O,
    T,
    S,
    x,
    k,
    ve,
    q
  ]), ke = d.useMemo(() => {
    if (!(o === void 0 || a === void 0) && o !== a && q?.(o, a) !== !1)
      return {
        src: o,
        dest: a
      };
  }, [o, a, q]), bt = d.useCallback((re) => {
    const se = ce?.current;
    if (o !== void 0 && f !== void 0)
      Math.abs(re.clientX - f) > 20 && c(!0);
    else if (h !== void 0 && C !== void 0)
      Math.abs(re.clientY - C) > 20 && v(!0);
    else if (r !== void 0 && t !== void 0 && se) {
      const fe = se.getBoundingClientRect().width / se.offsetWidth, ye = (re.clientX - t) / fe, $e = he[r], _e = io($e, ye, O, T);
      if (S?.($e, _e, r, _e + ($e.growOffset ?? 0)), xe.current = ye, ie?.first() === r)
        for (const tt of ie) {
          if (tt === r)
            continue;
          const Re = he[tt], qe = io(Re, xe.current, O, T);
          S?.(Re, qe, tt, qe + (Re.growOffset ?? 0));
        }
    }
  }, [
    o,
    f,
    h,
    C,
    r,
    t,
    he,
    O,
    T,
    S,
    ie,
    ce
  ]), St = d.useCallback((re, se) => {
    if (h === void 0 || m === void 0)
      return P(re, se);
    let [we, fe] = re;
    return fe === m ? fe = h : (fe > m && (fe -= 1), fe >= h && (fe += 1)), P([we, fe], se);
  }, [h, m, P]), Ue = d.useCallback((re) => {
    te?.(re), re.defaultPrevented() || ve();
  }, [ve, te]);
  return d.createElement(yv, { accessibilityHeight: e.accessibilityHeight, canvasRef: e.canvasRef, cellXOffset: e.cellXOffset, cellYOffset: e.cellYOffset, columns: e.columns, disabledRows: e.disabledRows, drawFocusRing: e.drawFocusRing, drawHeader: e.drawHeader, drawCell: e.drawCell, enableGroups: e.enableGroups, eventTargetRef: e.eventTargetRef, experimental: e.experimental, fillHandle: e.fillHandle, firstColAccessible: e.firstColAccessible, fixedShadowX: e.fixedShadowX, fixedShadowY: e.fixedShadowY, freezeColumns: e.freezeColumns, getCellRenderer: e.getCellRenderer, getGroupDetails: e.getGroupDetails, getRowThemeOverride: e.getRowThemeOverride, groupHeaderHeight: e.groupHeaderHeight, headerHeight: e.headerHeight, headerIcons: e.headerIcons, height: e.height, highlightRegions: e.highlightRegions, imageWindowLoader: e.imageWindowLoader, resizeColumn: r, isDraggable: e.isDraggable, isFilling: e.isFilling, isFocused: e.isFocused, onCanvasBlur: e.onCanvasBlur, onCanvasFocused: e.onCanvasFocused, onCellFocused: e.onCellFocused, onContextMenu: e.onContextMenu, onDragEnd: e.onDragEnd, onDragLeave: e.onDragLeave, onDragOverCell: e.onDragOverCell, onDrop: e.onDrop, onKeyDown: e.onKeyDown, onKeyUp: e.onKeyUp, onMouseMove: e.onMouseMove, prelightCells: e.prelightCells, rowHeight: e.rowHeight, rows: e.rows, selection: e.selection, smoothScrollX: e.smoothScrollX, smoothScrollY: e.smoothScrollY, theme: e.theme, freezeTrailingRows: e.freezeTrailingRows, hasAppendRow: e.hasAppendRow, translateX: e.translateX, translateY: e.translateY, resizeIndicator: e.resizeIndicator, verticalBorder: e.verticalBorder, width: e.width, getCellContent: St, isResizing: r !== void 0, onHeaderMenuClick: ne, onHeaderIndicatorClick: oe, isDragging: u, onItemHovered: H, onDragStart: Ue, onMouseDown: G, allowResize: le, onMouseUp: et, dragAndDropState: ke, onMouseMoveRaw: bt, ref: M });
};
function Sv(e) {
  const t = d.useRef(null), [n, r] = d.useState({
    width: e?.[0],
    height: e?.[1]
  });
  return d.useLayoutEffect(() => {
    const i = (s) => {
      for (const a of s) {
        const { width: l, height: u } = a && a.contentRect || {};
        r((c) => c.width === l && c.height === u ? c : { width: l, height: u });
      }
    }, o = new window.ResizeObserver(i);
    return t.current && o.observe(t.current, void 0), () => {
      o.disconnect();
    };
  }, [t.current]), { ref: t, ...n };
}
const xv = (e, t, n) => {
  const r = d.useRef(null), i = d.useRef(null), o = d.useRef(null), s = d.useRef(0), a = d.useRef(t);
  a.current = t;
  const l = n.current;
  d.useEffect(() => {
    const u = () => {
      if (i.current === !1 && l !== null) {
        const g = [l.scrollLeft, l.scrollTop];
        if (o.current?.[0] === g[0] && o.current?.[1] === g[1])
          if (s.current > 10) {
            o.current = null, i.current = null;
            return;
          } else
            s.current++;
        else
          s.current = 0, a.current(g[0], g[1]), o.current = g;
        r.current = window.setTimeout(u, 8.333333333333334);
      }
    }, c = () => {
      i.current = !0, o.current = null, r.current !== null && (window.clearTimeout(r.current), r.current = null);
    }, f = (g) => {
      g.touches.length === 0 && (i.current = !1, s.current = 0, r.current = window.setTimeout(u, 8.333333333333334));
    };
    if (e && l !== null) {
      const g = l;
      return g.addEventListener("touchstart", c), g.addEventListener("touchend", f), () => {
        g.removeEventListener("touchstart", c), g.removeEventListener("touchend", f), r.current !== null && window.clearTimeout(r.current);
      };
    }
  }, [e, l]);
}, kv = () => (e) => e.isSafari ? "scroll" : "auto", Mv = /* @__PURE__ */ fn("div")({
  name: "ScrollRegionStyle",
  class: "gdg-s1dgczr6",
  propsAsIs: !1,
  vars: {
    "s1dgczr6-0": [kv()]
  }
}), Rv = 33554400, Ev = 5e6;
function Iv(e) {
  const [t, n] = d.useState(!1), r = typeof window > "u" ? null : window, i = d.useRef(0);
  return xn("touchstart", d.useCallback(() => {
    window.clearTimeout(i.current), n(!0);
  }, []), r, !0, !1), xn("touchend", d.useCallback((o) => {
    o.touches.length === 0 && (i.current = window.setTimeout(() => n(!1), e));
  }, [e]), r, !0, !1), t;
}
const Tv = (e) => {
  const {
    children: t,
    clientHeight: n,
    scrollHeight: r,
    scrollWidth: i,
    update: o,
    draggable: s,
    className: a,
    preventDiagonalScrolling: l = !1,
    paddingBottom: u = 0,
    paddingRight: c = 0,
    rightElement: f,
    rightElementProps: g,
    kineticScrollPerfHack: h = !1,
    scrollRef: p,
    initialSize: m
  } = e, w = [], b = g?.sticky ?? !1, v = g?.fill ?? !1, C = d.useRef(0), I = d.useRef(0), E = d.useRef(null), R = typeof window > "u" ? 1 : window.devicePixelRatio, P = d.useRef(R);
  d.useEffect(() => {
    if (P.current !== R) {
      C.current = 0, I.current = 0, P.current = R;
      const de = E.current;
      de !== null && k.current(de.scrollLeft, de.scrollTop);
    }
  }, [R]);
  const x = d.useRef({
    scrollLeft: 0,
    scrollTop: 0,
    lockDirection: void 0
  }), S = d.useRef(null), F = Iv(200), [D, M] = d.useState(!0), T = d.useRef(0);
  d.useLayoutEffect(() => {
    if (!D || F || x.current.lockDirection === void 0) return;
    const de = E.current;
    if (de === null) return;
    const [ie, H] = x.current.lockDirection;
    ie !== void 0 ? de.scrollLeft = ie : H !== void 0 && (de.scrollTop = H), x.current.lockDirection = void 0;
  }, [F, D]);
  const O = d.useCallback((de, ie) => {
    const H = E.current;
    if (H === null) return;
    ie = ie ?? H.scrollTop, de = de ?? H.scrollLeft;
    const L = x.current.scrollTop, G = x.current.scrollLeft, ne = de - G, oe = ie - L;
    F && ne !== 0 && oe !== 0 && (Math.abs(ne) > 3 || Math.abs(oe) > 3) && l && x.current.lockDirection === void 0 && (x.current.lockDirection = Math.abs(ne) < Math.abs(oe) ? [G, void 0] : [void 0, L]);
    const xe = x.current.lockDirection;
    de = xe?.[0] ?? de, ie = xe?.[1] ?? ie, x.current.scrollLeft = de, x.current.scrollTop = ie;
    const ve = H.clientWidth, et = H.clientHeight, ke = ie, bt = I.current - ke, St = H.scrollHeight - et;
    I.current = ke;
    let Ue;
    if (St > 0 && r > H.scrollHeight + 5)
      if (Math.abs(bt) > 2e3 || ke === 0 || ke === St) {
        const re = Math.max(0, Math.min(1, ke / St)), se = r - et;
        Ue = re * se, C.current = Ue;
      } else
        C.current -= bt, Ue = C.current;
    else
      Ue = ke, C.current = Ue;
    Ue = Math.max(0, Math.min(Ue, r - et)), C.current = Ue, xe !== void 0 && (window.clearTimeout(T.current), M(!1), T.current = window.setTimeout(() => M(!0), 200)), o({
      x: de,
      y: Ue,
      width: ve - c,
      height: et - u,
      paddingRight: S.current?.clientWidth ?? 0
    });
  }, [u, c, r, o, l, F]);
  xv(h && pa.value, O, E);
  const k = d.useRef(O);
  k.current = O;
  const N = d.useRef(), q = d.useRef(!1);
  d.useLayoutEffect(() => {
    q.current ? O() : q.current = !0;
  }, [O, u, c]);
  const Y = d.useCallback((de) => {
    E.current = de, p !== void 0 && (p.current = de);
  }, [p]);
  let ue = 0, ee = 0;
  const te = Math.min(r, Rv);
  for (w.push(d.createElement("div", {
    key: ue++,
    style: {
      width: i,
      height: 0
    }
  })); ee < te; ) {
    const de = Math.min(Ev, te - ee);
    w.push(d.createElement("div", {
      key: ue++,
      style: {
        width: 0,
        height: de
      }
    })), ee += de;
  }
  const {
    ref: ce,
    width: le,
    height: he
  } = Sv(m);
  return typeof window < "u" && (N.current?.height !== he || N.current?.width !== le) && (window.setTimeout(() => k.current(), 0), N.current = {
    width: le,
    height: he
  }), (le ?? 0) === 0 || (he ?? 0) === 0 ? d.createElement("div", {
    ref: ce
  }) : d.createElement("div", {
    ref: ce
  }, d.createElement(Mv, {
    isSafari: pa.value
  }, d.createElement("div", {
    className: "dvn-underlay"
  }, t), d.createElement("div", {
    ref: Y,
    style: N.current,
    draggable: s,
    onDragStart: (de) => {
      s || (de.stopPropagation(), de.preventDefault());
    },
    className: "dvn-scroller " + (a ?? ""),
    onScroll: () => O()
  }, d.createElement("div", {
    className: "dvn-scroll-inner" + (f === void 0 ? " dvn-hidden" : "")
  }, d.createElement("div", {
    className: "dvn-stack"
  }, w), f !== void 0 && d.createElement(d.Fragment, null, !v && d.createElement("div", {
    className: "dvn-spacer"
  }), d.createElement("div", {
    ref: S,
    style: {
      height: he,
      maxHeight: n - Math.ceil(R % 1),
      position: "sticky",
      top: 0,
      paddingLeft: 1,
      marginBottom: -40,
      marginRight: c,
      flexGrow: v ? 1 : void 0,
      right: b ? c ?? 0 : void 0,
      pointerEvents: "auto"
    }
  }, f))))));
}, Dv = (e) => {
  const { columns: t, rows: n, rowHeight: r, headerHeight: i, groupHeaderHeight: o, enableGroups: s, freezeColumns: a, experimental: l, nonGrowWidth: u, clientSize: c, className: f, onVisibleRegionChanged: g, scrollRef: h, preventDiagonalScrolling: p, rightElement: m, rightElementProps: w, overscrollX: b, overscrollY: v, initialSize: C, smoothScrollX: I = !1, smoothScrollY: E = !1, isDraggable: R } = e, { paddingRight: P, paddingBottom: x } = l ?? {}, [S, F] = c, D = d.useRef(), M = d.useRef(), T = d.useRef(), O = d.useRef(), k = u + Math.max(0, b ?? 0);
  let N = s ? i + o : i;
  if (typeof r == "number")
    N += n * r;
  else
    for (let ee = 0; ee < n; ee++)
      N += r(ee);
  v !== void 0 && (N += v);
  const q = d.useRef(), Y = d.useCallback(() => {
    if (q.current === void 0)
      return;
    const ee = { ...q.current };
    let te = 0, ce = ee.x < 0 ? -ee.x : 0, le = 0, he = 0;
    ee.x = ee.x < 0 ? 0 : ee.x;
    let de = 0;
    for (let oe = 0; oe < a; oe++)
      de += t[oe].width;
    for (const oe of t) {
      const xe = te - de;
      if (ee.x >= xe + oe.width)
        te += oe.width, he++, le++;
      else if (ee.x > xe)
        te += oe.width, I ? ce += xe - ee.x : he++, le++;
      else if (ee.x + ee.width > xe)
        te += oe.width, le++;
      else
        break;
    }
    let ie = 0, H = 0, L = 0;
    if (typeof r == "number")
      E ? (H = Math.floor(ee.y / r), ie = H * r - ee.y) : H = Math.ceil(ee.y / r), L = Math.ceil(ee.height / r) + H, ie < 0 && L++;
    else {
      let oe = 0;
      for (let xe = 0; xe < n; xe++) {
        const ve = r(xe), et = oe + (E ? 0 : ve / 2);
        if (ee.y >= oe + ve)
          oe += ve, H++, L++;
        else if (ee.y > et)
          oe += ve, E ? ie += et - ee.y : H++, L++;
        else if (ee.y + ee.height > ve / 2 + oe)
          oe += ve, L++;
        else
          break;
      }
    }
    H = Math.max(0, Math.min(H, n - 1)), L = Math.max(H, Math.min(L, n));
    const G = {
      x: he,
      y: H,
      width: le - he,
      height: L - H
    }, ne = D.current;
    (ne === void 0 || ne.y !== G.y || ne.x !== G.x || ne.height !== G.height || ne.width !== G.width || M.current !== ce || T.current !== ie || ee.width !== O.current?.[0] || ee.height !== O.current?.[1]) && (g?.({
      x: he,
      y: H,
      width: le - he,
      height: L - H
    }, ee.width, ee.height, ee.paddingRight ?? 0, ce, ie), D.current = G, M.current = ce, T.current = ie, O.current = [ee.width, ee.height]);
  }, [t, r, n, g, a, I, E]), ue = d.useCallback((ee) => {
    q.current = ee, Y();
  }, [Y]);
  return d.useEffect(() => {
    Y();
  }, [Y]), d.createElement(
    Tv,
    { scrollRef: h, className: f, kineticScrollPerfHack: l?.kineticScrollPerfHack, preventDiagonalScrolling: p, draggable: R === !0 || typeof R == "string", scrollWidth: k + (P ?? 0), scrollHeight: N + (x ?? 0), clientHeight: F, rightElement: m, paddingBottom: x, paddingRight: P, rightElementProps: w, update: ue, initialSize: C },
    d.createElement(Cv, { eventTargetRef: h, width: S, height: F, accessibilityHeight: e.accessibilityHeight, canvasRef: e.canvasRef, cellXOffset: e.cellXOffset, cellYOffset: e.cellYOffset, columns: e.columns, disabledRows: e.disabledRows, enableGroups: e.enableGroups, fillHandle: e.fillHandle, firstColAccessible: e.firstColAccessible, fixedShadowX: e.fixedShadowX, fixedShadowY: e.fixedShadowY, freezeColumns: e.freezeColumns, getCellContent: e.getCellContent, getCellRenderer: e.getCellRenderer, getGroupDetails: e.getGroupDetails, getRowThemeOverride: e.getRowThemeOverride, groupHeaderHeight: e.groupHeaderHeight, headerHeight: e.headerHeight, highlightRegions: e.highlightRegions, imageWindowLoader: e.imageWindowLoader, isFilling: e.isFilling, isFocused: e.isFocused, lockColumns: e.lockColumns, maxColumnWidth: e.maxColumnWidth, minColumnWidth: e.minColumnWidth, onHeaderMenuClick: e.onHeaderMenuClick, onHeaderIndicatorClick: e.onHeaderIndicatorClick, onMouseMove: e.onMouseMove, prelightCells: e.prelightCells, rowHeight: e.rowHeight, rows: e.rows, selection: e.selection, theme: e.theme, freezeTrailingRows: e.freezeTrailingRows, hasAppendRow: e.hasAppendRow, translateX: e.translateX, translateY: e.translateY, onColumnProposeMove: e.onColumnProposeMove, verticalBorder: e.verticalBorder, drawFocusRing: e.drawFocusRing, drawHeader: e.drawHeader, drawCell: e.drawCell, experimental: e.experimental, gridRef: e.gridRef, headerIcons: e.headerIcons, isDraggable: e.isDraggable, onCanvasBlur: e.onCanvasBlur, onCanvasFocused: e.onCanvasFocused, onCellFocused: e.onCellFocused, onColumnMoved: e.onColumnMoved, onColumnResize: e.onColumnResize, onColumnResizeEnd: e.onColumnResizeEnd, onColumnResizeStart: e.onColumnResizeStart, onContextMenu: e.onContextMenu, onDragEnd: e.onDragEnd, onDragLeave: e.onDragLeave, onDragOverCell: e.onDragOverCell, onDragStart: e.onDragStart, onDrop: e.onDrop, onItemHovered: e.onItemHovered, onKeyDown: e.onKeyDown, onKeyUp: e.onKeyUp, onMouseDown: e.onMouseDown, onMouseUp: e.onMouseUp, onRowMoved: e.onRowMoved, smoothScrollX: e.smoothScrollX, smoothScrollY: e.smoothScrollY, resizeIndicator: e.resizeIndicator })
  );
}, Ov = /* @__PURE__ */ fn("div")({
  name: "SearchWrapper",
  class: "gdg-seveqep",
  propsAsIs: !1
}), Pv = d.createElement(
  "svg",
  { className: "button-icon", viewBox: "0 0 512 512" },
  d.createElement("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "48", d: "M112 244l144-144 144 144M256 120v292" })
), Lv = d.createElement(
  "svg",
  { className: "button-icon", viewBox: "0 0 512 512" },
  d.createElement("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "48", d: "M112 268l144 144 144-144M256 392V100" })
), Fv = d.createElement(
  "svg",
  { className: "button-icon", viewBox: "0 0 512 512" },
  d.createElement("path", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "M368 368L144 144M368 144L144 368" })
), _v = 10, Av = (e) => {
  const { canvasRef: t, cellYOffset: n, rows: r, columns: i, searchInputRef: o, searchValue: s, searchResults: a, onSearchValueChange: l, getCellsForSelection: u, onSearchResultsChanged: c, showSearch: f = !1, onSearchClose: g } = e, [h] = d.useState(() => "search-box-" + Math.round(Math.random() * 1e3)), [p, m] = d.useState(""), w = s ?? p, b = d.useCallback((te) => {
    m(te), l?.(te);
  }, [l]), [v, C] = d.useState(), I = d.useRef(v);
  I.current = v, d.useEffect(() => {
    a !== void 0 && (a.length > 0 ? C((te) => ({
      rowsSearched: r,
      results: a.length,
      selectedIndex: te?.selectedIndex ?? -1
    })) : C(void 0));
  }, [r, a]);
  const E = d.useRef();
  E.current === void 0 && (E.current = new AbortController());
  const R = d.useRef(), [P, x] = d.useState([]), S = a ?? P, F = d.useCallback(() => {
    R.current !== void 0 && (window.cancelAnimationFrame(R.current), R.current = void 0), E.current !== void 0 && E.current.abort(), E.current = new AbortController();
  }, []), D = d.useRef(n);
  D.current = n;
  const M = d.useCallback((te) => {
    const ce = new RegExp(te.replace(/([$()*+.?[\\\]^{|}-])/g, "\\$1"), "i");
    let le = D.current, he = Math.min(10, r), de = 0;
    C(void 0), x([]);
    const ie = [], H = async () => {
      if (u === void 0)
        return;
      const L = performance.now(), G = r - de;
      let ne = u({
        x: 0,
        y: le,
        width: i.length,
        height: Math.min(he, G, r - le)
      }, E.current.signal);
      typeof ne == "function" && (ne = await ne());
      let oe = !1;
      for (const [St, Ue] of ne.entries())
        for (const [re, se] of Ue.entries()) {
          let we;
          switch (se.kind) {
            case Z.Text:
            case Z.Number:
              we = se.displayData;
              break;
            case Z.Uri:
            case Z.Markdown:
              we = se.data;
              break;
            case Z.Boolean:
              we = typeof se.data == "boolean" ? se.data.toString() : void 0;
              break;
            case Z.Image:
            case Z.Bubble:
              we = se.data.join("🐳");
              break;
            case Z.Custom:
              we = se.copyData;
              break;
          }
          we !== void 0 && ce.test(we) && (ie.push([re, St + le]), oe = !0);
        }
      const xe = performance.now();
      oe && x([...ie]), de += ne.length, Vn(de <= r);
      const ve = I.current?.selectedIndex ?? -1;
      C({
        results: ie.length,
        rowsSearched: de,
        selectedIndex: ve
      }), c?.(ie, ve), le + he >= r ? le = 0 : le += he;
      const et = xe - L, ke = Math.max(et, 1), bt = _v / ke;
      he = Math.ceil(he * bt), de < r && ie.length < 1e3 && (R.current = window.requestAnimationFrame(H));
    };
    F(), R.current = window.requestAnimationFrame(H);
  }, [F, i.length, u, c, r]), T = d.useCallback(() => {
    g?.(), C(void 0), x([]), c?.([], -1), F(), t?.current?.focus();
  }, [F, t, g, c]), O = d.useCallback((te) => {
    b(te.target.value), a === void 0 && (te.target.value === "" ? (C(void 0), x([]), F()) : M(te.target.value));
  }, [M, F, b, a]);
  d.useEffect(() => {
    o.current !== null && (b(""), C(void 0), P.length > 0 && (x([]), c?.([], -1)), f ? o.current.focus({ preventScroll: !0 }) : F());
  }, [f, o]);
  const k = d.useCallback((te) => {
    if (te?.stopPropagation?.(), v === void 0 || v.results === 0)
      return;
    const ce = (v.selectedIndex + 1) % v.results;
    C({
      ...v,
      selectedIndex: ce
    }), c?.(S, ce);
  }, [v, c, S]), N = d.useCallback((te) => {
    if (te?.stopPropagation?.(), v === void 0 || v.results === 0)
      return;
    let ce = (v.selectedIndex - 1) % v.results;
    ce < 0 && (ce += v.results), C({
      ...v,
      selectedIndex: ce
    }), c?.(S, ce);
  }, [c, S, v]), q = d.useCallback((te) => {
    (te.ctrlKey || te.metaKey) && te.nativeEvent.code === "KeyF" || te.key === "Escape" ? (T(), te.stopPropagation(), te.preventDefault()) : te.key === "Enter" && (te.shiftKey ? N() : k());
  }, [T, k, N]);
  d.useEffect(() => () => {
    F();
  }, [F]);
  const [Y, ue] = d.useState(!1);
  d.useEffect(() => {
    if (f)
      ue(!0);
    else {
      const te = setTimeout(() => ue(!1), 150);
      return () => clearTimeout(te);
    }
  }, [f]);
  const ee = d.useMemo(() => {
    if (!f && !Y)
      return null;
    let te;
    v !== void 0 && (te = v.results >= 1e3 ? "over 1000" : `${v.results} result${v.results !== 1 ? "s" : ""}`, v.selectedIndex >= 0 && (te = `${v.selectedIndex + 1} of ${te}`));
    const ce = (de) => {
      de.stopPropagation();
    }, he = {
      width: `${r > 0 ? Math.floor((v?.rowsSearched ?? 0) / r * 100) : 0}%`
    };
    return d.createElement(
      Ov,
      { className: "gdg-search-bar" + (f ? "" : " out"), onMouseDown: ce, onMouseMove: ce, onMouseUp: ce, onClick: ce },
      d.createElement(
        "div",
        { className: "gdg-search-bar-inner" },
        d.createElement("input", { id: h, "aria-hidden": !f, "data-testid": "search-input", ref: o, onChange: O, value: w, tabIndex: f ? void 0 : -1, onKeyDownCapture: q }),
        d.createElement("button", { type: "button", "aria-label": "Previous Result", "aria-hidden": !f, tabIndex: f ? void 0 : -1, onClick: N, disabled: (v?.results ?? 0) === 0 }, Pv),
        d.createElement("button", { type: "button", "aria-label": "Next Result", "aria-hidden": !f, tabIndex: f ? void 0 : -1, onClick: k, disabled: (v?.results ?? 0) === 0 }, Lv),
        g !== void 0 && d.createElement("button", { type: "button", "aria-label": "Close Search", "aria-hidden": !f, "data-testid": "search-close-button", tabIndex: f ? void 0 : -1, onClick: T }, Fv)
      ),
      v !== void 0 ? d.createElement(
        d.Fragment,
        null,
        d.createElement(
          "div",
          { className: "gdg-search-status" },
          d.createElement("div", { "data-testid": "search-result-area" }, te)
        ),
        d.createElement("div", { className: "gdg-search-progress", style: he })
      ) : d.createElement(
        "div",
        { className: "gdg-search-status" },
        d.createElement("label", { htmlFor: h }, "Type to search")
      )
    );
  }, [
    f,
    Y,
    v,
    r,
    h,
    o,
    O,
    w,
    q,
    N,
    k,
    g,
    T
  ]);
  return d.createElement(
    d.Fragment,
    null,
    d.createElement(Dv, { prelightCells: S, accessibilityHeight: e.accessibilityHeight, canvasRef: e.canvasRef, cellXOffset: e.cellXOffset, cellYOffset: e.cellYOffset, className: e.className, clientSize: e.clientSize, columns: e.columns, disabledRows: e.disabledRows, enableGroups: e.enableGroups, fillHandle: e.fillHandle, firstColAccessible: e.firstColAccessible, nonGrowWidth: e.nonGrowWidth, fixedShadowX: e.fixedShadowX, fixedShadowY: e.fixedShadowY, freezeColumns: e.freezeColumns, getCellContent: e.getCellContent, getCellRenderer: e.getCellRenderer, getGroupDetails: e.getGroupDetails, getRowThemeOverride: e.getRowThemeOverride, groupHeaderHeight: e.groupHeaderHeight, headerHeight: e.headerHeight, highlightRegions: e.highlightRegions, imageWindowLoader: e.imageWindowLoader, initialSize: e.initialSize, isFilling: e.isFilling, isFocused: e.isFocused, lockColumns: e.lockColumns, maxColumnWidth: e.maxColumnWidth, minColumnWidth: e.minColumnWidth, onHeaderMenuClick: e.onHeaderMenuClick, onHeaderIndicatorClick: e.onHeaderIndicatorClick, onMouseMove: e.onMouseMove, onVisibleRegionChanged: e.onVisibleRegionChanged, overscrollX: e.overscrollX, overscrollY: e.overscrollY, preventDiagonalScrolling: e.preventDiagonalScrolling, rightElement: e.rightElement, rightElementProps: e.rightElementProps, rowHeight: e.rowHeight, rows: e.rows, scrollRef: e.scrollRef, selection: e.selection, theme: e.theme, freezeTrailingRows: e.freezeTrailingRows, hasAppendRow: e.hasAppendRow, translateX: e.translateX, translateY: e.translateY, verticalBorder: e.verticalBorder, onColumnProposeMove: e.onColumnProposeMove, drawFocusRing: e.drawFocusRing, drawCell: e.drawCell, drawHeader: e.drawHeader, experimental: e.experimental, gridRef: e.gridRef, headerIcons: e.headerIcons, isDraggable: e.isDraggable, onCanvasBlur: e.onCanvasBlur, onCanvasFocused: e.onCanvasFocused, onCellFocused: e.onCellFocused, onColumnMoved: e.onColumnMoved, onColumnResize: e.onColumnResize, onColumnResizeEnd: e.onColumnResizeEnd, onColumnResizeStart: e.onColumnResizeStart, onContextMenu: e.onContextMenu, onDragEnd: e.onDragEnd, onDragLeave: e.onDragLeave, onDragOverCell: e.onDragOverCell, onDragStart: e.onDragStart, onDrop: e.onDrop, onItemHovered: e.onItemHovered, onKeyDown: e.onKeyDown, onKeyUp: e.onKeyUp, onMouseDown: e.onMouseDown, onMouseUp: e.onMouseUp, onRowMoved: e.onRowMoved, smoothScrollX: e.smoothScrollX, smoothScrollY: e.smoothScrollY, resizeIndicator: e.resizeIndicator }),
    ee
  );
};
class Hv extends d.PureComponent {
  wrapperRef = d.createRef();
  componentDidMount() {
    const t = this.props.customEventTarget ?? document;
    t.addEventListener("pointerdown", this.clickOutside, !0), t.addEventListener("contextmenu", this.clickOutside, !0);
  }
  componentWillUnmount() {
    const t = this.props.customEventTarget ?? document;
    t.removeEventListener("pointerdown", this.clickOutside, !0), t.removeEventListener("contextmenu", this.clickOutside, !0);
  }
  clickOutside = (t) => {
    if (!(this.props.isOutsideClick && !this.props.isOutsideClick(t)) && this.wrapperRef.current !== null && !this.wrapperRef.current.contains(t.target)) {
      let n = t.target;
      for (; n !== null; ) {
        if (n.classList.contains("click-outside-ignore"))
          return;
        n = n.parentElement;
      }
      this.props.onClickOutside();
    }
  };
  render() {
    const { onClickOutside: t, isOutsideClick: n, customEventTarget: r, ...i } = this.props;
    return d.createElement("div", { ...i, ref: this.wrapperRef }, this.props.children);
  }
}
const zv = () => (e) => Math.max(16, e.targetHeight - 10), Vv = /* @__PURE__ */ fn("input")({
  name: "RenameInput",
  class: "gdg-r17m35ur",
  propsAsIs: !1,
  vars: {
    "r17m35ur-0": [zv(), "px"]
  }
}), $v = (e) => {
  const {
    bounds: t,
    group: n,
    onClose: r,
    canvasBounds: i,
    onFinish: o
  } = e, [s, a] = Bt.useState(n);
  return Bt.createElement(Hv, {
    style: {
      position: "absolute",
      left: t.x - i.left + 1,
      top: t.y - i.top,
      width: t.width - 2,
      height: t.height
    },
    className: "gdg-c1tqibwd",
    onClickOutside: r
  }, Bt.createElement(Vv, {
    targetHeight: t.height,
    "data-testid": "group-rename-input",
    value: s,
    onBlur: r,
    onFocus: (l) => l.target.setSelectionRange(0, s.length),
    onChange: (l) => a(l.target.value),
    onKeyDown: (l) => {
      l.key === "Enter" ? o(s) : l.key === "Escape" && r();
    },
    autoFocus: !0
  }));
};
function Nv(e, t) {
  return e === void 0 ? !1 : e.length > 1 && e.startsWith("_") ? Number.parseInt(e.slice(1)) === t.keyCode : e.length === 1 && e >= "a" && e <= "z" ? e.toUpperCase().codePointAt(0) === t.keyCode : e === t.key;
}
function ot(e, t, n) {
  const r = df(e, t);
  return r && (n.didMatch = !0), r;
}
function df(e, t) {
  if (e.length === 0)
    return !1;
  if (e.includes("|")) {
    const l = e.split("|");
    for (const u of l)
      if (df(u, t))
        return !0;
    return !1;
  }
  let n = !1, r = !1, i = !1, o = !1;
  const s = e.split("+"), a = s.pop();
  if (!Nv(a, t))
    return !1;
  if (s[0] === "any")
    return !0;
  for (const l of s)
    switch (l) {
      case "ctrl":
        n = !0;
        break;
      case "shift":
        r = !0;
        break;
      case "alt":
        i = !0;
        break;
      case "meta":
        o = !0;
        break;
      case "primary":
        ma.value ? o = !0 : n = !0;
        break;
    }
  return t.altKey === i && t.ctrlKey === n && t.shiftKey === r && t.metaKey === o;
}
function Bv(e, t, n, r, i, o, s) {
  const a = Bt.useCallback((c, f, g, h) => {
    (o === "cell" || o === "multi-cell") && c !== void 0 && (c = {
      ...c,
      range: {
        x: c.cell[0],
        y: c.cell[1],
        width: 1,
        height: 1
      }
    }), !s && c !== void 0 && c.range.width > 1 && (c = {
      ...c,
      range: {
        ...c.range,
        width: 1,
        x: c.cell[0]
      }
    });
    const p = n === "mixed" && (g || h === "drag") || n === "additive", m = (r === "mixed" || r === "additive") && p, w = (i === "mixed" || i === "additive") && p;
    let b = {
      current: c === void 0 ? void 0 : {
        ...c,
        rangeStack: h === "drag" ? e.current?.rangeStack ?? [] : []
      },
      columns: m ? e.columns : Qe.empty(),
      rows: w ? e.rows : Qe.empty()
    };
    g && (o === "multi-rect" || o === "multi-cell") && b.current !== void 0 && e.current !== void 0 && (b = {
      ...b,
      current: {
        ...b.current,
        rangeStack: [...e.current.rangeStack, e.current.range]
      }
    }), t(b, f);
  }, [
    r,
    e,
    n,
    o,
    s,
    i,
    t
  ]), l = Bt.useCallback((c, f, g) => {
    c = c ?? e.rows, f !== void 0 && (c = c.add(f));
    let h;
    if (i === "exclusive" && c.length > 0)
      h = {
        current: void 0,
        columns: Qe.empty(),
        rows: c
      };
    else {
      const p = g && n === "mixed" || n === "additive", m = g && r === "mixed" || r === "additive";
      h = {
        current: p ? e.current : void 0,
        columns: m ? e.columns : Qe.empty(),
        rows: c
      };
    }
    t(h, !1);
  }, [r, e, n, i, t]), u = Bt.useCallback((c, f, g) => {
    c = c ?? e.columns, f !== void 0 && (c = c.add(f));
    let h;
    if (r === "exclusive" && c.length > 0)
      h = {
        current: void 0,
        rows: Qe.empty(),
        columns: c
      };
    else {
      const p = g && n === "mixed" || n === "additive", m = g && i === "mixed" || i === "additive";
      h = {
        current: p ? e.current : void 0,
        rows: m ? e.rows : Qe.empty(),
        columns: c
      };
    }
    t(h, !1);
  }, [r, e, n, i, t]);
  return [a, l, u];
}
function Wv(e, t, n, r, i) {
  const o = d.useCallback((u) => {
    if (e === !0) {
      const c = [];
      for (let f = u.y; f < u.y + u.height; f++) {
        const g = [];
        for (let h = u.x; h < u.x + u.width; h++)
          h < 0 || f >= i ? g.push({
            kind: Z.Loading,
            allowOverlay: !1
          }) : g.push(t([h, f]));
        c.push(g);
      }
      return c;
    }
    return e?.(u, r.signal) ?? [];
  }, [r.signal, t, e, i]), s = e !== void 0 ? o : void 0, a = d.useCallback((u) => {
    if (s === void 0)
      return [];
    const c = {
      ...u,
      x: u.x - n
    };
    if (c.x < 0) {
      c.x = 0, c.width--;
      const f = s(c, r.signal);
      return typeof f == "function" ? async () => (
        // eslint-disable-next-line unicorn/no-await-expression-member
        (await f()).map((g) => [
          { kind: Z.Loading, allowOverlay: !1 },
          ...g
        ])
      ) : f.map((g) => [{ kind: Z.Loading, allowOverlay: !1 }, ...g]);
    }
    return s(c, r.signal);
  }, [r.signal, s, n]);
  return [e !== void 0 ? a : void 0, s];
}
function Uv(e) {
  if (e.copyData !== void 0)
    return {
      formatted: e.copyData,
      rawValue: e.copyData,
      format: "string",
      // Do not escape the copy value if it was explicitly specified via copyData:
      doNotEscape: !0
    };
  switch (e.kind) {
    case Z.Boolean:
      return {
        formatted: e.data === !0 ? "TRUE" : e.data === !1 ? "FALSE" : e.data === Qs ? "INDETERMINATE" : "",
        rawValue: e.data,
        format: "boolean"
      };
    case Z.Custom:
      return {
        formatted: e.copyData,
        rawValue: e.copyData,
        format: "string"
      };
    case Z.Image:
    case Z.Bubble:
      return {
        formatted: e.data,
        rawValue: e.data,
        format: "string-array"
      };
    case Z.Drilldown:
      return {
        formatted: e.data.map((t) => t.text),
        rawValue: e.data.map((t) => t.text),
        format: "string-array"
      };
    case Z.Text:
      return {
        formatted: e.displayData ?? e.data,
        rawValue: e.data,
        format: "string"
      };
    case Z.Uri:
      return {
        formatted: e.displayData ?? e.data,
        rawValue: e.data,
        format: "url"
      };
    case Z.Markdown:
    case Z.RowID:
      return {
        formatted: e.data,
        rawValue: e.data,
        format: "string"
      };
    case Z.Number:
      return {
        formatted: e.displayData,
        rawValue: e.data,
        format: "number"
      };
    case Z.Loading:
      return {
        formatted: "#LOADING",
        rawValue: "",
        format: "string"
      };
    case Z.Protected:
      return {
        formatted: "************",
        rawValue: "",
        format: "string"
      };
    default:
      po();
  }
}
function jv(e, t) {
  return e.map((r, i) => {
    const o = t[i];
    return r.map((s) => s.span !== void 0 && s.span[0] !== o ? {
      formatted: "",
      rawValue: "",
      format: "string"
    } : Uv(s));
  });
}
function ec(e, t) {
  return (t ? /[\t\n",]/ : /[\t\n"]/).test(e) && (e = `"${e.replace(/"/g, '""')}"`), e;
}
function qv(e) {
  const t = [];
  for (const n of e) {
    const r = [];
    for (const i of n)
      i.format === "url" ? r.push(i.rawValue?.toString() ?? "") : i.format === "string-array" ? r.push(i.formatted.map((o) => ec(o, !0)).join(",")) : r.push(i.doNotEscape === !0 ? i.formatted : ec(i.formatted, !1));
    t.push(r.join("	"));
  }
  return t.join(`
`);
}
function bs(e) {
  return e.replace(/\t/g, "    ").replace(/ {2,}/g, (t) => "<span> </span>".repeat(t.length));
}
function tc(e) {
  return '"' + e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '"';
}
function Gv(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Yv(e) {
  const t = [];
  t.push('<style type="text/css"><!--br {mso-data-placement:same-cell;}--></style>', "<table><tbody>");
  for (const n of e) {
    t.push("<tr>");
    for (const r of n) {
      const i = `gdg-format="${r.format}"`;
      r.format === "url" ? t.push(`<td ${i}><a href="${r.rawValue}">${bs(r.formatted)}</a></td>`) : r.format === "string-array" ? t.push(`<td ${i}><ol>${r.formatted.map((o, s) => `<li gdg-raw-value=${tc(r.rawValue[s])}>` + bs(o) + "</li>").join("")}</ol></td>`) : t.push(`<td gdg-raw-value=${tc(r.rawValue?.toString() ?? "")} ${i}>${bs(r.formatted)}</td>`);
    }
    t.push("</tr>");
  }
  return t.push("</tbody></table>"), t.join("");
}
function Xv(e, t) {
  const n = jv(e, t), r = qv(n), i = Yv(n);
  return {
    textPlain: r,
    textHtml: i
  };
}
function nc(e) {
  const t = document.createElement("html");
  t.innerHTML = e.replace(/&nbsp;/g, " ");
  const n = t.querySelector("table");
  if (n === null)
    return;
  const r = [n], i = [];
  let o;
  for (; r.length > 0; ) {
    const s = r.pop();
    if (s === void 0)
      break;
    if (s instanceof HTMLTableElement || s.nodeName === "TBODY")
      r.push(...[...s.children].reverse());
    else if (s instanceof HTMLTableRowElement)
      o !== void 0 && i.push(o), o = [], r.push(...[...s.children].reverse());
    else if (s instanceof HTMLTableCellElement) {
      const a = s.cloneNode(!0), u = a.children.length === 1 && a.children[0].nodeName === "P" ? a.children[0] : null, c = u?.children.length === 1 && u.children[0].nodeName === "FONT", f = a.querySelectorAll("br");
      for (const p of f)
        p.replaceWith(`
`);
      const g = a.getAttribute("gdg-raw-value"), h = a.getAttribute("gdg-format") ?? "string";
      if (a.querySelector("a") !== null)
        o?.push({
          // raw value is the href
          rawValue: a.querySelector("a")?.getAttribute("href") ?? "",
          formatted: a.textContent ?? "",
          format: h
        });
      else if (a.querySelector("ol") !== null) {
        const p = a.querySelectorAll("li");
        o?.push({
          rawValue: [...p].map((m) => m.getAttribute("gdg-raw-value") ?? ""),
          formatted: [...p].map((m) => m.textContent ?? ""),
          format: "string-array"
        });
      } else if (g !== null)
        o?.push({
          rawValue: Gv(g),
          formatted: a.textContent ?? "",
          format: h
        });
      else {
        let p = a.textContent ?? "";
        c && (p = p.replace(/\n(?!\n)/g, "")), o?.push({
          rawValue: p ?? "",
          formatted: p ?? "",
          format: h
        });
      }
    }
  }
  return o !== void 0 && i.push(o), i;
}
function Kv(e, t, n, r, i) {
  const o = e;
  if (r === "allowPartial" || e.current === void 0 || t === void 0)
    return e;
  let s = !1;
  do {
    if (e?.current === void 0)
      break;
    const a = e.current?.range, l = [];
    if (a.width > 2) {
      const f = t({
        x: a.x,
        y: a.y,
        width: 1,
        height: a.height
      }, i.signal);
      if (typeof f == "function")
        return o;
      l.push(...f);
      const g = t({
        x: a.x + a.width - 1,
        y: a.y,
        width: 1,
        height: a.height
      }, i.signal);
      if (typeof g == "function")
        return o;
      l.push(...g);
    } else {
      const f = t({
        x: a.x,
        y: a.y,
        width: a.width,
        height: a.height
      }, i.signal);
      if (typeof f == "function")
        return o;
      l.push(...f);
    }
    let u = a.x - n, c = a.x + a.width - 1 - n;
    for (const f of l)
      for (const g of f)
        g.span !== void 0 && (u = Math.min(g.span[0], u), c = Math.max(g.span[1], c));
    u === a.x - n && c === a.x + a.width - 1 - n ? s = !0 : e = {
      current: {
        cell: e.current.cell ?? [0, 0],
        range: {
          x: u + n,
          y: a.y,
          width: c - u + 1,
          height: a.height
        },
        rangeStack: e.current.rangeStack
      },
      columns: e.columns,
      rows: e.rows
    };
  } while (!s);
  return e;
}
function rc(e) {
  return e.startsWith('"') && e.endsWith('"') && (e = e.slice(1, -1).replace(/""/g, '"')), e;
}
function Zv(e) {
  let t;
  (function(a) {
    a[a.None = 0] = "None", a[a.inString = 1] = "inString", a[a.inStringPostQuote = 2] = "inStringPostQuote";
  })(t || (t = {}));
  const n = [];
  let r = [], i = 0, o = t.None;
  e = e.replace(/\r\n/g, `
`);
  let s = 0;
  for (const a of e) {
    switch (o) {
      case t.None:
        a === "	" || a === `
` ? (r.push(e.slice(i, s)), i = s + 1, a === `
` && (n.push(r), r = [])) : a === '"' && (o = t.inString);
        break;
      case t.inString:
        a === '"' && (o = t.inStringPostQuote);
        break;
      case t.inStringPostQuote:
        a === '"' ? o = t.inString : ((a === "	" || a === `
`) && (r.push(rc(e.slice(i, s))), i = s + 1, a === `
` && (n.push(r), r = [])), o = t.None);
        break;
    }
    s++;
  }
  return i < e.length && r.push(rc(e.slice(i, e.length))), n.push(r), n.map((a) => a.map((l) => ({ rawValue: l, formatted: l, format: "string" })));
}
function ic(e, t, n) {
  const r = Xv(e, t), i = (a) => {
    window.navigator.clipboard?.writeText(a);
  }, o = (a, l) => window.navigator.clipboard?.write === void 0 ? !1 : (window.navigator.clipboard.write([
    new ClipboardItem({
      // eslint-disable-next-line sonarjs/no-duplicate-string
      "text/plain": new Blob([a], { type: "text/plain" }),
      "text/html": new Blob([l], {
        type: "text/html"
      })
    })
  ]), !0), s = (a, l) => {
    try {
      if (n === void 0 || n.clipboardData === null)
        throw new Error("No clipboard data");
      n?.clipboardData?.setData("text/plain", a), n?.clipboardData?.setData("text/html", l);
    } catch {
      o(a, l) || i(a);
    }
  };
  window.navigator.clipboard?.write !== void 0 || n?.clipboardData !== void 0 ? s(r.textPlain, r.textHtml) : i(r.textPlain), n?.preventDefault();
}
function ff(e) {
  return e !== !0;
}
function oc(e) {
  return typeof e == "string" ? e : `${e}px`;
}
const Jv = () => (e) => e.innerWidth, Qv = () => (e) => e.innerHeight, eb = /* @__PURE__ */ fn("div")({
  name: "Wrapper",
  class: "gdg-wmyidgi",
  propsAsIs: !1,
  vars: {
    "wmyidgi-0": [Jv()],
    "wmyidgi-1": [Qv()]
  }
}), tb = (e) => {
  const {
    inWidth: t,
    inHeight: n,
    children: r,
    ...i
  } = e;
  return d.createElement(eb, {
    innerHeight: oc(n),
    innerWidth: oc(t),
    ...i
  }, r);
}, nb = 2, rb = 1300;
function ib(e, t, n) {
  const r = Bt.useRef(0), [i, o] = e ?? [0, 0];
  Bt.useEffect(() => {
    if (i === 0 && o === 0) {
      r.current = 0;
      return;
    }
    let s = !1, a = 0;
    const l = (u) => {
      if (!s) {
        if (a === 0)
          a = u;
        else {
          const c = u - a;
          r.current = Math.min(1, r.current + c / rb);
          const f = r.current ** 1.618 * c * nb;
          t.current?.scrollBy(i * f, o * f), a = u, n?.();
        }
        window.requestAnimationFrame(l);
      }
    };
    return window.requestAnimationFrame(l), () => {
      s = !0;
    };
  }, [t, i, o, n]);
}
function ob({ rowHeight: e, headerHeight: t, groupHeaderHeight: n, theme: r, overscrollX: i, overscrollY: o, scaleToRem: s, remSize: a }) {
  const [l, u, c, f, g, h] = Bt.useMemo(() => {
    if (!s || a === 16)
      return [e, t, n, r, i, o];
    const p = a / 16, m = e, w = Xd();
    return [
      typeof m == "number" ? m * p : (b) => Math.ceil(m(b) * p),
      Math.ceil(t * p),
      Math.ceil(n * p),
      {
        ...r,
        headerIconSize: (r?.headerIconSize ?? w.headerIconSize) * p,
        cellHorizontalPadding: (r?.cellHorizontalPadding ?? w.cellHorizontalPadding) * p,
        cellVerticalPadding: (r?.cellVerticalPadding ?? w.cellVerticalPadding) * p
      },
      Math.ceil((i ?? 0) * p),
      Math.ceil((o ?? 0) * p)
    ];
  }, [n, t, i, o, a, e, s, r]);
  return { rowHeight: l, headerHeight: u, groupHeaderHeight: c, theme: f, overscrollX: g, overscrollY: h };
}
const Rr = {
  downFill: !1,
  rightFill: !1,
  clear: !0,
  closeOverlay: !0,
  acceptOverlayDown: !0,
  acceptOverlayUp: !0,
  acceptOverlayLeft: !0,
  acceptOverlayRight: !0,
  copy: !0,
  paste: !0,
  cut: !0,
  search: !1,
  delete: !0,
  activateCell: !0,
  scrollToSelectedCell: !0,
  goToFirstCell: !0,
  goToFirstColumn: !0,
  goToFirstRow: !0,
  goToLastCell: !0,
  goToLastColumn: !0,
  goToLastRow: !0,
  goToNextPage: !0,
  goToPreviousPage: !0,
  selectToFirstCell: !0,
  selectToFirstColumn: !0,
  selectToFirstRow: !0,
  selectToLastCell: !0,
  selectToLastColumn: !0,
  selectToLastRow: !0,
  selectAll: !0,
  selectRow: !0,
  selectColumn: !0,
  goUpCell: !0,
  goRightCell: !0,
  goDownCell: !0,
  goLeftCell: !0,
  goUpCellRetainSelection: !0,
  goRightCellRetainSelection: !0,
  goDownCellRetainSelection: !0,
  goLeftCellRetainSelection: !0,
  selectGrowUp: !0,
  selectGrowRight: !0,
  selectGrowDown: !0,
  selectGrowLeft: !0
};
function at(e, t) {
  return e === !0 ? t : e === !1 ? "" : e;
}
function ac(e) {
  const t = ma.value;
  return {
    activateCell: at(e.activateCell, " |Enter|shift+Enter"),
    clear: at(e.clear, "any+Escape"),
    closeOverlay: at(e.closeOverlay, "any+Escape"),
    acceptOverlayDown: at(e.acceptOverlayDown, "Enter"),
    acceptOverlayUp: at(e.acceptOverlayUp, "shift+Enter"),
    acceptOverlayLeft: at(e.acceptOverlayLeft, "shift+Tab"),
    acceptOverlayRight: at(e.acceptOverlayRight, "Tab"),
    copy: e.copy,
    cut: e.cut,
    delete: at(e.delete, t ? "Backspace|Delete" : "Delete"),
    downFill: at(e.downFill, "primary+_68"),
    scrollToSelectedCell: at(e.scrollToSelectedCell, "primary+Enter"),
    goDownCell: at(e.goDownCell, "ArrowDown"),
    goDownCellRetainSelection: at(e.goDownCellRetainSelection, "alt+ArrowDown"),
    goLeftCell: at(e.goLeftCell, "ArrowLeft|shift+Tab"),
    goLeftCellRetainSelection: at(e.goLeftCellRetainSelection, "alt+ArrowLeft"),
    goRightCell: at(e.goRightCell, "ArrowRight|Tab"),
    goRightCellRetainSelection: at(e.goRightCellRetainSelection, "alt+ArrowRight"),
    goUpCell: at(e.goUpCell, "ArrowUp"),
    goUpCellRetainSelection: at(e.goUpCellRetainSelection, "alt+ArrowUp"),
    goToFirstCell: at(e.goToFirstCell, "primary+Home"),
    goToFirstColumn: at(e.goToFirstColumn, "Home|primary+ArrowLeft"),
    goToFirstRow: at(e.goToFirstRow, "primary+ArrowUp"),
    goToLastCell: at(e.goToLastCell, "primary+End"),
    goToLastColumn: at(e.goToLastColumn, "End|primary+ArrowRight"),
    goToLastRow: at(e.goToLastRow, "primary+ArrowDown"),
    goToNextPage: at(e.goToNextPage, "PageDown"),
    goToPreviousPage: at(e.goToPreviousPage, "PageUp"),
    paste: e.paste,
    rightFill: at(e.rightFill, "primary+_82"),
    search: at(e.search, "primary+f"),
    selectAll: at(e.selectAll, "primary+a"),
    selectColumn: at(e.selectColumn, "ctrl+ "),
    selectGrowDown: at(e.selectGrowDown, "shift+ArrowDown"),
    selectGrowLeft: at(e.selectGrowLeft, "shift+ArrowLeft"),
    selectGrowRight: at(e.selectGrowRight, "shift+ArrowRight"),
    selectGrowUp: at(e.selectGrowUp, "shift+ArrowUp"),
    selectRow: at(e.selectRow, "shift+ "),
    selectToFirstCell: at(e.selectToFirstCell, "primary+shift+Home"),
    selectToFirstColumn: at(e.selectToFirstColumn, "primary+shift+ArrowLeft"),
    selectToFirstRow: at(e.selectToFirstRow, "primary+shift+ArrowUp"),
    selectToLastCell: at(e.selectToLastCell, "primary+shift+End"),
    selectToLastColumn: at(e.selectToLastColumn, "primary+shift+ArrowRight"),
    selectToLastRow: at(e.selectToLastRow, "primary+shift+ArrowDown")
  };
}
function ab(e) {
  const t = gm(e);
  return Bt.useMemo(() => {
    if (t === void 0)
      return ac(Rr);
    const n = {
      ...t,
      goToNextPage: t?.goToNextPage ?? t?.pageDown ?? Rr.goToNextPage,
      goToPreviousPage: t?.goToPreviousPage ?? t?.pageUp ?? Rr.goToPreviousPage,
      goToFirstCell: t?.goToFirstCell ?? t?.first ?? Rr.goToFirstCell,
      goToLastCell: t?.goToLastCell ?? t?.last ?? Rr.goToLastCell,
      selectToFirstCell: t?.selectToFirstCell ?? t?.first ?? Rr.selectToFirstCell,
      selectToLastCell: t?.selectToLastCell ?? t?.last ?? Rr.selectToLastCell
    };
    return ac({
      ...Rr,
      ...n
    });
  }, [t]);
}
function sb(e) {
  function t(r, i, o) {
    if (typeof r == "number")
      return {
        headerIndex: r,
        isCollapsed: !1,
        depth: i,
        path: o
      };
    const s = {
      headerIndex: r.headerIndex,
      isCollapsed: r.isCollapsed,
      depth: i,
      path: o
    };
    return r.subGroups !== void 0 && (s.subGroups = r.subGroups.map((a, l) => t(a, i + 1, [...o, l])).sort((a, l) => a.headerIndex - l.headerIndex)), s;
  }
  return e.map((r, i) => t(r, 0, [i])).sort((r, i) => r.headerIndex - i.headerIndex);
}
function hl(e, t) {
  const n = [];
  function r(a, l, u = !1) {
    let c = l !== null ? l - a.headerIndex : t - a.headerIndex;
    if (a.subGroups !== void 0 && (c = a.subGroups[0].headerIndex - a.headerIndex), c--, n.push({
      rowIndex: -1,
      // we will fill this in later
      headerIndex: a.headerIndex,
      contentIndex: -1,
      // we will fill this in later
      skip: u,
      isCollapsed: a.isCollapsed,
      depth: a.depth,
      path: a.path,
      rows: c
    }), a.subGroups)
      for (let f = 0; f < a.subGroups.length; f++) {
        const g = f < a.subGroups.length - 1 ? a.subGroups[f + 1].headerIndex : l;
        r(a.subGroups[f], g, u || a.isCollapsed);
      }
  }
  const i = sb(e.groups);
  for (let a = 0; a < i.length; a++) {
    const l = a < i.length - 1 ? i[a + 1].headerIndex : null;
    r(i[a], l);
  }
  let o = 0, s = 0;
  for (const a of n)
    a.contentIndex = s, s += a.rows, a.rowIndex = o, o += a.isCollapsed ? 1 : a.rows + 1;
  return n.filter((a) => a.skip === !1).map((a) => {
    const { skip: l, ...u } = a;
    return u;
  });
}
function Us(e, t) {
  if (t === void 0 || hl.length === 0)
    return {
      path: [e],
      originalIndex: e,
      isGroupHeader: !1,
      groupIndex: e,
      contentIndex: e,
      groupRows: -1
    };
  let n = e;
  for (const r of t) {
    if (n === 0)
      return {
        path: [...r.path, -1],
        originalIndex: r.headerIndex,
        isGroupHeader: !0,
        groupIndex: -1,
        contentIndex: -1,
        groupRows: r.rows
      };
    if (r.isCollapsed)
      n--;
    else {
      if (n <= r.rows)
        return {
          path: [...r.path, n - 1],
          originalIndex: r.headerIndex + n,
          isGroupHeader: !1,
          groupIndex: n - 1,
          contentIndex: r.contentIndex + n - 1,
          groupRows: r.rows
        };
      n = n - r.rows - 1;
    }
  }
  return {
    path: [e],
    originalIndex: e,
    isGroupHeader: !1,
    groupIndex: e,
    contentIndex: e,
    groupRows: -1
  };
}
function lb(e, t, n, r) {
  const i = Bt.useMemo(() => e === void 0 ? void 0 : hl(e, t), [e, t]), o = Bt.useMemo(() => i?.reduce((c, f) => (c[f.rowIndex] = f, c), {}), [i]), s = Bt.useMemo(() => i === void 0 ? t : i.reduce((c, f) => c + (f.isCollapsed ? 1 : f.rows + 1), 0), [i, t]), a = Bt.useMemo(() => e === void 0 || typeof n == "number" && e.height === n ? n : (c) => o?.[c] ? e.height : typeof n == "number" ? n : n(c), [o, e, n]), l = Bt.useCallback((c) => {
    if (i === void 0)
      return c;
    let f = c;
    for (const g of i) {
      if (f === 0)
        return;
      if (f--, !g.isCollapsed) {
        if (f < g.rows)
          return g.contentIndex + f;
        f -= g.rows;
      }
    }
    return c;
  }, [i]), u = Er(r ?? e?.themeOverride, Bt.useCallback((c) => {
    if (e === void 0)
      return r?.(c, c, c);
    if (r === void 0 && e?.themeOverride === void 0)
      return;
    const { isGroupHeader: f, contentIndex: g, groupIndex: h } = Us(c, i);
    return f ? e.themeOverride : r?.(c, h, g);
  }, [i, r, e]));
  return e === void 0 ? {
    rowHeight: a,
    rows: t,
    rowNumberMapper: l,
    getRowThemeOverride: u
  } : {
    rowHeight: a,
    rows: s,
    rowNumberMapper: l,
    getRowThemeOverride: u
  };
}
function ub(e, t) {
  const n = Bt.useMemo(() => e === void 0 ? void 0 : hl(e, t), [e, t]);
  return {
    getRowGroupingForPath: gf,
    updateRowGroupingByPath: hf,
    mapper: Bt.useCallback((r) => {
      if (typeof r == "number")
        return Us(r, n);
      const i = Us(r[1], n);
      return {
        ...i,
        originalIndex: [r[0], i.originalIndex]
      };
    }, [n])
  };
}
function hf(e, t, n) {
  const [r, ...i] = t;
  return i[0] === -1 ? e.map((o, s) => s === r ? { ...o, ...n } : o) : e.map((o, s) => s === r ? { ...o, subGroups: hf(o.subGroups ?? [], i, n) } : o);
}
function gf(e, t) {
  const [n, ...r] = t;
  return r[0] === -1 ? e[n] : gf(e[n].subGroups ?? [], r);
}
function cb(e, t) {
  const [n] = d.useState(() => ({
    value: e,
    callback: t,
    facade: {
      get current() {
        return n.value;
      },
      set current(r) {
        const i = n.value;
        i !== r && (n.value = r, n.callback(r, i));
      }
    }
  }));
  return n.callback = t, n.facade;
}
function db(e, t, n, r, i) {
  const [o, s] = d.useMemo(() => [
    t !== void 0 && typeof n == "number" ? Math.floor(t / n) : 0,
    t !== void 0 && typeof n == "number" ? -(t % n) : 0
  ], [t, n]), a = d.useMemo(() => ({
    x: r.current.x,
    y: o,
    width: r.current.width ?? 1,
    height: r.current.height ?? 1,
    // tx: 'TODO',
    ty: s
  }), [r, s, o]), [l, u, c] = hm(a), f = d.useRef(i);
  f.current = i;
  const g = cb(null, (m) => {
    m !== null && t !== void 0 ? m.scrollTop = t : m !== null && e !== void 0 && (m.scrollLeft = e);
  }), h = (l.height ?? 1) > 1;
  d.useLayoutEffect(() => {
    if (t !== void 0 && g.current !== null && h) {
      if (g.current.scrollTop === t)
        return;
      g.current.scrollTop = t, g.current.scrollTop !== t && c(), f.current();
    }
  }, [t, h, c, g]);
  const p = (l.width ?? 1) > 1;
  return d.useLayoutEffect(() => {
    if (e !== void 0 && g.current !== null && p) {
      if (g.current.scrollLeft === e)
        return;
      g.current.scrollLeft = e, g.current.scrollLeft !== e && c(), f.current();
    }
  }, [e, p, c, g]), {
    visibleRegion: l,
    setVisibleRegion: u,
    scrollRef: g
  };
}
const fb = d.lazy(async () => await import("./data-grid-overlay-editor-CBMGAk2m.js"));
let hb = 0;
function gb(e) {
  return m0(Gu(Gu(e).filter((t) => t.span !== void 0).map((t) => Dr((t.span?.[0] ?? 0) + 1, (t.span?.[1] ?? 0) + 1))));
}
function Yo(e, t) {
  return e === void 0 || t === 0 || e.columns.length === 0 && e.current === void 0 ? e : {
    current: e.current === void 0 ? void 0 : {
      cell: [e.current.cell[0] + t, e.current.cell[1]],
      range: {
        ...e.current.range,
        x: e.current.range.x + t
      },
      rangeStack: e.current.rangeStack.map((n) => ({
        ...n,
        x: n.x + t
      }))
    },
    rows: e.rows,
    columns: e.columns.offset(t)
  };
}
const Xo = {
  kind: Z.Loading,
  allowOverlay: !1
}, Ko = {
  columns: Qe.empty(),
  rows: Qe.empty(),
  current: void 0
}, pb = (e, t) => {
  const [n, r] = d.useState(Ko), [i, o] = d.useState(), s = d.useRef(null), a = d.useRef(null), [l, u] = d.useState(), c = d.useRef(), f = typeof window > "u" ? null : window, { imageEditorOverride: g, getRowThemeOverride: h, markdownDivCreateNode: p, width: m, height: w, columns: b, rows: v, getCellContent: C, onCellClicked: I, onCellActivated: E, onFillPattern: R, onFinishedEditing: P, coercePasteValue: x, drawHeader: S, drawCell: F, editorBloom: D, onHeaderClicked: M, onColumnProposeMove: T, rangeSelectionColumnSpanning: O = !0, spanRangeBehavior: k = "default", onGroupHeaderClicked: N, onCellContextMenu: q, className: Y, onHeaderContextMenu: ue, getCellsForSelection: ee, onGroupHeaderContextMenu: te, onGroupHeaderRenamed: ce, onCellEdited: le, onCellsEdited: he, onSearchResultsChanged: de, searchResults: ie, onSearchValueChange: H, searchValue: L, onKeyDown: G, onKeyUp: ne, keybindings: oe, editOnType: xe = !0, onRowAppended: ve, onColumnAppended: et, onColumnMoved: ke, validateCell: bt, highlightRegions: St, rangeSelect: Ue = "rect", columnSelect: re = "multi", rowSelect: se = "multi", rangeSelectionBlending: we = "exclusive", columnSelectionBlending: fe = "exclusive", rowSelectionBlending: ye = "exclusive", onDelete: $e, onDragStart: _e, onMouseMove: tt, onPaste: Re, copyHeaders: qe = !1, freezeColumns: De = 0, cellActivationBehavior: Ie = "second-click", rowSelectionMode: Le = "auto", columnSelectionMode: ht = "auto", onHeaderMenuClick: nt, onHeaderIndicatorClick: Xe, getGroupDetails: kt, rowGrouping: wt, onSearchClose: Ot, onItemHovered: Pt, onSelectionCleared: ln, showSearch: Jt, onVisibleRegionChanged: Dn, gridSelection: Tt, onGridSelectionChange: gt, minColumnWidth: On = 50, maxColumnWidth: yt = 500, maxColumnAutoWidth: Qt, provideEditor: kn, trailingRowOptions: Oe, freezeTrailingRows: ct = 0, allowedFillDirections: pt = "orthogonal", scrollOffsetX: Pn, scrollOffsetY: un, verticalBorder: cn, onDragOverCell: Ln, onDrop: en, onColumnResize: tn, onColumnResizeEnd: Be, onColumnResizeStart: Mt, customRenderers: Fn, fillHandle: Ft, experimental: mt, fixedShadowX: Mn, fixedShadowY: ur, headerIcons: Nn, imageWindowLoader: B, initialSize: We, isDraggable: Ge, onDragLeave: Lt, onRowMoved: nn, overscrollX: hn, overscrollY: Rn, preventDiagonalScrolling: yn, rightElement: Ut, rightElementProps: En, trapFocus: In = !1, smoothScrollX: Ce, smoothScrollY: _t, scaleToRem: Kt = !1, rowHeight: Bn = 34, headerHeight: Zt = 36, groupHeaderHeight: Gt = Zt, theme: Yt, isOutsideClick: _n, renderers: Tn, resizeIndicator: Mo, scrollToActiveCell: _r = !0, drawFocusRing: La = !0, portalElementRef: Ro } = e, ri = La === "no-editor" ? i === void 0 : La, Gn = typeof e.rowMarkers == "string" ? void 0 : e.rowMarkers, Cn = Gn?.kind ?? e.rowMarkers ?? "none", ii = Gn?.width ?? e.rowMarkerWidth, cr = Gn?.startIndex ?? e.rowMarkerStartIndex ?? 1, oi = Gn?.theme ?? e.rowMarkerTheme, br = Gn?.headerTheme, ai = Gn?.headerAlwaysVisible, si = se !== "multi" || Gn?.headerDisabled === !0, Ar = Gn?.checkboxStyle ?? "square", wr = Math.max(On, 20), li = Math.max(yt, wr), Fa = Math.max(Qt ?? li, wr), Ai = d.useMemo(() => typeof window > "u" ? { fontSize: "16px" } : window.getComputedStyle(document.documentElement), []), { rows: He, rowNumberMapper: Hi, rowHeight: Eo, getRowThemeOverride: Hr } = lb(wt, v, Bn, h), _a = d.useMemo(() => Number.parseFloat(Ai.fontSize), [Ai]), { rowHeight: rr, headerHeight: zi, groupHeaderHeight: Io, theme: ui, overscrollX: Aa, overscrollY: Ha } = ob({
    groupHeaderHeight: Gt,
    headerHeight: Zt,
    overscrollX: hn,
    overscrollY: Rn,
    remSize: _a,
    rowHeight: Eo,
    scaleToRem: Kt,
    theme: Yt
  }), ir = ab(oe), yr = ii ?? (v > 1e4 ? 48 : v > 1e3 ? 44 : v > 100 ? 36 : 32), An = Cn !== "none", U = An ? 1 : 0, Vt = Oe !== void 0, dr = Oe?.sticky === !0, [za, zr] = d.useState(!1), Va = Jt ?? za, ci = d.useCallback(() => {
    Ot !== void 0 ? Ot() : zr(!1);
  }, [Ot]), X = d.useMemo(() => Tt === void 0 ? void 0 : Yo(Tt, U), [Tt, U]) ?? n, V = d.useRef();
  V.current === void 0 && (V.current = new AbortController()), d.useEffect(() => () => V?.current.abort(), []);
  const [Q, Me] = Wv(ee, C, U, V.current, He), Te = d.useCallback((y, A, _) => {
    if (bt === void 0)
      return !0;
    const $ = [y[0] - U, y[1]];
    return bt?.($, A, _);
  }, [U, bt]), ge = d.useRef(Tt), pe = d.useCallback((y, A) => {
    A && (y = Kv(y, Q, U, k, V.current)), gt !== void 0 ? (ge.current = Yo(y, -U), gt(ge.current)) : r(y);
  }, [gt, Q, U, k]), je = Er(tn, d.useCallback((y, A, _, $) => {
    tn?.(b[_ - U], A, _ - U, $);
  }, [tn, U, b])), Ee = Er(Be, d.useCallback((y, A, _, $) => {
    Be?.(b[_ - U], A, _ - U, $);
  }, [Be, U, b])), Ze = Er(Mt, d.useCallback((y, A, _, $) => {
    Mt?.(b[_ - U], A, _ - U, $);
  }, [Mt, U, b])), vt = Er(S, d.useCallback((y, A) => S?.({ ...y, columnIndex: y.columnIndex - U }, A) ?? !1, [S, U])), gn = Er(F, d.useCallback((y, A) => F?.({ ...y, col: y.col - U }, A) ?? !1, [F, U])), jt = d.useCallback((y) => {
    if ($e !== void 0) {
      const A = $e(Yo(y, -U));
      return typeof A == "boolean" ? A : Yo(A, U);
    }
    return !0;
  }, [$e, U]), [Rt, ut, Ye] = Bv(X, pe, we, fe, ye, Ue, O), dt = d.useMemo(() => pr(Xd(), ui), [ui]), [$t, di] = d.useState([0, 0, 0]), Vr = d.useMemo(() => {
    if (Tn === void 0)
      return {};
    const y = {};
    for (const A of Tn)
      y[A.kind] = A;
    return y;
  }, [Tn]), rn = d.useCallback((y) => y.kind !== Z.Custom ? Vr[y.kind] : Fn?.find((A) => A.isMatch(y)), [Fn, Vr]);
  let { sizedColumns: dn, nonGrowWidth: At } = s0(b, He, Me, $t[0] - (U === 0 ? 0 : yr) - $t[2], wr, Fa, dt, rn, V.current);
  Cn !== "none" && (At += yr);
  const Wn = d.useMemo(() => dn.some((y) => y.group !== void 0), [dn]), pn = Wn ? zi + Io : zi, fi = X.rows.length, fr = Cn === "none" ? void 0 : fi === 0 ? !1 : fi === He ? !0 : void 0, rt = d.useMemo(() => Cn === "none" ? dn : [
    {
      title: "",
      width: yr,
      icon: void 0,
      hasMenu: !1,
      style: "normal",
      themeOverride: oi,
      rowMarker: Ar,
      rowMarkerChecked: fr,
      headerRowMarkerTheme: br,
      headerRowMarkerAlwaysVisible: ai,
      headerRowMarkerDisabled: si
    },
    ...dn
  ], [
    Cn,
    dn,
    yr,
    oi,
    Ar,
    fr,
    br,
    ai,
    si
  ]), on = d.useRef({
    height: 1,
    width: 1,
    x: 0,
    y: 0
  }), $r = d.useRef(!1), { setVisibleRegion: Cr, visibleRegion: hr, scrollRef: Nt } = db(Pn, un, rr, on, () => $r.current = !0);
  on.current = hr;
  const Ch = hr.x + U, To = hr.y, mn = d.useRef(null), Sn = d.useCallback((y) => {
    y === !0 ? mn.current?.focus() : window.requestAnimationFrame(() => {
      mn.current?.focus();
    });
  }, []), vn = Vt ? He + 1 : He, Un = d.useCallback((y) => {
    const A = U === 0 ? y : y.map(($) => ({
      ...$,
      location: [$.location[0] - U, $.location[1]]
    })), _ = he?.(A);
    if (_ !== !0)
      for (const $ of A)
        le?.($.location, $.value);
    return _;
  }, [le, he, U]), [Nr, $a] = d.useState(), Do = X.current !== void 0 && X.current.range.width * X.current.range.height > 1 ? X.current.range : void 0, Vl = ri ? X.current?.cell : void 0, Oo = Vl?.[0], Po = Vl?.[1], Sh = d.useMemo(() => {
    if ((St === void 0 || St.length === 0) && (Do ?? Oo ?? Po ?? Nr) === void 0)
      return;
    const y = [];
    if (St !== void 0)
      for (const A of St) {
        const _ = rt.length - A.range.x - U;
        _ > 0 && y.push({
          color: A.color,
          range: {
            ...A.range,
            x: A.range.x + U,
            width: Math.min(_, A.range.width)
          },
          style: A.style
        });
      }
    return Nr !== void 0 && y.push({
      color: Jr(dt.accentColor, 0),
      range: Nr,
      style: "dashed"
    }), Do !== void 0 && y.push({
      color: Jr(dt.accentColor, 0.5),
      range: Do,
      style: "solid-outline"
    }), Oo !== void 0 && Po !== void 0 && y.push({
      color: dt.accentColor,
      range: {
        x: Oo,
        y: Po,
        width: 1,
        height: 1
      },
      style: "solid-outline"
    }), y.length > 0 ? y : void 0;
  }, [
    Nr,
    Do,
    Oo,
    Po,
    St,
    rt.length,
    dt.accentColor,
    U
  ]), $l = d.useRef(rt);
  $l.current = rt;
  const Hn = d.useCallback(([y, A], _ = !1) => {
    const $ = Vt && A === vn - 1;
    if (y === 0 && An) {
      if ($)
        return Xo;
      const K = Hi(A);
      return K === void 0 ? Xo : {
        kind: qn.Marker,
        allowOverlay: !1,
        checkboxStyle: Ar,
        checked: X?.rows.hasIndex(A) === !0,
        markerKind: Cn === "clickable-number" ? "number" : Cn,
        row: cr + K,
        drawHandle: nn !== void 0,
        cursor: Cn === "clickable-number" ? "pointer" : void 0
      };
    } else if ($) {
      const z = y === U ? Oe?.hint ?? "" : "", W = $l.current[y];
      if (W?.trailingRowOptions?.disabled === !0)
        return Xo;
      {
        const J = W?.trailingRowOptions?.hint ?? z, ae = W?.trailingRowOptions?.addIcon ?? Oe?.addIcon;
        return {
          kind: qn.NewRow,
          hint: J,
          allowOverlay: !1,
          icon: ae
        };
      }
    } else {
      const K = y - U;
      if (_ || mt?.strict === !0) {
        const W = on.current, J = W.x > K || K > W.x + W.width || W.y > A || A > W.y + W.height || A >= Ua.current, ae = K === W.extras?.selected?.[0] && A === W.extras?.selected[1];
        let Se = !1;
        if (W.extras?.freezeRegions !== void 0) {
          for (const Et of W.extras.freezeRegions)
            if (Zr(Et, K, A)) {
              Se = !0;
              break;
            }
        }
        if (J && !ae && !Se)
          return Xo;
      }
      let z = C([K, A]);
      return U !== 0 && z.span !== void 0 && (z = {
        ...z,
        span: [z.span[0] + U, z.span[1] + U]
      }), z;
    }
  }, [
    Vt,
    vn,
    An,
    Hi,
    Ar,
    X?.rows,
    Cn,
    cr,
    nn,
    U,
    Oe?.hint,
    Oe?.addIcon,
    mt?.strict,
    C
  ]), Na = d.useCallback((y) => {
    let A = kt?.(y) ?? { name: y };
    return ce !== void 0 && y !== "" && (A = {
      icon: A.icon,
      name: A.name,
      overrideTheme: A.overrideTheme,
      actions: [
        ...A.actions ?? [],
        {
          title: "Rename",
          icon: "renameIcon",
          onClick: (_) => qa({
            group: A.name,
            bounds: _.bounds
          })
        }
      ]
    }), A;
  }, [kt, ce]), Lo = d.useCallback((y) => {
    const [A, _] = y.cell, $ = rt[A], j = $?.group !== void 0 ? Na($.group)?.overrideTheme : void 0, K = $?.themeOverride, z = Hr?.(_);
    o({
      ...y,
      theme: pr(dt, j, K, z, y.content.themeOverride)
    });
  }, [Hr, rt, Na, dt]), hi = d.useCallback((y, A, _) => {
    if (X.current === void 0)
      return;
    const [$, j] = X.current.cell, K = Hn([$, j]);
    if (K.kind !== Z.Boolean && K.allowOverlay) {
      let z = K;
      if (_ !== void 0)
        switch (z.kind) {
          case Z.Number: {
            const W = Bp(() => _ === "-" ? -0 : Number.parseFloat(_), 0);
            z = {
              ...z,
              data: Number.isNaN(W) ? 0 : W
            };
            break;
          }
          case Z.Text:
          case Z.Markdown:
          case Z.Uri:
            z = {
              ...z,
              data: _
            };
            break;
        }
      Lo({
        target: y,
        content: z,
        initialValue: _,
        cell: [$, j],
        highlight: _ === void 0,
        forceEditMode: _ !== void 0,
        activation: A
      });
    } else K.kind === Z.Boolean && A.inputType === "keyboard" && K.readonly !== !0 && (Un([
      {
        location: X.current.cell,
        value: {
          ...K,
          data: ff(K.data)
        }
      }
    ]), mn.current?.damage([{ cell: X.current.cell }]));
  }, [Hn, X, Un, Lo]), Nl = d.useCallback((y, A) => {
    const _ = mn.current?.getBounds(y, A);
    if (_ === void 0 || Nt.current === null)
      return;
    const $ = Hn([y, A]);
    $.allowOverlay && Lo({
      target: _,
      content: $,
      initialValue: void 0,
      highlight: !0,
      cell: [y, A],
      forceEditMode: !0,
      activation: { inputType: "keyboard", key: "Enter" }
    });
  }, [Hn, Nt, Lo]), qt = d.useCallback((y, A, _ = "both", $ = 0, j = 0, K = void 0) => {
    if (Nt.current !== null) {
      const z = mn.current, W = a.current, J = typeof y != "number" ? y.unit === "cell" ? y.amount : void 0 : y, ae = typeof A != "number" ? A.unit === "cell" ? A.amount : void 0 : A, Se = typeof y != "number" && y.unit === "px" ? y.amount : void 0, Et = typeof A != "number" && A.unit === "px" ? A.amount : void 0;
      if (z !== null && W !== null) {
        let Je = {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }, Ke = 0, ft = 0;
        if ((J !== void 0 || ae !== void 0) && (Je = z.getBounds((J ?? 0) + U, ae ?? 0) ?? Je, Je.width === 0 || Je.height === 0))
          return;
        const it = W.getBoundingClientRect(), Ct = it.width / W.offsetWidth;
        if (Se !== void 0 && (Je = {
          ...Je,
          x: Se - it.left - Nt.current.scrollLeft,
          width: 1
        }), Et !== void 0 && (Je = {
          ...Je,
          y: Et + it.top - Nt.current.scrollTop,
          height: 1
        }), Je !== void 0) {
          const xt = {
            x: Je.x - $,
            y: Je.y - j,
            width: Je.width + 2 * $,
            height: Je.height + 2 * j
          };
          let wi = 0;
          for (let Qa = 0; Qa < De; Qa++)
            wi += dn[Qa].width;
          let ji = 0;
          const qi = ct + (dr ? 1 : 0);
          qi > 0 && (ji = ni(vn, qi, rr));
          let ar = wi * Ct + it.left + U * yr * Ct, yi = it.right, jr = it.top + pn * Ct, Ci = it.bottom - ji * Ct;
          const $o = Je.width + $ * 2;
          switch (K?.hAlign) {
            case "start":
              yi = ar + $o;
              break;
            case "end":
              ar = yi - $o;
              break;
            case "center":
              ar = Math.floor((ar + yi) / 2) - $o / 2, yi = ar + $o;
              break;
          }
          const No = Je.height + j * 2;
          switch (K?.vAlign) {
            case "start":
              Ci = jr + No;
              break;
            case "end":
              jr = Ci - No;
              break;
            case "center":
              jr = Math.floor((jr + Ci) / 2) - No / 2, Ci = jr + No;
              break;
          }
          ar > xt.x ? Ke = xt.x - ar : yi < xt.x + xt.width && (Ke = xt.x + xt.width - yi), jr > xt.y ? ft = xt.y - jr : Ci < xt.y + xt.height && (ft = xt.y + xt.height - Ci), _ === "vertical" || typeof y == "number" && y < De ? Ke = 0 : (_ === "horizontal" || typeof A == "number" && A >= vn - qi) && (ft = 0), (Ke !== 0 || ft !== 0) && (Ct !== 1 && (Ke /= Ct, ft /= Ct), Nt.current.scrollTo({
            left: Ke + Nt.current.scrollLeft,
            top: ft + Nt.current.scrollTop,
            behavior: K?.behavior ?? "auto"
          }));
        }
      }
    }
  }, [
    U,
    ct,
    yr,
    Nt,
    pn,
    De,
    dn,
    vn,
    dr,
    rr
  ]), Ba = d.useRef(Nl), Wa = d.useRef(C);
  Ba.current = Nl, Wa.current = C;
  const Ua = d.useRef(He);
  Ua.current = He;
  const Bl = d.useRef(rt.length);
  Bl.current = rt.length;
  const Sr = d.useCallback(async (y, A = !0, _) => {
    if (rt[y]?.trailingRowOptions?.disabled === !0)
      return;
    const j = ve?.();
    let K, z = !0;
    j !== void 0 && (K = await j, K === "top" && (z = !1), typeof K == "number" && (z = !1));
    let W = 0;
    const J = () => {
      if (Ua.current <= He) {
        W < 500 && window.setTimeout(J, W), W = 50 + W * 2;
        return;
      }
      const ae = typeof K == "number" ? K : z ? He : 0;
      Vo.current(y - U, ae, "both", 0, 0, _ ? { behavior: _ } : void 0), Rt({
        cell: [y, ae],
        range: {
          x: y,
          y: ae,
          width: 1,
          height: 1
        }
      }, !1, !1, "edit");
      const Se = Wa.current([y - U, ae]);
      Se.allowOverlay && Ri(Se) && Se.readonly !== !0 && A && window.setTimeout(() => {
        Ba.current(y, ae);
      }, 0);
    };
    J();
  }, [rt, ve, U, He, Rt]), Fo = d.useCallback(async (y, A = !0) => {
    const _ = et?.();
    let $, j = !0;
    _ !== void 0 && ($ = await _, $ === "left" && (j = !1), typeof $ == "number" && (j = !1));
    let K = 0;
    const z = () => {
      if (Bl.current <= rt.length) {
        K < 500 && window.setTimeout(z, K), K = 50 + K * 2;
        return;
      }
      const W = typeof $ == "number" ? $ : j ? rt.length : 0;
      qt(W - U, y), Rt({
        cell: [W, y],
        range: {
          x: W,
          y,
          width: 1,
          height: 1
        }
      }, !1, !1, "edit");
      const J = Wa.current([W - U, y]);
      J.allowOverlay && Ri(J) && J.readonly !== !0 && A && window.setTimeout(() => {
        Ba.current(W, y);
      }, 0);
    };
    z();
  }, [rt, et, U, qt, Rt]), gi = d.useCallback((y) => {
    const A = dn[y]?.trailingRowOptions?.targetColumn ?? Oe?.targetColumn;
    if (typeof A == "number")
      return A + (An ? 1 : 0);
    if (typeof A == "object") {
      const _ = b.indexOf(A);
      if (_ >= 0)
        return _ + (An ? 1 : 0);
    }
  }, [dn, b, An, Oe?.targetColumn]), xr = d.useRef(), pi = d.useRef(), Vi = d.useCallback((y, A) => {
    const [_, $] = A;
    return pr(dt, rt[_]?.themeOverride, Hr?.($), y.themeOverride);
  }, [Hr, rt, dt]), { mapper: Br } = ub(wt, v), Yn = wt?.navigationBehavior, $i = d.useCallback((y) => {
    const A = ma.value ? y.metaKey : y.ctrlKey, _ = A && se === "multi", [$, j] = y.location, K = X.columns, z = X.rows, [W, J] = X.current?.cell ?? [];
    if (y.kind === "cell") {
      if (pi.current = void 0, Wr.current = [$, j], $ === 0 && An) {
        if (Vt === !0 && j === He || Cn === "number" || se === "none")
          return;
        const ae = Hn(y.location);
        if (ae.kind !== qn.Marker)
          return;
        if (nn !== void 0) {
          const Je = rn(ae);
          Vn(Je?.kind === qn.Marker);
          const Ke = Je?.onClick?.({
            ...y,
            cell: ae,
            posX: y.localEventX,
            posY: y.localEventY,
            bounds: y.bounds,
            theme: Vi(ae, y.location),
            preventDefault: () => {
            }
          });
          if (Ke === void 0 || Ke.checked === ae.checked)
            return;
        }
        o(void 0), Sn();
        const Se = z.hasIndex(j), Et = xr.current;
        if (se === "multi" && (y.shiftKey || y.isLongTouch === !0) && Et !== void 0 && z.hasIndex(Et)) {
          const Je = [Math.min(Et, j), Math.max(Et, j) + 1];
          _ || Le === "multi" ? ut(void 0, Je, !0) : ut(Qe.fromSingleSelection(Je), void 0, _);
        } else se === "multi" && (_ || y.isTouch || Le === "multi") ? Se ? ut(z.remove(j), void 0, !0) : (ut(void 0, j, !0), xr.current = j) : Se && z.length === 1 ? ut(Qe.empty(), void 0, A) : (ut(Qe.fromSingleSelection(j), void 0, A), xr.current = j);
      } else if ($ >= U && Vt && j === He) {
        const ae = gi($);
        Sr(ae ?? $);
      } else if (W !== $ || J !== j) {
        const ae = Hn(y.location), Se = rn(ae);
        if (Se?.onSelect !== void 0) {
          let Ke = !1;
          if (Se.onSelect({
            ...y,
            cell: ae,
            posX: y.localEventX,
            posY: y.localEventY,
            bounds: y.bounds,
            preventDefault: () => Ke = !0,
            theme: Vi(ae, y.location)
          }), Ke)
            return;
        }
        if (Yn === "block" && Br(j).isGroupHeader)
          return;
        const Et = dr && j === He, Je = dr && X !== void 0 && X.current?.cell[1] === He;
        if ((y.shiftKey || y.isLongTouch === !0) && W !== void 0 && J !== void 0 && X.current !== void 0 && !Je) {
          if (Et)
            return;
          const Ke = Math.min($, W), ft = Math.max($, W), it = Math.min(j, J), Ct = Math.max(j, J);
          Rt({
            ...X.current,
            range: {
              x: Ke,
              y: it,
              width: ft - Ke + 1,
              height: Ct - it + 1
            }
          }, !0, A, "click"), xr.current = void 0, Sn();
        } else
          Rt({
            cell: [$, j],
            range: { x: $, y: j, width: 1, height: 1 }
          }, !0, A, "click"), xr.current = void 0, o(void 0), Sn();
      }
    } else if (y.kind === "header")
      if (Wr.current = [$, j], o(void 0), An && $ === 0)
        xr.current = void 0, pi.current = void 0, !si && se === "multi" && (z.length !== He ? ut(Qe.fromSingleSelection([0, He]), void 0, A) : ut(Qe.empty(), void 0, A), Sn());
      else {
        const ae = pi.current;
        if (re === "multi" && (y.shiftKey || y.isLongTouch === !0) && ae !== void 0 && K.hasIndex(ae)) {
          const Se = [Math.min(ae, $), Math.max(ae, $) + 1];
          A || y.isTouch || ht === "multi" ? Ye(void 0, Se, A) : Ye(Qe.fromSingleSelection(Se), void 0, A);
        } else re === "multi" && (A || y.isTouch || ht === "multi") ? (K.hasIndex($) ? Ye(K.remove($), void 0, A) : Ye(void 0, $, A), pi.current = $) : re !== "none" && (K.hasIndex($) ? Ye(K.remove($), void 0, A) : Ye(Qe.fromSingleSelection($), void 0, A), pi.current = $);
        xr.current = void 0, Sn();
      }
    else y.kind === Jn ? Wr.current = [$, j] : y.kind === va && !y.isMaybeScrollbar && (pe(Ko, !1), o(void 0), Sn(), ln?.(), xr.current = void 0, pi.current = void 0);
  }, [
    se,
    re,
    X,
    An,
    U,
    Vt,
    He,
    Cn,
    Hn,
    nn,
    Sn,
    Le,
    ht,
    rn,
    Vi,
    ut,
    gi,
    Sr,
    Yn,
    Br,
    dr,
    Rt,
    si,
    Ye,
    pe,
    ln
  ]), Ni = d.useRef(!1), Wr = d.useRef(), Wl = d.useRef(hr), or = d.useRef(), xh = d.useCallback((y) => {
    if (mi.current = !1, Wl.current = on.current, y.button !== 0 && y.button !== 1) {
      or.current = void 0;
      return;
    }
    const A = performance.now();
    or.current = {
      button: y.button,
      time: A,
      location: y.location
    }, y?.kind === "header" && (Ni.current = !0);
    const _ = y.kind === "cell" && y.isFillHandle;
    !_ && y.kind !== "cell" && y.isEdge || (u({
      previousSelection: X,
      fillHandle: _
    }), Wr.current = void 0, !y.isTouch && y.button === 0 && !_ ? $i(y) : !y.isTouch && y.button === 1 && (Wr.current = y.location));
  }, [X, $i]), [ja, qa] = d.useState(), Ul = d.useCallback((y) => {
    if (y.kind !== Jn || re !== "multi")
      return;
    const A = ma.value ? y.metaKey : y.ctrlKey, [_] = y.location, $ = X.columns;
    if (_ < U)
      return;
    const j = rt[_];
    let K = _, z = _;
    for (let W = _ - 1; W >= U && vo(j.group, rt[W].group); W--)
      K--;
    for (let W = _ + 1; W < rt.length && vo(j.group, rt[W].group); W++)
      z++;
    if (Sn(), A || y.isTouch || ht === "multi")
      if ($.hasAll([K, z + 1])) {
        let W = $;
        for (let J = K; J <= z; J++)
          W = W.remove(J);
        Ye(W, void 0, A);
      } else
        Ye(void 0, [K, z + 1], A);
    else
      Ye(Qe.fromSingleSelection([K, z + 1]), void 0, A);
  }, [
    re,
    Sn,
    X.columns,
    rt,
    U,
    Ye,
    ht
  ]), mi = d.useRef(!1), _o = d.useCallback(async (y) => {
    if (Q !== void 0 && je !== void 0) {
      const A = on.current.y, _ = on.current.height;
      let $ = Q({
        x: y,
        y: A,
        width: 1,
        height: Math.min(_, He - A)
      }, V.current.signal);
      typeof $ != "object" && ($ = await $());
      const j = dn[y - U], z = document.createElement("canvas").getContext("2d", { alpha: !1 });
      if (z !== null) {
        z.font = dt.baseFontFull;
        const W = Jd(z, dt, j, 0, $, wr, li, !1, rn);
        je?.(j, W.width, y, W.width);
      }
    }
  }, [
    dn,
    Q,
    li,
    dt,
    wr,
    je,
    U,
    He,
    rn
  ]), [kh, Ga] = d.useState(), vi = d.useCallback(async (y, A) => {
    const _ = y.current?.range;
    if (_ === void 0 || Q === void 0 || A.current === void 0)
      return;
    const $ = A.current.range;
    if (R !== void 0) {
      let W = !1;
      if (R({
        fillDestination: { ...$, x: $.x - U },
        patternSource: { ..._, x: _.x - U },
        preventDefault: () => W = !0
      }), W)
        return;
    }
    let j = Q(_, V.current.signal);
    typeof j != "object" && (j = await j());
    const K = j, z = [];
    for (let W = 0; W < $.width; W++)
      for (let J = 0; J < $.height; J++) {
        const ae = [$.x + W, $.y + J];
        if ($d(ae, _))
          continue;
        const Se = K[J % _.height][W % _.width];
        Ii(Se) || !Ri(Se) || z.push({
          location: ae,
          value: { ...Se }
        });
      }
    Un(z), mn.current?.damage(z.map((W) => ({
      cell: W.location
    })));
  }, [Q, Un, R, U]), jl = d.useCallback(() => {
    if (X.current === void 0 || X.current.range.width <= 1)
      return;
    const y = {
      ...X,
      current: {
        ...X.current,
        range: {
          ...X.current.range,
          width: 1
        }
      }
    };
    vi(y, X);
  }, [vi, X]), ql = d.useCallback(() => {
    if (X.current === void 0 || X.current.range.height <= 1)
      return;
    const y = {
      ...X,
      current: {
        ...X.current,
        range: {
          ...X.current.range,
          height: 1
        }
      }
    };
    vi(y, X);
  }, [vi, X]), Mh = d.useCallback((y, A) => {
    const _ = l;
    if (u(void 0), $a(void 0), Ga(void 0), Ni.current = !1, A)
      return;
    if (_?.fillHandle === !0 && X.current !== void 0 && _.previousSelection?.current !== void 0) {
      if (Nr === void 0)
        return;
      const Se = {
        ...X,
        current: {
          ...X.current,
          range: rf(_.previousSelection.current.range, Nr)
        }
      };
      vi(_.previousSelection, Se), pe(Se, !0);
      return;
    }
    const [$, j] = y.location, [K, z] = Wr.current ?? [], W = () => {
      mi.current = !0;
    }, J = (Se) => {
      const Et = Se.isTouch || K === $ && z === j;
      if (Et && I?.([$ - U, j], {
        ...Se,
        preventDefault: W
      }), Se.button === 1)
        return !mi.current;
      if (!mi.current) {
        const Je = Hn(y.location), Ke = rn(Je);
        if (Ke !== void 0 && Ke.onClick !== void 0 && Et) {
          const it = Ke.onClick({
            ...Se,
            cell: Je,
            posX: Se.localEventX,
            posY: Se.localEventY,
            bounds: Se.bounds,
            theme: Vi(Je, y.location),
            preventDefault: W
          });
          it !== void 0 && !Ii(it) && Mi(it) && (Un([{ location: Se.location, value: it }]), mn.current?.damage([
            {
              cell: Se.location
            }
          ]));
        }
        if (mi.current || X.current === void 0)
          return !1;
        let ft = !1;
        switch (Je.activationBehaviorOverride ?? Ie) {
          case "double-click":
          case "second-click": {
            if (_?.previousSelection?.current?.cell === void 0)
              break;
            const [it, Ct] = X.current.cell, [xt, wi] = _.previousSelection.current.cell;
            ft = $ === it && $ === xt && j === Ct && j === wi && (Se.isDoubleClick === !0 || Ie === "second-click");
            break;
          }
          case "single-click": {
            ft = !0;
            break;
          }
        }
        if (ft) {
          const Ct = {
            inputType: "pointer",
            pointerActivation: Se.isDoubleClick === !0 ? "double-click" : Je.activationBehaviorOverride ?? Ie,
            pointerType: Se.isTouch ? "touch" : "mouse"
          };
          return E?.([$ - U, j], Ct), hi(Se.bounds, Ct), !0;
        }
      }
      return !1;
    }, ae = y.location[0] - U;
    if (y.isTouch) {
      const Se = on.current, Et = Wl.current;
      if (Se.x !== Et.x || Se.y !== Et.y)
        return;
      if (y.isLongTouch === !0) {
        if (y.kind === "cell" && fo(X.current?.cell, y.location)) {
          q?.([ae, y.location[1]], {
            ...y,
            preventDefault: W
          });
          return;
        } else if (y.kind === "header" && X.columns.hasIndex($)) {
          ue?.(ae, { ...y, preventDefault: W });
          return;
        } else if (y.kind === Jn) {
          if (ae < 0)
            return;
          te?.(ae, { ...y, preventDefault: W });
          return;
        }
      }
      y.kind === "cell" ? J(y) || $i(y) : y.kind === Jn ? N?.(ae, { ...y, preventDefault: W }) : (y.kind === Ir && M?.(ae, {
        ...y,
        preventDefault: W
      }), $i(y));
      return;
    }
    if (y.kind === "header") {
      if (ae < 0)
        return;
      y.isEdge ? y.isDoubleClick === !0 && _o($) : y.button === 0 && $ === K && j === z && M?.(ae, { ...y, preventDefault: W });
    }
    if (y.kind === Jn) {
      if (ae < 0)
        return;
      y.button === 0 && $ === K && j === z && (N?.(ae, { ...y, preventDefault: W }), mi.current || Ul(y));
    }
    y.kind === "cell" && (y.button === 0 || y.button === 1) && J(y), Wr.current = void 0;
  }, [
    l,
    X,
    U,
    Nr,
    vi,
    pe,
    I,
    Hn,
    rn,
    Ie,
    Vi,
    Un,
    E,
    hi,
    q,
    ue,
    te,
    $i,
    N,
    M,
    _o,
    Ul
  ]), Rh = d.useCallback((y) => {
    const A = {
      ...y,
      location: [y.location[0] - U, y.location[1]]
    };
    tt?.(A), l !== void 0 && y.buttons === 0 && (u(void 0), $a(void 0), Ga(void 0), Ni.current = !1), Ga((_) => Ni.current ? [y.scrollEdge[0], 0] : y.scrollEdge[0] === _?.[0] && y.scrollEdge[1] === _[1] ? _ : l === void 0 || (or.current?.location[0] ?? 0) < U ? void 0 : y.scrollEdge);
  }, [l, tt, U]), Eh = d.useCallback((y, A) => {
    nt?.(y - U, A);
  }, [nt, U]), Ih = d.useCallback((y, A) => {
    Xe?.(y - U, A);
  }, [Xe, U]), bi = X?.current?.cell, Th = d.useCallback((y, A, _, $, j, K) => {
    $r.current = !1;
    let z = bi;
    z !== void 0 && (z = [z[0] - U, z[1]]);
    const W = De === 0 ? void 0 : {
      x: 0,
      y: y.y,
      width: De,
      height: y.height
    }, J = [];
    W !== void 0 && J.push(W), ct > 0 && (J.push({
      x: y.x - U,
      y: He - ct,
      width: y.width,
      height: ct
    }), De > 0 && J.push({
      x: 0,
      y: He - ct,
      width: De,
      height: ct
    }));
    const ae = {
      x: y.x - U,
      y: y.y,
      width: y.width,
      height: Vt && y.y + y.height >= He ? y.height - 1 : y.height,
      tx: j,
      ty: K,
      extras: {
        selected: z,
        freezeRegion: W,
        freezeRegions: J
      }
    };
    on.current = ae, Cr(ae), di([A, _, $]), Dn?.(ae, ae.tx, ae.ty, ae.extras);
  }, [
    bi,
    U,
    Vt,
    He,
    De,
    ct,
    Cr,
    Dn
  ]), Dh = Er(T, d.useCallback((y, A) => T?.(y - U, A - U) !== !1, [T, U])), Oh = Er(ke, d.useCallback((y, A) => {
    ke?.(y - U, A - U), re !== "none" && Ye(Qe.fromSingleSelection(A), void 0, !0);
  }, [re, ke, U, Ye])), Ya = d.useRef(!1), Ph = d.useCallback((y) => {
    if (y.location[0] === 0 && U > 0) {
      y.preventDefault();
      return;
    }
    _e?.({
      ...y,
      location: [y.location[0] - U, y.location[1]]
    }), y.defaultPrevented() || (Ya.current = !0), u(void 0);
  }, [_e, U]), Lh = d.useCallback(() => {
    Ya.current = !1;
  }, []), Gl = wt?.selectionBehavior, Ao = d.useCallback((y) => {
    if (Gl !== "block-spanning")
      return;
    const { isGroupHeader: A, path: _, groupRows: $ } = Br(y);
    if (A)
      return [y, y];
    const j = _[_.length - 1], K = y - j, z = y + $ - j - 1;
    return [K, z];
  }, [Br, Gl]), Xa = d.useRef(), Ka = d.useCallback((y) => {
    if (!cf(y, Xa.current) && (Xa.current = y, !(or?.current?.button !== void 0 && or.current.button >= 1))) {
      if (y.buttons !== 0 && l !== void 0 && or.current?.location[0] === 0 && U === 1 && se === "multi" && l.previousSelection && !l.previousSelection.rows.hasIndex(or.current.location[1]) && X.rows.hasIndex(or.current.location[1])) {
        const A = Math.min(or.current.location[1], y.location[1]), _ = Math.max(or.current.location[1], y.location[1]) + 1;
        ut(Qe.fromSingleSelection([A, _]), void 0, !1);
      } else if (y.buttons !== 0 && l !== void 0 && X.current !== void 0 && !Ya.current && !Ni.current && (Ue === "rect" || Ue === "multi-rect")) {
        const [A, _] = X.current.cell;
        let [$, j] = y.location;
        if (j < 0 && (j = on.current.y), l.fillHandle === !0 && l.previousSelection?.current !== void 0) {
          const K = l.previousSelection.current.range;
          j = Math.min(j, Vt ? He - 1 : He);
          const z = X0(K, $, j, pt);
          $a(z);
        } else {
          if (Vt && _ === He)
            return;
          if (Vt && j === He)
            if (y.kind === va)
              j--;
            else
              return;
          $ = Math.max($, U);
          const W = Ao(_);
          j = W === void 0 ? j : jn(j, W[0], W[1]);
          const J = $ - A, ae = j - _, Se = {
            x: J >= 0 ? A : $,
            y: ae >= 0 ? _ : j,
            width: Math.abs(J) + 1,
            height: Math.abs(ae) + 1
          };
          Rt({
            ...X.current,
            range: Se
          }, !0, !1, "drag");
        }
      }
      Pt?.({ ...y, location: [y.location[0] - U, y.location[1]] });
    }
  }, [
    l,
    U,
    se,
    X,
    Ue,
    Pt,
    ut,
    Vt,
    He,
    pt,
    Ao,
    Rt
  ]), Fh = d.useCallback(() => {
    const y = Xa.current;
    if (y === void 0)
      return;
    const [A, _] = y.scrollEdge;
    let [$, j] = y.location;
    const K = on.current;
    A === -1 ? $ = K.extras?.freezeRegion?.x ?? K.x : A === 1 && ($ = K.x + K.width), _ === -1 ? j = Math.max(0, K.y) : _ === 1 && (j = Math.min(He - 1, K.y + K.height)), $ = jn($, 0, rt.length - 1), j = jn(j, 0, He - 1), Ka({
      ...y,
      location: [$, j]
    });
  }, [rt.length, Ka, He]);
  ib(kh, Nt, Fh);
  const Xn = d.useCallback((y) => {
    if (X.current === void 0)
      return;
    const [A, _] = y, [$, j] = X.current.cell, K = X.current.range;
    let z = K.x, W = K.x + K.width, J = K.y, ae = K.y + K.height;
    const [Se, Et] = Ao(j) ?? [0, He - 1], Je = Et + 1;
    if (_ !== 0)
      switch (_) {
        case 2: {
          ae = Je, J = j, qt(0, ae, "vertical");
          break;
        }
        case -2: {
          J = Se, ae = j + 1, qt(0, J, "vertical");
          break;
        }
        case 1: {
          J < j ? (J++, qt(0, J, "vertical")) : (ae = Math.min(Je, ae + 1), qt(0, ae, "vertical"));
          break;
        }
        case -1: {
          ae > j + 1 ? (ae--, qt(0, ae, "vertical")) : (J = Math.max(Se, J - 1), qt(0, J, "vertical"));
          break;
        }
        default:
          po();
      }
    if (A !== 0)
      if (A === 2)
        W = rt.length, z = $, qt(W - 1 - U, 0, "horizontal");
      else if (A === -2)
        z = U, W = $ + 1, qt(z - U, 0, "horizontal");
      else {
        let Ke = [];
        if (Q !== void 0) {
          const ft = Q({
            x: z,
            y: J,
            width: W - z - U,
            height: ae - J
          }, V.current.signal);
          typeof ft == "object" && (Ke = gb(ft));
        }
        if (A === 1) {
          let ft = !1;
          if (z < $) {
            if (Ke.length > 0) {
              const it = Dr(z + 1, $ + 1).find((Ct) => !Ke.includes(Ct - U));
              it !== void 0 && (z = it, ft = !0);
            } else
              z++, ft = !0;
            ft && qt(z, 0, "horizontal");
          }
          ft || (W = Math.min(rt.length, W + 1), qt(W - 1 - U, 0, "horizontal"));
        } else if (A === -1) {
          let ft = !1;
          if (W > $ + 1) {
            if (Ke.length > 0) {
              const it = Dr(W - 1, $, -1).find((Ct) => !Ke.includes(Ct - U));
              it !== void 0 && (W = it, ft = !0);
            } else
              W--, ft = !0;
            ft && qt(W - U, 0, "horizontal");
          }
          ft || (z = Math.max(U, z - 1), qt(z - U, 0, "horizontal"));
        } else
          po();
      }
    Rt({
      cell: X.current.cell,
      range: {
        x: z,
        y: J,
        width: W - z,
        height: ae - J
      }
    }, !0, !1, "keyboard-select");
  }, [
    Q,
    Ao,
    X,
    rt.length,
    U,
    He,
    qt,
    Rt
  ]), Za = d.useRef(_r);
  Za.current = _r;
  const kr = d.useCallback((y, A, _, $) => {
    const j = vn - (_ ? 0 : 1);
    y = jn(y, U, dn.length - 1 + U), A = jn(A, 0, j);
    const K = bi?.[0], z = bi?.[1];
    if (y === K && A === z)
      return !1;
    if ($ && X.current !== void 0) {
      const W = [...X.current.rangeStack];
      (X.current.range.width > 1 || X.current.range.height > 1) && W.push(X.current.range), pe({
        ...X,
        current: {
          cell: [y, A],
          range: { x: y, y: A, width: 1, height: 1 },
          rangeStack: W
        }
      }, !0);
    } else
      Rt({
        cell: [y, A],
        range: { x: y, y: A, width: 1, height: 1 }
      }, !0, !1, "keyboard-nav");
    return c.current !== void 0 && c.current[0] === y && c.current[1] === A && (c.current = void 0), Za.current && qt(y - U, A), !0;
  }, [
    vn,
    U,
    dn.length,
    bi,
    X,
    qt,
    pe,
    Rt
  ]), _h = d.useCallback((y, A) => {
    i?.cell !== void 0 && y !== void 0 && Mi(y) && (Un([{ location: i.cell, value: y }]), window.requestAnimationFrame(() => {
      mn.current?.damage([
        {
          cell: i.cell
        }
      ]);
    })), Sn(!0), o(void 0);
    const [_, $] = A;
    if (X.current !== void 0 && (_ !== 0 || $ !== 0)) {
      const j = X.current.cell[1] === vn - 1 && y !== void 0, K = X.current.cell[0] === rt.length - 1 && y !== void 0;
      let z = !0;
      if (j && $ === 1 && ve !== void 0) {
        z = !1;
        const W = X.current.cell[0] + _, J = gi(W);
        Sr(J ?? W, !1);
      }
      if (K && _ === 1 && et !== void 0) {
        z = !1;
        const W = X.current.cell[1] + $;
        Fo(W, !1);
      }
      z && kr(jn(X.current.cell[0] + _, 0, rt.length - 1), jn(X.current.cell[1] + $, 0, vn - 1), j, !1);
    }
    P?.(y, A);
  }, [
    i?.cell,
    Sn,
    X,
    P,
    Un,
    vn,
    kr,
    rt.length,
    Sr,
    Fo,
    ve,
    et,
    gi
  ]), Ah = d.useMemo(() => `gdg-overlay-${hb++}`, []), Ur = d.useCallback((y) => {
    Sn();
    const A = [];
    for (let _ = y.x; _ < y.x + y.width; _++)
      for (let $ = y.y; $ < y.y + y.height; $++) {
        const j = C([_ - U, $]);
        if (!j.allowOverlay && j.kind !== Z.Boolean)
          continue;
        let K;
        if (j.kind === Z.Custom) {
          const z = rn(j), W = z?.provideEditor?.({
            ...j,
            location: [_ - U, $]
          });
          z?.onDelete !== void 0 ? K = z.onDelete(j) : Wp(W) && (K = W?.deletedValue?.(j));
        } else (Mi(j) && j.allowOverlay || j.kind === Z.Boolean) && (K = rn(j)?.onDelete?.(j));
        K !== void 0 && !Ii(K) && Mi(K) && A.push({ location: [_, $], value: K });
      }
    Un(A), mn.current?.damage(A.map((_) => ({ cell: _.location })));
  }, [Sn, C, rn, Un, U]), Bi = i !== void 0, Yl = d.useCallback((y) => {
    const A = () => {
      y.stopPropagation(), y.preventDefault();
    }, _ = {
      didMatch: !1
    }, { bounds: $ } = y, j = X.columns, K = X.rows, z = ir;
    if (!Bi && ot(z.clear, y, _))
      pe(Ko, !1), ln?.();
    else if (!Bi && ot(z.selectAll, y, _))
      pe({
        columns: Qe.empty(),
        rows: Qe.empty(),
        current: {
          cell: X.current?.cell ?? [U, 0],
          range: {
            x: U,
            y: 0,
            width: b.length,
            height: He
          },
          rangeStack: []
        }
      }, !1);
    else if (ot(z.search, y, _))
      s?.current?.focus({ preventScroll: !0 }), zr(!0);
    else if (ot(z.delete, y, _)) {
      const it = jt?.(X) ?? !0;
      if (it !== !1) {
        const Ct = it === !0 ? X : it;
        if (Ct.current !== void 0) {
          Ur(Ct.current.range);
          for (const xt of Ct.current.rangeStack)
            Ur(xt);
        }
        for (const xt of Ct.rows)
          Ur({
            x: U,
            y: xt,
            width: b.length,
            height: 1
          });
        for (const xt of Ct.columns)
          Ur({
            x: xt,
            y: 0,
            width: 1,
            height: He
          });
      }
    }
    if (_.didMatch)
      return A(), !0;
    if (X.current === void 0)
      return !1;
    let [W, J] = X.current.cell;
    const [, ae] = X.current.cell;
    let Se = !1, Et = !1;
    if (ot(z.scrollToSelectedCell, y, _))
      Vo.current(W - U, J);
    else if (re !== "none" && ot(z.selectColumn, y, _))
      j.hasIndex(W) ? Ye(j.remove(W), void 0, !0) : re === "single" ? Ye(Qe.fromSingleSelection(W), void 0, !0) : Ye(void 0, W, !0);
    else if (se !== "none" && ot(z.selectRow, y, _))
      K.hasIndex(J) ? ut(K.remove(J), void 0, !0) : se === "single" ? ut(Qe.fromSingleSelection(J), void 0, !0) : ut(void 0, J, !0);
    else if (!Bi && $ !== void 0 && ot(z.activateCell, y, _))
      if (J === He && Vt)
        window.setTimeout(() => {
          const it = gi(W);
          Sr(it ?? W);
        }, 0);
      else {
        const it = {
          inputType: "keyboard",
          key: y.key
        };
        E?.([W - U, J], it), hi($, it);
      }
    else X.current.range.height > 1 && ot(z.downFill, y, _) ? ql() : X.current.range.width > 1 && ot(z.rightFill, y, _) ? jl() : ot(z.goToNextPage, y, _) ? J += Math.max(1, on.current.height - 4) : ot(z.goToPreviousPage, y, _) ? J -= Math.max(1, on.current.height - 4) : ot(z.goToFirstCell, y, _) ? (o(void 0), J = 0, W = 0) : ot(z.goToLastCell, y, _) ? (o(void 0), J = Number.MAX_SAFE_INTEGER, W = Number.MAX_SAFE_INTEGER) : ot(z.selectToFirstCell, y, _) ? (o(void 0), Xn([-2, -2])) : ot(z.selectToLastCell, y, _) ? (o(void 0), Xn([2, 2])) : Bi ? (ot(z.closeOverlay, y, _) && o(void 0), ot(z.acceptOverlayDown, y, _) && (o(void 0), J++), ot(z.acceptOverlayUp, y, _) && (o(void 0), J--), ot(z.acceptOverlayLeft, y, _) && (o(void 0), W--), ot(z.acceptOverlayRight, y, _) && (o(void 0), W++)) : (ot(z.goDownCell, y, _) ? J += 1 : ot(z.goUpCell, y, _) ? J -= 1 : ot(z.goRightCell, y, _) ? W += 1 : ot(z.goLeftCell, y, _) ? W -= 1 : ot(z.goDownCellRetainSelection, y, _) ? (J += 1, Se = !0) : ot(z.goUpCellRetainSelection, y, _) ? (J -= 1, Se = !0) : ot(z.goRightCellRetainSelection, y, _) ? (W += 1, Se = !0) : ot(z.goLeftCellRetainSelection, y, _) ? (W -= 1, Se = !0) : ot(z.goToLastRow, y, _) ? J = He - 1 : ot(z.goToFirstRow, y, _) ? J = Number.MIN_SAFE_INTEGER : ot(z.goToLastColumn, y, _) ? W = Number.MAX_SAFE_INTEGER : ot(z.goToFirstColumn, y, _) ? W = Number.MIN_SAFE_INTEGER : (Ue === "rect" || Ue === "multi-rect") && (ot(z.selectGrowDown, y, _) ? Xn([0, 1]) : ot(z.selectGrowUp, y, _) ? Xn([0, -1]) : ot(z.selectGrowRight, y, _) ? Xn([1, 0]) : ot(z.selectGrowLeft, y, _) ? Xn([-1, 0]) : ot(z.selectToLastRow, y, _) ? Xn([0, 2]) : ot(z.selectToFirstRow, y, _) ? Xn([0, -2]) : ot(z.selectToLastColumn, y, _) ? Xn([2, 0]) : ot(z.selectToFirstColumn, y, _) && Xn([-2, 0])), Et = _.didMatch);
    if (Yn !== void 0 && Yn !== "normal" && J !== ae) {
      const it = Yn === "skip-up" || Yn === "skip" || Yn === "block", Ct = Yn === "skip-down" || Yn === "skip" || Yn === "block", xt = J < ae;
      if (xt && it) {
        for (; J >= 0 && Br(J).isGroupHeader; )
          J--;
        J < 0 && (J = ae);
      } else if (!xt && Ct) {
        for (; J < He && Br(J).isGroupHeader; )
          J++;
        J >= He && (J = ae);
      }
    }
    const Ke = kr(W, J, !1, Se), ft = _.didMatch;
    return ft && (Ke || !Et || In) && A(), ft;
  }, [
    Yn,
    Bi,
    X,
    ir,
    re,
    se,
    Ue,
    U,
    Br,
    He,
    kr,
    pe,
    ln,
    b.length,
    jt,
    In,
    Ur,
    Ye,
    ut,
    Vt,
    gi,
    Sr,
    E,
    hi,
    ql,
    jl,
    Xn
  ]), Wi = d.useCallback((y) => {
    let A = !1;
    if (G !== void 0 && G({
      ...y,
      ...y.location && {
        location: [y.location[0] - U, y.location[1]]
      },
      cancel: () => {
        A = !0;
      }
    }), A || Yl(y) || X.current === void 0)
      return;
    const [_, $] = X.current.cell, j = on.current;
    if (xe && !y.metaKey && !y.ctrlKey && X.current !== void 0 && y.key.length === 1 && /[\p{L}\p{M}\p{N}\p{S}\p{P}]/u.test(y.key) && y.bounds !== void 0 && Ri(C([_ - U, Math.max(0, Math.min($, He - 1))]))) {
      if ((!Vt || $ !== He) && (j.y > $ || $ > j.y + j.height || j.x > _ || _ > j.x + j.width))
        return;
      const K = {
        inputType: "keyboard",
        key: y.key
      };
      E?.([_ - U, $], K), hi(y.bounds, K, y.key), y.stopPropagation(), y.preventDefault();
    }
  }, [
    xe,
    G,
    Yl,
    X,
    C,
    U,
    He,
    Vt,
    E,
    hi
  ]), Hh = d.useCallback((y, A) => {
    const _ = y.location[0] - U;
    if (y.kind === "header" && ue?.(_, { ...y, preventDefault: A }), y.kind === Jn) {
      if (_ < 0)
        return;
      te?.(_, { ...y, preventDefault: A });
    }
    if (y.kind === "cell") {
      const [$, j] = y.location;
      q?.([_, j], {
        ...y,
        preventDefault: A
      }), jm(X, y.location) || kr($, j, !1, !1);
    }
  }, [
    X,
    q,
    te,
    ue,
    U,
    kr
  ]), Ja = d.useCallback(async (y) => {
    if (!ir.paste)
      return;
    function A(z, W, J, ae) {
      const Se = typeof J == "object" ? J?.join(`
`) ?? "" : J?.toString() ?? "";
      if (!Ii(z) && Ri(z) && z.readonly !== !0) {
        const Et = x?.(Se, z);
        if (Et !== void 0 && Mi(Et))
          return {
            location: W,
            value: Et
          };
        const Je = rn(z);
        if (Je === void 0)
          return;
        if (Je.kind === Z.Custom) {
          Vn(z.kind === Z.Custom);
          const Ke = Je.onPaste?.(Se, z.data);
          return Ke === void 0 ? void 0 : {
            location: W,
            value: {
              ...z,
              data: Ke
            }
          };
        } else {
          const Ke = Je.onPaste?.(Se, z, {
            formatted: ae,
            formattedString: typeof ae == "string" ? ae : ae?.join(`
`),
            rawValue: J
          });
          return Ke === void 0 ? void 0 : (Vn(Ke.kind === z.kind), {
            location: W,
            value: Ke
          });
        }
      }
    }
    const _ = X.columns, $ = X.rows, j = Nt.current?.contains(document.activeElement) === !0 || a.current?.contains(document.activeElement) === !0;
    let K;
    if (X.current !== void 0 ? K = [X.current.range.x, X.current.range.y] : _.length === 1 ? K = [_.first() ?? 0, 0] : $.length === 1 && (K = [U, $.first() ?? 0]), j && K !== void 0) {
      let z, W;
      const J = "text/plain", ae = "text/html";
      if (navigator.clipboard.read !== void 0) {
        const Ke = await navigator.clipboard.read();
        for (const ft of Ke) {
          if (ft.types.includes(ae)) {
            const Ct = await (await ft.getType(ae)).text(), xt = nc(Ct);
            if (xt !== void 0) {
              z = xt;
              break;
            }
          }
          ft.types.includes(J) && (W = await (await ft.getType(J)).text());
        }
      } else if (navigator.clipboard.readText !== void 0)
        W = await navigator.clipboard.readText();
      else if (y !== void 0 && y?.clipboardData !== null) {
        if (y.clipboardData.types.includes(ae)) {
          const Ke = y.clipboardData.getData(ae);
          z = nc(Ke);
        }
        z === void 0 && y.clipboardData.types.includes(J) && (W = y.clipboardData.getData(J));
      } else
        return;
      const [Se, Et] = K, Je = [];
      do {
        if (Re === void 0) {
          const Ke = Hn(K), ft = W ?? z?.map((Ct) => Ct.map((xt) => xt.rawValue).join("	")).join("	") ?? "", it = A(Ke, K, ft, void 0);
          it !== void 0 && Je.push(it);
          break;
        }
        if (z === void 0) {
          if (W === void 0)
            return;
          z = Zv(W);
        }
        if (Re === !1 || typeof Re == "function" && Re?.([K[0] - U, K[1]], z.map((Ke) => Ke.map((ft) => ft.rawValue?.toString() ?? ""))) !== !0)
          return;
        for (const [Ke, ft] of z.entries()) {
          if (Ke + Et >= He)
            break;
          for (const [it, Ct] of ft.entries()) {
            const xt = [it + Se, Ke + Et], [wi, ji] = xt;
            if (wi >= rt.length || ji >= vn)
              continue;
            const qi = Hn(xt), ar = A(qi, xt, Ct.rawValue, Ct.formatted);
            ar !== void 0 && Je.push(ar);
          }
        }
      } while (!1);
      Un(Je), mn.current?.damage(Je.map((Ke) => ({
        cell: Ke.location
      })));
    }
  }, [
    x,
    rn,
    Hn,
    X,
    ir.paste,
    Nt,
    rt.length,
    Un,
    vn,
    Re,
    U,
    He
  ]);
  xn("paste", Ja, f, !1, !0);
  const Ui = d.useCallback(async (y, A) => {
    if (!ir.copy)
      return;
    const _ = A === !0 || Nt.current?.contains(document.activeElement) === !0 || a.current?.contains(document.activeElement) === !0, $ = X.columns, j = X.rows, K = (z, W) => {
      if (!qe)
        ic(z, W, y);
      else {
        const J = W.map((ae) => ({
          kind: Z.Text,
          data: b[ae].title,
          displayData: b[ae].title,
          allowOverlay: !1
        }));
        ic([J, ...z], W, y);
      }
    };
    if (_ && Q !== void 0) {
      if (X.current !== void 0) {
        let z = Q(X.current.range, V.current.signal);
        typeof z != "object" && (z = await z()), K(z, Dr(X.current.range.x - U, X.current.range.x + X.current.range.width - U));
      } else if (j !== void 0 && j.length > 0) {
        const W = [...j].map((J) => {
          const ae = Q({
            x: U,
            y: J,
            width: b.length,
            height: 1
          }, V.current.signal);
          return typeof ae == "object" ? ae[0] : ae().then((Se) => Se[0]);
        });
        if (W.some((J) => J instanceof Promise)) {
          const J = await Promise.all(W);
          K(J, Dr(b.length));
        } else
          K(W, Dr(b.length));
      } else if ($.length > 0) {
        const z = [], W = [];
        for (const J of $) {
          let ae = Q({
            x: J,
            y: 0,
            width: 1,
            height: He
          }, V.current.signal);
          typeof ae != "object" && (ae = await ae()), z.push(ae), W.push(J - U);
        }
        if (z.length === 1)
          K(z[0], W);
        else {
          const J = z.reduce((ae, Se) => ae.map((Et, Je) => [...Et, ...Se[Je]]));
          K(J, W);
        }
      }
    }
  }, [
    b,
    Q,
    X,
    ir.copy,
    U,
    Nt,
    He,
    qe
  ]);
  xn("copy", Ui, f, !1, !1);
  const zh = d.useCallback(async (y) => {
    if (!(!ir.cut || !(Nt.current?.contains(document.activeElement) === !0 || a.current?.contains(document.activeElement) === !0)) && (await Ui(y), X.current !== void 0)) {
      let _ = {
        current: {
          cell: X.current.cell,
          range: X.current.range,
          rangeStack: []
        },
        rows: Qe.empty(),
        columns: Qe.empty()
      };
      const $ = jt?.(_);
      if ($ === !1 || (_ = $ === !0 ? _ : $, _.current === void 0))
        return;
      Ur(_.current.range);
    }
  }, [Ur, X, ir.cut, Ui, Nt, jt]);
  xn("cut", zh, f, !1, !1);
  const Vh = d.useCallback((y, A) => {
    if (de !== void 0) {
      U !== 0 && (y = y.map((j) => [j[0] - U, j[1]])), de(y, A);
      return;
    }
    if (y.length === 0 || A === -1)
      return;
    const [_, $] = y[A];
    c.current !== void 0 && c.current[0] === _ && c.current[1] === $ || (c.current = [_, $], kr(_, $, !1, !1));
  }, [de, U, kr]), [Ho, zo] = Tt?.current?.cell ?? [], Vo = d.useRef(qt);
  Vo.current = qt, d.useLayoutEffect(() => {
    Za.current && !$r.current && Ho !== void 0 && zo !== void 0 && (Ho !== ge.current?.current?.cell[0] || zo !== ge.current?.current?.cell[1]) && Vo.current(Ho, zo), $r.current = !1;
  }, [Ho, zo]);
  const Xl = X.current !== void 0 && (X.current.cell[0] >= rt.length || X.current.cell[1] >= vn);
  d.useLayoutEffect(() => {
    Xl && pe(Ko, !1);
  }, [Xl, pe]);
  const $h = d.useMemo(() => Vt === !0 && Oe?.tint === !0 ? Qe.fromSingleSelection(vn - 1) : Qe.empty(), [vn, Vt, Oe?.tint]), Nh = d.useCallback((y) => typeof cn == "boolean" ? cn : cn?.(y - U) ?? !0, [U, cn]), Bh = d.useMemo(() => {
    if (ja === void 0 || a.current === null)
      return null;
    const { bounds: y, group: A } = ja, _ = a.current.getBoundingClientRect();
    return d.createElement($v, { bounds: y, group: A, canvasBounds: _, onClose: () => qa(void 0), onFinish: ($) => {
      qa(void 0), ce?.(A, $);
    } });
  }, [ce, ja]), Wh = Math.min(rt.length, De + (An ? 1 : 0));
  d.useImperativeHandle(t, () => ({
    appendRow: (y, A) => Sr(y + U, A),
    appendColumn: (y, A) => Fo(y, A),
    updateCells: (y) => (U !== 0 && (y = y.map((A) => ({ cell: [A.cell[0] + U, A.cell[1]] }))), mn.current?.damage(y)),
    getBounds: (y, A) => {
      if (!(a?.current === null || Nt?.current === null)) {
        if (y === void 0 && A === void 0) {
          const _ = a.current.getBoundingClientRect(), $ = _.width / Nt.current.clientWidth;
          return {
            x: _.x - Nt.current.scrollLeft * $,
            y: _.y - Nt.current.scrollTop * $,
            width: Nt.current.scrollWidth * $,
            height: Nt.current.scrollHeight * $
          };
        }
        return mn.current?.getBounds((y ?? 0) + U, A);
      }
    },
    focus: () => mn.current?.focus(),
    emit: async (y) => {
      switch (y) {
        case "delete":
          Wi({
            bounds: void 0,
            cancel: () => {
            },
            stopPropagation: () => {
            },
            preventDefault: () => {
            },
            ctrlKey: !1,
            key: "Delete",
            keyCode: 46,
            metaKey: !1,
            shiftKey: !1,
            altKey: !1,
            rawEvent: void 0,
            location: void 0
          });
          break;
        case "fill-right":
          Wi({
            bounds: void 0,
            cancel: () => {
            },
            stopPropagation: () => {
            },
            preventDefault: () => {
            },
            ctrlKey: !0,
            key: "r",
            keyCode: 82,
            metaKey: !1,
            shiftKey: !1,
            altKey: !1,
            rawEvent: void 0,
            location: void 0
          });
          break;
        case "fill-down":
          Wi({
            bounds: void 0,
            cancel: () => {
            },
            stopPropagation: () => {
            },
            preventDefault: () => {
            },
            ctrlKey: !0,
            key: "d",
            keyCode: 68,
            metaKey: !1,
            shiftKey: !1,
            altKey: !1,
            rawEvent: void 0,
            location: void 0
          });
          break;
        case "copy":
          await Ui(void 0, !0);
          break;
        case "paste":
          await Ja();
          break;
      }
    },
    scrollTo: qt,
    remeasureColumns: (y) => {
      for (const A of y)
        _o(A + U);
    },
    getMouseArgsForPosition: (y, A, _) => {
      if (mn?.current === null)
        return;
      const $ = mn.current.getMouseArgsForPosition(y, A, _);
      if ($ !== void 0)
        return {
          ...$,
          location: [$.location[0] - U, $.location[1]]
        };
    }
  }), [
    Sr,
    Fo,
    _o,
    Nt,
    Ui,
    Wi,
    Ja,
    U,
    qt
  ]);
  const [Kl, Zl] = bi ?? [], Uh = d.useCallback((y) => {
    const [A, _] = y;
    if (_ === -1) {
      re !== "none" && (Ye(Qe.fromSingleSelection(A), void 0, !1), Sn());
      return;
    }
    Kl === A && Zl === _ || (Rt({
      cell: y,
      range: { x: A, y: _, width: 1, height: 1 }
    }, !0, !1, "keyboard-nav"), qt(A, _));
  }, [re, Sn, qt, Kl, Zl, Rt, Ye]), [jh, qh] = d.useState(!1), Jl = d.useRef(Ed((y) => {
    qh(y);
  }, 5)), Gh = d.useCallback(() => {
    Jl.current(!0), X.current === void 0 && X.columns.length === 0 && X.rows.length === 0 && l === void 0 && Rt({
      cell: [U, To],
      range: {
        x: U,
        y: To,
        width: 1,
        height: 1
      }
    }, !0, !1, "keyboard-select");
  }, [To, X, l, U, Rt]), Yh = d.useCallback(() => {
    Jl.current(!1);
  }, []), [Xh, Kh] = d.useMemo(() => {
    let y;
    const A = mt?.scrollbarWidthOverride ?? As(), _ = He + (Vt ? 1 : 0);
    if (typeof rr == "number")
      y = pn + _ * rr;
    else {
      let j = 0;
      const K = Math.min(_, 10);
      for (let z = 0; z < K; z++)
        j += rr(z);
      j = Math.floor(j / K), y = pn + _ * j;
    }
    y += A;
    const $ = rt.reduce((j, K) => K.width + j, 0) + A;
    return [`${Math.min(1e5, $)}px`, `${Math.min(1e5, y)}px`];
  }, [rt, mt?.scrollbarWidthOverride, rr, He, Vt, pn]), Zh = d.useMemo(() => o0(dt), [dt]);
  return d.createElement(
    Kd.Provider,
    { value: dt },
    d.createElement(
      tb,
      { style: Zh, className: Y, inWidth: m ?? Xh, inHeight: w ?? Kh },
      d.createElement(Av, { fillHandle: Ft, drawFocusRing: ri, experimental: mt, fixedShadowX: Mn, fixedShadowY: ur, getRowThemeOverride: Hr, headerIcons: Nn, imageWindowLoader: B, initialSize: We, isDraggable: Ge, onDragLeave: Lt, onRowMoved: nn, overscrollX: Aa, overscrollY: Ha, preventDiagonalScrolling: yn, rightElement: Ut, rightElementProps: En, smoothScrollX: Ce, smoothScrollY: _t, className: Y, enableGroups: Wn, onCanvasFocused: Gh, onCanvasBlur: Yh, canvasRef: a, onContextMenu: Hh, theme: dt, cellXOffset: Ch, cellYOffset: To, accessibilityHeight: hr.height, onDragEnd: Lh, columns: rt, nonGrowWidth: At, drawHeader: vt, onColumnProposeMove: Dh, drawCell: gn, disabledRows: $h, freezeColumns: Wh, lockColumns: U, firstColAccessible: U === 0, getCellContent: Hn, minColumnWidth: wr, maxColumnWidth: li, searchInputRef: s, showSearch: Va, onSearchClose: ci, highlightRegions: Sh, getCellsForSelection: Q, getGroupDetails: Na, headerHeight: zi, isFocused: jh, groupHeaderHeight: Wn ? Io : 0, freezeTrailingRows: ct + (Vt && Oe?.sticky === !0 ? 1 : 0), hasAppendRow: Vt, onColumnResize: je, onColumnResizeEnd: Ee, onColumnResizeStart: Ze, onCellFocused: Uh, onColumnMoved: Oh, onDragStart: Ph, onHeaderMenuClick: Eh, onHeaderIndicatorClick: Ih, onItemHovered: Ka, isFilling: l?.fillHandle === !0, onMouseMove: Rh, onKeyDown: Wi, onKeyUp: ne, onMouseDown: xh, onMouseUp: Mh, onDragOverCell: Ln, onDrop: en, onSearchResultsChanged: Vh, onVisibleRegionChanged: Th, clientSize: $t, rowHeight: rr, searchResults: ie, searchValue: L, onSearchValueChange: H, rows: vn, scrollRef: Nt, selection: X, translateX: hr.tx, translateY: hr.ty, verticalBorder: Nh, gridRef: mn, getCellRenderer: rn, resizeIndicator: Mo }),
      Bh,
      i !== void 0 && d.createElement(
        d.Suspense,
        { fallback: null },
        d.createElement(fb, { ...i, validateCell: Te, bloom: D, id: Ah, getCellRenderer: rn, className: mt?.isSubGrid === !0 ? "click-outside-ignore" : void 0, provideEditor: kn, imageEditorOverride: g, portalElementRef: Ro, onFinishEditing: _h, markdownDivCreateNode: p, isOutsideClick: _n, customEventTarget: mt?.eventTarget })
      )
    )
  );
}, mb = d.forwardRef(pb);
function sc(e) {
  const { cell: t, posX: n, posY: r, bounds: i, theme: o } = e, { width: s, height: a, x: l, y: u } = i, c = t.maxSize ?? o.checkboxMaxSize, f = Math.floor(i.y + a / 2), g = Dd(c, a, o.cellVerticalPadding), h = Td(t.contentAlign ?? "center", l, s, o.cellHorizontalPadding, g), p = Id(h, f, g), m = Od(l + n, u + r, p);
  return el(t) && m;
}
const vb = {
  getAccessibilityString: (e) => e.data?.toString() ?? "false",
  kind: Z.Boolean,
  needsHover: !0,
  useLabel: !1,
  needsHoverPosition: !0,
  measure: () => 50,
  draw: (e) => bb(e, e.cell.data, el(e.cell), e.cell.maxSize ?? e.theme.checkboxMaxSize, e.cell.hoverEffectIntensity ?? 0.35),
  onDelete: (e) => ({
    ...e,
    data: !1
  }),
  onSelect: (e) => {
    sc(e) && e.preventDefault();
  },
  onClick: (e) => {
    if (sc(e))
      return {
        ...e.cell,
        data: ff(e.cell.data)
      };
  },
  onPaste: (e, t) => {
    let n = da;
    return e.toLowerCase() === "true" ? n = !0 : e.toLowerCase() === "false" ? n = !1 : e.toLowerCase() === "indeterminate" && (n = Qs), n === t.data ? void 0 : {
      ...t,
      data: n
    };
  }
};
function bb(e, t, n, r, i) {
  if (!n && t === da)
    return;
  const { ctx: o, hoverAmount: s, theme: a, rect: l, highlighted: u, hoverX: c, hoverY: f, cell: { contentAlign: g } } = e, { x: h, y: p, width: m, height: w } = l;
  let b = !1;
  if (i > 0) {
    let v = n ? 1 - i + i * s : 0.4;
    if (t === da && (v *= s), v === 0)
      return;
    v < 1 && (b = !0, o.globalAlpha = v);
  }
  dl(o, a, t, h, p, m, w, u, c, f, r, g), b && (o.globalAlpha = 1);
}
const wb = /* @__PURE__ */ fn("div")({
  name: "BubblesOverlayEditorStyle",
  class: "gdg-b1ygi5by",
  propsAsIs: !1
}), yb = (e) => {
  const { bubbles: t } = e;
  return d.createElement(
    wb,
    null,
    t.map((n, r) => d.createElement("div", { key: r, className: "boe-bubble" }, n)),
    d.createElement("textarea", { className: "gdg-input", autoFocus: !0 })
  );
}, Cb = {
  getAccessibilityString: (e) => Pd(e.data),
  kind: Z.Bubble,
  needsHover: !1,
  useLabel: !1,
  needsHoverPosition: !1,
  measure: (e, t, n) => {
    const r = t.data.reduce((i, o) => e.measureText(o).width + i + n.bubblePadding * 2 + n.bubbleMargin, 0);
    return t.data.length === 0 ? n.cellHorizontalPadding * 2 : r + 2 * n.cellHorizontalPadding - n.bubbleMargin;
  },
  draw: (e) => Sb(e, e.cell.data),
  provideEditor: () => (e) => {
    const { value: t } = e;
    return d.createElement(yb, { bubbles: t.data });
  },
  onPaste: () => {
  }
};
function Sb(e, t) {
  const { rect: n, theme: r, ctx: i, highlighted: o } = e, { x: s, y: a, width: l, height: u } = n;
  let c = s + r.cellHorizontalPadding;
  const f = [];
  for (const g of t) {
    if (c > s + l)
      break;
    const h = Lr(g, i, r.baseFontFull).width;
    f.push({
      x: c,
      width: h
    }), c += h + r.bubblePadding * 2 + r.bubbleMargin;
  }
  i.beginPath();
  for (const g of f)
    er(i, g.x, a + (u - r.bubbleHeight) / 2, g.width + r.bubblePadding * 2, r.bubbleHeight, r.roundingRadius ?? r.bubbleHeight / 2);
  i.fillStyle = o ? r.bgBubbleSelected : r.bgBubble, i.fill();
  for (const [g, h] of f.entries())
    i.beginPath(), i.fillStyle = r.textBubble, i.fillText(t[g], h.x + r.bubblePadding, a + u / 2 + nr(i, r));
}
const xb = /* @__PURE__ */ fn("div")({
  name: "DrilldownOverlayEditorStyle",
  class: "gdg-d4zsq0x",
  propsAsIs: !1
}), kb = (e) => {
  const {
    drilldowns: t
  } = e;
  return d.createElement(xb, null, t.map((n, r) => d.createElement("div", {
    key: r,
    className: "doe-bubble"
  }, n.img !== void 0 && d.createElement("img", {
    src: n.img
  }), d.createElement("div", null, n.text))));
}, Mb = {
  getAccessibilityString: (e) => Pd(e.data.map((t) => t.text)),
  kind: Z.Drilldown,
  needsHover: !1,
  useLabel: !1,
  needsHoverPosition: !1,
  measure: (e, t, n) => t.data.reduce((r, i) => e.measureText(i.text).width + r + n.bubblePadding * 2 + n.bubbleMargin + (i.img !== void 0 ? 18 : 0), 0) + 2 * n.cellHorizontalPadding - 4,
  draw: (e) => Eb(e, e.cell.data),
  provideEditor: () => (e) => {
    const { value: t } = e;
    return d.createElement(kb, { drilldowns: t.data });
  },
  onPaste: () => {
  }
}, ws = {};
function Rb(e, t, n, r) {
  const i = Math.ceil(window.devicePixelRatio), o = 5, s = n - o * 2, a = 4, l = n * i, u = r + o, c = r * 3, f = (c + o * 2) * i, g = `${e},${t},${i},${n}`;
  if (ws[g] !== void 0)
    return {
      el: ws[g],
      height: l,
      width: f,
      middleWidth: a * i,
      sideWidth: u * i,
      padding: o * i,
      dpr: i
    };
  const h = document.createElement("canvas"), p = h.getContext("2d");
  return p === null ? null : (h.width = f, h.height = l, p.scale(i, i), ws[g] = h, p.beginPath(), er(p, o, o, c, s, r), p.shadowColor = "rgba(24, 25, 34, 0.4)", p.shadowBlur = 1, p.fillStyle = e, p.fill(), p.shadowColor = "rgba(24, 25, 34, 0.3)", p.shadowOffsetY = 1, p.shadowBlur = 5, p.fillStyle = e, p.fill(), p.shadowOffsetY = 0, p.shadowBlur = 0, p.shadowBlur = 0, p.beginPath(), er(p, o + 0.5, o + 0.5, c, s, r), p.strokeStyle = t, p.lineWidth = 1, p.stroke(), {
    el: h,
    height: l,
    width: f,
    sideWidth: u * i,
    middleWidth: r * i,
    padding: o * i,
    dpr: i
  });
}
function Eb(e, t) {
  const { rect: n, theme: r, ctx: i, imageLoader: o, col: s, row: a } = e, { x: l, width: u } = n, c = r.baseFontFull, f = sl(i, c), g = Math.min(n.height, Math.max(16, Math.ceil(f * r.lineHeight) * 2)), h = Math.floor(n.y + (n.height - g) / 2), p = g - 10, m = r.bubblePadding, w = r.bubbleMargin;
  let b = l + r.cellHorizontalPadding;
  const v = r.roundingRadius ?? 6, C = Rb(r.bgCell, r.drilldownBorder, g, v), I = [];
  for (const E of t) {
    if (b > l + u)
      break;
    const P = Lr(E.text, i, c).width;
    let x = 0;
    E.img !== void 0 && o.loadOrGetImage(E.img, s, a) !== void 0 && (x = p - 8 + 4);
    const S = P + x + m * 2;
    I.push({
      x: b,
      width: S
    }), b += S + w;
  }
  if (C !== null) {
    const { el: E, height: R, middleWidth: P, sideWidth: x, width: S, dpr: F, padding: D } = C, M = x / F, T = D / F;
    for (const O of I) {
      const k = Math.floor(O.x), N = Math.floor(O.width), q = N - (M - T) * 2;
      i.imageSmoothingEnabled = !1, i.drawImage(E, 0, 0, x, R, k - T, h, M, g), q > 0 && i.drawImage(E, x, 0, P, R, k + (M - T), h, q, g), i.drawImage(E, S - x, 0, x, R, k + N - (M - T), h, M, g), i.imageSmoothingEnabled = !0;
    }
  }
  i.beginPath();
  for (const [E, R] of I.entries()) {
    const P = t[E];
    let x = R.x + m;
    if (P.img !== void 0) {
      const S = o.loadOrGetImage(P.img, s, a);
      if (S !== void 0) {
        const F = p - 8;
        let D = 0, M = 0, T = S.width, O = S.height;
        T > O ? (D += (T - O) / 2, T = O) : O > T && (M += (O - T) / 2, O = T), i.beginPath(), er(i, x, h + g / 2 - F / 2, F, F, r.roundingRadius ?? 3), i.save(), i.clip(), i.drawImage(S, D, M, T, O, x, h + g / 2 - F / 2, F, F), i.restore(), x += F + 4;
      }
    }
    i.beginPath(), i.fillStyle = r.textBubble, i.fillText(P.text, x, h + g / 2 + nr(i, r));
  }
}
const Ib = {
  getAccessibilityString: (e) => e.data.join(", "),
  kind: Z.Image,
  needsHover: !1,
  useLabel: !1,
  needsHoverPosition: !1,
  draw: (e) => Tb(e, e.cell.displayData ?? e.cell.data, e.cell.rounding ?? e.theme.roundingRadius ?? 4, e.cell.contentAlign),
  measure: (e, t) => t.data.length * 50,
  onDelete: (e) => ({
    ...e,
    data: []
  }),
  provideEditor: () => (e) => {
    const { value: t, onFinishedEditing: n, imageEditorOverride: r } = e, i = r ?? pm;
    return d.createElement(i, { urls: t.data, canWrite: t.readonly !== !0, onCancel: n, onChange: (o) => {
      n({
        ...t,
        data: [o]
      });
    } });
  },
  onPaste: (e, t) => {
    e = e.trim();
    const r = e.split(",").map((i) => {
      try {
        return new URL(i), i;
      } catch {
        return;
      }
    }).filter((i) => i !== void 0);
    if (!(r.length === t.data.length && r.every((i, o) => i === t.data[o])))
      return {
        ...t,
        data: r
      };
  }
}, ys = 4;
function Tb(e, t, n, r) {
  const { rect: i, col: o, row: s, theme: a, ctx: l, imageLoader: u } = e, { x: c, y: f, height: g, width: h } = i, p = g - a.cellVerticalPadding * 2, m = [];
  let w = 0;
  for (let v = 0; v < t.length; v++) {
    const C = t[v];
    if (C.length === 0)
      continue;
    const I = u.loadOrGetImage(C, o, s);
    if (I !== void 0) {
      m[v] = I;
      const E = I.width * (p / I.height);
      w += E + ys;
    }
  }
  if (w === 0)
    return;
  w -= ys;
  let b = c + a.cellHorizontalPadding;
  r === "right" ? b = Math.floor(c + h - a.cellHorizontalPadding - w) : r === "center" && (b = Math.floor(c + h / 2 - w / 2));
  for (const v of m) {
    if (v === void 0)
      continue;
    const C = v.width * (p / v.height);
    n > 0 && (l.beginPath(), er(l, b, f + a.cellVerticalPadding, C, p, n), l.save(), l.clip()), l.drawImage(v, b, f + a.cellVerticalPadding, C, p), n > 0 && l.restore(), b += C + ys;
  }
}
function Db(e, t) {
  let n = e * 49632 + t * 325176;
  return n ^= n << 13, n ^= n >> 17, n ^= n << 5, n / 4294967295 * 2;
}
const Ob = {
  getAccessibilityString: () => "",
  kind: Z.Loading,
  needsHover: !1,
  useLabel: !1,
  needsHoverPosition: !1,
  measure: () => 120,
  draw: (e) => {
    const { cell: t, col: n, row: r, ctx: i, rect: o, theme: s } = e;
    if (t.skeletonWidth === void 0 || t.skeletonWidth === 0)
      return;
    let a = t.skeletonWidth;
    t.skeletonWidthVariability !== void 0 && t.skeletonWidthVariability > 0 && (a += Math.round(Db(n, r) * t.skeletonWidthVariability));
    const l = s.cellHorizontalPadding;
    a + l * 2 >= o.width && (a = o.width - l * 2 - 1);
    const u = t.skeletonHeight ?? Math.min(18, o.height - 2 * s.cellVerticalPadding);
    er(i, o.x + l, o.y + (o.height - u) / 2, a, u, s.roundingRadius ?? 3), i.fillStyle = Jr(s.textDark, 0.1), i.fill();
  },
  onPaste: () => {
  }
}, Pb = () => (e) => e.targetWidth, lc = /* @__PURE__ */ fn("div")({
  name: "MarkdownOverlayEditorStyle",
  class: "gdg-m1pnx84e",
  propsAsIs: !1,
  vars: {
    "m1pnx84e-0": [Pb(), "px"]
  }
}), Lb = (e) => {
  const { value: t, onChange: n, forceEditMode: r, createNode: i, targetRect: o, onFinish: s, validatedSelection: a } = e, l = t.data, u = t.readonly === !0, [c, f] = d.useState(l === "" || r), g = d.useCallback(() => {
    f((p) => !p);
  }, []), h = l ? "gdg-ml-6" : "";
  return c ? d.createElement(
    lc,
    { targetWidth: o.width - 20 },
    d.createElement(ti, { autoFocus: !0, highlight: !1, validatedSelection: a, value: l, onKeyDown: (p) => {
      p.key === "Enter" && p.stopPropagation();
    }, onChange: n }),
    d.createElement(
      "div",
      { className: `gdg-edit-icon gdg-checkmark-hover ${h}`, onClick: () => s(t) },
      d.createElement(lm, null)
    )
  ) : d.createElement(
    lc,
    { targetWidth: o.width },
    d.createElement(Fm, { contents: l, createNode: i }),
    !u && d.createElement(
      d.Fragment,
      null,
      d.createElement("div", { className: "spacer" }),
      d.createElement(
        "div",
        { className: `gdg-edit-icon gdg-edit-hover ${h}`, onClick: g },
        d.createElement(nl, null)
      )
    ),
    d.createElement("textarea", { className: "gdg-md-edit-textarea gdg-input", autoFocus: !0 })
  );
}, Fb = {
  getAccessibilityString: (e) => e.data?.toString() ?? "",
  kind: Z.Markdown,
  needsHover: !1,
  needsHoverPosition: !1,
  drawPrep: ko,
  measure: (e, t, n) => {
    const r = t.data.split(`
`)[0];
    return e.measureText(r).width + 2 * n.cellHorizontalPadding;
  },
  draw: (e) => sr(e, e.cell.data, e.cell.contentAlign),
  onDelete: (e) => ({
    ...e,
    data: ""
  }),
  provideEditor: () => (e) => {
    const { onChange: t, value: n, target: r, onFinishedEditing: i, markdownDivCreateNode: o, forceEditMode: s, validatedSelection: a } = e;
    return d.createElement(Lb, { onFinish: i, targetRect: r, value: n, validatedSelection: a, onChange: (l) => t({
      ...n,
      data: l.target.value
    }), forceEditMode: s, createNode: o });
  },
  onPaste: (e, t) => e === t.data ? void 0 : { ...t, data: e }
}, _b = {
  getAccessibilityString: (e) => e.row.toString(),
  kind: qn.Marker,
  needsHover: !0,
  needsHoverPosition: !1,
  drawPrep: Ab,
  measure: () => 44,
  draw: (e) => zb(e, e.cell.row, e.cell.checked, e.cell.markerKind, e.cell.drawHandle, e.cell.checkboxStyle),
  onClick: (e) => {
    const { bounds: t, cell: n, posX: r, posY: i } = e, { width: o, height: s } = t, a = n.drawHandle ? 7 + (o - 7) / 2 : o / 2, l = s / 2;
    if (Math.abs(r - a) <= 10 && Math.abs(i - l) <= 10)
      return {
        ...n,
        checked: !n.checked
      };
  },
  onPaste: () => {
  }
};
function Ab(e, t) {
  const { ctx: n, theme: r } = e, i = r.markerFontFull, o = t ?? {};
  return o?.font !== i && (n.font = i, o.font = i), o.deprep = Hb, n.textAlign = "center", o;
}
function Hb(e) {
  const { ctx: t } = e;
  t.textAlign = "start";
}
function zb(e, t, n, r, i, o) {
  const { ctx: s, rect: a, hoverAmount: l, theme: u } = e, { x: c, y: f, width: g, height: h } = a, p = n ? 1 : r === "checkbox-visible" ? 0.6 + 0.4 * l : l;
  if (r !== "number" && p > 0) {
    s.globalAlpha = p;
    const m = 7 * (n ? l : 1);
    if (dl(s, u, n, i ? c + m : c, f, i ? g - m : g, h, !0, void 0, void 0, u.checkboxMaxSize, "center", o), i) {
      s.globalAlpha = l, s.beginPath();
      for (const w of [3, 6])
        for (const b of [-5, -1, 3])
          s.rect(c + w, f + h / 2 + b, 2, 2);
      s.fillStyle = u.textLight, s.fill(), s.beginPath();
    }
    s.globalAlpha = 1;
  }
  if (r === "number" || r === "both" && !n) {
    const m = t.toString(), w = u.markerFontFull, b = c + g / 2;
    r === "both" && l !== 0 && (s.globalAlpha = 1 - l), s.fillStyle = u.textLight, s.font = w, s.fillText(m, b, f + h / 2 + nr(s, w)), l !== 0 && (s.globalAlpha = 1);
  }
}
const Vb = {
  getAccessibilityString: () => "",
  kind: qn.NewRow,
  needsHover: !0,
  needsHoverPosition: !1,
  measure: () => 200,
  draw: (e) => $b(e, e.cell.hint, e.cell.icon),
  onPaste: () => {
  }
};
function $b(e, t, n) {
  const { ctx: r, rect: i, hoverAmount: o, theme: s, spriteManager: a } = e, { x: l, y: u, width: c, height: f } = i;
  r.beginPath(), r.globalAlpha = o, r.rect(l + 1, u + 1, c, f - 2), r.fillStyle = s.bgHeaderHovered, r.fill(), r.globalAlpha = 1, r.beginPath();
  const g = t !== "";
  let h = 0;
  if (n !== void 0) {
    const m = f - 8, w = l + 8 / 2, b = u + 8 / 2;
    a.drawSprite(n, "normal", r, w, b, m, s, g ? 1 : o), h = m;
  } else {
    h = 24;
    const p = 12, m = g ? p : o * p, w = g ? 0 : (1 - o) * p * 0.5, b = s.cellHorizontalPadding + 4;
    m > 0 && (r.moveTo(l + b + w, u + f / 2), r.lineTo(l + b + w + m, u + f / 2), r.moveTo(l + b + w + m * 0.5, u + f / 2 - m * 0.5), r.lineTo(l + b + w + m * 0.5, u + f / 2 + m * 0.5), r.lineWidth = 2, r.strokeStyle = s.bgIconHeader, r.lineCap = "round", r.stroke());
  }
  r.fillStyle = s.textMedium, r.fillText(t, h + l + s.cellHorizontalPadding + 0.5, u + f / 2 + nr(r, s)), r.beginPath();
}
function pf(e, t, n, r, i, o, s) {
  e.textBaseline = "alphabetic";
  const a = Nb(e, i, r, t, n?.fullSize ?? !1);
  e.beginPath(), er(e, a.x, a.y, a.width, a.height, t.roundingRadius ?? 4), e.globalAlpha = o, e.fillStyle = n?.bgColor ?? Jr(t.textDark, 0.1), e.fill(), e.globalAlpha = 1, e.fillStyle = t.textDark, e.textBaseline = "middle", s?.("text");
}
function Nb(e, t, n, r, i) {
  const o = r.cellHorizontalPadding, s = r.cellVerticalPadding;
  if (i)
    return {
      x: t.x + o / 2,
      y: t.y + s / 2 + 1,
      width: t.width - o,
      height: t.height - s - 1
    };
  const a = Lr(n, e, r.baseFontFull, "alphabetic"), l = t.height - s, u = Math.min(l, a.actualBoundingBoxAscent * 2.5);
  return {
    x: t.x + o / 2,
    y: t.y + (t.height - u) / 2 + 1,
    width: a.width + o * 3,
    height: u - 1
  };
}
const Bb = d.lazy(async () => await import("./number-overlay-editor-BVaZa6eG.js")), Wb = {
  getAccessibilityString: (e) => e.data?.toString() ?? "",
  kind: Z.Number,
  needsHover: (e) => e.hoverEffect === !0,
  needsHoverPosition: !1,
  useLabel: !0,
  drawPrep: ko,
  draw: (e) => {
    const { hoverAmount: t, cell: n, ctx: r, theme: i, rect: o, overrideCursor: s } = e, { hoverEffect: a, displayData: l, hoverEffectTheme: u } = n;
    a === !0 && t > 0 && pf(r, i, u, l, o, t, s), sr(e, e.cell.displayData, e.cell.contentAlign);
  },
  measure: (e, t, n) => e.measureText(t.displayData).width + n.cellHorizontalPadding * 2,
  onDelete: (e) => ({
    ...e,
    data: void 0
  }),
  provideEditor: () => (e) => {
    const { isHighlighted: t, onChange: n, value: r, validatedSelection: i } = e;
    return d.createElement(
      d.Suspense,
      { fallback: null },
      d.createElement(Bb, { highlight: t, disabled: r.readonly === !0, value: r.data, fixedDecimals: r.fixedDecimals, allowNegative: r.allowNegative, thousandSeparator: r.thousandSeparator, decimalSeparator: r.decimalSeparator, validatedSelection: i, onChange: (o) => n({
        ...r,
        data: Number.isNaN(o.floatValue ?? 0) ? 0 : o.floatValue
      }) })
    );
  },
  onPaste: (e, t, n) => {
    const r = typeof n.rawValue == "number" ? n.rawValue : Number.parseFloat(typeof n.rawValue == "string" ? n.rawValue : e);
    if (!(Number.isNaN(r) || t.data === r))
      return { ...t, data: r, displayData: n.formattedString ?? t.displayData };
  }
}, Ub = {
  getAccessibilityString: () => "",
  measure: () => 108,
  kind: Z.Protected,
  needsHover: !1,
  needsHoverPosition: !1,
  draw: jb,
  onPaste: () => {
  }
};
function jb(e) {
  const { ctx: t, theme: n, rect: r } = e, { x: i, y: o, height: s } = r;
  t.beginPath();
  const a = 2.5;
  let l = i + n.cellHorizontalPadding + a;
  const u = o + s / 2, c = Math.cos(Iu(30)) * a, f = Math.sin(Iu(30)) * a;
  for (let g = 0; g < 12; g++)
    t.moveTo(l, u - a), t.lineTo(l, u + a), t.moveTo(l + c, u - f), t.lineTo(l - c, u + f), t.moveTo(l - c, u - f), t.lineTo(l + c, u + f), l += 8;
  t.lineWidth = 1.1, t.lineCap = "square", t.strokeStyle = n.textLight, t.stroke();
}
const qb = {
  getAccessibilityString: (e) => e.data?.toString() ?? "",
  kind: Z.RowID,
  needsHover: !1,
  needsHoverPosition: !1,
  drawPrep: (e, t) => ko(e, t, e.theme.textLight),
  draw: (e) => sr(e, e.cell.data, e.cell.contentAlign),
  measure: (e, t, n) => e.measureText(t.data).width + n.cellHorizontalPadding * 2,
  // eslint-disable-next-line react/display-name
  provideEditor: () => (e) => {
    const { isHighlighted: t, onChange: n, value: r, validatedSelection: i } = e;
    return Bt.createElement(ti, { highlight: t, autoFocus: r.readonly !== !0, disabled: r.readonly !== !1, value: r.data, validatedSelection: i, onChange: (o) => n({
      ...r,
      data: o.target.value
    }) });
  },
  onPaste: () => {
  }
}, Gb = {
  getAccessibilityString: (e) => e.data?.toString() ?? "",
  kind: Z.Text,
  needsHover: (e) => e.hoverEffect === !0,
  needsHoverPosition: !1,
  drawPrep: ko,
  useLabel: !0,
  draw: (e) => {
    const { cell: t, hoverAmount: n, hyperWrapping: r, ctx: i, rect: o, theme: s, overrideCursor: a } = e, { displayData: l, contentAlign: u, hoverEffect: c, allowWrapping: f, hoverEffectTheme: g } = t;
    c === !0 && n > 0 && pf(i, s, g, l, o, n, a), sr(e, l, u, f, r);
  },
  measure: (e, t, n) => {
    const r = t.displayData.split(`
`, t.allowWrapping === !0 ? void 0 : 1);
    let i = 0;
    for (const o of r)
      i = Math.max(i, e.measureText(o).width);
    return i + 2 * n.cellHorizontalPadding;
  },
  onDelete: (e) => ({
    ...e,
    data: ""
  }),
  provideEditor: (e) => ({
    disablePadding: e.allowWrapping === !0,
    editor: (t) => {
      const { isHighlighted: n, onChange: r, value: i, validatedSelection: o } = t;
      return d.createElement(ti, { style: e.allowWrapping === !0 ? { padding: "3px 8.5px" } : void 0, highlight: n, autoFocus: i.readonly !== !0, disabled: i.readonly === !0, altNewline: !0, value: i.data, validatedSelection: o, onChange: (s) => r({
        ...i,
        data: s.target.value
      }) });
    }
  }),
  onPaste: (e, t, n) => e === t.data ? void 0 : { ...t, data: e, displayData: n.formattedString ?? t.displayData }
}, Yb = /* @__PURE__ */ fn("div")({
  name: "UriOverlayEditorStyle",
  class: "gdg-u1rrojo",
  propsAsIs: !1
}), Xb = (e) => {
  const { uri: t, onChange: n, forceEditMode: r, readonly: i, validatedSelection: o, preview: s } = e, [a, l] = d.useState(!i && (t === "" || r)), u = d.useCallback(() => {
    l(!0);
  }, []);
  return a ? d.createElement(ti, { validatedSelection: o, highlight: !0, autoFocus: !0, value: t, onChange: n }) : d.createElement(
    Yb,
    null,
    d.createElement("a", { className: "gdg-link-area", href: t, target: "_blank", rel: "noopener noreferrer" }, s),
    !i && d.createElement(
      "div",
      { className: "gdg-edit-icon", onClick: u },
      d.createElement(nl, null)
    ),
    d.createElement("textarea", { className: "gdg-input", autoFocus: !0 })
  );
};
function mf(e, t, n, r) {
  let i = n.cellHorizontalPadding;
  const o = t.height / 2 - e.actualBoundingBoxAscent / 2, s = e.width, a = e.actualBoundingBoxAscent;
  return r === "right" ? i = t.width - s - n.cellHorizontalPadding : r === "center" && (i = t.width / 2 - s / 2), { x: i, y: o, width: s, height: a };
}
function uc(e) {
  const { cell: t, bounds: n, posX: r, posY: i, theme: o } = e, s = t.displayData ?? t.data;
  if (t.hoverEffect !== !0 || t.onClickUri === void 0)
    return !1;
  const a = Ud(s, o.baseFontFull);
  if (a === void 0)
    return !1;
  const l = mf(a, n, o, t.contentAlign);
  return Zr({
    x: l.x - 4,
    y: l.y - 4,
    width: l.width + 8,
    height: l.height + 8
  }, r, i);
}
const Kb = {
  getAccessibilityString: (e) => e.data?.toString() ?? "",
  kind: Z.Uri,
  needsHover: (e) => e.hoverEffect === !0,
  needsHoverPosition: !0,
  useLabel: !0,
  drawPrep: ko,
  draw: (e) => {
    const { cell: t, theme: n, overrideCursor: r, hoverX: i, hoverY: o, rect: s, ctx: a } = e, l = t.displayData ?? t.data, u = t.hoverEffect === !0;
    if (r !== void 0 && u && i !== void 0 && o !== void 0) {
      const c = Lr(l, a, n.baseFontFull), f = mf(c, s, n, t.contentAlign), { x: g, y: h, width: p, height: m } = f;
      if (i >= g - 4 && i <= g - 4 + p + 8 && o >= h - 4 && o <= h - 4 + m + 8) {
        const w = nr(a, n.baseFontFull);
        r("pointer");
        const b = 5, v = h - w;
        a.beginPath(), a.moveTo(s.x + g, Math.floor(s.y + v + m + b) + 0.5), a.lineTo(s.x + g + p, Math.floor(s.y + v + m + b) + 0.5), a.strokeStyle = n.linkColor, a.stroke(), a.save(), a.fillStyle = e.cellFillColor, sr({ ...e, rect: { ...s, x: s.x - 1 } }, l, t.contentAlign), sr({ ...e, rect: { ...s, x: s.x - 2 } }, l, t.contentAlign), sr({ ...e, rect: { ...s, x: s.x + 1 } }, l, t.contentAlign), sr({ ...e, rect: { ...s, x: s.x + 2 } }, l, t.contentAlign), a.restore();
      }
    }
    a.fillStyle = u ? n.linkColor : n.textDark, sr(e, l, t.contentAlign);
  },
  onSelect: (e) => {
    uc(e) && e.preventDefault();
  },
  onClick: (e) => {
    const { cell: t } = e;
    uc(e) && t.onClickUri?.(e);
  },
  measure: (e, t, n) => e.measureText(t.displayData ?? t.data).width + n.cellHorizontalPadding * 2,
  onDelete: (e) => ({
    ...e,
    data: ""
  }),
  provideEditor: (e) => (t) => {
    const { onChange: n, value: r, forceEditMode: i, validatedSelection: o } = t;
    return d.createElement(Xb, { forceEditMode: r.readonly !== !0 && (i || e.hoverEffect === !0 && e.onClickUri !== void 0), uri: r.data, preview: r.displayData ?? r.data, validatedSelection: o, readonly: r.readonly === !0, onChange: (s) => n({
      ...r,
      data: s.target.value
    }) });
  },
  onPaste: (e, t, n) => e === t.data ? void 0 : { ...t, data: e, displayData: n.formattedString ?? t.displayData }
}, Zb = [
  _b,
  Vb,
  vb,
  Cb,
  Mb,
  Ib,
  Ob,
  Fb,
  Wb,
  Ub,
  qb,
  Gb,
  Kb
];
var Cs, cc;
function Jb() {
  if (cc) return Cs;
  cc = 1;
  var e = Rd(), t = td(), n = "Expected a function";
  function r(i, o, s) {
    var a = !0, l = !0;
    if (typeof i != "function")
      throw new TypeError(n);
    return t(s) && (a = "leading" in s ? !!s.leading : a, l = "trailing" in s ? !!s.trailing : l), e(i, o, {
      leading: a,
      maxWait: o,
      trailing: l
    });
  }
  return Cs = r, Cs;
}
var Qb = Jb();
const e1 = /* @__PURE__ */ vr(Qb), Ss = [];
class t1 extends Gd {
  imageLoaded = () => {
  };
  loadedLocations = [];
  cache = {};
  setCallback(t) {
    this.imageLoaded = t;
  }
  // eslint-disable-next-line unicorn/consistent-function-scoping
  sendLoaded = e1(() => {
    this.imageLoaded(new go(this.loadedLocations)), this.loadedLocations = [];
  }, 20);
  clearOutOfWindow = () => {
    const t = Object.keys(this.cache);
    for (const n of t) {
      const r = this.cache[n];
      let i = !1;
      for (let o = 0; o < r.cells.length; o++) {
        const s = r.cells[o];
        if (this.isInWindow(s)) {
          i = !0;
          break;
        }
      }
      i ? r.cells = r.cells.filter(this.isInWindow) : (r.cancel(), delete this.cache[n]);
    }
  };
  loadImage(t, n, r, i) {
    let o = !1;
    const s = Ss.pop() ?? new Image();
    let a = !1;
    const l = {
      img: void 0,
      cells: [Qn(n, r)],
      url: t,
      cancel: () => {
        a || (a = !0, Ss.length < 12 ? Ss.unshift(s) : o || (s.src = ""));
      }
    }, u = new Promise((c) => s.addEventListener("load", () => c(null)));
    requestAnimationFrame(async () => {
      try {
        s.src = t, await u, await s.decode();
        const c = this.cache[i];
        if (c !== void 0 && !a) {
          c.img = s;
          for (const f of c.cells)
            this.loadedLocations.push(cl(f));
          o = !0, this.sendLoaded();
        }
      } catch {
        l.cancel();
      }
    }), this.cache[i] = l;
  }
  loadOrGetImage(t, n, r) {
    const i = t, o = this.cache[i];
    if (o !== void 0) {
      const s = Qn(n, r);
      return o.cells.includes(s) || o.cells.push(s), o.img;
    } else
      this.loadImage(t, n, r, i);
  }
}
const n1 = (e, t) => {
  const n = d.useMemo(() => ({ ...q0, ...e.headerIcons }), [e.headerIcons]), r = d.useMemo(() => e.renderers ?? Zb, [e.renderers]), i = d.useMemo(() => e.imageWindowLoader ?? new t1(), [e.imageWindowLoader]);
  return d.createElement(mb, { ...e, renderers: r, headerIcons: n, ref: t, imageWindowLoader: i });
}, r1 = d.forwardRef(n1);
function dc(e, t) {
  const n = d.useRef(null), r = d.useRef(), i = d.useCallback(() => {
    n.current && (clearTimeout(n.current), n.current = null);
  }, []);
  return d.useEffect(() => i, [i]), {
    debouncedCallback: d.useCallback((...s) => {
      r.current = s, i(), n.current = setTimeout(() => {
        r.current && (e(...r.current), r.current = void 0);
      }, t);
    }, [e, t, i]),
    cancel: i
  };
}
var i1 = ug();
const o1 = /* @__PURE__ */ vr(i1);
var aa = { exports: {} };
var a1 = aa.exports, fc;
function s1() {
  return fc || (fc = 1, (function(e, t) {
    (function(n, r) {
      try {
        e.exports = r(cg);
      } catch {
        e.exports = r;
      }
      n && (n.momentDurationFormatSetup = n.moment ? r(n.moment) : r);
    })(a1, function(n) {
      var r = !1, i = !1, o = !1, s = !1, a = "escape years months weeks days hours minutes seconds milliseconds general".split(" "), l = [
        {
          type: "seconds",
          targets: [
            { type: "minutes", value: 60 },
            { type: "hours", value: 3600 },
            { type: "days", value: 86400 },
            { type: "weeks", value: 604800 },
            { type: "months", value: 2678400 },
            { type: "years", value: 31536e3 }
          ]
        },
        {
          type: "minutes",
          targets: [
            { type: "hours", value: 60 },
            { type: "days", value: 1440 },
            { type: "weeks", value: 10080 },
            { type: "months", value: 44640 },
            { type: "years", value: 525600 }
          ]
        },
        {
          type: "hours",
          targets: [
            { type: "days", value: 24 },
            { type: "weeks", value: 168 },
            { type: "months", value: 744 },
            { type: "years", value: 8760 }
          ]
        },
        {
          type: "days",
          targets: [
            { type: "weeks", value: 7 },
            { type: "months", value: 31 },
            { type: "years", value: 365 }
          ]
        },
        {
          type: "months",
          targets: [
            { type: "years", value: 12 }
          ]
        }
      ];
      function u(H, L) {
        return L.length > H.length ? !1 : H.indexOf(L) !== -1;
      }
      function c(H) {
        for (var L = ""; H; )
          L += "0", H -= 1;
        return L;
      }
      function f(H) {
        for (var L = H.split("").reverse(), G = 0, ne = !0; ne && G < L.length; )
          G ? L[G] === "9" ? L[G] = "0" : (L[G] = (parseInt(L[G], 10) + 1).toString(), ne = !1) : (parseInt(L[G], 10) < 5 && (ne = !1), L[G] = "0"), G += 1;
        return ne && L.push("1"), L.reverse().join("");
      }
      function g(H, L) {
        var G = P(
          k(L).sort(),
          function(oe) {
            return oe + ":" + L[oe];
          }
        ).join(","), ne = H + "+" + G;
        return g.cache[ne] || (g.cache[ne] = Intl.NumberFormat(H, L)), g.cache[ne];
      }
      g.cache = {};
      function h(H, L, G) {
        var ne = L.useToLocaleString, oe = L.useGrouping, xe = oe && L.grouping.slice(), ve = L.maximumSignificantDigits, et = L.minimumIntegerDigits || 1, ke = L.fractionDigits || 0, bt = L.groupingSeparator, St = L.decimalSeparator;
        if (ne && G) {
          var Ue = {
            minimumIntegerDigits: et,
            useGrouping: oe
          };
          if (ke && (Ue.maximumFractionDigits = ke, Ue.minimumFractionDigits = ke), ve && H > 0 && (Ue.maximumSignificantDigits = ve), o) {
            if (!s) {
              var re = O({}, L);
              re.useGrouping = !1, re.decimalSeparator = ".", H = parseFloat(h(H, re), 10);
            }
            return g(G, Ue).format(H);
          } else {
            if (!i) {
              var re = O({}, L);
              re.useGrouping = !1, re.decimalSeparator = ".", H = parseFloat(h(H, re), 10);
            }
            return H.toLocaleString(G, Ue);
          }
        }
        var se;
        ve ? se = H.toPrecision(ve + 1) : se = H.toFixed(ke + 1);
        var we, fe, ye, $e = se.split("e");
        ye = $e[1] || "", $e = $e[0].split("."), fe = $e[1] || "", we = $e[0] || "";
        var _e = we.length, tt = fe.length, Re = _e + tt, qe = we + fe;
        (ve && Re === ve + 1 || !ve && tt === ke + 1) && (qe = f(qe), qe.length === Re + 1 && (_e = _e + 1), tt && (qe = qe.slice(0, -1)), we = qe.slice(0, _e), fe = qe.slice(_e)), ve && (fe = fe.replace(/0*$/, ""));
        var De = parseInt(ye, 10);
        De > 0 ? fe.length <= De ? (fe = fe + c(De - fe.length), we = we + fe, fe = "") : (we = we + fe.slice(0, De), fe = fe.slice(De)) : De < 0 && (fe = c(Math.abs(De) - we.length) + we + fe, we = "0"), ve || (fe = fe.slice(0, ke), fe.length < ke && (fe = fe + c(ke - fe.length)), we.length < et && (we = c(et - we.length) + we));
        var Ie = "";
        if (oe) {
          $e = we;
          for (var Le; $e.length; )
            xe.length && (Le = xe.shift()), Ie && (Ie = bt + Ie), Ie = $e.slice(-Le) + Ie, $e = $e.slice(0, -Le);
        } else
          Ie = we;
        return fe && (Ie = Ie + St + fe), Ie;
      }
      function p(H, L) {
        return H.label.length > L.label.length ? -1 : H.label.length < L.label.length ? 1 : 0;
      }
      function m(H, L) {
        var G = [];
        return R(k(L), function(ne) {
          if (ne.slice(0, 15) === "_durationLabels") {
            var oe = ne.slice(15).toLowerCase();
            R(k(L[ne]), function(xe) {
              xe.slice(0, 1) === H && G.push({
                type: oe,
                key: xe,
                label: L[ne][xe]
              });
            });
          }
        }), G;
      }
      function w(H, L, G) {
        return L === 1 && G === null ? H : H + H;
      }
      var b = {
        durationLabelsStandard: {
          S: "millisecond",
          SS: "milliseconds",
          s: "second",
          ss: "seconds",
          m: "minute",
          mm: "minutes",
          h: "hour",
          hh: "hours",
          d: "day",
          dd: "days",
          w: "week",
          ww: "weeks",
          M: "month",
          MM: "months",
          y: "year",
          yy: "years"
        },
        durationLabelsShort: {
          S: "msec",
          SS: "msecs",
          s: "sec",
          ss: "secs",
          m: "min",
          mm: "mins",
          h: "hr",
          hh: "hrs",
          d: "dy",
          dd: "dys",
          w: "wk",
          ww: "wks",
          M: "mo",
          MM: "mos",
          y: "yr",
          yy: "yrs"
        },
        durationTimeTemplates: {
          HMS: "h:mm:ss",
          HM: "h:mm",
          MS: "m:ss"
        },
        durationLabelTypes: [
          { type: "standard", string: "__" },
          { type: "short", string: "_" }
        ],
        durationPluralKey: w
      };
      function v(H) {
        return Object.prototype.toString.call(H) === "[object Array]";
      }
      function C(H) {
        return Object.prototype.toString.call(H) === "[object Object]";
      }
      function I(H, L) {
        for (var G = H.length; G -= 1; )
          if (L(H[G]))
            return H[G];
      }
      function E(H, L) {
        var G = 0, ne = H && H.length || 0, oe;
        for (typeof L != "function" && (oe = L, L = function(xe) {
          return xe === oe;
        }); G < ne; ) {
          if (L(H[G]))
            return H[G];
          G += 1;
        }
      }
      function R(H, L) {
        var G = 0, ne = H.length;
        if (!(!H || !ne))
          for (; G < ne; ) {
            if (L(H[G], G) === !1)
              return;
            G += 1;
          }
      }
      function P(H, L) {
        var G = 0, ne = H.length, oe = [];
        if (!H || !ne)
          return oe;
        for (; G < ne; )
          oe[G] = L(H[G], G), G += 1;
        return oe;
      }
      function x(H, L) {
        return P(H, function(G) {
          return G[L];
        });
      }
      function S(H) {
        var L = [];
        return R(H, function(G) {
          G && L.push(G);
        }), L;
      }
      function F(H) {
        var L = [];
        return R(H, function(G) {
          E(L, G) || L.push(G);
        }), L;
      }
      function D(H, L) {
        var G = [];
        return R(H, function(ne) {
          R(L, function(oe) {
            ne === oe && G.push(ne);
          });
        }), F(G);
      }
      function M(H, L) {
        var G = [];
        return R(H, function(ne, oe) {
          if (!L(ne))
            return G = H.slice(oe), !1;
        }), G;
      }
      function T(H, L) {
        var G = H.slice().reverse();
        return M(G, L).reverse();
      }
      function O(H, L) {
        for (var G in L)
          L.hasOwnProperty(G) && (H[G] = L[G]);
        return H;
      }
      function k(H) {
        var L = [];
        for (var G in H)
          H.hasOwnProperty(G) && L.push(G);
        return L;
      }
      function N(H, L) {
        var G = 0, ne = H.length;
        if (!H || !ne)
          return !1;
        for (; G < ne; ) {
          if (L(H[G], G) === !0)
            return !0;
          G += 1;
        }
        return !1;
      }
      function q(H) {
        var L = [];
        return R(H, function(G) {
          L = L.concat(G);
        }), L;
      }
      function Y() {
        var H = 0;
        try {
          H.toLocaleString("i");
        } catch (L) {
          return L.name === "RangeError";
        }
        return !1;
      }
      function ue(H) {
        return H(3.55, "en", {
          useGrouping: !1,
          minimumIntegerDigits: 1,
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }) === "3.6";
      }
      function ee(H) {
        var L = !0;
        return L = L && H(1, "en", { minimumIntegerDigits: 1 }) === "1", L = L && H(1, "en", { minimumIntegerDigits: 2 }) === "01", L = L && H(1, "en", { minimumIntegerDigits: 3 }) === "001", !(!L || (L = L && H(99.99, "en", { maximumFractionDigits: 0, minimumFractionDigits: 0 }) === "100", L = L && H(99.99, "en", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) === "100.0", L = L && H(99.99, "en", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) === "99.99", L = L && H(99.99, "en", { maximumFractionDigits: 3, minimumFractionDigits: 3 }) === "99.990", !L) || (L = L && H(99.99, "en", { maximumSignificantDigits: 1 }) === "100", L = L && H(99.99, "en", { maximumSignificantDigits: 2 }) === "100", L = L && H(99.99, "en", { maximumSignificantDigits: 3 }) === "100", L = L && H(99.99, "en", { maximumSignificantDigits: 4 }) === "99.99", L = L && H(99.99, "en", { maximumSignificantDigits: 5 }) === "99.99", !L) || (L = L && H(1e3, "en", { useGrouping: !0 }) === "1,000", L = L && H(1e3, "en", { useGrouping: !1 }) === "1000", !L));
      }
      function te() {
        var H = [].slice.call(arguments), L = {}, G;
        if (R(H, function(ve, et) {
          if (!et) {
            if (!v(ve))
              throw "Expected array as the first argument to durationsFormat.";
            G = ve;
          }
          if (typeof ve == "string" || typeof ve == "function") {
            L.template = ve;
            return;
          }
          if (typeof ve == "number") {
            L.precision = ve;
            return;
          }
          C(ve) && O(L, ve);
        }), !G || !G.length)
          return [];
        L.returnMomentTypes = !0;
        var ne = P(G, function(ve) {
          return ve.format(L);
        }), oe = D(a, F(x(q(ne), "type"))), xe = L.largest;
        return xe && (oe = oe.slice(0, xe)), L.returnMomentTypes = !1, L.outputTypes = oe, P(G, function(ve) {
          return ve.format(L);
        });
      }
      function ce() {
        var H = [].slice.call(arguments), L = O({}, this.format.defaults), G = this.asMilliseconds(), ne = this.asMonths();
        typeof this.isValid == "function" && this.isValid() === !1 && (G = 0, ne = 0);
        var oe = G < 0, xe = n.duration(Math.abs(G), "milliseconds"), ve = n.duration(Math.abs(ne), "months");
        R(H, function(B) {
          if (typeof B == "string" || typeof B == "function") {
            L.template = B;
            return;
          }
          if (typeof B == "number") {
            L.precision = B;
            return;
          }
          C(B) && O(L, B);
        });
        var et = {
          years: "y",
          months: "M",
          weeks: "w",
          days: "d",
          hours: "h",
          minutes: "m",
          seconds: "s",
          milliseconds: "S"
        }, ke = {
          escape: /\[(.+?)\]/,
          years: /\*?[Yy]+/,
          months: /\*?M+/,
          weeks: /\*?[Ww]+/,
          days: /\*?[Dd]+/,
          hours: /\*?[Hh]+/,
          minutes: /\*?m+/,
          seconds: /\*?s+/,
          milliseconds: /\*?S+/,
          general: /.+?/
        };
        L.types = a;
        var bt = function(B) {
          return E(a, function(We) {
            return ke[We].test(B);
          });
        }, St = new RegExp(P(a, function(B) {
          return ke[B].source;
        }).join("|"), "g");
        L.duration = this;
        var Ue = typeof L.template == "function" ? L.template.apply(L) : L.template, re = L.outputTypes, se = L.returnMomentTypes, we = L.largest, fe = [];
        re || (v(L.stopTrim) && (L.stopTrim = L.stopTrim.join("")), L.stopTrim && R(L.stopTrim.match(St), function(B) {
          var We = bt(B);
          We === "escape" || We === "general" || fe.push(We);
        }));
        var ye = n.localeData();
        ye || (ye = {}), R(k(b), function(B) {
          if (typeof b[B] == "function") {
            ye[B] || (ye[B] = b[B]);
            return;
          }
          ye["_" + B] || (ye["_" + B] = b[B]);
        }), R(k(ye._durationTimeTemplates), function(B) {
          Ue = Ue.replace("_" + B + "_", ye._durationTimeTemplates[B]);
        });
        var $e = L.userLocale || n.locale(), _e = L.useLeftUnits, tt = L.usePlural, Re = L.precision, qe = L.forceLength, De = L.useGrouping, Ie = L.trunc, Le = L.useSignificantDigits && Re > 0, ht = Le ? L.precision : 0, nt = ht, Xe = L.minValue, kt = !1, wt = L.maxValue, Ot = !1, Pt = L.useToLocaleString, ln = L.groupingSeparator, Jt = L.decimalSeparator, Dn = L.grouping;
        Pt = Pt && (r || o);
        var Tt = L.trim;
        v(Tt) && (Tt = Tt.join(" ")), Tt === null && (we || wt || Le) && (Tt = "all"), (Tt === null || Tt === !0 || Tt === "left" || Tt === "right") && (Tt = "large"), Tt === !1 && (Tt = "");
        var gt = function(B) {
          return B.test(Tt);
        }, On = /large/, yt = /small/, Qt = /both/, kn = /mid/, Oe = /^all|[^sm]all/, ct = /final/, pt = we > 0 || N([On, Qt, Oe], gt), Pn = N([yt, Qt, Oe], gt), un = N([kn, Oe], gt), cn = N([ct, Oe], gt), Ln = P(Ue.match(St), function(B, We) {
          var Ge = bt(B);
          return B.slice(0, 1) === "*" && (B = B.slice(1), Ge !== "escape" && Ge !== "general" && fe.push(Ge)), {
            index: We,
            length: B.length,
            text: "",
            // Replace escaped tokens with the non-escaped token text.
            token: Ge === "escape" ? B.replace(ke.escape, "$1") : B,
            // Ignore type on non-moment tokens.
            type: Ge === "escape" || Ge === "general" ? null : Ge
          };
        }), en = {
          index: 0,
          length: 0,
          token: "",
          text: "",
          type: null
        }, tn = [];
        _e && Ln.reverse(), R(Ln, function(B) {
          if (B.type) {
            (en.type || en.text) && tn.push(en), en = B;
            return;
          }
          _e ? en.text = B.token + en.text : en.text += B.token;
        }), (en.type || en.text) && tn.push(en), _e && tn.reverse();
        var Be = D(a, F(S(x(tn, "type"))));
        if (!Be.length)
          return x(tn, "text").join("");
        Be = P(Be, function(B, We) {
          var Ge = We + 1 === Be.length, Lt = !We, nn;
          B === "years" || B === "months" ? nn = ve.as(B) : nn = xe.as(B);
          var hn = Math.floor(nn), Rn = nn - hn, yn = E(tn, function(Ut) {
            return B === Ut.type;
          });
          return Lt && wt && nn > wt && (Ot = !0), Ge && Xe && Math.abs(L.duration.as(B)) < Xe && (kt = !0), Lt && qe === null && yn.length > 1 && (qe = !0), xe.subtract(hn, B), ve.subtract(hn, B), {
            rawValue: nn,
            wholeValue: hn,
            // Decimal value is only retained for the least-magnitude
            // moment type in the format template.
            decimalValue: Ge ? Rn : 0,
            isSmallest: Ge,
            isLargest: Lt,
            type: B,
            // Tokens can appear multiple times in a template string,
            // but all instances must share the same length.
            tokenLength: yn.length
          };
        });
        var Mt = Ie ? Math.floor : Math.round, Fn = function(B, We) {
          var Ge = Math.pow(10, We);
          return Mt(B * Ge) / Ge;
        }, Ft = !1, mt = !1, Mn = function(B, We) {
          var Ge = {
            useGrouping: De,
            groupingSeparator: ln,
            decimalSeparator: Jt,
            grouping: Dn,
            useToLocaleString: Pt
          };
          return Le && (ht <= 0 ? (B.rawValue = 0, B.wholeValue = 0, B.decimalValue = 0) : (Ge.maximumSignificantDigits = ht, B.significantDigits = ht)), Ot && !mt && (B.isLargest ? (B.wholeValue = wt, B.decimalValue = 0) : (B.wholeValue = 0, B.decimalValue = 0)), kt && !mt && (B.isSmallest ? (B.wholeValue = Xe, B.decimalValue = 0) : (B.wholeValue = 0, B.decimalValue = 0)), B.isSmallest || B.significantDigits && B.significantDigits - B.wholeValue.toString().length <= 0 ? Re < 0 ? B.value = Fn(B.wholeValue, Re) : Re === 0 ? B.value = Mt(B.wholeValue + B.decimalValue) : Le ? (Ie ? B.value = Fn(B.rawValue, ht - B.wholeValue.toString().length) : B.value = B.rawValue, B.wholeValue && (ht -= B.wholeValue.toString().length)) : (Ge.fractionDigits = Re, Ie ? B.value = B.wholeValue + Fn(B.decimalValue, Re) : B.value = B.wholeValue + B.decimalValue) : Le && B.wholeValue ? (B.value = Math.round(Fn(B.wholeValue, B.significantDigits - B.wholeValue.toString().length)), ht -= B.wholeValue.toString().length) : B.value = B.wholeValue, B.tokenLength > 1 && (qe || Ft) && (Ge.minimumIntegerDigits = B.tokenLength, mt && Ge.maximumSignificantDigits < B.tokenLength && delete Ge.maximumSignificantDigits), !Ft && (B.value > 0 || Tt === "" || E(fe, B.type) || E(re, B.type)) && (Ft = !0), B.formattedValue = h(B.value, Ge, $e), Ge.useGrouping = !1, Ge.decimalSeparator = ".", B.formattedValueEn = h(B.value, Ge, "en"), B.tokenLength === 2 && B.type === "milliseconds" && (B.formattedValueMS = h(B.value, {
            minimumIntegerDigits: 3,
            useGrouping: !1
          }, "en").slice(0, 2)), B;
        };
        if (Be = P(Be, Mn), Be = S(Be), Be.length > 1) {
          var ur = function(B) {
            return E(Be, function(We) {
              return We.type === B;
            });
          }, Nn = function(B) {
            var We = ur(B.type);
            We && R(B.targets, function(Ge) {
              var Lt = ur(Ge.type);
              Lt && parseInt(We.formattedValueEn, 10) === Ge.value && (We.rawValue = 0, We.wholeValue = 0, We.decimalValue = 0, Lt.rawValue += 1, Lt.wholeValue += 1, Lt.decimalValue = 0, Lt.formattedValueEn = Lt.wholeValue.toString(), mt = !0);
            });
          };
          R(l, Nn);
        }
        return mt && (Ft = !1, ht = nt, Be = P(Be, Mn), Be = S(Be)), re && !(Ot && !L.trim) ? (Be = P(Be, function(B) {
          return E(re, function(We) {
            return B.type === We;
          }) ? B : null;
        }), Be = S(Be)) : (pt && (Be = M(Be, function(B) {
          return !B.isSmallest && !B.wholeValue && !E(fe, B.type);
        })), we && Be.length && (Be = Be.slice(0, we)), Pn && Be.length > 1 && (Be = T(Be, function(B) {
          return !B.wholeValue && !E(fe, B.type) && !B.isLargest;
        })), un && (Be = P(Be, function(B, We) {
          return We > 0 && We < Be.length - 1 && !B.wholeValue ? null : B;
        }), Be = S(Be)), cn && Be.length === 1 && !Be[0].wholeValue && !(!Ie && Be[0].isSmallest && Be[0].rawValue < Xe) && (Be = [])), se ? Be : (R(tn, function(B) {
          var We = et[B.type], Ge = E(Be, function(Ut) {
            return Ut.type === B.type;
          });
          if (!(!We || !Ge)) {
            var Lt = Ge.formattedValueEn.split(".");
            Lt[0] = parseInt(Lt[0], 10), Lt[1] ? Lt[1] = parseFloat("0." + Lt[1], 10) : Lt[1] = null;
            var nn = ye.durationPluralKey(We, Lt[0], Lt[1]), hn = m(We, ye), Rn = !1, yn = {};
            R(ye._durationLabelTypes, function(Ut) {
              var En = E(hn, function(In) {
                return In.type === Ut.type && In.key === nn;
              });
              En && (yn[En.type] = En.label, u(B.text, Ut.string) && (B.text = B.text.replace(Ut.string, En.label), Rn = !0));
            }), tt && !Rn && (hn.sort(p), R(hn, function(Ut) {
              if (yn[Ut.type] === Ut.label)
                return u(B.text, Ut.label) ? !1 : void 0;
              if (u(B.text, Ut.label))
                return B.text = B.text.replace(Ut.label, yn[Ut.type]), !1;
            }));
          }
        }), tn = P(tn, function(B) {
          if (!B.type)
            return B.text;
          var We = E(Be, function(Lt) {
            return Lt.type === B.type;
          });
          if (!We)
            return "";
          var Ge = "";
          return _e && (Ge += B.text), (oe && Ot || !oe && kt) && (Ge += "< ", Ot = !1, kt = !1), (oe && kt || !oe && Ot) && (Ge += "> ", Ot = !1, kt = !1), oe && (We.value > 0 || Tt === "" || E(fe, We.type) || E(re, We.type)) && (Ge += "-", oe = !1), B.type === "milliseconds" && We.formattedValueMS ? Ge += We.formattedValueMS : Ge += We.formattedValue, _e || (Ge += B.text), Ge;
        }), tn.join("").replace(/(,| |:|\.)*$/, "").replace(/^(,| |:|\.)*/, ""));
      }
      function le() {
        var H = this.duration, L = function(xe) {
          return H._data[xe];
        }, G = E(this.types, L), ne = I(this.types, L);
        switch (G) {
          case "milliseconds":
            return "S __";
          case "seconds":
          // Fallthrough.
          case "minutes":
            return "*_MS_";
          case "hours":
            return "_HMS_";
          case "days":
            if (G === ne)
              return "d __";
          case "weeks":
            return G === ne ? "w __" : (this.trim === null && (this.trim = "both"), "w __, d __, h __");
          case "months":
            if (G === ne)
              return "M __";
          case "years":
            return G === ne ? "y __" : (this.trim === null && (this.trim = "both"), "y __, M __, d __");
          default:
            return this.trim === null && (this.trim = "both"), "y __, d __, h __, m __, s __";
        }
      }
      function he(H) {
        if (!H)
          throw "Moment Duration Format init cannot find moment instance.";
        H.duration.format = te, H.duration.fn.format = ce, H.duration.fn.format.defaults = {
          // Many options are defaulted to `null` to distinguish between
          // 'not set' and 'set to `false`'
          // trim
          // Can be a string, a delimited list of strings, an array of strings,
          // or a boolean.
          // "large" - will trim largest-magnitude zero-value tokens until
          // finding a token with a value, a token identified as 'stopTrim', or
          // the final token of the format string.
          // "small" - will trim smallest-magnitude zero-value tokens until
          // finding a token with a value, a token identified as 'stopTrim', or
          // the final token of the format string.
          // "both" - will execute "large" trim then "small" trim.
          // "mid" - will trim any zero-value tokens that are not the first or
          // last tokens. Usually used in conjunction with "large" or "both".
          // e.g. "large mid" or "both mid".
          // "final" - will trim the final token if it is zero-value. Use this
          // option with "large" or "both" to output an empty string when
          // formatting a zero-value duration. e.g. "large final" or "both final".
          // "all" - Will trim all zero-value tokens. Shorthand for "both mid final".
          // "left" - maps to "large" to support plugin's version 1 API.
          // "right" - maps to "large" to support plugin's version 1 API.
          // `false` - template tokens are not trimmed.
          // `true` - treated as "large".
          // `null` - treated as "large".
          trim: null,
          // stopTrim
          // A moment token string, a delimited set of moment token strings,
          // or an array of moment token strings. Trimming will stop when a token
          // listed in this option is reached. A "*" character in the format
          // template string will also mark a moment token as stopTrim.
          // e.g. "d [days] *h:mm:ss" will always stop trimming at the 'hours' token.
          stopTrim: null,
          // largest
          // Set to a positive integer to output only the "n" largest-magnitude
          // moment tokens that have a value. All lesser-magnitude moment tokens
          // will be ignored. This option takes effect even if `trim` is set
          // to `false`.
          largest: null,
          // maxValue
          // Use `maxValue` to render generalized output for large duration values,
          // e.g. `"> 60 days"`. `maxValue` must be a positive integer and is
          /// applied to the greatest-magnitude moment token in the format template.
          maxValue: null,
          // minValue
          // Use `minValue` to render generalized output for small duration values,
          // e.g. `"< 5 minutes"`. `minValue` must be a positive integer and is
          // applied to the least-magnitude moment token in the format template.
          minValue: null,
          // precision
          // If a positive integer, number of decimal fraction digits to render.
          // If a negative integer, number of integer place digits to truncate to 0.
          // If `useSignificantDigits` is set to `true` and `precision` is a positive
          // integer, sets the maximum number of significant digits used in the
          // formatted output.
          precision: 0,
          // trunc
          // Default behavior rounds final token value. Set to `true` to
          // truncate final token value, which was the default behavior in
          // version 1 of this plugin.
          trunc: !1,
          // forceLength
          // Force first moment token with a value to render at full length
          // even when template is trimmed and first moment token has length of 1.
          forceLength: null,
          // userLocale
          // Formatted numerical output is rendered using `toLocaleString`
          // and the locale of the user's environment. Set this option to render
          // numerical output using a different locale. Unit names are rendered
          // and detected using the locale set in moment.js, which can be different
          // from the locale of user's environment.
          userLocale: null,
          // usePlural
          // Will automatically singularize or pluralize unit names when they
          // appear in the text associated with each moment token. Standard and
          // short unit labels are singularized and pluralized, based on locale.
          // e.g. in english, "1 second" or "1 sec" would be rendered instead
          // of "1 seconds" or "1 secs". The default pluralization function
          // renders a plural label for a value with decimal precision.
          // e.g. "1.0 seconds" is never rendered as "1.0 second".
          // Label types and pluralization function are configurable in the
          // localeData extensions.
          usePlural: !0,
          // useLeftUnits
          // The text to the right of each moment token in a format string
          // is treated as that token's units for the purposes of trimming,
          // singularizing, and auto-localizing.
          // e.g. "h [hours], m [minutes], s [seconds]".
          // To properly singularize or localize a format string such as
          // "[hours] h, [minutes] m, [seconds] s", where the units appear
          // to the left of each moment token, set useLeftUnits to `true`.
          // This plugin is not tested in the context of rtl text.
          useLeftUnits: !1,
          // useGrouping
          // Enables locale-based digit grouping in the formatted output. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
          useGrouping: !0,
          // useSignificantDigits
          // Treat the `precision` option as the maximum significant digits
          // to be rendered. Precision must be a positive integer. Significant
          // digits extend across unit types,
          // e.g. "6 hours 37.5 minutes" represents 4 significant digits.
          // Enabling this option causes token length to be ignored. See  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
          useSignificantDigits: !1,
          // template
          // The template string used to format the duration. May be a function
          // or a string. Template functions are executed with the `this` binding
          // of the settings object so that template strings may be dynamically
          // generated based on the duration object (accessible via `this.duration`)
          // or any of the other settings. Leading and trailing space, comma,
          // period, and colon characters are trimmed from the resulting string.
          template: le,
          // useToLocaleString
          // Set this option to `false` to ignore the `toLocaleString` feature
          // test and force the use of the `formatNumber` fallback function
          // included in this plugin.
          useToLocaleString: !0,
          // formatNumber fallback options.
          // When `toLocaleString` is detected and passes the feature test, the
          // following options will have no effect: `toLocaleString` will be used
          // for formatting and the grouping separator, decimal separator, and
          // integer digit grouping will be determined by the user locale.
          // groupingSeparator
          // The integer digit grouping separator used when using the fallback
          // formatNumber function.
          groupingSeparator: ",",
          // decimalSeparator
          // The decimal separator used when using the fallback formatNumber
          // function.
          decimalSeparator: ".",
          // grouping
          // The integer digit grouping used when using the fallback formatNumber
          // function. Must be an array. The default value of `[3]` gives the
          // standard 3-digit thousand/million/billion digit groupings for the
          // "en" locale. Setting this option to `[3, 2]` would generate the
          // thousand/lakh/crore digit groupings used in the "en-IN" locale.
          grouping: [3]
        }, H.updateLocale("en", b);
      }
      var de = function(H, L, G) {
        return H.toLocaleString(L, G);
      };
      r = Y() && ee(de), i = r && ue(de);
      var ie = function(H, L, G) {
        if (typeof window < "u" && window && window.Intl && window.Intl.NumberFormat)
          return window.Intl.NumberFormat(L, G).format(H);
      };
      return o = ee(ie), s = o && ue(ie), he(n), he;
    });
  })(aa)), aa.exports;
}
s1();
const l1 = ["true", "t", "yes", "y", "on", "1"], u1 = ["false", "f", "no", "n", "off", "0"];
function Dt(e, t = "") {
  return {
    kind: Z.Text,
    readonly: !0,
    allowOverlay: !0,
    data: e,
    displayData: e,
    errorDetails: t,
    isError: !0,
    style: "faded"
  };
}
function Pi(e) {
  return Object.hasOwn(e, "isError") && e.isError;
}
function c1(e) {
  return Object.hasOwn(e, "tooltip") && e.tooltip !== "";
}
function gl(e) {
  return Object.hasOwn(e, "isMissingValue") && e.isMissingValue;
}
function js(e = !1) {
  return e ? {
    kind: Z.Loading,
    allowOverlay: !1,
    isMissingValue: !0,
    copyData: ""
  } : {
    kind: Z.Loading,
    allowOverlay: !1,
    copyData: ""
  };
}
function d1(e, t) {
  const n = t ? "faded" : "normal";
  return {
    kind: Z.Text,
    data: "",
    displayData: "",
    allowOverlay: !0,
    readonly: e,
    style: n
  };
}
function qs(e) {
  return {
    id: e.id,
    title: e.title,
    hasMenu: !1,
    menuIcon: "dots",
    themeOverride: e.themeOverride,
    icon: e.icon,
    group: e.group,
    // Only grow non pinned columns, it looks a bit broken otherwise:
    ...e.isStretched && !e.isPinned && {
      grow: 1
    },
    ...e.width && {
      width: e.width
    }
  };
}
function _i(e, t) {
  return Pe(e) ? t || {} : Pe(t) ? e || {} : id(e, t);
}
function pl(e) {
  if (Pe(e))
    return [];
  if (typeof e == "number" || typeof e == "boolean")
    return [e];
  if (e instanceof Uint8Array && (e = new TextDecoder("utf-8").decode(e)), typeof e == "string") {
    if (e === "")
      return [];
    if (e.trim().startsWith("[") && e.trim().endsWith("]"))
      try {
        return JSON.parse(e);
      } catch {
        return [e];
      }
    else
      return e.split(",");
  }
  try {
    const t = JSON.parse(JSON.stringify(e, (n, r) => typeof r == "bigint" ? Number(r) : r));
    return Array.isArray(t) ? t.map((n) => ["string", "number", "boolean", "null"].includes(typeof n) ? n : lt(n)) : [lt(t)];
  } catch {
    return [lt(e)];
  }
}
function vf(e) {
  return typeof e == "string" || e instanceof String ? !0 : (e instanceof dg && (e = Array.from(e)), Array.isArray(e) && e.every((t) => typeof t == "string" || t instanceof String));
}
function f1(e) {
  return e?.startsWith("{") && e.endsWith("}");
}
function lt(e) {
  try {
    try {
      return o1(e);
    } catch {
      return JSON.stringify(e, (n, r) => typeof r == "bigint" ? Number(r) : r);
    }
  } catch {
    return `[${typeof e}]`;
  }
}
function bf(e) {
  if (Pe(e))
    return null;
  if (typeof e == "boolean")
    return e;
  const t = lt(e).toLowerCase().trim();
  if (t === "")
    return null;
  if (l1.includes(t))
    return !0;
  if (u1.includes(t))
    return !1;
}
function wo(e) {
  if (Pe(e))
    return null;
  if (Array.isArray(e))
    return NaN;
  if (typeof e == "string") {
    if (e.trim().length === 0)
      return null;
    try {
      const t = ao.unformat(e.trim());
      if (st(t))
        return t;
    } catch {
    }
  } else if (e instanceof Int32Array)
    return Number(e[0]);
  return Number(e);
}
function wf(e) {
  return Pe(e) ? "" : lt(e.map((t) => (
    // Replace commas with spaces since commas are used to
    // separate the list items.
    typeof t == "string" && t.includes(",") ? t.replace(/,/g, " ") : t
  )));
}
function ba(e) {
  if (Pe(e))
    return "";
  if (typeof e == "string")
    return e;
  try {
    return JSON.stringify(e, (t, n) => (
      // BigInt are not supported by JSON.stringify
      // so we convert them to a number as fallback
      typeof n == "bigint" ? Number(n) : n
    ));
  } catch {
    return lt(e);
  }
}
function h1(e) {
  if (e === 0 || Math.abs(e) >= 1e-4)
    return 4;
  const n = e.toExponential().split("e");
  return Math.abs(parseInt(n[1], 10));
}
function Yr(e, t = {}) {
  const n = navigator.languages;
  try {
    return new Intl.NumberFormat(n, t).format(e);
  } catch (r) {
    if (r instanceof RangeError)
      return new Intl.NumberFormat(void 0, t).format(e);
    throw r;
  }
}
function wa(e, t, n) {
  return Number.isNaN(e) || !Number.isFinite(e) ? "" : Pe(t) || t === "" ? st(n) ? (n === 0 && (e = Math.round(e)), ao(e).format({
    thousandSeparated: !1,
    mantissa: n,
    trimMantissa: !1
  })) : ao(e).format({
    thousandSeparated: !1,
    mantissa: h1(e),
    trimMantissa: !0
  }) : t === "plain" ? ao(e).format({
    thousandSeparated: !1,
    // Use a large mantissa to avoid cutting off decimals
    mantissa: 20,
    trimMantissa: !0
  }) : t === "localized" ? Yr(e, {
    minimumFractionDigits: n ?? void 0,
    maximumFractionDigits: n ?? void 0
  }) : t === "percent" ? Yr(e, {
    style: "percent",
    minimumFractionDigits: st(n) ? Math.max(n - 2, 0) : 0,
    maximumFractionDigits: st(n) ? (
      // Percentage already gets multiplied by 100 by the formatter,
      // so we need to reduce the precision by 2 to get the
      // correct format based on the raw value.
      Math.max(n - 2, 0)
    ) : 2
  }) : t === "dollar" ? Yr(e, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: n ?? 2,
    maximumFractionDigits: n ?? 2
  }) : t === "euro" ? Yr(e, {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: n ?? 2,
    maximumFractionDigits: n ?? 2
  }) : t === "yen" ? Yr(e, {
    style: "currency",
    currency: "JPY",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: n ?? 0,
    maximumFractionDigits: n ?? 0
  }) : ["compact", "scientific", "engineering"].includes(t) ? Yr(e, {
    notation: t
  }) : t === "accounting" ? ao(e).format({
    thousandSeparated: !0,
    negative: "parenthesis",
    mantissa: n ?? 2,
    trimMantissa: !1
  }) : t === "bytes" ? Yr(e, {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
    // We don't apply maxPrecision here since
    // bytes already gets transformed to different units.
    maximumFractionDigits: 1
  }).replace("BB", "GB") : Rp.sprintf(t, e);
}
function hc(e, t, n = "datetime") {
  if (t === "localized") {
    const r = navigator.languages, i = n === "time" ? void 0 : "medium", o = n === "date" ? void 0 : "medium";
    try {
      return new Intl.DateTimeFormat(r, {
        dateStyle: i,
        timeStyle: o
      }).format(e.toDate());
    } catch (s) {
      if (s instanceof RangeError)
        return new Intl.DateTimeFormat(void 0, {
          dateStyle: i,
          timeStyle: o
        }).format(e.toDate());
      throw s;
    }
  } else {
    if (t === "distance")
      return e.fromNow();
    if (t === "calendar")
      return e.calendar();
    if (t === "iso8601")
      return n === "date" ? e.format("YYYY-MM-DD") : n === "time" ? e.format("HH:mm:ss.SSS[Z]") : e.toISOString();
  }
  return e.format(t);
}
function Zo(e) {
  if (Pe(e))
    return null;
  if (e instanceof Date)
    return isNaN(e.getTime()) ? void 0 : e;
  if (typeof e == "string" && e.trim().length === 0)
    return null;
  try {
    const t = Number(e);
    if (!isNaN(t)) {
      let n = t;
      t >= 10 ** 18 ? n = t / 1e3 ** 3 : t >= 10 ** 15 ? n = t / 1e3 ** 2 : t >= 10 ** 12 && (n = t / 1e3);
      const r = Xr.unix(n).utc();
      if (r.isValid())
        return r.toDate();
    }
    if (typeof e == "string") {
      const n = Xr.utc(e);
      if (n.isValid())
        return n.toDate();
      const r = Xr.utc(e, [
        Xr.HTML5_FMT.TIME_MS,
        // HH:mm:ss.SSS
        Xr.HTML5_FMT.TIME_SECONDS,
        // HH:mm:ss
        Xr.HTML5_FMT.TIME
        // HH:mm
      ]);
      if (r.isValid())
        return r.toDate();
    }
  } catch {
    return;
  }
}
function yf(e) {
  if (e % 1 === 0)
    return 0;
  let t = e.toString();
  return t.indexOf("e") !== -1 && (t = e.toLocaleString("fullwide", {
    useGrouping: !1,
    maximumFractionDigits: 20
  })), t.indexOf(".") === -1 ? 0 : t.split(".")[1].length;
}
function g1(e, t) {
  if (!Number.isFinite(e)) return e;
  if (t <= 0) return Math.trunc(e);
  const n = 10 ** t, r = e * n, i = Number.EPSILON * Math.abs(r) * 10;
  return Math.trunc(r + Math.sign(r) * i) / n;
}
const p1 = new RegExp(/(\r\n|\n|\r)/gm);
function yo(e) {
  return e.indexOf(`
`) !== -1 ? e.replace(p1, " ") : e;
}
function m1(e, t) {
  if (Pe(t))
    return "";
  try {
    const n = t.match(e);
    return n?.[1] !== void 0 ? decodeURIComponent(n[1].replace(/\+/g, "%20")) : t;
  } catch {
    return t;
  }
}
const v1 = /* @__PURE__ */ tr("div", {
  target: "en99xsi0"
})(({
  theme: e
}) => ({
  overflowY: "auto",
  padding: e.spacing.sm,
  ".react-json-view .copy-icon svg": {
    // Make the copy icon responsive to the root font size.
    fontSize: "0.9em !important",
    marginRight: `${e.spacing.threeXS} !important`,
    verticalAlign: "middle !important"
  }
}), ""), ml = ({
  jsonValue: e,
  theme: t
}) => {
  let n;
  if (e)
    try {
      n = typeof e == "string" ? ts.parse(e) : ts.parse(ts.stringify(e));
    } catch {
      n = void 0;
    }
  return Pe(n) ? /* @__PURE__ */ me.jsx(ti, { highlight: !0, autoFocus: !1, disabled: !0, value: ba(e) ?? "", onChange: () => {
  } }) : /* @__PURE__ */ me.jsx(v1, { "data-testid": "stJsonColumnViewer", children: /* @__PURE__ */ me.jsx(fg, { src: n, collapsed: 2, theme: hg(t.bgCell) > 0.5 ? "rjv-default" : "monokai", displayDataTypes: !1, displayObjectSize: !1, name: !1, enableClipboard: !0, style: {
    fontFamily: t.fontFamily,
    fontSize: t.baseFontStyle,
    backgroundColor: t.bgCell,
    whiteSpace: "pre-wrap"
    // preserve whitespace
  } }) });
};
d.memo(ml);
const b1 = (e) => {
  const t = e.theme, n = e.value.data;
  return /* @__PURE__ */ me.jsx(ml, { jsonValue: n.value || n.displayValue, theme: t });
}, w1 = (e) => {
  const t = e.theme, n = e.value;
  return /* @__PURE__ */ me.jsx(ml, { jsonValue: n.data, theme: t });
}, y1 = {
  kind: Z.Custom,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  isMatch: (e) => e.data.kind === "json-cell",
  draw: (e, t) => {
    const {
      value: n,
      displayValue: r
    } = t.data;
    return al(e, r ?? ba(n) ?? "", t.contentAlign), !0;
  },
  measure: (e, t, n) => {
    const {
      value: r,
      displayValue: i
    } = t.data, o = i ?? ba(r) ?? "";
    return (o ? e.measureText(o).width : 0) + n.cellHorizontalPadding * 2;
  },
  provideEditor: () => ({
    editor: b1
  })
}, Cf = "line_chart", C1 = "area_chart", Sf = "bar_chart", S1 = (e) => new Map(Object.entries({
  red: e.colors.redColor,
  blue: e.colors.blueColor,
  green: e.colors.greenColor,
  yellow: e.colors.yellowColor,
  violet: e.colors.violetColor,
  orange: e.colors.orangeColor,
  gray: e.colors.grayColor,
  grey: e.colors.grayColor,
  primary: e.colors.primary
}));
function vl(e, t, n, r) {
  const i = _i(
    // Default parameters:
    {
      y_min: null,
      y_max: null,
      color: void 0
    },
    // User parameters:
    t.columnTypeOptions
  ), o = S1(r);
  let s;
  i.color === "auto" || i.color === "auto-inverse" ? s = r.colors.greenColor : s = i.color ? o.get(i.color) ?? i.color : void 0;
  const a = {
    kind: Z.Custom,
    allowOverlay: !1,
    copyData: "",
    contentAlign: t.contentAlignment,
    data: {
      kind: "sparkline-cell",
      values: [],
      displayValues: [],
      graphKind: n,
      color: s,
      yAxis: [i.y_min ?? 0, i.y_max ?? 1]
    }
  };
  return {
    ...t,
    kind: e,
    typeIcon: e === Cf ? ":material/show_chart:" : e === Sf ? ":material/bar_chart:" : ":material/area_chart:",
    sortMode: "default",
    isEditable: !1,
    // Chart column is always read-only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(l) {
      if (Pe(l))
        return js();
      const u = pl(l), c = [];
      let f = [];
      if (u.length === 0)
        return js();
      let g = Number.MIN_SAFE_INTEGER, h = Number.MAX_SAFE_INTEGER;
      for (let b = 0; b < u.length; b++) {
        const v = wo(u[b]);
        if (Number.isNaN(v) || Pe(v))
          return Dt(lt(u), `The value cannot be interpreted as a numeric array. ${lt(v)} is not a number.`);
        v > g && (g = v), v < h && (h = v), c.push(v);
      }
      let p, m;
      if (u.length === 1) {
        let b;
        g <= 0 ? b = g === 0 ? 1 : 0 : b = g, p = i.y_max ?? b, m = i.y_min ?? (g >= 0 ? 0 : g);
      } else
        p = i.y_max ?? g, m = i.y_min ?? h;
      if (Pe(m) || Pe(p) || Number.isNaN(m) || Number.isNaN(p) || m >= p)
        return Dt("Invalid min/max y-axis configuration", `The y_min (${m}) and y_max (${p}) configuration options must be valid numbers.`);
      c.length > 0 && (g > p || h < m) ? f = c.map((b) => g - h === 0 ? g > (p || 1) ? p : m : (p - m) * ((b - h) / (g - h)) + m) : f = c;
      let w = s;
      return (i.color === "auto" && // Chart is pointing down
      f[0] > f[f.length - 1] || i.color === "auto-inverse" && // Chart is pointing up:
      f[0] < f[f.length - 1]) && (w = r.colors.redColor), {
        ...a,
        copyData: c.join(","),
        // Column sorting is done via the copyData value
        data: {
          ...a.data,
          values: f,
          displayValues: c.map((b) => wa(b)),
          yAxis: [m, p],
          color: w
        },
        isMissingValue: Pe(l)
      };
    },
    getCellValue(l) {
      return l.kind === Z.Loading || l.data?.values === void 0 ? null : l.data?.values;
    }
  };
}
function xf(e, t) {
  return vl(Cf, e, "line", t);
}
xf.isEditableType = !1;
function kf(e, t) {
  return vl(Sf, e, "bar", t);
}
kf.isEditableType = !1;
function Mf(e, t) {
  return vl(C1, e, "area", t);
}
Mf.isEditableType = !1;
function bl(e, t) {
  const n = {
    kind: Z.Boolean,
    data: !1,
    allowOverlay: !1,
    // no overlay possible
    contentAlign: e.contentAlignment,
    readonly: !e.isEditable,
    style: "normal"
  };
  return {
    ...e,
    kind: "checkbox",
    typeIcon: ":material/check_box:",
    sortMode: "default",
    themeOverride: {
      // Apply the theme's rounding radius so that it applies the correct
      // rounding radius to the checkbox based on the theme config.
      roundingRadius: Math.round(
        // Use theme value, but a maximum rounding of maxCheckbox:
        Math.min(an(t.radii.md), an(t.radii.maxCheckbox))
      )
    },
    getCell(r) {
      let i = null;
      return i = bf(r), i === void 0 ? Dt(lt(r), "The value cannot be interpreted as boolean.") : {
        ...n,
        data: i,
        isMissingValue: Pe(i)
      };
    },
    getCellValue(r) {
      return r.data === void 0 ? null : r.data;
    }
  };
}
bl.isEditableType = !0;
function gc(e, t) {
  return t.startsWith("+") || t.startsWith("-") ? e = e.utcOffset(t, !1) : e = e.tz(t), e;
}
function wl(e, t, n, r, i, o, s) {
  const a = _i(
    // Default parameters:
    {
      format: n,
      step: r,
      timezone: s
    },
    // User parameters:
    t.columnTypeOptions
  );
  let l;
  if (st(a.timezone))
    try {
      l = gc(Ql(), a.timezone)?.utcOffset() || void 0;
    } catch {
    }
  let u;
  st(a.min_value) && (u = Zo(a.min_value) || void 0);
  let c;
  st(a.max_value) && (c = Zo(a.max_value) || void 0);
  const f = {
    kind: Z.Custom,
    allowOverlay: !0,
    copyData: "",
    readonly: !t.isEditable,
    contentAlign: t.contentAlignment,
    // The text in pinned columns should be faded.
    style: t.isPinned ? "faded" : "normal",
    data: {
      kind: "date-picker-cell",
      date: void 0,
      displayDate: "",
      step: a.step?.toString() || "1",
      format: i,
      min: u,
      max: c
    }
  }, g = (h) => {
    const p = Zo(h);
    return p === null ? !t.isRequired : !(p === void 0 || st(u) && // We compare on a string level so that it also works correctly for time and date values
    o(p) < o(u) || st(c) && o(p) > o(c));
  };
  return {
    ...t,
    kind: e,
    typeIcon: e === "date" ? ":material/calendar_month:" : e === "time" ? ":material/access_time:" : ":material/calendar_today:",
    sortMode: "default",
    validateInput: g,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(h, p) {
      if (p === !0) {
        const C = g(h);
        if (C === !1)
          return Dt(lt(h), "Invalid input.");
        C instanceof Date && (h = C);
      }
      const m = Zo(h);
      let w = "", b = "", v = l;
      if (m === void 0)
        return Dt(lt(h), "The value cannot be interpreted as a datetime object.");
      if (m !== null) {
        let C = Ql.utc(m);
        if (!C.isValid())
          return Dt(
            lt(m),
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            `Invalid moment date. This should never happen. Please report this bug. 
Error: ${C.toString()}`
          );
        if (a.timezone) {
          try {
            C = gc(C, a.timezone);
          } catch (I) {
            return Dt(
              C.toISOString(),
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              `Failed to adjust to the provided timezone: ${a.timezone}. 
Error: ${I}`
            );
          }
          v = C.utcOffset();
        }
        try {
          b = hc(C, a.format || n, e);
        } catch (I) {
          return Dt(
            C.toISOString(),
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Failed to format the date for rendering with: ${a.format}. 
Error: ${I}`
          );
        }
        w = hc(C, n, e);
      }
      return {
        ...f,
        copyData: w,
        isMissingValue: Pe(m),
        data: {
          ...f.data,
          date: m,
          displayDate: b,
          timezoneOffset: v
        }
      };
    },
    getCellValue(h) {
      return Pe(h?.data?.date) ? null : o(h.data.date);
    }
  };
}
function yl(e) {
  let t = "YYYY-MM-DD HH:mm:ss";
  e.columnTypeOptions?.step >= 60 ? t = "YYYY-MM-DD HH:mm" : e.columnTypeOptions?.step < 1 && (t = "YYYY-MM-DD HH:mm:ss.SSS");
  const n = gg(e.arrowType), r = st(n) || // Timezone can also be configure by the user:
  st(e?.columnTypeOptions?.timezone);
  return wl("datetime", e, r ? t + "Z" : t, 1, "datetime-local", (i) => r ? i.toISOString() : i.toISOString().replace("Z", ""), n);
}
yl.isEditableType = !0;
function Cl(e) {
  let t = "HH:mm:ss";
  return e.columnTypeOptions?.step >= 60 ? t = "HH:mm" : e.columnTypeOptions?.step < 1 && (t = "HH:mm:ss.SSS"), wl("time", e, t, 1, "time", (n) => n.toISOString().split("T")[1].replace("Z", ""));
}
Cl.isEditableType = !0;
function Sl(e) {
  return wl("date", e, "YYYY-MM-DD", 1, "date", (t) => t.toISOString().split("T")[0]);
}
Sl.isEditableType = !0;
function Rf(e) {
  const t = {
    kind: Z.Image,
    data: [],
    displayData: [],
    readonly: !0,
    allowOverlay: !0,
    contentAlign: e.contentAlignment || "center",
    style: "normal"
  };
  return {
    ...e,
    kind: "image",
    typeIcon: ":material/image:",
    sortMode: "default",
    isEditable: !1,
    // Image columns are always read-only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(n) {
      const r = st(n) ? [lt(n)] : [];
      return {
        ...t,
        data: r,
        isMissingValue: !st(n),
        displayData: r
      };
    },
    getCellValue(n) {
      return n.data === void 0 || n.data.length === 0 ? null : n.data[0];
    }
  };
}
Rf.isEditableType = !1;
function Ef(e) {
  const t = {
    kind: Z.Custom,
    allowOverlay: !0,
    contentAlign: e.contentAlignment,
    readonly: !0,
    // The text in pinned columns should be faded.
    style: e.isPinned ? "faded" : "normal",
    copyData: "",
    data: {
      kind: "json-cell",
      value: ""
    }
  };
  return {
    ...e,
    kind: "json",
    typeIcon: ":material/code_blocks:",
    sortMode: "default",
    isEditable: !1,
    // Json columns are read-only.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(n) {
      try {
        const r = st(n) ? yo(ba(n)) : "";
        return {
          ...t,
          copyData: r,
          isMissingValue: Pe(n),
          data: {
            ...t.data,
            value: n,
            displayValue: r
          }
        };
      } catch (r) {
        return Dt(
          lt(n),
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `The value cannot be interpreted as a JSON string. Error: ${r}`
        );
      }
    },
    getCellValue(n) {
      return n.data?.value ?? null;
    }
  };
}
Ef.isEditableType = !1;
function If(e) {
  const t = e.columnTypeOptions || {};
  let n;
  if (t.validate)
    try {
      n = new RegExp(t.validate, "us");
    } catch (l) {
      n = `Invalid validate regex: ${t.validate}.
Error: ${l}`;
    }
  let r = !1, i = t.display_text, o;
  if (!Pe(i)) {
    if (i.startsWith(":material/") && pg(i))
      i = mg(i).icon, r = !0;
    else if (i.includes("(") && i.includes(")"))
      try {
        o = new RegExp(i, "us");
      } catch {
        o = void 0;
      }
  }
  const s = {
    kind: Z.Uri,
    readonly: !e.isEditable,
    allowOverlay: !r,
    contentAlign: e.contentAlignment ?? (r ? "center" : void 0),
    style: "normal",
    hoverEffect: !0,
    data: "",
    displayData: "",
    copyData: "",
    ...r && {
      themeOverride: {
        // Configure icon font and reset link color to default text color:
        fontFamily: vg.iconFont,
        linkColor: void 0
      }
    }
  }, a = (l) => {
    if (Pe(l))
      return !e.isRequired;
    const u = lt(l);
    return !(t.max_chars && u.length > t.max_chars || n instanceof RegExp && n.test(u) === !1);
  };
  return {
    ...e,
    kind: "link",
    typeIcon: ":material/link:",
    sortMode: "default",
    validateInput: a,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(l, u) {
      if (Pe(l))
        return {
          ...s,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
          data: null,
          isMissingValue: !0,
          onClickUri: () => {
          },
          themeOverride: void 0
        };
      const c = l;
      if (typeof n == "string")
        return Dt(lt(c), n);
      if (u && a(c) === !1)
        return Dt(lt(c), "Invalid input.");
      let f = "";
      return c && (o !== void 0 ? f = m1(o, c) : f = i || c), {
        ...s,
        data: c,
        displayData: f,
        isMissingValue: Pe(c),
        onClickUri: (g) => {
          window.open(c.startsWith("www.") ? `https://${c}` : c, "_blank", "noopener,noreferrer"), g.preventDefault();
        },
        copyData: c
      };
    },
    getCellValue(l) {
      return Pe(l.data) ? null : l.data;
    }
  };
}
If.isEditableType = !0;
function xl(e) {
  const t = {
    kind: Z.Custom,
    readonly: !e.isEditable,
    allowOverlay: !0,
    contentAlign: e.contentAlignment,
    style: "normal",
    copyData: "",
    data: {
      // We are reusing the multi-select cell type for list columns:
      kind: "multi-select-cell",
      values: [],
      // List column don't have options, and allow creation & duplication.
      options: void 0,
      allowCreation: !0,
      allowDuplicates: !0
    }
  };
  return {
    ...e,
    kind: "list",
    sortMode: "default",
    typeIcon: ":material/list:",
    getCell(n) {
      if (Pe(n))
        return {
          ...t,
          data: {
            ...t.data,
            values: null
          },
          // @ts-expect-error - isMissingValue is not a valid property of MultiSelectCellType
          // but needed to activate the missing cell handling.
          isMissingValue: !0,
          copyData: ""
        };
      const r = pl(n);
      return {
        ...t,
        data: {
          ...t.data,
          values: r
        },
        copyData: wf(r),
        ...e.isEditable && !vf(n) && {
          readonly: !0,
          isError: !0,
          errorDetails: "Editing of arrays with non-string values is not supported. Please disable editing or convert all values to strings."
        }
      };
    },
    getCellValue(n) {
      return Pe(n.data?.values) ? null : n.data.values;
    }
  };
}
xl.isEditableType = !0;
const x1 = (e) => {
  const t = wg(e);
  return new Map(Object.entries({
    red: t.redbg,
    blue: t.bluebg,
    green: t.greenbg,
    yellow: t.yellowbg,
    violet: t.violetbg,
    purple: t.purplebg,
    orange: t.orangebg,
    gray: t.graybg,
    grey: t.graybg,
    primary: t.primarybg
  }));
}, k1 = (e, t) => {
  if (Pe(e))
    return [];
  const n = x1(t);
  return e.filter((r) => r !== null && r !== "").map((r) => {
    if (typeof r == "string")
      return {
        value: lt(r).trim(),
        label: void 0,
        color: void 0
      };
    const i = r.color ? bg(n.get(r.color) ?? r.color, t.colors.bgColor) : void 0;
    return {
      value: lt(r.value).trim(),
      label: r.label ?? void 0,
      color: i
    };
  });
};
function Tf(e, t) {
  const n = _i(
    // Default parameters:
    {
      options: [],
      accept_new_options: !1
    },
    // User parameters:
    e.columnTypeOptions
  ), r = k1(n.options, t), i = new Set(r.map((s) => s.value)), o = {
    kind: Z.Custom,
    readonly: !e.isEditable,
    allowOverlay: !0,
    contentAlign: e.contentAlignment,
    style: e.isIndex ? "faded" : "normal",
    data: {
      kind: "multi-select-cell",
      values: [],
      options: r,
      allowCreation: n.accept_new_options ?? !1,
      allowDuplicates: !1
    },
    copyData: ""
  };
  return {
    ...e,
    kind: "multiselect",
    sortMode: "default",
    typeIcon: ":material/checklist:",
    getCell(s, a) {
      if (Pe(s))
        return {
          ...o,
          data: {
            ...o.data,
            values: null
          },
          // @ts-expect-error - isMissingValue is not a valid property of MultiSelectCellType
          // but needed to activate the missing cell handling.
          isMissingValue: !0,
          copyData: ""
        };
      let l = pl(s);
      return l = l.map((u) => lt(u).trim()), a && l.length > 0 && n.accept_new_options === !1 && (l = l.filter((u) => i.has(u)), l.length === 0) ? Dt(lt(s), "The values could not be matched with the configured options.") : {
        ...o,
        data: {
          ...o.data,
          values: l
        },
        copyData: wf(l),
        ...e.isEditable && !vf(s) && {
          readonly: !0,
          isError: !0,
          errorDetails: "Editing of arrays with non-string values is not supported. Please disable editing or convert all values to strings."
        }
      };
    },
    getCellValue(s) {
      return Pe(s.data?.values) ? null : s.data.values;
    }
  };
}
Tf.isEditableType = !0;
function kl(e) {
  const t = _i(
    // Default parameters:
    {
      // Set step to 1 for integer types
      step: od(e.arrowType) ? 1 : void 0,
      // if uint (unsigned int), only positive numbers are allowed
      min_value: yg(e.arrowType) ? 0 : void 0
    },
    // User parameters:
    e.columnTypeOptions
  ), n = !t.format && (Cg(e.arrowType) || Sg(e.arrowType)), r = Pe(t.min_value) || t.min_value < 0, i = st(t.step) && !Number.isNaN(t.step) ? yf(t.step) : void 0, o = {
    kind: Z.Number,
    data: void 0,
    displayData: "",
    readonly: !e.isEditable,
    allowOverlay: !0,
    contentAlign: e.contentAlignment || n ? "left" : "right",
    // The text in pinned columns should be faded.
    style: e.isPinned ? "faded" : "normal",
    allowNegative: r,
    fixedDecimals: i,
    // We don't want to show any thousand separators
    // in the cell overlay/editor:
    thousandSeparator: ""
  }, s = (a) => {
    let l = wo(a);
    if (Pe(l))
      return !e.isRequired;
    if (Number.isNaN(l))
      return !1;
    let u = !1;
    return st(t.max_value) && l > t.max_value && (l = t.max_value, u = !0), st(t.min_value) && l < t.min_value ? !1 : u ? l : !0;
  };
  return {
    ...e,
    kind: "number",
    sortMode: "smart",
    typeIcon: ":material/tag:",
    validateInput: s,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(a, l) {
      if (l === !0) {
        const f = s(a);
        if (f === !1)
          return Dt(lt(a), "Invalid input.");
        typeof f == "number" && (a = f);
      }
      let u = wo(a), c = "";
      if (st(u)) {
        if (Number.isNaN(u))
          return Dt(lt(a), "The value cannot be interpreted as a number.");
        if (st(i) && (u = g1(u, i)), Number.isInteger(u) && !Number.isSafeInteger(u))
          return Dt(lt(a), "The value is larger than the maximum supported integer values in number columns (2^53).");
        try {
          n ? c = Fs(u, e.arrowType) : c = wa(u, t.format, i);
        } catch (f) {
          return Dt(lt(u), st(t.format) ? (
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Failed to format the number based on the provided format configuration: (${t.format}). Error: ${f}`
          ) : (
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Failed to format the number. Error: ${f}`
          ));
        }
      }
      return {
        ...o,
        data: u,
        displayData: c,
        isMissingValue: Pe(u),
        // We want to enforce the raw number without formatting when its copied:
        copyData: Pe(u) ? "" : lt(u)
      };
    },
    getCellValue(a) {
      return a.data === void 0 ? null : a.data;
    }
  };
}
kl.isEditableType = !0;
function Co(e) {
  const t = {
    kind: Z.Text,
    data: "",
    displayData: "",
    allowOverlay: !0,
    contentAlign: e.contentAlignment,
    allowWrapping: e.isWrappingAllowed,
    readonly: !0,
    // The text in pinned columns should be faded.
    style: e.isPinned ? "faded" : "normal"
  };
  return {
    ...e,
    kind: "object",
    sortMode: "default",
    typeIcon: ":material/data_object:",
    isEditable: !1,
    // Object columns are read-only.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(n) {
      try {
        const r = st(n) ? lt(n) : null, i = st(r) ? yo(r) : "";
        return {
          ...t,
          data: r,
          displayData: i,
          isMissingValue: Pe(n)
        };
      } catch (r) {
        return Dt(
          lt(n),
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `The value cannot be interpreted as a string. Error: ${r}`
        );
      }
    },
    getCellValue(n) {
      return n.data === void 0 ? null : n.data;
    }
  };
}
Co.isEditableType = !1;
function Df(e) {
  const t = od(e.arrowType), n = _i(
    // Default parameters:
    {
      min_value: 0,
      max_value: t ? 100 : 1,
      format: t ? "%3d%%" : "percent",
      step: t ? 1 : void 0
    },
    // User parameters:
    e.columnTypeOptions
  ), r = Pe(n.step) || Number.isNaN(n.step) ? void 0 : yf(n.step);
  let i;
  try {
    i = wa(n.max_value, n.format, r);
  } catch {
    i = lt(n.max_value);
  }
  const o = {
    kind: Z.Custom,
    allowOverlay: !1,
    copyData: "",
    contentAlign: e.contentAlignment,
    readonly: !0,
    data: {
      kind: "range-cell",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      min: n.min_value,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      max: n.max_value,
      step: n.step ?? 0.01,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: n.min_value,
      label: String(n.min_value),
      measureLabel: i
    }
  };
  return {
    ...e,
    kind: "progress",
    sortMode: "smart",
    typeIcon: ":material/commit:",
    isEditable: !1,
    // Progress column is always readonly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(s) {
      if (Pe(s))
        return js();
      if (Pe(n.min_value) || Pe(n.max_value) || Number.isNaN(n.min_value) || Number.isNaN(n.max_value) || n.min_value >= n.max_value)
        return Dt("Invalid min/max parameters", `The min_value (${n.min_value}) and max_value (${n.max_value}) parameters must be valid numbers.`);
      if (st(n.step) && Number.isNaN(n.step))
        return Dt("Invalid step parameter", `The step parameter (${n.step}) must be a valid number.`);
      const a = wo(s);
      if (Number.isNaN(a) || Pe(a))
        return Dt(lt(s), "The value cannot be interpreted as a number.");
      if (Number.isInteger(a) && !Number.isSafeInteger(a))
        return Dt(lt(s), "The value is larger than the maximum supported integer values in number columns (2^53).");
      let l = "";
      try {
        l = wa(a, n.format, r);
      } catch (c) {
        return Dt(lt(a), st(n.format) ? (
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Failed to format the number based on the provided format configuration: (${n.format}). Error: ${c}`
        ) : (
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Failed to format the number. Error: ${c}`
        ));
      }
      const u = Math.min(n.max_value, Math.max(n.min_value, a));
      return {
        ...o,
        isMissingValue: Pe(s),
        copyData: String(a),
        // Column sorting is done via the copyData value
        data: {
          ...o.data,
          value: u,
          label: l,
          measureLabel: l.length > i.length ? (
            // Use displayData if it's longer than measureLabel to determine
            // the width of the progress bar label.
            l
          ) : i
        }
      };
    },
    getCellValue(s) {
      return s.kind === Z.Loading || s.data?.value === void 0 ? null : s.data?.value;
    }
  };
}
Df.isEditableType = !1;
const M1 = (e) => Pe(e) ? [] : e.filter((t) => st(t) && t !== "").map((t) => {
  if (typeof t == "object" && "value" in t) {
    const r = lt(t.value).trim();
    return {
      value: r,
      label: t.label ?? r
    };
  }
  const n = lt(t).trim();
  return {
    value: n,
    label: n
  };
});
function Ml(e) {
  let t = "string";
  const n = _i(
    // Default parameters:
    {
      options: ad(e.arrowType) ? [!0, !1] : e.arrowType.categoricalOptions ?? []
    },
    // User parameters:
    e.columnTypeOptions
  ), r = (l) => typeof l == "object" && l !== null && "value" in l, i = (l) => r(l) ? typeof l.value : typeof l, o = new Set(n.options.map(i));
  o.size === 1 && (o.has("number") || o.has("bigint") ? t = "number" : o.has("boolean") && (t = "boolean"));
  const s = M1(n.options), a = {
    kind: Z.Custom,
    allowOverlay: !0,
    copyData: "",
    contentAlign: e.contentAlignment,
    readonly: !e.isEditable,
    // The text in pinned columns should be faded.
    style: e.isPinned ? "faded" : "normal",
    data: {
      kind: "dropdown-cell",
      allowedValues: [
        // Add empty option if the column is not configured as required:
        ...e.isRequired !== !0 ? [null] : [],
        ...s
      ],
      value: ""
    }
  };
  return {
    ...e,
    kind: "selectbox",
    sortMode: "default",
    typeIcon: ":material/arrow_drop_down_circle:",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(l, u) {
      let c = null;
      return st(l) && l !== "" && (c = lt(l)), u && !a.data.allowedValues.some((g) => g === null ? c === null : typeof g == "string" ? g === c : typeof g == "object" && "value" in g ? g.value === c : !1) ? Dt(lt(c), "The value is not part of the allowed options.") : {
        ...a,
        isMissingValue: c === null,
        copyData: c || "",
        // Column sorting is done via the copyData value
        data: {
          ...a.data,
          value: c
        }
      };
    },
    getCellValue(l) {
      return Pe(l.data?.value) || l.data?.value === "" ? null : t === "number" ? wo(l.data?.value) ?? null : t === "boolean" ? bf(l.data?.value) ?? null : l.data?.value;
    }
  };
}
Ml.isEditableType = !0;
function Rl(e) {
  const t = e.columnTypeOptions || {};
  let n;
  if (t.validate)
    try {
      n = new RegExp(t.validate, "us");
    } catch (o) {
      n = `Invalid validate regex: ${t.validate}.
Error: ${o}`;
    }
  const r = {
    kind: Z.Text,
    data: "",
    displayData: "",
    allowOverlay: !0,
    contentAlign: e.contentAlignment,
    allowWrapping: e.isWrappingAllowed,
    readonly: !e.isEditable,
    // The text in pinned columns should be faded.
    style: e.isPinned ? "faded" : "normal"
  }, i = (o) => {
    if (Pe(o))
      return !e.isRequired;
    let s = lt(o), a = !1;
    return t.max_chars && s.length > t.max_chars && (s = s.slice(0, t.max_chars), a = !0), n instanceof RegExp && n.test(s) === !1 ? !1 : a ? s : !0;
  };
  return {
    ...e,
    kind: "text",
    sortMode: "default",
    typeIcon: ":material/notes:",
    validateInput: i,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    getCell(o, s) {
      if (typeof n == "string")
        return Dt(lt(o), n);
      if (s) {
        const a = i(o);
        if (a === !1)
          return Dt(lt(o), "Invalid input.");
        typeof a == "string" && (o = a);
      }
      try {
        const a = st(o) ? lt(o) : null, l = st(a) ? yo(a) : "";
        return {
          ...r,
          isMissingValue: Pe(a),
          data: a,
          displayData: l
        };
      } catch (a) {
        return Dt(
          "Incompatible value",
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `The value cannot be interpreted as string. Error: ${a}`
        );
      }
    },
    getCellValue(o) {
      return o.data === void 0 ? null : o.data;
    }
  };
}
Rl.isEditableType = !0;
const pc = /* @__PURE__ */ tr("img", {
  target: "e24uaba0"
})({
  name: "6eya2z",
  styles: "max-width:100%;max-height:37.5rem;object-fit:scale-down"
}), R1 = ({
  urls: e
}) => {
  const t = e && e.length > 0 ? e[0] : "";
  return t.startsWith("http") ? /* @__PURE__ */ me.jsx("a", { href: t, target: "_blank", rel: "noreferrer noopener", children: /* @__PURE__ */ me.jsx(pc, { src: t }) }) : /* @__PURE__ */ me.jsx(pc, { src: t });
}, mc = new Map(Object.entries({
  object: Co,
  text: Rl,
  checkbox: bl,
  selectbox: Ml,
  list: xl,
  multiselect: Tf,
  number: kl,
  link: If,
  datetime: yl,
  date: Sl,
  time: Cl,
  line_chart: xf,
  bar_chart: kf,
  area_chart: Mf,
  image: Rf,
  progress: Df,
  json: Ef
})), E1 = [y1];
var I1 = sd();
const T1 = /* @__PURE__ */ vr(I1);
var xs, vc;
function D1() {
  if (vc) return xs;
  vc = 1;
  var e = xg(), t = kg(), n = Mg(), r = sd(), i = Rg(), o = Eg(), s = Ig(), a = Tg(), l = "[object Map]", u = "[object Set]", c = Object.prototype, f = c.hasOwnProperty;
  function g(h) {
    if (h == null)
      return !0;
    if (i(h) && (r(h) || typeof h == "string" || typeof h.splice == "function" || o(h) || a(h) || n(h)))
      return !h.length;
    var p = t(h);
    if (p == l || p == u)
      return !h.size;
    if (s(h))
      return !e(h).length;
    for (var m in h)
      if (f.call(h, m))
        return !1;
    return !0;
  }
  return xs = g, xs;
}
var O1 = D1();
const P1 = /* @__PURE__ */ vr(O1);
function ks(e, t, n) {
  if (!n.includes(t))
    return;
  const r = new RegExp(`${e}[,\\s].*{(?:[^}]*[\\s;]{1})?${t}:\\s*([^;}]+)[;]?.*}`, "gm");
  n = n.replace(/{/g, " {");
  const i = r.exec(n);
  if (i)
    return i[1].trim();
}
function L1(e, t, n) {
  const r = {};
  if (!n.includes(t))
    return e;
  const i = ks(t, "color", n);
  i && (r.textDark = i, (e.kind === Z.Bubble || e.kind === Z.Custom && e.data?.kind === "multi-select-cell") && (r.textBubble = i), e.kind === Z.Uri && (r.linkColor = i));
  const o = ks(t, "background-color", n);
  o && (r.bgCell = o), o === "yellow" && i === void 0 && (r.textDark = "#31333F");
  const s = ks(t, "font-weight", n);
  return s && (r.baseFontStyle = `${s} ${Ug.sm}`), r ? {
    ...e,
    themeOverride: r
  } : e;
}
function F1(e) {
  return _g(e) || Ag(e) ? Rl : Hg(e) ? yl : ld(e) ? Cl : zg(e) ? Sl : Vg(e) || $g(e) ? Co : ad(e) ? bl : Ng(e) ? kl : Bg(e) ? Ml : Wg(e) ? xl : Co;
}
function Of(e) {
  const t = e.length > 0 ? e[e.length - 1] : "", n = e.length > 1 ? e.slice(0, -1).filter((r) => r !== "").join(" / ") : void 0;
  return {
    title: t,
    group: n
  };
}
function El(e) {
  return {
    group: void 0,
    isEditable: !1,
    isIndex: !1,
    isPinned: !1,
    isHidden: !1,
    isStretched: !1,
    ...e
  };
}
function _1(e, t) {
  const n = e.columnNames.map((a) => a[t]), {
    title: r,
    group: i
  } = Of(n), o = e.columnTypes[t];
  let s = !0;
  return Fg(o) && (s = !1), El({
    id: `_index-${t}`,
    indexNumber: t,
    name: r,
    title: r,
    group: i,
    isEditable: s,
    arrowType: o,
    isIndex: !0,
    isPinned: !0
  });
}
function A1(e, t) {
  const n = e.columnNames.map((s) => s[t]), {
    title: r,
    group: i
  } = Of(n), o = e.columnTypes[t];
  return El({
    id: `_column-${r}-${t}`,
    indexNumber: t,
    name: r,
    isEditable: !0,
    title: r,
    arrowType: o,
    group: i
  });
}
function Pf() {
  return El({
    id: "_empty-index",
    indexNumber: 0,
    title: "",
    name: "",
    isEditable: !1,
    isIndex: !0,
    isPinned: !0,
    arrowType: {
      type: jg.INDEX,
      arrowField: new Dg("", new Og(), !0),
      pandasType: void 0
    }
  });
}
function bc(e) {
  const t = [], {
    dimensions: n
  } = e, r = n.numIndexColumns, i = n.numDataColumns;
  if (r === 0 && i === 0)
    return t.push(Pf()), t;
  for (let o = 0; o < r; o++)
    t.push(_1(e, o));
  for (let o = 0; o < i; o++)
    t.push(A1(e, o + r));
  return t;
}
function H1(e, t, n, r = void 0) {
  let i;
  if (e.kind === "object" || e.kind === "json")
    i = e.getCell(st(t.content) ? yo(Fs(t.content, t.contentType)) : null);
  else if (["time", "date", "datetime"].includes(e.kind) && st(t.content) && (typeof t.content == "number" || typeof t.content == "bigint")) {
    let o;
    ld(t.contentType) && st(t.field?.type?.unit) ? o = Pg(t.content, t.field) : o = Xr.utc(Number(t.content)).toDate(), i = e.getCell(o);
  } else if (Lg(t.contentType)) {
    const o = Pe(t.content) ? null : Fs(t.content, t.contentType);
    i = e.getCell(o);
  } else
    i = e.getCell(t.content);
  if (Pi(i))
    return i;
  if (!e.isEditable) {
    if (n && st(n?.displayContent)) {
      const o = yo(n.displayContent);
      i.kind === Z.Text ? i = {
        ...i,
        displayData: o
      } : i.kind === Z.Number && // Only apply styler value if format was not explicitly set by the user.
      Pe(e.columnTypeOptions?.format) ? i = {
        ...i,
        displayData: o
      } : i.kind === Z.Uri && // Only apply styler value if display text was not explicitly set by the user.
      Pe(e.columnTypeOptions?.display_text) ? i = {
        ...i,
        displayData: o
      } : i.kind === Z.Custom && i.data?.kind === "date-picker-cell" && // Only apply styler value if format was not explicitly set by the user.
      Pe(e.columnTypeOptions?.format) && (i = {
        ...i,
        data: {
          ...i.data,
          displayDate: o
        }
      });
    }
    r && n?.cssId && (i = L1(i, n.cssId, r));
  }
  return i;
}
function Lf(e, t) {
  return t ? t?.useStretch ?? !1 : e.useContainerWidth ?? !1;
}
function Ff(e, t) {
  return t ? t.pixelWidth ? t.pixelWidth : void 0 : e.width || void 0;
}
function z1(e) {
  return e?.useContent ?? !1;
}
function V1(e, t) {
  return t ? t.pixelHeight ? t.pixelHeight : void 0 : e.height || void 0;
}
const sa = "_index", wc = "_pos:", yc = {
  small: 75,
  medium: 200,
  large: 400
}, _f = Js.getLogger("useColumnLoader");
function $1(e) {
  if (!Pe(e)) {
    if (typeof e == "number")
      return e;
    if (e in yc)
      return yc[e];
  }
}
const Jo = (e, t) => qg(e, t, (r, i) => {
  if (T1(i))
    return i;
});
function Cc(e, t) {
  if (!t)
    return e;
  let n = {};
  return e.isIndex && t.has(sa) && (n = Jo(n, t.get(sa) ?? {})), t.has(`${wc}${e.indexNumber}`) && (n = Jo(n, t.get(`${wc}${e.indexNumber}`) ?? {})), t.has(e.name) && e.name !== sa && (n = Jo(n, t.get(e.name) ?? {})), t.has(e.id) && (n = Jo(n, t.get(e.id) ?? {})), P1(n) ? e : id({
    ...e
  }, {
    title: n.label,
    width: $1(n.width),
    isEditable: st(n.disabled) ? !n.disabled : void 0,
    isHidden: n.hidden,
    isPinned: n.pinned,
    isRequired: n.required,
    columnTypeOptions: n.type_config,
    contentAlignment: n.alignment,
    defaultValue: n.default,
    help: n.help
  });
}
function N1(e) {
  if (!e)
    return /* @__PURE__ */ new Map();
  try {
    return new Map(Object.entries(JSON.parse(e)));
  } catch (t) {
    return _f.error(t), /* @__PURE__ */ new Map();
  }
}
function Sc(e) {
  const t = e.columnTypeOptions?.type;
  let n;
  return st(t) && (mc.has(t) ? n = mc.get(t) : _f.warn(`Unknown column type configured in column configuration: ${t}`)), Pe(n) && (n = F1(e.arrowType)), n;
}
function B1(e, t, n, r, i) {
  const o = Qr(), s = d.useMemo(() => N1(e.columns), [e.columns]), [a, l] = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    d.useState(s)
  );
  d.useEffect(() => {
    l(s);
  }, [s]);
  const u = d.useMemo(() => Lf(e, i), [e, i]), c = d.useMemo(() => Ff(e, i), [e, i]), f = u || st(c) && c > 0, g = st(e.rowHeight) && e.rowHeight > an("4rem"), h = d.useMemo(() => bc(t).map((m) => {
    let w = {
      ...m,
      ...Cc(m, a),
      isStretched: f
    };
    const b = Sc(w);
    return (e.editingMode === sn.EditingMode.READ_ONLY || n || b.isEditableType === !1) && (w = {
      ...w,
      isEditable: !1
    }), e.editingMode !== sn.EditingMode.READ_ONLY && w.isEditable == !0 && (w = {
      ...w,
      icon: "editable"
    }, w.isRequired && e.editingMode === sn.EditingMode.DYNAMIC && (w = {
      ...w,
      isHidden: !1
    })), b(w, o);
  }), [t, a, f, e.editingMode, n, o]);
  return {
    columns: d.useMemo(() => {
      const m = bc(t).map((C) => {
        let I = {
          ...C,
          ...Cc(C, a),
          isStretched: f,
          isWrappingAllowed: g
        };
        const E = Sc(I);
        return (e.editingMode === sn.EditingMode.READ_ONLY || n || E.isEditableType === !1) && (I = {
          ...I,
          isEditable: !1
        }), e.editingMode !== sn.EditingMode.READ_ONLY && I.isEditable == !0 && (I = {
          ...I,
          icon: "editable"
        }, I.isRequired && e.editingMode === sn.EditingMode.DYNAMIC && (I = {
          ...I,
          isHidden: !1
        })), E(I, o);
      }).filter((C) => !C.isHidden), w = [], b = [];
      r?.length ? (m.forEach((C) => {
        C.isIndex && !r.includes(C.name) && !r.includes(C.id) && // Don't add the index column if it is explicitly not pinned
        C.isPinned !== !1 && w.push(C);
      }), r.forEach((C) => {
        const I = m.find((E) => E.name === C || E.id === C);
        I && (I.isPinned ? w.push(I) : b.push(I));
      })) : m.forEach((C) => {
        C.isPinned ? w.push(C) : b.push(C);
      });
      const v = [...w, ...b];
      return v.length > 0 ? v : [Co(Pf())];
    }, [t, a, g, f, n, e.editingMode, r, o]),
    allColumns: h,
    setColumnConfigMapping: l
  };
}
function Kr(e) {
  return e.isIndex ? sa : Pe(e.name) ? "" : e.name;
}
class Qo {
  constructor(t) {
    this.editedCells = /* @__PURE__ */ new Map(), this.addedRows = [], this.deletedRows = [], this.numRows = 0, this.numRows = t;
  }
  /**
   * Convert the current editing state to a JSON string.
   *
   * @param columns - The columns of the table
   * @returns JSON string
   */
  toJson(t) {
    const n = /* @__PURE__ */ new Map();
    t.forEach((o) => {
      n.set(o.indexNumber, o);
    });
    const r = {
      // We use snake case here since this is the widget state
      // that is sent and used in the backend. Therefore, it should
      // conform with the Python naming conventions.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
      edited_rows: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
      added_rows: [],
      deleted_rows: []
    };
    return this.editedCells.forEach((o, s, a) => {
      const l = {};
      o.forEach((u, c) => {
        const f = n.get(c);
        f && (l[Kr(f)] = f.getCellValue(u));
      }), r.edited_rows[s] = l;
    }), this.addedRows.forEach((o) => {
      const s = {};
      let a = !1;
      o.forEach((l, u, c) => {
        const f = n.get(u);
        if (f) {
          const g = f.getCellValue(l);
          f.isRequired && f.isEditable && gl(l) && (a = !0), st(g) && (s[Kr(f)] = g);
        }
      }), a || r.added_rows.push(s);
    }), r.deleted_rows = this.deletedRows, JSON.stringify(r, (o, s) => s === void 0 ? null : s);
  }
  /**
   * Load the editing state from a JSON string.
   *
   * @param columns - The columns of the table
   * @returns JSON string
   */
  fromJson(t, n) {
    this.editedCells = /* @__PURE__ */ new Map(), this.addedRows = [], this.deletedRows = [];
    const r = JSON.parse(t), i = /* @__PURE__ */ new Map();
    n.forEach((s) => {
      i.set(s.indexNumber, s);
    });
    const o = /* @__PURE__ */ new Map();
    n.forEach((s) => {
      o.set(Kr(s), s);
    }), Object.keys(r.edited_rows).forEach((s) => {
      const a = Number(s), l = r.edited_rows[s];
      Object.keys(l).forEach((u) => {
        const c = l[u], f = o.get(u);
        if (f) {
          const g = f.getCell(c);
          g && (this.editedCells.has(a) || this.editedCells.set(a, /* @__PURE__ */ new Map()), this.editedCells.get(a)?.set(f.indexNumber, g));
        }
      });
    }), r.added_rows.forEach((s) => {
      const a = /* @__PURE__ */ new Map();
      n.forEach((l) => {
        a.set(l.indexNumber, l.getCell(null));
      }), Object.keys(s).forEach((l) => {
        const u = s[l], c = o.get(l);
        if (c) {
          const f = c.getCell(u);
          f && a.set(c.indexNumber, f);
        }
      }), this.addedRows.push(a);
    }), this.deletedRows = r.deleted_rows;
  }
  /**
   * Returns true if the given row was added by the user through the UI.
   */
  isAddedRow(t) {
    return t >= this.numRows;
  }
  /**
   * Returns the cell at the given column and row,
   * in case the cell was edited or added.
   *
   * @param col - The column index
   * @param row - The row index
   *
   * @returns The edited cell at the given column and row
   */
  getCell(t, n) {
    if (this.isAddedRow(n))
      return this.addedRows[n - this.numRows].get(t);
    const r = this.editedCells.get(n);
    if (r !== void 0)
      return r.get(t);
  }
  /**
   * Adds a cell to the editing state for the given column and row index.
   *
   * @param col - The column index
   * @param row - The row index
   * @param cell - The cell to add to the editing state
   */
  setCell(t, n, r) {
    if (this.isAddedRow(n)) {
      if (n - this.numRows >= this.addedRows.length)
        return;
      this.addedRows[n - this.numRows].set(t, r);
    } else
      this.editedCells.get(n) === void 0 && this.editedCells.set(n, /* @__PURE__ */ new Map()), this.editedCells.get(n).set(t, r);
  }
  /**
   * Adds a new row to the editing state.
   *
   * @param rowCells - The cells of the row to add
   */
  addRow(t) {
    this.addedRows.push(t);
  }
  /**
   * Deletes the given rows from the editing state.
   *
   * @param rows - The rows to delete
   */
  deleteRows(t) {
    t.sort((n, r) => r - n).forEach((n) => {
      this.deleteRow(n);
    });
  }
  /**
   * Deletes the given row from the editing state.
   *
   * @param row - The row to delete
   */
  deleteRow(t) {
    if (!(Pe(t) || t < 0)) {
      if (this.isAddedRow(t)) {
        this.addedRows.splice(t - this.numRows, 1);
        return;
      }
      this.deletedRows.includes(t) || (this.deletedRows.push(t), this.deletedRows = this.deletedRows.sort((n, r) => n - r)), this.editedCells.delete(t);
    }
  }
  /**
   * Returns the original row index of the given row.
   * Since the user can delete rows, the original row index and the
   * current one can diverge.
   *
   * @param row - The row index from the current state
   *
   * @returns The original row index
   */
  getOriginalRowIndex(t) {
    let n = t;
    for (let r = 0; r < this.deletedRows.length && !(this.deletedRows[r] > n); r++)
      n += 1;
    return n;
  }
  /**
   * Returns the total number of rows of the current state.
   */
  getNumRows() {
    return this.numRows + this.addedRows.length - this.deletedRows.length;
  }
}
const So = ({
  columnId: e,
  columnConfigMapping: t,
  updatedProps: n
}) => {
  const r = new Map(t), i = r.get(e), o = {
    ...i || {},
    ...n || {}
  };
  return (i?.type_config || n?.type_config) && (o.type_config = {
    ...i?.type_config || {},
    ...n?.type_config || {}
  }), r.set(e, o), r;
};
function W1(e) {
  return {
    changeColumnFormat: d.useCallback((n, r) => {
      e((i) => So({
        columnId: n,
        columnConfigMapping: i,
        updatedProps: {
          type_config: {
            format: r
          }
        }
      }));
    }, [e])
  };
}
function U1(e, t, n, r, i, o) {
  const s = d.useMemo(() => e.filter((c) => c.isPinned).reduce((c, f) => c + (f.width ?? r * 2), 0) > n * 0.6, [e, n, r]), a = t || s ? 0 : e.filter((c) => c.isPinned).length, l = d.useCallback((c) => {
    o((f) => So({
      columnId: c,
      columnConfigMapping: f,
      updatedProps: {
        pinned: !1
      }
    })), i(!0, !1);
  }, [i, o]);
  return {
    pinColumn: d.useCallback((c) => {
      o((f) => So({
        columnId: c,
        columnConfigMapping: f,
        updatedProps: {
          pinned: !0
        }
      })), i(!0, !1);
    }, [i, o]),
    unpinColumn: l,
    freezeColumns: a
  };
}
function j1(e, t, n, r, i) {
  return {
    onColumnMoved: d.useCallback((s, a) => {
      const l = [...e], [u] = l.splice(s, 1);
      l.splice(a, 0, u), a < t && !u.isPinned ? n(u.id) : a >= t && u.isPinned && r(u.id), i(l.map((c) => c.id));
    }, [e, t, n, r, i])
  };
}
function q1(e) {
  const [t, n] = d.useState(() => /* @__PURE__ */ new Map()), r = d.useCallback((o, s, a, l) => {
    o.id && n(new Map(t).set(o.id, l));
  }, [t]);
  return {
    columns: d.useMemo(() => e.map((o) => o.id && t.has(o.id) && t.get(o.id) !== void 0 ? {
      ...o,
      width: t.get(o.id),
      // Deactivate grow whenever a column gets manually resized
      grow: 0
    } : o), [e, t]),
    onColumnResize: r
  };
}
function G1(e) {
  switch (e.kind) {
    case Z.Number:
      return e.data?.toString() ?? "";
    case Z.Boolean:
      return e.data?.toString() ?? "";
    case Z.Markdown:
    case Z.RowID:
    case Z.Text:
    case Z.Uri:
      return e.data ?? "";
    case Z.Bubble:
    case Z.Image:
      return e.data.join("");
    case Z.Drilldown:
      return e.data.map((t) => t.text).join("");
    case Z.Protected:
    case Z.Loading:
      return "";
    case Z.Custom:
      return e.copyData;
  }
}
function xc(e) {
  if (typeof e == "number")
    return e;
  if (e.length > 0) {
    const t = Number(e);
    isNaN(t) || (e = t);
  }
  return e;
}
function Y1(e, t) {
  return e = xc(e), t = xc(t), typeof e == "string" && typeof t == "string" ? e.localeCompare(t) : typeof e == "number" && typeof t == "number" ? e === t ? 0 : e > t ? 1 : -1 : e == t ? 0 : e > t ? 1 : -1;
}
function X1(e, t) {
  return e > t ? 1 : e === t ? 0 : -1;
}
function K1(e) {
  const { sort: t, rows: n, getCellContent: r } = e, i = d.useMemo(() => t === void 0 ? [] : Array.isArray(t) ? t : [t], [t]), o = d.useMemo(() => i.map((u) => {
    const c = e.columns.findIndex((f) => u.column === f || f.id !== void 0 && u.column.id === f.id);
    return c === -1 ? void 0 : c;
  }), [i, e.columns]), s = d.useMemo(() => {
    const u = i.map((f, g) => ({ sort: f, col: o[g] })).filter((f) => f.col !== void 0);
    if (u.length === 0)
      return;
    const c = u.map(() => new Array(n));
    for (let f = 0; f < u.length; f++) {
      const { col: g } = u[f], h = [g, 0];
      for (let p = 0; p < n; p++)
        h[1] = p, c[f][p] = G1(r(h));
    }
    return Dr(n).sort((f, g) => {
      for (let h = 0; h < u.length; h++) {
        const { sort: p } = u[h], m = c[h][f], w = c[h][g];
        let b;
        if (p.mode === "raw" ? b = X1(m, w) : p.mode === "smart" ? b = Y1(m, w) : b = m.localeCompare(w), b !== 0)
          return (p.direction ?? "asc") === "desc" && (b = -b), b;
      }
      return 0;
    });
  }, [r, n, i, o]), a = d.useCallback((u) => s === void 0 ? u : s[u], [s]), l = d.useCallback(([u, c]) => s === void 0 ? r([u, c]) : (c = s[c], r([u, c])), [r, s]);
  return s === void 0 ? { getCellContent: e.getCellContent, getOriginalIndex: a } : {
    getOriginalIndex: a,
    getCellContent: l
  };
}
function Z1(e, t) {
  return t === void 0 ? e : e.map((n) => n.id === t.column.id ? {
    ...n,
    title: t.direction === "asc" ? `↑ ${n.title}` : `↓ ${n.title}`
  } : n);
}
function J1(e, t, n) {
  const [r, i] = d.useState(), {
    getCellContent: o,
    getOriginalIndex: s
  } = K1({
    columns: t.map((u) => qs(u)),
    getCellContent: n,
    rows: e,
    sort: r
  }), a = d.useMemo(() => Z1(t, r), [t, r]), l = d.useCallback((u, c, f) => {
    const g = a[u];
    let h;
    c === "auto" ? (h = "asc", r && r.column.id === g.id && (r.direction === "asc" ? h = "desc" : h = void 0)) : h = c, h === void 0 || f && h === r?.direction ? i(void 0) : i({
      column: qs(g),
      direction: h,
      mode: g.sortMode
    });
  }, [r, a]);
  return {
    columns: a,
    sortColumn: l,
    getOriginalIndex: s,
    getCellContent: o
  };
}
function Q1(e, t) {
  const n = d.useCallback((i) => {
    t((o) => So({
      columnId: i,
      columnConfigMapping: o,
      updatedProps: {
        hidden: !0
      }
    })), e(!0, !1);
  }, [e, t]), r = d.useCallback((i) => {
    t((o) => So({
      columnId: i,
      columnConfigMapping: o,
      updatedProps: {
        hidden: !1
      }
    })), e(!0, !1);
  }, [e, t]);
  return {
    hideColumn: n,
    showColumn: r
  };
}
function ew() {
  return {
    provideEditor: d.useCallback((t) => {
      if (t.kind === Z.Text && t.readonly && f1(t.data))
        return {
          editor: w1
        };
    }, [])
  };
}
const tw = {
  kind: Z.Custom,
  isMatch: (e) => e.data.kind === "sparkline-cell",
  needsHover: !0,
  needsHoverPosition: !0,
  draw: (e, t) => {
    const { ctx: n, theme: r, rect: i, hoverAmount: o, hoverX: s } = e;
    let { values: a, yAxis: l, color: u, graphKind: c = "area", displayValues: f, hideAxis: g } = t.data;
    const [h, p] = l;
    if (a.length === 0)
      return !0;
    a = a.map((R) => Math.min(1, Math.max(0, (R - h) / (p - h))));
    const m = r.cellHorizontalPadding, w = m + i.x, b = i.y + 3, v = i.height - 6, C = i.width - m * 2, I = p - h, E = p <= 0 ? b : h >= 0 ? b + v : b + v * (p / I);
    if (!g && h <= 0 && p >= 0 && (n.beginPath(), n.moveTo(w, E), n.lineTo(w + C, E), n.globalAlpha = 0.4, n.lineWidth = 1, n.strokeStyle = r.textLight, n.stroke(), n.globalAlpha = 1), c === "bar") {
      n.beginPath();
      const R = 2, P = (a.length - 1) * R, x = (C - P) / a.length;
      let S = w;
      for (const F of a) {
        const D = b + v - F * v;
        n.moveTo(S, E), n.lineTo(S + x, E), n.lineTo(S + x, D), n.lineTo(S, D), S += x + R;
      }
      n.fillStyle = t.data.color ?? r.accentColor, n.fill();
    } else {
      a.length === 1 && (a = [a[0], a[0]], f && (f = [f[0], f[0]])), n.beginPath();
      const R = (i.width - 16) / (a.length - 1), P = a.map((S, F) => ({
        x: w + R * F,
        y: b + v - S * v
      }));
      n.moveTo(P[0].x, P[0].y);
      let x = 0;
      if (P.length > 2)
        for (x = 1; x < P.length - 2; x++) {
          const S = (P[x].x + P[x + 1].x) / 2, F = (P[x].y + P[x + 1].y) / 2;
          n.quadraticCurveTo(P[x].x, P[x].y, S, F);
        }
      if (n.quadraticCurveTo(P[x].x, P[x].y, P[x + 1].x, P[x + 1].y), n.strokeStyle = u ?? r.accentColor, n.lineWidth = 1 + o * 0.5, n.stroke(), n.lineTo(i.x + i.width - m, E), n.lineTo(i.x + m, E), n.closePath(), c === "area") {
        n.globalAlpha = 0.2 + 0.2 * o;
        const S = n.createLinearGradient(0, b, 0, b + v * 1.4);
        S.addColorStop(0, u ?? r.accentColor);
        const [F, D, M] = mo(u ?? r.accentColor);
        S.addColorStop(1, `rgba(${F}, ${D}, ${M}, 0)`), n.fillStyle = S, n.fill(), n.globalAlpha = 1;
      }
      if (s !== void 0 && (c === "line" || c === "area") && f !== void 0) {
        n.beginPath();
        const S = Math.min(a.length - 1, Math.max(0, Math.round((s - m) / R)));
        n.moveTo(w + S * R, i.y + 1), n.lineTo(w + S * R, i.y + i.height), n.lineWidth = 1, n.strokeStyle = r.textLight, n.stroke(), n.save(), n.font = `8px ${r.fontFamily}`, n.fillStyle = r.textMedium, n.textBaseline = "top", n.fillText(f[S], w, i.y + r.cellVerticalPadding), n.restore();
      }
    }
    return !0;
  },
  provideEditor: () => {
  },
  onPaste: (e, t) => t
};
function kc(e, t, n, r, i, o) {
  if (!(r <= 0 || i <= 0)) {
    if (typeof o == "number" && o <= 0) {
      e.rect(t, n, r, i);
      return;
    }
    typeof o == "number" && (o = { tl: o, tr: o, br: o, bl: o }), o = {
      tl: Math.min(o.tl, i / 2, r / 2),
      tr: Math.min(o.tr, i / 2, r / 2),
      bl: Math.min(o.bl, i / 2, r / 2),
      br: Math.min(o.br, i / 2, r / 2)
    }, o.tl = Math.max(0, o.tl), o.tr = Math.max(0, o.tr), o.br = Math.max(0, o.br), o.bl = Math.max(0, o.bl), e.moveTo(t + o.tl, n), e.arcTo(t + r, n, t + r, n + o.tr, o.tr), e.arcTo(t + r, n + i, t + r - o.br, n + i, o.br), e.arcTo(t, n + i, t, n + i - o.bl, o.bl), e.arcTo(t, n, t + o.tl, n, o.tl);
  }
}
function Mc(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Fe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Mc(Object(n), !0).forEach(function(r) {
      so(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Mc(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
var nw = ["defaultInputValue", "defaultMenuIsOpen", "defaultValue", "inputValue", "menuIsOpen", "onChange", "onInputChange", "onMenuClose", "onMenuOpen", "value"];
function Af(e) {
  var t = e.defaultInputValue, n = t === void 0 ? "" : t, r = e.defaultMenuIsOpen, i = r === void 0 ? !1 : r, o = e.defaultValue, s = o === void 0 ? null : o, a = e.inputValue, l = e.menuIsOpen, u = e.onChange, c = e.onInputChange, f = e.onMenuClose, g = e.onMenuOpen, h = e.value, p = lr(e, nw), m = d.useState(a !== void 0 ? a : n), w = gr(m, 2), b = w[0], v = w[1], C = d.useState(l !== void 0 ? l : i), I = gr(C, 2), E = I[0], R = I[1], P = d.useState(h !== void 0 ? h : s), x = gr(P, 2), S = x[0], F = x[1], D = d.useCallback(function(Y, ue) {
    typeof u == "function" && u(Y, ue), F(Y);
  }, [u]), M = d.useCallback(function(Y, ue) {
    var ee;
    typeof c == "function" && (ee = c(Y, ue)), v(ee !== void 0 ? ee : Y);
  }, [c]), T = d.useCallback(function() {
    typeof g == "function" && g(), R(!0);
  }, [g]), O = d.useCallback(function() {
    typeof f == "function" && f(), R(!1);
  }, [f]), k = a !== void 0 ? a : b, N = l !== void 0 ? l : E, q = h !== void 0 ? h : S;
  return Fe(Fe({}, p), {}, {
    inputValue: k,
    menuIsOpen: N,
    onChange: D,
    onInputChange: M,
    onMenuClose: O,
    onMenuOpen: T,
    value: q
  });
}
function rw(e) {
  if (e.sheet)
    return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e)
      return document.styleSheets[t];
}
function iw(e) {
  var t = document.createElement("style");
  return t.setAttribute("data-emotion", e.key), e.nonce !== void 0 && t.setAttribute("nonce", e.nonce), t.appendChild(document.createTextNode("")), t.setAttribute("data-s", ""), t;
}
var ow = /* @__PURE__ */ (function() {
  function e(n) {
    var r = this;
    this._insertTag = function(i) {
      var o;
      r.tags.length === 0 ? r.insertionPoint ? o = r.insertionPoint.nextSibling : r.prepend ? o = r.container.firstChild : o = r.before : o = r.tags[r.tags.length - 1].nextSibling, r.container.insertBefore(i, o), r.tags.push(i);
    }, this.isSpeedy = n.speedy === void 0 ? !0 : n.speedy, this.tags = [], this.ctr = 0, this.nonce = n.nonce, this.key = n.key, this.container = n.container, this.prepend = n.prepend, this.insertionPoint = n.insertionPoint, this.before = null;
  }
  var t = e.prototype;
  return t.hydrate = function(r) {
    r.forEach(this._insertTag);
  }, t.insert = function(r) {
    this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(iw(this));
    var i = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var o = rw(i);
      try {
        o.insertRule(r, o.cssRules.length);
      } catch {
      }
    } else
      i.appendChild(document.createTextNode(r));
    this.ctr++;
  }, t.flush = function() {
    this.tags.forEach(function(r) {
      return r.parentNode && r.parentNode.removeChild(r);
    }), this.tags = [], this.ctr = 0;
  }, e;
})(), aw = function(t, n, r) {
  for (var i = 0, o = 0; i = o, o = _s(), i === 38 && o === 12 && (n[r] = 1), !cd(o); )
    ud();
  return ap(t, dd);
}, sw = function(t, n) {
  var r = -1, i = 44;
  do
    switch (cd(i)) {
      case 0:
        i === 38 && _s() === 12 && (n[r] = 1), t[r] += aw(dd - 1, n, r);
        break;
      case 2:
        t[r] += op(i);
        break;
      case 4:
        if (i === 44) {
          t[++r] = _s() === 58 ? "&\f" : "", n[r] = t[r].length;
          break;
        }
      // fallthrough
      default:
        t[r] += ip(i);
    }
  while (i = ud());
  return t;
}, lw = function(t, n) {
  return ep(sw(tp(t), n));
}, Rc = /* @__PURE__ */ new WeakMap(), uw = function(t) {
  if (!(t.type !== "rule" || !t.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  t.length < 1)) {
    for (var n = t.value, r = t.parent, i = t.column === r.column && t.line === r.line; r.type !== "rule"; )
      if (r = r.parent, !r) return;
    if (!(t.props.length === 1 && n.charCodeAt(0) !== 58 && !Rc.get(r)) && !i) {
      Rc.set(t, !0);
      for (var o = [], s = lw(n, o), a = r.props, l = 0, u = 0; l < s.length; l++)
        for (var c = 0; c < a.length; c++, u++)
          t.props[u] = o[l] ? s[l].replace(/&\f/g, a[c]) : a[c] + " " + s[l];
    }
  }
}, cw = function(t) {
  if (t.type === "decl") {
    var n = t.value;
    // charcode for l
    n.charCodeAt(0) === 108 && // charcode for b
    n.charCodeAt(2) === 98 && (t.return = "", t.value = "");
  }
};
function Hf(e, t) {
  switch (np(e, t)) {
    // color-adjust
    case 5103:
      return It + "print-" + e + e;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return It + e + e;
    // appearance, user-select, transform, hyphens, text-size-adjust
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return It + e + ca + e + bn + e + e;
    // flex, flex-direction
    case 6828:
    case 4268:
      return It + e + bn + e + e;
    // order
    case 6165:
      return It + e + bn + "flex-" + e + e;
    // align-items
    case 5187:
      return It + e + Ht(e, /(\w+).+(:[^]+)/, It + "box-$1$2" + bn + "flex-$1$2") + e;
    // align-self
    case 5443:
      return It + e + bn + "flex-item-" + Ht(e, /flex-|-self/, "") + e;
    // align-content
    case 4675:
      return It + e + bn + "flex-line-pack" + Ht(e, /align-content|flex-|-self/, "") + e;
    // flex-shrink
    case 5548:
      return It + e + bn + Ht(e, "shrink", "negative") + e;
    // flex-basis
    case 5292:
      return It + e + bn + Ht(e, "basis", "preferred-size") + e;
    // flex-grow
    case 6060:
      return It + "box-" + Ht(e, "-grow", "") + It + e + bn + Ht(e, "grow", "positive") + e;
    // transition
    case 4554:
      return It + Ht(e, /([^-])(transform)/g, "$1" + It + "$2") + e;
    // cursor
    case 6187:
      return Ht(Ht(Ht(e, /(zoom-|grab)/, It + "$1"), /(image-set)/, It + "$1"), e, "") + e;
    // background, background-image
    case 5495:
    case 3959:
      return Ht(e, /(image-set\([^]*)/, It + "$1$`$1");
    // justify-content
    case 4968:
      return Ht(Ht(e, /(.+:)(flex-)?(.*)/, It + "box-pack:$3" + bn + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + It + e + e;
    // (margin|padding)-inline-(start|end)
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return Ht(e, /(.+)-inline(.+)/, It + "$1$2") + e;
    // (min|max)?(width|height|inline-size|block-size)
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (eu(e) - 1 - t > 6) switch (qr(e, t + 1)) {
        // (m)ax-content, (m)in-content
        case 109:
          if (qr(e, t + 4) !== 45) break;
        // (f)ill-available, (f)it-content
        case 102:
          return Ht(e, /(.+:)(.+)-([^]+)/, "$1" + It + "$2-$3$1" + ca + (qr(e, t + 3) == 108 ? "$3" : "$2-$3")) + e;
        // (s)tretch
        case 115:
          return ~tu(e, "stretch") ? Hf(Ht(e, "stretch", "fill-available"), t) + e : e;
      }
      break;
    // position: sticky
    case 4949:
      if (qr(e, t + 1) !== 115) break;
    // display: (flex|inline-flex)
    case 6444:
      switch (qr(e, eu(e) - 3 - (~tu(e, "!important") && 10))) {
        // stic(k)y
        case 107:
          return Ht(e, ":", ":" + It) + e;
        // (inline-)?fl(e)x
        case 101:
          return Ht(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + It + (qr(e, 14) === 45 ? "inline-" : "") + "box$3$1" + It + "$2$3$1" + bn + "$2box$3") + e;
      }
      break;
    // writing-mode
    case 5936:
      switch (qr(e, t + 11)) {
        // vertical-l(r)
        case 114:
          return It + e + bn + Ht(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        // vertical-r(l)
        case 108:
          return It + e + bn + Ht(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        // horizontal(-)tb
        case 45:
          return It + e + bn + Ht(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return It + e + bn + e + e;
  }
  return e;
}
var dw = function(t, n, r, i) {
  if (t.length > -1 && !t.return)
    switch (t.type) {
      case Qg:
        t.return = Hf(t.value, t.length);
        break;
      case Jg:
        return ra([Gi(t, {
          value: Ht(t.value, "@", "@" + It)
        })], i);
      case Kg:
        if (t.length) return Zg(t.props, function(o) {
          switch (rp(o, /(::plac\w+|:read-\w+)/)) {
            // :read-(only|write)
            case ":read-only":
            case ":read-write":
              return ra([Gi(t, {
                props: [Ht(o, /:(read-\w+)/, ":" + ca + "$1")]
              })], i);
            // :placeholder
            case "::placeholder":
              return ra([Gi(t, {
                props: [Ht(o, /:(plac\w+)/, ":" + It + "input-$1")]
              }), Gi(t, {
                props: [Ht(o, /:(plac\w+)/, ":" + ca + "$1")]
              }), Gi(t, {
                props: [Ht(o, /:(plac\w+)/, bn + "input-$1")]
              })], i);
          }
          return "";
        });
    }
}, fw = [dw], hw = function(t) {
  var n = t.key;
  if (n === "css") {
    var r = document.querySelectorAll("style[data-emotion]:not([data-s])");
    Array.prototype.forEach.call(r, function(m) {
      var w = m.getAttribute("data-emotion");
      w.indexOf(" ") !== -1 && (document.head.appendChild(m), m.setAttribute("data-s", ""));
    });
  }
  var i = t.stylisPlugins || fw, o = {}, s, a = [];
  s = t.container || document.head, Array.prototype.forEach.call(
    // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll('style[data-emotion^="' + n + ' "]'),
    function(m) {
      for (var w = m.getAttribute("data-emotion").split(" "), b = 1; b < w.length; b++)
        o[w[b]] = !0;
      a.push(m);
    }
  );
  var l, u = [uw, cw];
  {
    var c, f = [Yg, Xg(function(m) {
      c.insert(m);
    })], g = Gg(u.concat(i, f)), h = function(w) {
      return ra(sp(w), g);
    };
    l = function(w, b, v, C) {
      c = v, h(w ? w + "{" + b.styles + "}" : b.styles), C && (p.inserted[b.name] = !0);
    };
  }
  var p = {
    key: n,
    sheet: new ow({
      key: n,
      container: s,
      nonce: t.nonce,
      speedy: t.speedy,
      prepend: t.prepend,
      insertionPoint: t.insertionPoint
    }),
    nonce: t.nonce,
    inserted: o,
    registered: {},
    insert: l
  };
  return p.sheet.hydrate(a), p;
}, gw = function(t) {
  return t();
}, pw = nu.useInsertionEffect ? nu.useInsertionEffect : !1, mw = pw || gw, Il = {}.hasOwnProperty, zf = /* @__PURE__ */ d.createContext(
  // we're doing this to avoid preconstruct's dead code elimination in this one case
  // because this module is primarily intended for the browser and node
  // but it's also required in react native and similar environments sometimes
  // and we could have a special build just for that
  // but this is much easier and the native packages
  // might use a different theme context in the future anyway
  typeof HTMLElement < "u" ? /* @__PURE__ */ hw({
    key: "css"
  }) : null
);
zf.Provider;
var vw = function(t) {
  return /* @__PURE__ */ d.forwardRef(function(n, r) {
    var i = d.useContext(zf);
    return t(n, i, r);
  });
}, bw = /* @__PURE__ */ d.createContext({}), Gs = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__", ww = function(t, n) {
  var r = {};
  for (var i in n)
    Il.call(n, i) && (r[i] = n[i]);
  return r[Gs] = t, r;
}, yw = function(t) {
  var n = t.cache, r = t.serialized, i = t.isStringTag;
  return up(n, r, i), mw(function() {
    return cp(n, r, i);
  }), null;
}, Cw = /* @__PURE__ */ vw(function(e, t, n) {
  var r = e.css;
  typeof r == "string" && t.registered[r] !== void 0 && (r = t.registered[r]);
  var i = e[Gs], o = [r], s = "";
  typeof e.className == "string" ? s = lp(t.registered, o, e.className) : e.className != null && (s = e.className + " ");
  var a = fd(o, void 0, d.useContext(bw));
  s += t.key + "-" + a.name;
  var l = {};
  for (var u in e)
    Il.call(e, u) && u !== "css" && u !== Gs && (l[u] = e[u]);
  return l.ref = n, l.className = s, /* @__PURE__ */ d.createElement(d.Fragment, null, /* @__PURE__ */ d.createElement(yw, {
    cache: t,
    serialized: a,
    isStringTag: typeof i == "string"
  }), /* @__PURE__ */ d.createElement(i, l));
}), Sw = Cw, Ae = function(t, n) {
  var r = arguments;
  if (n == null || !Il.call(n, "css"))
    return d.createElement.apply(void 0, r);
  var i = r.length, o = new Array(i);
  o[0] = Sw, o[1] = ww(t, n);
  for (var s = 2; s < i; s++)
    o[s] = r[s];
  return d.createElement.apply(null, o);
};
function Tl() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return fd(t);
}
var xw = function() {
  var t = Tl.apply(void 0, arguments), n = "animation-" + t.name;
  return {
    name: n,
    styles: "@keyframes " + n + "{" + t.styles + "}",
    anim: 1,
    toString: function() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
};
function kw(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
    raw: {
      value: Object.freeze(t)
    }
  }));
}
const Mw = Math.min, Rw = Math.max, ya = Math.round, ea = Math.floor, Ca = (e) => ({
  x: e,
  y: e
});
function Ew(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: i
  } = e;
  return {
    width: r,
    height: i,
    top: n,
    left: t,
    right: t + r,
    bottom: n + i,
    x: t,
    y: n
  };
}
function Oa() {
  return typeof window < "u";
}
function Vf(e) {
  return Nf(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function mr(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function $f(e) {
  var t;
  return (t = (Nf(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Nf(e) {
  return Oa() ? e instanceof Node || e instanceof mr(e).Node : !1;
}
function Iw(e) {
  return Oa() ? e instanceof Element || e instanceof mr(e).Element : !1;
}
function Dl(e) {
  return Oa() ? e instanceof HTMLElement || e instanceof mr(e).HTMLElement : !1;
}
function Ec(e) {
  return !Oa() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof mr(e).ShadowRoot;
}
const Tw = /* @__PURE__ */ new Set(["inline", "contents"]);
function Bf(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: i
  } = Ol(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !Tw.has(i);
}
function Dw() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Ow = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Pw(e) {
  return Ow.has(Vf(e));
}
function Ol(e) {
  return mr(e).getComputedStyle(e);
}
function Lw(e) {
  if (Vf(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Ec(e) && e.host || // Fallback.
    $f(e)
  );
  return Ec(t) ? t.host : t;
}
function Wf(e) {
  const t = Lw(e);
  return Pw(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Dl(t) && Bf(t) ? t : Wf(t);
}
function Sa(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const i = Wf(e), o = i === ((r = e.ownerDocument) == null ? void 0 : r.body), s = mr(i);
  if (o) {
    const a = Ys(s);
    return t.concat(s, s.visualViewport || [], Bf(i) ? i : [], a && n ? Sa(a) : []);
  }
  return t.concat(i, Sa(i, [], n));
}
function Ys(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Fw(e) {
  const t = Ol(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const i = Dl(e), o = i ? e.offsetWidth : n, s = i ? e.offsetHeight : r, a = ya(n) !== o || ya(r) !== s;
  return a && (n = o, r = s), {
    width: n,
    height: r,
    $: a
  };
}
function Pl(e) {
  return Iw(e) ? e : e.contextElement;
}
function Ic(e) {
  const t = Pl(e);
  if (!Dl(t))
    return Ca(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: i,
    $: o
  } = Fw(t);
  let s = (o ? ya(n.width) : n.width) / r, a = (o ? ya(n.height) : n.height) / i;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
const _w = /* @__PURE__ */ Ca(0);
function Aw(e) {
  const t = mr(e);
  return !Dw() || !t.visualViewport ? _w : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Hw(e, t, n) {
  return !1;
}
function Tc(e, t, n, r) {
  t === void 0 && (t = !1);
  const i = e.getBoundingClientRect(), o = Pl(e);
  let s = Ca(1);
  t && (s = Ic(e));
  const a = Hw() ? Aw(o) : Ca(0);
  let l = (i.left + a.x) / s.x, u = (i.top + a.y) / s.y, c = i.width / s.x, f = i.height / s.y;
  if (o) {
    const g = mr(o), h = r;
    let p = g, m = Ys(p);
    for (; m && r && h !== p; ) {
      const w = Ic(m), b = m.getBoundingClientRect(), v = Ol(m), C = b.left + (m.clientLeft + parseFloat(v.paddingLeft)) * w.x, I = b.top + (m.clientTop + parseFloat(v.paddingTop)) * w.y;
      l *= w.x, u *= w.y, c *= w.x, f *= w.y, l += C, u += I, p = mr(m), m = Ys(p);
    }
  }
  return Ew({
    width: c,
    height: f,
    x: l,
    y: u
  });
}
function Uf(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function zw(e, t) {
  let n = null, r;
  const i = $f(e);
  function o() {
    var a;
    clearTimeout(r), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), o();
    const u = e.getBoundingClientRect(), {
      left: c,
      top: f,
      width: g,
      height: h
    } = u;
    if (a || t(), !g || !h)
      return;
    const p = ea(f), m = ea(i.clientWidth - (c + g)), w = ea(i.clientHeight - (f + h)), b = ea(c), C = {
      rootMargin: -p + "px " + -m + "px " + -w + "px " + -b + "px",
      threshold: Rw(0, Mw(1, l)) || 1
    };
    let I = !0;
    function E(R) {
      const P = R[0].intersectionRatio;
      if (P !== l) {
        if (!I)
          return s();
        P ? s(!1, P) : r = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      P === 1 && !Uf(u, e.getBoundingClientRect()) && s(), I = !1;
    }
    try {
      n = new IntersectionObserver(E, {
        ...C,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(E, C);
    }
    n.observe(e);
  }
  return s(!0), o;
}
function Vw(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: o = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, u = Pl(e), c = i || o ? [...u ? Sa(u) : [], ...Sa(t)] : [];
  c.forEach((b) => {
    i && b.addEventListener("scroll", n, {
      passive: !0
    }), o && b.addEventListener("resize", n);
  });
  const f = u && a ? zw(u, n) : null;
  let g = -1, h = null;
  s && (h = new ResizeObserver((b) => {
    let [v] = b;
    v && v.target === u && h && (h.unobserve(t), cancelAnimationFrame(g), g = requestAnimationFrame(() => {
      var C;
      (C = h) == null || C.observe(t);
    })), n();
  }), u && !l && h.observe(u), h.observe(t));
  let p, m = l ? Tc(e) : null;
  l && w();
  function w() {
    const b = Tc(e);
    m && !Uf(m, b) && n(), m = b, p = requestAnimationFrame(w);
  }
  return n(), () => {
    var b;
    c.forEach((v) => {
      i && v.removeEventListener("scroll", n), o && v.removeEventListener("resize", n);
    }), f?.(), (b = h) == null || b.disconnect(), h = null, l && cancelAnimationFrame(p);
  };
}
var Xs = d.useLayoutEffect, $w = ["className", "clearValue", "cx", "getStyles", "getClassNames", "getValue", "hasValue", "isMulti", "isRtl", "options", "selectOption", "selectProps", "setValue", "theme"], xa = function() {
};
function Nw(e, t) {
  return t ? t[0] === "-" ? e + t : e + "__" + t : e;
}
function Bw(e, t) {
  for (var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), i = 2; i < n; i++)
    r[i - 2] = arguments[i];
  var o = [].concat(r);
  if (t && e)
    for (var s in t)
      t.hasOwnProperty(s) && t[s] && o.push("".concat(Nw(e, s)));
  return o.filter(function(a) {
    return a;
  }).map(function(a) {
    return String(a).trim();
  }).join(" ");
}
var ka = function(t) {
  return Zw(t) ? t.filter(Boolean) : dp(t) === "object" && t !== null ? [t] : [];
}, jf = function(t) {
  t.className, t.clearValue, t.cx, t.getStyles, t.getClassNames, t.getValue, t.hasValue, t.isMulti, t.isRtl, t.options, t.selectOption, t.selectProps, t.setValue, t.theme;
  var n = lr(t, $w);
  return Fe({}, n);
}, Xt = function(t, n, r) {
  var i = t.cx, o = t.getStyles, s = t.getClassNames, a = t.className;
  return {
    css: o(n, t),
    className: i(r ?? {}, s(n, t), a)
  };
};
function Pa(e) {
  return [document.documentElement, document.body, window].indexOf(e) > -1;
}
function Ww(e) {
  return Pa(e) ? window.innerHeight : e.clientHeight;
}
function qf(e) {
  return Pa(e) ? window.pageYOffset : e.scrollTop;
}
function Ma(e, t) {
  if (Pa(e)) {
    window.scrollTo(0, t);
    return;
  }
  e.scrollTop = t;
}
function Uw(e) {
  var t = getComputedStyle(e), n = t.position === "absolute", r = /(auto|scroll)/;
  if (t.position === "fixed") return document.documentElement;
  for (var i = e; i = i.parentElement; )
    if (t = getComputedStyle(i), !(n && t.position === "static") && r.test(t.overflow + t.overflowY + t.overflowX))
      return i;
  return document.documentElement;
}
function jw(e, t, n, r) {
  return n * ((e = e / r - 1) * e * e + 1) + t;
}
function ta(e, t) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 200, r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : xa, i = qf(e), o = t - i, s = 10, a = 0;
  function l() {
    a += s;
    var u = jw(a, i, o, n);
    Ma(e, u), a < n ? window.requestAnimationFrame(l) : r(e);
  }
  l();
}
function Dc(e, t) {
  var n = e.getBoundingClientRect(), r = t.getBoundingClientRect(), i = t.offsetHeight / 3;
  r.bottom + i > n.bottom ? Ma(e, Math.min(t.offsetTop + t.clientHeight - e.offsetHeight + i, e.scrollHeight)) : r.top - i < n.top && Ma(e, Math.max(t.offsetTop - i, 0));
}
function qw(e) {
  var t = e.getBoundingClientRect();
  return {
    bottom: t.bottom,
    height: t.height,
    left: t.left,
    right: t.right,
    top: t.top,
    width: t.width
  };
}
function Oc() {
  try {
    return document.createEvent("TouchEvent"), !0;
  } catch {
    return !1;
  }
}
function Gw() {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  } catch {
    return !1;
  }
}
var Gf = !1, Yw = {
  get passive() {
    return Gf = !0;
  }
}, na = typeof window < "u" ? window : {};
na.addEventListener && na.removeEventListener && (na.addEventListener("p", xa, Yw), na.removeEventListener("p", xa, !1));
var Xw = Gf;
function Kw(e) {
  return e != null;
}
function Zw(e) {
  return Array.isArray(e);
}
function lo(e, t, n) {
  return e ? t : n;
}
var Jw = function(t) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
    r[i - 1] = arguments[i];
  var o = Object.entries(t).filter(function(s) {
    var a = gr(s, 1), l = a[0];
    return !r.includes(l);
  });
  return o.reduce(function(s, a) {
    var l = gr(a, 2), u = l[0], c = l[1];
    return s[u] = c, s;
  }, {});
}, Qw = ["children", "innerProps"], ey = ["children", "innerProps"];
function ty(e) {
  var t = e.maxHeight, n = e.menuEl, r = e.minHeight, i = e.placement, o = e.shouldScroll, s = e.isFixedPosition, a = e.controlHeight, l = Uw(n), u = {
    placement: "bottom",
    maxHeight: t
  };
  if (!n || !n.offsetParent) return u;
  var c = l.getBoundingClientRect(), f = c.height, g = n.getBoundingClientRect(), h = g.bottom, p = g.height, m = g.top, w = n.offsetParent.getBoundingClientRect(), b = w.top, v = s ? window.innerHeight : Ww(l), C = qf(l), I = parseInt(getComputedStyle(n).marginBottom, 10), E = parseInt(getComputedStyle(n).marginTop, 10), R = b - E, P = v - m, x = R + C, S = f - C - m, F = h - v + C + I, D = C + m - E, M = 160;
  switch (i) {
    case "auto":
    case "bottom":
      if (P >= p)
        return {
          placement: "bottom",
          maxHeight: t
        };
      if (S >= p && !s)
        return o && ta(l, F, M), {
          placement: "bottom",
          maxHeight: t
        };
      if (!s && S >= r || s && P >= r) {
        o && ta(l, F, M);
        var T = s ? P - I : S - I;
        return {
          placement: "bottom",
          maxHeight: T
        };
      }
      if (i === "auto" || s) {
        var O = t, k = s ? R : x;
        return k >= r && (O = Math.min(k - I - a, t)), {
          placement: "top",
          maxHeight: O
        };
      }
      if (i === "bottom")
        return o && Ma(l, F), {
          placement: "bottom",
          maxHeight: t
        };
      break;
    case "top":
      if (R >= p)
        return {
          placement: "top",
          maxHeight: t
        };
      if (x >= p && !s)
        return o && ta(l, D, M), {
          placement: "top",
          maxHeight: t
        };
      if (!s && x >= r || s && R >= r) {
        var N = t;
        return (!s && x >= r || s && R >= r) && (N = s ? R - E : x - E), o && ta(l, D, M), {
          placement: "top",
          maxHeight: N
        };
      }
      return {
        placement: "bottom",
        maxHeight: t
      };
    default:
      throw new Error('Invalid placement provided "'.concat(i, '".'));
  }
  return u;
}
function ny(e) {
  var t = {
    bottom: "top",
    top: "bottom"
  };
  return e ? t[e] : "bottom";
}
var Yf = function(t) {
  return t === "auto" ? "bottom" : t;
}, ry = function(t, n) {
  var r, i = t.placement, o = t.theme, s = o.borderRadius, a = o.spacing, l = o.colors;
  return Fe((r = {
    label: "menu"
  }, so(r, ny(i), "100%"), so(r, "position", "absolute"), so(r, "width", "100%"), so(r, "zIndex", 1), r), n ? {} : {
    backgroundColor: l.neutral0,
    borderRadius: s,
    boxShadow: "0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)",
    marginBottom: a.menuGutter,
    marginTop: a.menuGutter
  });
}, Xf = /* @__PURE__ */ d.createContext(null), iy = function(t) {
  var n = t.children, r = t.minMenuHeight, i = t.maxMenuHeight, o = t.menuPlacement, s = t.menuPosition, a = t.menuShouldScrollIntoView, l = t.theme, u = d.useContext(Xf) || {}, c = u.setPortalPlacement, f = d.useRef(null), g = d.useState(i), h = gr(g, 2), p = h[0], m = h[1], w = d.useState(null), b = gr(w, 2), v = b[0], C = b[1], I = l.spacing.controlHeight;
  return Xs(function() {
    var E = f.current;
    if (E) {
      var R = s === "fixed", P = a && !R, x = ty({
        maxHeight: i,
        menuEl: E,
        minHeight: r,
        placement: o,
        shouldScroll: P,
        isFixedPosition: R,
        controlHeight: I
      });
      m(x.maxHeight), C(x.placement), c?.(x.placement);
    }
  }, [i, o, s, a, r, c, I]), n({
    ref: f,
    placerProps: Fe(Fe({}, t), {}, {
      placement: v || Yf(o),
      maxHeight: p
    })
  });
}, oy = function(t) {
  var n = t.children, r = t.innerRef, i = t.innerProps;
  return Ae("div", ze({}, Xt(t, "menu", {
    menu: !0
  }), {
    ref: r
  }, i), n);
}, ay = oy, sy = function(t, n) {
  var r = t.maxHeight, i = t.theme.spacing.baseUnit;
  return Fe({
    maxHeight: r,
    overflowY: "auto",
    position: "relative",
    // required for offset[Height, Top] > keyboard scroll
    WebkitOverflowScrolling: "touch"
  }, n ? {} : {
    paddingBottom: i,
    paddingTop: i
  });
}, ly = function(t) {
  var n = t.children, r = t.innerProps, i = t.innerRef, o = t.isMulti;
  return Ae("div", ze({}, Xt(t, "menuList", {
    "menu-list": !0,
    "menu-list--is-multi": o
  }), {
    ref: i
  }, r), n);
}, Kf = function(t, n) {
  var r = t.theme, i = r.spacing.baseUnit, o = r.colors;
  return Fe({
    textAlign: "center"
  }, n ? {} : {
    color: o.neutral40,
    padding: "".concat(i * 2, "px ").concat(i * 3, "px")
  });
}, uy = Kf, cy = Kf, dy = function(t) {
  var n = t.children, r = n === void 0 ? "No options" : n, i = t.innerProps, o = lr(t, Qw);
  return Ae("div", ze({}, Xt(Fe(Fe({}, o), {}, {
    children: r,
    innerProps: i
  }), "noOptionsMessage", {
    "menu-notice": !0,
    "menu-notice--no-options": !0
  }), i), r);
}, fy = function(t) {
  var n = t.children, r = n === void 0 ? "Loading..." : n, i = t.innerProps, o = lr(t, ey);
  return Ae("div", ze({}, Xt(Fe(Fe({}, o), {}, {
    children: r,
    innerProps: i
  }), "loadingMessage", {
    "menu-notice": !0,
    "menu-notice--loading": !0
  }), i), r);
}, hy = function(t) {
  var n = t.rect, r = t.offset, i = t.position;
  return {
    left: n.left,
    position: i,
    top: r,
    width: n.width,
    zIndex: 1
  };
}, gy = function(t) {
  var n = t.appendTo, r = t.children, i = t.controlElement, o = t.innerProps, s = t.menuPlacement, a = t.menuPosition, l = d.useRef(null), u = d.useRef(null), c = d.useState(Yf(s)), f = gr(c, 2), g = f[0], h = f[1], p = d.useMemo(function() {
    return {
      setPortalPlacement: h
    };
  }, []), m = d.useState(null), w = gr(m, 2), b = w[0], v = w[1], C = d.useCallback(function() {
    if (i) {
      var P = qw(i), x = a === "fixed" ? 0 : window.pageYOffset, S = P[g] + x;
      (S !== b?.offset || P.left !== b?.rect.left || P.width !== b?.rect.width) && v({
        offset: S,
        rect: P
      });
    }
  }, [i, a, g, b?.offset, b?.rect.left, b?.rect.width]);
  Xs(function() {
    C();
  }, [C]);
  var I = d.useCallback(function() {
    typeof u.current == "function" && (u.current(), u.current = null), i && l.current && (u.current = Vw(i, l.current, C, {
      elementResize: "ResizeObserver" in window
    }));
  }, [i, C]);
  Xs(function() {
    I();
  }, [I]);
  var E = d.useCallback(function(P) {
    l.current = P, I();
  }, [I]);
  if (!n && a !== "fixed" || !b) return null;
  var R = Ae("div", ze({
    ref: E
  }, Xt(Fe(Fe({}, t), {}, {
    offset: b.offset,
    position: a,
    rect: b.rect
  }), "menuPortal", {
    "menu-portal": !0
  }), o), r);
  return Ae(Xf.Provider, {
    value: p
  }, n ? /* @__PURE__ */ hd.createPortal(R, n) : R);
}, py = function(t) {
  var n = t.isDisabled, r = t.isRtl;
  return {
    label: "container",
    direction: r ? "rtl" : void 0,
    pointerEvents: n ? "none" : void 0,
    // cancel mouse events when disabled
    position: "relative"
  };
}, my = function(t) {
  var n = t.children, r = t.innerProps, i = t.isDisabled, o = t.isRtl;
  return Ae("div", ze({}, Xt(t, "container", {
    "--is-disabled": i,
    "--is-rtl": o
  }), r), n);
}, vy = function(t, n) {
  var r = t.theme.spacing, i = t.isMulti, o = t.hasValue, s = t.selectProps.controlShouldRenderValue;
  return Fe({
    alignItems: "center",
    display: i && o && s ? "flex" : "grid",
    flex: 1,
    flexWrap: "wrap",
    WebkitOverflowScrolling: "touch",
    position: "relative",
    overflow: "hidden"
  }, n ? {} : {
    padding: "".concat(r.baseUnit / 2, "px ").concat(r.baseUnit * 2, "px")
  });
}, by = function(t) {
  var n = t.children, r = t.innerProps, i = t.isMulti, o = t.hasValue;
  return Ae("div", ze({}, Xt(t, "valueContainer", {
    "value-container": !0,
    "value-container--is-multi": i,
    "value-container--has-value": o
  }), r), n);
}, wy = function() {
  return {
    alignItems: "center",
    alignSelf: "stretch",
    display: "flex",
    flexShrink: 0
  };
}, yy = function(t) {
  var n = t.children, r = t.innerProps;
  return Ae("div", ze({}, Xt(t, "indicatorsContainer", {
    indicators: !0
  }), r), n);
}, Pc, Cy = ["size"], Sy = ["innerProps", "isRtl", "size"], xy = {
  name: "8mmkcg",
  styles: "display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0"
}, Zf = function(t) {
  var n = t.size, r = lr(t, Cy);
  return Ae("svg", ze({
    height: n,
    width: n,
    viewBox: "0 0 20 20",
    "aria-hidden": "true",
    focusable: "false",
    css: xy
  }, r));
}, Ll = function(t) {
  return Ae(Zf, ze({
    size: 20
  }, t), Ae("path", {
    d: "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
  }));
}, Jf = function(t) {
  return Ae(Zf, ze({
    size: 20
  }, t), Ae("path", {
    d: "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
  }));
}, Qf = function(t, n) {
  var r = t.isFocused, i = t.theme, o = i.spacing.baseUnit, s = i.colors;
  return Fe({
    label: "indicatorContainer",
    display: "flex",
    transition: "color 150ms"
  }, n ? {} : {
    color: r ? s.neutral60 : s.neutral20,
    padding: o * 2,
    ":hover": {
      color: r ? s.neutral80 : s.neutral40
    }
  });
}, ky = Qf, My = function(t) {
  var n = t.children, r = t.innerProps;
  return Ae("div", ze({}, Xt(t, "dropdownIndicator", {
    indicator: !0,
    "dropdown-indicator": !0
  }), r), n || Ae(Jf, null));
}, Ry = Qf, Ey = function(t) {
  var n = t.children, r = t.innerProps;
  return Ae("div", ze({}, Xt(t, "clearIndicator", {
    indicator: !0,
    "clear-indicator": !0
  }), r), n || Ae(Ll, null));
}, Iy = function(t, n) {
  var r = t.isDisabled, i = t.theme, o = i.spacing.baseUnit, s = i.colors;
  return Fe({
    label: "indicatorSeparator",
    alignSelf: "stretch",
    width: 1
  }, n ? {} : {
    backgroundColor: r ? s.neutral10 : s.neutral20,
    marginBottom: o * 2,
    marginTop: o * 2
  });
}, Ty = function(t) {
  var n = t.innerProps;
  return Ae("span", ze({}, n, Xt(t, "indicatorSeparator", {
    "indicator-separator": !0
  })));
}, Dy = xw(Pc || (Pc = kw([`
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
`]))), Oy = function(t, n) {
  var r = t.isFocused, i = t.size, o = t.theme, s = o.colors, a = o.spacing.baseUnit;
  return Fe({
    label: "loadingIndicator",
    display: "flex",
    transition: "color 150ms",
    alignSelf: "center",
    fontSize: i,
    lineHeight: 1,
    marginRight: i,
    textAlign: "center",
    verticalAlign: "middle"
  }, n ? {} : {
    color: r ? s.neutral60 : s.neutral20,
    padding: a * 2
  });
}, Ms = function(t) {
  var n = t.delay, r = t.offset;
  return Ae("span", {
    css: /* @__PURE__ */ Tl({
      animation: "".concat(Dy, " 1s ease-in-out ").concat(n, "ms infinite;"),
      backgroundColor: "currentColor",
      borderRadius: "1em",
      display: "inline-block",
      marginLeft: r ? "1em" : void 0,
      height: "1em",
      verticalAlign: "top",
      width: "1em"
    }, "", "")
  });
}, Py = function(t) {
  var n = t.innerProps, r = t.isRtl, i = t.size, o = i === void 0 ? 4 : i, s = lr(t, Sy);
  return Ae("div", ze({}, Xt(Fe(Fe({}, s), {}, {
    innerProps: n,
    isRtl: r,
    size: o
  }), "loadingIndicator", {
    indicator: !0,
    "loading-indicator": !0
  }), n), Ae(Ms, {
    delay: 0,
    offset: r
  }), Ae(Ms, {
    delay: 160,
    offset: !0
  }), Ae(Ms, {
    delay: 320,
    offset: !r
  }));
}, Ly = function(t, n) {
  var r = t.isDisabled, i = t.isFocused, o = t.theme, s = o.colors, a = o.borderRadius, l = o.spacing;
  return Fe({
    label: "control",
    alignItems: "center",
    cursor: "default",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    minHeight: l.controlHeight,
    outline: "0 !important",
    position: "relative",
    transition: "all 100ms"
  }, n ? {} : {
    backgroundColor: r ? s.neutral5 : s.neutral0,
    borderColor: r ? s.neutral10 : i ? s.primary : s.neutral20,
    borderRadius: a,
    borderStyle: "solid",
    borderWidth: 1,
    boxShadow: i ? "0 0 0 1px ".concat(s.primary) : void 0,
    "&:hover": {
      borderColor: i ? s.primary : s.neutral30
    }
  });
}, Fy = function(t) {
  var n = t.children, r = t.isDisabled, i = t.isFocused, o = t.innerRef, s = t.innerProps, a = t.menuIsOpen;
  return Ae("div", ze({
    ref: o
  }, Xt(t, "control", {
    control: !0,
    "control--is-disabled": r,
    "control--is-focused": i,
    "control--menu-is-open": a
  }), s, {
    "aria-disabled": r || void 0
  }), n);
}, _y = Fy, Ay = ["data"], Hy = function(t, n) {
  var r = t.theme.spacing;
  return n ? {} : {
    paddingBottom: r.baseUnit * 2,
    paddingTop: r.baseUnit * 2
  };
}, zy = function(t) {
  var n = t.children, r = t.cx, i = t.getStyles, o = t.getClassNames, s = t.Heading, a = t.headingProps, l = t.innerProps, u = t.label, c = t.theme, f = t.selectProps;
  return Ae("div", ze({}, Xt(t, "group", {
    group: !0
  }), l), Ae(s, ze({}, a, {
    selectProps: f,
    theme: c,
    getStyles: i,
    getClassNames: o,
    cx: r
  }), u), Ae("div", null, n));
}, Vy = function(t, n) {
  var r = t.theme, i = r.colors, o = r.spacing;
  return Fe({
    label: "group",
    cursor: "default",
    display: "block"
  }, n ? {} : {
    color: i.neutral40,
    fontSize: "75%",
    fontWeight: 500,
    marginBottom: "0.25em",
    paddingLeft: o.baseUnit * 3,
    paddingRight: o.baseUnit * 3,
    textTransform: "uppercase"
  });
}, $y = function(t) {
  var n = jf(t);
  n.data;
  var r = lr(n, Ay);
  return Ae("div", ze({}, Xt(t, "groupHeading", {
    "group-heading": !0
  }), r));
}, Ny = zy, By = ["innerRef", "isDisabled", "isHidden", "inputClassName"], Wy = function(t, n) {
  var r = t.isDisabled, i = t.value, o = t.theme, s = o.spacing, a = o.colors;
  return Fe(Fe({
    visibility: r ? "hidden" : "visible",
    // force css to recompute when value change due to @emotion bug.
    // We can remove it whenever the bug is fixed.
    transform: i ? "translateZ(0)" : ""
  }, Uy), n ? {} : {
    margin: s.baseUnit / 2,
    paddingBottom: s.baseUnit / 2,
    paddingTop: s.baseUnit / 2,
    color: a.neutral80
  });
}, eh = {
  gridArea: "1 / 2",
  font: "inherit",
  minWidth: "2px",
  border: 0,
  margin: 0,
  outline: 0,
  padding: 0
}, Uy = {
  flex: "1 1 auto",
  display: "inline-grid",
  gridArea: "1 / 1 / 2 / 3",
  gridTemplateColumns: "0 min-content",
  "&:after": Fe({
    content: 'attr(data-value) " "',
    visibility: "hidden",
    whiteSpace: "pre"
  }, eh)
}, jy = function(t) {
  return Fe({
    label: "input",
    color: "inherit",
    background: 0,
    opacity: t ? 0 : 1,
    width: "100%"
  }, eh);
}, qy = function(t) {
  var n = t.cx, r = t.value, i = jf(t), o = i.innerRef, s = i.isDisabled, a = i.isHidden, l = i.inputClassName, u = lr(i, By);
  return Ae("div", ze({}, Xt(t, "input", {
    "input-container": !0
  }), {
    "data-value": r || ""
  }), Ae("input", ze({
    className: n({
      input: !0
    }, l),
    ref: o,
    style: jy(a),
    disabled: s
  }, u)));
}, Gy = qy, Yy = function(t, n) {
  var r = t.theme, i = r.spacing, o = r.borderRadius, s = r.colors;
  return Fe({
    label: "multiValue",
    display: "flex",
    minWidth: 0
  }, n ? {} : {
    backgroundColor: s.neutral10,
    borderRadius: o / 2,
    margin: i.baseUnit / 2
  });
}, Xy = function(t, n) {
  var r = t.theme, i = r.borderRadius, o = r.colors, s = t.cropWithEllipsis;
  return Fe({
    overflow: "hidden",
    textOverflow: s || s === void 0 ? "ellipsis" : void 0,
    whiteSpace: "nowrap"
  }, n ? {} : {
    borderRadius: i / 2,
    color: o.neutral80,
    fontSize: "85%",
    padding: 3,
    paddingLeft: 6
  });
}, Ky = function(t, n) {
  var r = t.theme, i = r.spacing, o = r.borderRadius, s = r.colors, a = t.isFocused;
  return Fe({
    alignItems: "center",
    display: "flex"
  }, n ? {} : {
    borderRadius: o / 2,
    backgroundColor: a ? s.dangerLight : void 0,
    paddingLeft: i.baseUnit,
    paddingRight: i.baseUnit,
    ":hover": {
      backgroundColor: s.dangerLight,
      color: s.danger
    }
  });
}, th = function(t) {
  var n = t.children, r = t.innerProps;
  return Ae("div", r, n);
}, Zy = th, Jy = th;
function Qy(e) {
  var t = e.children, n = e.innerProps;
  return Ae("div", ze({
    role: "button"
  }, n), t || Ae(Ll, {
    size: 14
  }));
}
var eC = function(t) {
  var n = t.children, r = t.components, i = t.data, o = t.innerProps, s = t.isDisabled, a = t.removeProps, l = t.selectProps, u = r.Container, c = r.Label, f = r.Remove;
  return Ae(u, {
    data: i,
    innerProps: Fe(Fe({}, Xt(t, "multiValue", {
      "multi-value": !0,
      "multi-value--is-disabled": s
    })), o),
    selectProps: l
  }, Ae(c, {
    data: i,
    innerProps: Fe({}, Xt(t, "multiValueLabel", {
      "multi-value__label": !0
    })),
    selectProps: l
  }, n), Ae(f, {
    data: i,
    innerProps: Fe(Fe({}, Xt(t, "multiValueRemove", {
      "multi-value__remove": !0
    })), {}, {
      "aria-label": "Remove ".concat(n || "option")
    }, a),
    selectProps: l
  }));
}, tC = eC, nC = function(t, n) {
  var r = t.isDisabled, i = t.isFocused, o = t.isSelected, s = t.theme, a = s.spacing, l = s.colors;
  return Fe({
    label: "option",
    cursor: "default",
    display: "block",
    fontSize: "inherit",
    width: "100%",
    userSelect: "none",
    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)"
  }, n ? {} : {
    backgroundColor: o ? l.primary : i ? l.primary25 : "transparent",
    color: r ? l.neutral20 : o ? l.neutral0 : "inherit",
    padding: "".concat(a.baseUnit * 2, "px ").concat(a.baseUnit * 3, "px"),
    // provide some affordance on touch devices
    ":active": {
      backgroundColor: r ? void 0 : o ? l.primary : l.primary50
    }
  });
}, rC = function(t) {
  var n = t.children, r = t.isDisabled, i = t.isFocused, o = t.isSelected, s = t.innerRef, a = t.innerProps;
  return Ae("div", ze({}, Xt(t, "option", {
    option: !0,
    "option--is-disabled": r,
    "option--is-focused": i,
    "option--is-selected": o
  }), {
    ref: s,
    "aria-disabled": r
  }, a), n);
}, iC = rC, oC = function(t, n) {
  var r = t.theme, i = r.spacing, o = r.colors;
  return Fe({
    label: "placeholder",
    gridArea: "1 / 1 / 2 / 3"
  }, n ? {} : {
    color: o.neutral50,
    marginLeft: i.baseUnit / 2,
    marginRight: i.baseUnit / 2
  });
}, aC = function(t) {
  var n = t.children, r = t.innerProps;
  return Ae("div", ze({}, Xt(t, "placeholder", {
    placeholder: !0
  }), r), n);
}, sC = aC, lC = function(t, n) {
  var r = t.isDisabled, i = t.theme, o = i.spacing, s = i.colors;
  return Fe({
    label: "singleValue",
    gridArea: "1 / 1 / 2 / 3",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }, n ? {} : {
    color: r ? s.neutral40 : s.neutral80,
    marginLeft: o.baseUnit / 2,
    marginRight: o.baseUnit / 2
  });
}, uC = function(t) {
  var n = t.children, r = t.isDisabled, i = t.innerProps;
  return Ae("div", ze({}, Xt(t, "singleValue", {
    "single-value": !0,
    "single-value--is-disabled": r
  }), i), n);
}, cC = uC, Fl = {
  ClearIndicator: Ey,
  Control: _y,
  DropdownIndicator: My,
  DownChevron: Jf,
  CrossIcon: Ll,
  Group: Ny,
  GroupHeading: $y,
  IndicatorsContainer: yy,
  IndicatorSeparator: Ty,
  Input: Gy,
  LoadingIndicator: Py,
  Menu: ay,
  MenuList: ly,
  MenuPortal: gy,
  LoadingMessage: fy,
  NoOptionsMessage: dy,
  MultiValue: tC,
  MultiValueContainer: Zy,
  MultiValueLabel: Jy,
  MultiValueRemove: Qy,
  Option: iC,
  Placeholder: sC,
  SelectContainer: my,
  SingleValue: cC,
  ValueContainer: by
}, dC = function(t) {
  return Fe(Fe({}, Fl), t.components);
}, Lc = Number.isNaN || function(t) {
  return typeof t == "number" && t !== t;
};
function fC(e, t) {
  return !!(e === t || Lc(e) && Lc(t));
}
function hC(e, t) {
  if (e.length !== t.length)
    return !1;
  for (var n = 0; n < e.length; n++)
    if (!fC(e[n], t[n]))
      return !1;
  return !0;
}
function gC(e, t) {
  t === void 0 && (t = hC);
  var n = null;
  function r() {
    for (var i = [], o = 0; o < arguments.length; o++)
      i[o] = arguments[o];
    if (n && n.lastThis === this && t(i, n.lastArgs))
      return n.lastResult;
    var s = e.apply(this, i);
    return n = {
      lastResult: s,
      lastArgs: i,
      lastThis: this
    }, s;
  }
  return r.clear = function() {
    n = null;
  }, r;
}
var pC = {
  name: "7pg0cj-a11yText",
  styles: "label:a11yText;z-index:9999;border:0;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0;white-space:nowrap"
}, mC = function(t) {
  return Ae("span", ze({
    css: pC
  }, t));
}, Fc = mC, vC = {
  guidance: function(t) {
    var n = t.isSearchable, r = t.isMulti, i = t.tabSelectsValue, o = t.context, s = t.isInitialFocus;
    switch (o) {
      case "menu":
        return "Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu".concat(i ? ", press Tab to select the option and exit the menu" : "", ".");
      case "input":
        return s ? "".concat(t["aria-label"] || "Select", " is focused ").concat(n ? ",type to refine list" : "", ", press Down to open the menu, ").concat(r ? " press left to focus selected values" : "") : "";
      case "value":
        return "Use left and right to toggle between focused values, press Backspace to remove the currently focused value";
      default:
        return "";
    }
  },
  onChange: function(t) {
    var n = t.action, r = t.label, i = r === void 0 ? "" : r, o = t.labels, s = t.isDisabled;
    switch (n) {
      case "deselect-option":
      case "pop-value":
      case "remove-value":
        return "option ".concat(i, ", deselected.");
      case "clear":
        return "All selected options have been cleared.";
      case "initial-input-focus":
        return "option".concat(o.length > 1 ? "s" : "", " ").concat(o.join(","), ", selected.");
      case "select-option":
        return s ? "option ".concat(i, " is disabled. Select another option.") : "option ".concat(i, ", selected.");
      default:
        return "";
    }
  },
  onFocus: function(t) {
    var n = t.context, r = t.focused, i = t.options, o = t.label, s = o === void 0 ? "" : o, a = t.selectValue, l = t.isDisabled, u = t.isSelected, c = t.isAppleDevice, f = function(m, w) {
      return m && m.length ? "".concat(m.indexOf(w) + 1, " of ").concat(m.length) : "";
    };
    if (n === "value" && a)
      return "value ".concat(s, " focused, ").concat(f(a, r), ".");
    if (n === "menu" && c) {
      var g = l ? " disabled" : "", h = "".concat(u ? " selected" : "").concat(g);
      return "".concat(s).concat(h, ", ").concat(f(i, r), ".");
    }
    return "";
  },
  onFilter: function(t) {
    var n = t.inputValue, r = t.resultsMessage;
    return "".concat(r).concat(n ? " for search term " + n : "", ".");
  }
}, bC = function(t) {
  var n = t.ariaSelection, r = t.focusedOption, i = t.focusedValue, o = t.focusableOptions, s = t.isFocused, a = t.selectValue, l = t.selectProps, u = t.id, c = t.isAppleDevice, f = l.ariaLiveMessages, g = l.getOptionLabel, h = l.inputValue, p = l.isMulti, m = l.isOptionDisabled, w = l.isSearchable, b = l.menuIsOpen, v = l.options, C = l.screenReaderStatus, I = l.tabSelectsValue, E = l.isLoading, R = l["aria-label"], P = l["aria-live"], x = d.useMemo(function() {
    return Fe(Fe({}, vC), f || {});
  }, [f]), S = d.useMemo(function() {
    var k = "";
    if (n && x.onChange) {
      var N = n.option, q = n.options, Y = n.removedValue, ue = n.removedValues, ee = n.value, te = function(L) {
        return Array.isArray(L) ? null : L;
      }, ce = Y || N || te(ee), le = ce ? g(ce) : "", he = q || ue || void 0, de = he ? he.map(g) : [], ie = Fe({
        // multiSelected items are usually items that have already been selected
        // or set by the user as a default value so we assume they are not disabled
        isDisabled: ce && m(ce, a),
        label: le,
        labels: de
      }, n);
      k = x.onChange(ie);
    }
    return k;
  }, [n, x, m, a, g]), F = d.useMemo(function() {
    var k = "", N = r || i, q = !!(r && a && a.includes(r));
    if (N && x.onFocus) {
      var Y = {
        focused: N,
        label: g(N),
        isDisabled: m(N, a),
        isSelected: q,
        options: o,
        context: N === r ? "menu" : "value",
        selectValue: a,
        isAppleDevice: c
      };
      k = x.onFocus(Y);
    }
    return k;
  }, [r, i, g, m, x, o, a, c]), D = d.useMemo(function() {
    var k = "";
    if (b && v.length && !E && x.onFilter) {
      var N = C({
        count: o.length
      });
      k = x.onFilter({
        inputValue: h,
        resultsMessage: N
      });
    }
    return k;
  }, [o, h, b, x, v, C, E]), M = n?.action === "initial-input-focus", T = d.useMemo(function() {
    var k = "";
    if (x.guidance) {
      var N = i ? "value" : b ? "menu" : "input";
      k = x.guidance({
        "aria-label": R,
        context: N,
        isDisabled: r && m(r, a),
        isMulti: p,
        isSearchable: w,
        tabSelectsValue: I,
        isInitialFocus: M
      });
    }
    return k;
  }, [R, r, i, p, m, w, b, x, a, I, M]), O = Ae(d.Fragment, null, Ae("span", {
    id: "aria-selection"
  }, S), Ae("span", {
    id: "aria-focused"
  }, F), Ae("span", {
    id: "aria-results"
  }, D), Ae("span", {
    id: "aria-guidance"
  }, T));
  return Ae(d.Fragment, null, Ae(Fc, {
    id: u
  }, M && O), Ae(Fc, {
    "aria-live": P,
    "aria-atomic": "false",
    "aria-relevant": "additions text",
    role: "log"
  }, s && !M && O));
}, wC = bC, Ks = [{
  base: "A",
  letters: "AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"
}, {
  base: "AA",
  letters: "Ꜳ"
}, {
  base: "AE",
  letters: "ÆǼǢ"
}, {
  base: "AO",
  letters: "Ꜵ"
}, {
  base: "AU",
  letters: "Ꜷ"
}, {
  base: "AV",
  letters: "ꜸꜺ"
}, {
  base: "AY",
  letters: "Ꜽ"
}, {
  base: "B",
  letters: "BⒷＢḂḄḆɃƂƁ"
}, {
  base: "C",
  letters: "CⒸＣĆĈĊČÇḈƇȻꜾ"
}, {
  base: "D",
  letters: "DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"
}, {
  base: "DZ",
  letters: "ǱǄ"
}, {
  base: "Dz",
  letters: "ǲǅ"
}, {
  base: "E",
  letters: "EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"
}, {
  base: "F",
  letters: "FⒻＦḞƑꝻ"
}, {
  base: "G",
  letters: "GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"
}, {
  base: "H",
  letters: "HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"
}, {
  base: "I",
  letters: "IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"
}, {
  base: "J",
  letters: "JⒿＪĴɈ"
}, {
  base: "K",
  letters: "KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"
}, {
  base: "L",
  letters: "LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"
}, {
  base: "LJ",
  letters: "Ǉ"
}, {
  base: "Lj",
  letters: "ǈ"
}, {
  base: "M",
  letters: "MⓂＭḾṀṂⱮƜ"
}, {
  base: "N",
  letters: "NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"
}, {
  base: "NJ",
  letters: "Ǌ"
}, {
  base: "Nj",
  letters: "ǋ"
}, {
  base: "O",
  letters: "OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"
}, {
  base: "OI",
  letters: "Ƣ"
}, {
  base: "OO",
  letters: "Ꝏ"
}, {
  base: "OU",
  letters: "Ȣ"
}, {
  base: "P",
  letters: "PⓅＰṔṖƤⱣꝐꝒꝔ"
}, {
  base: "Q",
  letters: "QⓆＱꝖꝘɊ"
}, {
  base: "R",
  letters: "RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"
}, {
  base: "S",
  letters: "SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"
}, {
  base: "T",
  letters: "TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"
}, {
  base: "TZ",
  letters: "Ꜩ"
}, {
  base: "U",
  letters: "UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"
}, {
  base: "V",
  letters: "VⓋＶṼṾƲꝞɅ"
}, {
  base: "VY",
  letters: "Ꝡ"
}, {
  base: "W",
  letters: "WⓌＷẀẂŴẆẄẈⱲ"
}, {
  base: "X",
  letters: "XⓍＸẊẌ"
}, {
  base: "Y",
  letters: "YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"
}, {
  base: "Z",
  letters: "ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"
}, {
  base: "a",
  letters: "aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ"
}, {
  base: "aa",
  letters: "ꜳ"
}, {
  base: "ae",
  letters: "æǽǣ"
}, {
  base: "ao",
  letters: "ꜵ"
}, {
  base: "au",
  letters: "ꜷ"
}, {
  base: "av",
  letters: "ꜹꜻ"
}, {
  base: "ay",
  letters: "ꜽ"
}, {
  base: "b",
  letters: "bⓑｂḃḅḇƀƃɓ"
}, {
  base: "c",
  letters: "cⓒｃćĉċčçḉƈȼꜿↄ"
}, {
  base: "d",
  letters: "dⓓｄḋďḍḑḓḏđƌɖɗꝺ"
}, {
  base: "dz",
  letters: "ǳǆ"
}, {
  base: "e",
  letters: "eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"
}, {
  base: "f",
  letters: "fⓕｆḟƒꝼ"
}, {
  base: "g",
  letters: "gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"
}, {
  base: "h",
  letters: "hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"
}, {
  base: "hv",
  letters: "ƕ"
}, {
  base: "i",
  letters: "iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"
}, {
  base: "j",
  letters: "jⓙｊĵǰɉ"
}, {
  base: "k",
  letters: "kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"
}, {
  base: "l",
  letters: "lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"
}, {
  base: "lj",
  letters: "ǉ"
}, {
  base: "m",
  letters: "mⓜｍḿṁṃɱɯ"
}, {
  base: "n",
  letters: "nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ"
}, {
  base: "nj",
  letters: "ǌ"
}, {
  base: "o",
  letters: "oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"
}, {
  base: "oi",
  letters: "ƣ"
}, {
  base: "ou",
  letters: "ȣ"
}, {
  base: "oo",
  letters: "ꝏ"
}, {
  base: "p",
  letters: "pⓟｐṕṗƥᵽꝑꝓꝕ"
}, {
  base: "q",
  letters: "qⓠｑɋꝗꝙ"
}, {
  base: "r",
  letters: "rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"
}, {
  base: "s",
  letters: "sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"
}, {
  base: "t",
  letters: "tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"
}, {
  base: "tz",
  letters: "ꜩ"
}, {
  base: "u",
  letters: "uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"
}, {
  base: "v",
  letters: "vⓥｖṽṿʋꝟʌ"
}, {
  base: "vy",
  letters: "ꝡ"
}, {
  base: "w",
  letters: "wⓦｗẁẃŵẇẅẘẉⱳ"
}, {
  base: "x",
  letters: "xⓧｘẋẍ"
}, {
  base: "y",
  letters: "yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"
}, {
  base: "z",
  letters: "zⓩｚźẑżžẓẕƶȥɀⱬꝣ"
}], yC = new RegExp("[" + Ks.map(function(e) {
  return e.letters;
}).join("") + "]", "g"), nh = {};
for (var Rs = 0; Rs < Ks.length; Rs++)
  for (var Es = Ks[Rs], Is = 0; Is < Es.letters.length; Is++)
    nh[Es.letters[Is]] = Es.base;
var rh = function(t) {
  return t.replace(yC, function(n) {
    return nh[n];
  });
}, CC = gC(rh), _c = function(t) {
  return t.replace(/^\s+|\s+$/g, "");
}, SC = function(t) {
  return "".concat(t.label, " ").concat(t.value);
}, xC = function(t) {
  return function(n, r) {
    if (n.data.__isNew__) return !0;
    var i = Fe({
      ignoreCase: !0,
      ignoreAccents: !0,
      stringify: SC,
      trim: !0,
      matchFrom: "any"
    }, t), o = i.ignoreCase, s = i.ignoreAccents, a = i.stringify, l = i.trim, u = i.matchFrom, c = l ? _c(r) : r, f = l ? _c(a(n)) : a(n);
    return o && (c = c.toLowerCase(), f = f.toLowerCase()), s && (c = CC(c), f = rh(f)), u === "start" ? f.substr(0, c.length) === c : f.indexOf(c) > -1;
  };
}, kC = ["innerRef"];
function MC(e) {
  var t = e.innerRef, n = lr(e, kC), r = Jw(n, "onExited", "in", "enter", "exit", "appear");
  return Ae("input", ze({
    ref: t
  }, r, {
    css: /* @__PURE__ */ Tl({
      label: "dummyInput",
      // get rid of any default styles
      background: 0,
      border: 0,
      // important! this hides the flashing cursor
      caretColor: "transparent",
      fontSize: "inherit",
      gridArea: "1 / 1 / 2 / 3",
      outline: 0,
      padding: 0,
      // important! without `width` browsers won't allow focus
      width: 1,
      // remove cursor on desktop
      color: "transparent",
      // remove cursor on mobile whilst maintaining "scroll into view" behaviour
      left: -100,
      opacity: 0,
      position: "relative",
      transform: "scale(.01)"
    }, "", "")
  }));
}
var RC = function(t) {
  t.cancelable && t.preventDefault(), t.stopPropagation();
};
function EC(e) {
  var t = e.isEnabled, n = e.onBottomArrive, r = e.onBottomLeave, i = e.onTopArrive, o = e.onTopLeave, s = d.useRef(!1), a = d.useRef(!1), l = d.useRef(0), u = d.useRef(null), c = d.useCallback(function(w, b) {
    if (u.current !== null) {
      var v = u.current, C = v.scrollTop, I = v.scrollHeight, E = v.clientHeight, R = u.current, P = b > 0, x = I - E - C, S = !1;
      x > b && s.current && (r && r(w), s.current = !1), P && a.current && (o && o(w), a.current = !1), P && b > x ? (n && !s.current && n(w), R.scrollTop = I, S = !0, s.current = !0) : !P && -b > C && (i && !a.current && i(w), R.scrollTop = 0, S = !0, a.current = !0), S && RC(w);
    }
  }, [n, r, i, o]), f = d.useCallback(function(w) {
    c(w, w.deltaY);
  }, [c]), g = d.useCallback(function(w) {
    l.current = w.changedTouches[0].clientY;
  }, []), h = d.useCallback(function(w) {
    var b = l.current - w.changedTouches[0].clientY;
    c(w, b);
  }, [c]), p = d.useCallback(function(w) {
    if (w) {
      var b = Xw ? {
        passive: !1
      } : !1;
      w.addEventListener("wheel", f, b), w.addEventListener("touchstart", g, b), w.addEventListener("touchmove", h, b);
    }
  }, [h, g, f]), m = d.useCallback(function(w) {
    w && (w.removeEventListener("wheel", f, !1), w.removeEventListener("touchstart", g, !1), w.removeEventListener("touchmove", h, !1));
  }, [h, g, f]);
  return d.useEffect(function() {
    if (t) {
      var w = u.current;
      return p(w), function() {
        m(w);
      };
    }
  }, [t, p, m]), function(w) {
    u.current = w;
  };
}
var Ac = ["boxSizing", "height", "overflow", "paddingRight", "position"], Hc = {
  boxSizing: "border-box",
  // account for possible declaration `width: 100%;` on body
  overflow: "hidden",
  position: "relative",
  height: "100%"
};
function zc(e) {
  e.cancelable && e.preventDefault();
}
function Vc(e) {
  e.stopPropagation();
}
function $c() {
  var e = this.scrollTop, t = this.scrollHeight, n = e + this.offsetHeight;
  e === 0 ? this.scrollTop = 1 : n === t && (this.scrollTop = e - 1);
}
function Nc() {
  return "ontouchstart" in window || navigator.maxTouchPoints;
}
var Bc = !!(typeof window < "u" && window.document && window.document.createElement), oo = 0, xi = {
  capture: !1,
  passive: !1
};
function IC(e) {
  var t = e.isEnabled, n = e.accountForScrollbars, r = n === void 0 ? !0 : n, i = d.useRef({}), o = d.useRef(null), s = d.useCallback(function(l) {
    if (Bc) {
      var u = document.body, c = u && u.style;
      if (r && Ac.forEach(function(p) {
        var m = c && c[p];
        i.current[p] = m;
      }), r && oo < 1) {
        var f = parseInt(i.current.paddingRight, 10) || 0, g = document.body ? document.body.clientWidth : 0, h = window.innerWidth - g + f || 0;
        Object.keys(Hc).forEach(function(p) {
          var m = Hc[p];
          c && (c[p] = m);
        }), c && (c.paddingRight = "".concat(h, "px"));
      }
      u && Nc() && (u.addEventListener("touchmove", zc, xi), l && (l.addEventListener("touchstart", $c, xi), l.addEventListener("touchmove", Vc, xi))), oo += 1;
    }
  }, [r]), a = d.useCallback(function(l) {
    if (Bc) {
      var u = document.body, c = u && u.style;
      oo = Math.max(oo - 1, 0), r && oo < 1 && Ac.forEach(function(f) {
        var g = i.current[f];
        c && (c[f] = g);
      }), u && Nc() && (u.removeEventListener("touchmove", zc, xi), l && (l.removeEventListener("touchstart", $c, xi), l.removeEventListener("touchmove", Vc, xi)));
    }
  }, [r]);
  return d.useEffect(function() {
    if (t) {
      var l = o.current;
      return s(l), function() {
        a(l);
      };
    }
  }, [t, s, a]), function(l) {
    o.current = l;
  };
}
var TC = function(t) {
  var n = t.target;
  return n.ownerDocument.activeElement && n.ownerDocument.activeElement.blur();
}, DC = {
  name: "1kfdb0e",
  styles: "position:fixed;left:0;bottom:0;right:0;top:0"
};
function OC(e) {
  var t = e.children, n = e.lockEnabled, r = e.captureEnabled, i = r === void 0 ? !0 : r, o = e.onBottomArrive, s = e.onBottomLeave, a = e.onTopArrive, l = e.onTopLeave, u = EC({
    isEnabled: i,
    onBottomArrive: o,
    onBottomLeave: s,
    onTopArrive: a,
    onTopLeave: l
  }), c = IC({
    isEnabled: n
  }), f = function(h) {
    u(h), c(h);
  };
  return Ae(d.Fragment, null, n && Ae("div", {
    onClick: TC,
    css: DC
  }), t(f));
}
var PC = {
  name: "1a0ro4n-requiredInput",
  styles: "label:requiredInput;opacity:0;pointer-events:none;position:absolute;bottom:0;left:0;right:0;width:100%"
}, LC = function(t) {
  var n = t.name, r = t.onFocus;
  return Ae("input", {
    required: !0,
    name: n,
    tabIndex: -1,
    "aria-hidden": "true",
    onFocus: r,
    css: PC,
    value: "",
    onChange: function() {
    }
  });
}, FC = LC;
function _l(e) {
  var t;
  return typeof window < "u" && window.navigator != null ? e.test(((t = window.navigator.userAgentData) === null || t === void 0 ? void 0 : t.platform) || window.navigator.platform) : !1;
}
function _C() {
  return _l(/^iPhone/i);
}
function ih() {
  return _l(/^Mac/i);
}
function AC() {
  return _l(/^iPad/i) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  ih() && navigator.maxTouchPoints > 1;
}
function HC() {
  return _C() || AC();
}
function zC() {
  return ih() || HC();
}
var VC = function(t) {
  return t.label;
}, oh = function(t) {
  return t.label;
}, ah = function(t) {
  return t.value;
}, $C = function(t) {
  return !!t.isDisabled;
}, NC = {
  clearIndicator: Ry,
  container: py,
  control: Ly,
  dropdownIndicator: ky,
  group: Hy,
  groupHeading: Vy,
  indicatorsContainer: wy,
  indicatorSeparator: Iy,
  input: Wy,
  loadingIndicator: Oy,
  loadingMessage: cy,
  menu: ry,
  menuList: sy,
  menuPortal: hy,
  multiValue: Yy,
  multiValueLabel: Xy,
  multiValueRemove: Ky,
  noOptionsMessage: uy,
  option: nC,
  placeholder: oC,
  singleValue: lC,
  valueContainer: vy
}, BC = {
  primary: "#2684FF",
  primary75: "#4C9AFF",
  primary50: "#B2D4FF",
  primary25: "#DEEBFF",
  danger: "#DE350B",
  dangerLight: "#FFBDAD",
  neutral0: "hsl(0, 0%, 100%)",
  neutral5: "hsl(0, 0%, 95%)",
  neutral10: "hsl(0, 0%, 90%)",
  neutral20: "hsl(0, 0%, 80%)",
  neutral30: "hsl(0, 0%, 70%)",
  neutral40: "hsl(0, 0%, 60%)",
  neutral50: "hsl(0, 0%, 50%)",
  neutral60: "hsl(0, 0%, 40%)",
  neutral70: "hsl(0, 0%, 30%)",
  neutral80: "hsl(0, 0%, 20%)",
  neutral90: "hsl(0, 0%, 10%)"
}, WC = 4, sh = 4, UC = 38, jC = sh * 2, qC = {
  baseUnit: sh,
  controlHeight: UC,
  menuGutter: jC
}, Ts = {
  borderRadius: WC,
  colors: BC,
  spacing: qC
}, GC = {
  "aria-live": "polite",
  backspaceRemovesValue: !0,
  blurInputOnSelect: Oc(),
  captureMenuScroll: !Oc(),
  classNames: {},
  closeMenuOnSelect: !0,
  closeMenuOnScroll: !1,
  components: {},
  controlShouldRenderValue: !0,
  escapeClearsValue: !1,
  filterOption: xC(),
  formatGroupLabel: VC,
  getOptionLabel: oh,
  getOptionValue: ah,
  isDisabled: !1,
  isLoading: !1,
  isMulti: !1,
  isRtl: !1,
  isSearchable: !0,
  isOptionDisabled: $C,
  loadingMessage: function() {
    return "Loading...";
  },
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: !1,
  menuPlacement: "bottom",
  menuPosition: "absolute",
  menuShouldBlockScroll: !1,
  menuShouldScrollIntoView: !Gw(),
  noOptionsMessage: function() {
    return "No options";
  },
  openMenuOnFocus: !1,
  openMenuOnClick: !0,
  options: [],
  pageSize: 5,
  placeholder: "Select...",
  screenReaderStatus: function(t) {
    var n = t.count;
    return "".concat(n, " result").concat(n !== 1 ? "s" : "", " available");
  },
  styles: {},
  tabIndex: 0,
  tabSelectsValue: !0,
  unstyled: !1
};
function Wc(e, t, n, r) {
  var i = ch(e, t, n), o = dh(e, t, n), s = uh(e, t), a = Ra(e, t);
  return {
    type: "option",
    data: t,
    isDisabled: i,
    isSelected: o,
    label: s,
    value: a,
    index: r
  };
}
function la(e, t) {
  return e.options.map(function(n, r) {
    if ("options" in n) {
      var i = n.options.map(function(s, a) {
        return Wc(e, s, t, a);
      }).filter(function(s) {
        return jc(e, s);
      });
      return i.length > 0 ? {
        type: "group",
        data: n,
        options: i,
        index: r
      } : void 0;
    }
    var o = Wc(e, n, t, r);
    return jc(e, o) ? o : void 0;
  }).filter(Kw);
}
function lh(e) {
  return e.reduce(function(t, n) {
    return n.type === "group" ? t.push.apply(t, Oi(n.options.map(function(r) {
      return r.data;
    }))) : t.push(n.data), t;
  }, []);
}
function Uc(e, t) {
  return e.reduce(function(n, r) {
    return r.type === "group" ? n.push.apply(n, Oi(r.options.map(function(i) {
      return {
        data: i.data,
        id: "".concat(t, "-").concat(r.index, "-").concat(i.index)
      };
    }))) : n.push({
      data: r.data,
      id: "".concat(t, "-").concat(r.index)
    }), n;
  }, []);
}
function YC(e, t) {
  return lh(la(e, t));
}
function jc(e, t) {
  var n = e.inputValue, r = n === void 0 ? "" : n, i = t.data, o = t.isSelected, s = t.label, a = t.value;
  return (!hh(e) || !o) && fh(e, {
    label: s,
    value: a,
    data: i
  }, r);
}
function XC(e, t) {
  var n = e.focusedValue, r = e.selectValue, i = r.indexOf(n);
  if (i > -1) {
    var o = t.indexOf(n);
    if (o > -1)
      return n;
    if (i < t.length)
      return t[i];
  }
  return null;
}
function KC(e, t) {
  var n = e.focusedOption;
  return n && t.indexOf(n) > -1 ? n : t[0];
}
var Ds = function(t, n) {
  var r, i = (r = t.find(function(o) {
    return o.data === n;
  })) === null || r === void 0 ? void 0 : r.id;
  return i || null;
}, uh = function(t, n) {
  return t.getOptionLabel(n);
}, Ra = function(t, n) {
  return t.getOptionValue(n);
};
function ch(e, t, n) {
  return typeof e.isOptionDisabled == "function" ? e.isOptionDisabled(t, n) : !1;
}
function dh(e, t, n) {
  if (n.indexOf(t) > -1) return !0;
  if (typeof e.isOptionSelected == "function")
    return e.isOptionSelected(t, n);
  var r = Ra(e, t);
  return n.some(function(i) {
    return Ra(e, i) === r;
  });
}
function fh(e, t, n) {
  return e.filterOption ? e.filterOption(t, n) : !0;
}
var hh = function(t) {
  var n = t.hideSelectedOptions, r = t.isMulti;
  return n === void 0 ? r : n;
}, ZC = 1, Al = /* @__PURE__ */ (function(e) {
  Pp(n, e);
  var t = _p(n);
  function n(r) {
    var i;
    if (Fp(this, n), i = t.call(this, r), i.state = {
      ariaSelection: null,
      focusedOption: null,
      focusedOptionId: null,
      focusableOptionsWithIds: [],
      focusedValue: null,
      inputIsHidden: !1,
      isFocused: !1,
      selectValue: [],
      clearFocusValueOnUpdate: !1,
      prevWasFocused: !1,
      inputIsHiddenAfterUpdate: void 0,
      prevProps: void 0,
      instancePrefix: "",
      isAppleDevice: !1
    }, i.blockOptionHover = !1, i.isComposing = !1, i.commonProps = void 0, i.initialTouchX = 0, i.initialTouchY = 0, i.openAfterFocus = !1, i.scrollToFocusedOptionOnUpdate = !1, i.userIsDragging = void 0, i.controlRef = null, i.getControlRef = function(l) {
      i.controlRef = l;
    }, i.focusedOptionRef = null, i.getFocusedOptionRef = function(l) {
      i.focusedOptionRef = l;
    }, i.menuListRef = null, i.getMenuListRef = function(l) {
      i.menuListRef = l;
    }, i.inputRef = null, i.getInputRef = function(l) {
      i.inputRef = l;
    }, i.focus = i.focusInput, i.blur = i.blurInput, i.onChange = function(l, u) {
      var c = i.props, f = c.onChange, g = c.name;
      u.name = g, i.ariaOnChange(l, u), f(l, u);
    }, i.setValue = function(l, u, c) {
      var f = i.props, g = f.closeMenuOnSelect, h = f.isMulti, p = f.inputValue;
      i.onInputChange("", {
        action: "set-value",
        prevInputValue: p
      }), g && (i.setState({
        inputIsHiddenAfterUpdate: !h
      }), i.onMenuClose()), i.setState({
        clearFocusValueOnUpdate: !0
      }), i.onChange(l, {
        action: u,
        option: c
      });
    }, i.selectOption = function(l) {
      var u = i.props, c = u.blurInputOnSelect, f = u.isMulti, g = u.name, h = i.state.selectValue, p = f && i.isOptionSelected(l, h), m = i.isOptionDisabled(l, h);
      if (p) {
        var w = i.getOptionValue(l);
        i.setValue(h.filter(function(b) {
          return i.getOptionValue(b) !== w;
        }), "deselect-option", l);
      } else if (!m)
        f ? i.setValue([].concat(Oi(h), [l]), "select-option", l) : i.setValue(l, "select-option");
      else {
        i.ariaOnChange(l, {
          action: "select-option",
          option: l,
          name: g
        });
        return;
      }
      c && i.blurInput();
    }, i.removeValue = function(l) {
      var u = i.props.isMulti, c = i.state.selectValue, f = i.getOptionValue(l), g = c.filter(function(p) {
        return i.getOptionValue(p) !== f;
      }), h = lo(u, g, g[0] || null);
      i.onChange(h, {
        action: "remove-value",
        removedValue: l
      }), i.focusInput();
    }, i.clearValue = function() {
      var l = i.state.selectValue;
      i.onChange(lo(i.props.isMulti, [], null), {
        action: "clear",
        removedValues: l
      });
    }, i.popValue = function() {
      var l = i.props.isMulti, u = i.state.selectValue, c = u[u.length - 1], f = u.slice(0, u.length - 1), g = lo(l, f, f[0] || null);
      c && i.onChange(g, {
        action: "pop-value",
        removedValue: c
      });
    }, i.getFocusedOptionId = function(l) {
      return Ds(i.state.focusableOptionsWithIds, l);
    }, i.getFocusableOptionsWithIds = function() {
      return Uc(la(i.props, i.state.selectValue), i.getElementId("option"));
    }, i.getValue = function() {
      return i.state.selectValue;
    }, i.cx = function() {
      for (var l = arguments.length, u = new Array(l), c = 0; c < l; c++)
        u[c] = arguments[c];
      return Bw.apply(void 0, [i.props.classNamePrefix].concat(u));
    }, i.getOptionLabel = function(l) {
      return uh(i.props, l);
    }, i.getOptionValue = function(l) {
      return Ra(i.props, l);
    }, i.getStyles = function(l, u) {
      var c = i.props.unstyled, f = NC[l](u, c);
      f.boxSizing = "border-box";
      var g = i.props.styles[l];
      return g ? g(f, u) : f;
    }, i.getClassNames = function(l, u) {
      var c, f;
      return (c = (f = i.props.classNames)[l]) === null || c === void 0 ? void 0 : c.call(f, u);
    }, i.getElementId = function(l) {
      return "".concat(i.state.instancePrefix, "-").concat(l);
    }, i.getComponents = function() {
      return dC(i.props);
    }, i.buildCategorizedOptions = function() {
      return la(i.props, i.state.selectValue);
    }, i.getCategorizedOptions = function() {
      return i.props.menuIsOpen ? i.buildCategorizedOptions() : [];
    }, i.buildFocusableOptions = function() {
      return lh(i.buildCategorizedOptions());
    }, i.getFocusableOptions = function() {
      return i.props.menuIsOpen ? i.buildFocusableOptions() : [];
    }, i.ariaOnChange = function(l, u) {
      i.setState({
        ariaSelection: Fe({
          value: l
        }, u)
      });
    }, i.onMenuMouseDown = function(l) {
      l.button === 0 && (l.stopPropagation(), l.preventDefault(), i.focusInput());
    }, i.onMenuMouseMove = function(l) {
      i.blockOptionHover = !1;
    }, i.onControlMouseDown = function(l) {
      if (!l.defaultPrevented) {
        var u = i.props.openMenuOnClick;
        i.state.isFocused ? i.props.menuIsOpen ? l.target.tagName !== "INPUT" && l.target.tagName !== "TEXTAREA" && i.onMenuClose() : u && i.openMenu("first") : (u && (i.openAfterFocus = !0), i.focusInput()), l.target.tagName !== "INPUT" && l.target.tagName !== "TEXTAREA" && l.preventDefault();
      }
    }, i.onDropdownIndicatorMouseDown = function(l) {
      if (!(l && l.type === "mousedown" && l.button !== 0) && !i.props.isDisabled) {
        var u = i.props, c = u.isMulti, f = u.menuIsOpen;
        i.focusInput(), f ? (i.setState({
          inputIsHiddenAfterUpdate: !c
        }), i.onMenuClose()) : i.openMenu("first"), l.preventDefault();
      }
    }, i.onClearIndicatorMouseDown = function(l) {
      l && l.type === "mousedown" && l.button !== 0 || (i.clearValue(), l.preventDefault(), i.openAfterFocus = !1, l.type === "touchend" ? i.focusInput() : setTimeout(function() {
        return i.focusInput();
      }));
    }, i.onScroll = function(l) {
      typeof i.props.closeMenuOnScroll == "boolean" ? l.target instanceof HTMLElement && Pa(l.target) && i.props.onMenuClose() : typeof i.props.closeMenuOnScroll == "function" && i.props.closeMenuOnScroll(l) && i.props.onMenuClose();
    }, i.onCompositionStart = function() {
      i.isComposing = !0;
    }, i.onCompositionEnd = function() {
      i.isComposing = !1;
    }, i.onTouchStart = function(l) {
      var u = l.touches, c = u && u.item(0);
      c && (i.initialTouchX = c.clientX, i.initialTouchY = c.clientY, i.userIsDragging = !1);
    }, i.onTouchMove = function(l) {
      var u = l.touches, c = u && u.item(0);
      if (c) {
        var f = Math.abs(c.clientX - i.initialTouchX), g = Math.abs(c.clientY - i.initialTouchY), h = 5;
        i.userIsDragging = f > h || g > h;
      }
    }, i.onTouchEnd = function(l) {
      i.userIsDragging || (i.controlRef && !i.controlRef.contains(l.target) && i.menuListRef && !i.menuListRef.contains(l.target) && i.blurInput(), i.initialTouchX = 0, i.initialTouchY = 0);
    }, i.onControlTouchEnd = function(l) {
      i.userIsDragging || i.onControlMouseDown(l);
    }, i.onClearIndicatorTouchEnd = function(l) {
      i.userIsDragging || i.onClearIndicatorMouseDown(l);
    }, i.onDropdownIndicatorTouchEnd = function(l) {
      i.userIsDragging || i.onDropdownIndicatorMouseDown(l);
    }, i.handleInputChange = function(l) {
      var u = i.props.inputValue, c = l.currentTarget.value;
      i.setState({
        inputIsHiddenAfterUpdate: !1
      }), i.onInputChange(c, {
        action: "input-change",
        prevInputValue: u
      }), i.props.menuIsOpen || i.onMenuOpen();
    }, i.onInputFocus = function(l) {
      i.props.onFocus && i.props.onFocus(l), i.setState({
        inputIsHiddenAfterUpdate: !1,
        isFocused: !0
      }), (i.openAfterFocus || i.props.openMenuOnFocus) && i.openMenu("first"), i.openAfterFocus = !1;
    }, i.onInputBlur = function(l) {
      var u = i.props.inputValue;
      if (i.menuListRef && i.menuListRef.contains(document.activeElement)) {
        i.inputRef.focus();
        return;
      }
      i.props.onBlur && i.props.onBlur(l), i.onInputChange("", {
        action: "input-blur",
        prevInputValue: u
      }), i.onMenuClose(), i.setState({
        focusedValue: null,
        isFocused: !1
      });
    }, i.onOptionHover = function(l) {
      if (!(i.blockOptionHover || i.state.focusedOption === l)) {
        var u = i.getFocusableOptions(), c = u.indexOf(l);
        i.setState({
          focusedOption: l,
          focusedOptionId: c > -1 ? i.getFocusedOptionId(l) : null
        });
      }
    }, i.shouldHideSelectedOptions = function() {
      return hh(i.props);
    }, i.onValueInputFocus = function(l) {
      l.preventDefault(), l.stopPropagation(), i.focus();
    }, i.onKeyDown = function(l) {
      var u = i.props, c = u.isMulti, f = u.backspaceRemovesValue, g = u.escapeClearsValue, h = u.inputValue, p = u.isClearable, m = u.isDisabled, w = u.menuIsOpen, b = u.onKeyDown, v = u.tabSelectsValue, C = u.openMenuOnFocus, I = i.state, E = I.focusedOption, R = I.focusedValue, P = I.selectValue;
      if (!m && !(typeof b == "function" && (b(l), l.defaultPrevented))) {
        switch (i.blockOptionHover = !0, l.key) {
          case "ArrowLeft":
            if (!c || h) return;
            i.focusValue("previous");
            break;
          case "ArrowRight":
            if (!c || h) return;
            i.focusValue("next");
            break;
          case "Delete":
          case "Backspace":
            if (h) return;
            if (R)
              i.removeValue(R);
            else {
              if (!f) return;
              c ? i.popValue() : p && i.clearValue();
            }
            break;
          case "Tab":
            if (i.isComposing || l.shiftKey || !w || !v || !E || // don't capture the event if the menu opens on focus and the focused
            // option is already selected; it breaks the flow of navigation
            C && i.isOptionSelected(E, P))
              return;
            i.selectOption(E);
            break;
          case "Enter":
            if (l.keyCode === 229)
              break;
            if (w) {
              if (!E || i.isComposing) return;
              i.selectOption(E);
              break;
            }
            return;
          case "Escape":
            w ? (i.setState({
              inputIsHiddenAfterUpdate: !1
            }), i.onInputChange("", {
              action: "menu-close",
              prevInputValue: h
            }), i.onMenuClose()) : p && g && i.clearValue();
            break;
          case " ":
            if (h)
              return;
            if (!w) {
              i.openMenu("first");
              break;
            }
            if (!E) return;
            i.selectOption(E);
            break;
          case "ArrowUp":
            w ? i.focusOption("up") : i.openMenu("last");
            break;
          case "ArrowDown":
            w ? i.focusOption("down") : i.openMenu("first");
            break;
          case "PageUp":
            if (!w) return;
            i.focusOption("pageup");
            break;
          case "PageDown":
            if (!w) return;
            i.focusOption("pagedown");
            break;
          case "Home":
            if (!w) return;
            i.focusOption("first");
            break;
          case "End":
            if (!w) return;
            i.focusOption("last");
            break;
          default:
            return;
        }
        l.preventDefault();
      }
    }, i.state.instancePrefix = "react-select-" + (i.props.instanceId || ++ZC), i.state.selectValue = ka(r.value), r.menuIsOpen && i.state.selectValue.length) {
      var o = i.getFocusableOptionsWithIds(), s = i.buildFocusableOptions(), a = s.indexOf(i.state.selectValue[0]);
      i.state.focusableOptionsWithIds = o, i.state.focusedOption = s[a], i.state.focusedOptionId = Ds(o, s[a]);
    }
    return i;
  }
  return Lp(n, [{
    key: "componentDidMount",
    value: function() {
      this.startListeningComposition(), this.startListeningToTouch(), this.props.closeMenuOnScroll && document && document.addEventListener && document.addEventListener("scroll", this.onScroll, !0), this.props.autoFocus && this.focusInput(), this.props.menuIsOpen && this.state.focusedOption && this.menuListRef && this.focusedOptionRef && Dc(this.menuListRef, this.focusedOptionRef), zC() && this.setState({
        isAppleDevice: !0
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function(i) {
      var o = this.props, s = o.isDisabled, a = o.menuIsOpen, l = this.state.isFocused;
      // ensure focus is restored correctly when the control becomes enabled
      (l && !s && i.isDisabled || // ensure focus is on the Input when the menu opens
      l && a && !i.menuIsOpen) && this.focusInput(), l && s && !i.isDisabled ? this.setState({
        isFocused: !1
      }, this.onMenuClose) : !l && !s && i.isDisabled && this.inputRef === document.activeElement && this.setState({
        isFocused: !0
      }), this.menuListRef && this.focusedOptionRef && this.scrollToFocusedOptionOnUpdate && (Dc(this.menuListRef, this.focusedOptionRef), this.scrollToFocusedOptionOnUpdate = !1);
    }
  }, {
    key: "componentWillUnmount",
    value: function() {
      this.stopListeningComposition(), this.stopListeningToTouch(), document.removeEventListener("scroll", this.onScroll, !0);
    }
    // ==============================
    // Consumer Handlers
    // ==============================
  }, {
    key: "onMenuOpen",
    value: function() {
      this.props.onMenuOpen();
    }
  }, {
    key: "onMenuClose",
    value: function() {
      this.onInputChange("", {
        action: "menu-close",
        prevInputValue: this.props.inputValue
      }), this.props.onMenuClose();
    }
  }, {
    key: "onInputChange",
    value: function(i, o) {
      this.props.onInputChange(i, o);
    }
    // ==============================
    // Methods
    // ==============================
  }, {
    key: "focusInput",
    value: function() {
      this.inputRef && this.inputRef.focus();
    }
  }, {
    key: "blurInput",
    value: function() {
      this.inputRef && this.inputRef.blur();
    }
    // aliased for consumers
  }, {
    key: "openMenu",
    value: function(i) {
      var o = this, s = this.state, a = s.selectValue, l = s.isFocused, u = this.buildFocusableOptions(), c = i === "first" ? 0 : u.length - 1;
      if (!this.props.isMulti) {
        var f = u.indexOf(a[0]);
        f > -1 && (c = f);
      }
      this.scrollToFocusedOptionOnUpdate = !(l && this.menuListRef), this.setState({
        inputIsHiddenAfterUpdate: !1,
        focusedValue: null,
        focusedOption: u[c],
        focusedOptionId: this.getFocusedOptionId(u[c])
      }, function() {
        return o.onMenuOpen();
      });
    }
  }, {
    key: "focusValue",
    value: function(i) {
      var o = this.state, s = o.selectValue, a = o.focusedValue;
      if (this.props.isMulti) {
        this.setState({
          focusedOption: null
        });
        var l = s.indexOf(a);
        a || (l = -1);
        var u = s.length - 1, c = -1;
        if (s.length) {
          switch (i) {
            case "previous":
              l === 0 ? c = 0 : l === -1 ? c = u : c = l - 1;
              break;
            case "next":
              l > -1 && l < u && (c = l + 1);
              break;
          }
          this.setState({
            inputIsHidden: c !== -1,
            focusedValue: s[c]
          });
        }
      }
    }
  }, {
    key: "focusOption",
    value: function() {
      var i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "first", o = this.props.pageSize, s = this.state.focusedOption, a = this.getFocusableOptions();
      if (a.length) {
        var l = 0, u = a.indexOf(s);
        s || (u = -1), i === "up" ? l = u > 0 ? u - 1 : a.length - 1 : i === "down" ? l = (u + 1) % a.length : i === "pageup" ? (l = u - o, l < 0 && (l = 0)) : i === "pagedown" ? (l = u + o, l > a.length - 1 && (l = a.length - 1)) : i === "last" && (l = a.length - 1), this.scrollToFocusedOptionOnUpdate = !0, this.setState({
          focusedOption: a[l],
          focusedValue: null,
          focusedOptionId: this.getFocusedOptionId(a[l])
        });
      }
    }
  }, {
    key: "getTheme",
    value: (
      // ==============================
      // Getters
      // ==============================
      (function() {
        return this.props.theme ? typeof this.props.theme == "function" ? this.props.theme(Ts) : Fe(Fe({}, Ts), this.props.theme) : Ts;
      })
    )
  }, {
    key: "getCommonProps",
    value: function() {
      var i = this.clearValue, o = this.cx, s = this.getStyles, a = this.getClassNames, l = this.getValue, u = this.selectOption, c = this.setValue, f = this.props, g = f.isMulti, h = f.isRtl, p = f.options, m = this.hasValue();
      return {
        clearValue: i,
        cx: o,
        getStyles: s,
        getClassNames: a,
        getValue: l,
        hasValue: m,
        isMulti: g,
        isRtl: h,
        options: p,
        selectOption: u,
        selectProps: f,
        setValue: c,
        theme: this.getTheme()
      };
    }
  }, {
    key: "hasValue",
    value: function() {
      var i = this.state.selectValue;
      return i.length > 0;
    }
  }, {
    key: "hasOptions",
    value: function() {
      return !!this.getFocusableOptions().length;
    }
  }, {
    key: "isClearable",
    value: function() {
      var i = this.props, o = i.isClearable, s = i.isMulti;
      return o === void 0 ? s : o;
    }
  }, {
    key: "isOptionDisabled",
    value: function(i, o) {
      return ch(this.props, i, o);
    }
  }, {
    key: "isOptionSelected",
    value: function(i, o) {
      return dh(this.props, i, o);
    }
  }, {
    key: "filterOption",
    value: function(i, o) {
      return fh(this.props, i, o);
    }
  }, {
    key: "formatOptionLabel",
    value: function(i, o) {
      if (typeof this.props.formatOptionLabel == "function") {
        var s = this.props.inputValue, a = this.state.selectValue;
        return this.props.formatOptionLabel(i, {
          context: o,
          inputValue: s,
          selectValue: a
        });
      } else
        return this.getOptionLabel(i);
    }
  }, {
    key: "formatGroupLabel",
    value: function(i) {
      return this.props.formatGroupLabel(i);
    }
    // ==============================
    // Mouse Handlers
    // ==============================
  }, {
    key: "startListeningComposition",
    value: (
      // ==============================
      // Composition Handlers
      // ==============================
      (function() {
        document && document.addEventListener && (document.addEventListener("compositionstart", this.onCompositionStart, !1), document.addEventListener("compositionend", this.onCompositionEnd, !1));
      })
    )
  }, {
    key: "stopListeningComposition",
    value: function() {
      document && document.removeEventListener && (document.removeEventListener("compositionstart", this.onCompositionStart), document.removeEventListener("compositionend", this.onCompositionEnd));
    }
  }, {
    key: "startListeningToTouch",
    value: (
      // ==============================
      // Touch Handlers
      // ==============================
      (function() {
        document && document.addEventListener && (document.addEventListener("touchstart", this.onTouchStart, !1), document.addEventListener("touchmove", this.onTouchMove, !1), document.addEventListener("touchend", this.onTouchEnd, !1));
      })
    )
  }, {
    key: "stopListeningToTouch",
    value: function() {
      document && document.removeEventListener && (document.removeEventListener("touchstart", this.onTouchStart), document.removeEventListener("touchmove", this.onTouchMove), document.removeEventListener("touchend", this.onTouchEnd));
    }
  }, {
    key: "renderInput",
    value: (
      // ==============================
      // Renderers
      // ==============================
      (function() {
        var i = this.props, o = i.isDisabled, s = i.isSearchable, a = i.inputId, l = i.inputValue, u = i.tabIndex, c = i.form, f = i.menuIsOpen, g = i.required, h = this.getComponents(), p = h.Input, m = this.state, w = m.inputIsHidden, b = m.ariaSelection, v = this.commonProps, C = a || this.getElementId("input"), I = Fe(Fe(Fe({
          "aria-autocomplete": "list",
          "aria-expanded": f,
          "aria-haspopup": !0,
          "aria-errormessage": this.props["aria-errormessage"],
          "aria-invalid": this.props["aria-invalid"],
          "aria-label": this.props["aria-label"],
          "aria-labelledby": this.props["aria-labelledby"],
          "aria-required": g,
          role: "combobox",
          "aria-activedescendant": this.state.isAppleDevice ? void 0 : this.state.focusedOptionId || ""
        }, f && {
          "aria-controls": this.getElementId("listbox")
        }), !s && {
          "aria-readonly": !0
        }), this.hasValue() ? b?.action === "initial-input-focus" && {
          "aria-describedby": this.getElementId("live-region")
        } : {
          "aria-describedby": this.getElementId("placeholder")
        });
        return s ? /* @__PURE__ */ d.createElement(p, ze({}, v, {
          autoCapitalize: "none",
          autoComplete: "off",
          autoCorrect: "off",
          id: C,
          innerRef: this.getInputRef,
          isDisabled: o,
          isHidden: w,
          onBlur: this.onInputBlur,
          onChange: this.handleInputChange,
          onFocus: this.onInputFocus,
          spellCheck: "false",
          tabIndex: u,
          form: c,
          type: "text",
          value: l
        }, I)) : /* @__PURE__ */ d.createElement(MC, ze({
          id: C,
          innerRef: this.getInputRef,
          onBlur: this.onInputBlur,
          onChange: xa,
          onFocus: this.onInputFocus,
          disabled: o,
          tabIndex: u,
          inputMode: "none",
          form: c,
          value: ""
        }, I));
      })
    )
  }, {
    key: "renderPlaceholderOrValue",
    value: function() {
      var i = this, o = this.getComponents(), s = o.MultiValue, a = o.MultiValueContainer, l = o.MultiValueLabel, u = o.MultiValueRemove, c = o.SingleValue, f = o.Placeholder, g = this.commonProps, h = this.props, p = h.controlShouldRenderValue, m = h.isDisabled, w = h.isMulti, b = h.inputValue, v = h.placeholder, C = this.state, I = C.selectValue, E = C.focusedValue, R = C.isFocused;
      if (!this.hasValue() || !p)
        return b ? null : /* @__PURE__ */ d.createElement(f, ze({}, g, {
          key: "placeholder",
          isDisabled: m,
          isFocused: R,
          innerProps: {
            id: this.getElementId("placeholder")
          }
        }), v);
      if (w)
        return I.map(function(x, S) {
          var F = x === E, D = "".concat(i.getOptionLabel(x), "-").concat(i.getOptionValue(x));
          return /* @__PURE__ */ d.createElement(s, ze({}, g, {
            components: {
              Container: a,
              Label: l,
              Remove: u
            },
            isFocused: F,
            isDisabled: m,
            key: D,
            index: S,
            removeProps: {
              onClick: function() {
                return i.removeValue(x);
              },
              onTouchEnd: function() {
                return i.removeValue(x);
              },
              onMouseDown: function(T) {
                T.preventDefault();
              }
            },
            data: x
          }), i.formatOptionLabel(x, "value"));
        });
      if (b)
        return null;
      var P = I[0];
      return /* @__PURE__ */ d.createElement(c, ze({}, g, {
        data: P,
        isDisabled: m
      }), this.formatOptionLabel(P, "value"));
    }
  }, {
    key: "renderClearIndicator",
    value: function() {
      var i = this.getComponents(), o = i.ClearIndicator, s = this.commonProps, a = this.props, l = a.isDisabled, u = a.isLoading, c = this.state.isFocused;
      if (!this.isClearable() || !o || l || !this.hasValue() || u)
        return null;
      var f = {
        onMouseDown: this.onClearIndicatorMouseDown,
        onTouchEnd: this.onClearIndicatorTouchEnd,
        "aria-hidden": "true"
      };
      return /* @__PURE__ */ d.createElement(o, ze({}, s, {
        innerProps: f,
        isFocused: c
      }));
    }
  }, {
    key: "renderLoadingIndicator",
    value: function() {
      var i = this.getComponents(), o = i.LoadingIndicator, s = this.commonProps, a = this.props, l = a.isDisabled, u = a.isLoading, c = this.state.isFocused;
      if (!o || !u) return null;
      var f = {
        "aria-hidden": "true"
      };
      return /* @__PURE__ */ d.createElement(o, ze({}, s, {
        innerProps: f,
        isDisabled: l,
        isFocused: c
      }));
    }
  }, {
    key: "renderIndicatorSeparator",
    value: function() {
      var i = this.getComponents(), o = i.DropdownIndicator, s = i.IndicatorSeparator;
      if (!o || !s) return null;
      var a = this.commonProps, l = this.props.isDisabled, u = this.state.isFocused;
      return /* @__PURE__ */ d.createElement(s, ze({}, a, {
        isDisabled: l,
        isFocused: u
      }));
    }
  }, {
    key: "renderDropdownIndicator",
    value: function() {
      var i = this.getComponents(), o = i.DropdownIndicator;
      if (!o) return null;
      var s = this.commonProps, a = this.props.isDisabled, l = this.state.isFocused, u = {
        onMouseDown: this.onDropdownIndicatorMouseDown,
        onTouchEnd: this.onDropdownIndicatorTouchEnd,
        "aria-hidden": "true"
      };
      return /* @__PURE__ */ d.createElement(o, ze({}, s, {
        innerProps: u,
        isDisabled: a,
        isFocused: l
      }));
    }
  }, {
    key: "renderMenu",
    value: function() {
      var i = this, o = this.getComponents(), s = o.Group, a = o.GroupHeading, l = o.Menu, u = o.MenuList, c = o.MenuPortal, f = o.LoadingMessage, g = o.NoOptionsMessage, h = o.Option, p = this.commonProps, m = this.state.focusedOption, w = this.props, b = w.captureMenuScroll, v = w.inputValue, C = w.isLoading, I = w.loadingMessage, E = w.minMenuHeight, R = w.maxMenuHeight, P = w.menuIsOpen, x = w.menuPlacement, S = w.menuPosition, F = w.menuPortalTarget, D = w.menuShouldBlockScroll, M = w.menuShouldScrollIntoView, T = w.noOptionsMessage, O = w.onMenuScrollToTop, k = w.onMenuScrollToBottom;
      if (!P) return null;
      var N = function(le, he) {
        var de = le.type, ie = le.data, H = le.isDisabled, L = le.isSelected, G = le.label, ne = le.value, oe = m === ie, xe = H ? void 0 : function() {
          return i.onOptionHover(ie);
        }, ve = H ? void 0 : function() {
          return i.selectOption(ie);
        }, et = "".concat(i.getElementId("option"), "-").concat(he), ke = {
          id: et,
          onClick: ve,
          onMouseMove: xe,
          onMouseOver: xe,
          tabIndex: -1,
          role: "option",
          "aria-selected": i.state.isAppleDevice ? void 0 : L
          // is not supported on Apple devices
        };
        return /* @__PURE__ */ d.createElement(h, ze({}, p, {
          innerProps: ke,
          data: ie,
          isDisabled: H,
          isSelected: L,
          key: et,
          label: G,
          type: de,
          value: ne,
          isFocused: oe,
          innerRef: oe ? i.getFocusedOptionRef : void 0
        }), i.formatOptionLabel(le.data, "menu"));
      }, q;
      if (this.hasOptions())
        q = this.getCategorizedOptions().map(function(ce) {
          if (ce.type === "group") {
            var le = ce.data, he = ce.options, de = ce.index, ie = "".concat(i.getElementId("group"), "-").concat(de), H = "".concat(ie, "-heading");
            return /* @__PURE__ */ d.createElement(s, ze({}, p, {
              key: ie,
              data: le,
              options: he,
              Heading: a,
              headingProps: {
                id: H,
                data: ce.data
              },
              label: i.formatGroupLabel(ce.data)
            }), ce.options.map(function(L) {
              return N(L, "".concat(de, "-").concat(L.index));
            }));
          } else if (ce.type === "option")
            return N(ce, "".concat(ce.index));
        });
      else if (C) {
        var Y = I({
          inputValue: v
        });
        if (Y === null) return null;
        q = /* @__PURE__ */ d.createElement(f, p, Y);
      } else {
        var ue = T({
          inputValue: v
        });
        if (ue === null) return null;
        q = /* @__PURE__ */ d.createElement(g, p, ue);
      }
      var ee = {
        minMenuHeight: E,
        maxMenuHeight: R,
        menuPlacement: x,
        menuPosition: S,
        menuShouldScrollIntoView: M
      }, te = /* @__PURE__ */ d.createElement(iy, ze({}, p, ee), function(ce) {
        var le = ce.ref, he = ce.placerProps, de = he.placement, ie = he.maxHeight;
        return /* @__PURE__ */ d.createElement(l, ze({}, p, ee, {
          innerRef: le,
          innerProps: {
            onMouseDown: i.onMenuMouseDown,
            onMouseMove: i.onMenuMouseMove
          },
          isLoading: C,
          placement: de
        }), /* @__PURE__ */ d.createElement(OC, {
          captureEnabled: b,
          onTopArrive: O,
          onBottomArrive: k,
          lockEnabled: D
        }, function(H) {
          return /* @__PURE__ */ d.createElement(u, ze({}, p, {
            innerRef: function(G) {
              i.getMenuListRef(G), H(G);
            },
            innerProps: {
              role: "listbox",
              "aria-multiselectable": p.isMulti,
              id: i.getElementId("listbox")
            },
            isLoading: C,
            maxHeight: ie,
            focusedOption: m
          }), q);
        }));
      });
      return F || S === "fixed" ? /* @__PURE__ */ d.createElement(c, ze({}, p, {
        appendTo: F,
        controlElement: this.controlRef,
        menuPlacement: x,
        menuPosition: S
      }), te) : te;
    }
  }, {
    key: "renderFormField",
    value: function() {
      var i = this, o = this.props, s = o.delimiter, a = o.isDisabled, l = o.isMulti, u = o.name, c = o.required, f = this.state.selectValue;
      if (c && !this.hasValue() && !a)
        return /* @__PURE__ */ d.createElement(FC, {
          name: u,
          onFocus: this.onValueInputFocus
        });
      if (!(!u || a))
        if (l)
          if (s) {
            var g = f.map(function(m) {
              return i.getOptionValue(m);
            }).join(s);
            return /* @__PURE__ */ d.createElement("input", {
              name: u,
              type: "hidden",
              value: g
            });
          } else {
            var h = f.length > 0 ? f.map(function(m, w) {
              return /* @__PURE__ */ d.createElement("input", {
                key: "i-".concat(w),
                name: u,
                type: "hidden",
                value: i.getOptionValue(m)
              });
            }) : /* @__PURE__ */ d.createElement("input", {
              name: u,
              type: "hidden",
              value: ""
            });
            return /* @__PURE__ */ d.createElement("div", null, h);
          }
        else {
          var p = f[0] ? this.getOptionValue(f[0]) : "";
          return /* @__PURE__ */ d.createElement("input", {
            name: u,
            type: "hidden",
            value: p
          });
        }
    }
  }, {
    key: "renderLiveRegion",
    value: function() {
      var i = this.commonProps, o = this.state, s = o.ariaSelection, a = o.focusedOption, l = o.focusedValue, u = o.isFocused, c = o.selectValue, f = this.getFocusableOptions();
      return /* @__PURE__ */ d.createElement(wC, ze({}, i, {
        id: this.getElementId("live-region"),
        ariaSelection: s,
        focusedOption: a,
        focusedValue: l,
        isFocused: u,
        selectValue: c,
        focusableOptions: f,
        isAppleDevice: this.state.isAppleDevice
      }));
    }
  }, {
    key: "render",
    value: function() {
      var i = this.getComponents(), o = i.Control, s = i.IndicatorsContainer, a = i.SelectContainer, l = i.ValueContainer, u = this.props, c = u.className, f = u.id, g = u.isDisabled, h = u.menuIsOpen, p = this.state.isFocused, m = this.commonProps = this.getCommonProps();
      return /* @__PURE__ */ d.createElement(a, ze({}, m, {
        className: c,
        innerProps: {
          id: f,
          onKeyDown: this.onKeyDown
        },
        isDisabled: g,
        isFocused: p
      }), this.renderLiveRegion(), /* @__PURE__ */ d.createElement(o, ze({}, m, {
        innerRef: this.getControlRef,
        innerProps: {
          onMouseDown: this.onControlMouseDown,
          onTouchEnd: this.onControlTouchEnd
        },
        isDisabled: g,
        isFocused: p,
        menuIsOpen: h
      }), /* @__PURE__ */ d.createElement(l, ze({}, m, {
        isDisabled: g
      }), this.renderPlaceholderOrValue(), this.renderInput()), /* @__PURE__ */ d.createElement(s, ze({}, m, {
        isDisabled: g
      }), this.renderClearIndicator(), this.renderLoadingIndicator(), this.renderIndicatorSeparator(), this.renderDropdownIndicator())), this.renderMenu(), this.renderFormField());
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function(i, o) {
      var s = o.prevProps, a = o.clearFocusValueOnUpdate, l = o.inputIsHiddenAfterUpdate, u = o.ariaSelection, c = o.isFocused, f = o.prevWasFocused, g = o.instancePrefix, h = i.options, p = i.value, m = i.menuIsOpen, w = i.inputValue, b = i.isMulti, v = ka(p), C = {};
      if (s && (p !== s.value || h !== s.options || m !== s.menuIsOpen || w !== s.inputValue)) {
        var I = m ? YC(i, v) : [], E = m ? Uc(la(i, v), "".concat(g, "-option")) : [], R = a ? XC(o, v) : null, P = KC(o, I), x = Ds(E, P);
        C = {
          selectValue: v,
          focusedOption: P,
          focusedOptionId: x,
          focusableOptionsWithIds: E,
          focusedValue: R,
          clearFocusValueOnUpdate: !1
        };
      }
      var S = l != null && i !== s ? {
        inputIsHidden: l,
        inputIsHiddenAfterUpdate: void 0
      } : {}, F = u, D = c && f;
      return c && !D && (F = {
        value: lo(b, v, v[0] || null),
        options: v,
        action: "initial-input-focus"
      }, D = !f), u?.action === "initial-input-focus" && (F = null), Fe(Fe(Fe({}, C), S), {}, {
        prevProps: i,
        ariaSelection: F,
        prevWasFocused: D
      });
    }
  }]), n;
})(d.Component);
Al.defaultProps = GC;
var JC = /* @__PURE__ */ d.forwardRef(function(e, t) {
  var n = Af(e);
  return /* @__PURE__ */ d.createElement(Al, ze({
    ref: t
  }, n));
}), gh = JC;
const QC = (e) => {
  const {
    Menu: t
  } = Fl, {
    children: n,
    ...r
  } = e;
  return d.createElement(t, {
    ...r
  }, n);
}, eS = /* @__PURE__ */ fn("div")({
  name: "Wrap",
  class: "gdg-wghi2zc",
  propsAsIs: !1
}), tS = /* @__PURE__ */ fn("div")({
  name: "PortalWrap",
  class: "gdg-p13nj8j0",
  propsAsIs: !1
}), nS = /* @__PURE__ */ fn("div")({
  name: "ReadOnlyWrap",
  class: "gdg-r6sia3g",
  propsAsIs: !1
}), rS = (e) => {
  const {
    value: t,
    onFinishedEditing: n,
    initialValue: r,
    portalElementRef: i
  } = e, {
    allowedValues: o,
    value: s
  } = t.data, [a, l] = d.useState(s), [u, c] = d.useState(r ?? ""), f = Zd(), g = d.useMemo(() => o.map((h) => typeof h == "string" || h === null || h === void 0 ? {
    value: h,
    label: h?.toString() ?? ""
  } : h), [o]);
  return t.readonly ? d.createElement(nS, null, d.createElement(ti, {
    highlight: !0,
    autoFocus: !1,
    disabled: !0,
    value: a ?? "",
    onChange: () => {
    }
  })) : d.createElement(eS, null, d.createElement(gh, {
    className: "glide-select",
    inputValue: u,
    onInputChange: c,
    menuPlacement: "auto",
    value: g.find((h) => h.value === a),
    styles: {
      control: (h) => ({
        ...h,
        border: 0,
        boxShadow: "none"
      }),
      option: (h, {
        isFocused: p
      }) => ({
        ...h,
        fontSize: f.editorFontSize,
        fontFamily: f.fontFamily,
        cursor: p ? "pointer" : void 0,
        paddingLeft: f.cellHorizontalPadding,
        paddingRight: f.cellHorizontalPadding,
        ":active": {
          ...h[":active"],
          color: f.accentFg
        },
        // Add some content in case the option is empty
        // so that the option height can be calculated correctly
        ":empty::after": {
          content: '"&nbsp;"',
          visibility: "hidden"
        }
      })
    },
    theme: (h) => ({
      ...h,
      colors: {
        ...h.colors,
        neutral0: f.bgCell,
        // this is both the background color AND the fg color of
        // the selected item because of course it is.
        neutral5: f.bgCell,
        neutral10: f.bgCell,
        neutral20: f.bgCellMedium,
        neutral30: f.bgCellMedium,
        neutral40: f.bgCellMedium,
        neutral50: f.textLight,
        neutral60: f.textMedium,
        neutral70: f.textMedium,
        neutral80: f.textDark,
        neutral90: f.textDark,
        neutral100: f.textDark,
        primary: f.accentColor,
        primary75: f.accentColor,
        primary50: f.accentColor,
        primary25: f.accentLight
        // prelight color
      }
    }),
    menuPortalTarget: i?.current ?? document.getElementById("portal"),
    autoFocus: !0,
    openMenuOnFocus: !0,
    components: {
      DropdownIndicator: () => null,
      IndicatorSeparator: () => null,
      Menu: (h) => d.createElement(tS, null, d.createElement(QC, {
        className: "click-outside-ignore",
        ...h
      }))
    },
    options: g,
    onChange: async (h) => {
      h !== null && (l(h.value), await new Promise((p) => window.requestAnimationFrame(p)), n({
        ...t,
        data: {
          ...t.data,
          value: h.value
        }
      }));
    }
  }));
}, iS = {
  kind: Z.Custom,
  isMatch: (e) => e.data.kind === "dropdown-cell",
  draw: (e, t) => {
    const {
      ctx: n,
      theme: r,
      rect: i
    } = e, {
      value: o
    } = t.data, s = t.data.allowedValues.find((l) => typeof l == "string" || l === null || l === void 0 ? l === o : l.value === o), a = typeof s == "string" ? s : s?.label ?? "";
    return a && (n.fillStyle = r.textDark, n.fillText(a, i.x + r.cellHorizontalPadding, i.y + i.height / 2 + nr(n, r))), !0;
  },
  measure: (e, t, n) => {
    const {
      value: r
    } = t.data;
    return (r ? e.measureText(r).width : 0) + n.cellHorizontalPadding * 2;
  },
  provideEditor: () => ({
    editor: rS,
    disablePadding: !0,
    deletedValue: (e) => ({
      ...e,
      copyData: "",
      data: {
        ...e.data,
        value: ""
      }
    })
  }),
  onPaste: (e, t) => ({
    ...t,
    value: t.allowedValues.some((n) => n == null ? !1 : typeof n == "string" ? n === e : n.value === e) ? e : t.value
  })
};
function oS(e, t) {
  const n = /(\d+\.?\d*)\s*(px|rem|em|%|pt)/, r = e.match(n);
  if (r) {
    const i = parseFloat(r[1]), o = r[2], s = i * t;
    return e.replace(n, `${Number(s.toPrecision(3))}${o}`);
  }
  return e;
}
const aS = {
  marginRight: 8
}, sS = {
  display: "flex",
  alignItems: "center",
  flexGrow: 1
}, lS = {
  kind: Z.Custom,
  isMatch: (e) => e.data.kind === "range-cell",
  draw: (e, t) => {
    const { ctx: n, theme: r, rect: i } = e, { min: o, max: s, value: a, label: l, measureLabel: u } = t.data, c = i.x + r.cellHorizontalPadding, f = i.y + i.height / 2, g = s - o, h = (a - o) / g, p = `${oS(r.baseFontStyle, 0.9)} ${r.fontFamily}`, w = sl(n, p) / 2;
    n.save();
    let b = 0;
    l !== void 0 && (n.font = p, b = Lr(u ?? l, n, p).width + r.cellHorizontalPadding);
    const v = i.width - r.cellHorizontalPadding * 2 - b;
    if (v >= w) {
      const C = n.createLinearGradient(c, f, c + v, f);
      C.addColorStop(0, r.accentColor), C.addColorStop(h, r.accentColor), C.addColorStop(h, r.bgBubble), C.addColorStop(1, r.bgBubble), n.beginPath(), n.fillStyle = C, kc(n, c, f - w / 2, v, w, w / 2), n.fill(), n.beginPath(), kc(n, c + 0.5, f - w / 2 + 0.5, v - 1, w - 1, (w - 1) / 2), n.strokeStyle = r.accentLight, n.lineWidth = 1, n.stroke();
    }
    return l !== void 0 && (n.textAlign = "right", n.fillStyle = r.textDark, n.fillText(l, i.x + i.width - r.cellHorizontalPadding, f + nr(n, p))), n.restore(), !0;
  },
  provideEditor: () => (e) => {
    const { data: t, readonly: n } = e.value, r = t.value.toString(), i = t.min.toString(), o = t.max.toString(), s = t.step.toString(), a = (l) => {
      e.onChange({
        ...e.value,
        data: {
          ...t,
          value: Number(l.target.value)
        }
      });
    };
    return d.createElement(
      "label",
      { style: sS },
      d.createElement("input", { style: aS, type: "range", value: r, min: i, max: o, step: s, onChange: a, disabled: n }),
      r
    );
  },
  onPaste: (e, t) => {
    let n = Number.parseFloat(e);
    return n = Number.isNaN(n) ? t.value : Math.max(t.min, Math.min(t.max, n)), {
      ...t,
      value: n
    };
  }
}, uS = /* @__PURE__ */ fn("input")({
  name: "StyledInputBox",
  class: "gdg-s1wtovjx",
  propsAsIs: !1
}), Os = (e, t, n) => {
  if (t == null)
    return "";
  n && (t = new Date(t.getTime() + n));
  const r = t.toISOString();
  switch (e) {
    case "date":
      return r.split("T")[0];
    case "datetime-local":
      return r.replace("Z", "");
    case "time":
      return r.split("T")[1].replace("Z", "");
    default:
      throw new Error(`Unknown date kind ${e}`);
  }
}, cS = (e) => {
  const t = e.value.data, {
    format: n,
    displayDate: r
  } = t, i = t.step !== void 0 && !Number.isNaN(Number(t.step)) ? Number(t.step) : void 0, o = t.timezoneOffset ? t.timezoneOffset * 60 * 1e3 : 0, s = t.min instanceof Date ? Os(n, t.min, o) : t.min, a = t.max instanceof Date ? Os(n, t.max, o) : t.max, l = Os(n, t.date, o);
  return e.value.readonly ? Bt.createElement(ti, {
    highlight: !0,
    autoFocus: !1,
    disabled: !0,
    value: r ?? "",
    onChange: () => {
    }
  }) : Bt.createElement(uS, {
    "data-testid": "date-picker-cell",
    required: !0,
    type: n,
    defaultValue: l,
    min: s,
    max: a,
    step: i,
    autoFocus: !0,
    onChange: (u) => {
      isNaN(u.target.valueAsNumber) ? e.onChange({
        ...e.value,
        data: {
          ...e.value.data,
          date: void 0
        }
      }) : e.onChange({
        ...e.value,
        data: {
          ...e.value.data,
          // use valueAsNumber because valueAsDate is null for "datetime-local"
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#technical_summary
          date: new Date(u.target.valueAsNumber - o)
        }
      });
    }
  });
}, dS = {
  kind: Z.Custom,
  isMatch: (e) => e.data.kind === "date-picker-cell",
  draw: (e, t) => {
    const {
      displayDate: n
    } = t.data;
    return al(e, n, t.contentAlign), !0;
  },
  measure: (e, t, n) => {
    const {
      displayDate: r
    } = t.data;
    return e.measureText(r).width + n.cellHorizontalPadding * 2;
  },
  provideEditor: () => ({
    editor: cS
  }),
  onPaste: (e, t) => {
    let n = NaN;
    return e && (n = Number(e).valueOf(), Number.isNaN(n) && (n = Date.parse(e), t.format === "time" && Number.isNaN(n) && (n = Date.parse(`1970-01-01T${e}Z`)))), {
      ...t,
      date: Number.isNaN(n) ? void 0 : new Date(n)
    };
  }
};
var fS = ["allowCreateWhileLoading", "createOptionPosition", "formatCreateLabel", "isValidNewOption", "getNewOptionData", "onCreateOption", "options", "onChange"], qc = function() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, i = String(t).toLowerCase(), o = String(r.getOptionValue(n)).toLowerCase(), s = String(r.getOptionLabel(n)).toLowerCase();
  return o === i || s === i;
}, Ps = {
  formatCreateLabel: function(t) {
    return 'Create "'.concat(t, '"');
  },
  isValidNewOption: function(t, n, r, i) {
    return !(!t || n.some(function(o) {
      return qc(t, o, i);
    }) || r.some(function(o) {
      return qc(t, o, i);
    }));
  },
  getNewOptionData: function(t, n) {
    return {
      label: n,
      value: t,
      __isNew__: !0
    };
  }
};
function hS(e) {
  var t = e.allowCreateWhileLoading, n = t === void 0 ? !1 : t, r = e.createOptionPosition, i = r === void 0 ? "last" : r, o = e.formatCreateLabel, s = o === void 0 ? Ps.formatCreateLabel : o, a = e.isValidNewOption, l = a === void 0 ? Ps.isValidNewOption : a, u = e.getNewOptionData, c = u === void 0 ? Ps.getNewOptionData : u, f = e.onCreateOption, g = e.options, h = g === void 0 ? [] : g, p = e.onChange, m = lr(e, fS), w = m.getOptionValue, b = w === void 0 ? ah : w, v = m.getOptionLabel, C = v === void 0 ? oh : v, I = m.inputValue, E = m.isLoading, R = m.isMulti, P = m.value, x = m.name, S = d.useMemo(function() {
    return l(I, ka(P), h, {
      getOptionValue: b,
      getOptionLabel: C
    }) ? c(I, s(I)) : void 0;
  }, [s, c, C, b, I, l, h, P]), F = d.useMemo(function() {
    return (n || !E) && S ? i === "first" ? [S].concat(Oi(h)) : [].concat(Oi(h), [S]) : h;
  }, [n, i, E, S, h]), D = d.useCallback(function(M, T) {
    if (T.action !== "select-option")
      return p(M, T);
    var O = Array.isArray(M) ? M : [M];
    if (O[O.length - 1] === S) {
      if (f) f(I);
      else {
        var k = c(I, I), N = {
          action: "create-option",
          name: x,
          option: k
        };
        p(lo(R, [].concat(Oi(ka(P)), [k]), k), N);
      }
      return;
    }
    p(M, T);
  }, [c, I, R, x, S, f, p, P]);
  return Fe(Fe({}, m), {}, {
    options: F,
    onChange: D
  });
}
var gS = /* @__PURE__ */ d.forwardRef(function(e, t) {
  var n = Af(e), r = hS(n);
  return /* @__PURE__ */ d.createElement(Al, ze({
    ref: t
  }, r));
}), pS = gS;
const Hl = "__value", mS = new RegExp(`^${Hl}\\d+__`), vS = /* @__PURE__ */ fn("div")({
  name: "Wrap",
  class: "gdg-w1i61rz",
  propsAsIs: !1
}), bS = /* @__PURE__ */ fn("div")({
  name: "PortalWrap",
  class: "gdg-phbadu4",
  propsAsIs: !1
}), ua = (e) => e.map((t) => typeof t == "string" || t === null || t === void 0 ? {
  value: t,
  label: t ?? "",
  color: void 0
} : {
  value: t.value,
  label: t.label ?? t.value ?? "",
  color: t.color ?? void 0
}), ph = (e, t, n) => e == null ? [] : e.map((r, i) => {
  const o = n ? `${Hl}${i}__` : "", s = t.find((a) => a.value === r);
  return s ? {
    ...s,
    value: `${o}${s.value}`
  } : {
    value: `${o}${r}`,
    label: r
  };
}), wS = (e) => {
  const {
    Menu: t
  } = Fl, {
    children: n,
    ...r
  } = e;
  return d.createElement(t, {
    ...r
  }, n);
}, yS = (e) => {
  const {
    value: t,
    initialValue: n,
    onChange: r,
    onFinishedEditing: i,
    portalElementRef: o
  } = e, {
    options: s,
    values: a,
    allowCreation: l,
    allowDuplicates: u
  } = t.data, c = Zd(), [f, g] = d.useState(a), [h, p] = d.useState(!0), [m, w] = d.useState(n ?? ""), b = d.useMemo(() => ua(s ?? []), [s]), v = l && u && b.length === 0, C = d.useCallback((x) => {
    h && x.stopPropagation();
  }, [h]), I = {
    control: (x, S) => ({
      ...x,
      border: 0,
      boxShadow: "none",
      backgroundColor: c.bgCell,
      // Allow interaction (e.g. wheel scrolling) even when the select is disabled
      pointerEvents: S.isDisabled ? "auto" : x.pointerEvents,
      cursor: S.isDisabled ? "default" : x.cursor
    }),
    valueContainer: (x) => ({
      ...x,
      // Keep default wrapping so multiple chips can move to new lines
      flexWrap: x.flexWrap ?? "wrap",
      overflowX: "auto",
      overflowY: "hidden"
    }),
    menu: (x) => ({
      ...x,
      backgroundColor: c.bgCell
    }),
    option: (x, S) => ({
      ...x,
      fontSize: c.editorFontSize,
      fontFamily: c.fontFamily,
      color: c.textDark,
      ...S.isFocused ? {
        backgroundColor: c.accentLight,
        cursor: "pointer"
      } : {},
      ":active": {
        ...x[":active"],
        color: c.accentFg,
        backgroundColor: c.accentColor
      }
    }),
    input: (x, {
      isDisabled: S
    }) => S ? {
      display: "none"
    } : {
      ...x,
      fontSize: c.editorFontSize,
      fontFamily: c.fontFamily,
      color: c.textDark
    },
    placeholder: (x) => ({
      ...x,
      fontSize: c.editorFontSize,
      fontFamily: c.fontFamily,
      color: c.textLight
    }),
    noOptionsMessage: (x) => ({
      ...x,
      fontSize: c.editorFontSize,
      fontFamily: c.fontFamily,
      color: c.textLight
    }),
    clearIndicator: (x) => ({
      ...x,
      color: c.textLight,
      ":hover": {
        color: c.textDark,
        cursor: "pointer"
      }
    }),
    multiValue: (x, {
      data: S
    }) => ({
      ...x,
      backgroundColor: S.color ?? c.bgBubble,
      borderRadius: `${c.roundingRadius ?? c.bubbleHeight / 2}px`,
      flexShrink: 0,
      whiteSpace: "nowrap"
    }),
    multiValueLabel: (x, {
      data: S,
      isDisabled: F
    }) => ({
      ...x,
      paddingRight: F ? c.bubblePadding : 0,
      paddingLeft: c.bubblePadding,
      paddingTop: 0,
      paddingBottom: 0,
      color: S.color ? (
        // If a color is set for this option,
        // we use it to determine the text color.
        zs(S.color) > 0.5 ? "black" : "white"
      ) : c.textBubble,
      fontSize: c.editorFontSize,
      fontFamily: c.fontFamily,
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      height: c.bubbleHeight,
      whiteSpace: "nowrap"
    }),
    multiValueRemove: (x, {
      data: S,
      isDisabled: F,
      isFocused: D
    }) => F ? {
      display: "none"
    } : {
      ...x,
      color: S.color ? (
        // If a color is set for this option,
        // we use it to determine the text color.
        zs(S.color) > 0.5 ? "black" : "white"
      ) : c.textBubble,
      backgroundColor: void 0,
      borderRadius: D ? `${c.roundingRadius ?? c.bubbleHeight / 2}px` : void 0,
      ":hover": {
        cursor: "pointer"
      }
    }
  }, E = d.useCallback((x) => {
    const S = x.map((F) => u && F.startsWith(Hl) ? F.replace(new RegExp(mS), "") : F);
    g(S), r({
      ...t,
      data: {
        ...t.data,
        values: S
      }
    });
  }, [t, r, u]), R = (x) => {
    switch (x.key) {
      case "Enter":
      case "Tab":
        if (!m) {
          i(t, [0, 1]);
          return;
        }
        u && l && (w(""), E([...f ?? [], m]), p(!1), x.preventDefault());
    }
  }, P = l ? pS : gh;
  return d.createElement(vS, {
    onKeyDown: C,
    "data-testid": "multi-select-cell"
  }, d.createElement(P, {
    className: "gdg-multi-select",
    isMulti: !0,
    isDisabled: t.readonly,
    isClearable: !0,
    isSearchable: !0,
    inputValue: m,
    onInputChange: w,
    options: b,
    placeholder: t.readonly ? "" : l ? "Add..." : void 0,
    noOptionsMessage: (x) => l && u && x.inputValue ? `Create "${x.inputValue}"` : void 0,
    menuIsOpen: t.readonly ? !1 : h,
    onMenuOpen: () => p(!0),
    onMenuClose: () => p(!1),
    value: ph(f, b, u),
    onKeyDown: t.readonly ? void 0 : R,
    menuPlacement: "auto",
    menuPortalTarget: o?.current ?? document.getElementById("portal"),
    autoFocus: !0,
    openMenuOnFocus: !0,
    openMenuOnClick: !0,
    closeMenuOnSelect: !0,
    backspaceRemovesValue: !0,
    escapeClearsValue: !1,
    styles: I,
    components: {
      DropdownIndicator: () => null,
      IndicatorSeparator: () => null,
      Menu: (x) => v ? null : d.createElement(bS, null, d.createElement(wS, {
        className: "click-outside-ignore",
        ...x
      }))
    },
    onChange: async (x) => {
      x !== null && E(x.map((S) => S.value));
    }
  }));
}, CS = {
  kind: Z.Custom,
  isMatch: (e) => e.data.kind === "multi-select-cell",
  draw: (e, t) => {
    const {
      ctx: n,
      theme: r,
      rect: i,
      highlighted: o
    } = e, {
      values: s,
      options: a
    } = t.data;
    if (s == null)
      return !0;
    const l = ua(a ?? []), u = {
      x: i.x + r.cellHorizontalPadding,
      y: i.y + r.cellVerticalPadding,
      width: i.width - 2 * r.cellHorizontalPadding,
      height: i.height - 2 * r.cellVerticalPadding
    }, c = Math.max(1, Math.floor(u.height / (r.bubbleHeight + r.bubblePadding)));
    let {
      x: f
    } = u, g = 1, h = c === 1 ? u.y + (u.height - r.bubbleHeight) / 2 : u.y + (u.height - c * r.bubbleHeight - (c - 1) * r.bubblePadding) / 2;
    for (const p of s) {
      const m = l.find((E) => E.value === p), w = m?.color ?? (o ? r.bgBubbleSelected : r.bgBubble), b = m?.label ?? p, C = Lr(b, n).width + r.bubblePadding * 2, I = r.bubbleHeight / 2;
      if (f !== u.x && f + C > u.x + u.width && g < c && (g++, h += r.bubbleHeight + r.bubblePadding, f = u.x), n.fillStyle = w, n.beginPath(), er(n, f, h, C, r.bubbleHeight, r.roundingRadius ?? r.bubbleHeight / 2), n.fill(), n.fillStyle = m?.color ? zs(w) > 0.5 ? "#000000" : "#ffffff" : r.textBubble, n.fillText(b, f + r.bubblePadding, h + I + nr(n, r)), f += C + r.bubbleMargin, f > u.x + u.width + r.cellHorizontalPadding && g >= c)
        break;
    }
    return !0;
  },
  measure: (e, t, n) => {
    const {
      values: r,
      options: i
    } = t.data;
    if (!r)
      return n.cellHorizontalPadding * 2;
    const o = ph(r, ua(i ?? []), t.data.allowDuplicates).map((a) => a.label ?? a.value), s = o.reduce((a, l) => e.measureText(l).width + a + n.bubblePadding * 2 + n.bubbleMargin, 0);
    return o.length === 0 ? n.cellHorizontalPadding * 2 : s + 2 * n.cellHorizontalPadding - n.bubbleMargin;
  },
  provideEditor: () => ({
    editor: yS,
    disablePadding: !0,
    deletedValue: (e) => ({
      ...e,
      copyData: "",
      data: {
        ...e.data,
        values: []
      }
    })
  }),
  onPaste: (e, t) => {
    if (!e || !e.trim())
      return {
        ...t,
        values: []
      };
    let n = e.split(",").map((r) => r.trim());
    if (t.allowDuplicates || (n = n.filter((r, i) => n.indexOf(r) === i)), !t.allowCreation) {
      const r = ua(t.options ?? []);
      n = n.filter((i) => r.find((o) => o.value === i));
    }
    if (n.length !== 0)
      return {
        ...t,
        values: n
      };
  }
}, SS = "None";
function Gc(e, t, n) {
  e.save(), e.beginPath(), e.moveTo(t.x + t.width - n.cellHorizontalPadding, t.y + 1), e.lineTo(t.x + t.width, t.y + 1), e.lineTo(t.x + t.width, t.y + 1 + n.cellHorizontalPadding), e.fillStyle = n.accentColor, e.fill(), e.restore();
}
const xS = (e) => {
  const {
    cell: t,
    theme: n,
    ctx: r
  } = e;
  al({
    ...e,
    theme: {
      ...n,
      textDark: n.textLight,
      headerFontFull: `${n.headerFontStyle} ${n.fontFamily}`,
      baseFontFull: `${n.baseFontStyle} ${n.fontFamily}`,
      markerFontFull: `${n.markerFontStyle} ${n.fontFamily}`
    }
  }, SS, t.contentAlign), r.fillStyle = n.textDark;
};
function kS(e) {
  const t = d.useCallback((r, i) => {
    const {
      cell: o,
      theme: s,
      ctx: a,
      rect: l
    } = r, u = r.col;
    if (Pi(o))
      Gc(a, l, s);
    else if (gl(o) && u < e.length) {
      const c = e[u];
      ["checkbox", "line_chart", "bar_chart", "progress"].includes(c.kind) ? i() : xS(r), c.isRequired && c.isEditable && Gc(a, l, s);
      return;
    }
    i();
  }, [e]), n = d.useMemo(
    () => [tw, iS, lS, dS, CS, ...E1],
    // This doesn't change during the lifetime of the component,
    // so we can just run it once at creation time.
    []
  );
  return {
    drawCell: t,
    customRenderers: n
  };
}
function MS() {
  const e = Qr();
  return d.useMemo(() => {
    const n = {
      // Material design icon `edit_note`:
      // https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Aedit_note%3AFILL%400%3Bwght%40400%3BGRAD%400%3Bopsz%4048
      // We need to provide this as string as explained explained here: https://github.com/glideapps/glide-data-grid/blob/main/packages/core/API.md#headericons
      editable: (i) => `<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40" fill="${i.bgColor}"><path d="m800.641 679.743-64.384-64.384 29-29q7.156-6.948 17.642-6.948 10.485 0 17.742 6.948l29 29q6.948 7.464 6.948 17.95 0 10.486-6.948 17.434l-29 29Zm-310.64 246.256v-64.383l210.82-210.821 64.384 64.384-210.821 210.82h-64.383Zm-360-204.872v-50.254h289.743v50.254H130.001Zm0-162.564v-50.255h454.615v50.255H130.001Zm0-162.307v-50.255h454.615v50.255H130.001Z"/></svg>`
    };
    return {
      glideTheme: {
        // Explanations: https://github.com/glideapps/glide-data-grid/blob/main/packages/core/API.md#theme
        accentColor: e.colors.primary,
        accentFg: e.colors.white,
        accentLight: ki(e.colors.primary, 0.9),
        borderColor: e.colors.dataframeBorderColor,
        horizontalBorderColor: e.colors.dataframeBorderColor,
        fontFamily: e.genericFonts.bodyFont,
        bgSearchResult: ki(e.colors.primary, 0.9),
        resizeIndicatorColor: e.colors.primary,
        // Header styling:
        bgIconHeader: e.colors.fadedText60,
        fgIconHeader: e.colors.white,
        bgHeader: e.colors.dataframeHeaderBackgroundColor,
        bgHeaderHasFocus: ki(e.colors.darkenedBgMix100, 0.9),
        bgHeaderHovered: ki(e.colors.darkenedBgMix100, 0.9),
        textHeader: e.colors.fadedText60,
        textHeaderSelected: e.colors.white,
        textGroupHeader: e.colors.fadedText60,
        headerIconSize: Math.round(an("1.125rem")),
        headerFontStyle: `${e.fontWeights.normal} ${an(e.fontSizes.sm)}px`,
        // Cell styling:
        baseFontStyle: `${e.fontWeights.normal} ${an(e.fontSizes.sm)}px`,
        editorFontSize: e.fontSizes.sm,
        textDark: e.colors.bodyText,
        textMedium: ki(e.colors.bodyText, 0.2),
        textLight: e.colors.fadedText40,
        bgCell: e.colors.bgColor,
        // uses same as bgCell to always have the same background color:
        bgCellMedium: e.colors.bgColor,
        cellHorizontalPadding: Math.round(an(e.spacing.sm)),
        cellVerticalPadding: Math.round(an("0.1875rem")),
        // Special cells:
        textBubble: e.colors.fadedText60,
        bgBubble: e.colors.secondaryBg,
        bgBubbleSelected: fp(e.colors.secondaryBg, 0.1),
        bubbleHeight: Math.round(an("1.25rem")),
        bubblePadding: Math.round(an(e.spacing.sm)),
        bubbleMargin: Math.round(an(e.spacing.twoXS)),
        linkColor: e.colors.link,
        drilldownBorder: e.colors.darkenedBgMix25,
        checkboxMaxSize: Math.round(an(e.sizes.checkbox))
        // Unused settings:
        // lineHeight
        // markerFontStyle: string;
        // headerBottomBorderColor?: string;
      },
      tableBorderRadius: e.radii.default,
      tableBorderWidth: 1,
      // glide-data-grid can only handle integer pixel values:
      defaultTableHeight: Math.round(an("25rem")),
      minColumnWidth: Math.round(an("3.125rem")),
      maxColumnWidth: Math.round(an("62.5rem")),
      maxColumnAutoWidth: Math.round(an("31.25rem")),
      defaultRowHeight: Math.round(an("2.1875rem")),
      defaultHeaderHeight: Math.round(an("2.1875rem")),
      bgRowHovered: hp(e.colors.bgColor, e.colors.secondaryBg, 0.3),
      headerIcons: n
    };
  }, [e]);
}
const RS = Js.getLogger("useDataEditor");
function ES(e, t, n, r, i, o, s, a, l) {
  const u = d.useCallback(([m, w], b) => {
    const v = e[m];
    if (!v.isEditable)
      return;
    const C = v.indexNumber, I = n.current.getOriginalRowIndex(i(w)), E = r([m, w]), R = v.getCellValue(E), P = v.getCellValue(b);
    if (!Pi(E) && P === R)
      return;
    const x = v.getCell(P, !0);
    Pi(x) ? RS.warn(`Not applying the cell edit since it causes this error:
 ${x.data}`) : (n.current.setCell(C, I, {
      ...x,
      lastUpdated: performance.now()
    }), a());
  }, [e, n, i, r, a]), c = d.useCallback(() => {
    if (t)
      return;
    const m = /* @__PURE__ */ new Map();
    e.forEach((w) => {
      m.set(w.indexNumber, w.getCell(w.defaultValue));
    }), n.current.addRow(m), s();
  }, [e, n, t, s]), f = d.useCallback(() => {
    t || (c(), a());
  }, [c, a, t]), g = d.useCallback((m) => {
    if (m.rows.length > 0) {
      if (t)
        return !0;
      const w = m.rows.toArray().map((b) => n.current.getOriginalRowIndex(i(b)));
      return n.current.deleteRows(w), s(), l(), a(), !1;
    }
    if (m.current?.range) {
      const w = [], b = m.current.range;
      for (let v = b.y; v < b.y + b.height; v++)
        for (let C = b.x; C < b.x + b.width; C++) {
          const I = e[C];
          I.isEditable && !I.isRequired && (w.push({
            cell: [C, v]
          }), u([C, v], I.getCell(null)));
        }
      return w.length > 0 && (a(), o(w)), !1;
    }
    return !0;
  }, [e, n, t, o, i, a, u, l, s]), h = d.useCallback((m, w) => {
    const [b, v] = m, C = [];
    for (let I = 0; I < w.length; I++) {
      const E = w[I];
      if (I + v >= n.current.getNumRows()) {
        if (t)
          break;
        c();
      }
      for (let R = 0; R < E.length; R++) {
        const P = E[R], x = I + v, S = R + b;
        if (S >= e.length)
          break;
        const F = e[S];
        if (F.isEditable) {
          const D = F.getCell(P, !0);
          if (st(D) && !Pi(D)) {
            const M = F.indexNumber, T = n.current.getOriginalRowIndex(i(x)), O = F.getCellValue(r([S, x]));
            F.getCellValue(D) !== O && (n.current.setCell(M, T, {
              ...D,
              lastUpdated: performance.now()
            }), C.push({
              cell: [S, x]
            }));
          }
        }
      }
      C.length > 0 && (a(), o(C));
    }
    return !1;
  }, [e, n, t, i, r, c, a, o]), p = d.useCallback((m, w) => {
    const b = m[0];
    if (b >= e.length)
      return !0;
    const v = e[b];
    if (v.validateInput) {
      const C = v.validateInput(v.getCellValue(w));
      return C === !0 || C === !1 ? C : v.getCell(C);
    }
    return !0;
  }, [e]);
  return {
    onCellEdited: u,
    onPaste: h,
    onRowAppended: f,
    onDelete: g,
    validateCell: p
  };
}
const mh = ",", uo = '"', IS = '"', vh = `
`, TS = "\uFEFF", DS = new RegExp(`[${[mh, uo, vh].join("")}]`), Yc = Js.getLogger("useDataExporter");
function Xc(e) {
  return e.map((t) => OS(t)).join(mh) + vh;
}
function OS(e) {
  if (Pe(e))
    return "";
  const t = lt(e);
  return DS.test(t) ? `${uo}${t.replace(
    // Escape all quote chars if inside a quoted string:
    new RegExp(uo, "g"),
    IS + uo
  )}${uo}` : t;
}
async function Kc(e, t, n, r) {
  const i = new TextEncoder();
  await e.write(i.encode(TS));
  const o = n.map((s) => s.name);
  await e.write(i.encode(Xc(o)));
  for (let s = 0; s < r; s++) {
    const a = [];
    n.forEach((l, u, c) => {
      a.push(l.getCellValue(t([u, s])));
    }), await e.write(i.encode(Xc(a)));
  }
  await e.close();
}
function PS(e, t, n, r) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    exportToCsv: d.useCallback(async () => {
      const s = `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace(":", "-")}_export.csv`;
      try {
        const u = await (await (await import("./es6--XPcqeHG.js").then((c) => c.a)).showSaveFilePicker({
          suggestedName: s,
          types: [{
            accept: {
              "text/csv": [".csv"]
            }
          }],
          excludeAcceptAllOption: !1
        })).createWritable();
        await Kc(u, e, t, n);
      } catch (a) {
        if (a instanceof Error && a.name === "AbortError")
          return;
        try {
          Yc.warn("Failed to export data as CSV with FileSystem API, trying fallback method", a);
          let l = "";
          const u = new WritableStream({
            write: (h) => {
              l += new TextDecoder("utf-8").decode(h);
            },
            close: async () => {
            }
          });
          await Kc(u.getWriter(), e, t, n);
          const c = new Blob([l], {
            type: "text/csv;charset=utf-8;"
          }), f = URL.createObjectURL(c), g = Dp({
            enforceDownloadInNewTab: r,
            url: f,
            filename: s
          });
          g.style.display = "none", document.body.appendChild(g), g.click(), document.body.removeChild(g), URL.revokeObjectURL(f);
        } catch (l) {
          Yc.error("Failed to export data as CSV", l);
        }
      }
    }, [t, n, e, r])
  };
}
function LS(e, t, n, r) {
  return {
    getCellContent: d.useCallback(([o, s]) => {
      if (o > t.length - 1)
        return Dt("Column index out of bounds", "This error should never happen. Please report this bug.");
      if (s > n - 1)
        return Dt("Row index out of bounds", "This error should never happen. Please report this bug.");
      try {
        const a = t[o], l = a.indexNumber, u = r.current.getOriginalRowIndex(s), c = r.current.isAddedRow(u);
        if (a.isEditable || c) {
          const h = r.current.getCell(l, u);
          if (st(h))
            return {
              ...a.getCell(a.getCellValue(h), !1),
              // Apply the last updated timestamp stored in the edited cell:
              lastUpdated: h.lastUpdated
            };
          if (c)
            return Dt("Error during cell creation", `This error should never happen. Please report this bug. No cell found for an added row: col=${l}; row=${u}`);
        }
        const f = e.getCell(u, l), g = gp(e, u, l);
        return H1(a, f, g, e.styler?.cssStyles);
      } catch (a) {
        return Dt(
          "Error during cell creation",
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `This error should never happen. Please report this bug. 
Error: ${a}`
        );
      }
    }, [t, n, e, r])
  };
}
function FS(e) {
  const [t, n] = d.useState(void 0), r = d.useCallback((o) => {
    if (o.kind !== "cell")
      n(void 0);
    else {
      const [, s] = o.location;
      n(s);
    }
  }, [n]);
  return {
    getRowThemeOverride: d.useCallback((o) => {
      if (o === t)
        return {
          bgCell: e.bgRowHovered,
          bgCellMedium: e.bgRowHovered
        };
    }, [e.bgRowHovered, t]),
    onItemHovered: r
  };
}
function _S(e, t, n, r, i) {
  const [o, s] = d.useState({
    columns: Qe.empty(),
    rows: Qe.empty(),
    current: void 0
  }), a = !t && !n && (e.selectionMode.includes(sn.SelectionMode.MULTI_ROW) || e.selectionMode.includes(sn.SelectionMode.SINGLE_ROW)), l = a && e.selectionMode.includes(sn.SelectionMode.MULTI_ROW), u = !t && !n && (e.selectionMode.includes(sn.SelectionMode.SINGLE_COLUMN) || e.selectionMode.includes(sn.SelectionMode.MULTI_COLUMN)), c = u && e.selectionMode.includes(sn.SelectionMode.MULTI_COLUMN), f = !t && !n && (e.selectionMode.includes(sn.SelectionMode.SINGLE_CELL) || e.selectionMode.includes(sn.SelectionMode.MULTI_CELL)), g = f && e.selectionMode.includes(sn.SelectionMode.MULTI_CELL), h = o.rows.length > 0, p = o.columns.length > 0, m = o.current !== void 0, w = d.useCallback((v) => {
    const C = !ns(v.rows.toArray(), o.rows.toArray()), I = !ns(v.columns.toArray(), o.columns.toArray()), E = !ns(v.current, o.current), R = a && C || u && I || f && E;
    let P = v;
    if (I && P.columns.length >= 0) {
      let x = P.columns;
      r.forEach((S, F) => {
        S.isIndex && (x = x.remove(F));
      }), x.length < P.columns.length && (P = {
        ...P,
        columns: x
      });
    }
    s(P), R && i(P, f);
  }, [o, a, u, f, i, r]), b = d.useCallback((v = !1, C = !1) => {
    const I = {
      columns: C ? o.columns : Qe.empty(),
      rows: v ? o.rows : Qe.empty(),
      current: void 0
    };
    s(I), (!v && a || !C && u || f) && i(I, f);
  }, [o, a, u, f, i]);
  return {
    gridSelection: o,
    isRowSelectionActivated: a,
    isMultiRowSelectionActivated: l,
    isColumnSelectionActivated: u,
    isMultiColumnSelectionActivated: c,
    isCellSelectionActivated: f,
    isMultiCellSelectionActivated: g,
    isRowSelected: h,
    isColumnSelected: p,
    isCellSelected: m,
    clearSelection: b,
    processSelectionChange: w
  };
}
function AS(e, t, n, r, i, o, s, a, l) {
  const u = e.rowHeight ?? t.defaultRowHeight, c = t.defaultHeaderHeight + u + 2 * t.tableBorderWidth, f = r ? 2 : 1, g = e.editingMode === sn.EditingMode.DYNAMIC ? 1 : 0, h = n + g;
  let p = Math.max(h * u + f * t.defaultHeaderHeight + 2 * t.tableBorderWidth, c), m = Math.min(p, t.defaultTableHeight);
  const w = V1(e, l);
  w && (m = Math.max(w, c), p = Math.max(w, p)), o && (m = Math.min(m, o), p = Math.min(p, o), w || (m = p));
  const b = t.minColumnWidth + 2 * t.tableBorderWidth, v = Math.max(i, b);
  let C, I = v;
  const E = Lf(e, a), R = Ff(e, a), P = z1(a);
  E ? C = v : R ? (C = Math.min(Math.max(R, b), v), I = Math.min(Math.max(R, I), v)) : P && (C = void 0);
  const [x, S] = d.useState({
    // If user hasn't specified a width via `width` or `use_container_width`,
    // we configure the table to 100%. Which will cause the data grid to
    // calculate the best size on the content and use that.
    width: C || "100%",
    height: m
  });
  return d.useLayoutEffect(() => {
    E && x.width === "100%" && S((F) => ({
      ...F,
      width: v
    }));
  }, [v]), d.useLayoutEffect(() => {
    S((F) => ({
      ...F,
      width: C || "100%"
    }));
  }, [C]), d.useLayoutEffect(() => {
    S((F) => ({
      ...F,
      height: m
    }));
  }, [m, n]), d.useLayoutEffect(() => {
    if (s) {
      const F = E || st(R) && R > 0;
      S({
        width: F ? I : "100%",
        height: p
      });
    } else
      S({
        width: C || "100%",
        height: m
      });
  }, [s]), {
    minHeight: c,
    maxHeight: p,
    minWidth: b,
    maxWidth: I,
    rowHeight: u,
    resizableSize: x,
    setResizableSize: S
  };
}
const HS = 600, zS = "⚠️ Please fill out this cell.";
function VS(e, t, n = []) {
  const [r, i] = d.useState(), o = d.useRef(null), s = d.useCallback((l) => {
    if (clearTimeout(o.current), o.current = 0, i(void 0), (l.kind === "header" || l.kind === "cell") && l.location) {
      const u = l.location[0], c = l.location[1];
      let f;
      if (u < 0 || u >= e.length || n.includes(c))
        return;
      const g = e[u];
      if (l.kind === "header" && st(g))
        f = g.help;
      else if (l.kind === "cell") {
        const h = t([u, c]);
        Pi(h) ? f = h.errorDetails : g.isRequired && g.isEditable && gl(h) ? f = zS : c1(h) && (f = h.tooltip);
      }
      f && (o.current = setTimeout(() => {
        f && i({
          content: f,
          left: l.bounds.x + l.bounds.width / 2,
          top: l.bounds.y
        });
      }, HS));
    }
  }, [e, t, i, o, n]), a = d.useCallback(() => {
    i(void 0);
  }, [i]);
  return {
    tooltip: r,
    clearTooltip: a,
    onItemHovered: s
  };
}
const bh = /* @__PURE__ */ tr("div", {
  target: "e1hnsd047"
})(({
  theme: e
}) => ({
  paddingTop: e.spacing.xs,
  paddingBottom: e.spacing.xs
}), ""), Tr = /* @__PURE__ */ tr("div", {
  target: "e1hnsd046"
})(({
  theme: e,
  isActive: t,
  hasSubmenu: n
}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: e.spacing.sm,
  paddingLeft: e.spacing.sm,
  paddingRight: e.spacing.sm,
  paddingTop: e.spacing.twoXS,
  paddingBottom: e.spacing.twoXS,
  cursor: "pointer",
  backgroundColor: t ? e.colors.darkenedBgMix15 : void 0,
  "&:hover": {
    backgroundColor: e.colors.darkenedBgMix15
  },
  minWidth: e.sizes.minMenuWidth,
  // If the submenu is activated, we need to place the menu icon & label to the left
  // and the submenu indicator to the right:
  ...n && {
    justifyContent: "space-between",
    "& > :first-of-type": {
      display: "flex",
      alignItems: "center",
      gap: e.spacing.sm
    }
  }
}), ""), wh = /* @__PURE__ */ tr("div", {
  target: "e1hnsd045"
})(({
  theme: e
}) => ({
  height: e.sizes.borderWidth,
  backgroundColor: e.colors.borderColor,
  marginTop: e.spacing.xs,
  marginBottom: e.spacing.xs
}), ""), $S = /* @__PURE__ */ tr("div", {
  target: "e1hnsd044"
})(({
  theme: e
}) => ({
  display: "flex",
  alignItems: "center",
  padding: `${e.spacing.sm} ${e.spacing.sm}`,
  cursor: "default",
  gap: e.spacing.twoXS
}), ""), NS = /* @__PURE__ */ tr("div", {
  target: "e1hnsd043"
})(({
  theme: e
}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: e.spacing.twoXS,
  border: `${e.sizes.borderWidth} solid ${e.colors.borderColor}`,
  borderRadius: e.radii.md,
  backgroundColor: "transparent",
  color: e.colors.bodyText,
  height: "fit-content"
}), ""), BS = /* @__PURE__ */ tr("div", {
  target: "e1hnsd042"
})(({
  theme: e
}) => ({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
  padding: `${e.spacing.threeXS} ${e.spacing.threeXS}`,
  border: `${e.sizes.borderWidth} solid ${e.colors.borderColor}`,
  borderRadius: e.radii.md,
  backgroundColor: e.colors.secondaryBg,
  minWidth: 0,
  overflow: "hidden"
}), ""), WS = /* @__PURE__ */ tr("span", {
  target: "e1hnsd041"
})(({
  theme: e
}) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  flexGrow: 1,
  margin: `0 ${e.spacing.xs}`,
  fontSize: e.fontSizes.twoSm,
  maxWidth: "4rem"
}), ""), US = /* @__PURE__ */ tr("button", {
  target: "e1hnsd040"
})(({
  theme: e
}) => ({
  background: "none",
  border: "none",
  padding: e.spacing.twoXS,
  cursor: "pointer",
  color: e.colors.bodyText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: e.radii.md,
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: e.colors.fadedText05
  },
  "&:active": {
    backgroundColor: e.colors.fadedText10
  }
}), ""), Zc = [{
  format: "",
  label: "Automatic",
  icon: ":material/123:"
}, {
  format: "localized",
  label: "Localized",
  icon: ":material/translate:"
}, {
  format: "plain",
  label: "Plain",
  icon: ":material/speed_1_75:"
}, {
  format: "compact",
  label: "Compact",
  icon: ":material/1k:"
}, {
  format: "dollar",
  label: "Dollar",
  icon: ":material/attach_money:"
}, {
  format: "euro",
  label: "Euro",
  icon: ":material/euro:"
}, {
  format: "yen",
  label: "Yen",
  icon: ":material/currency_yen:"
}, {
  format: "percent",
  label: "Percent",
  icon: ":material/percent:"
}, {
  format: "scientific",
  label: "Scientific",
  icon: ":material/experiment:"
}, {
  format: "accounting",
  label: "Accounting",
  icon: ":material/finance_chip:"
}], jS = {
  number: Zc,
  progress: Zc,
  datetime: [{
    format: "",
    label: "Automatic",
    icon: ":material/schedule:"
  }, {
    format: "localized",
    label: "Localized",
    icon: ":material/translate:"
  }, {
    format: "distance",
    label: "Distance",
    icon: ":material/search_activity:"
  }, {
    format: "calendar",
    label: "Calendar",
    icon: ":material/today:"
  }],
  date: [{
    format: "",
    label: "Automatic",
    icon: ":material/schedule:"
  }, {
    format: "localized",
    label: "Localized",
    icon: ":material/translate:"
  }, {
    format: "distance",
    label: "Distance",
    icon: ":material/search_activity:"
  }],
  time: [{
    format: "",
    label: "Automatic",
    icon: ":material/schedule:"
  }, {
    format: "localized",
    label: "Localized",
    icon: ":material/translate:"
  }]
};
function qS({
  columnKind: e,
  isOpen: t,
  onMouseEnter: n,
  onMouseLeave: r,
  onChangeFormat: i,
  onCloseMenu: o,
  children: s
}) {
  const a = Qr(), {
    colors: l,
    fontSizes: u,
    radii: c,
    fontWeights: f
  } = a, g = jS[e] || [];
  return g.length === 0 ? /* @__PURE__ */ me.jsx(me.Fragment, {}) : /* @__PURE__ */ me.jsx(Ea, { triggerType: gd.hover, returnFocus: !0, autoFocus: !0, focusLock: !0, isOpen: t, onMouseEnter: n, onMouseLeave: r, ignoreBoundary: !0, content: /* @__PURE__ */ me.jsx(bh, { role: "menu", children: g.map((h) => /* @__PURE__ */ me.jsxs(Tr, { onClick: () => {
    i(h.format), o();
  }, role: "menuitem", children: [
    /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: h.icon }),
    h.label
  ] }, h.format)) }), placement: Ia.right, showArrow: !1, popoverMargin: 2, overrides: {
    Body: {
      props: {
        "data-testid": "stDataFrameColumnFormattingMenu"
      },
      style: {
        borderTopLeftRadius: c.default,
        borderTopRightRadius: c.default,
        borderBottomLeftRadius: c.default,
        borderBottomRightRadius: c.default,
        paddingTop: "0 !important",
        paddingBottom: "0 !important",
        paddingLeft: "0 !important",
        paddingRight: "0 !important",
        backgroundColor: "transparent",
        border: `${a.sizes.borderWidth} solid ${a.colors.borderColor}`
      }
    },
    Inner: {
      style: {
        backgroundColor: Ta(a) ? l.bgColor : l.secondaryBg,
        color: l.bodyText,
        fontSize: u.sm,
        fontWeight: f.normal,
        paddingTop: "0 !important",
        paddingBottom: "0 !important",
        paddingLeft: "0 !important",
        paddingRight: "0 !important"
      }
    }
  }, children: s });
}
const GS = d.memo(qS);
function YS({
  top: e,
  left: t,
  isColumnPinned: n,
  onPinColumn: r,
  onUnpinColumn: i,
  onCloseMenu: o,
  onSortColumn: s,
  onHideColumn: a,
  column: l,
  onChangeFormat: u,
  onAutosize: c
}) {
  const f = Qr(), [g, h] = d.useState(!1), {
    colors: p,
    fontSizes: m,
    radii: w,
    fontWeights: b
  } = f, {
    isCopied: v,
    copyToClipboard: C
  } = pp();
  d.useEffect(() => {
    function R(P) {
      P.preventDefault();
    }
    return document.addEventListener("wheel", R, {
      passive: !1
    }), document.addEventListener("touchmove", R, {
      passive: !1
    }), () => {
      document.removeEventListener("wheel", R), document.removeEventListener("touchmove", R);
    };
  }, []);
  const I = d.useCallback(() => {
    o();
  }, [o]), E = d.useCallback(() => {
    C(l.title);
  }, [l.title, C]);
  return /* @__PURE__ */ me.jsx(
    Ea,
    {
      autoFocus: !0,
      "aria-label": "Dataframe column menu",
      content: /* @__PURE__ */ me.jsxs(bh, { children: [
        /* @__PURE__ */ me.jsxs($S, { children: [
          /* @__PURE__ */ me.jsx(NS, { title: l.kind, children: /* @__PURE__ */ me.jsx(Zn, { iconValue: l.typeIcon || ":material/notes:", size: "base", color: "inherit" }) }),
          /* @__PURE__ */ me.jsxs(BS, { title: l.title, children: [
            /* @__PURE__ */ me.jsx(WS, { children: l.title }),
            /* @__PURE__ */ me.jsx(US, { onClick: E, title: "Copy column name", "aria-label": "Copy column name", children: /* @__PURE__ */ me.jsx(Zn, { iconValue: v ? ":material/check:" : ":material/content_copy:", size: "sm", margin: "0", color: "inherit" }) })
          ] })
        ] }),
        s && /* @__PURE__ */ me.jsxs(me.Fragment, { children: [
          /* @__PURE__ */ me.jsxs(Tr, { onClick: () => {
            s("asc"), I();
          }, role: "menuitem", children: [
            /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: ":material/arrow_upward:" }),
            "Sort ascending"
          ] }),
          /* @__PURE__ */ me.jsxs(Tr, { onClick: () => {
            s("desc"), I();
          }, role: "menuitem", children: [
            /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: ":material/arrow_downward:" }),
            "Sort descending"
          ] }),
          /* @__PURE__ */ me.jsx(wh, {})
        ] }),
        u && /* @__PURE__ */ me.jsx(GS, { columnKind: l.kind, isOpen: g, onMouseEnter: () => h(!0), onMouseLeave: () => h(!1), onChangeFormat: u, onCloseMenu: I, children: /* @__PURE__ */ me.jsxs(Tr, { onMouseEnter: () => h(!0), onMouseLeave: () => h(!1), isActive: g, hasSubmenu: !0, children: [
          /* @__PURE__ */ me.jsxs("div", { children: [
            /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: ":material/format_list_numbered:" }),
            "Format"
          ] }),
          /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: ":material/chevron_right:" })
        ] }) }),
        c && /* @__PURE__ */ me.jsxs(Tr, { onClick: () => {
          c(), I();
        }, children: [
          /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: ":material/arrows_outward:" }),
          "Autosize"
        ] }),
        n && /* @__PURE__ */ me.jsxs(Tr, { onClick: () => {
          i(), I();
        }, children: [
          /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: ":material/keep_off:" }),
          "Unpin column"
        ] }),
        !n && /* @__PURE__ */ me.jsxs(Tr, { onClick: () => {
          r(), I();
        }, children: [
          /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: ":material/keep:" }),
          "Pin column"
        ] }),
        a && /* @__PURE__ */ me.jsxs(Tr, { onClick: () => {
          a(), I();
        }, children: [
          /* @__PURE__ */ me.jsx(Zn, { size: "base", margin: "0", color: "inherit", iconValue: ":material/visibility_off:" }),
          "Hide column"
        ] })
      ] }),
      placement: Ia.bottomRight,
      accessibilityType: pd.menu,
      showArrow: !1,
      popoverMargin: an("0.375rem"),
      onClickOutside: g ? void 0 : I,
      onEsc: I,
      overrides: {
        Body: {
          props: {
            "data-testid": "stDataFrameColumnMenu"
          },
          style: {
            paddingTop: "0 !important",
            paddingBottom: "0 !important",
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            backgroundColor: "transparent"
          }
        },
        Inner: {
          style: {
            border: `${f.sizes.borderWidth} solid ${f.colors.borderColor}`,
            backgroundColor: Ta(f) ? p.bgColor : p.secondaryBg,
            color: p.bodyText,
            fontSize: m.sm,
            fontWeight: b.normal,
            // This is annoying, but a bunch of warnings get logged when the
            // shorthand version `borderRadius` is used here since the long
            // names are used by BaseWeb and mixing the two is apparently
            // bad :(
            borderTopLeftRadius: w.default,
            borderTopRightRadius: w.default,
            borderBottomLeftRadius: w.default,
            borderBottomRightRadius: w.default,
            // Prevent the menu hover background from overflowing the menu edges
            // This is only an issue if a high base radius is configured.
            overflow: "auto",
            // See the long comment about `borderRadius`. The same applies here
            // to `padding`.
            paddingTop: "0 !important",
            paddingBottom: "0 !important",
            paddingLeft: "0 !important",
            paddingRight: "0 !important"
          }
        }
      },
      isOpen: !0,
      children: /* @__PURE__ */ me.jsx("div", { "data-testid": "stDataFrameColumnMenuTarget", style: {
        // This is an invisible div that's used to position the tooltip.
        // The position is provided from outside via the `top` and `left` properties.
        // This a workaround for the fact that BaseWeb's Popover  doesn't support
        // positioning to a virtual position and always requires a target
        // component for positioning.
        position: "fixed",
        top: e,
        left: t,
        visibility: "hidden",
        transform: "unset"
      } })
    }
  );
}
const XS = d.memo(YS), KS = "(index)";
function Ls(e, t) {
  return !t.length || e.isIndex ? !1 : !t.includes(e.id) && !t.includes(e.name);
}
const Jc = ({
  label: e,
  initialValue: t,
  isIndeterminate: n,
  onChange: r
}) => {
  const i = Qr();
  return /* @__PURE__ */ me.jsx(Ep, { isIndeterminate: n, checked: t, onChange: (o) => {
    r(o.target.checked);
  }, "aria-label": e, checkmarkType: Tp.default, labelPlacement: Ip.right, overrides: {
    Root: {
      style: ({
        $isFocusVisible: o
      }) => ({
        marginBottom: i.spacing.none,
        marginTop: i.spacing.none,
        paddingLeft: i.spacing.md,
        paddingRight: i.spacing.md,
        paddingTop: i.spacing.twoXS,
        paddingBottom: i.spacing.twoXS,
        backgroundColor: o ? i.colors.darkenedBgMix25 : "",
        display: "flex",
        alignItems: "start"
      })
    },
    Checkmark: {
      style: ({
        $isFocusVisible: o,
        $checked: s,
        $isIndeterminate: a
      }) => {
        const l = s || a ? i.colors.primary : i.colors.fadedText40;
        return {
          outline: 0,
          width: i.sizes.checkbox,
          height: i.sizes.checkbox,
          marginTop: i.spacing.twoXS,
          marginLeft: 0,
          marginBottom: 0,
          boxShadow: o && (s || a) ? `0 0 0 0.2rem ${ki(i.colors.primary, 0.5)}` : "",
          borderLeftWidth: i.sizes.borderWidth,
          borderRightWidth: i.sizes.borderWidth,
          borderTopWidth: i.sizes.borderWidth,
          borderBottomWidth: i.sizes.borderWidth,
          borderLeftColor: l,
          borderRightColor: l,
          borderTopColor: l,
          borderBottomColor: l
        };
      }
    },
    Label: {
      style: {
        lineHeight: i.lineHeights.small,
        paddingLeft: i.spacing.sm,
        position: "relative",
        color: i.colors.bodyText,
        fontSize: i.fontSizes.sm,
        fontWeight: i.fontWeights.normal
      }
    }
  }, children: e });
}, ZS = ({
  columns: e,
  columnOrder: t,
  setColumnOrder: n,
  hideColumn: r,
  showColumn: i,
  children: o,
  isOpen: s,
  onClose: a
}) => {
  const l = Qr(), u = (h) => !(h.isHidden === !0 || Ls(h, t)), c = e.every(u), f = e.some(u) && !c, g = (h) => {
    e.forEach((p) => {
      const m = Ls(p, t);
      h ? (i(p.id), m && n((w) => [...w, p.id])) : r(p.id);
    });
  };
  return /* @__PURE__ */ me.jsx(Ea, { triggerType: gd.click, placement: Ia.bottomRight, autoFocus: !0, focusLock: !0, content: () => /* @__PURE__ */ me.jsxs("div", { style: {
    paddingTop: l.spacing.sm,
    paddingBottom: l.spacing.sm,
    maxHeight: l.sizes.maxDropdownHeight,
    overflow: "auto"
  }, children: [
    /* @__PURE__ */ me.jsx(Jc, { label: "Select all", isIndeterminate: f, initialValue: c, onChange: (h) => {
      g(h);
    } }),
    /* @__PURE__ */ me.jsx(wh, {}),
    /* @__PURE__ */ me.jsx("div", { children: e.map((h) => {
      const p = Ls(h, t);
      return /* @__PURE__ */ me.jsx(Jc, { label: !h.title && h.isIndex ? KS : h.title, initialValue: !(h.isHidden === !0 || p), onChange: (m) => {
        m ? (i(h.id), p && n((w) => [...w, h.id])) : r(h.id);
      } }, h.id);
    }) })
  ] }), isOpen: s, onClickOutside: a, onClick: () => s ? a() : void 0, onEsc: a, ignoreBoundary: !1, overrides: {
    Body: {
      props: {
        "data-testid": "stDataFrameColumnVisibilityMenu"
      },
      style: {
        borderTopLeftRadius: l.radii.default,
        borderTopRightRadius: l.radii.default,
        borderBottomLeftRadius: l.radii.default,
        borderBottomRightRadius: l.radii.default,
        paddingTop: "0 !important",
        paddingBottom: "0 !important",
        paddingLeft: "0 !important",
        paddingRight: "0 !important",
        backgroundColor: "transparent",
        border: `${l.sizes.borderWidth} solid ${l.colors.borderColor}`
      }
    },
    Inner: {
      style: {
        backgroundColor: Ta(l) ? l.colors.bgColor : l.colors.secondaryBg,
        color: l.colors.bodyText,
        fontSize: l.fontSizes.sm,
        fontWeight: l.fontWeights.normal,
        minWidth: l.sizes.minMenuWidth,
        maxWidth: `calc(${l.sizes.minMenuWidth} * 2)`,
        maxHeight: l.sizes.maxDropdownHeight,
        overflow: "auto",
        paddingTop: "0 !important",
        paddingBottom: "0 !important",
        paddingLeft: "0 !important",
        paddingRight: "0 !important"
      }
    }
  }, children: /* @__PURE__ */ me.jsx("div", { children: o }) });
}, JS = d.memo(ZS), Qc = /* @__PURE__ */ tr("div", {
  target: "e1w7nams0"
})(({
  theme: e,
  isInHorizontalLayout: t
}) => ({
  position: "relative",
  display: t ? "flex" : "inline-block",
  "& .stDataFrameGlideDataEditor": {
    height: "100%",
    minWidth: "100%",
    borderRadius: e.radii.default
  },
  "& .dvn-scroller": {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    overflowX: "auto !important",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
    overflowY: "auto !important"
  },
  "& .gdg-search-bar": {
    // Make the search field more responsive to the grid width and use
    // rem units for everything.
    // 19rem is the closest rem without decimals to the original size:
    maxWidth: "19rem",
    width: "80%",
    // 6rem was manually determined as the smallest size thats still somewhat usable:
    minWidth: "6rem",
    top: e.spacing.sm,
    right: e.spacing.sm,
    padding: e.spacing.sm,
    borderRadius: e.radii.default,
    "& .gdg-search-status": {
      paddingTop: e.spacing.twoXS,
      fontSize: e.fontSizes.twoSm
    },
    "& .gdg-search-progress": {
      // We are disabling the search progress bar since it
      // looks a bit weird in its current state and doesn't work
      // with rounded corners
      display: "none"
    },
    "& input": {
      width: "100%"
    },
    "& button": {
      width: e.iconSizes.xl,
      height: e.iconSizes.xl,
      "& .button-icon": {
        width: e.iconSizes.base,
        height: e.iconSizes.base
      }
    }
  }
}), "");
function QS({
  top: e,
  left: t,
  content: n,
  clearTooltip: r
}) {
  const [i, o] = d.useState(!0), s = Qr(), {
    colors: a,
    fontSizes: l,
    radii: u,
    fontWeights: c
  } = s, f = d.useCallback(() => {
    o(!1), r();
  }, [r, o]);
  return /* @__PURE__ */ me.jsx(Ea, { content: /* @__PURE__ */ me.jsx(mp, { "data-testid": "stDataFrameTooltipContent", children: /* @__PURE__ */ me.jsx(vp, { style: {
    fontSize: l.sm
  }, source: n, allowHTML: !1 }) }), placement: Ia.top, accessibilityType: pd.tooltip, showArrow: !1, popoverMargin: 5, onClickOutside: f, onEsc: f, overrides: {
    Body: {
      style: {
        // This is annoying, but a bunch of warnings get logged when the
        // shorthand version `borderRadius` is used here since the long
        // names are used by BaseWeb and mixing the two is apparently
        // bad :(
        borderTopLeftRadius: u.default,
        borderTopRightRadius: u.default,
        borderBottomLeftRadius: u.default,
        borderBottomRightRadius: u.default,
        paddingTop: "0 !important",
        paddingBottom: "0 !important",
        paddingLeft: "0 !important",
        paddingRight: "0 !important",
        backgroundColor: "transparent"
      }
    },
    Inner: {
      style: {
        backgroundColor: Ta(s) ? a.bgColor : a.secondaryBg,
        color: a.bodyText,
        fontSize: l.sm,
        fontWeight: c.normal,
        // See the long comment about `borderRadius`. The same applies here
        // to `padding`.
        paddingTop: "0 !important",
        paddingBottom: "0 !important",
        paddingLeft: "0 !important",
        paddingRight: "0 !important"
      }
    }
  }, isOpen: i, children: /* @__PURE__ */ me.jsx("div", { "data-testid": "stDataFrameTooltipTarget", style: {
    // This is an invisible div that's used to position the tooltip.
    // The position is provided from outside via the `top` and `left` properties.
    // This a workaround for the fact that BaseWeb's Popover  doesn't support
    // positioning to a virtual position and always requires a target
    // component for positioning.
    position: "fixed",
    top: e,
    left: t
  } }) });
}
const ex = d.memo(QS), ed = 150, tx = 15e4, nx = "0.5rem";
function rx({
  element: e,
  data: t,
  disabled: n,
  widgetMgr: r,
  disableFullscreenMode: i,
  fragmentId: o,
  customToolbarActions: s,
  widthConfig: a,
  heightConfig: l
}) {
  const {
    expanded: u,
    expand: c,
    collapse: f,
    width: g,
    height: h
  } = ru(xp), {
    isInHorizontalLayout: p
  } = ru(bp), m = d.useRef(null), w = d.useRef(null), b = d.useRef(null), v = wp(), C = MS(), {
    getRowThemeOverride: I,
    onItemHovered: E
  } = FS(C), {
    libConfig: {
      enforceDownloadInNewTab: R = !1
    }
    // Default to false, if no libConfig, e.g. for tests
  } = d.useContext(yp), [P, x] = d.useState(!0), [S, F] = d.useState(!1), [D, M] = d.useState(!1), [T, O] = d.useState(!1), [k, N] = d.useState(), [q, Y] = d.useState(!1), ue = d.useCallback(() => Y((Ce) => !Ce), []), ee = d.useCallback(() => Y(!1), []), te = d.useMemo(() => window.matchMedia && window.matchMedia("(pointer: coarse)").matches, []);
  Pe(e.editingMode) && (e.editingMode = sn.EditingMode.READ_ONLY);
  const {
    READ_ONLY: ce,
    DYNAMIC: le
  } = sn.EditingMode, he = t.dimensions, de = Math.max(0, he.numDataRows), ie = de === 0 && // We don't show empty state for dynamic mode with a table that has
  // data columns defined.
  !(e.editingMode === le && he.numDataColumns > 0), H = de > tx, L = !H && !ie && e.editingMode !== le, G = !ie && e.editingMode === le && !n, ne = d.useRef(new Qo(de)), [oe, xe] = d.useState(ne.current.getNumRows());
  d.useEffect(() => {
    ne.current = new Qo(de), xe(ne.current.getNumRows());
  }, [de]);
  const ve = d.useCallback(() => {
    ne.current = new Qo(de), xe(ne.current.getNumRows());
  }, [de]), [et, ke] = d.useState(e.columnOrder);
  d.useEffect(() => {
    ke(e.columnOrder);
  }, [e.columnOrder.join(",")]);
  const {
    columns: bt,
    allColumns: St,
    setColumnConfigMapping: Ue
  } = B1(e, t, n, et, a);
  d.useEffect(
    () => {
      if (e.editingMode === ce || !r)
        return;
      const Ce = r.getStringValue({
        id: e.id,
        formId: e.formId
      });
      Ce && (ne.current.fromJson(Ce, bt), xe(ne.current.getNumRows()));
    },
    // We only want to run this effect once during the initial component load
    // so we disable the eslint rule.
    // TODO: Update to match React best practices
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const {
    getCellContent: re
  } = LS(t, bt, oe, ne), {
    columns: se,
    sortColumn: we,
    getOriginalIndex: fe,
    getCellContent: ye
  } = J1(de, bt, re), $e = d.useCallback((Ce, _t) => {
    if (!r)
      return;
    const Kt = {
      selection: {
        rows: [],
        columns: [],
        cells: []
      }
    };
    if (Kt.selection.rows = Ce.rows.toArray().map((Gt) => fe(Gt)), Kt.selection.columns = Ce.columns.toArray().map((Gt) => Kr(se[Gt])), _t && Ce.current) {
      const {
        cell: Gt,
        range: Yt
      } = Ce.current;
      if (Yt)
        for (let _n = Yt.y; _n < Yt.y + Yt.height; _n++)
          for (let Tn = Yt.x; Tn < Yt.x + Yt.width; Tn++)
            se[Tn].isIndex || Kt.selection.cells.push([fe(_n), Kr(se[Tn])]);
      else if (Gt) {
        const [_n, Tn] = Gt;
        se[_n].isIndex || Kt.selection.cells.push([fe(Tn), Kr(se[_n])]);
      }
    }
    const Bn = JSON.stringify(Kt), Zt = r.getStringValue({
      id: e.id,
      formId: e.formId
    });
    (Zt === void 0 || Zt !== Bn) && r.setStringValue({
      id: e.id,
      formId: e.formId
    }, Bn, {
      fromUi: !0
    }, o);
  }, [se, e.id, e.formId, r, o, fe]), {
    debouncedCallback: _e
  } = dc($e, ed), {
    gridSelection: tt,
    isRowSelectionActivated: Re,
    isMultiRowSelectionActivated: qe,
    isColumnSelectionActivated: De,
    isMultiColumnSelectionActivated: Ie,
    isCellSelectionActivated: Le,
    isMultiCellSelectionActivated: ht,
    isRowSelected: nt,
    isColumnSelected: Xe,
    isCellSelected: kt,
    clearSelection: wt,
    processSelectionChange: Ot
  } = _S(e, ie, n, se, _e);
  d.useEffect(() => {
    Le || wt(!0, !0);
  }, [u]);
  const Pt = d.useCallback((Ce) => {
    w.current?.updateCells(Ce);
  }, []);
  d.useEffect(
    () => {
      if (!Re && !De && !Le || !r)
        return;
      const Ce = r.getStringValue({
        id: e.id,
        formId: e.formId
      });
      if (Ce) {
        const _t = se.map((Yt) => Kr(Yt)), Kt = JSON.parse(Ce);
        let Bn = Qe.empty(), Zt = Qe.empty(), Gt;
        if (Kt.selection?.rows?.forEach((Yt) => {
          Bn = Bn.add(Yt);
        }), Kt.selection?.columns?.forEach((Yt) => {
          Zt = Zt.add(_t.indexOf(Yt));
        }), Le && !ht) {
          const [Yt, _n] = Kt.selection?.cells?.[0] ?? [];
          Yt !== void 0 && _n !== void 0 && (Gt = [_t.indexOf(_n), Yt]);
        }
        if (Bn.length > 0 || Zt.length > 0 || Gt !== void 0) {
          const Yt = {
            rows: Bn,
            columns: Zt,
            current: Gt ? {
              cell: Gt,
              range: {
                x: Gt[0],
                y: Gt[1],
                // eslint-disable-next-line streamlit-custom/no-hardcoded-theme-values
                width: 1,
                // eslint-disable-next-line streamlit-custom/no-hardcoded-theme-values
                height: 1
              },
              rangeStack: []
            } : void 0
          };
          Ot(Yt);
        }
      }
    },
    // We only want to run this effect once during the initial component load
    // so we disable the eslint rule.
    // TODO: Update to match React best practices
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const ln = d.useCallback(() => {
    oe !== ne.current.getNumRows() && xe(ne.current.getNumRows());
  }, [oe]), Jt = d.useCallback(() => {
    if (!r)
      return;
    const Ce = ne.current.toJson(se);
    let _t = r.getStringValue({
      id: e.id,
      formId: e.formId
    });
    _t === void 0 && (_t = new Qo(0).toJson([])), Ce !== _t && r.setStringValue({
      id: e.id,
      formId: e.formId
    }, Ce, {
      fromUi: !0
    }, o);
  }, [se, e.id, e.formId, r, o]), {
    debouncedCallback: Dn
  } = dc(Jt, ed), {
    exportToCsv: Tt
  } = PS(ye, se, oe, R), {
    onCellEdited: gt,
    onPaste: On,
    onRowAppended: yt,
    onDelete: Qt,
    validateCell: kn
  } = ES(se, e.editingMode !== le, ne, ye, fe, Pt, ln, Dn, wt), Oe = d.useMemo(() => ie ? [0] : G ? [oe] : [], [ie, G, oe]), {
    tooltip: ct,
    clearTooltip: pt,
    onItemHovered: Pn
  } = VS(se, ye, Oe), {
    drawCell: un,
    customRenderers: cn
  } = kS(se), {
    provideEditor: Ln
  } = ew(), en = d.useCallback((Ce) => ({
    ...Ce,
    hasMenu: !ie
  }), [ie]), tn = d.useMemo(() => se.map((Ce) => en(qs(Ce))), [se, en]), {
    columns: Be,
    onColumnResize: Mt
  } = q1(tn), Fn = t.dimensions.numHeaderRows > 1, {
    minHeight: Ft,
    maxHeight: mt,
    minWidth: Mn,
    maxWidth: ur,
    rowHeight: Nn,
    resizableSize: B,
    setResizableSize: We
  } = AS(e, C, oe, Fn, g || 0, h, u, a, l), Ge = d.useCallback(([Ce, _t]) => ({
    ...d1(!0, !1),
    displayData: "empty",
    contentAlign: "center",
    allowOverlay: !1,
    themeOverride: {
      textDark: C.glideTheme.textLight
    },
    span: [0, Math.max(se.length - 1, 0)]
  }), [se, C.glideTheme.textLight]), Lt = d.useCallback(() => {
    ve(), wt();
  }, [ve, wt]);
  Mp({
    element: e,
    widgetMgr: r,
    onFormCleared: Lt
  });
  const {
    pinColumn: nn,
    unpinColumn: hn,
    freezeColumns: Rn
  } = U1(se, ie, g || 0, C.minColumnWidth, wt, Ue), {
    changeColumnFormat: yn
  } = W1(Ue), {
    hideColumn: Ut,
    showColumn: En
  } = Q1(wt, Ue), {
    onColumnMoved: In
  } = j1(se, Rn, nn, hn, ke);
  return d.useEffect(() => {
    let Ce;
    const _t = requestAnimationFrame(() => {
      Ce = setTimeout(() => {
        if (b.current && w.current) {
          const Kt = b.current?.querySelector(".dvn-stack")?.getBoundingClientRect();
          Kt && (M(Kt.height > // eslint-disable-next-line streamlit-custom/no-force-reflow-access -- Existing usage
          b.current.clientHeight), O(Kt.width > // eslint-disable-next-line streamlit-custom/no-force-reflow-access -- Existing usage
          b.current.clientWidth));
        }
      }, 0);
    });
    return () => {
      cancelAnimationFrame(_t), Ce && clearTimeout(Ce);
    };
  }, [B, oe, Be]), d.useEffect(() => {
    St.length == se.length && Y(!1);
  }, [St.length, se.length]), /* @__PURE__ */ me.jsxs(Qc, { className: "stDataFrame", "data-testid": "stDataFrame", ref: b, isInHorizontalLayout: p, onPointerDown: (Ce) => {
    if (b.current) {
      const _t = (
        // eslint-disable-next-line streamlit-custom/no-force-reflow-access -- Existing usage
        b.current.getBoundingClientRect()
      ), Kt = (v || Math.round(an(nx))) + 1;
      T && _t.height - Kt < Ce.clientY - _t.top && Ce.stopPropagation(), D && _t.width - Kt < Ce.clientX - _t.left && Ce.stopPropagation();
    }
  }, onBlur: (Ce) => {
    !P && !te && !Ce.currentTarget.contains(Ce.relatedTarget) && !Le && wt(!0, !0);
  }, children: [
    /* @__PURE__ */ me.jsxs(
      kp,
      {
        isFullScreen: u,
        disableFullscreenMode: i,
        locked: nt && !Re || kt || te && P || q,
        onExpand: c,
        onCollapse: f,
        target: Qc,
        children: [
          s?.map((Ce) => Ce),
          (Re && nt || De && Xe || Le && kt) && // Add clear selection action if selections are active
          // and a valid selections currently exists. Cell selections
          // are not relevant since they are not synced to the backend
          // at the moment.
          /* @__PURE__ */ me.jsx(Si, { label: "Clear selection", icon: Op, onClick: () => {
            wt(), pt();
          } }),
          G && nt && /* @__PURE__ */ me.jsx(Si, { label: "Delete row(s)", icon: Ap, onClick: () => {
            Qt && (Qt(tt), pt());
          } }),
          G && !nt && /* @__PURE__ */ me.jsx(Si, { label: "Add row", icon: md, onClick: () => {
            yt && (x(!0), yt(), pt(), w.current?.scrollTo(0, oe, "vertical"));
          } }),
          !ie && St.length > se.length && /* @__PURE__ */ me.jsx(JS, { columns: St, columnOrder: et, setColumnOrder: ke, hideColumn: Ut, showColumn: En, isOpen: q, onClose: ee, children: /* @__PURE__ */ me.jsx(Si, { label: "Show/hide columns", icon: bd, onClick: ue }) }),
          !H && !ie && /* @__PURE__ */ me.jsx(Si, { label: "Download as CSV", icon: Hp, onClick: Tt }),
          !ie && /* @__PURE__ */ me.jsx(Si, { label: "Search", icon: vd, onClick: () => {
            S ? F(!1) : (x(!0), F(!0)), pt();
          } })
        ]
      }
    ),
    /* @__PURE__ */ me.jsx(
      Cp,
      {
        "data-testid": "stDataFrameResizable",
        ref: m,
        defaultSize: B,
        style: {
          border: `${C.tableBorderWidth}px solid ${C.glideTheme.borderColor}`,
          borderRadius: `${C.tableBorderRadius}`
        },
        minHeight: Ft,
        maxHeight: mt,
        minWidth: Mn,
        maxWidth: p ? void 0 : ur,
        size: B,
        enable: {
          top: !1,
          right: !1,
          bottom: !1,
          left: !1,
          topRight: !1,
          bottomRight: !p,
          bottomLeft: !1,
          topLeft: !1
        },
        grid: [1, Nn],
        snapGap: Nn / 3,
        onResizeStop: (Ce, _t, Kt, Bn) => {
          if (m.current) {
            const Zt = 2 * C.tableBorderWidth;
            We({
              width: m.current.size.width,
              height: (
                // Add additional pixels if it is stretched to full width
                // to allow the full cell border to be visible
                mt - m.current.size.height === Zt ? m.current.size.height + Zt : m.current.size.height
              )
            });
          }
        },
        children: /* @__PURE__ */ me.jsx(
          r1,
          {
            className: "stDataFrameGlideDataEditor",
            "data-testid": "stDataFrameGlideDataEditor",
            ref: w,
            columns: Be,
            rows: ie ? 1 : oe,
            minColumnWidth: C.minColumnWidth,
            maxColumnWidth: C.maxColumnWidth,
            maxColumnAutoWidth: C.maxColumnAutoWidth,
            rowHeight: Nn,
            headerHeight: C.defaultHeaderHeight,
            getCellContent: ie ? Ge : ye,
            onColumnResize: te ? void 0 : Mt,
            resizeIndicator: "header",
            freezeColumns: Rn,
            smoothScrollX: !0,
            smoothScrollY: !0,
            verticalBorder: !0,
            getCellsForSelection: !0,
            rowMarkers: "none",
            rangeSelect: te ? "cell" : "rect",
            columnSelect: "none",
            rowSelect: "none",
            onColumnMoved: (
              // Column selection is not compatible with column reordering.
              De ? void 0 : In
            ),
            onItemHovered: (Ce) => {
              E?.(Ce), Pn?.(Ce);
            },
            keybindings: {
              downFill: !0,
              ...Le || H ? {
                // Deactivate select all to prevent potential performance issues
                // with too many selected cells being processed for cell selection:
                selectAll: !1
              } : {}
            },
            onKeyDown: (Ce) => {
              (Ce.ctrlKey || Ce.metaKey) && Ce.key === "f" && (F((_t) => !_t), Ce.stopPropagation(), Ce.preventDefault());
            },
            showSearch: S,
            searchResults: S ? void 0 : [],
            onSearchClose: () => {
              F(!1), pt();
            },
            onHeaderClicked: (Ce, _t) => {
              !L || De || (S && F(!1), Re && nt ? wt() : wt(!0, !0), we(Ce, "auto"));
            },
            gridSelection: tt,
            onGridSelectionChange: (Ce) => {
              (P || te) && (Ot(Ce), ct !== void 0 && pt(), N(void 0), Y(!1));
            },
            theme: C.glideTheme,
            getRowThemeOverride: I,
            onMouseMove: (Ce) => {
              Ce.kind === "out-of-bounds" && P ? x(!1) : Ce.kind !== "out-of-bounds" && !P && x(!0);
            },
            fixedShadowX: !0,
            fixedShadowY: !0,
            experimental: {
              // Deactivate the native scrollbar override to optimize our
              // scrollbars to always behave like overlay scrollbars.
              scrollbarWidthOverride: 0,
              // Add negative padding to the right and bottom to allow the scrollbars
              // to overlay the table:
              paddingBottom: T ? -v : void 0,
              paddingRight: D ? -v : void 0
            },
            provideEditor: Ln,
            drawCell: un,
            customRenderers: cn,
            imageEditorOverride: R1,
            headerIcons: C.headerIcons,
            validateCell: kn,
            onHeaderMenuClick: (Ce, _t) => {
              q || N({
                columnIdx: Ce,
                headerBounds: _t
              });
            },
            onPaste: !1,
            ...Re && {
              rowMarkers: {
                // Apply style settings for the row markers column:
                kind: "checkbox-visible",
                checkboxStyle: "square",
                theme: {
                  bgCell: C.glideTheme.bgHeader,
                  bgCellMedium: C.glideTheme.bgHeader,
                  // Use a lighter color for the checkboxes in the row markers column,
                  // otherwise its a bit too prominent:
                  textMedium: C.glideTheme.textLight
                }
              },
              rowSelectionMode: qe ? "multi" : "auto",
              rowSelect: n ? "none" : qe ? "multi" : "single",
              rowSelectionBlending: "additive",
              rangeSelectionBlending: "additive"
            },
            ...De && {
              columnSelect: n ? "none" : Ie ? "multi" : "single",
              columnSelectionBlending: "additive",
              columnSelectionMode: Ie ? "multi" : "auto",
              rangeSelectionBlending: "additive"
            },
            ...Le && {
              rangeSelect: ht ? "rect" : "cell",
              // Allow mixing cell selections with row and column selections:
              rangeSelectionBlending: "additive"
            },
            ...!ie && e.editingMode !== ce && !n && {
              // Support fill handle for bulk editing:
              fillHandle: !te,
              // Support editing:
              onCellEdited: gt,
              // Support pasting data for bulk editing:
              onPaste: On,
              // Support deleting cells & rows:
              onDelete: Qt
            },
            ...!ie && e.editingMode === le && {
              // Support adding rows:
              trailingRowOptions: {
                sticky: !1,
                tint: !0
              },
              rowMarkers: {
                kind: "checkbox",
                checkboxStyle: "square",
                theme: {
                  bgCell: C.glideTheme.bgHeader,
                  bgCellMedium: C.glideTheme.bgHeader
                }
              },
              rowSelectionMode: "multi",
              rowSelect: n ? "none" : "multi",
              // Support adding rows:
              onRowAppended: n ? void 0 : yt,
              // Deactivate sorting, since it is not supported with dynamic editing:
              onHeaderClicked: void 0
            }
          }
        )
      }
    ),
    ct?.content && /* @__PURE__ */ me.jsx(ex, { top: ct.top, left: ct.left, content: ct.content, clearTooltip: pt }),
    k && hd.createPortal(
      // A context menu that provides interactive features (sorting, pinning, show/hide)
      // for a grid column.
      /* @__PURE__ */ me.jsx(XS, { top: k.headerBounds.y + k.headerBounds.height, left: k.headerBounds.x + k.headerBounds.width, column: bt[k.columnIdx], onCloseMenu: () => N(void 0), onSortColumn: L ? (Ce) => {
        S && F(!1), wt(!(Re && nt), !0), we(k.columnIdx, Ce, !0);
      } : void 0, isColumnPinned: bt[k.columnIdx].isPinned, onUnpinColumn: () => {
        hn(bt[k.columnIdx].id);
      }, onPinColumn: () => {
        nn(bt[k.columnIdx].id);
      }, onHideColumn: () => {
        Ut(bt[k.columnIdx].id);
      }, onChangeFormat: (Ce) => {
        yn(bt[k.columnIdx].id, Ce), setTimeout(() => {
          w.current?.remeasureColumns(Qe.fromSingleSelection(k.columnIdx));
        }, 100);
      }, onAutosize: () => {
        w.current?.remeasureColumns(Qe.fromSingleSelection(k.columnIdx));
      } }),
      // We put the column menu into the portal element which is also
      // used for the cell overlays. This allows us to correctly position
      // the column menu also when the grid is used in a dialog, popover,
      // or anything else that apply a transform (position fixed is influenced
      // by the transform property of the parent element).
      // The portal element is expected to always exist (-> PortalProvider).
      document.querySelector("#portal")
    )
  ] });
}
const ix = Sp(rx), yh = d.memo(ix), ox = ({
  data: e,
  height: t,
  customToolbarActions: n
}) => /* @__PURE__ */ me.jsx(yh, { element: new sn({
  // Use container width is deprecated, the
  // more relevant attribute is the width config below:
  useContainerWidth: !0,
  // Enforces read-only mode:
  editingMode: sn.EditingMode.READ_ONLY,
  disabled: !0,
  // Data is provided via the data property below:
  data: void 0,
  styler: null,
  width: void 0,
  height: t ?? null,
  id: "",
  columns: "",
  formId: "",
  columnOrder: [],
  selectionMode: []
}), data: e, widgetMgr: void 0, disabled: !0, fragmentId: void 0, disableFullscreenMode: !0, customToolbarActions: n, widthConfig: new iu.WidthConfig({
  useStretch: !0
}), heightConfig: t ? new iu.HeightConfig({
  pixelHeight: t
}) : void 0 }), vx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ReadOnlyGrid: ox,
  default: yh
}, Symbol.toStringTag, { value: "Module" }));
export {
  Hv as C,
  ox as R,
  Kd as T,
  Ii as a,
  Wp as b,
  vx as c,
  Mi as i,
  o0 as m,
  fn as s
};
//# sourceMappingURL=index-BX7-w-Gk.js.map
