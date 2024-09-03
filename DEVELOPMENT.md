## Local development of `stlite`

### Python requirement

Use the Python version same as the one which the [currently used Pyodide](./packages/kernel/src/worker.ts) runs.

### Initialize the development environment

```
make init
```

### Development of each package

#### `@stlite/kernel`

The following command starts the file watcher and the hot reloader that are recommended to keep active during the development of other packages depending on the kernel.

```shell
cd packages/kernel
yarn start
```

#### `@stlite/mountable`

```shell
cd packages/mountable
yarn start
```

#### stlite sharing (`@stlite/sharing` and `@stlite/sharing-editor`)

Launch the app sharing service.

```shell
cd packages/sharing
yarn start
```

In another shell, launch the editor service.

```shell
cd packages/sharing-editor
yarn start
```

### Build all the packages

At the root directory,

```shell
make
```

## Release a new version

You can select the next version in an interactive shell with the following command. Then it will automatically create a new commit, tag it, and push the commit to the remote repository which triggers the release process on GitHub Actions.

```shell
yarn new-version
```

`--force-publish` is useful if you need to create a new version without changes to the code.

```shell
yarn new-version --force-publish
```
