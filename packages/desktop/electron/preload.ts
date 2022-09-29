import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("archives", {
  readSitePackagesSnapshot: () => ipcRenderer.invoke("readSitePackagesSnapshot"),
})
