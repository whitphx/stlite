import subprocess
import sys
import textwrap

import pandas as pd
import pytest

from stlite_lib.runtime_init import mock_pyarrow

_SHIM_MODULES = ("pyarrow", "pyarrow.compute", "pyarrow.types")


@pytest.fixture
def stub_pyarrow(monkeypatch):
    # setitem records each entry to restore, so the shim's modules don't
    # outlive the test, and the real pyarrow is back for the next one.
    for name in _SHIM_MODULES:
        monkeypatch.setitem(sys.modules, name, None)
    mock_pyarrow()
    return sys.modules["pyarrow"]


@pytest.fixture
def stub_pyarrow_without_writer(monkeypatch, stub_pyarrow):
    # As in a Worker built with `--mock pandas` (or `--slim`), which removes the
    # writer along with pandas. A None entry makes the import raise ImportError.
    monkeypatch.setitem(sys.modules, "arrow_ipc_writer", None)
    return stub_pyarrow


def test_mock_pyarrow_registers_the_stub(stub_pyarrow):
    assert stub_pyarrow.__version__ == "0.0.1"
    assert stub_pyarrow.__stlite_stub__ is True


def test_submodules_can_be_imported(stub_pyarrow):
    import pyarrow.compute as pc
    import pyarrow.types

    assert pc is stub_pyarrow.compute
    assert pyarrow.types is stub_pyarrow.types


def test_errors_are_the_writers(stub_pyarrow):
    import arrow_ipc_writer

    assert stub_pyarrow.ArrowInvalid is arrow_ipc_writer.ArrowInvalid
    assert stub_pyarrow.ArrowTypeError is arrow_ipc_writer.ArrowTypeError


def test_serializes_a_dataframe(stub_pyarrow):
    table = stub_pyarrow.Table.from_pandas(pd.DataFrame({"a": [1, 2]}))
    assert isinstance(table, stub_pyarrow.Table)
    assert table.num_rows == 2
    assert stub_pyarrow.types.is_integer(table.schema.field(0).type)

    sink = stub_pyarrow.BufferOutputStream()
    writer = stub_pyarrow.RecordBatchStreamWriter(sink, table.schema)
    writer.write_table(table)
    writer.close()
    assert sink.getvalue().to_pybytes().startswith(b"\xff\xff\xff\xff")


@pytest.mark.parametrize(
    "use",
    [
        pytest.param(lambda pa: pa.ipc, id="unknown attribute"),
        pytest.param(lambda pa: pa.compute.sum, id="unknown compute function"),
        pytest.param(lambda pa: pa.types.is_map_or_whatever, id="unknown predicate"),
        pytest.param(
            lambda pa: pa.Table.from_pandas(pd.DataFrame()).to_pandas(),
            id="unknown Table method",
        ),
    ],
)
def test_unsupported_use_says_what_the_stand_in_covers(stub_pyarrow, use):
    with pytest.raises(stub_pyarrow.PyarrowUnavailableError, match="stand-in"):
        use(stub_pyarrow)


@pytest.mark.parametrize(
    "use",
    [
        pytest.param(
            lambda pa: pa.Table.from_pandas(pd.DataFrame()), id="Table.from_pandas"
        ),
        # Streamlit reads the exception classes before it serializes anything.
        pytest.param(lambda pa: pa.ArrowTypeError, id="error class"),
    ],
)
def test_arrow_use_without_the_writer_explains_that_it_is_unavailable(
    stub_pyarrow_without_writer, use
):
    with pytest.raises(
        stub_pyarrow_without_writer.PyarrowUnavailableError, match="without pyarrow"
    ):
        use(stub_pyarrow_without_writer)


def test_unavailable_error_keeps_attribute_error_semantics(
    stub_pyarrow_without_writer,
):
    pa = stub_pyarrow_without_writer
    assert issubclass(pa.PyarrowUnavailableError, AttributeError)
    assert not hasattr(pa, "ArrowTypeError")
    assert getattr(pa, "ArrowTypeError", None) is None


def test_dunder_probes_get_a_plain_attribute_error(stub_pyarrow):
    with pytest.raises(AttributeError) as excinfo:
        stub_pyarrow.__path__  # noqa: B018
    assert type(excinfo.value) is AttributeError


def test_constructors_are_not_for_direct_use(stub_pyarrow):
    with pytest.raises(TypeError):
        stub_pyarrow.Table()


def test_data_format_isinstance_checks_still_work(stub_pyarrow_without_writer):
    # Streamlit's data-format detection runs for non-Arrow elements too, even
    # where the writer is missing.
    pa = stub_pyarrow_without_writer
    assert not isinstance(object(), pa.Table)
    assert not isinstance([1, 2], pa.Array)


def test_installing_the_stub_imports_neither_the_writer_nor_numpy():
    # Apps that never show a dataframe shouldn't pay for importing them.
    script = textwrap.dedent(
        """
        import sys

        from stlite_lib.runtime_init import mock_pyarrow

        mock_pyarrow()
        import pyarrow

        isinstance(object(), pyarrow.Table)
        print(sorted({"numpy", "arrow_ipc_writer"} & set(sys.modules)))
        """
    )
    result = subprocess.run(
        [sys.executable, "-c", script], capture_output=True, text=True, check=True
    )
    assert result.stdout.strip() == "[]"
