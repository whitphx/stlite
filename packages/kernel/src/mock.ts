import type { PyodideInterface } from "pyodide";

// Duplicates stlite_lib.runtime_init.mock_pyarrow: this browser-side copy has
// to run before the stlite-lib wheel is installed, so it cannot import the
// Python implementation. Keep the two stubs in sync.
export function mockPyArrow(pyodide: PyodideInterface) {
  pyodide.runPython(`
import micropip
micropip.add_mock_package(
    "pyarrow", "0.0.1",
    modules={
        "pyarrow": """
__version__ = '0.0.1'  # TODO: Update when releasing


class Table:
    @classmethod
    def from_pandas(*args, **kwargs):
        raise NotImplementedError("stlite is not supporting this method.")


class Array:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite is not supporting PyArrow.Array")


class ChunkedArray:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite is not supporting PyArrow.ChunkedArray")
"""
    }
)
`);
}
