import streamlit as st
import pandas as pd
import numpy as np


@st.cache_data
def load_data():
    return pd.DataFrame(np.random.randn(12, 5), columns=["a", "b", "c", "d", "e"])


df = load_data()

event = st.dataframe(
    df,
    key="data",
    on_select="rerun",
    selection_mode=["multi-row", "multi-column"],
)

event.selection
