---
"@stlite/react": patch
---

Update generateUniqueId to use only alphabetical characters instead of alphanumeric. This ensures IDs contain only lowercase letters (a-z), which improves compatibility with systems that have restrictions on numeric characters in identifiers.
