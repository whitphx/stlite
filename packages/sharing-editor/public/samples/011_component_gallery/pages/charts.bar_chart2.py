import numpy as np
import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    df = pd.DataFrame(
        {
            "col1": list(range(20)),
            "col2": np.random.randn(20),
            "col3": np.random.randn(20),
        }
    )
    return df


chart_data = load_data()

st.bar_chart(
    chart_data, x="col1", y=["col2", "col3"], color=["#FF0000", "#0000FF"]  # Optional
)
