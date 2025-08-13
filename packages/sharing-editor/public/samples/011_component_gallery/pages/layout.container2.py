import streamlit as st

container = st.container(border=True)
container.write("This is inside the container")
st.write("This is outside the container")

container.write("This is inside too")
