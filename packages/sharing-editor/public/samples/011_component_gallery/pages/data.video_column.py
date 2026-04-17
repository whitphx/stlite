import pandas as pd
import streamlit as st

data_df = pd.DataFrame(
    {
        "description": [
            "Get started with Streamlit",
            "Get started with Community Cloud",
        ],
        "video": [
            "https://s3-us-west-2.amazonaws.com/assets.streamlit.io/videos/hero-video.mp4",
            "https://s3-us-west-2.amazonaws.com/assets.streamlit.io/videos/streamlit_sharing_silent.mp4",
        ],
    }
)

st.dataframe(
    data_df,
    column_config={
        "video": st.column_config.VideoColumn("Preview Video"),
    },
)
