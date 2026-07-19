"""python_modules vendoring steps of `stlite-cloudflare build`.

Runs inside the output project's venv (`uv run --project <out> python ...`),
which `pywrangler sync` creates before this is invoked, so only the standard
library may be used. Living in Python lets dist-info handling lean on
importlib.metadata (RECORD/METADATA parsing, CSV quoting) and archive
extraction on zipfile/tarfile (both sanitize member paths) instead of
reimplementing them in Node.

This file is a build-time tool shipped in the npm package; it is deliberately
outside py/stlite_cloudflare/, which gets vendored into every deployed Worker.
"""

import argparse
import email.parser
import re
import shutil
import sys
import tarfile
import tempfile
import zipfile
from importlib.metadata import Distribution
from pathlib import Path

# micropip only serves the build-time dependency resolution; it must not ship.
_BUILD_ONLY_PACKAGES = {"micropip"}
# pywrangler vendors host-arch builds of these; the Pyodide wheels must win.
_ALWAYS_OVERLAY_PACKAGES = {"cramjam", "fastparquet"}

# stlite has no working pyarrow (the runtime shims it); any copy a user
# dependency dragged in is ~100 MB of dead weight against the Worker size limit.
_PYARROW_ENTRIES = {"pyarrow", "pyarrow.libs"}
_PYARROW_DIST_INFO = re.compile(r"^pyarrow-.*\.dist-info$")
_RUNTIME_ENTRIES = {"stlite_cloudflare", "stlite_lib", "streamlit"}
_RUNTIME_DIST_INFO = re.compile(r"^(stlite_lib|streamlit)-.*\.dist-info$")
# Wheel `.data` payloads land as top-level `<name>-<ver>.data` dirs when
# extracted raw; their scripts/ and data/ contents (e.g. pydeck's bundled
# Jupyter notebook extension, twice ~23 MB) aren't importable in the Worker.
_WHEEL_DATA_DIR = re.compile(r"^[A-Za-z0-9_.]+-[^-]+\.data$")


def _prune_worker_dead_weight(vendor_dir: Path) -> None:
    """Remove vendored content that cannot serve any purpose in a Worker.

    Workers enforce a hard uncompressed script-size limit (64 MiB), so
    build-time-only or notebook-only payloads must not ship:
    - top-level ``*.data`` wheel payload dirs (scripts/, share/jupyter/, ...)
    - ``nbextension`` package subdirs (Jupyter-widget frontend assets)
    - ``*.js.map`` source maps inside vendored packages
    """
    _remove_entries(vendor_dir, lambda entry: bool(_WHEEL_DATA_DIR.match(entry)))
    for nbextension in vendor_dir.glob("*/nbextension"):
        if nbextension.is_dir():
            shutil.rmtree(nbextension)
    for source_map in vendor_dir.rglob("*.js.map"):
        source_map.unlink()


def _canonicalize(name: str) -> str:
    # PEP 503 name normalization.
    return re.sub(r"[-_.]+", "-", name).lower()


def _entry_matches_package(entry_name: str, package_name: str) -> bool:
    """Whether a top-level python_modules entry (a package dir, a single-module
    .py, or a *.dist-info/*.egg-info) belongs to `package_name`."""
    canonical_package = _canonicalize(package_name)
    stripped = re.sub(r"\.(dist-info|egg-info)$", "", entry_name)
    stripped = re.sub(r"\.py$", "", stripped)
    canonical_entry = _canonicalize(stripped)
    if canonical_entry == canonical_package:
        return True
    # "<name>-<version>" artifacts such as dist-info dirs; requiring a digit
    # right after the dash keeps e.g. "pytest" from matching "pytest-asyncio".
    rest = canonical_entry[len(canonical_package) + 1 :]
    return canonical_entry.startswith(f"{canonical_package}-") and bool(
        re.match(r"\d", rest)
    )


def _has_package_artifact(entries: list[str], package_name: str) -> bool:
    return any(_entry_matches_package(entry, package_name) for entry in entries)


def _remove_entries(vendor_dir: Path, predicate) -> None:
    for entry in vendor_dir.iterdir():
        if predicate(entry.name):
            if entry.is_dir() and not entry.is_symlink():
                shutil.rmtree(entry)
            else:
                entry.unlink()


def _extract_wheel(wheel_path: Path, vendor_dir: Path) -> None:
    # ZipFile.extractall sanitizes member names (absolute paths and ".."
    # components are stripped), so entries cannot escape vendor_dir.
    with zipfile.ZipFile(wheel_path) as wheel:
        wheel.extractall(vendor_dir)


def _overlay_snapshot(snapshot_path: Path, vendor_dir: Path) -> None:
    """Copy every distribution present in the site-packages snapshot but
    missing from vendor_dir (skipping build-only packages) into vendor_dir,
    preserving each file's RECORD path."""
    vendor_entries = [entry.name for entry in vendor_dir.iterdir()]
    copied: list[str] = []
    with tempfile.TemporaryDirectory() as tmp:
        with tarfile.open(snapshot_path) as tar:
            tar.extractall(tmp, filter="data")
        site_dir = next(
            (p for p in Path(tmp).rglob("site-packages") if p.is_dir()), None
        )
        if site_dir is None:
            sys.exit(f"site-packages directory not found in {snapshot_path}")
        site_dir = site_dir.resolve()

        for dist_info in sorted(site_dir.glob("*.dist-info")):
            dist = Distribution.at(dist_info)
            name = dist.metadata["Name"]
            files = dist.files
            if name is None or files is None:
                continue
            if _canonicalize(name) in _BUILD_ONLY_PACKAGES:
                continue
            if _has_package_artifact(vendor_entries, name):
                continue
            for record_path in files:
                source = Path(dist.locate_file(record_path))
                try:
                    # RECORD may list files outside site-packages (bin/
                    # scripts); those have no place in python_modules.
                    relative = source.resolve().relative_to(site_dir)
                except ValueError:
                    continue
                if not source.is_file():
                    continue
                dest = vendor_dir / relative
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, dest)
            copied.append(name)
    if copied:
        print(f"Overlay pure-Python packages from Pyodide snapshot: {copied}")


def vendor_prebuilt(
    vendor_dir: Path, snapshot_path: Path, wheels: list[tuple[str, Path]]
) -> None:
    _overlay_snapshot(snapshot_path, vendor_dir)

    vendor_entries = [entry.name for entry in vendor_dir.iterdir()]
    to_extract = [
        (name, wheel_path)
        for name, wheel_path in wheels
        if _canonicalize(name) not in _BUILD_ONLY_PACKAGES
        and (
            _canonicalize(name) in _ALWAYS_OVERLAY_PACKAGES
            or not _has_package_artifact(vendor_entries, name)
        )
    ]
    for name, wheel_path in to_extract:
        if not wheel_path.is_file():
            sys.exit(f"Missing Pyodide wheel for {name}: {wheel_path}")
        _remove_entries(vendor_dir, lambda entry: _entry_matches_package(entry, name))
        _extract_wheel(wheel_path, vendor_dir)


def install_runtime(vendor_dir: Path, wheels: list[Path]) -> None:
    _remove_entries(
        vendor_dir,
        lambda entry: (
            entry in _PYARROW_ENTRIES or bool(_PYARROW_DIST_INFO.match(entry))
        ),
    )
    # Replace whatever streamlit/stlite_lib pywrangler or the snapshot vendored
    # with the pinned fork wheels passed in.
    _remove_entries(
        vendor_dir,
        lambda entry: (
            entry in _RUNTIME_ENTRIES or bool(_RUNTIME_DIST_INFO.match(entry))
        ),
    )
    for wheel_path in wheels:
        _extract_wheel(wheel_path, vendor_dir)
    # The frontend is served from Cloudflare's static-assets layer, so any
    # static dir the streamlit wheel ships is dead weight against the script
    # limit. Streamlit tolerates its absence (the static mount is skipped when
    # the dir is missing).
    static_dir = vendor_dir / "streamlit" / "static"
    if static_dir.is_dir():
        shutil.rmtree(static_dir)
    _prune_worker_dead_weight(vendor_dir)


def print_wheel_requires(wheel_path: Path) -> None:
    """Print the wheel's core Requires-Dist entries, one per line.

    Entries carrying an ``extra == ...`` marker belong to optional extras and
    are skipped; environment markers like ``python_version`` are kept verbatim
    for the downstream resolver to evaluate.
    """
    metadata_names = [
        name
        for name in zipfile.ZipFile(wheel_path).namelist()
        if name.endswith(".dist-info/METADATA") and name.count("/") == 1
    ]
    if len(metadata_names) != 1:
        sys.exit(f"Expected exactly one dist-info METADATA in {wheel_path}")
    with zipfile.ZipFile(wheel_path) as wheel:
        metadata = email.parser.Parser().parsestr(
            wheel.read(metadata_names[0]).decode()
        )
    for requirement in metadata.get_all("Requires-Dist") or []:
        if re.search(r"\bextra\s*==", requirement):
            continue
        print(requirement)


def _parse_wheel_arg(value: str) -> tuple[str, Path]:
    name, sep, wheel_path = value.partition("=")
    if not sep or not name or not wheel_path:
        raise argparse.ArgumentTypeError(f"expected NAME=PATH, got {value!r}")
    return name, Path(wheel_path)


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    prebuilt = subparsers.add_parser(
        "vendor-prebuilt",
        help="Overlay the site-packages snapshot and extract prebuilt wheels.",
    )
    prebuilt.add_argument("--vendor-dir", type=Path, required=True)
    prebuilt.add_argument("--snapshot", type=Path, required=True)
    prebuilt.add_argument(
        "--wheel",
        action="append",
        type=_parse_wheel_arg,
        default=[],
        metavar="NAME=PATH",
    )

    runtime = subparsers.add_parser(
        "install-runtime",
        help="Drop pyarrow/runtime artifacts and extract the fork wheels.",
    )
    runtime.add_argument("--vendor-dir", type=Path, required=True)
    runtime.add_argument("wheels", nargs="+", type=Path)

    requires = subparsers.add_parser(
        "wheel-requires",
        help="Print a wheel's core Requires-Dist entries, one per line.",
    )
    requires.add_argument("--wheel", type=Path, required=True)

    args = parser.parse_args(argv)
    if args.command == "vendor-prebuilt":
        vendor_prebuilt(args.vendor_dir, args.snapshot, args.wheel)
    elif args.command == "install-runtime":
        install_runtime(args.vendor_dir, args.wheels)
    else:
        print_wheel_requires(args.wheel)


if __name__ == "__main__":
    main()
