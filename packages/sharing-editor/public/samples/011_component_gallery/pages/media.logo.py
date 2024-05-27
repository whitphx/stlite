import streamlit as st

HORIZONTAL_RED = "images/horizontal_red.png"
ICON_RED = "images/icon_red.png"
HORIZONTAL_BLUE = "images/horizontal_blue.png"
ICON_BLUE = "images/icon_blue.png"

options = [HORIZONTAL_RED, ICON_RED, HORIZONTAL_BLUE, ICON_BLUE]
sidebar_logo = st.selectbox("Sidebar logo", options, 0)
main_body_logo = st.selectbox("Main body logo", options, 1)

st.logo(
    f"pages/{sidebar_logo}",
    icon_image=f"pages/{main_body_logo}",
)
st.sidebar.markdown("Hi!")
