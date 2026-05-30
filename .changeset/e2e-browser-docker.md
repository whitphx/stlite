---
---

CI-only: run the e2e-browser Playwright job inside the official Playwright Docker image (`mcr.microsoft.com/playwright`) so the `yarn install:browsers` step is no longer needed. Sidesteps an intermittent post-download hang in Playwright's `install --with-deps` that had been timing out shards.
