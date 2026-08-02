import sys

import pytest

from stlite_lib.runtime_init import mock_pyarrow


def test_mock_pyarrow_registers_minimal_module(monkeypatch):
    monkeypatch.delitem(sys.modules, "pyarrow", raising=False)

    mock_pyarrow()

    pyarrow = sys.modules["pyarrow"]
    assert pyarrow.__version__ == "0.0.1"
    with pytest.raises(NotImplementedError):
        pyarrow.Table.from_pandas()
