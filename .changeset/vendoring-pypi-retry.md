---
"@stlite/app-packager": patch
"@stlite/cli": patch
"@stlite/cloudflare": patch
---

Retry the micropip dependency-resolution step during packaging with exponential backoff, so a transient PyPI hiccup ("Can't find a pure Python 3 wheel for …") no longer fails the build.
