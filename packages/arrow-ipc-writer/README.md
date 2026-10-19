# arrow-ipc-writer

A pure-Python writer for the [Arrow IPC streaming format](https://arrow.apache.org/docs/format/Columnar.html#ipc-streaming-format).
It turns pandas DataFrames into Arrow streams on runtimes where pyarrow is not available, such as Cloudflare Python Workers.

The output aims to match `pyarrow.Table.from_pandas`. That covers:

- the Arrow types it infers for each column and index level;
- the `"pandas"` schema metadata, which Streamlit's frontend reads to restore the index and column types;
- the exception class it raises for a column it can't convert (`ArrowInvalid`, `ArrowTypeError`, `ArrowNotImplementedError`, `OverflowError`, `TypeError`). Streamlit decides from the class whether to convert the column to strings and retry.

For `object` columns this means reproducing pyarrow's type inference, which depends on the order of the values: `["a", 1]` is a string column that fails on `1` with `ArrowTypeError`, while `[1, "a"]` is an int64 column that fails on `"a"` with `ArrowInvalid`.

The tests check all of this by reading each stream back with pyarrow and comparing it with what pyarrow builds from the same DataFrame, or with the exception pyarrow raises.

```python
import pandas as pd
from arrow_ipc_writer import dataframe_to_ipc

data = dataframe_to_ipc(pd.DataFrame({"a": [1, 2, 3]}))
```

`arrow_ipc_writer.compute` selects and sorts a table's rows as pyarrow's `Table.take`, `Table.slice` and `pyarrow.compute.sort_indices` do, which Streamlit uses to serve large dataframes in sorted chunks.

@stlite/cloudflare uses this package through the pyarrow stand-in in stlite-lib (`stlite_lib/_pyarrow_shim.py`), which Streamlit imports as `pyarrow` there.

## Supported types

| pandas / Python                                 | Arrow                                                   |
| ----------------------------------------------- | ------------------------------------------------------- |
| numpy bool, int, uint, float16/32/64            | bool, int, uint, halffloat/float/double                 |
| nullable `Int*`, `UInt*`, `Float*`, `boolean`   | the same, with nulls                                    |
| `str`, `object` strings, python-backed `string` | string                                                  |
| `bytes`, numpy `S`                              | binary                                                  |
| `datetime64[s/ms/us/ns]`, with or without tz    | timestamp                                               |
| `datetime64[D]`, `datetime.date`                | date32                                                  |
| `timedelta64`, `datetime.timedelta`             | duration                                                |
| `datetime.time`                                 | time64[us]                                              |
| `decimal.Decimal`                               | decimal128, or decimal256 above 38 digits               |
| `category`, including `pd.cut`'s intervals      | dictionary                                              |
| `interval`, `period`                            | the `pandas.interval` / `pandas.period` extension types |
| lists, tuples, sets, numpy arrays               | list                                                    |
| dicts                                           | struct                                                  |

Not supported: nested dictionary arrays (a categorical inside a list or struct), and anything pyarrow itself rejects.
pandas `string` columns backed by pyarrow go through Python objects, so they come out as `string`, where pyarrow writes `large_string`.

## Development

In this directory:

```sh
uv run --package arrow-ipc-writer pytest
uv run --package arrow-ipc-writer ruff check . && uv run --package arrow-ipc-writer ruff format --check .
uv run --package arrow-ipc-writer pyright
# On the Python, pandas and numpy versions of @stlite/cloudflare's runtime,
# read from its Pyodide lockfile (needs `make node_modules`).
scripts/test-on-cloudflare-runtime.sh
```

`pandas_compat.py` is ported from pyarrow's module of the same name (Apache License 2.0); see [NOTICE](NOTICE).
