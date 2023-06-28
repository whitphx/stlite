import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        [
            {"command": "st.selectbox", "rating": 4, "is_widget": True},
            {"command": "st.balloons", "rating": 5, "is_widget": False},
            {"command": "st.time_input", "rating": 3, "is_widget": True},
        ]
    )


df = load_data()
st.dataframe(df, use_container_width=True)
