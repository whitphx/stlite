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

    Workers enforce hard size limits, so build-time-only or notebook-only
    payloads must not ship:
    - top-level ``*.data`` wheel payload dirs (scripts/, share/jupyter/, ...)
    - ``nbextension/static`` payloads (Jupyter-widget frontend assets; the
      ``nbextension`` module itself must stay — pydeck's ``__init__`` imports
      ``_jupyter_nbextension_paths`` from it)
    - ``*.js.map`` source maps inside vendored packages
    - C/Cython sources and headers, and ``.pyi`` type stubs (nothing compiles
      or type-checks inside the Worker)
    """
    _remove_entries(vendor_dir, lambda entry: bool(_WHEEL_DATA_DIR.match(entry)))
    for nbextension_static in vendor_dir.glob("*/nbextension/static"):
        if nbextension_static.is_dir():
            shutil.rmtree(nbextension_static)
    for pattern in ("*.js.map", "*.c", "*.pyx", "*.pxd", "*.h", "*.pyi"):
        for dead_file in vendor_dir.rglob(pattern):
            dead_file.unlink()
    # numpy.f2py is numpy's Fortran-binding build tool; importing numpy never
    # touches it, and it rides in the size-capped script (numpy contains .so
    # files, so it can't move to the asset tarball).
    f2py = vendor_dir / "numpy" / "f2py"
    if f2py.is_dir():
        shutil.rmtree(f2py)


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


# Everything the Worker script must be able to import BEFORE the packed
# runtime is installed at boot: the stlite entrypoint package and the workers
# SDK artifacts pywrangler vendors (workers/, asgi.py, its dist-info, and the
# _workers_sdk_* .pth machinery).
_SCRIPT_KEEP_ENTRIES = {"stlite_cloudflare", "workers", "asgi.py"}
_SCRIPT_KEEP_PATTERN = re.compile(
    r"^(workers_runtime_sdk-.*\.dist-info|_workers_sdk_.*)$"
)
# Cloudflare rejects individual static-asset files above 25 MiB.
_ASSET_FILE_SIZE_LIMIT = 25 * 1024 * 1024


def _contains_native_lib(entry: Path) -> bool:
    if entry.is_file():
        return entry.suffix == ".so"
    return next(entry.rglob("*.so"), None) is not None


_APP_PACKAGE = "_stlite_cloudflare_app"
# Packages observed to break when imported from a zip: altair opens its own
# module sources with plain filesystem reads while rendering charts
# (NotADirectoryError on altair/utils/_importers.py inside the zip path).
_ZIP_INCOMPATIBLE_PACKAGES = {"altair"}


def _needs_real_files(entry: Path) -> bool:
    if entry.name == _APP_PACKAGE:
        # Streamlit executes the entry script by path and app code reads its
        # data files with open(); neither works from inside a zip.
        return True
    if entry.name in _ZIP_INCOMPATIBLE_PACKAGES:
        return True
    if entry.name.endswith((".dist-info", ".egg-info")):
        # Metadata dirs are read via importlib.metadata, which handles zips.
        return False
    # zipimport does not find PEP 420 namespace packages (top-level dirs
    # without __init__.py, e.g. protobuf's google/ tree), so those must be
    # real files too.
    return entry.is_dir() and not (entry / "__init__.py").exists()


def pack_modules(vendor_dir: Path, dest_dir: Path) -> None:
    """Move the heavy pure-Python runtime out of the Worker script.

    Produces two static assets under ``dest_dir`` and removes the packed
    entries so the script bundle stays under Cloudflare's script-size limit:

    - ``python-modules.zip``: the pure-Python libraries. The Worker puts the
      zip itself on sys.path (zipimport), so the modules never occupy the
      in-memory filesystem — they decompress per-import instead.
    - ``extracted-modules.tar.gz``: what must exist as real files at boot —
      the user's app package plus anything zipimport can't serve (see
      _needs_real_files).

    Two kinds of entries must stay in the script: the boot-critical keeps,
    and anything containing a native ``.so`` — workerd only dlopens shared
    libraries from read-only filesystems (the script's python_modules mount),
    never from writable paths.
    """
    packed = sorted(
        entry
        for entry in vendor_dir.iterdir()
        if entry.name not in _SCRIPT_KEEP_ENTRIES
        and not _SCRIPT_KEEP_PATTERN.match(entry.name)
        and not _contains_native_lib(entry)
    )
    real_file_entries = [entry for entry in packed if _needs_real_files(entry)]
    zipped_entries = [entry for entry in packed if not _needs_real_files(entry)]
    dest_dir.mkdir(parents=True, exist_ok=True)

    extracted_dest = dest_dir / "extracted-modules.tar.gz"
    with tarfile.open(extracted_dest, "w:gz") as tar:
        # The Worker extracts this archive with tarfile's "data" filter,
        # which rejects unsafe links; the app mirror already dereferences
        # symlinks, and following any stragglers here keeps the archive
        # link-free by construction.
        tar.dereference = True
        for entry in real_file_entries:
            tar.add(entry, arcname=entry.name)

    zip_dest = dest_dir / "python-modules.zip"
    with zipfile.ZipFile(zip_dest, "w", zipfile.ZIP_DEFLATED) as archive:
        for entry in zipped_entries:
            if entry.is_file():
                archive.write(entry, arcname=entry.name)
                continue
            for member in sorted(entry.rglob("*")):
                if member.is_file():
                    archive.write(member, arcname=member.relative_to(vendor_dir))

    for entry in packed:
        if entry.is_dir() and not entry.is_symlink():
            shutil.rmtree(entry)
        else:
            entry.unlink()

    for dest in (zip_dest, extracted_dest):
        size = dest.stat().st_size
        if size > _ASSET_FILE_SIZE_LIMIT:
            sys.exit(
                f"{dest} is {size / 1024 / 1024:.1f} MiB compressed, above "
                "Cloudflare's 25 MiB per-asset limit; the packed runtime "
                "needs splitting into multiple archives to ship this many "
                "dependencies."
            )


# --mock removes user-named packages and installs import-satisfying stubs so
# Streamlit still boots without them (e.g. `--mock pandas --mock numpy`, the
# `--slim` alias, for apps that never touch dataframes). What the mock breaks
# is then garbage-collected from the vendored closure by dependency metadata:
# packages whose requirements include a removed package cannot function and go
# too (fastparquet needs pandas), and packages no surviving root can reach are
# orphans (pytz/dateutil once pandas is gone). Hand-tuned stubs live in
# mock_stubs/ for the dists whose import surface Streamlit exercises; any
# other mocked dist gets a generated raise-on-use stub.
_MOCK_STUBS_DIR = Path(__file__).resolve().parent / "mock_stubs"
# The runtime itself can never be mocked, and its dists (plus the app's own
# requirements) anchor the reachability pass.
_RUNTIME_ROOT_DISTS = {"streamlit", "stlite-lib", "workers-runtime-sdk"}

_GENERATED_STUB_TEMPLATE = '''\
"""Import-satisfying stand-in installed by --mock {dist}."""


def __getattr__(name):
    raise ModuleNotFoundError(
        f"{module}.{{name}} is unavailable: this Worker was built with "
        "--mock {dist}, which removed it. Rebuild without the flag to use it."
    )
'''


def _requirement_name(requirement: str) -> str | None:
    match = re.match(r"\s*([A-Za-z0-9][A-Za-z0-9._-]*)", requirement)
    return match.group(1) if match else None


def _dist_requires(dist_info: Path) -> set[str]:
    metadata = email.parser.Parser().parsestr(
        (dist_info / "METADATA").read_text(encoding="utf-8")
    )
    requires = set()
    for requirement in metadata.get_all("Requires-Dist") or []:
        if re.search(r"\bextra\s*==", requirement):
            continue
        # Non-extra environment markers (python_version etc.) are ignored:
        # treating the dep as always-required errs toward keeping packages in
        # the reachability pass.
        if (name := _requirement_name(requirement)) is not None:
            requires.add(_canonicalize(name))
    return requires


def _dist_name(dist_info: Path) -> str:
    metadata = email.parser.Parser().parsestr(
        (dist_info / "METADATA").read_text(encoding="utf-8")
    )
    return _canonicalize(metadata.get("Name") or dist_info.name.split("-")[0])


def _dist_top_level(dist_info: Path) -> set[str]:
    """Top-level python_modules entries owned by a dist, from its RECORD."""
    top_level = set()
    for line in (dist_info / "RECORD").read_text(encoding="utf-8").splitlines():
        record_path = line.split(",")[0]
        first = record_path.split("/")[0]
        if (
            not first
            or first.startswith("..")
            or first.endswith((".dist-info", ".egg-info", ".data"))
        ):
            continue
        top_level.add(first)
    return top_level


def mock_packages(
    vendor_dir: Path, pyproject_path: Path, mock_names: list[str]
) -> None:
    import tomllib

    mocked = {_canonicalize(name) for name in mock_names}
    runtime_hits = sorted(mocked & _RUNTIME_ROOT_DISTS)
    if runtime_hits:
        sys.exit(f"--mock cannot remove the runtime itself: {', '.join(runtime_hits)}")

    with pyproject_path.open("rb") as f:
        dependencies = tomllib.load(f).get("project", {}).get("dependencies", [])
    conflicts = sorted(
        {
            name
            for dep in dependencies
            if (name := _requirement_name(dep)) is not None
            and _canonicalize(name) in mocked
        }
    )
    if conflicts:
        sys.exit(
            f"--mock removes {', '.join(conflicts)}, but the app's requirements "
            "ask for it. Drop the requirement or the --mock flag."
        )

    dists: dict[str, dict] = {}
    for dist_info in sorted(vendor_dir.glob("*.dist-info")):
        name = _dist_name(dist_info)
        dists[name] = {
            "dist_info": dist_info,
            "requires": _dist_requires(dist_info),
            "top_level": _dist_top_level(dist_info),
        }

    unknown = sorted(mocked - set(dists))
    if unknown:
        sys.exit(
            f"--mock names packages not in the vendored runtime: {', '.join(unknown)}"
        )

    requirement_names = {
        _canonicalize(name)
        for dep in dependencies
        if (name := _requirement_name(dep)) is not None
    }
    protected = (_RUNTIME_ROOT_DISTS | requirement_names) & set(dists)

    # Broken-dependency cascade: a dist requiring a removed dist cannot
    # function (the mock is the user's assertion that nothing exercises that
    # feature), so it goes too — protected roots excepted, since the stubs
    # exist precisely to keep them booting.
    removed = set(mocked)
    changed = True
    while changed:
        changed = False
        for name, info in dists.items():
            if name in removed or name in protected:
                continue
            if info["requires"] & removed:
                removed.add(name)
                changed = True

    # Orphan pass: anything no surviving root can reach. Dists nothing
    # required in the original graph were vendored deliberately (e.g. the
    # pyarrow shim's fastparquet has no metadata in-edge), so they count as
    # roots when they survived the cascade.
    required_by_someone = set()
    for info in dists.values():
        required_by_someone |= info["requires"] & set(dists)
    sources = set(dists) - required_by_someone
    reachable = set()
    queue = list((protected | sources) - removed)
    while queue:
        name = queue.pop()
        if name in reachable:
            continue
        reachable.add(name)
        queue.extend(dists[name]["requires"] & set(dists) - removed - reachable)
    removed |= set(dists) - reachable

    # A top-level entry is deletable only when every dist claiming it is
    # removed (namespace packages can be shared across dists).
    surviving_top_level = set()
    for name in set(dists) - removed:
        surviving_top_level |= dists[name]["top_level"]
    for name in sorted(removed):
        info = dists[name]
        for entry_name in sorted(info["top_level"] - surviving_top_level):
            entry = vendor_dir / entry_name
            if entry.is_dir() and not entry.is_symlink():
                shutil.rmtree(entry)
            elif entry.exists():
                entry.unlink()
        shutil.rmtree(info["dist_info"])

    # A mocked dist whose top-level entry is also provided by a surviving dist
    # (a shared namespace package) cannot be safely stubbed: the removal pass
    # keeps that entry for the survivor, so writing a stub over it would either
    # collide (copytree/mkdir) or clobber the survivor's files. Reject rather
    # than corrupt the package (a namespace-safe merge is out of scope).
    for name in sorted(mocked):
        shared = dists[name]["top_level"] & surviving_top_level
        if shared:
            sys.exit(
                f"--mock {name} cannot be applied: it shares top-level "
                f"{sorted(shared)} with a package that stays installed, so a "
                f"stub would collide with or overwrite that package's files. "
                f"Drop --mock {name}, or remove the dependency that keeps the "
                f"other package."
            )

    for name in sorted(mocked):
        stub_source = _MOCK_STUBS_DIR / name
        if stub_source.is_dir():
            shutil.copytree(stub_source, vendor_dir / name)
            continue
        for module_name in sorted(dists[name]["top_level"]):
            stub_text = _GENERATED_STUB_TEMPLATE.format(
                dist=name, module=module_name.removesuffix(".py")
            )
            if module_name.endswith(".py"):
                (vendor_dir / module_name).write_text(stub_text)
            else:
                stub_dir = vendor_dir / module_name
                stub_dir.mkdir()
                (stub_dir / "__init__.py").write_text(stub_text)

    cascaded = sorted(removed - mocked)
    print(f"Mocked (stubbed): {sorted(mocked)}")
    if cascaded:
        print(f"Removed broken/orphaned dependencies: {cascaded}")


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

    pack = subparsers.add_parser(
        "pack-modules",
        help="Pack the heavy runtime into static assets (zip + app tarball).",
    )
    pack.add_argument("--vendor-dir", type=Path, required=True)
    pack.add_argument("--dest-dir", type=Path, required=True)

    mock = subparsers.add_parser(
        "mock-packages",
        help="Replace named packages with import stubs and GC what they orphan.",
    )
    mock.add_argument("--vendor-dir", type=Path, required=True)
    mock.add_argument("--pyproject", type=Path, required=True)
    mock.add_argument("--mock", action="append", required=True, metavar="NAME")

    args = parser.parse_args(argv)
    if args.command == "vendor-prebuilt":
        vendor_prebuilt(args.vendor_dir, args.snapshot, args.wheel)
    elif args.command == "install-runtime":
        install_runtime(args.vendor_dir, args.wheels)
    elif args.command == "pack-modules":
        pack_modules(args.vendor_dir, args.dest_dir)
    elif args.command == "mock-packages":
        mock_packages(args.vendor_dir, args.pyproject, args.mock)
    else:
        print_wheel_requires(args.wheel)


if __name__ == "__main__":
    main()
