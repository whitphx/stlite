# Repository Guidelines

## Project Structure & Module Organization

- `packages/` hosts the Yarn workspaces: `browser`, `sharing`, and `desktop` are user apps; `kernel` is the Pyodide core; `sharing-editor` is the editor client for `sharing`, and the rest (`common`, `sharing-common`, `devutils`) are support utilities.
- `streamlit/` mirrors upstream Streamlit; `streamlit/frontend/app` is the upstream UI we reference (not build) when customizing `browser`, `sharing`, and `desktop`, while other `streamlit/frontend/*` packages (`lib`, `connection`, etc.) are consumed directly by our workspaces.
- Supporting assets sit in `assets/`; Makefile orchestrates builds, and browser E2E specs live in `packages/browser/e2e-tests`.

## Build, Test, and Development Commands

- `make init` installs Yarn dependencies, provisions `.venv` via `uv`, and updates Streamlit submodules—run it after cloning.
- Incremental builds rely on sentinels: `make browser`, `make desktop`, or `make sharing` traverse dependencies before running each package’s `yarn build`.
- `make kernel-test` or `yarn workspace @stlite/kernel test` runs kernel tests. Using `make` ensures proper build order so it's preferred for cross-workspace changes.
- Use Vite and Vitest directly inside each app workspace (for example `yarn workspace @stlite/browser start` or `yarn workspace @stlite/browser test`)
- You don't need to modify the upstream `streamlit/frontend/app`, while other imported packages in `streamlit/frontend/` can be edited.

## Coding Style & Naming Conventions

- Follow Prettier formatting (2 spaces, trailing commas, semicolons by default) as enforced by the project's configuration, and workspace ESLint configs.
- Python inside `packages/kernel/py` should be styled in Ruff and isort manner and never commit generated wheels.

## Testing Guidelines

- Vitest + Testing Library cover Vite apps; keep specs beside components (`Component.test.tsx`) and mock Pyodide hooks with the provided fixtures.
- Legacy Streamlit component tests under `streamlit/component-lib` still rely on Jest; run `yarn test` there when editing widgets or protocol glue.
- Browser E2E scenarios live in `packages/browser/e2e-tests`; extend them when touching mounting, requirements parsing, or iframe messaging.

## Commit & Pull Request Guidelines

- Follow Conventional Commits (`type(scope): summary`), such as `fix(browser): handle iframe sizing`; keep one logical change per commit.
- PRs need a crisp summary, reproduction steps, screenshots for UI tweaks, and a linked issue via `Fixes #123`.

## Security & Configuration Tips

- Use the latest Node LTS version plus latest version of Yarn 4;
- Wheel builds enforce Python/Pyodide parity—honor the Makefile guardrails and keep `packages/*/dist` or `.make` out of commits.
