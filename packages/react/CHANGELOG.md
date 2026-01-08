# @stlite/react

## 0.2.0

### Minor Changes

- [#1807](https://github.com/whitphx/stlite/pull/1807) [`6f8ed99`](https://github.com/whitphx/stlite/commit/6f8ed99e53191319d6911d67876e5de8178311d6) Thanks [@whitphx](https://github.com/whitphx)! - Fix style structure to provide an option to encapsulate the style in each mounted app

### Patch Changes

- [#1818](https://github.com/whitphx/stlite/pull/1818) [`381d7d3`](https://github.com/whitphx/stlite/commit/381d7d30e0b12edba6852e47eb94f3e826b1cdb3) Thanks [@whitphx](https://github.com/whitphx)! - Fix Emotion cache key error by updating generateUniqueId to use only alphabetical characters. Previously, the function generated alphanumeric IDs (e.g., "st-1mk594xl") which caused Emotion to throw an error: "Emotion key must only contain lower case alphabetical characters and - but "st-1mk594xl" was passed". The function now generates IDs containing only lowercase letters (a-z) to comply with Emotion's requirements.

## 0.1.1

### Patch Changes

- [`2722b06`](https://github.com/whitphx/stlite/commit/2722b06dbf7b1c262ddc1bf14f0ae1d74ca11556) Thanks [@whitphx](https://github.com/whitphx)! - Trigger release for https://github.com/whitphx/stlite/pull/1808 (Fix the race condition at the server initialization in SharedWorker mode) and https://github.com/whitphx/stlite/pull/1810 (Hook the task switch to reset the per-app CWD and home dir)

## 0.1.0

### Minor Changes

- [#1696](https://github.com/whitphx/stlite/pull/1696) [`7d71211`](https://github.com/whitphx/stlite/commit/7d71211b376e58609e272db288663bf522830457) Thanks [@whitphx](https://github.com/whitphx)! - Create @stlite/react package that provides Stlite as React components
