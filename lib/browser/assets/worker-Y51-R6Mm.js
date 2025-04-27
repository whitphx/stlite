function Q(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var E, j;
function Y() {
  if (j) return E;
  j = 1;
  function o(c) {
    if (typeof c != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(c));
  }
  function l(c, e) {
    for (var t = "", i = 0, s = -1, n = 0, r, a = 0; a <= c.length; ++a) {
      if (a < c.length)
        r = c.charCodeAt(a);
      else {
        if (r === 47)
          break;
        r = 47;
      }
      if (r === 47) {
        if (!(s === a - 1 || n === 1)) if (s !== a - 1 && n === 2) {
          if (t.length < 2 || i !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var g = t.lastIndexOf("/");
              if (g !== t.length - 1) {
                g === -1 ? (t = "", i = 0) : (t = t.slice(0, g), i = t.length - 1 - t.lastIndexOf("/")), s = a, n = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", i = 0, s = a, n = 0;
              continue;
            }
          }
          e && (t.length > 0 ? t += "/.." : t = "..", i = 2);
        } else
          t.length > 0 ? t += "/" + c.slice(s + 1, a) : t = c.slice(s + 1, a), i = a - s - 1;
        s = a, n = 0;
      } else r === 46 && n !== -1 ? ++n : n = -1;
    }
    return t;
  }
  function d(c, e) {
    var t = e.dir || e.root, i = e.base || (e.name || "") + (e.ext || "");
    return t ? t === e.root ? t + i : t + c + i : i;
  }
  var m = {
    // path.resolve([from ...], to)
    resolve: function() {
      for (var e = "", t = !1, i, s = arguments.length - 1; s >= -1 && !t; s--) {
        var n;
        s >= 0 ? n = arguments[s] : (i === void 0 && (i = process.cwd()), n = i), o(n), n.length !== 0 && (e = n + "/" + e, t = n.charCodeAt(0) === 47);
      }
      return e = l(e, !t), t ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
    },
    normalize: function(e) {
      if (o(e), e.length === 0) return ".";
      var t = e.charCodeAt(0) === 47, i = e.charCodeAt(e.length - 1) === 47;
      return e = l(e, !t), e.length === 0 && !t && (e = "."), e.length > 0 && i && (e += "/"), t ? "/" + e : e;
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
      for (var a = t.length, g = a - r, S = n < g ? n : g, b = -1, h = 0; h <= S; ++h) {
        if (h === S) {
          if (g > S) {
            if (t.charCodeAt(r + h) === 47)
              return t.slice(r + h + 1);
            if (h === 0)
              return t.slice(r + h);
          } else n > S && (e.charCodeAt(i + h) === 47 ? b = h : h === 0 && (b = 0));
          break;
        }
        var v = e.charCodeAt(i + h), f = t.charCodeAt(r + h);
        if (v !== f)
          break;
        v === 47 && (b = h);
      }
      var p = "";
      for (h = i + b + 1; h <= s; ++h)
        (h === s || e.charCodeAt(h) === 47) && (p.length === 0 ? p += ".." : p += "/..");
      return p.length > 0 ? p + t.slice(r + b) : (r += b, t.charCodeAt(r) === 47 && ++r, t.slice(r));
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
        var a = t.length - 1, g = -1;
        for (r = e.length - 1; r >= 0; --r) {
          var S = e.charCodeAt(r);
          if (S === 47) {
            if (!n) {
              i = r + 1;
              break;
            }
          } else
            g === -1 && (n = !1, g = r + 1), a >= 0 && (S === t.charCodeAt(a) ? --a === -1 && (s = r) : (a = -1, s = g));
        }
        return i === s ? s = g : s === -1 && (s = e.length), e.slice(i, s);
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
        var g = e.charCodeAt(a);
        if (g === 47) {
          if (!n) {
            i = a + 1;
            break;
          }
          continue;
        }
        s === -1 && (n = !1, s = a + 1), g === 46 ? t === -1 ? t = a : r !== 1 && (r = 1) : t !== -1 && (r = -1);
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
      for (var r = -1, a = 0, g = -1, S = !0, b = e.length - 1, h = 0; b >= n; --b) {
        if (i = e.charCodeAt(b), i === 47) {
          if (!S) {
            a = b + 1;
            break;
          }
          continue;
        }
        g === -1 && (S = !1, g = b + 1), i === 46 ? r === -1 ? r = b : h !== 1 && (h = 1) : r !== -1 && (h = -1);
      }
      return r === -1 || g === -1 || // We saw a non-dot character immediately before the dot
      h === 0 || // The (right-most) trimmed path component is exactly '..'
      h === 1 && r === g - 1 && r === a + 1 ? g !== -1 && (a === 0 && s ? t.base = t.name = e.slice(1, g) : t.base = t.name = e.slice(a, g)) : (a === 0 && s ? (t.name = e.slice(1, r), t.base = e.slice(1, g)) : (t.name = e.slice(a, r), t.base = e.slice(a, g)), t.ext = e.slice(r, g)), a > 0 ? t.dir = e.slice(0, a - 1) : s && (t.dir = "/"), t;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  return m.posix = m, E = m, E;
}
var Z = Y(), R = /* @__PURE__ */ Q(Z);
const O = "/home/pyodide", N = (o) => `${O}/${o}`, F = (o, l) => o == null ? R.resolve(O, l) : R.resolve(N(o), l);
function z(o, l) {
  const d = R.normalize(l), c = R.dirname(d).split("/"), e = [];
  for (const t of c) {
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
function q(o, l, d, m) {
  z(o, l), o.FS.writeFile(l, d, m);
}
function ee(o, l, d) {
  z(o, d), o.FS.rename(l, d);
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
  var c;
  const l = typeof process < "u" && ((c = process.versions) == null ? void 0 : c.node);
  let d;
  l ? d = (await import(
    /* webpackIgnore: true */
    "./__vite-browser-external-CPvbk0mb.js"
  )).sep : d = "/";
  const m = o.slice(0, o.lastIndexOf(d) + 1);
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
async function le(o, l) {
  const { scriptURL: d, pyodideIndexURL: m, isESModule: c } = await ae(o);
  let e;
  return c ? e = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    d
  )).loadPyodide : (importScripts(d), e = self.loadPyodide), e({ ...l, indexURL: m });
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
function de(o, l, d) {
  const m = o.pyimport("pyodide"), c = (r) => m.code.find_imports(r).toJs(), e = d.map((r) => c(r)), s = Array.from(new Set(e.flat())).filter((r) => !o.runPython(`__import__('importlib').util.find_spec('${r}')`)).map((r) => o._api._import_name_to_package_name.get(r)).filter((r) => r);
  if (s.length === 0)
    return Promise.resolve();
  const n = o.loadPackage(s);
  return l(s, n), n.then();
}
function $(o, l, d) {
  const m = de(o, l, d);
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
}, me = async (o, l) => {
  let d;
  try {
    if (d = l.globals.get("get_code_completions"), !d)
      return console.error("Can not generate suggestions list, the get_code_completions function is not defined"), { items: [] };
    const m = d(o.code, o.line, o.column);
    return m ? JSON.parse(m) : { items: [] };
  } catch (m) {
    return console.error(m), { items: [] };
  } finally {
    d && d.constructor.name === "PyProxy" && d.destroy();
  }
}, ge = async (o, l) => {
  try {
    console.debug("Importing jedi Interpreter"), await l.install.callKwargs(["jedi", "lsprotocol"], {
      keep_going: !0
    }), await ue(o);
  } catch (d) {
    console.error("Error while importing jedi", d);
  }
};
let I = null;
async function fe(o, l, d, m, c) {
  const { entrypoint: e, files: t, archives: i, requirements: s, prebuiltPackageNames: n, wheels: r, pyodideUrl: a = o, streamlitConfig: g, idbfsMountpoints: S, nodefsMountpoints: b, moduleAutoLoad: h, env: v, languageServer: f } = d, p = U(s);
  I ? (c("Pyodide is already loaded."), console.debug("Pyodide is already loaded.")) : (c("Loading Pyodide."), console.debug("Loading Pyodide."), I = le(a, {
    stdout: console.log,
    stderr: console.error
  }), r && (p.unshift(r.streamlit), p.unshift(r.stliteLib)), console.debug("Loaded Pyodide"));
  const u = (
    // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await I
  );
  if (v) {
    console.debug("Setting environment variables", v);
    const _ = u.pyimport("os");
    _.environ.update(u.toPy(v)), console.debug("Set environment variables", _.environ);
  }
  let w = !1;
  S && (w = !0, S.forEach((_) => {
    u.FS.mkdir(_), u.FS.mount(u.FS.filesystems.IDBFS, {}, _);
  }), await new Promise((_, y) => {
    u.FS.syncfs(!0, (k) => {
      k ? y(k) : _();
    });
  })), b && Object.entries(b).forEach(([_, y]) => {
    u.FS.mkdir(_), u.FS.mount(u.FS.filesystems.NODEFS, { root: y }, _);
  }), c("Mounting files.");
  const P = [];
  await Promise.all(Object.keys(t).map(async (_) => {
    const y = t[_];
    _ = F(l, _);
    let k;
    "url" in y ? (console.debug(`Fetch a file from ${y.url}`), k = await fetch(y.url).then((C) => C.arrayBuffer()).then((C) => new Uint8Array(C))) : k = y.data, console.debug(`Write a file "${_}"`), q(u, _, k, t.opts), _.endsWith(".py") && P.push(_);
  })), c("Unpacking archives."), await Promise.all(i.map(async (_) => {
    let y;
    "url" in _ ? (console.debug(`Fetch an archive from ${_.url}`), y = await fetch(_.url).then((X) => X.arrayBuffer())) : y = _.buffer;
    const { format: k, options: C } = _;
    console.debug("Unpack an archive", { format: k, options: C }), u.unpackArchive(y, k, C);
  })), await u.loadPackage("micropip");
  const A = u.pyimport("micropip");
  if (c("Mocking some packages."), console.debug("Mock pyarrow"), ce(u), console.debug("Mocked pyarrow"), c("Installing packages."), console.debug("Installing the prebuilt packages:", n), await u.loadPackage(n), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", p), await A.install.callKwargs(p, { keep_going: !0 }), console.debug("Installed the requirements"), h) {
    const _ = P.map((y) => u.FS.readFile(y, { encoding: "utf8" }));
    $(u, m, _);
  }
  await u.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), c("Loading streamlit package."), console.debug("Loading the Streamlit package"), await u.runPythonAsync(`
import streamlit.runtime
  `), console.debug("Loaded the Streamlit package"), c("Setting up the loggers."), console.debug("Setting the loggers"), await u.runPythonAsync(`
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
  const L = (_, y) => {
    _ >= 40 ? console.error(y) : _ >= 30 ? console.warn(y) : _ >= 20 ? console.info(y) : console.debug(y);
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

__setup_loggers__`), K = ((g == null ? void 0 : g["logger.level"]) ?? "INFO").toString(), W = (g == null ? void 0 : g["logger.messageFormat"]) ?? "%(asctime)s %(message)s";
  if (H(K, W, L), console.debug("Set the loggers"), c("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await u.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), w) {
    c("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
    let _ = !1;
    const y = () => {
      console.debug("The script has finished. Syncing the filesystem."), _ || (_ = !0, u.FS.syncfs(!1, (C) => {
        _ = !1, C && console.error(C);
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
  f && (c("Importing Language Server"), await ge(u, A)), c("Booting up the Streamlit server."), console.debug("Setting up the Streamlit configuration");
  const J = await u.runPython(`
def __bootstrap__(main_script_path, flag_options, shared_worker_mode):
    from stlite_lib.bootstrap import load_config_options, prepare

    load_config_options(flag_options, shared_worker_mode)

    prepare(main_script_path, [])

__bootstrap__`), M = F(l, e), G = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": !1,
    ...g,
    "runner.fastReruns": !1
    // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  }, V = l != null;
  J(M, u.toPy(G), V), console.debug("Set up the Streamlit configuration"), console.debug("Booting up the Streamlit server");
  const T = u.pyimport("stlite_lib.server.Server")(M, l ? N(l) : null);
  return await T.start(), console.debug("Booted up the Streamlit server"), {
    pyodide: u,
    httpServer: T,
    micropip: A,
    initData: d
  };
}
function D(o, l, d, m) {
  function c(s) {
    l({
      type: "event:progress",
      data: {
        message: s
      }
    });
  }
  const e = (s, n) => {
    const r = new MessageChannel();
    l({
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
      const f = n.data, p = {
        ...d,
        ...f
      };
      console.debug("Initial data", p), t = fe(o, m, p, e, c), t.then(() => {
        l({
          type: "event:loaded"
        });
      }).catch((u) => {
        console.error(u), l({
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
    let g = r.httpServer;
    const S = r.micropip, { moduleAutoLoad: b } = r.initData, h = s.ports[0];
    function v(f) {
      h.postMessage(f);
    }
    try {
      switch (n.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", n.data);
          const { entrypoint: f } = n.data;
          g.stop(), console.debug("Booting up the Streamlit server");
          const p = F(m, f);
          g = a.pyimport("stlite_lib.server.Server")(p), g.start(), console.debug("Booted up the Streamlit server"), v({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", n.data);
          const { path: f } = n.data;
          g.start_websocket(f, (p, u) => {
            if (u) {
              const w = p;
              try {
                const P = w.toJs(), A = P.buffer.slice(P.byteOffset, P.byteOffset + P.byteLength);
                l({
                  type: "websocket:message",
                  data: {
                    payload: A
                  }
                }, [A]);
              } finally {
                w.destroy();
              }
            } else
              l({
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
          console.debug("websocket:send", n.data);
          const { payload: f } = n.data;
          g.receive_websocket_from_js(f);
          break;
        }
        case "http:request": {
          console.debug("http:request", n.data);
          const { request: f } = n.data, p = (u, w, P) => {
            const A = new Map(w.toJs()), L = P.toJs();
            console.debug({ statusCode: u, headers: A, body: L }), v({
              type: "http:response",
              data: {
                response: {
                  statusCode: u,
                  headers: A,
                  body: L
                }
              }
            });
          };
          g.receive_http_from_js(f.method, decodeURIComponent(f.path), f.headers, f.body, p);
          break;
        }
        case "file:write": {
          const { path: f, data: p, opts: u } = n.data, w = F(m, f);
          b && typeof p == "string" && w.endsWith(".py") && (console.debug(`Auto install the requirements in ${w}`), $(a, e, [p])), console.debug(`Write a file "${w}"`), q(a, w, p, u), v({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: f, newPath: p } = n.data, u = F(m, f), w = F(m, p);
          console.debug(`Rename "${u}" to ${w}`), ee(a, u, w), v({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: f } = n.data, p = F(m, f);
          console.debug(`Remove "${p}`), a.FS.unlink(p), v({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: f, opts: p } = n.data;
          console.debug(`Read "${f}"`);
          const u = a.FS.readFile(f, p);
          v({
            type: "reply:file:read",
            data: {
              content: u
            }
          });
          break;
        }
        case "install": {
          const { requirements: f } = n.data, p = U(f);
          console.debug("Install the requirements:", p), await S.install.callKwargs(p, { keep_going: !0 }).then(() => {
            console.debug("Successfully installed"), v({
              type: "reply"
            });
          });
          break;
        }
        case "setEnv": {
          const { env: f } = n.data;
          a.pyimport("os").environ.update(a.toPy(f)), console.debug("Successfully set the environment variables", f), v({
            type: "reply"
          });
          break;
        }
        case "language-server:code_completion": {
          const f = await me(n.data, a);
          v({
            type: "reply:language-server:code_completion",
            data: f
          });
          break;
        }
      }
    } catch (f) {
      if (console.error(f), !(f instanceof Error))
        throw f;
      const p = new Error(f.message);
      p.name = f.name, p.stack = f.stack, v({
        type: "reply",
        error: p
      });
    }
  };
  return l({
    type: "event:start"
  }), i;
}
const B = "abcdefghijklmnopqrstuvwxyz", pe = B.length;
function _e(o) {
  let l = "";
  for (let d = 0; d < o; d++) {
    const m = Math.floor(Math.random() * pe);
    l += B[m];
  }
  return l;
}
const x = "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = D(x, (o, l) => l ? self.postMessage(o, l) : self.postMessage(o));
else {
  const o = [];
  self.onconnect = (l) => {
    let d;
    do
      d = _e(4);
    while (o.includes(d));
    o.push(d), console.debug("SharedWorker mode.", { appId: d });
    const m = l.ports[0];
    m.onmessage = D(x, (c, e) => e ? m.postMessage(c, e) : m.postMessage(c), void 0, d), m.start();
  };
}
//# sourceMappingURL=worker-Y51-R6Mm.js.map
