import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import "./App.css";
import { embedAppDataToUrl } from "@stlite/sharing-common";
import type {
  AppData,
  File,
  BackwardMessage,
  CodeCompletionResponse,
  CodeCompletionRequest,
} from "@stlite/sharing-common";
import { LoaderFunctionArgs, useLoaderData, redirect } from "react-router-dom";
import { useAppData } from "./use-app-data";
import StliteSharingIFrame, {
  StliteSharingIFrameProps,
  StliteSharingIFrameRef,
} from "./StliteSharingIFrame";
import Editor, { EditorProps, EditorRef } from "./Editor";
import PreviewToolBar from "./components/PreviewToolBar";
import { extractAppDataFromUrlHash } from "@stlite/sharing-common";
import {
  getDefaultSampleAppId,
  loadSampleAppData,
  parseSampleAppIdInSearchParams,
} from "./sample-app";
import ResponsiveSideBySidePanes from "./components/ResponsiveSideBySidePanes";
import ResponsiveDrawoer from "./components/ResponsiveDrawer";
import SampleAppMenu from "./SampleAppMenu";
import LoadingScreen from "./components/LoadingScreen";
import {
  URL_SEARCH_KEY_SAMPLE_APP_ID,
  URL_SEARCH_KEY_EMBED_MODE,
  URL_SEARCH_KEY_SHARED_WORKER_MODE,
} from "./url";
import { useAppColorSchemePreference } from "./ColorScheme/hooks";

interface AppLoaderData {
  appData: AppData;
  sampleAppId: string | null;
  embedMode: boolean;
  sharedWorkerMode: boolean;
  sharingAppSrc: string;
  sharingAppOrigin: string;
}
export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<AppLoaderData> => {
  const sharingAppSrc =
    SHARING_APP_URL ??
    (RESOLVE_SHARING_APP_URL_RUNTIME_FROM_EXTERNAL_FILE
      ? // For preview builds on CI whose SHARING_APP_URL can't be determined at build time,
        // the sharing app URL is resolved at runtime from the /SHARING_APP_URL file.
        await fetch("/SHARING_APP_URL").then((res) => res.text())
      : undefined);
  if (sharingAppSrc == null) {
    throw new Error("The URL of the sharing app is not set");
  }
  const sharingAppOrigin = new URL(sharingAppSrc).origin;

  const url = new URL(request.url);
  const { sampleAppId: parsedSampleAppId, isInvalidSampleAppId } =
    parseSampleAppIdInSearchParams(url.searchParams);

  if (isInvalidSampleAppId) {
    const correctedUrl = new URL(url);
    correctedUrl.searchParams.delete(URL_SEARCH_KEY_SAMPLE_APP_ID);
    throw redirect(correctedUrl.toString());
  }

  const embedMode = url.searchParams.get(URL_SEARCH_KEY_EMBED_MODE) === "true";
  const sharedWorkerMode =
    url.searchParams.get(URL_SEARCH_KEY_SHARED_WORKER_MODE) === "true";

  if (parsedSampleAppId == null) {
    try {
      const appData = await extractAppDataFromUrlHash(window.location.hash);
      return {
        appData,
        sampleAppId: null,
        embedMode,
        sharedWorkerMode,
        sharingAppSrc,
        sharingAppOrigin,
      };
    } catch {
      const defaultSampleAppId = getDefaultSampleAppId();
      const appData = await loadSampleAppData(defaultSampleAppId);
      return {
        appData,
        sampleAppId: defaultSampleAppId,
        embedMode,
        sharedWorkerMode,
        sharingAppSrc,
        sharingAppOrigin,
      };
    }
  }

  const appData = await loadSampleAppData(parsedSampleAppId);
  return {
    appData,
    sampleAppId: parsedSampleAppId,
    embedMode,
    sharedWorkerMode,
    sharingAppSrc,
    sharingAppOrigin,
  };
};

function App() {
  const {
    appData: initialAppData,
    sampleAppId: initialSampleAppId,
    embedMode,
    sharedWorkerMode,
    sharingAppSrc,
    sharingAppOrigin,
  } = useLoaderData() as AppLoaderData;

  const [sampleAppId, setSampleAppId] = useState(initialSampleAppId);
  useEffect(() => {
    setSampleAppId(initialSampleAppId);
  }, [initialSampleAppId]);

  const onAppDataUpdate = useCallback((appData: AppData) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(URL_SEARCH_KEY_SAMPLE_APP_ID); // Exclude the sample app ID that conflicts the appData content.
    const paramsString = params.size > 0 ? `?${params.toString()}` : "";
    const newUrl = embedAppDataToUrl(
      window.location.origin + window.location.pathname + paramsString,
      appData,
    );
    window.history.replaceState(null, "", newUrl);
    setSampleAppId(null);
  }, []);
  const [
    { key: initAppDataKey, appData },
    { initializeAppData, updateAppData },
  ] = useAppData(onAppDataUpdate);

  useEffect(() => {
    initializeAppData(initialAppData);
  }, [initialAppData, initializeAppData]);

  const iframeRef = useRef<StliteSharingIFrameRef>(null);
  const editorRef = useRef<EditorRef>(null);

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
    [updateAppData],
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
    [appData, updateAppData],
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
    [updateAppData],
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
    [updateAppData],
  );

  const handleEntrypointChange = useCallback<EditorProps["onEntrypointChange"]>(
    (entrypoint) => {
      iframeRef.current?.postMessage({
        type: "reboot",
        data: {
          entrypoint,
        },
      });

      updateAppData((cur) => {
        return {
          ...cur,
          entrypoint,
        };
      });
    },
    [updateAppData],
  );

  const handleIframeMessage = useCallback<
    StliteSharingIFrameProps["onMessage"]
  >(
    (e) => {
      if (e.data.stlite !== true) {
        return;
      }
      const msg = e.data as BackwardMessage;
      switch (msg.type) {
        case "moduleAutoLoadSuccess": {
          if (msg.data.loadedPackages.length > 0) {
            const additionalRequirements = msg.data.packagesToLoad;
            const editor = editorRef.current;
            if (editor == null) {
              return;
            }
            editor.addRequirements(
              additionalRequirements.map((r) => r + " # auto-loaded"),
            );
            updateAppData((cur) => {
              const newRequirements = cur.requirements.concat(
                additionalRequirements,
              );

              // Remove duplicates. The order is kept because of the use of `Set`.
              // > You can iterate through the elements of a set in insertion order.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
              const uniqueNewRequirements = Array.from(
                new Set(newRequirements),
              );

              return {
                ...cur,
                requirements: uniqueNewRequirements,
              };
            });
          }
          break;
        }
      }
    },
    [updateAppData],
  );

  const pythonCodeCompletionCallback = useMemo(
    () =>
      (payload: CodeCompletionRequest): Promise<CodeCompletionResponse> => {
        if (iframeRef.current == null) {
          throw new Error("Iframe is not ready");
        }

        return iframeRef.current.postMessage({
          type: "code_completion_request",
          data: payload,
        }) as Promise<CodeCompletionResponse>;
      },
    [],
  );

  const appColorSchemePreference = useAppColorSchemePreference();

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
              ref={editorRef}
              appData={appData}
              pythonCodeCompletionCallback={pythonCodeCompletionCallback}
              onFileWrite={handleFileWrite}
              onFileRename={handleFileRename}
              onFileDelete={handleFileDelete}
              onRequirementsChange={handleRequirementsChange}
              onEntrypointChange={handleEntrypointChange}
            />
          }
          right={
            <>
              {appData && (
                <PreviewToolBar
                  appData={appData}
                  sharingAppSrc={sharingAppSrc}
                />
              )}
              {initialAppData && (
                <StliteSharingIFrame
                  key={initAppDataKey}
                  ref={iframeRef}
                  sharingAppSrc={sharingAppSrc}
                  initialAppData={initialAppData}
                  messageTargetOrigin={sharingAppOrigin}
                  title="stlite app"
                  className="preview-iframe"
                  onMessage={handleIframeMessage}
                  theme={
                    appColorSchemePreference === "auto"
                      ? null
                      : appColorSchemePreference
                  }
                  sharedWorkerMode={sharedWorkerMode}
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
