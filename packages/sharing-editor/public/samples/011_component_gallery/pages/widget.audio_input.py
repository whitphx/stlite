import streamlit as st

audio_value = st.audio_input("Record a voice message")

if audio_value:
    st.audio(audio_value)
