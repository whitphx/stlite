---
"@stlite/react": minor
---

Add `useKernel` hook that creates a kernel tied to the React component lifecycle. The kernel is created on mount and automatically disposed on unmount, preventing resource leaks. Use this instead of calling `createKernel()` directly for most React use cases.
