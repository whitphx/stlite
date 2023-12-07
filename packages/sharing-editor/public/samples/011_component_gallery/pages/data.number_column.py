import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        {
            "price": [20, 950, 250, 500],
        }
    )


data_df = load_data()

st.data_editor(
    data_df,
    column_config={
        "price": st.column_config.NumberColumn(
            "Price (in USD)",
            help="The price of the product in USD",
            min_value=0,
            max_value=1000,
            step=1,
            format="$%d",
        )
    },
    hide_index=True,
)
