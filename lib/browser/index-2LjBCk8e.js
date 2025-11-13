import { r, E as J, _ as W, u as G, aN as F, aO as X, k as R, aP as $, aQ as Q, aR as j, aS as L, aT as Y, aU as Z, n as I, aV as M, x as P, aW as K, aX as q, aY as ee, J as te, a4 as ne, av as se, aZ as ae, j as T, a_ as re, a$ as oe, b0 as ce } from "./index-COqA-032.js";
import { w as ie, E as le } from "./withFullScreenWrapper-Bd7ZpoRc.js";
import { a as H, S as _, T as ue } from "./Toolbar-DRAqg1o6.js";
import { R as fe } from "./index-BX7-w-Gk.js";
import { u as de } from "./FormClearHelper-DQ1jkgFN.js";
var U = /* @__PURE__ */ r.forwardRef(function(n, t) {
  var a = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ r.createElement(J, W({
    iconAttrs: a,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, n, {
    ref: t
  }), /* @__PURE__ */ r.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ r.createElement("path", {
    d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"
  }));
});
U.displayName = "InsertChart";
var B = /* @__PURE__ */ r.forwardRef(function(n, t) {
  var a = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ r.createElement(J, W({
    iconAttrs: a,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, n, {
    ref: t
  }), /* @__PURE__ */ r.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ r.createElement("path", {
    d: "M20 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v3H5V5h15zm-5 14h-5v-9h5v9zM5 10h3v9H5v-9zm12 9v-9h3v9h-3z"
  }));
});
B.displayName = "TableChart";
const he = 20;
function me(n) {
  "params" in n && "encoding" in n && n.params.forEach((t) => {
    "select" in t && (["interval", "point"].includes(t.select) && (t.select = {
      type: t.select
    }), "type" in t.select && t.select.type === "point" && !("encodings" in t.select) && R(t.select.encodings) && (t.select.encodings = Object.keys(n.encoding)));
  });
}
const pe = (n, t, a, s, u, i, l, p) => {
  const e = JSON.parse(n);
  if (s === "streamlit" ? e.config = F(e.config, i) : e.usermeta?.embedOptions?.theme === "streamlit" ? (e.config = F(e.config, i), e.usermeta.embedOptions.theme = void 0) : e.config = X(e.config, i), e.title && (typeof e.title == "string" && (e.title = {
    text: e.title
  }), e.title.limit = // Preserve existing limit if it exists,
  e.title.limit ?? // Otherwise, calculate the width - 40px to give some padding, especially
  // for the ... menu button. If the width is less than 40px, we set it to
  // 0 to avoid negative values.
  Math.max(l - 40, 0)), a && (e.height = p), t && (e.width = l, "vconcat" in e && e.vconcat.forEach((d) => {
    d.width = l;
  })), e.padding || (e.padding = {}), R(e.padding.bottom) && (e.padding.bottom = he), e.datasets)
    throw new Error("Datasets should not be passed as part of the spec");
  return u.length > 0 && me(e), e;
}, ge = (n, t, a, s, u) => {
  const i = G(), {
    id: l,
    formId: p,
    spec: e,
    data: d,
    datasets: o,
    vegaLiteTheme: f,
    selectionMode: c
  } = n, g = r.useMemo(() => c, [JSON.stringify(c)]), w = r.useMemo(() => pe(e, s, u, f, g, i, t, a), [e, s, u, f, g, i, t, a]);
  return {
    id: l,
    formId: p,
    vegaLiteTheme: f,
    spec: w,
    selectionMode: g,
    data: d,
    datasets: o,
    useContainerWidth: s
  };
}, Se = {
  DATAFRAME_INDEX: "(index)"
};
function ye(n) {
  return !n || n.dimensions.numDataRows === 0 ? null : A(n);
}
function we(n) {
  const t = D(n);
  if (R(t))
    return null;
  const a = {};
  for (const [s, u] of Object.entries(t))
    a[s] = A(u);
  return a;
}
function D(n) {
  if (n?.length === 0)
    return null;
  const t = {};
  return n.forEach((a) => {
    if (!a)
      return;
    const s = a.hasName ? a.name : null;
    t[s] = a.data;
  }), t;
}
function A(n, t = 0) {
  if (n.dimensions.numDataRows === 0)
    return [];
  const a = [], {
    numDataRows: s,
    numDataColumns: u,
    numIndexColumns: i
  } = n.dimensions, l = n.columnTypes[0] ?? void 0, p = l && l.type === $.INDEX && (Q(l) || j(l) || L(l));
  for (let e = t; e < s; e++) {
    const d = {};
    if (p) {
      const {
        content: o
      } = n.getCell(e, 0);
      d[Se.DATAFRAME_INDEX] = typeof o == "bigint" ? Number(o) : o;
    }
    for (let o = 0; o < u; o++) {
      const f = o + i, {
        content: c,
        contentType: g
      } = n.getCell(e, f);
      if ((c instanceof Date || typeof c == "number" && Number.isFinite(c)) && (j(g) || L(g)) && // Only convert dates without timezone information
      // to utc timezone
      !Y(g)) {
        const w = new Date(c).getTimezoneOffset() * 60 * 1e3;
        d[n.columnNames[0][f]] = c.valueOf() + w;
      } else
        d[n.columnNames[0][f]] = typeof c == "bigint" ? Number(c) : c;
    }
    a.push(d);
  }
  return a;
}
const be = 150, Ce = P.getLogger("useVegaLiteSelections"), Ee = (n, t, a) => {
  const {
    id: s,
    formId: u,
    selectionMode: i
  } = n, l = r.useCallback((e) => {
    i.forEach((o) => {
      e.addSignalListener(o, Z(be, (f, c) => {
        const g = e.getState({
          // There are also `signals` data, but I believe its
          // not relevant for restoring the selection state.
          data: (S, y) => i.some((E) => `${E}_store` === S),
          // Don't include subcontext data since it will lead to exceptions
          // when loading the state.
          recurse: !1
        });
        I(g) && t.setElementState(s, "viewState", g);
        let w = c;
        "vlPoint" in c && "or" in c.vlPoint && (w = c.vlPoint.or);
        const O = {
          id: s,
          formId: u
        }, m = JSON.parse(t.getStringValue(O) || "{}"), h = {
          selection: {
            ...m?.selection || {},
            [f]: w || {}
          }
        };
        M(m, h) || t.setStringValue(O, JSON.stringify(h), {
          fromUi: !0
        }, a);
      }));
    });
    const d = t.getElementState(s, "viewState");
    if (I(d))
      try {
        return e.setState(d);
      } catch (o) {
        Ce.warn("Failed to restore view state", o);
      }
    return e;
  }, [s, i, t, u, a]), p = r.useCallback(() => {
    const e = {
      selection: {}
    };
    i.forEach((c) => {
      e.selection[c] = {};
    });
    const d = {
      id: s,
      formId: u
    }, o = t.getStringValue(d), f = o ? JSON.parse(o) : (
      // If there wasn't any selection yet, the selection state
      // is assumed to be empty.
      e
    );
    M(f, e) || t.setStringValue(d, JSON.stringify(e), {
      fromUi: !0
    }, a);
  }, [s, u, a, i, t]);
  return {
    maybeConfigureSelections: l,
    onFormCleared: p
  };
}, k = "source", Ve = P.getLogger("useVegaEmbed");
function ve(n, t, a) {
  const s = r.useRef(null), u = r.useRef(null), i = r.useRef(k), l = r.useRef(null), p = r.useRef([]), {
    maybeConfigureSelections: e,
    onFormCleared: d
  } = Ee(n, t, a);
  de({
    widgetMgr: t,
    element: n,
    onFormCleared: d
  });
  const {
    data: o,
    datasets: f
  } = n;
  r.useEffect(() => {
    s.current === null && (l.current = o, p.current = f);
  }, [o, f]);
  const c = r.useCallback(() => {
    u.current && u.current(), u.current = null, s.current = null;
  }, []), g = r.useCallback(async (m, h) => {
    if (m.current === null)
      throw new Error("Element missing.");
    c();
    const S = {
      // Adds interpreter support for Vega expressions that is compliant with CSP
      ast: !0,
      expr: q,
      // Disable default styles so that vega doesn't inject <style> tags in the
      // DOM. We set these styles manually for finer control over them and to
      // avoid inlining styles.
      tooltip: {
        disableDefaultStyle: !0
      },
      defaultStyle: !1,
      forceActionsMenu: !0
    }, {
      vgSpec: y,
      view: E,
      finalize: x
    } = await K(m.current, h, S);
    s.current = e(E), u.current = x;
    const b = we(p.current), V = b ? Object.keys(b) : [];
    if (V.length === 1) {
      const [C] = V;
      i.current = C;
    } else V.length === 0 && y.data && (i.current = k);
    const v = ye(l.current);
    if (v && s.current.insert(i.current, v), b)
      for (const [C, N] of Object.entries(b))
        s.current.insert(C, N);
    return await s.current.runAsync(), await s.current.resize().runAsync(), s.current;
  }, [c, e]), w = r.useCallback((m, h, S, y) => {
    if (!y || y.dimensions.numDataRows === 0) {
      try {
        m.remove(h, ee);
      } finally {
      }
      return;
    }
    if (!S || S.dimensions.numDataRows === 0) {
      m.insert(h, A(y));
      return;
    }
    y.hash !== S.hash && (m.data(h, A(y)), Ve.info(`Had to clear the ${h} dataset before inserting data through Vega view.`));
  }, []), O = r.useCallback(async (m, h) => {
    if (s.current === null)
      return null;
    const S = l.current, y = p.current;
    (S || m) && w(s.current, i.current, S, m);
    const E = D(y) ?? {}, x = D(h) ?? {};
    for (const [b, V] of Object.entries(x)) {
      const v = b || i.current, C = E[v];
      w(s.current, v, C, V);
    }
    for (const b of Object.keys(E))
      !Object.hasOwn(x, b) && b !== i.current && w(s.current, b, null, null);
    return await s.current?.resize().runAsync(), l.current = m, p.current = h, s.current;
  }, [w]);
  return {
    createView: g,
    updateView: O,
    finalizeView: c
  };
}
function xe(n) {
  try {
    const t = typeof n == "string" ? JSON.parse(n) : n;
    return !!(t.facet || // TODO (lawilby): do some tests for row/column
    // shorthand facet charts to confirm they work with
    // sizing in the same way.
    t.encoding?.row || t.encoding?.column || t.encoding?.facet);
  } catch {
    return !1;
  }
}
const Ne = ({
  disableFullscreenMode: n,
  element: t,
  fragmentId: a,
  widgetMgr: s,
  widthConfig: u,
  heightConfig: i
}) => {
  const [l, p] = r.useState(!1), [e, d] = r.useState(!1), {
    expanded: o,
    height: f,
    width: c,
    expand: g,
    collapse: w
  } = te(le), {
    width: O,
    height: m,
    elementRef: h
  } = ne(
    // We need to update whenever the showData state changes because
    // the underlying element ref that needs to be observed is updated.
    [l],
    // Use 0 as fallback instead of -1 because Vega-Lite cannot handle negative dimensions
    0
  ), S = se(u) || t.useContainerWidth, y = ae(i), E = xe(t.spec), x = ge(
    t,
    // Facet charts enter a loop when using the width/height from the StyledVegaLiteChartContainer.
    E ? c ?? 0 : O,
    (o ? f : m) ?? 0,
    o ? !0 : S,
    o ? !0 : y
  ), {
    createView: b,
    updateView: V,
    finalizeView: v
  } = ve(x, s, a), {
    data: C,
    datasets: N,
    spec: z
  } = x;
  return r.useLayoutEffect(() => (h.current !== null && b(h, z), v), [b, v, z, c, f, l, h]), r.useEffect(() => {
    V(C, N);
  }, [C, N, V]), r.useEffect(() => {
    C || N?.[0]?.data ? d(!0) : d(!1);
  }, [C, N]), l ? /* @__PURE__ */ T.jsx(fe, { data: C ?? N[0]?.data, height: f ?? m ?? void 0, customToolbarActions: [/* @__PURE__ */ T.jsx(H, { label: "Show chart", icon: U, onClick: () => {
    p(!1);
  } }, "show-chart")] }) : /* @__PURE__ */ T.jsxs(_, { height: y ? o ? f : "100%" : f, useContainerWidth: o ? !0 : S, children: [
    /* @__PURE__ */ T.jsx(ue, { target: _, isFullScreen: o, onExpand: g, onCollapse: w, disableFullscreenMode: n, children: e && /* @__PURE__ */ T.jsx(H, { label: "Show data", icon: B, onClick: () => {
      p(!0);
    } }) }),
    /* @__PURE__ */ T.jsx(re, { styles: oe }),
    /* @__PURE__ */ T.jsx(ce, { "data-testid": "stVegaLiteChart", className: "stVegaLiteChart", useContainerWidth: S, useContainerHeight: y, ref: h })
  ] });
}, Te = ie(Ne), Fe = r.memo(Te);
export {
  oe as StyledVegaLiteChartTooltips,
  F as applyStreamlitTheme,
  Fe as default
};
//# sourceMappingURL=index-2LjBCk8e.js.map
