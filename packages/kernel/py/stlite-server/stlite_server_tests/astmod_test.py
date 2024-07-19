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
""",
            """
import streamlit as st

await st.write_stream("Hello, world!")
""",
        ),
        (
            """
import streamlit as st

if True:
    st.write_stream("Hello, world!")
elif False:
    st.write_stream("Hello, world!")
else:
    st.write_stream("Goodbye, world!")
""",
            """
import streamlit as st

if True:
    await st.write_stream("Hello, world!")
elif False:
    await st.write_stream("Hello, world!")
else:
    await st.write_stream("Goodbye, world!")
""",
        ),
        (
            """
import streamlit as st

while True:
    st.write_stream(i)
else:
    st.write_stream("Goodbye, world!")
""",
            """
import streamlit as st

while True:
    await st.write_stream(i)
else:
    await st.write_stream("Goodbye, world!")
""",
        ),
        (
            """
import streamlit as st

for _ in range(10):
    st.write_stream(i)
else:
    st.write_stream("Goodbye, world!")
""",
            """
import streamlit as st

for _ in range(10):
    await st.write_stream(i)
else:
    await st.write_stream("Goodbye, world!")
""",
        ),
        (
            """
import streamlit as st

try:
    st.write_stream("Hello, world!")
except ValueError:
    st.write_stream("Hello, world!")
except TypeError:
    st.write_stream("Hello, world!")
except:
    st.write_stream("Hello, world!")
finally:
    st.write_stream("Hello, world!")
""",
            """
import streamlit as st

try:
    await st.write_stream("Hello, world!")
except ValueError:
    await st.write_stream("Hello, world!")
except TypeError:
    await st.write_stream("Hello, world!")
except:
    await st.write_stream("Hello, world!")
finally:
    await st.write_stream("Hello, world!")
""",
        ),
        (
            """
import streamlit as st

try:
    st.write_stream("Hello, world!")
except* ValueError:
    st.write_stream("Hello, world!")
except* TypeError:
    st.write_stream("Hello, world!")
finally:
    st.write_stream("Hello, world!")
""",
            """
import streamlit as st

try:
    await st.write_stream("Hello, world!")
except* ValueError:
    await st.write_stream("Hello, world!")
except* TypeError:
    await st.write_stream("Hello, world!")
finally:
    await st.write_stream("Hello, world!")
""",
        ),
        (
            """
import streamlit as st

match x:
    case 1:
        st.write_stream("Hello, world!")
    case 2:
        st.write_stream("Hello, world!")
    case _:
        st.write_stream("Hello, world!")
""",
            """
import streamlit as st

match x:
    case 1:
        await st.write_stream("Hello, world!")
    case 2:
        await st.write_stream("Hello, world!")
    case _:
        await st.write_stream("Hello, world!")
""",
        ),
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
