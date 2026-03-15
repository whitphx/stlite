// Ambient declaration for Emscripten's FS global.
// Pyodide's type definitions reference `typeof FS` in `FSType`, but FS is not
// declared in pyodide's own .d.ts. This shim provides the declaration so that
// api-extractor (used by vite-plugin-dts rollupTypes) can resolve the symbol.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const FS: any;
