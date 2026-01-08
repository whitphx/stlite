---
"@stlite/react": patch
---

Fix Emotion cache key error by updating generateUniqueId to use only alphabetical characters. Previously, the function generated alphanumeric IDs (e.g., "st-1mk594xl") which caused Emotion to throw an error: "Emotion key must only contain lower case alphabetical characters and - but "st-1mk594xl" was passed". The function now generates IDs containing only lowercase letters (a-z) to comply with Emotion's requirements.
