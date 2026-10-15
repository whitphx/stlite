---
"@stlite/kernel": minor
"@stlite/browser": minor
"@stlite/react": minor
"@stlite/desktop": minor
"@stlite/cli": minor
"@stlite/sharing": minor
"@stlite/app-packager": patch
"@stlite/cloudflare": patch
---

Upgrade the browser runtime from Pyodide 0.29.3 to 314.0.3, which moves apps from Python 3.13 to Python 3.14 and brings pandas 3, NumPy 2.4, protobuf 7, matplotlib 3.10, and Pillow 12. It also picks up the upstream fix for the JSPI-related crash that multipage apps hit after many Python async calls ([#1493](https://github.com/whitphx/stlite/issues/1493)).

Packages you pin in `requirements.txt` must have wheels for the new interpreter, and code relying on pandas 2 behavior may need updating.

Pyodide 314 no longer loads in classic web workers, so `@stlite/browser` now runs Python in a module worker in production builds too, as the other packages already did. Browsers without module worker support (such as Firefox before 114) can no longer run it. A `workerType: "classic"` passed to `@stlite/react`'s `createKernel()` no longer works.

`@stlite/cloudflare` stays on Pyodide's 0.29.x line (0.29.3 → 0.29.4), since the wheels it vendors have to match the Python that Cloudflare's Worker runtime executes — 3.13 on the stable `python_workers` flag. To let the two lines move independently, `@stlite/app-packager`'s vendoring entry points take an optional `pyodideModule`, and `@stlite/cloudflare` passes its own.
