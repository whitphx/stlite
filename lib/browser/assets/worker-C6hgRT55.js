class ee {
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
function te(o) {
  return o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
function w(o) {
  if (typeof o != "string")
    throw new TypeError("Path must be a string. Received " + JSON.stringify(o));
}
function N(o, e) {
  for (var t = "", n = 0, s = -1, r = 0, i, a = 0; a <= o.length; ++a) {
    if (a < o.length)
      i = o.charCodeAt(a);
    else {
      if (i === 47)
        break;
      i = 47;
    }
    if (i === 47) {
      if (!(s === a - 1 || r === 1)) if (s !== a - 1 && r === 2) {
        if (t.length < 2 || n !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
          if (t.length > 2) {
            var c = t.lastIndexOf("/");
            if (c !== t.length - 1) {
              c === -1 ? (t = "", n = 0) : (t = t.slice(0, c), n = t.length - 1 - t.lastIndexOf("/")), s = a, r = 0;
              continue;
            }
          } else if (t.length === 2 || t.length === 1) {
            t = "", n = 0, s = a, r = 0;
            continue;
          }
        }
        e && (t.length > 0 ? t += "/.." : t = "..", n = 2);
      } else
        t.length > 0 ? t += "/" + o.slice(s + 1, a) : t = o.slice(s + 1, a), n = a - s - 1;
      s = a, r = 0;
    } else i === 46 && r !== -1 ? ++r : r = -1;
  }
  return t;
}
function re(o, e) {
  var t = e.dir || e.root, n = e.base || (e.name || "") + (e.ext || "");
  return t ? t === e.root ? t + n : t + o + n : n;
}
var F = {
  // path.resolve([from ...], to)
  resolve: function() {
    for (var e = "", t = !1, n, s = arguments.length - 1; s >= -1 && !t; s--) {
      var r;
      s >= 0 ? r = arguments[s] : (n === void 0 && (n = process.cwd()), r = n), w(r), r.length !== 0 && (e = r + "/" + e, t = r.charCodeAt(0) === 47);
    }
    return e = N(e, !t), t ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
  },
  normalize: function(e) {
    if (w(e), e.length === 0) return ".";
    var t = e.charCodeAt(0) === 47, n = e.charCodeAt(e.length - 1) === 47;
    return e = N(e, !t), e.length === 0 && !t && (e = "."), e.length > 0 && n && (e += "/"), t ? "/" + e : e;
  },
  isAbsolute: function(e) {
    return w(e), e.length > 0 && e.charCodeAt(0) === 47;
  },
  join: function() {
    if (arguments.length === 0)
      return ".";
    for (var e, t = 0; t < arguments.length; ++t) {
      var n = arguments[t];
      w(n), n.length > 0 && (e === void 0 ? e = n : e += "/" + n);
    }
    return e === void 0 ? "." : F.normalize(e);
  },
  relative: function(e, t) {
    if (w(e), w(t), e === t || (e = F.resolve(e), t = F.resolve(t), e === t)) return "";
    for (var n = 1; n < e.length && e.charCodeAt(n) === 47; ++n)
      ;
    for (var s = e.length, r = s - n, i = 1; i < t.length && t.charCodeAt(i) === 47; ++i)
      ;
    for (var a = t.length, c = a - i, p = r < c ? r : c, u = -1, d = 0; d <= p; ++d) {
      if (d === p) {
        if (c > p) {
          if (t.charCodeAt(i + d) === 47)
            return t.slice(i + d + 1);
          if (d === 0)
            return t.slice(i + d);
        } else r > p && (e.charCodeAt(n + d) === 47 ? u = d : d === 0 && (u = 0));
        break;
      }
      var f = e.charCodeAt(n + d), L = t.charCodeAt(i + d);
      if (f !== L)
        break;
      f === 47 && (u = d);
    }
    var v = "";
    for (d = n + u + 1; d <= s; ++d)
      (d === s || e.charCodeAt(d) === 47) && (v.length === 0 ? v += ".." : v += "/..");
    return v.length > 0 ? v + t.slice(i + u) : (i += u, t.charCodeAt(i) === 47 && ++i, t.slice(i));
  },
  _makeLong: function(e) {
    return e;
  },
  dirname: function(e) {
    if (w(e), e.length === 0) return ".";
    for (var t = e.charCodeAt(0), n = t === 47, s = -1, r = !0, i = e.length - 1; i >= 1; --i)
      if (t = e.charCodeAt(i), t === 47) {
        if (!r) {
          s = i;
          break;
        }
      } else
        r = !1;
    return s === -1 ? n ? "/" : "." : n && s === 1 ? "//" : e.slice(0, s);
  },
  basename: function(e, t) {
    if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
    w(e);
    var n = 0, s = -1, r = !0, i;
    if (t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t.length === e.length && t === e) return "";
      var a = t.length - 1, c = -1;
      for (i = e.length - 1; i >= 0; --i) {
        var p = e.charCodeAt(i);
        if (p === 47) {
          if (!r) {
            n = i + 1;
            break;
          }
        } else
          c === -1 && (r = !1, c = i + 1), a >= 0 && (p === t.charCodeAt(a) ? --a === -1 && (s = i) : (a = -1, s = c));
      }
      return n === s ? s = c : s === -1 && (s = e.length), e.slice(n, s);
    } else {
      for (i = e.length - 1; i >= 0; --i)
        if (e.charCodeAt(i) === 47) {
          if (!r) {
            n = i + 1;
            break;
          }
        } else s === -1 && (r = !1, s = i + 1);
      return s === -1 ? "" : e.slice(n, s);
    }
  },
  extname: function(e) {
    w(e);
    for (var t = -1, n = 0, s = -1, r = !0, i = 0, a = e.length - 1; a >= 0; --a) {
      var c = e.charCodeAt(a);
      if (c === 47) {
        if (!r) {
          n = a + 1;
          break;
        }
        continue;
      }
      s === -1 && (r = !1, s = a + 1), c === 46 ? t === -1 ? t = a : i !== 1 && (i = 1) : t !== -1 && (i = -1);
    }
    return t === -1 || s === -1 || // We saw a non-dot character immediately before the dot
    i === 0 || // The (right-most) trimmed path component is exactly '..'
    i === 1 && t === s - 1 && t === n + 1 ? "" : e.slice(t, s);
  },
  format: function(e) {
    if (e === null || typeof e != "object")
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
    return re("/", e);
  },
  parse: function(e) {
    w(e);
    var t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0) return t;
    var n = e.charCodeAt(0), s = n === 47, r;
    s ? (t.root = "/", r = 1) : r = 0;
    for (var i = -1, a = 0, c = -1, p = !0, u = e.length - 1, d = 0; u >= r; --u) {
      if (n = e.charCodeAt(u), n === 47) {
        if (!p) {
          a = u + 1;
          break;
        }
        continue;
      }
      c === -1 && (p = !1, c = u + 1), n === 46 ? i === -1 ? i = u : d !== 1 && (d = 1) : i !== -1 && (d = -1);
    }
    return i === -1 || c === -1 || // We saw a non-dot character immediately before the dot
    d === 0 || // The (right-most) trimmed path component is exactly '..'
    d === 1 && i === c - 1 && i === a + 1 ? c !== -1 && (a === 0 && s ? t.base = t.name = e.slice(1, c) : t.base = t.name = e.slice(a, c)) : (a === 0 && s ? (t.name = e.slice(1, i), t.base = e.slice(1, c)) : (t.name = e.slice(a, i), t.base = e.slice(a, c)), t.ext = e.slice(i, c)), a > 0 ? t.dir = e.slice(0, a - 1) : s && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
F.posix = F;
var oe = F, j = /* @__PURE__ */ te(oe);
const H = "/home/pyodide", K = (o) => `${H}/${o}`, C = (o, e) => o == null ? j.resolve(H, e) : j.resolve(K(o), e);
function B(o, e) {
  const t = j.normalize(e), s = j.dirname(t).split("/"), r = [];
  for (const i of s) {
    r.push(i);
    const a = r.join("/");
    if (o.FS.analyzePath(a).exists) {
      if (o.FS.isDir(a))
        throw new Error(`"${a}" already exists and is not a directory.`);
      continue;
    }
    try {
      o.FS.mkdir(a);
    } catch (c) {
      throw console.error(`Failed to create a directory "${a}"`), c;
    }
  }
}
function U(o, e, t, n) {
  B(o, e), o.FS.writeFile(e, t, n);
}
function ne(o, e, t) {
  B(o, t), o.FS.rename(e, t);
}
const se = "[", ie = "(<=>!~", ae = ";", le = "@", ce = new RegExp(
  `[${se + ie + ae + le}]`
);
function de(o) {
  return o.split(ce)[0].trim();
}
function z(o) {
  return o.forEach((t) => {
    let n;
    try {
      n = new URL(t);
    } catch {
      return;
    }
    if (n.protocol === "emfs:" || n.protocol === "file:")
      throw new Error(
        `"emfs:" and "file:" protocols are not allowed for the requirement (${t})`
      );
  }), o.filter((t) => de(t) === "streamlit" ? (console.warn(
    `Streamlit is specified in the requirements ("${t}"), but it will be ignored. A built-in version of Streamlit will be used.`
  ), !1) : !0);
}
async function me(o) {
  const e = typeof process < "u" && process.versions?.node;
  let t;
  e ? t = (await import(
    /* webpackIgnore: true */
    "./__vite-browser-external-CPvbk0mb.js"
  )).sep : t = "/";
  const n = o.slice(0, o.lastIndexOf(t) + 1);
  if (o.endsWith(".mjs")) {
    if (e) {
      const s = await import(
        /* webpackIgnore: true */
        "./__vite-browser-external-CPvbk0mb.js"
      ), r = await import(
        /* webpackIgnore: true */
        "./__vite-browser-external-CPvbk0mb.js"
      );
      !o.includes("://") && s.isAbsolute(o) && (o = r.pathToFileURL(o).href);
    }
    return {
      scriptURL: o,
      pyodideIndexURL: n,
      isESModule: !0
    };
  } else
    return {
      scriptURL: o,
      pyodideIndexURL: n,
      isESModule: !1
    };
}
async function ue(o, e) {
  const { scriptURL: t, pyodideIndexURL: n, isESModule: s } = await me(o);
  let r;
  return s ? r = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    t
  )).loadPyodide : (importScripts(t), r = self.loadPyodide), r({ ...e, indexURL: n });
}
function ge(o) {
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
async function fe(o, e, t) {
  const n = o.pyimport("pyodide"), s = (u) => n.code.find_imports(u).toJs(), r = t.map((u) => s(u)), c = Array.from(new Set(r.flat())).filter((u) => !o.runPython(`__import__('importlib').util.find_spec('${u}')`)).map((u) => o._api._import_name_to_package_name.get(u)).filter((u) => u);
  if (c.length === 0)
    return;
  const p = new MessageChannel();
  e({
    type: "event:moduleAutoLoad",
    data: {
      packagesToLoad: c
    }
  }, p.port2);
  try {
    const u = await o.loadPackage(c);
    p.port1.postMessage({
      type: "moduleAutoLoad:success",
      data: {
        loadedPackages: u
      }
    }), p.port1.close();
    return;
  } catch (u) {
    throw p.port1.postMessage({
      type: "moduleAutoLoad:error",
      error: u
    }), p.port1.close(), u;
  }
}
const _e = async (o) => {
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
}, pe = async (o, e) => {
  let t;
  try {
    if (t = e.globals.get("get_code_completions"), !t)
      return console.error("Can not generate suggestions list, the get_code_completions function is not defined"), { items: [] };
    const n = t(o.code, o.currentLineNumber, o.offset);
    return n ? JSON.parse(n) : { items: [] };
  } catch (n) {
    return console.error(n), { items: [] };
  } finally {
    t && t.constructor.name === "PyProxy" && t.destroy();
  }
}, he = async (o, e) => {
  try {
    console.debug("Importing jedi Interpreter"), await e.install.callKwargs(["jedi", "lsprotocol"], {
      keep_going: !0
    }), await _e(o);
  } catch (t) {
    console.error("Error while importing jedi", t);
  }
};
typeof global < "u" && typeof global.self > "u" && (self = global);
function W(o, e, t) {
  const n = fe(o, e, t);
  self.__moduleAutoLoadPromise__ = n, o.runPythonAsync(`
from streamlit.runtime.scriptrunner import script_runner
from js import __moduleAutoLoadPromise__

script_runner.moduleAutoLoadPromise = __moduleAutoLoadPromise__
`);
}
let E = null;
function $(o, e, t, n) {
  function s(d) {
    e({
      type: "event:progress",
      data: {
        message: d
      }
    });
  }
  let r, i;
  const a = new ee();
  async function c() {
    const d = await a.promise, f = {
      ...t,
      ...d
    };
    console.debug("Initial data", f);
    const { entrypoint: L, files: v, archives: b, requirements: l, prebuiltPackageNames: g, wheels: h, pyodideUrl: y = o, streamlitConfig: k, idbfsMountpoints: P, nodefsMountpoints: R, moduleAutoLoad: G, env: M, languageServer: V } = f, I = z(l);
    E ? (s("Pyodide is already loaded."), console.debug("Pyodide is already loaded."), r = await E) : (s("Loading Pyodide."), console.debug("Loading Pyodide."), E = ue(y, {
      stdout: console.log,
      stderr: console.error
    }), r = await E, M && r.pyimport("os").environ.update(r.toPy(M)), h && (I.unshift(h.streamlit), I.unshift(h.stliteLib)), console.debug("Loaded Pyodide"));
    let T = !1;
    P && (T = !0, P.forEach((m) => {
      r.FS.mkdir(m), r.FS.mount(r.FS.filesystems.IDBFS, {}, m);
    }), await new Promise((m, _) => {
      r.FS.syncfs(!0, (S) => {
        S ? _(S) : m();
      });
    })), R && Object.entries(R).forEach(([m, _]) => {
      r.FS.mkdir(m), r.FS.mount(r.FS.filesystems.NODEFS, { root: _ }, m);
    }), s("Mounting files.");
    const D = [];
    await Promise.all(Object.keys(v).map(async (m) => {
      const _ = v[m];
      m = C(n, m);
      let S;
      "url" in _ ? (console.debug(`Fetch a file from ${_.url}`), S = await fetch(_.url).then((A) => A.arrayBuffer()).then((A) => new Uint8Array(A))) : S = _.data, console.debug(`Write a file "${m}"`), U(r, m, S, v.opts), m.endsWith(".py") && D.push(m);
    })), s("Unpacking archives."), await Promise.all(b.map(async (m) => {
      let _;
      "url" in m ? (console.debug(`Fetch an archive from ${m.url}`), _ = await fetch(m.url).then((Z) => Z.arrayBuffer())) : _ = m.buffer;
      const { format: S, options: A } = m;
      console.debug("Unpack an archive", { format: S, options: A }), r.unpackArchive(_, S, A);
    })), await r.loadPackage("micropip");
    const O = r.pyimport("micropip");
    if (s("Mocking some packages."), console.debug("Mock pyarrow"), ge(r), console.debug("Mocked pyarrow"), s("Installing packages."), console.debug("Installing the prebuilt packages:", g), await r.loadPackage(g), console.debug("Installed the prebuilt packages"), console.debug("Installing the requirements:", I), await O.install.callKwargs(I, { keep_going: !0 }), console.debug("Installed the requirements"), G) {
      const m = D.map((_) => r.FS.readFile(_, { encoding: "utf8" }));
      W(r, e, m);
    }
    await r.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`), s("Loading streamlit package."), console.debug("Loading the Streamlit package"), await r.runPythonAsync(`
import streamlit.runtime
    `), console.debug("Loaded the Streamlit package"), s("Setting up the loggers."), console.debug("Setting the loggers"), await r.runPythonAsync(`
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
    const X = (m, _) => {
      m >= 40 ? console.error(_) : m >= 30 ? console.warn(_) : m >= 20 ? console.info(_) : console.debug(_);
    };
    self.__logCallback__ = X, await r.runPythonAsync(`
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
    const Q = (k?.["logger.level"] ?? "INFO").toString(), Y = k?.["logger.messageFormat"] ?? "%(asctime)s %(message)s";
    if (r.globals.get("setup_loggers")(Q, Y), console.debug("Set the loggers"), s("Mocking some Streamlit functions for the browser environment."), console.debug("Mocking some Streamlit functions"), await r.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
    return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`), console.debug("Mocked some Streamlit functions"), T) {
      s("Setting up the IndexedDB filesystem synchronizer."), console.debug("Setting up the IndexedDB filesystem synchronizer");
      let m = !1;
      self.__scriptFinishedCallback__ = () => {
        console.debug("The script has finished. Syncing the filesystem."), m || (m = !0, r.FS.syncfs(!1, (_) => {
          m = !1, _ && console.error(_);
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
    const x = C(n, L);
    return V && (s("Importing Language Server"), await he(r, O)), s("Booting up the Streamlit server."), console.debug("Setting up the Streamlit configuration"), self.__sharedWorkerMode__ = n != null, self.__streamlitFlagOptions__ = {
      // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
      "browser.gatherUsageStats": !1,
      ...k,
      "runner.fastReruns": !1
      // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
    }, await r.runPythonAsync(`
from stlite_lib.bootstrap import load_config_options, prepare
from js import __sharedWorkerMode__, __streamlitFlagOptions__

flag_options = __streamlitFlagOptions__.to_py()
load_config_options(flag_options, __sharedWorkerMode__)

main_script_path = "${x}"
args = []

prepare(main_script_path, args)
`), console.debug("Set up the Streamlit configuration"), console.debug("Booting up the Streamlit server"), i = r.pyimport("stlite_lib.server.Server")(x, n ? K(n) : null), await i.start(), console.debug("Booted up the Streamlit server"), e({
      type: "event:loaded"
    }), f;
  }
  const p = c().catch((d) => {
    throw e({
      type: "event:error",
      data: {
        error: d
      }
    }), d;
  }), u = async (d) => {
    const f = d.data;
    if (f.type === "initData") {
      a.resolve(f.data);
      return;
    }
    const { moduleAutoLoad: L } = await p, v = d.ports[0];
    function b(l) {
      v.postMessage(l);
    }
    try {
      switch (f.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", f.data);
          const { entrypoint: l } = f.data;
          i.stop(), console.debug("Booting up the Streamlit server"), i = r.pyimport("stlite_lib.server.Server")(l), i.start(), console.debug("Booted up the Streamlit server"), b({
            type: "reply"
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", f.data);
          const { path: l } = f.data;
          i.start_websocket(l, (g, h) => {
            if (h) {
              const y = g, k = y.getBuffer("u8");
              y.destroy();
              const P = new Uint8ClampedArray(k.data.buffer, k.data.byteOffset, k.data.byteLength);
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
                  payload: g
                }
              });
          }), b({
            type: "reply"
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", f.data);
          const { payload: l } = f.data;
          i.receive_websocket_from_js(l);
          break;
        }
        case "http:request": {
          console.debug("http:request", f.data);
          const { request: l } = f.data, g = (h, y, k) => {
            const P = new Map(y.toJs()), R = k.toJs();
            console.debug({ statusCode: h, headers: P, body: R }), b({
              type: "http:response",
              data: {
                response: {
                  statusCode: h,
                  headers: P,
                  body: R
                }
              }
            });
          };
          i.receive_http_from_js(l.method, decodeURIComponent(l.path), l.headers, l.body, g);
          break;
        }
        case "file:write": {
          const { path: l, data: g, opts: h } = f.data, y = C(n, l);
          L && typeof g == "string" && y.endsWith(".py") && (console.debug(`Auto install the requirements in ${y}`), W(r, e, [g])), console.debug(`Write a file "${y}"`), U(r, y, g, h), b({
            type: "reply"
          });
          break;
        }
        case "file:rename": {
          const { oldPath: l, newPath: g } = f.data, h = C(n, l), y = C(n, g);
          console.debug(`Rename "${h}" to ${y}`), ne(r, h, y), b({
            type: "reply"
          });
          break;
        }
        case "file:unlink": {
          const { path: l } = f.data, g = C(n, l);
          console.debug(`Remove "${g}`), r.FS.unlink(g), b({
            type: "reply"
          });
          break;
        }
        case "file:read": {
          const { path: l, opts: g } = f.data;
          console.debug(`Read "${l}"`);
          const h = r.FS.readFile(l, g);
          b({
            type: "reply:file:read",
            data: {
              content: h
            }
          });
          break;
        }
        case "install": {
          const { requirements: l } = f.data, g = r.pyimport("micropip"), h = z(l);
          console.debug("Install the requirements:", h), await g.install.callKwargs(h, { keep_going: !0 }).then(() => {
            console.debug("Successfully installed"), b({
              type: "reply"
            });
          });
          break;
        }
        case "setEnv": {
          const { env: l } = f.data;
          r.pyimport("os").environ.update(r.toPy(l)), console.debug("Successfully set the environment variables", l), b({
            type: "reply"
          });
          break;
        }
        case "language-server:code_completion": {
          const l = await pe(f.data, r);
          b({
            type: "reply:language-server:code_completion",
            data: l
          });
          break;
        }
      }
    } catch (l) {
      if (console.error(l), !(l instanceof Error))
        throw l;
      const g = new Error(l.message);
      g.name = l.name, g.stack = l.stack, b({
        type: "reply",
        error: g
      });
    }
  };
  return e({
    type: "event:start"
  }), u;
}
const J = "abcdefghijklmnopqrstuvwxyz", ye = J.length;
function be(o) {
  let e = "";
  for (let t = 0; t < o; t++) {
    const n = Math.floor(Math.random() * ye);
    e += J[n];
  }
  return e;
}
const q = "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.mjs";
if ("postMessage" in self)
  self.onmessage = $(q, (o, e) => e ? self.postMessage(o, [e]) : self.postMessage(o));
else {
  const o = [];
  self.onconnect = (e) => {
    let t;
    do
      t = be(4);
    while (o.includes(t));
    o.push(t), console.debug("SharedWorker mode.", { appId: t });
    const n = e.ports[0];
    n.onmessage = $(q, (s, r) => r ? n.postMessage(s, [r]) : n.postMessage(s), void 0, t), n.start();
  };
}
//# sourceMappingURL=worker-C6hgRT55.js.map
