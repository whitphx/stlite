import os
from pathlib import Path
from typing import Iterator, Optional

from stlite_cli._proto.models import AppData, File

TEXT_EXTS = frozenset({".py", ".txt", ".csv", ".md", ".json", ".yml", ".yaml", ".toml"})
IGNORED_DIRS = frozenset({".git", "__pycache__", ".venv", "node_modules"})


def build_app_data(
    *,
    project_dir: Path,
    entrypoint: str,
    requirements_path: Optional[Path],
) -> AppData:
    if not (project_dir / entrypoint).exists():
        raise ValueError(
            f"Entrypoint not found: {entrypoint} (looked in {project_dir})"
        )

    files = collect_files(project_dir)

    if requirements_path is None:
        default = project_dir / "requirements.txt"
        requirements_path = default if default.exists() else None
    requirements = read_requirements(requirements_path) if requirements_path else []

    return AppData(entrypoint=entrypoint, files=files, requirements=requirements)


def collect_files(root: Path) -> dict[str, File]:
    rel_paths: list[str] = [
        abs_path.relative_to(root).as_posix()
        for abs_path in walk(root, {os.path.realpath(root)})
    ]
    # Sort lexicographically so the proto map is built in deterministic order;
    # both ts-proto (JS) and betterproto (Python) serialize map entries in
    # iteration order, so matching the order across runtimes is what gives us
    # byte-identical output.
    # Note: Python's sorted() compares Unicode code points, while JS's
    # Array.prototype.sort() compares UTF-16 code units. The two agree for
    # the BMP but can disagree for astral-plane characters (e.g. emoji) in
    # filenames — a real but rare edge case. Mirror any change here in the
    # JS collectFiles().
    rel_paths.sort()

    out: dict[str, File] = {}
    for rel in rel_paths:
        abs_path = root / rel
        if abs_path.suffix.lower() in TEXT_EXTS:
            # newline="" disables Python's universal-newline translation so
            # CRLF-authored files survive verbatim — the JS side reads bytes
            # without translation, and parity requires we do the same.
            out[rel] = File(text=abs_path.read_text(encoding="utf-8", newline=""))
        else:
            out[rel] = File(data=abs_path.read_bytes())
    return out


def walk(root: Path, visited_dirs: set[str]) -> Iterator[Path]:
    for entry in sorted(root.iterdir(), key=lambda p: p.name):
        if entry.is_dir():
            if entry.name in IGNORED_DIRS:
                continue
            # Symlink loop guard: a symlink pointing back into an ancestor
            # would recurse forever. realpath collapses the link; if we've
            # already visited that target, skip.
            real = os.path.realpath(entry)
            if real in visited_dirs:
                continue
            visited_dirs.add(real)
            yield from walk(entry, visited_dirs)
        elif entry.is_file():
            if entry.name.endswith(".pyc"):
                continue
            yield entry


def read_requirements(path: Path) -> list[str]:
    return [
        line.strip()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]
