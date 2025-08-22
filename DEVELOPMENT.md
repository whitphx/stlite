## Local development of `stlite`

### Python requirement

- Install [`uv`](https://docs.astral.sh/uv/).
- Use the Python version same as the one which the [currently used Pyodide](./packages/kernel/src/worker.ts) runs.

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

#### `@stlite/browser`

```shell
cd packages/browser
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

## Update the Streamlit package

Go to the `streamlit` directory.

```shell
cd streamlit
```

Fetch the commits from the Streamlit repository.

For the first time, you need to add the upstream remote repository.

```shell
git remote add upstream https://github.com/streamlit/streamlit.git
```

Then, every time you want to update the Streamlit repository, fetch the commits from the upstream repository.

```shell
git fetch upstream
```

Create a new branch for the new version based on the latest version branch.

```shell
NEW_STLITE_BRANCH=stlite-1.45.1
CURRENT_STLITE_BRANCH=stlite-1.44.1
git checkout -b $NEW_STLITE_BRANCH $CURRENT_STLITE_BRANCH
```

Rebase the new branch onto the latest Streamlit version tag.

```shell
NEW_BASE_STREAMLIT_VERSION_TAG=1.45.1
CURRENT_BASE_STREAMLIT_VERSION_TAG=1.44.1
git rebase --onto $NEW_BASE_STREAMLIT_VERSION_TAG $CURRENT_BASE_STREAMLIT_VERSION_TAG $NEW_STLITE_BRANCH
```

## Update the sample apps in Stlite Sharing

1. Clone or pull the latest `streamlit/docs` repository.
2. Run the following command to copy the sample apps to the `stlite/packages/sharing-editor/data/streamlit_docs` directory.

```
sh ./packages/sharing-editor/bin/copy-samples.sh path/to/streamlit/docs
```

3. (If needed) Modify the copied sample apps to be compatible with Stlite, and save the changes as patches.
   ```
   diff /path/to/streamlit/docs/original_file packages/sharing-editor/public/samples/modified_file > packages/sharing-editor/bin/sample-diffs/modified_file
   ```
   Then update `copy-samples.sh` to apply the patches to the copied sample apps.

## Release a new version

You can select the next version in an interactive shell with the following command. Then it will automatically create a new commit, tag it, and push the commit to the remote repository which triggers the release process on GitHub Actions.

```shell
yarn new-version
```

`--force-publish` is useful if you need to create a new version without changes to the code.

```shell
yarn new-version --force-publish
```

### Windows Developement
Use WSL, you'll need to install the following to initialize your Dev environment. Afterwards follow the normal build steps
```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
sudo apt-get update
sudo apt-get install build-essential
sudo apt-get install nodejs
sudo apt  install protobuf-compiler
```