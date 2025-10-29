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

st.data_editor(
    data_df,
    column_config={
        "category": st.column_config.MultiselectColumn(
            "App Categories",
            help="The categories of the app",
            options=[
                "exploration",
                "visualization",
                "llm",
            ],
            color=["#ffa421", "#803df5", "#00c0f2"],
            format_func=lambda x: x.capitalize(),
        ),
    },
)
