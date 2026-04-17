import pandas as pd
import streamlit as st

df = pd.DataFrame({"Name": ["Alice", "Bob"], "Age": [25, 30]})
st.table(df, hide_index=True, hide_header=True)
