# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
