import path from "node:path";
import fsPromises from "node:fs/promises";
import { suite, test, expect, vitest, afterEach } from "vitest";
import type { PyodideInterface } from "pyodide";
import { startWorkerEnv, type PostMessageFn } from "./worker-runtime";
import * as pyodideLoader from "./pyodide-loader";
import { WorkerInitialData } from "./types";
import stliteServerWheelUrl from "stlite_server.whl"; // This is the alias from vitest.config.ts
import streamlitWheelUrl from "streamlit.whl"; // This is the alias from vitest.config.ts

const pyodideUrl = path.resolve("../../node_modules/pyodide/pyodide.mjs"); // Installed at the Yarn workspace root;

function getWheelInstallPath(wheelImportUrl: string): string {
  // `wheelImportUrl` is like `/path/to/stlite_server.whl` that is a URL path.
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
  options: InitializeWorkerEnvOptions,
): Promise<PyodideInterface> {
  return new Promise<PyodideInterface>((resolve, reject) => {
    let pyodide: PyodideInterface;

    // Get the Pyodide instance from the initializer called in the worker by spying on it.
    const originalInitPyodide = pyodideLoader.initPyodide;
    const spiedInitPyodide = vitest
      .spyOn(pyodideLoader, "initPyodide")
      .mockImplementation(async (...args) => {
        const loadedPyodide = await originalInitPyodide(...args);
        pyodide = loadedPyodide;
        return loadedPyodide;
      });

    const postMessage: PostMessageFn = (message) => {
      if (message.type === "event:loaded") {
        expect(spiedInitPyodide).toHaveBeenCalled();
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
              stliteServer: getWheelInstallPath(
                stliteServerWheelUrl as unknown as string,
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
];

suite("Worker intergration test running an app", async () => {
  afterEach(() => {
    vitest.restoreAllMocks();
  });

  for (const testSource of TEST_SOURCES) {
    test.concurrent(
      `Running ${testSource.entrypoint}`,
      async () => {
        const fileNamesContentsObj = Object.fromEntries(
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
          files: fileNamesContentsObj,
          requirements: testSource.requirements,
        });

        // The code above setting up the worker env is good enough to check if the worker is set up correctly,
        // but it doesn't check the error occurred inside the Streamlit app running in the worker.
        // So, we use the code below to test if the Streamlit app runs without any error.
        await pyodide.runPythonAsync(`
from streamlit.testing.v1 import AppTest

at = AppTest.from_file("${testSource.entrypoint}")

await at.run()

assert not at.exception, f"Exception occurred: {at.exception}"
        `);
      },
      {
        timeout: 30 * 1000,
      },
    );
  }
});
