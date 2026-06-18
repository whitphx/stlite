---
"@stlite/kernel": patch
"@stlite/browser": patch
"@stlite/react": patch
"@stlite/desktop": patch
---

Fix file uploads in stlite's browser worker transport by preserving Streamlit's XSRF cookie and sending it on upload requests.
