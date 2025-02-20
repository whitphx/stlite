import fsPromises from "node:fs/promises";
import path from "node:path";
import type { PyodideInterface } from "pyodide";
import stliteLibWheelUrl from "stlite_lib.whl"; // This is an alias configured in vitest.config.ts
import streamlitWheelUrl from "streamlit.whl"; // This is an alias configured in vitest.config.ts
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  suite,
  test,
  vitest,
} from "vitest";
import { getCodeCompletions } from "./language-server/code_completion";
import { WorkerInitialData } from "./types";
import { type PostMessageFn } from "./worker-runtime";

const pyodideUrl = path.resolve("../../node_modules/pyodide/pyodide.mjs"); // Installed at the Yarn workspace root;

function getWheelInstallPath(wheelImportUrl: string): string {
  // `wheelImportUrl` is like `/path/to/stlite_lib.whl` that is a URL path.
  // We need to convert it to a local file path so that it can be referred to in the test environment i.e. Node.js.
  // Also, we need to add `file://` scheme to it so that `micropip.install()` can install it.
  return "file://" + path.resolve("." + wheelImportUrl);
}

interface InitializeWorkerEnvOptions {
  entrypoint: string;
  files: WorkerInitialData["files"];
  requirements?: WorkerInitialData["requirements"];
  languageServer?: boolean;
}
async function initializeWorkerEnv(
  options: InitializeWorkerEnvOptions,
): Promise<PyodideInterface> {
  const pyodideLoader: typeof import("./pyodide-loader") =
    await vitest.importActual("./pyodide-loader");
  const initPyodide = pyodideLoader.initPyodide;

  // Get the Pyodide instance from the initializer called in the worker by spying on it.
  let pyodide: PyodideInterface;
  const initPyodideMock = vitest
    .fn()
    .mockImplementation(async (...args: Parameters<typeof initPyodide>) => {
      pyodide = await initPyodide(...args);
      return pyodide;
    });
  // Use `doMock` to work with the async import of `pyodide-loader` below.
  vitest.doMock("./pyodide-loader", () => ({
    initPyodide: initPyodideMock,
  }));

  // Use async-import in combination with `vi.resetModules()` in `beforeEach()`
  // to reset the module cache and re-import the module.
  const { startWorkerEnv } = await import("./worker-runtime");

  return new Promise<PyodideInterface>((resolve, reject) => {
    const postMessage: PostMessageFn = (message) => {
      if (message.type === "event:loaded") {
        expect(initPyodideMock).toHaveBeenCalled();
        initPyodideMock.mockRestore();
        resolve(pyodide);
      } else if (message.type === "event:error") {
        reject(message.data.error);
      }
    };

    const onMessage = startWorkerEnv(pyodideUrl, postMessage, undefined);

    // Send the initializer message to the worker.
    onMessage(
      new MessageEvent("message", {
        data: {
          type: "initData",
          data: {
            files: options.files,
            entrypoint: options.entrypoint,
            wheels: {
              stliteLib: getWheelInstallPath(
                stliteLibWheelUrl as unknown as string,
              ),
              streamlit: getWheelInstallPath(
                streamlitWheelUrl as unknown as string,
              ),
            },
            archives: [],
            requirements: options.requirements ?? [],
            moduleAutoLoad: false,
            prebuiltPackageNames: [],
            languageServer: options.languageServer ?? false,
          },
        },
      }),
    );
  });
}

const TEST_SOURCES: {
  files: Record<string, string>;
  entrypoint: string;
  requirements?: string[];
  additionalAppTestCode?: string;
}[] = [
  {
    entrypoint: "data.column_config.py",
    requirements: ["faker"],
    files: {
      "data.column_config.py": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/data.column_config.py",
      ),
    },
  },
  {
    entrypoint: "chat.echo.py",
    files: {
      "chat.echo.py": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/chat.echo.py",
      ),
    },
  },
  {
    entrypoint: "media.logo.py",
    files: {
      "media.logo.py": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/media.logo.py",
      ),
      "pages/images/horizontal_red.png": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/images/horizontal_red.png",
      ),
      "pages/images/icon_red.png": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/images/icon_red.png",
      ),
    },
  },
  {
    // Checks if the async customization of st.write_stream() and runtime AST manipulation works.
    entrypoint: "text.write_stream.py",
    files: {
      "text.write_stream.py": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/text.write_stream.py",
      ),
    },
    additionalAppTestCode: `
at.button[0].click()
await at.run(timeout=20)
`,
  },
  {
    // Checks if the Parquet serializer's auto-fixing of non-string column names works. Ref: https://github.com/whitphx/stlite/issues/978
    entrypoint: "layout.columns2.py",
    files: {
      "layout.columns2.py": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/layout.columns2.py",
      ),
    },
  },
];

suite("Worker intergration test running an app", async () => {
  beforeEach(() => {
    vitest.resetModules();
  });
  afterEach(() => {
    vitest.restoreAllMocks();
  });

  for (const testSource of TEST_SOURCES) {
    test(
      // NOTE: Vitest doesn't support concurrent tests in a single file: https://github.com/vitest-dev/vitest/issues/1530
      `Running ${testSource.entrypoint}`,
      async () => {
        const files = Object.fromEntries(
          await Promise.all(
            Object.entries(testSource.files).map(
              async ([filename, filepath]) => {
                const content = await fsPromises.readFile(filepath);
                return [filename, { data: content }];
              },
            ),
          ),
        );

        const pyodide = await initializeWorkerEnv({
          entrypoint: testSource.entrypoint,
          files,
          requirements: testSource.requirements,
        });

        pyodide.globals.set(
          "__additionalAppTestCode__",
          testSource.additionalAppTestCode,
        );

        // The code above setting up the worker env is good enough to check if the worker is set up correctly,
        // but it doesn't check the error occurred inside the Streamlit app running in the worker.
        // So, we use the code below to test if the Streamlit app runs without any error.
        await pyodide.runPythonAsync(`
import ast
import asyncio
import warnings
from streamlit.testing.v1 import AppTest

at = AppTest.from_file("${testSource.entrypoint}")

with warnings.catch_warnings(record=True) as w:  # Test warning messages. Ref: https://docs.python.org/3/library/warnings.html#testing-warnings
    warnings.simplefilter("always")
    warnings.filterwarnings("ignore", message=r"\\n?Pyarrow will become a required dependency of pandas in the next major release of pandas")  # Ignore PyArrow version warning from Pandas (https://github.com/pandas-dev/pandas/blob/v2.2.0/pandas/__init__.py#L221-L231)

    await at.run()

    if __additionalAppTestCode__:
        bytecode = compile(__additionalAppTestCode__, "<string>", "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
        await eval(bytecode)

assert not at.exception, f"Exception occurred: {at.exception}"
assert len(w) == 0, f"Warning occurred: {w[0].message if w else None}"
        `);
      },
      {
        timeout: 60 * 1000,
      },
    );
  }
});

suite(
  "Worker language server test",
  async () => {
    let pyodide: PyodideInterface;
    beforeAll(async () => {
      vitest.resetModules();
      const filePath = path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/chat.input.py",
      );
      const content = await fsPromises.readFile(filePath);

      pyodide = await initializeWorkerEnv({
        entrypoint: "chat.input.py",
        files: {
          "chat.input.py": { data: content },
        },
        languageServer: true,
      });
    });
    afterAll(() => {
      vitest.restoreAllMocks();
    });

    test("should give suggestions starting with word after the cursor", async () => {
      // Should give suggestions starting with word after the cursor
      const code = `import math
math.co
`;
      const autocompleteResults = await getCodeCompletions(
        {
          code: code,
          currentLine: "math",
          currentLineNumber: 2,
          offset: 6,
        },
        pyodide as PyodideInterface,
      );

      // Should give suggestions for the word after the comma
      expect(
        autocompleteResults.items.map((item: { label: string }) => item.label),
      ).toEqual(expect.arrayContaining(["comb", "copysign", "cos", "cosh"]));
    });

    test("should return suggestions for a module when no prefix after the cursor is present", async () => {
      // Should give suggestions for a module when no prefix is present
      const code = `import math
math.
`;
      const autocompleteResults = await getCodeCompletions(
        {
          code: code,
          currentLine: "math",
          currentLineNumber: 2,
          offset: 5,
        },
        pyodide as PyodideInterface,
      );

      expect(
        autocompleteResults.items.map((item: { label: string }) => item.label),
      ).toEqual(
        expect.arrayContaining([
          "acos",
          "acosh",
          "asin",
          "asinh",
          "atan",
          "atan2",
          "ceil",
          "comb",
        ]),
      );
    });

    test("should give function arguments suggestions", async () => {
      // Should give function arguments suggestions
      const code = `import json
x = {}
json.dumps(x, 
`;
      const autocompleteResults = await getCodeCompletions(
        {
          code: code,
          currentLine: "json.dumps(x, ",
          currentLineNumber: 3,
          offset: 13,
        },
        pyodide as PyodideInterface,
      );

      expect(
        autocompleteResults.items.map((item: { label: string }) => item.label),
      ).toEqual(
        expect.arrayContaining([
          "allow_nan=",
          "check_circular=",
          "cls=",
          "default=",
          "ensure_ascii=",
          "indent=",
          "separators=",
          "skipkeys=",
          "sort_keys=",
        ]),
      );
    });

    test("should give suggestions for local functions", async () => {
      // Should give suggestions for local functions
      const code = `import json
def handle(param_1: int, limit: str = "default") -> str:
  """
  This function returns the parameters as a string.
  """
  return f"Result - param_1: {param_1}, limit: {limit}"

handle
`;
      const autocompleteResults = await getCodeCompletions(
        {
          code: code,
          currentLine: "handle",
          currentLineNumber: 8,
          offset: 6,
        },
        pyodide as PyodideInterface,
      );

      expect(
        autocompleteResults.items.map(
          (item: { label: string; documentation: string }) => ({
            label: item.label,
            documentation: item.documentation.trim(),
          }),
        ),
      ).toEqual(
        expect.arrayContaining([
          {
            label: "handle",
            documentation: "This function returns the parameters as a string.",
          },
        ]),
      );
    });

    test("should handle invalid requests and return empty response", async () => {
      const code = `import math
      math.cos()
      `;

      const suggestions = await getCodeCompletions(
        {
          code: code,
          currentLine: "math",
          currentLineNumber: 3,
          offset: 5,
        },
        pyodide as PyodideInterface,
      );

      expect(suggestions).toEqual(
        expect.objectContaining({
          items: [],
        }),
      );
    });

    test("should handle invalid requests when the code contains string literals", async () => {
      const code = `'''`;

      // This will throw an error and it should be handled and return an empty list
      // SyntaxError: unterminated triple-quoted string literal (detected at line 92)
      const suggestions = await getCodeCompletions(
        {
          code: code,
          currentLine: "'''",
          currentLineNumber: 1,
          offset: 3,
        },
        pyodide as PyodideInterface,
      );

      expect(suggestions).toEqual(
        expect.objectContaining({
          items: [],
        }),
      );
    });
  },
  {
    // the tests take bit longer to execute
    // because we are loading pyodide,files..etc.
    // giving extra buffer time so that the test doesn't timeout
    // usually it takes way less time, max 7-8s
    timeout: 60 * 1000,
  },
);
