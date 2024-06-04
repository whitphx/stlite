import streamlit as st
import asyncio


async def cook_breakfast():
    msg = st.toast("Gathering ingredients...")
    await asyncio.sleep(1)
    msg.toast("Cooking...")
    await asyncio.sleep(1)
    msg.toast("Ready!", icon="🥞")


if st.button("Cook breakfast"):
    await cook_breakfast()
