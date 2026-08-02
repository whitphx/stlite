---
"@stlite/cli": patch
---

Load each target's runtime package (`@stlite/browser`, `@stlite/desktop`, `@stlite/cloudflare`) lazily instead of depending on them at runtime, so an install that omits a target still works for the others and the heavy per-target artifacts are not pulled in unless requested. Each command reports a clear "install …" message when its target's package is missing, and verifies the installed version satisfies the range this CLI supports — failing loudly and actionably instead of silently mishandling a drifted plugin interface.
