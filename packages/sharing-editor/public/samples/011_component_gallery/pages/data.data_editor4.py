import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    data = {
        "Animal": ["Lion", "Crocodile", "Elephant", "Giraffe", "Penguin"],
        "Weight (kg)": [190, 430, 5000, 800, 4],
        "Is Endangered": [True, True, True, False, False],
        "Classification": ["Mammal", "Reptile", "Mammal", "Mammal", "Bird"],
        "Average Lifespan (years)": [12, 70, 70, 25, 20],
        "Habitat": ["Grassland", "Water", "Savannah", "Savannah", "Antarctica"],
    }
    df = pd.DataFrame(data)
    df["Classification"] = df["Classification"].astype("category")
    df["Habitat"] = df["Habitat"].astype("category")
    return df


df = load_data()

st.data_editor(df, key="data_editor", num_rows="dynamic")
st.write("Here's the session state:")
st.write(st.session_state["data_editor"])
