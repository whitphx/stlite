import { l as H, ak as _, s as w, r as s, a4 as O, u as G, a5 as S, j as l, W as K, Q as q, T as N, P as Q } from "./index-COqA-032.js";
import { u as $ } from "./uniqueId-C5LNXL4K.js";
import { I as J } from "./InputInstructions-BAuMHIgJ.js";
import { u as M } from "./useBasicWidgetState-Hu_BQk7V.js";
import { u as X, a as Y, b as Z } from "./useUpdateUiValue-B0n7r86a.js";
import { u as tt, T as et } from "./useTextInputAutoExpand-YvQcBtbJ.js";
const it = (e, t) => {
  let a = "auto";
  if (e.heightConfig?.useStretch)
    a = "100%";
  else if (e.heightConfig?.pixelHeight && e.heightConfig.pixelHeight > 0) {
    const o = H(t.labelVisibility?.value) === _.Collapsed ? 2 : 30;
    a = `${e.heightConfig.pixelHeight - o}px`;
  }
  return a;
}, at = /* @__PURE__ */ w("div", {
  target: "ezh4s2r0"
})({
  name: "kdbhus",
  styles: "height:100%;display:flex;flex-direction:column"
}), T = (e, t) => e.getStringValue(t) ?? t.default ?? null, st = (e) => e.default ?? null, ot = (e) => e.value ?? null, rt = (e, t, a, o) => {
  t.setStringValue(e, a.value, {
    fromUi: a.fromUi
  }, o);
}, lt = ({
  disabled: e,
  element: t,
  widgetMgr: a,
  fragmentId: o,
  outerElement: d
}) => {
  const m = s.useRef($("text_area_")).current, {
    width: W,
    elementRef: y
  } = O(), [r, h] = s.useState(!1), [I, x] = s.useState(!1), n = d.heightConfig?.useContent ?? !1, V = d.heightConfig?.useStretch ?? !1, v = it(d, t), b = s.useRef(null), [u, c] = s.useState(() => T(a, t) ?? null), A = s.useCallback(() => {
    c(t.default ?? null), h(!0);
  }, [t]), [F, g] = M({
    getStateFromWidgetMgr: T,
    getDefaultStateFromProto: st,
    getCurrStateFromProto: ot,
    updateWidgetMgrState: rt,
    element: t,
    widgetMgr: a,
    fragmentId: o,
    onFormCleared: A
  });
  X(F, u, c, r);
  const i = G(), {
    height: R,
    maxHeight: j,
    updateScrollHeight: C
  } = tt({
    textareaRef: b,
    dependencies: [t.placeholder]
  }), p = s.useCallback(() => {
    h(!1), g({
      value: u,
      fromUi: !0
    });
  }, [u, g]), k = s.useCallback(() => {
    r && p(), x(!1);
  }, [r, p]), z = s.useCallback(() => {
    x(!0);
  }, []), E = s.useCallback(() => {
    n && C();
  }, [n, C]), P = Y({
    formId: t.formId,
    maxChars: t.maxChars,
    setDirty: h,
    setUiValue: c,
    setValueWithSource: g,
    additionalAction: E
  }), L = Z(t.formId, p, r, a, o, !0), {
    placeholder: U,
    formId: f
  } = t, D = S({
    formId: f
  }) ? a.allowFormEnterToSubmit(f) : r, B = I && W > i.breakpoints.hideWidgetDetails;
  return /* @__PURE__ */ l.jsxs(at, { className: "stTextArea", "data-testid": "stTextArea", ref: y, children: [
    /* @__PURE__ */ l.jsx(K, { label: t.label, disabled: e, labelVisibility: H(t.labelVisibility?.value), htmlFor: m, children: t.help && /* @__PURE__ */ l.jsx(q, { children: /* @__PURE__ */ l.jsx(N, { content: t.help, placement: Q.TOP_RIGHT }) }) }),
    /* @__PURE__ */ l.jsx(et, { inputRef: n ? b : void 0, value: u ?? "", placeholder: U, onBlur: k, onFocus: z, onChange: P, onKeyDown: L, "aria-label": t.label, disabled: e, id: m, overrides: {
      Input: {
        style: {
          fontWeight: i.fontWeights.normal,
          lineHeight: i.lineHeights.inputWidget,
          // The default height of the text area is calculated to perfectly fit 3 lines of text.
          height: n ? R : v,
          maxHeight: n ? j : "",
          minHeight: i.sizes.largestElementHeight,
          resize: V ? "none" : "vertical",
          // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
          paddingRight: i.spacing.md,
          paddingLeft: i.spacing.md,
          paddingBottom: i.spacing.md,
          paddingTop: i.spacing.md,
          "::placeholder": {
            color: i.colors.fadedText60
          }
        }
      },
      Root: {
        props: {
          "data-testid": "stTextAreaRootElement"
        },
        style: {
          // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
          borderLeftWidth: i.sizes.borderWidth,
          borderRightWidth: i.sizes.borderWidth,
          borderTopWidth: i.sizes.borderWidth,
          borderBottomWidth: i.sizes.borderWidth,
          flexGrow: 1
        }
      }
    } }),
    B && /* @__PURE__ */ l.jsx(J, { dirty: r, value: u ?? "", maxLength: t.maxChars, type: "multiline", inForm: S({
      formId: f
    }), allowEnterToSubmit: D })
  ] });
}, pt = s.memo(lt);
export {
  pt as default
};
//# sourceMappingURL=index-D_xIq5fw.js.map
