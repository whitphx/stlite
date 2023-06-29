from datetime import date

import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        {
            "birthday": [
                date(1980, 1, 1),
                date(1990, 5, 3),
                date(1974, 5, 19),
                date(2001, 8, 17),
            ]
        }
    )


data_df = load_data()

st.data_editor(
    data_df,
    column_config={
        "birthday": st.column_config.DateColumn(
            "Birthday",
            min_value=date(1900, 1, 1),
            max_value=date(2005, 1, 1),
            format="DD.MM.YYYY",
            step=1,
        ),
    },
    hide_index=True,
)
