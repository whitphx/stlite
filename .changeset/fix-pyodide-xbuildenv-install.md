---
"@stlite/kernel": patch
"@stlite/browser": patch
"@stlite/react": patch
"@stlite/desktop": patch
---

Fix `make venv` failing during `pyodide xbuildenv install` after upstream Pyodide 0.29.4 shipped a `pyodide-lock.json` under a newer schema. Bump `pyodide-lock` 0.1.2 → 0.1.3 (which makes the dropped `info.version` field optional) and pin the xbuildenv install to the runtime Pyodide version so future upstream patch releases can no longer break the frozen build env.
