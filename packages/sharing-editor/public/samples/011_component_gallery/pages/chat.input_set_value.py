import streamlit as st

if st.button("Set Value"):
    st.session_state.chat_input = "Hello, world!"
st.chat_input(key="chat_input")
st.write("Chat input value:", st.session_state.chat_input)
