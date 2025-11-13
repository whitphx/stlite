import { s as l, r as d, L as p, u, j as a, b as x, P as f, y as k, f as b } from "./index-COqA-032.js";
const L = /* @__PURE__ */ l("div", {
  target: "e11k5jya2"
})({
  name: "b6wrti",
  styles: "display:flex;flex-direction:column;width:100%"
}), C = /* @__PURE__ */ l("a", {
  target: "e11k5jya1"
})(({
  disabled: n,
  isCurrentPage: e,
  theme: o
}) => ({
  textDecoration: "none",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: o.spacing.sm,
  borderRadius: o.radii.default,
  paddingLeft: o.spacing.sm,
  paddingRight: o.spacing.sm,
  marginTop: o.spacing.threeXS,
  marginBottom: o.spacing.threeXS,
  lineHeight: o.lineHeights.menuItem,
  backgroundColor: e ? o.colors.darkenedBgMix15 : "transparent",
  "&:hover": {
    backgroundColor: e ? o.colors.darkenedBgMix25 : o.colors.darkenedBgMix15
  },
  "&:active,&:visited,&:hover": {
    textDecoration: "none"
  },
  "&:focus": {
    outline: "none"
  },
  "&:focus-visible": {
    backgroundColor: o.colors.darkenedBgMix15
  },
  "@media print": {
    paddingLeft: o.spacing.none
  },
  ...n ? {
    borderColor: o.colors.borderColor,
    backgroundColor: o.colors.transparent,
    color: o.colors.fadedText40,
    cursor: "not-allowed",
    "&:hover": {
      color: o.colors.fadedText40,
      backgroundColor: o.colors.transparent
    }
  } : {}
}), ""), v = /* @__PURE__ */ l("span", {
  target: "e11k5jya0"
})(({
  disabled: n,
  theme: e
}) => ({
  color: e.colors.bodyText,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  display: "table-cell",
  ...n ? {
    borderColor: e.colors.borderColor,
    backgroundColor: e.colors.transparent,
    color: e.colors.fadedText40,
    cursor: "not-allowed"
  } : {}
}), "");
function y(n) {
  const {
    onPageChange: e,
    currentPageScriptHash: o
  } = d.useContext(p), {
    colors: s
  } = u(), {
    disabled: t,
    element: r
  } = n, i = o === r.pageScriptHash, g = (c) => {
    r.external ? t && c.preventDefault() : (c.preventDefault(), t || e(r.pageScriptHash));
  };
  return /* @__PURE__ */ a.jsx("div", { className: "stPageLink", "data-testid": "stPageLink", children: /* @__PURE__ */ a.jsx(x, { help: r.help, placement: f.TOP_RIGHT, containerWidth: !0, children: /* @__PURE__ */ a.jsx(L, { children: /* @__PURE__ */ a.jsxs(C, { "data-testid": "stPageLink-NavLink", disabled: t, isCurrentPage: i, href: r.page, target: r.external ? "_blank" : "", rel: "noreferrer", onClick: g, children: [
    r.icon && /* @__PURE__ */ a.jsx(k, { size: "lg", color: t ? s.fadedText40 : s.bodyText, iconValue: r.icon }),
    /* @__PURE__ */ a.jsx(v, { disabled: t, children: /* @__PURE__ */ a.jsx(b, { source: r.label, allowHTML: !1, isLabel: !0, boldLabel: i, largerLabel: !0, disableLinks: !0 }) })
  ] }) }) }) });
}
const T = d.memo(y);
export {
  T as default
};
//# sourceMappingURL=index-CyGauXz7.js.map
