function Y(r) {
  return r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function S(r) {
  if (typeof r != "string")
    throw new TypeError("Path must be a string. Received " + JSON.stringify(r));
}
function D(r, e) {
  for (var t = "", o = 0, n = -1, i = 0, s, a = 0; a <= r.length; ++a) {
    if (a < r.length)
      s = r.charCodeAt(a);
    else {
      if (s === 47)
        break;
      s = 47;
    }
    if (s === 47) {
      if (!(n === a - 1 || i === 1)) if (n !== a - 1 && i === 2) {
        if (t.length < 2 || o !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
          if (t.length > 2) {
            var c = t.lastIndexOf("/");
            if (c !== t.length - 1) {
              c === -1 ? (t = "", o = 0) : (t = t.slice(0, c), o = t.length - 1 - t.lastIndexOf("/")), n = a, i = 0;
              continue;
            }
          } else if (t.length === 2 || t.length === 1) {
            t = "", o = 0, n = a, i = 0;
            continue;
          }
        }
        e && (t.length > 0 ? t += "/.." : t = "..", o = 2);
      } else
        t.length > 0 ? t += "/" + r.slice(n + 1, a) : t = r.slice(n + 1, a), o = a - n - 1;
      n = a, i = 0;
    } else s === 46 && i !== -1 ? ++i : i = -1;
  }
  return t;
}
function Z(r, e) {
  var t = e.dir || e.root, o = e.base || (e.name || "") + (e.ext || "");
  return t ? t === e.root ? t + o : t + r + o : o;
}
var L = {
  // path.resolve([from ...], to)
  resolve: function() {
    for (var e = "", t = !1, o, n = arguments.length - 1; n >= -1 && !t; n--) {
      var i;
      n >= 0 ? i = arguments[n] : (o === void 0 && (o = process.cwd()), i = o), S(i), i.length !== 0 && (e = i + "/" + e, t = i.charCodeAt(0) === 47);
    }
    return e = D(e, !t), t ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
  },
  normalize: function(e) {
    if (S(e), e.length === 0) return ".";
    var t = e.charCodeAt(0) === 47, o = e.charCodeAt(e.length - 1) === 47;
    return e = D(e, !t), e.length === 0 && !t && (e = "."), e.length > 0 && o && (e += "/"), t ? "/" + e : e;
  },
  isAbsolute: function(e) {
    return S(e), e.length > 0 && e.charCodeAt(0) === 47;
  },
  join: function() {
    if (arguments.length === 0)
      return ".";
    for (var e, t = 0; t < arguments.length; ++t) {
      var o = arguments[t];
      S(o), o.length > 0 && (e === void 0 ? e = o : e += "/" + o);
    }
    return e === void 0 ? "." : L.normalize(e);
  },
  relative: function(e, t) {
    if (S(e), S(t), e === t || (e = L.resolve(e), t = L.resolve(t), e === t)) return "";
    for (var o = 1; o < e.length && e.charCodeAt(o) === 47; ++o)
      ;
    for (var n = e.length, i = n - o, s = 1; s < t.length && t.charCodeAt(s) === 47; ++s)
      ;
    for (var a = t.length, c = a - s, g = i < c ? i : c, m = -1, d = 0; d <= g; ++d) {
      if (d === g) {
        if (c > g) {
          if (t.charCodeAt(s + d) === 47)
            return t.slice(s + d + 1);
          if (d === 0)
            return t.slice(s + d);
        } else i > g && (e.charCodeAt(o + d) === 47 ? m = d : d === 0 && (m = 0));
        break;
      }
      var y = e.charCodeAt(o + d), F = t.charCodeAt(s + d);
      if (y !== F)
        break;
      y === 47 && (m = d);
    }
    var v = "";
    for (d = o + m + 1; d <= n; ++d)
      (d === n || e.charCodeAt(d) === 47) && (v.length === 0 ? v += ".." : v += "/..");
    return v.length > 0 ? v + t.slice(s + m) : (s += m, t.charCodeAt(s) === 47 && ++s, t.slice(s));
  },
  _makeLong: function(e) {
    return e;
  },
  dirname: function(e) {
    if (S(e), e.length === 0) return ".";
    for (var t = e.charCodeAt(0), o = t === 47, n = -1, i = !0, s = e.length - 1; s >= 1; --s)
      if (t = e.charCodeAt(s), t === 47) {
        if (!i) {
          n = s;
          break;
        }
      } else
        i = !1;
    return n === -1 ? o ? "/" : "." : o && n === 1 ? "//" : e.slice(0, n);
  },
  basename: function(e, t) {
    if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
    S(e);
    var o = 0, n = -1, i = !0, s;
    if (t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t.length === e.length && t === e) return "";
      var a = t.length - 1, c = -1;
      for (s = e.length - 1; s >= 0; --s) {
        var g = e.charCodeAt(s);
        if (g === 47) {
          if (!i) {
            o = s + 1;
            break;
          }
        } else
          c === -1 && (i = !1, c = s + 1), a >= 0 && (g === t.charCodeAt(a) ? --a === -1 && (n = s) : (a = -1, n = c));
      }
      return o === n ? n = c : n === -1 && (n = e.length), e.slice(o, n);
    } else {
      for (s = e.length - 1; s >= 0; --s)
        if (e.charCodeAt(s) === 47) {
          if (!i) {
            o = s + 1;
            break;
          }
        } else n === -1 && (i = !1, n = s + 1);
      return n === -1 ? "" : e.slice(o, n);
    }
  },
  extname: function(e) {
    S(e);
    for (var t = -1, o = 0, n = -1, i = !0, s = 0, a = e.length - 1; a >= 0; --a) {
      var c = e.charCodeAt(a);
      if (c === 47) {
        if (!i) {
          o = a + 1;
          break;
        }
        continue;
      }
      n === -1 && (i = !1, n = a + 1), c === 46 ? t === -1 ? t = a : s !== 1 && (s = 1) : t !== -1 && (s = -1);
    }
    return t === -1 || n === -1 || // We saw a non-dot character immediately before the dot
    s === 0 || // The (right-most) trimmed path component is exactly '..'
    s === 1 && t === n - 1 && t === o + 1 ? "" : e.slice(t, n);
  },
  format: function(e) {
    if (e === null || typeof e != "object")
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
    return Z("/", e);
  },
  parse: function(e) {
    S(e);
    var t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0) return t;
    var o = e.charCodeAt(0), n = o === 47, i;
    n ? (t.root = "/", i = 1) : i = 0;
    for (var s = -1, a = 0, c = -1, g = !0, m = e.length - 1, d = 0; m >= i; --m) {
      if (o = e.charCodeAt(m), o === 47) {
        if (!g) {
          a = m + 1;
          break;
        }
        continue;
      }
      c === -1 && (g = !1, c = m + 1), o === 46 ? s === -1 ? s = m : d !== 1 && (d = 1) : s !== -1 && (d = -1);
    }
    return s === -1 || c === -1 || // We saw a non-dot character immediately before the dot
    d === 0 || // The (right-most) trimmed path component is exactly '..'
    d === 1 && s === c - 1 && s === a + 1 ? c !== -1 && (a === 0 && n ? t.base = t.name = e.slice(1, c) : t.base = t.name = e.slice(a, c)) : (a === 0 && n ? (t.name = e.slice(1, s), t.base = e.slice(1, c)) : (t.name = e.slice(a, s), t.base = e.slice(a, c)), t.ext = e.slice(s, c)), a > 0 ? t.dir = e.slice(0, a - 1) : n && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
L.posix = L;
var ee = L, E = /* @__PURE__ */ Y(ee);
const N = "/home/pyodide", z = (r) => `${N}/${r}`, C = (r, e) => r == null ? E.resolve(N, e) : E.resolve(z(r), e);
function U(r, e) {
  const t = E.normalize(e), n = E.dirname(t).split("/"), i = [];
  for (const s of n) {
    i.push(s);
    const a = i.join("/");
    if (r.FS.analyzePath(a).exists) {
      if (r.FS.isDir(a))
        throw new Error(`"${a}" already exists and is not a directory.`);
      continue;
    }
    try {
      r.FS.mkdir(a);
    } catch (c) {
      throw console.error(`Failed to create a directory "${a}"`), c;
    }
  }
}
function $(r, e, t, o) {
  U(r, e), r.FS.writeFile(e, t, o);
}
function te(r, e, t) {
  U(r, t), r.FS.rename(e, t);
}
const re = "[", oe = "(<=>!~", ne = ";", se = "@", ie = new RegExp(
  `[${re + oe + ne + se}]`
);
function ae(r) {
  return r.split(ie)[0].trim();
}
function q(r) {
  return r.forEach((t) => {
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
  }), r.filter((t) => ae(t) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${t}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function le(r) {
  const e = typeof process < "u" && process.versions?.node;
  let t;
  e ? t = (await import(
    /* webpackIgnore: true */
    "./__vite-browser-external-CPvbk0mb.js"
  )).sep : t = "/";
  const o = r.slice(0, r.lastIndexOf(t) + 1);
  if (r.endsWith(".mjs")) {
    if (e) {
      const n = await import(
        /* webpackIgnore: true */
        "./__vite-browser-external-CPvbk0mb.js"
      ), i = await import(
        /* webpackIgnore: true */
        "./__vite-browser-external-CPvbk0mb.js"
      );
      !r.includes("://") && n.isAbsolute(r) && (r = i.pathToFileURL(r).href);
    }
    return {
      scriptURL: r,
      pyodideIndexURL: o,
      isESModule: !0
    };
  } else
    return {
      scriptURL: r,
      pyodideIndexURL: o,
      isESModule: !1
    };
}
async function ce(r, e) {
  const { scriptURL: t, pyodideIndexURL: o, isESModule: n } = await le(r);
  let i;
  return n ? i = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    t
  )).loadPyodide : (importScripts(t), i = self.loadPyodide), i({ ...e, indexURL: o });
}
function de(r) {
  r.runPython(`
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
function ue(r, e, t) {
  const o = r.pyimport("pyodide"), n = (m) => o.code.find_imports(m).toJs(), i = t.map((m) => n(m)), c = Array.from(new Set(i.flat())).filter((m) => !r.runPython(`__import__('importlib').util.find_spec('${m}')`)).map((m) => r._api._import_name_to_package_name.get(m)).filter((m) => m);
  if (c.length === 0)
    return Promise.resolve();
  const g = r.loadPackage(c);
  return e(c, g), g.then();
}
function H(r, e, t) {
  const o = ue(r, e, t);
  r.runPython(`
def __set_module_auto_load_promise__(promise):
    from streamlit.runtime.scriptrunner import script_runner
    script_runner.moduleAutoLoadPromise = promise

__set_module_auto_load_promise__`)(o);
}
const me = async (r) => {
  await r.runPythonAsync(`import jedi
import re
import json
from typing import Dict
from lsprotocol.types import (CompletionItem, CompletionList, CompletionItemKind, Position, Range, TextEdit)
from lsprotocol import converters as lsp_converters
from jedi.api.classes import Completion

def as_completion_item_kind(kind: str):
  match kind:
    case 'class':
      return CompletionItemKind.Class
    case 'function':
      return CompletionItemKind.Function
    case 'instance':
      return CompletionItemKind.Reference
    case 'keyword':
      return CompletionItemKind.Keyword
    case 'module':
      return CompletionItemKind.Module
    case 'param':
      return CompletionItemKind.Variable
    case 'path':
      return CompletionItemKind.File
    case 'property':
      return CompletionItemKind.Property
    case 'statement':
      return CompletionItemKind.Variable
    case _:
      return CompletionItemKind.Text

def as_completion_item_sort_text(item: Completion) -> str:
  """Generate sorting text to arrange items alphabetically,
  ensuring parameters are prioritized first
  and private magic properties come last.
  """
  completion_item_name = item.name
  if completion_item_name is None or completion_item_name.startswith('_'):
     return f"zz{completion_item_name}"
  elif item.type == "param" and completion_item_name.endswith("="):
     return f"aa{completion_item_name}"
  else:
      return f"bb{completion_item_name}"

def as_completion_item(completion: Completion, cursor_range: Range) -> Dict:
  label = completion.name
  return CompletionItem(
      label=label,
      filter_text=label,
      sort_text=as_completion_item_sort_text(completion),
      kind=as_completion_item_kind(completion.type),
      documentation=completion.docstring(raw=True),
      text_edit=TextEdit(range=cursor_range, new_text=label),
  )

def get_text_edit_cursor_range(cursor_code_line: str, current_line_number: int, cursor_offset: int):
  # Match the substring starting from cursor_offset ex: math<cursor>co, match co
  matched_words = re.search(r'\\b\\w+\\b', cursor_code_line[cursor_offset :])

  # Determine the length of the matched word characters
  word_after_cursor_length = len(matched_words.group()) if matched_words else 0

  # This will tell to code editors which text to edit/replace
  return Range(
    start=Position(
        line=current_line_number, character=cursor_offset
    ),
    end=Position(
        line=current_line_number,
        character=cursor_offset + word_after_cursor_length,
    ),
  )

def get_code_completions(code: str, current_line_number: int, cursor_offset: int):

  jedi_language_server = jedi.Script(code)

  # jedi returns a zero-based array with lines
  jedi_line_number_index = current_line_number -1

  # In case if we are not getting any results back or the offset is wrong
  # Just return empty list
  if jedi_line_number_index >= len(jedi_language_server._code_lines):
   return json.dumps({ "items": []})

  jedi_completions_list = jedi_language_server.complete(
      current_line_number,
      cursor_offset,
      fuzzy=False,
  )

  code_at_cursor = jedi_language_server._code_lines[jedi_line_number_index]
  cursor_range = get_text_edit_cursor_range(code_at_cursor, current_line_number, cursor_offset)

  # Convert jedi completion items as completion items compatible in language server
  suggestions = CompletionList(
    is_incomplete=False,
    items=list(as_completion_item(completion, cursor_range) for completion in jedi_completions_list))

  # Convert results to JSON so that we can use it in the worker
  converter = lsp_converters.get_converter()
  return json.dumps(converter.unstructure(suggestions, unstructure_as=CompletionList))
`);
}, ge = async (r, e) => {
  let t;
  try {
    if (t = e.globals.get("get_code_completions"), !t)
      return console.error("Can not generate suggestions list, the get_code_completions function is not defined"), { items: [] };
    const o = t(r.code, r.line, r.column);
    return o ? JSON.parse(o) : { items: [] };
  } catch (o) {
    return console.error(o), { items: [] };
  } finally {
    t && t.constructor.name === "PyProxy" && t.destroy();
  }
}, fe = async (r, e) => {
  try {
    console.debug("Importing jedi Interpreter"), await e.install.callKwargs(["jedi", "lsprotocol"], {
      keep_going: !0
    }), await me(r);
  } catch (t) {
    console.error("Error while importing jedi", t);
  }
};
let M = null;
async function pe(r, e, t, o, n) {
  const { entrypoint: i, files: s, archives: a, requirements: c, prebuiltPackageNames: g, wheels: m, pyodideUrl: d = r, streamlitConfig: y, idbfsMountpoints: F, nodefsMountpoints: v, moduleAutoLoad: I, env: b, languageServer: u } = t, p = q(c);
  M ? (n("Pyodide is already loaded."), console.debug("Pyodide is already loaded.")) : (n("Loading Pyodide."), console.debug("Loading Pyodide."), M = ce(d, {
    stdout: console.log,
    stderr: console.error
  }), m && (p.unshift(m.streamlit), p.unshift(m.stliteLib)), console.debug("Loaded Pyodide"));
  const l = (
    // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await M
  );
  if (b) {
    console.debug("Setting environment variables", b);
    const f = l.pyimport("os");
    f.environ.update(l.toPy(b)), console.debug("Set environment variables", f.environ);
  }
  let h = !1;
  F && (h = !0, F.forEach((f) => {
    l.FS.mkdir(f), l.FS.mount(l.FS.filesystems.IDBFS, {}, f);
  }), await new Promise((f, _) => {
    l.FS.syncfs(!0, (w) => {
      w ? _(w) : f();
    });
  })), v && Object.entries(v).forEach(([f, _]) => {
    l.FS.mkdir(f), l.FS.mount(l.FS.filesystems.NODEFS, { root: _ }, f);
  }), n("Mounting files.");
  const P = [];
  await Promise.all(Object.keys(s).map(async (f) => {
    const _ = s[f];
    f = C(e, f);
    let w;
    "url" in _ ? (console.debug(`Fetch a file from ${_.url}`), w = await fetch(_.url).then((k) => k.arrayBuffer()).then((k) => new Uint8Array(k))) : w = _.data, console.debug(`Write a file "${f}"`), $(l, f, w, s.opts), f.endsWith(".py") && P.push(f);
  })), n("Unpacking archives."), await Promise.all(a.map(async (f) => {
    let _;
    "url" in f ? (console.debug(`Fetch an archive from ${f.url}`), _ = await fetch(f.url).then((Q) => Q.arrayBuffer())) : _ = f.buffer;
    const { format: w, options: k } = f;
    console.debug("Unpack an archive", { format: w, options: k }), l.unpackArchive(_, w, k);
  })), await l.loadPackage("micropip");
  const A = l.pyimport("micropip");
  if (n("Mocking some packages."), console.debug("Mock pyarrow"), de(l), console.debug("Mocked pyarrow"), n("Installing packages."), console.debug("Installing the prebuilt packages:", g), await l.loadPackage(g), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", p), await A.install.callKwargs(p, { keep_going: !0 }), console.debug("Installed the requirements"), I) {
    const f = P.map((_) => l.FS.readFile(_, { encoding: "utf8" }));
    H(l, o, f);
  }
  await l.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), n("Loading streamlit package."), console.debug("Loading the Streamlit package"), await l.runPythonAsync(`
import streamlit.runtime
  `), console.debug("Loaded the Streamlit package"), n("Setting up the loggers."), console.debug("Setting the loggers"), await l.runPythonAsync(`
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
  const R = (f, _) => {
    f >= 40 ? console.error(_) : f >= 30 ? console.warn(_) : f >= 20 ? console.info(_) : console.debug(_);
  }, W = l.runPython(`
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

__setup_loggers__`), B = (y?.["logger.level"] ?? "INFO").toString(), J = y?.["logger.messageFormat"] ?? "%(asctime)s %(message)s";
  if (W(B, J, R), console.debug("Set the loggers"), n("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await l.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), h) {
    n("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
    let f = !1;
    const _ = () => {
      console.debug("The script has finished. Syncing the filesystem."), f || (f = !0, l.FS.syncfs(!1, (k) => {
        f = !1, k && console.error(k);
      }));
    };
    (await l.runPython(`
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

__setup_script_finished_callback__`))(_), console.debug("Set up the IndexedDB filesystem synchronizer");
  }
  u && (n("Importing Language Server"), await fe(l, A)), n("Booting up the Streamlit server."), console.debug("Setting up the Streamlit configuration");
  const G = await l.runPython(`
def __bootstrap__(main_script_path, flag_options, shared_worker_mode):
    from stlite_lib.bootstrap import load_config_options, prepare

    load_config_options(flag_options, shared_worker_mode)

    prepare(main_script_path, [])

__bootstrap__`), T = C(e, i), V = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": !1,
    ...y,
    "runner.fastReruns": !1
    // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  }, X = e != null;
  G(T, l.toPy(V), X), console.debug("Set up the Streamlit configuration"), console.debug("Booting up the Streamlit server");
  const j = l.pyimport("stlite_lib.server.Server")(T, e ? z(e) : null);
  return await j.start(), console.debug("Booted up the Streamlit server"), {
    pyodide: l,
    httpServer: j,
    micropip: A,
    initData: t
  };
}
function x(r, e, t, o) {
  function n(c) {
    e({
      type: "event:progress",
      data: {
        message: c
      }
    });
  }
  const i = (c, g) => {
    const m = new MessageChannel();
    e({
      type: "event:moduleAutoLoad",
      data: {
        packagesToLoad: c
      }
    }, m.port2), g.then((d) => {
      m.port1.postMessage({
        type: "moduleAutoLoad:success",
        data: {
          loadedPackages: d
        }
      }), m.port1.close();
    }).catch((d) => {
      throw m.port1.postMessage({
        type: "moduleAutoLoad:error",
        error: d
      }), m.port1.close(), d;
    });
  };
  let s = null;
  const a = async (c) => {
    const g = c.data;
    if (g.type === "initData") {
      const u = g.data, p = {
        ...t,
        ...u
      };
      console.debug("Initial data", p), s = pe(r, o, p, i, n), s.then(() => {
        e({
          type: "event:loaded"
        });
      }).catch((l) => {
        console.error(l), e({
          type: "event:error",
          data: {
            error: l
          }
        });
      });
      return;
    }
    if (!s)
      throw new Error("Pyodide initialization has not been started yet.");
    const m = await s, d = m.pyodide;
    let y = m.httpServer;
    const F = m.micropip, { moduleAutoLoad: v } = m.initData, I = c.ports[0];
    function b(u) {
      I.postMessage(u);
    }
    try {
      switch (g.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", g.data);
          const { entrypoint: u } = g.data;
          y.stop(), console.debug("Booting up the Streamlit server");
          const p = C(o, u);
          y = d.pyimport("stlite_lib.server.Server")(p), y.start(), console.debug("Booted up the Streamlit server"), b({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", g.data);
          const { path: u } = g.data;
          y.start_websocket(u, (p, l) => {
            if (l) {
              const h = p, P = h.getBuffer("u8");
              h.destroy();
              const A = new Uint8ClampedArray(P.data.buffer, P.data.byteOffset, P.data.byteLength);
              e({
                type: "websocket:message",
                data: {
                  payload: new Uint8Array(A)
                }
              });
            } else
              e({
                type: "websocket:message",
                data: {
                  payload: p
                }
              });
          }), b({
            type: "reply"
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", g.data);
          const { payload: u } = g.data;
          y.receive_websocket_from_js(u);
          break;
        }
        case "http:request": {
          console.debug("http:request", g.data);
          const { request: u } = g.data, p = (l, h, P) => {
            const A = new Map(h.toJs()), R = P.toJs();
            console.debug({ statusCode: l, headers: A, body: R }), b({
              type: "http:response",
              data: {
                response: {
                  statusCode: l,
                  headers: A,
                  body: R
                }
              }
            });
          };
          y.receive_http_from_js(u.method, decodeURIComponent(u.path), u.headers, u.body, p);
          break;
        }
        case "file:write": {
          const { path: u, data: p, opts: l } = g.data, h = C(o, u);
          v && typeof p == "string" && h.endsWith(".py") && (console.debug(`Auto install the requirements in ${h}`), H(d, i, [p])), console.debug(`Write a file "${h}"`), $(d, h, p, l), b({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: u, newPath: p } = g.data, l = C(o, u), h = C(o, p);
          console.debug(`Rename "${l}" to ${h}`), te(d, l, h), b({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: u } = g.data, p = C(o, u);
          console.debug(`Remove "${p}`), d.FS.unlink(p), b({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: u, opts: p } = g.data;
          console.debug(`Read "${u}"`);
          const l = d.FS.readFile(u, p);
          b({
            type: "reply:file:read",
            data: {
              content: l
            }
          });
          break;
        }
        case "install": {
          const { requirements: u } = g.data, p = q(u);
          console.debug("Install the requirements:", p), await F.install.callKwargs(p, { keep_going: !0 }).then(() => {
            console.debug("Successfully installed"), b({
              type: "reply"
            });
          });
          break;
        }
        case "setEnv": {
          const { env: u } = g.data;
          d.pyimport("os").environ.update(d.toPy(u)), console.debug("Successfully set the environment variables", u), b({
            type: "reply"
          });
          break;
        }
        case "language-server:code_completion": {
          const u = await ge(g.data, d);
          b({
            type: "reply:language-server:code_completion",
            data: u
          });
          break;
        }
      }
    } catch (u) {
      if (console.error(u), !(u instanceof Error))
        throw u;
      const p = new Error(u.message);
      p.name = u.name, p.stack = u.stack, b({
        type: "reply",
        error: p
      });
    }
  };
  return e({
    type: "event:start"
  }), a;
}
const K = "abcdefghijklmnopqrstuvwxyz", _e = K.length;
function he(r) {
  let e = "";
  for (let t = 0; t < r; t++) {
    const o = Math.floor(Math.random() * _e);
    e += K[o];
  }
  return e;
}
const O = "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = x(O, (r, e) => e ? self.postMessage(r, [e]) : self.postMessage(r));
else {
  const r = [];
  self.onconnect = (e) => {
    let t;
    do
      t = he(4);
    while (r.includes(t));
    r.push(t), console.debug("SharedWorker mode.", { appId: t });
    const o = e.ports[0];
    o.onmessage = x(O, (n, i) => i ? o.postMessage(n, [i]) : o.postMessage(n), void 0, t), o.start();
  };
}
//# sourceMappingURL=worker-Dy6BsLcj.js.map
