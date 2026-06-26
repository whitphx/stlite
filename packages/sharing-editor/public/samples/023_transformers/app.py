import streamlit as st

from transformers_js_py import pipeline

st.title("Sentiment analysis")

text = st.text_input("Input some text", "I love transformers!")

if text:
    with st.spinner():
        if "pipe" not in st.session_state:
            st.session_state["pipe"] = await pipeline('sentiment-analysis')
        pipe = st.session_state["pipe"]
        out = await pipe(text)
    st.write(out)
