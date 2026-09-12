---
"@stlite/cloudflare": minor
"@stlite/cli": minor
---

Remove the `--bundled-runtime` flag. Bundling the Python runtime into the Worker script is the default, so the flag selected the behaviour you already get; `--asset-runtime` is the flag that changes it. Builds still passing `--bundled-runtime` now fail with an unknown-argument error instead of being silently ignored, and the fix is to drop it from the command.
