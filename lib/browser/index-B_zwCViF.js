import { r as a, j as n, i as c, l as g } from "./index-COqA-032.js";
import { u as m } from "./useBasicWidgetState-Hu_BQk7V.js";
const b = (t, e) => t.getStringValue(e), f = (t) => t.default ?? null, d = (t) => t.value ?? null, p = (t, e, r, o) => {
  e.setStringValue(t, r.value, {
    fromUi: r.fromUi
  }, o);
}, C = ({
  element: t,
  disabled: e,
  widgetMgr: r,
  fragmentId: o
}) => {
  const [i, l] = m({
    getStateFromWidgetMgr: b,
    getDefaultStateFromProto: f,
    getCurrStateFromProto: d,
    updateWidgetMgrState: p,
    element: t,
    widgetMgr: r,
    fragmentId: o
  }), s = a.useCallback((u) => {
    l({
      value: u,
      fromUi: !0
    });
  }, [l]);
  return /* @__PURE__ */ n.jsx(c, { label: t.label, labelVisibility: g(t.labelVisibility?.value), help: t.help, onChange: s, disabled: e, value: i });
}, P = a.memo(C);
export {
  P as default
};
//# sourceMappingURL=index-B_zwCViF.js.map
