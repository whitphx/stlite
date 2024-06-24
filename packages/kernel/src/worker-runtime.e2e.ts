import path from "node:path";
import fsPromises from "node:fs/promises";
import { suite, test } from "vitest";
import type { PyodideInterface } from "pyodide";
import { startWorkerEnv, PostMessageFn } from "./worker-runtime";
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
    const postMessage: PostMessageFn = (message) => {
      if (message.type === "event:loaded") {
        resolve(pyodide);
      } else if (message.type === "event:error") {
        reject(message.data.error);
      }
    };
    const onPyodideLoaded = (loadedPyodide: PyodideInterface) => {
      pyodide = loadedPyodide;
    };
    const onMessage = startWorkerEnv(
      pyodideUrl,
      postMessage,
      undefined,
      onPyodideLoaded,
    );
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

const TEST_SOURCES: { filepath: string; requirements?: string[] }[] = [
  {
    filepath: path.resolve(
      __dirname,
      "../../sharing-editor/public/samples/011_component_gallery/pages/data.column_config.py",
    ),
    requirements: ["faker"],
  },
];

suite("E2E test running an app", async () => {
  for (const testSource of TEST_SOURCES) {
    test(
      `Running ${testSource.filepath}`,
      async () => {
        const { filepath, requirements } = testSource;
        const content = await fsPromises.readFile(filepath);
        const entrypoint = path.basename(filepath);

        const pyodide = await initializeWorkerEnv({
          entrypoint,
          files: {
            [entrypoint]: {
              data: content,
            },
          },
          requirements,
        });

        await pyodide.runPythonAsync(`
from streamlit.testing.v1 import AppTest

at = AppTest.from_file("${entrypoint}")

await at.run()

assert not at.exception, f"Exception occurred: {at.exception}"
        `);
      },
      {
        timeout: 10 * 1000,
      },
    );
  }
});
