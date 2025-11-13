import { r as l, k as s, j as m, U as x, l as V } from "./index-COqA-032.js";
import { u as U } from "./useBasicWidgetState-Hu_BQk7V.js";
const h = (t, e) => t.getStringValue(e), j = (t) => t.options.length === 0 || s(t.default) ? null : t.options[t.default], v = (t) => t.rawValue ?? null, w = (t, e, o, a) => {
  e.setStringValue(t, o.value, {
    fromUi: o.fromUi
  }, a);
}, y = ({
  disabled: t,
  element: e,
  widgetMgr: o,
  fragmentId: a
}) => {
  const {
    options: i,
    help: u,
    label: n,
    labelVisibility: c,
    placeholder: p,
    acceptNewOptions: f
  } = e, [g, r] = U({
    getStateFromWidgetMgr: h,
    getDefaultStateFromProto: j,
    getCurrStateFromProto: v,
    updateWidgetMgrState: w,
    element: e,
    widgetMgr: o,
    fragmentId: a
  }), b = l.useCallback((S) => {
    r({
      value: S,
      fromUi: !0
    });
  }, [r]), d = s(e.default) && !t;
  return /* @__PURE__ */ m.jsx(x, { label: n, labelVisibility: V(c?.value), options: i, disabled: t, onChange: b, value: g, help: u, placeholder: p, clearable: d, acceptNewOptions: f ?? !1 });
}, F = l.memo(y);
export {
  F as default
};
//# sourceMappingURL=index-DZWZkVvH.js.map
