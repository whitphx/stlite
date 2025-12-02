import React, { useRef, useEffect, useMemo } from "react";
import {
  mount,
  StliteKernel,
  StliteMountOptions,
} from "@stlite/browser";

// Define the InstallOptions type here or import it if available from @stlite/browser
interface InstallOptions {
  packageName: string;
  options?: Record<string, any>;
}

// StliteAppProps interface
interface StliteAppProps
  extends Omit<
    StliteMountOptions,
    "files" | "entrypoint" | "requirements" | "streamlitConfig" | "env" | "installs" | "languageServer"
  > {
  code?: string;
  files?: Record<string, { data: string; type: "text" }>;
  entrypoint?: string;
  requirements?: string[];
  streamlitConfig?: Record<string, Record<string, string>>;
  env?: Record<string, string>;
  installs?: InstallOptions[];
  languageServer?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (app: StliteKernel) => void;
  onUnload?: () => void;
}

const DEBUG = process.env.NODE_ENV === 'development';

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

    // Embed Streamlit config into a file
    if (streamlitConfig) {
      const tomlContent = Object.entries(streamlitConfig)
        .map(([section, options]) => {
          const optionsStr = Object.entries(options)
            .map(([key, value]) => `${key} = "${value}"`)
            .join("\n");
          return `[${section}]\n${optionsStr}`;
        })
        .join("\n\n");
      merged[".streamlit/config.toml"] = { data: tomlContent, type: "text" };
    }

    return { mergedFiles: merged, finalEntrypoint: entryPt };
  }, [code, files, entrypoint, JSON.stringify(streamlitConfig)]); // Stringify streamlitConfig to ensure deep comparison if it's not a stable reference

  // Use useRef for callbacks
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
      if (DEBUG) console.error('Stlite mount element not found.');
      return;
    }

    let isCancelled = false; // Cancellation flag

    // Unmount any existing app before mounting a new one
    if (stliteAppRef.current) {
      if (DEBUG) console.log('Unmounting existing stlite app...');
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
      // streamlitConfig is now handled inside useMemo and merged into `files`
      env,
      installs,
      languageServer,
    };

    if (DEBUG) console.log('Mounting new stlite app with options:', mountOptions);
    mount(mountOptions, rootElement)
      .then((app) => {
        if (isCancelled) { // Check cancellation flag
          app.unmount();
          return;
        }
        stliteAppRef.current = app;
        if (DEBUG) console.log('Stlite app mounted successfully.');
        onLoadRef.current?.(app); // Use ref for callback
      })
      .catch((error) => {
        if (isCancelled) return; // Check cancellation flag
        if (DEBUG) console.error('Failed to mount stlite app:', error);
      });

    return () => {
      isCancelled = true; // Set cancellation flag
      if (stliteAppRef.current) {
        if (DEBUG) console.log('Cleanup: Unmounting stlite app...');
        stliteAppRef.current.unmount();
        stliteAppRef.current = null;
        onUnloadRef.current?.(); // Use ref for callback
      }
    };
  }, [
    mergedFiles,
    finalEntrypoint,
    requirements, // Direct reference, assuming stability or consumer memoization
    pyodideUrl,
    sharedWorker,
    disableProgressToasts,
    disableErrorToasts,
    env, // Direct reference, assuming stability or consumer memoization
    installs, // Direct reference, assuming stability or consumer memoization
    languageServer, // Direct reference, assuming stability or consumer memoization
  ]);

  return (
    <div
      ref={rootRef}
      className={`stlite-react-container${className ? ` ${className}` : ''}`} // Fixed className concatenation
      style={style}
    ></div>
  );
};