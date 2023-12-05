import React from "react";
import ReactDOM from "react-dom";
import StreamlitApp from "./StreamlitApp";
import { StliteKernel } from "@stlite/kernel";
import { getParentUrl } from "./url";
import { canonicalizeMountOptions, MountOptions } from "./options";
import {
  ToastContainer,
  makeToastKernelCallbacks,
  StliteKernelWithToast,
} from "@stlite/common-react";
import "react-toastify/dist/ReactToastify.css";
import "@stlite/common-react/src/toastify-components/toastify.css";

/**
 * If `PUBLIC_PATH` which is exported as a global variable `__webpack_public_path__` (https://webpack.js.org/guides/public-path/#on-the-fly)
 * is set as a relative URL, resolve and override it based on the URL of this script itself,
 * which will be transpiled into `stlite.js` at the root of the output directory.
 */
let wheelBaseUrl: string | undefined = undefined;
if (
  typeof __webpack_public_path__ === "string" &&
  (__webpack_public_path__ === "." || __webpack_public_path__.startsWith("./"))
) {
  if (document.currentScript && "src" in document.currentScript) {
    const selfScriptUrl = document.currentScript.src;
    const selfScriptBaseUrl = getParentUrl(selfScriptUrl);

    __webpack_public_path__ = selfScriptBaseUrl; // For webpack dynamic imports
    wheelBaseUrl = selfScriptBaseUrl;
  }
}

export function mount(
  options: MountOptions,
  container: HTMLElement = document.body
) {
  const kernel = new StliteKernel({
    ...canonicalizeMountOptions(options),
    wheelBaseUrl,
    ...makeToastKernelCallbacks(),
  });
  ReactDOM.render(
    <React.StrictMode>
      <StreamlitApp kernel={kernel} />
      <ToastContainer />
    </React.StrictMode>,
    container
  );

  const kernelWithToast = new StliteKernelWithToast(kernel);

  return {
    unmount: () => {
      kernel.dispose();
      ReactDOM.unmountComponentAtNode(container);
    },
    install: (requirements: string[]) => {
      return kernelWithToast.install(requirements);
    },
    writeFile: (
      path: string,
      data: string | ArrayBufferView,
      opts?: Record<string, any>
    ) => {
      return kernelWithToast.writeFile(path, data, opts);
    },
    renameFile: (oldPath: string, newPath: string) => {
      return kernelWithToast.renameFile(oldPath, newPath);
    },
    unlink: (path: string) => {
      return kernelWithToast.unlink(path);
    },
  };
}

export interface AppData {
  entrypoint?: string;
  files: {
    [key: string]: {
      content?:
        | {
            $case: "text";
            text: string;
          }
        | {
            $case: "data";
            data: Uint8Array;
          };
    };
  };
  requirements: string[];
}

let prevApp: AppData | null = null;
let mountedApp: any = null;

window.addEventListener(
  "message",
  async (event) => {
    if (typeof event.data === "object" && "code" in event.data) {
      if (!mountedApp) {
        mountedApp = mount(
          {
            entrypoint: "streamlit_app.py",
            files: {},
            requirements: ["matplotlib"],
          },
          document.getElementById("root") as HTMLElement
        );
      }

      mountedApp.writeFile("streamlit_app.py", event.data.code);
    } else if (typeof event.data === "object" && "app" in event.data) {
      const app = event.data.app;
      if (!mountedApp) {
        const restructuredFiles: { [key: string]: string } = {};

        // File format is not exactly identical
        for (const fileName in app.files) {
          restructuredFiles[fileName] = app.files[fileName].content.text;
        }

        app.files = restructuredFiles;

        // Might not have an entrypoint
        if (!app.entrypoint) {
          // Just guess that the first .py file is the entrypoint
          // TODO: fix this to be more robust
          for (const fileName in app.files) {
            if (fileName.endsWith(".py")) {
              app.entrypoint = fileName;
              break;
            }
          }
        }
        mountedApp = mount(app, document.getElementById("root") as HTMLElement);
        prevApp = app;
      } else {
        if (prevApp) {
          // Remove any deleted files
          Object.keys(prevApp.files).forEach((prevFileName) => {
            if (!(prevFileName in app.files)) {
              mountedApp.unlink(prevFileName);
            }
          });

          // Write any new or changed files
          for (const fileName in app.files) {
            if (
              !(fileName in prevApp.files) ||
              app.files[fileName].content !== prevApp.files[fileName].content
            ) {
              mountedApp.writeFile(fileName, app.files[fileName].content.text);
            }
          }
        }

        prevApp = event.data.app;
      }
    }
  },
  false
);

// communicate if in iframe to parent (top)
if (window.top) {
  window.top.postMessage(
    {
      streamlitstatus: "ready",
    },
    "*"
  );
}
