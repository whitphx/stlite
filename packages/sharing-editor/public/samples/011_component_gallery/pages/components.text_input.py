import streamlit as st

HTML = """
    <label style='padding-right: 1em;' for='txt'>Enter text</label>
    <input id='txt' type='text' />
"""

JS = """
    export default function(component) {
        const { setStateValue, parentElement, data } = component;

        const label = parentElement.querySelector('label');
        label.innerText = data.label;

        const input = parentElement.querySelector('input');
        if (input.value !== data.value) {
            input.value = data.value ?? '';
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                setStateValue('value', e.target.value);
            }
        };

        input.onblur = (e) => {
            setStateValue('value', e.target.value);
        };
    }
"""

my_component = st.components.v2.component(
    "my_text_input",
    html=HTML,
    js=JS,
)


def my_component_wrapper(
    label, *, default="", key=None, on_change=lambda: None
):
    component_state = st.session_state.get(key, {})
    value = component_state.get("value", default)
    data = {"label": label, "value": value}
    result = my_component(
        data=data, default={"value": value}, key=key, on_value_change=on_change
    )
    return result


st.title("My custom component")

if st.button("Hello World"):
    st.session_state["my_text_input_instance"]["value"] = "Hello World"
if st.button("Clear text"):
    st.session_state["my_text_input_instance"]["value"] = ""
result = my_component_wrapper(
    "Enter something",
    default="I love Streamlit!",
    key="my_text_input_instance",
)

st.write("Result:", result)
st.write("Session state:", st.session_state)
