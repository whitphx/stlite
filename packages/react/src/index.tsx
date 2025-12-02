import React, { useEffect, useRef } from "react";
import {
  mount,
  type StliteKernel,
  type StliteMountOptions,
  type StreamlitConfig,
} from "@stlite/browser";

// InstallOptionProps is not exported from @stlite/browser, so we define it here.
type InstallOptionProps = Parameters<
  Parameters<StliteKernel["install"]>[0][0][1]
>[0];

const DEBUG = import.meta.env.DEV;

export interface StliteAppProps
  extends Omit<StliteMountOptions, "files" | "entrypoint" | "streamlitConfig"> {
  code?: string;
  files?: Record<string, { data: string; type: "text" }>;
  entrypoint?: string;
  streamlitConfig?: StreamlitConfig;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (app: StliteKernel) => void;
  onUnload?: () => void;
}

const formatTomlValue = (value: any): string => {
  if (value == null) {
    // TOML typically omits nulls or uses an empty string, or it might be error.
    // For now, we'll return an empty string representation if the value is null/undefined.
    return '""';
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

export function StliteApp({
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
}: StliteAppProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stliteAppRef = useRef<StliteKernel | null>(null);

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
  }, [code, files, entrypoint, streamlitConfig]);

  const onLoadRef = useRef(onLoad);
  const onUnloadRef = useRef(onUnload);

  // Keep refs for callbacks updated without triggering effect re-runs
  useEffect(() => {
    onLoadRef.current = onLoad;
    onUnloadRef.current = onUnload;
  });

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
      env,
      installs,
      languageServer,
    };

    if (DEBUG) console.log("Mounting new stlite app with options:", mountOptions);
    mount(mountOptions, rootElement)
      .then((app) => {
        if (isCancelled) {
          app.unmount();
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
      isCancelled = true;
      if (stliteAppRef.current) {
        if (DEBUG) console.log("Cleanup: Unmounting stlite app...");
        stliteAppRef.current.unmount();
        stliteAppRef.current = null;
        onUnloadRef.current?.();
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
    env,
    installs,
    languageServer,
  ]);

  return (
    <div
      ref={rootRef}
      className={["stlite-react-container", className].filter(Boolean).join(" ")}
      style={style}
    ></div>
  );
}