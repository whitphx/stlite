# @stlite/kernel

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
