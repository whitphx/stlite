// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const USE_NODEJS_WORKER = window.nodeJsWorkerAPI.USE_NODEJS_WORKER;

interface MessageEventLike<T = any> {
  readonly data: T;
}

export class NodeJsWorkerMock {
  private initializePromise: Promise<void>;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.initializePromise = window.nodeJsWorkerAPI.initialize();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.nodeJsWorkerAPI.onMessage((data) => {
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.nodeJsWorkerAPI.postMessage({ data, onPortMessage });
    });
  }

  onmessage: ((e: MessageEventLike) => void) | null = null;

  terminate() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.nodeJsWorkerAPI.terminate();
  }
}
