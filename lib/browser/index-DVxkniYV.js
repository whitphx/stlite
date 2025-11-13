import { b1 as Ye, ac as J, r as x, br as pt, ad as vt, o as Q, aL as mt, aM as bt, s as me, t as Ve, bh as yt, u as Tt, bs as kt, j as Z, W as Ot, l as wt, Q as Rt, T as St, P as Mt, bt as _t, bu as Ee } from "./index-COqA-032.js";
import { s as ze } from "./sprintf-D5E86llw.js";
import { u as Et } from "./useBasicWidgetState-Hu_BQk7V.js";
var se = {}, H = {}, ue = {}, ce = {}, Ne;
function Ie() {
  if (Ne) return ce;
  Ne = 1, Object.defineProperty(ce, "__esModule", { value: !0 }), ce.Direction = void 0;
  var e;
  return (function(r) {
    r.Right = "to right", r.Left = "to left", r.Down = "to bottom", r.Up = "to top";
  })(e || (ce.Direction = e = {})), ce;
}
var Ue;
function Ze() {
  return Ue || (Ue = 1, (function(e) {
    var r = ue && ue.__spreadArray || function(i, s, u) {
      if (u || arguments.length === 2) for (var h = 0, m = s.length, v; h < m; h++)
        (v || !(h in s)) && (v || (v = Array.prototype.slice.call(s, 0, h)), v[h] = s[h]);
      return i.concat(v || Array.prototype.slice.call(s));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.isIOS = e.useThumbOverlap = e.assertUnreachable = e.voidFn = e.getTrackBackground = e.replaceAt = e.schd = e.translate = e.getClosestThumbIndex = e.translateThumbs = e.getPaddingAndBorder = e.getMargin = e.checkInitialOverlap = e.checkValuesAgainstBoundaries = e.checkBoundaries = e.isVertical = e.relativeValue = e.normalizeValue = e.isStepDivisible = e.isTouchEvent = e.getStepDecimals = void 0;
    var n = Ye(), o = /* @__PURE__ */ Ie(), p = function(i) {
      var s = i.toString().split(".")[1];
      return s ? s.length : 0;
    };
    e.getStepDecimals = p;
    function S(i) {
      return i.touches && i.touches.length || i.changedTouches && i.changedTouches.length;
    }
    e.isTouchEvent = S;
    function l(i, s, u) {
      var h = (s - i) / u, m = 8, v = Number(h.toFixed(m));
      return parseInt(v.toString(), 10) === v;
    }
    e.isStepDivisible = l;
    function g(i, s, u, h, m, v, T) {
      var _ = 1e11;
      if (i = Math.round(i * _) / _, !v) {
        var P = T[s - 1], C = T[s + 1];
        if (P && P > i)
          return P;
        if (C && C < i)
          return C;
      }
      if (i > h)
        return h;
      if (i < u)
        return u;
      var U = Math.floor(i * _ - u * _) % Math.floor(m * _), z = Math.floor(i * _ - Math.abs(U)), W = U === 0 ? i : z / _, A = Math.abs(U / _) < m / 2 ? W : W + m, L = (0, e.getStepDecimals)(m);
      return parseFloat(A.toFixed(L));
    }
    e.normalizeValue = g;
    function F(i, s, u) {
      return (i - s) / (u - s);
    }
    e.relativeValue = F;
    function $(i) {
      return i === o.Direction.Up || i === o.Direction.Down;
    }
    e.isVertical = $;
    function V(i, s, u) {
      if (s >= u)
        throw new RangeError("min (".concat(s, ") is equal/bigger than max (").concat(u, ")"));
      if (i < s)
        throw new RangeError("value (".concat(i, ") is smaller than min (").concat(s, ")"));
      if (i > u)
        throw new RangeError("value (".concat(i, ") is bigger than max (").concat(u, ")"));
    }
    e.checkBoundaries = V;
    function E(i, s, u) {
      return i < s ? s : i > u ? u : i;
    }
    e.checkValuesAgainstBoundaries = E;
    function y(i) {
      if (!(i.length < 2) && !i.slice(1).every(function(s, u) {
        return i[u] <= s;
      }))
        throw new RangeError("values={[".concat(i, "]} needs to be sorted when allowOverlap={false}"));
    }
    e.checkInitialOverlap = y;
    function d(i) {
      var s = window.getComputedStyle(i);
      return {
        top: parseInt(s["margin-top"], 10),
        bottom: parseInt(s["margin-bottom"], 10),
        left: parseInt(s["margin-left"], 10),
        right: parseInt(s["margin-right"], 10)
      };
    }
    e.getMargin = d;
    function t(i) {
      var s = window.getComputedStyle(i);
      return {
        top: parseInt(s["padding-top"], 10) + parseInt(s["border-top-width"], 10),
        bottom: parseInt(s["padding-bottom"], 10) + parseInt(s["border-bottom-width"], 10),
        left: parseInt(s["padding-left"], 10) + parseInt(s["border-left-width"], 10),
        right: parseInt(s["padding-right"], 10) + parseInt(s["border-right-width"], 10)
      };
    }
    e.getPaddingAndBorder = t;
    function a(i, s, u) {
      var h = u ? -1 : 1;
      i.forEach(function(m, v) {
        return f(m, h * s[v].x, s[v].y);
      });
    }
    e.translateThumbs = a;
    function c(i, s, u, h) {
      for (var m = 0, v = D(i[0], s, u, h), T = 1; T < i.length; T++) {
        var _ = D(i[T], s, u, h);
        _ < v && (v = _, m = T);
      }
      return m;
    }
    e.getClosestThumbIndex = c;
    function f(i, s, u) {
      i.style.transform = "translate(".concat(s, "px, ").concat(u, "px)");
    }
    e.translate = f;
    var b = function(i) {
      var s = [], u = null, h = function() {
        for (var m = [], v = 0; v < arguments.length; v++)
          m[v] = arguments[v];
        s = m, !u && (u = requestAnimationFrame(function() {
          u = null, i.apply(void 0, s);
        }));
      };
      return h;
    };
    e.schd = b;
    function k(i, s, u) {
      var h = i.slice(0);
      return h[s] = u, h;
    }
    e.replaceAt = k;
    function I(i) {
      var s = i.values, u = i.colors, h = i.min, m = i.max, v = i.direction, T = v === void 0 ? o.Direction.Right : v, _ = i.rtl, P = _ === void 0 ? !1 : _;
      P && T === o.Direction.Right ? T = o.Direction.Left : P && o.Direction.Left && (T = o.Direction.Right);
      var C = s.slice(0).sort(function(z, W) {
        return z - W;
      }).map(function(z) {
        return (z - h) / (m - h) * 100;
      }), U = C.reduce(function(z, W, A) {
        return "".concat(z, ", ").concat(u[A], " ").concat(W, "%, ").concat(u[A + 1], " ").concat(W, "%");
      }, "");
      return "linear-gradient(".concat(T, ", ").concat(u[0], " 0%").concat(U, ", ").concat(u[u.length - 1], " 100%)");
    }
    e.getTrackBackground = I;
    function O() {
    }
    e.voidFn = O;
    function w(i) {
      throw new Error("Didn't expect to get here");
    }
    e.assertUnreachable = w;
    var M = function(i, s, u, h, m) {
      m === void 0 && (m = function(T) {
        return T;
      });
      var v = Math.ceil(r([i], Array.from(i.children), !0).reduce(function(T, _) {
        var P = Math.ceil(_.getBoundingClientRect().width);
        if (_.innerText && _.innerText.includes(u) && _.childElementCount === 0) {
          var C = _.cloneNode(!0);
          C.innerHTML = m(s.toFixed(h)), C.style.visibility = "hidden", document.body.appendChild(C), P = Math.ceil(C.getBoundingClientRect().width), document.body.removeChild(C);
        }
        return P > T ? P : T;
      }, i.getBoundingClientRect().width));
      return v;
    }, B = function(i, s, u, h, m, v, T) {
      T === void 0 && (T = function(C) {
        return C;
      });
      var _ = [], P = function(C) {
        var U = M(u[C], h[C], m, v, T), z = s[C].x;
        s.forEach(function(W, A) {
          var L = W.x, G = M(u[A], h[A], m, v, T);
          C !== A && (z >= L && z <= L + G || z + U >= L && z + U <= L + G) && (_.includes(A) || (_.push(C), _.push(A), _ = r(r([], _, !0), [C, A], !1), P(A)));
        });
      };
      return P(i), Array.from(new Set(_.sort()));
    }, R = function(i, s, u, h, m, v) {
      h === void 0 && (h = 0.1), m === void 0 && (m = " - "), v === void 0 && (v = function(A) {
        return A;
      });
      var T = (0, e.getStepDecimals)(h), _ = (0, n.useState)({}), P = _[0], C = _[1], U = (0, n.useState)(v(s[u].toFixed(T))), z = U[0], W = U[1];
      return (0, n.useEffect)(function() {
        if (i) {
          var A = i.getThumbs();
          if (A.length < 1)
            return;
          var L = {}, G = i.getOffsets(), ne = B(u, G, A, s, m, T, v), le = v(s[u].toFixed(T));
          if (ne.length) {
            var ee = ne.reduce(function(te, oe, ge, pe) {
              return te.length ? r(r([], te, !0), [G[pe[ge]].x], !1) : [G[pe[ge]].x];
            }, []);
            if (Math.min.apply(Math, ee) === G[u].x) {
              var de = [];
              ne.forEach(function(te) {
                de.push(s[te].toFixed(T));
              }), le = Array.from(new Set(de.sort(function(te, oe) {
                return parseFloat(te) - parseFloat(oe);
              }))).map(v).join(m);
              var fe = Math.min.apply(Math, ee), he = Math.max.apply(Math, ee), _e = A[ne[ee.indexOf(he)]].getBoundingClientRect().width;
              L.left = "".concat(Math.abs(fe - (he + _e)) / 2, "px"), L.transform = "translate(-50%, 0)";
            } else
              L.visibility = "hidden";
          }
          W(le), C(L);
        }
      }, [i, s]), [z, P];
    };
    e.useThumbOverlap = R;
    function D(i, s, u, h) {
      var m = i.getBoundingClientRect(), v = m.left, T = m.top, _ = m.width, P = m.height;
      return $(h) ? Math.abs(u - (T + P / 2)) : Math.abs(s - (v + _ / 2));
    }
    var j = function() {
      var i, s = ((i = navigator.userAgentData) === null || i === void 0 ? void 0 : i.platform) || navigator.platform;
      return [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod"
      ].includes(s) || // iPad on iOS 13 detection
      navigator.userAgent.includes("Mac") && "ontouchend" in document;
    };
    e.isIOS = j;
  })(ue)), ue;
}
var He;
function xt() {
  if (He) return H;
  He = 1;
  var e = H && H.__extends || /* @__PURE__ */ (function() {
    var E = function(y, d) {
      return E = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, a) {
        t.__proto__ = a;
      } || function(t, a) {
        for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (t[c] = a[c]);
      }, E(y, d);
    };
    return function(y, d) {
      if (typeof d != "function" && d !== null)
        throw new TypeError("Class extends value " + String(d) + " is not a constructor or null");
      E(y, d);
      function t() {
        this.constructor = y;
      }
      y.prototype = d === null ? Object.create(d) : (t.prototype = d.prototype, new t());
    };
  })(), r = H && H.__createBinding || (Object.create ? (function(E, y, d, t) {
    t === void 0 && (t = d);
    var a = Object.getOwnPropertyDescriptor(y, d);
    (!a || ("get" in a ? !y.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return y[d];
    } }), Object.defineProperty(E, t, a);
  }) : (function(E, y, d, t) {
    t === void 0 && (t = d), E[t] = y[d];
  })), n = H && H.__setModuleDefault || (Object.create ? (function(E, y) {
    Object.defineProperty(E, "default", { enumerable: !0, value: y });
  }) : function(E, y) {
    E.default = y;
  }), o = H && H.__importStar || function(E) {
    if (E && E.__esModule) return E;
    var y = {};
    if (E != null) for (var d in E) d !== "default" && Object.prototype.hasOwnProperty.call(E, d) && r(y, E, d);
    return n(y, E), y;
  }, p = H && H.__spreadArray || function(E, y, d) {
    if (d || arguments.length === 2) for (var t = 0, a = y.length, c; t < a; t++)
      (c || !(t in y)) && (c || (c = Array.prototype.slice.call(y, 0, t)), c[t] = y[t]);
    return E.concat(c || Array.prototype.slice.call(y));
  };
  Object.defineProperty(H, "__esModule", { value: !0 });
  var S = o(Ye()), l = /* @__PURE__ */ Ze(), g = /* @__PURE__ */ Ie(), F = ["ArrowRight", "ArrowUp", "k", "PageUp"], $ = ["ArrowLeft", "ArrowDown", "j", "PageDown"], V = (
    /** @class */
    (function(E) {
      e(y, E);
      function y(d) {
        var t = E.call(this, d) || this;
        if (t.trackRef = S.createRef(), t.thumbRefs = [], t.state = {
          draggedTrackPos: [-1, -1],
          draggedThumbIndex: -1,
          thumbZIndexes: new Array(t.props.values.length).fill(0).map(function(a, c) {
            return c;
          }),
          isChanged: !1,
          markOffsets: []
        }, t.getOffsets = function() {
          var a = t.props, c = a.direction, f = a.values, b = a.min, k = a.max, I = t.trackRef.current;
          if (!I)
            return console.warn("No track element found."), [];
          var O = I.getBoundingClientRect(), w = (0, l.getPaddingAndBorder)(I);
          return t.getThumbs().map(function(M, B) {
            var R = { x: 0, y: 0 }, D = M.getBoundingClientRect(), j = (0, l.getMargin)(M);
            switch (c) {
              case g.Direction.Right:
                return R.x = (j.left + w.left) * -1, R.y = ((D.height - O.height) / 2 + w.top) * -1, R.x += O.width * (0, l.relativeValue)(f[B], b, k) - D.width / 2, R;
              case g.Direction.Left:
                return R.x = (j.right + w.right) * -1, R.y = ((D.height - O.height) / 2 + w.top) * -1, R.x += O.width - O.width * (0, l.relativeValue)(f[B], b, k) - D.width / 2, R;
              case g.Direction.Up:
                return R.x = ((D.width - O.width) / 2 + j.left + w.left) * -1, R.y = -w.left, R.y += O.height - O.height * (0, l.relativeValue)(f[B], b, k) - D.height / 2, R;
              case g.Direction.Down:
                return R.x = ((D.width - O.width) / 2 + j.left + w.left) * -1, R.y = -w.left, R.y += O.height * (0, l.relativeValue)(f[B], b, k) - D.height / 2, R;
              default:
                return (0, l.assertUnreachable)(c);
            }
          });
        }, t.getThumbs = function() {
          return t.trackRef && t.trackRef.current ? Array.from(t.trackRef.current.children).filter(function(a) {
            return a.hasAttribute("aria-valuenow");
          }) : (console.warn("No thumbs found in the track container. Did you forget to pass & spread the `props` param in renderTrack?"), []);
        }, t.getTargetIndex = function(a) {
          return t.getThumbs().findIndex(function(c) {
            return c === a.target || c.contains(a.target);
          });
        }, t.addTouchEvents = function(a) {
          document.addEventListener("touchmove", t.schdOnTouchMove, {
            passive: !1
          }), document.addEventListener("touchend", t.schdOnEnd, {
            passive: !1
          }), document.addEventListener("touchcancel", t.schdOnEnd, {
            passive: !1
          });
        }, t.addMouseEvents = function(a) {
          document.addEventListener("mousemove", t.schdOnMouseMove), document.addEventListener("mouseup", t.schdOnEnd);
        }, t.onMouseDownTrack = function(a) {
          var c;
          if (!(a.button !== 0 || (0, l.isIOS)()))
            if (a.persist(), a.preventDefault(), t.addMouseEvents(a.nativeEvent), t.props.values.length > 1 && t.props.draggableTrack) {
              if (t.thumbRefs.some(function(b) {
                var k;
                return (k = b.current) === null || k === void 0 ? void 0 : k.contains(a.target);
              }))
                return;
              t.setState({
                draggedTrackPos: [a.clientX, a.clientY]
              }, function() {
                return t.onMove(a.clientX, a.clientY);
              });
            } else {
              var f = (0, l.getClosestThumbIndex)(t.thumbRefs.map(function(b) {
                return b.current;
              }), a.clientX, a.clientY, t.props.direction);
              (c = t.thumbRefs[f].current) === null || c === void 0 || c.focus(), t.setState({
                draggedThumbIndex: f
              }, function() {
                return t.onMove(a.clientX, a.clientY);
              });
            }
        }, t.onResize = function() {
          (0, l.translateThumbs)(t.getThumbs(), t.getOffsets(), t.props.rtl), t.calculateMarkOffsets();
        }, t.onTouchStartTrack = function(a) {
          var c;
          if (a.persist(), t.addTouchEvents(a.nativeEvent), t.props.values.length > 1 && t.props.draggableTrack) {
            if (t.thumbRefs.some(function(b) {
              var k;
              return (k = b.current) === null || k === void 0 ? void 0 : k.contains(a.target);
            }))
              return;
            t.setState({
              draggedTrackPos: [a.touches[0].clientX, a.touches[0].clientY]
            }, function() {
              return t.onMove(a.touches[0].clientX, a.touches[0].clientY);
            });
          } else {
            var f = (0, l.getClosestThumbIndex)(t.thumbRefs.map(function(b) {
              return b.current;
            }), a.touches[0].clientX, a.touches[0].clientY, t.props.direction);
            (c = t.thumbRefs[f].current) === null || c === void 0 || c.focus(), t.setState({
              draggedThumbIndex: f
            }, function() {
              return t.onMove(a.touches[0].clientX, a.touches[0].clientY);
            });
          }
        }, t.onMouseOrTouchStart = function(a) {
          if (!t.props.disabled) {
            var c = (0, l.isTouchEvent)(a);
            if (!(!c && a.button !== 0)) {
              var f = t.getTargetIndex(a);
              f !== -1 && (c ? t.addTouchEvents(a) : t.addMouseEvents(a), t.setState({
                draggedThumbIndex: f,
                thumbZIndexes: t.state.thumbZIndexes.map(function(b, k) {
                  return k === f ? Math.max.apply(Math, t.state.thumbZIndexes) : b <= t.state.thumbZIndexes[f] ? b : b - 1;
                })
              }));
            }
          }
        }, t.onMouseMove = function(a) {
          a.preventDefault(), t.onMove(a.clientX, a.clientY);
        }, t.onTouchMove = function(a) {
          a.preventDefault(), t.onMove(a.touches[0].clientX, a.touches[0].clientY);
        }, t.onKeyDown = function(a) {
          var c = t.props, f = c.values, b = c.onChange, k = c.step, I = c.rtl, O = c.direction, w = t.state.isChanged, M = t.getTargetIndex(a.nativeEvent), B = I || O === g.Direction.Left || O === g.Direction.Down ? -1 : 1;
          M !== -1 && (F.includes(a.key) ? (a.preventDefault(), t.setState({
            draggedThumbIndex: M,
            isChanged: !0
          }), b((0, l.replaceAt)(f, M, t.normalizeValue(f[M] + B * (a.key === "PageUp" ? k * 10 : k), M)))) : $.includes(a.key) ? (a.preventDefault(), t.setState({
            draggedThumbIndex: M,
            isChanged: !0
          }), b((0, l.replaceAt)(f, M, t.normalizeValue(f[M] - B * (a.key === "PageDown" ? k * 10 : k), M)))) : a.key === "Tab" ? t.setState({ draggedThumbIndex: -1 }, function() {
            w && t.fireOnFinalChange();
          }) : w && t.fireOnFinalChange());
        }, t.onKeyUp = function(a) {
          var c = t.state.isChanged;
          t.setState({
            draggedThumbIndex: -1
          }, function() {
            c && t.fireOnFinalChange();
          });
        }, t.onMove = function(a, c) {
          var f = t.state, b = f.draggedThumbIndex, k = f.draggedTrackPos, I = t.props, O = I.direction, w = I.min, M = I.max, B = I.onChange, R = I.values, D = I.step, j = I.rtl;
          if (b === -1 && k[0] === -1 && k[1] === -1)
            return null;
          var i = t.trackRef.current;
          if (!i)
            return null;
          var s = i.getBoundingClientRect(), u = (0, l.isVertical)(O) ? s.height : s.width;
          if (k[0] !== -1 && k[1] !== -1) {
            var h = a - k[0], m = c - k[1], v = 0;
            switch (O) {
              case g.Direction.Right:
              case g.Direction.Left:
                v = h / u * (M - w);
                break;
              case g.Direction.Down:
              case g.Direction.Up:
                v = m / u * (M - w);
                break;
              default:
                (0, l.assertUnreachable)(O);
            }
            if (j && (v *= -1), Math.abs(v) >= D / 2) {
              for (var T = 0; T < t.thumbRefs.length; T++) {
                if (R[T] === M && Math.sign(v) === 1 || R[T] === w && Math.sign(v) === -1)
                  return;
                var _ = R[T] + v;
                _ > M ? v = M - R[T] : _ < w && (v = w - R[T]);
              }
              for (var P = R.slice(0), T = 0; T < t.thumbRefs.length; T++)
                P = (0, l.replaceAt)(P, T, t.normalizeValue(R[T] + v, T));
              t.setState({
                draggedTrackPos: [a, c]
              }), B(P);
            }
          } else {
            var C = 0;
            switch (O) {
              case g.Direction.Right:
                C = (a - s.left) / u * (M - w) + w;
                break;
              case g.Direction.Left:
                C = (u - (a - s.left)) / u * (M - w) + w;
                break;
              case g.Direction.Down:
                C = (c - s.top) / u * (M - w) + w;
                break;
              case g.Direction.Up:
                C = (u - (c - s.top)) / u * (M - w) + w;
                break;
              default:
                (0, l.assertUnreachable)(O);
            }
            j && (C = M + w - C), Math.abs(R[b] - C) >= D / 2 && B((0, l.replaceAt)(R, b, t.normalizeValue(C, b)));
          }
        }, t.normalizeValue = function(a, c) {
          var f = t.props, b = f.min, k = f.max, I = f.step, O = f.allowOverlap, w = f.values;
          return (0, l.normalizeValue)(a, c, b, k, I, O, w);
        }, t.onEnd = function(a) {
          if (a.preventDefault(), document.removeEventListener("mousemove", t.schdOnMouseMove), document.removeEventListener("touchmove", t.schdOnTouchMove), document.removeEventListener("mouseup", t.schdOnEnd), document.removeEventListener("touchend", t.schdOnEnd), document.removeEventListener("touchcancel", t.schdOnEnd), t.state.draggedThumbIndex === -1 && t.state.draggedTrackPos[0] === -1 && t.state.draggedTrackPos[1] === -1)
            return null;
          t.setState({ draggedThumbIndex: -1, draggedTrackPos: [-1, -1] }, function() {
            t.fireOnFinalChange();
          });
        }, t.fireOnFinalChange = function() {
          t.setState({ isChanged: !1 });
          var a = t.props, c = a.onFinalChange, f = a.values;
          c && c(f);
        }, t.updateMarkRefs = function(a) {
          if (!a.renderMark) {
            t.numOfMarks = void 0, t.markRefs = void 0;
            return;
          }
          t.numOfMarks = (a.max - a.min) / t.props.step, t.markRefs = [];
          for (var c = 0; c < t.numOfMarks + 1; c++)
            t.markRefs[c] = S.createRef();
        }, t.calculateMarkOffsets = function() {
          if (!(!t.props.renderMark || !t.trackRef || !t.numOfMarks || !t.markRefs || t.trackRef.current === null)) {
            for (var a = window.getComputedStyle(t.trackRef.current), c = parseInt(a.width, 10), f = parseInt(a.height, 10), b = parseInt(a.paddingLeft, 10), k = parseInt(a.paddingTop, 10), I = [], O = 0; O < t.numOfMarks + 1; O++) {
              var w = 9999, M = 9999;
              if (t.markRefs[O].current) {
                var B = t.markRefs[O].current.getBoundingClientRect();
                w = B.height, M = B.width;
              }
              t.props.direction === g.Direction.Left || t.props.direction === g.Direction.Right ? I.push([
                Math.round(c / t.numOfMarks * O + b - M / 2),
                -Math.round((w - f) / 2)
              ]) : I.push([
                Math.round(f / t.numOfMarks * O + k - w / 2),
                -Math.round((M - c) / 2)
              ]);
            }
            t.setState({ markOffsets: I });
          }
        }, d.step === 0)
          throw new Error('"step" property should be a positive number');
        return t.schdOnMouseMove = (0, l.schd)(t.onMouseMove), t.schdOnTouchMove = (0, l.schd)(t.onTouchMove), t.schdOnEnd = (0, l.schd)(t.onEnd), t.thumbRefs = d.values.map(function() {
          return S.createRef();
        }), t.updateMarkRefs(d), t;
      }
      return y.prototype.componentDidMount = function() {
        var d = this, t = this.props, a = t.values, c = t.min, f = t.step;
        this.resizeObserver = window.ResizeObserver ? new window.ResizeObserver(this.onResize) : {
          observe: function() {
            return window.addEventListener("resize", d.onResize);
          },
          unobserve: function() {
            return window.removeEventListener("resize", d.onResize);
          }
        }, document.addEventListener("touchstart", this.onMouseOrTouchStart, {
          passive: !1
        }), document.addEventListener("mousedown", this.onMouseOrTouchStart, {
          passive: !1
        }), !this.props.allowOverlap && (0, l.checkInitialOverlap)(this.props.values), this.props.values.forEach(function(b) {
          return (0, l.checkBoundaries)(b, d.props.min, d.props.max);
        }), this.resizeObserver.observe(this.trackRef.current), (0, l.translateThumbs)(this.getThumbs(), this.getOffsets(), this.props.rtl), this.calculateMarkOffsets(), a.forEach(function(b) {
          (0, l.isStepDivisible)(c, b, f) || console.warn("The `values` property is in conflict with the current `step`, `min`, and `max` properties. Please provide values that are accessible using the min, max, and step values.");
        });
      }, y.prototype.componentDidUpdate = function(d, t) {
        var a = this.props, c = a.max, f = a.min, b = a.step, k = a.values, I = a.rtl;
        (d.max !== c || d.min !== f || d.step !== b) && this.updateMarkRefs(this.props), (0, l.translateThumbs)(this.getThumbs(), this.getOffsets(), I), (d.max !== c || d.min !== f || d.step !== b || t.markOffsets.length !== this.state.markOffsets.length) && (this.calculateMarkOffsets(), k.forEach(function(O) {
          (0, l.isStepDivisible)(f, O, b) || console.warn("The `values` property is in conflict with the current `step`, `min`, and `max` properties. Please provide values that are accessible using the min, max, and step values.");
        }));
      }, y.prototype.componentWillUnmount = function() {
        var d = {
          passive: !1
        };
        document.removeEventListener("mousedown", this.onMouseOrTouchStart, d), document.removeEventListener("mousemove", this.schdOnMouseMove), document.removeEventListener("touchmove", this.schdOnTouchMove), document.removeEventListener("touchstart", this.onMouseOrTouchStart), document.removeEventListener("mouseup", this.schdOnEnd), document.removeEventListener("touchend", this.schdOnEnd), this.resizeObserver.unobserve(this.trackRef.current);
      }, y.prototype.render = function() {
        var d = this, t = this.props, a = t.label, c = t.labelledBy, f = t.renderTrack, b = t.renderThumb, k = t.renderMark, I = k === void 0 ? function() {
          return null;
        } : k, O = t.values, w = t.min, M = t.max, B = t.allowOverlap, R = t.disabled, D = this.state, j = D.draggedThumbIndex, i = D.thumbZIndexes, s = D.markOffsets;
        return f({
          props: {
            style: {
              // creates stacking context that prevents z-index applied to thumbs
              // interfere with other elements
              transform: "scale(1)",
              cursor: j > -1 ? "grabbing" : this.props.draggableTrack ? (0, l.isVertical)(this.props.direction) ? "ns-resize" : "ew-resize" : O.length === 1 && !R ? "pointer" : "inherit"
            },
            onMouseDown: R ? l.voidFn : this.onMouseDownTrack,
            onTouchStart: R ? l.voidFn : this.onTouchStartTrack,
            ref: this.trackRef
          },
          isDragged: this.state.draggedThumbIndex > -1,
          disabled: R,
          children: p(p([], s.map(function(u, h, m) {
            return I({
              props: {
                style: d.props.direction === g.Direction.Left || d.props.direction === g.Direction.Right ? {
                  position: "absolute",
                  left: "".concat(u[0], "px"),
                  marginTop: "".concat(u[1], "px")
                } : {
                  position: "absolute",
                  top: "".concat(u[0], "px"),
                  marginLeft: "".concat(u[1], "px")
                },
                key: "mark".concat(h),
                ref: d.markRefs[h]
              },
              index: h
            });
          }), !0), O.map(function(u, h) {
            var m = d.state.draggedThumbIndex === h;
            return b({
              index: h,
              value: u,
              isDragged: m,
              props: {
                style: {
                  position: "absolute",
                  zIndex: i[h],
                  cursor: R ? "inherit" : m ? "grabbing" : "grab",
                  userSelect: "none",
                  touchAction: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none"
                },
                key: h,
                tabIndex: R ? void 0 : 0,
                "aria-valuemax": B ? M : O[h + 1] || M,
                "aria-valuemin": B ? w : O[h - 1] || w,
                "aria-valuenow": u,
                draggable: !1,
                ref: d.thumbRefs[h],
                "aria-label": a,
                "aria-labelledby": c,
                role: "slider",
                onKeyDown: R ? l.voidFn : d.onKeyDown,
                onKeyUp: R ? l.voidFn : d.onKeyUp
              }
            });
          }), !0)
        });
      }, y.defaultProps = {
        label: "Accessibility label",
        labelledBy: null,
        step: 1,
        direction: g.Direction.Right,
        rtl: !1,
        disabled: !1,
        allowOverlap: !1,
        draggableTrack: !1,
        min: 0,
        max: 100
      }, y;
    })(S.Component)
  );
  return H.default = V, H;
}
var We;
function It() {
  return We || (We = 1, (function(e) {
    var r = se && se.__importDefault || function(S) {
      return S && S.__esModule ? S : { default: S };
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.checkValuesAgainstBoundaries = e.relativeValue = e.useThumbOverlap = e.Direction = e.getTrackBackground = e.Range = void 0;
    var n = r(/* @__PURE__ */ xt());
    e.Range = n.default;
    var o = /* @__PURE__ */ Ze();
    Object.defineProperty(e, "getTrackBackground", { enumerable: !0, get: function() {
      return o.getTrackBackground;
    } }), Object.defineProperty(e, "useThumbOverlap", { enumerable: !0, get: function() {
      return o.useThumbOverlap;
    } }), Object.defineProperty(e, "relativeValue", { enumerable: !0, get: function() {
      return o.relativeValue;
    } }), Object.defineProperty(e, "checkValuesAgainstBoundaries", { enumerable: !0, get: function() {
      return o.checkValuesAgainstBoundaries;
    } });
    var p = /* @__PURE__ */ Ie();
    Object.defineProperty(e, "Direction", { enumerable: !0, get: function() {
      return p.Direction;
    } });
  })(se)), se;
}
var Ge = /* @__PURE__ */ It();
function qe(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(p) {
      return Object.getOwnPropertyDescriptor(e, p).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function ve(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r] != null ? arguments[r] : {};
    r % 2 ? qe(Object(n), !0).forEach(function(o) {
      Ct(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : qe(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function Ct(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
var be = J("div", {
  position: "relative",
  width: "100%"
});
be.displayName = "Root";
be.displayName = "Root";
be.displayName = "StyledRoot";
var ye = J("div", function(e) {
  var r = e.$theme, n = e.$value, o = n === void 0 ? [] : n, p = e.$disabled, S = e.$isDragged, l = r.sizing, g = "inherit";
  return p ? g = "not-allowed" : S ? g = "grabbing" : o.length === 1 && (g = "pointer"), {
    paddingTop: l.scale600,
    paddingBottom: l.scale600,
    paddingRight: l.scale600,
    paddingLeft: l.scale600,
    display: "flex",
    cursor: g,
    backgroundColor: r.colors.sliderTrackFill
  };
});
ye.displayName = "Track";
ye.displayName = "Track";
ye.displayName = "StyledTrack";
var Te = J("div", function(e) {
  var r = e.$theme, n = e.$value, o = n === void 0 ? [] : n, p = e.$min, S = e.$max, l = e.$disabled, g = r.colors, F = r.borders, $ = r.direction, V = r.borders.useRoundedCorners ? F.radius100 : 0;
  return {
    borderTopLeftRadius: V,
    borderTopRightRadius: V,
    borderBottomRightRadius: V,
    borderBottomLeftRadius: V,
    background: Ge.getTrackBackground({
      values: o,
      colors: o.length === 1 ? [l ? g.borderOpaque : g.primary, l ? g.backgroundSecondary : g.borderOpaque] : [l ? g.backgroundSecondary : g.borderOpaque, l ? g.borderOpaque : g.primary, l ? g.backgroundSecondary : g.borderOpaque],
      min: p || 0,
      max: S || 0,
      rtl: $ === "rtl"
    }),
    height: "2px",
    width: "100%",
    alignSelf: "center",
    cursor: l ? "not-allowed" : "inherit"
  };
});
Te.displayName = "InnerTrack";
Te.displayName = "InnerTrack";
Te.displayName = "StyledInnerTrack";
var ke = J("div", function(e) {
  return {
    width: "4px",
    height: "2px",
    backgroundColor: e.$theme.colors.backgroundPrimary,
    marginLeft: "16px"
  };
});
ke.displayName = "Mark";
ke.displayName = "Mark";
ke.displayName = "StyledMark";
var Oe = J("div", function(e) {
  return ve(ve({}, e.$theme.typography.font200), {}, {
    color: e.$theme.colors.contentPrimary
  });
});
Oe.displayName = "Tick";
Oe.displayName = "Tick";
Oe.displayName = "StyledTick";
var we = J("div", function(e) {
  var r = e.$theme, n = r.sizing;
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: n.scale600,
    paddingLeft: n.scale600,
    paddingBottom: n.scale400
  };
});
we.displayName = "TickBar";
we.displayName = "TickBar";
we.displayName = "StyledTickBar";
var Re = J("div", function(e) {
  var r = e.$theme, n = e.$value, o = n === void 0 ? [] : n, p = e.$thumbIndex, S = e.$disabled, l = o.length === 2 && p === 0, g = o.length === 2 && p === 1;
  return r.direction === "rtl" && (g || l) && (l = !l, g = !g), {
    height: "24px",
    width: "24px",
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
    borderBottomLeftRadius: "24px",
    borderBottomRightRadius: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: S ? r.colors.sliderHandleFillDisabled : r.colors.sliderHandleFill,
    outline: "none",
    boxShadow: e.$isFocusVisible ? "0 0 0 3px ".concat(r.colors.accent) : "0 1px 4px rgba(0, 0, 0, 0.12)",
    cursor: S ? "not-allowed" : "inherit"
  };
});
Re.displayName = "Thumb";
Re.displayName = "Thumb";
Re.displayName = "StyledThumb";
var Se = J("div", function(e) {
  var r = e.$disabled, n = e.$theme;
  return {
    position: "absolute",
    top: "-16px",
    width: "4px",
    height: "20px",
    backgroundColor: r ? n.colors.sliderHandleFillDisabled : n.colors.sliderHandleInnerFill
  };
});
Se.displayName = "InnerThumb";
Se.displayName = "InnerThumb";
Se.displayName = "StyledInnerThumb";
var Me = J("div", function(e) {
  var r = e.$disabled, n = e.$theme;
  return ve(ve({
    position: "absolute",
    top: "-".concat(n.sizing.scale1400)
  }, n.typography.font200), {}, {
    backgroundColor: r ? n.colors.sliderHandleFillDisabled : n.colors.sliderHandleInnerFill,
    color: n.colors.contentInversePrimary,
    paddingLeft: n.sizing.scale600,
    paddingRight: n.sizing.scale600,
    paddingTop: n.sizing.scale500,
    paddingBottom: n.sizing.scale500,
    borderBottomLeftRadius: "48px",
    borderBottomRightRadius: "48px",
    borderTopLeftRadius: "48px",
    borderTopRightRadius: "48px",
    whiteSpace: "nowrap"
  });
});
Me.displayName = "ThumbValue";
Me.displayName = "ThumbValue";
Me.displayName = "StyledThumbValue";
function Ke(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(p) {
      return Object.getOwnPropertyDescriptor(e, p).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Dt(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = arguments[r] != null ? arguments[r] : {};
    r % 2 ? Ke(Object(n), !0).forEach(function(o) {
      Pt(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ke(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function Pt(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
function X() {
  return X = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var n = arguments[r];
      for (var o in n)
        Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
    }
    return e;
  }, X.apply(this, arguments);
}
function K(e, r) {
  return jt(e) || Lt(e, r) || At(e, r) || Bt();
}
function Bt() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function At(e, r) {
  if (e) {
    if (typeof e == "string") return Xe(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Xe(e, r);
  }
}
function Xe(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var n = 0, o = new Array(r); n < r; n++)
    o[n] = e[n];
  return o;
}
function Lt(e, r) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o = [], p = !0, S = !1, l, g;
    try {
      for (n = n.call(e); !(p = (l = n.next()).done) && (o.push(l.value), !(r && o.length === r)); p = !0)
        ;
    } catch (F) {
      S = !0, g = F;
    } finally {
      try {
        !p && n.return != null && n.return();
      } finally {
        if (S) throw g;
      }
    }
    return o;
  }
}
function jt(e) {
  if (Array.isArray(e)) return e;
}
var Ft = function(r) {
  if (r.length > 2 || r.length === 0)
    throw new Error("the value prop represents positions of thumbs, so its length can be only one or two");
  return r;
};
function $t(e) {
  var r = e.overrides, n = r === void 0 ? {} : r, o = e.disabled, p = o === void 0 ? !1 : o, S = e.marks, l = S === void 0 ? !1 : S, g = e.onChange, F = g === void 0 ? function() {
  } : g, $ = e.onFinalChange, V = $ === void 0 ? function() {
  } : $, E = e.min, y = E === void 0 ? 0 : E, d = e.max, t = d === void 0 ? 100 : d, a = e.step, c = a === void 0 ? 1 : a, f = e.persistentThumb, b = f === void 0 ? !1 : f, k = e.valueToLabel, I = k === void 0 ? function(Y) {
    return Y;
  } : k, O = e.value, w = x.useContext(pt), M = x.useState(!1), B = K(M, 2), R = B[0], D = B[1], j = x.useState(!1), i = K(j, 2), s = i[0], u = i[1], h = x.useState(!1), m = K(h, 2), v = m[0], T = m[1], _ = x.useState(-1), P = K(_, 2), C = P[0], U = P[1], z = x.useCallback(function(Y) {
    vt(Y) && T(!0);
    var N = Y.target.parentNode.firstChild === Y.target ? 0 : 1;
    U(N);
  }, []), W = x.useCallback(function(Y) {
    v !== !1 && T(!1), U(-1);
  }, []), A = Ft(O), L = {
    $disabled: p,
    $step: c,
    $min: y,
    $max: t,
    $marks: l,
    $value: A,
    $isFocusVisible: v
  }, G = Q(n.Root, be), ne = K(G, 2), le = ne[0], ee = ne[1], de = Q(n.Track, ye), fe = K(de, 2), he = fe[0], _e = fe[1], te = Q(n.InnerTrack, Te), oe = K(te, 2), ge = oe[0], pe = oe[1], Qe = Q(n.Thumb, Re), Ce = K(Qe, 2), Je = Ce[0], et = Ce[1], tt = Q(n.InnerThumb, Se), De = K(tt, 2), rt = De[0], nt = De[1], at = Q(n.ThumbValue, Me), Pe = K(at, 2), it = Pe[0], ot = Pe[1], st = Q(n.Tick, Oe), Be = K(st, 2), Ae = Be[0], Le = Be[1], ut = Q(n.TickBar, we), je = K(ut, 2), ct = je[0], lt = je[1], dt = Q(n.Mark, ke), Fe = K(dt, 2), ft = Fe[0], ht = Fe[1];
  return /* @__PURE__ */ x.createElement(le, X({
    "data-baseweb": "slider"
  }, L, ee, {
    onFocus: bt(ee, z),
    onBlur: mt(ee, W)
  }), /* @__PURE__ */ x.createElement(Ge.Range, X({
    step: c,
    min: y,
    max: t,
    values: A,
    disabled: p,
    onChange: function(N) {
      return F({
        value: N
      });
    },
    onFinalChange: function(N) {
      return V({
        value: N
      });
    },
    rtl: w.direction === "rtl",
    renderTrack: function(N) {
      var re = N.props, q = N.children, ae = N.isDragged;
      return /* @__PURE__ */ x.createElement(he, X({
        onMouseDown: re.onMouseDown,
        onTouchStart: re.onTouchStart,
        $isDragged: ae
      }, L, _e), /* @__PURE__ */ x.createElement(ge, X({
        $isDragged: ae,
        ref: re.ref
      }, L, pe), q));
    },
    renderThumb: function(N) {
      var re = N.props, q = N.index, ae = N.isDragged, $e = b || (!!q && s || !q && R || ae) && !p;
      return /* @__PURE__ */ x.createElement(Je, X({}, re, {
        onMouseEnter: function() {
          q === 0 ? D(!0) : u(!0);
        },
        onMouseLeave: function() {
          q === 0 ? D(!1) : u(!1);
        },
        $thumbIndex: q,
        $isDragged: ae,
        style: Dt({}, re.style)
      }, L, et, {
        $isFocusVisible: v && C === q
      }), $e && /* @__PURE__ */ x.createElement(it, X({
        $thumbIndex: q,
        $isDragged: ae
      }, L, ot), I(A[q])), $e && /* @__PURE__ */ x.createElement(rt, X({
        $thumbIndex: q,
        $isDragged: ae
      }, L, nt)));
    }
  }, l ? {
    // eslint-disable-next-line react/display-name
    renderMark: function(N) {
      var re = N.props, q = N.index;
      return /* @__PURE__ */ x.createElement(ft, X({
        $markIndex: q
      }, re, L, ht));
    }
  } : {})), /* @__PURE__ */ x.createElement(ct, X({}, L, lt), /* @__PURE__ */ x.createElement(Ae, X({}, L, Le), I(y)), /* @__PURE__ */ x.createElement(Ae, X({}, L, Le), I(t))));
}
const Vt = /* @__PURE__ */ me("div", {
  target: "ew7r33m3"
})({
  name: "bjn8wh",
  styles: "position:relative"
}), zt = /* @__PURE__ */ me("div", {
  target: "ew7r33m2"
})(({
  disabled: e,
  theme: r,
  isDragged: n
}) => ({
  alignItems: "center",
  backgroundColor: e ? r.colors.gray60 : r.colors.primary,
  borderTopLeftRadius: "100%",
  borderTopRightRadius: "100%",
  borderBottomLeftRadius: "100%",
  borderBottomRightRadius: "100%",
  borderTopStyle: "none",
  borderBottomStyle: "none",
  borderRightStyle: "none",
  borderLeftStyle: "none",
  display: "flex",
  justifyContent: "center",
  height: r.sizes.sliderThumb,
  width: r.sizes.sliderThumb,
  boxShadow: n ? `0 0 0 0.2rem ${Ve(r.colors.primary, 0.5)}` : "none",
  ":focus": {
    outline: "none"
  },
  ":focus-visible": {
    boxShadow: `0 0 0 0.2rem ${Ve(r.colors.primary, 0.5)}`
  }
}), ""), Nt = /* @__PURE__ */ me("div", {
  target: "ew7r33m1"
})(({
  disabled: e,
  theme: r
}) => ({
  fontFamily: r.genericFonts.bodyFont,
  fontSize: r.fontSizes.sm,
  color: e ? r.colors.gray60 : r.colors.primary,
  top: "-1.6em",
  position: "absolute",
  whiteSpace: "nowrap",
  backgroundColor: r.colors.transparent,
  lineHeight: r.lineHeights.base,
  fontWeight: r.fontWeights.normal,
  // If values are clickable, it's hard to move the right thumb when they're
  // very close. So make them unclickable:
  pointerEvents: "none"
}), ""), Ut = /* @__PURE__ */ me("div", {
  target: "ew7r33m0"
})(({
  theme: e,
  isHovered: r,
  isDisabled: n
}) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: "100%",
  display: "flex",
  justifyContent: "space-between",
  pointerEvents: "none",
  marginTop: `-${e.spacing.md}`,
  fontSize: e.fontSizes.sm,
  lineHeight: e.lineHeights.base,
  fontWeight: e.fontWeights.normal,
  color: n ? e.colors.fadedText40 : e.colors.fadedText60,
  opacity: r ? 1 : 0,
  transition: "opacity 70ms ease-in-out"
}), "");
function Ht({
  minLabel: e,
  maxLabel: r,
  isHovered: n,
  isDisabled: o
}) {
  return /* @__PURE__ */ Z.jsxs(Ut, { "data-testid": "stSliderTickBar", isHovered: n, isDisabled: o, children: [
    /* @__PURE__ */ Z.jsx("span", { children: e }),
    /* @__PURE__ */ Z.jsx("span", { children: r })
  ] });
}
function Wt({
  disabled: e,
  element: r,
  widgetMgr: n,
  fragmentId: o
}) {
  const [p, S] = Et({
    getStateFromWidgetMgr: qt,
    getDefaultStateFromProto: Kt,
    getCurrStateFromProto: Xt,
    updateWidgetMgrState: Yt,
    element: r,
    widgetMgr: n,
    fragmentId: o
  }), [l, g] = x.useState(p), [F, $] = x.useState(!1), [V, E] = x.useState(!1), y = x.useCallback(() => $(!0), []), d = x.useCallback(() => $(!1), []), t = x.useRef(null), [a] = x.useState([]), [c] = x.useState([]), f = Tt(), b = l.map((D) => xe(D, r)), k = xe(r.min, r), I = xe(r.max, r), O = r.label;
  x.useEffect(() => {
    g(p);
  }, [p]);
  const w = x.useCallback(({
    value: D
  }) => {
    S({
      value: D,
      fromUi: !0
    }), E(!1);
  }, [S]), M = x.useCallback(({
    value: D
  }) => {
    g(D), E(!0);
  }, []), B = x.useCallback(
    x.forwardRef(function(j, i) {
      const {
        $thumbIndex: s
      } = j, u = s || 0;
      a[u] = i, c[u] ||= x.createRef();
      const h = kt(j, ["role", "style", "aria-valuemax", "aria-valuemin", "aria-valuenow", "tabIndex", "onKeyUp", "onKeyDown", "onMouseEnter", "onMouseLeave", "draggable"]), m = b[u];
      return /* @__PURE__ */ Z.jsx(zt, { ...h, disabled: j.$disabled === !0, isDragged: j.$isDragged === !0, ref: a[u], "aria-valuetext": m, "aria-label": O, children: /* @__PURE__ */ Z.jsx(Nt, { "data-testid": "stSliderThumbValue", disabled: j.$disabled === !0, ref: c[u], children: m }) });
    }),
    // Only run this on first render, to avoid losing the focus state.
    // Then, when the value written about the thumb needs to change, that
    // happens with the function below instead.
    []
  );
  x.useEffect(() => {
    c.map((h, m) => {
      h.current && (h.current.innerText = b[m]);
    }), a.map((h, m) => {
      h.current && h.current.setAttribute("aria-valuetext", b[m]);
    });
    const D = t.current ?? null, j = a[0].current, i = a[1]?.current, s = c[0].current, u = c[1]?.current;
    Qt(D, j, i, s, u);
  });
  const R = x.useCallback(({
    $disabled: D
  }) => ({
    height: f.spacing.twoXS,
    ...D ? {
      background: f.colors.darkenedBgMix25
    } : {}
  }), [f.colors.darkenedBgMix25, f.spacing.twoXS]);
  return /* @__PURE__ */ Z.jsxs(Vt, { ref: t, className: "stSlider", "data-testid": "stSlider", onMouseEnter: y, onMouseLeave: d, children: [
    /* @__PURE__ */ Z.jsx(Ot, { label: r.label, disabled: e, labelVisibility: wt(r.labelVisibility?.value), children: r.help && /* @__PURE__ */ Z.jsx(Rt, { children: /* @__PURE__ */ Z.jsx(St, { content: r.help, placement: Mt.TOP_RIGHT }) }) }),
    /* @__PURE__ */ Z.jsx($t, { min: r.min, max: r.max, step: r.step, value: Gt(l, r), onChange: M, onFinalChange: w, disabled: e, overrides: {
      Thumb: B,
      Track: {
        style: {
          backgroundColor: "none !important",
          paddingLeft: f.spacing.none,
          paddingRight: f.spacing.none,
          // Set padding so total height equals minElementHeight (40px)
          // Total height = paddingTop + innerTrack height + paddingBottom
          paddingTop: `calc((${f.sizes.minElementHeight} - ${f.spacing.twoXS}) / 2)`,
          paddingBottom: `calc((${f.sizes.minElementHeight} - ${f.spacing.twoXS}) / 2)`
        }
      },
      InnerTrack: {
        style: R
      },
      // Show min/max labels when hovering the slider or dragging it
      TickBar: {
        component: Ht,
        props: {
          minLabel: k,
          maxLabel: I,
          isHovered: F || V,
          isDisabled: e
        }
      }
    } })
  ] });
}
function qt(e, r) {
  return e.getDoubleArrayValue(r);
}
function Kt(e) {
  return e.default;
}
function Xt(e) {
  return e.value;
}
function Yt(e, r, n, o) {
  r.setDoubleArrayValue(e, n.value, {
    fromUi: n.fromUi
  }, o);
}
function Zt(e) {
  const {
    dataType: r
  } = e;
  return r === Ee.DataType.DATETIME || r === Ee.DataType.DATE || r === Ee.DataType.TIME;
}
function xe(e, r) {
  const {
    format: n,
    options: o
  } = r;
  return Zt(r) ? _t.utc(e / 1e3).format(n) : o.length > 0 ? ze.sprintf(n, o[e]) : ze.sprintf(n, e);
}
function Gt(e, r) {
  const {
    min: n,
    max: o
  } = r;
  let p = e[0], S = e.length > 1 ? e[1] : e[0];
  return p > S && (p = S), p < n && (p = n), p > o && (p = o), S < n && (S = n), S > o && (S = o), e.length > 1 ? [p, S] : [p];
}
function Qt(e, r, n, o, p) {
  !e || !r || !o || (ie(e, r, o), n && p && (ie(e, n, p), Jt(e, r, n, o, p)));
}
function ie(e, r, n) {
  const o = e.getBoundingClientRect(), p = r.getBoundingClientRect(), S = n.getBoundingClientRect(), l = p.left + p.width / 2, g = l - S.width / 2 < o.left, F = l + S.width / 2 > o.right;
  n.style.left = g ? "0" : "", n.style.right = F ? "0" : "";
}
function Jt(e, r, n, o, p) {
  const l = e.getBoundingClientRect(), g = r.getBoundingClientRect(), F = n.getBoundingClientRect(), $ = o.getBoundingClientRect(), V = p.getBoundingClientRect(), E = l.left + l.width / 2, y = g.left + g.width / 2, d = F.left + F.width / 2, t = y - $.width / 2 >= l.left, a = d + V.width / 2 <= l.right, c = g.left - $.width >= l.left, f = F.right + V.width <= l.right, b = t ? $.width / 2 : $.width, k = a ? V.width / 2 : V.width, I = y + b;
  if (d - k - I > 24) {
    ie(e, r, o), ie(e, n, p);
    return;
  }
  if (c && f) {
    o.style.left = "", o.style.right = `${Math.round(g.width)}px`, p.style.left = `${Math.round(F.width)}px`, p.style.right = "";
    return;
  }
  y < E ? (ie(e, r, o), p.style.left = `${Math.round(y + b + 24 - d)}px`, p.style.right = "") : (ie(e, n, p), o.style.left = "", o.style.right = `${-Math.round(d - k - 24 - y)}px`);
}
const nr = yt(x.memo(Wt));
export {
  nr as default
};
//# sourceMappingURL=index-DVxkniYV.js.map
