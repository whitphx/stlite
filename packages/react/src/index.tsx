import React, { useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import {
  mount,
  StliteApp as StliteAppBrowser,
  StliteMountOptions,
} from "@stlite/browser";
import { toml } from "@stlite/common";

/**
 * Props for the StliteApp React component.
 *
 * It extends StliteMountOptions from `@stlite/browser`, but redefines `code` and `files`
 * to better suit React component usage patterns.
 */
export interface StliteAppProps
  extends Omit<StliteMountOptions, "files" | "code"> {
  /**
   * The Python code of your Streamlit application.
   * This is mounted as `streamlit_app.py` by default.
   */
  code?: string;
  /**
   * A record of files to be mounted on the Pyodide file system.
   * The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`).
   * The value is an object with `data` (string content) and `type` (`"text"`).
   */
  files?: Record<string, { data: string; type: "text" }>;
  /**
   * Additional CSS class names to apply to the container `div`.
   */
  className?: string;
  /**
   * Additional inline styles to apply to the container `div`.
   */
  style?: CSSProperties;
  /**
   * A callback function that is called when the Stlite app is loaded and mounted successfully.
   * It receives the `StliteAppBrowser` controller instance as an argument.
   */
  onLoad?: (app: StliteAppBrowser) => void;
  /**
   * A callback function that is called when the Stlite app is unmounted.
   */
  onUnload?: () => void;
}

const DEBUG = process.env.NODE_ENV === "development";

/**
 * A React component that embeds a Streamlit application in the browser using Stlite.
 */
export const StliteApp: React.FC<StliteAppProps> = ({
  code,
  files,
  entrypoint,
  requirements,
  pyodideUrl,
  sharedWorker,
  disableProgressToasts,
  disableErrorToasts,
  streamlitConfig,
  env,
  installs,
  languageServer,
  className,
  style,
  onLoad,
  onUnload,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stliteAppRef = useRef<StliteAppBrowser | null>(null);

  // Memoize derived file and entrypoint data
  const { mergedFiles, finalEntrypoint } = React.useMemo(() => {
    const merged = files ? { ...files } : {};
    let entryPt = entrypoint;
    if (code !== undefined) {
      const codeEntrypoint = entrypoint || "streamlit_app.py";
      merged[codeEntrypoint] = { data: code, type: "text" };
      if (!entrypoint) {
        entryPt = codeEntrypoint;
      }
    }
    return { mergedFiles: merged, finalEntrypoint: entryPt };
  }, [code, files, entrypoint]);

  // Handle Streamlit config conversion if provided
  const configFiles = React.useMemo(() => {
    if (streamlitConfig) {
      return {
        ".streamlit/config.toml": {
          data: toml.dump(streamlitConfig),
          type: "text" as const, // `as const` ensures `type` is `"text"` not `string`
        },
      };
    }
    return undefined;
  }, [streamlitConfig]);

  // Effect to handle mounting and unmounting
  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) {
      if (DEBUG) console.error("Stlite mount element not found.");
      return;
    }

    let isCancelled = false;

    // Unmount any existing app before mounting a new one
    if (stliteAppRef.current) {
      if (DEBUG) console.log("Unmounting existing stlite app...");
      stliteAppRef.current.unmount();
      stliteAppRef.current = null;
      onUnload?.();
    }

    const mountOptions: StliteMountOptions = {
      files: { ...mergedFiles, ...configFiles },
      entrypoint: finalEntrypoint,
      requirements,
      pyodideUrl,
      sharedWorker,
      disableProgressToasts,
      disableErrorToasts,
      streamlitConfig,
      env,
      installs,
      languageServer,
    };

    if (DEBUG)
      console.log("Mounting new stlite app with options:", mountOptions);
    mount(mountOptions, rootElement)
      .then((app) => {
        if (isCancelled) {
          app.unmount();
          if (DEBUG) console.log("Mount finished after cleanup, unmounting new app.");
          return;
        }
        stliteAppRef.current = app;
        if (DEBUG) console.log("Stlite app mounted successfully.");
        onLoad?.(app);
      })
      .catch((error) => {
        if (isCancelled) {
          if (DEBUG) console.log("Mount failed after cleanup, ignoring error.");
          return;
        }
        if (DEBUG) console.error("Failed to mount stlite app:", error);
      });

    return () => {
      isCancelled = true;
      if (stliteAppRef.current) {
        if (DEBUG) console.log("Cleanup: Unmounting stlite app...");
        stliteAppRef.current.unmount();
        stliteAppRef.current = null;
        onUnload?.();
      }
    };
  }, [
    mergedFiles,
    finalEntrypoint,
    requirements,
    pyodideUrl,
    sharedWorker,
    disableProgressToasts,
    disableErrorToasts,
    streamlitConfig, // `streamlitConfig` directly as `useMemo` for `configFiles` ensures its stability.
    env,
    installs,
    languageServer,
    onLoad,
    onUnload,
    configFiles, // Add configFiles to deps array since it's derived from streamlitConfig
  ]);

  return (
    <div
      ref={rootRef}
      className={`stlite-react-container${className ? ` ${className}` : ""}`}
      style={style}
    ></div>
  );
};