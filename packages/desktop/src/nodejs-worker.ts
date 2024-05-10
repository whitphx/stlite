export const USE_NODEJS_WORKER = window.nodeJsWorkerAPI.USE_NODEJS_WORKER;

interface MessageEventLike<T = any> {
  readonly data: T;
}

export class NodeJsWorkerMock {
  private initializePromise: Promise<void>;

  constructor() {
    this.initializePromise = window.nodeJsWorkerAPI.initialize();

    window.nodeJsWorkerAPI.onMessage((data: unknown) => {
      this.onmessage && this.onmessage({ data });
    });
  }

  postMessage(data: any, transfer?: [MessagePort]) {
    this.initializePromise.then(() => {
      const port = transfer ? transfer[0] : null;
      const onPortMessage =
        port &&
        ((arg: any) => {
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
