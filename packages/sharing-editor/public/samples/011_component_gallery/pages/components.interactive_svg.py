import streamlit as st

HTML = """
<p>Click on the triangle, square, or circle to interact with the shapes:</p>

<svg width="400" height="300">
    <polygon points="100,50 50,150 150,150" data-shape="triangle"></polygon>
    <rect x="200" y="75" width="100" height="100" data-shape="square"></rect>
    <circle cx="125" cy="225" r="40" data-shape="circle"></circle>
</svg>
"""

JS = """
export default function(component) {
    const { setTriggerValue, parentElement } = component;
    const shapes = parentElement.querySelectorAll('[data-shape]');
    
    shapes.forEach((shape) => {
        shape.onclick = (e) => {
            setTriggerValue('clicked', shape.getAttribute('data-shape'));
        };
    });
}
"""

CSS = """
polygon, rect, circle {
    stroke: var(--st-primary-color);
    stroke-width: 2;
    fill: transparent;
    cursor: pointer;
}
polygon:hover, rect:hover, circle:hover {
    fill: var(--st-secondary-background-color);
}
"""

my_component = st.components.v2.component(
    "clickable_svg",
    html=HTML,
    css=CSS,
    js=JS,
)

result = my_component(on_clicked_change=lambda: None)
result
