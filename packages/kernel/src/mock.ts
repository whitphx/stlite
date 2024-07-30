import type { PyodideInterface } from "pyodide";

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

export function mockToml(pyodide: PyodideInterface) {
  pyodide.runPython(`
import micropip

micropip.add_mock_package(
    "toml", "0.10.1",
    modules={
        "toml": """
def load(f):
    import tomllib
    return tomllib.load(f)

def loads(s):
    import tomllib
    return tomllib.loads(s)

def dump(obj, f):
    raise NotImplementedError("stlite is not supporting this method.")

def dumps(obj):
    raise NotImplementedError("stlite is not supporting this method.")
"""
    }
)
`);
}
