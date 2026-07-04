# stlite Cloudflare Worker

This project runs the stlite-patched Streamlit runtime on Cloudflare Python
Workers. It is a first-party Stlite host target and consumes the local
`stlite-lib` and Streamlit wheel artifacts built from this repository.

```bash
cd cloudflare
npm run dev
```

The sync step builds the local runtime wheels, asks Wrangler to prepare the
Python Worker dependency tree, overlays the Stlite runtime wheels, and packages
the sample Streamlit app from `app/`.

`pyproject.toml` stays host-resolvable for local tests. `pylock.toml` is tracked
separately for the Worker bundle because the Pyodide binary wheels need direct
wheel pins when pywrangler resolves dependencies for Cloudflare's Python runtime.
