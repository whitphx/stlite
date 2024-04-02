# `@stlite/desktop`

Convert your [Streamlit](https://streamlit.io/) application into a desktop app with [stlite](https://github.com/whitphx/stlite) runtime, a [Pyodide](https://pyodide.org/)-based Wasm-port of Streamlit.

## How to create a Streamlit desktop app

1. Create the following `package.json` file to start a new NPM project. Edit the `name` field.
   ```json
   {
     "name": "xxx",
     "version": "0.1.0",
     "main": "./build/electron/main.js",
     "scripts": {
       "dump": "dump-stlite-desktop-artifacts",
       "serve": "cross-env NODE_ENV=production electron .",
       "pack": "electron-builder --dir",
       "dist": "electron-builder",
       "postinstall": "electron-builder install-app-deps"
     },
     "build": {
       "files": ["build/**/*"],
       "directories": {
         "buildResources": "assets"
       }
     },
     "devDependencies": {
       "@stlite/desktop": "^0.51.0",
       "cross-env": "^7.0.3",
       "electron": "^28.2.1",
       "electron-builder": "^24.9.1"
     }
   }
   ```
2. Run `npm install` or `yarn install`.
3. Create `streamlit_app` directory.
   - Any directory name can be used here.
4. Create `streamlit_app/streamlit_app.py`.
   - Change the directory name if you used a different name in the previous step.
5. Write your Streamlit app code in `streamlit_app/streamlit_app.py`.
   - The file name `streamlit_app.py` is not configurable now.
6. Optionally, you can add more contents in the directory, including `pages/*.py` for multi-page apps, any data files, and so on.
7. Run `npm run dump streamlit_app` or `yarn dump streamlit_app`. The command argument `streamlit_app` is the directory name of the Streamlit app you have created in the previous steps. Change it if you used a different name.
   - If installing some packages is needed, pass the package names following the directory name like `npm run dump streamlit_app <PackageName1> ... <PackageNameN>`.
   - The `-r` option like the `pip` command is also available to specify the text files listing the package names to install like `npm run dump streamlit_app -- -r requirements.txt` (NPM) or `yarn dump streamlit_app -r requirements.txt` (Yarn). Note that if you are using NPM, you need to add `--` before options such as `-r` in the `run` command ([ref](https://stackoverflow.com/questions/43046885/what-does-do-when-running-an-npm-command)).
   - This `dump` command creates `./build` directory. It includes
     - The stlite bare app files.
     - `streamlit_app` directory copied from the one you created in the previous steps.
     - `site-packages-snapshot.tar.gz` that includes the installed package files.
8. Run `npm run serve` or `yarn serve` for preview.
   - This command is just a wrapper of `electron` command as you can see at the `"scripts"` field in the `package.json`. It launches Electron and starts the app with `./build/electron/main.js`, which is specified at the `"main"` field in the `package.json`.
9. Run `npm run dist` or `yarn dist` for packaging.
   - This command bundles the `./build` directory created in the step above into application files (`.app`, `.exe`, `.dmg` etc.) in the `./dist` directory. To customize the built app, e.g. setting the icon, follow the [`electron-builder`](https://www.electron.build/) instructions.

## Use the latest version of Electron

To make your app secure, be sure to use the latest version of Electron.
This is [announced](https://www.electronjs.org/docs/latest/tutorial/security#16-use-a-current-version-of-electron) as one of the security best practices in the Electron document too.

## Configure the app

### Hide the toolbar, hamburger menu, and the footer

If you want to hide the toolbar, hamburger menu, and the footer, add the following to your `package.json` file and run the `dump` command again. By adding the `stlite.desktop.embed` field, the dumped Streamlit app will work in the [embed mode](https://docs.streamlit.io/streamlit-community-cloud/get-started/embed-your-app#embedding-with-iframes) which hides the toolbar, hamburger menu, and the footer.

```json
{
  // ...other fields...
  "stlite": {
    "desktop": {
      "embed": true
    }
  }
}
```

### File system

_stlite_ runs your Python code on [Pyodide](https://pyodide.org/), a CPython runtime compiled to Wasm, and Pyodide's backend, Emscripten, provides a virtual file system.
When _stlite_ runs your app, it mounts the source files onto the virtual file system, and what your Python code can access (e.g. `open("/path/to/something")`) is files and directories on the virtual file system.

The default file system ([`MEMFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#memfs)) is ephemeral, so the files saved in the directories are lost when the app is restarted. If you want to persist the files across the app restarts, you can use the IndexedDB-based file system ([`IDBFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#filesystem-api-idbfs)) or mount directories on the host OS file system to directories on the virtual file system.

#### File persistence with IndexedDB backend

You can mount the IndexedDB-based file system ([`IDBFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#filesystem-api-idbfs)) to directories on the virtual file system that your Python code can access, e.g. `open("/path/to/file")`.
You can specify the mount points via the `stlite.desktop.idbfsMountpoints` field in your `package.json` like below.
Note that you have to run the `dump` command again to apply the change.

The mounted file system is backed by IndexedDB and its data is stored in the browser's IndexedDB, so the files saved in the directories are persistent across the app restarts.

In the example below, the IndexedDB-based file system is mounted to the `/mnt` directory on the virtual file system, so that the files saved in the directory are persistent.

```json
{
  // ...other fields...
  "stlite": {
    "desktop": {
      "idbfsMountpoints": ["/mnt"]
    }
  }
}
```

#### Local file access

You can mount directories on the host OS file system to directories on the virtual file system.

To do this, you have to enable the Node.js worker mode (see the next section for details) and specify the mount points via the `stlite.desktop.nodefsMountpoints` field in your `package.json` like below.

The `nodefsMountpoints` field is an object that maps the virtual file system paths to the host OS paths.

In the example below, `"."` on the host OS file system is mounted to the `/mnt` directory on the virtual file system, so your app can access the files in `"."` on the host OS by accessing the files in `/mnt` on the virtual file system.

```json
{
  // ...other fields...
  "stlite": {
    "desktop": {
      "nodeJsWorker": true,
      "nodefsMountpoints": {
        "/mnt": "."
      }
    }
  }
}
```

### NodeJS worker mode

`@stlite/desktop` runs your app on [Electron](https://www.electronjs.org/) as a desktop app.
Electron apps have two processes: the main process which is a Node.js process running in the background, and the renderer process which is a Chromium (browser) process running the app's UI.

By default, _stlite_ executes your Python code on Pyodide running in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) dispatched by the renderer process, and the renderer process is a browser process so it's sandboxed from the host OS.

When you set the `stlite.desktop.nodeJsWorker` field in your `package.json` to `true`, _stlite_ dispatches the worker as a [NodeJS worker](https://nodejs.org/api/worker_threads.html) that runs in the main process, which is not sandboxed, so you can mount the host OS file system to the virtual file system as described in the previous section.

```json
{
  // ...other fields...
  "stlite": {
    "desktop": {
      "nodeJsWorker": true
    }
  }
}
```

## Limitations

- Navigation to external resources like `st.markdown("[link](https://streamlit.io/)")` does not work for security. See https://github.com/whitphx/stlite/pull/445 and let us know if you have use cases where you have to use such external links.
