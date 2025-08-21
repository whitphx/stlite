# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.89.0] - 2025-08-21

### General

#### Changed

- Update Pyodide to 0.28.2, [#1574](https://github.com/whitphx/stlite/pull/1574).

## [0.88.1] - 2025-08-19

### `@stlite/browser`

#### Fixed

- Fix custom element styles, [#1569](https://github.com/whitphx/stlite/pull/1569).

## [0.88.0] - 2025-08-19

### `@stlite/kernel`

#### Added

- Add means to install packages with specific configs, [#1551](https://github.com/whitphx/stlite/pull/1551).

### `@stlite/browser`

#### Added

- Add `installs` option on `mount()` and `options` argument on `controller.install()`, [#1551](https://github.com/whitphx/stlite/pull/1551).

## [0.87.0] - 2025-08-14

### General

#### Changed

- Update Streamlit to 1.48.0, [#1565](https://github.com/whitphx/stlite/pull/1565).

## [0.86.0] - 2025-07-20

### `@stlite/kernel`

- Add `complete` field to `CodeCompletion`, [#1553](https://github.com/whitphx/stlite/pull/1553).

### `@stlite/browser`

- Add `complete` field to the return value of `getCodeCompletion`, [#1553](https://github.com/whitphx/stlite/pull/1553).

## [0.85.2] - 2025-07-17

- Fix a bug of the tag-based API that `entrypoint` is not counted when specified with `url`, [1545](https://github.com/whitphx/stlite/pull/1545).

## [0.85.1] - 2025-07-13

### General

#### Fixed

- Fix CI release pipeline.

### `@stlite/kernel`

#### Added

- Add `languageServer` option to make `getCodeCompletion` method available, [#1530](https://github.com/whitphx/stlite/pull/1530), [@andeplane](https://github.com/andeplane).

## [0.85.0] - Skipped

## [0.84.2] - 2025-07-12

### General

#### Fixed

- Fix CI release pipeline.

## [0.84.1] - 2025-07-12

### `@stlite/kernel`

#### Fixed

- Internal refactoring on the worker runtime, [#1518](https://github.com/whitphx/stlite/pull/1518).
- Fix the `reboot` method, [#1519](https://github.com/whitphx/stlite/pull/1519).
- Refactoring the `jedi` initialization, [#1522](https://github.com/whitphx/stlite/pull/1522).

### `@stlite/browser`

#### Added

- Add provenance, [#1528](https://github.com/whitphx/stlite/pull/1528).

### `@stlite/desktop`

#### Added

- Add provenance, [#1528](https://github.com/whitphx/stlite/pull/1528).

### `@stlite/sharing`

#### Fixed

- Fix the "change entrypoint" operation by fixing the kernel `reboot` method, [#1519](https://github.com/whitphx/stlite/pull/1519).

## [0.84.0] - Skipped

## [0.83.1] - 2025-06-26

### General

#### Fixed

- Fix the CSS file name in the README, [#1512](https://github.com/whitphx/stlite/pull/1512).

## [0.83.0] - 2025-06-11

### General

#### Changed

- Update Streamlit to 1.45.1, [#1487](https://github.com/whitphx/stlite/pull/1487).

### `@stlite/kernel`

#### Fixed

- Fix a bug that installing `jedi` and `lsprotocol` fails when setting up the code completion feature, [#1500](https://github.com/whitphx/stlite/pull/1500).

## [0.82.0] - 2025-05-28

### General

#### Changed

- Update Pyodide to 0.27.6, [#1477](https://github.com/whitphx/stlite/pull/1477).

## [0.81.6] - 2025-04-27

### General

#### Changed

- Update Streamlit to 1.44.1, [#1451](https://github.com/whitphx/stlite/pull/1451).

### `@stlite/browser`

#### Changed

- [BREAKING] Rename the CSS file name from `style.css` to `stlite.css` due to Vite v6, [#1451](https://github.com/whitphx/stlite/pull/1451).

#### Fixed

- Fix the `exports` field in `package.json`, [#1462](https://github.com/whitphx/stlite/pull/1462).

## [0.81.5]

Skipped.

## [0.81.4]

Skipped.

## [0.81.3]

Skipped.

## [0.81.2]

Skipped.

## [0.81.1]

Skipped.

## [0.81.0]

Skipped.

## [0.80.5] - 2025-03-24

### `@stlite/kernel`

#### Fixed

- Refactoring the worker, [#1419](https://github.com/whitphx/stlite/pull/1419).

## [0.80.4] - 2025-03-23

### `@stlite/browser`

#### Fixed

- Add a E2E test suite, [#1395](https://github.com/whitphx/stlite/pull/1395).

## [0.80.3] - 2025-03-23

### General

#### Fixed

- Fix a release workflow, [#1421](https://github.com/whitphx/stlite/pull/1421).

## [0.80.2] - 2025-03-20

### `@stlite/browser`, `@stlite/kernel`

#### Fixed

- Fix a bug that the runtime doesn't work in environments where `SharedWorker` is not available even if the `sharedWorker` mode is not enabled, [#1413](https://github.com/whitphx/stlite/pull/1413).

## [0.80.1] - 2025-03-08

### `@stlite/browser`

#### Fixed

- Fix a bug that the worker script is not loaded, [#1394](https://github.com/whitphx/stlite/pull/1394).

## [0.80.0] - 2025-03-05

### `@stlite/browser`

#### Added

- Support to be installed via `npm` with type declarations, [#1388](https://github.com/whitphx/stlite/pull/1388).

## [0.79.6] - 2025-03-02

### General

#### Fixed

- CI/CD pipeline updates.

### `@stlite/desktop`

#### Fixed

- Update README.

## [0.79.5] - 2025-03-02

### General

#### Fixed

- CI/CD pipeline updates.

## [0.79.4] - 2025-03-02

### General

#### Fixed

- Internal package updates.
- CI/CD pipeline updates.

## [0.79.3]

Skipped.

## [0.79.2]

Skipped.

## [0.79.1]

Skipped.

## [0.79.0] - 2025-02-25

### `@stlite/kernel`

#### Added

- `languageServer` option, [#1338](https://github.com/whitphx/stlite/pull/1338) by [@bdimitrijoski](https://github.com/bdimitrijoski).
- Internal package updates.

### General

#### Changed

- The CI/CD pipeline is refactored to work with PRs from external contributors, [#1346](https://github.com/whitphx/stlite/pull/1346).
- Internal package updates.

## [0.78.2] - 2025-02-20

### `@stlite/desktop`

#### Fixed

- Fix a bug of the `dump` command on Windows, [#1336](https://github.com/whitphx/stlite/pull/1336).

## [0.78.1] - 2025-02-19

### `@stlite/kernel`

#### Fixed

- Fix a bug of `st.spinner` which was introduced in v0.74.0 because of the ContextVar-based multi-runtime management, [#1334](https://github.com/whitphx/stlite/pull/1334).
- Dependencies updates.

## [0.78.0] - 2025-02-19

### `@stlite/browser`

#### Added

- `env` option, [#1326](https://github.com/whitphx/stlite/pull/1326), by [@andeplane](https://github.com/andeplane).

## [0.77.0] - 2025-01-28

### General

#### Changed

- Update Pyodide to 0.27.2, [#1300](https://github.com/whitphx/stlite/pull/1300).

## [0.76.3] - 2025-01-28

- Internal refactoring and package updates.

## [0.76.2] - 2025-01-14

### `@stlite/vscode-stlite`

#### Fixed

- Use the new `@stlite/browser` package, [#1270](https://github.com/whitphx/stlite/pull/1270).
- Add `__pycache__` to the default ignore list, [#1270](https://github.com/whitphx/stlite/pull/1270).

## [0.76.1] - 2025-01-12

### `@stlite/browser`

#### Fixed

- Fix the cross-origin worker trick to work on a page loaded via `file://` scheme, [#1258](https://github.com/whitphx/stlite/pull/1258).

## [0.76.0] - 2025-01-11

### General

#### Changed

- Update Streamlit to 1.41.0, [#1199](https://github.com/whitphx/stlite/pull/1199).

### `@stlite/mountable`

#### Changed

- **[BREAKING]** `@stlite/mountable` is renamed to `@stlite/browser`, [#1243](https://github.com/whitphx/stlite/pull/1243). Its API is changed as below.

### `@stlite/browser`

#### Added

- Renamed from `@stlite/mountable`, [#1243](https://github.com/whitphx/stlite/pull/1243).
- **[BREAKING]** It is bundled as an ESM package now. The way of importing the package has been changed as below.

  ```html
  <script type="module">
    import { mount } from "https://cdn.jsdelivr.net/npm/@stlite/browser@0.76.0/build/stlite.js";
    mount(
      `
  import streamlit as st
  
  name = st.text_input('Your name')
  st.write("Hello,", name or "world")
  `,
      document.getElementById("root"),
    );
  </script>
  ```

- Cross-origin worker trick for ESM workers, [#1219](https://github.com/whitphx/stlite/pull/1219).

### `@stlite/desktop`

#### Fix

- Workaround for Electron 32+. [#1231](https://github.com/whitphx/stlite/pull/1231).
- Support Electron 33+, [#1240](https://github.com/whitphx/stlite/pull/1240).

### How to migrate from `@stlite/mountable` to `@stlite/browser`

The points are:

- **Change the way of importing the package** because `@stlite/browser` is now an ESM package.
  - **Delete `<script src="https://.../stlite.js"></script>`.** The script tag loading the Stlite script is no longer needed.
  - Instead, **add `type="module"` to the script tag where you use Stlite** and **import the package in the way like `import * as stlite from "https://.../stlite.js";` inside it**, then you can use `stlite.mount()` as before.
    - `import { mount } from "https://.../stlite.js";` and calling `mount()` directly is also available.
  - Note that the package name is changed from `@stlite/mountable` to `@stlite/browser`, so the **CDN URL is also changed** to `https://cdn.jsdelivr.net/npm/@stlite/browser@<version>/build/stlite.js`.
- **Change the CSS file name** from `stlite.css` to `style.css`.
- The `mount()` API is the same as before.

Here is an example of migrating from `@stlite/mountable` to `@stlite/browser`:

The new way with `@stlite/browser`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Stlite App</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@stlite/browser@0.76.0/build/style.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import * as stlite from "https://cdn.jsdelivr.net/npm/@stlite/browser@0.76.0/build/stlite.js";
      // import { mount } from "https://cdn.jsdelivr.net/npm/@stlite/browser@0.76.0/build/stlite.js";  // This style is also available. In this case, you can call `mount()` directly instead of `stlite.mount()`.
      stlite.mount(
        `
import streamlit as st

name = st.text_input('Your name')
st.write("Hello,", name or "world")
`,
        document.getElementById("root"),
      );
    </script>
  </body>
</html>
```

The previous API with `@stlite/mountable`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Stlite App</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.73.0/build/stlite.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.73.0/build/stlite.js"></script>
    <script>
      stlite.mount(
        `
import streamlit as st

name = st.text_input('Your name')
st.write("Hello,", name or "world")
`,
        document.getElementById("root"),
      );
    </script>
  </body>
</html>
```

## [0.75.0] - 2025-01-05

### `@stlite/mountable`

#### Added

- `sharedWorker` option, [#1207](https://github.com/whitphx/stlite/pull/1207).

## [0.74.0] - 2025-01-05

### `@stlite/kernel`

#### Added

- Experimental SharedWorker mode, [#1193](https://github.com/whitphx/stlite/pull/1193).

## [0.73.1] - 2024-12-21

### `@stlite/kernel`

#### Fixed

- Fix `st.download_button` to work properly with non-ASCII file names, [#1192](https://github.com/whitphx/stlite/pull/1192).

## [0.73.0] - 2024-11-18

### General

#### Changed

- Update Streamlit to 1.40.1, [#1187](https://github.com/whitphx/stlite/pull/1187).

## [0.72.1] - 2024-10-18

### `@stlite/kernel`

#### Added

- Refactoring the module auto loader, [#1176](https://github.com/whitphx/stlite/pull/1176).

## [0.72.0] - 2024-10-17

### `@stlite/kernel`

#### Added

- AST modification from `asyncio.run(awaitable)` to `await awaitable`, [#1175](https://github.com/whitphx/stlite/pull/1175).

## [0.71.0] - 2024-10-18

### `@stlite/mountable`

#### Added

- Custom element syntax, [#1150](https://github.com/whitphx/stlite/pull/1150).

## [0.70.0] - 2024-10-17

### `@stlite/kernel`

#### Fixed

- Update the AST transformer to handle the target function calls in assignments, [#1167](https://github.com/whitphx/stlite/pull/1167).

### `@stlite/desktop`

#### Fixed

- Set the Content Security Policy properly, [#1168](https://github.com/whitphx/stlite/pull/1168).
- Use `protocol.handle` instead of the deprecated method `protocol.registerFileProtocol`, [#1165](https://github.com/whitphx/stlite/pull/1165).
- Update Electron for dev, [#1166](https://github.com/whitphx/stlite/pull/1166).

## [0.69.2] - 2024-10-12

### General

#### Fixed

- Improve the build pipelines.
- Internal package updates.

## [0.69.1] - 2024-10-11

### `@stlite/kernel`

#### Fixed

- Remove `*.pyi` files from the Streamlit wheel, [#1154](https://github.com/whitphx/stlite/pull/1154).

## [0.69.0] - 2024-10-09

### `@stlite/kernel`

#### Added

- Runtime AST transformation to make the functions async that `await` function calls are injected into, [#1148](https://github.com/whitphx/stlite/pull/1148).

### `@stlite/desktop`

#### Added

- Path placeholders for NODEFS mountpoints, [#1147](https://github.com/whitphx/stlite/pull/1147).

## [0.68.0] - 2024-10-06

### `@stlite/mountable`

#### Added

- `readFile()` API, [#1125](https://github.com/whitphx/stlite/pull/1125).

## [0.67.1] - 2024-10-06

### `@stlite/kernel`

#### Fixed

- `st.navigation().run()` works with pages that contain the top-level awaits, [#1145](https://github.com/whitphx/stlite/pull/1145).

## [0.67.0] - 2024-10-04

### General

#### Changed

- Update Streamlit to 1.39.0, [#1143](https://github.com/whitphx/stlite/pull/1143).

### `@stlite/mountable`

#### Fixed

- Fix `CrossOriginWorker` to work on FireFox in the case where the script is loaded from CDN, [#1142](https://github.com/whitphx/stlite/pull/1142).

## [0.66.0] - 2024-09-26

### General

#### Changed

- New Stite and Stlite Sharing logos, [#1130](https://github.com/whitphx/stlite/pull/1130).

## [0.65.1] - 2024-09-17

### `@stlite/kernel`

#### Fixed

- Fix a bug at HTTP server startup that caused an error on Safari, [#1123](https://github.com/whitphx/stlite/pull/1123).

## [0.65.0] - 2024-08-30

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.38.0, [#1101](https://github.com/whitphx/stlite/pull/1101).

## [0.64.2] - 2024-08-28

### `@stlite/kernel`

#### Fixed

- Internal refactoring.

## [0.64.1] - 2024-08-28

### `@stlite/kernel`

#### Fixed

- Internal Streamlit submodule update, [#1090](https://github.com/whitphx/stlite/pull/1090).

## [0.64.0] - 2024-08-27

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.37.1, [#1084](https://github.com/whitphx/stlite/pull/1084).
- Move `pyodide-http` package from `streamlit`'s deps to `stlite-lib`'s, [#1087](https://github.com/whitphx/stlite/pull/1087).

## [0.63.1] - 2024-08-11

### `@stlite/mountable`

#### Added

- Toast color theme adjustment, [#1064](https://github.com/whitphx/stlite/pull/1064).

## [0.63.0] - 2024-08-10

### `@stlite/kernel`

#### Added

- `StliteKernel.reboot()` method, [#1061](https://github.com/whitphx/stlite/pull/1061).

## [0.62.4] - 2024-08-06

### `@stlite/kernel`

#### Changed

- Update Pyodide to 0.26.2, [#1051](https://github.com/whitphx/stlite/pull/1051).

## [0.62.3] - 2024-08-05

### `@stlite/kernel`

#### Changed

- Rename `stlite-server` to `stlite-lib`, [#1047](https://github.com/whitphx/stlite/pull/1047).

## [0.62.2] - 2024-08-04

### `@stlite/kernel`

#### Changed

- Remove the `mountedSitePackagesSnapshotFilePath` option, [#1041](https://github.com/whitphx/stlite/pull/1041).
- Internal package updates.

### `@stlite/desktop`

#### Changed

- Use the `archives` option instead of `mountedSitePackagesSnapshotFilePath`, [#1041](https://github.com/whitphx/stlite/pull/1041).

## [0.62.1] - 2024-08-02

### `@stlite/kernel`

#### Added

- Use `tomllib` for config parsing, [#1037](https://github.com/whitphx/stlite/pull/1037).

## [0.62.0]

Skipped due to GitHub Actions issue.

## [0.61.0] - 2024-07-30

### `@stlite/kernel`

#### Added

- Runtime AST transformation to convert `time.sleep()` to `await asyncio.sleep()`, [#1021](https://github.com/whitphx/stlite/pull/1021).

## [0.60.3] - 2024-07-26

### `@stlite/kernel`

#### Fixed

- Fix HTTP header parser, [#1027](https://github.com/whitphx/stlite/pull/1027).
- Introduce Pyright, [#1031](https://github.com/whitphx/stlite/pull/1031).
- Internal package updates.

## [0.60.2] - 2024-06-27

### `@stlite/kernel`

#### Fixed

- Fix the Parquet serialization to deal with non-string column names, [#1000](https://github.com/whitphx/stlite/pull/1000).

## [0.60.1] - 2024-06-27

### `@stlite/kernel`

#### Fixed

- Replace deprecated Pandas APIs in the arrow serialization process, [#996](https://github.com/whitphx/stlite/pull/996).

## [0.60.0] - 2024-06-26

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.36.0, [#993](https://github.com/whitphx/stlite/pull/993).

## [0.59.0] - 2024-06-25

### `@stlite/mountable`

#### Changed

- Throw an error if the `entrypoint` option is not provided, instead of using the default value, [#991](https://github.com/whitphx/stlite/pull/991).

## [0.58.7] - 2024-06-25

### `@stlite/kernel`

#### Changed

- Update Pyodide to 0.26.1, [#987](https://github.com/whitphx/stlite/pull/987).

## [0.58.6] - 2024-06-17

### `@stlite/kernel`

#### Fixed

- Fix a bug at patching `st.write_stream()` which was introduced in 0.58.4, [#981](https://github.com/whitphx/stlite/pull/981).

## [0.58.5] - 2024-06-14

### `@stlite/kernel`

#### Fixed

- Work around Parquet serialization by `fastparquet` so that data frames including NumPy arrays or datetime values can be serialized, [#975](https://github.com/whitphx/stlite/pull/975).

## [0.58.4] - 2024-06-14

### `@stlite/kernel`

#### Fixed

- `st.write_stream()` is made async and normal function calls of it are automatically converted to be awaited under the hood, [#965](https://github.com/whitphx/stlite/pull/965).

### `@stlite/desktop`

#### Fixed

- Fix IPC sender check to fix a bug that paginations from sub pages do not work in the NodeJS worker mode, [#972](https://github.com/whitphx/stlite/pull/972).

## [0.58.3] - 2024-06-12

### `@stlite/kernel`

#### Fixed

- Update of the internal Streamlit wheel, [#964](https://github.com/whitphx/stlite/pull/964).

## [0.58.2] - 2024-06-11

### `@stlite/kernel`

#### Fixed

Module auto-load only finds module-level modules, [#961](https://github.com/whitphx/stlite/pull/961).

## [0.58.1] - 2024-06-11

### `@stlite/desktop`

#### Fixed

- Fixed a bug in the NodeJS worker mode on Windows, [#959](https://github.com/whitphx/stlite/pull/959).

## [0.58.0] - 2024-06-06

### `@stlite/kernel`

#### Added

- Experimentally added the `moduleAutoLoad` option, [#902](https://github.com/whitphx/stlite/pull/902).

## [0.57.0] - 2024-05-30

### `@stlite/desktop`

#### Added

- `--pyodide-source` option to use a different Pyodide package than the default CDN to fetch the prebuilt package wheels, [#937](https://github.com/whitphx/stlite/pull/937).

## [0.56.0] - 2024-05-29

### `@stlite/kernel`

#### Changed

- Update Pyodide to 0.26.0, [#934](https://github.com/whitphx/stlite/pull/934).

## [0.55.1] - 2024-05-28

### `@stlite/kernel`

#### Fixed

- Fix `st.logo()` to work, [#933](https://github.com/whitphx/stlite/pull/933).

## [0.55.0] - 2024-05-26

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.35.0, [#920](https://github.com/whitphx/stlite/pull/920).

## [0.54.2] - 2024-05-02

### `@stlite/desktop`

#### Fixed

- Prettify the CLI log output of the `dump` command, [#890](https://github.com/whitphx/stlite/pull/890).

## [0.54.1] - 2024-04-29

### `@stlite/desktop`

#### Fixed

- Update the sample `package.json` in the README, [`38b1227`](https://github.com/whitphx/stlite/commit/38b12278649d2c8571f45a467f8e846e2dc1dbf9).

## [0.54.0] - 2024-04-29

### `@stlite/desktop`

#### Changed

- [DEPRECATED] The app files to be bundled, the entrypoint, and the dependencies are now specified in the `package.json` file, and the command line arguments of the `dump` commands for that purpose are deprecated, [#878](https://github.com/whitphx/stlite/pull/878).
- A new `--project` option is added to the `dump` command to specify the project directory, [#878](https://github.com/whitphx/stlite/pull/878).

## [0.53.2] - 2024-04-29

### `@stlite/kernel`

#### Fixed

- Internal refactoring: use the `Headers` class to parse the response headers of the emulated HTTP requests, [#888](https://github.com/whitphx/stlite/pull/888).

## [0.53.1] - 2024-04-29

### `@stlite/kernel`

#### Changed

- Update Pyodide to 0.25.1, [#889](https://github.com/whitphx/stlite/pull/889).

## [0.53.0] - 2024-04-28

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.33.0, [#885](https://github.com/whitphx/stlite/pull/885).

## [0.52.5] - 2024-04-28

### `@stlite/kernel`

#### Fixed

- Internal updates around `ConnectionManager`, [#846](https://github.com/whitphx/stlite/pull/846).

## [0.52.4] - 2024-04-16

### `@stlite/desktop`

#### Fixed

- Add "repository.directory" field in `package.json`, [#871](https://github.com/whitphx/stlite/pull/871).

## [0.52.3] - 2024-04-16

### `@stlite/desktop`

#### Fixed

- Add "repository" and "bugs" field in `package.json`, [#870](https://github.com/whitphx/stlite/pull/870).

## [0.52.2] - 2024-04-04

### `@stlite/desktop`

#### Fixed

- Add a README banner, [#865](https://github.com/whitphx/stlite/pull/865).

## [0.52.1] - 2024-04-04

### `@stlite/desktop`

#### Fixed

- Fix a bug at the `nodefsMountpoints` parser, [#852](https://github.com/whitphx/stlite/pull/852).

## [0.52.0] - 2024-04-04

### `@stlite/kernel`

#### Changed

- `streamlit` requirement is allowed but ignored, [#849](https://github.com/whitphx/stlite/pull/849).

## [0.51.5] - 2024-04-04

### `@stlite/kernel`

#### Fixed

- Internal update, [#842](https://github.com/whitphx/stlite/pull/842).

## [0.51.4] - 2024-04-03

### `@stlite/kernel`

#### Fixed

- Fix a bug at `matplotlib` installation, [#841](https://github.com/whitphx/stlite/pull/841).
- Some refactoring.

## [0.51.3] - 2024-04-03

### `@stlite/desktop`

#### Fixed

- Fix the installation of prebuilt packages, [#833](https://github.com/whitphx/stlite/pull/833).

## [0.51.2] - 2024-04-03

### `@stlite/desktop`

#### Fixed

- Fix the type validation on the `dump` command, [#817](https://github.com/whitphx/stlite/pull/817).
- Update README about the file system, [#830](https://github.com/whitphx/stlite/pull/830).

## [0.51.1] - 2024-04-02

### `@stlite/desktop`

#### Fixed

- Fix `nodefsMountpoints` parser, [#817](https://github.com/whitphx/stlite/pull/817).

## [0.51.0] - 2024-03-30

### `@stlite/desktop`

#### Added

- Support `NODEFS` to mount directories on the host OS file system to directories on the virtual file system, [#812](https://github.com/whitphx/stlite/pull/812).

## [0.50.0] - 2024-03-29

### `@stlite/kernel`, `@stlite/mountable`, `@stlite/desktop`

#### Added

- Support IndexedDB-backed file system, `IDBFS`, for data persistence, [#815](https://github.com/whitphx/stlite/pull/815).

## [0.49.4] - 2024-03-29

### `@stlite/desktop`

#### Fixed

- Build config [#813](https://github.com/whitphx/stlite/pull/813).

## [0.49.3] - 2024-03-27

### `@stlite/desktop`

#### Fixed

- Bundle and minify the Electron app files, [#810](https://github.com/whitphx/stlite/pull/810).

## [0.49.2] - 2024-03-24

Internal updates. See the release page for details.

## [0.49.1] - 2024-03-22

### `@stlite/desktop`

#### Fixed

- Catch errors during loading packages, [#798](https://github.com/whitphx/stlite/pull/798).

## [0.49.0] - 2024-03-21

### `@stlite/kernel`

#### Changed

- Update Pyodide to 0.25.0, [#794](https://github.com/whitphx/stlite/pull/794).

### `@stlite/desktop`

#### Fixed

- The dump command adapted to Pyodide 0.25.0, [#794](https://github.com/whitphx/stlite/pull/794).

## [0.48.3] - 2024-03-21

### `@stlite/desktop`

#### Fixed

- Add the E2E test job to the CI workflow, [#795](https://github.com/whitphx/stlite/pull/795).

## [0.48.2]

Skipped.

## [0.48.1]

Skipped.

## [0.48.0] - 2024-03-15

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.32.2, [#783](https://github.com/whitphx/stlite/pull/783).
  - This update includes lazy-imports of some dependencies, which reduces the initial loading time.

## [0.47.2] - 2024-03-15

### `@stlite/kernel`

#### Fixed

- Logger settings, [#786](https://github.com/whitphx/stlite/pull/786).

## [0.47.1] - 2024-03-14

### `@stlite/kernel`

#### Fixed

- Cache the worker blob in a cross-origin situation, [#778](https://github.com/whitphx/stlite/pull/778).

## [0.47.0] - 2024-02-11

### `@stlite/kernel`

#### Changed

- Stop publishing `@stlite/kernel` to NPM, [#743](https://github.com/whitphx/stlite/pull/743).

## [0.46.1] - 2024-02-11

### `@stlite/kernel`

#### Fixed

- Restore the `pyodide-http` patch which was removed in 0.45.1, [#742](https://github.com/whitphx/stlite/pull/742) and [#738](https://github.com/whitphx/stlite/pull/738), which was released once as 0.45.3 but not effective.

## [0.46.0] - 2024-02-11

### `@stlite/desktop`

#### Changed

- Update Streamlit to 1.31.0, [#741](https://github.com/whitphx/stlite/pull/741)

## [0.45.5] - 2024-02-11

### `@stlite/desktop`

#### Fixed

- Ship the stlite wheels along with the `desktop` package instead of loading them fron the hosted `kernel` package, [#722](https://github.com/whitphx/stlite/pull/722).

## [0.45.4] - 2024-02-11

### `@stlite/common`

#### Fixed

- `requirements.txt` parser to ignore comments, [#739](https://github.com/whitphx/stlite/pull/739).

## [0.45.3] - 2024-02-11

### `@stlite/kernel`

#### Fixed

- Restore the `pyodide-http` patch which was removed in 0.45.1, [#738](https://github.com/whitphx/stlite/pull/738).

## [0.45.2] - 2024-02-08

### `@stlite/*`

#### Fixed

- Internal package updates.

## [0.45.1] - 2024-02-07

### `@stlite/kernel`

#### Fixed

- Remove the HTTP patch because [`urllib3` started to support Pyodide since 2.2.0](https://urllib3.readthedocs.io/en/stable/reference/contrib/emscripten.html), [#689](https://github.com/whitphx/stlite/pull/689).

## [0.45.0] - 2024-01-20

### `@stlite/kernel`

#### Changed

- Update Pyodide to 0.24.1, [#681](https://github.com/whitphx/stlite/pull/681).

## [0.44.0] - 2024-01-20

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.30.0, [#678](https://github.com/whitphx/stlite/pull/678)

## [0.43.1] - 2024-01-19

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.27.0, [#671](https://github.com/whitphx/stlite/pull/671)

### `@stlite/mountable`

#### Added

- `disableProgressToasts` and `disableErrorToasts` options, [#671](https://github.com/whitphx/stlite/pull/671)

#### Changed

- Remove `ctx.disableToast()` and `ctx.enableToast()`, [#671](https://github.com/whitphx/stlite/pull/671)

## [0.43.0]

Skipped

## [0.42.5] - 2024-01-19

### `@stlite/kernel`

#### Fixed

- Install the user-specified requirements and the stlite custom wheels at the same time, [#676](https://github.com/whitphx/stlite/pull/676).

## [0.42.4] - 2023-12-27

### `@stlite/kernel`

#### Fixed

- Set the `altair` version to `<5.2.0` as a workaround to solve an error of [#662](https://github.com/whitphx/stlite/issues/662), [#668](https://github.com/whitphx/stlite/pull/668).
- Install the user-specified requirements before the Streamlit package, [#664](https://github.com/whitphx/stlite/pull/664).
- Fix `DEVELOPMENT.md`, [#665](https://github.com/whitphx/stlite/pull/665), by @andeplane.

### `@stlite/desktop`

#### Fixed

- Fix the CSP for `st.camera_input()`, [#666](https://github.com/whitphx/stlite/pull/666).

## [0.42.3] - 2023-11-01

### `@stlite/kernel`

#### Fixed

- Use internal implementation of `PromiseDelegate`, [#646](https://github.com/whitphx/stlite/pull/646).

## [0.42.2] - 2023-10-10

### `@stlite/kernel`

#### Fixed

- Error object serialization for inter-thread communication, [#641](https://github.com/whitphx/stlite/pull/641).

## [0.42.1] - 2023-10-09

### `@stlite/kernel`

#### Fixed

- Send error objects from a worker thread to the main thread properly, [#638](https://github.com/whitphx/stlite/pull/638).

## [0.42.0] - 2023-10-08

### `@stlite/mountable`

#### Added

- `.disableToast()` and `.enableToast()`, [#636](https://github.com/whitphx/stlite/pull/636).

#### Changed

- Revert `onError`, [#635](https://github.com/whitphx/stlite/pull/635).

## [0.41.0] - 2023-10-07

### `@stlite/mountable`

#### Added

- Add `onError` option, [#632](https://github.com/whitphx/stlite/pull/632).

## [0.40.0] - 2023-10-04

### `@stlite/mountable`

#### Added

- Add `streamlitConfig` option, [#625](https://github.com/whitphx/stlite/pull/625).

## [0.39.0] - 2023-09-28

### `@stlite/mountable`

#### Added

- Add `pyodideUrl` option, [#620](https://github.com/whitphx/stlite/pull/620).

## [0.38.1] - 2023-09-28

### `@stlite/desktop`

#### Fixed

- Fix the dumped manifest file path, [#618](https://github.com/whitphx/stlite/pull/618).

## [0.38.0] - 2023-08-24

### `@stlite/kernel`

#### Changed

- Switch the data frame serialization method to the standard option of Streamlit by bypassing Arrow serialization using Parquet, with huge support by @LukasMasuch, [#601](https://github.com/whitphx/stlite/pull/601), [whitphx/streamlit#3](https://github.com/whitphx/streamlit/pull/3).

## [0.37.0] - 2023-07-23

### `@stlite/kernel`

#### Changed

- Compile the Streamlit wheel file to bytecode at build time, [#590](https://github.com/whitphx/stlite/pull/590).

## [0.36.0] - 2023-07-03

### `@stlite/desktop`

#### Added

- A custom `package.json` field `stlite.embed` has been added to control the embed mode, [#585](https://github.com/whitphx/stlite/pull/585).

## [0.35.1] - 2023-07-03

### `@stlite/desktop`

#### Fixed

- Unregister an ipc handler, [#584](https://github.com/whitphx/stlite/pull/584).

## [0.35.0] - 2023-06-30

### `@stlite/kernel`

- Update Pyodide to 0.23.3, [#581](https://github.com/whitphx/stlite/pull/581).

## [0.34.0] - 2023-06-28

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.24.0, [#574](https://github.com/whitphx/stlite/pull/574), [#575](https://github.com/whitphx/stlite/pull/575).

## [0.33.0] - 2023-06-26

### `@stlite/desktop`

#### Fixed

- Package the Pyodide built-in package wheels in the app executables and load them at runtime, [#572](https://github.com/whitphx/stlite/pull/572).

## [0.32.0] - 2023-06-15

### `@stlite/mountable`

#### Added

- An `archives` option to download, unpack, and mount files, [#567](https://github.com/whitphx/stlite/pull/567).

## [0.31.0] - 2023-04-13

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.21.0, [#550](https://github.com/whitphx/stlite/pull/550).

## [0.30.2] - 2023-04-12

### `@stlite/vscode-stlite`

#### Fixed

- Open the preview in a split panel, [#549](https://github.com/whitphx/stlite/pull/549).

## [0.30.1] - 2023-04-12

### `@stlite/vscode-stlite`

#### Fixed

Fix an error about event handler registrations on mac, [#548](https://github.com/whitphx/stlite/pull/548).

## [0.30.0] - 2023-04-12

### `@stlite/vscode-stlite`

#### Added

- Add configs to set the target and ignored files, [#543](https://github.com/whitphx/stlite/pull/543).
- Sort the entrypoint file candidate list, [#547](https://github.com/whitphx/stlite/pull/547).

## [0.29.15] - 2023-03-29

### `@stlite/vscode-stlite`

#### Fixed

- Remove the `extensionKind` field for the extension to work on VSCode Desktop, [#542](https://github.com/whitphx/stlite/pull/542).

## [0.29.14] - 2023-03-27

### `@stlite/vscode-stlite`

#### Fixed

- Fix the release flow.

## [0.29.13] - 2023-03-27

### `@stlite/vscode-stlite`

#### Fixed

- Update README fixing the image path.

## [0.29.12] - 2023-03-27

### `@stlite/vscode-stlite`

#### Fixed

- Update README adding a screenshot image.

## [0.29.11] - 2023-03-26

### `@stlite/vscode-stlite`

#### Fixed

- Update README.

## [0.29.10] - 2023-03-24

### `@stlite/vscode-stlite`

#### Changed

- Add `extensionKind` field, [#534](https://github.com/whitphx/stlite/pull/534).
- Fix the release workflow so that the VSC extension is released after `@stlite/mountable`, [#535](https://github.com/whitphx/stlite/pull/535).

## [0.29.9] - 2023-03-24

### `@stlite/vscode-stlite`

#### Changed

- Set keywords, [#533](https://github.com/whitphx/stlite/pull/533).

## [0.29.8] - 2023-03-24

### `@stlite/vscode-stlite`

#### Fixed

- Release workflow, [#532](https://github.com/whitphx/stlite/pull/532).

## [0.29.7] - 2023-03-24

### `@stlite/vscode-stlite`

#### Changed

- Fill metadata for the VSCode extension, [#530](https://github.com/whitphx/stlite/pull/530)

## [0.29.6] - 2023-03-24

### `@stlite/vscode-stlite`

#### Changed

- Rename the VSCode command, [#528](https://github.com/whitphx/stlite/pull/528).

## [0.29.5] - 2023-03-23

### `@stlite/vscode-stlite`

#### Fixed

- Avoid duplicated callback registrations, [#526](https://github.com/whitphx/stlite/pull/526).
- Show the preview panel in the active column, [#527](https://github.com/whitphx/stlite/pull/527).

## [0.29.4] - 2023-03-23

### `@stlite/mountable`

#### Fixed

- Show toasts upon kernel method calls, [#523](https://github.com/whitphx/stlite/pull/523).

## [0.29.3] - 2023-03-23

### `@stlite/vscode-stlite`

#### Fixed

- Suppress unnecessary tab creations when clicking page links on MPA, [#520](https://github.com/whitphx/stlite/pull/520).

## [0.29.2] - 2023-03-23

### `@stlite/vscode-stlite`

#### Added

- Create a VSCode extension, [#513](https://github.com/whitphx/stlite/pull/513).

## [0.29.1] - 2023-03-20

### `@stlite/kernel`

#### Fixed

- Support `st.spinner()` with async functions, [#515](https://github.com/whitphx/stlite/pull/515).

## [0.29.0] - 2023-03-19

### `@stlite/kernel`

#### Changed

- Support top-level await, [#514](https://github.com/whitphx/stlite/pull/514).

## [0.28.0] - 2023-03-10

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.19.0, [#507](https://github.com/whitphx/stlite/pull/507).

## [0.27.3] - 2023-03-05

### `@stlite/desktop`

#### Fixed

- Fix the sample `package.json` in `desktop/README.md`, [#502](https://github.com/whitphx/stlite/pull/502).

### `@stlite/kernel`

#### Fixed

- Disable `ForwardMsg` caching, [#505](https://github.com/whitphx/stlite/pull/505).

## [0.27.2] - 2023-03-01

### `@stlite/kernel`

#### Fixed

- Stop using a wheel file to mock `pyarrow` package, [#497](https://github.com/whitphx/stlite/pull/497), [#499](https://github.com/whitphx/stlite/pull/499).

## [0.27.1] - 2023-03-01

### `@stlite/kernel`

#### Fixed

- `matplotlib` installation, [#496](https://github.com/whitphx/stlite/pull/496).

### `@stlite/desktop`

#### Fixed

- Update Electron to 23.1.1, [#498](https://github.com/whitphx/stlite/pull/498).

## [0.27.0] - 2023-02-24

### `@stlite/kernel`

#### Changed

- Remove Tornado and introduce an original server implementation, [#492](https://github.com/whitphx/stlite/pull/492).

## [0.26.0] - 2023-02-17

### `@stlite/kernel`

#### Changed

- Update Streamlit to 1.18.1, [#482](https://github.com/whitphx/stlite/pull/482).

## [0.25.0] - 2023-02-17

### `@stlite/desktop`

#### Changed

- Set the package versions dynamically based on the jsDelivr API response at build time, [#480](https://github.com/whitphx/stlite/pull/480).

## [0.24.0] - 2023-02-11

### `@stlite/kernel`

#### Changed

- Update Pyodide to 0.22.1, [#478](https://github.com/whitphx/stlite/pull/478).

## [0.23.0] - 2023-02-07

### `@stlite/kernel`

#### Changed

- Update the base Streamlit version to 1.17.0, [#472](https://github.com/whitphx/stlite/pull/472).

## [0.22.2] - 2023-01-21

### `@stlite/desktop`

#### Fixed

- Handling file path separators on Windows, [#466](https://github.com/whitphx/stlite/pull/466).

## [0.22.1] - 2022-12-19

### `@stlite/desktop`

#### Fixed

- Fix the depending Electron version so that the packaging command works, [#452](https://github.com/whitphx/stlite/pull/452).

## [0.22.0] - 2022-12-19

### `@stlite/desktop`, `@stlite/mountable`

#### Added

- Show the booting-up progress on toasts, [#446](https://github.com/whitphx/stlite/pull/446).

## [0.21.3] - 2022-12-16

### `@stlite/desktop`

#### Fixed

- Apply Electron security best practices, [#445](https://github.com/whitphx/stlite/pull/445).

## [0.21.2] - 2022-12-15

### `@stlite/desktop`, `@stlite/desktop-cli`

#### Fixed

- Update README to announce that `@stlite/desktop` should be used instead of `@stlite/desktop-cli`, [#444](https://github.com/whitphx/stlite/pull/444).

## [0.21.1] - 2022-12-15

### `@stlite/desktop`

#### Fixed

- Delete source maps, [#443](https://github.com/whitphx/stlite/pull/443).

## [0.21.0] - 2022-12-15

### `@stlite/desktop`

#### Changed

- Update the dependencies list, [#439](https://github.com/whitphx/stlite/pull/439) and [#442](https://github.com/whitphx/stlite/pull/442).

## [0.20.0] - 2022-12-15

### `@stlite/desktop`, `@stlite/desktop-cli`

#### Changed

- Update the kernel version loaded for desktop apps to v0.19.1, [#434](https://github.com/whitphx/stlite/pull/434).

### `@stlite/kernel`

#### Fixed

- Better logs at the booting-up phase, [#437](https://github.com/whitphx/stlite/pull/437).

## [0.19.1] - 2022-12-14

### `@stlite/sharing-editor`, `@stlite/desktop`, `@stlite/desktop-cli`

#### Fixed

- Lines starting with `#` in `requirements.txt` are ignored as comments, [#432](https://github.com/whitphx/stlite/pull/432).

### `@stlite/desktop-cli`

#### Fixed

- Update the README, [#429](https://github.com/whitphx/stlite/pull/429).

## [0.18.2] - 2022-12-05

### `@stlite/desktop`, `@stlite/desktop-cli`

#### Fixed

- Content-Security-Policy has been updated, [#424](https://github.com/whitphx/stlite/pull/424).

## [0.18.1] - 2022-12-05

### `@stlite/desktop`, `@stlite/desktop-cli`

#### Fixed

- The bug fix of [#414](https://github.com/whitphx/stlite/pull/414) that had not been effective became working, [#420](https://github.com/whitphx/stlite/pull/420).

## [0.18.0] - 2022-12-05

### `@stlite/desktop`, `@stlite/desktop-cli`

#### Changed

- `bin/dump_artifacts.ts` overwrites the `build` directory by default and keep it only when `keepOldBuild` option is specified, [#417](https://github.com/whitphx/stlite/pull/417).

## [0.17.0] - 2022-12-05

### `@stlite/desktop`, `@stlite/desktop-cli`

#### Changed

- `bin/dump_artifacts.ts` crashes when the specified `requirements.txt` does not exist, [#410](https://github.com/whitphx/stlite/pull/410).
- `bin/dump_artifacts.ts` deletes the existing `streamlit_app` directory inside the `build` directory before copying the new one, [#415](https://github.com/whitphx/stlite/pull/415).

#### Fixed

- Content-Security-Policy has been updated to allow components to load arbitrary external resources, [#408](https://github.com/whitphx/stlite/pull/408).
- The bug has been fixed that some resources such as the lazy-loaded component chunks are not properly loaded on the desktop app, [#414](https://github.com/whitphx/stlite/pull/414).

## [0.16.1] - 2022-11-10

### `@stlite/desktop`, `@stlite/desktop-cli`

#### Added

- Package name verification at the dump command, [#398](https://github.com/whitphx/stlite/pull/398).

#### Fixed

- README.md, [#399](https://github.com/whitphx/stlite/pull/399).

## [0.16.0] - 2022-11-10

### `@stlite/desktop`, `@stlite/desktop-cli`

#### Changed

- The command signature of `bin/dump_artifacts.ts` is changed so that the package names are passed as the positional arguments following the source directory name and the `-r` option is used to specify the `requirements.txt`, [#396](https://github.com/whitphx/stlite/pull/396).

## [0.15.0] - 2022-11-08

### `@stlite/kernel`, `@stlite/mountable`

#### Changed

- The `command` option has been removed, [#393](https://github.com/whitphx/stlite/pull/393).

## [0.14.2] - 2022-10-21

### `@stlite/desktop-cli`

#### Fixed

- Fix README, [#336](https://github.com/whitphx/stlite/pull/336), by @chrieke.

## [0.14.0] - 2022-10-16

### `@stlite/kernel`

#### Changed

- Check the wheel URL schemes when installing packages to block local file access, [#352](https://github.com/whitphx/stlite/pull/352).

## [0.13.0] - 2022-10-11

### `@stlite/kernel`

#### Changed

- Upgrade Pyodide to 0.21.3, [#341](https://github.com/whitphx/stlite/pull/341).
- Mock `st.spinner()` as a no-op context manager, [#342](https://github.com/whitphx/stlite/pull/342).

## [0.12.2] - 2022-10-11

### `@stlite/desktop-cli`

#### Fixed

- Fix README, [#338](https://github.com/whitphx/stlite/pull/338).

## [0.12.1] - 2022-10-07

### `@stlite/desktop-cli`

#### Fixed

- Update README explaining the flow to package a Streamlit app into an Electron app, [#334](https://github.com/whitphx/stlite/pull/334).

## [0.12.0] - 2022-10-06

### `@stlite/desktop-cli`

- Release `@stlite/desktop-cli`, a wrapper package of `@stlite/desktop` for the CLI usage, [#330](https://github.com/whitphx/stlite/pull/330).

#### Fixed

## [0.11.0] - 2022-10-06

### `@stlite/desktop`

#### Fixed

- Fix README.md, [#327](https://github.com/whitphx/stlite/pull/327).
- Set up `.npmignore`, [#328](https://github.com/whitphx/stlite/pull/328).

## [0.10.2] - 2022-10-05

### `@stlite/kernel`

#### Fixed

- Avoid loading `micropip` if restoring a site-packages snapshot, [#316](https://github.com/whitphx/stlite/pull/316).

### `@stlite/mountable`

#### Fixed

- Fix the build rule, [#319](https://github.com/whitphx/stlite/pull/319).

## [0.10.1] - 2022-10-02

Same as v0.10.0.

## [0.10.0] - 2022-10-02

### `@stlite/kernel`

#### Added

- Rename `@stlite/stlite-kernel` to `@stlite/kernel`, [#305](https://github.com/whitphx/stlite/pull/305).
- Publish the `@stlite/kernel` NPM package, [#310](https://github.com/whitphx/stlite/pull/310).

## [0.9.0] - 2022-10-02

### `@stlite/stlite-kernel`

- Upgrade Streamlit to v1.13.0, [#307](https://github.com/whitphx/stlite/pull/307).

## [0.8.0] - 2022-10-01

### `@stlite/stlite-kernel`

#### Added

- Add options `pyodideEntrypointUrl` and `mountedSitePackagesSnapshotFilePath`, [#295](https://github.com/whitphx/stlite/pull/295).

#### Fixed

- Fix the wrong error messages, [#300](https://github.com/whitphx/stlite/pull/300).

### `@stlite/desktop`

#### Added

- Created `@stlite/desktop`, [#295](https://github.com/whitphx/stlite/pull/295).

## [0.7.1] - 2022-09-26

### `@stlite/stlite-kernel`

#### Fixed

- Refactoring, [#292](https://github.com/whitphx/stlite/pull/292), [#293](https://github.com/whitphx/stlite/pull/293), [#294](https://github.com/whitphx/stlite/pull/294).

## [0.7.0] - 2022-09-26

### `@stlite/stlite-kernel`

#### Fixed

- Patch the Matplotlib backend after installing it at runtime, [#261](https://github.com/whitphx/stlite/pull/261).
- Implement the message cache and the message queue, [#290](https://github.com/whitphx/stlite/pull/290).

## [0.6.0] - 2022-09-01

### `@stlite/stlite-kernel`

#### Changed

- Use a customized bootstrapping function to avoid unnecessary network access and to be more efficient, [#181](https://github.com/whitphx/stlite/pull/181).

#### Added

- Detailed logs, [#182](https://github.com/whitphx/stlite/pull/182).
- `onProgress` and `onLoad` callbacks, [#189](https://github.com/whitphx/stlite/pull/189).

### `@stlite/playground`

#### Added

- Show the progress of the booting-up process, [#189](https://github.com/whitphx/stlite/pull/189).
- More demo pages, [#190](https://github.com/whitphx/stlite/pull/190).

## [0.5.0] - 2022-08-30

### `@stlite/mountable`

#### Fixed

- Remove the trailing slash from the dynamically pushed URLs, [#179](https://github.com/whitphx/stlite/pull/179).

## [0.4.0] - 2022-08-30

### `@stlite/mountable`

#### Fixed

- History management in MPA, [#172](https://github.com/whitphx/stlite/pull/172)
- Custom components support in MPA, [#176](https://github.com/whitphx/stlite/pull/176).

### The playground app

#### Added

- Multi-page demo, [#170](https://github.com/whitphx/stlite/pull/170) and [#173](https://github.com/whitphx/stlite/pull/173).
- PWA cache update notification, [#177](https://github.com/whitphx/stlite/pull/177).

## [0.3.0] - 2022-08-28

### `@stlite/mountable`

#### Changed

- Rename `main.css` to `stlite.css`, [#169](https://github.com/whitphx/stlite/pull/169).

## [0.2.0] - 2022-08-28

### `@stlite/mountable`

#### Fixed

- Exported `main.css`, [#167](https://github.com/whitphx/stlite/pull/167).

## [0.1.1] - 2022-08-25

### `@stlite/mountable`

#### Changed

- Pyodide has been updated to 0.21.1 ([#162](https://github.com/whitphx/stlite/pull/162)), however, reverted due to [#164](https://github.com/whitphx/stlite/issues/164).

## [0.1.0] - 2022-08-25

The first public release of `@stlite/mountable`.
