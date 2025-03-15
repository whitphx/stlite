import type Pyodide from "pyodide";
import type { PyCallable } from "pyodide/ffi";
import { LanguageServerRequestPayload } from "../types";

export const defineCodeCompletionsFunction = async (
  pyodide: Pyodide.PyodideInterface,
) => {
  // Indentation is very important in python, don't change this!
  await pyodide.runPythonAsync(
    `import jedi
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
`,
  );
};

export const getCodeCompletions = async (
  payload: LanguageServerRequestPayload,
  pyodide: Pyodide.PyodideInterface,
) => {
  let get_code_completions: PyCallable | undefined;
  try {
    // Get the proxy for get_code_completions in the JS world
    get_code_completions = pyodide.globals.get("get_code_completions");

    if (!get_code_completions) {
      console.error(
        "Can not generate suggestions list, the get_code_completions function is not defined",
      );
      return { items: [] };
    }

    // Then call it from JS
    const result = get_code_completions(
      payload.code,
      payload.line,
      payload.column,
    );

    if (!result) {
      return { items: [] };
    }

    return JSON.parse(result);
  } catch (err) {
    console.error(err);
    return { items: [] };
  } finally {
    // Python objects must be manually destroyed when passed to Javascript
    // or they will create a memory leak
    // https://pyodide.org/en/0.16.1/type_conversions.html#python-from-javascript
    if (
      get_code_completions &&
      get_code_completions.constructor.name === "PyProxy"
    ) {
      get_code_completions.destroy();
    }
  }
};
