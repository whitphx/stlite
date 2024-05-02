import streamlit as st

code = """
<style>
    p {
        color: red;
    }
</style>
"""
st.html(code)
st.markdown("Lorem ipsum")
