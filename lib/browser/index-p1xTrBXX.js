import { s as f, r as i, u as w, j as e, y as m, f as v, z as r, h as z, n as R, F as j, K as L } from "./index-COqA-032.js";
const C = /* @__PURE__ */ f("button", {
  target: "elibz2u2"
})(({
  theme: o
}) => ({
  fontSize: o.fontSizes.sm,
  lineHeight: o.lineHeights.base,
  color: o.colors.fadedText60,
  backgroundColor: o.colors.transparent,
  fontFamily: "inherit",
  margin: o.spacing.none,
  border: "none",
  boxShadow: "none",
  padding: o.spacing.none,
  "&:hover, &:active, &:focus": {
    border: "none",
    outline: "none",
    boxShadow: "none"
  },
  "&:hover": {
    color: o.colors.primary
  }
}), ""), E = /* @__PURE__ */ f("div", {
  target: "elibz2u1"
})(({
  theme: o
}) => ({
  display: "flex",
  flexDirection: "row",
  gap: o.spacing.lg,
  "> span": {
    marginTop: o.spacing.twoXS
  }
}), ""), k = /* @__PURE__ */ f("div", {
  target: "elibz2u0"
})(({
  theme: o
}) => ({
  display: "flex",
  flexDirection: "column",
  gap: o.spacing.sm,
  alignItems: "start",
  // Align text to the center of the icon when only 1 line.
  justifyContent: "center",
  overflow: "hidden",
  minHeight: "100%",
  fontSize: o.fontSizes.sm,
  lineHeight: o.lineHeights.base,
  div: {
    display: "inline-flex"
  }
}), "");
function B(o) {
  const t = z(o);
  return {
    Body: {
      props: {
        "data-testid": "stToast",
        className: "stToast"
      },
      style: {
        display: "flex",
        flexDirection: "row",
        gap: o.spacing.md,
        width: o.sizes.toastWidth,
        marginTop: o.spacing.sm,
        // Warnings logged if you use shorthand property here:
        borderTopLeftRadius: o.radii.default,
        borderTopRightRadius: o.radii.default,
        borderBottomLeftRadius: o.radii.default,
        borderBottomRightRadius: o.radii.default,
        paddingTop: o.spacing.lg,
        paddingBottom: o.spacing.lg,
        paddingLeft: o.spacing.twoXL,
        paddingRight: o.spacing.twoXL,
        backgroundColor: o.colors.bgColor,
        filter: t ? "brightness(0.98)" : "brightness(1.2)",
        color: o.colors.bodyText,
        // Take standard BaseWeb shadow and adjust for dark backgrounds
        boxShadow: t ? "0px 4px 16px rgba(0, 0, 0, 0.16)" : "0px 4px 16px rgba(0, 0, 0, 0.7)"
      }
    },
    CloseIcon: {
      style: {
        color: o.colors.fadedText40,
        width: o.fontSizes.lg,
        height: o.fontSizes.lg,
        marginRight: `calc(-1 * ${o.spacing.lg} / 2)`,
        ":hover": {
          color: o.colors.bodyText
        }
      }
    }
  };
}
function H(o) {
  if (o.length > 104) {
    let s = o.replace(/^(.{104}[^\s]*).*/, "$1");
    return s.length > 104 && (s = s.substring(0, 104).split(" ").slice(0, -1).join(" ")), s.trim();
  }
  return o;
}
function D({
  element: o
}) {
  const {
    body: t,
    icon: s,
    duration: d
  } = o, n = w(), l = H(t), c = t !== l, [a, y] = i.useState(!c), [b, S] = i.useState(0), x = i.useCallback(() => {
    y(!a);
  }, [a]), g = i.useMemo(() => B(n), [n]), p = i.useMemo(() => /* @__PURE__ */ e.jsxs(E, { expanded: a, children: [
    s && /* @__PURE__ */ e.jsx(m, { iconValue: s, size: "xl", testid: "stToastDynamicIcon" }),
    /* @__PURE__ */ e.jsxs(k, { children: [
      /* @__PURE__ */ e.jsx(v, { source: a ? t : l, allowHTML: !1, isToast: !0 }),
      c && /* @__PURE__ */ e.jsx(C, { "data-testid": "stToastViewButton", onClick: x, children: a ? "view less" : "view more" })
    ] })
  ] }), [c, a, t, s, l, x]);
  i.useEffect(() => {
    if (n.inSidebar)
      return;
    const h = R(d) ? d === 0 ? 0 : d * 1e3 : 4e3, u = r.info(p, {
      overrides: {
        ...g
      },
      autoHideDuration: h
    });
    return S(u), () => {
      r.update(u, {
        overrides: {
          Body: {
            style: {
              display: "none"
            }
          }
        }
      }), r.clear(u);
    };
  }, []), i.useEffect(() => {
    r.update(b, {
      children: p,
      overrides: {
        ...g
      }
    });
  }, [b, p, g]);
  const T = /* @__PURE__ */ e.jsx(j, { kind: L.ERROR, body: "Streamlit API Error: `st.toast` cannot be called directly on the sidebar with `st.sidebar.toast`.\n        See our `st.toast` API [docs](https://docs.streamlit.io/develop/api-reference/status/st.toast) for more information." });
  return (
    // Shows error if toast is called on st.sidebar
    /* @__PURE__ */ e.jsx(e.Fragment, { children: n.inSidebar && T })
  );
}
const I = i.memo(D);
export {
  I as default
};
//# sourceMappingURL=index-p1xTrBXX.js.map
