import { ac as f, ao as _e, ap as V, al as I, r as u, o as O, u as Le, j as xe, ai as ke } from "./index-COqA-032.js";
var y = {
  small: "small",
  medium: "medium",
  large: "large"
}, _;
function L() {
  return L = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = arguments[r];
      for (var n in t)
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
    }
    return e;
  }, L.apply(this, arguments);
}
function ae(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    r && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function P(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = arguments[r] != null ? arguments[r] : {};
    r % 2 ? ae(Object(t), !0).forEach(function(n) {
      b(e, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ae(Object(t)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return e;
}
function b(e, r, t) {
  return r in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e;
}
function ie(e) {
  var r;
  return (r = {}, b(r, y.small, "2px"), b(r, y.medium, "4px"), b(r, y.large, "8px"), r)[e];
}
var A = f("div", function(e) {
  return {
    width: "100%"
  };
});
A.displayName = "StyledRoot";
A.displayName = "StyledRoot";
var M = f("div", function(e) {
  var r = e.$theme, t = r.sizing;
  return {
    display: "flex",
    marginLeft: t.scale500,
    marginRight: t.scale500,
    marginTop: t.scale500,
    marginBottom: t.scale500
  };
});
M.displayName = "StyledBarContainer";
M.displayName = "StyledBarContainer";
var D = f("div", function(e) {
  var r = e.$theme, t = e.$size, n = e.$steps, a = r.colors, o = r.sizing, i = r.borders, s = i.useRoundedCorners ? o.scale0 : 0;
  return P({
    borderTopLeftRadius: s,
    borderTopRightRadius: s,
    borderBottomRightRadius: s,
    borderBottomLeftRadius: s,
    backgroundColor: _e(a.progressbarTrackFill, "0.16"),
    height: ie(t),
    flex: 1,
    overflow: "hidden"
  }, n < 2 ? {} : {
    marginLeft: o.scale300,
    ":first-child": {
      marginLeft: "0"
    }
  });
});
D.displayName = "StyledBar";
D.displayName = "StyledBar";
var H = f("div", function(e) {
  var r = e.$theme, t = e.$value, n = e.$successValue, a = e.$steps, o = e.$index, i = e.$maxValue, s = e.$minValue, l = s === void 0 ? 0 : s, g = i || n, R = r.colors, B = r.sizing, $ = r.borders, x = "".concat(100 - (t - l) * 100 / (g - l), "%"), m = {
    default: "default",
    awaits: "awaits",
    inProgress: "inProgress",
    completed: "completed"
  }, d = m.default;
  if (a > 1) {
    var k = (g - l) / a, j = (t - l) / (g - l) * 100, T = Math.floor(j / k);
    o < T ? d = m.completed : o === T ? d = m.inProgress : d = m.awaits;
  }
  var S = $.useRoundedCorners ? B.scale0 : 0, h = {
    transform: "translateX(-".concat(x, ")")
  }, C = d === m.inProgress ? {
    animationDuration: "2.1s",
    animationIterationCount: "infinite",
    animationTimingFunction: r.animation.linearCurve,
    animationName: {
      "0%": {
        transform: "translateX(-102%)",
        opacity: 1
      },
      "50%": {
        transform: "translateX(0%)",
        opacity: 1
      },
      "100%": {
        transform: "translateX(0%)",
        opacity: 0
      }
    }
  } : d === m.completed ? {
    transform: "translateX(0%)"
  } : {
    transform: "translateX(-102%)"
  };
  return P({
    borderTopLeftRadius: S,
    borderTopRightRadius: S,
    borderBottomRightRadius: S,
    borderBottomLeftRadius: S,
    backgroundColor: R.accent,
    height: "100%",
    width: "100%",
    transform: "translateX(-102%)",
    transition: "transform 0.5s"
  }, a > 1 ? C : h);
});
H.displayName = "StyledBarProgress";
H.displayName = "StyledBarProgress";
var W = f("div", function(e) {
  var r = e.$theme, t = e.$isLeft, n = t === void 0 ? !1 : t, a = e.$size, o = a === void 0 ? y.medium : a, i = r.colors, s = r.sizing, l = r.borders, g = l.useRoundedCorners ? s.scale0 : 0, R = ie(o), B = {
    display: "inline-block",
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    transitionProperty: "background-position",
    animationDuration: "1.5s",
    animationIterationCount: "infinite",
    animationTimingFunction: r.animation.linearCurve,
    backgroundSize: "300% auto",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: n ? "-50%" : "150%",
    backgroundImage: "linear-gradient(".concat(n ? "90" : "270", "deg, transparent 0%, ").concat(i.accent, " 25%, ").concat(i.accent, " 75%, transparent 100%)"),
    animationName: n ? {
      "0%": {
        backgroundPositionX: "-50%"
      },
      "33%": {
        backgroundPositionX: "50%"
      },
      "66%": {
        backgroundPositionX: "50%"
      },
      "100%": {
        backgroundPositionX: "150%"
      }
    } : {
      "0%": {
        backgroundPositionX: "150%"
      },
      "33%": {
        backgroundPositionX: "50%"
      },
      "66%": {
        backgroundPositionX: "50%"
      },
      "100%": {
        backgroundPositionX: "-50%"
      }
    }
  };
  return P(P({}, n ? {
    borderTopLeftRadius: g,
    borderBottomLeftRadius: g
  } : {
    borderTopRightRadius: g,
    borderBottomRightRadius: g
  }), {}, {
    height: R
  }, B);
});
W.displayName = "StyledInfiniteBar";
W.displayName = "StyledInfiniteBar";
var F = f("div", function(e) {
  return P(P({
    textAlign: "center"
  }, e.$theme.typography.font150), {}, {
    color: e.$theme.colors.contentTertiary
  });
});
F.displayName = "StyledLabel";
F.displayName = "StyledLabel";
var c = (_ = {}, b(_, y.large, {
  d: "M47.5 4H71.5529C82.2933 4 91 12.9543 91 24C91 35.0457 82.2933 44 71.5529 44H23.4471C12.7067 44 4 35.0457 4 24C4 12.9543 12.7067 4 23.4471 4H47.5195",
  width: 95,
  height: 48,
  strokeWidth: 8,
  typography: "LabelLarge"
}), b(_, y.medium, {
  d: "M39 2H60.5833C69.0977 2 76 9.16344 76 18C76 26.8366 69.0977 34 60.5833 34H17.4167C8.90228 34 2 26.8366 2 18C2 9.16344 8.90228 2 17.4167 2H39.0195",
  width: 78,
  height: 36,
  strokeWidth: 4,
  typography: "LabelMedium"
}), b(_, y.small, {
  d: "M32 1H51.6271C57.9082 1 63 6.37258 63 13C63 19.6274 57.9082 25 51.6271 25H12.3729C6.09181 25 1 19.6274 1 13C1 6.37258 6.09181 1 12.3729 1H32.0195",
  width: 64,
  height: 26,
  strokeWidth: 2,
  typography: "LabelSmall"
}), _), se = f("div", function(e) {
  var r = e.$size, t = e.$inline;
  return {
    width: c[r].width + "px",
    height: c[r].height + "px",
    position: "relative",
    display: t ? "inline-flex" : "flex",
    alignItems: "center",
    justifyContent: "center"
  };
});
se.displayName = "StyledProgressBarRoundedRoot";
se.displayName = "StyledProgressBarRoundedRoot";
var G = f("svg", function(e) {
  var r = e.$size;
  return {
    width: c[r].width + "px",
    height: c[r].height + "px",
    position: "absolute",
    fill: "none"
  };
});
G.displayName = "_StyledProgressBarRoundedSvg";
G.displayName = "_StyledProgressBarRoundedSvg";
V(G, function(e) {
  return function(t) {
    return /* @__PURE__ */ I.createElement(e, L({
      viewBox: "0 0 ".concat(c[t.$size].width, " ").concat(c[t.$size].height),
      xmlns: "http://www.w3.org/2000/svg"
    }, t));
  };
});
var U = f("path", function(e) {
  var r = e.$theme, t = e.$size;
  return {
    stroke: r.colors.backgroundTertiary,
    strokeWidth: c[t].strokeWidth + "px"
  };
});
U.displayName = "_StyledProgressBarRoundedTrackBackground";
U.displayName = "_StyledProgressBarRoundedTrackBackground";
V(U, function(e) {
  return function(t) {
    return /* @__PURE__ */ I.createElement(e, L({
      d: c[t.$size].d
    }, t));
  };
});
var Z = f("path", function(e) {
  var r = e.$theme, t = e.$size, n = e.$visible, a = e.$pathLength, o = e.$pathProgress;
  return {
    visibility: n ? "visible" : "hidden",
    stroke: r.colors.borderAccent,
    strokeWidth: c[t].strokeWidth + "px",
    strokeDasharray: a,
    strokeDashoffset: a * (1 - o) + ""
  };
});
Z.displayName = "_StyledProgressBarRoundedTrackForeground";
Z.displayName = "_StyledProgressBarRoundedTrackForeground";
V(Z, function(e) {
  return function(t) {
    return /* @__PURE__ */ I.createElement(e, L({
      d: c[t.$size].d
    }, t));
  };
});
var le = f("div", function(e) {
  var r = e.$theme, t = e.$size;
  return P({
    color: r.colors.contentPrimary
  }, r.typography[c[t].typography]);
});
le.displayName = "StyledProgressBarRoundedText";
le.displayName = "StyledProgressBarRoundedText";
function N(e) {
  "@babel/helpers - typeof";
  return N = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, N(e);
}
var Te = ["overrides", "getProgressLabel", "value", "size", "steps", "successValue", "minValue", "maxValue", "showLabel", "infinite", "errorMessage", "forwardedRef"];
function p() {
  return p = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = arguments[r];
      for (var n in t)
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
    }
    return e;
  }, p.apply(this, arguments);
}
function w(e, r) {
  return Ce(e) || je(e, r) || ze(e, r) || Ee();
}
function Ee() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ze(e, r) {
  if (e) {
    if (typeof e == "string") return oe(e, r);
    var t = Object.prototype.toString.call(e).slice(8, -1);
    if (t === "Object" && e.constructor && (t = e.constructor.name), t === "Map" || t === "Set") return Array.from(e);
    if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)) return oe(e, r);
  }
}
function oe(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var t = 0, n = new Array(r); t < r; t++)
    n[t] = e[t];
  return n;
}
function je(e, r) {
  var t = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (t != null) {
    var n = [], a = !0, o = !1, i, s;
    try {
      for (t = t.call(e); !(a = (i = t.next()).done) && (n.push(i.value), !(r && n.length === r)); a = !0)
        ;
    } catch (l) {
      o = !0, s = l;
    } finally {
      try {
        !a && t.return != null && t.return();
      } finally {
        if (o) throw s;
      }
    }
    return n;
  }
}
function Ce(e) {
  if (Array.isArray(e)) return e;
}
function Ne(e, r) {
  if (e == null) return {};
  var t = Xe(e, r), n, a;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (a = 0; a < o.length; a++)
      n = o[a], !(r.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (t[n] = e[n]);
  }
  return t;
}
function Xe(e, r) {
  if (e == null) return {};
  var t = {}, n = Object.keys(e), a, o;
  for (o = 0; o < n.length; o++)
    a = n[o], !(r.indexOf(a) >= 0) && (t[a] = e[a]);
  return t;
}
function Ve(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function Ie(e, r) {
  for (var t = 0; t < r.length; t++) {
    var n = r[t];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function Ae(e, r, t) {
  return r && Ie(e.prototype, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Me(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), r && X(e, r);
}
function X(e, r) {
  return X = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, X(e, r);
}
function De(e) {
  var r = Fe();
  return function() {
    var n = z(e), a;
    if (r) {
      var o = z(this).constructor;
      a = Reflect.construct(n, arguments, o);
    } else
      a = n.apply(this, arguments);
    return He(this, a);
  };
}
function He(e, r) {
  if (r && (N(r) === "object" || typeof r == "function"))
    return r;
  if (r !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return We(e);
}
function We(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Fe() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function z(e) {
  return z = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, z(e);
}
function Ge(e, r, t) {
  return r in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e;
}
var ue = /* @__PURE__ */ (function(e) {
  Me(t, e);
  var r = De(t);
  function t() {
    return Ve(this, t), r.apply(this, arguments);
  }
  return Ae(t, [{
    key: "componentDidMount",
    value: function() {
    }
  }, {
    key: "render",
    value: function() {
      var a = this.props, o = a.overrides, i = o === void 0 ? {} : o, s = a.getProgressLabel, l = a.value, g = a.size, R = a.steps, B = a.successValue, $ = a.minValue, x = a.maxValue, m = a.showLabel, d = a.infinite, k = a.errorMessage, j = a.forwardedRef, T = Ne(a, Te), S = this.props["aria-label"] || this.props.ariaLabel, h = x !== 100 ? x : B, C = O(i.Root, A), K = w(C, 2), ce = K[0], fe = K[1], ge = O(i.BarContainer, M), q = w(ge, 2), pe = q[0], me = q[1], ye = O(i.Bar, D), J = w(ye, 2), he = J[0], ve = J[1], be = O(i.BarProgress, H), Q = w(be, 2), Pe = Q[0], Re = Q[1], $e = O(i.Label, F), Y = w($e, 2), Se = Y[0], Oe = Y[1], we = O(i.InfiniteBar, W), ee = w(we, 2), re = ee[0], te = ee[1], v = {
        $infinite: d,
        $size: g,
        $steps: R,
        $successValue: h,
        $minValue: $,
        $maxValue: h,
        $value: l
      };
      function Be() {
        for (var ne = [], E = 0; E < R; E++)
          ne.push(/* @__PURE__ */ u.createElement(he, p({
            key: E
          }, v, ve), /* @__PURE__ */ u.createElement(Pe, p({
            $index: E
          }, v, Re))));
        return ne;
      }
      return (
        // eslint-disable-next-line jsx-a11y/role-supports-aria-props
        /* @__PURE__ */ u.createElement(ce, p({
          ref: j,
          "data-baseweb": "progress-bar",
          role: "progressbar",
          "aria-label": S || s(l, h, $),
          "aria-valuenow": d ? null : l,
          "aria-valuemin": d ? null : $,
          "aria-valuemax": d ? null : h,
          "aria-invalid": k ? !0 : null,
          "aria-errormessage": k
        }, T, v, fe), /* @__PURE__ */ u.createElement(pe, p({}, v, me), d ? /* @__PURE__ */ u.createElement(u.Fragment, null, /* @__PURE__ */ u.createElement(re, p({
          $isLeft: !0,
          $size: v.$size
        }, te)), /* @__PURE__ */ u.createElement(re, p({
          $size: v.$size
        }, te))) : Be()), m && /* @__PURE__ */ u.createElement(Se, p({}, v, Oe), s(l, h, $)))
      );
    }
  }]), t;
})(u.Component);
Ge(ue, "defaultProps", {
  getProgressLabel: function(r, t, n) {
    return "".concat(Math.round((r - n) / (t - n) * 100), "% Loaded");
  },
  infinite: !1,
  overrides: {},
  showLabel: !1,
  size: y.medium,
  steps: 1,
  successValue: 100,
  minValue: 0,
  maxValue: 100,
  value: 0
});
var de = /* @__PURE__ */ u.forwardRef(function(e, r) {
  return (
    //$FlowExpectedError[cannot-spread-inexact]
    /* @__PURE__ */ u.createElement(ue, p({
      forwardedRef: r
    }, e))
  );
});
de.displayName = "ProgressBar";
var Ue = /* @__PURE__ */ ((e) => (e.EXTRASMALL = "xs", e.SMALL = "sm", e.MEDIUM = "md", e.LARGE = "lg", e.EXTRALARGE = "xl", e))(Ue || {});
function Ke({
  value: e,
  size: r = "sm",
  overrides: t
}) {
  const n = Le(), a = {
    xs: n.spacing.twoXS,
    sm: n.spacing.sm,
    md: n.spacing.lg,
    lg: n.spacing.xl,
    xl: n.spacing.twoXL
  }, o = {
    BarContainer: {
      style: {
        marginTop: n.spacing.none,
        marginBottom: n.spacing.none,
        marginRight: n.spacing.none,
        marginLeft: n.spacing.none
      }
    },
    Bar: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
      style: ({
        $theme: i
      }) => ({
        marginTop: n.spacing.none,
        marginBottom: n.spacing.none,
        marginRight: n.spacing.none,
        marginLeft: n.spacing.none,
        height: a[r],
        backgroundColor: i.colors.progressbarTrackFill,
        borderTopLeftRadius: n.spacing.twoXS,
        borderTopRightRadius: n.spacing.twoXS,
        borderBottomLeftRadius: n.spacing.twoXS,
        borderBottomRightRadius: n.spacing.twoXS
      })
    },
    BarProgress: {
      style: () => ({
        backgroundColor: n.colors.secondary,
        borderTopLeftRadius: n.spacing.twoXS,
        borderTopRightRadius: n.spacing.twoXS,
        borderBottomLeftRadius: n.spacing.twoXS,
        borderBottomRightRadius: n.spacing.twoXS
      })
    }
  };
  return /* @__PURE__ */ xe.jsx(de, { value: e, overrides: ke(o, t) });
}
export {
  Ke as P,
  Ue as S
};
//# sourceMappingURL=ProgressBar-Cuz7rhdP.js.map
