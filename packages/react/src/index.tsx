import React, { useRef, useEffect, useMemo } from "react";
import {
  mount,
  StliteKernel,
  StliteMountOptions,
  InstallOptions,
} from "@stlite/browser"; // Assuming StliteKernel is exported from @stlite/browser

/**
 * Props for the StliteApp component.
 * Extends StliteMountOptions from `@stlite/browser` with some modifications and additions.
 */
export interface StliteAppProps
  extends Omit<
    StliteMountOptions,
    "files" | "code" | "entrypoint" | "streamlitConfig"
  > {
  /**
   * The Python code of the Streamlit app. This will be mounted as `"streamlit_app.py"`.
   * If `files` is also provided, `code` will be merged into `files` at `streamlit_app.py`.
   */
  code?: string;
  /**
   * A record of files to be mounted on the Pyodide file system.
   * The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`).
   * The value is an object with `data` (string content) and `type` (`"text"`).
   */
  files?: Record<string, { data: string; type: "text" }>;
  /**
   * The path to the entrypoint file, relative to the Pyodide file system root.
   * Defaults to `"streamlit_app.py"`.
   */
  entrypoint?: string;
  /**
   * A record representing the content of `.streamlit/config.toml`.
   * For example, `{"server": {"port": "80"}}`.
   */
  streamlitConfig?: Record<string, Record<string, string>>;
  /**
   * CSS class name for the root container element.
   */
  className?: string;
  /**
   * Inline CSS styles for the root container element.
   */
  style?: React.CSSProperties;
  /**
   * Callback fired when the Stlite app is successfully mounted and ready.
   */
  onLoad?: (app: StliteKernel) => void;
  /**
   * Callback fired when the Stlite app is unmounted.
   */
  onUnload?: () => void;
  /**
   * Additional options for `micropip.install()`.
   */
  installs?: InstallOptions[];
}

const DEBUG = process.env.NODE_ENV === "development";

/**
 * `StliteApp` is a React component that embeds a Streamlit application
 * powered by Stlite (Streamlit in the browser).
 *
 * It manages the lifecycle of the Stlite app, mounting and unmounting it
 * as the component is added/removed from the DOM or its props change.
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
  const stliteAppRef = useRef<StliteKernel | null>(null);

  // Memoize derived values to ensure stable references for useEffect dependencies
  const { mergedFiles, finalEntrypoint } = useMemo(() => {
    const merged = files ? { ...files } : {};
    let entryPt = entrypoint;

    if (code !== undefined) {
      const codeEntrypoint = entrypoint || "streamlit_app.py";
      merged[codeEntrypoint] = { data: code, type: "text" };
      if (!entrypoint) {
        entryPt = codeEntrypoint;
      }
    }

    // Convert streamlitConfig to .streamlit/config.toml file content
    if (streamlitConfig) {
      const tomlContent = Object.entries(streamlitConfig)
        .map(([section, options]) => {
          const optionsStr = Object.entries(options)
            .map(([key, value]) => {
              // Escape backslashes and double quotes for TOML basic strings
              // Note: This is a basic escaping, full TOML spec might require more complex handling (e.g., multi-line strings, other special characters).
              const escaped = String(value)
                .replace(/\\/g, "\\\\")
                .replace(/"/g, '\\"');
              return `${key} = "${escaped}"`;
            })
            .join("\n");
          return `[${section}]\n${optionsStr}`;
        })
        .join("\n\n");
      merged[".streamlit/config.toml"] = { data: tomlContent, type: "text" };
    }

    return { mergedFiles: merged, finalEntrypoint: entryPt };
  }, [code, files, entrypoint, streamlitConfig]); // `streamlitConfig` directly used here

  // Use refs for callbacks to prevent unnecessary effect re-runs
  const onLoadRef = useRef(onLoad);
  const onUnloadRef = useRef(onUnload);

  useEffect(() => {
    onLoadRef.current = onLoad;
    onUnloadRef.current = onUnload;
  }, [onLoad, onUnload]);

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
      onUnloadRef.current?.(); // Call unload handler for the unmounted instance
    }

    const mountOptions: StliteMountOptions = {
      files: mergedFiles,
      entrypoint: finalEntrypoint,
      requirements,
      pyodideUrl,
      sharedWorker,
      disableProgressToasts,
      disableErrorToasts,
      env,
      installs,
      languageServer,
    };

    if (DEBUG)
      console.log("Mounting new stlite app with options:", mountOptions);
    mount(mountOptions, rootElement)
      .then((app) => {
        if (isCancelled) {
          app.unmount(); // If cancelled, unmount the new app immediately
          return;
        }
        stliteAppRef.current = app;
        if (DEBUG) console.log("Stlite app mounted successfully.");
        onLoadRef.current?.(app); // Call load handler for the newly mounted instance
      })
      .catch((error) => {
        if (isCancelled) return;
        if (DEBUG) console.error("Failed to mount stlite app:", error);
      });

    return () => {
      isCancelled = true; // Mark as cancelled
      if (stliteAppRef.current) {
        if (DEBUG) console.log("Cleanup: Unmounting stlite app...");
        stliteAppRef.current.unmount();
        stliteAppRef.current = null;
        onUnloadRef.current?.(); // Call unload handler during cleanup
      }
    };
  }, [
    mergedFiles, // Stable reference from useMemo
    finalEntrypoint, // Stable reference from useMemo
    requirements, // Assumes consumers provide a stable reference or memoize
    pyodideUrl,
    sharedWorker,
    disableProgressToasts,
    disableErrorToasts,
    env, // Assumes consumers provide a stable reference or memoize
    installs, // Assumes consumers provide a stable reference or memoize
    languageServer,
  ]);

  return (
    <div
      ref={rootRef}
      className={`stlite-react-container${className ? ` ${className}` : ""}`}
      style={style}
    ></div>
  );
};