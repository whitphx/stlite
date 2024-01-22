import streamlit as st

row1 = st.columns(3)
row2 = st.columns(3)

for col in row1 + row2:
    tile = col.container(border=True, height=120)
    tile.title(":balloon:")
