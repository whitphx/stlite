import streamlit as st

md = st.text_area(
    "Type in your markdown string (without outer quotes)",
    "Happy Streamlit-ing! :balloon:",
)

st.code(
    f"""
import streamlit as st
        
st.markdown('''{md}''')
"""
)

st.markdown(md)
