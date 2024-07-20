import ast

import pytest

from stlite_server.astmod import patch


@pytest.mark.parametrize(
    "test_input,expected",
    [
        (
            """
import streamlit

streamlit.write_stream("Hello, world!")
""",
            """
import streamlit

await streamlit.write_stream("Hello, world!")
""",
        ),
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
import streamlit as foo

foo.write_stream("Hello, world!")
""",
            """
import streamlit as foo

await foo.write_stream("Hello, world!")
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
        #         (
        #             """
        # import streamlit as st
        # def foo(name):
        #     st.write_stream("Hello " + name)
        # foo("John")
        # """,
        #             """
        # import streamlit as st
        # async def foo(name):
        #     await st.write_stream("Hello " + name)
        # await foo("John")
        # """,
        #         ),
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
        (  # Case of from-import
            """
from time import sleep

sleep(1)

def sleep(x):
    pass

sleep(1)  # This `sleep` is no longer the imported `time.sleep`, so not converted.
""",
            """
import asyncio
from time import sleep

await asyncio.sleep(1)

def sleep(x):
    pass

sleep(1)
""",
        ),
        (  # Case of import as
            """
import time as t

t.sleep(1)
""",
            """
import asyncio
import time as t

await asyncio.sleep(1)
""",
        ),
        (
            # When `time.sleep` is called in an async function, it can be converted to `await asyncio.sleep` straight away.
            """
import time

async def foo():
    time.sleep(1)
""",
            """
import asyncio
import time

async def foo():
    await asyncio.sleep(1)
""",
        ),
    ],
)
def test_convert_time_sleep_to_asyncio_sleep(test_input, expected):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree) == ast.dump(ast.parse(expected, "test.py", "exec"))


@pytest.mark.parametrize(
    "test_input",
    [
        # When the `sleep` object is not `time.sleep`.
        """
def sleep(x):
    pass

sleep(1)
""",
        # When the `sleep` object is not `time.sleep`.
        """
import third_party_time as time

time.sleep(1)
""",
        # When the `sleep` object is called in a lambda function. Lambda can't have await.
        """
import time

f = lambda: time.sleep(1)
f()
""",
        # When the `sleep` object is called in a normal function. FunctionDef can't have await.
        # We should convert sync function to async function. as well in the future,
        # but leave it as is for now because it's a bit complicated.
        """
import time

def foo():
    time.sleep()

foo()
""",
        """
from time import sleep

del sleep

sleep(1)
""",
        """
from time import sleep

for sleep in [1, 2, 3]:
    pass

sleep(1)
""",
        """
from time import sleep

if sleep := True:
    pass

sleep(1)
""",
    ],
)
def test_not_convert_sleep(test_input):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree) == ast.dump(ast.parse(test_input, "test.py", "exec"))