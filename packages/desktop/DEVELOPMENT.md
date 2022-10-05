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

This command builds the Electron app including the main process code (from `./electron`), the renderer process code (from `./src` with CRA), and Pyodide resources `./pyodide` in the `./build` directory (See `yarn build` command content for what it does).

The app compiled into the `./build` directory is a "bare" Electron stlite app that will load Streamlit app written as a Python project by app developers afterward, while it has not been created at this point, which will be done in the next step.

In other words, we can replace the Streamlit application just by injecting a different code in the next step, keeping the other parts of the `./build` directory.

Therefore, we create and publish an NPM package including the `./build` directory at this point so that we can reuse it as the base of different Streamlit apps afterward (See the `build-desktop` and the `publish-desktop` CI/CD jobs).

### Inject the user code and data and the installed requirements snapshot

```
./bin/dump_artifacts.ts <app source directory> [--requirements <requirement1> <requirement2> ... <requirementN>]
```

This command will do the following things;

1. Copy the `./build` directory of this package into the current directory. This assumes that `./build` and `./bin/dump_artifacts.ts` are bundled into an NPM package and the script is called by some developer in a new project.

- At a development phase of this package itself, this step is skipped as the source and destination directories of copying are the same one.

2. Copy the `<app source directory>` into `./build`. `<app source directory>` is the "home" directory of the Streamlit application.
3. Create a temporary Pyodide environment, install the requirements there, create the snapshot file containing the installed files, and put the file into `./build`.

The "bare" Electron app built in the previous step will load the files copied/created in steps 2. and 3 and serve the Streamlit app at runtime.

Now the `./build` is ready to be packaged.
At this point, `yarn serve` can be used to preview the app.

### Package the final Electron app

```
yarn dist
```

Create a distributable package using `electron-builder`.
This set-up is just following [its tutorial](https://www.electron.build/#quick-setup-guide)
