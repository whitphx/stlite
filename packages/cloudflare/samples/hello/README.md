# stlite Cloudflare hello sample

This sample exercises `@stlite/cloudflare` against the customized Streamlit Hello app.
It is the first-party integration harness for the Cloudflare Workers deploy target.

The Streamlit project lives in `app/`; `yarn build` packages it into a deployable
Worker directory at `dist/`, then Wrangler runs that directory:

```bash
yarn workspace stlite-cloudflare-sample-hello build   # app/ -> dist/
yarn workspace stlite-cloudflare-sample-hello dev      # build, then wrangler dev on dist/
```

The sample depends on `@stlite/cloudflare` through the Yarn workspace, so local development uses the current package source.
