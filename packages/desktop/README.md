## stlite Electron app

This project has been initialized with Create React App v4.0.3, which version is compatible with the Streamlit frontend.
So the directory structure and configurations are following it.
The React app in `./src` will be used as a frontend app of the Electron app, running in the renderer process.

Upon it, the source code for the Electron main process has been added at `./electron` that will be built into the same directory as the React app, `./build`.

This project structure is based on the following references.

- [Quick Start - Electron](https://www.electronjs.org/docs/latest/tutorial/quick-start)
- [Create React App(typescript)をベースに electron 環境を構築する](https://zenn.dev/niwaringo/articles/af693596ef948e)
- [Electron + React + TypeScript の開発環境構築 (webpack 編)](https://zenn.dev/sprout2000/articles/5d7b350c2e85bc)

## Workflow to build the app

### Build the base app

```sh
yarn build
```

This command builds the Electron app including both the main process (from `./electron`) and the renderer process (from `./src` with CRA) into `./build` directory.

At this point, the built app **does not contain the user code and data for Streamlit like `streamlit_app.py`**.
We will bundle it at the next step.

### Inject the user code and data and the installed requirements snapshot

```
./bin/dump_snapshot.ts <app source directory> [--requirements <requirement1> <requirement2> ... <requirementN>]
```

This command will do 2 things;

1. Copy the `<app source directory>` into `./build`, which will be loaded as a Streamlit app at runtime.
2. Create a temporary Pyodide environment, install the requirements there, create the snapshot file containing the installed files, and put the file into `./build`.

The Electron app built in the previous step will load these files and serve the Streamlit app at runtime.

In other words, we can replace the Streamlit app just by re-running `./bin/dump_snapshot.ts`, without re-building the app here with `yarn build`.

Now the `./build` is ready to be packaged.
At this point, `yarn serve` can be used to preview the app.

### Package the final Electron app

```
yarn dist
```

Create a distributable package using `electron-builder`.
This set-up is just following [its tutorial](https://www.electron.build/#quick-setup-guide)
