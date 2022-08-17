# stlite: Serverless Streamlit

[![stlite-kernel](https://github.com/whitphx/stlite/actions/workflows/stlite-kernel.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/stlite-kernel.yml)
[![Integration tests with streamlit and tornado](https://github.com/whitphx/stlite/actions/workflows/tornado-e2e.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/tornado-e2e.yml)
[![Build and Deploy GitHub Pages](https://github.com/whitphx/stlite/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/gh-pages.yml)

<img src="./docs/images/logo.svg" style="background: white;" >

A port of [Streamlit](https://streamlit.io/) to WebAssembly, powered by [Pyodide](https://pyodide.org/).

Streamlit is a Python web app framework for the fast development of data apps. This project is to make it run completely run on web browsers.

## Try it out

Visit the [playground demo](https://whitphx.github.io/stlite/).

## Samples
### ⚡️Serverless Image Processing App
Image processing with OpenCV works on the client-side.
* Repository📌: https://github.com/whitphx/stlite-image-processing-app
* Online demo🎈: https://whitphx.github.io/stlite-image-processing-app/

## Use stlite on your web page
You can use _stlite_ on your web page loading the script via a `<script>` tag.
Here is a sample HTML file.
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>stlite app</title>
</head>
<body>
  <div id="root"></div>
  <script src="https://whitphx.github.io/stlite/lib/mountable/stlite.js" ></script>
  <script>
    stlite.mount({
      requirements: ["matplotlib"],  // Packages to install
      mainScriptData: `
import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

size = st.slider("Sample size", 100, 1000)

arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)
`,
      container: document.getElementById("root")
    })
  </script>
</body>
</html>
```

In this sample,
* stlite library is imported with the first script tag, then the global `stlite` object becomes available.
* `stlite.mount()` mounts the Streamlit app to the `<div id="root" />` element as specified via the `container` option and runs the Python script passed through the `mainScriptData` option.

> **Warning**
> stlite is at the very beginning of its development and the API can drastically change without any notice in the future.
Moreover, the hosted JS runtime is not versioned now, so future API changes may cause problems with backward compatibility.

## Resources
* [📖 Streamlit Community, "New library: stlite, a port of Streamlit to Wasm, powered by Pyodide"](https://discuss.streamlit.io/t/new-library-stlite-a-port-of-streamlit-to-wasm-powered-by-pyodide/25556):
  The stlite thread at the Streamlit online forum.
* [📺 YouTube, "Stlite - Streamlit without Server - powered by Pyodide (WebAssembly)", by 1littlecoder](https://youtu.be/VQdktxgbmmg):
  A quick tutorial with local app development and GitHub Pages deployment.

## Development
### Building the packages

In the root directory,
```shell
make
```

After building, you can run the playground app by running the command below. Access http://localhost:5001/
```shell
make serve
```

## Support the project

<a href="https://www.buymeacoffee.com/whitphx" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 50px !important;width: 180px !important;" ></a>

[![GitHub Sponsors](https://img.shields.io/github/sponsors/whitphx?label=Sponsor%20me%20on%20GitHub%20Sponsors&style=social)](https://github.com/sponsors/whitphx)
