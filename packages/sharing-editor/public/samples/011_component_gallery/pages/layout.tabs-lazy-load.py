import streamlit as st
import time

cat, dog, owl = st.tabs(["Cat", "Dog", "Owl"], on_change="rerun")

if cat.open:
    with cat:
        with st.spinner("Loading cat..."):
            time.sleep(2)
        st.write("This is the cat")
if dog.open:
    with dog:
        with st.spinner("Loading dog..."):
            time.sleep(2)
        st.write("This is the dog")
if owl.open:
    with owl:
        with st.spinner("Loading owl..."):
            time.sleep(2)
        st.write("This is the owl")
