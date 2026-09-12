---
"@stlite/cloudflare": minor
"@stlite/cli": minor
---

Bundle the Python runtime into the Worker script by default. Cloudflare now caps a script at 64 MiB uncompressed on every plan instead of 3 MiB (Free) or 10 MiB (Paid) after gzip, and the packaged runtime fits that with room to spare, so a cold start no longer fetches and unpacks the runtime from static assets before the first `import streamlit`.

The previous layout is still available as `--asset-runtime`, which keeps the packed libraries compressed in the isolate and is worth the extra cold-start work for an app running close to the 128 MB isolate limit. `--bundled-runtime` now does nothing and can be dropped from existing build commands.
