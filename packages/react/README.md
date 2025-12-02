# `@stlite/react`

A React component for embedding Streamlit applications powered by [`@stlite/browser`](../browser/README.md).
It wraps the core functionality from `@stlite/browser`, providing a familiar React interface for seamless integration into your web applications.

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

Props for the `StliteApp` component. Extends `StliteMountOptions` from `@stlite/browser` but redefines `code` and `files`.

- `code?: string`: A string of Python code to be executed as the Streamlit app. This will be written to `streamlit_app.py` by default. If `files` also contains `streamlit_app.py`, this `code` prop will take precedence.
- `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
- `entrypoint?: string`: The path to the entrypoint file, e.g., `"streamlit_app.py"`. Defaults to `"streamlit_app.py"` if `code` is provided and `entrypoint` is not.
- `requirements?: string[]`: A list of PyPI package names to install (e.g., `["numpy", "pandas"]`).
- `pyodideUrl?: string`: The URL to the Pyodide distribution.
- `sharedWorker?: boolean`: If `true`, a SharedWorker is used to run the Pyodide kernel, allowing multiple StliteApp instances to share the same kernel.
- `disableProgressToasts?: boolean`: If `true`, disables the progress toasts shown during installation or booting.
- `disableErrorToasts?: boolean`: If `true`, disables error toasts.
- `streamlitConfig?: StreamlitConfig`: An object representing the Streamlit configuration to be written to `.streamlit/config.toml`. See [`StreamlitConfig` type definition](https://github.com/whitphx/stlite/blob/main/packages/browser/src/types.ts) for details.
- `env?: Record<string, string>`: Environment variables to set for the Pyodide runtime.
- `installs?: InstallOptions[]`: Additional options for installing packages. See [`InstallOptions` type definition](https://github.com/whitphx/stlite/blob/main/packages/browser/src/types.ts) for details.
- `languageServer?: boolean`: If `true`, enables the language server for features like code completion.
- `className?: string`: Additional CSS class names to apply to the root container `div`.
- `style?: React.CSSProperties`: Inline styles to apply to the root container `div`.
- `onLoad?: (app: StliteKernel) => void`: Callback fired when the Stlite app is successfully mounted and ready. The `app` object is the `StliteKernel` instance.
- `onUnload?: () => void`: Callback fired when the Stlite app is unmounted.

**Note on Array and Object Props:**
Props like `requirements`, `env`, `installs`, and `streamlitConfig` are objects or arrays. If these props are constructed inline during rendering (e.g., `requirements={["numpy"]}`), their reference will change on every render, potentially causing the Stlite app to remount unnecessarily. For optimal performance, it is highly recommended to memoize these props using `React.useMemo` or define them outside the component to ensure a stable reference across renders.

tsx
import React, { useMemo } from "react";
// ... (other imports)

function MyStliteAppWrapper() {
  const requirements = useMemo(() => ["numpy", "pandas"], []);
  const streamlitConfig = useMemo(() => ({
    server: {
      baseUrlPath: "streamlit_app",
    },
  }), []);

  return (
    <StliteApp
      code="import streamlit as st; st.write('Hello')"
      requirements={requirements}
      streamlitConfig={streamlitConfig}
    />
  );
}