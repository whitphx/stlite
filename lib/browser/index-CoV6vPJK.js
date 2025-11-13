import { r as y, E as R, _, s as x, t as q, j as f, am as X, P as k, c as Q, B as J, an as O, be as z, b1 as K, a3 as Y, aU as Z, u as ee, bf as te, bg as re, bh as ie, x as oe, aV as se, k as j, bi as ne, bj as ae, W as le, l as de, Q as ce, T as ue } from "./index-COqA-032.js";
import { U as W } from "./UploadFileInfo-B5SttewO.js";
import { F as fe } from "./FormClearHelper-DQ1jkgFN.js";
import { P as pe, S as he } from "./ProgressBar-Cuz7rhdP.js";
var B = /* @__PURE__ */ y.forwardRef(function(i, l) {
  var t = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ y.createElement(R, _({
    iconAttrs: t,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, i, {
    ref: l
  }), /* @__PURE__ */ y.createElement("rect", {
    width: 24,
    height: 24,
    fill: "none"
  }), /* @__PURE__ */ y.createElement("path", {
    d: "M20 5h-3.17l-1.24-1.35A1.99 1.99 0 0014.12 3H9.88c-.56 0-1.1.24-1.48.65L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1.35 8.35l-2.79 2.79c-.32.32-.86.1-.86-.35v-1.75H9v1.75c0 .45-.54.67-.85.35l-2.79-2.79c-.2-.2-.2-.51 0-.71l2.79-2.79a.5.5 0 01.85.36v1.83h6v-1.83c0-.45.54-.67.85-.35l2.79 2.79c.2.19.2.51.01.7z"
  }));
});
B.displayName = "SwitchCamera";
var L = /* @__PURE__ */ y.forwardRef(function(i, l) {
  var t = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ y.createElement(R, _({
    iconAttrs: t,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 8 8"
  }, i, {
    ref: l
  }), /* @__PURE__ */ y.createElement("path", {
    d: "M.5 1c-.28 0-.5.23-.5.5v4c0 .28.23.5.5.5h5c.28 0 .5-.22.5-.5V4l1 1h1V2H7L6 3V1.5c0-.28-.22-.5-.5-.5h-5z"
  }));
});
L.displayName = "Video";
var $ = /* @__PURE__ */ y.forwardRef(function(i, l) {
  var t = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ y.createElement(R, _({
    iconAttrs: t,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 8 8"
  }, i, {
    ref: l
  }), /* @__PURE__ */ y.createElement("path", {
    d: "M1.41 0L0 1.41l.72.72L2.5 3.94.72 5.72 0 6.41l1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72L6.41 0l-.69.72L3.94 2.5 2.13.72 1.41 0z"
  }));
});
$.displayName = "X";
function ge(i, l) {
  switch (i) {
    case "xsmall":
      return {
        padding: `${l.spacing.twoXS} ${l.spacing.sm}`,
        fontSize: l.fontSizes.sm
      };
    case "small":
      return {
        padding: `${l.spacing.twoXS} ${l.spacing.md}`
      };
    case "large":
      return {
        padding: `${l.spacing.md} ${l.spacing.md}`
      };
    default:
      return {
        padding: `${l.spacing.xs} ${l.spacing.md}`
      };
  }
}
const A = /* @__PURE__ */ x("div", {
  target: "etz5kuj9"
})({
  name: "b6gpc",
  styles: "position:relative;overflow:hidden;width:100%;object-fit:contain"
}), T = /* @__PURE__ */ x("div", {
  target: "etz5kuj8"
})(({
  theme: i,
  width: l
}) => ({
  backgroundColor: i.colors.secondaryBg,
  borderRadius: `${i.radii.default} ${i.radii.default} 0 0`,
  width: "100%",
  height: l * 9 / 16,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
}), ""), me = /* @__PURE__ */ x("p", {
  target: "etz5kuj7"
})(({
  theme: i
}) => ({
  marginTop: i.spacing.sm,
  textAlign: "center"
}), ""), ve = /* @__PURE__ */ x("img", {
  target: "etz5kuj6"
})(({
  theme: i,
  opacity: l
}) => ({
  borderRadius: `${i.radii.default} ${i.radii.default} 0 0`,
  objectFit: "contain",
  opacity: l
}), ""), Se = /* @__PURE__ */ x("a", {
  target: "etz5kuj5"
})(({
  theme: i
}) => ({
  color: i.colors.link,
  textDecoration: i.linkUnderline ? "underline" : "none",
  display: "block"
}), ""), ye = /* @__PURE__ */ x("span", {
  target: "etz5kuj4"
})({
  name: "s5xdrg",
  styles: "display:flex;align-items:center"
}), be = /* @__PURE__ */ x("div", {
  target: "etz5kuj3"
})(({
  theme: i
}) => ({
  position: "absolute",
  top: i.spacing.lg,
  right: i.spacing.lg,
  zIndex: i.zIndices.priority,
  color: i.colors.fadedText40,
  mixBlendMode: "difference",
  opacity: 0.6
}), ""), we = /* @__PURE__ */ x("div", {
  target: "etz5kuj1"
})({
  name: "1yoks5w",
  styles: "height:fit-content;width:100%;position:absolute;bottom:0"
}), Ce = /* @__PURE__ */ x("button", {
  target: "etz5kuj0"
})(({
  theme: i
}) => ({
  position: "relative",
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: i.colors.lightenedBg05,
  border: `${i.sizes.borderWidth} solid ${i.colors.borderColor}`,
  borderRadius: `0 0 ${i.radii.default} ${i.radii.default}`,
  "&:hover": {
    borderColor: i.colors.primary,
    color: i.colors.primary
  },
  "&:active": {
    color: i.colors.white,
    borderColor: i.colors.primary,
    backgroundColor: i.colors.primary
  },
  "&:focus:not(:active)": {
    borderColor: i.colors.primary,
    color: i.colors.primary
  },
  "&:disabled, &:disabled:hover, &:disabled:active": {
    color: i.colors.fadedText40,
    borderColor: i.colors.borderColor,
    backgroundColor: i.colors.lightenedBg05,
    cursor: "not-allowed"
  },
  fontWeight: i.fontWeights.normal,
  padding: `${i.spacing.xs} ${i.spacing.md}`,
  margin: i.spacing.none,
  lineHeight: i.lineHeights.base,
  color: "inherit",
  width: "100%",
  userSelect: "none",
  "&:focus": {
    outline: "none"
  },
  "&:focus-visible": {
    boxShadow: `0 0 0 0.2rem ${q(i.colors.primary, 0.5)}`
  },
  ...ge("medium", i)
}), "");
function Me({
  disabled: i,
  onClick: l,
  children: t,
  progress: s
}) {
  return /* @__PURE__ */ f.jsxs(Ce, { disabled: i || !1, onClick: l || (() => {
  }), progress: s || null, "data-testid": "stCameraInputButton", children: [
    t,
    s ? /* @__PURE__ */ f.jsx(we, { children: /* @__PURE__ */ f.jsx(pe, { value: s, size: he.EXTRASMALL, overrides: {
      Bar: {
        style: {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }
      },
      BarProgress: {
        style: {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }
      },
      BarContainer: {
        style: {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }
      }
    } }) }) : null
  ] });
}
const N = y.memo(Me);
var F = /* @__PURE__ */ ((i) => (i.USER = "user", i.ENVIRONMENT = "environment", i))(F || {});
const Ue = ({
  switchFacingMode: i
}) => /* @__PURE__ */ f.jsx(be, { "data-testid": "stCameraInputSwitchButton", children: /* @__PURE__ */ f.jsx(X, { content: "Switch camera", placement: k.TOP_RIGHT, children: /* @__PURE__ */ f.jsx(Q, { kind: J.MINIMAL, onClick: i, children: /* @__PURE__ */ f.jsx(O, { content: B, size: "twoXL", color: z.white }) }) }) }), xe = y.memo(Ue);
var P = { exports: {} }, Ie = P.exports, V;
function Ee() {
  return V || (V = 1, (function(i, l) {
    (function(s, o) {
      i.exports = o(K());
    })(Ie, function(t) {
      return (
        /******/
        (function(s) {
          var o = {};
          function n(a) {
            if (o[a])
              return o[a].exports;
            var p = o[a] = {
              /******/
              i: a,
              /******/
              l: !1,
              /******/
              exports: {}
              /******/
            };
            return s[a].call(p.exports, p, p.exports, n), p.l = !0, p.exports;
          }
          return n.m = s, n.c = o, n.d = function(a, p, g) {
            n.o(a, p) || Object.defineProperty(a, p, { enumerable: !0, get: g });
          }, n.r = function(a) {
            typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(a, "__esModule", { value: !0 });
          }, n.t = function(a, p) {
            if (p & 1 && (a = n(a)), p & 8 || p & 4 && typeof a == "object" && a && a.__esModule) return a;
            var g = /* @__PURE__ */ Object.create(null);
            if (n.r(g), Object.defineProperty(g, "default", { enumerable: !0, value: a }), p & 2 && typeof a != "string") for (var U in a) n.d(g, U, (function(M) {
              return a[M];
            }).bind(null, U));
            return g;
          }, n.n = function(a) {
            var p = a && a.__esModule ? (
              /******/
              function() {
                return a.default;
              }
            ) : (
              /******/
              function() {
                return a;
              }
            );
            return n.d(p, "a", p), p;
          }, n.o = function(a, p) {
            return Object.prototype.hasOwnProperty.call(a, p);
          }, n.p = "", n(n.s = "./src/react-webcam.tsx");
        })({
          /***/
          "./src/react-webcam.tsx": (
            /*!******************************!*\
              !*** ./src/react-webcam.tsx ***!
              \******************************/
            /*! exports provided: default */
            /***/
            (function(s, o, n) {
              n.r(o);
              var a = n(
                /*! react */
                "react"
              ), p = /* @__PURE__ */ (function() {
                var m = function(u, e) {
                  return m = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, d) {
                    r.__proto__ = d;
                  } || function(r, d) {
                    for (var c in d) d.hasOwnProperty(c) && (r[c] = d[c]);
                  }, m(u, e);
                };
                return function(u, e) {
                  m(u, e);
                  function r() {
                    this.constructor = u;
                  }
                  u.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
                };
              })(), g = function() {
                return g = Object.assign || function(m) {
                  for (var u, e = 1, r = arguments.length; e < r; e++) {
                    u = arguments[e];
                    for (var d in u) Object.prototype.hasOwnProperty.call(u, d) && (m[d] = u[d]);
                  }
                  return m;
                }, g.apply(this, arguments);
              }, U = function(m, u) {
                var e = {};
                for (var r in m) Object.prototype.hasOwnProperty.call(m, r) && u.indexOf(r) < 0 && (e[r] = m[r]);
                if (m != null && typeof Object.getOwnPropertySymbols == "function")
                  for (var d = 0, r = Object.getOwnPropertySymbols(m); d < r.length; d++)
                    u.indexOf(r[d]) < 0 && Object.prototype.propertyIsEnumerable.call(m, r[d]) && (e[r[d]] = m[r[d]]);
                return e;
              };
              (function() {
                typeof window > "u" || (navigator.mediaDevices === void 0 && (navigator.mediaDevices = {}), navigator.mediaDevices.getUserMedia === void 0 && (navigator.mediaDevices.getUserMedia = function(u) {
                  var e = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                  return e ? new Promise(function(r, d) {
                    e.call(navigator, u, r, d);
                  }) : Promise.reject(new Error("getUserMedia is not implemented in this browser"));
                }));
              })();
              function M() {
                return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
              }
              var I = (
                /** @class */
                (function(m) {
                  p(u, m);
                  function u(e) {
                    var r = m.call(this, e) || this;
                    return r.canvas = null, r.ctx = null, r.requestUserMediaId = 0, r.unmounted = !1, r.state = {
                      hasUserMedia: !1
                    }, r;
                  }
                  return u.prototype.componentDidMount = function() {
                    var e = this, r = e.state, d = e.props;
                    if (this.unmounted = !1, !M()) {
                      d.onUserMediaError("getUserMedia not supported");
                      return;
                    }
                    r.hasUserMedia || this.requestUserMedia(), d.children && typeof d.children != "function" && console.warn("children must be a function");
                  }, u.prototype.componentDidUpdate = function(e) {
                    var r = this.props;
                    if (!M()) {
                      r.onUserMediaError("getUserMedia not supported");
                      return;
                    }
                    var d = JSON.stringify(e.audioConstraints) !== JSON.stringify(r.audioConstraints), c = JSON.stringify(e.videoConstraints) !== JSON.stringify(r.videoConstraints), w = e.minScreenshotWidth !== r.minScreenshotWidth, S = e.minScreenshotHeight !== r.minScreenshotHeight;
                    (c || w || S) && (this.canvas = null, this.ctx = null), (d || c) && (this.stopAndCleanup(), this.requestUserMedia());
                  }, u.prototype.componentWillUnmount = function() {
                    this.unmounted = !0, this.stopAndCleanup();
                  }, u.stopMediaStream = function(e) {
                    e && (e.getVideoTracks && e.getAudioTracks ? (e.getVideoTracks().map(function(r) {
                      e.removeTrack(r), r.stop();
                    }), e.getAudioTracks().map(function(r) {
                      e.removeTrack(r), r.stop();
                    })) : e.stop());
                  }, u.prototype.stopAndCleanup = function() {
                    var e = this.state;
                    e.hasUserMedia && (u.stopMediaStream(this.stream), e.src && window.URL.revokeObjectURL(e.src));
                  }, u.prototype.getScreenshot = function(e) {
                    var r = this, d = r.state, c = r.props;
                    if (!d.hasUserMedia)
                      return null;
                    var w = this.getCanvas(e);
                    return w && w.toDataURL(c.screenshotFormat, c.screenshotQuality);
                  }, u.prototype.getCanvas = function(e) {
                    var r = this, d = r.state, c = r.props;
                    if (!this.video || !d.hasUserMedia || !this.video.videoHeight)
                      return null;
                    if (!this.ctx) {
                      var w = this.video.videoWidth, S = this.video.videoHeight;
                      if (!this.props.forceScreenshotSourceSize) {
                        var v = w / S;
                        w = c.minScreenshotWidth || this.video.clientWidth, S = w / v, c.minScreenshotHeight && S < c.minScreenshotHeight && (S = c.minScreenshotHeight, w = S * v);
                      }
                      this.canvas = document.createElement("canvas"), this.canvas.width = e?.width || w, this.canvas.height = e?.height || S, this.ctx = this.canvas.getContext("2d");
                    }
                    var C = this, b = C.ctx, h = C.canvas;
                    return b && h && (h.width = e?.width || h.width, h.height = e?.height || h.height, c.mirrored && (b.translate(h.width, 0), b.scale(-1, 1)), b.imageSmoothingEnabled = c.imageSmoothing, b.drawImage(this.video, 0, 0, e?.width || h.width, e?.height || h.height), c.mirrored && (b.scale(-1, 1), b.translate(-h.width, 0))), h;
                  }, u.prototype.requestUserMedia = function() {
                    var e = this, r = this.props, d = function(S, v) {
                      var C = {
                        video: typeof v < "u" ? v : !0
                      };
                      r.audio && (C.audio = typeof S < "u" ? S : !0), e.requestUserMediaId++;
                      var b = e.requestUserMediaId;
                      navigator.mediaDevices.getUserMedia(C).then(function(h) {
                        e.unmounted || b !== e.requestUserMediaId ? u.stopMediaStream(h) : e.handleUserMedia(null, h);
                      }).catch(function(h) {
                        e.handleUserMedia(h);
                      });
                    };
                    if ("mediaDevices" in navigator)
                      d(r.audioConstraints, r.videoConstraints);
                    else {
                      var c = function(S) {
                        return { optional: [{ sourceId: S }] };
                      }, w = function(S) {
                        var v = S.deviceId;
                        return typeof v == "string" ? v : Array.isArray(v) && v.length > 0 ? v[0] : typeof v == "object" && v.ideal ? v.ideal : null;
                      };
                      MediaStreamTrack.getSources(function(S) {
                        var v = null, C = null;
                        S.forEach(function(E) {
                          E.kind === "audio" ? v = E.id : E.kind === "video" && (C = E.id);
                        });
                        var b = w(r.audioConstraints);
                        b && (v = b);
                        var h = w(r.videoConstraints);
                        h && (C = h), d(c(v), c(C));
                      });
                    }
                  }, u.prototype.handleUserMedia = function(e, r) {
                    var d = this.props;
                    if (e || !r) {
                      this.setState({ hasUserMedia: !1 }), d.onUserMediaError(e);
                      return;
                    }
                    this.stream = r;
                    try {
                      this.video && (this.video.srcObject = r), this.setState({ hasUserMedia: !0 });
                    } catch {
                      this.setState({
                        hasUserMedia: !0,
                        src: window.URL.createObjectURL(r)
                      });
                    }
                    d.onUserMedia(r);
                  }, u.prototype.render = function() {
                    var e = this, r = this, d = r.state, c = r.props, w = c.audio;
                    c.forceScreenshotSourceSize;
                    var S = c.disablePictureInPicture;
                    c.onUserMedia, c.onUserMediaError, c.screenshotFormat, c.screenshotQuality, c.minScreenshotWidth, c.minScreenshotHeight, c.audioConstraints, c.videoConstraints, c.imageSmoothing;
                    var v = c.mirrored, C = c.style, b = C === void 0 ? {} : C, h = c.children, E = U(c, ["audio", "forceScreenshotSourceSize", "disablePictureInPicture", "onUserMedia", "onUserMediaError", "screenshotFormat", "screenshotQuality", "minScreenshotWidth", "minScreenshotHeight", "audioConstraints", "videoConstraints", "imageSmoothing", "mirrored", "style", "children"]), H = v ? g(g({}, b), { transform: (b.transform || "") + " scaleX(-1)" }) : b, D = {
                      getScreenshot: this.getScreenshot.bind(this)
                    };
                    return a.createElement(
                      a.Fragment,
                      null,
                      a.createElement("video", g({ autoPlay: !0, disablePictureInPicture: S, src: d.src, muted: !w, playsInline: !0, ref: function(G) {
                        e.video = G;
                      }, style: H }, E)),
                      h && h(D)
                    );
                  }, u.defaultProps = {
                    audio: !1,
                    disablePictureInPicture: !1,
                    forceScreenshotSourceSize: !1,
                    imageSmoothing: !0,
                    mirrored: !1,
                    onUserMedia: function() {
                    },
                    onUserMediaError: function() {
                    },
                    screenshotFormat: "image/webp",
                    screenshotQuality: 0.92
                  }, u;
                })(a.Component)
              );
              o.default = I;
            })
          ),
          /***/
          react: (
            /*!**************************************************************************************!*\
              !*** external {"root":"React","commonjs2":"react","commonjs":"react","amd":"react"} ***!
              \**************************************************************************************/
            /*! no static exports found */
            /***/
            (function(s, o) {
              s.exports = t;
            })
          )
          /******/
        }).default
      );
    });
  })(P)), P.exports;
}
var je = Ee();
const Fe = /* @__PURE__ */ Y(je), Pe = ({
  width: i
}) => /* @__PURE__ */ f.jsxs(T, { width: i, children: [
  /* @__PURE__ */ f.jsx(O, { size: "threeXL", color: z.gray60, content: L }),
  /* @__PURE__ */ f.jsxs(me, { children: [
    "This app would like to use your camera.",
    /* @__PURE__ */ f.jsx(Se, { href: re, rel: "noopener noreferrer", target: "_blank", children: "Learn how to allow access." })
  ] })
] }), Re = ({
  handleCapture: i,
  width: l,
  disabled: t,
  clearPhotoInProgress: s,
  setClearPhotoInProgress: o,
  facingMode: n,
  setFacingMode: a,
  testOverride: p
}) => {
  const [g, U] = y.useState(
    p || "pending"
    /* PENDING */
  ), M = y.useRef(null), [I, m] = y.useState(l), u = y.useCallback(Z(1e3, m), []);
  y.useEffect(() => {
    u(l);
  }, [l, u]);
  function e() {
    if (M.current !== null) {
      const d = M.current.getScreenshot();
      i(d);
    }
  }
  const r = ee();
  return /* @__PURE__ */ f.jsxs(A, { "data-testid": "stCameraInputWebcamComponent", children: [
    g !== "success" && !t && !s ? /* @__PURE__ */ f.jsx(Pe, { width: I }) : te() && /* @__PURE__ */ f.jsx(xe, { switchFacingMode: a }),
    /* @__PURE__ */ f.jsx(T, { "data-testid": "stCameraInputWebcamStyledBox", hidden: g !== "success" && !t && !s, width: I, children: !t && /* @__PURE__ */ f.jsx(
      Fe,
      {
        audio: !1,
        ref: M,
        screenshotFormat: "image/jpeg",
        screenshotQuality: 1,
        width: I,
        height: I * 9 / 16,
        style: {
          borderRadius: `${r.radii.default} ${r.radii.default} 0 0`
        },
        onUserMediaError: () => {
          U(
            "error"
            /* ERROR */
          );
        },
        onUserMedia: () => {
          U(
            "success"
            /* SUCCESS */
          ), o(!1);
        },
        videoConstraints: {
          width: {
            ideal: I
          },
          facingMode: n
        }
      }
    ) }),
    /* @__PURE__ */ f.jsx(N, { onClick: e, disabled: g !== "success" || t || s, children: "Take Photo" })
  ] });
}, _e = y.memo(Re), Oe = 150, Te = oe.getLogger("CameraInput");
class We extends y.PureComponent {
  constructor(l) {
    super(l), this.localFileIdCounter = 1, this.RESTORED_FROM_WIDGET_STRING = "RESTORED_FROM_WIDGET", this.formClearHelper = new fe(), this.getProgress = () => {
      if (this.state.files.length > 0 && this.state.files[this.state.files.length - 1].status.type === "uploading")
        return this.state.files[this.state.files.length - 1].status.progress;
    }, this.setClearPhotoInProgress = (t) => {
      this.setState({
        clearPhotoInProgress: t
      });
    }, this.setFacingMode = () => {
      this.setState((t) => ({
        facingMode: t.facingMode === F.USER ? F.ENVIRONMENT : F.USER
      }));
    }, this.handleCapture = (t) => {
      if (t === null)
        return Promise.resolve();
      this.setState({
        imgSrc: t,
        shutter: !0,
        minShutterEffectPassed: !1
      });
      const s = (o) => new Promise((n) => setTimeout(n, o));
      return Ve(t, `camera-input-${(/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "_")}.jpg`).then((o) => this.props.uploadClient.fetchFileURLs([o]).then((n) => ({
        file: o,
        fileUrls: n[0]
      }))).then(({
        file: o,
        fileUrls: n
      }) => this.uploadFile(n, o)).then(() => s(Oe)).then(() => {
        this.setState((o, n) => ({
          imgSrc: t,
          shutter: o.shutter,
          minShutterEffectPassed: !0
        }));
      }).catch((o) => {
        Te.error(o);
      });
    }, this.removeCapture = () => {
      this.state.files.length !== 0 && (this.state.files.forEach((t) => this.deleteFile(t.id)), this.setState({
        imgSrc: null,
        clearPhotoInProgress: !0
      }));
    }, this.componentDidUpdate = () => {
      if (this.status !== "ready")
        return;
      const t = this.createWidgetValue(), {
        element: s,
        widgetMgr: o,
        fragmentId: n
      } = this.props, a = o.getFileUploaderStateValue(s);
      se(t, a) || o.setFileUploaderStateValue(s, t, {
        fromUi: !0
      }, n);
    }, this.onFormCleared = () => {
      this.setState({
        files: []
      }, () => {
        const t = this.createWidgetValue();
        if (j(t))
          return;
        this.setState({
          imgSrc: null
        });
        const {
          widgetMgr: s,
          element: o,
          fragmentId: n
        } = this.props;
        s.setFileUploaderStateValue(o, t, {
          fromUi: !0
        }, n);
      });
    }, this.deleteFile = (t) => {
      const s = this.getFile(t);
      j(s) || (s.status.type === "uploading" && s.status.abortController.abort(), s.status.type === "uploaded" && s.status.fileUrls.deleteUrl && this.props.uploadClient.deleteFile(s.status.fileUrls.deleteUrl), this.removeFile(t));
    }, this.addFile = (t) => {
      this.setState((s) => ({
        files: [...s.files, t]
      }));
    }, this.removeFile = (t) => {
      this.setState((s) => ({
        files: s.files.filter((o) => o.id !== t)
      }));
    }, this.getFile = (t) => this.state.files.find((s) => s.id === t), this.updateFile = (t, s) => {
      this.setState((o) => ({
        files: o.files.map((n) => n.id === t ? s : n)
      }));
    }, this.onUploadComplete = (t, s) => {
      this.setState(() => ({
        shutter: !1
      }));
      const o = this.getFile(t);
      j(o) || o.status.type !== "uploading" || this.updateFile(o.id, o.setStatus({
        type: "uploaded",
        fileId: s.fileId,
        fileUrls: s
      }));
    }, this.onUploadProgress = (t, s) => {
      const o = this.getFile(s);
      if (j(o) || o.status.type !== "uploading")
        return;
      const n = Math.round(t.loaded * 100 / t.total);
      o.status.progress !== n && this.updateFile(s, o.setStatus({
        type: "uploading",
        abortController: o.status.abortController,
        progress: n
      }));
    }, this.reset = () => {
      this.setState({
        files: [],
        imgSrc: null
      });
    }, this.uploadFile = (t, s) => {
      const o = new AbortController(), n = new W(s.name, s.size, this.nextLocalFileId(), {
        type: "uploading",
        abortController: o,
        progress: 1
      });
      this.addFile(n), this.props.uploadClient.uploadFile(this.props.element, t.uploadUrl, s, (a) => this.onUploadProgress(a, n.id), o.signal).then(() => this.onUploadComplete(n.id, t)).catch((a) => {
        a instanceof DOMException && a.name === "AbortError" || this.updateFile(n.id, n.setStatus({
          type: "error",
          errorMessage: a ? a.toString() : "Unknown error"
        }));
      });
    }, this.state = this.initialValue;
  }
  get initialValue() {
    const l = {
      files: [],
      imgSrc: null,
      shutter: !1,
      minShutterEffectPassed: !0,
      clearPhotoInProgress: !1,
      facingMode: F.USER
    }, {
      widgetMgr: t,
      element: s
    } = this.props, o = t.getFileUploaderStateValue(s);
    if (j(o))
      return l;
    const {
      uploadedFileInfo: n
    } = o;
    return j(n) || n.length === 0 ? l : {
      files: n.map((a) => {
        const p = a.name, g = a.size, U = a.fileId, M = a.fileUrls;
        return new W(p, g, this.nextLocalFileId(), {
          type: "uploaded",
          fileId: U,
          fileUrls: M
        });
      }),
      imgSrc: n.length === 0 ? "" : this.RESTORED_FROM_WIDGET_STRING,
      shutter: !1,
      minShutterEffectPassed: !1,
      clearPhotoInProgress: !1,
      facingMode: F.USER
    };
  }
  componentWillUnmount() {
    this.formClearHelper.disconnect();
  }
  /**
   * Return the FileUploader's current status, which is derived from
   * its state.
   */
  get status() {
    const l = (t) => t.status.type === "uploading";
    return this.state.files.some(l) ? "updating" : "ready";
  }
  componentDidMount() {
    const l = this.createWidgetValue(), {
      element: t,
      widgetMgr: s,
      fragmentId: o
    } = this.props;
    s.getFileUploaderStateValue(t) === void 0 && s.setFileUploaderStateValue(t, l, {
      fromUi: !1
    }, o);
  }
  createWidgetValue() {
    const l = this.state.files.filter((t) => t.status.type === "uploaded").map((t) => {
      const {
        name: s,
        size: o,
        status: n
      } = t;
      return new ne({
        fileId: n.fileId,
        fileUrls: n.fileUrls,
        name: s,
        size: o
      });
    });
    return new ae({
      uploadedFileInfo: l
    });
  }
  render() {
    const {
      element: l,
      widgetMgr: t,
      disabled: s,
      width: o
    } = this.props;
    return this.formClearHelper.manageFormClearListener(t, l.formId, this.onFormCleared), /* @__PURE__ */ f.jsxs(A, { className: "stCameraInput", "data-testid": "stCameraInput", children: [
      /* @__PURE__ */ f.jsx(le, { label: l.label, disabled: s, labelVisibility: de(l.labelVisibility?.value), children: l.help && /* @__PURE__ */ f.jsx(ce, { children: /* @__PURE__ */ f.jsx(ue, { content: l.help, placement: k.TOP_RIGHT }) }) }),
      this.state.imgSrc ? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
        /* @__PURE__ */ f.jsx(T, { width: o, children: this.state.imgSrc !== this.RESTORED_FROM_WIDGET_STRING && /* @__PURE__ */ f.jsx(ve, { src: this.state.imgSrc, alt: "Snapshot", opacity: this.state.shutter || !this.state.minShutterEffectPassed ? "50%" : "100%", width: o, height: o * 9 / 16 }) }),
        /* @__PURE__ */ f.jsx(N, { onClick: this.removeCapture, progress: this.getProgress(), disabled: !!this.getProgress() || s, children: this.getProgress() ? "Uploading..." : /* @__PURE__ */ f.jsxs(ye, { children: [
          /* @__PURE__ */ f.jsx(O, { content: $, margin: "0 xs 0 0", size: "sm" }),
          " Clear photo"
        ] }) })
      ] }) : /* @__PURE__ */ f.jsx(
        _e,
        {
          handleCapture: this.handleCapture,
          width: o,
          disabled: s,
          clearPhotoInProgress: this.state.clearPhotoInProgress,
          setClearPhotoInProgress: this.setClearPhotoInProgress,
          facingMode: this.state.facingMode,
          setFacingMode: this.setFacingMode,
          testOverride: this.props.testOverride
        }
      )
    ] });
  }
  nextLocalFileId() {
    return this.localFileIdCounter++;
  }
}
function Ve(i, l) {
  return fetch(i).then((t) => t.arrayBuffer()).then((t) => new File([t], l, {
    type: "image/jpeg"
  }));
}
const $e = ie(We);
export {
  $e as default
};
//# sourceMappingURL=index-CoV6vPJK.js.map
