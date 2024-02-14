import React, { useEffect, useCallback, useRef } from "react";
import "./App.css";
import { embedAppDataToUrl, AppData, File } from "@stlite/sharing-common";
import { LoaderFunctionArgs, useLoaderData, redirect } from "react-router-dom";
import { useAppData } from "./use-app-data";
import StliteSharingIFrame, {
  StliteSharingIFrameRef,
} from "./StliteSharingIFrame";
import Editor, { EditorProps } from "./Editor";
import PreviewToolBar from "./components/PreviewToolBar";
import { extractAppDataFromUrl } from "@stlite/sharing-common";
import {
  getDefaultSampleAppId,
  loadSampleAppData,
  parseSampleAppIdInSearchParams,
} from "./sample-app";
import ResponsiveSideBySidePanes from "./components/ResponsiveSideBySidePanes";
import ResponsiveDrawoer from "./components/ResponsiveDrawer";
import SampleAppMenu from "./SampleAppMenu";
import LoadingScreen from "./components/LoadingScreen";
import { URL_SEARCH_KEY_SAMPLE_APP_ID, URL_SEARCH_KEY_EMBED_MODE } from "./url";

interface AppLoaderData {
  appData: AppData;
  sampleAppId: string | null;
  embedMode: boolean;
}
export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<AppLoaderData> => {
  const url = new URL(request.url);
  const { sampleAppId: parsedSampleAppId, isInvalidSampleAppId } =
    parseSampleAppIdInSearchParams(url.searchParams);

  if (isInvalidSampleAppId) {
    const correctedUrl = new URL(url);
    correctedUrl.searchParams.delete(URL_SEARCH_KEY_SAMPLE_APP_ID);
    throw redirect(correctedUrl.toString());
  }

  const embedMode = url.searchParams.get(URL_SEARCH_KEY_EMBED_MODE) === "true";

  if (parsedSampleAppId == null) {
    try {
      const appData = await extractAppDataFromUrl();
      return { appData, sampleAppId: null, embedMode };
    } catch {
      const defaultSampleAppId = getDefaultSampleAppId();
      const appData = await loadSampleAppData(defaultSampleAppId);
      return { appData, sampleAppId: defaultSampleAppId, embedMode };
    }
  }

  const appData = await loadSampleAppData(parsedSampleAppId);
  return { appData, sampleAppId: parsedSampleAppId, embedMode };
};

const SHARING_APP_URL =
  process.env.REACT_APP_SHARING_APP_URL ?? "http://localhost:3000/";
const SHARING_APP_ORIGIN = new URL(SHARING_APP_URL).origin;

function App() {
  const {
    appData: initialAppData,
    sampleAppId,
    embedMode,
  } = useLoaderData() as AppLoaderData;

  const onAppDataUpdate = useCallback((appData: AppData) => {
    const newUrl = embedAppDataToUrl(
      window.location.origin + window.location.pathname, // window.location.search is excluded because it may include the sample app ID that conflicts the appData content.
      appData
    );
    window.history.replaceState(null, "", newUrl);
  }, []);
  const [
    { key: initAppDataKey, appData },
    { initializeAppData, updateAppData },
  ] = useAppData(onAppDataUpdate);

  useEffect(() => {
    initializeAppData(initialAppData);
  }, [initialAppData, initializeAppData]);

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
      {!embedMode && (
        <ResponsiveDrawoer>
          <SampleAppMenu currentSampleAppId={sampleAppId} />
        </ResponsiveDrawoer>
      )}
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
