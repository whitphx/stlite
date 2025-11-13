import { r, a8 as J } from "./index-COqA-032.js";
import { s as Q, i as I, a as U, b as Z, T as ee, C as te, m as re } from "./index-BX7-w-Gk.js";
const ne = () => (t) => t.targetX, ie = () => (t) => t.targetY, se = () => (t) => t.targetWidth, ae = () => (t) => t.targetHeight, oe = () => (t) => t.targetY + 10, le = () => (t) => Math.max(0, (t.targetHeight - 28) / 2), de = /* @__PURE__ */ Q("div")({
  name: "DataGridOverlayEditorStyle",
  class: "gdg-d19meir1",
  propsAsIs: !1,
  vars: {
    "d19meir1-0": [ie(), "px"],
    "d19meir1-1": [ne(), "px"],
    "d19meir1-2": [se(), "px"],
    "d19meir1-3": [ae(), "px"],
    "d19meir1-4": [oe(), "px"],
    "d19meir1-5": [le(), "px"]
  }
});
function ue() {
  const [t, s] = r.useState();
  return [t ?? void 0, s];
}
function ce() {
  const [t, s] = ue(), [i, h] = r.useState(0), [f, b] = r.useState(!0);
  r.useLayoutEffect(() => {
    if (t === void 0 || !("IntersectionObserver" in window))
      return;
    const a = new IntersectionObserver((o) => {
      o.length !== 0 && b(o[0].isIntersecting);
    }, { threshold: 1 });
    return a.observe(t), () => a.disconnect();
  }, [t]), r.useEffect(() => {
    if (f || t === void 0)
      return;
    let a;
    const o = () => {
      const { right: x } = t.getBoundingClientRect();
      h((g) => Math.min(g + window.innerWidth - x - 10, 0)), a = requestAnimationFrame(o);
    };
    return a = requestAnimationFrame(o), () => {
      a !== void 0 && cancelAnimationFrame(a);
    };
  }, [t, f]);
  const C = r.useMemo(() => ({ transform: `translateX(${i}px)` }), [i]);
  return {
    ref: s,
    style: C
  };
}
const me = (t) => {
  const { target: s, content: i, onFinishEditing: h, forceEditMode: f, initialValue: b, imageEditorOverride: C, markdownDivCreateNode: a, highlight: o, className: x, theme: g, id: W, cell: m, bloom: w, portalElementRef: F, validateCell: p, getCellRenderer: P, provideEditor: T, isOutsideClick: X, customEventTarget: A, activation: O } = t, [l, K] = r.useState(f ? i : void 0), S = r.useRef(l ?? i);
  S.current = l ?? i;
  const [y, k] = r.useState(() => p === void 0 ? !0 : !(I(i) && p?.(m, i, S.current) === !1)), u = r.useCallback((e, n) => {
    h(y ? e : void 0, n);
  }, [y, h]), Y = r.useCallback((e) => {
    if (p !== void 0 && e !== void 0 && I(e)) {
      const n = p(m, e, S.current);
      n === !1 ? k(!1) : (typeof n == "object" && (e = n), k(!0));
    }
    K(e);
  }, [m, p]), E = r.useRef(!1), c = r.useRef(void 0), j = r.useCallback(() => {
    u(l, [0, 0]), E.current = !0;
  }, [l, u]), L = r.useCallback((e, n) => {
    u(e, n ?? c.current ?? [0, 0]), E.current = !0;
  }, [u]), q = r.useCallback(async (e) => {
    let n = !1;
    e.key === "Escape" ? (e.stopPropagation(), e.preventDefault(), c.current = [0, 0]) : e.key === "Enter" && // The shift key is reserved for multi-line editing
    // to allow inserting new lines without closing the editor.
    !e.shiftKey ? (e.stopPropagation(), e.preventDefault(), c.current = [0, 1], n = !0) : e.key === "Tab" && (e.stopPropagation(), e.preventDefault(), c.current = [e.shiftKey ? -1 : 1, 0], n = !0), window.setTimeout(() => {
      !E.current && c.current !== void 0 && (u(n ? l : void 0, c.current), E.current = !0);
    }, 0);
  }, [u, l]), R = l ?? i, [d, B] = r.useMemo(() => {
    if (U(i))
      return [];
    const e = { ...i, location: m, activation: O }, n = T?.(e);
    return n !== void 0 ? [n, !1] : [P(i)?.provideEditor?.(e), !1];
  }, [m, i, P, T, O]), { ref: $, style: z } = ce();
  let M = !0, _, N = !0, v;
  if (d !== void 0) {
    M = d.disablePadding !== !0, N = d.disableStyling !== !0;
    const e = Z(d);
    e && (v = d.styleOverride);
    const n = e ? d.editor : d;
    _ = r.createElement(n, { portalElementRef: F, isHighlighted: o, activation: O, onChange: Y, value: R, initialValue: b, onFinishedEditing: L, validatedSelection: I(R) ? R.selectionRange : void 0, forceEditMode: f, target: s, imageEditorOverride: C, markdownDivCreateNode: a, isValid: y, theme: g });
  }
  v = { ...v, ...z };
  const V = F?.current ?? document.getElementById("portal");
  if (V === null)
    return console.error('Cannot open Data Grid overlay editor, because portal not found. Please, either provide a portalElementRef or add `<div id="portal" />` as the last child of your `<body>`.'), null;
  let D = N ? "gdg-style" : "gdg-unstyle";
  y || (D += " gdg-invalid"), M && (D += " gdg-pad");
  const G = w?.[0] ?? 1, H = w?.[1] ?? 1;
  return J.createPortal(r.createElement(
    ee.Provider,
    { value: g },
    r.createElement(
      te,
      { style: re(g), className: x, onClickOutside: j, isOutsideClick: X, customEventTarget: A },
      r.createElement(
        de,
        { ref: $, id: W, className: D, style: v, as: B === !0 ? "label" : void 0, targetX: s.x - G, targetY: s.y - H, targetWidth: s.width + G * 2, targetHeight: s.height + H * 2 },
        r.createElement("div", { className: "gdg-clip-region", onKeyDown: q }, _)
      )
    )
  ), V);
};
export {
  me as default
};
//# sourceMappingURL=data-grid-overlay-editor-CBMGAk2m.js.map
