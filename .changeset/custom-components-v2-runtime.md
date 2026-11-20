---
"@stlite/kernel": patch
"@stlite/browser": patch
"@stlite/react": patch
"@stlite/desktop": patch
"@stlite/sharing": patch
"@stlite/cloudflare": patch
---

Let Custom Components v2 (`st.components.v2.component`) run in Stlite. Creating or mounting one failed with `AttributeError: type object 'Runtime' has no attribute 'exists'`, and so did third-party code that calls `Runtime.instance()` or `Runtime.exists()`.
