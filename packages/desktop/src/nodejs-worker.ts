export const USE_NODEJS_WORKER = window.nodeJsWorkerAPI.USE_NODEJS_WORKER;

interface MessageEventLike<T = unknown> {
  readonly data: T;
  readonly ports: MessagePort[];
}

export class NodeJsWorkerMock {
  private initializePromise: Promise<void>;

  constructor() {
    this.initializePromise = window.nodeJsWorkerAPI.initialize();

    window.nodeJsWorkerAPI.onMessage((data: unknown) => {
      this.onmessage?.({ data, ports: [] });
    });
  }

  postMessage(data: unknown, transfer?: [MessagePort]) {
    this.initializePromise.then(() => {
      const port = transfer ? transfer[0] : null;
      const onPortMessage =
        port &&
        ((arg: unknown) => {
          port.postMessage(arg);
        });

      window.nodeJsWorkerAPI.postMessage({ data, onPortMessage });
    });
  }

  onmessage: ((e: MessageEventLike) => void) | null = null;

  terminate() {
    window.nodeJsWorkerAPI.terminate();
  }
}
