# @stlite/kernel

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
