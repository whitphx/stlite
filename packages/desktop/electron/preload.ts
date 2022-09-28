import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("localWheelFiles", {
  read: (filePath: string) => ipcRenderer.invoke("readWheelFile", filePath),
})
