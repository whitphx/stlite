import streamlit as st

st.markdown("""
A component defined inline with the [Custom Components v2 API](https://docs.streamlit.io/develop/api-reference/custom-components/st.components.v2.component),
with no package to install.
Python sends the number of stars to the component as `data`,
and a click sends the rating back with `setStateValue()`, which reruns the script.
""")

HTML = '<div class="stars" role="group" aria-label="Rating"></div>'

CSS = """
.stars button {
    font-size: 2rem;
    background: none;
    border: none;
    color: var(--st-primary-color);
    cursor: pointer;
}
"""

JS = """
export default function ({ parentElement, data, setStateValue }) {
    // Update the buttons in place rather than replacing them,
    // so a keyboard user's focus survives the rerun a click triggers.
    const group = parentElement.querySelector(".stars");
    while (group.children.length > data.max) group.lastElementChild.remove();
    while (group.children.length < data.max) group.append(document.createElement("button"));
    [...group.children].forEach((star, i) => {
        star.textContent = i < data.rating ? "★" : "☆";
        star.setAttribute("aria-label", `${i + 1} of ${data.max}`);
        star.setAttribute("aria-pressed", String(i < data.rating));
        star.onclick = () => setStateValue("rating", i + 1);
    });
}
"""

star_rating = st.components.v2.component("star_rating", html=HTML, css=CSS, js=JS)

max_stars = st.slider("Number of stars", 3, 10, 5)
rating = min(st.session_state.get("rating", {}).get("rating", 0), max_stars)
star_rating(
    data={"max": max_stars, "rating": rating},
    default={"rating": 0},
    key="rating",
    on_rating_change=lambda: None,
)

st.write(f"Your rating: {rating} / {max_stars}")
