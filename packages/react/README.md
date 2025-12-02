# `@stlite/react`

A React component for embedding Stlite applications, wrapping the core functionality from [`@stlite/browser`](../browser/README.md).

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

The `StliteApp` component accepts the following props:

- `code?: string`: The Python code of your Streamlit app. If `files` is also provided, this code will be mounted as `streamlit_app.py` or the specified `entrypoint`.
- `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
- `entrypoint?: string`: The file path to run as the main Streamlit application. Defaults to `"streamlit_app.py"`.
- `requirements?: string[]`: A list of Python package names to install (e.g., `["numpy", "pandas"]`).
- `pyodideUrl?: string`: The URL to the Pyodide distribution. Defaults to the one from unpkg.
- `sharedWorker?: boolean`: Whether to use a SharedWorker to run the Pyodide kernel. This allows multiple Stlite apps on the same page to share a single worker and Pyodide instance. Defaults to `false`.
- `disableProgressToasts?: boolean`: Whether to disable the progress toasts. Defaults to `false`.
- `disableErrorToasts?: boolean`: Whether to disable the error toasts. Defaults to `false`.
- `streamlitConfig?: StreamlitConfig`: An object representing the Streamlit configuration to be written to `.streamlit/config.toml`. Keys are section names (e.g., `"client"`) and values are objects of key-value pairs.
- `env?: Record<string, string>`: Environment variables to set in the Pyodide runtime.
- `installs?: InstallOptions[]`: Advanced options for `micropip.install()`.
- `languageServer?: boolean`: Whether to enable the Python language server for features like code completion. Defaults to `false`.
- `className?: string`: Additional CSS class names to apply to the root container `div`.
- `style?: React.CSSProperties`: Additional inline styles to apply to the root container `div`.
- `onLoad?: (app: StliteKernel) => void`: Callback fired when the Stlite app is successfully mounted and ready. It receives the `StliteKernel` instance as an argument.
- `onUnload?: () => void`: Callback fired when the Stlite app is unmounted.

### Performance Notes

For object and array props (e.g., `requirements`, `streamlitConfig`, `env`, `installs`), if you pass inline literals or dynamically constructed objects on every render, it will cause the Stlite app to unnecessarily re-mount. To prevent this, always memoize these props using `React.useMemo`:

tsx
// Consumer should memoize array/object props:
const requirements = React.useMemo(() => ["numpy", "pandas"], []);
const streamlitConfig = React.useMemo(() => ({
  client: { showSidebarNavigation: true }
}), []);

<StliteApp requirements={requirements} streamlitConfig={streamlitConfig} />;