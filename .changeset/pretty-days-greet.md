---
"@stlite/browser": patch
"@stlite/react": patch
---

Skip pushing browser history upon multi-page app navigations when the page is opened via file: protocol because it causes SecurityError due to the file: protocol restriction
