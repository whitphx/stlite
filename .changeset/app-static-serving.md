---
"@stlite/kernel": minor
"@stlite/browser": minor
"@stlite/react": minor
"@stlite/desktop": minor
"@stlite/sharing": minor
---

Support Streamlit's static file serving. With `server.enableStaticServing` on, files in the `static/` folder next to the main script now load from `./app/static/<path>` URLs in Markdown images, videos and audio (e.g. `st.markdown("![logo](./app/static/logo.png)")`) and from `/app/static/<path>` passed to `st.image`, `st.audio`, `st.video` and `st.logo`.
