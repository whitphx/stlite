import { r as c, E as y, _ as S, s as p, aE as $, j as o, an as f, c as x, d as X, B as w, at as O, bh as _, aV as q, bp as G, k as h, a8 as m, bi as K, bj as Q, W as Y, l as J, Q as Z, T as ee, P as te } from "./index-COqA-032.js";
import { F as se } from "./FormClearHelper-DQ1jkgFN.js";
import { g as v, F, D as ie, b as le, I as oe, C as ne, a as ae, s as re } from "./FileHelper-Lmr-robR.js";
import { P as de, S as ce } from "./ProgressBar-Cuz7rhdP.js";
import { u as pe } from "./Hooks-Bcapndp5.js";
import { U } from "./UploadFileInfo-B5SttewO.js";
var z = /* @__PURE__ */ c.forwardRef(function(e, i) {
  var t = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ c.createElement(y, S({
    iconAttrs: t,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, e, {
    ref: i
  }), /* @__PURE__ */ c.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ c.createElement("path", {
    d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"
  }));
});
z.displayName = "ChevronLeft";
var I = /* @__PURE__ */ c.forwardRef(function(e, i) {
  var t = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ c.createElement(y, S({
    iconAttrs: t,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, e, {
    ref: i
  }), /* @__PURE__ */ c.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ c.createElement("path", {
    d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"
  }));
});
I.displayName = "ChevronRight";
var C = /* @__PURE__ */ c.forwardRef(function(e, i) {
  var t = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ c.createElement(y, S({
    iconAttrs: t,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, e, {
    ref: i
  }), /* @__PURE__ */ c.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }), /* @__PURE__ */ c.createElement("path", {
    d: "M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95A5.469 5.469 0 0112 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11A2.98 2.98 0 0122 15c0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z"
  }));
});
C.displayName = "CloudUpload";
var j = /* @__PURE__ */ c.forwardRef(function(e, i) {
  var t = {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  };
  return /* @__PURE__ */ c.createElement(y, S({
    iconAttrs: t,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 24 24"
  }, e, {
    ref: i
  }), /* @__PURE__ */ c.createElement("path", {
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
  }));
});
j.displayName = "Error";
const M = /* @__PURE__ */ p("section", {
  target: "e1b2p2ww17"
})(({
  isDisabled: e,
  theme: i
}) => ({
  display: "flex",
  gap: i.spacing.lg,
  alignItems: "center",
  padding: i.spacing.lg,
  backgroundColor: i.colors.secondaryBg,
  borderRadius: i.radii.default,
  border: i.colors.widgetBorderColor ? `${i.sizes.borderWidth} solid ${i.colors.widgetBorderColor}` : void 0,
  height: i.sizes.largestElementHeight,
  ":focus": {
    outline: "none"
  },
  ":focus-visible": {
    boxShadow: `0 0 0 1px ${i.colors.primary}`
  },
  cursor: e ? "not-allowed" : "pointer"
}), ""), ge = /* @__PURE__ */ p("div", {
  target: "e1b2p2ww16"
})(({
  theme: e
}) => ({
  marginRight: "auto",
  alignItems: "center",
  display: "flex",
  gap: e.spacing.lg,
  // Ensure flex children can shrink and allow text truncation
  minWidth: 0,
  width: "100%"
}), ""), B = /* @__PURE__ */ p("span", {
  target: "e1b2p2ww15"
})(({
  theme: e
}) => ({
  color: e.colors.darkenedBgMix100
}), ""), V = /* @__PURE__ */ p("span", {
  target: "e1b2p2ww14"
})(({
  theme: e,
  disabled: i
}) => ({
  color: i ? e.colors.fadedText40 : e.colors.bodyText
}), ""), ue = /* @__PURE__ */ p("span", {
  target: "e1b2p2ww13"
})(({
  theme: e,
  disabled: i
}) => ({
  fontSize: e.fontSizes.sm,
  color: i ? e.colors.fadedText40 : e.colors.fadedText60,
  // Ellipsis requires a block formatting context and constrained width
  display: "block",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  maxWidth: "100%"
}), ""), he = /* @__PURE__ */ p("div", {
  target: "e1b2p2ww12"
})({
  name: "1s8jot1",
  styles: "display:flex;flex-direction:column;min-width:0;max-width:100%"
}), fe = /* @__PURE__ */ p("span", {
  target: "e1b2p2ww11"
})({
  name: "1bmnxg7",
  styles: "white-space:nowrap"
}), D = /* @__PURE__ */ p("div", {
  target: "e1b2p2ww10"
})(({
  theme: e
}) => ({
  left: 0,
  right: 0,
  lineHeight: e.lineHeights.tight,
  paddingTop: e.spacing.md,
  paddingLeft: e.spacing.lg,
  paddingRight: e.spacing.lg
}), ""), me = /* @__PURE__ */ p("ul", {
  target: "e1b2p2ww9"
})(({
  theme: e
}) => ({
  listStyleType: "none",
  margin: e.spacing.none,
  padding: e.spacing.none
}), ""), E = /* @__PURE__ */ p("li", {
  target: "e1b2p2ww8"
})(({
  theme: e
}) => ({
  margin: e.spacing.none,
  padding: e.spacing.none
}), ""), L = /* @__PURE__ */ p("div", {
  target: "e1b2p2ww7"
})(({
  theme: e
}) => ({
  display: "flex",
  alignItems: "baseline",
  flex: 1,
  paddingLeft: e.spacing.lg,
  overflow: "hidden"
}), ""), P = /* @__PURE__ */ p("div", {
  target: "e1b2p2ww6"
})(({
  theme: e,
  disabled: i
}) => ({
  marginRight: e.spacing.sm,
  marginBottom: e.spacing.twoXS,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: i ? e.colors.fadedText40 : e.colors.bodyText
}), ""), T = /* @__PURE__ */ p("div", {
  target: "e1b2p2ww5"
})(({
  theme: e
}) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: e.spacing.twoXS
}), ""), xe = /* @__PURE__ */ p("span", {
  target: "e1b2p2ww4"
})(({
  theme: e
}) => ({
  marginRight: e.spacing.twoXS
}), ""), we = /* @__PURE__ */ p("div", {
  target: "e1b2p2ww3"
})(({
  theme: e,
  disabled: i
}) => ({
  display: "flex",
  padding: e.spacing.twoXS,
  color: i ? e.colors.fadedText40 : e.colors.darkenedBgMix100
}), ""), A = /* @__PURE__ */ p("small", {
  target: "e1b2p2ww2"
})(({
  theme: e
}) => ({
  color: e.colors.redTextColor,
  fontSize: e.fontSizes.sm,
  height: e.fontSizes.sm,
  lineHeight: e.fontSizes.sm,
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap"
}), ""), W = /* @__PURE__ */ p("span", {
  target: "e1b2p2ww1"
})({
  name: "0",
  styles: ""
}), Fe = (e) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [M]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    height: "auto",
    gap: e.spacing.sm
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [B]: {
    display: "none"
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [V]: {
    marginBottom: e.spacing.twoXS
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [D]: {
    paddingRight: e.spacing.lg
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [T]: {
    maxWidth: "inherit",
    flex: 1,
    alignItems: "flex-start",
    marginBottom: e.spacing.sm
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [P]: {
    width: e.sizes.full
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [L]: {
    flexDirection: "column"
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [A]: {
    height: "auto",
    whiteSpace: "initial"
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [W]: {
    display: "none"
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Replace 'any' with a more specific type.
  [E]: {
    margin: e.spacing.none,
    padding: e.spacing.none
  }
}), ye = /* @__PURE__ */ p("div", {
  target: "e1b2p2ww0"
})(({
  theme: e,
  width: i
}) => {
  if (i < $("23rem"))
    return Fe(e);
}, ""), Se = ({
  multiple: e,
  acceptedExtensions: i,
  maxSizeBytes: t,
  acceptDirectory: s = !1,
  disabled: l
}) => {
  const n = () => s ? "directories" : e ? "files" : "file", a = () => i.length ? ` • ${i.map((d) => d.replace(/^\./, "").toUpperCase()).join(", ")}` : null, r = () => `Limit ${v(t, F.Byte, 0)} per file`;
  return /* @__PURE__ */ o.jsxs(ge, { "data-testid": "stFileUploaderDropzoneInstructions", children: [
    /* @__PURE__ */ o.jsx(B, { children: /* @__PURE__ */ o.jsx(f, { content: C, size: "threeXL" }) }),
    /* @__PURE__ */ o.jsxs(he, { children: [
      /* @__PURE__ */ o.jsxs(V, { disabled: l, children: [
        "Drag and drop ",
        n(),
        " here"
      ] }),
      /* @__PURE__ */ o.jsxs(ue, { disabled: l, children: [
        r(),
        a()
      ] })
    ] })
  ] });
}, Ue = c.memo(Se), be = ({
  onDrop: e,
  multiple: i,
  acceptedExtensions: t,
  maxSizeBytes: s,
  disabled: l,
  label: n,
  acceptDirectory: a = !1
}) => /* @__PURE__ */ o.jsx(
  ie,
  {
    onDrop: e,
    multiple: i,
    accept: le(t),
    maxSize: s,
    disabled: l,
    useFsAccessApi: !1,
    children: ({
      getRootProps: r,
      getInputProps: d
    }) => {
      const g = d({
        multiple: i || !!a
      });
      return /* @__PURE__ */ o.jsxs(M, { ...r(), "data-testid": "stFileUploaderDropzone", isDisabled: l, "aria-label": n, "aria-disabled": l, children: [
        /* @__PURE__ */ o.jsx("input", { "data-testid": "stFileUploaderDropzoneInput", ...g, ...a && {
          webkitdirectory: ""
        } }),
        /* @__PURE__ */ o.jsx(Ue, { multiple: i, acceptedExtensions: t, maxSizeBytes: s, acceptDirectory: a, disabled: l }),
        /* @__PURE__ */ o.jsx(fe, { children: /* @__PURE__ */ o.jsx(x, { kind: w.SECONDARY, disabled: l, size: X.SMALL, children: a ? "Browse directories" : "Browse files" }) })
      ] });
    }
  }
), ve = c.memo(be), N = /* @__PURE__ */ p("small", {
  target: "e1bju1570"
})(({
  kind: e,
  disabled: i,
  theme: t
}) => {
  const {
    redTextColor: s,
    fadedText60: l,
    fadedText40: n
  } = t.colors;
  let a = l;
  return i && (a = n), e === "danger" && (a = s), {
    color: a,
    fontSize: t.fontSizes.sm,
    lineHeight: t.lineHeights.tight
  };
}, ""), ze = ({
  fileInfo: e,
  disabled: i
}) => e.status.type === "uploading" ? /* @__PURE__ */ o.jsx(de, { value: e.status.progress, size: ce.SMALL }) : e.status.type === "error" ? /* @__PURE__ */ o.jsxs(A, { children: [
  /* @__PURE__ */ o.jsx(xe, { "data-testid": "stFileUploaderFileErrorMessage", children: e.status.errorMessage }),
  /* @__PURE__ */ o.jsx(W, { children: /* @__PURE__ */ o.jsx(f, { content: j, size: "lg" }) })
] }) : e.status.type === "uploaded" ? /* @__PURE__ */ o.jsx(N, { disabled: i, children: v(e.size, F.Byte) }) : null, Ie = ({
  fileInfo: e,
  onDelete: i,
  disabled: t
}) => /* @__PURE__ */ o.jsxs(T, { className: "stFileUploaderFile", "data-testid": "stFileUploaderFile", children: [
  /* @__PURE__ */ o.jsx(we, { disabled: t, children: /* @__PURE__ */ o.jsx(f, { content: oe, size: "twoXL" }) }),
  /* @__PURE__ */ o.jsxs(L, { className: "stFileUploaderFileData", children: [
    /* @__PURE__ */ o.jsx(P, { className: "stFileUploaderFileName", "data-testid": "stFileUploaderFileName", title: e.name, disabled: t, children: e.name }),
    /* @__PURE__ */ o.jsx(ze, { fileInfo: e, disabled: t })
  ] }),
  /* @__PURE__ */ o.jsx("div", { "data-testid": "stFileUploaderDeleteBtn", children: /* @__PURE__ */ o.jsx(x, { onClick: () => i(e.id), kind: w.MINIMAL, disabled: t, "aria-label": `Remove ${e.name}`, children: /* @__PURE__ */ o.jsx(f, { content: ne, size: "lg" }) }) })
] }), Ce = c.memo(Ie), je = /* @__PURE__ */ p("div", {
  target: "e1nlpozb1"
})(({
  theme: e
}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: e.spacing.twoXS,
  marginBottom: e.spacing.twoXS
}), ""), Me = /* @__PURE__ */ p("div", {
  target: "e1nlpozb0"
})(({
  theme: e
}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: e.colors.fadedText40
}), ""), Be = ({
  currentPage: e,
  totalPages: i,
  onNext: t,
  onPrevious: s
}) => /* @__PURE__ */ o.jsxs(je, { "data-testid": "stFileUploaderPagination", children: [
  /* @__PURE__ */ o.jsx(N, { children: `Showing page ${e} of ${i}` }),
  /* @__PURE__ */ o.jsxs(Me, { children: [
    /* @__PURE__ */ o.jsx(x, { onClick: s, kind: w.MINIMAL, children: /* @__PURE__ */ o.jsx(f, { content: z, size: "xl" }) }),
    /* @__PURE__ */ o.jsx(x, { onClick: t, kind: w.MINIMAL, children: /* @__PURE__ */ o.jsx(f, { content: I, size: "xl" }) })
  ] })
] }), Ve = c.memo(Be), b = (e, i) => Math.ceil(e.length / i), De = (e) => O(({
  pageSize: t,
  items: s,
  resetOnAdd: l,
  ...n
}) => {
  const [a, r] = c.useState(0), [d, g] = c.useState(() => b(s, t)), u = pe(s);
  c.useEffect(() => {
    u && u.length !== s.length && g(b(s, t)), u && u.length < s.length ? l && r(0) : a + 1 >= d && r(d - 1);
  }, [s, a, t, u, l, d]);
  const R = () => {
    r(Math.min(a + 1, d - 1));
  }, H = () => {
    r(Math.max(0, a - 1));
  }, k = s.slice(a * t, a * t + t);
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsx(e, { items: k, ...n }),
    s.length > t ? /* @__PURE__ */ o.jsx(Ve, { pageSize: t, totalPages: d, currentPage: a + 1, onNext: R, onPrevious: H }) : null
  ] });
}, e), Ee = ({
  items: e,
  onDelete: i,
  disabled: t
}) => /* @__PURE__ */ o.jsx(me, { children: e.map((s) => /* @__PURE__ */ o.jsx(E, { children: /* @__PURE__ */ o.jsx(Ce, { fileInfo: s, onDelete: i, disabled: t }) }, s.id)) }), Le = De(Ee), Pe = (e) => /* @__PURE__ */ o.jsx(D, { children: /* @__PURE__ */ o.jsx(Le, { ...e }) }), Te = c.memo(Pe);
class Ae extends c.PureComponent {
  constructor(i) {
    super(i), this.formClearHelper = new se(), this.localFileIdCounter = 1, this.forceUpdatingStatus = !1, this.componentDidUpdate = () => {
      if (this.status !== "ready")
        return;
      const t = this.createWidgetValue(), {
        element: s,
        widgetMgr: l,
        fragmentId: n
      } = this.props, a = l.getFileUploaderStateValue(s);
      q(t, a) || l.setFileUploaderStateValue(s, t, {
        fromUi: !0
      }, n);
    }, this.isFileTypeAllowed = (t) => {
      const {
        element: s
      } = this.props, {
        type: l
      } = s;
      if (!l || l.length === 0)
        return !0;
      const n = t.name.toLowerCase();
      return l.some((a) => n.endsWith(a.toLowerCase()));
    }, this.filterDirectoryFiles = (t) => {
      const s = [], l = [];
      return t.forEach((n) => {
        this.isFileTypeAllowed(n) ? s.push(n) : l.push({
          file: n,
          errors: [{
            code: "file-invalid-type",
            message: `${n.type} files are not allowed.`
          }]
        });
      }), {
        accepted: s,
        rejected: l
      };
    }, this.dropHandler = (t, s) => {
      const {
        element: l
      } = this.props, {
        multipleFiles: n
      } = l;
      if (!!l.acceptDirectory && t.length > 0) {
        const {
          accepted: r,
          rejected: d
        } = this.filterDirectoryFiles(t);
        t = r, s = [...s, ...d];
      }
      if (!n && t.length === 0 && s.length > 1) {
        const r = s.findIndex((d) => d.errors.length === 1 && d.errors[0].code === "too-many-files");
        r >= 0 && (t.push(s[r].file), s.splice(r, 1));
      }
      if (this.props.uploadClient.fetchFileURLs(t).then((r) => {
        if (!n && t.length > 0) {
          const d = this.state.files.find((g) => g.status.type !== "error");
          d && (this.forceUpdatingStatus = !0, this.deleteFile(d.id), this.forceUpdatingStatus = !1);
        }
        G(r, t).forEach(([d, g]) => {
          this.uploadFile(d, g);
        });
      }).catch((r) => {
        this.addFiles(t.map((d) => new U(d.name, d.size, this.nextLocalFileId(), {
          type: "error",
          errorMessage: r
        })));
      }), s.length > 0) {
        const r = s.map((d) => ae(d, this.nextLocalFileId(), this.maxUploadSizeInBytes));
        this.addFiles(r);
      }
    }, this.uploadFile = (t, s) => {
      const l = new AbortController(), n = s.webkitRelativePath || s.name, a = new U(n, s.size, this.nextLocalFileId(), {
        type: "uploading",
        abortController: l,
        progress: 1
      });
      this.addFile(a), this.props.uploadClient.uploadFile(this.props.element, t.uploadUrl, s, (r) => this.onUploadProgress(r, a.id), l.signal).then(() => this.onUploadComplete(a.id, t)).catch((r) => {
        r instanceof DOMException && r.name === "AbortError" || this.updateFile(a.id, a.setStatus({
          type: "error",
          errorMessage: r ? r.toString() : "Unknown error"
        }));
      });
    }, this.onUploadComplete = (t, s) => {
      const l = this.getFile(t);
      h(l) || l.status.type !== "uploading" || this.updateFile(l.id, l.setStatus({
        type: "uploaded",
        fileId: s.fileId,
        fileUrls: s
      }));
    }, this.deleteFile = (t) => {
      if (this.props.disabled)
        return;
      const s = this.getFile(t);
      h(s) || (s.status.type === "uploading" && s.status.abortController.abort(), s.status.type === "uploaded" && s.status.fileUrls.deleteUrl && this.props.uploadClient.deleteFile(s.status.fileUrls.deleteUrl), this.removeFile(t));
    }, this.addFile = (t) => {
      m.flushSync(() => {
        this.setState((s) => ({
          files: [...s.files, t]
        }));
      });
    }, this.addFiles = (t) => {
      m.flushSync(() => {
        this.setState((s) => ({
          files: [...s.files, ...t]
        }));
      });
    }, this.removeFile = (t) => {
      m.flushSync(() => {
        this.setState((s) => ({
          files: s.files.filter((l) => l.id !== t)
        }));
      });
    }, this.getFile = (t) => this.state.files.find((s) => s.id === t), this.updateFile = (t, s) => {
      m.flushSync(() => {
        this.setState((l) => ({
          files: l.files.map((n) => n.id === t ? s : n)
        }));
      });
    }, this.onUploadProgress = (t, s) => {
      const l = this.getFile(s);
      if (h(l) || l.status.type !== "uploading")
        return;
      const n = Math.round(t.loaded * 100 / t.total);
      l.status.progress !== n && this.updateFile(s, l.setStatus({
        type: "uploading",
        abortController: l.status.abortController,
        progress: n
      }));
    }, this.onFormCleared = () => {
      m.flushSync(() => {
        this.setState({
          files: []
        }, () => {
          const t = this.createWidgetValue();
          if (h(t))
            return;
          const {
            widgetMgr: s,
            element: l,
            fragmentId: n
          } = this.props;
          s.setFileUploaderStateValue(l, t, {
            fromUi: !0
          }, n);
        });
      });
    }, this.state = this.initialValue;
  }
  get initialValue() {
    const i = {
      files: []
    }, {
      widgetMgr: t,
      element: s
    } = this.props, l = t.getFileUploaderStateValue(s);
    if (h(l))
      return i;
    const {
      uploadedFileInfo: n
    } = l;
    return h(n) || n.length === 0 ? i : {
      files: n.map((a) => {
        const r = a.name, d = a.size, g = a.fileId, u = a.fileUrls;
        return new U(r, d, this.nextLocalFileId(), {
          type: "uploaded",
          fileId: g,
          fileUrls: u
        });
      })
    };
  }
  componentWillUnmount() {
    this.formClearHelper.disconnect();
  }
  /**
   * Return this.props.element.maxUploadSizeMb, converted to bytes.
   */
  get maxUploadSizeInBytes() {
    const i = this.props.element.maxUploadSizeMb;
    return re(i, F.Megabyte, F.Byte);
  }
  /**
   * Return the FileUploader's current status, which is derived from
   * its state.
   */
  get status() {
    const i = (t) => t.status.type === "uploading";
    return this.state.files.some(i) || this.forceUpdatingStatus ? "updating" : "ready";
  }
  componentDidMount() {
    const i = this.createWidgetValue(), {
      element: t,
      widgetMgr: s,
      fragmentId: l
    } = this.props;
    s.getFileUploaderStateValue(t) === void 0 && s.setFileUploaderStateValue(t, i, {
      fromUi: !1
    }, l);
  }
  createWidgetValue() {
    const i = this.state.files.filter((t) => t.status.type === "uploaded").map((t) => {
      const {
        name: s,
        size: l,
        status: n
      } = t, {
        fileId: a,
        fileUrls: r
      } = n;
      return new K({
        fileId: a,
        fileUrls: r,
        name: s,
        size: l
      });
    });
    return new Q({
      uploadedFileInfo: i
    });
  }
  render() {
    const {
      files: i
    } = this.state, {
      element: t,
      disabled: s,
      widgetMgr: l,
      width: n
    } = this.props, a = t.type;
    this.formClearHelper.manageFormClearListener(l, t.formId, this.onFormCleared);
    const r = i.slice().reverse();
    return /* @__PURE__ */ o.jsxs(ye, { className: "stFileUploader", "data-testid": "stFileUploader", width: n, children: [
      /* @__PURE__ */ o.jsx(Y, { label: t.label, disabled: s, labelVisibility: J(t.labelVisibility?.value), children: t.help && /* @__PURE__ */ o.jsx(Z, { children: /* @__PURE__ */ o.jsx(ee, { content: t.help, placement: te.TOP_RIGHT }) }) }),
      /* @__PURE__ */ o.jsx(ve, { onDrop: this.dropHandler, multiple: t.multipleFiles, acceptedExtensions: a, maxSizeBytes: this.maxUploadSizeInBytes, label: t.label, disabled: s, acceptDirectory: !!t.acceptDirectory }),
      r.length > 0 && /* @__PURE__ */ o.jsx(Te, { items: r, pageSize: 3, onDelete: this.deleteFile, resetOnAdd: !0, disabled: s })
    ] });
  }
  nextLocalFileId() {
    return this.localFileIdCounter++;
  }
}
const Xe = _(c.memo(Ae));
export {
  Xe as default
};
//# sourceMappingURL=index-BcGL-FSh.js.map
