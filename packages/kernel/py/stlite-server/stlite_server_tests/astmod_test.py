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
    assert ast.dump(tree, indent=4) == ast.dump(
        ast.parse(expected, "test.py", "exec"), indent=4
    )


@pytest.mark.parametrize(
    "test_input",
    [
        pytest.param(
            """
import streamlit as st

await st.write_stream("Hello, world!")
""",
            id="already awaited call",
        ),
    ],
)
def test_not_convert_st_write_stream(test_input):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree, indent=4) == ast.dump(
        ast.parse(test_input, "test.py", "exec"), indent=4
    )


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
import asyncio as __asyncio__
import time

await __asyncio__.sleep(1)
""",
        ),
        (
            """
import time

time.sleep(1)

import asyncio
""",
            """
import asyncio as __asyncio__  # Add `asyncio` import before the converted `asyncio.sleep` call
import time

await __asyncio__.sleep(1)

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
import asyncio as __asyncio__
from time import sleep

await __asyncio__.sleep(1)

def sleep(x):
    pass

sleep(1)
""",
        ),
        (  # Case of from-import with a wildcard
            """
from time import *

sleep(1)

def sleep(x):
    pass

sleep(1)  # This `sleep` is no longer the imported `time.sleep`, so not converted.
""",
            """
import asyncio as __asyncio__
from time import *

await __asyncio__.sleep(1)

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
import asyncio as __asyncio__
import time as t

await __asyncio__.sleep(1)
""",
        ),
        (
            """
# When `time.sleep` is called in an async function, it can be converted to `await asyncio.sleep` straight away.
# Test the case with `import time`.
import time

async def foo():
    time.sleep(1)
""",
            """
import time

async def foo():
    import asyncio as __asyncio__
    await __asyncio__.sleep(1)
""",
        ),
        (
            # When `time.sleep` is called in an async function, it can be converted to `await asyncio.sleep` straight away.
            # Test the case with `from time import sleep`.
            """
from time import sleep

async def foo():
    sleep(1)
""",
            """
from time import sleep

async def foo():
    import asyncio as __asyncio__
    await __asyncio__.sleep(1)
""",
        ),
        (
            """
from time import sleep

sl = sleep
sl(1)

for _ in [1, 2]:
    sl(1)
    sl = lambda x: x

sl(1)

sl = sleep
sl(1)
""",
            """
import asyncio as __asyncio__
from time import sleep

sl = sleep
await __asyncio__.sleep(1)

for _ in [1, 2]:
    sl(1)  # The resolution of `sl` that is assigned in the control flow is not deterministic, so not converted.
    sl = lambda x: x

sl(1)

sl = sleep
await __asyncio__.sleep(1)
""",
        ),
        (
            """
from __future__ import annotations
import time

time.sleep(1)
""",
            """
from __future__ import annotations  # Keep the `from __future__ import annotations` at the very top.
import asyncio as __asyncio__
import time

await __asyncio__.sleep(1)
""",
        ),
        (
            """
\"\"\"Docstring
\"\"\"
from __future__ import annotations
import time

time.sleep(1)
""",
            """
\"\"\"Docstring
\"\"\"
from __future__ import annotations  # Keep the docstring and `from __future__ import annotations` at the very top.
import asyncio as __asyncio__
import time

await __asyncio__.sleep(1)
""",
        ),
        (
            """
\"\"\"Docstring
\"\"\"
\"\"\"Docstring2
\"\"\"
from __future__ import annotations
import time

time.sleep(1)
""",
            """
\"\"\"Docstring
\"\"\"
\"\"\"Docstring2
\"\"\"
from __future__ import annotations  # Keep the multiple docstrings and `from __future__ import annotations` at the very top.
import asyncio as __asyncio__
import time

await __asyncio__.sleep(1)
""",
        ),
    ],
)
def test_convert_time_sleep_to_asyncio_sleep(test_input, expected):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree, indent=4) == ast.dump(
        ast.parse(expected, "test.py", "exec"), indent=4
    )


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

if x:
    sl = sleep  # The resolution of `sl` is not deterministic, so not converted.

sl(1)
""",
        """
from time import sleep

def foo():
    sl()

for _ in []:
    for _ in []:
        pass
    sl = sleep  # The resolution of `sl` is not deterministic, so not converted.

sl(1)
""",
        """
from time import sleep

while x:
    while y:
        pass
    sl = sleep  # The resolution of `sl` is not deterministic, so not converted.

sl(1)
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
        """
import time

time.sleep = lambda x: x

time.sleep(1)
""",
        """
from time import sleep

async def foo(sleep):  # The name `sleep` is bound to the function argument, so not converted.
    sleep(1)

foo()
""",
        """
from time import sleep

async def foo():
    sleep = 1  # The name `sleep` is bound to the variable, so not converted.
    sleep(1)

foo()
""",
        """
from time import sleep

async def foo():
    sleep(1)
    sleep = 1  # The name `sleep` is bound to this scope, even if the variable is defined after the call, so not converted.

foo()
""",
        """
from time import sleep

async def foo():
    sleep(1)  # What this `sleep` can be resolved to is not clear, so not converted.

sleep = 1

foo()
""",
    ],
)
def test_not_convert_sleep(test_input):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree, indent=4) == ast.dump(
        ast.parse(test_input, "test.py", "exec"), indent=4
    )
