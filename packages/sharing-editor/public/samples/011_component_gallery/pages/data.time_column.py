from datetime import time

import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        {
            "appointment": [
                time(12, 30),
                time(18, 0),
                time(9, 10),
                time(16, 25),
            ]
        }
    )


data_df = load_data()

st.data_editor(
    data_df,
    column_config={
        "appointment": st.column_config.TimeColumn(
            "Appointment",
            min_value=time(8, 0, 0),
            max_value=time(19, 0, 0),
            format="hh:mm a",
            step=60,
        ),
    },
    hide_index=True,
)
