import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        {
            "widgets": ["st.selectbox", "st.number_input", "st.text_area", "st.button"],
            "favorite": [True, False, False, True],
        }
    )


data_df = load_data()

st.data_editor(
    data_df,
    column_config={
        "favorite": st.column_config.CheckboxColumn(
            "Your favorite?",
            help="Select your **favorite** widgets",
            default=False,
        )
    },
    disabled=["widgets"],
    hide_index=True,
)
