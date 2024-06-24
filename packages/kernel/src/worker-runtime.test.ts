import path from "node:path";
import { test } from "vitest";
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
            requirements: [],
            moduleAutoLoad: false,
            prebuiltPackageNames: [],
          },
        },
      }),
    );
  });
}

test(
  "E2E test running an app",
  async () => {
    const entrypoint = "app.py";

    const pyodide = await initializeWorkerEnv({
      entrypoint,
      files: {
        [entrypoint]: {
          data: `
import streamlit as st
st.write("Hello, world!")
`,
        },
      },
    });

    await pyodide.runPythonAsync(`
from streamlit.testing.v1 import AppTest

at = AppTest.from_file("${entrypoint}")

await at.run()

assert not at.exception, f"Exception occurred: {at.exception}"
    `);
  },
  {
    timeout: 60000,
  },
);
