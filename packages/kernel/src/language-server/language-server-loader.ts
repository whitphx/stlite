import type Pyodide from "pyodide";
import type { PyProxy } from "pyodide/ffi";

/**
 * Imports the necessary python packages to enable language server features
 */
export const importLanguageServerLibraries = async (
  pyodide: Pyodide.PyodideInterface,
  micropip: PyProxy,
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
