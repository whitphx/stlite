// @vitest-environment node

import { loadPyodide, PyodideInterface } from "pyodide";
import { describe, expect, it, vi, beforeAll } from "vitest";
import {
  get_hover,
  get_code_completions,
  importLanguageServerPythonLibraries,
} from "./language-server-utils";

const JEDI_WHEEL = new URL(
  "../../py/jedi/jedi-0.19.1-py2.py3-none-any.whl",
  import.meta.url
).href;

vi.mock("./cognite/streamlit-worker-communication-utils", () => {
  return {
    postMessageToStreamLitWorker: vi.fn(),
  };
});

describe("LanguageServerUtils test", () => {
  let pyodide: PyodideInterface;

  /**
   * Import only the necesarry dependencies so we can run jedi
   * and test the language server
   */
  beforeAll(async () => {
    const jediWheelUrl = JEDI_WHEEL as unknown as string;
    const wheels = {
      jedi: jediWheelUrl,
    };

    pyodide = await loadPyodide({
      indexURL: "../../node_modules/pyodide", // Installed at the Yarn workspace root
      stdout: console.log,
      stderr: console.error,
    });

    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    console.log("Installing the wheels:", wheels);

    await micropip.install.callKwargs([wheels.jedi], { keep_going: true });

    // The following code is necessary to avoid errors like  `NameError: name '_imp' is not defined`
    // at importing installed packages.
    await pyodide.runPythonAsync(`
    import importlib
    importlib.invalidate_caches()
    `);

    console.log("Importing Language Server");
    await importLanguageServerPythonLibraries(pyodide, micropip);
  });

  describe("Test Autocomplete", () => {
    it("should return suggestions", async () => {
      const code = `import math
math.c
`;
      const autocompleteResults = await get_code_completions(
        {
          data: {
            code: code,
            currentLine: "math",
            currentLineNumber: 2,
            offset: 6,
          },
          type: "language-server:autocomplete",
        },
        pyodide
      );

      expect(
        autocompleteResults.items.map((item: { label: any }) => item.label)
      ).toEqual(
        expect.arrayContaining(["ceil", "comb", "copysign", "cos", "cosh"])
      );
    });

    it("should handle invalid requests and return empty response", async () => {
      const code = `import math
      math.cos()
      `;
      const suggestions = await get_code_completions(
        {
          data: {
            code: code,
            currentLine: "math",
            currentLineNumber: 3,
            offset: 5,
          },
          type: "language-server:autocomplete",
        },
        pyodide
      );

      expect(suggestions).toEqual(
        expect.objectContaining({
          items: [],
        })
      );
    });
  });

  describe("Test Hover", () => {
    it("should provide hover information for modules and properties", async () => {
      const code = `import math
math.cos()
`;
      const hover = await get_hover(
        {
          data: {
            code: code,
            currentLine: "math",
            currentLineNumber: 2,
            offset: 5,
          },
          type: "language-server:hover",
        },
        pyodide
      );

      expect(hover).toEqual(
        expect.objectContaining({
          contents: {
            kind: "markdown",
            value:
              "```python\ncos(x: SupportsFloat, /) -> float\n```\n\n```\nReturn the cosine of x (measured in radians).\n```",
          },
        })
      );
    });

    it("should handle invalid requests and return empty response", async () => {
      const code = `import math
      math.cos()
      `;
      const hover = await get_hover(
        {
          data: {
            code: code,
            currentLine: "math",
            currentLineNumber: 3,
            offset: 5,
          },
          type: "language-server:hover",
        },
        pyodide
      );

      expect(hover).toEqual(
        expect.objectContaining({
          contents: {
            kind: "markdown",
            value: "",
          },
        })
      );
    });
  });
});
