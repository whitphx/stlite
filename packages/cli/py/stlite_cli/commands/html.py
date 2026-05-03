import sys
from pathlib import Path
from typing import Optional

import click

from stlite_cli.app_data import build_app_data
from stlite_cli.export_html import export_as_html

# Default version of @stlite/browser the exported page loads from JSDelivr.
# Bumped per release; override with --runtime-version when targeting a specific build.
DEFAULT_RUNTIME_VERSION = "1.7.2"


@click.command()
@click.argument(
    "project_path",
    metavar="PATH",
    type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path),
)
@click.option(
    "--entrypoint",
    default="app.py",
    show_default=True,
    help="Entrypoint script path, relative to PATH.",
)
@click.option(
    "--requirements",
    "requirements_path",
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
    help="Path to a requirements.txt file (defaults to PATH/requirements.txt if present).",
)
@click.option(
    "--out",
    "-o",
    "out_path",
    type=click.Path(dir_okay=False, path_type=Path),
    help="Write output to a file instead of stdout.",
)
@click.option(
    "--runtime-version",
    default=DEFAULT_RUNTIME_VERSION,
    show_default=True,
    help="Version of @stlite/browser the exported page loads from JSDelivr.",
)
def html(
    project_path: Path,
    entrypoint: str,
    requirements_path: Optional[Path],
    out_path: Optional[Path],
    runtime_version: str,
) -> None:
    """Convert a local Streamlit project into a single self-contained HTML file."""
    try:
        app_data = build_app_data(
            project_dir=project_path,
            entrypoint=entrypoint,
            requirements_path=requirements_path,
        )
    except ValueError as exc:
        raise click.ClickException(str(exc)) from exc

    output = export_as_html(app_data, runtime_version=runtime_version)
    if out_path is not None:
        out_path.write_text(output, encoding="utf-8")
    else:
        sys.stdout.write(output)
