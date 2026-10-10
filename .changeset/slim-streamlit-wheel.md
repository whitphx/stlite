---
"@stlite/kernel": minor
"@stlite/react": minor
"@stlite/browser": minor
"@stlite/desktop": minor
"@stlite/sharing": minor
"@stlite/cli": minor
"@stlite/cloudflare": minor
---

The bundled Streamlit wheel no longer includes `streamlit.testing` (`AppTest`), the `streamlit hello` demo package (`streamlit.hello`), or Streamlit's agent skill files, which shrinks the startup download by about 610 KB uncompressed. Apps that import `streamlit.testing` or `streamlit.hello` now fail with `ModuleNotFoundError`.
