"""The writer runs where pyarrow can't be imported, as on Cloudflare Workers."""

import subprocess
import sys
import textwrap


def test_writes_without_pyarrow() -> None:
    script = textwrap.dedent(
        """
        import sys

        sys.modules["pyarrow"] = None  # Makes `import pyarrow` raise ImportError.

        import pandas as pd

        from arrow_ipc_writer import dataframe_to_ipc

        df = pd.DataFrame(
            {"s": ["a", None], "c": pd.Categorical(["x", "y"]), "i": [1, 2]},
            index=pd.Index(["p", "q"], name="k"),
        )
        sys.stdout.buffer.write(dataframe_to_ipc(df))
        """
    )
    result = subprocess.run(
        [sys.executable, "-c", script], capture_output=True, check=True
    )

    import pyarrow as pa

    table = pa.ipc.open_stream(result.stdout).read_all()
    assert table.column_names == ["s", "c", "i", "k"]
    assert table.to_pydict() == {
        "s": ["a", None],
        "c": ["x", "y"],
        "i": [1, 2],
        "k": ["p", "q"],
    }
