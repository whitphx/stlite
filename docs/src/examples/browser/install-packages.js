mount(
  {
    requirements: ["matplotlib", "pandas"],
    entrypoint: "streamlit_app.py",
    files: {
        // ...
    }
  },
  document.getElementById("root"),
);
