import type Pyodide from "pyodide";
import type { PyProxy } from "pyodide/ffi";
import { defineCodeCompletionsFunction } from "./code_completion";

/**
 * Imports the necessary python packages to enable language server features
 */
export const importLanguageServerLibraries = async (
  pyodide: Pyodide.PyodideInterface,
  micropip: PyProxy
) => {
  try {
    console.debug("Importing jedi Interpreter");
    await micropip.install.callKwargs(["jedi", "lsprotocol"], {
      keep_going: true,
    });
    await defineCodeCompletionsFunction(pyodide);
  } catch (err) {
    console.error("Error while importing jedi", err);
  }
};
