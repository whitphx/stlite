import streamlit as st

CSS = """
a {
    color: var(--st-link-color);
}
"""

JS = """
export default function(component) {
    const { data, setTriggerValue, parentElement } = component;
    const newElement = document.createElement('div');
    parentElement.appendChild(newElement);
    newElement.innerHTML = data;

    const links = newElement.querySelectorAll('a');

    links.forEach((link) => {
        link.onclick = (e) => {
            setTriggerValue('clicked', link.getAttribute('data-link'));
        };
    });
}
"""

my_component = st.components.v2.component(
    "inline_links",
    css=CSS,
    js=JS,
)

paragraph_html = """
<p>This is an example paragraph with inline links. To see the response in
Python, click on the <a href="#" data-link="link_1">first link</a> or
<a href="#" data-link="link_2">second link</a>.</p>
"""

result = my_component(data=paragraph_html, on_clicked_change=lambda: None)
if result.clicked == "link_1":
    st.write("You clicked the first link!")
elif result.clicked == "link_2":
    st.write("You clicked the second link!")
