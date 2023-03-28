# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
