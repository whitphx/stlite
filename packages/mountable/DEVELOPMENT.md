# `@stlite/mountable`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and its TypeScript template. The CRA version was v5.0.1, which is compatible with the Streamlit frontend [since v1.18.0](https://github.com/streamlit/streamlit/commit/5565e996b5be4426795e7d95c392d1ff5aa71053#diff-da6498268e99511d9ba0df3c13e439d10556a812881c9d03955b2ef7c6c1c655R199).
(Before 1.18.0, the project was based on CRA 4.0.3.)

The build script has been ejected and customized to make the production build as a library that does not contain the files in `public/` while keeping the development build as an app with hot-reload.
See the following PRs about it.

- https://github.com/whitphx/stlite/pull/15: The first introduction of such customizations. At this point, the project was based on CRA 4.0.3.
- https://github.com/whitphx/stlite/pull/482: We upgraded `react-scripts` to 5.0.1 in this PR. The ejected files are recreated from a CRA 5.0.1-based project and the necessary diffs for the customization are applied to them manually.
