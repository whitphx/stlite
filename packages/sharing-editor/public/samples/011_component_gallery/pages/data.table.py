import pandas as pd
import streamlit as st
from numpy.random import default_rng as rng

df = pd.DataFrame(
    rng(0).standard_normal(size=(10, 5)), columns=("col %d" % i for i in range(5))
)

st.table(df)
