import pandas as pd
import streamlit as st
from numpy.random import default_rng as rng

df = pd.DataFrame(
    rng(0).standard_normal((20, 3)), columns=["col1", "col2", "col3"]
)
df["col4"] = rng(0).choice(["a", "b", "c"], 20)

st.scatter_chart(
    df,
    x="col1",
    y="col2",
    color="col4",
    size="col3",
)
