import ast

import pytest

from stlite_lib.codemod import patch


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param(
            """
import streamlit

streamlit.write_stream("Hello, world!")
""",
            """
import streamlit

await streamlit.write_stream("Hello, world!")
""",
            id="basic_streamlit_write_stream",
        ),
        pytest.param(
            """
import streamlit as st

st.write_stream("Hello, world!")
""",
            """
import streamlit as st

await st.write_stream("Hello, world!")
""",
            id="streamlit_alias_write_stream",
        ),
        pytest.param(
            """
import streamlit as foo

foo.write_stream("Hello, world!")
""",
            """
import streamlit as foo

await foo.write_stream("Hello, world!")
""",
            id="custom_streamlit_alias_write_stream",
        ),
        pytest.param(
            """
import streamlit

foo = streamlit.write_stream
foo("Hello, world!")
""",
            """
import streamlit

foo = streamlit.write_stream
await foo("Hello, world!")
""",
            id="assigned_write_stream",
        ),
        pytest.param(
            """
import streamlit as st

a = st.write_stream("Hello, world!")
""",
            """
import streamlit as st

a = await st.write_stream("Hello, world!")
""",
            id="call_in_assignment_statement",
        ),
        pytest.param(
            """
import streamlit as st

if a := st.write_stream("Hello, world!"):
    pass
""",
            """
import streamlit as st

if a := await st.write_stream("Hello, world!"):
    pass
""",
            id="call_in_assignment_expression",
        ),
        pytest.param(
            """
from streamlit import write_stream

write_stream("Hello, world!")
""",
            """
from streamlit import write_stream

await write_stream("Hello, world!")
""",
            id="from_streamlit_import_write_stream",
        ),
        pytest.param(
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
            id="streamlit_write_stream_in_control_flow",
        ),
        pytest.param(
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
            id="streamlit_write_stream_in_loop",
        ),
        pytest.param(
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
            id="streamlit_write_stream_in_for_loop",
        ),
        pytest.param(
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
            id="streamlit_write_stream_in_try_except",
        ),
        pytest.param(
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
            id="streamlit_write_stream_in_try_except_star",
        ),
        pytest.param(
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
            id="streamlit_write_stream_in_match",
        ),
        pytest.param(
            """
import streamlit as st
def bar(name):
    foo(name)
def foo(name):
    st.write_stream("Hello " + name)
    for _ in range(10):
        st.write_stream("Hello " + name)
def baz(name):
    foo(name)
    qux(name)
def qux(name):
    baz(name)
foo("John")
bar("John")
baz("John")
""",
            """
import streamlit as st
async def bar(name):
    await foo(name)
async def foo(name):
    await st.write_stream("Hello " + name)
    for _ in range(10):
        await st.write_stream("Hello " + name)
async def baz(name):
    await foo(name)
    await qux(name)
async def qux(name):
    await baz(name)
await foo("John")
await bar("John")
await baz("John")
""",
            id="streamlit_write_stream_in_function_and_its_control_flow",
        ),
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
        pytest.param(
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
            id="asyncio_sleep_conversion",
        ),
        pytest.param(
            """
import time

time.sleep(1)
""",
            """
import asyncio as __asyncio__
import time

await __asyncio__.sleep(1)
""",
            id="asyncio_sleep_conversion_without_asyncio_import",
        ),
        pytest.param(
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
            id="asyncio_sleep_conversion_with_asyncio_import_at_end",
        ),
        pytest.param(  # Case of from-import
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
            id="asyncio_sleep_conversion_with_from_import",
        ),
        pytest.param(  # Case of from-import with a wildcard
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
            id="asyncio_sleep_conversion_with_from_import_wildcard",
        ),
        pytest.param(  # Case of import as
            """
import time as t

t.sleep(1)
""",
            """
import asyncio as __asyncio__
import time as t

await __asyncio__.sleep(1)
""",
            id="asyncio_sleep_conversion_with_import_as",
        ),
        pytest.param(
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
            id="asyncio_sleep_conversion_in_async_function",
        ),
        pytest.param(
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
            id="asyncio_sleep_conversion_in_async_function_with_from_import",
        ),
        pytest.param(
            """
from time import sleep

def foo():
    sleep(1)

foo()
""",
            """
from time import sleep

async def foo():
    import asyncio as __asyncio__
    await __asyncio__.sleep(1)

await foo()
""",
            id="asyncio_sleep_conversion_in_normal_function_with_from_import",
        ),
        pytest.param(
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
            id="asyncio_sleep_conversion_with_dynamic_resolution",
        ),
        pytest.param(
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
            id="asyncio_sleep_conversion_with_future_import",
        ),
        pytest.param(
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
            id="asyncio_sleep_conversion_with_future_import_and_docstring",
        ),
        pytest.param(
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
            id="asyncio_sleep_conversion_with_future_import_and_multiple_docstrings",
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
        pytest.param(
            """
def sleep(x):
    pass

sleep(1)
""",
            id="custom_sleep_function",
        ),
        pytest.param(
            """
import third_party_time as time

time.sleep(1)
""",
            id="third_party_time_sleep",
        ),
        pytest.param(
            """
import time

f = lambda: time.sleep(1)
f()
""",
            id="sleep_occurs_in_lambda",
        ),
        pytest.param(
            """
from time import sleep

del sleep

sleep(1)
""",
            id="deleted_sleep",
        ),
        pytest.param(
            """
from time import sleep

if x:
    sl = sleep  # The resolution of `sl` is not deterministic, so not converted.
else:
    sl = None

sl(1)
""",
            id="non_deterministic_resolution_binding_in_if_clause",
        ),
        pytest.param(
            """
from time import sleep

def foo():
    sl()

for _ in []:
    for _ in []:
        pass
    sl = sleep  # The resolution of `sl` is not deterministic, so not converted.
else:
    sl = None

sl(1)
""",
            id="non_deterministic_resolution_binding_in_for_loop",
        ),
        pytest.param(
            """
from time import sleep

while x:
    while y:
        pass
    sl = sleep  # The resolution of `sl` is not deterministic, so not converted.
else:
    sl = None

sl(1)
""",
            id="non_deterministic_resolution_binding_in_while_loop",
        ),
        pytest.param(
            """
from time import sleep

for sleep in [1, 2, 3]:
    pass

sleep(1)
""",
            id="sleep_bound_in_for_loop",
        ),
        pytest.param(
            """
from time import sleep

if sleep := True:
    pass

sleep(1)
""",
            id="sleep_bound_in_named_expression",
        ),
        pytest.param(
            """
import time

time.sleep = lambda x: x

time.sleep(1)
""",
            id="sleep_bound_to_lambda",
        ),
        pytest.param(
            """
from time import sleep

async def foo(sleep):  # The name `sleep` is bound to the function argument, so not converted.
    sleep(1)

foo()
""",
            id="sleep_in_code_block_bound_to_param",
        ),
        pytest.param(
            """
from time import sleep

async def foo():
    sleep = 1  # The name `sleep` is bound to the variable, so not converted.
    sleep(1)

foo()
""",
            id="sleep_in_code_block_local_variable",
        ),
        pytest.param(
            """
from time import sleep

async def foo():
    sleep(1)
    sleep = 1  # The name `sleep` is bound to this scope, even if the variable is defined after the call, so not converted.

foo()
""",
            id="sleep_in_code_block_unbound_local_variable",
        ),
        pytest.param(
            """
from time import sleep

async def foo():
    sleep(1)  # What this `sleep` can be resolved to is not clear, so not converted.

sleep = 1

foo()
""",
            id="sleep_in_code_block_amgiguous_resolution",
        ),
    ],
)
def test_not_convert_sleep(test_input):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree, indent=4) == ast.dump(
        ast.parse(test_input, "test.py", "exec"), indent=4
    )


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param(
            """
import streamlit as st

pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
pg.run()
""",
            """
import stlite_lib.async_utils as __stlite_lib_async_utils__
import streamlit as st

pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
await __stlite_lib_async_utils__.ensure_awaitable(pg.run())
""",
            id="basic_page",
        ),
        pytest.param(
            """
import streamlit as foo

pg = foo.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
pg.run()
""",
            """
import stlite_lib.async_utils as __stlite_lib_async_utils__
import streamlit as foo

pg = foo.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
await __stlite_lib_async_utils__.ensure_awaitable(pg.run())
""",
            id="non_standard_streamlit_alias_page",
        ),
        pytest.param(
            """
import streamlit as st

pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
foo = pg
foo.run()
pg.run()
""",
            """
import stlite_lib.async_utils as __stlite_lib_async_utils__
import streamlit as st

pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
foo = pg
await __stlite_lib_async_utils__.ensure_awaitable(foo.run())
await __stlite_lib_async_utils__.ensure_awaitable(pg.run())
""",
            id="page_object_assignment",
        ),
        pytest.param(
            """
import streamlit as st

pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
foo = pg.run
foo()
""",
            """
import stlite_lib.async_utils as __stlite_lib_async_utils__
import streamlit as st

pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
foo = pg.run
await __stlite_lib_async_utils__.ensure_awaitable(foo())
""",
            id="run_method_assignment",
        ),
        pytest.param(
            """
import streamlit as st

st.navigation([st.Page("page_1.py"), st.Page("page_2.py")]).run()
""",
            """
import stlite_lib.async_utils as __stlite_lib_async_utils__
import streamlit as st

await __stlite_lib_async_utils__.ensure_awaitable(st.navigation([st.Page("page_1.py"), st.Page("page_2.py")]).run())
""",
            id="page_run_without_assignment",
        ),
        pytest.param(
            """
import streamlit as st

foo = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")]).run
foo()
""",
            """
import stlite_lib.async_utils as __stlite_lib_async_utils__
import streamlit as st

foo = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")]).run
await __stlite_lib_async_utils__.ensure_awaitable(foo())
""",
            id="assigned_run_method",
        ),
        pytest.param(
            """
import streamlit as st

if True:
    pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])

pg.run()
""",
            """
import stlite_lib.async_utils as __stlite_lib_async_utils__
import streamlit as st

if True:
    pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])

await __stlite_lib_async_utils__.ensure_awaitable(pg.run())
""",
            id="conditioned_page_object",
        ),
    ],
)
def test_convert_page_run(test_input, expected):
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

pg = st.navigation([st.Page("page_1.py"), st.Page("page_2.py")])
await pg.run()
""",
            id="already_awaited_call",
        ),
    ],
)
def test_not_convert_page_run(test_input):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree, indent=4) == ast.dump(
        ast.parse(test_input, "test.py", "exec"), indent=4
    )


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param(
            """
import asyncio

async def main():
    return 42

asyncio.run(main())
""",
            """
import asyncio

async def main():
    return 42

await main()
""",
            id="asyncio_run_basic",
        ),
        pytest.param(
            """
import asyncio

async def main():
    return 42

awaitable = main()

asyncio.run(awaitable)
""",
            """
import asyncio

async def main():
    return 42

awaitable = main()

await awaitable
""",
            id="asyncio_run_non_function_call",
        ),
        pytest.param(
            """
from asyncio import run

async def main():
    return 42

run(main())
""",
            """
from asyncio import run

async def main():
    return 42

await main()
""",
            id="asyncio_run_from_import",
        ),
        pytest.param(
            """
from asyncio import *

async def main():
    return 42

run(main())
""",
            """
from asyncio import *

async def main():
    return 42

await main()
""",
            id="asyncio_run_wildcard_import",
        ),
    ],
)
def test_convert_asyncio_run(test_input, expected):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree, indent=4) == ast.dump(
        ast.parse(expected, "test.py", "exec"), indent=4
    )



@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param(
            """
from transformers import pipeline

classifier = pipeline("sentiment-analysis")

result = classifier("We are very happy to show you the 🤗 Transformers library.")
""",
            """
from transformers_js_py import pipeline

classifier = await pipeline("sentiment-analysis")

result = await classifier("We are very happy to show you the 🤗 Transformers library.")
""",
            id="transformers_pipeline",
        ),
    ],
)
def test_convert_transformers_js(test_input, expected):
    tree = patch(test_input, "test.py")
    assert ast.dump(tree, indent=4) == ast.dump(
        ast.parse(expected, "test.py", "exec"), indent=4
    )
