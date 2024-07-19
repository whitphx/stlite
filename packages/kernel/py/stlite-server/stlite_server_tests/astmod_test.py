import ast

import pytest

from stlite_server.astmod import patch


@pytest.mark.parametrize(
    "test_input,expected",
    [
        (
            """
import streamlit as st

st.write_stream("Hello, world!")

try:
    st.write_stream("Hello, world!")
except:
    pass

if True:
    st.write_stream("Hello, world!")
""",
            """
import streamlit as st

await st.write_stream("Hello, world!")

try:
    await st.write_stream("Hello, world!")
except:
    pass

if True:
    await st.write_stream("Hello, world!")
""",
        )
    ],
)
def test_convert_st_write_stream(test_input, expected):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree) == ast.dump(ast.parse(expected, "test.py", "exec"))


@pytest.mark.parametrize(
    "test_input,expected",
    [
        (
            """
import asyncio
import time

time.sleep(1)
""",
            """
import asyncio
import time

await asyncio.sleep(1)
""",
        ),
        (
            """
import time

time.sleep(1)
""",
            """
import asyncio
import time

await asyncio.sleep(1)
""",
        ),
        (
            """
import time

time.sleep(1)

import asyncio
""",
            """
import asyncio  # Add `asyncio` import before the converted `asyncio.sleep` call
import time

await asyncio.sleep(1)

import asyncio
""",
        ),
        (
            """  # Case of FromImport
from time import sleep

sleep(1)
""",
            """
import asyncio
from time import sleep

await asyncio.sleep(1)
""",
        ),
    ],
)
def test_convert_time_sleep_to_asyncio_sleep(test_input, expected):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree) == ast.dump(ast.parse(expected, "test.py", "exec"))
