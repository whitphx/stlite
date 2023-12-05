import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("archives", {
  readSitePackagesSnapshot: () =>
    ipcRenderer.invoke("readSitePackagesSnapshot"),
  readRequirements: () => ipcRenderer.invoke("readRequirements"),
  readStreamlitAppDirectory: () =>
    ipcRenderer.invoke("readStreamlitAppDirectory"),
});
