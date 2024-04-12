import { InMessageAutocomplete } from "../types";
import type Pyodide from "pyodide";
import { LanguageServerEvents } from "./language-server-types";
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
  pyodide: Pyodide.PyodideInterface,
  ctx: StliteWorkerContext
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

    const suggestions = JSON.parse(result);

    /**
     * This is happening inside a function in a web worker
     * we need to notify the worker that we processed the request
     * so that the Kernel can send the message to fusion
     */
    postMessageToStreamLitWorker(ctx, {
      type: LanguageServerEvents.autocomplete,
      data: suggestions,
    });
  } catch (err) {
    console.error(err);
  }
};
