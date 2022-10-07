# `@stlite/desktop-cli`

Convert your [Streamlit](https://streamlit.io/) application into a desktop app with [stlite](https://github.com/whitphx/stlite) runtime, a [Pyodide](https://pyodide.org/)-based Wasm-port of Streamlit.

## How to create a Streamlit desktop app

1. Create a new NPM project with the following `package.json`. Edit the `name` field.
   ```json
   {
     "name": "xxx",
     "version": "0.1.0",
     "main": "./build/electron/main.js",
     "scripts": {
       "dump": "dump-stlite-desktop-artifacts",
       "serve": "NODE_ENV=\"production\" electron .",
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
       "@stlite/desktop-cli": "^0.12.0",
       "electron": "20.2.0",
       "electron-builder": "^23.3.3"
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
   - If installing some packages is needed, use `-r` option like `npm run dump streamlit_app -r <PackageName1> ... <PackageNameN>`.
   - This command creates `./build` directory. It includes
     - The stlite bare app files.
     - `streamlit_app` directory copied from the one you created in the previous steps.
     - `site-packages-snapshot.tar.gz` that includes the installed package files.
8. Run `npm run serve` or `yarn serve` for preview.
   - This command is just a wrapper of `electron` command as you can see at the `"scripts"` field in the `package.json`. It launches Electron and starts the app with `./build/electron/main.js`, which is specified at the `"main"` field in the `package.json`.
9. Run `npm run dist` or `yarn dist` for packaging.
   - This command just calls [`electron-builder`](https://www.electron.build/) (see the `"scripts"` field in the `package.json`) and it simply bundles the `./build` directory created in the step above. If you want to customize the built app, e.g., setting the icon, follow its instruction.
