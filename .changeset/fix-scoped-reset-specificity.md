---
"@stlite/react": patch
"@stlite/browser": patch
"@stlite/desktop": patch
"@stlite/cli": patch
"@stlite/sharing": patch
---

Fix inputs, buttons and other elements rendering with the app's base font size and margins instead of their own, since the app root's reset styles overrode the widgets' styles.
