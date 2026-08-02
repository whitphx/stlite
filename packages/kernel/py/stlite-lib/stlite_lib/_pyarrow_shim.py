# The single source of truth for the pyarrow shim. Stlite's Streamlit fork
# excludes the real pyarrow (not Pyodide-compatible), so `import pyarrow` must
# resolve to this stub: attribute access raises a clear "unsupported" error.
#
# This module is exec'd as the fake `pyarrow` module, so it must stay
# self-contained (no imports). It is consumed two ways:
#   - Cloudflare / server runtime: mock_pyarrow() (runtime_init.py) reads this
#     file's source and installs it via sys.modules.
#   - Browser worker: worker-runtime.ts imports this file's source (Vite `?raw`,
#     inlined at bundle time) and registers it with micropip before installing
#     packages.

__version__ = "0.0.1"


class Table:
    @classmethod
    def from_pandas(cls, *args, **kwargs):
        raise NotImplementedError("stlite does not support pyarrow.Table.from_pandas.")


class Array:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite does not support this pyarrow type.")


class ChunkedArray:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite does not support this pyarrow type.")
