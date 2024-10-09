import { mount } from "./mount";
import "./custom-element";

export { mount };

if (process.env.NODE_ENV === "development") {
  mount(
    //     `import streamlit as st

    // st.write("Hello world")
    //     `,
    {
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": `import streamlit as st
import matplotlib.pyplot as plt
import numpy as np
import os

st.markdown("Files in \`.\`:")
st.write(os.listdir("."))

st.markdown("\`./foo/foo.txt\`:")
with open("./foo/foo.txt") as f:
    st.write(f.read())

st.markdown("\`./bar.txt\`:")
with open("./bar.txt") as f:
    st.write(f.read())

size = st.slider("Sample size", 100, 1000)

arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)

st.latex(r'''
     a + ar + a r^2 + a r^3 + \\cdots + a r^{n-1} =
     \\sum_{k=0}^{n-1} ar^k =
     a \\left(\\frac{1-r^{n}}{1-r}\\right)
     ''')

import pandas as pd
import numpy as np

df = pd.DataFrame(
     np.random.randn(1000, 2) / [50, 50] + [37.76, -122.4],
     columns=['lat', 'lon'])

st.map(df)
    `,
        "bar.txt": {
          url: "/test-files/bar.txt",
        },
      },
      archives: [
        {
          url: "/test-files/foo.zip",
          format: "zip",
        },
      ],
      requirements: ["matplotlib"],
    },
    document.getElementById("root") as HTMLElement,
  );
}
