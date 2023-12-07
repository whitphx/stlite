import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        {
            "widgets": ["st.selectbox", "st.number_input", "st.text_area", "st.button"],
        }
    )


data_df = load_data()

st.data_editor(
    data_df,
    column_config={
        "widgets": st.column_config.Column(
            "Streamlit Widgets",
            help="Streamlit **widget** commands 🎈",
            width="medium",
            required=True,
        )
    },
    hide_index=True,
    num_rows="dynamic",
)
