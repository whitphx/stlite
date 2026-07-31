import streamlit as st

st.title("Bundled-runtime minimal app")
st.write("This Worker ships its whole Python runtime in the script: no asset fetch or extraction at cold start.")

if "count" not in st.session_state:
    st.session_state.count = 0
if st.button("Increment"):
    st.session_state.count += 1
st.metric("Counter", st.session_state.count)

st.caption(st.secrets.get("APP_MESSAGE", "APP_MESSAGE is not set"))

name = st.text_input("Your name", "stlite")
level = st.slider("Level", 0, 10, 3)
st.write(f"Hello **{name}**, level {level}!")
