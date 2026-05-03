from pathlib import Path

import click


@click.command()
@click.argument(
    "project_path",
    metavar="PATH",
    type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path),
)
def html(project_path: Path) -> None:
    """Convert a local Streamlit project into a single self-contained HTML file."""
    click.echo(f"[html] TODO: emit single-file HTML for {project_path}")
