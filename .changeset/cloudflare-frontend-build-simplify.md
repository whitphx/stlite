---
"@stlite/cloudflare": patch
---

Simplify the Cloudflare frontend build script: resolve Vite through its package entry (instead of a hardcoded `dist/` path), import the local Vite config directly, and collapse the config merge into a single step.
