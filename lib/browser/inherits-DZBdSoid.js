import { az as i, aA as f, aB as s, aC as u } from "./index-COqA-032.js";
function p(t, e) {
  if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function n(t, e) {
  for (var o = 0; o < e.length; o++) {
    var r = e[o];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, i(r.key), r);
  }
}
function l(t, e, o) {
  return e && n(t.prototype, e), o && n(t, o), Object.defineProperty(t, "prototype", {
    writable: !1
  }), t;
}
function y(t, e) {
  if (e && (f(e) == "object" || typeof e == "function")) return e;
  if (e !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return s(t);
}
function a(t) {
  return a = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e) {
    return e.__proto__ || Object.getPrototypeOf(e);
  }, a(t);
}
function b(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && u(t, e);
}
export {
  a as _,
  y as a,
  b,
  p as c,
  l as d
};
//# sourceMappingURL=inherits-DZBdSoid.js.map
