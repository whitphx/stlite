---
"@stlite/kernel": patch
---

Fix IndexedDB access error (IDBFS) in production builds by wrapping data: URL workers in blob URLs to avoid opaque origins
