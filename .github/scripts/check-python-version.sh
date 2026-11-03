#!/usr/bin/env bash
# Checks that the Python minor version pinned in `.python-version` matches the
# one bundled in the Pyodide runtime that `@stlite/kernel` depends on.
#
# Only the minor version has to match: wheels are tagged `cp3XX` and bytecode
# is compiled for that minor. The patch in `.python-version` tracks the latest
# CPython release of that minor instead (see "Python Version" in CLAUDE.md).
#
# `pyodide-lock.json` records the bundled Python only up to the minor reliably
# (Pyodide 314.x reports 3.14.0 while shipping 3.14.2), so the patch is
# ignored on that side too.
#
# Usage: .github/scripts/check-python-version.sh (from the repository root)
set -euo pipefail

python_version="$(tr -d '[:space:]' < .python-version)"
pyodide_version="$(jq -r '.devDependencies.pyodide // .dependencies.pyodide // empty' packages/kernel/package.json)"

if [[ -z "$pyodide_version" ]]; then
  echo "::error::Could not read the pyodide version from packages/kernel/package.json."
  exit 1
fi

pyodide_python_version="$(
  curl -fsSL "https://registry.npmjs.org/pyodide/-/pyodide-${pyodide_version}.tgz" |
    tar -xzO package/pyodide-lock.json |
    jq -r '.info.python'
)"

python_minor="$(cut -d. -f1,2 <<< "$python_version")"
pyodide_python_minor="$(cut -d. -f1,2 <<< "$pyodide_python_version")"

echo ".python-version: ${python_version} (minor ${python_minor})"
echo "Pyodide ${pyodide_version} bundles Python ${pyodide_python_minor}"

if [[ "$python_minor" != "$pyodide_python_minor" ]]; then
  echo "::error file=.python-version::.python-version is ${python_version}, but Pyodide ${pyodide_version} bundles Python ${pyodide_python_minor}. Pin .python-version to the latest CPython ${pyodide_python_minor}.x release."
  exit 1
fi
