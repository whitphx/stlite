import streamlit as st

vertical_alignment = st.selectbox(
    "Vertical alignment", ["top", "center", "bottom"], index=2
)

left, middle, right = st.columns(3, vertical_alignment=vertical_alignment)
left.image("https://static.streamlit.io/examples/cat.jpg")
left.markdown("By [@phonvanna](https://unsplash.com/photos/0g7BJEXq7sU)")
middle.image("https://static.streamlit.io/examples/dog.jpg")
middle.markdown("By [@shotbyrain](https://unsplash.com/photos/rmkIqi_C3cA)")
right.image("https://static.streamlit.io/examples/owl.jpg")
right.markdown("By [@zmachacek](https://unsplash.com/photos/ZN4CzqizIyI)")
