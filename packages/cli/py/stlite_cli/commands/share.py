from pathlib import Path

import click


@click.command()
@click.argument(
    "project_path",
    metavar="PATH",
    type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path),
)
def share(project_path: Path) -> None:
    """Convert a local Streamlit project into a Stlite Sharing URL."""
    click.echo(f"[share] TODO: generate sharing URL from {project_path}")
