import pandas as pd
import streamlit as st

data_df = pd.DataFrame(
    {
        "category": [
            ["exploration", "visualization"],
            ["llm", "visualization"],
            ["exploration"],
        ],
    }
)

st.dataframe(
    data_df,
    column_config={
        "category": st.column_config.MultiselectColumn(
            "App Categories",
            options=["exploration", "visualization", "llm"],
            color="primary",
            format_func=lambda x: x.capitalize(),
        ),
    },
)
