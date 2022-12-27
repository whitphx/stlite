import React, { useEffect, useCallback, useRef } from "react";
import "./App.css";
import { embedAppDataToUrl, AppData, File } from "@stlite/sharing-common";
import { useAppData } from "./use-app-data";
import StliteSharingIFrame, {
  StliteSharingIFrameRef,
} from "./StliteSharingIFrame";
import Editor, { EditorProps } from "./Editor";
import PreviewToolBar from "./components/PreviewToolBar";
import { extractAppDataFromUrl } from "@stlite/sharing-common";
import { loadSampleAppData } from "./sample-app";
import { useSampleAppId } from "./router";
import ResponsiveSideBySidePanes from "./components/ResponsiveSideBySidePanes";
import ResponsiveDrawoer from "./components/ResponsiveDrawer";
import SampleAppMenu from "./SampleAppMenu";
import LoadingScreen from "./components/LoadingScreen";

const SHARING_APP_URL =
  process.env.REACT_APP_SHARING_APP_URL ?? "http://localhost:3000/";
const SHARING_APP_ORIGIN = new URL(SHARING_APP_URL).origin;

function App() {
  const onAppDataUpdate = useCallback((appData: AppData) => {
    const newUrl = embedAppDataToUrl(
      window.location.origin + window.location.pathname, // window.location.search is excluded because it may include the sample app ID that conflicts the appData content.
      appData
    );
    window.history.replaceState(null, "", newUrl);
  }, []);
  const [
    { key: initAppDataKey, initialAppData, appData },
    { initializeAppData, updateAppData },
  ] = useAppData(onAppDataUpdate);

  const sampleAppId = useSampleAppId();
  useEffect(() => {
    if (sampleAppId) {
      console.log(`Load sample app ${sampleAppId}`);
      loadSampleAppData(sampleAppId).then(initializeAppData);
    } else {
      extractAppDataFromUrl()
        .catch(() => loadSampleAppData(null)) // Load the default sample
        .then(initializeAppData);
    }
  }, [initializeAppData, sampleAppId]);

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

      updateAppData((cur) => {
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
    [updateAppData]
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

      iframeRef.current?.postMessage({
        type: "file:rename",
        data: {
          oldPath,
          newPath,
        },
      });

      updateAppData((cur) => {
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
    [appData, updateAppData]
  );

  const handleFileDelete = useCallback<EditorProps["onFileDelete"]>(
    (path) => {
      iframeRef.current?.postMessage({
        type: "file:unlink",
        data: {
          path,
        },
      });

      updateAppData((cur) => {
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
    },
    [updateAppData]
  );

  const handleRequirementsChange = useCallback<
    EditorProps["onRequirementsChange"]
  >(
    (requirements) => {
      iframeRef.current?.postMessage({
        type: "install",
        data: {
          requirements,
        },
      });

      updateAppData((cur) => {
        return {
          ...cur,
          requirements,
        };
      });
    },
    [updateAppData]
  );

  return (
    <div className="App">
      <ResponsiveDrawoer>
        <SampleAppMenu />
      </ResponsiveDrawoer>
      {appData == null ? (
        <LoadingScreen />
      ) : (
        <ResponsiveSideBySidePanes
          left={
            <Editor
              key={initAppDataKey}
              appData={appData}
              onFileWrite={handleFileWrite}
              onFileRename={handleFileRename}
              onFileDelete={handleFileDelete}
              onRequirementsChange={handleRequirementsChange}
            />
          }
          right={
            <>
              {appData && (
                <PreviewToolBar
                  appData={appData}
                  sharingAppSrc={SHARING_APP_URL}
                />
              )}
              {initialAppData && (
                <StliteSharingIFrame
                  key={initAppDataKey}
                  ref={iframeRef}
                  sharingAppSrc={SHARING_APP_URL}
                  initialAppData={initialAppData}
                  messageTargetOrigin={SHARING_APP_ORIGIN}
                  frameBorder="0"
                  title="stlite app"
                  className="preview-iframe"
                />
              )}
            </>
          }
        />
      )}
    </div>
  );
}

export default App;
