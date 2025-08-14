import pandas as pd
import streamlit as st

df = pd.DataFrame(
    {
        "Command": ["**st.table**", "*st.dataframe*"],
        "Type": ["`static`", "`interactive`"],
        "Docs": [
            "[:rainbow[docs]](https://docs.streamlit.io"
            "/develop/api-reference/data/st.dataframe)",
            "[:open_book:](https://docs.streamlit.io"
            "/develop/api-reference/data/st.table)",
        ],
    }
)

st.table(df)
