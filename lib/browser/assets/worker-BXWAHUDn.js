class Y {
  promise;
  resolveInternal;
  rejectInternal;
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolveInternal = e, this.rejectInternal = t;
    });
  }
  resolve(e) {
    this.resolveInternal(e);
  }
  reject(e) {
    this.rejectInternal(e);
  }
}
function Z(s) {
  return s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
function w(s) {
  if (typeof s != "string")
    throw new TypeError("Path must be a string. Received " + JSON.stringify(s));
}
function N(s, e) {
  for (var t = "", o = 0, n = -1, r = 0, a, i = 0; i <= s.length; ++i) {
    if (i < s.length)
      a = s.charCodeAt(i);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(n === i - 1 || r === 1)) if (n !== i - 1 && r === 2) {
        if (t.length < 2 || o !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
          if (t.length > 2) {
            var l = t.lastIndexOf("/");
            if (l !== t.length - 1) {
              l === -1 ? (t = "", o = 0) : (t = t.slice(0, l), o = t.length - 1 - t.lastIndexOf("/")), n = i, r = 0;
              continue;
            }
          } else if (t.length === 2 || t.length === 1) {
            t = "", o = 0, n = i, r = 0;
            continue;
          }
        }
        e && (t.length > 0 ? t += "/.." : t = "..", o = 2);
      } else
        t.length > 0 ? t += "/" + s.slice(n + 1, i) : t = s.slice(n + 1, i), o = i - n - 1;
      n = i, r = 0;
    } else a === 46 && r !== -1 ? ++r : r = -1;
  }
  return t;
}
function ee(s, e) {
  var t = e.dir || e.root, o = e.base || (e.name || "") + (e.ext || "");
  return t ? t === e.root ? t + o : t + s + o : o;
}
var L = {
  // path.resolve([from ...], to)
  resolve: function() {
    for (var e = "", t = !1, o, n = arguments.length - 1; n >= -1 && !t; n--) {
      var r;
      n >= 0 ? r = arguments[n] : (o === void 0 && (o = process.cwd()), r = o), w(r), r.length !== 0 && (e = r + "/" + e, t = r.charCodeAt(0) === 47);
    }
    return e = N(e, !t), t ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
  },
  normalize: function(e) {
    if (w(e), e.length === 0) return ".";
    var t = e.charCodeAt(0) === 47, o = e.charCodeAt(e.length - 1) === 47;
    return e = N(e, !t), e.length === 0 && !t && (e = "."), e.length > 0 && o && (e += "/"), t ? "/" + e : e;
  },
  isAbsolute: function(e) {
    return w(e), e.length > 0 && e.charCodeAt(0) === 47;
  },
  join: function() {
    if (arguments.length === 0)
      return ".";
    for (var e, t = 0; t < arguments.length; ++t) {
      var o = arguments[t];
      w(o), o.length > 0 && (e === void 0 ? e = o : e += "/" + o);
    }
    return e === void 0 ? "." : L.normalize(e);
  },
  relative: function(e, t) {
    if (w(e), w(t), e === t || (e = L.resolve(e), t = L.resolve(t), e === t)) return "";
    for (var o = 1; o < e.length && e.charCodeAt(o) === 47; ++o)
      ;
    for (var n = e.length, r = n - o, a = 1; a < t.length && t.charCodeAt(a) === 47; ++a)
      ;
    for (var i = t.length, l = i - a, _ = r < l ? r : l, f = -1, c = 0; c <= _; ++c) {
      if (c === _) {
        if (l > _) {
          if (t.charCodeAt(a + c) === 47)
            return t.slice(a + c + 1);
          if (c === 0)
            return t.slice(a + c);
        } else r > _ && (e.charCodeAt(o + c) === 47 ? f = c : c === 0 && (f = 0));
        break;
      }
      var m = e.charCodeAt(o + c), R = t.charCodeAt(a + c);
      if (m !== R)
        break;
      m === 47 && (f = c);
    }
    var v = "";
    for (c = o + f + 1; c <= n; ++c)
      (c === n || e.charCodeAt(c) === 47) && (v.length === 0 ? v += ".." : v += "/..");
    return v.length > 0 ? v + t.slice(a + f) : (a += f, t.charCodeAt(a) === 47 && ++a, t.slice(a));
  },
  _makeLong: function(e) {
    return e;
  },
  dirname: function(e) {
    if (w(e), e.length === 0) return ".";
    for (var t = e.charCodeAt(0), o = t === 47, n = -1, r = !0, a = e.length - 1; a >= 1; --a)
      if (t = e.charCodeAt(a), t === 47) {
        if (!r) {
          n = a;
          break;
        }
      } else
        r = !1;
    return n === -1 ? o ? "/" : "." : o && n === 1 ? "//" : e.slice(0, n);
  },
  basename: function(e, t) {
    if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
    w(e);
    var o = 0, n = -1, r = !0, a;
    if (t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t.length === e.length && t === e) return "";
      var i = t.length - 1, l = -1;
      for (a = e.length - 1; a >= 0; --a) {
        var _ = e.charCodeAt(a);
        if (_ === 47) {
          if (!r) {
            o = a + 1;
            break;
          }
        } else
          l === -1 && (r = !1, l = a + 1), i >= 0 && (_ === t.charCodeAt(i) ? --i === -1 && (n = a) : (i = -1, n = l));
      }
      return o === n ? n = l : n === -1 && (n = e.length), e.slice(o, n);
    } else {
      for (a = e.length - 1; a >= 0; --a)
        if (e.charCodeAt(a) === 47) {
          if (!r) {
            o = a + 1;
            break;
          }
        } else n === -1 && (r = !1, n = a + 1);
      return n === -1 ? "" : e.slice(o, n);
    }
  },
  extname: function(e) {
    w(e);
    for (var t = -1, o = 0, n = -1, r = !0, a = 0, i = e.length - 1; i >= 0; --i) {
      var l = e.charCodeAt(i);
      if (l === 47) {
        if (!r) {
          o = i + 1;
          break;
        }
        continue;
      }
      n === -1 && (r = !1, n = i + 1), l === 46 ? t === -1 ? t = i : a !== 1 && (a = 1) : t !== -1 && (a = -1);
    }
    return t === -1 || n === -1 || // We saw a non-dot character immediately before the dot
    a === 0 || // The (right-most) trimmed path component is exactly '..'
    a === 1 && t === n - 1 && t === o + 1 ? "" : e.slice(t, n);
  },
  format: function(e) {
    if (e === null || typeof e != "object")
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
    return ee("/", e);
  },
  parse: function(e) {
    w(e);
    var t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0) return t;
    var o = e.charCodeAt(0), n = o === 47, r;
    n ? (t.root = "/", r = 1) : r = 0;
    for (var a = -1, i = 0, l = -1, _ = !0, f = e.length - 1, c = 0; f >= r; --f) {
      if (o = e.charCodeAt(f), o === 47) {
        if (!_) {
          i = f + 1;
          break;
        }
        continue;
      }
      l === -1 && (_ = !1, l = f + 1), o === 46 ? a === -1 ? a = f : c !== 1 && (c = 1) : a !== -1 && (c = -1);
    }
    return a === -1 || l === -1 || // We saw a non-dot character immediately before the dot
    c === 0 || // The (right-most) trimmed path component is exactly '..'
    c === 1 && a === l - 1 && a === i + 1 ? l !== -1 && (i === 0 && n ? t.base = t.name = e.slice(1, l) : t.base = t.name = e.slice(i, l)) : (i === 0 && n ? (t.name = e.slice(1, a), t.base = e.slice(1, l)) : (t.name = e.slice(i, a), t.base = e.slice(i, l)), t.ext = e.slice(a, l)), i > 0 ? t.dir = e.slice(0, i - 1) : n && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
L.posix = L;
var te = L, M = /* @__PURE__ */ Z(te);
const H = "/home/pyodide", B = (s) => `${H}/${s}`, F = (s, e) => s == null ? M.resolve(H, e) : M.resolve(B(s), e);
function z(s, e) {
  const t = M.normalize(e), n = M.dirname(t).split("/"), r = [];
  for (const a of n) {
    r.push(a);
    const i = r.join("/");
    if (s.FS.analyzePath(i).exists) {
      if (s.FS.isDir(i))
        throw new Error(`"${i}" already exists and is not a directory.`);
      continue;
    }
    try {
      s.FS.mkdir(i);
    } catch (l) {
      throw console.error(`Failed to create a directory "${i}"`), l;
    }
  }
}
function U(s, e, t, o) {
  z(s, e), s.FS.writeFile(e, t, o);
}
function re(s, e, t) {
  z(s, t), s.FS.rename(e, t);
}
const oe = "[", se = "(<=>!~", ne = ";", ae = "@", ie = new RegExp(
  `[${oe + se + ne + ae}]`
);
function le(s) {
  return s.split(ie)[0].trim();
}
function W(s) {
  return s.forEach((t) => {
    let o;
    try {
      o = new URL(t);
    } catch {
      return;
    }
    if (o.protocol === "emfs:" || o.protocol === "file:")
      throw new Error(
        `"emfs:" and "file:" protocols are not allowed for the requirement (${t})`
      );
  }), s.filter((t) => le(t) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${t}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function ce(s) {
  const e = typeof process < "u" && process.versions?.node;
  let t;
  e ? t = (await import(
    /* webpackIgnore: true */
    "./__vite-browser-external-CPvbk0mb.js"
  )).sep : t = "/";
  const o = s.slice(0, s.lastIndexOf(t) + 1);
  if (s.endsWith(".mjs")) {
    if (e) {
      const n = await import(
        /* webpackIgnore: true */
        "./__vite-browser-external-CPvbk0mb.js"
      ), r = await import(
        /* webpackIgnore: true */
        "./__vite-browser-external-CPvbk0mb.js"
      );
      !s.includes("://") && n.isAbsolute(s) && (s = r.pathToFileURL(s).href);
    }
    return {
      scriptURL: s,
      pyodideIndexURL: o,
      isESModule: !0
    };
  } else
    return {
      scriptURL: s,
      pyodideIndexURL: o,
      isESModule: !1
    };
}
async function de(s, e) {
  const { scriptURL: t, pyodideIndexURL: o, isESModule: n } = await ce(s);
  let r;
  return n ? r = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    t
  )).loadPyodide : (importScripts(t), r = self.loadPyodide), r({ ...e, indexURL: o });
}
function ge(s) {
  s.runPython(`
import micropip
micropip.add_mock_package(
    "pyarrow", "0.0.1",
    modules={
        "pyarrow": """
__version__ = '0.0.1'  # TODO: Update when releasing


class Table:
    @classmethod
    def from_pandas(*args, **kwargs):
        raise NotImplementedError("stlite is not supporting this method.")


class Array:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite is not supporting PyArrow.Array")


class ChunkedArray:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite is not supporting PyArrow.ChunkedArray")
"""
    }
)
`);
}
async function fe(s, e, t) {
  const o = s.pyimport("pyodide"), n = (f) => o.code.find_imports(f).toJs(), r = t.map((f) => n(f)), l = Array.from(new Set(r.flat())).filter((f) => !s.runPython(`__import__('importlib').util.find_spec('${f}')`)).map((f) => s._api._import_name_to_package_name.get(f)).filter((f) => f);
  if (l.length === 0)
    return;
  const _ = new MessageChannel();
  e({
    type: "event:moduleAutoLoad",
    data: {
      packagesToLoad: l
    }
  }, _.port2);
  try {
    const f = await s.loadPackage(l);
    _.port1.postMessage({
      type: "moduleAutoLoad:success",
      data: {
        loadedPackages: f
      }
    }), _.port1.close();
    return;
  } catch (f) {
    throw _.port1.postMessage({
      type: "moduleAutoLoad:error",
      error: f
    }), _.port1.close(), f;
  }
}
typeof global < "u" && typeof global.self > "u" && (self = global);
function $(s, e, t) {
  const o = fe(s, e, t);
  self.__moduleAutoLoadPromise__ = o, s.runPythonAsync(`
from streamlit.runtime.scriptrunner import script_runner
from js import __moduleAutoLoadPromise__

script_runner.moduleAutoLoadPromise = __moduleAutoLoadPromise__
`);
}
let I = null;
function j(s, e, t, o) {
  function n(c) {
    e({
      type: "event:progress",
      data: {
        message: c
      }
    });
  }
  let r, a;
  const i = new Y();
  async function l() {
    const c = await i.promise, m = {
      ...t,
      ...c
    };
    console.debug("Initial data", m);
    const { entrypoint: R, files: v, archives: b, requirements: d, prebuiltPackageNames: u, wheels: h, pyodideUrl: y = s, streamlitConfig: S, idbfsMountpoints: P, nodefsMountpoints: C, moduleAutoLoad: J } = m, E = W(d);
    I ? (n("Pyodide is already loaded."), console.debug("Pyodide is already loaded."), r = await I) : (n("Loading Pyodide."), console.debug("Loading Pyodide."), I = de(y, {
      stdout: console.log,
      stderr: console.error
    }), r = await I, h && (E.unshift(h.streamlit), E.unshift(h.stliteLib)), console.debug("Loaded Pyodide"));
    let D = !1;
    P && (D = !0, P.forEach((g) => {
      r.FS.mkdir(g), r.FS.mount(r.FS.filesystems.IDBFS, {}, g);
    }), await new Promise((g, p) => {
      r.FS.syncfs(!0, (k) => {
        k ? p(k) : g();
      });
    })), C && Object.entries(C).forEach(([g, p]) => {
      r.FS.mkdir(g), r.FS.mount(r.FS.filesystems.NODEFS, { root: p }, g);
    }), n("Mounting files.");
    const T = [];
    await Promise.all(Object.keys(v).map(async (g) => {
      const p = v[g];
      g = F(o, g);
      let k;
      "url" in p ? (console.debug(`Fetch a file from ${p.url}`), k = await fetch(p.url).then((A) => A.arrayBuffer()).then((A) => new Uint8Array(A))) : k = p.data, console.debug(`Write a file "${g}"`), U(r, g, k, v.opts), g.endsWith(".py") && T.push(g);
    })), n("Unpacking archives."), await Promise.all(b.map(async (g) => {
      let p;
      "url" in g ? (console.debug(`Fetch an archive from ${g.url}`), p = await fetch(g.url).then((V) => V.arrayBuffer())) : p = g.buffer;
      const { format: k, options: A } = g;
      console.debug("Unpack an archive", { format: k, options: A }), r.unpackArchive(p, k, A);
    })), await r.loadPackage("micropip");
    const K = r.pyimport("micropip");
    if (n("Mocking some packages."), console.debug("Mock pyarrow"), ge(r), console.debug("Mocked pyarrow"), n("Installing packages."), console.debug("Installing the prebuilt packages:", u), await r.loadPackage(u), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", E), await K.install.callKwargs(E, { keep_going: !0 }), console.debug("Installed the requirements"), J) {
      const g = T.map((p) => r.FS.readFile(p, { encoding: "utf8" }));
      $(r, e, g);
    }
    await r.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), n("Loading streamlit package."), console.debug("Loading the Streamlit package"), await r.runPythonAsync(`
import streamlit.runtime
    `), console.debug("Loaded the Streamlit package"), n("Setting up the loggers."), console.debug("Setting the loggers"), await r.runPythonAsync(`
import logging
import streamlit.logger

streamlit.logger.get_logger = logging.getLogger
streamlit.logger.setup_formatter = None
streamlit.logger.update_formatter = lambda *a, **k: None
streamlit.logger.set_log_level = lambda *a, **k: None

for name in streamlit.logger._loggers.keys():
    if name == "root":
        name = "streamlit"
    logger = logging.getLogger(name)
    logger.propagate = True
    logger.handlers.clear()
    logger.setLevel(logging.NOTSET)

streamlit.logger._loggers = {}
`);
    const G = (g, p) => {
      g >= 40 ? console.error(p) : g >= 30 ? console.warn(p) : g >= 20 ? console.info(p) : console.debug(p);
    };
    self.__logCallback__ = G, await r.runPythonAsync(`
def setup_loggers(streamlit_level, streamlit_message_format):
    from js import __logCallback__


    class JsHandler(logging.Handler):
        def emit(self, record):
            msg = self.format(record)
            __logCallback__(record.levelno, msg)


    root_message_format = "%(levelname)s:%(name)s:%(message)s"

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_formatter = logging.Formatter(root_message_format)
    root_handler = JsHandler()
    root_handler.setFormatter(root_formatter)
    root_logger.addHandler(root_handler)
    root_logger.setLevel(logging.DEBUG)

    streamlit_logger = logging.getLogger("streamlit")
    streamlit_logger.propagate = False
    streamlit_logger.handlers.clear()
    streamlit_formatter = logging.Formatter(streamlit_message_format)
    streamlit_handler = JsHandler()
    streamlit_handler.setFormatter(streamlit_formatter)
    streamlit_logger.addHandler(streamlit_handler)
    streamlit_logger.setLevel(streamlit_level.upper())
`);
    const X = (S?.["logger.level"] ?? "INFO").toString(), Q = S?.["logger.messageFormat"] ?? "%(asctime)s %(message)s";
    if (r.globals.get("setup_loggers")(X, Q), console.debug("Set the loggers"), n("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await r.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
    return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), D) {
      n("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
      let g = !1;
      self.__scriptFinishedCallback__ = () => {
        console.debug("The script has finished. Syncing the filesystem."), g || (g = !0, r.FS.syncfs(!1, (p) => {
          g = !1, p && console.error(p);
        }));
      }, await r.runPythonAsync(`
from streamlit.runtime.app_session import AppSession
from streamlit.runtime.scriptrunner import ScriptRunnerEvent
from js import __scriptFinishedCallback__

def wrap_app_session_on_scriptrunner_event(original_method):
    def wrapped(self, *args, **kwargs):
        if "event" in kwargs:
            event = kwargs["event"]
            if event == ScriptRunnerEvent.SCRIPT_STOPPED_WITH_SUCCESS or event == ScriptRunnerEvent.SCRIPT_STOPPED_FOR_RERUN or event == ScriptRunnerEvent.SHUTDOWN:
                __scriptFinishedCallback__()
        return original_method(self, *args, **kwargs)
    return wrapped

AppSession._on_scriptrunner_event = wrap_app_session_on_scriptrunner_event(AppSession._on_scriptrunner_event)
`), console.debug("Set up the IndexedDB filesystem synchronizer");
    }
    const O = F(o, R);
    return n("Booting up the Streamlit server."), console.debug("Setting up the Streamlit configuration"), self.__sharedWorkerMode__ = o != null, self.__streamlitFlagOptions__ = {
      // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
      "browser.gatherUsageStats": !1,
      ...S,
      "runner.fastReruns": !1
      // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
    }, await r.runPythonAsync(`
from stlite_lib.bootstrap import load_config_options, prepare
from js import __sharedWorkerMode__, __streamlitFlagOptions__

flag_options = __streamlitFlagOptions__.to_py()
load_config_options(flag_options, __sharedWorkerMode__)

main_script_path = "${O}"
args = []

prepare(main_script_path, args)
`), console.debug("Set up the Streamlit configuration"), console.debug("Booting up the Streamlit server"), a = r.pyimport("stlite_lib.server.Server")(O, o ? B(o) : null), await a.start(), console.debug("Booted up the Streamlit server"), e({
      type: "event:loaded"
    }), m;
  }
  const _ = l().catch((c) => {
    throw e({
      type: "event:error",
      data: {
        error: c
      }
    }), c;
  }), f = async (c) => {
    const m = c.data;
    if (m.type === "initData") {
      i.resolve(m.data);
      return;
    }
    const { moduleAutoLoad: R } = await _, v = c.ports[0];
    function b(d) {
      v.postMessage(d);
    }
    try {
      switch (m.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", m.data);
          const { entrypoint: d } = m.data;
          a.stop(), console.debug("Booting up the Streamlit server"), a = r.pyimport("stlite_lib.server.Server")(d), a.start(), console.debug("Booted up the Streamlit server"), b({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", m.data);
          const { path: d } = m.data;
          a.start_websocket(d, (u, h) => {
            if (h) {
              const y = u, S = y.getBuffer("u8");
              y.destroy();
              const P = new Uint8ClampedArray(S.data.buffer, S.data.byteOffset, S.data.byteLength);
              e({
                type: "websocket:message",
                data: {
                  payload: new Uint8Array(P)
                }
              });
            } else
              e({
                type: "websocket:message",
                data: {
                  payload: u
                }
              });
          }), b({
            type: "reply"
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", m.data);
          const { payload: d } = m.data;
          a.receive_websocket_from_js(d);
          break;
        }
        case "http:request": {
          console.debug("http:request", m.data);
          const { request: d } = m.data, u = (h, y, S) => {
            const P = new Map(y.toJs()), C = S.toJs();
            console.debug({ statusCode: h, headers: P, body: C }), b({
              type: "http:response",
              data: {
                response: {
                  statusCode: h,
                  headers: P,
                  body: C
                }
              }
            });
          };
          a.receive_http_from_js(d.method, decodeURIComponent(d.path), d.headers, d.body, u);
          break;
        }
        case "file:write": {
          const { path: d, data: u, opts: h } = m.data, y = F(o, d);
          R && typeof u == "string" && y.endsWith(".py") && (console.debug(`Auto install the requirements in ${y}`), $(r, e, [u])), console.debug(`Write a file "${y}"`), U(r, y, u, h), b({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: d, newPath: u } = m.data, h = F(o, d), y = F(o, u);
          console.debug(`Rename "${h}" to ${y}`), re(r, h, y), b({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: d } = m.data, u = F(o, d);
          console.debug(`Remove "${u}`), r.FS.unlink(u), b({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: d, opts: u } = m.data;
          console.debug(`Read "${d}"`);
          const h = r.FS.readFile(d, u);
          b({
            type: "reply:file:read",
            data: {
              content: h
            }
          });
          break;
        }
        case "install": {
          const { requirements: d } = m.data, u = r.pyimport("micropip"), h = W(d);
          console.debug("Install the requirements:", h), await u.install.callKwargs(h, { keep_going: !0 }).then(() => {
            console.debug("Successfully installed"), b({
              type: "reply"
            });
          });
        }
      }
    } catch (d) {
      if (console.error(d), !(d instanceof Error))
        throw d;
      const u = new Error(d.message);
      u.name = d.name, u.stack = d.stack, b({
        type: "reply",
        error: u
      });
    }
  };
  return e({
    type: "event:start"
  }), f;
}
const x = "abcdefghijklmnopqrstuvwxyz", ue = x.length;
function me(s) {
  let e = "";
  for (let t = 0; t < s; t++) {
    const o = Math.floor(Math.random() * ue);
    e += x[o];
  }
  return e;
}
const q = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = j(q, (s, e) => e ? self.postMessage(s, [e]) : self.postMessage(s));
else {
  const s = [];
  self.onconnect = (e) => {
    let t;
    do
      t = me(4);
    while (s.includes(t));
    s.push(t), console.debug("SharedWorker mode.", { appId: t });
    const o = e.ports[0];
    o.onmessage = j(q, (n, r) => r ? o.postMessage(n, [r]) : o.postMessage(n), void 0, t), o.start();
  };
}
//# sourceMappingURL=worker-BXWAHUDn.js.map
