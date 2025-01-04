// A hack to load a worker script from a different origin.
// Webpack 5's built-in Web Workers feature does not support inlining the worker code
// into the main bundle and always emits it to a separate file,
// which is not compatible with the cross-origin worker.
// So we use this hack to load the separate worker code from a domain different from the parent page.
// Webpack 5 deals with the special syntax `new Worker(new URL("worker.ts", import.meta.url))` for the worker build,
// so this `CrossOriginWorkerMaker` class must be defined in a separate file and
// be imported as the `Worker` alias into the file where the syntax is used to load the worker.
// This technique was introduced at https://github.com/webpack/webpack/discussions/14648#discussioncomment-1589272

const workerBlobUrlCache = new Map<string, string>();

function getWorkerBlobUrl(url: URL): string {
  const urlStr = url.toString();

  const cached = workerBlobUrlCache.get(urlStr);
  if (cached) {
    console.debug(`Using a cached worker blob URL for ${urlStr}`);
    return cached;
  }

  const workerBlob = new Blob([`importScripts("${urlStr}");`], {
    type: "text/javascript",
  });
  const workerBlobUrl = URL.createObjectURL(workerBlob);
  workerBlobUrlCache.set(urlStr, workerBlobUrl);
  return workerBlobUrl;
}

function isSameOrigin(url: URL): boolean {
  return url.origin === window.location.origin;
}

export class CrossOriginWorkerMaker {
  public readonly worker: Worker | SharedWorker;

  constructor(url: URL, options: { shared?: boolean } = {}) {
    const { shared = false } = options;
    const WorkerClass = shared ? SharedWorker : Worker;

    if (isSameOrigin(url)) {
      console.debug(
        `Loading a ${shared ? "shared" : "dedicated"} worker script from the same origin: ${url}`,
      );
      this.worker = new WorkerClass(url);
    } else {
      console.debug(
        `Loading a ${shared ? "shared" : "dedicated"} worker script from a different origin: ${url}`,
      );
      const workerBlobUrl = getWorkerBlobUrl(url);
      this.worker = new WorkerClass(workerBlobUrl);
    }
  }
}
