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

contextBridge.exposeInMainWorld("archives", {
  readSitePackagesSnapshot: () =>
    ipcRenderer.invoke("readSitePackagesSnapshot"),
  readRequirements: () => ipcRenderer.invoke("readRequirements"),
  readStreamlitAppDirectory: () =>
    ipcRenderer.invoke("readStreamlitAppDirectory"),
});
