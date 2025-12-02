# `@stlite/react`

React bindings for running Streamlit entirely in the browser with Stlite. It wires the Pyodide-backed kernel to the Streamlit frontend components and ships the prebuilt wheels and styles needed to render the app.

## Quick start

Install the package and its CSS, create a kernel, and render the app component.

```bash
npm install @stlite/react
# or
yarn add @stlite/react
```

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { StliteAppWithToast, createKernel } from "@stlite/react";
import { wheelUrls } from "@stlite/react/wheels";
import "@stlite/react/stlite.css";

const kernel = createKernel({
  entrypoint: "streamlit_app.py",
  files: {
    "streamlit_app.py": {
      data: `
import streamlit as st

st.write("Hello from Stlite + React!")
`,
    },
  },
  archives: [],
  requirements: [],
  prebuiltPackageNames: [],
  wheelUrls,
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StliteAppWithToast kernel={kernel} />
  </React.StrictMode>,
);
```

- `StliteAppWithToast` shows progress/error toasts; use `StliteApp` if you do not want them.
- Pass `wheelUrls` from `@stlite/react/wheels` so the bundled Streamlit wheels are available to Pyodide.

## Vite setup

When building with Vite, include the helper plugin so the wheel assets are emitted with predictable names:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import stliteReactPlugin from "@stlite/react/vite-plugin";

export default defineConfig({
  plugins: [react(), stliteReactPlugin()],
});
```
