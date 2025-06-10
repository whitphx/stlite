function Q(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var E, j;
function Y() {
  if (j) return E;
  j = 1;
  function o(l) {
    if (typeof l != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(l));
  }
  function c(l, e) {
    for (var t = "", i = 0, s = -1, n = 0, r, a = 0; a <= l.length; ++a) {
      if (a < l.length)
        r = l.charCodeAt(a);
      else {
        if (r === 47)
          break;
        r = 47;
      }
      if (r === 47) {
        if (!(s === a - 1 || n === 1)) if (s !== a - 1 && n === 2) {
          if (t.length < 2 || i !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var p = t.lastIndexOf("/");
              if (p !== t.length - 1) {
                p === -1 ? (t = "", i = 0) : (t = t.slice(0, p), i = t.length - 1 - t.lastIndexOf("/")), s = a, n = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", i = 0, s = a, n = 0;
              continue;
            }
          }
          e && (t.length > 0 ? t += "/.." : t = "..", i = 2);
        } else
          t.length > 0 ? t += "/" + l.slice(s + 1, a) : t = l.slice(s + 1, a), i = a - s - 1;
        s = a, n = 0;
      } else r === 46 && n !== -1 ? ++n : n = -1;
    }
    return t;
  }
  function d(l, e) {
    var t = e.dir || e.root, i = e.base || (e.name || "") + (e.ext || "");
    return t ? t === e.root ? t + i : t + l + i : i;
  }
  var m = {
    // path.resolve([from ...], to)
    resolve: function() {
      for (var e = "", t = !1, i, s = arguments.length - 1; s >= -1 && !t; s--) {
        var n;
        s >= 0 ? n = arguments[s] : (i === void 0 && (i = process.cwd()), n = i), o(n), n.length !== 0 && (e = n + "/" + e, t = n.charCodeAt(0) === 47);
      }
      return e = c(e, !t), t ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
    },
    normalize: function(e) {
      if (o(e), e.length === 0) return ".";
      var t = e.charCodeAt(0) === 47, i = e.charCodeAt(e.length - 1) === 47;
      return e = c(e, !t), e.length === 0 && !t && (e = "."), e.length > 0 && i && (e += "/"), t ? "/" + e : e;
    },
    isAbsolute: function(e) {
      return o(e), e.length > 0 && e.charCodeAt(0) === 47;
    },
    join: function() {
      if (arguments.length === 0)
        return ".";
      for (var e, t = 0; t < arguments.length; ++t) {
        var i = arguments[t];
        o(i), i.length > 0 && (e === void 0 ? e = i : e += "/" + i);
      }
      return e === void 0 ? "." : m.normalize(e);
    },
    relative: function(e, t) {
      if (o(e), o(t), e === t || (e = m.resolve(e), t = m.resolve(t), e === t)) return "";
      for (var i = 1; i < e.length && e.charCodeAt(i) === 47; ++i)
        ;
      for (var s = e.length, n = s - i, r = 1; r < t.length && t.charCodeAt(r) === 47; ++r)
        ;
      for (var a = t.length, p = a - r, S = n < p ? n : p, b = -1, h = 0; h <= S; ++h) {
        if (h === S) {
          if (p > S) {
            if (t.charCodeAt(r + h) === 47)
              return t.slice(r + h + 1);
            if (h === 0)
              return t.slice(r + h);
          } else n > S && (e.charCodeAt(i + h) === 47 ? b = h : h === 0 && (b = 0));
          break;
        }
        var v = e.charCodeAt(i + h), g = t.charCodeAt(r + h);
        if (v !== g)
          break;
        v === 47 && (b = h);
      }
      var _ = "";
      for (h = i + b + 1; h <= s; ++h)
        (h === s || e.charCodeAt(h) === 47) && (_.length === 0 ? _ += ".." : _ += "/..");
      return _.length > 0 ? _ + t.slice(r + b) : (r += b, t.charCodeAt(r) === 47 && ++r, t.slice(r));
    },
    _makeLong: function(e) {
      return e;
    },
    dirname: function(e) {
      if (o(e), e.length === 0) return ".";
      for (var t = e.charCodeAt(0), i = t === 47, s = -1, n = !0, r = e.length - 1; r >= 1; --r)
        if (t = e.charCodeAt(r), t === 47) {
          if (!n) {
            s = r;
            break;
          }
        } else
          n = !1;
      return s === -1 ? i ? "/" : "." : i && s === 1 ? "//" : e.slice(0, s);
    },
    basename: function(e, t) {
      if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
      o(e);
      var i = 0, s = -1, n = !0, r;
      if (t !== void 0 && t.length > 0 && t.length <= e.length) {
        if (t.length === e.length && t === e) return "";
        var a = t.length - 1, p = -1;
        for (r = e.length - 1; r >= 0; --r) {
          var S = e.charCodeAt(r);
          if (S === 47) {
            if (!n) {
              i = r + 1;
              break;
            }
          } else
            p === -1 && (n = !1, p = r + 1), a >= 0 && (S === t.charCodeAt(a) ? --a === -1 && (s = r) : (a = -1, s = p));
        }
        return i === s ? s = p : s === -1 && (s = e.length), e.slice(i, s);
      } else {
        for (r = e.length - 1; r >= 0; --r)
          if (e.charCodeAt(r) === 47) {
            if (!n) {
              i = r + 1;
              break;
            }
          } else s === -1 && (n = !1, s = r + 1);
        return s === -1 ? "" : e.slice(i, s);
      }
    },
    extname: function(e) {
      o(e);
      for (var t = -1, i = 0, s = -1, n = !0, r = 0, a = e.length - 1; a >= 0; --a) {
        var p = e.charCodeAt(a);
        if (p === 47) {
          if (!n) {
            i = a + 1;
            break;
          }
          continue;
        }
        s === -1 && (n = !1, s = a + 1), p === 46 ? t === -1 ? t = a : r !== 1 && (r = 1) : t !== -1 && (r = -1);
      }
      return t === -1 || s === -1 || // We saw a non-dot character immediately before the dot
      r === 0 || // The (right-most) trimmed path component is exactly '..'
      r === 1 && t === s - 1 && t === i + 1 ? "" : e.slice(t, s);
    },
    format: function(e) {
      if (e === null || typeof e != "object")
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
      return d("/", e);
    },
    parse: function(e) {
      o(e);
      var t = { root: "", dir: "", base: "", ext: "", name: "" };
      if (e.length === 0) return t;
      var i = e.charCodeAt(0), s = i === 47, n;
      s ? (t.root = "/", n = 1) : n = 0;
      for (var r = -1, a = 0, p = -1, S = !0, b = e.length - 1, h = 0; b >= n; --b) {
        if (i = e.charCodeAt(b), i === 47) {
          if (!S) {
            a = b + 1;
            break;
          }
          continue;
        }
        p === -1 && (S = !1, p = b + 1), i === 46 ? r === -1 ? r = b : h !== 1 && (h = 1) : r !== -1 && (h = -1);
      }
      return r === -1 || p === -1 || // We saw a non-dot character immediately before the dot
      h === 0 || // The (right-most) trimmed path component is exactly '..'
      h === 1 && r === p - 1 && r === a + 1 ? p !== -1 && (a === 0 && s ? t.base = t.name = e.slice(1, p) : t.base = t.name = e.slice(a, p)) : (a === 0 && s ? (t.name = e.slice(1, r), t.base = e.slice(1, p)) : (t.name = e.slice(a, r), t.base = e.slice(a, p)), t.ext = e.slice(r, p)), a > 0 ? t.dir = e.slice(0, a - 1) : s && (t.dir = "/"), t;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  return m.posix = m, E = m, E;
}
var Z = Y(), R = /* @__PURE__ */ Q(Z);
const O = "/home/pyodide", N = (o) => `${O}/${o}`, F = (o, c) => o == null ? R.resolve(O, c) : R.resolve(N(o), c);
function z(o, c) {
  const d = R.normalize(c), l = R.dirname(d).split("/"), e = [];
  for (const t of l) {
    e.push(t);
    const i = e.join("/");
    if (o.FS.analyzePath(i).exists) {
      if (o.FS.isDir(i))
        throw new Error(`"${i}" already exists and is not a directory.`);
      continue;
    }
    try {
      o.FS.mkdir(i);
    } catch (s) {
      throw console.error(`Failed to create a directory "${i}"`), s;
    }
  }
}
function q(o, c, d, m) {
  z(o, c), o.FS.writeFile(c, d, m);
}
function ee(o, c, d) {
  z(o, d), o.FS.rename(c, d);
}
const te = "[", re = "(<=>!~", oe = ";", ne = "@", se = new RegExp(
  `[${te + re + oe + ne}]`
);
function ie(o) {
  return o.split(se)[0].trim();
}
function U(o) {
  return o.forEach((d) => {
    let m;
    try {
      m = new URL(d);
    } catch {
      return;
    }
    if (m.protocol === "emfs:" || m.protocol === "file:")
      throw new Error(
        `"emfs:" and "file:" protocols are not allowed for the requirement (${d})`
      );
  }), o.filter((d) => ie(d) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${d}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function ae(o) {
  var l;
  const c = typeof process < "u" && ((l = process.versions) == null ? void 0 : l.node);
  let d;
  c ? d = (await import(
    /* webpackIgnore: true */
    "./__vite-browser-external-CPvbk0mb.js"
  )).sep : d = "/";
  const m = o.slice(0, o.lastIndexOf(d) + 1);
  if (o.endsWith(".mjs")) {
    if (c) {
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
      pyodideIndexURL: m,
      isESModule: !0
    };
  } else
    return {
      scriptURL: o,
      pyodideIndexURL: m,
      isESModule: !1
    };
}
async function le(o, c) {
  const { scriptURL: d, pyodideIndexURL: m, isESModule: l } = await ae(o);
  let e;
  return l ? e = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    d
  )).loadPyodide : (importScripts(d), e = self.loadPyodide), e({ ...c, indexURL: m });
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
function de(o, c, d) {
  const m = o.pyimport("pyodide"), l = (r) => m.code.find_imports(r).toJs(), e = d.map((r) => l(r)), s = Array.from(new Set(e.flat())).filter((r) => !o.runPython(`__import__('importlib').util.find_spec('${r}')`)).map((r) => o._api._import_name_to_package_name.get(r)).filter((r) => r);
  if (s.length === 0)
    return Promise.resolve();
  const n = o.loadPackage(s);
  return c(s, n), n.then();
}
function $(o, c, d) {
  const m = de(o, c, d);
  o.runPython(`
def __set_module_auto_load_promise__(promise):
    from streamlit.runtime.scriptrunner import script_runner
    script_runner.moduleAutoLoadPromise = promise

__set_module_auto_load_promise__`)(m);
}
const ue = async (o) => {
  await o.runPythonAsync(`import jedi
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
}, me = async (o, c) => {
  let d;
  try {
    if (d = c.globals.get("get_code_completions"), !d)
      return console.error("Can not generate suggestions list, the get_code_completions function is not defined"), { items: [] };
    const m = d(o.code, o.line, o.column);
    return m ? JSON.parse(m) : { items: [] };
  } catch (m) {
    return console.error(m), { items: [] };
  } finally {
    d && d.constructor.name === "PyProxy" && d.destroy();
  }
};
let I = null;
async function ge(o, c, d, m, l) {
  const { entrypoint: e, files: t, archives: i, requirements: s, prebuiltPackageNames: n, wheels: r, pyodideUrl: a = o, streamlitConfig: p, idbfsMountpoints: S, nodefsMountpoints: b, moduleAutoLoad: h, env: v, languageServer: g } = d, _ = U(s);
  if (I)
    l("Pyodide is already loaded."), console.debug("Pyodide is already loaded.");
  else {
    l("Loading Pyodide."), console.debug("Loading Pyodide."), I = le(a, {
      stdout: console.log,
      stderr: console.error
    });
    const f = [];
    r && (f.push(r.streamlit), f.push(r.stliteLib)), g && (f.push("jedi"), f.push("lsprotocol")), _.unshift(...f), console.debug("Loaded Pyodide");
  }
  const u = (
    // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await I
  );
  if (v) {
    console.debug("Setting environment variables", v);
    const f = u.pyimport("os");
    f.environ.update(u.toPy(v)), console.debug("Set environment variables", f.environ);
  }
  let w = !1;
  S && (w = !0, S.forEach((f) => {
    u.FS.mkdir(f), u.FS.mount(u.FS.filesystems.IDBFS, {}, f);
  }), await new Promise((f, y) => {
    u.FS.syncfs(!0, (k) => {
      k ? y(k) : f();
    });
  })), b && Object.entries(b).forEach(([f, y]) => {
    u.FS.mkdir(f), u.FS.mount(u.FS.filesystems.NODEFS, { root: y }, f);
  }), l("Mounting files.");
  const P = [];
  await Promise.all(Object.keys(t).map(async (f) => {
    const y = t[f];
    f = F(c, f);
    let k;
    "url" in y ? (console.debug(`Fetch a file from ${y.url}`), k = await fetch(y.url).then((A) => A.arrayBuffer()).then((A) => new Uint8Array(A))) : k = y.data, console.debug(`Write a file "${f}"`), q(u, f, k, t.opts), f.endsWith(".py") && P.push(f);
  })), l("Unpacking archives."), await Promise.all(i.map(async (f) => {
    let y;
    "url" in f ? (console.debug(`Fetch an archive from ${f.url}`), y = await fetch(f.url).then((X) => X.arrayBuffer())) : y = f.buffer;
    const { format: k, options: A } = f;
    console.debug("Unpack an archive", { format: k, options: A }), u.unpackArchive(y, k, A);
  })), await u.loadPackage("micropip");
  const C = u.pyimport("micropip");
  if (l("Mocking some packages."), console.debug("Mock pyarrow"), ce(u), console.debug("Mocked pyarrow"), l("Installing packages."), console.debug("Installing the prebuilt packages:", n), await u.loadPackage(n), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", _), await C.install.callKwargs(_, { keep_going: !0 }), console.debug("Installed the requirements"), h) {
    const f = P.map((y) => u.FS.readFile(y, { encoding: "utf8" }));
    $(u, m, f);
  }
  await u.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), l("Loading streamlit package."), console.debug("Loading the Streamlit package"), await u.runPythonAsync(`
import streamlit.runtime
  `), console.debug("Loaded the Streamlit package"), l("Setting up the loggers."), console.debug("Setting the loggers"), await u.runPythonAsync(`
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
  const L = (f, y) => {
    f >= 40 ? console.error(y) : f >= 30 ? console.warn(y) : f >= 20 ? console.info(y) : console.debug(y);
  }, H = u.runPython(`
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

__setup_loggers__`), W = ((p == null ? void 0 : p["logger.level"]) ?? "INFO").toString(), K = (p == null ? void 0 : p["logger.messageFormat"]) ?? "%(asctime)s %(message)s";
  if (H(W, K, L), console.debug("Set the loggers"), l("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await u.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), w) {
    l("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
    let f = !1;
    const y = () => {
      console.debug("The script has finished. Syncing the filesystem."), f || (f = !0, u.FS.syncfs(!1, (A) => {
        f = !1, A && console.error(A);
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

__setup_script_finished_callback__`))(y), console.debug("Set up the IndexedDB filesystem synchronizer");
  }
  if (g) {
    l("Importing Language Server"), console.debug("Importing Language Server");
    try {
      await ue(u), console.debug("Imported Language Server");
    } catch (f) {
      console.error("Error while importing Language Server", f);
    }
  }
  l("Booting up the Streamlit server."), console.debug("Setting up the Streamlit configuration");
  const J = await u.runPython(`
def __bootstrap__(main_script_path, flag_options, shared_worker_mode):
    from stlite_lib.bootstrap import load_config_options, prepare

    load_config_options(flag_options, shared_worker_mode)

    prepare(main_script_path, [])

__bootstrap__`), M = F(c, e), G = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": !1,
    ...p,
    "runner.fastReruns": !1
    // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  }, V = c != null;
  J(M, u.toPy(G), V), console.debug("Set up the Streamlit configuration"), console.debug("Booting up the Streamlit server");
  const T = u.pyimport("stlite_lib.server.Server")(M, c ? N(c) : null);
  return await T.start(), console.debug("Booted up the Streamlit server"), {
    pyodide: u,
    httpServer: T,
    micropip: C,
    initData: d
  };
}
function D(o, c, d, m) {
  function l(s) {
    c({
      type: "event:progress",
      data: {
        message: s
      }
    });
  }
  const e = (s, n) => {
    const r = new MessageChannel();
    c({
      type: "event:moduleAutoLoad",
      data: {
        packagesToLoad: s
      }
    }, [r.port2]), n.then((a) => {
      r.port1.postMessage({
        type: "moduleAutoLoad:success",
        data: {
          loadedPackages: a
        }
      }), r.port1.close();
    }).catch((a) => {
      throw r.port1.postMessage({
        type: "moduleAutoLoad:error",
        error: a
      }), r.port1.close(), a;
    });
  };
  let t = null;
  const i = async (s) => {
    const n = s.data;
    if (n.type === "initData") {
      const g = n.data, _ = {
        ...d,
        ...g
      };
      console.debug("Initial data", _), t = ge(o, m, _, e, l), t.then(() => {
        c({
          type: "event:loaded"
        });
      }).catch((u) => {
        console.error(u), c({
          type: "event:error",
          data: {
            error: u
          }
        });
      });
      return;
    }
    if (!t)
      throw new Error("Pyodide initialization has not been started yet.");
    const r = await t, a = r.pyodide;
    let p = r.httpServer;
    const S = r.micropip, { moduleAutoLoad: b } = r.initData, h = s.ports[0];
    function v(g) {
      h.postMessage(g);
    }
    try {
      switch (n.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", n.data);
          const { entrypoint: g } = n.data;
          p.stop(), console.debug("Booting up the Streamlit server");
          const _ = F(m, g);
          p = a.pyimport("stlite_lib.server.Server")(_), p.start(), console.debug("Booted up the Streamlit server"), v({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", n.data);
          const { path: g } = n.data;
          p.start_websocket(g, (_, u) => {
            if (u) {
              const w = _;
              try {
                const P = w.toJs(), C = P.buffer.slice(P.byteOffset, P.byteOffset + P.byteLength);
                c({
                  type: "websocket:message",
                  data: {
                    payload: C
                  }
                }, [C]);
              } finally {
                w.destroy();
              }
            } else
              c({
                type: "websocket:message",
                data: {
                  payload: _
                }
              });
          }), v({
            type: "reply"
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", n.data);
          const { payload: g } = n.data;
          p.receive_websocket_from_js(g);
          break;
        }
        case "http:request": {
          console.debug("http:request", n.data);
          const { request: g } = n.data, _ = (u, w, P) => {
            const C = new Map(w.toJs()), L = P.toJs();
            console.debug({ statusCode: u, headers: C, body: L }), v({
              type: "http:response",
              data: {
                response: {
                  statusCode: u,
                  headers: C,
                  body: L
                }
              }
            });
          };
          p.receive_http_from_js(g.method, decodeURIComponent(g.path), g.headers, g.body, _);
          break;
        }
        case "file:write": {
          const { path: g, data: _, opts: u } = n.data, w = F(m, g);
          b && typeof _ == "string" && w.endsWith(".py") && (console.debug(`Auto install the requirements in ${w}`), $(a, e, [_])), console.debug(`Write a file "${w}"`), q(a, w, _, u), v({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: g, newPath: _ } = n.data, u = F(m, g), w = F(m, _);
          console.debug(`Rename "${u}" to ${w}`), ee(a, u, w), v({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: g } = n.data, _ = F(m, g);
          console.debug(`Remove "${_}`), a.FS.unlink(_), v({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: g, opts: _ } = n.data;
          console.debug(`Read "${g}"`);
          const u = a.FS.readFile(g, _);
          v({
            type: "reply:file:read",
            data: {
              content: u
            }
          });
          break;
        }
        case "install": {
          const { requirements: g } = n.data, _ = U(g);
          console.debug("Install the requirements:", _), await S.install.callKwargs(_, { keep_going: !0 }).then(() => {
            console.debug("Successfully installed"), v({
              type: "reply"
            });
          });
          break;
        }
        case "setEnv": {
          const { env: g } = n.data;
          a.pyimport("os").environ.update(a.toPy(g)), console.debug("Successfully set the environment variables", g), v({
            type: "reply"
          });
          break;
        }
        case "language-server:code_completion": {
          const g = await me(n.data, a);
          v({
            type: "reply:language-server:code_completion",
            data: g
          });
          break;
        }
      }
    } catch (g) {
      if (console.error(g), !(g instanceof Error))
        throw g;
      const _ = new Error(g.message);
      _.name = g.name, _.stack = g.stack, v({
        type: "reply",
        error: _
      });
    }
  };
  return c({
    type: "event:start"
  }), i;
}
const B = "abcdefghijklmnopqrstuvwxyz", fe = B.length;
function pe(o) {
  let c = "";
  for (let d = 0; d < o; d++) {
    const m = Math.floor(Math.random() * fe);
    c += B[m];
  }
  return c;
}
const x = "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = D(x, (o, c) => c ? self.postMessage(o, c) : self.postMessage(o));
else {
  const o = [];
  self.onconnect = (c) => {
    let d;
    do
      d = pe(4);
    while (o.includes(d));
    o.push(d), console.debug("SharedWorker mode.", { appId: d });
    const m = c.ports[0];
    m.onmessage = D(x, (l, e) => e ? m.postMessage(l, e) : m.postMessage(l), void 0, d), m.start();
  };
}
//# sourceMappingURL=worker-DCWbH5Vp.js.map
