# Repository Guidelines

## Project Structure & Module Organization

- `packages/` hosts the Yarn workspaces: `browser`, `sharing`, and `desktop` are user apps; `kernel` is the Pyodide core; `sharing-editor` is the editor client for `sharing`, and the rest (`common`, `common-react`, devutils) are support utilities.
- `streamlit/` mirrors upstream Streamlit; `streamlit/frontend/app` is the upstream UI we reference (not build) when customizing `browser`, `sharing`, and `desktop`, while other `streamlit/frontend/*` packages (`lib`, `connection`, etc.) are consumed directly by our workspaces.
- Supporting assets sit in `assets/`; Makefile + `lerna.json` orchestrate builds, and browser E2E specs live in `packages/browser/e2e-tests`.

## Build, Test, and Development Commands

- `make init` installs Yarn dependencies, provisions `.venv` via `uv`, and updates Streamlit submodules—run it after cloning.
- Incremental builds rely on sentinels: `make browser`, `make desktop`, or `make sharing` traverse dependencies before running each package’s `yarn build`.
- `make kernel-test` or `yarn workspace @stlite/kernel test` runs kernel tests.
- Use Vite directly inside each app workspace (for example `yarn workspace @stlite/browser start` or `yarn workspace @stlite/browser test`) rather than building the upstream `streamlit/frontend/app`.

## Coding Style & Naming Conventions

- Follow the root `.prettierrc` (2 spaces, trailing commas, semicolons) and workspace ESLint configs (`eslint-plugin-streamlit-custom`); run `yarn lint`/`lint:fix` where you edit.
- Name React components in PascalCase files, keep shared utilities in `src/lib`, and re-export from `src/index.ts`.
- Python inside `packages/kernel/py` should stay Black-friendly (88 columns) and never commit generated wheels.

## Testing Guidelines

- Vitest + Testing Library cover Vite apps; keep specs beside components (`Component.test.tsx`) and mock Pyodide hooks with the provided fixtures.
- Legacy Streamlit component tests under `streamlit/component-lib` still rely on Jest; run `yarn test` there when editing widgets or protocol glue.
- Browser E2E scenarios live in `packages/browser/e2e-tests`; extend them when touching mounting, requirements parsing, or iframe messaging.

## Commit & Pull Request Guidelines

- Follow Conventional Commits (`type(scope): summary`), such as `fix(browser): handle iframe sizing`; keep one logical change per commit.
- PRs need a crisp summary, reproduction steps, screenshots for UI tweaks, and a linked issue via `Fixes #123`.
- Call out dependency bumps in titles, highlight CI considerations (Node 22, Yarn 4), and flag risk when touching Pyodide or kernel assets.

## Security & Configuration Tips

- Use Node ≥22 plus Yarn 4.5.3; rerun `make init` after runtime upgrades to refresh `.venv`.
- Wheel builds enforce Python/Pyodide parity—honor the Makefile guardrails and keep `packages/*/dist` or `.make` out of commits.
