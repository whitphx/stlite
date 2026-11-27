---
"@stlite/react": patch
"@stlite/browser": patch
"@stlite/desktop": patch
"@stlite/sharing": patch
---

Fix the app crashing before it renders when a theme font is given with a stylesheet URL, e.g. `"theme.font": "Inter:https://fonts.googleapis.com/css2?family=Inter"`. The font stylesheet is now loaded as with `streamlit run`.
