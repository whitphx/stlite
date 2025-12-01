import React, { useEffect, useRef } from "react";
import {
  mount,
  StliteKernel,
  StliteMountOptions,
  InstallationOptions,
} from "@stlite/browser";
import toToml from "to-toml";

export type StliteAppProps = Omit<
  StliteMountOptions,
  "files" | "entrypoint" | "streamlitConfig"
> & {
  code?: string;
  files?: Record<string, { data: string; type: "text" }>;
  entrypoint?: string;
  streamlitConfig?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (app: StliteKernel) => void;
  onUnload?: () => void;
};

export const StliteApp = ({
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
      const configToml = toToml(streamlitConfig);
      merged[".streamlit/config.toml"] = { data: configToml, type: "text" };
    }

    return { mergedFiles: merged, finalEntrypoint: entryPt };
  }, [code, files, entrypoint, streamlitConfig]);

  // Effect to handle mounting and unmounting
  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) {
      if (import.meta.env.DEV) {
        console.error("Stlite mount element not found.");
      }
      return;
    }

    let isCancelled = false;

    // Unmount any existing app before mounting a new one
    if (stliteAppRef.current) {
      if (import.meta.env.DEV) {
        console.log("Unmounting existing stlite app...");
      }
      stliteAppRef.current.unmount();
      stliteAppRef.current = null;
      onUnload?.();
    }

    const mountOptions: StliteMountOptions = {
      files: mergedFiles,
      entrypoint: finalEntrypoint,
      requirements,
      pyodideUrl,
      sharedWorker,
      disableProgressToasts,
      disableErrorToasts,
      streamlitConfig: undefined, // Handled internally in useMemo for `files`
      env,
      installs,
      languageServer,
    };

    if (import.meta.env.DEV) {
      console.log("Mounting new stlite app with options:", mountOptions);
    }
    mount(mountOptions, rootElement)
      .then((app) => {
        if (isCancelled) {
          if (import.meta.env.DEV) {
            console.log("Stale mount promise resolved, unmounting immediately.");
          }
          app.unmount();
          return;
        }
        stliteAppRef.current = app;
        if (import.meta.env.DEV) {
          console.log("Stlite app mounted successfully.");
        }
        onLoad?.(app);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        if (import.meta.env.DEV) {
          console.error("Failed to mount stlite app:", error);
        }
      });

    return () => {
      isCancelled = true;
      if (stliteAppRef.current) {
        if (import.meta.env.DEV) {
          console.log("Cleanup: Unmounting stlite app...");
        }
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
    env,
    installs,
    languageServer,
    onLoad,
    onUnload,
  ]);

  return (
    <div
      ref={rootRef}
      className={`stlite-react-container${className ? ` ${className}` : ""}`}
      style={style}
    ></div>
  );
};