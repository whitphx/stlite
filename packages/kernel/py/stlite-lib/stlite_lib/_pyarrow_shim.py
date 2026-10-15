# The pyarrow stand-in for Stlite runtimes that ship without pyarrow, which is
# @stlite/cloudflare: Pyodide's pyarrow wasm build is ~43 MiB unpacked, beyond
# the Worker script limit, and loading it takes ~48 MiB of wasm memory out of
# the isolate's 128 MB. The browser runtime installs the real pyarrow instead.
#
# mock_pyarrow() (runtime_init.py) reads this file's source and installs it as
# `sys.modules["pyarrow"]`, so it must stay self-contained (no imports).
#
# `import pyarrow` succeeds, so Streamlit imports and every element that doesn't
# serialize data through Arrow works. Streamlit's data-format detection checks
# `isinstance(data, pyarrow.Table)` and `pyarrow.Array`, so those exist as
# classes that can never be instantiated. Any other attribute raises
# `PyarrowUnavailableError`, an `AttributeError` subclass so that `hasattr()`
# and `getattr(pyarrow, name, default)` keep their usual meaning.

__version__ = "0.0.1"

# Lets Stlite tell this stub from the real pyarrow (see bootstrap._fix_altair).
__stlite_stub__ = True

_UNAVAILABLE_MESSAGE = (
    "This Stlite runtime ships without pyarrow, so elements that send data "
    "through Arrow are unavailable: st.dataframe, st.data_editor, st.table, "
    "st.write with a dataframe, and charts such as st.line_chart, st.bar_chart "
    "and st.altair_chart. @stlite/cloudflare omits pyarrow because it exceeds "
    "the Cloudflare Workers script size and memory limits."
)


class PyarrowUnavailableError(AttributeError):
    pass


def _unavailable(name):
    return PyarrowUnavailableError(f"{_UNAVAILABLE_MESSAGE} (pyarrow.{name})")


def __getattr__(name):
    if name.startswith("__") and name.endswith("__"):
        # Import machinery and introspection probe dunders such as `__path__`;
        # report them missing the ordinary way.
        raise AttributeError(name)
    raise _unavailable(name)


class Table:
    def __init__(self, *args, **kwargs):
        raise _unavailable("Table")

    @classmethod
    def from_pandas(cls, *args, **kwargs):
        raise _unavailable("Table.from_pandas")


class Array:
    def __init__(self, *args, **kwargs):
        raise _unavailable("Array")

    @classmethod
    def from_pandas(cls, *args, **kwargs):
        raise _unavailable("Array.from_pandas")


class ChunkedArray:
    def __init__(self, *args, **kwargs):
        raise _unavailable("ChunkedArray")
