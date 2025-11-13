import { s as c, r as a, j as r, ag as p, ah as x, f as g } from "./index-COqA-032.js";
const f = /* @__PURE__ */ c("div", {
  target: "e1se5lgy3"
})(({
  theme: e,
  cache: n
}) => ({
  ...n ? {
    paddingBottom: e.spacing.lg,
    background: `linear-gradient(to bottom, ${e.colors.bgColor} 0%, ${e.colors.bgColor} 80%, transparent 100%)`
  } : null
}), ""), S = /* @__PURE__ */ c("div", {
  target: "e1se5lgy2"
})({
  name: "1x17g94",
  styles: "display:flex;align-items:center;width:100%"
}), T = /* @__PURE__ */ c("div", {
  target: "e1se5lgy1"
})(({
  theme: e
}) => ({
  display: "flex",
  gap: e.spacing.sm,
  alignItems: "baseline"
}), ""), $ = /* @__PURE__ */ c("div", {
  target: "e1se5lgy0"
})(({
  theme: e
}) => ({
  opacity: 0.6,
  fontSize: e.fontSizes.sm
}), ""), y = (e) => {
  const n = Math.floor(e / 3600), t = Math.floor(e % 3600 / 60), s = e % 60;
  if (n === 0 && t === 0)
    return `(${s.toFixed(1)} seconds)`;
  if (n === 0) {
    const d = `${t} minute${t === 1 ? "" : "s"}`, m = s === 0 ? "" : `, ${s.toFixed(1)} seconds`;
    return `(${d}${m})`;
  }
  const l = `${n} hour${n === 1 ? "" : "s"}`, i = t === 0 ? "" : `, ${t} minute${t === 1 ? "" : "s"}`, o = s === 0 ? "" : `, ${s.toFixed(1)} seconds`;
  return `(${l}${i}${o})`;
};
function h({
  element: e
}) {
  const {
    cache: n,
    showTime: t
  } = e, [s, l] = a.useState(0), i = a.useRef(null);
  return a.useEffect(() => {
    if (!t) return;
    i.current = Date.now();
    const o = () => {
      if (i.current !== null) {
        const u = (Date.now() - i.current) / 1e3;
        l(u);
      }
    };
    o();
    const d = setInterval(o, 100);
    return () => clearInterval(d);
  }, [t]), /* @__PURE__ */ r.jsx(f, { className: p({
    stSpinner: !0,
    stCacheSpinner: n
  }), "data-testid": "stSpinner", cache: n, children: /* @__PURE__ */ r.jsxs(S, { children: [
    /* @__PURE__ */ r.jsx(x, { size: "base", margin: "0 md 0 0", padding: "0" }),
    /* @__PURE__ */ r.jsxs(T, { children: [
      /* @__PURE__ */ r.jsx(g, { source: e.text, allowHTML: !1 }),
      t && /* @__PURE__ */ r.jsx($, { children: y(s) })
    ] })
  ] }) });
}
const b = a.memo(h);
export {
  b as default
};
//# sourceMappingURL=index-EntBmJ7N.js.map
