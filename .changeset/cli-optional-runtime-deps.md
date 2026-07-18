---
"@stlite/cli": patch
---

Make `@stlite/browser`, `@stlite/desktop`, and `@stlite/cloudflare` optional dependencies of `@stlite/cli`, loaded lazily. An install where a target's runtime package is omitted (e.g. `--omit=optional`, or an install failure npm tolerates for optional deps) still works for the other targets, and each command reports a clear "install …" message if its target's runtime package is missing.
