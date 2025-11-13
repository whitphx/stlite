import { r as l, B as s, j as e, a as u, b as d, c, d as B, D as m } from "./index-COqA-032.js";
function p(n) {
  const {
    disabled: i,
    element: t,
    widgetMgr: o,
    fragmentId: r
  } = n;
  let a = s.SECONDARY;
  return t.type === "primary" ? a = s.PRIMARY : t.type === "tertiary" && (a = s.TERTIARY), /* @__PURE__ */ e.jsx(u, { className: "stButton", "data-testid": "stButton", children: /* @__PURE__ */ e.jsx(
    d,
    {
      help: t.help,
      containerWidth: !0,
      children: /* @__PURE__ */ e.jsx(c, { kind: a, size: B.SMALL, disabled: i, containerWidth: !0, onClick: () => o.setTriggerValue(t, {
        fromUi: !0
      }, r), children: /* @__PURE__ */ e.jsx(m, { icon: t.icon, label: t.label }) })
    }
  ) });
}
const f = l.memo(p);
export {
  f as default
};
//# sourceMappingURL=index-AbHW5PMn.js.map
