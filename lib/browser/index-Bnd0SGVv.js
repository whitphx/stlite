import { s as g, r as j, I as E, J as L, j as s, w as b, f as C, x as v } from "./index-COqA-032.js";
import { w as T, E as W } from "./withFullScreenWrapper-Bd7ZpoRc.js";
import { S as x, T as y } from "./Toolbar-DRAqg1o6.js";
const F = /* @__PURE__ */ g("div", {
  target: "e115fcil2"
})(({
  theme: e,
  shouldStretch: t
}) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  // Not supported in Safari, but at least it's not a regression for those users:
  rowGap: e.spacing.lg,
  maxWidth: "100%",
  width: t ? "100%" : "fit-content"
}), ""), M = /* @__PURE__ */ g("div", {
  target: "e115fcil1"
})(({
  theme: e,
  shouldStretch: t
}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  width: t ? "100%" : "auto",
  flexGrow: t ? 1 : 0,
  ">img": {
    borderRadius: e.radii.default
  }
}), ""), R = /* @__PURE__ */ g("div", {
  target: "e115fcil0"
})(({
  theme: e
}) => ({
  textAlign: "center",
  marginTop: e.spacing.xs,
  wordWrap: "break-word",
  padding: e.spacing.threeXS
}), ""), H = v.getLogger("ImageList");
function O(e, t, r) {
  if (e) {
    if (e.useStretch)
      return r;
    if (e.useContent)
      return;
    if (e.pixelWidth)
      return e.pixelWidth;
  }
  if (t != null)
    switch (t) {
      case -1:
      case -3:
      case -4:
        return;
      case -2:
      case -5:
        return r;
      default:
        return t > 0 ? t : void 0;
    }
}
const G = ({
  itemKey: e,
  image: t,
  imgStyle: r,
  buildMediaURL: n,
  handleImageError: l,
  shouldStretch: i
}) => {
  const c = b(t.url);
  return /* @__PURE__ */ s.jsxs(M, { "data-testid": "stImageContainer", shouldStretch: i, children: [
    /* @__PURE__ */ s.jsx("img", { style: r, src: n(t.url), alt: e, onError: l, crossOrigin: c }),
    t.caption && /* @__PURE__ */ s.jsx(R, { "data-testid": "stImageCaption", style: r, children: /* @__PURE__ */ s.jsx(
      C,
      {
        source: t.caption,
        allowHTML: !1,
        isCaption: !0,
        isLabel: !0
      }
    ) })
  ] });
};
function U({
  element: e,
  endpoints: t,
  widthConfig: r,
  disableFullscreenMode: n
}) {
  const l = E(e.imgs), {
    expanded: i,
    width: c,
    height: d,
    expand: f,
    collapse: h
  } = L(W), m = c || 0, I = O(r, e.width, m), p = r?.useStretch || e.width === -5, a = {};
  d && i ? (a.maxHeight = d, a.objectFit = "contain", a.width = "100%") : (a.width = I ?? "100%", a.maxWidth = "100%");
  const S = (u) => {
    const o = u.currentTarget.src;
    H.error(`Client Error: Image source error - ${o}`), t.sendClientErrorToHost("Image", "Image source failed to load", "onerror triggered", o);
  };
  return /* @__PURE__ */ s.jsxs(x, { width: m, height: d, useContainerWidth: i, topCentered: !0, children: [
    /* @__PURE__ */ s.jsx(y, { target: x, isFullScreen: i, onExpand: f, onCollapse: h, disableFullscreenMode: n }),
    /* @__PURE__ */ s.jsx(F, { className: "stImage", "data-testid": "stImage", shouldStretch: p, children: l.map((u, o) => /* @__PURE__ */ s.jsx(
      G,
      {
        itemKey: o.toString(),
        image: u,
        imgStyle: a,
        buildMediaURL: (w) => t.buildMediaURL(w),
        handleImageError: S,
        shouldStretch: p
      },
      o
    )) })
  ] });
}
const k = T(U), J = j.memo(k);
export {
  J as default
};
//# sourceMappingURL=index-Bnd0SGVv.js.map
