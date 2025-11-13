import { r as c, E as O, _ as X, bn as y, bo as _, s as g, j as o, T as ct, P as Y, c as q, B as G, an as E, u as M, am as pt, ah as ut, bp as gt, h as ht, a4 as ft, as as xt, bq as mt, k as R, bi as yt, bj as Ct } from "./index-COqA-032.js";
import { g as bt, C as It, I as wt, F as V, E as J, a as vt, s as jt, u as zt, b as St } from "./FileHelper-Lmr-robR.js";
import { I as Ft } from "./InputInstructions-BAuMHIgJ.js";
import { u as Ut, T as Et } from "./useTextInputAutoExpand-YvQcBtbJ.js";
import { i as Dt } from "./inputUtils-DCYiajnz.js";
import { E as Tt } from "./ErrorOutline.esm-DMtjQMqW.js";
import { U as Q } from "./UploadFileInfo-B5SttewO.js";
var Z = /* @__PURE__ */ c.forwardRef(function(t, e) {
  var n = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ c.createElement(O, X({
    iconAttrs: n,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, t, {
    ref: e
  }), /* @__PURE__ */ c.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ c.createElement("path", {
    d: "M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
  }));
});
Z.displayName = "AttachFile";
var tt = /* @__PURE__ */ c.forwardRef(function(t, e) {
  var n = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ c.createElement(O, X({
    iconAttrs: n,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, t, {
    ref: e
  }), /* @__PURE__ */ c.createElement("rect", {
    width: 24,
    height: 24,
    fill: "none"
  }), /* @__PURE__ */ c.createElement("path", {
    d: "M3 5.51v3.71c0 .46.31.86.76.97L11 12l-7.24 1.81c-.45.11-.76.51-.76.97v3.71c0 .72.73 1.2 1.39.92l15.42-6.49c.82-.34.82-1.5 0-1.84L4.39 4.58C3.73 4.31 3 4.79 3 5.51z"
  }));
});
tt.displayName = "Send";
const et = (t, e) => e === y.Directory ? {
  ...t,
  webkitdirectory: "",
  multiple: !0
} : t, Bt = (t, e) => {
  if (!e || e.length === 0)
    return !0;
  const n = t.name.toLowerCase(), a = n.lastIndexOf(".");
  if (a === -1 || a === n.length - 1)
    return e.some((x) => x === "" || x === ".");
  const p = n.substring(a), i = n.substring(a + 1);
  return e.some((x) => {
    const C = x.toLowerCase();
    return C.startsWith(".") ? p === C : i === C;
  });
}, Rt = (t, e) => Bt(t, e) ? {
  isValid: !0
} : {
  isValid: !1,
  errorMessage: `${t.type || "This type of"} files are not allowed.`
}, ot = (t) => {
  switch (t) {
    case y.None:
      return "a file";
    case y.Single:
      return "a file";
    case y.Multiple:
      return "files";
    case y.Directory:
      return "a directory";
    default:
      return _(t), "a file";
  }
}, Lt = /* @__PURE__ */ g("div", {
  target: "e3id6jz12"
})(({
  theme: t,
  height: e
}) => ({
  backgroundColor: t.colors.transparent,
  position: "absolute",
  left: 0,
  bottom: 0,
  minHeight: `max(${t.sizes.emptyDropdownHeight}, ${e})`,
  width: "100%",
  zIndex: t.zIndices.priority
}), ""), Ht = /* @__PURE__ */ g("div", {
  target: "e3id6jz11"
})(({
  theme: t,
  height: e
}) => ({
  border: `${t.sizes.borderWidth} solid`,
  borderColor: t.colors.primary,
  borderRadius: t.radii.chatInput,
  backgroundColor: t.colors.secondaryBg,
  color: t.colors.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: e,
  width: "100%",
  fontWeight: t.fontWeights.bold
}), ""), Vt = /* @__PURE__ */ g("div", {
  target: "e3id6jz10"
})(({
  theme: t,
  disabled: e
}) => ({
  display: "flex",
  alignItems: "top",
  height: "100%",
  // Negative margin to offset the parent border width when we align to top
  marginTop: `-${t.sizes.borderWidth}`,
  cursor: e ? "not-allowed" : "auto"
}), ""), Mt = /* @__PURE__ */ g("div", {
  target: "e3id6jz9"
})(({
  disabled: t
}) => ({
  pointerEvents: t ? "none" : "auto"
}), ""), kt = /* @__PURE__ */ g("div", {
  target: "e3id6jz8"
})(({
  theme: t
}) => ({
  // We need to use hard-coded in order to align the divider centered
  // given the height of chat input and divider.
  marginTop: "0.625em",
  marginLeft: t.spacing.sm,
  height: t.spacing.xl,
  width: t.sizes.borderWidth,
  backgroundColor: t.colors.fadedText20
}), ""), Wt = /* @__PURE__ */ g("div", {
  target: "e3id6jz7"
})(({
  theme: t
}) => ({
  left: 0,
  right: 0,
  lineHeight: t.lineHeights.tight,
  paddingLeft: t.spacing.sm,
  paddingRight: t.spacing.sm,
  overflowX: "auto"
}), ""), $t = /* @__PURE__ */ g("div", {
  target: "e3id6jz6"
})({
  name: "zjik7",
  styles: "display:flex"
}), Nt = /* @__PURE__ */ g("div", {
  target: "e3id6jz5"
})({
  name: "ou8xsw",
  styles: "flex:0 0 auto"
}), At = /* @__PURE__ */ g("div", {
  target: "e3id6jz4"
})(({
  theme: t
}) => ({
  display: "flex",
  alignItems: "center",
  padding: t.spacing.sm,
  gap: t.spacing.twoXS
}), ""), Pt = /* @__PURE__ */ g("div", {
  target: "e3id6jz3"
})(({
  theme: t
}) => ({
  color: t.colors.fadedText60
}), ""), Kt = /* @__PURE__ */ g("div", {
  target: "e3id6jz2"
})(({
  theme: t,
  fileStatus: e
}) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: e.type === "uploaded" ? t.colors.bodyText : t.colors.fadedText60
}), ""), Ot = /* @__PURE__ */ g("div", {
  target: "e3id6jz1"
})(({
  theme: t
}) => ({
  marginRight: t.spacing.md,
  color: t.colors.fadedText60
}), ""), Xt = /* @__PURE__ */ g("small", {
  target: "e3id6jz0"
})(({
  theme: t
}) => ({
  display: "flex",
  alignItems: "center",
  maxHeight: t.sizes.smallElementHeight,
  color: t.colors.fadedText60,
  "& :hover": {
    color: t.colors.bodyText
  }
}), ""), _t = ({
  getRootProps: t,
  getInputProps: e,
  acceptFile: n,
  disabled: a,
  theme: p
}) => {
  const i = et(e(), n);
  return /* @__PURE__ */ o.jsxs(Vt, { disabled: a, children: [
    /* @__PURE__ */ o.jsxs(Mt, { "data-testid": "stChatInputFileUploadButton", disabled: a, ...t(), children: [
      /* @__PURE__ */ o.jsx("input", { ...i }),
      /* @__PURE__ */ o.jsx(ct, { content: `Upload or drag and drop ${ot(n)}`, placement: Y.TOP, onMouseEnterDelay: 500, children: /* @__PURE__ */ o.jsx(q, { kind: G.MINIMAL, disabled: a, children: /* @__PURE__ */ o.jsx(E, { content: Z, size: "lg", color: a ? p.colors.fadedText40 : p.colors.fadedText60 }) }) })
    ] }),
    /* @__PURE__ */ o.jsx(kt, {})
  ] });
}, Yt = c.memo(_t), qt = ({
  getRootProps: t,
  getInputProps: e,
  acceptFile: n,
  inputHeight: a
}) => {
  const p = et(e(), n);
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsx(Lt, { height: a, ...t(), children: /* @__PURE__ */ o.jsx("input", { ...p }) }),
    /* @__PURE__ */ o.jsx(Ht, { height: a, children: `Drag and drop ${ot(n)} here` })
  ] });
}, Gt = c.memo(qt);
function Jt({
  children: t,
  content: e
}) {
  const n = M();
  return /* @__PURE__ */ o.jsx(pt, { content: e, placement: Y.TOP, overrides: {
    Body: {
      style: {
        top: `-${n.sizes.minElementHeight}`
      }
    }
  }, children: t });
}
const Qt = ({
  fileInfo: t
}) => {
  const e = M(), {
    type: n
  } = t.status;
  switch (n) {
    case "uploading":
      return /* @__PURE__ */ o.jsx(ut, { "data-testid": "stChatInputFileIconSpinner", size: "lg", margin: "0", padding: "0" });
    case "error":
      return /* @__PURE__ */ o.jsx(Jt, { content: t.status.errorMessage, children: /* @__PURE__ */ o.jsx(E, { color: e.colors.redTextColor, content: Tt, size: "lg" }) });
    case "uploaded":
      return /* @__PURE__ */ o.jsx(E, { content: wt, size: "lg" });
    default:
      return _(n), null;
  }
}, Zt = ({
  fileInfo: t,
  onDelete: e
}) => /* @__PURE__ */ o.jsxs(At, { className: "stChatInputFile", "data-testid": "stChatInputFile", children: [
  /* @__PURE__ */ o.jsx(Pt, { children: /* @__PURE__ */ o.jsx(Qt, { fileInfo: t }) }),
  /* @__PURE__ */ o.jsx(Kt, { className: "stChatInputFileName", "data-testid": "stChatInputFileName", title: t.name, fileStatus: t.status, children: t.name }),
  /* @__PURE__ */ o.jsx(Ot, { children: bt(t.size, V.Byte) }),
  /* @__PURE__ */ o.jsx(Xt, { "data-testid": "stChatInputDeleteBtn", children: /* @__PURE__ */ o.jsx(q, { onClick: () => e(t.id), kind: G.MINIMAL, children: /* @__PURE__ */ o.jsx(E, { content: It, size: "lg" }) }) })
] }), te = c.memo(Zt), ee = ({
  items: t,
  onDelete: e
}) => /* @__PURE__ */ o.jsx(Wt, { "data-testid": "stChatUploadedFiles", children: /* @__PURE__ */ o.jsx($t, { children: t.map((n) => /* @__PURE__ */ o.jsx(Nt, { children: /* @__PURE__ */ o.jsx(te, { fileInfo: n, onDelete: e }) }, n.id)) }) }), oe = c.memo(ee), ne = (t, e) => {
  const n = [], a = [];
  return t.forEach((p) => {
    const i = Rt(p, e.fileType);
    i.isValid ? n.push(p) : a.push({
      file: p,
      errors: [{
        code: J.FileInvalidType,
        message: i.errorMessage || "File type not allowed."
      }]
    });
  }), {
    accepted: n,
    rejected: a
  };
}, re = ({
  acceptMultipleFiles: t,
  acceptDirectoryFiles: e,
  maxFileSize: n,
  uploadClient: a,
  uploadFile: p,
  addFiles: i,
  getNextLocalFileId: x,
  deleteExistingFiles: C,
  onUploadComplete: w,
  element: b
}) => (f, h) => {
  if (e && f.length > 0) {
    const {
      accepted: u,
      rejected: m
    } = ne(f, b);
    f = u, h = [...h, ...m];
  }
  if (!t && f.length === 0 && h.length > 1) {
    const u = h.findIndex(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- TODO: Fix this
      (m) => m.errors?.[0].code === J.TooManyFiles
    );
    u >= 0 && (f.push(h[u].file), h.splice(u, 1));
  }
  if (!t && f.length > 0 && C(), a.fetchFileURLs(f).then((u) => {
    gt(u, f).forEach(([m, v]) => {
      p(m, v);
    });
  }).catch((u) => {
    i(f.map((m) => new Q(m.name, m.size, x(), {
      type: "error",
      errorMessage: u
    })));
  }), h.length > 0) {
    const u = h.map((m) => vt(m, x(), n));
    i(u);
  }
  w();
}, se = ({
  getNextLocalFileId: t,
  addFiles: e,
  updateFile: n,
  uploadClient: a,
  element: p,
  onUploadProgress: i,
  onUploadComplete: x
}) => (C, w) => {
  const b = w.webkitRelativePath || w.name, f = new AbortController(), h = new Q(b, w.size, t(), {
    type: "uploading",
    abortController: f,
    progress: 1
  });
  e([h]), a.uploadFile({
    formId: "",
    // TODO[kajarnec] fix this probably with uploadFile refactoring
    ...p
  }, C.uploadUrl, w, (u) => i(u, h.id), f.signal).then(() => x(h.id, C)).catch((u) => {
    u instanceof DOMException && u.name === "AbortError" || n(h.id, h.setStatus({
      type: "error",
      errorMessage: u ? u.toString() : "Unknown error"
    }));
  });
}, ae = /* @__PURE__ */ g("div", {
  target: "e1d2x3se4"
})({
  name: "1nibcdy",
  styles: "border:none;position:relative;display:flex"
}), ie = /* @__PURE__ */ g("div", {
  target: "e1d2x3se3"
})(({
  theme: t,
  extended: e
}) => ({
  border: `${t.sizes.borderWidth} solid`,
  borderColor: t.colors.widgetBorderColor ?? t.colors.transparent,
  borderRadius: t.radii.chatInput,
  backgroundColor: t.colors.secondaryBg,
  position: "relative",
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  paddingLeft: t.spacing.lg,
  maxHeight: e ? "none" : t.sizes.minElementHeight,
  gap: t.spacing.sm,
  overflow: "hidden",
  ":focus-within": {
    borderColor: t.colors.primary
  }
}), ""), le = /* @__PURE__ */ g("button", {
  target: "e1d2x3se2"
})(({
  theme: t,
  disabled: e,
  extended: n
}) => {
  const a = ht(t), [p, i] = a ? [t.colors.gray60, t.colors.gray80] : [t.colors.gray80, t.colors.gray40];
  return {
    border: "none",
    backgroundColor: t.colors.transparent,
    borderTopRightRadius: n ? "0" : t.radii.chatInput,
    borderTopLeftRadius: n ? t.radii.default : "0",
    borderBottomRightRadius: t.radii.chatInput,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: t.lineHeights.none,
    margin: t.spacing.none,
    padding: t.spacing.sm,
    color: e ? p : i,
    pointerEvents: "auto",
    "&:focus": {
      outline: "none"
    },
    ":focus": {
      outline: "none"
    },
    "&:focus-visible": {
      backgroundColor: a ? t.colors.gray10 : t.colors.gray90
    },
    "&:hover": {
      color: t.colors.primary
    },
    "&:disabled, &:disabled:hover, &:disabled:active": {
      backgroundColor: t.colors.transparent,
      borderColor: t.colors.transparent,
      color: t.colors.gray60,
      cursor: "not-allowed"
    }
  };
}, ""), de = /* @__PURE__ */ g("div", {
  target: "e1d2x3se1"
})(({
  theme: t
}) => ({
  display: "flex",
  alignItems: "flex-end",
  height: "100%",
  position: "absolute",
  right: 0,
  // Negative margin to offset the parent border width when we align button to end
  marginBottom: `-${t.sizes.borderWidth}`,
  pointerEvents: "none"
}), ""), ce = /* @__PURE__ */ g("div", {
  target: "e1d2x3se0"
})(({
  theme: t
}) => ({
  position: "absolute",
  bottom: "0px",
  // Calculate the right padding to account for the send icon (iconSizes.xl + 2 * spacing.sm)
  // and some additional margin between the icon and the text (spacing.sm).
  right: `calc(${t.iconSizes.xl} + 2 * ${t.spacing.sm} + ${t.spacing.sm})`
}), ""), L = (t, e, n) => n.map((a) => a.id === t ? e : a), H = (t, e) => e.find((n) => n.id === t);
function pe({
  disabled: t,
  element: e,
  widgetMgr: n,
  fragmentId: a,
  uploadClient: p
}) {
  const i = M(), {
    placeholder: x,
    maxChars: C
  } = e, w = c.useRef(0), b = c.useRef(null), {
    width: f,
    elementRef: h
  } = ft(), {
    innerWidth: u,
    innerHeight: m
  } = xt(), [v, D] = c.useState(e.default), [z, S] = c.useState([]), [F, T] = c.useState(!1), j = Ut({
    textareaRef: b,
    dependencies: [x]
  }), B = c.useMemo(() => z.some((r) => r.status.type === "uploading") ? !1 : v !== "" || z.length > 0, [z, v]), I = mt(e.acceptFile), k = jt(e.maxUploadSizeMb, V.Megabyte, V.Byte), W = c.useCallback((r) => S((l) => [...l, ...r]), []), $ = c.useCallback((r) => {
    S((l) => {
      const d = H(r, l);
      return R(d) ? l : (d.status.type === "uploading" && d.status.abortController.abort(), d.status.type === "uploaded" && d.status.fileUrls.deleteUrl && p.deleteFile(d.status.fileUrls.deleteUrl), l.filter((s) => s.id !== r));
    });
  }, [p]), nt = () => {
    const r = z.filter((l) => l.status.type === "uploaded").map((l) => {
      const {
        name: d,
        size: s,
        status: U
      } = l, {
        fileId: lt,
        fileUrls: dt
      } = U;
      return new yt({
        fileId: lt,
        fileUrls: dt,
        name: d,
        size: s
      });
    });
    return new Ct({
      uploadedFileInfo: r
    });
  }, N = () => w.current++, rt = re({
    acceptMultipleFiles: I === y.Multiple || I === y.Directory,
    acceptDirectoryFiles: I === y.Directory,
    maxFileSize: k,
    uploadClient: p,
    uploadFile: se({
      getNextLocalFileId: N,
      addFiles: W,
      updateFile: (r, l) => {
        S((d) => L(r, l, d));
      },
      uploadClient: p,
      element: e,
      onUploadProgress: (r, l) => {
        S((d) => {
          const s = H(l, d);
          if (R(s) || s.status.type !== "uploading")
            return d;
          const U = Math.round(r.loaded * 100 / r.total);
          return s.status.progress === U ? d : L(l, s.setStatus({
            type: "uploading",
            abortController: s.status.abortController,
            progress: U
          }), d);
        });
      },
      onUploadComplete: (r, l) => {
        S((d) => {
          const s = H(r, d);
          return R(s) || s.status.type !== "uploading" ? d : L(s.id, s.setStatus({
            type: "uploaded",
            fileId: l.fileId,
            fileUrls: l
          }), d);
        });
      }
    }),
    addFiles: W,
    getNextLocalFileId: N,
    deleteExistingFiles: () => z.forEach((r) => $(r.id)),
    onUploadComplete: () => {
      b.current && b.current.focus();
    },
    element: e
  }), {
    getRootProps: A,
    getInputProps: P
  } = zt({
    onDrop: rt,
    multiple: I === y.Multiple || I === y.Directory,
    accept: St(e.fileType),
    maxSize: k
  }), K = () => {
    if (b.current && b.current.focus(), !B || t)
      return;
    const r = {
      data: v,
      fileUploaderState: nt()
    };
    n.setChatInputValue(e, r, {
      fromUi: !0
    }, a), S([]), D(""), j.clearScrollHeight();
  }, st = (r) => {
    const {
      metaKey: l,
      ctrlKey: d,
      shiftKey: s
    } = r;
    Dt(r) && !s && !d && !l && (r.preventDefault(), K());
  }, at = (r) => {
    const {
      value: l
    } = r.target;
    C !== 0 && l.length > C || (D(l), j.updateScrollHeight());
  };
  c.useEffect(() => {
    if (e.setValue) {
      e.setValue = !1;
      const r = e.value || "";
      D(r);
    }
  }, [e]), c.useEffect(() => {
    const r = (s) => {
      s.preventDefault(), s.stopPropagation(), !F && s.dataTransfer?.types.includes("Files") && T(!0);
    }, l = (s) => {
      s.preventDefault(), s.stopPropagation(), F && (s.clientX <= 0 && s.clientY <= 0 || s.clientX >= u && s.clientY >= m) && T(!1);
    }, d = (s) => {
      s.preventDefault(), s.stopPropagation(), F && T(!1);
    };
    return window.addEventListener("dragover", r), window.addEventListener("drop", d), window.addEventListener("dragleave", l), () => {
      window.removeEventListener("dragover", r), window.removeEventListener("drop", d), window.removeEventListener("dragleave", l);
    };
  }, [F, u, m]);
  const it = I !== y.None && F;
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    I === y.None ? null : /* @__PURE__ */ o.jsx(oe, { items: [...z], onDelete: $ }),
    /* @__PURE__ */ o.jsx(ae, { className: "stChatInput", "data-testid": "stChatInput", ref: h, children: it ? /* @__PURE__ */ o.jsx(Gt, { getRootProps: A, getInputProps: P, acceptFile: I, inputHeight: j.height }) : /* @__PURE__ */ o.jsxs(ie, { extended: j.isExtended, children: [
      I === y.None ? null : /* @__PURE__ */ o.jsx(Yt, { getRootProps: A, getInputProps: P, acceptFile: I, disabled: t, theme: i }),
      /* @__PURE__ */ o.jsx(Et, { inputRef: b, value: v, placeholder: x, onChange: at, onKeyDown: st, "aria-label": x, disabled: t, rows: 1, overrides: {
        Root: {
          style: {
            minHeight: i.sizes.minElementHeight,
            outline: "none",
            borderLeftWidth: "0",
            borderRightWidth: "0",
            borderTopWidth: "0",
            borderBottomWidth: "0",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
            borderBottomLeftRadius: "0"
          }
        },
        Input: {
          props: {
            "data-testid": "stChatInputTextArea"
          },
          style: {
            fontWeight: i.fontWeights.normal,
            lineHeight: i.lineHeights.inputWidget,
            "::placeholder": {
              color: i.colors.fadedText60
            },
            height: j.height,
            maxHeight: j.maxHeight,
            // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
            paddingLeft: i.spacing.none,
            paddingBottom: i.spacing.sm,
            paddingTop: i.spacing.sm,
            // Calculate the right padding to account for the send icon (iconSizes.xl + 2 * spacing.sm)
            // and some additional margin between the icon and the text (spacing.sm).
            paddingRight: `calc(${i.iconSizes.xl} + 2 * ${i.spacing.sm} + ${i.spacing.sm})`
          }
        }
      } }),
      f > i.breakpoints.hideWidgetDetails && /* @__PURE__ */ o.jsx(ce, { children: /* @__PURE__ */ o.jsx(
        Ft,
        {
          dirty: B,
          value: v,
          maxLength: C,
          type: "chat",
          inForm: !1
        }
      ) }),
      /* @__PURE__ */ o.jsx(de, { children: /* @__PURE__ */ o.jsx(le, { onClick: K, disabled: !B || t, extended: j.isExtended, "data-testid": "stChatInputSubmitButton", children: /* @__PURE__ */ o.jsx(E, { content: tt, size: "xl", color: "inherit" }) }) })
    ] }) })
  ] });
}
const Ce = c.memo(pe);
export {
  Ce as default
};
//# sourceMappingURL=index-CE_fnBHU.js.map
