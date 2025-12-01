import React, { useRef, useEffect, memo } from 'react';
import {
  mount,
  StliteApp as StliteAppBrowser, // Rename to avoid conflict with component name
  StliteMountOptions,
  File,
} from '@stlite/browser';

// Re-export @stlite/browser's types for convenience
export type { StliteMountOptions, File };
// Export StliteApp type from browser package as StliteController
export type StliteController = StliteAppBrowser;

export interface StliteAppProps extends Omit<StliteMountOptions, 'code' | 'files'> {
  /**
   * The Python code to run.
   * If `files` prop is also provided, this code will be saved as `entrypoint` file.
   * If only `code` is provided, it will be saved as `streamlit_app.py`.
   */
  code?: string;
  /**
   * A record of files to be mounted on the Pyodide file system.
   * The key is the file path (e.g., "streamlit_app.py", "pages/main.py", "requirements.txt").
   * The value is an object with `data` (string content) and `type` ("text").
   */
  files?: Record<string, File>;
  /**
   * Additional class name for the container div.
   */
  className?: string;
  /**
   * Additional style for the container div.
   */
  style?: React.CSSProperties;
}

const StliteApp: React.FC<StliteAppProps> = memo(({
  code,
  files,
  className,
  style,
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
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stliteAppRef = useRef<StliteAppBrowser | null>(null);

  const mergedFiles = files ? { ...files } : {}; // Create a mutable copy if files exist
  let finalEntrypoint = entrypoint;

  // If `code` is provided, ensure it's added to `mergedFiles`
  if (code !== undefined) {
    const codeEntrypoint = entrypoint || "streamlit_app.py";
    mergedFiles[codeEntrypoint] = { data: code, type: "text" };
    // Only override finalEntrypoint if it wasn't explicitly set and code is provided
    if (!entrypoint) {
      finalEntrypoint = codeEntrypoint;
    }
  }

  // Effect to handle mounting and unmounting
  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) {
      console.error('Stlite mount element not found.');
      return;
    }

    // Unmount any existing app before mounting a new one
    if (stliteAppRef.current) {
      console.log('Unmounting existing stlite app...');
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

    console.log('Mounting new stlite app with options:', mountOptions);
    mount(mountOptions, rootElement)
      .then((app) => {
        stliteAppRef.current = app;
        console.log('Stlite app mounted successfully.');
      })
      .catch((error) => {
        console.error('Failed to mount stlite app:', error);
      });

    return () => {
      if (stliteAppRef.current) {
        console.log('Cleanup: Unmounting stlite app...');
        stliteAppRef.current.unmount();
        stliteAppRef.current = null;
      }
    };
  }, [
    code,
    JSON.stringify(mergedFiles), // Deep compare files to trigger re-mount if content changes
    finalEntrypoint,
    JSON.stringify(requirements),
    pyodideUrl,
    sharedWorker,
    disableProgressToasts,
    disableErrorToasts,
    JSON.stringify(streamlitConfig),
    JSON.stringify(env),
    JSON.stringify(installs),
    languageServer,
  ]);

  return (
    <div ref={rootRef} className={`stlite-react-container ${className || ''}`} style={style}>
      {/* Streamlit app will be mounted here */}
    </div>
  );
});

StliteApp.displayName = 'StliteApp';

export default StliteApp;