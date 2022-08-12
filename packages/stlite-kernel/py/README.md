## `tornado`

A customized version of `tornado`.

The original Tornado cannot be installed and run on Pyodide environment and stlite kernel needs a customized communication protocol, so we forked and customized it.

### Implementation principles
* Simplicity and readability is the top priority.
* Neither reproducing the original behavior nor implementing the correct HTTP protocol is needed.
* We do not pay efforts to keep the original code. We do it if it supports reading and implementing the code, and we don't if it does not.
