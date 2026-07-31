import tarfile
import zipfile
from pathlib import Path

import pytest

from vendor_python_modules import (
    _entry_matches_package,
    install_runtime,
    mock_packages,
    pack_modules,
    print_wheel_requires,
    vendor_prebuilt,
)


def _make_wheel(path: Path, files: dict[str, str]) -> Path:
    with zipfile.ZipFile(path, "w") as wheel:
        for name, content in files.items():
            wheel.writestr(name, content)
    return path


def _make_snapshot(root: Path, files: dict[str, str]) -> Path:
    site = root / "snap" / "lib" / "python3.13" / "site-packages"
    site.mkdir(parents=True, exist_ok=True)
    for name, content in files.items():
        file_path = site / name
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content)
    snapshot = root / "snapshot.tar.gz"
    with tarfile.open(snapshot, "w:gz") as tar:
        tar.add(root / "snap", arcname="snap")
    return snapshot


def test_entry_matches_package_artifacts_but_not_prefixed_siblings():
    assert _entry_matches_package("pytest", "pytest")
    assert _entry_matches_package("pytest-8.0.dist-info", "pytest")
    assert not _entry_matches_package("pytest_asyncio-1.0.dist-info", "pytest")
    assert _entry_matches_package("six.py", "six")


def test_vendor_prebuilt_overlays_missing_and_extracts_wheels(tmp_path):
    vendor = tmp_path / "vendor"
    vendor.mkdir()
    (vendor / "already").mkdir()

    snapshot = _make_snapshot(
        tmp_path,
        {
            # "fresh" is absent from vendor -> copied, including a
            # CSV-quoted RECORD path with a comma in the filename.
            "fresh/__init__.py": "F",
            "fresh/a,b.py": "Q",
            "fresh-1.0.dist-info/METADATA": "Name: fresh\n",
            "fresh-1.0.dist-info/RECORD": (
                "fresh/__init__.py,,\n"
                '"fresh/a,b.py",,\n'
                "fresh-1.0.dist-info/METADATA,,\n"
                "fresh-1.0.dist-info/RECORD,,\n"
            ),
            # "already" exists in vendor -> skipped.
            "already/__init__.py": "A",
            "already-2.0.dist-info/METADATA": "Name: already\n",
            "already-2.0.dist-info/RECORD": "already/__init__.py,,\n",
            # micropip is build-only -> skipped.
            "micropip/__init__.py": "M",
            "micropip-1.0.dist-info/METADATA": "Name: micropip\n",
            "micropip-1.0.dist-info/RECORD": "micropip/__init__.py,,\n",
        },
    )

    numpy_wheel = _make_wheel(
        tmp_path / "numpy-2.0-py3-none-any.whl",
        {"numpy/__init__.py": "N", "numpy-2.0.dist-info/METADATA": "Name: numpy\n"},
    )
    already_wheel = _make_wheel(
        tmp_path / "already-2.0-py3-none-any.whl",
        {"already/__init__.py": "WHEEL"},
    )

    vendor_prebuilt(
        vendor,
        snapshot,
        [("numpy", numpy_wheel), ("already", already_wheel)],
    )

    assert (vendor / "fresh" / "__init__.py").read_text() == "F"
    assert (vendor / "fresh" / "a,b.py").read_text() == "Q"
    assert (vendor / "numpy" / "__init__.py").read_text() == "N"
    # "already" was present (as an empty dir), so neither the snapshot copy
    # ("A") nor the wheel extraction ("WHEEL") touched it.
    assert not (vendor / "already" / "__init__.py").exists()
    assert not (vendor / "micropip").exists()


def test_vendor_prebuilt_always_overlays_forced_packages(tmp_path):
    vendor = tmp_path / "vendor"
    (vendor / "cramjam").mkdir(parents=True)
    (vendor / "cramjam" / "__init__.py").write_text("HOST-ARCH")

    snapshot = _make_snapshot(tmp_path, {})
    wheel = _make_wheel(
        tmp_path / "cramjam-2.8-py3-none-any.whl",
        {"cramjam/__init__.py": "PYODIDE"},
    )

    vendor_prebuilt(vendor, snapshot, [("cramjam", wheel)])

    assert (vendor / "cramjam" / "__init__.py").read_text() == "PYODIDE"


def test_vendor_prebuilt_ignores_record_paths_outside_site_packages(tmp_path):
    vendor = tmp_path / "vendor"
    vendor.mkdir()
    root = tmp_path / "snapshot-root"
    root.mkdir()
    (root / "snap" / "lib").mkdir(parents=True)
    (root / "snap" / "evil.py").write_text("X")
    snapshot = _make_snapshot(
        root,
        {
            "esc/__init__.py": "E",
            "esc-1.0.dist-info/METADATA": "Name: esc\n",
            "esc-1.0.dist-info/RECORD": ("esc/__init__.py,,\n../../evil.py,,\n"),
        },
    )

    vendor_prebuilt(vendor, snapshot, [])

    assert (vendor / "esc" / "__init__.py").read_text() == "E"
    assert not (vendor / "evil.py").exists()
    assert not (tmp_path / "evil.py").exists()


def test_extract_wheel_sanitizes_traversal_entries(tmp_path):
    vendor = tmp_path / "vendor"
    vendor.mkdir()
    wheel = _make_wheel(
        tmp_path / "evil-1.0-py3-none-any.whl",
        {"../evil.py": "nope", "pkg/__init__.py": "P"},
    )

    install_runtime(vendor, [wheel])

    assert (vendor / "pkg" / "__init__.py").read_text() == "P"
    # zipfile strips the ".." component instead of escaping vendor.
    assert not (tmp_path / "evil.py").exists()


def test_install_runtime_replaces_runtime_and_drops_pyarrow(tmp_path):
    vendor = tmp_path / "vendor"
    for entry in [
        "pyarrow",
        "pyarrow.libs",
        "pyarrow-17.0.0.dist-info",
        "pyarrow_hotfix",
        "streamlit",
        "streamlit-1.0.dist-info",
        "stlite_lib",
        "pandas",
    ]:
        (vendor / entry).mkdir(parents=True)

    wheel = _make_wheel(
        tmp_path / "streamlit-1.57.0-py3-none-any.whl",
        {"streamlit/__init__.py": "S"},
    )

    install_runtime(vendor, [wheel])

    remaining = sorted(p.name for p in vendor.iterdir())
    assert remaining == ["pandas", "pyarrow_hotfix", "streamlit"]
    assert (vendor / "streamlit" / "__init__.py").read_text() == "S"


def test_install_runtime_prunes_worker_dead_weight(tmp_path):
    vendor = tmp_path / "vendor"
    (vendor / "pydeck" / "nbextension" / "static").mkdir(parents=True)
    (vendor / "pydeck" / "nbextension" / "static" / "index.js").write_text("J")
    (vendor / "pydeck" / "nbextension" / "__init__.py").write_text("N")
    (vendor / "pydeck" / "bindings").mkdir(parents=True)
    (vendor / "pydeck" / "bindings" / "deck.py").write_text("D")
    (vendor / "pydeck-0.9.3.data" / "data" / "share").mkdir(parents=True)
    (vendor / "altair").mkdir()
    (vendor / "altair" / "chart.js.map").write_text("M")
    (vendor / "fastparquet").mkdir()
    (vendor / "fastparquet" / "cencoding.c").write_text("C")
    (vendor / "fastparquet" / "api.py").write_text("F")
    (vendor / "numpy_stub.pyi_holder").mkdir()
    (vendor / "numpy_stub.pyi_holder" / "core.pyi").write_text("T")
    (vendor / "streamlit").mkdir()
    (vendor / "streamlit" / "__init__.py").write_text("S0")

    wheel = _make_wheel(
        tmp_path / "streamlit-1.57.0-py3-none-any.whl",
        {"streamlit/__init__.py": "S"},
    )

    install_runtime(vendor, [wheel])

    assert not (vendor / "pydeck-0.9.3.data").exists()
    assert not (vendor / "pydeck" / "nbextension" / "static").exists()
    assert not (vendor / "altair" / "chart.js.map").exists()
    assert not (vendor / "fastparquet" / "cencoding.c").exists()
    assert not (vendor / "numpy_stub.pyi_holder" / "core.pyi").exists()
    # The packages themselves survive; only the dead payloads go. pydeck's
    # __init__ imports from .nbextension, so the module must remain.
    assert (vendor / "pydeck" / "nbextension" / "__init__.py").read_text() == "N"
    assert (vendor / "pydeck" / "bindings" / "deck.py").read_text() == "D"
    assert (vendor / "fastparquet" / "api.py").read_text() == "F"
    assert (vendor / "streamlit" / "__init__.py").read_text() == "S"


def test_print_wheel_requires_keeps_core_deps_and_markers_but_not_extras(
    tmp_path, capsys
):
    wheel = _make_wheel(
        tmp_path / "streamlit-1.57.0-py3-none-any.whl",
        {
            "streamlit-1.57.0.dist-info/METADATA": (
                "Metadata-Version: 2.1\n"
                "Name: streamlit\n"
                "Requires-Dist: altair>=4.0\n"
                'Requires-Dist: tomli; python_version < "3.11"\n'
                'Requires-Dist: rich>=11.0.0; extra == "all"\n'
                "\n"
            ),
        },
    )

    print_wheel_requires(wheel)

    assert capsys.readouterr().out.splitlines() == [
        "altair>=4.0",
        'tomli; python_version < "3.11"',
    ]


def test_pack_modules_packs_all_but_boot_keeps(tmp_path):
    vendor = tmp_path / "vendor"
    for keep in [
        "stlite_cloudflare",
        "workers",
        "workers_runtime_sdk-1.6.2.dist-info",
    ]:
        (vendor / keep).mkdir(parents=True)
        (vendor / keep / "marker.py").write_text("K")
    (vendor / "asgi.py").write_text("A")
    (vendor / "_workers_sdk_entropy_import_context.pth").write_text("P")
    (vendor / "streamlit").mkdir()
    (vendor / "streamlit" / "__init__.py").write_text("S")
    (vendor / "_stlite_cloudflare_app").mkdir()
    (vendor / "_stlite_cloudflare_app" / "streamlit_app.py").write_text("APP")
    # A PEP 420 namespace package (no __init__.py): zipimport can't serve it.
    (vendor / "google" / "protobuf").mkdir(parents=True)
    (vendor / "google" / "protobuf" / "message.py").write_text("G")
    # Native-extension packages must stay in the script: workerd only dlopens
    # .so files from read-only filesystems.
    (vendor / "numpy" / "_core").mkdir(parents=True)
    (vendor / "numpy" / "_core" / "umath.cpython-313-wasm32.so").write_text("N")
    (vendor / "libcrypto.so").write_text("L")

    dest_dir = tmp_path / "assets" / "_stlite"
    pack_modules(vendor, dest_dir)

    with zipfile.ZipFile(dest_dir / "python-modules.zip") as archive:
        zip_names = set(archive.namelist())
    assert "streamlit/__init__.py" in zip_names
    assert not any(name.startswith("stlite_cloudflare") for name in zip_names)
    assert not any(name.startswith("workers") for name in zip_names)
    assert not any(name.startswith("numpy") for name in zip_names)
    # The app and namespace packages ship separately, as a tarball extracted
    # to real files at boot (zipimport can't serve either).
    assert not any(name.startswith("_stlite_cloudflare_app") for name in zip_names)
    assert not any(name.startswith("google/") for name in zip_names)
    with tarfile.open(dest_dir / "extracted-modules.tar.gz") as tar:
        tar_names = tar.getnames()
    assert "_stlite_cloudflare_app/streamlit_app.py" in tar_names
    assert "google/protobuf/message.py" in tar_names
    # Packed entries leave the script bundle; boot-critical and native ones stay.
    remaining = sorted(p.name for p in vendor.iterdir())
    assert remaining == [
        "_workers_sdk_entropy_import_context.pth",
        "asgi.py",
        "libcrypto.so",
        "numpy",
        "stlite_cloudflare",
        "workers",
        "workers_runtime_sdk-1.6.2.dist-info",
    ]


def test_vendor_prebuilt_fails_on_missing_wheel(tmp_path):
    vendor = tmp_path / "vendor"
    vendor.mkdir()
    snapshot = _make_snapshot(tmp_path, {})

    with pytest.raises(SystemExit, match="Missing Pyodide wheel"):
        vendor_prebuilt(vendor, snapshot, [("numpy", tmp_path / "nope.whl")])


def _write_pyproject(tmp_path, dependencies):
    pyproject = tmp_path / "pyproject.toml"
    deps = ", ".join(f'"{d}"' for d in dependencies)
    pyproject.write_text(f'[project]\nname = "x"\ndependencies = [{deps}]\n')
    return pyproject


def _make_dist(vendor_dir, dist, modules, requires=()):
    dist_info = vendor_dir / f"{dist.replace('-', '_')}-1.0.dist-info"
    dist_info.mkdir(parents=True, exist_ok=True)
    metadata = [f"Name: {dist}"] + [f"Requires-Dist: {r}" for r in requires]
    (dist_info / "METADATA").write_text("\n".join(metadata) + "\n")
    record = []
    for module in modules:
        if module.endswith(".py"):
            (vendor_dir / module).write_text("")
            record.append(f"{module},,")
        else:
            (vendor_dir / module).mkdir(exist_ok=True)
            (vendor_dir / module / "__init__.py").write_text("real")
            record.append(f"{module}/__init__.py,,")
    record.append(f"{dist_info.name}/METADATA,,")
    (dist_info / "RECORD").write_text("\n".join(record) + "\n")


def _make_closure(vendor_dir):
    _make_dist(vendor_dir, "streamlit", ["streamlit"], ["pandas", "numpy", "altair"])
    _make_dist(vendor_dir, "pandas", ["pandas"], ["numpy", "pytz", "python-dateutil"])
    _make_dist(vendor_dir, "numpy", ["numpy"])
    _make_dist(vendor_dir, "pytz", ["pytz"])
    _make_dist(vendor_dir, "python-dateutil", ["dateutil"], ["six"])
    _make_dist(vendor_dir, "six", ["six.py"])
    # A metadata-rootless dist (like the pyarrow shim's fastparquet): vendored
    # deliberately, so it must survive unless the mock breaks it.
    _make_dist(vendor_dir, "fastparquet", ["fastparquet"], ["pandas", "cramjam"])
    _make_dist(vendor_dir, "cramjam", ["cramjam"])
    _make_dist(vendor_dir, "altair", ["altair"])
    _make_dist(vendor_dir, "bokeh", ["bokeh"])


def test_mock_packages_stubs_targets_and_collects_broken_and_orphaned(tmp_path):
    vendor_dir = tmp_path / "python_modules"
    _make_closure(vendor_dir)

    mock_packages(
        vendor_dir, _write_pyproject(tmp_path, ["requests>=2"]), ["pandas", "numpy"]
    )

    remaining = {entry.name for entry in vendor_dir.iterdir()}
    # Broken by the mock (fastparquet requires pandas) or orphaned once
    # pandas' subtree lost its last in-edge.
    assert not remaining & {
        "fastparquet",
        "cramjam",
        "pytz",
        "dateutil",
        "six.py",
        "fastparquet-1.0.dist-info",
        "pandas-1.0.dist-info",
    }
    # Kept: protected root, its surviving dep, and an unrelated rootless dist.
    assert {"streamlit", "altair", "bokeh"} <= remaining
    # The mocked dists are replaced by the hand-tuned stubs.
    assert "stand-in" in (vendor_dir / "pandas" / "__init__.py").read_text()
    assert "stand-in" in (vendor_dir / "numpy" / "__init__.py").read_text()


def test_mock_packages_keeps_everything_reachable_without_mocks_breaking_it(
    tmp_path,
):
    vendor_dir = tmp_path / "python_modules"
    _make_closure(vendor_dir)

    mock_packages(vendor_dir, _write_pyproject(tmp_path, []), ["altair"])

    remaining = {entry.name for entry in vendor_dir.iterdir()}
    # Only altair changes; pandas and the fastparquet chain are untouched.
    assert {"pandas", "numpy", "fastparquet", "cramjam", "pytz"} <= remaining
    generated = (vendor_dir / "altair" / "__init__.py").read_text()
    assert "--mock altair" in generated
    assert "real" not in generated


def test_mock_packages_rejects_requirements_that_need_mocked_packages(tmp_path):
    vendor_dir = tmp_path / "python_modules"
    _make_closure(vendor_dir)
    pyproject = _write_pyproject(tmp_path, ["Pandas==2.3.3", "requests"])

    with pytest.raises(SystemExit, match="Pandas"):
        mock_packages(vendor_dir, pyproject, ["pandas"])


def test_mock_packages_rejects_the_runtime_and_unknown_names(tmp_path):
    vendor_dir = tmp_path / "python_modules"
    _make_closure(vendor_dir)
    pyproject = _write_pyproject(tmp_path, [])

    with pytest.raises(SystemExit, match="runtime itself"):
        mock_packages(vendor_dir, pyproject, ["streamlit"])
    with pytest.raises(SystemExit, match="not in the vendored runtime"):
        mock_packages(vendor_dir, pyproject, ["left-pad"])


def test_pack_modules_archive_extracts_safely_with_data_filter(tmp_path):
    """End-to-end packaging path: the app package tars, extracts under the
    same "data" filter the Worker's loader uses, contains no link members,
    and the entrypoint is a readable regular file afterwards."""
    vendor_dir = tmp_path / "python_modules"
    app_dir = vendor_dir / "_stlite_cloudflare_app"
    app_dir.mkdir(parents=True)
    (app_dir / "streamlit_app.py").write_text("import streamlit as st\n")
    (app_dir / "__init__.py").write_text("")
    dest_dir = tmp_path / "assets"

    pack_modules(vendor_dir, dest_dir)

    archive = dest_dir / "extracted-modules.tar.gz"
    with tarfile.open(archive) as tar:
        assert not any(m.issym() or m.islnk() for m in tar.getmembers())
        extract_target = tmp_path / "extracted"
        tar.extractall(extract_target, filter="data")

    entrypoint = extract_target / "_stlite_cloudflare_app" / "streamlit_app.py"
    assert entrypoint.is_file()
    assert "streamlit" in entrypoint.read_text()
