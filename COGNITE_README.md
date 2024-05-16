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

`NOTE: If you are making any change in the kernel (/packages/kernel) make sure that you build both kernel and mountable before serving. Just run `yarn build` in both folders.`

## Serving in Fusion

Using the development version of Fusion (or a local build), you can override the Streamlit URL.

1. Open dev.fusion.cogniteapp.com and login to your project
2. Before opening Streamlit, open the Chrome Devtools
3. Go to Application tab
4. Open Session storage and open the bucket for dev.fusion.cogniteapp.com
5. Add a new key STREAMLIT_IFRAME with value http://localhost:3000
6. Reload the page and open Streamlit
7. Ensure Streamlit is hosted from localhost by inspecting network traffic in the Network tab

Approaches for browsers other than Chrome is left as an excercies to the reader.

See also [README](https://github.com/cognitedata/fusion/blob/master/apps/streamlit/README.md) for the Fusion subapp that includes
the UI shell for the application.
