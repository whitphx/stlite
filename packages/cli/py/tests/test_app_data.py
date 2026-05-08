from pathlib import Path

import betterproto
import pytest

from stlite_cli.app_data import build_app_data, collect_files


def _write(path: Path, content: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)


def test_build_app_data_strips_pip_comments_from_requirements(tmp_path: Path):
    """Per https://pip.pypa.io/en/stable/reference/requirements-file-format/#comments
    full-line `#` and inline ` #` are both comments. The parser must drop both."""
    _write(tmp_path / "app.py", b"")
    _write(
        tmp_path / "requirements.txt",
        b"# full-line comment\n"
        b"\n"  # blank line
        b"streamlit\n"
        b"matplotlib  # inline comment\n"
        b"  numpy   \n"  # leading/trailing whitespace
        b"# another comment\n",
    )

    data = build_app_data(
        project_dir=tmp_path, entrypoint="app.py", requirements_path=None
    )
    assert data.requirements == ["streamlit", "matplotlib", "numpy"]


def test_build_app_data_collects_text_and_binary(tmp_path: Path):
    _write(tmp_path / "app.py", b"import streamlit as st\n")
    _write(tmp_path / "data" / "blob.bin", b"\x00\x01\x02")
    _write(tmp_path / "requirements.txt", b"# c\nstreamlit\n")

    data = build_app_data(
        project_dir=tmp_path,
        entrypoint="app.py",
        requirements_path=None,
    )

    assert data.entrypoint == "app.py"
    assert data.requirements == ["streamlit"]
    assert set(data.files.keys()) == {"app.py", "data/blob.bin", "requirements.txt"}

    app_which, _ = betterproto.which_one_of(data.files["app.py"], "content")
    assert app_which == "text"

    bin_which, _ = betterproto.which_one_of(data.files["data/blob.bin"], "content")
    assert bin_which == "data"
    assert data.files["data/blob.bin"].data == b"\x00\x01\x02"


def test_build_app_data_preserves_crlf_in_text_files(tmp_path: Path):
    """Without `newline=""` the read collapses CRLF to LF, breaking parity with JS."""
    _write(tmp_path / "app.py", b"x = 1\n")
    _write(tmp_path / "notes.md", b"line one\r\nline two\r\n")

    data = build_app_data(
        project_dir=tmp_path, entrypoint="app.py", requirements_path=None
    )
    assert data.files["notes.md"].text == "line one\r\nline two\r\n"


def test_build_app_data_preserves_non_ascii_filenames(tmp_path: Path):
    _write(tmp_path / "app.py", b"x = 1\n")
    _write(tmp_path / "データ.txt", "日本語\n".encode("utf-8"))

    data = build_app_data(
        project_dir=tmp_path, entrypoint="app.py", requirements_path=None
    )
    assert "データ.txt" in data.files
    assert data.files["データ.txt"].text == "日本語\n"


def test_build_app_data_skips_ignored_dirs_and_pyc(tmp_path: Path):
    _write(tmp_path / "app.py", b"x = 1\n")
    _write(tmp_path / ".git" / "HEAD", b"ref")
    _write(tmp_path / "__pycache__" / "x.cpython-313.pyc", b"junk")
    _write(tmp_path / "node_modules" / "pkg" / "index.js", b"")
    _write(tmp_path / "real.pyc", b"junk")

    data = build_app_data(
        project_dir=tmp_path, entrypoint="app.py", requirements_path=None
    )
    assert set(data.files.keys()) == {"app.py"}


def test_build_app_data_rejects_missing_entrypoint(tmp_path: Path):
    _write(tmp_path / "other.py", b"")
    with pytest.raises(ValueError, match="Entrypoint not found"):
        build_app_data(
            project_dir=tmp_path, entrypoint="app.py", requirements_path=None
        )


def test_collect_files_handles_symlink_loop(tmp_path: Path):
    """A symlink pointing back into an ancestor must not be traversed.

    Without the guard, the walk descends into `loop/`, then `loop/loop/`,
    and so on — Python eventually hits its recursion limit and raises
    RecursionError, but the test would still go red noisily. The exact-set
    assertion below catches a subtler regression too: a guard that lets the
    loop be traversed *once* (so files appear under `loop/...` but not
    deeper) would pass `"app.py" in files` but fail `== {"app.py"}`.
    """
    _write(tmp_path / "app.py", b"")
    (tmp_path / "loop").symlink_to(tmp_path, target_is_directory=True)

    files = collect_files(tmp_path)
    assert set(files.keys()) == {"app.py"}
