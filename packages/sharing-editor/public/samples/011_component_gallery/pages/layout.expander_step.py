import streamlit as st

with st.expander("Understanding the question", type="step"):
    st.write("Parsed: 'What is the weather in NYC?'")

with st.expander("Searching for information", type="step"):
    st.json({"sources": ["weather.gov", "accuweather.com"]})

# A step with no content terminates the timeline.
st.expander("Generating response", type="step")
