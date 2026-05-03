import click

from stlite_cli.commands.html import html
from stlite_cli.commands.share import share


@click.group()
def main() -> None:
    """Command-line tools for Stlite."""


main.add_command(share)
main.add_command(html)


if __name__ == "__main__":
    main()
