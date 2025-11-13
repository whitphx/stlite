import { s as C, r as n, u as W, M as I, N as O, O as V, j as r, W as j, l as H, Q as L, T as N, P, R as E, X as B, Y as F, Z as $ } from "./index-COqA-032.js";
import { u as k } from "./useBasicWidgetState-Hu_BQk7V.js";
const A = /* @__PURE__ */ C("div", {
  target: "e6zijwc0"
})(({
  theme: o
}) => ({
  "span[aria-disabled='true']": {
    background: o.colors.fadedText05
  }
}), ""), D = (o, t) => o.getStringArrayValue(t), U = (o) => o.default.map((t) => o.options[t]) ?? null, Y = (o) => o.rawValues ?? null, K = (o, t, a, l) => {
  t.setStringArrayValue(o, a.value, {
    fromUi: a.fromUi
  }, l);
}, X = (o) => {
  const {
    element: t,
    widgetMgr: a,
    fragmentId: l
  } = o, e = W(), S = n.useContext(I), [i, d] = k({
    getStateFromWidgetMgr: D,
    getDefaultStateFromProto: U,
    getCurrStateFromProto: Y,
    updateWidgetMgrState: K,
    element: t,
    widgetMgr: a,
    fragmentId: l
  }), p = t.maxSelections > 0 && i.length >= t.maxSelections, f = n.useMemo(() => {
    if (t.maxSelections === 0)
      return "No results";
    if (i.length === t.maxSelections) {
      const s = t.maxSelections !== 1 ? "options" : "option";
      return `You can only select up to ${t.maxSelections} ${s}. Remove an option first.`;
    }
    return "No results";
  }, [t.maxSelections, i.length]), u = n.useCallback((s) => {
    switch (s.type) {
      case "remove":
        return O(i, s.option?.value);
      case "clear":
        return [];
      case "select":
        return i.concat([s.option?.value]);
      default:
        throw new Error(`State transition is unknown: ${s.type}`);
    }
  }, [i]), b = n.useCallback((s) => {
    t.maxSelections && s.type === "select" && i.length >= t.maxSelections || d({
      value: u(s),
      fromUi: !0
    });
  }, [t.maxSelections, u, d, i.length]), {
    options: x
  } = t, {
    placeholder: y,
    disabled: v,
    selectOptions: z,
    inputReadOnly: w,
    valuesToUiMulti: g,
    createFilterOptions: m
  } = V({
    options: x,
    isMulti: !0,
    acceptNewOptions: t.acceptNewOptions ?? !1,
    placeholderInput: t.placeholder
  }), M = n.useCallback((s, h) => p ? [] : m(i)(s, h), [m, p, i]), c = o.disabled || v, T = n.useMemo(() => g(i), [g, i]), R = n.useMemo(() => {
    const s = e.fontSizes.baseFontSize * 1.6 + 14;
    return `${Math.round(s * 4.25)}px`;
  }, [e.fontSizes.baseFontSize]);
  return /* @__PURE__ */ r.jsxs("div", { className: "stMultiSelect", "data-testid": "stMultiSelect", children: [
    /* @__PURE__ */ r.jsx(j, { label: t.label, disabled: c, labelVisibility: H(t.labelVisibility?.value), children: t.help && /* @__PURE__ */ r.jsx(L, { children: /* @__PURE__ */ r.jsx(N, { content: t.help, placement: P.TOP_RIGHT }) }) }),
    /* @__PURE__ */ r.jsx(A, { children: /* @__PURE__ */ r.jsx(E, { creatable: t.acceptNewOptions ?? !1, options: z, labelKey: "label", valueKey: "value", "aria-label": t.label, placeholder: y, type: $.select, multi: !0, onChange: b, value: T, disabled: c, size: "compact", noResultsMsg: f, filterOptions: M, closeOnSelect: !1, ignoreCase: !1, overrides: {
      Popover: {
        props: {
          ignoreBoundary: S,
          overrides: {
            Body: {
              style: () => ({
                marginTop: e.spacing.px
              })
            }
          }
        }
      },
      SelectArrow: {
        component: F,
        props: {
          style: {
            cursor: "pointer"
          },
          overrides: {
            Svg: {
              style: () => ({
                width: e.iconSizes.xl,
                height: e.iconSizes.xl
              })
            }
          }
        }
      },
      IconsContainer: {
        style: () => ({
          paddingRight: e.spacing.sm
        })
      },
      ControlContainer: {
        style: {
          maxHeight: R,
          minHeight: e.sizes.minElementHeight,
          // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
          borderLeftWidth: e.sizes.borderWidth,
          borderRightWidth: e.sizes.borderWidth,
          borderTopWidth: e.sizes.borderWidth,
          borderBottomWidth: e.sizes.borderWidth
        }
      },
      Placeholder: {
        style: () => ({
          flex: "inherit",
          color: c ? e.colors.fadedText40 : e.colors.fadedText60
        })
      },
      ValueContainer: {
        style: () => ({
          overflowY: "auto",
          paddingLeft: e.spacing.sm,
          paddingTop: e.spacing.none,
          paddingBottom: e.spacing.none,
          paddingRight: e.spacing.none
        })
      },
      ClearIcon: {
        props: {
          overrides: {
            Svg: {
              style: {
                color: e.colors.grayTextColor,
                // setting this width and height makes the clear-icon align with dropdown arrows of other input fields
                padding: e.spacing.threeXS,
                height: e.sizes.clearIconSize,
                width: e.sizes.clearIconSize,
                cursor: "pointer",
                ":hover": {
                  fill: e.colors.bodyText
                }
              }
            }
          }
        }
      },
      SearchIcon: {
        style: {
          color: e.colors.grayTextColor
        }
      },
      Tag: {
        props: {
          overrides: {
            Root: {
              style: {
                fontWeight: e.fontWeights.normal,
                borderTopLeftRadius: e.radii.md,
                borderTopRightRadius: e.radii.md,
                borderBottomRightRadius: e.radii.md,
                borderBottomLeftRadius: e.radii.md,
                fontSize: e.fontSizes.md,
                paddingLeft: e.spacing.sm,
                marginLeft: e.spacing.none,
                marginRight: e.spacing.sm,
                // The tag height is derived from the minElementHeight
                // minus a top and bottom padding (2 * spacing.xs)
                // to nicely fit into the input field.
                height: `calc(${e.sizes.minElementHeight} - 2 * ${e.spacing.xs})`,
                maxWidth: `calc(100% - ${e.spacing.lg})`,
                // Using !important because the alternative would be
                // uglier: we'd have to put it under a selector like
                // "&[role="button"]:not(:disabled)" in order to win in
                // the order of the precedence.
                cursor: "default !important"
              }
            },
            Action: {
              style: {
                paddingLeft: 0
              }
            },
            ActionIcon: {
              props: {
                overrides: {
                  Svg: {
                    style: {
                      // The action icon should be around 0.625% of the parent font size.
                      width: "0.625em",
                      height: "0.625em"
                    }
                  }
                }
              }
            }
          }
        }
      },
      MultiValue: {
        props: {
          overrides: {
            Root: {
              style: {
                fontSize: e.fontSizes.sm
              }
            }
          }
        }
      },
      Input: {
        props: {
          readOnly: w
        }
      },
      Dropdown: {
        component: B
      }
    } }) })
  ] });
}, Q = n.memo(X);
export {
  Q as default
};
//# sourceMappingURL=index-BwLz_JKG.js.map
