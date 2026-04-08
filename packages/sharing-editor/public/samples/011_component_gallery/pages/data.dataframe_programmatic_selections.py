import pandas as pd
import streamlit as st
from numpy.random import default_rng as rng

df = pd.DataFrame(
    rng(0).standard_normal((12, 5)), columns=["a", "b", "c", "d", "e"]
)

if st.button("Select the first row"):
    st.session_state.data = {"selection": {"rows": [0]}}
if st.button("Select column a"):
    st.session_state.data = {"selection": {"columns": ["a"]}}
if st.button("Select the first cell of column a"):
    st.session_state.data = {"selection": {"cells": [[0, "a"]]}}

event = st.dataframe(
    df,
    key="data",
    on_select="rerun",
    selection_mode=["single-cell", "single-row", "single-column"],
)

event.selection
