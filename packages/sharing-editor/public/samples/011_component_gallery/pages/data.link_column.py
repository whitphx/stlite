import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        {
            "apps": [
                "https://roadmap.streamlit.app",
                "https://extras.streamlit.app",
                "https://issues.streamlit.app",
                "https://30days.streamlit.app",
            ],
        }
    )


data_df = load_data()

st.data_editor(
    data_df,
    column_config={
        "apps": st.column_config.LinkColumn(
            "Trending apps",
            help="The top trending Streamlit apps",
            validate="^https://[a-z]+\.streamlit\.app$",
            max_chars=100,
        )
    },
    hide_index=True,
)
