import { s as d, $ as g, j as c, a0 as p, a1 as f } from "./index-COqA-032.js";
const $ = g`
  50% {
    color: rgba(0, 0, 0, 0);
  }
`, I = /* @__PURE__ */ d("span", {
  target: "edlqvik0"
})(({
  includeDot: s,
  shouldBlink: o,
  theme: t
}) => ({
  ...s ? {
    "&::before": {
      opacity: 1,
      content: '"•"',
      animation: "none",
      color: t.colors.grayTextColor,
      margin: `0 ${t.spacing.twoXS}`
    }
  } : {},
  ...o ? {
    color: t.colors.redTextColor,
    animationName: `${$}`,
    animationDuration: "0.5s",
    animationIterationCount: 5
  } : {}
}), ""), y = ({
  dirty: s,
  value: o,
  inForm: t,
  maxLength: r,
  className: m,
  type: a = "single",
  allowEnterToSubmit: u = !0
}) => {
  const n = [], i = (e, l = !1) => {
    n.push(/* @__PURE__ */ c.jsx(I, { includeDot: n.length > 0, shouldBlink: l, children: e }, n.length));
  };
  if (u) {
    const e = t ? "submit form" : "apply";
    if (a === "multiline") {
      const l = f() ? "⌘" : "Ctrl";
      i(`Press ${l}+Enter to ${e}`);
    } else a === "single" && i(`Press Enter to ${e}`);
  }
  return r && (a !== "chat" || s) && i(`${o.length}/${r}`, s && o.length >= r), /* @__PURE__ */ c.jsx(p, { "data-testid": "InputInstructions", className: m, children: n });
};
export {
  y as I
};
//# sourceMappingURL=InputInstructions-BAuMHIgJ.js.map
