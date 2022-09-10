import React, { useState, useEffect } from "react";
import { StliteKernel, StliteKernelOptions } from "@stlite/stlite-kernel";
import {
  AppData,
  extractAppDataFromUrl,
  ForwardMessage,
  ReplyMessage,
} from "@stlite/sharing-common";
import StreamlitApp from "./StreamlitApp";

const editorAppOriginRegex = process.env.REACT_APP_EDITOR_APP_ORIGIN_REGEX
  ? new RegExp(process.env.REACT_APP_EDITOR_APP_ORIGIN_REGEX)
  : undefined;
function isEditorOrigin(origin: string): boolean {
  if (editorAppOriginRegex) {
    return editorAppOriginRegex.test(origin);
  }

  return origin === process.env.REACT_APP_EDITOR_APP_ORIGIN;
}

function convertFiles(
  appDataFiles: AppData["files"]
): StliteKernelOptions["files"] {
  let files: StliteKernelOptions["files"] = {};
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
  useEffect(() => {
    const appData = extractAppDataFromUrl();

    console.debug("Initialize with", appData);

    const kernel = new StliteKernel(
      appData
        ? {
            command: "run",
            entrypoint: appData.entrypoint,
            files: convertFiles(appData.files),
            requirements: appData.requirements,
          }
        : {
            command: "run",
            entrypoint: "streamlit_app.py",
            files: {
              "streamlit_app.py": {
                data: `import streamlit as st
st.write("Hello World")`,
              },
            },
            requirements: [],
          }
    );
    setKernel(kernel);

    // Handle messages from the editor
    function onMessage(event: MessageEvent<ForwardMessage>) {
      if (!isEditorOrigin(event.origin)) {
        return;
      }

      const port2 = event.ports[0];
      function postReplyMessage(msg: ReplyMessage) {
        port2.postMessage(msg);
      }

      const msg = event.data;
      (() => {
        switch (msg.type) {
          case "file:write": {
            return kernel.writeFile(msg.data.path, msg.data.content);
          }
          case "file:rename": {
            return kernel.renameFile(msg.data.oldPath, msg.data.newPath);
          }
        }
      })()
        .then(() => {
          postReplyMessage({
            type: "reply",
          });
        })
        .catch((error) => {
          postReplyMessage({
            type: "reply",
            error,
          });
        });
    }
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      kernel.dispose();
    };
  }, []);

  return kernel ? <StreamlitApp kernel={kernel}></StreamlitApp> : null;
}

export default App;
