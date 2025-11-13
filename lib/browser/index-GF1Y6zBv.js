import { r, E as q, _ as M, s as D, aD as x, k as h, n as Q, x as pe, u as fe, a4 as me, a5 as be, aE as _, j as i, W as ge, l as he, Q as ye, T as Ie, P as xe, y as Te, an as X } from "./index-COqA-032.js";
import { u as Ce } from "./uniqueId-C5LNXL4K.js";
import { I as we } from "./InputInstructions-BAuMHIgJ.js";
import { u as Se } from "./FormClearHelper-DQ1jkgFN.js";
import { s as ve } from "./sprintf-D5E86llw.js";
import { I as Ve } from "./input-BCJbpYBC.js";
var J = /* @__PURE__ */ r.forwardRef(function(e, t) {
  var a = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ r.createElement(q, M({
    iconAttrs: a,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 8 8"
  }, e, {
    ref: t
  }), /* @__PURE__ */ r.createElement("path", {
    d: "M0 3v2h8V3H0z"
  }));
});
J.displayName = "Minus";
var Y = /* @__PURE__ */ r.forwardRef(function(e, t) {
  var a = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ r.createElement(q, M({
    iconAttrs: a,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 8 8"
  }, e, {
    ref: t
  }), /* @__PURE__ */ r.createElement("path", {
    d: "M3 0v3H0v2h3v3h2V5h3V3H5V0H3z"
  }));
});
Y.displayName = "Plus";
const ke = /* @__PURE__ */ D("div", {
  target: "e116k4er3"
})(({
  theme: e
}) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  height: e.sizes.minElementHeight,
  // Mimic the baseweb's borders here, so we can apply the focus style
  // to the entire container and not only the input itself
  borderWidth: e.sizes.borderWidth,
  borderStyle: "solid",
  borderColor: e.colors.widgetBorderColor ?? e.colors.secondaryBg,
  transitionDuration: "200ms",
  transitionProperty: "border",
  transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.4, 1)",
  borderRadius: e.radii.default,
  overflow: "hidden",
  // Fix rounded corner being overlaid with corner of internal input.
  "&.focused": {
    borderColor: e.colors.primary
  },
  input: {
    MozAppearance: "textfield",
    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: e.spacing.none
    }
  }
}), ""), Ee = /* @__PURE__ */ D("div", {
  target: "e116k4er2"
})({
  name: "76z9jo",
  styles: "display:flex;flex-direction:row;align-self:stretch"
}), G = /* @__PURE__ */ D("button", {
  target: "e116k4er1"
})(({
  theme: e
}) => ({
  margin: e.spacing.none,
  border: "none",
  height: e.sizes.full,
  display: "flex",
  alignItems: "center",
  width: e.sizes.numberInputControlsWidth,
  justifyContent: "center",
  color: e.colors.bodyText,
  transition: "color 300ms, backgroundColor 300ms",
  backgroundColor: e.colors.secondaryBg,
  "&:hover:enabled, &:focus:enabled": {
    color: e.colors.white,
    backgroundColor: e.colors.primary,
    transition: "none",
    outline: "none"
  },
  "&:active": {
    outline: "none",
    border: "none"
  },
  "&:disabled": {
    cursor: "not-allowed",
    color: e.colors.fadedText40
  }
}), ""), De = /* @__PURE__ */ D("div", {
  target: "e116k4er0"
})(({
  theme: e,
  clearable: t
}) => ({
  position: "absolute",
  marginRight: e.spacing.twoXS,
  left: 0,
  // The instructions should be placed after the two controls
  // and the clear button if it's present.
  right: `calc(${e.sizes.numberInputControlsWidth} * 2 + ${t ? "1em" : "0em"})`
}), ""), Re = pe.getLogger("NumberInput");
function Ne(e) {
  return h(e) || e === "" ? void 0 : e;
}
const E = ({
  value: e,
  format: t,
  step: a,
  dataType: m
}) => {
  if (h(e))
    return null;
  let o = Ne(t);
  if (h(o) && Q(a)) {
    const l = a.toString();
    m === x.DataType.FLOAT && a !== 0 && l.includes(".") && (o = `%0.${l.split(".")[1].length}f`);
  }
  if (h(o))
    return e.toString();
  try {
    return ve.sprintf(o, e);
  } catch (l) {
    return Re.warn(`Error in sprintf(${o}, ${e}): ${l}`), String(e);
  }
}, ze = (e, t, a) => h(e) ? !1 : e - t >= a, Fe = (e, t, a) => h(e) ? !1 : e + t <= a, je = (e) => (e.element.dataType === x.DataType.INT ? e.widgetMgr.getIntValue(e.element) : e.widgetMgr.getDoubleValue(e.element)) ?? e.element.default ?? null, K = ({
  step: e,
  dataType: t
}) => e || (t === x.DataType.INT ? 1 : 0.01), We = ({
  disabled: e,
  element: t,
  widgetMgr: a,
  fragmentId: m
}) => {
  const o = fe(), {
    dataType: l,
    id: S,
    formId: f,
    default: j,
    format: b,
    icon: R,
    min: y,
    max: I
  } = t, {
    width: W,
    elementRef: Z
  } = me(), [s, ee] = r.useState(() => K(t)), L = je({
    element: t,
    widgetMgr: a
  }), [g, T] = r.useState(!1), [c, C] = r.useState(L), [B, P] = r.useState(!1), v = r.useRef(null), U = r.useRef(Ce("number_input_")), [H, w] = r.useState(() => E({
    value: L,
    dataType: l,
    format: b,
    step: s
  })), V = ze(c, s, y), k = Fe(c, s, I), A = be({
    formId: f
  }), te = A ? a.allowFormEnterToSubmit(f) : g, oe = B && W > o.breakpoints.hideWidgetDetails;
  r.useEffect(() => {
    ee(K({
      step: t.step,
      dataType: t.dataType
    }));
  }, [t.dataType, t.step]), r.useEffect(() => {
    g || w(E({
      value: c,
      dataType: l,
      format: b,
      step: s
    }));
  }, [l, b, s]);
  const d = r.useCallback(({
    value: n,
    source: u
  }) => {
    if (Q(n) && (y > n || n > I))
      v.current?.reportValidity();
    else {
      const p = n ?? j ?? null;
      switch (l) {
        case x.DataType.INT:
          a.setIntValue({
            id: S,
            formId: f
          }, p, u, m);
          break;
        case x.DataType.FLOAT:
          a.setDoubleValue({
            id: S,
            formId: f
          }, p, u, m);
          break;
        default:
          throw new Error("Invalid data type");
      }
      T(!1), C(p), w(E({
        value: p,
        dataType: l,
        format: b,
        step: s
      }));
    }
  }, [y, I, v, a, m, s, l, S, f, j, b]), re = r.useCallback(() => {
    g && d({
      value: c,
      source: {
        fromUi: !0
      }
    }), P(!1);
  }, [g, c, d]), ne = r.useCallback(() => {
    P(!0);
  }, []), O = r.useCallback(() => {
    const {
      value: n
    } = t;
    t.setValue = !1, C(n ?? null), w(E({
      value: n ?? null,
      dataType: l,
      format: b,
      step: s
    })), d({
      value: n ?? null,
      source: {
        fromUi: !1
      }
    });
  }, [t, s, d, l, b]);
  r.useEffect(() => {
    t.setValue ? O() : d({
      value: c,
      source: {
        fromUi: !1
      }
    });
    const n = v.current;
    if (n) {
      const u = (p) => {
        p.preventDefault();
      };
      return n.addEventListener("wheel", u), () => {
        n.removeEventListener("wheel", u);
      };
    }
  }, []), t.setValue && O();
  const N = h(t.default) && !e, ae = r.useCallback(() => {
    const n = t.default ?? null;
    C(n), d({
      value: n,
      source: {
        fromUi: !0
      }
    });
  }, [t]);
  Se({
    element: t,
    widgetMgr: a,
    onFormCleared: ae
  });
  const se = (n) => {
    const {
      value: u
    } = n.target;
    if (u === "")
      T(!0), C(null), w(null);
    else {
      let p;
      t.dataType === x.DataType.INT ? p = parseInt(u, 10) : p = parseFloat(u), T(!0), C(p), w(u);
    }
  }, z = r.useCallback(() => {
    k && (T(!0), d({
      value: (c ?? y) + s,
      source: {
        fromUi: !0
      }
    }));
  }, [c, y, s, k]), F = r.useCallback(() => {
    V && (T(!0), d({
      value: (c ?? I) - s,
      source: {
        fromUi: !0
      }
    }));
  }, [c, I, s, V]), ie = r.useCallback((n) => {
    const {
      key: u
    } = n;
    switch (u) {
      case "ArrowUp":
        n.preventDefault(), z();
        break;
      case "ArrowDown":
        n.preventDefault(), F();
        break;
    }
  }, [z, F]), le = r.useCallback((n) => {
    n.key === "Enter" && (g && d({
      value: c,
      source: {
        fromUi: !0
      }
    }), a.allowFormEnterToSubmit(f) && a.submitForm(f, m));
  }, [g, c, d, a, f, m]), $ = R?.startsWith(":material"), ce = $ ? "lg" : "base", ue = (
    // Account for icon size + its left/right padding
    _(o.iconSizes.lg) + 2 * _(o.spacing.twoXS)
  ), de = R ? o.breakpoints.hideNumberInputControls + ue : o.breakpoints.hideNumberInputControls;
  return /* @__PURE__ */ i.jsxs("div", { className: "stNumberInput", "data-testid": "stNumberInput", ref: Z, children: [
    /* @__PURE__ */ i.jsx(ge, { label: t.label, disabled: e, labelVisibility: he(t.labelVisibility?.value), htmlFor: U.current, children: t.help && /* @__PURE__ */ i.jsx(ye, { children: /* @__PURE__ */ i.jsx(Ie, { content: t.help, placement: xe.TOP_RIGHT }) }) }),
    /* @__PURE__ */ i.jsxs(ke, { className: B ? "focused" : "", "data-testid": "stNumberInputContainer", children: [
      /* @__PURE__ */ i.jsx(Ve, { type: "number", inputRef: v, value: H ?? "", placeholder: t.placeholder, onBlur: re, onFocus: ne, onChange: se, onKeyPress: le, onKeyDown: ie, clearable: N, clearOnEscape: N, disabled: e, "aria-label": t.label, startEnhancer: t.icon && /* @__PURE__ */ i.jsx(Te, { "data-testid": "stNumberInputIcon", iconValue: t.icon, size: ce }), id: U.current, overrides: {
        ClearIconContainer: {
          style: {
            padding: 0
          }
        },
        ClearIcon: {
          props: {
            overrides: {
              Svg: {
                style: {
                  color: o.colors.grayTextColor,
                  // setting this width and height makes the clear-icon align with dropdown arrows of other input fields
                  padding: o.spacing.threeXS,
                  height: o.sizes.clearIconSize,
                  width: o.sizes.clearIconSize,
                  ":hover": {
                    fill: o.colors.bodyText
                  }
                }
              }
            }
          }
        },
        Input: {
          props: {
            "data-testid": "stNumberInputField",
            step: s,
            min: y,
            max: I,
            // We specify the type as "number" to have numeric keyboard on mobile devices.
            // We also set inputMode to "" since by default BaseWeb sets "text",
            // and for "decimal" / "numeric" IOS shows keyboard without a minus sign.
            type: "number",
            inputMode: ""
          },
          style: {
            fontWeight: o.fontWeights.normal,
            lineHeight: o.lineHeights.inputWidget,
            // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
            paddingRight: o.spacing.sm,
            paddingLeft: o.spacing.md,
            paddingBottom: o.spacing.sm,
            paddingTop: o.spacing.sm,
            "::placeholder": {
              color: o.colors.fadedText60
            }
          }
        },
        InputContainer: {
          style: () => ({
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          })
        },
        Root: {
          style: {
            // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            paddingRight: 0,
            paddingLeft: R ? o.spacing.sm : 0
          }
        },
        StartEnhancer: {
          style: {
            paddingLeft: 0,
            paddingRight: 0,
            // Keeps emoji icons from being cut off on the right
            minWidth: o.iconSizes.lg,
            // Material icons color changed as inactionable
            color: $ ? o.colors.fadedText60 : "inherit"
          }
        }
      } }),
      W > de && /* @__PURE__ */ i.jsxs(Ee, { children: [
        /* @__PURE__ */ i.jsx(G, { "data-testid": "stNumberInputStepDown", onClick: F, disabled: !V || e, tabIndex: -1, children: /* @__PURE__ */ i.jsx(X, { content: J, size: "xs", color: V ? "inherit" : o.colors.fadedText40 }) }),
        /* @__PURE__ */ i.jsx(G, { "data-testid": "stNumberInputStepUp", onClick: z, disabled: !k || e, tabIndex: -1, children: /* @__PURE__ */ i.jsx(X, { content: Y, size: "xs", color: k ? "inherit" : o.colors.fadedText40 }) })
      ] })
    ] }),
    oe && /* @__PURE__ */ i.jsx(De, { clearable: N, children: /* @__PURE__ */ i.jsx(we, { dirty: g, value: H ?? "", inForm: A, allowEnterToSubmit: te }) })
  ] });
}, Oe = r.memo(We);
export {
  Oe as default
};
//# sourceMappingURL=index-GF1Y6zBv.js.map
