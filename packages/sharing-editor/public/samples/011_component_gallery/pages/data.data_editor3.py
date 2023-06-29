import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        {
            "name": [
                "Kelly Kelley",
                "Nicole Nguyen MD",
                "Ethan Turner",
                "Todd Burton",
                "Justin Garcia",
            ],
            "age": [75, 9, 39, 28, 89],
            "gender": ["female", "other", "male", "female", "other"],
            "is_active": [True, True, False, True, False],
            "status": [0.71, 0.47, 0.6, 0.26, 0.9],
            "homepage": [
                "http://edwards.com/",
                "https://www.cole.net/",
                "https://www.baird-garner.info/",
                "https://www.porter.biz/",
                "http://ward-romero.org/",
            ],
        }
    )


df = load_data()
edited_df = st.data_editor(df, use_container_width=True, num_rows="dynamic")
