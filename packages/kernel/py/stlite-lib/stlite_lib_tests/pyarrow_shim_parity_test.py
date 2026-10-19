"""Streamlit must send the same thing to the frontend with the pyarrow shim as
with the real pyarrow.

Each scenario in pyarrow_shim_scenarios.py runs twice in a fresh interpreter:
once with the real pyarrow, once with the shim installed as the Cloudflare
runtime installs it. The elements both runs render are compared field by field,
with every Arrow payload decoded here, by the real pyarrow, and compared as a
table.
"""

from __future__ import annotations

import base64
import json
import os
import pickle
import subprocess
import sys
import textwrap
from pathlib import Path
from typing import Any

import pyarrow as pa
import pytest

from . import pyarrow_shim_scenarios

_STLITE_LIB_ROOT = Path(__file__).resolve().parent.parent
_PYTHONPATH = [
    _STLITE_LIB_ROOT / "../../../../streamlit/lib",
    _STLITE_LIB_ROOT / "../../../arrow-ipc-writer",
    _STLITE_LIB_ROOT,
]

_RUNNER = textwrap.dedent(
    """
    import pickle
    import sys

    if sys.argv[1] == "shim":
        from stlite_lib.runtime_init import mock_pyarrow

        mock_pyarrow()
        from stlite_lib.bootstrap import _fix_altair

        _fix_altair()

    import pandas as pd

    # Where the shim runs, pandas has no pyarrow, so its strings are backed by
    # Python objects; make the real-pyarrow run use them as well.
    pd.set_option("mode.string_storage", "python")

    from google.protobuf import json_format

    import streamlit as st
    from streamlit.delta_generator import DeltaGenerator
    from stlite_lib_tests.pyarrow_shim_scenarios import SCENARIOS

    elements = []
    enqueue = DeltaGenerator._enqueue

    def capturing_enqueue(self, delta_type, element_proto, *args, **kwargs):
        elements.append(
            (delta_type, json_format.MessageToDict(element_proto))
        )
        return enqueue(self, delta_type, element_proto, *args, **kwargs)

    DeltaGenerator._enqueue = capturing_enqueue

    results = {}
    for name, scenario in SCENARIOS.items():
        elements.clear()
        try:
            returned = scenario(st)
        except Exception as e:
            returned = ("raised", type(e).__name__, str(e))
        results[name] = (list(elements), returned)
    sys.stdout.buffer.write(pickle.dumps(results))
    """
)


def _render(mode: str) -> dict[str, Any]:
    env = {
        **os.environ,
        "PYTHONPATH": os.pathsep.join(str(path.resolve()) for path in _PYTHONPATH),
        "PYTHONHASHSEED": "0",
    }
    result = subprocess.run(
        [sys.executable, "-c", _RUNNER, mode],
        capture_output=True,
        env=env,
        check=False,
    )
    if result.returncode != 0:
        pytest.fail(f"The {mode} run failed:\n{result.stderr.decode()}")
    return pickle.loads(result.stdout)


@pytest.fixture(scope="module")
def renders() -> tuple[dict[str, Any], dict[str, Any]]:
    return _render("pyarrow"), _render("shim")


_IPC_STREAM_START = b"\xff\xff\xff\xff"


def _decoded_table(data: bytes) -> dict[str, Any]:
    table = pa.ipc.open_stream(data).read_all()
    table.validate(full=True)
    metadata = dict(table.schema.metadata or {})
    pandas_metadata = json.loads(metadata.pop(b"pandas", b"null"))
    if pandas_metadata is not None:
        # Names the library that wrote the stream.
        del pandas_metadata["creator"]
    return {
        "schema": table.schema.remove_metadata().to_string(),
        "fields_metadata": [field.metadata for field in table.schema],
        "pandas_metadata": pandas_metadata,
        "other_metadata": metadata,
        "rows": table.to_pylist(),
    }


def _without_dataset_names(element: dict[str, Any]) -> dict[str, Any]:
    """A chart element with its datasets' names, hashes of their Arrow bytes,
    replaced by their positions."""
    text = json.dumps(element)
    for i, dataset in enumerate(element.get("datasets", [])):
        text = text.replace(dataset["name"], f"dataset-{i}")
    return json.loads(text)


def _normalized(value: Any) -> Any:
    """`value` with every Arrow stream in it, bytes or base64 (as protobuf's
    JSON form has them), replaced by its decoded table.

    Element IDs and chart dataset names, which hash the Arrow bytes, are left
    out: those bytes legitimately differ in the library they name as their
    creator.
    """
    if isinstance(value, dict):
        if "datasets" in value:
            value = _without_dataset_names(value)
        return {key: _normalized(item) for key, item in value.items() if key != "id"}
    if isinstance(value, (list, tuple)):
        return [_normalized(item) for item in value]
    if isinstance(value, str):
        try:
            data = base64.b64decode(value, validate=True)
        except ValueError:
            return value
        if data.startswith(_IPC_STREAM_START):
            return _decoded_table(data)
        return value
    if isinstance(value, bytes) and value.startswith(_IPC_STREAM_START):
        return _decoded_table(value)
    return value


@pytest.mark.parametrize("name", list(pyarrow_shim_scenarios.SCENARIOS))
def test_scenario_matches_pyarrow(name: str, renders) -> None:
    with_pyarrow, with_shim = renders
    expected_elements, expected_returned = with_pyarrow[name]
    actual_elements, actual_returned = with_shim[name]

    assert not (
        isinstance(expected_returned, tuple) and expected_returned[0] == "raised"
    ), f"The scenario fails with the real pyarrow: {expected_returned}"
    assert expected_elements or expected_returned, "The scenario renders nothing"

    assert [delta_type for delta_type, _ in actual_elements] == [
        delta_type for delta_type, _ in expected_elements
    ]
    for (delta_type, actual), (_, expected) in zip(actual_elements, expected_elements):
        assert _normalized(actual) == _normalized(expected), delta_type
    assert _normalized(actual_returned) == _normalized(expected_returned)
