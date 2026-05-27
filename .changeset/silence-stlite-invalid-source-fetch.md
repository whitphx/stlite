---
"@stlite/kernel": patch
---

Silence the `ERR_NAME_NOT_RESOLVED` console errors that appear when Custom Components, Video subtitles, or Download Button assets are rendered. Upstream Streamlit's `DefaultStreamlitEndpoints.checkSourceUrlResponse` issues a side-effect `fetch()` against the source URL purely to surface 4xx/5xx responses to the embedding host; for stlite-bridged URLs (which use the `stlite.invalid` sentinel host) that fetch can never resolve and produces noisy console + host-error output without any useful signal. Rendering itself is unaffected — it already routes through the kernel's worker bridge.
