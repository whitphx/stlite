import sys

import pytest

from stlite_lib.runtime_init import mock_pyarrow


@pytest.fixture
def stub_pyarrow(monkeypatch):
    monkeypatch.delitem(sys.modules, "pyarrow", raising=False)
    mock_pyarrow()
    return sys.modules["pyarrow"]


def test_mock_pyarrow_registers_the_stub(stub_pyarrow):
    assert stub_pyarrow.__version__ == "0.0.1"
    assert stub_pyarrow.__stlite_stub__ is True


@pytest.mark.parametrize(
    "use",
    [
        pytest.param(lambda pa: pa.Table.from_pandas(None), id="Table.from_pandas"),
        pytest.param(lambda pa: pa.Array.from_pandas(None), id="Array.from_pandas"),
        pytest.param(lambda pa: pa.Table(), id="Table()"),
        # Streamlit reads the exception classes before it serializes anything.
        pytest.param(lambda pa: pa.ArrowTypeError, id="unknown attribute"),
    ],
)
def test_arrow_use_explains_that_pyarrow_is_unavailable(stub_pyarrow, use):
    with pytest.raises(stub_pyarrow.PyarrowUnavailableError, match="without pyarrow"):
        use(stub_pyarrow)


def test_unavailable_error_keeps_attribute_error_semantics(stub_pyarrow):
    assert issubclass(stub_pyarrow.PyarrowUnavailableError, AttributeError)
    assert not hasattr(stub_pyarrow, "ArrowTypeError")
    assert getattr(stub_pyarrow, "ArrowTypeError", None) is None


def test_dunder_probes_get_a_plain_attribute_error(stub_pyarrow):
    with pytest.raises(AttributeError) as excinfo:
        stub_pyarrow.__path__  # noqa: B018
    assert type(excinfo.value) is AttributeError


def test_data_format_isinstance_checks_still_work(stub_pyarrow):
    # Streamlit's data-format detection runs for non-Arrow elements too.
    assert not isinstance(object(), stub_pyarrow.Table)
    assert not isinstance([1, 2], stub_pyarrow.Array)
