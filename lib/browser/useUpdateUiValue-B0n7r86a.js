import { r as a, a5 as p } from "./index-COqA-032.js";
import { i as b } from "./inputUtils-DCYiajnz.js";
function i({
  formId: r,
  maxChars: s,
  setDirty: n,
  setUiValue: e,
  setValueWithSource: f,
  additionalAction: t
}) {
  return a.useCallback((u) => {
    const {
      value: o
    } = u.target;
    s !== 0 && o.length > s || (n(!0), e(o), p({
      formId: r
    }) && f({
      value: o,
      fromUi: !0
    }), t && t());
  }, [r, s, n, e, f, t]);
}
function F(r, s, n, e, f, t = !1) {
  return a.useCallback((u) => {
    const o = t ? u.metaKey || u.ctrlKey : !0;
    !b(u) || !o || (u.preventDefault(), n && s(), e.allowFormEnterToSubmit(r) && e.submitForm(r, f));
  }, [r, f, n, s, e, t]);
}
function K(r, s, n, e) {
  a.useEffect(() => {
    e || r !== s && n(r);
  }, [r, s, e, n]);
}
export {
  i as a,
  F as b,
  K as u
};
//# sourceMappingURL=useUpdateUiValue-B0n7r86a.js.map
