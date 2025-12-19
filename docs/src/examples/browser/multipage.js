mount(
  {
    entrypoint: "👋_Hello.py",
    files: {
      "👋_Hello.py": `
import streamlit as st
st.title("Main page")
`,
      "pages/1_⭐️_Page1.py": `
import streamlit as st
st.title("Page 1")
`,
    },
  },
  document.getElementById("root"),
);
