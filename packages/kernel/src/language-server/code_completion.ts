import type { PyProxy } from "pyodide/ffi";
import { CodeCompletionItem, LanguageServerRequestPayload } from "../types";

export async function getCodeCompletions(
  payload: LanguageServerRequestPayload,
  jedi: PyProxy,
): Promise<CodeCompletionItem[]> {
  const { code, line, column } = payload;

  const script = jedi.Script(code);

  if (line > script._code_lines.length) {
    return [];
  }

  const jediCompletions = script.complete.callKwargs({
    line: line,
    column: column,
    fuzzy: false,
  });

  const completionItems: CodeCompletionItem[] = [];
  for (const jediCompletion of jediCompletions.toJs()) {
    const type = jediCompletion.$type; // PyProxy.type is overridden in Pyodide. We need to access it this way. Ref: https://github.com/pyodide/pyodide/issues/4032
    completionItems.push({
      name: jediCompletion.name,
      type,
      docstring: jediCompletion.docstring.callKwargs({ raw: true }),
    });
    jediCompletion.destroy();
  }

  return completionItems;
}
