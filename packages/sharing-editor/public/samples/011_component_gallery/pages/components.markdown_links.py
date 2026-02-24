import streamlit as st

JS = """
export default function(component) {
    const { setTriggerValue } = component;
    const links = document.querySelectorAll('a[href="#"]');

    links.forEach((link) => {
        link.onclick = (e) => {
            setTriggerValue('clicked', link.innerHTML);
        };
    });
}
"""

my_component = st.components.v2.component(
    "inline_links",
    js=JS,
)

result = my_component(on_clicked_change=lambda: None)

st.markdown(
    "Components aren't [sandboxed](#), so you can write JS that [interacts](#) with the main [document](#)."
)

if result.clicked:
    st.write(f"You clicked {result.clicked}!")
