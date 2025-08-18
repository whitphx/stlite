function Y(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var T, N;
function Z() {
  if (N) return T;
  N = 1;
  function o(i) {
    if (typeof i != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(i));
  }
  function c(i, e) {
    for (var t = "", s = 0, a = -1, d = 0, r, l = 0; l <= i.length; ++l) {
      if (l < i.length)
        r = i.charCodeAt(l);
      else {
        if (r === 47)
          break;
        r = 47;
      }
      if (r === 47) {
        if (!(a === l - 1 || d === 1)) if (a !== l - 1 && d === 2) {
          if (t.length < 2 || s !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var g = t.lastIndexOf("/");
              if (g !== t.length - 1) {
                g === -1 ? (t = "", s = 0) : (t = t.slice(0, g), s = t.length - 1 - t.lastIndexOf("/")), a = l, d = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", s = 0, a = l, d = 0;
              continue;
            }
          }
          e && (t.length > 0 ? t += "/.." : t = "..", s = 2);
        } else
          t.length > 0 ? t += "/" + i.slice(a + 1, l) : t = i.slice(a + 1, l), s = l - a - 1;
        a = l, d = 0;
      } else r === 46 && d !== -1 ? ++d : d = -1;
    }
    return t;
  }
  function f(i, e) {
    var t = e.dir || e.root, s = e.base || (e.name || "") + (e.ext || "");
    return t ? t === e.root ? t + s : t + i + s : s;
  }
  var u = {
    // path.resolve([from ...], to)
    resolve: function() {
      for (var e = "", t = !1, s, a = arguments.length - 1; a >= -1 && !t; a--) {
        var d;
        a >= 0 ? d = arguments[a] : (s === void 0 && (s = process.cwd()), d = s), o(d), d.length !== 0 && (e = d + "/" + e, t = d.charCodeAt(0) === 47);
      }
      return e = c(e, !t), t ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
    },
    normalize: function(e) {
      if (o(e), e.length === 0) return ".";
      var t = e.charCodeAt(0) === 47, s = e.charCodeAt(e.length - 1) === 47;
      return e = c(e, !t), e.length === 0 && !t && (e = "."), e.length > 0 && s && (e += "/"), t ? "/" + e : e;
    },
    isAbsolute: function(e) {
      return o(e), e.length > 0 && e.charCodeAt(0) === 47;
    },
    join: function() {
      if (arguments.length === 0)
        return ".";
      for (var e, t = 0; t < arguments.length; ++t) {
        var s = arguments[t];
        o(s), s.length > 0 && (e === void 0 ? e = s : e += "/" + s);
      }
      return e === void 0 ? "." : u.normalize(e);
    },
    relative: function(e, t) {
      if (o(e), o(t), e === t || (e = u.resolve(e), t = u.resolve(t), e === t)) return "";
      for (var s = 1; s < e.length && e.charCodeAt(s) === 47; ++s)
        ;
      for (var a = e.length, d = a - s, r = 1; r < t.length && t.charCodeAt(r) === 47; ++r)
        ;
      for (var l = t.length, g = l - r, S = d < g ? d : g, b = -1, h = 0; h <= S; ++h) {
        if (h === S) {
          if (g > S) {
            if (t.charCodeAt(r + h) === 47)
              return t.slice(r + h + 1);
            if (h === 0)
              return t.slice(r + h);
          } else d > S && (e.charCodeAt(s + h) === 47 ? b = h : h === 0 && (b = 0));
          break;
        }
        var P = e.charCodeAt(s + h), R = t.charCodeAt(r + h);
        if (P !== R)
          break;
        P === 47 && (b = h);
      }
      var v = "";
      for (h = s + b + 1; h <= a; ++h)
        (h === a || e.charCodeAt(h) === 47) && (v.length === 0 ? v += ".." : v += "/..");
      return v.length > 0 ? v + t.slice(r + b) : (r += b, t.charCodeAt(r) === 47 && ++r, t.slice(r));
    },
    _makeLong: function(e) {
      return e;
    },
    dirname: function(e) {
      if (o(e), e.length === 0) return ".";
      for (var t = e.charCodeAt(0), s = t === 47, a = -1, d = !0, r = e.length - 1; r >= 1; --r)
        if (t = e.charCodeAt(r), t === 47) {
          if (!d) {
            a = r;
            break;
          }
        } else
          d = !1;
      return a === -1 ? s ? "/" : "." : s && a === 1 ? "//" : e.slice(0, a);
    },
    basename: function(e, t) {
      if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
      o(e);
      var s = 0, a = -1, d = !0, r;
      if (t !== void 0 && t.length > 0 && t.length <= e.length) {
        if (t.length === e.length && t === e) return "";
        var l = t.length - 1, g = -1;
        for (r = e.length - 1; r >= 0; --r) {
          var S = e.charCodeAt(r);
          if (S === 47) {
            if (!d) {
              s = r + 1;
              break;
            }
          } else
            g === -1 && (d = !1, g = r + 1), l >= 0 && (S === t.charCodeAt(l) ? --l === -1 && (a = r) : (l = -1, a = g));
        }
        return s === a ? a = g : a === -1 && (a = e.length), e.slice(s, a);
      } else {
        for (r = e.length - 1; r >= 0; --r)
          if (e.charCodeAt(r) === 47) {
            if (!d) {
              s = r + 1;
              break;
            }
          } else a === -1 && (d = !1, a = r + 1);
        return a === -1 ? "" : e.slice(s, a);
      }
    },
    extname: function(e) {
      o(e);
      for (var t = -1, s = 0, a = -1, d = !0, r = 0, l = e.length - 1; l >= 0; --l) {
        var g = e.charCodeAt(l);
        if (g === 47) {
          if (!d) {
            s = l + 1;
            break;
          }
          continue;
        }
        a === -1 && (d = !1, a = l + 1), g === 46 ? t === -1 ? t = l : r !== 1 && (r = 1) : t !== -1 && (r = -1);
      }
      return t === -1 || a === -1 || // We saw a non-dot character immediately before the dot
      r === 0 || // The (right-most) trimmed path component is exactly '..'
      r === 1 && t === a - 1 && t === s + 1 ? "" : e.slice(t, a);
    },
    format: function(e) {
      if (e === null || typeof e != "object")
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
      return f("/", e);
    },
    parse: function(e) {
      o(e);
      var t = { root: "", dir: "", base: "", ext: "", name: "" };
      if (e.length === 0) return t;
      var s = e.charCodeAt(0), a = s === 47, d;
      a ? (t.root = "/", d = 1) : d = 0;
      for (var r = -1, l = 0, g = -1, S = !0, b = e.length - 1, h = 0; b >= d; --b) {
        if (s = e.charCodeAt(b), s === 47) {
          if (!S) {
            l = b + 1;
            break;
          }
          continue;
        }
        g === -1 && (S = !1, g = b + 1), s === 46 ? r === -1 ? r = b : h !== 1 && (h = 1) : r !== -1 && (h = -1);
      }
      return r === -1 || g === -1 || // We saw a non-dot character immediately before the dot
      h === 0 || // The (right-most) trimmed path component is exactly '..'
      h === 1 && r === g - 1 && r === l + 1 ? g !== -1 && (l === 0 && a ? t.base = t.name = e.slice(1, g) : t.base = t.name = e.slice(l, g)) : (l === 0 && a ? (t.name = e.slice(1, r), t.base = e.slice(1, g)) : (t.name = e.slice(l, r), t.base = e.slice(l, g)), t.ext = e.slice(r, g)), l > 0 ? t.dir = e.slice(0, l - 1) : a && (t.dir = "/"), t;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  return u.posix = u, T = u, T;
}
var ee = Z(), M = /* @__PURE__ */ Y(ee);
const U = "/home/pyodide", z = (o) => `${U}/${o}`, C = (o, c) => o == null ? M.resolve(U, c) : M.resolve(z(o), c);
function H(o, c) {
  const f = M.normalize(c), i = M.dirname(f).split("/"), e = [];
  for (const t of i) {
    e.push(t);
    const s = e.join("/");
    if (o.FS.analyzePath(s).exists) {
      if (o.FS.isDir(s))
        throw new Error(`"${s}" already exists and is not a directory.`);
      continue;
    }
    try {
      o.FS.mkdir(s);
    } catch (a) {
      throw console.error(`Failed to create a directory "${s}"`), a;
    }
  }
}
function W(o, c, f, u) {
  H(o, c), o.FS.writeFile(c, f, u);
}
function te(o, c, f) {
  H(o, f), o.FS.rename(c, f);
}
const re = "[", oe = "(<=>!~", ne = ";", se = "@", ae = new RegExp(
  `[${re + oe + ne + se}]`
);
function ie(o) {
  return o.split(ae)[0].trim();
}
function q(o) {
  return o.forEach((f) => {
    let u;
    try {
      u = new URL(f);
    } catch {
      return;
    }
    if (u.protocol === "emfs:" || u.protocol === "file:")
      throw new Error(
        `"emfs:" and "file:" protocols are not allowed for the requirement (${f})`
      );
  }), o.filter((f) => ie(f) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${f}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function le(o) {
  const c = typeof process < "u" && process.versions?.node;
  let f;
  c ? f = (await Promise.resolve().then(function() {
    return D;
  })).sep : f = "/";
  const u = o.slice(0, o.lastIndexOf(f) + 1);
  if (o.endsWith(".mjs")) {
    if (c) {
      const i = await Promise.resolve().then(function() {
        return D;
      }), e = await Promise.resolve().then(function() {
        return D;
      });
      !o.includes("://") && i.isAbsolute(o) && (o = e.pathToFileURL(o).href);
    }
    return {
      scriptURL: o,
      pyodideIndexURL: u,
      isESModule: !0
    };
  } else
    return {
      scriptURL: o,
      pyodideIndexURL: u,
      isESModule: !1
    };
}
async function ce(o, c) {
  const { scriptURL: f, pyodideIndexURL: u, isESModule: i } = await le(o);
  let e;
  return i ? e = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    f
  )).loadPyodide : (importScripts(f), e = self.loadPyodide), e({ ...c, indexURL: u });
}
function de(o) {
  o.runPython(`
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
function ue(o, c, f) {
  const u = o.pyimport("pyodide"), i = (r) => u.code.find_imports(r).toJs(), e = f.map((r) => i(r)), a = Array.from(new Set(e.flat())).filter((r) => !o.runPython(`__import__('importlib').util.find_spec('${r}')`)).map((r) => o._api._import_name_to_package_name.get(r)).filter((r) => r);
  if (a.length === 0)
    return Promise.resolve();
  const d = o.loadPackage(a);
  return c(a, d), d.then();
}
function J(o, c, f) {
  const u = ue(o, c, f);
  o.runPython(`
def __set_module_auto_load_promise__(promise):
    from streamlit.runtime.scriptrunner import script_runner
    script_runner.moduleAutoLoadPromise = promise

__set_module_auto_load_promise__`)(u);
}
async function ge(o, c, f) {
  const { line: u, column: i } = f, e = o.Script(c);
  if (u > e._code_lines.length)
    return [];
  const t = e.complete.callKwargs({
    line: u,
    column: i,
    fuzzy: !1
  }), s = [];
  for (const a of t.toJs())
    s.push({
      name: a.name,
      type: a.$type,
      // PyProxy.type is overridden in Pyodide. We need to access it this way. Ref: https://github.com/pyodide/pyodide/issues/4032
      docstring: a.docstring.callKwargs({ raw: !0 }),
      complete: a.complete
    }), a.destroy();
  return s;
}
let O = null;
async function fe(o, c, f, u, i) {
  const { files: e, archives: t, requirements: s, prebuiltPackageNames: a, wheels: d, installs: r, pyodideUrl: l = o, streamlitConfig: g, idbfsMountpoints: S, nodefsMountpoints: b, moduleAutoLoad: h, env: P, languageServer: R } = f, v = q(s);
  if (O)
    i("Pyodide is already loaded."), console.debug("Pyodide is already loaded.");
  else {
    i("Loading Pyodide."), console.debug("Loading Pyodide."), O = ce(l, {
      stdout: console.log,
      stderr: console.error
    });
    const m = [];
    d && (m.push(d.streamlit), m.push(d.stliteLib)), R && m.push("jedi"), v.unshift(...m), console.debug("Loaded Pyodide");
  }
  const n = (
    // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await O
  );
  if (P) {
    console.debug("Setting environment variables", P);
    const m = n.pyimport("os");
    m.environ.update(n.toPy(P)), console.debug("Set environment variables", m.environ);
  }
  let p = !1;
  S && (p = !0, S.forEach((m) => {
    n.FS.mkdir(m), n.FS.mount(n.FS.filesystems.IDBFS, {}, m);
  }), await new Promise((m, y) => {
    n.FS.syncfs(!0, (k) => {
      k ? y(k) : m();
    });
  })), b && Object.entries(b).forEach(([m, y]) => {
    n.FS.mkdir(m), n.FS.mount(n.FS.filesystems.NODEFS, { root: y }, m);
  }), i("Mounting files.");
  const _ = [];
  await Promise.all(Object.keys(e).map(async (m) => {
    const y = e[m];
    m = C(c, m);
    let k;
    "url" in y ? (console.debug(`Fetch a file from ${y.url}`), k = await fetch(y.url).then((A) => A.arrayBuffer()).then((A) => new Uint8Array(A))) : k = y.data, console.debug(`Write a file "${m}"`), W(n, m, k, e.opts), m.endsWith(".py") && _.push(m);
  })), i("Unpacking archives."), await Promise.all(t.map(async (m) => {
    let y;
    "url" in m ? (console.debug(`Fetch an archive from ${m.url}`), y = await fetch(m.url).then((V) => V.arrayBuffer())) : y = m.buffer;
    const { format: k, options: A } = m;
    console.debug("Unpack an archive", { format: k, options: A }), n.unpackArchive(y, k, A);
  })), await n.loadPackage("micropip");
  const w = n.pyimport("micropip");
  if (i("Mocking some packages."), console.debug("Mock pyarrow"), de(n), console.debug("Mocked pyarrow"), i("Installing packages."), console.debug("Installing the prebuilt packages:", a), await n.loadPackage(a), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", v), await w.install.callKwargs(v, { keep_going: !0 }), console.debug("Installed the requirements"), r && (console.debug("Installing the additional requirements"), await Promise.all(r.map(({ requirements: m, options: y }) => {
    const k = q(m);
    return console.debug("Installing the requirements:", k), w.install.callKwargs(k, y ?? {});
  }))), h) {
    const m = _.map((y) => n.FS.readFile(y, { encoding: "utf8" }));
    J(n, u, m);
  }
  await n.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), i("Loading streamlit package."), console.debug("Loading the Streamlit package"), await n.runPythonAsync(`
import streamlit.runtime
  `), console.debug("Loaded the Streamlit package"), i("Setting up the loggers."), console.debug("Setting the loggers"), await n.runPythonAsync(`
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
  const F = (m, y) => {
    m >= 40 ? console.error(y) : m >= 30 ? console.warn(y) : m >= 20 ? console.info(y) : console.debug(y);
  }, L = n.runPython(`
def __setup_loggers__(streamlit_level, streamlit_message_format, callback):
    class JsHandler(logging.Handler):
        def emit(self, record):
            msg = self.format(record)
            callback(record.levelno, msg)


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

__setup_loggers__`), E = (g?.["logger.level"] ?? "INFO").toString(), K = g?.["logger.messageFormat"] ?? "%(asctime)s %(message)s";
  if (L(E, K, F), console.debug("Set the loggers"), i("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await n.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), p) {
    i("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
    let m = !1;
    const y = () => {
      console.debug("The script has finished. Syncing the filesystem."), m || (m = !0, n.FS.syncfs(!1, (A) => {
        m = !1, A && console.error(A);
      }));
    };
    (await n.runPython(`
def __setup_script_finished_callback__(callback):
    from streamlit.runtime.app_session import AppSession
    from streamlit.runtime.scriptrunner import ScriptRunnerEvent

    def wrap_app_session_on_scriptrunner_event(original_method):
        def wrapped(self, *args, **kwargs):
            if "event" in kwargs:
                event = kwargs["event"]
                if event == ScriptRunnerEvent.SCRIPT_STOPPED_WITH_SUCCESS or event == ScriptRunnerEvent.SCRIPT_STOPPED_FOR_RERUN or event == ScriptRunnerEvent.SHUTDOWN:
                    callback()
            return original_method(self, *args, **kwargs)
        return wrapped

    AppSession._on_scriptrunner_event = wrap_app_session_on_scriptrunner_event(AppSession._on_scriptrunner_event)

__setup_script_finished_callback__`))(y), console.debug("Set up the IndexedDB filesystem synchronizer");
  }
  console.debug("Setting up the Streamlit configuration");
  const { load_config_options: G } = n.pyimport("stlite_lib.bootstrap"), X = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": !1,
    ...g,
    "runner.fastReruns": !1
    // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  }, Q = c != null;
  G(n.toPy(X), Q), console.debug("Set up the Streamlit configuration");
  let I;
  if (R) {
    i("Loading auto-completion engine."), console.debug("Loading Jedi");
    try {
      I = await n.pyimport("jedi"), console.debug("Loaded Jedi");
    } catch (m) {
      console.error("Failed to load Jedi:", m), I = void 0;
    }
  }
  return {
    pyodide: n,
    micropip: w,
    jedi: I,
    initData: f
  };
}
async function $(o, c, f) {
  const u = C(c, f);
  console.debug("Preparing the Streamlit environment");
  const { prepare: i } = o.pyimport("stlite_lib.bootstrap");
  i(u, []), console.debug("Prepared the Streamlit environment"), console.debug("Booting up the Streamlit server");
  const t = o.pyimport("stlite_lib.server.Server")(u, c ? z(c) : null);
  return await t.start(), console.debug("Booted up the Streamlit server"), t;
}
function j(o, c, f, u) {
  function i(d) {
    c({
      type: "event:progress",
      data: {
        message: d
      }
    });
  }
  const e = (d, r) => {
    const l = new MessageChannel();
    c({
      type: "event:moduleAutoLoad",
      data: {
        packagesToLoad: d
      }
    }, [l.port2]), r.then((g) => {
      l.port1.postMessage({
        type: "moduleAutoLoad:success",
        data: {
          loadedPackages: g
        }
      }), l.port1.close();
    }).catch((g) => {
      throw l.port1.postMessage({
        type: "moduleAutoLoad:error",
        error: g
      }), l.port1.close(), g;
    });
  };
  let t = null, s = null;
  const a = async (d) => {
    const r = d.data;
    if (r.type === "initData") {
      const n = r.data, p = {
        ...f,
        ...n
      };
      console.debug("Initial data", p), t = fe(o, u, p, e, i), t.then(({ pyodide: _ }) => (i("Booting up the Streamlit server."), s = $(_, u, p.entrypoint), s)).then(() => {
        c({
          type: "event:loaded"
        });
      }).catch((_) => {
        console.error(_), c({
          type: "event:error",
          data: {
            error: _
          }
        });
      });
      return;
    }
    if (!t)
      throw new Error("Pyodide initialization has not been started yet.");
    if (!s)
      throw new Error("Streamlit server has not been started yet.");
    const l = await t, g = l.pyodide, S = l.micropip, b = l.jedi, { moduleAutoLoad: h } = l.initData, P = await s, R = d.ports[0];
    function v(n) {
      R.postMessage(n);
    }
    try {
      switch (r.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", r.data);
          const { entrypoint: n } = r.data;
          P.stop(), console.debug("Booting up the Streamlit server"), s = $(g, u, n), await s, console.debug("Booted up the Streamlit server"), v({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", r.data);
          const { path: n } = r.data;
          P.start_websocket(n, (p, _) => {
            if (_) {
              const w = p;
              try {
                const F = w.toJs(), L = F.buffer.slice(F.byteOffset, F.byteOffset + F.byteLength);
                c({
                  type: "websocket:message",
                  data: {
                    payload: L
                  }
                }, [L]);
              } finally {
                w.destroy();
              }
            } else
              c({
                type: "websocket:message",
                data: {
                  payload: p
                }
              });
          }), v({
            type: "reply"
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", r.data);
          const { payload: n } = r.data;
          P.receive_websocket_from_js(n);
          break;
        }
        case "http:request": {
          console.debug("http:request", r.data);
          const { request: n } = r.data, p = (_, w, F) => {
            const L = new Map(w.toJs()), E = F.toJs();
            console.debug({ statusCode: _, headers: L, body: E }), v({
              type: "http:response",
              data: {
                response: {
                  statusCode: _,
                  headers: L,
                  body: E
                }
              }
            });
          };
          P.receive_http_from_js(n.method, decodeURIComponent(n.path), n.headers, n.body, p);
          break;
        }
        case "file:write": {
          const { path: n, data: p, opts: _ } = r.data, w = C(u, n);
          h && typeof p == "string" && w.endsWith(".py") && (console.debug(`Auto install the requirements in ${w}`), J(g, e, [p])), console.debug(`Write a file "${w}"`), W(g, w, p, _), v({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: n, newPath: p } = r.data, _ = C(u, n), w = C(u, p);
          console.debug(`Rename "${_}" to ${w}`), te(g, _, w), v({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: n } = r.data, p = C(u, n);
          console.debug(`Remove "${p}`), g.FS.unlink(p), v({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: n, opts: p } = r.data;
          console.debug(`Read "${n}"`);
          const _ = g.FS.readFile(n, p);
          v({
            type: "reply:file:read",
            data: {
              content: _
            }
          });
          break;
        }
        case "install": {
          const { requirements: n, options: p } = r.data, _ = q(n);
          console.debug("Install the requirements:", _), await S.install.callKwargs(_, p ?? {}).then(() => {
            console.debug("Successfully installed"), v({
              type: "reply"
            });
          });
          break;
        }
        case "setEnv": {
          const { env: n } = r.data;
          g.pyimport("os").environ.update(g.toPy(n)), console.debug("Successfully set the environment variables", n), v({
            type: "reply"
          });
          break;
        }
        case "code_completion": {
          if (!b)
            throw new Error("Jedi is not installed");
          const { code: n, line: p, column: _ } = r.data, w = await ge(b, n, {
            line: p,
            column: _
          });
          v({
            type: "reply:code_completion",
            data: {
              codeCompletions: w
            }
          });
          break;
        }
      }
    } catch (n) {
      if (console.error(n), !(n instanceof Error))
        throw n;
      const p = new Error(n.message);
      p.name = n.name, p.stack = n.stack, v({
        type: "reply",
        error: p
      });
    }
  };
  return c({
    type: "event:start"
  }), a;
}
const x = "abcdefghijklmnopqrstuvwxyz", me = x.length;
function pe(o) {
  let c = "";
  for (let f = 0; f < o; f++) {
    const u = Math.floor(Math.random() * me);
    c += x[u];
  }
  return c;
}
const B = "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = j(B, (o, c) => c ? self.postMessage(o, c) : self.postMessage(o));
else {
  const o = [];
  self.onconnect = (c) => {
    let f;
    do
      f = pe(4);
    while (o.includes(f));
    o.push(f), console.debug("SharedWorker mode.", { appId: f });
    const u = c.ports[0];
    u.onmessage = j(B, (i, e) => e ? u.postMessage(i, e) : u.postMessage(i), void 0, f), u.start();
  };
}
var D = /* @__PURE__ */ Object.freeze({
  __proto__: null
});
//# sourceMappingURL=worker-B9tx8SYE.js.map
