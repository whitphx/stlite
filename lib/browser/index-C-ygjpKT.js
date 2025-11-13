import { r as f, u as T, h as k, j as c, S as C, e as y, l as S, f as L, g as W, T as B, P as R, t as w, C as E } from "./index-COqA-032.js";
import { u as P } from "./useBasicWidgetState-Hu_BQk7V.js";
import { S as j, L as $, a as m } from "./checkbox-DufG68jn.js";
function v({
  element: e,
  disabled: a,
  widgetMgr: n,
  fragmentId: d
}) {
  const [p, g] = P({
    getStateFromWidgetMgr: X,
    getDefaultStateFromProto: H,
    getCurrStateFromProto: M,
    updateWidgetMgrState: V,
    element: e,
    widgetMgr: n,
    fragmentId: d
  }), x = f.useCallback(
    (i) => {
      g({
        value: i.target.checked,
        fromUi: !0
      });
    },
    // ESLint complains if we remove this unnecessary dep.
    [g]
  ), t = T(), {
    colors: o,
    spacing: h,
    sizes: r
  } = t, u = k(t), b = a ? o.fadedText40 : o.bodyText;
  return /* @__PURE__ */ c.jsx(C, { className: "row-widget stCheckbox", "data-testid": "stCheckbox", children: /* @__PURE__ */ c.jsx(j, { checked: p, disabled: a, onChange: x, "aria-label": e.label, checkmarkType: e.type === E.StyleType.TOGGLE ? m.toggle : m.default, labelPlacement: $.right, overrides: {
    Root: {
      style: ({
        $isFocusVisible: i
      }) => ({
        marginBottom: h.none,
        marginTop: h.none,
        backgroundColor: i ? o.darkenedBgMix25 : "",
        display: "flex",
        alignItems: "start"
      })
    },
    Toggle: {
      style: ({
        $checked: i
      }) => {
        let s = u ? o.bgColor : o.bodyText;
        return a && (s = u ? o.gray70 : o.gray90), {
          width: `calc(${r.checkbox} - ${t.spacing.twoXS})`,
          height: `calc(${r.checkbox} - ${t.spacing.twoXS})`,
          transform: i ? `translateX(${r.checkbox})` : "",
          backgroundColor: s,
          boxShadow: ""
        };
      }
    },
    ToggleTrack: {
      style: ({
        $checked: i,
        $isHovered: s
      }) => {
        let l = o.fadedText40;
        return s && !a && (l = o.fadedText20), i && !a && (l = o.primary), {
          marginRight: 0,
          marginLeft: 0,
          marginBottom: 0,
          marginTop: t.spacing.twoXS,
          paddingLeft: t.spacing.threeXS,
          paddingRight: t.spacing.threeXS,
          width: `calc(2 * ${r.checkbox})`,
          minWidth: `calc(2 * ${r.checkbox})`,
          height: r.checkbox,
          minHeight: r.checkbox,
          borderBottomLeftRadius: t.radii.full,
          borderTopLeftRadius: t.radii.full,
          borderBottomRightRadius: t.radii.full,
          borderTopRightRadius: t.radii.full,
          backgroundColor: l
        };
      }
    },
    Checkmark: {
      style: ({
        $isFocusVisible: i,
        $checked: s
      }) => {
        const l = s && !a ? o.primary : o.fadedText40;
        return {
          outline: 0,
          width: r.checkbox,
          height: r.checkbox,
          marginTop: t.spacing.twoXS,
          marginLeft: 0,
          marginBottom: 0,
          boxShadow: i && s ? `0 0 0 0.2rem ${w(o.primary, 0.5)}` : "",
          // This is painfully verbose, but baseweb seems to internally
          // use the long-hand version, which means we can't use the
          // shorthand names here as if we do we'll end up with warn
          // logs spamming us every time a checkbox is rendered.
          borderLeftWidth: r.borderWidth,
          borderRightWidth: r.borderWidth,
          borderTopWidth: r.borderWidth,
          borderBottomWidth: r.borderWidth,
          borderLeftColor: l,
          borderRightColor: l,
          borderTopColor: l,
          borderBottomColor: l
        };
      }
    },
    Label: {
      style: {
        lineHeight: t.lineHeights.small,
        paddingLeft: t.spacing.sm,
        position: "relative",
        color: b
      }
    }
  }, children: /* @__PURE__ */ c.jsxs(y, { visibility: S(e.labelVisibility?.value), "data-testid": "stWidgetLabel", children: [
    /* @__PURE__ */ c.jsx(L, { source: e.label, allowHTML: !1, isLabel: !0, largerLabel: !0 }),
    e.help && /* @__PURE__ */ c.jsx(W, { color: b, children: /* @__PURE__ */ c.jsx(B, { content: e.help, placement: R.TOP_RIGHT }) })
  ] }) }) });
}
function X(e, a) {
  return e.getBoolValue(a);
}
function H(e) {
  return e.default ?? null;
}
function M(e) {
  return e.value ?? null;
}
function V(e, a, n, d) {
  a.setBoolValue(e, n.value, {
    fromUi: n.fromUi
  }, d);
}
const G = f.memo(v);
export {
  G as default
};
//# sourceMappingURL=index-C-ygjpKT.js.map
