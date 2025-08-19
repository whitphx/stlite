import { useState, useEffect } from "react";
import { StliteKernel, StliteKernelOptions } from "@stlite/kernel";
import {
  AppData,
  extractAppDataFromUrlHash,
  ForwardMessage,
  ReplyMessage,
  ModuleAutoLoadSuccessMessage,
  CodeCompletionResponseMessage,
} from "@stlite/sharing-common";
import StreamlitApp from "./StreamlitApp";
import { isLanguageServerEnabled, isSharedWorkerMode } from "./urlparams";
import {
  makeToastKernelCallbacks,
  StliteKernelWithToast,
} from "@stlite/common-react";
import STLITE_LIB_WHEEL from "stlite_lib.whl";
import STREAMLIT_WHEEL from "streamlit.whl";

declare const EDITOR_APP_ORIGIN_REGEX: string;
declare const EDITOR_APP_ORIGIN: string;
const wheelUrls = {
  // The resolved URLs such as STLITE_LIB_WHEEL only contain the pathnames e.g. "/assets/stlite_lib-0.1.0-py3-none-any.whl"
  // and micropip treats such path-only URLs as local file URLs e.g. "file:////assets/stlite_lib-0.1.0-py3-none-any.whl"
  // since 0.7.0 due to the change by https://github.com/pyodide/micropip/pull/145,
  // though these URLs are actually for remote resources.
  // So we need to convert these path-only URLs to full URLs including the protocol explicitly.
  stliteLib: new URL(STLITE_LIB_WHEEL, import.meta.url).href,
  streamlit: new URL(STREAMLIT_WHEEL, import.meta.url).href,
};

const editorAppOriginRegex = EDITOR_APP_ORIGIN_REGEX
  ? new RegExp(EDITOR_APP_ORIGIN_REGEX)
  : undefined;
function isEditorOrigin(origin: string): boolean {
  if (editorAppOriginRegex) {
    return editorAppOriginRegex.test(origin);
  }

  return origin === EDITOR_APP_ORIGIN;
}

let communicatedEditorOrigin = "";

function convertFiles(
  appDataFiles: AppData["files"],
): StliteKernelOptions["files"] {
  const files: StliteKernelOptions["files"] = {};
  Object.keys(appDataFiles).forEach((key) => {
    const value = appDataFiles[key];
    if (value.content == null) {
      return;
    }
    files[key] = {
      data:
        value.content.$case === "text"
          ? value.content.text
          : value.content.data,
    };
  });
  return files;
}

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  const [appKey, setAppKey] = useState(0); // This is used to force re-rendering of the StreamlitApp component when the kernel is rebooted.
  useEffect(() => {
    let unmounted = false;
    let _kernel: StliteKernel | null = null;
    let onMessage: ((e: MessageEvent<ForwardMessage>) => void) | null;
    extractAppDataFromUrlHash(window.location.hash)
      .catch((err) => {
        console.error("Failed to extract app data from URL. Show default app.");
        console.error(err);

        const defaultAppData: AppData = {
          entrypoint: "streamlit_app.py",
          files: {
            "streamlit_app.py": {
              content: {
                $case: "text",
                text: `import streamlit as st
st.write("Hello World")`,
              },
            },
          },
          requirements: [],
        };
        return defaultAppData;
      })
      .then((appData) => {
        if (unmounted) {
          return;
        }

        console.debug("Initialize with", appData);

        const kernel = new StliteKernel({
          entrypoint: appData.entrypoint,
          files: convertFiles(appData.files),
          archives: [],
          requirements: appData.requirements,
          prebuiltPackageNames: [],
          ...makeToastKernelCallbacks(),
          moduleAutoLoad: true,
          languageServer: isLanguageServerEnabled(),
          sharedWorker: isSharedWorkerMode(),
          wheelUrls,
          workerType: "module", // Vite loads the worker scripts as ES modules without bundling at dev time, so we need to specify the type as "module" for the "import" statements in the worker script to work.
        });
        _kernel = kernel;
        setKernel(kernel);

        const kernelWithToast = new StliteKernelWithToast(kernel, {
          onModuleAutoLoad: (packagesToLoad, installPromise) => {
            console.log("Module auto-load started", packagesToLoad);
            installPromise
              .then((loadedPackages) => {
                console.log("Module auto-load success", loadedPackages);
                window.parent.postMessage(
                  {
                    type: "moduleAutoLoadSuccess",
                    data: {
                      packagesToLoad,
                      loadedPackages,
                    },
                    stlite: true,
                  } as ModuleAutoLoadSuccessMessage,
                  EDITOR_APP_ORIGIN ?? communicatedEditorOrigin, // Fall back to the origin of the last message from the editor app if the EDITOR_APP_ORIGIN is not set, i.e. in preview deployments.
                );
              })
              .catch((error) => {
                console.error("Auto install failed", error);
              });
          },
        });

        // Handle messages from the editor
        onMessage = (event) => {
          if (!isEditorOrigin(event.origin)) {
            return;
          }

          communicatedEditorOrigin = event.origin;

          const port2 = event.ports[0];
          function postReplyMessage(msg: ReplyMessage) {
            port2.postMessage(msg);
          }

          const msg = event.data;
          (() => {
            switch (msg.type) {
              case "reboot": {
                return kernelWithToast.reboot(msg.data.entrypoint).then(() => {
                  setAppKey((prev) => prev + 1);
                });
              }
              case "file:write": {
                return kernelWithToast.writeFile(
                  msg.data.path,
                  msg.data.content,
                );
              }
              case "file:rename": {
                return kernelWithToast.renameFile(
                  msg.data.oldPath,
                  msg.data.newPath,
                );
              }
              case "file:unlink": {
                return kernelWithToast.unlink(msg.data.path);
              }
              case "install": {
                return kernelWithToast.install(msg.data.requirements, {
                  keep_going: true,
                });
              }
              case "code_completion_request": {
                return kernel
                  .getCodeCompletion(msg.data.code, {
                    line: msg.data.line,
                    column: msg.data.column,
                  })
                  .then(
                    (codeCompletions) =>
                      ({
                        type: "reply:code_completion_response",
                        data: {
                          items: codeCompletions,
                        },
                      }) satisfies CodeCompletionResponseMessage,
                  );
              }
            }
          })()
            .then((response) => {
              postReplyMessage(
                (response as ReplyMessage) || {
                  type: "reply",
                },
              );
            })
            .catch((error) => {
              postReplyMessage({
                type: "reply",
                error,
              });
            });
        };
        window.addEventListener("message", onMessage);
      });

    return () => {
      unmounted = true;

      if (onMessage) {
        window.removeEventListener("message", onMessage);
      }
      _kernel?.dispose();
    };
  }, []);

  return kernel ? <StreamlitApp kernel={kernel} key={appKey} /> : null;
}

export default App;
