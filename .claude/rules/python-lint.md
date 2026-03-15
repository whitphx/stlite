---
paths:
  - packages/kernel/py/stlite-lib/**/*.py
---

Run the following in `packages/kernel/py/stlite-lib/` and fix any errors before committing:

```bash
cd packages/kernel/py/stlite-lib
uv run ruff check . --fix
uv run ruff format .
uv run pyright
```
