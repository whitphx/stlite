import streamlit as st


def toggle_popover():
    st.session_state.drawer = not st.session_state.drawer


def on_popover_change():
    if st.session_state.drawer:
        st.toast("You opened the popover.")
    else:
        st.toast("You closed the popover.")


with st.popover("Open popover", on_change=on_popover_change, key="drawer"):
    st.write("This is the popover")
    st.button("Close popover", on_click=toggle_popover)

st.button("Open popover", on_click=toggle_popover)
