import { InMessageAutocomplete, InMessageHover } from "../types";
import type Pyodide from "pyodide";
import {
  LanguageServerEvents,
  OutMessageLangugeServerAutocomplete,
} from "./language-server-types";
import { postMessageToStreamLitWorker } from "./streamlit-worker-communication-utils";
import type { StliteWorkerContext } from "../worker";

/**
 * Imports the necessary python packages to enable language server features
 */
export const importLanguageServerPythonLibraries = async (
  pyodide: Pyodide.PyodideInterface,
  micropip: Pyodide.PyProxy
) => {
  try {
    await micropip.install.callKwargs(["jedi", "lsprotocol"], {
      keep_going: true,
    });
    await pyodide.runPythonAsync(`import jedi`);
    console.debug("Importing jedi Interpreter");
  } catch (err) {
    console.error("Error while importing jedi", err);
  }
};

export const get_code_completions = async (
  msg: InMessageAutocomplete,
  pyodide: Pyodide.PyodideInterface
) => {
  try {
    // Indentation is very important in python, don't change this!
    const result = await pyodide.runPythonAsync(
      `import jedi;
import re;
import json;
from typing import Any, Callable, Dict, Iterator, List, Optional, Union
from lsprotocol import converters, types
from jedi.api.classes import Completion, Name  # type: ignore
from inspect import Parameter

RE_WORD = re.compile(r'\w*')

_COMPLETION_TYPES = {
  'module': types.CompletionItemKind.Module,
  'class': types.CompletionItemKind.Class,
  'instance': types.CompletionItemKind.Reference,
  'function': types.CompletionItemKind.Function,
  'param': types.CompletionItemKind.Variable,
  'keyword': types.CompletionItemKind.Keyword,
  'statement': types.CompletionItemKind.Variable,
  'property': types.CompletionItemKind.Property,
}

completionPrefixPlain = 'a'
completionPrefixSnippet = 'z'

def _completions(
    completions: List[Completion], r: types.Range
) -> Iterator[types.CompletionItem]:
  return (
      types.CompletionItem(
          sort_text=complete_sort_name(completion, completionPrefixPlain),
          **_completion_item(completion, r),
      )
      for completion in completions
  )

def complete_sort_name(name: Completion, append_text: str = '') -> str:
  """Return sort name for a jedi completion.

  Should be passed to the sortText field in CompletionItem. Strings
  sort a-z, a comes first and z comes last.

  Additionally, we'd like to keep the sort order to what Jedi has
  provided. For this reason, we make sure the sort-text is just a
  letter and not the name itself.
  """
  name_str = name.name
  if name_str is None:
      return "z" + append_text + name_str
  if name.type == "param" and name_str.endswith("="):
      return "a" + append_text + name_str
  if name_str.startswith("_"):
      if name_str.startswith("__"):
          if name_str.endswith("__"):
              return "y" + append_text + name_str
          return "x" + append_text + name_str
      return "w" + append_text + name_str
  return "v" + append_text + name_str

def _completion_item(completion: Completion, r: types.Range) -> Dict:
  label = completion.name
  _r = r
  lnm = completion._like_name_length
  if lnm == 1 and label[0] in {'"', "'"}:
      lnm = 0
      label = label[1:]
  elif lnm:
      _r = types.Range(
          start=types.Position(
              line=r.start.line, character=r.start.character - lnm
          ),
          end=r.end,
      )
  return dict(
      label=label,
      kind=_COMPLETION_TYPES.get(
          completion.type, types.CompletionItemKind.Text
      ),
      documentation=completion.docstring(raw=True),
      text_edit=types.TextEdit(range=_r, new_text=label),
  )

def autocomplete():

  code = '''
${msg.data.code}
  '''


  script = jedi.Script(code)
  cursor_line = ${msg.data.currentLineNumber}
  cursor_character = ${msg.data.offset}

  completions = script.complete(
      cursor_line + 1,
      cursor_character,
      fuzzy=False,
  )

  code_line = script._code_lines[cursor_line]
  word_match = RE_WORD.match(code_line[cursor_character :])
  if word_match:
      word_rest = word_match.end()
  else:
      word_rest = 0
  r = types.Range(
    start=types.Position(
        line=cursor_line, character=cursor_character
    ),
    end=types.Position(
        line=cursor_line,
        character=cursor_character + word_rest,
    ),
  )
  suggestions = types.CompletionList(
      is_incomplete=False, items=list(_completions(completions, r))
  )

  converter = converters.get_converter()
  return json.dumps(converter.unstructure(suggestions, unstructure_as=types.CompletionList))


autocomplete()`
    );

    if (!result) {
      return { items: [] };
    }

    return JSON.parse(result);
  } catch (err) {
    console.error(err);
    return { items: [] };
  }
};

export const handleAutoComplete = async (
  msg: InMessageAutocomplete,
  pyodide: Pyodide.PyodideInterface,
  ctx: StliteWorkerContext
) => {
  const autoCompleteResponse = {
    type: LanguageServerEvents.autocomplete,
    data: {
      items: [],
    },
  } as OutMessageLangugeServerAutocomplete;

  try {
    autoCompleteResponse.data = await get_code_completions(msg, pyodide);
    /**
     * This is happening inside a function in a web worker
     * we need to notify the worker that we processed the request
     * so that the Kernel can send the message to fusion
     */
    postMessageToStreamLitWorker(ctx, autoCompleteResponse);
  } catch (err) {
    console.error(err);
    // TODO: send the errors to mixpanel or sentry
    postMessageToStreamLitWorker(ctx, autoCompleteResponse);
  }
};

export const get_hover = async (
  msg: InMessageHover,
  pyodide: Pyodide.PyodideInterface
) => {
  try {
    // Indentation is very important in python, don't change this!
    const result = await pyodide.runPythonAsync(`import jedi;
import re;
import json;
from typing import Any, Callable, Dict, Iterator, List, Optional, Union
from lsprotocol import converters, types
from jedi.api.classes import Completion, Name  # type: ignore
from inspect import Parameter

def _docstring_markdown(name: Name) -> str:
  doc = name.docstring()
  if not doc:
    return ''
  if name.type in ['class', 'function']:
    try:
      sig, doc = doc.split("\\n\\n", 1)
    except ValueError:
      sig = doc
      doc = False
    sig = f"\`\`\`python\\n{sig}\\n\`\`\`"
    if doc:
      return f"{sig}\\n\\n\`\`\`\\n{doc}\\n\`\`\`"
    return sig
  return f"\`\`\`\\n{doc}\\n\`\`\`"

def hover():

  code = '''
${msg.data.code}
  '''
    
  script = jedi.Script(code)
  cursor_line = ${msg.data.currentLineNumber}
  cursor_character = ${msg.data.offset}
  jediHoverFunction = script.help
  hoverFunction = _docstring_markdown

  names = script.help(cursor_line + 1, cursor_character)

  result = '\\n\\n'.join(map(hoverFunction, names))

  if result:
    hover_result = types.Hover(
      contents=types.MarkupContent(kind=types.MarkupKind.Markdown, value=result)
    )
    converter = converters.get_converter()
    return json.dumps(converter.unstructure(hover_result, unstructure_as=types.Hover))

  return None

hover()`);

    if (!result) {
      return {
        contents: {
          kind: "markdown",
          value: "",
        },
      };
    }

    const hover = JSON.parse(result);

    return hover;
  } catch (err) {
    console.error(err);
    return {
      contents: {
        kind: "markdown",
        value: "",
      },
    };
  }
};

export const handleHover = async (
  msg: InMessageHover,
  pyodide: Pyodide.PyodideInterface,
  ctx: StliteWorkerContext
) => {
  try {
    const hover = await get_hover(msg, pyodide);
    /**
     * This is happening inside a function in a web worker
     * we need to notify the worker that we processed the request
     * so that the Kernel can send the message to fusion
     */
    postMessageToStreamLitWorker(ctx, {
      type: LanguageServerEvents.hover,
      data: hover,
    });
  } catch (err) {
    console.error(err);
  }
};
