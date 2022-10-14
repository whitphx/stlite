import streamlit as st

# Store the initial value of widgets in session state
if "visibility" not in st.session_state:
    st.session_state.visibility = "visible"
    st.session_state.disabled = False

col1, col2 = st.columns(2)

with col1:
    st.checkbox("Disable text input widget", key="disabled")
    st.radio(
        "Set text input label visibility 👉",
        key="visibility",
        options=["visible", "hidden", "collapsed"],
    )
    st.text_input(
        "Placeholder for the other text input widget",
        "This is a placeholder",
        key="placeholder",
    )

with col2:
    text_input = st.text_input(
        "Enter some text 👇",
        label_visibility=st.session_state.visibility,
        disabled=st.session_state.disabled,
        placeholder=st.session_state.placeholder,
    )

    if text_input:
        st.write("You entered: ", text_input)
