---
"@stlite/kernel": minor
"@stlite/browser": minor
"@stlite/react": minor
"@stlite/desktop": minor
"@stlite/cli": minor
"@stlite/sharing": minor
"@stlite/cloudflare": minor
---

Serialize dataframes through pyarrow and Arrow IPC, as Streamlit does. Pyodide 314 bundles pyarrow, so the Parquet workaround Stlite used instead (fastparquet in Python, parquet-wasm in the frontend) is gone, and the Streamlit fork no longer patches anything Arrow-related.

`st.dataframe`, `st.data_editor`, `st.table` and Arrow-backed charts now handle column types exactly as Streamlit does: interval and period columns, date and time objects, set and tuple values, and non-string column names keep their types instead of being converted to strings as the Parquet path did. Large dataframes are delivered lazily as in Streamlit (above 150,000 rows, or with `lazy=True`), which Stlite previously disabled. The frontend no longer loads the 5.5 MB parquet-wasm module; the Python runtime installs pyarrow (about 10 MB to download) instead.

`@stlite/cloudflare` no longer supports elements that send data through Arrow: `st.dataframe`, `st.data_editor`, `st.table`, `st.write` with a dataframe, and charts such as `st.line_chart` and `st.altair_chart`. pyarrow exceeds the Cloudflare Workers script size and memory limits, so the Worker installs a stub in its place that makes these elements raise an error explaining this. Every other element works as before, and the hello sample drops its Plotting demo and shows the DataFrame demo's table as text.
