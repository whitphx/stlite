import { r as a, m as i, n } from "./index-COqA-032.js";
class l {
  /**
   * Register the listener that will be called when the widget's form is cleared.
   * This should be called in the `render` function of every class-based widget
   * element - it mimics the behavior of a `useEffect` hook, and ensures that
   * subscription and unsubscription happen correctly.
   *
   * Hooks-based widgets can just use `useEffect` and call
   * `widgetMgr.addFormClearedListener` directly. Or just use the convenient
   * hook `useFormClearHelper`, below.
   */
  manageFormClearListener(r, s, t) {
    n(this.formClearListener) && this.lastWidgetMgr === r && this.lastFormId === s || (this.disconnect(), i(s) && (this.formClearListener = r.addFormClearedListener(s, t), this.lastWidgetMgr = r, this.lastFormId = s));
  }
  /**
   * Disconnect from the form-clear signal, if we're connected.
   * This should be called from the `componentWillUnmount` function of every
   * element that uses it.
   */
  disconnect() {
    this.formClearListener?.disconnect(), this.formClearListener = void 0, this.lastWidgetMgr = void 0, this.lastFormId = void 0;
  }
}
function d({
  element: e,
  widgetMgr: r,
  onFormCleared: s
}) {
  a.useEffect(() => {
    if (!r || !i(e.formId))
      return;
    const t = r.addFormClearedListener(e.formId, s);
    return () => {
      t.disconnect();
    };
  }, [e, r, s]);
}
export {
  l as F,
  d as u
};
//# sourceMappingURL=FormClearHelper-DQ1jkgFN.js.map
