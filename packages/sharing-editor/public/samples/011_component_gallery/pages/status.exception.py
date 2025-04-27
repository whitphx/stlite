import streamlit as st

e = RuntimeError("This is an exception of type RuntimeError")
st.exception(e)
