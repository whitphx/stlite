import streamlit as st
import datetime


st.title("File persistence sample with NodeJS file system synched to the host OS")

st.button("Rerun")

if st.button("Clear `/mnt/hello.txt`"):
    with open("/mnt/hello.txt", "w") as f:
        f.write("")

now = datetime.datetime.now()
with open("/mnt/hello.txt", "a") as f:
    st.write(f"Writing to `/mnt/hello.txt` at `{now}`...")
    f.write(f"Hello, Streamlit! {now}\n")

with open("/mnt/hello.txt", "r") as f:
    st.write("Reading from `/mnt/hello.txt`:")
    st.code(f.read())
