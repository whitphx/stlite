import { r as n, s as f, L as p, as as x, u as h, a4 as y, j as d, at as g } from "./index-COqA-032.js";
const m = n.createContext(null);
m.displayName = "ElementFullscreenContext";
const w = /* @__PURE__ */ f("div", {
  target: "elp1w7k0"
})(({
  theme: e,
  isExpanded: t
}) => ({
  width: "100%",
  height: "100%",
  ...t ? {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: e.colors.bgColor,
    zIndex: e.zIndices.fullscreenWrapper,
    padding: e.spacing.md,
    paddingTop: e.sizes.fullScreenHeaderHeight,
    overflow: "auto",
    display: "flex",
    // To avoid extra spaces that lead to scrollbars.
    alignItems: "center",
    justifyContent: "center"
  } : {}
}), ""), C = () => {
  const {
    setFullScreen: e
  } = n.useContext(p), [t, s] = n.useState(!1), {
    fullHeight: a,
    fullWidth: c
  } = x(), l = n.useCallback((r) => {
    s(r), e(r);
  }, [e]), u = n.useCallback(() => {
    document.body.style.overflow = "hidden", l(!0);
  }, [l]), o = n.useCallback(() => {
    document.body.style.overflow = "unset", l(!1);
  }, [l]), i = n.useCallback((r) => {
    r.keyCode === 27 && t && o();
  }, [o, t]);
  return n.useEffect(() => (document.addEventListener("keydown", i, !1), () => {
    document.removeEventListener("keydown", i, !1);
  }), [i]), n.useMemo(() => ({
    expanded: t,
    zoomIn: u,
    zoomOut: o,
    fullHeight: a,
    fullWidth: c
  }), [t, u, o, a, c]);
}, E = ({
  children: e
}) => {
  const t = h(), {
    expanded: s,
    fullHeight: a,
    fullWidth: c,
    zoomIn: l,
    zoomOut: u
  } = C(), {
    width: o,
    elementRef: i
  } = y(), r = n.useMemo(() => ({
    width: s ? c : o,
    height: s ? a : void 0,
    expanded: s,
    expand: l,
    collapse: u
  }), [s, a, c, o, l, u]);
  return /* @__PURE__ */ d.jsx(m.Provider, { value: r, children: /* @__PURE__ */ d.jsx(w, { ref: i, isExpanded: s, "data-testid": "stFullScreenFrame", theme: t, children: e }) });
};
function S(e) {
  const t = (s) => /* @__PURE__ */ d.jsx(E, { children: /* @__PURE__ */ d.jsx(e, { ...s }) });
  return t.displayName = `withFullScreenWrapper(${e.displayName || e.name})`, g(t, e);
}
export {
  m as E,
  S as w
};
//# sourceMappingURL=withFullScreenWrapper-Bd7ZpoRc.js.map
