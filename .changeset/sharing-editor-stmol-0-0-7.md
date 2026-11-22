---
"@stlite/sharing-editor": patch
---

Fix the Custom Components sample, which failed to install its requirements: it is back on `stmol` 0.0.7, because later versions pin `ipywidgets==7.6.3`, whose Jupyter server dependencies (`tornado`, `pyzmq`) have no Pyodide wheels.
