import streamlit as st

with st.container(horizontal=True, wrap=False):
    for label in ("Edit", "Duplicate", "Archive", "Delete"):
        st.button(label)
