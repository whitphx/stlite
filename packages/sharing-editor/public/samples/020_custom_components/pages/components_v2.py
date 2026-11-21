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
    const stars = Array.from({ length: data.max }, (_, i) => {
        const star = document.createElement("button");
        star.textContent = i < data.rating ? "★" : "☆";
        star.setAttribute("aria-label", `${i + 1} of ${data.max}`);
        star.setAttribute("aria-pressed", String(i < data.rating));
        star.onclick = () => setStateValue("rating", i + 1);
        return star;
    });
    parentElement.querySelector(".stars").replaceChildren(...stars);
}
"""

star_rating = st.components.v2.component("star_rating", html=HTML, css=CSS, js=JS)

max_stars = st.slider("Number of stars", 3, 10, 5)
rating = st.session_state.get("rating", {}).get("rating", 0)
result = star_rating(
    data={"max": max_stars, "rating": rating},
    default={"rating": 0},
    key="rating",
    on_rating_change=lambda: None,
)

st.write(f"Your rating: {result.rating} / {max_stars}")
