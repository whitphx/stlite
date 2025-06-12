function V(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var T, N;
function Y() {
  if (N) return T;
  N = 1;
  function o(c) {
    if (typeof c != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(c));
  }
  function d(c, e) {
    for (var t = "", a = 0, s = -1, i = 0, r, l = 0; l <= c.length; ++l) {
      if (l < c.length)
        r = c.charCodeAt(l);
      else {
        if (r === 47)
          break;
        r = 47;
      }
      if (r === 47) {
        if (!(s === l - 1 || i === 1)) if (s !== l - 1 && i === 2) {
          if (t.length < 2 || a !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var g = t.lastIndexOf("/");
              if (g !== t.length - 1) {
                g === -1 ? (t = "", a = 0) : (t = t.slice(0, g), a = t.length - 1 - t.lastIndexOf("/")), s = l, i = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", a = 0, s = l, i = 0;
              continue;
            }
          }
          e && (t.length > 0 ? t += "/.." : t = "..", a = 2);
        } else
          t.length > 0 ? t += "/" + c.slice(s + 1, l) : t = c.slice(s + 1, l), a = l - s - 1;
        s = l, i = 0;
      } else r === 46 && i !== -1 ? ++i : i = -1;
    }
    return t;
  }
  function f(c, e) {
    var t = e.dir || e.root, a = e.base || (e.name || "") + (e.ext || "");
    return t ? t === e.root ? t + a : t + c + a : a;
  }
  var u = {
    // path.resolve([from ...], to)
    resolve: function() {
      for (var e = "", t = !1, a, s = arguments.length - 1; s >= -1 && !t; s--) {
        var i;
        s >= 0 ? i = arguments[s] : (a === void 0 && (a = process.cwd()), i = a), o(i), i.length !== 0 && (e = i + "/" + e, t = i.charCodeAt(0) === 47);
      }
      return e = d(e, !t), t ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
    },
    normalize: function(e) {
      if (o(e), e.length === 0) return ".";
      var t = e.charCodeAt(0) === 47, a = e.charCodeAt(e.length - 1) === 47;
      return e = d(e, !t), e.length === 0 && !t && (e = "."), e.length > 0 && a && (e += "/"), t ? "/" + e : e;
    },
    isAbsolute: function(e) {
      return o(e), e.length > 0 && e.charCodeAt(0) === 47;
    },
    join: function() {
      if (arguments.length === 0)
        return ".";
      for (var e, t = 0; t < arguments.length; ++t) {
        var a = arguments[t];
        o(a), a.length > 0 && (e === void 0 ? e = a : e += "/" + a);
      }
      return e === void 0 ? "." : u.normalize(e);
    },
    relative: function(e, t) {
      if (o(e), o(t), e === t || (e = u.resolve(e), t = u.resolve(t), e === t)) return "";
      for (var a = 1; a < e.length && e.charCodeAt(a) === 47; ++a)
        ;
      for (var s = e.length, i = s - a, r = 1; r < t.length && t.charCodeAt(r) === 47; ++r)
        ;
      for (var l = t.length, g = l - r, S = i < g ? i : g, b = -1, _ = 0; _ <= S; ++_) {
        if (_ === S) {
          if (g > S) {
            if (t.charCodeAt(r + _) === 47)
              return t.slice(r + _ + 1);
            if (_ === 0)
              return t.slice(r + _);
          } else i > S && (e.charCodeAt(a + _) === 47 ? b = _ : _ === 0 && (b = 0));
          break;
        }
        var P = e.charCodeAt(a + _), C = t.charCodeAt(r + _);
        if (P !== C)
          break;
        P === 47 && (b = _);
      }
      var h = "";
      for (_ = a + b + 1; _ <= s; ++_)
        (_ === s || e.charCodeAt(_) === 47) && (h.length === 0 ? h += ".." : h += "/..");
      return h.length > 0 ? h + t.slice(r + b) : (r += b, t.charCodeAt(r) === 47 && ++r, t.slice(r));
    },
    _makeLong: function(e) {
      return e;
    },
    dirname: function(e) {
      if (o(e), e.length === 0) return ".";
      for (var t = e.charCodeAt(0), a = t === 47, s = -1, i = !0, r = e.length - 1; r >= 1; --r)
        if (t = e.charCodeAt(r), t === 47) {
          if (!i) {
            s = r;
            break;
          }
        } else
          i = !1;
      return s === -1 ? a ? "/" : "." : a && s === 1 ? "//" : e.slice(0, s);
    },
    basename: function(e, t) {
      if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
      o(e);
      var a = 0, s = -1, i = !0, r;
      if (t !== void 0 && t.length > 0 && t.length <= e.length) {
        if (t.length === e.length && t === e) return "";
        var l = t.length - 1, g = -1;
        for (r = e.length - 1; r >= 0; --r) {
          var S = e.charCodeAt(r);
          if (S === 47) {
            if (!i) {
              a = r + 1;
              break;
            }
          } else
            g === -1 && (i = !1, g = r + 1), l >= 0 && (S === t.charCodeAt(l) ? --l === -1 && (s = r) : (l = -1, s = g));
        }
        return a === s ? s = g : s === -1 && (s = e.length), e.slice(a, s);
      } else {
        for (r = e.length - 1; r >= 0; --r)
          if (e.charCodeAt(r) === 47) {
            if (!i) {
              a = r + 1;
              break;
            }
          } else s === -1 && (i = !1, s = r + 1);
        return s === -1 ? "" : e.slice(a, s);
      }
    },
    extname: function(e) {
      o(e);
      for (var t = -1, a = 0, s = -1, i = !0, r = 0, l = e.length - 1; l >= 0; --l) {
        var g = e.charCodeAt(l);
        if (g === 47) {
          if (!i) {
            a = l + 1;
            break;
          }
          continue;
        }
        s === -1 && (i = !1, s = l + 1), g === 46 ? t === -1 ? t = l : r !== 1 && (r = 1) : t !== -1 && (r = -1);
      }
      return t === -1 || s === -1 || // We saw a non-dot character immediately before the dot
      r === 0 || // The (right-most) trimmed path component is exactly '..'
      r === 1 && t === s - 1 && t === a + 1 ? "" : e.slice(t, s);
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
      var a = e.charCodeAt(0), s = a === 47, i;
      s ? (t.root = "/", i = 1) : i = 0;
      for (var r = -1, l = 0, g = -1, S = !0, b = e.length - 1, _ = 0; b >= i; --b) {
        if (a = e.charCodeAt(b), a === 47) {
          if (!S) {
            l = b + 1;
            break;
          }
          continue;
        }
        g === -1 && (S = !1, g = b + 1), a === 46 ? r === -1 ? r = b : _ !== 1 && (_ = 1) : r !== -1 && (_ = -1);
      }
      return r === -1 || g === -1 || // We saw a non-dot character immediately before the dot
      _ === 0 || // The (right-most) trimmed path component is exactly '..'
      _ === 1 && r === g - 1 && r === l + 1 ? g !== -1 && (l === 0 && s ? t.base = t.name = e.slice(1, g) : t.base = t.name = e.slice(l, g)) : (l === 0 && s ? (t.name = e.slice(1, r), t.base = e.slice(1, g)) : (t.name = e.slice(l, r), t.base = e.slice(l, g)), t.ext = e.slice(r, g)), l > 0 ? t.dir = e.slice(0, l - 1) : s && (t.dir = "/"), t;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  return u.posix = u, T = u, T;
}
var Z = Y(), M = /* @__PURE__ */ V(Z);
const U = "/home/pyodide", B = (o) => `${U}/${o}`, R = (o, d) => o == null ? M.resolve(U, d) : M.resolve(B(o), d);
function H(o, d) {
  const f = M.normalize(d), c = M.dirname(f).split("/"), e = [];
  for (const t of c) {
    e.push(t);
    const a = e.join("/");
    if (o.FS.analyzePath(a).exists) {
      if (o.FS.isDir(a))
        throw new Error(`"${a}" already exists and is not a directory.`);
      continue;
    }
    try {
      o.FS.mkdir(a);
    } catch (s) {
      throw console.error(`Failed to create a directory "${a}"`), s;
    }
  }
}
function W(o, d, f, u) {
  H(o, d), o.FS.writeFile(d, f, u);
}
function ee(o, d, f) {
  H(o, f), o.FS.rename(d, f);
}
const te = "[", re = "(<=>!~", oe = ";", ne = "@", se = new RegExp(
  `[${te + re + oe + ne}]`
);
function ae(o) {
  return o.split(se)[0].trim();
}
function z(o) {
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
  }), o.filter((f) => ae(f) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${f}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function ie(o) {
  var c;
  const d = typeof process < "u" && ((c = process.versions) == null ? void 0 : c.node);
  let f;
  d ? f = (await import(
    /* webpackIgnore: true */
    "./__vite-browser-external-CPvbk0mb.js"
  )).sep : f = "/";
  const u = o.slice(0, o.lastIndexOf(f) + 1);
  if (o.endsWith(".mjs")) {
    if (d) {
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
async function le(o, d) {
  const { scriptURL: f, pyodideIndexURL: u, isESModule: c } = await ie(o);
  let e;
  return c ? e = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    f
  )).loadPyodide : (importScripts(f), e = self.loadPyodide), e({ ...d, indexURL: u });
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
function de(o, d, f) {
  const u = o.pyimport("pyodide"), c = (r) => u.code.find_imports(r).toJs(), e = f.map((r) => c(r)), s = Array.from(new Set(e.flat())).filter((r) => !o.runPython(`__import__('importlib').util.find_spec('${r}')`)).map((r) => o._api._import_name_to_package_name.get(r)).filter((r) => r);
  if (s.length === 0)
    return Promise.resolve();
  const i = o.loadPackage(s);
  return d(s, i), i.then();
}
function j(o, d, f) {
  const u = de(o, d, f);
  o.runPython(`
def __set_module_auto_load_promise__(promise):
    from streamlit.runtime.scriptrunner import script_runner
    script_runner.moduleAutoLoadPromise = promise

__set_module_auto_load_promise__`)(u);
}
async function ue(o, d, f) {
  const { line: u, column: c } = f, e = o.Script(d);
  if (u > e._code_lines.length)
    return [];
  const t = e.complete.callKwargs({
    line: u,
    column: c,
    fuzzy: !1
  }), a = [];
  for (const s of t.toJs())
    a.push({
      name: s.name,
      type: s.$type,
      // PyProxy.type is overridden in Pyodide. We need to access it this way. Ref: https://github.com/pyodide/pyodide/issues/4032
      docstring: s.docstring.callKwargs({ raw: !0 })
    }), s.destroy();
  return a;
}
let I = null;
async function fe(o, d, f, u, c) {
  const { entrypoint: e, files: t, archives: a, requirements: s, prebuiltPackageNames: i, wheels: r, pyodideUrl: l = o, streamlitConfig: g, idbfsMountpoints: S, nodefsMountpoints: b, moduleAutoLoad: _, env: P, languageServer: C } = f, h = z(s);
  if (I)
    c("Pyodide is already loaded."), console.debug("Pyodide is already loaded.");
  else {
    c("Loading Pyodide."), console.debug("Loading Pyodide."), I = le(l, {
      stdout: console.log,
      stderr: console.error
    });
    const m = [];
    r && (m.push(r.streamlit), m.push(r.stliteLib)), C && m.push("jedi"), h.unshift(...m), console.debug("Loaded Pyodide");
  }
  const n = (
    // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await I
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
  }), c("Mounting files.");
  const v = [];
  await Promise.all(Object.keys(t).map(async (m) => {
    const y = t[m];
    m = R(d, m);
    let k;
    "url" in y ? (console.debug(`Fetch a file from ${y.url}`), k = await fetch(y.url).then((A) => A.arrayBuffer()).then((A) => new Uint8Array(A))) : k = y.data, console.debug(`Write a file "${m}"`), W(n, m, k, t.opts), m.endsWith(".py") && v.push(m);
  })), c("Unpacking archives."), await Promise.all(a.map(async (m) => {
    let y;
    "url" in m ? (console.debug(`Fetch an archive from ${m.url}`), y = await fetch(m.url).then((Q) => Q.arrayBuffer())) : y = m.buffer;
    const { format: k, options: A } = m;
    console.debug("Unpack an archive", { format: k, options: A }), n.unpackArchive(y, k, A);
  })), await n.loadPackage("micropip");
  const w = n.pyimport("micropip");
  if (c("Mocking some packages."), console.debug("Mock pyarrow"), ce(n), console.debug("Mocked pyarrow"), c("Installing packages."), console.debug("Installing the prebuilt packages:", i), await n.loadPackage(i), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", h), await w.install.callKwargs(h, { keep_going: !0 }), console.debug("Installed the requirements"), _) {
    const m = v.map((y) => n.FS.readFile(y, { encoding: "utf8" }));
    j(n, u, m);
  }
  await n.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), c("Loading streamlit package."), console.debug("Loading the Streamlit package"), await n.runPythonAsync(`
import streamlit.runtime
  `), console.debug("Loaded the Streamlit package"), c("Setting up the loggers."), console.debug("Setting the loggers"), await n.runPythonAsync(`
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

__setup_loggers__`), E = ((g == null ? void 0 : g["logger.level"]) ?? "INFO").toString(), x = (g == null ? void 0 : g["logger.messageFormat"]) ?? "%(asctime)s %(message)s";
  if (L(E, x, F), console.debug("Set the loggers"), c("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await n.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), p) {
    c("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
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
  c("Booting up the Streamlit server."), console.debug("Setting up the Streamlit configuration");
  const K = await n.runPython(`
def __bootstrap__(main_script_path, flag_options, shared_worker_mode):
    from stlite_lib.bootstrap import load_config_options, prepare

    load_config_options(flag_options, shared_worker_mode)

    prepare(main_script_path, [])

__bootstrap__`), D = R(d, e), G = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": !1,
    ...g,
    "runner.fastReruns": !1
    // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  }, X = d != null;
  K(D, n.toPy(G), X), console.debug("Set up the Streamlit configuration"), console.debug("Booting up the Streamlit server");
  const O = n.pyimport("stlite_lib.server.Server")(D, d ? B(d) : null);
  return await O.start(), console.debug("Booted up the Streamlit server"), {
    pyodide: n,
    httpServer: O,
    micropip: w,
    initData: f
  };
}
function q(o, d, f, u) {
  function c(s) {
    d({
      type: "event:progress",
      data: {
        message: s
      }
    });
  }
  const e = (s, i) => {
    const r = new MessageChannel();
    d({
      type: "event:moduleAutoLoad",
      data: {
        packagesToLoad: s
      }
    }, [r.port2]), i.then((l) => {
      r.port1.postMessage({
        type: "moduleAutoLoad:success",
        data: {
          loadedPackages: l
        }
      }), r.port1.close();
    }).catch((l) => {
      throw r.port1.postMessage({
        type: "moduleAutoLoad:error",
        error: l
      }), r.port1.close(), l;
    });
  };
  let t = null;
  const a = async (s) => {
    const i = s.data;
    if (i.type === "initData") {
      const n = i.data, p = {
        ...f,
        ...n
      };
      console.debug("Initial data", p), t = fe(o, u, p, e, c), t.then(() => {
        d({
          type: "event:loaded"
        });
      }).catch((v) => {
        console.error(v), d({
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
    const r = await t, l = r.pyodide;
    let g = r.httpServer;
    const S = r.micropip, { moduleAutoLoad: b, languageServer: _ } = r.initData, P = _ ? await l.pyimport("jedi") : null, C = s.ports[0];
    function h(n) {
      C.postMessage(n);
    }
    try {
      switch (i.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", i.data);
          const { entrypoint: n } = i.data;
          g.stop(), console.debug("Booting up the Streamlit server");
          const p = R(u, n);
          g = l.pyimport("stlite_lib.server.Server")(p), g.start(), console.debug("Booted up the Streamlit server"), h({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", i.data);
          const { path: n } = i.data;
          g.start_websocket(n, (p, v) => {
            if (v) {
              const w = p;
              try {
                const F = w.toJs(), L = F.buffer.slice(F.byteOffset, F.byteOffset + F.byteLength);
                d({
                  type: "websocket:message",
                  data: {
                    payload: L
                  }
                }, [L]);
              } finally {
                w.destroy();
              }
            } else
              d({
                type: "websocket:message",
                data: {
                  payload: p
                }
              });
          }), h({
            type: "reply"
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", i.data);
          const { payload: n } = i.data;
          g.receive_websocket_from_js(n);
          break;
        }
        case "http:request": {
          console.debug("http:request", i.data);
          const { request: n } = i.data, p = (v, w, F) => {
            const L = new Map(w.toJs()), E = F.toJs();
            console.debug({ statusCode: v, headers: L, body: E }), h({
              type: "http:response",
              data: {
                response: {
                  statusCode: v,
                  headers: L,
                  body: E
                }
              }
            });
          };
          g.receive_http_from_js(n.method, decodeURIComponent(n.path), n.headers, n.body, p);
          break;
        }
        case "file:write": {
          const { path: n, data: p, opts: v } = i.data, w = R(u, n);
          b && typeof p == "string" && w.endsWith(".py") && (console.debug(`Auto install the requirements in ${w}`), j(l, e, [p])), console.debug(`Write a file "${w}"`), W(l, w, p, v), h({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: n, newPath: p } = i.data, v = R(u, n), w = R(u, p);
          console.debug(`Rename "${v}" to ${w}`), ee(l, v, w), h({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: n } = i.data, p = R(u, n);
          console.debug(`Remove "${p}`), l.FS.unlink(p), h({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: n, opts: p } = i.data;
          console.debug(`Read "${n}"`);
          const v = l.FS.readFile(n, p);
          h({
            type: "reply:file:read",
            data: {
              content: v
            }
          });
          break;
        }
        case "install": {
          const { requirements: n } = i.data, p = z(n);
          console.debug("Install the requirements:", p), await S.install.callKwargs(p, { keep_going: !0 }).then(() => {
            console.debug("Successfully installed"), h({
              type: "reply"
            });
          });
          break;
        }
        case "setEnv": {
          const { env: n } = i.data;
          l.pyimport("os").environ.update(l.toPy(n)), console.debug("Successfully set the environment variables", n), h({
            type: "reply"
          });
          break;
        }
        case "code_completion": {
          if (!P)
            throw new Error("Jedi is not installed");
          const { code: n, line: p, column: v } = i.data, w = await ue(P, n, {
            line: p,
            column: v
          });
          h({
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
      p.name = n.name, p.stack = n.stack, h({
        type: "reply",
        error: p
      });
    }
  };
  return d({
    type: "event:start"
  }), a;
}
const J = "abcdefghijklmnopqrstuvwxyz", ge = J.length;
function me(o) {
  let d = "";
  for (let f = 0; f < o; f++) {
    const u = Math.floor(Math.random() * ge);
    d += J[u];
  }
  return d;
}
const $ = "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = q($, (o, d) => d ? self.postMessage(o, d) : self.postMessage(o));
else {
  const o = [];
  self.onconnect = (d) => {
    let f;
    do
      f = me(4);
    while (o.includes(f));
    o.push(f), console.debug("SharedWorker mode.", { appId: f });
    const u = d.ports[0];
    u.onmessage = q($, (c, e) => e ? u.postMessage(c, e) : u.postMessage(c), void 0, f), u.start();
  };
}
//# sourceMappingURL=worker-Dv43gf2S.js.map
