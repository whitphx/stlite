"""Import-satisfying stand-in for numpy in --slim builds.

Streamlit imports numpy eagerly at boot; this stub lets that import succeed
without shipping the real package (~2.6 MiB gzip of the Worker script). The
classes exist so Streamlit's isinstance checks are simply False; anything
else raises with a pointer back to the build flag.
"""


class ndarray: ...


class generic: ...


class integer(generic): ...


class floating(generic): ...


class bool_(generic): ...


class number(generic): ...


class dtype: ...


nan = float("nan")
inf = float("inf")

__version__ = "0.0.0-stlite-slim-stub"


def __getattr__(name):
    raise ModuleNotFoundError(
        f"numpy.{name} is unavailable: this Worker was built with --slim, "
        "which removes numpy. Rebuild without --slim to use it."
    )
