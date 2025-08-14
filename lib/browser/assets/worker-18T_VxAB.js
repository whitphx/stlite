function V(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var I, N;
function Y() {
  if (N) return I;
  N = 1;
  function o(a) {
    if (typeof a != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(a));
  }
  function l(a, e) {
    for (var t = "", n = 0, s = -1, c = 0, r, i = 0; i <= a.length; ++i) {
      if (i < a.length)
        r = a.charCodeAt(i);
      else {
        if (r === 47)
          break;
        r = 47;
      }
      if (r === 47) {
        if (!(s === i - 1 || c === 1)) if (s !== i - 1 && c === 2) {
          if (t.length < 2 || n !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var g = t.lastIndexOf("/");
              if (g !== t.length - 1) {
                g === -1 ? (t = "", n = 0) : (t = t.slice(0, g), n = t.length - 1 - t.lastIndexOf("/")), s = i, c = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", n = 0, s = i, c = 0;
              continue;
            }
          }
          e && (t.length > 0 ? t += "/.." : t = "..", n = 2);
        } else
          t.length > 0 ? t += "/" + a.slice(s + 1, i) : t = a.slice(s + 1, i), n = i - s - 1;
        s = i, c = 0;
      } else r === 46 && c !== -1 ? ++c : c = -1;
    }
    return t;
  }
  function f(a, e) {
    var t = e.dir || e.root, n = e.base || (e.name || "") + (e.ext || "");
    return t ? t === e.root ? t + n : t + a + n : n;
  }
  var d = {
    // path.resolve([from ...], to)
    resolve: function() {
      for (var e = "", t = !1, n, s = arguments.length - 1; s >= -1 && !t; s--) {
        var c;
        s >= 0 ? c = arguments[s] : (n === void 0 && (n = process.cwd()), c = n), o(c), c.length !== 0 && (e = c + "/" + e, t = c.charCodeAt(0) === 47);
      }
      return e = l(e, !t), t ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
    },
    normalize: function(e) {
      if (o(e), e.length === 0) return ".";
      var t = e.charCodeAt(0) === 47, n = e.charCodeAt(e.length - 1) === 47;
      return e = l(e, !t), e.length === 0 && !t && (e = "."), e.length > 0 && n && (e += "/"), t ? "/" + e : e;
    },
    isAbsolute: function(e) {
      return o(e), e.length > 0 && e.charCodeAt(0) === 47;
    },
    join: function() {
      if (arguments.length === 0)
        return ".";
      for (var e, t = 0; t < arguments.length; ++t) {
        var n = arguments[t];
        o(n), n.length > 0 && (e === void 0 ? e = n : e += "/" + n);
      }
      return e === void 0 ? "." : d.normalize(e);
    },
    relative: function(e, t) {
      if (o(e), o(t), e === t || (e = d.resolve(e), t = d.resolve(t), e === t)) return "";
      for (var n = 1; n < e.length && e.charCodeAt(n) === 47; ++n)
        ;
      for (var s = e.length, c = s - n, r = 1; r < t.length && t.charCodeAt(r) === 47; ++r)
        ;
      for (var i = t.length, g = i - r, S = c < g ? c : g, b = -1, _ = 0; _ <= S; ++_) {
        if (_ === S) {
          if (g > S) {
            if (t.charCodeAt(r + _) === 47)
              return t.slice(r + _ + 1);
            if (_ === 0)
              return t.slice(r + _);
          } else c > S && (e.charCodeAt(n + _) === 47 ? b = _ : _ === 0 && (b = 0));
          break;
        }
        var k = e.charCodeAt(n + _), L = t.charCodeAt(r + _);
        if (k !== L)
          break;
        k === 47 && (b = _);
      }
      var u = "";
      for (_ = n + b + 1; _ <= s; ++_)
        (_ === s || e.charCodeAt(_) === 47) && (u.length === 0 ? u += ".." : u += "/..");
      return u.length > 0 ? u + t.slice(r + b) : (r += b, t.charCodeAt(r) === 47 && ++r, t.slice(r));
    },
    _makeLong: function(e) {
      return e;
    },
    dirname: function(e) {
      if (o(e), e.length === 0) return ".";
      for (var t = e.charCodeAt(0), n = t === 47, s = -1, c = !0, r = e.length - 1; r >= 1; --r)
        if (t = e.charCodeAt(r), t === 47) {
          if (!c) {
            s = r;
            break;
          }
        } else
          c = !1;
      return s === -1 ? n ? "/" : "." : n && s === 1 ? "//" : e.slice(0, s);
    },
    basename: function(e, t) {
      if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
      o(e);
      var n = 0, s = -1, c = !0, r;
      if (t !== void 0 && t.length > 0 && t.length <= e.length) {
        if (t.length === e.length && t === e) return "";
        var i = t.length - 1, g = -1;
        for (r = e.length - 1; r >= 0; --r) {
          var S = e.charCodeAt(r);
          if (S === 47) {
            if (!c) {
              n = r + 1;
              break;
            }
          } else
            g === -1 && (c = !1, g = r + 1), i >= 0 && (S === t.charCodeAt(i) ? --i === -1 && (s = r) : (i = -1, s = g));
        }
        return n === s ? s = g : s === -1 && (s = e.length), e.slice(n, s);
      } else {
        for (r = e.length - 1; r >= 0; --r)
          if (e.charCodeAt(r) === 47) {
            if (!c) {
              n = r + 1;
              break;
            }
          } else s === -1 && (c = !1, s = r + 1);
        return s === -1 ? "" : e.slice(n, s);
      }
    },
    extname: function(e) {
      o(e);
      for (var t = -1, n = 0, s = -1, c = !0, r = 0, i = e.length - 1; i >= 0; --i) {
        var g = e.charCodeAt(i);
        if (g === 47) {
          if (!c) {
            n = i + 1;
            break;
          }
          continue;
        }
        s === -1 && (c = !1, s = i + 1), g === 46 ? t === -1 ? t = i : r !== 1 && (r = 1) : t !== -1 && (r = -1);
      }
      return t === -1 || s === -1 || // We saw a non-dot character immediately before the dot
      r === 0 || // The (right-most) trimmed path component is exactly '..'
      r === 1 && t === s - 1 && t === n + 1 ? "" : e.slice(t, s);
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
      var n = e.charCodeAt(0), s = n === 47, c;
      s ? (t.root = "/", c = 1) : c = 0;
      for (var r = -1, i = 0, g = -1, S = !0, b = e.length - 1, _ = 0; b >= c; --b) {
        if (n = e.charCodeAt(b), n === 47) {
          if (!S) {
            i = b + 1;
            break;
          }
          continue;
        }
        g === -1 && (S = !1, g = b + 1), n === 46 ? r === -1 ? r = b : _ !== 1 && (_ = 1) : r !== -1 && (_ = -1);
      }
      return r === -1 || g === -1 || // We saw a non-dot character immediately before the dot
      _ === 0 || // The (right-most) trimmed path component is exactly '..'
      _ === 1 && r === g - 1 && r === i + 1 ? g !== -1 && (i === 0 && s ? t.base = t.name = e.slice(1, g) : t.base = t.name = e.slice(i, g)) : (i === 0 && s ? (t.name = e.slice(1, r), t.base = e.slice(1, g)) : (t.name = e.slice(i, r), t.base = e.slice(i, g)), t.ext = e.slice(r, g)), i > 0 ? t.dir = e.slice(0, i - 1) : s && (t.dir = "/"), t;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  return d.posix = d, I = d, I;
}
var Z = Y(), M = /* @__PURE__ */ V(Z);
const B = "/home/pyodide", U = (o) => `${B}/${o}`, C = (o, l) => o == null ? M.resolve(B, l) : M.resolve(U(o), l);
function z(o, l) {
  const f = M.normalize(l), a = M.dirname(f).split("/"), e = [];
  for (const t of a) {
    e.push(t);
    const n = e.join("/");
    if (o.FS.analyzePath(n).exists) {
      if (o.FS.isDir(n))
        throw new Error(`"${n}" already exists and is not a directory.`);
      continue;
    }
    try {
      o.FS.mkdir(n);
    } catch (s) {
      throw console.error(`Failed to create a directory "${n}"`), s;
    }
  }
}
function H(o, l, f, d) {
  z(o, l), o.FS.writeFile(l, f, d);
}
function ee(o, l, f) {
  z(o, f), o.FS.rename(l, f);
}
const te = "[", re = "(<=>!~", oe = ";", ne = "@", se = new RegExp(
  `[${te + re + oe + ne}]`
);
function ae(o) {
  return o.split(se)[0].trim();
}
function W(o) {
  return o.forEach((f) => {
    let d;
    try {
      d = new URL(f);
    } catch {
      return;
    }
    if (d.protocol === "emfs:" || d.protocol === "file:")
      throw new Error(
        `"emfs:" and "file:" protocols are not allowed for the requirement (${f})`
      );
  }), o.filter((f) => ae(f) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${f}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function ie(o) {
  const l = typeof process < "u" && process.versions?.node;
  let f;
  l ? f = (await Promise.resolve().then(function() {
    return D;
  })).sep : f = "/";
  const d = o.slice(0, o.lastIndexOf(f) + 1);
  if (o.endsWith(".mjs")) {
    if (l) {
      const a = await Promise.resolve().then(function() {
        return D;
      }), e = await Promise.resolve().then(function() {
        return D;
      });
      !o.includes("://") && a.isAbsolute(o) && (o = e.pathToFileURL(o).href);
    }
    return {
      scriptURL: o,
      pyodideIndexURL: d,
      isESModule: !0
    };
  } else
    return {
      scriptURL: o,
      pyodideIndexURL: d,
      isESModule: !1
    };
}
async function le(o, l) {
  const { scriptURL: f, pyodideIndexURL: d, isESModule: a } = await ie(o);
  let e;
  return a ? e = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    f
  )).loadPyodide : (importScripts(f), e = self.loadPyodide), e({ ...l, indexURL: d });
}
function ce(o) {
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
function de(o, l, f) {
  const d = o.pyimport("pyodide"), a = (r) => d.code.find_imports(r).toJs(), e = f.map((r) => a(r)), s = Array.from(new Set(e.flat())).filter((r) => !o.runPython(`__import__('importlib').util.find_spec('${r}')`)).map((r) => o._api._import_name_to_package_name.get(r)).filter((r) => r);
  if (s.length === 0)
    return Promise.resolve();
  const c = o.loadPackage(s);
  return l(s, c), c.then();
}
function J(o, l, f) {
  const d = de(o, l, f);
  o.runPython(`
def __set_module_auto_load_promise__(promise):
    from streamlit.runtime.scriptrunner import script_runner
    script_runner.moduleAutoLoadPromise = promise

__set_module_auto_load_promise__`)(d);
}
async function ue(o, l, f) {
  const { line: d, column: a } = f, e = o.Script(l);
  if (d > e._code_lines.length)
    return [];
  const t = e.complete.callKwargs({
    line: d,
    column: a,
    fuzzy: !1
  }), n = [];
  for (const s of t.toJs())
    n.push({
      name: s.name,
      type: s.$type,
      // PyProxy.type is overridden in Pyodide. We need to access it this way. Ref: https://github.com/pyodide/pyodide/issues/4032
      docstring: s.docstring.callKwargs({ raw: !0 }),
      complete: s.complete
    }), s.destroy();
  return n;
}
let O = null;
async function fe(o, l, f, d, a) {
  const { files: e, archives: t, requirements: n, prebuiltPackageNames: s, wheels: c, pyodideUrl: r = o, streamlitConfig: i, idbfsMountpoints: g, nodefsMountpoints: S, moduleAutoLoad: b, env: _, languageServer: k } = f, L = W(n);
  if (O)
    a("Pyodide is already loaded."), console.debug("Pyodide is already loaded.");
  else {
    a("Loading Pyodide."), console.debug("Loading Pyodide."), O = le(r, {
      stdout: console.log,
      stderr: console.error
    });
    const m = [];
    c && (m.push(c.streamlit), m.push(c.stliteLib)), k && m.push("jedi"), L.unshift(...m), console.debug("Loaded Pyodide");
  }
  const u = (
    // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await O
  );
  if (_) {
    console.debug("Setting environment variables", _);
    const m = u.pyimport("os");
    m.environ.update(u.toPy(_)), console.debug("Set environment variables", m.environ);
  }
  let p = !1;
  g && (p = !0, g.forEach((m) => {
    u.FS.mkdir(m), u.FS.mount(u.FS.filesystems.IDBFS, {}, m);
  }), await new Promise((m, v) => {
    u.FS.syncfs(!0, (P) => {
      P ? v(P) : m();
    });
  })), S && Object.entries(S).forEach(([m, v]) => {
    u.FS.mkdir(m), u.FS.mount(u.FS.filesystems.NODEFS, { root: v }, m);
  }), a("Mounting files.");
  const h = [];
  await Promise.all(Object.keys(e).map(async (m) => {
    const v = e[m];
    m = C(l, m);
    let P;
    "url" in v ? (console.debug(`Fetch a file from ${v.url}`), P = await fetch(v.url).then((A) => A.arrayBuffer()).then((A) => new Uint8Array(A))) : P = v.data, console.debug(`Write a file "${m}"`), H(u, m, P, e.opts), m.endsWith(".py") && h.push(m);
  })), a("Unpacking archives."), await Promise.all(t.map(async (m) => {
    let v;
    "url" in m ? (console.debug(`Fetch an archive from ${m.url}`), v = await fetch(m.url).then((Q) => Q.arrayBuffer())) : v = m.buffer;
    const { format: P, options: A } = m;
    console.debug("Unpack an archive", { format: P, options: A }), u.unpackArchive(v, P, A);
  })), await u.loadPackage("micropip");
  const y = u.pyimport("micropip");
  if (a("Mocking some packages."), console.debug("Mock pyarrow"), ce(u), console.debug("Mocked pyarrow"), a("Installing packages."), console.debug("Installing the prebuilt packages:", s), await u.loadPackage(s), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", L), await y.install.callKwargs(L, { keep_going: !0 }), console.debug("Installed the requirements"), b) {
    const m = h.map((v) => u.FS.readFile(v, { encoding: "utf8" }));
    J(u, d, m);
  }
  await u.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), a("Loading streamlit package."), console.debug("Loading the Streamlit package"), await u.runPythonAsync(`
import streamlit.runtime
  `), console.debug("Loaded the Streamlit package"), a("Setting up the loggers."), console.debug("Setting the loggers"), await u.runPythonAsync(`
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
  const w = (m, v) => {
    m >= 40 ? console.error(v) : m >= 30 ? console.warn(v) : m >= 20 ? console.info(v) : console.debug(v);
  }, F = u.runPython(`
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

__setup_loggers__`), R = (i?.["logger.level"] ?? "INFO").toString(), E = i?.["logger.messageFormat"] ?? "%(asctime)s %(message)s";
  if (F(R, E, w), console.debug("Set the loggers"), a("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await u.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), p) {
    a("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
    let m = !1;
    const v = () => {
      console.debug("The script has finished. Syncing the filesystem."), m || (m = !0, u.FS.syncfs(!1, (A) => {
        m = !1, A && console.error(A);
      }));
    };
    (await u.runPython(`
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

__setup_script_finished_callback__`))(v), console.debug("Set up the IndexedDB filesystem synchronizer");
  }
  console.debug("Setting up the Streamlit configuration");
  const { load_config_options: K } = u.pyimport("stlite_lib.bootstrap"), G = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": !1,
    ...i,
    "runner.fastReruns": !1
    // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  }, X = l != null;
  K(u.toPy(G), X), console.debug("Set up the Streamlit configuration");
  let T;
  if (k) {
    a("Loading auto-completion engine."), console.debug("Loading Jedi");
    try {
      T = await u.pyimport("jedi"), console.debug("Loaded Jedi");
    } catch (m) {
      console.error("Failed to load Jedi:", m), T = void 0;
    }
  }
  return {
    pyodide: u,
    micropip: y,
    jedi: T,
    initData: f
  };
}
async function q(o, l, f) {
  const d = C(l, f);
  console.debug("Preparing the Streamlit environment");
  const { prepare: a } = o.pyimport("stlite_lib.bootstrap");
  a(d, []), console.debug("Prepared the Streamlit environment"), console.debug("Booting up the Streamlit server");
  const t = o.pyimport("stlite_lib.server.Server")(d, l ? U(l) : null);
  return await t.start(), console.debug("Booted up the Streamlit server"), t;
}
function $(o, l, f, d) {
  function a(c) {
    l({
      type: "event:progress",
      data: {
        message: c
      }
    });
  }
  const e = (c, r) => {
    const i = new MessageChannel();
    l({
      type: "event:moduleAutoLoad",
      data: {
        packagesToLoad: c
      }
    }, [i.port2]), r.then((g) => {
      i.port1.postMessage({
        type: "moduleAutoLoad:success",
        data: {
          loadedPackages: g
        }
      }), i.port1.close();
    }).catch((g) => {
      throw i.port1.postMessage({
        type: "moduleAutoLoad:error",
        error: g
      }), i.port1.close(), g;
    });
  };
  let t = null, n = null;
  const s = async (c) => {
    const r = c.data;
    if (r.type === "initData") {
      const p = r.data, h = {
        ...f,
        ...p
      };
      console.debug("Initial data", h), t = fe(o, d, h, e, a), t.then(({ pyodide: y }) => (a("Booting up the Streamlit server."), n = q(y, d, h.entrypoint), n)).then(() => {
        l({
          type: "event:loaded"
        });
      }).catch((y) => {
        console.error(y), l({
          type: "event:error",
          data: {
            error: y
          }
        });
      });
      return;
    }
    if (!t)
      throw new Error("Pyodide initialization has not been started yet.");
    if (!n)
      throw new Error("Streamlit server has not been started yet.");
    const i = await t, g = i.pyodide, S = i.micropip, b = i.jedi, { moduleAutoLoad: _ } = i.initData, k = await n, L = c.ports[0];
    function u(p) {
      L.postMessage(p);
    }
    try {
      switch (r.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", r.data);
          const { entrypoint: p } = r.data;
          k.stop(), console.debug("Booting up the Streamlit server"), n = q(g, d, p), await n, console.debug("Booted up the Streamlit server"), u({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", r.data);
          const { path: p } = r.data;
          k.start_websocket(p, (h, y) => {
            if (y) {
              const w = h;
              try {
                const F = w.toJs(), R = F.buffer.slice(F.byteOffset, F.byteOffset + F.byteLength);
                l({
                  type: "websocket:message",
                  data: {
                    payload: R
                  }
                }, [R]);
              } finally {
                w.destroy();
              }
            } else
              l({
                type: "websocket:message",
                data: {
                  payload: h
                }
              });
          }), u({
            type: "reply"
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", r.data);
          const { payload: p } = r.data;
          k.receive_websocket_from_js(p);
          break;
        }
        case "http:request": {
          console.debug("http:request", r.data);
          const { request: p } = r.data, h = (y, w, F) => {
            const R = new Map(w.toJs()), E = F.toJs();
            console.debug({ statusCode: y, headers: R, body: E }), u({
              type: "http:response",
              data: {
                response: {
                  statusCode: y,
                  headers: R,
                  body: E
                }
              }
            });
          };
          k.receive_http_from_js(p.method, decodeURIComponent(p.path), p.headers, p.body, h);
          break;
        }
        case "file:write": {
          const { path: p, data: h, opts: y } = r.data, w = C(d, p);
          _ && typeof h == "string" && w.endsWith(".py") && (console.debug(`Auto install the requirements in ${w}`), J(g, e, [h])), console.debug(`Write a file "${w}"`), H(g, w, h, y), u({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: p, newPath: h } = r.data, y = C(d, p), w = C(d, h);
          console.debug(`Rename "${y}" to ${w}`), ee(g, y, w), u({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: p } = r.data, h = C(d, p);
          console.debug(`Remove "${h}`), g.FS.unlink(h), u({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: p, opts: h } = r.data;
          console.debug(`Read "${p}"`);
          const y = g.FS.readFile(p, h);
          u({
            type: "reply:file:read",
            data: {
              content: y
            }
          });
          break;
        }
        case "install": {
          const { requirements: p } = r.data, h = W(p);
          console.debug("Install the requirements:", h), await S.install.callKwargs(h, { keep_going: !0 }).then(() => {
            console.debug("Successfully installed"), u({
              type: "reply"
            });
          });
          break;
        }
        case "setEnv": {
          const { env: p } = r.data;
          g.pyimport("os").environ.update(g.toPy(p)), console.debug("Successfully set the environment variables", p), u({
            type: "reply"
          });
          break;
        }
        case "code_completion": {
          if (!b)
            throw new Error("Jedi is not installed");
          const { code: p, line: h, column: y } = r.data, w = await ue(b, p, {
            line: h,
            column: y
          });
          u({
            type: "reply:code_completion",
            data: {
              codeCompletions: w
            }
          });
          break;
        }
      }
    } catch (p) {
      if (console.error(p), !(p instanceof Error))
        throw p;
      const h = new Error(p.message);
      h.name = p.name, h.stack = p.stack, u({
        type: "reply",
        error: h
      });
    }
  };
  return l({
    type: "event:start"
  }), s;
}
const x = "abcdefghijklmnopqrstuvwxyz", ge = x.length;
function me(o) {
  let l = "";
  for (let f = 0; f < o; f++) {
    const d = Math.floor(Math.random() * ge);
    l += x[d];
  }
  return l;
}
const j = "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = $(j, (o, l) => l ? self.postMessage(o, l) : self.postMessage(o));
else {
  const o = [];
  self.onconnect = (l) => {
    let f;
    do
      f = me(4);
    while (o.includes(f));
    o.push(f), console.debug("SharedWorker mode.", { appId: f });
    const d = l.ports[0];
    d.onmessage = $(j, (a, e) => e ? d.postMessage(a, e) : d.postMessage(a), void 0, f), d.start();
  };
}
var D = /* @__PURE__ */ Object.freeze({
  __proto__: null
});
//# sourceMappingURL=worker-18T_VxAB.js.map
