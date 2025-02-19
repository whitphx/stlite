/** Needed for the Regex bellow */
/* eslint-disable no-useless-escape */
import type Pyodide from "pyodide";
import { LanguageServerRequestPayload } from "../types";

export const getCodeCompletions = async (
  payload: LanguageServerRequestPayload,
  pyodide: Pyodide.PyodideInterface,
) => {
  try {
    // Indentation is very important in python, don't change this!
    const result = await pyodide.runPythonAsync(
      `import jedi;
import re;
import json;
from typing import Dict, Iterator, List
from lsprotocol.types import (CompletionItem, CompletionList, CompletionItemKind, Position, Range, TextEdit)
from lsprotocol import converters as lsp_converters
from jedi.api.classes import Completion

def get_jedi_line_number(current_line_number: int) -> tuple[int, int]:
    """Convert position to jedi position (the line is 1+ based)."""
    return current_line_number + 1

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

def as_completion_item(completion: Completion, cursor_range: Range) -> Dict:
  label = completion.name
  return CompletionItem(
      label=label,
      filter_text=label,
      sort_text=label,
      kind=as_completion_item_kind(completion.type),
      documentation=completion.docstring(raw=True),
      text_edit=TextEdit(range=cursor_range, new_text=label),
  )

def get_cursor_range(cursor_code_line: str, current_line_number: int, cursor_offset: int):
  # Match the substring starting from cursor_offset ex: math<cursor>co, match co
  matched_words = re.search(r'\b\w+', cursor_code_line[cursor_offset:])

  # Determine the length of the matched word characters
  word_after_cursor_length = len(matched_words_after_cursor.group()) if matched_words else 0

  return Range(
    start=Position(
        line=current_line_number, character=cursor_offset
    ),
    end=Position(
        line=current_line_number,
        character=cursor_offset + word_after_cursor_length,
    ),
  )

def get_code_completions():

  code = '''
${payload.code}
  '''


  jedi_language_server = jedi.Script(code)
  current_line_number = ${payload.currentLineNumber}
  cursor_offset = ${payload.offset}

  jedi_completions_list = jedi_language_server.complete(
      get_jedi_line_number(current_line_number),
      cursor_offset,
      fuzzy=False,
  )

  code_at_cursor = jedi_language_server._code_lines[current_line_number]
  cursor_range = get_cursor_range(code_at_cursor, current_line_number, cursor_offset)

  # Convert jedi completion items as completion items compatible in language server
  suggestions = CompletionList(
    is_incomplete=False, 
    items=list(as_completion_item(completion, cursor_range) for completion in jedi_completions_list))

  # Convert results to JSON so that we can use it in the worker
  converter = lsp_converters.get_converter()
  return json.dumps(converter.unstructure(suggestions, unstructure_as=CompletionList))


get_code_completions()`,
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
