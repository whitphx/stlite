function Q(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var I, O;
function V() {
  if (O) return I;
  O = 1;
  function o(i) {
    if (typeof i != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(i));
  }
  function l(i, e) {
    for (var t = "", n = 0, s = -1, c = 0, r, a = 0; a <= i.length; ++a) {
      if (a < i.length)
        r = i.charCodeAt(a);
      else {
        if (r === 47)
          break;
        r = 47;
      }
      if (r === 47) {
        if (!(s === a - 1 || c === 1)) if (s !== a - 1 && c === 2) {
          if (t.length < 2 || n !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var f = t.lastIndexOf("/");
              if (f !== t.length - 1) {
                f === -1 ? (t = "", n = 0) : (t = t.slice(0, f), n = t.length - 1 - t.lastIndexOf("/")), s = a, c = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", n = 0, s = a, c = 0;
              continue;
            }
          }
          e && (t.length > 0 ? t += "/.." : t = "..", n = 2);
        } else
          t.length > 0 ? t += "/" + i.slice(s + 1, a) : t = i.slice(s + 1, a), n = a - s - 1;
        s = a, c = 0;
      } else r === 46 && c !== -1 ? ++c : c = -1;
    }
    return t;
  }
  function g(i, e) {
    var t = e.dir || e.root, n = e.base || (e.name || "") + (e.ext || "");
    return t ? t === e.root ? t + n : t + i + n : n;
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
      for (var a = t.length, f = a - r, S = c < f ? c : f, v = -1, _ = 0; _ <= S; ++_) {
        if (_ === S) {
          if (f > S) {
            if (t.charCodeAt(r + _) === 47)
              return t.slice(r + _ + 1);
            if (_ === 0)
              return t.slice(r + _);
          } else c > S && (e.charCodeAt(n + _) === 47 ? v = _ : _ === 0 && (v = 0));
          break;
        }
        var k = e.charCodeAt(n + _), L = t.charCodeAt(r + _);
        if (k !== L)
          break;
        k === 47 && (v = _);
      }
      var u = "";
      for (_ = n + v + 1; _ <= s; ++_)
        (_ === s || e.charCodeAt(_) === 47) && (u.length === 0 ? u += ".." : u += "/..");
      return u.length > 0 ? u + t.slice(r + v) : (r += v, t.charCodeAt(r) === 47 && ++r, t.slice(r));
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
        var a = t.length - 1, f = -1;
        for (r = e.length - 1; r >= 0; --r) {
          var S = e.charCodeAt(r);
          if (S === 47) {
            if (!c) {
              n = r + 1;
              break;
            }
          } else
            f === -1 && (c = !1, f = r + 1), a >= 0 && (S === t.charCodeAt(a) ? --a === -1 && (s = r) : (a = -1, s = f));
        }
        return n === s ? s = f : s === -1 && (s = e.length), e.slice(n, s);
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
      for (var t = -1, n = 0, s = -1, c = !0, r = 0, a = e.length - 1; a >= 0; --a) {
        var f = e.charCodeAt(a);
        if (f === 47) {
          if (!c) {
            n = a + 1;
            break;
          }
          continue;
        }
        s === -1 && (c = !1, s = a + 1), f === 46 ? t === -1 ? t = a : r !== 1 && (r = 1) : t !== -1 && (r = -1);
      }
      return t === -1 || s === -1 || // We saw a non-dot character immediately before the dot
      r === 0 || // The (right-most) trimmed path component is exactly '..'
      r === 1 && t === s - 1 && t === n + 1 ? "" : e.slice(t, s);
    },
    format: function(e) {
      if (e === null || typeof e != "object")
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
      return g("/", e);
    },
    parse: function(e) {
      o(e);
      var t = { root: "", dir: "", base: "", ext: "", name: "" };
      if (e.length === 0) return t;
      var n = e.charCodeAt(0), s = n === 47, c;
      s ? (t.root = "/", c = 1) : c = 0;
      for (var r = -1, a = 0, f = -1, S = !0, v = e.length - 1, _ = 0; v >= c; --v) {
        if (n = e.charCodeAt(v), n === 47) {
          if (!S) {
            a = v + 1;
            break;
          }
          continue;
        }
        f === -1 && (S = !1, f = v + 1), n === 46 ? r === -1 ? r = v : _ !== 1 && (_ = 1) : r !== -1 && (_ = -1);
      }
      return r === -1 || f === -1 || // We saw a non-dot character immediately before the dot
      _ === 0 || // The (right-most) trimmed path component is exactly '..'
      _ === 1 && r === f - 1 && r === a + 1 ? f !== -1 && (a === 0 && s ? t.base = t.name = e.slice(1, f) : t.base = t.name = e.slice(a, f)) : (a === 0 && s ? (t.name = e.slice(1, r), t.base = e.slice(1, f)) : (t.name = e.slice(a, r), t.base = e.slice(a, f)), t.ext = e.slice(r, f)), a > 0 ? t.dir = e.slice(0, a - 1) : s && (t.dir = "/"), t;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  return d.posix = d, I = d, I;
}
var Y = V(), M = /* @__PURE__ */ Q(Y);
const U = "/home/pyodide", j = (o) => `${U}/${o}`, C = (o, l) => o == null ? M.resolve(U, l) : M.resolve(j(o), l);
function B(o, l) {
  const g = M.normalize(l), i = M.dirname(g).split("/"), e = [];
  for (const t of i) {
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
function H(o, l, g, d) {
  B(o, l), o.FS.writeFile(l, g, d);
}
function Z(o, l, g) {
  B(o, g), o.FS.rename(l, g);
}
const ee = "[", te = "(<=>!~", re = ";", oe = "@", ne = new RegExp(
  `[${ee + te + re + oe}]`
);
function se(o) {
  return o.split(ne)[0].trim();
}
function W(o) {
  return o.forEach((g) => {
    let d;
    try {
      d = new URL(g);
    } catch {
      return;
    }
    if (d.protocol === "emfs:" || d.protocol === "file:")
      throw new Error(
        `"emfs:" and "file:" protocols are not allowed for the requirement (${g})`
      );
  }), o.filter((g) => se(g) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${g}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function ae(o) {
  var i;
  const l = typeof process < "u" && ((i = process.versions) == null ? void 0 : i.node);
  let g;
  l ? g = (await import(
    /* webpackIgnore: true */
    "./__vite-browser-external-CPvbk0mb.js"
  )).sep : g = "/";
  const d = o.slice(0, o.lastIndexOf(g) + 1);
  if (o.endsWith(".mjs")) {
    if (l) {
      const e = await import(
        /* webpackIgnore: true */
        "./__vite-browser-external-CPvbk0mb.js"
      ), t = await import(
        /* webpackIgnore: true */
        "./__vite-browser-external-CPvbk0mb.js"
      );
      !o.includes("://") && e.isAbsolute(o) && (o = t.pathToFileURL(o).href);
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
async function ie(o, l) {
  const { scriptURL: g, pyodideIndexURL: d, isESModule: i } = await ae(o);
  let e;
  return i ? e = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    g
  )).loadPyodide : (importScripts(g), e = self.loadPyodide), e({ ...l, indexURL: d });
}
function le(o) {
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
function ce(o, l, g) {
  const d = o.pyimport("pyodide"), i = (r) => d.code.find_imports(r).toJs(), e = g.map((r) => i(r)), s = Array.from(new Set(e.flat())).filter((r) => !o.runPython(`__import__('importlib').util.find_spec('${r}')`)).map((r) => o._api._import_name_to_package_name.get(r)).filter((r) => r);
  if (s.length === 0)
    return Promise.resolve();
  const c = o.loadPackage(s);
  return l(s, c), c.then();
}
function z(o, l, g) {
  const d = ce(o, l, g);
  o.runPython(`
def __set_module_auto_load_promise__(promise):
    from streamlit.runtime.scriptrunner import script_runner
    script_runner.moduleAutoLoadPromise = promise

__set_module_auto_load_promise__`)(d);
}
async function de(o, l, g) {
  const { line: d, column: i } = g, e = o.Script(l);
  if (d > e._code_lines.length)
    return [];
  const t = e.complete.callKwargs({
    line: d,
    column: i,
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
let D = null;
async function ue(o, l, g, d, i) {
  const { files: e, archives: t, requirements: n, prebuiltPackageNames: s, wheels: c, pyodideUrl: r = o, streamlitConfig: a, idbfsMountpoints: f, nodefsMountpoints: S, moduleAutoLoad: v, env: _, languageServer: k } = g, L = W(n);
  if (D)
    i("Pyodide is already loaded."), console.debug("Pyodide is already loaded.");
  else {
    i("Loading Pyodide."), console.debug("Loading Pyodide."), D = ie(r, {
      stdout: console.log,
      stderr: console.error
    });
    const m = [];
    c && (m.push(c.streamlit), m.push(c.stliteLib)), k && m.push("jedi"), L.unshift(...m), console.debug("Loaded Pyodide");
  }
  const u = (
    // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await D
  );
  if (_) {
    console.debug("Setting environment variables", _);
    const m = u.pyimport("os");
    m.environ.update(u.toPy(_)), console.debug("Set environment variables", m.environ);
  }
  let p = !1;
  f && (p = !0, f.forEach((m) => {
    u.FS.mkdir(m), u.FS.mount(u.FS.filesystems.IDBFS, {}, m);
  }), await new Promise((m, b) => {
    u.FS.syncfs(!0, (P) => {
      P ? b(P) : m();
    });
  })), S && Object.entries(S).forEach(([m, b]) => {
    u.FS.mkdir(m), u.FS.mount(u.FS.filesystems.NODEFS, { root: b }, m);
  }), i("Mounting files.");
  const h = [];
  await Promise.all(Object.keys(e).map(async (m) => {
    const b = e[m];
    m = C(l, m);
    let P;
    "url" in b ? (console.debug(`Fetch a file from ${b.url}`), P = await fetch(b.url).then((A) => A.arrayBuffer()).then((A) => new Uint8Array(A))) : P = b.data, console.debug(`Write a file "${m}"`), H(u, m, P, e.opts), m.endsWith(".py") && h.push(m);
  })), i("Unpacking archives."), await Promise.all(t.map(async (m) => {
    let b;
    "url" in m ? (console.debug(`Fetch an archive from ${m.url}`), b = await fetch(m.url).then((X) => X.arrayBuffer())) : b = m.buffer;
    const { format: P, options: A } = m;
    console.debug("Unpack an archive", { format: P, options: A }), u.unpackArchive(b, P, A);
  })), await u.loadPackage("micropip");
  const y = u.pyimport("micropip");
  if (i("Mocking some packages."), console.debug("Mock pyarrow"), le(u), console.debug("Mocked pyarrow"), i("Installing packages."), console.debug("Installing the prebuilt packages:", s), await u.loadPackage(s), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", L), await y.install.callKwargs(L, { keep_going: !0 }), console.debug("Installed the requirements"), v) {
    const m = h.map((b) => u.FS.readFile(b, { encoding: "utf8" }));
    z(u, d, m);
  }
  await u.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), i("Loading streamlit package."), console.debug("Loading the Streamlit package"), await u.runPythonAsync(`
import streamlit.runtime
  `), console.debug("Loaded the Streamlit package"), i("Setting up the loggers."), console.debug("Setting the loggers"), await u.runPythonAsync(`
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
  const w = (m, b) => {
    m >= 40 ? console.error(b) : m >= 30 ? console.warn(b) : m >= 20 ? console.info(b) : console.debug(b);
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

__setup_loggers__`), R = ((a == null ? void 0 : a["logger.level"]) ?? "INFO").toString(), E = (a == null ? void 0 : a["logger.messageFormat"]) ?? "%(asctime)s %(message)s";
  if (F(R, E, w), console.debug("Set the loggers"), i("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await u.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), p) {
    i("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
    let m = !1;
    const b = () => {
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

__setup_script_finished_callback__`))(b), console.debug("Set up the IndexedDB filesystem synchronizer");
  }
  console.debug("Setting up the Streamlit configuration");
  const { load_config_options: x } = u.pyimport("stlite_lib.bootstrap"), K = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": !1,
    ...a,
    "runner.fastReruns": !1
    // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  }, G = l != null;
  x(u.toPy(K), G), console.debug("Set up the Streamlit configuration");
  let T;
  if (k) {
    i("Loading auto-completion engine."), console.debug("Loading Jedi");
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
    initData: g
  };
}
async function N(o, l, g) {
  const d = C(l, g);
  console.debug("Preparing the Streamlit environment");
  const { prepare: i } = o.pyimport("stlite_lib.bootstrap");
  i(d, []), console.debug("Prepared the Streamlit environment"), console.debug("Booting up the Streamlit server");
  const t = o.pyimport("stlite_lib.server.Server")(d, l ? j(l) : null);
  return await t.start(), console.debug("Booted up the Streamlit server"), t;
}
function q(o, l, g, d) {
  function i(c) {
    l({
      type: "event:progress",
      data: {
        message: c
      }
    });
  }
  const e = (c, r) => {
    const a = new MessageChannel();
    l({
      type: "event:moduleAutoLoad",
      data: {
        packagesToLoad: c
      }
    }, [a.port2]), r.then((f) => {
      a.port1.postMessage({
        type: "moduleAutoLoad:success",
        data: {
          loadedPackages: f
        }
      }), a.port1.close();
    }).catch((f) => {
      throw a.port1.postMessage({
        type: "moduleAutoLoad:error",
        error: f
      }), a.port1.close(), f;
    });
  };
  let t = null, n = null;
  const s = async (c) => {
    const r = c.data;
    if (r.type === "initData") {
      const p = r.data, h = {
        ...g,
        ...p
      };
      console.debug("Initial data", h), t = ue(o, d, h, e, i), t.then(({ pyodide: y }) => (i("Booting up the Streamlit server."), n = N(y, d, h.entrypoint), n)).then(() => {
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
    const a = await t, f = a.pyodide, S = a.micropip, v = a.jedi, { moduleAutoLoad: _ } = a.initData, k = await n, L = c.ports[0];
    function u(p) {
      L.postMessage(p);
    }
    try {
      switch (r.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", r.data);
          const { entrypoint: p } = r.data;
          k.stop(), console.debug("Booting up the Streamlit server"), n = N(f, d, p), await n, console.debug("Booted up the Streamlit server"), u({
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
          _ && typeof h == "string" && w.endsWith(".py") && (console.debug(`Auto install the requirements in ${w}`), z(f, e, [h])), console.debug(`Write a file "${w}"`), H(f, w, h, y), u({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: p, newPath: h } = r.data, y = C(d, p), w = C(d, h);
          console.debug(`Rename "${y}" to ${w}`), Z(f, y, w), u({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: p } = r.data, h = C(d, p);
          console.debug(`Remove "${h}`), f.FS.unlink(h), u({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: p, opts: h } = r.data;
          console.debug(`Read "${p}"`);
          const y = f.FS.readFile(p, h);
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
          f.pyimport("os").environ.update(f.toPy(p)), console.debug("Successfully set the environment variables", p), u({
            type: "reply"
          });
          break;
        }
        case "code_completion": {
          if (!v)
            throw new Error("Jedi is not installed");
          const { code: p, line: h, column: y } = r.data, w = await de(v, p, {
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
const J = "abcdefghijklmnopqrstuvwxyz", ge = J.length;
function fe(o) {
  let l = "";
  for (let g = 0; g < o; g++) {
    const d = Math.floor(Math.random() * ge);
    l += J[d];
  }
  return l;
}
const $ = "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = q($, (o, l) => l ? self.postMessage(o, l) : self.postMessage(o));
else {
  const o = [];
  self.onconnect = (l) => {
    let g;
    do
      g = fe(4);
    while (o.includes(g));
    o.push(g), console.debug("SharedWorker mode.", { appId: g });
    const d = l.ports[0];
    d.onmessage = q($, (i, e) => e ? d.postMessage(i, e) : d.postMessage(i), void 0, g), d.start();
  };
}
//# sourceMappingURL=worker-Cy1I9m3K.js.map
