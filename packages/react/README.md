# `@stlite/react`

A React wrapper component for embedding Stlite applications.
It wraps the core functionality from [`@stlite/browser`](../browser/README.md).

## Installation

bash
npm install @stlite/react @stlite/browser react react-dom
# or
yarn add @stlite/react @stlite/browser react react-dom
# or
pnpm add @stlite/react @stlite/browser react react-dom


## Usage

tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { StliteApp } from "@stlite/react";
import "@stlite/browser/dist/stlite.css"; // IMPORTANT: Import the CSS file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StliteApp
      code={`
import streamlit as st

name = st.text_input('Your name')
st.write("Hello,", name or "world")
`}
    />
  </React.StrictMode>,
);


## API Reference

### `StliteAppProps`

Props for the `StliteApp` component. Extends `StliteMountOptions` from `@stlite/browser` with some modifications and additions.

- `code?: string`: The Python code of the Streamlit app. This will be mounted as `"streamlit_app.py"`. If `files` is also provided, `code` will be merged into `files` at `streamlit_app.py`.
- `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
  > **Note on stability**: If `files`, `requirements`, `env`, `installs`, or `streamlitConfig` are dynamically constructed (e.g., as inline object literals `files={{...}}`), their references will change on every render, causing the Stlite app to remount. For optimal performance, memoize these props using `React.useMemo` if they don't change frequently:
  > tsx
  > const myFiles = React.useMemo(() => ({ "app.py": { data: "...", type: "text" } }), []);
  > <StliteApp files={myFiles} />
  > 
- `entrypoint?: string`: The path to the entrypoint file, relative to the Pyodide file system root. Defaults to `"streamlit_app.py"`.
- `requirements?: string[]`: A list of Python package names (e.g., `["numpy", "pandas"]`) to be installed in the Pyodide environment.
- `pyodideUrl?: string`: The URL of the Pyodide CDN. Defaults to `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/`.
- `sharedWorker?: boolean`: Whether to use a SharedWorker to run the Pyodide kernel. Defaults to `false`.
- `disableProgressToasts?: boolean`: Disable the progress toasts (e.g., "Installing packages..."). Defaults to `false`.
- `disableErrorToasts?: boolean`: Disable the error toasts (e.g., "An error occurred..."). Defaults to `false`.
- `streamlitConfig?: Record<string, Record<string, string>>`: A record representing the content of `.streamlit/config.toml`. For example, `{"server": {"port": "80"}}`.
- `env?: Record<string, string>`: A record of environment variables to be set in the Pyodide environment.
- `installs?: InstallOptions[]`: Additional options for `micropip.install()`.
- `languageServer?: boolean`: Whether to enable the language server for code completion and diagnostics. Defaults to `false`.
- `className?: string`: CSS class name for the root container element.
- `style?: React.CSSProperties`: Inline CSS styles for the root container element.
- `onLoad?: (app: StliteKernel) => void`: Callback fired when the Stlite app is successfully mounted and ready.
- `onUnload?: () => void`: Callback fired when the Stlite app is unmounted.