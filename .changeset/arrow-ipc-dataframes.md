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

`st.dataframe`, `st.data_editor`, `st.table` and Arrow-backed charts now handle column types exactly as Streamlit does: interval and period columns, date and time objects, set and tuple values, and non-string column names keep their types instead of being converted to strings as the Parquet path did. Large dataframes are delivered lazily as in Streamlit (above 150,000 rows, or with `lazy=True`), which Stlite previously disabled. The frontend no longer loads the 5.5 MB parquet-wasm module; the Python runtime installs pyarrow (about 10 MB to download) instead. Booting an app no longer imports pandas, and pyarrow with it, unless the app itself does.

`@stlite/cloudflare` serializes dataframes the same way, without pyarrow, which exceeds the Cloudflare Workers script size and memory limits: a pure-Python Arrow writer that produces what pyarrow would stands in for it, so `st.dataframe`, `st.data_editor`, `st.table`, `st.write` with a dataframe, and charts gain the same column-type handling and lazy loading. The stand-in covers only what Streamlit itself does with pyarrow, so app code that imports pyarrow, pandas features backed by it such as `pd.read_parquet`, and v1 custom components that send a dataframe back to Python raise an error that says so.
