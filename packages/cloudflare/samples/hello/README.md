# Stlite Cloudflare hello sample

This sample exercises `@stlite/cloudflare` against the customized Streamlit Hello app. It is the first-party integration harness for the Cloudflare Workers deploy target.

The Streamlit project lives in `app/`; `yarn build` packages it into a deployable Worker directory at `dist/`, then Wrangler runs that directory:

```bash
yarn build   # app/ -> dist/
yarn dev      # build, then wrangler dev on dist/
```

The sample depends on `@stlite/cloudflare` through the Yarn workspace, so local development uses the current package source.

It builds with `--plain-worker` (not the default Durable Object mode): the demo is read-only — no `st.file_uploader` — and the Animation page needs more memory than a single 128 MB Durable Object instance can hold once every page's imports share it.
