function X(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var I, O;
function Q() {
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
              var u = t.lastIndexOf("/");
              if (u !== t.length - 1) {
                u === -1 ? (t = "", n = 0) : (t = t.slice(0, u), n = t.length - 1 - t.lastIndexOf("/")), s = a, c = 0;
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
      for (var a = t.length, u = a - r, S = c < u ? c : u, b = -1, _ = 0; _ <= S; ++_) {
        if (_ === S) {
          if (u > S) {
            if (t.charCodeAt(r + _) === 47)
              return t.slice(r + _ + 1);
            if (_ === 0)
              return t.slice(r + _);
          } else c > S && (e.charCodeAt(n + _) === 47 ? b = _ : _ === 0 && (b = 0));
          break;
        }
        var A = e.charCodeAt(n + _), R = t.charCodeAt(r + _);
        if (A !== R)
          break;
        A === 47 && (b = _);
      }
      var p = "";
      for (_ = n + b + 1; _ <= s; ++_)
        (_ === s || e.charCodeAt(_) === 47) && (p.length === 0 ? p += ".." : p += "/..");
      return p.length > 0 ? p + t.slice(r + b) : (r += b, t.charCodeAt(r) === 47 && ++r, t.slice(r));
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
        var a = t.length - 1, u = -1;
        for (r = e.length - 1; r >= 0; --r) {
          var S = e.charCodeAt(r);
          if (S === 47) {
            if (!c) {
              n = r + 1;
              break;
            }
          } else
            u === -1 && (c = !1, u = r + 1), a >= 0 && (S === t.charCodeAt(a) ? --a === -1 && (s = r) : (a = -1, s = u));
        }
        return n === s ? s = u : s === -1 && (s = e.length), e.slice(n, s);
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
        var u = e.charCodeAt(a);
        if (u === 47) {
          if (!c) {
            n = a + 1;
            break;
          }
          continue;
        }
        s === -1 && (c = !1, s = a + 1), u === 46 ? t === -1 ? t = a : r !== 1 && (r = 1) : t !== -1 && (r = -1);
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
      for (var r = -1, a = 0, u = -1, S = !0, b = e.length - 1, _ = 0; b >= c; --b) {
        if (n = e.charCodeAt(b), n === 47) {
          if (!S) {
            a = b + 1;
            break;
          }
          continue;
        }
        u === -1 && (S = !1, u = b + 1), n === 46 ? r === -1 ? r = b : _ !== 1 && (_ = 1) : r !== -1 && (_ = -1);
      }
      return r === -1 || u === -1 || // We saw a non-dot character immediately before the dot
      _ === 0 || // The (right-most) trimmed path component is exactly '..'
      _ === 1 && r === u - 1 && r === a + 1 ? u !== -1 && (a === 0 && s ? t.base = t.name = e.slice(1, u) : t.base = t.name = e.slice(a, u)) : (a === 0 && s ? (t.name = e.slice(1, r), t.base = e.slice(1, u)) : (t.name = e.slice(a, r), t.base = e.slice(a, u)), t.ext = e.slice(r, u)), a > 0 ? t.dir = e.slice(0, a - 1) : s && (t.dir = "/"), t;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  return d.posix = d, I = d, I;
}
var V = Q(), T = /* @__PURE__ */ X(V);
const U = "/home/pyodide", B = (o) => `${U}/${o}`, E = (o, l) => o == null ? T.resolve(U, l) : T.resolve(B(o), l);
function H(o, l) {
  const g = T.normalize(l), i = T.dirname(g).split("/"), e = [];
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
function W(o, l, g, d) {
  H(o, l), o.FS.writeFile(l, g, d);
}
function Y(o, l, g) {
  H(o, g), o.FS.rename(l, g);
}
const Z = "[", ee = "(<=>!~", te = ";", re = "@", oe = new RegExp(
  `[${Z + ee + te + re}]`
);
function ne(o) {
  return o.split(oe)[0].trim();
}
function z(o) {
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
  }), o.filter((g) => ne(g) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${g}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function se(o) {
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
async function ae(o, l) {
  const { scriptURL: g, pyodideIndexURL: d, isESModule: i } = await se(o);
  let e;
  return i ? e = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    g
  )).loadPyodide : (importScripts(g), e = self.loadPyodide), e({ ...l, indexURL: d });
}
function ie(o) {
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
function le(o, l, g) {
  const d = o.pyimport("pyodide"), i = (r) => d.code.find_imports(r).toJs(), e = g.map((r) => i(r)), s = Array.from(new Set(e.flat())).filter((r) => !o.runPython(`__import__('importlib').util.find_spec('${r}')`)).map((r) => o._api._import_name_to_package_name.get(r)).filter((r) => r);
  if (s.length === 0)
    return Promise.resolve();
  const c = o.loadPackage(s);
  return l(s, c), c.then();
}
function j(o, l, g) {
  const d = le(o, l, g);
  o.runPython(`
def __set_module_auto_load_promise__(promise):
    from streamlit.runtime.scriptrunner import script_runner
    script_runner.moduleAutoLoadPromise = promise

__set_module_auto_load_promise__`)(d);
}
async function ce(o, l, g) {
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
      docstring: s.docstring.callKwargs({ raw: !0 })
    }), s.destroy();
  return n;
}
let D = null;
async function de(o, l, g, d, i) {
  const { files: e, archives: t, requirements: n, prebuiltPackageNames: s, wheels: c, pyodideUrl: r = o, streamlitConfig: a, idbfsMountpoints: u, nodefsMountpoints: S, moduleAutoLoad: b, env: _, languageServer: A } = g, R = z(n);
  if (D)
    i("Pyodide is already loaded."), console.debug("Pyodide is already loaded.");
  else {
    i("Loading Pyodide."), console.debug("Loading Pyodide."), D = ae(r, {
      stdout: console.log,
      stderr: console.error
    });
    const m = [];
    c && (m.push(c.streamlit), m.push(c.stliteLib)), A && m.push("jedi"), R.unshift(...m), console.debug("Loaded Pyodide");
  }
  const p = (
    // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await D
  );
  if (_) {
    console.debug("Setting environment variables", _);
    const m = p.pyimport("os");
    m.environ.update(p.toPy(_)), console.debug("Set environment variables", m.environ);
  }
  let k = !1;
  u && (k = !0, u.forEach((m) => {
    p.FS.mkdir(m), p.FS.mount(p.FS.filesystems.IDBFS, {}, m);
  }), await new Promise((m, y) => {
    p.FS.syncfs(!0, (P) => {
      P ? y(P) : m();
    });
  })), S && Object.entries(S).forEach(([m, y]) => {
    p.FS.mkdir(m), p.FS.mount(p.FS.filesystems.NODEFS, { root: y }, m);
  }), i("Mounting files.");
  const f = [];
  await Promise.all(Object.keys(e).map(async (m) => {
    const y = e[m];
    m = E(l, m);
    let P;
    "url" in y ? (console.debug(`Fetch a file from ${y.url}`), P = await fetch(y.url).then((F) => F.arrayBuffer()).then((F) => new Uint8Array(F))) : P = y.data, console.debug(`Write a file "${m}"`), W(p, m, P, e.opts), m.endsWith(".py") && f.push(m);
  })), i("Unpacking archives."), await Promise.all(t.map(async (m) => {
    let y;
    "url" in m ? (console.debug(`Fetch an archive from ${m.url}`), y = await fetch(m.url).then((G) => G.arrayBuffer())) : y = m.buffer;
    const { format: P, options: F } = m;
    console.debug("Unpack an archive", { format: P, options: F }), p.unpackArchive(y, P, F);
  })), await p.loadPackage("micropip");
  const h = p.pyimport("micropip");
  if (i("Mocking some packages."), console.debug("Mock pyarrow"), ie(p), console.debug("Mocked pyarrow"), i("Installing packages."), console.debug("Installing the prebuilt packages:", s), await p.loadPackage(s), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", R), await h.install.callKwargs(R, { keep_going: !0 }), console.debug("Installed the requirements"), b) {
    const m = f.map((y) => p.FS.readFile(y, { encoding: "utf8" }));
    j(p, d, m);
  }
  await p.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), i("Loading streamlit package."), console.debug("Loading the Streamlit package"), await p.runPythonAsync(`
import streamlit.runtime
  `), console.debug("Loaded the Streamlit package"), i("Setting up the loggers."), console.debug("Setting the loggers"), await p.runPythonAsync(`
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
  const v = (m, y) => {
    m >= 40 ? console.error(y) : m >= 30 ? console.warn(y) : m >= 20 ? console.info(y) : console.debug(y);
  }, w = p.runPython(`
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

__setup_loggers__`), L = ((a == null ? void 0 : a["logger.level"]) ?? "INFO").toString(), C = (a == null ? void 0 : a["logger.messageFormat"]) ?? "%(asctime)s %(message)s";
  if (w(L, C, v), console.debug("Set the loggers"), i("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await p.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), k) {
    i("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
    let m = !1;
    const y = () => {
      console.debug("The script has finished. Syncing the filesystem."), m || (m = !0, p.FS.syncfs(!1, (F) => {
        m = !1, F && console.error(F);
      }));
    };
    (await p.runPython(`
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
  const { load_config_options: M } = p.pyimport("stlite_lib.bootstrap"), x = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": !1,
    ...a,
    "runner.fastReruns": !1
    // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  }, K = l != null;
  return M(p.toPy(x), K), console.debug("Set up the Streamlit configuration"), {
    pyodide: p,
    micropip: h,
    initData: g
  };
}
async function N(o, l, g) {
  const d = E(l, g);
  console.debug("Preparing the Streamlit environment");
  const { prepare: i } = o.pyimport("stlite_lib.bootstrap");
  i(d, []), console.debug("Prepared the Streamlit environment"), console.debug("Booting up the Streamlit server");
  const t = o.pyimport("stlite_lib.server.Server")(d, l ? B(l) : null);
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
    }, [a.port2]), r.then((u) => {
      a.port1.postMessage({
        type: "moduleAutoLoad:success",
        data: {
          loadedPackages: u
        }
      }), a.port1.close();
    }).catch((u) => {
      throw a.port1.postMessage({
        type: "moduleAutoLoad:error",
        error: u
      }), a.port1.close(), u;
    });
  };
  let t = null, n = null;
  const s = async (c) => {
    const r = c.data;
    if (r.type === "initData") {
      const f = r.data, h = {
        ...g,
        ...f
      };
      console.debug("Initial data", h), t = de(o, d, h, e, i), t.then(({ pyodide: v }) => (i("Booting up the Streamlit server."), n = N(v, d, h.entrypoint), n)).then(() => {
        l({
          type: "event:loaded"
        });
      }).catch((v) => {
        console.error(v), l({
          type: "event:error",
          data: {
            error: v
          }
        });
      });
      return;
    }
    if (!t)
      throw new Error("Pyodide initialization has not been started yet.");
    if (!n)
      throw new Error("Streamlit server has not been started yet.");
    const a = await t, u = a.pyodide, S = a.micropip, { moduleAutoLoad: b, languageServer: _ } = a.initData, A = await n, R = _ ? await u.pyimport("jedi") : null, p = c.ports[0];
    function k(f) {
      p.postMessage(f);
    }
    try {
      switch (r.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", r.data);
          const { entrypoint: f } = r.data;
          A.stop(), console.debug("Booting up the Streamlit server"), n = N(u, d, f), await n, console.debug("Booted up the Streamlit server"), k({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", r.data);
          const { path: f } = r.data;
          A.start_websocket(f, (h, v) => {
            if (v) {
              const w = h;
              try {
                const L = w.toJs(), C = L.buffer.slice(L.byteOffset, L.byteOffset + L.byteLength);
                l({
                  type: "websocket:message",
                  data: {
                    payload: C
                  }
                }, [C]);
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
          }), k({
            type: "reply"
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", r.data);
          const { payload: f } = r.data;
          A.receive_websocket_from_js(f);
          break;
        }
        case "http:request": {
          console.debug("http:request", r.data);
          const { request: f } = r.data, h = (v, w, L) => {
            const C = new Map(w.toJs()), M = L.toJs();
            console.debug({ statusCode: v, headers: C, body: M }), k({
              type: "http:response",
              data: {
                response: {
                  statusCode: v,
                  headers: C,
                  body: M
                }
              }
            });
          };
          A.receive_http_from_js(f.method, decodeURIComponent(f.path), f.headers, f.body, h);
          break;
        }
        case "file:write": {
          const { path: f, data: h, opts: v } = r.data, w = E(d, f);
          b && typeof h == "string" && w.endsWith(".py") && (console.debug(`Auto install the requirements in ${w}`), j(u, e, [h])), console.debug(`Write a file "${w}"`), W(u, w, h, v), k({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: f, newPath: h } = r.data, v = E(d, f), w = E(d, h);
          console.debug(`Rename "${v}" to ${w}`), Y(u, v, w), k({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: f } = r.data, h = E(d, f);
          console.debug(`Remove "${h}`), u.FS.unlink(h), k({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: f, opts: h } = r.data;
          console.debug(`Read "${f}"`);
          const v = u.FS.readFile(f, h);
          k({
            type: "reply:file:read",
            data: {
              content: v
            }
          });
          break;
        }
        case "install": {
          const { requirements: f } = r.data, h = z(f);
          console.debug("Install the requirements:", h), await S.install.callKwargs(h, { keep_going: !0 }).then(() => {
            console.debug("Successfully installed"), k({
              type: "reply"
            });
          });
          break;
        }
        case "setEnv": {
          const { env: f } = r.data;
          u.pyimport("os").environ.update(u.toPy(f)), console.debug("Successfully set the environment variables", f), k({
            type: "reply"
          });
          break;
        }
        case "code_completion": {
          if (!R)
            throw new Error("Jedi is not installed");
          const { code: f, line: h, column: v } = r.data, w = await ce(R, f, {
            line: h,
            column: v
          });
          k({
            type: "reply:code_completion",
            data: {
              codeCompletions: w
            }
          });
          break;
        }
      }
    } catch (f) {
      if (console.error(f), !(f instanceof Error))
        throw f;
      const h = new Error(f.message);
      h.name = f.name, h.stack = f.stack, k({
        type: "reply",
        error: h
      });
    }
  };
  return l({
    type: "event:start"
  }), s;
}
const J = "abcdefghijklmnopqrstuvwxyz", ue = J.length;
function ge(o) {
  let l = "";
  for (let g = 0; g < o; g++) {
    const d = Math.floor(Math.random() * ue);
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
      g = ge(4);
    while (o.includes(g));
    o.push(g), console.debug("SharedWorker mode.", { appId: g });
    const d = l.ports[0];
    d.onmessage = q($, (i, e) => e ? d.postMessage(i, e) : d.postMessage(i), void 0, g), d.start();
  };
}
//# sourceMappingURL=worker-B0_IxXKi.js.map
