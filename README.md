# stlite: Serverless Streamlit

[![Test, Build, and Publish](https://github.com/whitphx/stlite/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/whitphx/stlite/actions/workflows/main.yml)
[![Build and Deploy GitHub Pages](https://github.com/whitphx/stlite/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/gh-pages.yml)

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
      href="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.39.0/build/stlite.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.39.0/build/stlite.js"></script>
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

> ⚠️ If you are using backticks `` ` `` inside your app script (e.g. if you have included markdown sections with code highlighting) they would close the script block in `` st.mount(` ... `) ``. To avoid this, you can escape them with with a preceding backslash `\`.
>
> ```html
> <script>
>   stlite.mount(
>     `
> import streamlit as st
> 
> st.markdown("This is an inline code format: \`code\`")
> `,
>     document.getElementById("root")
>   );
> </script>
> ```

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

_stlite_ runs on [Pyodide](https://pyodide.org/), and [it has a file system provided by Emscripten](https://pyodide.org/en/stable/usage/file-system.html).
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
  document.getElementById("root")
);
```

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

### Different stlite versions

In the example above, the _stlite_ script is loaded via the `<script>` tag with the versioned URL.
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

### Different Pyodide distributions

_stlite_ uses [Pyodide](https://pyodide.org/) and loads it from the [CDN](https://pyodide.org/en/stable/usage/downloading-and-deploying.html#cdn) by default. You can use your own Pyodide distribution by passing the URL to the `pyodideUrl` option as below. This would be helpful for example when your organization has a restrictive policy for CDN access.

```js
stlite.mount(
  {
    pyodideUrl: "https://<your-pyodide-distribution-url>/pyodide.js",
    // ... other options ...
  },
  document.getElementById("root")
);
```

## File system

_stlite_ executes your Python code on [Pyodide](https://pyodide.org/) in a browser, and Pyodide has its own Linux-like file system isolated from the host OS (see [Pyodide's](https://pyodide.org/en/stable/usage/file-system.html) or [Emscripten's](https://emscripten.org/docs/api_reference/Filesystem-API.html) documents about the FS for details).
The source code and data files are mounted on the file system, and the Python code can access it. So, for example, what `open("path/to/file")` reads or writes is the file on the file system virtually existing in the browser, not a file on the host OS.

The default file system ([`MEMFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#memfs)) is ephemeral, so the files saved in the directories are lost when the page is reloaded.
The root `/` and some directories including home are mounted as `MEMFS`, the ephemeral file system, by default.

### File persistence with IndexedDB backend

To persist the files across the app restarts, you can use the IndexedDB-based file system ([`IDBFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#filesystem-api-idbfs)). The files saved in the directories mounted with `IDBFS` are stored in the browser's IndexedDB, so they are persistent across the app restarts.

In the case of `@stlite/mountable`, you can mount the IndexedDB-based file system, `IDBFS` to the specified directories in the virtual file system, by passing the `idbfsMountpoints` option as below.
The mounted file system is persistent across the page reloads and the browser sessions.

```js
stlite.mount(
  {
    idbfsMountpoints: ["/mnt"], // Mount the IndexedDB-based file system to the /mnt directory.
    entrypoint: "streamlit_app.py",
    files: {
      "streamlit_app.py": `
import datetime
import streamlit as st

with open("/mnt/data.txt", "a") as f:
    f.write(f"{datetime.datetime.now()}\\n")

with open("/mnt/data.txt", "r") as f:
    st.code(f.read())
`,
    },
    // ... other options ...
  },
  document.getElementById("root")
);
```

## HTTP requests

To make HTTP requests, these libraries work on _stlite_.

- `requests` (only [these classes and methods](https://github.com/koenvo/pyodide-http?tab=readme-ov-file#supported-packages))
- `urllib` (only [these classes and methods](https://github.com/koenvo/pyodide-http?tab=readme-ov-file#supported-packages))
- `urllib3` ([since 2.2.0](<(https://urllib3.readthedocs.io/en/stable/reference/contrib/emscripten.html)>))
- [`pyodide.http.pyfetch()`](https://pyodide.org/en/stable/usage/api/python-api/http.html#pyodide.http.pyfetch) and [`pyodide.http.open_url()`](https://pyodide.org/en/stable/usage/api/python-api/http.html#pyodide.http.open_url)
  - See also the following section about top-level await to know how to use the async method `pyodide.http.pyfetch()`.

_stlite_ automatically enables [`koenvo/pyodide-http`](https://github.com/koenvo/pyodide-http)'s patches to make `requests` and `urllib` work,
while the networking libraries do not work in general on the Pyodide runtime (Python in browser) as written in [this doc](https://pyodide.org/en/stable/project/roadmap.html#http-client-limit) and Pyodide provides its standard alternative methods to make HTTP requests, `pyodide.http.pyfetch()` and `pyodide.http.open_url()`.

Also, `urllib3` supports Pyodide since 2.2.0 as [this document](https://urllib3.readthedocs.io/en/stable/reference/contrib/emscripten.html) says.

## Limitations

As _stlite_ runs on the web browser environment ([Pyodide](https://pyodide.org/) runtime), there are things not working well. The known issues follow.

- `st.spinner()` does not work with blocking methods like `pyodide.http.open_url()` because stlite runs on a single-threaded environment, so `st.spinner()` can't execute its code to start showing the spinner during the blocking method occupies the only event loop.
  - If you want to show a spinner with a blocking method, add a 0.1 second sleep before the blocking method call, although this will definitely add an empty 0.1 second wait to the execution.
    ```python
    with st.spinner("Running a blocking method..."):
        await asyncio.sleep(0.1)  # Add this line to wait for the spinner to start showing
        some_blocking_method()
    ```
- `st.bokeh_chart()` does not work since Pyodide uses Bokeh version 3.x while Streamlit only supports 2.x. The 3.x support for Streamlit is tracked here: https://github.com/streamlit/streamlit/issues/5858
- `time.sleep()` is no-op. Use `asyncio.sleep()` instead. This is a restriction from Pyodide runtime. See https://github.com/pyodide/pyodide/issues/2354. The following section about top-level await may also help to know how to use async functions on stlite.
- There are some small differences in how (less common) data types of DataFrame columns are handled in `st.dataframe()`, `st.data_editor()`, `st.table()`, and Altair-based charts. The reason is that _stlite_ uses the Parquet format instead of the Arrow IPC format to serialize dataframes (Ref: [#601](https://github.com/whitphx/stlite/pull/601)).
- Packages including binary extensions (e.g. C/Rust/Fortran/etc) that are not built for the Pyodide environment cannot be installed. See https://pyodide.org/en/stable/usage/faq.html#why-can-t-micropip-find-a-pure-python-wheel-for-a-package for the details.

Other problems are tracked at GitHub Issues: https://github.com/whitphx/stlite/issues
If you find a new problem, please report it.

## Top-level await

TL;DR: Use top-level await instead of `asyncio.run()` on stlite.

Unlike the original Streamlit, _stlite_ supports top-level await due to the differences in their execution models. Streamlit runs in a standard Python environment, allowing the use of `asyncio.run()` when an async function needs to be executed within a script. In contrast, stlite runs in a web browser, operating in an environment where the only event loop is always in a running state. This makes it impossible to use `asyncio.run()` within a script, necessitating the support for top-level await.

Top-level await can be useful in various situations.

### Example 1: `asyncio.sleep()`

One of the most common use cases is `asyncio.sleep()`. As mentioned in the previous section, `time.sleep()` is no-op on _stlite_ because its blocking nature is not compatible with the single-threaded event loop in the web browser environment. Instead, `asyncio.sleep()`, which is non-blocking, can be used to pause the execution of a script for a specified amount of time.

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

Another common use case is accessing external resources. Pyodide provides a Python wrapper of browser's [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [`pyodide.http.pyfetch()`](https://pyodide.org/en/stable/usage/api/python-api/http.html#pyodide.http.pyfetch) for making HTTP requests. Since this method is async, top-level await is sometimes used to handle the response.

Here's an example:

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
- [📖 "Python-Based Data Viz (With No Installation Required)", by Sam Minot](https://towardsdatascience.com/python-based-data-viz-with-no-installation-required-aaf2358c881)
- [📖 "Converting Streamlit application to exe file", by Neelasha Sen](https://ploomber.io/blog/streamlit_exe/)
- [📖 "Streamlit + Stlite: Beyond Data Science Applications", by Saumitra Panchal](https://medium.com/@saumitrapanchal/streamlit-stlite-beyond-data-science-applications-23de64648883)
- [📖 "stlite: Serverless Streamlit — Run Your Apps in the Browser", by Alan Jones](https://medium.com/codefile/stlite-serverless-streamlit-d1dcf5be35f8)

## Samples

### ⚡️Serverless Image Processing App

Image processing with OpenCV works on the client side.

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
