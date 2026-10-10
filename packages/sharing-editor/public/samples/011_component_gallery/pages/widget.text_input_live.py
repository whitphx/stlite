import streamlit as st

products = [
    {"Product": "Apple", "Category": "Fruit", "Price": 1.20},
    {"Product": "Banana", "Category": "Fruit", "Price": 0.50},
    {"Product": "Cherry", "Category": "Fruit", "Price": 2.50},
    {"Product": "Date", "Category": "Dried fruit", "Price": 3.00},
]


@st.fragment
def product_search():
    query = st.text_input("Search products", type="search", live=True)
    matches = [p for p in products if query.lower() in p["Product"].lower()]
    st.dataframe(matches, hide_index=True)


product_search()
