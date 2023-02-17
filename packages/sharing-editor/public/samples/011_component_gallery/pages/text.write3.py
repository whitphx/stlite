import streamlit as st
import pandas as pd

@st.cache_data
def load_data():
    data_frame = pd.DataFrame(
        {"first column": [1, 2, 3, 4], "second column": [10, 20, 30, 40]}
    )
    return data_frame

data_frame = load_data()
st.write("1 + 1 = ", 2)
st.write("Below is a DataFrame:", data_frame, "Above is a dataframe.")
