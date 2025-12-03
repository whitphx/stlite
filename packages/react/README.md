# `@stlite/react`

React bindings for running Streamlit entirely in the browser with Stlite. It connects the Pyodide-backed kernel to the Streamlit UI.

## Quick start (Vite)

1. Install the package.

```bash
npm install -D @stlite/react
```

2. Update `vite.config.ts` to add the helper plugin so some assets are bundled correctly.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import stliteReactPlugin from "@stlite/react/vite-plugin";

export default defineConfig({
  plugins: [react(), stliteReactPlugin()],
});
```

3. Create a kernel, pass the bundled wheel URLs, and render the app. The bundled wheel URLs `wheelUrls` imported from `@stlite/react/vite-utils` are resolved by the Vite plugin above.

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { StliteAppWithToast, createKernel } from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";
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
    {/* <StliteApp kernel={kernel} /> // For non-toast version */}
  </React.StrictMode>,
);
```

- `StliteAppWithToast` shows progress/error toasts; use `StliteApp` to skip them.
- Use `wheelUrls` from `@stlite/react/vite-utils` so Pyodide can locate the bundled Streamlit wheels produced by the Vite plugin.
