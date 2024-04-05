import { InMessageAutocomplete } from "../types";
import type Pyodide from "pyodide";
import { CompletionItem, LanguageServerEvents } from "./language-server-types";
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
    await micropip.install.callKwargs(["jedi"], { keep_going: true });
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
      // prettier-ignore
      `import jedi;  
code = '''
${msg.data.code}
'''
jedi.Script(code).complete(${msg.data.currentLineNumber}, ${msg.data.offset})`
    );

    /** We must map manually all fields because toJs returns an array with proxy objects
     * and the value is read only when you call the property.
     * JSON.stringify or simular methods do not work
     */
    const suggestions = result.toJs().map((item: CompletionItem) => ({
      name: item.name,
      /** Valid values for type are module, class, instance, function, param, path, keyword, property and statement. */
      type: item.type,
      module_name: item.module_name,
      description: item.description,
      full_name: item.full_name,
      docstring: (item as any).docstring(true),
    }));

    /**
     * This is happening inside a function in a web worker
     * we need to notify the worker that we processed the request
     * so that the Kernel can send the message to fusion
     */
    postMessageToStreamLitWorker(ctx, {
      type: LanguageServerEvents.autocomplete,
      data: {
        suggestions,
      },
    });
  } catch (err) {
    console.error(err);
  }
};
