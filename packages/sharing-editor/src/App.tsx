import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "./App.css";
import { embedAppDataToUrl, AppData, File } from "@stlite/sharing-common";
import StliteSharingIFrame, {
  StliteSharingIFrameRef,
} from "./StliteSharingIFrame";
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

  const iframeRef = useRef<StliteSharingIFrameRef>(null);

  const handleFileWrite = useCallback<EditorProps["onFileWrite"]>(
    (path, value) => {
      iframeRef.current?.postMessage({
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

      setAppData((cur) => {
        if (cur == null) {
          return undefined;
        }
        return {
          ...cur,
          files: {
            ...cur?.files,
            [path]: {
              content: newFileContent,
            },
          },
        };
      });
    },
    []
  );

  const handleFileRename = useCallback<EditorProps["onFileRename"]>(
    (oldPath, newPath) => {
      if (oldPath === newPath) {
        return;
      }

      iframeRef.current?.postMessage({
        type: "file:rename",
        data: {
          oldPath,
          newPath,
        },
      });

      setAppData((cur) => {
        if (cur == null) {
          return undefined;
        }

        const curFiles = cur.files;
        const targetFile = curFiles[oldPath];
        if (targetFile == null) {
          return cur;
        }

        const newFiles = {
          ...curFiles,
          [newPath]: targetFile,
        };
        delete newFiles[oldPath];

        return {
          ...cur,
          files: newFiles,
        };
      });
    },
    []
  );

  const handleFileDelete = useCallback<EditorProps["onFileDelete"]>((path) => {
    iframeRef.current?.postMessage({
      type: "file:unlink",
      data: {
        path,
      },
    });

    setAppData((cur) => {
      if (cur == null) {
        return undefined;
      }

      const curFiles = cur.files;
      const newFiles = {
        ...curFiles,
      };
      delete newFiles[path];

      return {
        ...cur,
        files: newFiles,
      };
    });
  }, []);

  if (appData == null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <div className="editor-pane">
        <Editor
          appData={appData}
          onFileWrite={handleFileWrite}
          onFileRename={handleFileRename}
          onFileDelete={handleFileDelete}
        />
      </div>
      {url && (
        <div className="preview-pane">
          <p>
            <a href={url} target="_blank" rel="noreferrer">
              Open App
            </a>
          </p>
          <StliteSharingIFrame
            ref={iframeRef}
            src={url}
            messageTargetOrigin={SHARING_APP_ORIGIN}
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
