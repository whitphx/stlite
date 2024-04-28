import streamlit as st

VIDEO_URL = "https://static.streamlit.io/examples/star.mp4"

SUBTITLES = """
WEBVTT

0:00:01.000 --> 0:00:02.000
Look!

0:00:03.000 --> 0:00:05.000
Look at the pretty stars!
"""

st.video(VIDEO_URL, subtitles=SUBTITLES)

st.write(
    """
    #### Video credit:

    Creator: User _fxxu_ from _Pixabay_.

    License: Free for commercial use. No attribution required.
    https://pixabay.com/en/service/license/

    URL:
    https://pixabay.com/en/videos/star-long-exposure-starry-sky-sky-6962/

"""
)
