import React, { useRef, useEffect, useMemo, memo } from "react";
import { mount, StliteKernel, StreamlitConfig, StliteMountOptions, InstallOptions } from "@stlite/browser"; // TODO: Export InstallOptions from @stlite/browser

export interface StliteAppProps
  extends Omit<StliteMountOptions, "files" | "code" | "id"> {
  /**
   * The Python code of the Streamlit app. If `files` is also provided,
   * this code will be mounted as `"streamlit_app.py"` (or the specified `entrypoint`).
   */
  code?: string;
  /**
   * A record of files to be mounted on the Pyodide file system.
   * The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`).
   * The value is an object with `data` (string content) and `type` (`"text"`).
   * For performance, consider memoizing this object if it's dynamically constructed to prevent unnecessary re-mounts.
   */
  files?: Record<string, { data: string; type: "text" }>;
  /**
   * Additional CSS class names to apply to the root container.
   */
  className?: string;
  /**
   * Additional inline styles to apply to the root container.
   */
  style?: React.CSSProperties;
  /**
   * Callback fired when the Stlite app is successfully mounted and ready.
   * The `StliteKernel` instance is passed as an argument.
   */
  onLoad?: (app: StliteKernel) => void;
  /**
   * Callback fired when the Stlite app is unmounted.
   */
  onUnload?: () => void;
  /**
   * A list of Python package names to install (e.g., `["pandas", "numpy"]`).
   * For performance, consider memoizing this array if it's dynamically constructed to prevent unnecessary re-mounts.
   */
  requirements?: string[];
  /**
   * An object representing the `config.toml` file.
   * For performance, consider memoizing this object if it's dynamically constructed to prevent unnecessary re-mounts.
   */
  streamlitConfig?: StreamlitConfig;
  /**
   * Environment variables for the Python runtime.
   * For performance, consider memoizing this object if it's dynamically constructed to prevent unnecessary re-mounts.
   */
  env?: Record<string, string>;
  /**
   * Additional options for installing Python packages.
   * For performance, consider memoizing this array if it's dynamically constructed to prevent unnecessary re-mounts.
   */
  installs?: InstallOptions[];
}

const DEBUG = process.env.NODE_ENV === "development";

export const StliteApp = memo(
  ({
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
  }: StliteAppProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const stliteAppRef = useRef<StliteKernel | null>(null);

    // Memoize derived values
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

      // Handle streamlitConfig conversion to .streamlit/config.toml
      if (streamlitConfig) {
        const formatTomlValue = (value: any): string => {
          if (typeof value === "boolean") {
            return String(value);
          } else if (typeof value === "number") {
            return String(value);
          } else {
            // Escape special characters for TOML basic strings
            const escaped = String(value)
              .replace(/\\/g, "\\\\")
              .replace(/"/g, '\\"')
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "\\r")
              .replace(/\t/g, "\\t");
            return `"${escaped}"`;
          }
        };

        const tomlContent = Object.entries(streamlitConfig)
          .map(([section, options]) => {
            const optionsStr = Object.entries(options)
              .map(([key, value]) => `${key} = ${formatTomlValue(value)}`)
              .join("\n");
            return `[${section}]\n${optionsStr}`;
          })
          .join("\n\n");
        merged[".streamlit/config.toml"] = { data: tomlContent, type: "text" };
      }

      return { mergedFiles: merged, finalEntrypoint: entryPt };
    }, [code, files, entrypoint, streamlitConfig]);

    // Store callbacks in refs to prevent unnecessary effect re-runs
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
        // streamlitConfig, // Removed as it's now handled via the files prop
        env,
        installs,
        languageServer,
      };

      if (DEBUG)
        console.log("Mounting new stlite app with options:", mountOptions);
      mount(mountOptions, rootElement)
        .then((app) => {
          if (isCancelled) {
            if (DEBUG) console.log("Mount cancelled, unmounting app.");
            app.unmount();
            return;
          }
          stliteAppRef.current = app;
          if (DEBUG) console.log("Stlite app mounted successfully.");
          onLoadRef.current?.(app);
        })
        .catch((error) => {
          if (isCancelled) {
            if (DEBUG)
              console.log("Mount error occurred after cancellation, ignoring.");
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
          onUnloadRef.current?.();
        }
      };
    }, [
      mergedFiles, // Stable reference due to useMemo
      finalEntrypoint, // Stable reference due to useMemo
      requirements, // Consumer should memoize
      pyodideUrl,
      sharedWorker,
      disableProgressToasts,
      disableErrorToasts,
      // streamlitConfig, // No longer directly in deps array since it's part of mergedFiles
      env, // Consumer should memoize
      installs, // Consumer should memoize
      languageServer,
      // onLoad, onUnload are now handled via refs
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
  },
);