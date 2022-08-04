# `stlite-tornado`

A "fake" package replacing the original Tornado on the stlite runtime that exposes `tornado` module like the original one.

The original Tornado cannot be installed on Pyodide environment, so we have created `stlite-tornado` that is installable and has a minimum subset of the original Tornado for Streamlit to work as a basis of stlite.

### Implementation principles
* We copy, paste, and re-implement only what is necessary for the Streamlit server, and ignore anything else.
* Simplicity and readability is the top priority.
* Neither reproducing the original behavior nor implementing the correct HTTP protocol is needed.
* We do not pay efforts to keep the original code. We do it if it supports reading and implementing the code, and we don't if it does not.
