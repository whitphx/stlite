---
"@stlite/cli": patch
---

Make `@stlite/browser`, `@stlite/desktop`, and `@stlite/cloudflare` optional dependencies of `@stlite/cli`, loaded lazily. A `stlite` install only pulls the runtime for the target you use, and each command reports a clear "install …" message if its target's runtime package is missing.
