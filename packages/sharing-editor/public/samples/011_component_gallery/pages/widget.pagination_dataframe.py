import streamlit as st
import pandas as pd

df = pd.DataFrame({"A": range(100), "B": range(100, 200)})
rows_per_page = 10
total_pages = (len(df) + rows_per_page - 1) // rows_per_page

# Use placeholders to show dataframe above pagination
dataframe_slot = st.empty()
with st.container(horizontal_alignment="right"):
    page = st.pagination(num_pages=total_pages)

start_idx = (page - 1) * rows_per_page
end_idx = start_idx + rows_per_page
dataframe_slot.dataframe(df.iloc[start_idx:end_idx])
