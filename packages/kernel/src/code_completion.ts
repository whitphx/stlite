import type { PyProxy } from "pyodide/ffi";
import { CodeCompletion } from "./types";

export async function getCodeCompletions(
  jedi: PyProxy,
  code: string,
  position: {
    line: number;
    column: number;
  },
): Promise<CodeCompletion[]> {
  const { line, column } = position;

  const script = jedi.Script(code);

  if (line > script._code_lines.length) {
    return [];
  }

  const jediCompletions = script.complete.callKwargs({
    line: line,
    column: column,
    fuzzy: false,
  });

  const completionItems: CodeCompletion[] = [];
  for (const jediCompletion of jediCompletions.toJs()) {
    completionItems.push({
      name: jediCompletion.name,
      type: jediCompletion.$type, // PyProxy.type is overridden in Pyodide. We need to access it this way. Ref: https://github.com/pyodide/pyodide/issues/4032
      docstring: jediCompletion.docstring.callKwargs({ raw: true }),
      complete: jediCompletion.complete,
    });
    jediCompletion.destroy();
  }

  return completionItems;
}
