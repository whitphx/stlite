# stlite Cloudflare Worker harness

This directory is the first-party integration harness for `@stlite/cloudflare`.
It contains the sample Streamlit app, Cloudflare Workers config, Python lockfile,
and browser smoke tests used while developing the deploy target.

```bash
cd cloudflare
npm run dev
```

The publishable npm package lives in `../packages/cloudflare`. The harness runs
that package's CLI by relative path so local development uses the current source
without requiring a package install step.
