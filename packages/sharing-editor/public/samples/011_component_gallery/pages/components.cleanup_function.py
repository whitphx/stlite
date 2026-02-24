import streamlit as st

JS = """
export default function(component) {
    const { setStateValue, parentElement } = component;
    const sidebar = document.querySelector('section.stSidebar');
    const initialState = sidebar.getAttribute('aria-expanded') === 'true';

    // Create observer to watch for aria-expanded attribute changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded') {
                const newIsExpanded = sidebar.getAttribute('aria-expanded') === 'true';
                setStateValue('expanded', newIsExpanded);
            }
        });
    });

    // Start observing
    observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['aria-expanded']
    });

    // Set initial state
    setStateValue('expanded', initialState);

    // Cleanup function to remove the observer
    return () => {
        observer.disconnect();
    };

};
"""

my_component = st.components.v2.component(
    "sidebar_expansion_detector",
    js=JS,
)

st.sidebar.write("Sidebar content")
result = my_component(on_expanded_change=lambda: None)
result