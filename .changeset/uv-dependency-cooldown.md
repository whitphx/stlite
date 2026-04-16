---
"@stlite/kernel": patch
"@stlite/browser": patch
"@stlite/desktop": patch
"@stlite/react": patch
---

Configure a 1-week `exclude-newer` cooldown for uv resolution to reduce exposure to PyPI supply-chain attacks when resolving the Python dependencies used to build the kernel's Pyodide wheels.
