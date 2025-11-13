import { ac as v, o as H, ai as $, r as s, p as A, aj as F, u as N } from "./index-COqA-032.js";
import { a as z, b as B, c as R, B as C } from "./base-input-D8uW1Tz_.js";
function w(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function l(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? w(Object(r), !0).forEach(function(n) {
      D(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : w(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function D(e, t, r) {
  return t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
var O = v("div", function(e) {
  return l(l({}, z(l(l({
    $positive: !1
  }, e), {}, {
    $hasIconTrailing: !1
  }))), {}, {
    width: e.$resize ? "fit-content" : "100%"
  });
});
O.displayName = "StyledTextAreaRoot";
O.displayName = "StyledTextAreaRoot";
var _ = v("div", function(e) {
  return B(l({
    $positive: !1
  }, e));
});
_.displayName = "StyledTextareaContainer";
_.displayName = "StyledTextareaContainer";
var S = v("textarea", function(e) {
  return l(l({}, R(e)), {}, {
    resize: e.$resize || "none"
  });
});
S.displayName = "StyledTextarea";
S.displayName = "StyledTextarea";
function g(e) {
  "@babel/helpers - typeof";
  return g = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, g(e);
}
function y() {
  return y = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, y.apply(this, arguments);
}
function K(e, t) {
  return q(e) || L(e, t) || U(e, t) || M();
}
function M() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function U(e, t) {
  if (e) {
    if (typeof e == "string") return P(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return P(e, t);
  }
}
function P(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++)
    n[r] = e[r];
  return n;
}
function L(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n = [], o = !0, i = !1, a, u;
    try {
      for (r = r.call(e); !(o = (a = r.next()).done) && (n.push(a.value), !(t && n.length === t)); o = !0)
        ;
    } catch (c) {
      i = !0, u = c;
    } finally {
      try {
        !o && r.return != null && r.return();
      } finally {
        if (i) throw u;
      }
    }
    return n;
  }
}
function q(e) {
  if (Array.isArray(e)) return e;
}
function V(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function G(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function W(e, t, r) {
  return t && G(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function X(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && m(e, t);
}
function m(e, t) {
  return m = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, m(e, t);
}
function Y(e) {
  var t = J();
  return function() {
    var n = d(e), o;
    if (t) {
      var i = d(this).constructor;
      o = Reflect.construct(n, arguments, i);
    } else
      o = n.apply(this, arguments);
    return Z(this, o);
  };
}
function Z(e, t) {
  if (t && (g(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return f(e);
}
function f(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function J() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function d(e) {
  return d = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, d(e);
}
function p(e, t, r) {
  return t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
var Q = /* @__PURE__ */ (function(e) {
  X(r, e);
  var t = Y(r);
  function r() {
    var n;
    V(this, r);
    for (var o = arguments.length, i = new Array(o), a = 0; a < o; a++)
      i[a] = arguments[a];
    return n = t.call.apply(t, [this].concat(i)), p(f(n), "state", {
      isFocused: n.props.autoFocus || !1
    }), p(f(n), "onFocus", function(u) {
      n.setState({
        isFocused: !0
      }), n.props.onFocus(u);
    }), p(f(n), "onBlur", function(u) {
      n.setState({
        isFocused: !1
      }), n.props.onBlur(u);
    }), n;
  }
  return W(r, [{
    key: "render",
    value: function() {
      var o = this.props.overrides, i = o === void 0 ? {} : o, a = H(i.Root, O), u = K(a, 2), c = u[0], h = u[1], b = $({
        Input: {
          component: S
        },
        InputContainer: {
          component: _
        }
      }, i);
      return /* @__PURE__ */ s.createElement(c, y({
        "data-baseweb": "textarea",
        $isFocused: this.state.isFocused,
        $isReadOnly: this.props.readOnly,
        $disabled: this.props.disabled,
        $error: this.props.error,
        $positive: this.props.positive,
        $required: this.props.required,
        $resize: this.props.resize
      }, h), /* @__PURE__ */ s.createElement(C, y({}, this.props, {
        type: F.textarea,
        overrides: b,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        resize: this.props.resize
      })));
    }
  }]), r;
})(s.Component);
p(Q, "defaultProps", {
  autoFocus: !1,
  disabled: !1,
  readOnly: !1,
  error: !1,
  name: "",
  onBlur: function() {
  },
  onChange: function() {
  },
  onKeyDown: function() {
  },
  onKeyPress: function() {
  },
  onKeyUp: function() {
  },
  onFocus: function() {
  },
  overrides: {},
  placeholder: "",
  required: !1,
  rows: 3,
  size: A.default
});
const k = 6.5, T = 1, ee = (e) => {
  let t = 0;
  const {
    current: r
  } = e;
  return r && (r.style.height = "auto", t = r.scrollHeight, r.style.height = ""), t;
}, te = (e, t, r) => e > 0 && r.current ? Math.abs(e - t) > T : !1, re = (e, t) => {
  if (e.current && t.current) {
    const {
      offsetHeight: r
    } = e.current;
    t.current.minHeight = r, t.current.maxHeight = r * k;
  }
}, ne = (e, t, r) => e ? `${t + T}px` : r ? String(r) : "", oe = (e) => e ? `${e}px` : "", ue = ({
  textareaRef: e,
  dependencies: t = []
}) => {
  const r = N(), n = s.useRef({
    minHeight: 0,
    maxHeight: 0
  }), [o, i] = s.useState(0), [a, u] = s.useState(!1), c = s.useCallback(() => {
    i(ee(e));
  }, [e, i]), h = s.useCallback(() => {
    i(0);
  }, [i]);
  s.useLayoutEffect(() => {
    e.current && re(e, n);
  }, [e]), s.useLayoutEffect(() => {
    const {
      minHeight: j
    } = n.current;
    u(te(o, j, e));
  }, [o, e]), s.useLayoutEffect(() => {
    c();
  }, [e, c, ...t]);
  const {
    maxHeight: b
  } = n.current, x = r.sizes.minElementHeight, E = ne(a, o, x), I = oe(b);
  return {
    isExtended: a,
    height: E,
    maxHeight: I,
    updateScrollHeight: c,
    clearScrollHeight: h
  };
};
export {
  Q as T,
  ue as u
};
//# sourceMappingURL=useTextInputAutoExpand-YvQcBtbJ.js.map
