---
"@stlite/kernel": minor
"@stlite/react": minor
"@stlite/browser": minor
"@stlite/desktop": minor
"@stlite/sharing": minor
"@stlite/cli": minor
"@stlite/cloudflare": minor
---

The bundled Streamlit wheel no longer includes `streamlit.testing` (`AppTest`), the `streamlit hello` demo package (`streamlit.hello`), or Streamlit's agent skill files, which makes the wheel each app downloads at startup about 240 KB smaller (about 630 KB unpacked). Apps that import `streamlit.testing` or `streamlit.hello` now fail with `ModuleNotFoundError`.
