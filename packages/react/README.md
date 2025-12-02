# `@stlite/react`

A React wrapper for [`@stlite/browser`](../browser/README.md). It provides a `<StliteApp>` component to easily embed Streamlit applications into your React frontend.

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

-   `code?: string`: The Python code of the Streamlit app. If `files` is also provided, this code will be mounted as `streamlit_app.py` or the value of `entrypoint` if specified.
-   `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
-   `entrypoint?: string`: The path to the entrypoint file (e.g., `"streamlit_app.py"`). If `code` is provided but `entrypoint` is not, `"streamlit_app.py"` will be used as the entrypoint.
-   `requirements?: string[]`: A list of Python package requirements (e.g., `["numpy", "pandas"]`).
-   `pyodideUrl?: string`: The URL of the Pyodide package. Defaults to the latest CDN URL.
-   `sharedWorker?: boolean`: If `true`, a SharedWorker will be used to run the Pyodide kernel, allowing multiple Stlite apps to share the same kernel. Defaults to `false`.
-   `disableProgressToasts?: boolean`: If `true`, suppresses toasts indicating Pyodide loading progress. Defaults to `false`.
-   `disableErrorToasts?: boolean`: If `true`, suppresses toasts for errors. Defaults to `false`.
-   `streamlitConfig?: StreamlitConfig`: An object representing the `~/.streamlit/config.toml` file. E.g., `{ client = { showSidebarNavigation = true } }`.
-   `env?: Record<string, string>`: Environment variables to set for the Pyodide kernel.
-   `installs?: (string | [string, InstallOptionProps])[]`: Options for `micropip.install()`.
-   `languageServer?: boolean`: If `true`, enables the Python language server for features like code completion. Defaults to `false`.
-   `className?: string`: Additional CSS class names to apply to the root container `div`.
-   `style?: React.CSSProperties`: Inline styles to apply to the root container `div`.
-   `onLoad?: (app: StliteKernel) => void`: Callback fired when the Stlite app is successfully mounted and ready, receiving the `StliteKernel` instance.
-   `onUnload?: () => void`: Callback fired when the Stlite app is unmounted.

**Performance Note:** For `requirements`, `streamlitConfig`, `env`, and `installs` props, it is highly recommended to memoize their values using `React.useMemo` if they are objects or arrays and are not stable references across renders. Otherwise, the Stlite app might unnecessarily re-mount on every parent component re-render.

tsx
// Consumer should memoize array/object props:
const requirements = React.useMemo(() => ["numpy", "pandas"], []);
const streamlitConfig = React.useMemo(() => ({
  client: { showSidebarNavigation: true }
}), []);

<StliteApp requirements={requirements} streamlitConfig={streamlitConfig} />;