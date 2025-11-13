import { s as l, aa as t, t as x, d as s, r as b, B as n, j as i, a as v, b as B, D as k } from "./index-COqA-032.js";
function C(o, r) {
  switch (o) {
    case s.XSMALL:
      return {
        padding: `${r.spacing.twoXS} ${r.spacing.sm}`,
        fontSize: r.fontSizes.sm
      };
    case s.SMALL:
      return {
        padding: `${r.spacing.twoXS} ${r.spacing.md}`
      };
    case s.LARGE:
      return {
        padding: `${r.spacing.md} ${r.spacing.md}`
      };
    default:
      return {
        padding: `${r.spacing.xs} ${r.spacing.md}`
      };
  }
}
const u = /* @__PURE__ */ l("a", {
  target: "e16zdaao3"
})(({
  containerWidth: o,
  size: r,
  theme: a
}) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: a.fontWeights.normal,
  padding: `${a.spacing.xs} ${a.spacing.md}`,
  borderRadius: a.radii.button,
  minHeight: a.sizes.minElementHeight,
  margin: 0,
  lineHeight: a.lineHeights.base,
  color: a.colors.primary,
  textDecoration: "none",
  width: o ? "100%" : "auto",
  userSelect: "none",
  "&:visited": {
    color: a.colors.primary
  },
  "&:focus": {
    outline: "none"
  },
  "&:focus-visible": {
    // When focus-visible (e.g. if the button was focused via keyboard navigation)
    // we use the hover style of the respective button type (see below) and
    // additionally show a colored focus ring
    boxShadow: `0 0 0 0.2rem ${x(a.colors.primary, 0.5)}`
  },
  "&:hover": {
    textDecoration: "none"
  },
  "&:active": {
    textDecoration: "none"
  },
  ...C(r, a)
}), ""), S = /* @__PURE__ */ l(u, {
  target: "e16zdaao2"
})(({
  theme: o
}) => ({
  backgroundColor: o.colors.primary,
  color: o.colors.white,
  border: `${o.sizes.borderWidth} solid ${o.colors.primary}`,
  "&:hover, &:focus-visible": {
    backgroundColor: t(o.colors.primary, 0.15),
    borderColor: t(o.colors.primary, 0.15)
  },
  "&:active": {
    backgroundColor: o.colors.primary,
    // Keep the border darker when clicked so that the button looks "pressed"
    borderColor: t(o.colors.primary, 0.15)
  },
  "&:visited:not(:active)": {
    color: o.colors.white
  },
  "&[disabled], &[disabled]:hover, &[disabled]:active, &[disabled]:visited": {
    borderColor: o.colors.borderColor,
    backgroundColor: o.colors.transparent,
    color: o.colors.fadedText40,
    cursor: "not-allowed"
  }
}), ""), L = /* @__PURE__ */ l(u, {
  target: "e16zdaao1"
})(({
  theme: o
}) => ({
  backgroundColor: o.colors.lightenedBg05,
  color: o.colors.bodyText,
  border: `${o.sizes.borderWidth} solid ${o.colors.borderColor}`,
  "&:visited": {
    color: o.colors.bodyText
  },
  "&:hover, &:focus-visible": {
    backgroundColor: o.colors.darkenedBgMix15
  },
  "&:active": {
    backgroundColor: o.colors.darkenedBgMix25
  },
  "&[disabled], &[disabled]:hover, &[disabled]:active": {
    borderColor: o.colors.borderColor,
    backgroundColor: o.colors.transparent,
    color: o.colors.fadedText40,
    cursor: "not-allowed"
  }
}), ""), $ = /* @__PURE__ */ l(u, {
  target: "e16zdaao0"
})(({
  theme: o
}) => ({
  padding: o.spacing.none,
  backgroundColor: o.colors.transparent,
  color: o.colors.bodyText,
  border: "none",
  "&:visited": {
    color: o.colors.bodyText
  },
  "&:hover, &:focus-visible": {
    color: o.colors.primary
  },
  "&:hover:not([disabled]), &:focus-visible:not([disabled])": {
    // Also make colored text have the primary color on hover. Since text color is
    // applied as an inline style we need to use !important to override it.
    // Note that we're not doing this when disabled. We should probably do that as
    // well but we don't do it anywhere else.
    "span.stMarkdownColoredText": {
      color: "inherit !important"
    }
  },
  "&:active": {
    color: t(o.colors.primary, 0.25)
  },
  "&[disabled], &[disabled]:hover, &[disabled]:active": {
    backgroundColor: o.colors.transparent,
    color: o.colors.fadedText40,
    cursor: "not-allowed"
  }
}), "");
function T({
  kind: o,
  size: r,
  disabled: a,
  children: d,
  autoFocus: e,
  href: p,
  rel: g,
  target: f,
  onClick: y
}) {
  let c = S;
  return o === n.SECONDARY ? c = L : o === n.TERTIARY && (c = $), /* @__PURE__ */ i.jsx(c, { kind: o, size: r || s.MEDIUM, containerWidth: !0, disabled: a || !1, autoFocus: e || !1, href: p, target: f, rel: g, onClick: y, tabIndex: a ? -1 : 0, "data-testid": `stBaseLinkButton-${o}`, children: d });
}
const z = b.memo(T);
function w(o) {
  const {
    element: r
  } = o;
  let a = n.SECONDARY;
  r.type === "primary" ? a = n.PRIMARY : r.type === "tertiary" && (a = n.TERTIARY);
  const d = (e) => {
    r.disabled && e.preventDefault();
  };
  return /* @__PURE__ */ i.jsx(v, { className: "stLinkButton", "data-testid": "stLinkButton", children: /* @__PURE__ */ i.jsx(
    B,
    {
      help: r.help,
      containerWidth: !0,
      children: /* @__PURE__ */ i.jsx(z, { kind: a, size: s.SMALL, disabled: r.disabled, onClick: d, href: r.url, target: "_blank", rel: "noreferrer", "aria-disabled": r.disabled, children: /* @__PURE__ */ i.jsx(k, { icon: r.icon, label: r.label }) })
    }
  ) });
}
const A = b.memo(w);
export {
  A as default
};
//# sourceMappingURL=index-C2wx7I5V.js.map
