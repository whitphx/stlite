import React, { useRef, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  mount,
  StliteKernel,
  StliteMountOptions,
  StreamlitConfig,
  InstallOptions,
} from "@stlite/browser";

// TODO: `InstallOptions` type is defined in @stlite/browser, but not exported.
// Let's export it from @stlite/browser so that we can import it from there.

export interface StliteAppProps
  extends Omit<
    StliteMountOptions,
    "files" | "entrypoint" | "streamlitConfig" | "env" | "installs"
  > {
  code?: string;
  files?: Record<string, { data: string; type: "text" }>;
  entrypoint?: string;
  streamlitConfig?: StreamlitConfig;
  env?: Record<string, string>;
  installs?: InstallOptions[]; // Added
  className?: string;
  style?: CSSProperties;
  onLoad?: (app: StliteKernel) => void;
  onUnload?: () => void;
}

const DEBUG = process.env.NODE_ENV === "development";

/**
 * A React component that embeds a Stlite (Streamlit in the browser) app.
 *
 * It takes `code` or `files` prop to specify the Streamlit app to run.
 * All other props are passed through to the underlying `StliteMountOptions`
 * of `@stlite/browser`.
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
              // Handle different value types for TOML
              if (typeof value === "boolean") {
                return `${key} = ${value}`;
              } else if (typeof value === "number") {
                return `${key} = ${value}`;
              } else {
                // Escape special characters for TOML basic strings
                const escaped = String(value)
                  .replace(/\\/g, "\\\\")
                  .replace(/"/g, '\\"')
                  .replace(/\n/g, "\\n")
                  .replace(/\r/g, "\\r")
                  .replace(/\t/g, "\\t");
                return `${key} = "${escaped}"`;
              }
            })
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

  useEffect(() => {
    onLoadRef.current = onLoad;
    onUnloadRef.current = onUnload;
  });

  // Effect to handle mounting and unmounting
  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) {
      DEBUG && console.error("Stlite mount element not found.");
      return;
    }

    let isCancelled = false;

    // Unmount any existing app before mounting a new one
    if (stliteAppRef.current) {
      DEBUG && console.log("Unmounting existing stlite app...");
      stliteAppRef.current.unmount();
      onUnloadRef.current?.();
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

    DEBUG && console.log("Mounting new stlite app with options:", mountOptions);
    mount(mountOptions, rootElement)
      .then((app) => {
        if (isCancelled) {
          DEBUG && console.log("Mount cancelled, unmounting new app.");
          app.unmount();
          return;
        }
        stliteAppRef.current = app;
        DEBUG && console.log("Stlite app mounted successfully.");
        onLoadRef.current?.(app);
      })
      .catch((error) => {
        if (isCancelled) {
          DEBUG && console.log("Mount error after cancellation, ignoring.");
          return;
        }
        console.error("Failed to mount stlite app:", error);
      });

    return () => {
      isCancelled = true;
      if (stliteAppRef.current) {
        DEBUG && console.log("Cleanup: Unmounting stlite app...");
        stliteAppRef.current.unmount();
        onUnloadRef.current?.();
        stliteAppRef.current = null;
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
    // Callbacks are handled via refs to prevent unnecessary re-runs
    // streamlitConfig is included as part of mergedFiles memoization already, so its value changes are reflected.
  ]);

  return (
    <div
      ref={rootRef}
      className={`stlite-react-container${className ? ` ${className}` : ""}`}
      style={style}
    ></div>
  );
};