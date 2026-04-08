import streamlit as st

cat, dog, owl = st.tabs(["Cat", "Dog", "Owl"], on_change="rerun")

with cat:
    st.write("This is the cat")
with dog:
    st.write("This is the dog")
with owl:
    st.write("This is the owl")

if cat.open:
    options = ["orange", "tuxie", "tortie"]
    cat_color = st.sidebar.selectbox("What color is your cat?", options)
if dog.open:
    options = ["golden", "black", "white"]
    dog_color = st.sidebar.selectbox("What color is your dog?", options)
if owl.open:
    options = ["brown", "white", "black"]
    owl_color = st.sidebar.selectbox("What color is your owl?", options)
