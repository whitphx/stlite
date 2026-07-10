import streamlit as st

st.set_page_config(page_title="stlite on Cloudflare")

st.title("stlite on Cloudflare Workers")
st.write("Edit `app/streamlit_app.py` and run `npm run dev` to reload your app.")

name = st.text_input("Name", "Streamlit")
st.success(f"Hello, {name}!")
