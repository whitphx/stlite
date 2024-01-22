import streamlit as st
import pandas as pd

df = pd.DataFrame(columns=["name", "age", "color"])
colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
config = {
    "name": st.column_config.TextColumn(
        "Full Name (required)", width="large", required=True
    ),
    "age": st.column_config.NumberColumn("Age (years)", min_value=0, max_value=122),
    "color": st.column_config.SelectboxColumn("Favorite Color", options=colors),
}

result = st.data_editor(df, column_config=config, num_rows="dynamic")

if st.button("Get results"):
    st.write(result)
