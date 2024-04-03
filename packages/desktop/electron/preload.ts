import { contextBridge, ipcRenderer } from "electron";

const idbfsMountpointsArg = process.argv
  .find((arg) => arg.startsWith("--idbfs-mountpoints="))
  ?.split("=")[1];
const idbfsMountpoints = idbfsMountpointsArg && JSON.parse(idbfsMountpointsArg);
const appConfig = {
  idbfsMountpoints,
};
contextBridge.exposeInMainWorld("appConfig", appConfig);
export type AppConfig = typeof appConfig;

const archivesAPI = {
  readSitePackagesSnapshot: () =>
    ipcRenderer.invoke("readSitePackagesSnapshot"),
  readPrebuiltPackageNames: () =>
    ipcRenderer.invoke("readPrebuiltPackageNames"),
  readStreamlitAppDirectory: () =>
    ipcRenderer.invoke("readStreamlitAppDirectory"),
};
contextBridge.exposeInMainWorld("archivesAPI", archivesAPI);
export type ArchivesAPI = typeof archivesAPI;

function getRandomInt() {
  return Math.floor(Math.random() * 1000000);
}

const nodeJsWorkerAPI = {
  USE_NODEJS_WORKER: process.argv.includes("--nodejs-worker"),
  initialize: () => ipcRenderer.invoke("initializeNodeJsWorker"),
  postMessage: ({
    data,
    onPortMessage,
  }: {
    data: any;
    onPortMessage: ((arg: any) => void) | null;
  }) => {
    console.debug("nodeJsWorkerAPI.postMessage", { data, onPortMessage });
    // When the `contextIsolation` is enabled, `MessagePort` objects cannot be transferred between contexts even with ipcRenderer.postMessage(),
    // so we need to simulate the `MessagePort` API with `ipcRenderer.on` and `ipcRenderer.send`.
    // This works in a combination with the `NodeJsWorkerMock` class in `nodejs-worker.ts`.
    const portId = onPortMessage && getRandomInt();
    ipcRenderer.send("messageToNodeJsWorker", { data, portId });
    if (portId) {
      ipcRenderer.on(`nodeJsWorker-portMessage-${portId}`, (_event, arg) => {
        onPortMessage(arg);
      });
    }
  },
  onMessage: (callback) =>
    ipcRenderer.on("messageFromNodeJsWorker", (_event, value) => {
      console.debug("nodeJsWorkerAPI.onMessage", value);
      callback(value);
    }),
  terminate: () => ipcRenderer.invoke("terminateNodeJsWorker"),
};
contextBridge.exposeInMainWorld("nodeJsWorkerAPI", nodeJsWorkerAPI);
export type NodeJsWorkerAPI = typeof nodeJsWorkerAPI;
