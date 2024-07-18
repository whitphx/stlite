import ast

from stlite_server.astmod import patch


def test_convert_st_write_stream():
    code = """
import streamlit as st

st.write_stream("Hello, world!")

try:
    st.write_stream("Hello, world!")
except:
    pass

if True:
    st.write_stream("Hello, world!")
"""
    expected = """
import streamlit as st

await st.write_stream("Hello, world!")

try:
    await st.write_stream("Hello, world!")
except:
    pass

if True:
    await st.write_stream("Hello, world!")
"""
    tree = patch(code, "test.py")
    assert ast.dump(tree) == ast.dump(ast.parse(expected, "test.py", "exec"))
