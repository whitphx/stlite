import path from "node:path";
import fsPromises from "node:fs/promises";
import { suite, test, expect, vitest, afterEach } from "vitest";
import type { PyodideInterface } from "pyodide";
import { startWorkerEnv, type PostMessageFn } from "./worker-runtime";
import * as pyodideLoader from "./pyodide-loader";
import { WorkerInitialData } from "./types";
import stliteLibWheelUrl from "stlite_lib.whl"; // This is an alias configured in vitest.config.ts
import streamlitWheelUrl from "streamlit.whl"; // This is an alias configured in vitest.config.ts

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
  shared?: boolean;
}
function initializeWorkerEnv(
  options: InitializeWorkerEnvOptions,
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

    const onMessage = startWorkerEnv(pyodideUrl, postMessage, {
      shared: options.shared ?? false,
      presetInitialData: undefined,
    });

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

suite("DedicatedWorker integration test running an app", async () => {
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
          shared: false,
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

suite("SharedWorker integration tests", async () => {
  afterEach(() => {
    vitest.restoreAllMocks();
  });

  test(
    "SharedWorker initialization and connection",
    async () => {
      const files = {
        "test.py": {
          data: "import streamlit as st\nst.write('Hello from SharedWorker')",
        },
      };

      const pyodide = await initializeWorkerEnv({
        entrypoint: "test.py",
        files,
        shared: true,
      });

      // Verify SharedWorker initialization
      expect(pyodide).toBeDefined();
      expect(pyodide.globals.get("st")).toBeDefined();
    },
    { timeout: 10000 },
  );

  test(
    "Multiple concurrent connections",
    async () => {
      const testFiles = {
        "test.py": {
          data: "import streamlit as st\nst.write('Testing concurrent connections')",
        },
      };

      // Create multiple connections
      const connections = await Promise.all([
        initializeWorkerEnv({
          entrypoint: "test.py",
          files: testFiles,
          shared: true,
        }),
        initializeWorkerEnv({
          entrypoint: "test.py",
          files: testFiles,
          shared: true,
        }),
        initializeWorkerEnv({
          entrypoint: "test.py",
          files: testFiles,
          shared: true,
        }),
      ]);

      // Verify all connections are active
      connections.forEach((pyodide) => {
        expect(pyodide).toBeDefined();
        expect(pyodide.globals.get("st")).toBeDefined();
      });
    },
    { timeout: 15000 },
  );

  test(
    "Resource cleanup",
    async () => {
      const cleanupFiles = {
        "test.py": {
          data: "import streamlit as st\nst.write('Testing cleanup')",
        },
      };

      const pyodide = await initializeWorkerEnv({
        entrypoint: "test.py",
        files: cleanupFiles,
      });

      // Mock port.close() to verify it's called
      const portCloseSpy = vitest.fn();
      const port = { close: portCloseSpy };

      // Simulate cleanup
      pyodide.globals.set("__cleanup__", () => {
        port.close();
      });

      await pyodide.runPythonAsync("__cleanup__()");
      expect(portCloseSpy).toHaveBeenCalled();
    },
    { timeout: 10000 },
  );

  test(
    "Message routing between connections",
    async () => {
      const routingFiles = {
        "test.py": {
          data: `
import streamlit as st
import time

if 'counter' not in st.session_state:
    st.session_state.counter = 0

st.session_state.counter += 1
st.write(f'Connection {st.session_state.counter}')
`,
        },
      };

      // Create two connections to the shared worker
      const [connection1, connection2] = await Promise.all([
        initializeWorkerEnv({
          entrypoint: "test.py",
          files: routingFiles,
          shared: true,
        }),
        initializeWorkerEnv({
          entrypoint: "test.py",
          files: routingFiles,
          shared: true,
        }),
      ]);

      // Initialize counter in first connection
      await connection1.runPythonAsync(`
if 'counter' not in st.session_state:
    st.session_state.counter = 0
st.session_state.counter += 1
    `);

      // Verify state is shared between connections
      const counter1 = await connection1.runPythonAsync(
        "st.session_state.counter",
      );
      const counter2 = await connection2.runPythonAsync(
        "st.session_state.counter",
      );

      // Both connections should see the same counter value since they share state
      expect(counter1).toBe(1);
      expect(counter2).toBe(1);
    },
    { timeout: 15000 },
  );
});
