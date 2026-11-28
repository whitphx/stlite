---
"@stlite/kernel": patch
"@stlite/react": patch
"@stlite/browser": patch
"@stlite/desktop": patch
"@stlite/sharing": patch
---

Support `theme.fontFaces` and other array/table-valued options in `streamlitConfig`, e.g. `"theme.fontFaces": [{ family: "Inter", url: "app/static/Inter.woff2", weight: 500 }]`, which used to be rejected as an invalid config. Font files referred to as `app/static/...` (with `server.enableStaticServing`) are now loaded from the app's `static` directory as with `streamlit run`.
