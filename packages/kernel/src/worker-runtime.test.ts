import path from "node:path";
import { test } from "vitest";
import { startWorkerEnv, PostMessageFn } from "./worker-runtime";
import stliteServerWheelUrl from "stlite_server.whl"; // This is the alias from vitest.config.ts
import streamlitWheelUrl from "streamlit.whl"; // This is the alias from vitest.config.ts

const pyodideUrl = path.resolve("../../node_modules/pyodide/pyodide.mjs"); // Installed at the Yarn workspace root;

function getWheelInstallPath(wheelImportUrl: string): string {
  // `wheelImportUrl` is like `/path/to/stlite_server.whl` that is a URL path.
  // We need to convert it to a local file path so that it can be referred to in the test environment i.e. Node.js.
  // Also, we need to add `file://` scheme to it so that `micropip.install()` can install it.
  return "file://" + path.resolve("." + wheelImportUrl);
}

test(
  "E2E test running an app",
  async () => {
    const loadedPromise = new Promise<void>((resolve, reject) => {
      const postMessage: PostMessageFn = (message) => {
        if (message.type === "event:loaded") {
          resolve();
        } else if (message.type === "event:error") {
          reject(message.data.error);
        }
      };
      const onMessage = startWorkerEnv(pyodideUrl, postMessage);
      onMessage(
        new MessageEvent("message", {
          data: {
            type: "initData",
            data: {
              files: {
                "app.py": {
                  data: `
import streamlit as st

st.title("Hello World")
`,
                },
              },
              entrypoint: "app.py",
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

    await loadedPromise;
  },
  {
    timeout: 60000,
  },
);
