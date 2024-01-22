import streamlit as st

on = st.toggle("Activate feature")

if on:
    st.write("Feature activated!")
