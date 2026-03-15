---
"@stlite/kernel": patch
---

Fix worker creation on opaque origins (e.g. file:// protocol, data: URLs): wrap data: URL workers in blob URLs to fix IndexedDB access (IDBFS), correctly detect opaque origins in same-origin checks, and fall back from SharedWorker to regular Worker on opaque origins where SharedWorker silently fails
