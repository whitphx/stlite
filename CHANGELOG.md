# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### `@stlite/stlite-kernel`

#### Changed

- Patch the Matplotlib backend after installing it at runtime, [#261](https://github.com/whitphx/stlite/pull/261).

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
