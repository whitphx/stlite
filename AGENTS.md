# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed by Yarn workspaces and Lerna‑Lite.
- Key folders:
  - `packages/`: TypeScript packages (e.g., `browser`, `kernel`, `desktop`, `sharing*`). Source in `src/`, builds in `dist/` or `build/`.
  - `streamlit/`: vendored Streamlit (frontend and Python). Proto files and frontend libs used by kernel/browser.
  - `assets/`, `.husky/`, `.github/`, `Makefile`, `tsconfig.json` in repo root.

## Build, Test, and Development Commands
- Initialize toolchains and deps:
  - `make init` — installs Python venv via `uv`, installs Yarn deps, prepares submodules.
- Build all:
  - `make` — builds shared libs and all packages in dependency order.
- Package‑local dev (watch mode examples):
  - `cd packages/kernel && yarn start`
  - `cd packages/browser && yarn start`
  - `cd packages/sharing && yarn start` and in another shell `cd packages/sharing-editor && yarn start`
- Tests:
  - Unit: `cd packages/<name> && yarn test` (Vitest).
  - E2E (browser): `cd packages/browser && yarn test:e2e` (Playwright). First‑time: `yarn test:e2e:setup`.

## Coding Style & Naming Conventions
- Language: TypeScript (ESM). React in UI packages.
- Formatting: Prettier (2‑space indent, single quotes default). Run `yarn fix:prettier` in each package.
- Linting: ESLint + typescript‑eslint. Run `yarn check:eslint` or `yarn fix:eslint`.
- File layout: `src/**/*.{ts,tsx}` → `dist/` or `build/`. Public APIs defined via `exports`/`types` in `package.json`.
- Naming: use camelCase for vars/functions, PascalCase for React components and TypeScript types.

## Testing Guidelines
- Framework: Vitest for unit tests; Playwright for E2E in `packages/browser/e2e-tests`.
- Place tests alongside sources or under `tests/`. Use `*.test.ts(x)` filenames.
- Aim for meaningful assertions and cover core branches. Optional coverage example: `cd packages/common && yarn coverage`.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (e.g., `feat(kernel): add wheels cache`, `fix(browser): handle IDBFS errors`, `docs: update README`). Use imperative mood and scoped prefixes when relevant.
- PRs: include a clear summary, motivation, and scope; link issues (`Closes #123`); add screenshots for UI changes; note breaking changes and migration steps. Ensure `make` and all package tests pass locally.

## Release Flow (Lerna‑Lite)
- Tooling: Lerna‑Lite in fixed/locked mode (`lerna.json`), script `yarn new-version` runs `lerna version` locally.
- Branch: releases are allowed from `main` (`allowBranch: "main"`). Ensure a clean working tree on `main`.
- Steps:
  1) `yarn new-version` → pick bump (patch/minor/major).
  2) Lerna updates versions across packages, creates a version commit and tag.
  3) Push commits and tags if your flow requires remote CI; otherwise artifacts are initiated from the developer machine.
- Notes: Use `yarn new-version --force-publish` to release without code changes.

## Security & Configuration Tips
- Node ≥ 22 and Yarn 4 are required; install `uv` for Python tooling.
- Some dev tasks use env vars: e.g., `EDITOR_APP_ORIGIN` for `@stlite/sharing`, `SHARING_APP_URL` for `@stlite/sharing-editor`.
- Large artifacts (Pyodide/Streamlit wheels) are built via `Makefile`; avoid committing generated files.
