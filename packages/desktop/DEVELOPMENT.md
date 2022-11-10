## stlite Electron app

This project has been initialized with Create React App v4.0.3, which version is compatible with the Streamlit frontend.
So the directory structure and configurations are following it.
The React app in `./src` will be the web frontend part of the Electron-bundled app, running in the renderer process.

Upon it, the source code for the Electron main process has been added at `./electron` that will be built into the same directory as the React app, `./build`.

This project structure is based on the following references.

- [Quick Start - Electron](https://www.electronjs.org/docs/latest/tutorial/quick-start)
- [Create React App(typescript)をベースに electron 環境を構築する](https://zenn.dev/niwaringo/articles/af693596ef948e)
- [Electron + React + TypeScript の開発環境構築 (webpack 編)](https://zenn.dev/sprout2000/articles/5d7b350c2e85bc)

## Workflow to develop and build the desktop app

### Build the base app

```sh
yarn build:app
```

This command builds the Electron app including the main process code (from `./electron`), the renderer process code (from `./src` with CRA), and Pyodide resources `./pyodide` in the `./build` directory (See the content of the NPM script `build:app` for what it does).

The app compiled into the `./build` directory is a "bare" Electron stlite app that will load the Streamlit app by the app developer afterward, while it has not been created at this point but will be done in the next step.

In other words, we can replace the Streamlit app just by injecting a different code in the next step, keeping the other parts of the `./build` directory.

Therefore, we create and publish an NPM package including the `./build` directory at this point so that we can reuse it as the base of different Streamlit apps. See the `build-desktop` and the `publish-desktop` CI/CD jobs about it.

### Inject the user code and data and the installed requirements snapshot

```shell
./bin/dump_artifacts.ts <app source directory> [<requirement1> <requirement2> ... <requirementN>]
```

This command will do the following things;

1. **When this command is packaged into the released NPM package (so not during the development in this repository)**, it copies the `./build` directory of the NPM package into the current directory.
   - Precisely, this step is skipped when the source and the destination directories of copying are the same, e.g. during the development in `<stlite repo>/packages/desktop`.
2. Copy the `<app source directory>` into `./build`. `<app source directory>` is the "home" directory of the Streamlit application.
3. Create a temporary Pyodide environment, install the requirements there, create the snapshot file containing the installed files, and put the file into `./build`.

The "bare" Electron app copied from the NPM package at the step 1 or built in the previous section will load the files copied/created in steps 2 and 3 and serve the Streamlit app at runtime.

Now the `./build` directory is ready to be bundled as an Electron app which will be in the next section.
`yarn serve` can also be used to preview the app at this point.

### Package the final Electron app

```
yarn dist
```

Create a distributable package using `electron-builder`.
This set-up is just following [its tutorial](https://www.electron.build/#quick-setup-guide)
