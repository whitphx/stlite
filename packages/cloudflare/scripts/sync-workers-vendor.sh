#!/usr/bin/env bash
set -euo pipefail

PACKAGE_DIR="${STLITE_CLOUDFLARE_PACKAGE_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
PROJECT_DIR="${STLITE_CLOUDFLARE_PROJECT_DIR:-$PACKAGE_DIR}"
ROOT_DIR="${STLITE_CLOUDFLARE_ROOT_DIR:-$(cd "$PACKAGE_DIR/../.." && pwd)}"
VENDOR_DIR="$PROJECT_DIR/python_modules"
APP_DIR="${STLITE_CLOUDFLARE_APP_DIR:-$PROJECT_DIR/app}"

if [ ! -d "$ROOT_DIR/streamlit" ] || [ ! -d "$ROOT_DIR/packages/kernel/py/stlite-lib" ]; then
  cat >&2 <<'MSG'
stlite-cloudflare cannot find the Stlite source-tree runtime artifacts.
This development build still expects to run from the Stlite monorepo. The next
packaging step is to bundle or download versioned stlite-lib and patched
Streamlit wheels during @stlite/cloudflare release.
MSG
  exit 1
fi

if ! command -v yarn >/dev/null 2>&1; then
  YARN_SHIM_DIR="$(mktemp -d)"
  cat >"$YARN_SHIM_DIR/yarn" <<'SH'
#!/usr/bin/env bash
exec corepack yarn "$@"
SH
  chmod +x "$YARN_SHIM_DIR/yarn"
  export PATH="$YARN_SHIM_DIR:$PATH"
fi

FRONTEND_MARKER="$PROJECT_DIR/.stlite-cloudflare-remote-frontend"
if [ ! -f "$FRONTEND_MARKER" ]; then
  rm -rf "$ROOT_DIR/streamlit/lib/streamlit/static"
  pushd "$ROOT_DIR/streamlit/frontend" >/dev/null
  yarn workspaces foreach --recursive --topological --parallel --from @streamlit/app --exclude @streamlit/app --exclude @streamlit/lib run build
  yarn node "$PACKAGE_DIR/frontend/build.mjs"
  popd >/dev/null
  rsync -av --delete --delete-excluded --exclude=reports \
    "$ROOT_DIR/streamlit/frontend/app/build/" "$ROOT_DIR/streamlit/lib/streamlit/static/"
  touch "$FRONTEND_MARKER"
fi

make -C "$ROOT_DIR" stlite-lib-wheel streamlit-wheel

pushd "$ROOT_DIR" >/dev/null
corepack yarn workspace @stlite/app-packager build
popd >/dev/null

pushd "$PROJECT_DIR" >/dev/null
uv run --project . pywrangler sync --force
popd >/dev/null

STLITE_CLOUDFLARE_PROJECT_DIR="$PROJECT_DIR" \
STLITE_CLOUDFLARE_PACKAGE_DIR="$PACKAGE_DIR" \
node "$PACKAGE_DIR/scripts/vendor-pyodide-prebuilt-packages.mjs"

find "$VENDOR_DIR" -maxdepth 1 \( \
  -name 'stlite_cloudflare' -o \
  -name 'stlite_lib' -o \
  -name 'stlite_lib-*.dist-info' -o \
  -name 'streamlit' -o \
  -name 'streamlit-*.dist-info' \
\) -exec rm -rf {} +

ROOT_DIR="$ROOT_DIR" PACKAGE_DIR="$PACKAGE_DIR" VENDOR_DIR="$VENDOR_DIR" python3 - <<'PY'
import os
import shutil
from pathlib import Path
from zipfile import ZipFile

root_dir = Path(os.environ["ROOT_DIR"])
package_dir = Path(os.environ["PACKAGE_DIR"])
vendor_dir = Path(os.environ["VENDOR_DIR"])

wheels = [
    root_dir
    / "packages/kernel/py/stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl",
    next(
        (root_dir / "streamlit/lib/dist").glob("streamlit-*-py3-none-any.whl")
    ),
]

for wheel in wheels:
    with ZipFile(wheel) as zf:
        zf.extractall(vendor_dir)

shutil.copytree(
    package_dir / "py/stlite_cloudflare",
    vendor_dir / "stlite_cloudflare",
    dirs_exist_ok=True,
)
PY

mkdir -p "$VENDOR_DIR/_stlite_cloudflare_app"
rsync -a --delete "$APP_DIR/" "$VENDOR_DIR/_stlite_cloudflare_app/"
touch "$VENDOR_DIR/_stlite_cloudflare_app/__init__.py"
