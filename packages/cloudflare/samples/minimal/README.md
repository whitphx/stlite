# Stlite Cloudflare minimal sample

A widgets-only Streamlit app built with `--slim`: the dataframe stack is stubbed out, roughly halving the packaged runtime and the time a cold start spends importing it.

The Streamlit project lives in `app/`; `yarn build` packages it into a deployable Worker directory at `dist/`, then Wrangler runs that directory:

```bash
yarn build   # app/ -> dist/
yarn dev     # build, then wrangler dev on dist/
```

It runs in the default Durable Object mode, so sessions keep their state across WebSocket reconnects. See `../hello` for the full-featured sample (dataframes, charts, media), which keeps the whole dependency tree and runs as a plain Worker.
