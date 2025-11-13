import { s as D, r as a, a4 as U, u as k, a5 as S, j as i, W as H, l as B, Q as _, T as O, P as w, y as K, a6 as q } from "./index-COqA-032.js";
import { u as A } from "./uniqueId-C5LNXL4K.js";
import { I as G } from "./InputInstructions-BAuMHIgJ.js";
import { u as N } from "./useBasicWidgetState-Hu_BQk7V.js";
import { u as Q, a as $, b as J } from "./useUpdateUiValue-B0n7r86a.js";
import { I as M } from "./input-BCJbpYBC.js";
const X = /* @__PURE__ */ D("div", {
  target: "e11y4ecf0"
})({
  name: "bjn8wh",
  styles: "position:relative"
});
function Y({
  disabled: s,
  element: t,
  widgetMgr: o,
  fragmentId: u
}) {
  const [r, c] = a.useState(() => I(o, t) ?? null), {
    width: W,
    elementRef: y
  } = U(), [n, p] = a.useState(!1), T = a.useCallback(() => {
    c(t.default ?? null), p(!0);
  }, [t.default]), [V, m] = N({
    getStateFromWidgetMgr: I,
    getDefaultStateFromProto: Z,
    getCurrStateFromProto: tt,
    updateWidgetMgrState: et,
    element: t,
    widgetMgr: o,
    fragmentId: u,
    onFormCleared: T
  });
  Q(V, r, c, n);
  const [C, f] = a.useState(!1), e = k(), [g] = a.useState(() => A("text_input_")), {
    placeholder: E,
    formId: l,
    icon: d,
    maxChars: b
  } = t, h = a.useCallback(() => {
    p(!1), m({
      value: r,
      fromUi: !0
    });
  }, [r, m]), F = S({
    formId: l
  }) ? o.allowFormEnterToSubmit(l) : n, j = C && W > e.breakpoints.hideWidgetDetails, v = a.useCallback(() => {
    n && h(), f(!1);
  }, [n, h]), R = a.useCallback(() => {
    f(!0);
  }, []), z = $({
    formId: l,
    maxChars: b,
    setDirty: p,
    setUiValue: c,
    setValueWithSource: m
  }), P = J(l, h, n, o, u), x = d?.startsWith(":material"), L = x ? "lg" : "base";
  return /* @__PURE__ */ i.jsxs(X, { className: "stTextInput", "data-testid": "stTextInput", ref: y, children: [
    /* @__PURE__ */ i.jsx(H, { label: t.label, disabled: s, labelVisibility: B(t.labelVisibility?.value), htmlFor: g, children: t.help && /* @__PURE__ */ i.jsx(_, { children: /* @__PURE__ */ i.jsx(O, { content: t.help, placement: w.TOP_RIGHT }) }) }),
    /* @__PURE__ */ i.jsx(M, { value: r ?? "", placeholder: E, onBlur: v, onFocus: R, onChange: z, onKeyPress: P, "aria-label": t.label, disabled: s, id: g, type: st(t), autoComplete: t.autocomplete, startEnhancer: d && /* @__PURE__ */ i.jsx(K, { "data-testid": "stTextInputIcon", iconValue: d, size: L }), overrides: {
      Input: {
        style: {
          fontWeight: e.fontWeights.normal,
          // Issue: https://github.com/streamlit/streamlit/issues/2495
          // The input won't shrink in Firefox,
          // unless the line below is provided.
          // See https://stackoverflow.com/a/33811151
          minWidth: 0,
          lineHeight: e.lineHeights.inputWidget,
          // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
          paddingRight: e.spacing.sm,
          paddingLeft: e.spacing.md,
          paddingBottom: e.spacing.sm,
          paddingTop: e.spacing.sm,
          "::placeholder": {
            color: e.colors.fadedText60
          }
        }
      },
      Root: {
        props: {
          "data-testid": "stTextInputRootElement"
        },
        style: {
          height: e.sizes.minElementHeight,
          // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
          borderLeftWidth: e.sizes.borderWidth,
          borderRightWidth: e.sizes.borderWidth,
          borderTopWidth: e.sizes.borderWidth,
          borderBottomWidth: e.sizes.borderWidth,
          paddingLeft: d ? e.spacing.sm : 0
        }
      },
      StartEnhancer: {
        style: {
          paddingLeft: 0,
          paddingRight: 0,
          // Keeps emoji icons from being cut off on the right
          minWidth: e.iconSizes.lg,
          // Material icons color changed as inactionable
          color: x ? e.colors.fadedText60 : "inherit"
        }
      }
    } }),
    j && /* @__PURE__ */ i.jsx(G, { dirty: n, value: r ?? "", maxLength: b, inForm: S({
      formId: l
    }), allowEnterToSubmit: F })
  ] });
}
function I(s, t) {
  return s.getStringValue(t) ?? null;
}
function Z(s) {
  return s.default ?? null;
}
function tt(s) {
  return s.value ?? null;
}
function et(s, t, o, u) {
  t.setStringValue(s, o.value, {
    fromUi: o.fromUi
  }, u);
}
function st(s) {
  return s.type === q.Type.PASSWORD ? "password" : "text";
}
const ut = a.memo(Y);
export {
  ut as default
};
//# sourceMappingURL=index-C00hMsL7.js.map
