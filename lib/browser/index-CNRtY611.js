import { r as u, L as A, B as x, ab as R, j as d, b as y, c as C, d as _, D as T } from "./index-COqA-032.js";
import { c as D } from "./createDownloadLinkElement-CbRjLJ8e.js";
const B = /%([0-9A-Fa-f]{2})/g, L = /[^\x20-\x7e\xa0-\xff]/g, k = /\\([\u0000-\u007f])/g, E = (
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  /;[\x09\x20]*([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*=[\x09\x20]*("(?:[\x20!\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\x20-\x7e])*"|[!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*/g
), v = /^([A-Za-z0-9!#$%&+\-^_`{}~]+)'(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4,8}|)'((?:%[0-9A-Fa-f]{2}|[A-Za-z0-9!#$&+.^_`|~-])+)$/, I = /^([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*(?:$|;)/, P = (o) => String(o).replace(L, "?");
class S {
  constructor(e, t) {
    this.type = e, this.parameters = t;
  }
}
const U = (o, e) => String.fromCharCode(Number.parseInt(e, 16));
function z(o) {
  const e = v.exec(o);
  if (!e)
    throw new TypeError("invalid extended field value");
  const t = e[1].toLowerCase(), a = e[2];
  let n;
  switch (t) {
    case "iso-8859-1":
      n = P(a.replace(B, U));
      break;
    case "utf-8":
      try {
        n = decodeURIComponent(a);
      } catch {
        throw new TypeError("invalid encoded utf-8");
      }
      break;
    default:
      throw new TypeError("unsupported charset in extended field");
  }
  return n;
}
function $(o) {
  let e = I.exec(o);
  if (!e)
    throw new TypeError("invalid type format");
  let t = e[0].length;
  const a = e[1].toLowerCase();
  let n;
  const l = [], i = {};
  let r;
  for (t = E.lastIndex = e[0].slice(-1) === ";" ? t - 1 : t; e = E.exec(o); ) {
    if (e.index !== t)
      throw new TypeError("invalid parameter format");
    if (t += e[0].length, n = e[1].toLowerCase(), r = e[2], l.indexOf(n) !== -1)
      throw new TypeError("invalid duplicate parameter");
    if (l.push(n), n.indexOf("*") + 1 === n.length) {
      n = n.slice(0, -1), r = z(r), i[n] = r;
      continue;
    }
    typeof i[n] != "string" && (r[0] === '"' && (r = r.slice(1, r.length - 1).replace(k, "$1")), i[n] = r);
  }
  if (t !== -1 && t !== o.length)
    throw new TypeError("invalid parameter format");
  return new S(a, i);
}
function j(o) {
  const e = $(o);
  if (e.type !== "attachment")
    return;
  const t = e.parameters.filename;
  if (typeof t == "string")
    return t;
}
function N(o, e) {
  o.sendHttpRequest({
    method: "GET",
    path: `${e}?title=${encodeURIComponent(document.title)}`,
    // Ref: https://github.com/streamlit/streamlit/blob/41a1a60b6bd72b13effec1bbcc6551afa0878d23/frontend/src/components/widgets/DownloadButton/DownloadButton.tsx#L49
    headers: {},
    body: ""
  }).then(({
    statusCode: t,
    headers: a,
    body: n
  }) => {
    if (t !== 200)
      return;
    const l = a.get("Content-Disposition"), i = (l && j(l)) ?? "", r = a.get("Content-Type"), f = new Blob([n], r ? {
      type: r
    } : void 0), c = URL.createObjectURL(f), s = document.createElement("a");
    s.setAttribute("href", c), s.setAttribute("target", "_blank"), s.setAttribute("download", i), s.click(), URL.revokeObjectURL(c), s.remove();
  });
}
function O(o) {
  const {
    disabled: e,
    element: t,
    widgetMgr: a,
    endpoints: n,
    fragmentId: l
  } = o, {
    help: i,
    label: r,
    icon: f,
    ignoreRerun: c,
    type: s,
    url: w
  } = t, {
    libConfig: {
      enforceDownloadInNewTab: h = !1
      // Default to false, if no libConfig, e.g. for tests
    }
  } = u.useContext(A);
  let p = x.SECONDARY;
  s === "primary" ? p = x.PRIMARY : s === "tertiary" && (p = x.TERTIARY);
  const m = u.useMemo(() => n.buildDownloadUrl(w), [n, w]);
  u.useEffect(() => {
    n.checkSourceUrlResponse(m, "Download Button");
  }, [m, n]);
  const g = R(), b = () => {
    if (c || a.setTriggerValue(t, {
      fromUi: !0
    }, l), t.url.startsWith("/media")) {
      N(g, t.url);
      return;
    }
    D({
      filename: "",
      url: m,
      enforceDownloadInNewTab: h
    }).click();
  };
  return /* @__PURE__ */ d.jsx("div", { className: "stDownloadButton", "data-testid": "stDownloadButton", children: /* @__PURE__ */ d.jsx(y, { help: i, containerWidth: !0, children: /* @__PURE__ */ d.jsx(C, { kind: p, size: _.SMALL, disabled: e, onClick: b, containerWidth: !0, children: /* @__PURE__ */ d.jsx(T, { icon: f, label: r }) }) }) });
}
const G = u.memo(O);
export {
  G as default
};
//# sourceMappingURL=index-CNRtY611.js.map
