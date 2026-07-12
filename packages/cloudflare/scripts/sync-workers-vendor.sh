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
  trap 'rm -rf "$YARN_SHIM_DIR"' EXIT
  cat >"$YARN_SHIM_DIR/yarn" <<'SH'
#!/usr/bin/env bash
exec corepack yarn "$@"
SH
  chmod +x "$YARN_SHIM_DIR/yarn"
  export PATH="$YARN_SHIM_DIR:$PATH"
fi

# The Cloudflare-variant frontend is kept per-project instead of being synced
# into the shared streamlit submodule: `make streamlit-wheel` does not track
# static assets, so a submodule-side copy could be silently missing from an
# already-built wheel, and it would leak into wheels built for the other
# stlite packages.
#
# The build stamp only tracks the submodule's HEAD commit and this package's
# frontend sources; uncommitted edits inside the submodule are not detected —
# delete this directory to force a frontend rebuild in that case.
FRONTEND_BUILD_DIR="$PROJECT_DIR/.stlite-cloudflare-remote-frontend"
FRONTEND_STAMP_FILE="$FRONTEND_BUILD_DIR/.build-stamp"
FRONTEND_STAMP="$(git -C "$ROOT_DIR/streamlit" rev-parse HEAD 2>/dev/null || echo unknown)-$(
  cat "$PACKAGE_DIR"/frontend/* |
    python3 -c 'import hashlib, sys; print(hashlib.sha256(sys.stdin.buffer.read()).hexdigest())'
)"
if [ "$(cat "$FRONTEND_STAMP_FILE" 2>/dev/null)" != "$FRONTEND_STAMP" ]; then
  pushd "$ROOT_DIR/streamlit/frontend" >/dev/null
  yarn workspaces foreach --recursive --topological --parallel --from @streamlit/app --exclude @streamlit/app --exclude @streamlit/lib run build
  yarn node "$PACKAGE_DIR/frontend/build.mjs"
  popd >/dev/null
  rm -rf "$FRONTEND_BUILD_DIR"
  rsync -a --delete --delete-excluded --exclude=reports \
    "$ROOT_DIR/streamlit/frontend/app/build/" "$FRONTEND_BUILD_DIR/"
  printf '%s\n' "$FRONTEND_STAMP" >"$FRONTEND_STAMP_FILE"
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

def single_wheel(directory: Path, pattern: str) -> Path:
    matches = sorted(directory.glob(pattern))
    if not matches:
        raise SystemExit(f"No wheel matching {pattern} in {directory}")
    if len(matches) > 1:
        names = ", ".join(match.name for match in matches)
        raise SystemExit(
            f"Multiple wheels match {pattern} in {directory} ({names}); "
            "delete the stale ones and re-run the build."
        )
    return matches[0]


wheels = [
    single_wheel(
        root_dir / "packages/kernel/py/stlite-lib/dist",
        "stlite_lib-*-py3-none-any.whl",
    ),
    single_wheel(root_dir / "streamlit/lib/dist", "streamlit-*-py3-none-any.whl"),
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

# The Worker serves the frontend from the vendored streamlit package's static
# dir; overlay the Cloudflare build over whatever the wheel shipped.
rsync -a --delete --exclude=.build-stamp \
  "$FRONTEND_BUILD_DIR/" "$VENDOR_DIR/streamlit/static/"

mkdir -p "$VENDOR_DIR/_stlite_cloudflare_app"
rsync -a --delete "$APP_DIR/" "$VENDOR_DIR/_stlite_cloudflare_app/"
touch "$VENDOR_DIR/_stlite_cloudflare_app/__init__.py"
