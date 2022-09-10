import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "./App.css";
import {
  embedAppDataToUrl,
  AppData,
  File,
  ForwardMessage,
  ReplyMessage,
} from "@stlite/sharing-common";
import Editor, { EditorProps } from "./Editor";

const SHARING_APP_URL =
  process.env.REACT_APP_SHARING_APP_URL ?? "http://localhost:3000/";
const SHARING_APP_ORIGIN = new URL(SHARING_APP_URL).origin;

// NOTE: Only for dev and demo purpose
const stliteLogoPngUrl = "https://whitphx.github.io/stlite/logo512.png";
let stliteLogoPng: ArrayBuffer | undefined = undefined;
const fetchStliteLogoPngUrl = (): Promise<ArrayBuffer> => {
  if (stliteLogoPng) {
    return Promise.resolve(stliteLogoPng);
  }

  return fetch(stliteLogoPngUrl)
    .then((res) => res.arrayBuffer())
    .then((binary) => {
      stliteLogoPng = binary;
      return stliteLogoPng;
    });
};

function App() {
  const [appData, setAppData] = useState<AppData>();
  useEffect(() => {
    fetchStliteLogoPngUrl().then((binary) => {
      setAppData({
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": {
            content: {
              $case: "text",
              text: `
import streamlit as st
from PIL import Image

st.title("Main page")

image = Image.open('data/logo.png')
st.image(image, caption='Sunrise by the mountains')
`,
            },
          },
          "pages/page1.py": {
            content: {
              $case: "text",
              text: `
import streamlit as st

st.title("Sub page")`,
            },
          },
          "data/logo.png": {
            content: {
              $case: "data",
              data: new Uint8Array(binary),
            },
          },
        },
        requirements: [],
      });
    });
    return;
  }, []);

  const url = useMemo(
    () => (appData ? embedAppDataToUrl(SHARING_APP_URL, appData) : null),
    [appData]
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const postAsyncMessage = useCallback(
    (message: ForwardMessage): Promise<void> => {
      return new Promise((resolve, reject) => {
        const targetWindow = iframeRef.current?.contentWindow;
        if (targetWindow == null) {
          throw new Error(`The target iframe window is not ready`);
        }

        const channel = new MessageChannel();

        channel.port1.onmessage = (e: MessageEvent<ReplyMessage>) => {
          channel.port1.close();
          const reply = e.data;
          if (reply.error) {
            reject(reply.error);
          } else {
            resolve();
          }
        };

        targetWindow.postMessage(message, SHARING_APP_ORIGIN, [channel.port2]);
      });
    },
    []
  );

  const handleFileWrite = useCallback<EditorProps["onFileWrite"]>(
    (path, value) => {
      if (appData == null) {
        return;
      }

      postAsyncMessage({
        type: "file:write",
        data: {
          path,
          content: value,
        },
      });

      const newFileContent: File["content"] =
        typeof value === "string"
          ? {
              $case: "text",
              text: value,
            }
          : {
              $case: "data",
              data: value,
            };

      setAppData({
        ...appData,
        files: {
          ...appData?.files,
          [path]: {
            content: newFileContent,
          },
        },
      });
    },
    [appData, postAsyncMessage]
  );

  if (appData == null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <div className="editor-pane">
        <Editor appData={appData} onFileWrite={handleFileWrite} />
      </div>
      {url && (
        <div className="preview-pane">
          <p>
            <a href={url} target="_blank" rel="noreferrer">
              Open App
            </a>
          </p>
          <iframe
            ref={iframeRef}
            src={url}
            frameBorder="0"
            title="stlite app"
            className="preview-iframe"
          />
        </div>
      )}
    </div>
  );
}

export default App;
