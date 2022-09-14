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
import PreviewToolBar from "./components/PreviewToolBar";
import { loadDefaultAppData } from "./default-app-data";

const SHARING_APP_URL =
  process.env.REACT_APP_SHARING_APP_URL ?? "http://localhost:3000/";
const SHARING_APP_ORIGIN = new URL(SHARING_APP_URL).origin;

const REQUIREMENTS_FILE_NAME = "requirements";

function App() {
  const [appData, setAppData] = useState<AppData>();
  useEffect(() => {
    loadDefaultAppData().then(setAppData);
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

      if (
        path === REQUIREMENTS_FILE_NAME &&
        typeof value === "string" &&
        iframeRef.current
      ) {
        const requirements = value
          .split("\n")
          .map((r) => r.trim())
          .filter((r) => r !== "");
        iframeRef.current.postMessage({
          type: "install",
          data: {
            requirements,
          },
        });
      }
    },
    []
  );

  const handleFileRename = useCallback<EditorProps["onFileRename"]>(
    (oldPath, newPath) => {
      if (oldPath === newPath) {
        return;
      }
      if (appData == null) {
        return;
      }
      if (Object.keys(appData.files).includes(newPath)) {
        return;
      }

      const curFiles = appData.files;
      const targetFile = curFiles[oldPath];
      if (targetFile == null) {
        return;
      }

      const newFiles = {
        ...curFiles,
        [newPath]: targetFile,
      };
      delete newFiles[oldPath];
      const newAppData = {
        ...appData,
        files: newFiles,
      };

      iframeRef.current?.postMessage({
        type: "file:rename",
        data: {
          oldPath,
          newPath,
        },
      });

      setAppData(newAppData);
    },
    [appData]
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
      <div className="preview-pane">
        {url && <PreviewToolBar sharingUrl={url} />}
        {appData && (
          <StliteSharingIFrame
            ref={iframeRef}
            sharingAppSrc={SHARING_APP_URL}
            initialAppData={appData}
            messageTargetOrigin={SHARING_APP_ORIGIN}
            frameBorder="0"
            title="stlite app"
            className="preview-iframe"
          />
        )}
      </div>
    </div>
  );
}

export default App;
