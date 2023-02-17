import streamlit as st
import pandas as pd
import numpy as np

@st.cache_data
def load_data():
    df = pd.DataFrame(np.random.randn(200, 3), columns=["a", "b", "c"])
    return df

df = load_data()

st.vega_lite_chart(
    df,
    {
        "mark": {"type": "circle", "tooltip": True},
        "encoding": {
            "x": {"field": "a", "type": "quantitative"},
            "y": {"field": "b", "type": "quantitative"},
            "size": {"field": "c", "type": "quantitative"},
            "color": {"field": "c", "type": "quantitative"},
        },
    },
    use_container_width=True,
)
