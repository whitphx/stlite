#!/bin/bash

PYODIDE_VERSION=$(yarn info --json pyodide | jq -r '.children.Version')
curl -L https://github.com/pyodide/pyodide/releases/download/$PYODIDE_VERSION/pyodide-core-$PYODIDE_VERSION.tar.bz2 | tar xj -C ./build --files-from=./pyodide-files.txt
