#!/usr/bin/env bash
# Runs the pyarrow shim's tests on the Python, pandas and numpy versions of
# @stlite/cloudflare's runtime, the only one that installs the shim. They're
# read from the Pyodide lockfile it vendors its wheels from. The Streamlit
# fork's other direct dependencies are pinned to the versions uv.lock has, and
# theirs resolve under the workspace's dependency cooldown. The uv workspace
# locks newer Python and pandas, so this runs in an isolated environment
# outside it.
#
# Usage: scripts/test-pyarrow-shim-on-cloudflare-runtime.sh [pytest args...]
# Needs `make node_modules` (or `yarn install`) for the lockfile, and
# `make streamlit-proto`.
set -euo pipefail

cd "$(dirname "$0")/.."
pyodide_lock=../../../cloudflare/node_modules/pyodide/pyodide-lock.json
if [ ! -f "$pyodide_lock" ]; then
  echo "$pyodide_lock not found; run 'make node_modules' first." >&2
  exit 1
fi

requirements=$(mktemp)
trap 'rm -f "$requirements"' EXIT
python_version=$(
  uv run --isolated --no-project python - "$pyodide_lock" ../../../../uv.lock \
    ../../../../streamlit/lib/pyproject.toml "$requirements" <<'EOF'
import json
import re
import sys
import tomllib

pyodide_lock_path, uv_lock_path, streamlit_pyproject_path, requirements_path = (
    sys.argv[1:]
)
with open(pyodide_lock_path) as f:
    pyodide_lock = json.load(f)
with open(uv_lock_path, "rb") as f:
    locked = {p["name"]: p for p in tomllib.load(f)["package"]}
with open(streamlit_pyproject_path, "rb") as f:
    streamlit_dependencies = tomllib.load(f)["project"]["dependencies"]


def canonical_name(requirement):
    name = re.match(r"[A-Za-z0-9._-]+", requirement).group(0)
    return re.sub(r"[-_.]+", "-", name).lower()


# The fork's dependencies (pyarrow among them, to check the shim's output
# against), plus pytest.
names = {canonical_name(dep) for dep in streamlit_dependencies} | {"pytest"}
missing = sorted(names - set(locked))
if missing:
    sys.exit(f"Not in uv.lock, so no version to pin: {', '.join(missing)}")
versions = {name: locked[name]["version"] for name in names}
for name in ("numpy", "pandas"):
    versions[name] = pyodide_lock["packages"][name]["version"]
with open(requirements_path, "w") as f:
    f.writelines(f"{name}=={version}\n" for name, version in sorted(versions.items()))

print(".".join(pyodide_lock["info"]["python"].split(".")[:2]))
EOF
)

echo "Python $python_version; $(grep -E '^(numpy|pandas)==' "$requirements" | paste -sd ' ')"
PYTHONPATH=. uv run --isolated --no-project --python "$python_version" \
  --with-requirements "$requirements" \
  python -m pytest \
  stlite_lib_tests/pyarrow_shim_parity_test.py \
  stlite_lib_tests/runtime_init_test.py \
  "$@"
