"""Import-satisfying stand-in for pandas for mocked builds.

Same idea as the numpy stub next door: Streamlit imports pandas eagerly at
boot, but a --slim app never touches dataframes, so classes exist for
isinstance checks and everything else raises with a pointer to the flag.
"""

from pandas import api as api  # noqa: F401  (keeps `pandas.api` importable)


class DataFrame: ...


class Series: ...


class Index: ...


class Categorical: ...


class Timestamp: ...


class NaT: ...


__version__ = "0.0.0-stlite-slim-stub"


def __getattr__(name):
    raise ModuleNotFoundError(
        f"pandas.{name} is unavailable: this Worker was built with "
        "--mock pandas (or its --slim alias). Rebuild without the flag "
        "to use it."
    )
