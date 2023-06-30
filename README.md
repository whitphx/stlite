# stlite: Serverless Streamlit

[![Test, Build, and Publish](https://github.com/whitphx/stlite/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/whitphx/stlite/actions/workflows/main.yml)
[![Build and Deploy GitHub Pages](https://github.com/whitphx/stlite/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/gh-pages.yml)

[![npm (@stlite/kernel)](https://img.shields.io/npm/v/@stlite/kernel?label=%40stlite%2Fkernel)](https://www.npmjs.com/package/@stlite/kernel)
[![npm (scoped)](https://img.shields.io/npm/v/@stlite/mountable?label=%40stlite%2Fmountable)](https://www.npmjs.com/package/@stlite/mountable)
[![npm (@stlite/desktop)](https://img.shields.io/npm/v/@stlite/desktop?label=%40stlite%2Fdesktop)](https://www.npmjs.com/package/@stlite/desktop)

<img src="./docs/images/logo.svg" style="background: white;" >

A port of [Streamlit](https://streamlit.io/) to WebAssembly, powered by [Pyodide](https://pyodide.org/).

Streamlit is a Python web app framework for the fast development of data apps. This project is to make it run completely on web browsers.

## Try it out

Visit [stlite sharing](https://edit.share.stlite.net/).

[<img src="https://edit.share.stlite.net/ogp.png" height="180" >](https://edit.share.stlite.net/)

## Create a desktop app

See [`@stlite/desktop`](./packages/desktop/README.md).

## Use stlite on your web page

You can use _stlite_ on your web page loading the script and CSS files via `<script>` and `<link>` tags as below.
Here is a sample HTML file.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>stlite app</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.34.0/build/stlite.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.34.0/build/stlite.js"></script>
    <script>
      stlite.mount(
        `
import streamlit as st

name = st.text_input('Your name')
st.write("Hello,", name or "world")
`,
        document.getElementById("root")
      );
    </script>
  </body>
</html>
```

In this sample,

- stlite library is imported with the first script tag, then the global `stlite` object becomes available.
- `stlite.mount()` mounts the Streamlit app on the `<div id="root" />` element as specified via the second argument. The app script is passed via the first argument.

### More controls

If more controls are needed such as installing dependencies or mounting multiple files, use the following API instead.

```js
stlite.mount(
  {
    requirements: ["matplotlib"], // Packages to install
    entrypoint: "streamlit_app.py", // The target file of the `streamlit run` command
    files: {
      "streamlit_app.py": `
import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

size = st.slider("Sample size", 100, 1000)

arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)
`,
    },
  },
  document.getElementById("root")
);
```

### Various ways to load files

You can pass an object to the `files` option to mount files, whose keys are file paths, and you can specify the values in various ways as below.

#### Passing string or binary data

You can pass the file content as a string or binary data.

This is what we did in the example above.

```js
stlite.mount(
  {
    files: {
      "path/to/text_file.txt": "file content",
      "path/to/binary_file.bin": new Uint8Array([0x00, 0x01, 0x02, 0x03]),
    },
    // ... other options ...
  },
  document.getElementById("root")
);
```

#### Passing an object with a URL

You can use this way to load a file from a URL and mount it to the specified path on the virtual file system.

Either an absolute or relative URL is accepted. Consider as the same as the `url` option of the [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) function.

```js
stlite.mount(
  {
    files: {
      "path/to/file": {
        url: "https://example.com/path/to/file",
      },
      "path/to/file2": {
        url: "./path/to/file",
      },
    },
    // ... other options ...
  },
  document.getElementById("root")
);
```

#### Passing an object with options (advanced)

stlite runs on [Pyodide](https://pyodide.org/), and [it has a file system provided by Emscripten](https://pyodide.org/en/stable/usage/file-system.html).
The files specified via the `files` option are mounted on the file system, and [Emscripten's `FS.writeFile()` function](https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.writeFile) is used internally for it.
You can specify the options (`opts`) for the `FS.writeFile(path, data, opts)` function as below.

```js
stlite.mount(
  {
    files: {
      "path/to/text_file.txt": {
        data: "file content",
        opts: {
          encoding: "utf8",
        },
      },
      "path/to/file": {
        url: "https://example.com/path/to/file",
        opts: {
          encoding: "utf8",
        },
      },
    },
    // ... other options ...
  },
  document.getElementById("root")
);
```

### Loading archive files

You can load archive files such as zip files, unpack them, and mount the unpacked files to the file system by using the `archives` option.

The `url` field of each item accepts either an absolute or relative URL. Consider as the same as the `url` option of the [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) function.

The downloaded archive file is unpacked by the [`pyodide.unpackArchive(buffer, format, options)`](https://pyodide.org/en/stable/usage/api/js-api.html#pyodide.unpackArchive) function. You have to pass the rest of the arguments of the function, `format` and `options` as below.

```js
  mount(
    {
      archives: [
        {
          url: "./foo.zip",
          // buffer: new Uint8Array([...archive file binary...]), // You can also pass the binary data directly
          format: "zip",
          options: {},
        },
      ],
      // ... other options ...
    },
    document.getElementById("root") as HTMLElement
  );
```

### Other stlite versions

In the example above, the stlite script is loaded via the `<script>` tag with the versioned URL.
You can use another version by changing the version number in the URL.

The following URLs are also available, while our recommendation is to use the versioned one as above because the API may change without backward compatibility in future releases.

#### The latest release

```html
<script src="https://cdn.jsdelivr.net/npm/@stlite/mountable/build/stlite.js"></script>
```

You can use the latest version of the published stlite package with this URL.

#### The head of the main branch

```html
<script src="https://whitphx.github.io/stlite/lib/mountable/stlite.js"></script>
```

This URL points to the head of the main branch which is usually ahead of the released packages. However, we strongly recommend NOT to use this URL because this might be broken and there is no guarantee that this resource will be kept available in the future.

### Multipage apps

You can pass the multiple files to the `files` option as below to construct the multipage app structure, the entry point file and `pages/*.py` files.

Read [the Streamlit official document](https://docs.streamlit.io/library/get-started/multipage-apps) about the multipage apps.

```js
stlite.mount(
  {
    entrypoint: "👋_Hello.py",
    files: {
      "👋_Hello.py": `
import streamlit as st

st.set_page_config(page_title="Hello")
st.title("Main page")
`,
      "pages/1_⭐️_Page1.py": `
import streamlit as st

st.set_page_config(page_title="Page1")
st.title("Page 1")
`,
      "pages/2_🎈_Page2.py": `
import streamlit as st

st.set_page_config(page_title="Page2")
st.title("Page 2")
`,
    },
  },
  document.getElementById("root")
);
```

## Limitations

As _stlite_ runs on the web browser environment ([Pyodide](https://pyodide.org/) runtime), there are things not working well. The known issues follow.

- `st.spinner()` does not work with blocking methods like `pyodide.http.open_url()` because stlite runs on a single-threaded environment, so `st.spinner()` can't execute its code to start showing the spinner during the blocking method occupies the only event loop.
- `time.sleep()` is no-op. Use `asyncio.sleep()` instead. This is a restriction from Pyodide runtime. See https://github.com/pyodide/pyodide/issues/2354. The following section about top-level await may also help to know how to use async functions on stlite.
- `st.experimental_data_editor` does not work as it relies on PyArrow, but it doesn't work on Pyodide. Track this issue on https://github.com/whitphx/stlite/issues/509.
- For URL access, `urllib` or `requests` don't work on Pyodide/stlite, so we have to use alternative methods provided by Pyodide, such as [`pyodide.http.pyfetch()`](https://pyodide.org/en/stable/usage/api/python-api/http.html#pyodide.http.pyfetch) or [`pyodide.http.open_url()`](https://pyodide.org/en/stable/usage/api/python-api/http.html#pyodide.http.open_url). See https://pyodide.org/en/stable/usage/faq.html#how-can-i-load-external-files-in-pyodide for the details. For `pyodide.http.pyfetch()`, see also the following section about top-level await.
- The C extension packages that are not built for Pyodide cannot be installed. See https://pyodide.org/en/stable/usage/faq.html#micropip-can-t-find-a-pure-python-wheel for the details.

Other problems are tracked at GitHub Issues: https://github.com/whitphx/stlite/issues
If you find a new problem, please report it.

## Top-level await

TL;DR: use top-level await instead of `asyncio.run()` on stlite.

Unlike the original Streamlit, stlite supports top-level await due to the differences in their execution models. Streamlit runs in a standard Python environment, allowing the use of `asyncio.run()` when an async function needs to be executed within a script. In contrast, stlite runs in a web browser, operating in an environment where the only event loop is always in a running state. This makes it impossible to use `asyncio.run()` within a script, necessitating the support for top-level await.

Top-level await can be useful in various situations.

### Example 1: `asyncio.sleep()`

One of the most common use cases is `asyncio.sleep()`. As mentioned in the previous section, `time.sleep()` is no-op on stlite because its blocking nature is not compatible with the single-threaded event loop in the web browser environment. Instead, `asyncio.sleep()`, which is non-blocking, can be used to pause the execution of a script for a specified amount of time.

You can use top-level await either for `asyncio.sleep()` directly or for an async function that contains `asyncio.sleep()` like the following:

```python
import asyncio
import streamlit as st

st.write("Hello, world!")
await asyncio.sleep(3)
st.write("Goodbye, world!")
```

```python
import asyncio
import streamlit as st

async def main():
    st.write("Hello, world!")
    await asyncio.sleep(3)
    st.write("Goodbye, world!")

await main()
```

### Example 2: `pyodide.http.pyfetch()`

Another common use case is accessing external resources. In the Pyodide environment, widely-used URL access methods in Python, like `requests`, are not available. However, Pyodide provides [`pyodide.http.pyfetch()`](https://pyodide.org/en/stable/usage/api/python-api/http.html#pyodide.http.pyfetch) as an alternative for accessing external resources. Since this method is async, top-level await becomes handy for utilizing `pyodide.http.pyfetch()`.

Here's a sample code snippet demonstrating the usage of top-level await with `pyodide.http.pyfetch()`:

```python
import pyodide.http

url = "your_url_here"
response = await pyodide.http.pyfetch(url)
data_in_bytes = await response.bytes()
```

## Resources

- [📖 Streamlit meets WebAssembly - stlite, by whitphx](https://www.whitphx.info/posts/20221104-streamlit-wasm-stlite/): A blog post covering from some technical surveys to the usages of the online editor _stlite sharing_, self-hosting apps, and the desktop app bundler.
- [📺 "Serverless Streamlit + OpenCV Python Web App Tutorial", by 1littlecoder, YouTube](https://youtu.be/7Qja9ZAWcfw): A quick tutorial to develop an OpenCV image processing app with stlite that runs completely on browsers.
- [📖 "New library: stlite, a port of Streamlit to Wasm, powered by Pyodide", Streamlit Community](https://discuss.streamlit.io/t/new-library-stlite-a-port-of-streamlit-to-wasm-powered-by-pyodide/25556):
  The stlite thread at the Streamlit online forum.
- [📺 "Stlite - Streamlit without Server - powered by Pyodide (WebAssembly)", by 1littlecoder, YouTube](https://youtu.be/VQdktxgbmmg):
  A quick tutorial with local app development and GitHub Pages deployment.
- [📺 "How to Convert a Streamlit App to an .EXE Executable", by Fanilo Andrianasolo, YouTube](https://youtu.be/3wZ7GRbr91g):
  A tutorial to convert a Streamlit app to an executable file with stlite and a demo to run it on an offline machine.
- [📖 "Is This the Easiest Way to Build Your Streamlit App?", by Shantala Mukherjee](https://onlyweb.hashnode.dev/is-this-the-easiest-way-to-build-your-streamlit-app)
- [📖 "The Best Python Desktop App Framework?", by Caleb Robey at Depot Analytics](https://www.depotanalytics.co/post/the-best-python-desktop-app-framework)

## Samples

### ⚡️Serverless Image Processing App

Image processing with OpenCV works on the client-side.

- Repository📌: https://github.com/whitphx/stlite-image-processing-app
- Online demo🎈: https://whitphx.github.io/stlite-image-processing-app/

<details>
  <summary>See the tutorial video</summary>

[Serverless Streamlit + OpenCV Python Web App Tutorial](https://youtu.be/7Qja9ZAWcfw), crafted by [1littlecoder](https://www.youtube.com/c/1littlecoder).

[![Serverless Streamlit + OpenCV Python Web App Tutorial](https://img.youtube.com/vi/7Qja9ZAWcfw/0.jpg)](https://youtu.be/7Qja9ZAWcfw)

</details>

## Sponsors

### Streamlit (Snowflake)

[<img src="https://streamlit.io/images/brand/streamlit-mark-color.png" height="100" />](https://streamlit.io/) [<img src="https://docs.snowflake.com/_images/logo-snowflake-sans-text.png" height="100" />](https://www.snowflake.com/)

### Databutton

[<img src="https://assets.website-files.com/6213e8906bdf786dcccbce62/621d20f1031cff7b094664f2_large_fav.png" height="100" >](https://www.databutton.io/)

They are sponsoring me on [GitHub Sponsors](https://github.com/sponsors/whitphx)!

### Hal9

[<img src="https://hal9.com/logo/hal9-square-black.png" height="50" >](https://hal9.com/)

They are sponsoring me on [GitHub Sponsors](https://github.com/sponsors/whitphx)!

## Support the project

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D2ERWFG)

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="180" height="50" >](https://www.buymeacoffee.com/whitphx)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/whitphx?label=Sponsor%20me%20on%20GitHub%20Sponsors&style=social)](https://github.com/sponsors/whitphx)

Contact the author: [Twitter](https://twitter.com/whitphx) / [LinkedIn](https://www.linkedin.com/in/whitphx/).
