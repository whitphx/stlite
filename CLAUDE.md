# CLAUDE.md - AI Assistant Guide for Stlite

> **Last Updated:** 2025-12-03
> **Purpose:** Comprehensive guide for AI assistants working on the Stlite codebase

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Quick Start for Development](#quick-start-for-development)
4. [Architecture & Key Concepts](#architecture--key-concepts)
5. [Build System](#build-system)
6. [Package Reference](#package-reference)
7. [Testing Strategy](#testing-strategy)
8. [Code Conventions](#code-conventions)
9. [Common Development Tasks](#common-development-tasks)
10. [Critical Constraints & Gotchas](#critical-constraints--gotchas)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Stlite** is a serverless Streamlit implementation that runs entirely in web browsers using Pyodide (Python compiled to WebAssembly). It enables Python data apps to run without backend servers, making them distributable as static sites or desktop applications.

### Key Features

- **Serverless**: No backend required - Python runs in the browser via WebAssembly
- **Pyodide-powered**: CPython 3.13.2 compiled to Wasm using Pyodide 0.28.2
- **Multiple Deployment Options**:
  - `@stlite/browser` - Embeddable in web pages via CDN
  - `@stlite/desktop` - Electron-based desktop apps
  - `@stlite/react` - React component integration
  - Stlite Sharing - Online editor and hosting platform

### Technologies

- **Frontend**: React 18.2 + TypeScript 5.9 + Vite 7.1
- **Python Runtime**: Pyodide 0.28.2 (Python 3.13.2)
- **Monorepo**: Yarn 4.5.3 workspaces
- **Testing**: Vitest 4.0 + Playwright
- **Build**: Makefile + Vite + TypeScript project references

### Repository Information

- **Main Repository**: https://github.com/whitphx/stlite
- **Streamlit Fork**: https://github.com/whitphx/streamlit (Git submodule)
- **License**: Apache 2.0
- **Maintainer**: whitphx

---

## Repository Structure

```
stlite/
├── packages/                   # Main monorepo packages (11 packages)
│   ├── common/                # Shared utilities & types
│   ├── kernel/                # Core Pyodide runtime & worker management
│   │   └── py/                # Python packages
│   │       ├── stlite-lib/    # Custom Streamlit server replacement
│   │       └── streamlit/     # Compiled Streamlit wheels
│   ├── react/                 # React bindings
│   ├── browser/               # Browser-mountable API (formerly mountable)
│   ├── desktop/               # Electron desktop app
│   ├── sharing/               # Sharing viewer app
│   ├── sharing-editor/        # Sharing editor app
│   ├── sharing-common/        # Shared code for sharing
│   └── devutils/              # Build system utilities
│
├── streamlit/                 # Git submodule: whitphx's Streamlit fork
│   ├── frontend/              # Streamlit React components
│   │   ├── connection/        # Connection management
│   │   ├── utils/             # Utilities
│   │   └── protobuf/          # Protocol Buffer definitions
│   └── lib/                   # Streamlit Python package
│
├── .github/workflows/         # CI/CD pipelines
├── .make/                     # Build state tracking (sentinel files)
├── .venv/                     # Python virtual environment
├── Makefile                   # Build orchestration
├── package.json               # Root package & workspace config
├── tsconfig.json              # TypeScript project references
└── [config files]             # ESLint, Prettier, etc.
```

### Workspace Configuration

**Root `package.json` workspaces:**
```json
{
  "workspaces": [
    "packages/*",
    "streamlit/frontend",
    "streamlit/frontend/*",
    "packages/desktop/samples/*"
  ],
  "engines": {
    "node": ">=22"
  },
  "packageManager": "yarn@4.5.3"
}
```

---

## Quick Start for Development

### Prerequisites

1. **Node.js**: v22+ (LTS version, see `.nvmrc`)
2. **Python**: 3.13.2 (MUST match Pyodide, see `.python-version`)
3. **uv**: Python package manager
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```
4. **Yarn**: 4.5.3 (managed by Corepack)
5. **System dependencies** (Linux/WSL):
   ```bash
   sudo apt-get install build-essential protobuf-compiler
   ```

### Initial Setup

```bash
# 1. Clone the repository with submodules
git clone --recursive https://github.com/whitphx/stlite.git
cd stlite

# 2. Initialize development environment
make init
# This runs:
#   - git submodule init/update
#   - uv venv + install Python dependencies
#   - pyodide xbuildenv install
#   - yarn install

# 3. Activate Python virtual environment
source .venv/bin/activate
```

### Development Workflows

#### Browser Package Development

```bash
# Terminal 1: Start kernel in watch mode (hot reload)
cd packages/kernel
yarn start

# Terminal 2: Start browser dev server
cd packages/browser
yarn start
# Opens at http://localhost:3000
```

#### Desktop Package Development

```bash
cd packages/desktop
yarn start
# Builds Pyodide artifacts + wheels, then starts Electron
```

#### Sharing Platform Development

```bash
# Terminal 1: Sharing viewer app
cd packages/sharing
yarn start  # http://localhost:3000

# Terminal 2: Sharing editor
cd packages/sharing-editor
yarn start  # http://localhost:5173
```

### Building Everything

```bash
# Full build (all packages)
make all

# Incremental build of specific package
make browser    # Builds browser + dependencies
make desktop    # Builds desktop + dependencies
make kernel     # Builds kernel + Python wheels

# Run kernel tests with proper build order
make kernel-test

# Clean all build artifacts
make clean
```

---

## Architecture & Key Concepts

### 1. Worker-Based Architecture

**Core Principle**: Python execution is isolated in Web Workers to prevent blocking the main thread.

```
┌─────────────────────┐
│   Main Thread       │
│  (React UI)         │
└──────────┬──────────┘
           │ postMessage
           ↓
┌─────────────────────┐
│   Web Worker        │
│  (Pyodide Runtime)  │
│  - Python execution │
│  - File system      │
│  - Package loading  │
└─────────────────────┘
```

**Worker Types:**
- **Dedicated Worker** (default): Each app runs in its own isolated worker
- **SharedWorker** (opt-in): Multiple apps share a single worker to reduce memory usage
  - Not supported in all browsers (e.g., Chrome Android)
  - Python environment and file system are shared
  - Separate home directories per app (`/home/pyodide/<id>`)

### 2. Streamlit Integration Architecture

**Key Insight**: Stlite uses Streamlit's `runtime` submodule but replaces the `web` submodule.

```
┌──────────────────────────────────────────────────┐
│         Original Streamlit                       │
│  ┌──────────────┐         ┌──────────────┐      │
│  │ streamlit.web│ (Tornado│streamlit.    │      │
│  │ (HTTP Server)│    )    │runtime       │      │
│  └──────────────┘         └──────────────┘      │
└──────────────────────────────────────────────────┘
                    ↓ Stlite replaces web module
┌──────────────────────────────────────────────────┐
│              Stlite                              │
│  ┌──────────────┐         ┌──────────────┐      │
│  │ stlite-lib   │         │streamlit.    │      │
│  │ (Custom      │         │runtime       │      │
│  │  Server)     │         │(unchanged)   │      │
│  └──────────────┘         └──────────────┘      │
└──────────────────────────────────────────────────┘
```

**Why Replace `streamlit.web`?**
- Tornado (HTTP server) cannot run on Pyodide
- Full HTTP server is unnecessary for browser-based apps
- Smaller bundle size is critical for web deployment

**stlite-lib** (`packages/kernel/py/stlite-lib/`):
- Implements Streamlit's server interface without Tornado
- Handles WebSocket-like communication with the main thread
- Performs AST transformations for Pyodide compatibility
- Located at: `packages/kernel/py/stlite-lib/stlite_lib/`

### 3. Streamlit Submodule Management

**Source**: Git submodule at `streamlit/` pointing to `https://github.com/whitphx/streamlit.git`

**Branch Naming Convention**:
```
stlite-<streamlit-version>
Examples: stlite-1.44.1, stlite-1.45.1
```

**Updating Streamlit** (from `DEVELOPMENT.md`):
```bash
cd streamlit
git remote add upstream https://github.com/streamlit/streamlit.git
git fetch upstream

# Create new branch based on current stlite branch
NEW_STLITE_BRANCH=stlite-1.45.1
CURRENT_STLITE_BRANCH=stlite-1.44.1
git checkout -b $NEW_STLITE_BRANCH $CURRENT_STLITE_BRANCH

# Rebase onto new Streamlit version
git rebase --onto 1.45.1 1.44.1 $NEW_STLITE_BRANCH
```

### 4. File System Architecture

Stlite uses Emscripten's file system API (inherited from Pyodide):

**File System Types:**
- **MEMFS** (default): In-memory, ephemeral (lost on reload)
  - Mounted at: `/`, `/home`, etc.
- **IDBFS**: Persistent storage via browser's IndexedDB
  - Used via `idbfsMountpoints` option in `@stlite/browser`
  - Data persists across page reloads
- **NODEFS**: Real file system access (desktop apps only)
  - Used in `@stlite/desktop` for file operations

### 5. Package Dependency Graph

```
@stlite/common (base types & utilities)
    ↓
@stlite/kernel (Pyodide runtime)
    ↓
@stlite/react (React bindings)
    ↓
┌───────────────┬────────────────────┐
↓               ↓                    ↓
@stlite/browser  @stlite/desktop    @stlite/sharing
                                     @stlite/sharing-editor
```

---

## Build System

### Build Architecture

**Primary Tool**: Makefile with sentinel-based incremental builds

**Sentinel File Strategy**:
- Build state tracked in `.make/` directory
- Each target creates a `.built` sentinel file on completion
- Dependencies tracked via `find` commands for source files
- Prevents infinite rebuild loops and unnecessary rebuilds

**Why Sentinel Files?**
1. Make needs a single file to track when a target was last built
2. Directory timestamps are unreliable (update on any file change)
3. JS/TS builds output multiple files (*.js, *.d.ts, etc.)
4. Provides reliable timestamp for dependency tracking

### Key Makefile Targets

```bash
# Setup
make init           # Git submodules + venv + node_modules + pyodide xbuildenv
make venv           # Python virtual environment setup
make node_modules   # Install npm dependencies
make git_submodules # Initialize git submodules

# Package builds (with dependencies)
make common         # @stlite/common
make kernel         # @stlite/kernel + Python wheels
make react          # @stlite/react
make browser        # @stlite/browser
make desktop        # @stlite/desktop
make sharing        # @stlite/sharing
make sharing-editor # @stlite/sharing-editor

# Python artifacts
make stlite-lib-wheel     # Build stlite-lib wheel
make streamlit-wheel      # Build & compile Streamlit wheel
make streamlit-proto      # Generate protobuf TypeScript definitions
make streamlit-frontend-lib # Build Streamlit frontend packages

# Testing & cleanup
make kernel-test    # Run kernel tests with proper dependencies
make clean          # Remove all build artifacts
make all            # Build all user-facing packages (default)
```

### Build Process Details

#### Python Wheel Building

**1. stlite-lib Wheel** (`stlite_lib-0.1.0-py3-none-any.whl`):
```bash
uv --directory packages/kernel/py/stlite-lib build
```
- Pure Python wheel (no compilation needed)
- Contains custom Streamlit server implementation

**2. Streamlit Wheel** (compiled for Pyodide):
```bash
# Build pure Python wheel
cd streamlit/lib && uv run python setup.py bdist_wheel
# Output: streamlit-<version>-py2.py3-none-any.whl

# Compile for Pyodide (bytecode compilation)
uv run pyodide py-compile --keep streamlit/lib/dist/streamlit-*.whl
# Output: streamlit-<version>-cp313-cp313-emscripten_3_1_58_wasm32.whl

# Copy to kernel package
cp streamlit/lib/dist/streamlit-*-cp313-*.whl \
   packages/kernel/py/streamlit/lib/dist/
```

**Python Version Check**:
- Makefile enforces Python version must match Pyodide's version
- Current: Python 3.13.2 (defined in `.python-version`)
- Verified during `streamlit-wheel` target

#### TypeScript Compilation

**Project References Architecture**:
- Root `tsconfig.json` references all package configs
- Each package has:
  - `tsconfig.json` - Project root (references src & test configs)
  - `tsconfig.src.json` - Source compilation
  - `tsconfig.test.json` - Test compilation (if applicable)

**Compilation Settings** (common across packages):
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "composite": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

#### Vite Build Configuration

**All user-facing packages use Vite 7.1** with library mode:

```typescript
// packages/browser/vite.config.ts (example)
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "stlite"
    },
    outDir: "build",
    sourcemap: true
  },
  plugins: [
    react({
      babel: {
        plugins: ["@emotion/babel-plugin"]
      }
    })
  ]
});
```

**Common Vite Plugins**:
- `@vitejs/plugin-react` - React Fast Refresh + Emotion support
- `vite-plugin-dts` - TypeScript declaration generation
- `@laynezh/vite-plugin-lib-assets` - Asset handling (fonts, wasm, wheels)
- `rollup-plugin-visualizer` - Bundle analysis
- Custom plugins per package (e.g., `stliteReactPlugin` for wheel bundling)

### Environment Variables

```bash
export NODE_OPTIONS="--max-old-space-size=6144"  # Prevent heap errors
export USE_CONSTRAINTS_FILE=false                 # Streamlit build config
export CI=true                                    # Immutable Yarn installs in CI
```

---

## Package Reference

### Core Packages

#### `@stlite/common` (v0.90.1)

**Purpose**: Shared TypeScript utilities and types used across all packages

**Location**: `packages/common/`

**Type**: Private, TypeScript-only package (no runtime code)

**Build**: TypeScript compilation only (`tsc -b`)

**Key Exports**:
- Type definitions shared across packages
- Utility types for Streamlit integration

**Dependencies**: None (base package)

**Development**:
```bash
cd packages/common
yarn build  # Compile TypeScript
yarn test   # Run Vitest tests
```

---

#### `@stlite/kernel` (v0.94.0)

**Purpose**: Core Pyodide runtime integration and worker management

**Location**: `packages/kernel/`

**Key Responsibilities**:
- Pyodide initialization and loading
- Web Worker and SharedWorker lifecycle management
- File system abstractions (MEMFS, IDBFS, NODEFS)
- Package installation via micropip
- Custom component iframe handling
- Python-JavaScript bridge

**Exports**:
- `/` - Main kernel API (createKernel, StliteKernel)
- `/contexts` - React contexts (StliteKernelContext, etc.)
- `/react` - React helpers (useStliteKernel, etc.)
- `/worker` - Worker entry point (worker.ts)
- `/worker-runtime` - Worker runtime internals

**Key Files**:
- `src/worker.ts` - Web Worker entry point
- `src/kernel.ts` - Main kernel class
- `src/worker-runtime.ts` - Runtime management
- `src/file-system.ts` - File system utilities

**Python Components**:

1. **stlite-lib** (`py/stlite-lib/`):
   - Custom Streamlit server implementation
   - AST transformations for Pyodide compatibility
   - File: `stlite_lib/server/Server.py`
   - File: `stlite_lib/codemod.py` (38KB - complex AST transforms!)

2. **Compiled Streamlit Wheel** (`py/streamlit/lib/dist/`):
   - Pyodide-compiled Streamlit package
   - Bytecode-compiled for faster loading

**Dependencies**:
- `pyodide@0.28.2` - Python runtime
- `@stlite/common` - Shared types
- `path-browserify` - Node path for browsers
- `@jupyterlab/coreutils` - Jupyter utilities

**Development**:
```bash
cd packages/kernel

# Watch mode (hot reload) - RECOMMENDED during active development
yarn start

# Full build
yarn build

# Tests (requires wheels to be built)
yarn test

# Build only Python wheels
cd ../..
make stlite-lib-wheel streamlit-wheel
```

**Important Notes**:
- **Python version MUST match Pyodide**: Currently 3.13.2
- Wheels are bundled into the package via Vite
- Worker files are built separately (not included in main bundle)

---

#### `@stlite/react` (v0.1.0)

**Purpose**: React bindings for Stlite, providing React components for embedding Streamlit apps

**Location**: `packages/react/`

**Key Components**:
- `StliteApp` - Basic Streamlit app wrapper
- `StliteAppWithToast` - App with progress/error notifications
- `createKernel()` - Kernel factory function

**Exports**:
- `/` - Main React components
- `/vite-utils` - Helper utilities for Vite builds
- `/stlite.css` - Component styles
- `/vite-plugin` - Vite plugin for bundling Python wheels

**Build System**:
- Vite library mode for main package
- `tsdown` for vite-plugin (faster than Vite for Node.js targets)

**Dependencies**:
- `react@18.2.0`, `react-dom@18.2.0`
- `@stlite/kernel` - Core runtime
- `react-toastify@11.0.2` - Toast notifications
- `@emotion/styled` - Styled components

**Development**:
```bash
cd packages/react
yarn build
yarn test
```

**Usage Example**:
```typescript
import { StliteAppWithToast } from "@stlite/react";

<StliteAppWithToast
  options={{
    entrypoint: "streamlit_app.py",
    files: {
      "streamlit_app.py": `
import streamlit as st
st.write("Hello from Stlite!")
      `
    }
  }}
/>
```

---

#### `@stlite/browser` (v0.93.1)

**Purpose**: Browser-mountable Stlite API for embedding in web pages (formerly `@stlite/mountable`)

**Location**: `packages/browser/`

**API Methods**:

1. **`mount(options, element)`** - Mount Streamlit app on DOM element
2. **`<streamlit-app>` custom element** - Declarative HTML API

**Key Options** (for `mount()`):
```typescript
{
  entrypoint?: string;          // Main Python file (default: embedded script)
  files?: Record<string, FileContent>;  // Virtual file system
  archives?: Archive[];         // Zip files to unpack
  requirements?: string[];      // Packages to install via micropip
  installs?: InstallSpec[];     // Packages with install options
  streamlitConfig?: Config;     // Streamlit configuration
  idbfsMountpoints?: string[];  // Persistent storage directories
  pyodideUrl?: string;          // Custom Pyodide distribution
  sharedWorker?: boolean;       // Use SharedWorker mode
}
```

**Build Output**: `build/stlite.js`, `build/stlite.css`

**CDN Distribution**:
```html
<!-- Versioned (recommended) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@stlite/browser@0.93.1/build/stlite.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stlite/browser@0.93.1/build/stlite.css" />

<!-- Latest release -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@stlite/browser/build/stlite.js"></script>
```

**Development**:
```bash
cd packages/browser
yarn start  # Dev server at http://localhost:3000

# E2E tests
cd e2e-tests
yarn install
yarn install:browsers
yarn test
```

**E2E Testing** (Playwright):
- Location: `packages/browser/e2e-tests/`
- Test files: `tests/*.test.ts`
- HTML fixtures: `pages/*.html`

---

#### `@stlite/desktop` (v0.91.1)

**Purpose**: Electron-based desktop app packager for Streamlit apps

**Location**: `packages/desktop/`

**Key Features**:
- Convert Streamlit apps to standalone executables (.exe, .app, .AppImage)
- Node.js worker mode for real file system access (NODEFS)
- IDBFS and NODEFS mount points
- Offline Pyodide and wheel bundling

**CLI Tool**: `dump-stlite-desktop-artifacts`
- Extracts Python wheels and Pyodide artifacts for desktop packaging
- Used during app build process

**Build Process**:
```bash
cd packages/desktop

# Development
yarn start
# Runs: prestart → build:pyodide + build:wheels
#       then: start:web + start:electron concurrently

# Production build
yarn build
yarn dump  # Dump artifacts for packaging

# Package as executable
yarn dist
```

**Electron Configuration**:
- Electron version: 34.3.0
- Packager: electron-builder
- Target platforms: Windows, macOS, Linux

**Key Files**:
- `electron/main.ts` - Electron main process
- `electron/preload.ts` - Preload script (context bridge)
- `bin/dump.ts` - Artifact dumper CLI

---

### Supporting Packages

#### `@stlite/sharing` (v0.90.1) - Private

**Purpose**: Stlite Sharing viewer app (https://share.stlite.net/)

**Tech Stack**: Vite + React

**Communication**: Receives app data from `@stlite/sharing-editor` via URL parameters

---

#### `@stlite/sharing-editor` (v0.90.2) - Private

**Purpose**: Stlite Sharing editor app (https://edit.share.stlite.net/)

**Key Features**:
- Monaco editor integration
- Sample apps management (from Streamlit docs)
- URL-based app encoding/decoding (via Protocol Buffers)

**Build Process**:
```bash
cd packages/sharing-editor
yarn build:sampleapps  # Generate sample app manifests
yarn build
```

**Sample Apps**:
- Copied from `streamlit/docs` repository
- Script: `bin/copy-samples.sh`
- Patches: `bin/sample-diffs/` (for Stlite compatibility)

---

#### `@stlite/sharing-common` (v0.90.1) - Private

**Purpose**: Shared code for sharing packages (viewer + editor)

**Key Technologies**:
- Protocol Buffers for data serialization
- Compression utilities (for URL encoding)

**Build**:
```bash
yarn build  # Runs protoc + TypeScript compilation
```

---

#### `@stlite/devutils` (v0.90.0) - Private

**Purpose**: Build system utilities

**Key Function**: `get-streamlit-wheel-file-name`
- Generates Streamlit wheel filenames for Makefile
- CLI: `yarn workspace @stlite/devutils get-streamlit-wheel-file-name [py|cp]`

---

## Testing Strategy

### Unit Testing with Vitest

**Framework**: Vitest 4.0.15 (Vite-native test runner)

**Test File Conventions**:
- `*.test.ts` / `*.test.tsx` - Unit tests
- `*.spec.ts` / `*.spec.tsx` - Specification tests
- Co-located with source files (e.g., `src/kernel.test.ts`)

**Running Tests**:
```bash
# Per-package
cd packages/<package>
yarn test         # Run tests
yarn test:watch   # Watch mode
yarn test:ui      # Vitest UI

# From root with Make
make kernel-test  # Builds dependencies first
```

**Vitest Configuration** (common pattern):
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: "jsdom",  // Browser-like environment
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
    maxConcurrency: 3      // In CI to prevent memory issues
  }
});
```

**Kernel-Specific Test Setup**:
- Environment: `jsdom` (not happy-dom due to iframe issues)
- Setup files: `setupTests.ts`, `@vitest/web-worker`
- Aliases for wheel files (mocked in tests)
- Worker testing: Uses `@vitest/web-worker` for Web Worker mocks

**Test Structure Example**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks
    vi.clearAllMocks();
  });

  it('should do something', async () => {
    // Arrange
    const props = { ... };

    // Act
    render(<Component {...props} />);

    // Assert
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

### E2E Testing with Playwright

**Location**: `packages/browser/e2e-tests/`

**Setup**:
```bash
cd packages/browser/e2e-tests
yarn install
yarn install:browsers  # Install Playwright browsers
```

**Running Tests**:
```bash
yarn test         # Headless mode
yarn test:headed  # With browser UI
yarn test:ui      # Playwright UI mode
```

**Test Structure**:
- `pages/` - HTML fixtures for testing
- `tests/` - Playwright test files
- `playwright.config.ts` - Configuration

**Example Test Files**:
- `custom-element.test.ts` - Tests `<streamlit-app>` tag API
- `env.test.ts` - Environment variable handling
- `mount.test.ts` - Tests `mount()` function API

### Python Testing

**stlite-lib Tests**:
- Framework: `pytest` + `pytest-asyncio`
- Location: `packages/kernel/py/stlite-lib/stlite_lib_tests/`
- Run via: `uv run pytest` (from stlite-lib directory)

**Running Python Tests**:
```bash
cd packages/kernel/py/stlite-lib
uv run pytest
uv run pytest -v  # Verbose
uv run pytest -k test_name  # Run specific test
```

---

## Code Conventions

### Formatting with Prettier

**Configuration**: `.prettierrc` at root

**Settings** (defaults):
- Indentation: 2 spaces
- Semicolons: Yes
- Trailing commas: Yes (ES5)
- Quote style: Auto (context-dependent)
- Line width: 80 characters
- Special: README.md files disable embedded language formatting

**Usage**:
```bash
# Per-package
cd packages/<package>
yarn check:prettier        # Check formatting
yarn fix:prettier          # Auto-fix formatting

# Pre-commit hook
# Automatically runs on staged *.{md,json} files via lint-staged
```

### Linting with ESLint

**Modern Flat Config**: `eslint.config.mjs` (ESLint 9+)

**Standard Configuration**:
```javascript
// eslint.config.mjs
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ]
    }
  }
);
```

**Usage**:
```bash
cd packages/<package>
yarn check:eslint   # Run linter
yarn fix:eslint     # Auto-fix issues
```

### Python Code Quality

**Ruff** (linter + formatter):
```toml
# pyproject.toml
[tool.ruff.lint]
extend-select = ["I"]  # Import sorting
```

**Pyright** (type checker):
```toml
[tool.pyright]
include = ["stlite_lib"]
extraPaths = ["../../../../streamlit/lib"]
```

**Usage**:
```bash
cd packages/kernel/py/stlite-lib
uv run ruff check .
uv run ruff format .
uv run pyright
```

### File Naming Conventions

**TypeScript/JavaScript**:
- Components: PascalCase (e.g., `StliteApp.tsx`)
- Utilities: kebab-case (e.g., `worker-runtime.ts`)
- Types: PascalCase with `.d.ts` extension
- Tests: `*.test.ts`, `*.spec.ts` (co-located with source)
- Config: `*.config.{ts,mjs}` (e.g., `vite.config.ts`)

**Python**:
- Modules: snake_case (e.g., `async_utils.py`)
- Classes: PascalCase (e.g., `Server`)
- Tests: `*_test.py` in `*_tests/` directory

**Special Files**:
- README: `README.md` (per package)
- Changelog: `CHANGELOG.md` (per package)
- TypeScript config: `tsconfig.json`, `tsconfig.src.json`, `tsconfig.test.json`

### Import Conventions

**TypeScript**:
```typescript
// 1. External dependencies
import React from "react";
import { mount } from "@stlite/browser";

// 2. Workspace packages
import { StliteKernel } from "@stlite/kernel";
import type { Options } from "@stlite/common";

// 3. Relative imports
import { helper } from "./utils";
import type { LocalType } from "./types";
```

**Module Resolution**:
- TypeScript: `bundler` mode
- Aliases via `tsconfig.json` `paths` or Vite `resolve.alias`

**Python**:
```python
# 1. Standard library
import asyncio
import sys

# 2. Third-party packages
import pyodide.http

# 3. Local imports
from stlite_lib.server import Server
```

### Spell Checking

**Tool**: cspell 8.19.4

**Configuration**: `cspell.json` at root

**Usage**:
```bash
# From root
yarn cspell

# Add custom words to cspell.json
{
  "words": ["stlite", "pyodide", "micropip"]
}
```

### Commit Conventions

**Conventional Commits** (for Changesets):
- Format: `type(scope): summary`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `fix(browser): handle iframe sizing correctly`

**Changesets** (for versioning):
```bash
# Create a changeset
yarn changeset
# Follow prompts to describe changes

# Release process
yarn new-version            # Interactive version selection
yarn new-version --force-publish  # Force publish without changes
```

**Git Hooks** (Husky):
- Pre-commit: Runs `lint-staged` (Prettier on *.md, *.json)

---

## Common Development Tasks

### Adding a New Dependency

**JavaScript/TypeScript**:
```bash
cd packages/<package>
yarn add <package>           # Production dependency
yarn add -D <package>        # Dev dependency

# Then rebuild
cd ../..
make <package>
```

**Python** (to stlite-lib):
```bash
cd packages/kernel/py/stlite-lib
uv add <package>             # Updates pyproject.toml + uv.lock

# Rebuild wheel
cd ../../../..
make stlite-lib-wheel
```

### Updating Streamlit Version

**Process** (from `DEVELOPMENT.md`):
```bash
cd streamlit

# First time only
git remote add upstream https://github.com/streamlit/streamlit.git

# Fetch latest
git fetch upstream

# Create new stlite branch
NEW_STLITE_BRANCH=stlite-1.45.1
CURRENT_STLITE_BRANCH=stlite-1.44.1
git checkout -b $NEW_STLITE_BRANCH $CURRENT_STLITE_BRANCH

# Rebase onto new Streamlit version
git rebase --onto 1.45.1 1.44.1 $NEW_STLITE_BRANCH

# Test, fix conflicts, commit
cd ..
make clean
make kernel-test
```

### Updating Sample Apps (Sharing Editor)

**Process**:
```bash
# 1. Clone/pull streamlit/docs repository
git clone https://github.com/streamlit/docs.git /tmp/streamlit-docs

# 2. Copy samples
sh ./packages/sharing-editor/bin/copy-samples.sh /tmp/streamlit-docs

# 3. (If needed) Create patches for Stlite compatibility
diff /tmp/streamlit-docs/original_file \
     packages/sharing-editor/public/samples/modified_file \
     > packages/sharing-editor/bin/sample-diffs/modified_file

# 4. Update copy-samples.sh to apply patches

# 5. Rebuild
make sharing-editor
```

### Running Specific Tests

**Unit Tests**:
```bash
# Single package
yarn workspace @stlite/kernel test
yarn workspace @stlite/browser test

# Watch mode
cd packages/kernel
yarn test:watch

# Specific test file
yarn test kernel.test.ts
```

**E2E Tests**:
```bash
cd packages/browser/e2e-tests
yarn test                    # All tests
yarn test custom-element     # Specific test
yarn test:headed             # With browser UI
yarn test:ui                 # Playwright UI mode
```

**Python Tests**:
```bash
cd packages/kernel/py/stlite-lib
uv run pytest
uv run pytest -v -k test_server  # Specific test
```

### Debugging Tips

**TypeScript/JavaScript**:
```typescript
// In source code
console.log('[DEBUG]', variable);

// In tests
import { vi } from 'vitest';
const spy = vi.spyOn(module, 'method');
console.log(spy.mock.calls);
```

**Python (in browser)**:
```python
# In Streamlit app
import streamlit as st
st.write(f"Debug: {variable}")

# In stlite-lib
print(f"[DEBUG] {variable}")  # Appears in browser console
```

**Worker Debugging**:
- Open browser DevTools
- Go to "Sources" tab
- Find worker under "Threads" or "Workers"
- Set breakpoints in worker.ts

### Building for Production

**Full Build**:
```bash
make clean
make all
# Outputs:
#   packages/browser/build/
#   packages/desktop/build/
#   packages/sharing/dist/
#   packages/sharing-editor/dist/
```

**Individual Package Build**:
```bash
cd packages/<package>
yarn build
```

**Bundle Analysis**:
```bash
cd packages/<package>
yarn build
# Open stats.html (generated by rollup-plugin-visualizer)
```

---

## Critical Constraints & Gotchas

### Python Version Constraint

**CRITICAL**: Python version MUST match Pyodide's Python version

- **Current**: Python 3.13.2 (see `.python-version`)
- **Pyodide**: 0.28.2 (includes Python 3.13.2)
- **Check**: Makefile enforces this during `streamlit-wheel` build
- **Why**: Binary compatibility - Pyodide can only load wheels built for its Python version

**Error if mismatched**:
```
Python version mismatch: Pyodide 0.30.7 includes Python 3.13.2, but 3.11.4 is installed
```

**Fix**:
```bash
# Use pyenv or update .python-version
pyenv install 3.13.2
pyenv local 3.13.2

# Or with uv
uv venv --python 3.13.2
```

### Pyodide Package Constraints

**Only Pyodide-compatible packages can be installed**:

1. **Pure Python packages**: Generally work (e.g., `requests`, `pandas`)
2. **Binary extensions**: Must be pre-built for Pyodide (e.g., `numpy`, `scipy`)
3. **Not available**: Packages with C/Rust extensions not built for Wasm

**Check package availability**:
- Pyodide packages: https://pyodide.org/en/stable/usage/packages-in-pyodide.html
- Pure Python wheels: Search on PyPI for `py3-none-any.whl`

**Common issues**:
- `micropip.install("torch")` ❌ - Not available for Pyodide
- `micropip.install("pillow")` ✅ - Included in Pyodide
- `micropip.install("requests")` ✅ - Pure Python (with pyodide-http patches)

### Streamlit Web Module Replacement

**DO NOT import `streamlit.web` in stlite-lib**:
- Tornado cannot run on Pyodide
- Use `stlite_lib.server.Server` instead
- `streamlit.runtime` is safe to use

**File Structure**:
```python
# ❌ Wrong - Tornado dependency
from streamlit.web.server.server import Server

# ✅ Correct - stlite-lib implementation
from stlite_lib.server import Server
```

### Asynchronous Constraints

**`time.sleep()` is NO-OP on Pyodide** - Use `asyncio.sleep()` instead:

```python
import asyncio
import streamlit as st

# ❌ Wrong - Does nothing
import time
time.sleep(1)

# ✅ Correct - Top-level await supported
await asyncio.sleep(1)
st.write("After 1 second")
```

**Why**: Single-threaded JavaScript event loop cannot block

**Top-level await is SUPPORTED** (unlike standard Streamlit):
```python
# This works in Stlite!
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return "data"

result = await fetch_data()  # Top-level await
st.write(result)
```

### Generator Constraints

**Use async generators for `st.write_stream()`**:

```python
# ❌ Wrong - Blocks event loop
def stream():
    for i in range(10):
        yield i
        time.sleep(1)  # No-op!

# ✅ Correct - Non-blocking
async def stream():
    for i in range(10):
        yield i
        await asyncio.sleep(1)

st.write_stream(stream)
```

### File System Constraints

**Default file system is EPHEMERAL (MEMFS)**:
- Files saved to `/` or `/home` are lost on page reload
- Use `idbfsMountpoints` option for persistence:

```typescript
mount({
  idbfsMountpoints: ["/mnt"],  // Persistent storage
  files: {
    "app.py": `
import streamlit as st
with open("/mnt/data.txt", "a") as f:  # Persists across reloads
    f.write("Hello\\n")
    `
  }
});
```

### Worker Constraints

**SharedWorker limitations**:
- Not supported: Chrome Android, Safari (older versions)
- Fallback: Dedicated Worker per app (automatic)
- Shared environment: Python imports, installed packages, file system
- Separate home dirs: `/home/pyodide/<app-id>`

**When to use SharedWorker**:
- Multiple apps on same page (reduces memory)
- Shared data between apps
- Consistent package installations

**When NOT to use**:
- Strong isolation required
- Browser compatibility concerns

### HTTP Request Constraints

**Not all HTTP libraries work**:

✅ **Working**:
- `requests` (with pyodide-http patches)
- `urllib` (with pyodide-http patches)
- `urllib3` (2.2.0+)
- `pyodide.http.pyfetch()` (native Pyodide)

❌ **Not working**:
- `httpx` (async client - partial support)
- `aiohttp` (requires asyncio with full socket support)

**Example**:
```python
# ✅ Correct
import requests
response = requests.get("https://api.example.com/data")

# ✅ Also correct (async)
import pyodide.http
response = await pyodide.http.pyfetch("https://api.example.com/data")
data = await response.json()
```

### Known Streamlit Limitations

1. **`st.spinner()` doesn't work with blocking methods**:
   - Workaround: Add 0.1s sleep before blocking call
   ```python
   with st.spinner("Loading..."):
       await asyncio.sleep(0.1)  # Wait for spinner to show
       blocking_method()
   ```

2. **`st.bokeh_chart()` not supported**:
   - Pyodide uses Bokeh 3.x, Streamlit supports 2.x only
   - Tracked: https://github.com/streamlit/streamlit/issues/5858

3. **DataFrame serialization differences**:
   - Stlite uses Parquet format (not Arrow IPC)
   - Minor differences in how less common data types are handled
   - Ref: https://github.com/whitphx/stlite/pull/601

4. **Package version resolution issues**:
   - micropip's version resolver can fail in some cases
   - Example: `plotly` + `altair` together (fix: `plotly==5.*`)
   - Ref: https://github.com/whitphx/stlite/issues/1302

### Build System Gotchas

**Sentinel files must be touched**:
```makefile
# ✅ Correct - Touch sentinel file
$(common): ...
    cd packages/common && yarn build
    @mkdir -p $(dir $@)
    @touch $@

# ❌ Wrong - Make won't track completion
$(common): ...
    cd packages/common && yarn build
```

**Python wheel path must be exact**:
- Wheel filename includes Python version, platform, etc.
- Use `@stlite/devutils get-streamlit-wheel-file-name` to generate
- Don't hardcode filenames

**Node memory issues**:
- Export `NODE_OPTIONS="--max-old-space-size=6144"` (set in Makefile)
- Especially important during Vite builds

### TypeScript Project References

**Build order matters**:
```bash
# ✅ Correct - Use Make targets
make browser  # Builds common → kernel → react → browser

# ❌ Wrong - May fail if dependencies not built
cd packages/browser && yarn build
```

**Clean builds**:
```bash
# Clean TypeScript build info
yarn tsc -b --clean

# Full clean
make clean
```

---

## Troubleshooting

### Common Build Issues

#### "Python version mismatch"

**Error**:
```
Python version mismatch: Pyodide 0.30.7 includes Python 3.13.2, but 3.11.4 is installed
```

**Fix**:
```bash
# Install correct Python version
pyenv install 3.13.2
pyenv local 3.13.2

# Or with uv
uv python install 3.13.2
uv venv --python 3.13.2
```

#### "Cannot find module '@stlite/common'"

**Cause**: Dependencies not built in correct order

**Fix**:
```bash
make clean
make init
make <target>  # Use Makefile targets, not yarn directly
```

#### "JavaScript heap out of memory"

**Cause**: Node.js default heap size too small

**Fix**:
```bash
export NODE_OPTIONS="--max-old-space-size=6144"
# Already set in Makefile, but may need manual export in some shells
```

#### "git submodule is not initialized"

**Fix**:
```bash
git submodule init
git submodule update
# Or use make
make git_submodules
```

### Common Runtime Issues

#### "Package 'X' not found" in browser

**Cause**: Package not available for Pyodide or needs installation

**Fix**:
```typescript
mount({
  requirements: ["package-name"],  // Install via micropip
  // ...
});
```

**Check availability**: https://pyodide.org/en/stable/usage/packages-in-pyodide.html

#### "time.sleep() doesn't work"

**Cause**: `time.sleep()` is no-op on Pyodide

**Fix**:
```python
import asyncio
await asyncio.sleep(1)  # Use async sleep
```

#### "CORS error when loading files"

**Cause**: Browser security restrictions

**Fix**:
- Serve files from same origin
- Use CORS-enabled server for development
- Or embed files in `files` option:
```typescript
mount({
  files: {
    "data.csv": await fetch("/data.csv").then(r => r.text())
  }
});
```

#### "Worker failed to load"

**Cause**: Worker script not accessible or incorrect path

**Fix**:
- Check browser console for exact error
- Verify worker script is built (check `dist/worker.js`)
- Check Vite config for worker handling

#### "Pyodide initialization timeout"

**Cause**: Slow network or large package downloads

**Fix**:
- Increase timeout in kernel options
- Use custom Pyodide URL (self-hosted)
- Check network tab in DevTools

### Testing Issues

#### "Tests hang indefinitely"

**Cause**: Async operations not properly awaited

**Fix**:
```typescript
// ❌ Wrong
it('should work', () => {
  kernel.run();  // Async but not awaited
});

// ✅ Correct
it('should work', async () => {
  await kernel.run();
});
```

#### "jsdom errors with iframes"

**Cause**: jsdom has issues with iframe handling

**Fix**: Use `jsdom` environment (not `happy-dom`) in `vitest.config.ts`:
```typescript
export default defineConfig({
  test: {
    environment: "jsdom",  // Not happy-dom
  }
});
```

### Development Workflow Issues

#### "Watch mode not detecting changes"

**Fix**:
```bash
# Restart watch mode
cd packages/kernel
yarn start
```

#### "Stale build artifacts"

**Fix**:
```bash
make clean
make init
make <target>
```

#### "Changeset version conflicts"

**Fix**:
```bash
# Reset changesets
rm -rf .changeset/*.md
git checkout .changeset/config.json

# Create new changeset
yarn changeset
```

---

## Additional Resources

### Documentation

- **Main README**: `/README.md` - User-facing documentation
- **Development Guide**: `/DEVELOPMENT.md` - Developer setup and workflows
- **Package READMEs**: `packages/*/README.md` - Per-package documentation
- **Kernel Python README**: `packages/kernel/py/README.md` - stlite-lib architecture

### External Resources

- **Stlite GitHub**: https://github.com/whitphx/stlite
- **Stlite Sharing**: https://edit.share.stlite.net/
- **Pyodide Docs**: https://pyodide.org/en/stable/
- **Streamlit Docs**: https://docs.streamlit.io/

### Community

- **Issues**: https://github.com/whitphx/stlite/issues
- **Discussions**: GitHub Discussions
- **Streamlit Forum**: https://discuss.streamlit.io/

---

## AI Assistant Best Practices

When working on this codebase:

1. **Always check Python version** before building Python wheels
2. **Use Makefile targets** instead of running `yarn build` directly
3. **Read sentinel file comments** in Makefile to understand build strategy
4. **Test with both Dedicated and SharedWorker modes** if modifying kernel
5. **Verify Streamlit fork is up-to-date** when modifying integrations
6. **Check Pyodide compatibility** before adding Python dependencies
7. **Use TypeScript project references** - don't bypass with skipLibCheck
8. **Test in actual browser** (not just jsdom) for worker-related changes
9. **Update CHANGELOG.md** via changesets for user-facing changes
10. **Check bundle size** after adding dependencies (use visualizer plugin)

### When Making Changes

**Before modifying kernel**:
- Understand worker-main thread communication
- Check both dedicated and shared worker code paths
- Test Python wheel loading

**Before modifying Streamlit integration**:
- Check which Streamlit branch is being used
- Understand stlite-lib's role
- Test with multipage apps and various Streamlit features

**Before adding dependencies**:
- Check bundle size impact
- Verify Pyodide compatibility (for Python packages)
- Consider if dependency is needed at runtime or build time

**Before submitting PR**:
- Run full test suite (`make kernel-test`, E2E tests)
- Check TypeScript compilation (`yarn tsc --noEmit`)
- Run linters (`yarn check:eslint`, `yarn check:prettier`)
- Update documentation if API changed
- Create changeset (`yarn changeset`)

---

**End of CLAUDE.md**
