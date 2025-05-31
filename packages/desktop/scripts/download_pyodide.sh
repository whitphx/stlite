#!/bin/bash

PYODIDE_VERSION=$(node -e 'const { version } = require("pyodide"); console.log(version)')
echo "Downloading Pyodide $PYODIDE_VERSION"
mkdir -p ./build
curl -L https://github.com/pyodide/pyodide/releases/download/$PYODIDE_VERSION/pyodide-core-$PYODIDE_VERSION.tar.bz2 | tar xj -C ./build --files-from=./pyodide-files.txt
