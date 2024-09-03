import path from "node:path";
import fsPromises from "node:fs/promises";
import { suite, test, expect, vitest, afterEach } from "vitest";
import type { PyodideInterface } from "pyodide";
import { startWorkerEnv, type PostMessageFn } from "./worker-runtime";
import * as pyodideLoader from "./pyodide-loader";
import { WorkerInitialData } from "./types";
import stliteLibWheelUrl from "stlite_lib.whl"; // This is an alias configured in vitest.config.ts
import streamlitWheelUrl from "streamlit.whl"; // This is an alias configured in vitest.config.ts
const JEDI_WHEEL = new URL(
  "../../py/jedi/jedi-0.19.1-py2.py3-none-any.whl",
  import.meta.url
).href;

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
}
function initializeWorkerEnv(
  options: InitializeWorkerEnvOptions
): Promise<PyodideInterface> {
  return new Promise<PyodideInterface>((resolve, reject) => {
    let pyodide: PyodideInterface;

    // Get the Pyodide instance from the initializer called in the worker by spying on it.
    const originalInitPyodide = pyodideLoader.initPyodide;
    const spiedInitPyodide = vitest
      .spyOn(pyodideLoader, "initPyodide")
      .mockImplementationOnce(async (...args) => {
        const loadedPyodide = await originalInitPyodide(...args);
        pyodide = loadedPyodide;
        return loadedPyodide;
      });

    const postMessage: PostMessageFn = (message) => {
      if (message.type === "event:loaded") {
        expect(spiedInitPyodide).toHaveBeenCalled();
        spiedInitPyodide.mockRestore();
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
                stliteLibWheelUrl as unknown as string
              ),
              streamlit: getWheelInstallPath(
                streamlitWheelUrl as unknown as string
              ),
              jedi: getWheelInstallPath(JEDI_WHEEL as unknown as string),
            },
            archives: [],
            requirements: options.requirements ?? [],
            moduleAutoLoad: false,
            prebuiltPackageNames: [],
          },
        },
      })
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
        "../../sharing-editor/public/samples/011_component_gallery/pages/data.column_config.py"
      ),
    },
  },
  {
    entrypoint: "chat.echo.py",
    files: {
      "chat.echo.py": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/chat.echo.py"
      ),
    },
  },
  {
    entrypoint: "media.logo.py",
    files: {
      "media.logo.py": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/media.logo.py"
      ),
      "pages/images/horizontal_red.png": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/images/horizontal_red.png"
      ),
      "pages/images/icon_red.png": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/images/icon_red.png"
      ),
    },
  },
  {
    // Checks if the async customization of st.write_stream() and runtime AST manipulation works.
    entrypoint: "text.write_stream.py",
    files: {
      "text.write_stream.py": path.resolve(
        __dirname,
        "../../sharing-editor/public/samples/011_component_gallery/pages/text.write_stream.py"
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
        "../../sharing-editor/public/samples/011_component_gallery/pages/layout.columns2.py"
      ),
    },
  },
];

suite("Worker intergration test running an app", async () => {
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
              }
            )
          )
        );

        const pyodide = await initializeWorkerEnv({
          entrypoint: testSource.entrypoint,
          files,
          requirements: testSource.requirements,
        });

        pyodide.globals.set(
          "__additionalAppTestCode__",
          testSource.additionalAppTestCode
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
      }
    );
  }
});
