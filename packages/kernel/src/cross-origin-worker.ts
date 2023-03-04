// A hack to load a worker script from a different origin.
// Webpack 5's built-in Web Workers feature does not support inlining the worker code
// into the main bundle and always emits it to a separate file,
// which is not compatible with the cross-origin worker.
// So we use this hack to load the separate worker code from a domain different from the parent page.
// Webpack 5 deals with the special syntax `new Worker(new URL("worker.ts", import.meta.url))` for the worker build,
// so this `CrossOriginWorkerMaker` class must be defined in a separate file and
// be imported as the `Worker` alias into the file where the syntax is used to load the worker.
// This technique was introduced at https://github.com/webpack/webpack/discussions/14648#discussioncomment-1589272
export class CrossOriginWorkerMaker {
  public readonly workerPromise: Promise<Worker>;

  constructor(url: URL) {
    try {
      // This is the normal way to load a worker script, which is the best straightforward if possible.
      const worker = new Worker(url);
      this.workerPromise = Promise.resolve(worker);
    } catch (e) {
      console.debug(
        `Failed to load a worker script from ${url.toString()}. Trying to load a cross-origin worker...`
      );

      // VSCode WebViews API does not allow `importScripts`, so we need to use `fetch` here instead.
      // That's why we can't make the worker construction synchronous and need to use Promise here.
      // See https://code.visualstudio.com/api/extension-guides/webview#using-web-workers
      this.workerPromise = fetch(url)
        .then((result) => result.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          return new Worker(blobUrl);
        });
    }
  }
}
