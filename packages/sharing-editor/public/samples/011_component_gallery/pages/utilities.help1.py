import streamlit as st


class Dog:
    """A typical dog."""

    def __init__(self, breed, color):
        self.breed = breed
        self.color = color

    def bark(self):
        return "Woof!"


fido = Dog("poodle", "white")

st.help(fido)
