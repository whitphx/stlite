import streamlit as st

animal = st.form("my_animal")

# This is writing directly to the main body. Since the form container is
# defined above, this will appear below everything written in the form.
sound = st.selectbox("Sounds like", ["meow", "woof", "squeak", "tweet"])

# These methods called on the form container, so they appear inside the form.
submit = animal.form_submit_button(f"Say it with {sound}!")
sentence = animal.text_input("Your sentence:", "Where's the tuna?")
say_it = sentence.rstrip(".,!?") + f", {sound}!"
if submit:
    animal.subheader(say_it)
else:
    animal.subheader("&nbsp;")
