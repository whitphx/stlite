import React, { useRef, useEffect, useMemo } from "react";
import { mount, StliteMountOptions, StliteKernel } from "@stlite/browser";
import { StreamlitConfig } from "@stlite/kernel/dist/types"; // TODO: Export StreamlitConfig from @stlite/browser

// InstallOptionProps is not exported from @stlite/browser, so we define it here.
// TODO: Request @stlite/browser to export this type
interface InstallOptionProps {
  keep_going?: boolean;
  deps?: boolean;
  credentials?: "include" | "same-origin" | "omit";
  // Add other known micropip.install options as needed
}

/**
 * Props for the StliteApp component.
 * It extends StliteMountOptions from `@stlite/browser` but redefines `code` and `files`
 * to work more idiomatically with React props.
 */
export interface StliteAppProps
  extends Omit<StliteMountOptions, "files" | "streamlitConfig"> {
  /**
   * The Python code of your Streamlit app.
   * If `files` is also provided, this code will be mounted as `streamlit_app.py`
   * or the specified `entrypoint`.
   */
  code?: string;
  /**
   * A record of files to be mounted on the Pyodide file system.
   * The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`).
   * The value is an object with `data` (string content) and `type` (`"text"`).
   */
  files?: Record<string, { data: string; type: "text" }>;
  /**
   * An object representing the Streamlit configuration to be written to `.streamlit/config.toml`.
   * Keys are section names (e.g., `"client"`) and values are objects of key-value pairs.
   */
  streamlitConfig?: StreamlitConfig;
  /**
   * Additional CSS class names to apply to the root container `div`.
   */
  className?: string;
  /**
   * Additional inline styles to apply to the root container `div`.
   */
  style?: React.CSSProperties;
  /**
   * Callback fired when the Stlite app is successfully mounted and ready.
   * It receives the `StliteKernel` instance as an argument.
   */
  onLoad?: (app: StliteKernel) => void;
  /**
   * Callback fired when the Stlite app is unmounted.
   */
  onUnload?: () => void;
  /**
   * Advanced options for `micropip.install()`.
   */
  installs?: InstallOptionProps[];
}

const DEBUG = process.env.NODE_ENV === "development";

/**
 * Formats a JavaScript value into a TOML-compatible string.
 * Handles booleans, numbers, and strings with appropriate escaping.
 * @param value The value to format.
 * @returns A TOML-formatted string.
 */
const formatTomlValue = (value: any): string => {
  if (value == null) {
    return '""'; // Defaulting null/undefined to empty string for simplicity in TOML. Adjust if other behavior is desired.
  }
  if (typeof value === "boolean") {
    return String(value);
  } else if (typeof value === "number") {
    return String(value);
  } else {
    // Escape special characters for TOML basic strings
    const escaped = String(value)
      .replace(/\\/g, "\\\\") // Escape backslashes
      .replace(/"/g, '\\"') // Escape double quotes
      .replace(/\n/g, "\\n") // Escape newlines
      .replace(/\r/g, "\\r") // Escape carriage returns
      .replace(/\t/g, "\\t"); // Escape tabs
    return `"${escaped}"`;
  }
};

/**
 * React component for embedding a serverless Streamlit application.
 * It wraps the core functionality from `@stlite/browser`.
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

  const onLoadRef = useRef(onLoad);
  const onUnloadRef = useRef(onUnload);

  // Keep refs for callbacks updated without triggering effect re-runs
  useEffect(() => {
    onLoadRef.current = onLoad;
    onUnloadRef.current = onUnload;
  });

  const { mergedFiles, finalEntrypoint } = useMemo(() => {
    const merged = files ? { ...files } : {};
    let entryPt = entrypoint;

    // Handle `code` prop by creating a file
    if (code !== undefined) {
      const codeEntrypoint = entrypoint || "streamlit_app.py";
      merged[codeEntrypoint] = { data: code, type: "text" };
      if (!entrypoint) {
        entryPt = codeEntrypoint;
      }
    }

    // Handle `streamlitConfig` prop by creating a config.toml file
    if (streamlitConfig) {
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
  }, [code, files, entrypoint, streamlitConfig]); // Rerun only if code, files, entrypoint, or streamlitConfig changes

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
      env, // env and installs are passed directly as objects, consumers should memoize them
      installs,
      languageServer,
    };

    if (DEBUG) console.log("Mounting new stlite app with options:", mountOptions);
    mount(mountOptions, rootElement)
      .then((app) => {
        if (isCancelled) {
          app.unmount();
          if (DEBUG) console.log("Stale app unmounted immediately.");
          return;
        }
        stliteAppRef.current = app;
        if (DEBUG) console.log("Stlite app mounted successfully.");
        onLoadRef.current?.(app);
      })
      .catch((error) => {
        if (isCancelled) {
          if (DEBUG) console.log("Stale app mount error ignored.");
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
    mergedFiles, // Merged files now includes code and streamlitConfig handled via useMemo
    finalEntrypoint,
    requirements, // Rely on consumer to memoize if dynamically created
    pyodideUrl,
    sharedWorker,
    disableProgressToasts,
    disableErrorToasts,
    env, // Rely on consumer to memoize if dynamically created
    installs, // Rely on consumer to memoize if dynamically created
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