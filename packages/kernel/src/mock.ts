import { PyodideInterface } from "pyodide";

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
"""
    }
)
`);
}
