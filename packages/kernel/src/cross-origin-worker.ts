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

function getWorkerBlobUrl(url: URL, isModule = false): string {
  const urlStr = url.toString();

  const cached = workerBlobUrlCache.get(urlStr);
  if (cached) {
    console.debug(`Using a cached worker blob URL for ${urlStr}`);
    return cached;
  }

  const workerCode = isModule
    ? `import "${urlStr}";`
    : `importScripts("${urlStr}");`;

  const workerBlob = new Blob([workerCode], {
    type: isModule ? "text/javascript;type=module" : "text/javascript",
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

  constructor(
    url: URL,
    { shared, ...workerOptions }: { shared: boolean } & WorkerOptions,
  ) {
    if (isSameOrigin(url)) {
      console.debug(`Loading a worker script from the same origin: ${url}`);

      // This is the normal way to load a worker script, which is the best straightforward if possible.
      this.worker = shared
        ? new SharedWorker(url, workerOptions)
        : new Worker(url, workerOptions);

      // NOTE: We use here `if-else` checking the origin instead of `try-catch`
      // because the `try-catch` approach doesn't work on some browsers like FireFox.
      // In the cross-origin case, FireFox throws a SecurityError asynchronously after the worker is created,
      // so we can't catch the error synchronously.
    } else {
      console.debug(`Loading a worker script from a different origin: ${url}`);
      const workerBlobUrl = getWorkerBlobUrl(
        url,
        workerOptions.type === "module",
      );
      this.worker = shared
        ? new SharedWorker(workerBlobUrl, workerOptions)
        : new Worker(workerBlobUrl, workerOptions);
    }
  }
}
