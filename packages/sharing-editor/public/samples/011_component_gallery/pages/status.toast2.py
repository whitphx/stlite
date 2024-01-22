import streamlit as st
import time


def cook_breakfast():
    msg = st.toast("Gathering ingredients...")
    time.sleep(1)
    msg.toast("Cooking...")
    time.sleep(1)
    msg.toast("Ready!", icon="🥞")


if st.button("Cook breakfast"):
    cook_breakfast()
