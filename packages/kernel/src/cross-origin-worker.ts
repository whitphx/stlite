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
  public readonly worker: Worker;

  constructor(url: URL) {
    try {
      // This is the normal way to load a worker script, which is the best straightforward if possible.
      this.worker = new Worker(url);
    } catch (e) {
      console.debug(
        `Failed to load a worker script from ${url.toString()}. Trying to load a cross-origin worker...`
      );
      const workerBlob = new Blob([`importScripts("${url.toString()}");`], {
        type: "text/javascript",
      });
      const workerBlobUrl = URL.createObjectURL(workerBlob);
      this.worker = new Worker(workerBlobUrl);
      URL.revokeObjectURL(workerBlobUrl);
    }
  }
}
