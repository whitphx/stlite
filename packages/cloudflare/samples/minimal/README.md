# Stlite Cloudflare minimal sample

A widgets-only Streamlit app built with `--slim --bundled-runtime`: the dataframe stack is stubbed out and the whole Python runtime ships inside the Worker script, so the deployed Worker fits Cloudflare's current 10 MiB gzip script limit with no asset fetch or extraction at cold start.

The Streamlit project lives in `app/`; `yarn build` packages it into a deployable Worker directory at `dist/`, then Wrangler runs that directory:

```bash
yarn build   # app/ -> dist/
yarn dev     # build, then wrangler dev on dist/
```

It runs in the default Durable Object mode, so sessions keep their state across WebSocket reconnects. See `../hello` for the full-featured sample (dataframes, charts, media) that uses the default runtime-as-assets build instead.
