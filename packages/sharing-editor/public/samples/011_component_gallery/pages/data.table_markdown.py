import streamlit as st
import pandas as pd

df = pd.DataFrame(
    {
        "Command": ["**st.table**", "*st.dataframe*"],
        "Type": ["`static`", "`interactive`"],
        "Docs": [
            "[:rainbow[docs]](https://docs.streamlit.io/develop/api-reference/data/st.dataframe)",
            "[:book:](https://docs.streamlit.io/develop/api-reference/data/st.table)",
        ],
    }
)
st.table(df)
