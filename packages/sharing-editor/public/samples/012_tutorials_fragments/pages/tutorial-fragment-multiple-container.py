import streamlit as st
import asyncio

st.title("Cats!")

row1 = st.columns(3)
row2 = st.columns(3)

grid = [col.container(height=200) for col in row1 + row2]
safe_grid = [card.empty() for card in grid]


async def black_cats():
    await asyncio.sleep(1)
    st.title("🐈‍⬛ 🐈‍⬛")
    st.markdown("🐾 🐾 🐾 🐾")


async def orange_cats():
    await asyncio.sleep(1)
    st.title("🐈 🐈")
    st.markdown("🐾 🐾 🐾 🐾")


@st.fragment
async def herd_black_cats(card_a, card_b, card_c):
    st.button("Herd the black cats")
    container_a = card_a.container()
    container_b = card_b.container()
    container_c = card_c.container()
    with container_a:
        await black_cats()
    with container_b:
        await black_cats()
    with container_c:
        await black_cats()


@st.fragment
async def herd_orange_cats(card_a, card_b, card_c):
    st.button("Herd the orange cats")
    container_a = card_a.container()
    container_b = card_b.container()
    container_c = card_c.container()
    with container_a:
        await orange_cats()
    with container_b:
        await orange_cats()
    with container_c:
        await orange_cats()


with st.sidebar:
    await herd_black_cats(grid[0].empty(), grid[2].empty(), grid[4].empty())
    await herd_orange_cats(grid[1].empty(), grid[3].empty(), grid[5].empty())
    st.button("Herd all the cats")
