import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("snapshot", {
  read: () => ipcRenderer.invoke("readSnapshotFile"),
})
