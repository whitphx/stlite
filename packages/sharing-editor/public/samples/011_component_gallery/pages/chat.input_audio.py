import streamlit as st

prompt = st.chat_input(
    "Say or record something",
    accept_audio=True,
)
if prompt and prompt.text:
    st.write("Text:", prompt.text)
if prompt and prompt.audio:
    st.audio(prompt.audio)
    st.write("Audio file:", prompt.audio.name)
