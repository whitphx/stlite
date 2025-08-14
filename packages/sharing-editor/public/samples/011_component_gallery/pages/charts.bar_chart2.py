import pandas as pd
import streamlit as st
from numpy.random import default_rng as rng

df = pd.DataFrame(
    {
        "col1": list(range(20)),
        "col2": rng(0).standard_normal(20),
        "col3": rng(1).standard_normal(20),
    }
)

st.bar_chart(
    df,
    x="col1",
    y=["col2", "col3"],
    color=["#FF0000", "#0000FF"],
)
