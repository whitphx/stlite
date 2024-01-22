import streamlit as st

with st.form("my_form"):
    st.write("Inside the form")
    my_number = st.slider("Pick a number", 1, 10)
    my_color = st.selectbox(
        "Pick a color", ["red", "orange", "green", "blue", "violet"]
    )
    st.form_submit_button("Submit my picks")

# This is outside the form
st.write(my_number)
st.write(my_color)
