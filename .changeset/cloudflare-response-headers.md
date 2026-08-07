---
"@stlite/cloudflare": patch
---

Construct the Fetch `Headers` object directly from the ASGI response headers, preserving repeated headers such as `Set-Cookie`.
