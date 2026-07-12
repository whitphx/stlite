import json
import subprocess
from pathlib import Path

PACKAGE_DIR = Path(__file__).resolve().parents[1]
CLI = PACKAGE_DIR / "bin" / "stlite-cloudflare.mjs"


def run_cli(*args: str, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["node", str(CLI), *args],
        capture_output=True,
        text=True,
        cwd=cwd,
    )


def test_init_scaffolds_project_with_wrangler_safe_name(tmp_path):
    result = run_cli("init", "My_App.2", cwd=tmp_path)
    assert result.returncode == 0, result.stderr

    project_dir = tmp_path / "My_App.2"

    # wrangler.jsonc's "name" only accepts lowercase alphanumerics and dashes.
    wrangler_config = json.loads((project_dir / "wrangler.jsonc").read_text())
    assert wrangler_config["name"] == "my-app-2"

    package_json = json.loads((project_dir / "package.json").read_text())
    assert package_json["name"] == "my-app-2"
    cli_version = json.loads((PACKAGE_DIR / "package.json").read_text())["version"]
    assert package_json["devDependencies"]["@stlite/cloudflare"] == f"^{cli_version}"

    assert (project_dir / ".gitignore").is_file()
    assert not (project_dir / "_gitignore").exists()
    assert (project_dir / "app" / "streamlit_app.py").is_file()
    assert (project_dir / "src" / "entry.py").is_file()


def test_init_refuses_non_empty_directory(tmp_path):
    project_dir = tmp_path / "occupied"
    project_dir.mkdir()
    (project_dir / "existing.txt").write_text("x")

    result = run_cli("init", "occupied", cwd=tmp_path)

    assert result.returncode == 1
    assert "not empty" in result.stderr
