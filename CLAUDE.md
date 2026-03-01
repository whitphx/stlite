# CLAUDE.md - Stlite AI Assistant Guide

**Stlite** is a serverless Streamlit running in browsers via Pyodide (Python-to-WebAssembly). No backend server needed.

- **Stack**: React + TypeScript + Vite + Pyodide(Python)
- **Monorepo**: Yarn workspaces, Makefile-orchestrated builds
- **Testing**: Vitest + Playwright
- **Streamlit fork**: Git submodule at `streamlit/` (forked customized branch named `stlite-<version>`)

## Repository Structure

```
packages/
  common/          # Shared TS types (base package, no deps)
  kernel/          # Core Pyodide runtime & worker management
    py/stlite-lib/ # Python: custom Streamlit server (replaces streamlit.web)
    py/streamlit/  # Compiled Streamlit wheel for Pyodide
  react/           # React bindings (StliteApp, StliteAppWithToast)
  browser/         # Browser-mountable API (mount(), <streamlit-app>)
  desktop/         # Electron desktop app
  sharing/         # App sharing service
  sharing-editor/  # Editor app for the sharing service (Monaco editor)
  sharing-common/  # Shared code for sharing (protobuf)
  tooling/         # Build utilities
streamlit/         # Git submodule: whitphx's Streamlit fork
docs/              # Documentation site (Astro Starlight)
.make/             # Sentinel files for incremental builds
```

**Dependency graph**: common -> kernel -> react -> browser / desktop / sharing

## Development Setup & Building

See `CONTRIBUTING.md` for environment setup, dev workflows per package, and building.

**Key points for AI assistants**:

- **Always use Makefile targets** (`make browser`, `make kernel`, etc.) - they handle dependency ordering via sentinel files in `.make/`.
- **Do NOT run `cd packages/X && yarn build` directly** - dependencies may not be built.
- `NODE_OPTIONS="--max-old-space-size=6144"` is set in Makefile to prevent heap errors.

## Testing

```bash
# Unit tests (Vitest) - per package
cd packages/<pkg> && yarn test
cd packages/<pkg> && yarn test:watch
make kernel-test   # With proper build deps

# E2E tests (Playwright)
cd packages/browser/e2e-tests
yarn install && yarn install:browsers && yarn test

# Python tests (pytest)
cd packages/kernel/py/stlite-lib && uv run pytest
```

- Vitest uses `jsdom` environment (not happy-dom, due to iframe issues)
- Prefer `make kernel-test` for kernel tests (it builds required wheels). Run `make stlite-lib-wheel streamlit-wheel` manually only if you call `cd packages/kernel && yarn test` directly.

## Code Quality

```bash
# TypeScript
cd packages/<pkg>
yarn check:eslint # or yarn fix:eslint
yarn check:prettier # or yarn fix:prettier

# Python (stlite-lib)
cd packages/kernel/py/stlite-lib
uv run ruff check . && uv run ruff format . && uv run pyright
```

- ESLint 9 flat config (`eslint.config.mjs`), Prettier (2 spaces, semicolons)
- Kernel ESLint: unused args with `_` prefix allowed (`argsIgnorePattern: "^_"`); other packages may use different ESLint configs
- Git hooks (Husky): pre-commit runs lint-staged on `*.{md,json}`
- Commits: conventional format `type(scope): summary`

## Changeset Management

Each PR that introduces user-facing changes (new features, bug fixes, breaking changes) MUST include a Changeset file created via `yarn changeset`. This ensures proper versioning and changelog generation.

```bash
yarn changeset
```

## Architecture

**Worker-based**: Python runs in Web Workers (Dedicated or SharedWorker) via Pyodide. Main thread handles React UI, communicates via `postMessage`.

**Streamlit integration**: Stlite uses `streamlit.runtime` but replaces `streamlit.web` (Tornado) with `stlite-lib` (custom server at `packages/kernel/py/stlite-lib/stlite_lib/`). Key files: `server/Server.py`, `codemod.py` (AST transforms).

**File systems**: MEMFS (default, ephemeral), IDBFS (persistent via IndexedDB), NODEFS (desktop only).

## Critical Constraints

### Python Version

**MUST match Pyodide**: Python version specified in `.python-version` and enforced by the Makefile must match the version used in the Pyodide runtime (e.g. Python 3.12 for Pyodide 0.28.0). This ensures compatibility of built wheels and prevents runtime errors.

### Pyodide Compatibility

- Only pure Python or pre-built-for-Pyodide packages work
- Check: https://pyodide.org/en/stable/usage/packages-in-pyodide.html
- `time.sleep()` is NO-OP - use `await asyncio.sleep()` instead
- Top-level `await` IS supported in Stlite (unlike standard Streamlit)
- Use async generators for `st.write_stream()`

### Streamlit Web Module

**Never import `streamlit.web`** in stlite-lib (Tornado can't run on Pyodide). Use `stlite_lib.server.Server` instead. `streamlit.runtime` is safe.

### HTTP Libraries

Known to work in this repo: `requests`, `urllib`, `urllib3`, `pyodide.http.pyfetch()`. Many other networking libraries (e.g., `httpx`, `aiohttp`) may not be compatible with Pyodide—verify against Pyodide docs and this repo before using them.

### Build Gotchas

- Sentinel files in `.make/` track build state - always `@touch $@` in Makefile targets
- Wheel filenames include Python version - use `@stlite/tooling get-streamlit-wheel-file-name`
- Build order matters: use `make <target>`, not `yarn build` directly

## Common Tasks

**Add JS dependency**: `cd packages/<pkg> && yarn add <pkg>`, then `make <target>` from root.

**Add Python dependency**: `cd packages/kernel/py/stlite-lib && uv add <pkg>`, then `make stlite-lib-wheel`.

**Update Streamlit / sample apps / release**: See `CONTRIBUTING.md`.

**Pre-PR checklist**: `make kernel-test`, E2E tests, `yarn tsc --noEmit`, `yarn check:eslint`, `yarn check:prettier`, `yarn changeset`.
