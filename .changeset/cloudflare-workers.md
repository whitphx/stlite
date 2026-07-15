---
"@stlite/app-packager": patch
"@stlite/cloudflare": minor
"@stlite/kernel": patch
---

Add `@stlite/cloudflare`, a CLI that packages a local Streamlit project into a self-contained, deployable Cloudflare Python Workers directory (`stlite-cloudflare build <path> -o <out>`), running the stlite-patched Streamlit runtime server-side. Deploy the output with Wrangler.
