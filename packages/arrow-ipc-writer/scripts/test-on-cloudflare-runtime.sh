#!/usr/bin/env bash
# Runs the tests on the Python, pandas and numpy versions of @stlite/cloudflare's
# runtime, where this writer is meant to run. They're read from the Pyodide
# lockfile it vendors its wheels from; the uv workspace locks newer ones
# (Python 3.14, pandas 3), so this runs in an isolated environment outside it.
#
# Usage: scripts/test-on-cloudflare-runtime.sh [pytest args...]
# Needs `make node_modules` (or `yarn install`) for the lockfile.
set -euo pipefail

cd "$(dirname "$0")/.."
lock=../cloudflare/node_modules/pyodide/pyodide-lock.json
if [ ! -f "$lock" ]; then
  echo "$lock not found; run 'make node_modules' first." >&2
  exit 1
fi

python_version=$(jq -r '.info.python | split(".")[:2] | join(".")' "$lock")
numpy_version=$(jq -r '.packages.numpy.version' "$lock")
pandas_version=$(jq -r '.packages.pandas.version' "$lock")
# pyarrow and pytest only check the output, so they match the workspace's.
pyarrow_version=24.0.0
pytest_version=9.1.1

echo "Python $python_version, numpy $numpy_version, pandas $pandas_version"
PYTHONPATH=. uv run --isolated --no-project --python "$python_version" \
  --with "numpy==$numpy_version" \
  --with "pandas==$pandas_version" \
  --with "pyarrow==$pyarrow_version" \
  --with "pytest==$pytest_version" \
  python -m pytest "$@"
