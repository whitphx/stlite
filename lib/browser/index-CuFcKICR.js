import { s as a, r as t, n as i, j as d, G as e, H as c, k as l } from "./index-COqA-032.js";
const g = /* @__PURE__ */ a("iframe", {
  target: "e1u6k47s0"
})(({
  theme: o,
  disableScrolling: r
}) => ({
  width: "100%",
  height: "100%",
  colorScheme: "normal",
  border: "none",
  padding: o.spacing.none,
  margin: o.spacing.none,
  overflow: r ? "hidden" : void 0
}), "");
function s(o) {
  return l(o) || o === "" ? void 0 : o;
}
function m({
  element: o
}) {
  const r = s(o.src), n = i(r) ? void 0 : s(o.srcdoc);
  return /* @__PURE__ */ d.jsx(g, { className: "stIFrame", "data-testid": "stIFrame", allow: c, disableScrolling: !o.scrolling, src: r, srcDoc: n, scrolling: o.scrolling ? "auto" : "no", sandbox: e, title: "st.iframe", tabIndex: o.tabIndex ?? void 0 });
}
const I = t.memo(m);
export {
  I as default
};
//# sourceMappingURL=index-CuFcKICR.js.map
