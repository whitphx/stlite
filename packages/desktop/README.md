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
       "@stlite/desktop": "^0.25.0",
       "cross-env": "^7.0.3",
       "electron": "23.1.1",
       "electron-builder": "^23.6.0"
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

## Limitations

- Navigation to external resources like `st.markdown("[link](https://streamlit.io/)")` does not work for security. See https://github.com/whitphx/stlite/pull/445 and let us know if you have use cases where you have to use such external links.
