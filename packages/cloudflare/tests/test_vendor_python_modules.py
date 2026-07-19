import tarfile
import zipfile
from pathlib import Path

import pytest

from vendor_python_modules import (
    _entry_matches_package,
    install_runtime,
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


def test_vendor_prebuilt_fails_on_missing_wheel(tmp_path):
    vendor = tmp_path / "vendor"
    vendor.mkdir()
    snapshot = _make_snapshot(tmp_path, {})

    with pytest.raises(SystemExit, match="Missing Pyodide wheel"):
        vendor_prebuilt(vendor, snapshot, [("numpy", tmp_path / "nope.whl")])
