import numpy as np
import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    df = pd.DataFrame(np.random.randn(10, 5), columns=("col %d" % i for i in range(5)))
    return df


df = load_data()

st.table(df)
