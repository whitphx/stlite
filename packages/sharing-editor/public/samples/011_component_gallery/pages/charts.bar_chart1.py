import numpy as np
import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    df = pd.DataFrame(
        {
            "col1": list(range(20)) * 3,
            "col2": np.random.randn(60),
            "col3": ["A"] * 20 + ["B"] * 20 + ["C"] * 20,
        }
    )
    return df


chart_data = load_data()

st.bar_chart(chart_data, x="col1", y="col2", color="col3")
