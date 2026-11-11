---
"@stlite/react": patch
"@stlite/browser": patch
"@stlite/desktop": patch
"@stlite/cli": patch
"@stlite/sharing": patch
---

Stop re-running Babel over already-built code when bundling: `@stlite/react`'s prebuilt bundle in `@stlite/browser`, `@stlite/desktop` and `@stlite/sharing`, and the generated protobuf bindings and built `@streamlit/*` libraries in `@stlite/react`. The bundled code behaves the same; it differs only in formatting, and its sourcemaps still lead to the original sources, with slightly coarser mappings.
