import { r as s, E as p, _ as v, s as d, h as w, j as n, u as E, am as g, P as T, c as b, B as y, an as z, f as B } from "./index-COqA-032.js";
var h = /* @__PURE__ */ s.forwardRef(function(t, o) {
  var e = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ s.createElement(p, v({
    iconAttrs: e,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, t, {
    ref: o
  }), /* @__PURE__ */ s.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ s.createElement("path", {
    d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
  }));
});
h.displayName = "Fullscreen";
var u = /* @__PURE__ */ s.forwardRef(function(t, o) {
  var e = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ s.createElement(p, v({
    iconAttrs: e,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, t, {
    ref: o
  }), /* @__PURE__ */ s.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ s.createElement("path", {
    d: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
  }));
});
u.displayName = "FullscreenExit";
const c = "-2.65rem", j = /* @__PURE__ */ d("div", {
  target: "e2wxzia2"
})(({
  theme: t,
  locked: o,
  target: e
}) => ({
  padding: `${t.spacing.sm} 0 ${t.spacing.sm} ${t.spacing.sm}`,
  position: "absolute",
  top: o ? c : "-1rem",
  right: t.spacing.none,
  transition: "none",
  ...!o && {
    opacity: 0,
    "&:active, &:focus-visible, &:hover": {
      transition: "opacity 150ms 100ms, top 100ms 100ms",
      opacity: 1,
      top: c
    },
    ...e && {
      [`${e}:hover &, ${e}:active &, ${e}:focus-visible &`]: {
        transition: "opacity 150ms 100ms, top 100ms 100ms",
        opacity: 1,
        top: c
      }
    }
  }
}), ""), V = /* @__PURE__ */ d("div", {
  target: "e2wxzia1"
})(({
  theme: t
}) => ({
  color: w(t) ? t.colors.fadedText60 : t.colors.bodyText,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  boxShadow: "1px 2px 8px rgba(0, 0, 0, 0.08)",
  borderRadius: t.radii.default,
  backgroundColor: t.colors.lightenedBg05,
  width: "fit-content",
  zIndex: t.zIndices.sidebar + 1,
  padding: t.spacing.twoXS
}), ""), H = /* @__PURE__ */ d("div", {
  target: "e2wxzia0"
})(({
  height: t,
  useContainerWidth: o,
  topCentered: e,
  useContainerHeight: a
}) => ({
  position: "relative",
  height: o && t ? t : a ? t || "100%" : "fit-content",
  maxWidth: "100%",
  width: o ? "100%" : "fit-content",
  ...e ? {
    display: "flex",
    justifyContent: "center"
  } : {}
}), "");
function m({
  label: t,
  show_label: o,
  icon: e,
  onClick: a
}) {
  const l = E(), i = o ? t : "";
  return /* @__PURE__ */ n.jsx("div", { "data-testid": "stElementToolbarButton", children: /* @__PURE__ */ n.jsx(
    g,
    {
      content: /* @__PURE__ */ n.jsx(B, { source: t, allowHTML: !1, style: {
        fontSize: l.fontSizes.sm
      } }),
      placement: T.TOP,
      onMouseEnterDelay: 1e3,
      inline: !0,
      children: /* @__PURE__ */ n.jsxs(b, { onClick: (r) => {
        a && a(), r.stopPropagation();
      }, kind: y.ELEMENT_TOOLBAR, "aria-label": t, children: [
        e && /* @__PURE__ */ n.jsx(z, { content: e, size: "md", testid: "stElementToolbarButtonIcon" }),
        i && /* @__PURE__ */ n.jsx("span", { children: i })
      ] })
    }
  ) });
}
const S = ({
  onExpand: t,
  onCollapse: o,
  isFullScreen: e,
  locked: a,
  children: l,
  target: i,
  disableFullscreenMode: r
}) => {
  const x = t && !r && !e, f = o && !r && e;
  return /* @__PURE__ */ n.jsx(j, { className: "stElementToolbar", "data-testid": "stElementToolbar", locked: a || e, target: i, children: /* @__PURE__ */ n.jsxs(V, { "data-testid": "stElementToolbarButtonContainer", children: [
    l,
    x && /* @__PURE__ */ n.jsx(m, { label: "Fullscreen", icon: h, onClick: () => t() }),
    f && /* @__PURE__ */ n.jsx(m, { label: "Close fullscreen", icon: u, onClick: () => o() })
  ] }) });
};
export {
  H as S,
  S as T,
  m as a
};
//# sourceMappingURL=Toolbar-DRAqg1o6.js.map
