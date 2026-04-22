# @stlite/kernel

## 0.102.2

### Patch Changes

- [#1999](https://github.com/whitphx/stlite/pull/1999) [`07500cc`](https://github.com/whitphx/stlite/commit/07500cc5e8d054ad0fc9055d7680583e14539f7f) Thanks [@whitphx](https://github.com/whitphx)! - Replace ESLint and Prettier with Oxc (oxlint + oxfmt) for linting and formatting. Dev tooling only — no runtime or API change.

- Updated dependencies [[`07500cc`](https://github.com/whitphx/stlite/commit/07500cc5e8d054ad0fc9055d7680583e14539f7f)]:
  - @stlite/common@0.90.3

## 0.102.1

### Patch Changes

- [#1989](https://github.com/whitphx/stlite/pull/1989) [`8746191`](https://github.com/whitphx/stlite/commit/8746191fea4668e43b48c6e61c2d494b7df4fa63) Thanks [@whitphx](https://github.com/whitphx)! - Configure a 1-week `exclude-newer` cooldown for uv resolution to reduce exposure to PyPI supply-chain attacks when resolving the Python dependencies used to build the kernel's Pyodide wheels.

## 0.102.0

### Minor Changes

- [#1971](https://github.com/whitphx/stlite/pull/1971) [`1f91a44`](https://github.com/whitphx/stlite/commit/1f91a44d6a89c3f38743ce7f34b9027d05cfab65) Thanks [@whitphx](https://github.com/whitphx)! - Rebase Streamlit fork onto 1.56.0.

## 0.101.1

### Patch Changes

- [#1973](https://github.com/whitphx/stlite/pull/1973) [`c69cf7b`](https://github.com/whitphx/stlite/commit/c69cf7bea70c56ca53ce7b199f27ab5ec2aeb2d7) Thanks [@whitphx](https://github.com/whitphx)! - Trigger a new release because the previous release failed due to a bug addressed by [#1972](https://github.com/whitphx/stlite/issues/1972). The release contains "52568e5 Thanks @whitphx! - Update Streamlit to 1.54.0" and "[#1967](https://github.com/whitphx/stlite/issues/1967) 9d0d501 Thanks @whitphx! - Update Streamlit to 1.55.0"

- Updated dependencies [[`c69cf7b`](https://github.com/whitphx/stlite/commit/c69cf7bea70c56ca53ce7b199f27ab5ec2aeb2d7)]:
  - @stlite/common@0.90.2

## 0.101.0

### Minor Changes

- [`52568e5`](https://github.com/whitphx/stlite/commit/52568e5a9f761c1de595e715dfd225c439901356) Thanks [@whitphx](https://github.com/whitphx)! - Update Streamlit to 1.54.0

- [#1967](https://github.com/whitphx/stlite/pull/1967) [`9d0d501`](https://github.com/whitphx/stlite/commit/9d0d5015aeb6b4f387e3c503264f1493a4950786) Thanks [@whitphx](https://github.com/whitphx)! - Update Streamlit to 1.55.0

## 0.100.0

### Minor Changes

- [#1920](https://github.com/whitphx/stlite/pull/1920) [`83e374d`](https://github.com/whitphx/stlite/commit/83e374d5ebe626da858c59e1b63b4634ce963253) Thanks [@whitphx](https://github.com/whitphx)! - Update Streamlit to 1.53.1

## 0.99.0

### Minor Changes

- [#1913](https://github.com/whitphx/stlite/pull/1913) [`cff9b33`](https://github.com/whitphx/stlite/commit/cff9b33d9a4cba5aeb0a4b663b64897c5f28b50a) Thanks [@whitphx](https://github.com/whitphx)! - Update Streamlit to 1.52.2

## 0.98.0

### Minor Changes

- [#1893](https://github.com/whitphx/stlite/pull/1893) [`6991477`](https://github.com/whitphx/stlite/commit/6991477416911a49044fbbe266ac338fecfd5b40) Thanks [@whitphx](https://github.com/whitphx)! - Update Pyodide to 0.29.3

### Patch Changes

- [#1910](https://github.com/whitphx/stlite/pull/1910) [`9f99bf6`](https://github.com/whitphx/stlite/commit/9f99bf612d2e6add0dd26c6fcc53bbf399420d03) Thanks [@whitphx](https://github.com/whitphx)! - Fix worker creation on opaque origins (e.g. file:// protocol, data: URLs): wrap data: URL workers in blob URLs to fix IndexedDB access (IDBFS), correctly detect opaque origins in same-origin checks, and fall back from SharedWorker to regular Worker on opaque origins where SharedWorker silently fails

## 0.97.2

### Patch Changes

- [#1822](https://github.com/whitphx/stlite/pull/1822) [`8465993`](https://github.com/whitphx/stlite/commit/846599387f5a1cd15aebf92c95dc93927054be85) Thanks [@whitphx](https://github.com/whitphx)! - Add console log to navigate to the SharedWorker inspector for debugging purposes

## 0.97.1

### Patch Changes

- [#1810](https://github.com/whitphx/stlite/pull/1810) [`ab61ff2`](https://github.com/whitphx/stlite/commit/ab61ff21b5dc200f6add1ebc9a7a7e039592ef65) Thanks [@whitphx](https://github.com/whitphx)! - Hook the task switch to reset the per-app CWD and home dir

- [#1808](https://github.com/whitphx/stlite/pull/1808) [`b410f9b`](https://github.com/whitphx/stlite/commit/b410f9bcc47836228eeccea75efb11d8351155d4) Thanks [@whitphx](https://github.com/whitphx)! - Fix the race condition at the server initialization in SharedWorker mode

## 0.97.0

### Minor Changes

- [#1786](https://github.com/whitphx/stlite/pull/1786) [`430ee6f`](https://github.com/whitphx/stlite/commit/430ee6f81da90a7706c188872dad6da38941667b) Thanks [@whitphx](https://github.com/whitphx)! - Add API to call micropip.add_mock_package

### Patch Changes

- [#1785](https://github.com/whitphx/stlite/pull/1785) [`effa582`](https://github.com/whitphx/stlite/commit/effa5827a298f798decba3d554e60c84660f94cc) Thanks [@whitphx](https://github.com/whitphx)! - Internal update to support AbortSignal on the pseudo HTTP requests

## 0.96.0

### Minor Changes

- [#1768](https://github.com/whitphx/stlite/pull/1768) [`7be169b`](https://github.com/whitphx/stlite/commit/7be169ba5f2829f02ef516ba50d71533aa193e18) Thanks [@whitphx](https://github.com/whitphx)! - Make the kernel methods wait for the initialization process before sending the message to the worker

## 0.95.0

### Minor Changes

- [#1763](https://github.com/whitphx/stlite/pull/1763) [`07538a5`](https://github.com/whitphx/stlite/commit/07538a5dc3652a3f80b57a8ab1739454cbbd86a7) Thanks [@whitphx](https://github.com/whitphx)! - Expose kernel.\_worker as an unstable API

## 0.94.0

### Minor Changes

- [#1754](https://github.com/whitphx/stlite/pull/1754) [`5782557`](https://github.com/whitphx/stlite/commit/5782557ada0f661aadd64ffb7071ec0f148665da) Thanks [@whitphx](https://github.com/whitphx)! - Split package into different sub-exports

## 0.93.0

### Minor Changes

- [#1696](https://github.com/whitphx/stlite/pull/1696) [`7d71211`](https://github.com/whitphx/stlite/commit/7d71211b376e58609e272db288663bf522830457) Thanks [@whitphx](https://github.com/whitphx)! - Add ESM exports, `worker` and `worker-runtime`

## 0.92.3

### Patch Changes

- [#1726](https://github.com/whitphx/stlite/pull/1726) [`4829dd9`](https://github.com/whitphx/stlite/commit/4829dd930f61f9b01f9c0e5f38dc0294e26d62d6) Thanks [@yarikoptic](https://github.com/yarikoptic)! - Fix typo

- [#1728](https://github.com/whitphx/stlite/pull/1728) [`ff078de`](https://github.com/whitphx/stlite/commit/ff078de0df5741fc3027143ed50ba5581878ce4e) Thanks [@whitphx](https://github.com/whitphx)! - Introduce cSpell and fix typo

## 0.92.2

### Patch Changes

- [#1721](https://github.com/whitphx/stlite/pull/1721) [`a6c96be`](https://github.com/whitphx/stlite/commit/a6c96befd53a710299d0cde9060a239cfd40a240) Thanks [@whitphx](https://github.com/whitphx)! - Fix base path normalization to avoid ReDoS

## 0.92.1

### Patch Changes

- [#1716](https://github.com/whitphx/stlite/pull/1716) [`ee73e8c`](https://github.com/whitphx/stlite/commit/ee73e8c82d16602b3b72a1ec5d86c356b37b66b9) Thanks [@whitphx](https://github.com/whitphx)! - Update protoc to 26.1

- [#1715](https://github.com/whitphx/stlite/pull/1715) [`6dc03af`](https://github.com/whitphx/stlite/commit/6dc03af5f84964b1adf3ad4112287fe3f9c3c17e) Thanks [@whitphx](https://github.com/whitphx)! - Move ConnectionManager to @stlite/kernel to avoid circular dependency between @stlite/kernel and @streamlit/connection

## 0.92.0

### Minor Changes

- [#1712](https://github.com/whitphx/stlite/pull/1712) [`306c18c`](https://github.com/whitphx/stlite/commit/306c18cb81d500375c31c6e7ff62ab135ca446ff) Thanks [@whitphx](https://github.com/whitphx)! - Make StliteKernel dispatch events on imperative operations

- [#1711](https://github.com/whitphx/stlite/pull/1711) [`a97285c`](https://github.com/whitphx/stlite/commit/a97285c82f718d6849965cfcd348f87d7fe8f835) Thanks [@whitphx](https://github.com/whitphx)! - Make StliteKernel EventTarget so that all events are handled in its manner

### Patch Changes

- [#1709](https://github.com/whitphx/stlite/pull/1709) [`d1a53e5`](https://github.com/whitphx/stlite/commit/d1a53e53496514c3e441507038d7634da9c620b6) Thanks [@whitphx](https://github.com/whitphx)! - Fix module import in worker-runtime.ts

## 0.91.0

### Minor Changes

- [#1705](https://github.com/whitphx/stlite/pull/1705) [`ed1a48b`](https://github.com/whitphx/stlite/commit/ed1a48bccfd51dbae1c643baccfa5b7932c25f86) Thanks [@whitphx](https://github.com/whitphx)! - Add runPython() method
