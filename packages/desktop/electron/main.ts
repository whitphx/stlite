import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fsPromises from "fs/promises"

if (process.env.NODE_ENV === 'development') {
  console.log("Hot-reloading Electron enabled")
  require('electron-reload')(__dirname, {
    electron: path.resolve(
      __dirname,
      process.platform === 'win32'
        ? '../../node_modules/electron/dist/electron.exe'
        : '../../node_modules/.bin/electron'
    ),
  });
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("readSnapshotFile", (ev) => {
    return fsPromises.readFile(path.resolve(__dirname, "../stlite-archive.tar.gz"))
  })

  if (app.isPackaged || process.env.NODE_ENV === "production") {
    mainWindow.loadFile(path.resolve(__dirname, '../index.html'))
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
