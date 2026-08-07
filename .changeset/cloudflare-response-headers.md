---
"@stlite/cloudflare": patch
---

Construct the response `Headers` in the Cloudflare Workers adapter by passing the ASGI header pairs to `js.Headers.new()` directly, dropping the intermediate conversion. No behavior change.
