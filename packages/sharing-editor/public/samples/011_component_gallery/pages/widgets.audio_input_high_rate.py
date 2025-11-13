import streamlit as st

audio_value = st.audio_input("Record high quality audio", sample_rate=48000)

if audio_value:
    st.audio(audio_value)
