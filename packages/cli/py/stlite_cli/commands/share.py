import base64
from pathlib import Path
from typing import Optional

import click

from stlite_cli._proto.models import AppData
from stlite_cli.app_data import build_app_data

SHARING_APP_URL = "https://share.stlite.net/"
EDITABLE_APP_URL = "https://edit.share.stlite.net/"
URL_HASH_PREFIX_ENCODED_APPDATA = "!"


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
    "--editable",
    is_flag=True,
    default=False,
    help="Emit an editor URL (https://edit.share.stlite.net/) instead of the viewer URL.",
)
def share(
    project_path: Path,
    entrypoint: str,
    requirements_path: Optional[Path],
    editable: bool,
) -> None:
    """Convert a local Streamlit project into a Stlite Sharing URL."""
    try:
        app_data = build_app_data(
            project_dir=project_path,
            entrypoint=entrypoint,
            requirements_path=requirements_path,
        )
    except ValueError as exc:
        raise click.ClickException(str(exc)) from exc

    base_url = EDITABLE_APP_URL if editable else SHARING_APP_URL
    click.echo(embed_app_data_to_url(base_url, app_data))


def embed_app_data_to_url(base_url: str, app_data: AppData) -> str:
    raw = bytes(app_data)
    # urlsafe_b64encode produces base64url with `-`/`_` for `+`/`/` and keeps `=`
    # padding; the JS encoder additionally swaps `=` to `,` to keep the hash free
    # of `=` characters, so we mirror that here.
    encoded = base64.urlsafe_b64encode(raw).decode("ascii").replace("=", ",")
    return f"{base_url}#{URL_HASH_PREFIX_ENCODED_APPDATA}{encoded}"
