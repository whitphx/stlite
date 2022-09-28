// Since v0.19.0, Pyodide raises an exception when importing not pure Python 3 wheels, whose path does not end with "py3-none-any.whl",
// so configuration on file-loader here is necessary so that the hash is not included in the bundled URL.
// About this change on Pyodide, see the links below:
// https://github.com/pyodide/pyodide/pull/1859
// https://pyodide.org/en/stable/project/changelog.html#micropip
import TORNADO_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../py/tornado/dist/tornado-6.2-py3-none-any.whl"; // TODO: Extract the import statement to an auto-generated file like `_pypi.ts` in JupyterLite: https://github.com/jupyterlite/jupyterlite/blob/f2ecc9cf7189cb19722bec2f0fc7ff5dfd233d47/packages/pyolite-kernel/src/_pypi.ts
import PYARROW_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../py/stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl";
import STREAMLIT_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../../../streamlit/lib/dist/streamlit-1.12.0-py2.py3-none-any.whl";

export const tornado = TORNADO_WHEEL as unknown as string;
export const pyarrow = PYARROW_WHEEL as unknown as string;
export const streamlit = STREAMLIT_WHEEL as unknown as string;
