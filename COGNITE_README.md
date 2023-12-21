# stlite: Serverless Streamlit

A port of [Streamlit](https://streamlit.io/) to WebAssembly, powered by [Pyodide](https://pyodide.org/).

Streamlit is a Python web app framework for the fast development of data apps. This project is to make it run completely on web browsers.

# Cognite's modifications

We are using this in the Fusion app, where the Streamlit app is loaded and rendered using an iframe. The modifications we have done to `stlite` repo is

- Handle token exchange from Fusion so that the Python SDK is authenticated
- Handle the app configuration so apps stored in CDF are being mounted properly
- GitHub actions to do deployment to Firebase

# Local development

## Prerequisites

You need to have installed

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [yarn](https://yarnpkg.com/) `npm -g install yarn`
- grpc `brew install grpc`
- protobuf `brew install protobuf`

## Cloning the repository

```
git clone --recursive https://github.com/cognitedata/stlite
cd stlite
```

## Building and serving

```
USE_CONSTRAINT_FILE=false make mountable
cd packages/mountable
yarn start
```

This will serve the app at http://localhost:3000.

## Serving in Fusion

### Clone Fusion repository

```
git clone git@github.com:cognitedata/fusion
cd fusion
```

### Install packages

```
yarn
```

Modify `streamlit_origin` in https://github.com/cognitedata/fusion/blob/master/apps/notebook/src/pages/StreamLit/StreamLitApp.tsx#L44 to be http://localhost:3000

### Serve Notebook subapp

Streamlit is currently served using the notebook subapp. The reason for this is that we had maxed out number of Firebase deployment at the time when this was intially developed and we haven't fixed it since.

```
nx serve notebook
```

### Accept insecure certificate

Open https://localhost:3015/index.js in the browser. Since we are serving using https, but don't have a secure certificate you must accept that this is ok.

### Override Notebook subapp source code

Open https://dev.fusion.cogniteapp.com/ and click the button with three dots in bottom right corner. Find the `@cognite/cdf-ui-notebook` module and override URL to be https://localhost:3015/index.js and refresh the page. You can now navigate to Streamlit in the menu and content will be served with content from this repository.
