import streamlit as st

images = [
    "https://static.streamlit.io/examples/cat.jpg",
    "https://static.streamlit.io/examples/dog.jpg",
    "https://static.streamlit.io/examples/owl.jpg",
    "https://static.streamlit.io/examples/cat.jpg",
    "https://static.streamlit.io/examples/dog.jpg",
    "https://static.streamlit.io/examples/owl.jpg",
]
thumbnail_columns = st.columns(6, gap="xsmall", wrap=False)
for column, image in zip(thumbnail_columns, images):
    column.image(image)
