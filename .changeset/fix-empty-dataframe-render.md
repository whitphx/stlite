---
"@stlite/kernel": patch
---

Fix `st.dataframe([])` and other empty DataFrames crashing the page render with a Parquet error ("Repetition level must be defined for a primitive type"). Empty DataFrames now render as empty tables, matching Streamlit's behavior.
