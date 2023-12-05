import numpy as np
import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    df = pd.DataFrame(
        np.random.randn(50, 20), columns=("col %d" % i for i in range(20))
    )
    return df


df = load_data()

st.dataframe(df)  # Same as st.write(df)
