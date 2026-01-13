---
"@stlite/react": major
"@stlite/browser": major
---

Rename `mountDocumentStyles` to `disableDocumentStyles` with inverted meaning.

**Breaking Change:** The `mountDocumentStyles` prop/option has been renamed to `disableDocumentStyles` with inverted logic:

- Old: `mountDocumentStyles: true` (default) meant document styles were mounted
- New: `disableDocumentStyles: false` (default) means document styles are mounted

**Migration:**

- `mountDocumentStyles={true}` → remove the prop (default behavior)
- `mountDocumentStyles={false}` → `disableDocumentStyles={true}`
