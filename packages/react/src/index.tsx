import React, { useEffect, useRef, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  mount,
  StliteKernel,
  StliteMountOptions,
} from "@stlite/browser"; // `StliteApp` from `@stlite/browser` is `StliteKernel` actually.

/**
 * Interface for Streamlit configuration.
 *
 * @remarks
 * For example:
 * 
 * {
 *   "server": {
 *     "baseUrlPath": "streamlit_app",
 *     "port": 8501,
 *   },
 *   "global": {
 *     "logLevel": "info",
 *   },
 * }
 * 
 */
export interface StreamlitConfig {
  [section: string]: {
    [key: string]: string | number | boolean;
  };
}

/**
 * Additional options for installing packages.
 * See https://pyodide.org/docs/stable/api/python-api.html#pyodide.install.install for details.
 *
 * @remarks
 * This type is copied from `@stlite/browser/src/types.ts` to avoid a circular dependency.
 * If `@stlite/browser` exports it, we can import it directly.
 */
export interface InstallOptions {
  /**
   * Whether to install packages in the current Pyodide environment or in a new temporary environment.
   */
  into_pyodide?: boolean;
}

export interface StliteAppProps
  extends Omit<StliteMountOptions, "files" | "entrypoint" | "code"> {
  code?: string;
  files?: Record<string, { data: string; type: "text" }>;
  entrypoint?: string;
  className?: string;
  style?: CSSProperties;
  onLoad?: (app: StliteKernel) => void;
  onUnload?: () => void;
}

const DEBUG = process.env.NODE_ENV === "development";

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

  // Memoize derived values to prevent unnecessary re-calculations and effect re-runs
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

    if (streamlitConfig) {
      const tomlContent = Object.entries(streamlitConfig)
        .map(([section, options]) => {
          const optionsStr = Object.entries(options)
            .map(([key, value]) => {
              // Escape backslashes and double quotes for TOML basic strings
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
  }, [code, files, entrypoint, streamlitConfig]); // streamlitConfig is a dependency here; consumers should memoize it.

  // Use refs for callbacks to prevent re-running the effect when they change
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
    }

    const mountOptions: StliteMountOptions = {
      files: mergedFiles,
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
          app.unmount(); // If cancelled, unmount the new app immediately
          return;
        }
        stliteAppRef.current = app;
        if (DEBUG) console.log("Stlite app mounted successfully.");
        onLoadRef.current?.(app);
      })
      .catch((error) => {
        if (isCancelled) return;
        if (DEBUG) console.error("Failed to mount stlite app:", error);
      });

    return () => {
      isCancelled = true; // Set cancellation flag
      if (stliteAppRef.current) {
        if (DEBUG) console.log("Cleanup: Unmounting stlite app...");
        stliteAppRef.current.unmount();
        stliteAppRef.current = null;
        onUnloadRef.current?.();
      }
    };
  }, [
    mergedFiles, // Stable ref from useMemo
    finalEntrypoint, // Stable ref from useMemo
    requirements, // Consumers should memoize
    pyodideUrl,
    sharedWorker,
    disableProgressToasts,
    disableErrorToasts,
    env, // Consumers should memoize
    installs, // Consumers should memoize
    languageServer,
  ]);

  return (
    <div
      ref={rootRef}
      className={`stlite-react-container${
        className ? ` ${className}` : ""
      }`}
      style={style}
    ></div>
  );
};