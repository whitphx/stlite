---
"@stlite/cloudflare": minor
---

Bring back `st.dataframe`, `st.data_editor`, `st.table`, `st.write` with a dataframe, and charts such as `st.line_chart` and `st.altair_chart`, which 0.7.0 disabled. The Worker still ships without pyarrow, which exceeds the Cloudflare Workers script size and memory limits. Instead, the stand-in it installs now serializes dataframes with a pure-Python Arrow writer that produces what pyarrow would. These elements therefore handle column types as Streamlit does, and large dataframes load lazily. The hello sample gets back its Plotting demo and the DataFrame demo's table and chart.

The stand-in covers only what Streamlit itself does with pyarrow. App code that imports pyarrow, pandas features backed by it such as `pd.read_parquet`, and v1 custom components that send a dataframe back to Python raise an error that says so.
