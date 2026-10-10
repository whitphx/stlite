import pandas as pd
import streamlit as st

data_df = pd.DataFrame(
    {
        "description": [
            "# Title\n\nThis is **bold** text",
            "## Subtitle\n\n- Item 1\n- Item 2",
            "Regular text with `code`",
        ],
    }
)

st.dataframe(
    data_df,
    column_config={
        "description": st.column_config.MarkdownColumn(
            "Description",
            help="Markdown formatted text",
            width="large",
        ),
    },
    hide_index=True,
)
