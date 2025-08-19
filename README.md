# Stlite: In-browser Streamlit

**Serverless [Streamlit](https://streamlit.io/) Running Entirely in Your Browser**

[![Test and Build](https://github.com/whitphx/stlite/actions/workflows/test-build.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/test-build.yml)
[![Postbuild](https://github.com/whitphx/stlite/actions/workflows/postbuild.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/postbuild.yml)
[![Build and Deploy GitHub Pages](https://github.com/whitphx/stlite/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/gh-pages.yml)
This project is tested with BrowserStack.

[![npm (scoped)](https://img.shields.io/npm/v/@stlite/browser?label=%40stlite%2Fbrowser)](https://www.npmjs.com/package/@stlite/browser)
[![npm (@stlite/desktop)](https://img.shields.io/npm/v/@stlite/desktop?label=%40stlite%2Fdesktop)](https://www.npmjs.com/package/@stlite/desktop)

<img src="./assets/stlite.svg" style="background: white;" >

Streamlit is a Python web app framework for the fast development of data apps. This project is to make it run completely on web browsers with the power of [Pyodide](https://pyodide.org/), WebAssembly (Wasm)-ported Python.

## Try it out online (_Stlite Sharing_)

Visit [Stlite Sharing](https://edit.share.stlite.net/).

[<img src="https://edit.share.stlite.net/ogp.png" height="180" >](https://edit.share.stlite.net/)

## Create a desktop app (`@stlite/desktop`)

See [`@stlite/desktop`](./packages/desktop/README.md).

## Use _Stlite_ on your web page (`@stlite/browser`)

> [!NOTE]
> Since 0.76.0, `@stlite/mountable` is renamed to `@stlite/browser`, and the API is changed. See the [Migration guide](./CHANGELOG.md#how-to-migrate-from-stlitemountable-to-stlitebrowser) for the details.

You can use _Stlite_ on your web page loading the script and CSS files via `<script>` and `<link>` tags as below.
Here is a sample HTML file.

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Stlite App</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@stlite/browser@0.85.1/build/stlite.css"
    />
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@stlite/browser@0.85.1/build/stlite.js"
    ></script>
  </head>
  <body>
    <streamlit-app>
      import streamlit as st

      name = st.text_input('Your name')
      st.write("Hello,", name or "world")
    </streamlit-app>
  </body>
</html>
```

In this sample,

- _Stlite_ is set up by loading the JavaScript and CSS files via `<script>` and `<link>` tags.
- The _Stlite_ runtime recognizes the `<streamlit-app>` tag and launches the Streamlit app defined in it.

---

_Stlite_ also provides the "more raw" API with which you call the `mount()` JavaScript function explicitly to mount a Streamlit app on a specific element in the DOM.

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Stlite App</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@stlite/browser@0.83.0/build/stlite.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import { mount } from "https://cdn.jsdelivr.net/npm/@stlite/browser@0.83.0/build/stlite.js";
      mount(
        `
import streamlit as st

name = st.text_input('Your name')
st.write("Hello,", name or "world")
`,
        document.getElementById("root"),
      );
    </script>
  </body>
</html>
```

In this sample,

- _Stlite_'s `mount()` function is imported within the `<script>` tag. You also need to load the CSS file via `<link>` tag as well.
- `mount()` mounts the Streamlit app on the `<div id="root" />` element as specified via the second argument. The app script is passed via the first argument.

> [!NOTE]
> If you use backticks `` ` `` inside your Streamlit code (e.g. writing markdown with code blocks), they may conflict with JavaScript string literal's backtick like ``st.mount(` ... `)``. To avoid it, you can escape them with with a preceding backslash `\`.
> This issue doesn't occur when you use the `<streamlit-app>` tag.
>
> ```js
> mount(
>   `
> import streamlit as st
>
> st.markdown("This is an inline code format: \`code\`")
> `,
>   document.getElementById("root"),
> );
> ```

Hint: Technically, the `<streamlit-app>` tag API is a wrapper around the `mount()` function.

### More controls

If you need to do more such as

- mounting multiple files
- installing dependencies
- setting the Streamlit config via the `config.toml` file

you can use the `<streamlit-app>` tag with the `<app-file>`, and `<app-requirements>` tags as below.

```html
<streamlit-app>
  <app-file name="streamlit_app.py" entrypoint>
    import streamlit as st
    import matplotlib.pyplot as plt
    import numpy as np

    size = st.slider("Sample size", 100, 1000)
    arr = np.random.normal(1, 1, size=size)
    fig, ax = plt.subplots()
    ax.hist(arr, bins=20)
    st.pyplot(fig)
  </app-file>
  <app-file name=".streamlit/config.toml">
    [client]
    toolbarMode = "viewer"
  </app-file>
  <app-requirements>
    matplotlib
  </app-requirements>
</streamlit-app>
```

---

If you want to use the `mount()` function instead, it would look like this:

```js
mount(
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
    streamlitConfig: {
      // Streamlit configuration
      "client.toolbarMode": "viewer",
    },
  },
  document.getElementById("root"),
);
```

### Various ways to load files (`files` option)

You can pass an object to the `files` option to mount files onto the file system, whose keys are file paths, and you can specify the values in various ways as below. See also the [File system](#file-system) section for more details.

#### Passing string or binary data

You can pass the file content as a string or binary data.

This is what we did in the example above.

```js
mount(
  {
    files: {
      "path/to/text_file.txt": "file content",
      "path/to/binary_file.bin": new Uint8Array([0x00, 0x01, 0x02, 0x03]),
    },
    // ... other options ...
  },
  document.getElementById("root"),
);
```

#### Passing an object with a URL

You can use this way to load a file from a URL and mount it to the specified path on the virtual file system.

Either an absolute or relative URL is accepted. Consider as the same as the `url` option of the [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) function.

```js
mount(
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
  document.getElementById("root"),
);
```

#### Passing an object with options (advanced)

_Stlite_ runs on [Pyodide](https://pyodide.org/), and [it has a file system provided by Emscripten](https://pyodide.org/en/stable/usage/file-system.html).
The files specified via the `files` option are mounted on the file system, and [Emscripten's `FS.writeFile()` function](https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.writeFile) is used internally for it.
You can specify the options (`opts`) for the `FS.writeFile(path, data, opts)` function as below.

```js
mount(
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
  document.getElementById("root"),
);
```

### Loading archive files (`archives` option)

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
  document.getElementById("root"),
);
```

### Multipage apps

You can pass the multiple files to the `files` option as below to construct the multipage app structure, the entry point file and `pages/*.py` files.

Read [the Streamlit official document](https://docs.streamlit.io/library/get-started/multipage-apps) about the multipage apps.

```js
mount(
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
  document.getElementById("root"),
);
```

### Customizing the Streamlit configuration (`streamlitConfig` option)

You can pass the Streamlit configuration options to the `streamlitConfig` field as key-value pairs as below. Unlike the original Streamlit configuration, the options are passed as a flat object with the keys separated by dots.

```js
mount(
  {
    streamlitConfig: {
      "theme.base": "dark",
      "theme.primaryColor": "#00b4d8",
      "theme.backgroundColor": "#03045e",
      "theme.secondaryBackgroundColor": "#0077b6",
      "theme.textColor": "#caf0f8",
      "client.toolbarMode": "viewer",
      "client.showErrorDetails": false,
    },
    // ... other options ...
  },
  document.getElementById("root"),
);
```

### Install packages with options

Specifying the `installs` option on `mount()` or calling `controller.install()` allows you to install packages with specific options that are passed to [`micropip.install`](https://micropip.pyodide.org/en/v0.7.1/project/api.html#micropip.install) internally.

```js
const controller = mount({
  // ... other options ...
  installs: [
    {
      requirements,
      options: {
        keep_going,
        deps,
        credentials,
        pre,
        index_urls,
        constraints,
        reinstall,
        verbose,
      },
    },
  ],
});

controller.install(requirements, {
  keep_going,
  deps,
  credentials,
  pre,
  index_urls,
  constraints,
  reinstall,
  verbose,
});
```

### Different Stlite versions

In the example above, the _Stlite_ script is loaded from the versioned URL.

The following URLs are also available, while our recommendation is to use the versioned one as above because the API may change without backward compatibility in future releases.

#### The latest release

```
https://cdn.jsdelivr.net/npm/@stlite/browser/build/stlite.js
```

You can use the latest version of the published _Stlite_ package with this URL.

#### The head of the main branch

```
https://whitphx.github.io/stlite/lib/browser/stlite.js
```

This URL points to the head of the main branch which is usually ahead of the released packages. However, we strongly recommend NOT to use this URL because this might be broken and there is no guarantee that this resource will be kept available in the future.

### Different Pyodide distributions (`pyodideUrl` option)

_Stlite_ uses [Pyodide](https://pyodide.org/) and loads it from the [CDN](https://pyodide.org/en/stable/usage/downloading-and-deploying.html#cdn) by default. You can use your own Pyodide distribution by passing the URL to the `pyodideUrl` option as below. This would be helpful for example when your organization has a restrictive policy for CDN access.

```js
mount(
  {
    pyodideUrl: "https://<your-pyodide-distribution-url>/pyodide.js",
    // ... other options ...
  },
  document.getElementById("root"),
);
```

Pyodide provides two distribution types, full and core, and you should serve the full distribution in this case.
_Stlite_ loads some packages from the Pyodide distribution such as `micropip` and they are not included in the core distribution.
Even with the full distribution whose size is quite large (+200MB), only the necessary packages are loaded on demand, so the actual size of loaded resources is smaller and you don't have to choose the core distribution worrying about the size. Ref: [#1007](https://github.com/whitphx/stlite/issues/1007#issuecomment-2214434028).

## File system

_Stlite_ executes your Python code on [Pyodide](https://pyodide.org/) in the browser, and Pyodide has its own Linux-like file system isolated from the host OS (see [Pyodide's](https://pyodide.org/en/stable/usage/file-system.html) or [Emscripten's](https://emscripten.org/docs/api_reference/Filesystem-API.html) documents about the FS for details).
The source code and data files are mounted on the file system through the `files` and `archives` options as described above, and the Python code can access them. So, for example, what `open("path/to/file")` reads or writes is the file on the file system virtually existing in the browser, not a file on the host OS.

The default file system ([`MEMFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#memfs)) is ephemeral, so the files saved in the directories are lost when the page is reloaded.
The root `/` and some directories including home are mounted as `MEMFS`, the ephemeral file system, by default.

### File persistence with IndexedDB backend

To persist the files across the app restarts, you can use the IndexedDB-based file system ([`IDBFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#filesystem-api-idbfs)). The files saved in the directories mounted with `IDBFS` are stored in the browser's IndexedDB, so they are persistent across the app restarts.

In the case of `@stlite/browser`, you can mount the IndexedDB-based file system, `IDBFS` to the specified directories in the virtual file system, by passing the `idbfsMountpoints` option as below.
The mounted file system is persistent across the page reloads and the browser sessions.

```js
mount(
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
  document.getElementById("root"),
);
```

## HTTP requests

To make HTTP requests, these libraries work on _Stlite_.

- `requests` (only [these classes and methods](https://github.com/koenvo/pyodide-http?tab=readme-ov-file#supported-packages))
- `urllib` (only [these classes and methods](https://github.com/koenvo/pyodide-http?tab=readme-ov-file#supported-packages))
- `urllib3` ([since 2.2.0](<(https://urllib3.readthedocs.io/en/stable/reference/contrib/emscripten.html)>))
- [`pyodide.http.pyfetch()`](https://pyodide.org/en/stable/usage/api/python-api/http.html#pyodide.http.pyfetch) and [`pyodide.http.open_url()`](https://pyodide.org/en/stable/usage/api/python-api/http.html#pyodide.http.open_url)
  - See also the following section about top-level await to know how to use the async method `pyodide.http.pyfetch()`.

_Stlite_ automatically enables [`koenvo/pyodide-http`](https://github.com/koenvo/pyodide-http)'s patches to make `requests` and `urllib` work,
while the networking libraries do not work in general on the Pyodide runtime (Python in browser) as written in [this doc](https://pyodide.org/en/stable/project/roadmap.html#http-client-limit) and Pyodide provides its standard alternative methods to make HTTP requests, `pyodide.http.pyfetch()` and `pyodide.http.open_url()`.

Also, `urllib3` supports Pyodide since 2.2.0 as [this document](https://urllib3.readthedocs.io/en/stable/reference/contrib/emscripten.html) says.

## Limitations

As _Stlite_ runs on the web browser environment ([Pyodide](https://pyodide.org/) runtime), there are things not working well. The known issues follow.

- `st.spinner()` does not work with blocking methods like `pyodide.http.open_url()` because _Stlite_ runs on a single-threaded environment, so `st.spinner()` can't execute its code to start showing the spinner during the blocking method occupies the only event loop.
  - If you want to show a spinner with a blocking method, add a 0.1-second sleep before the blocking method call, although this will definitely add an empty 0.1-second wait to the execution.
    ```python
    with st.spinner("Running a blocking method..."):
        await asyncio.sleep(0.1)  # Add this line to wait for the spinner to start showing
        some_blocking_method()
    ```
- `st.bokeh_chart()` does not work since Pyodide uses Bokeh version 3.x while Streamlit only supports 2.x. The 3.x support for Streamlit is tracked here: https://github.com/streamlit/streamlit/issues/5858
- `time.sleep()` is no-op. Use `asyncio.sleep()` instead. This is a restriction from Pyodide runtime. See https://github.com/pyodide/pyodide/issues/2354. The following section about top-level await may also help to know how to use async functions on _Stlite_.
- `st.write_stream()` should be used with an async generator function rather than a normal generator function. Due to the same reason as `st.spinner()` above, the normal generator function does not work well in the browser environment, while it still can be passed to `st.write_stream()`. The following is an example of `st.write_stream()` with an async generator function.

  ```python
  async def stream():
      for i in range(10):
          yield i
          await asyncio.sleep(1)

  st.write_stream(stream)
  ```

- There are some small differences in how (less common) data types of DataFrame columns are handled in `st.dataframe()`, `st.data_editor()`, `st.table()`, and Altair-based charts. The reason is that _Stlite_ uses the Parquet format instead of the Arrow IPC format to serialize dataframes (Ref: [#601](https://github.com/whitphx/stlite/pull/601)).
- Packages including binary extensions (e.g. C/Rust/Fortran/etc) that are not built for the Pyodide environment cannot be installed. See https://pyodide.org/en/stable/usage/faq.html#why-can-t-micropip-find-a-pure-python-wheel-for-a-package for the details.
- Package version resolution may fail in some cases [due to micropip's version resolution mechanism](https://github.com/pyodide/micropip/issues/103):
  - `plotly` functions may fail when installed with `altair` as [#1302](https://github.com/whitphx/stlite/issues/1302#issuecomment-2668085164) describes in which case installing `plotly==5.*` may help.

Other problems are tracked at GitHub Issues: https://github.com/whitphx/stlite/issues
If you find a new problem, please report it.

## Top-level await

TL;DR: Use top-level await instead of `asyncio.run()` on _Stlite_.

Unlike the original Streamlit, _Stlite_ supports top-level await due to the differences in their execution models. Streamlit runs in a standard Python environment, allowing the use of `asyncio.run()` when an async function needs to be executed within a script. In contrast, _Stlite_ runs in a web browser, operating in an environment where the only event loop is always in a running state. This makes it impossible to use `asyncio.run()` within a script, necessitating the support for top-level await.

Top-level await can be useful in various situations.

### Example 1: `asyncio.sleep()`

One of the most common use cases is `asyncio.sleep()`. As mentioned in the previous section, `time.sleep()` is no-op on _Stlite_ because its blocking nature is not compatible with the single-threaded event loop in the web browser environment. Instead, `asyncio.sleep()`, which is non-blocking, can be used to pause the execution of a script for a specified amount of time.

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

- [📖 Streamlit meets WebAssembly - stlite, by whitphx](https://www.whitphx.info/posts/20221104-streamlit-wasm-stlite/): A blog post covering from some technical surveys to the usages of the online editor _Stlite Sharing_, self-hosting apps, and the desktop app bundler.
- [📺 "Serverless Streamlit + OpenCV Python Web App Tutorial", by 1littlecoder, YouTube](https://youtu.be/7Qja9ZAWcfw): A quick tutorial to develop an OpenCV image processing app with _Stlite_ that runs completely on browsers.
- [📖 "New library: stlite, a port of Streamlit to Wasm, powered by Pyodide", Streamlit Community](https://discuss.streamlit.io/t/new-library-stlite-a-port-of-streamlit-to-wasm-powered-by-pyodide/25556):
  The Stlite thread at the Streamlit online forum.
- [📺 "Stlite - Streamlit without Server - powered by Pyodide (WebAssembly)", by 1littlecoder, YouTube](https://youtu.be/VQdktxgbmmg):
  A quick tutorial with local app development and GitHub Pages deployment.
- [📺 "How to Convert a Streamlit App to an .EXE Executable", by Fanilo Andrianasolo, YouTube](https://youtu.be/3wZ7GRbr91g):
  A tutorial to convert a Streamlit app to an executable file with _Stlite_ and a demo to run it on an offline machine.
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

### Hal9

[<img src="https://hal9.com/logo/hal9-square-black.png" height="50" >](https://hal9.com/)

They are sponsoring me on [GitHub Sponsors](https://github.com/sponsors/whitphx)!

### RAKUDEJI Inc.

[<img src="https://imagedelivery.net/uODi9j-67fGrJlC0UtMj5w/3c47faee-8dab-41fa-ded6-681bdc3e9500/desktop" height="50" >](https://rakudeji.com/)

They are sponsoring me on [GitHub Sponsors](https://github.com/sponsors/whitphx)!

## Support the project

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D2ERWFG)

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="180" height="50" >](https://www.buymeacoffee.com/whitphx)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/whitphx?label=Sponsor%20me%20on%20GitHub%20Sponsors&style=social)](https://github.com/sponsors/whitphx)

Contact the author: [Twitter](https://twitter.com/whitphx) / [LinkedIn](https://www.linkedin.com/in/whitphx/).
