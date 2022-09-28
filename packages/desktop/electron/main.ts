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
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("readWheelFile", (ev, filePath: string) => {
    // Read the local file.
    // Ref: https://stackoverflow.com/a/66270356/13103190

    const allowedDir = path.resolve(__dirname, "..");

    // Check if the `filePath` is under the allowed directory.
    // Ref: https://stackoverflow.com/a/45242825/13103190
    // TODO: Write tests covering the false negative pointed in the comments in the thread above.
    const relativeFromAllowedDir = path.relative(allowedDir, filePath);
    const isAllowed = (relativeFromAllowedDir && !relativeFromAllowedDir.startsWith('..') && !path.isAbsolute(relativeFromAllowedDir))
    if (!isAllowed) {
      throw new Error(`Invalid file access: ${filePath}`);
    }

    if (path.extname(filePath) !== ".whl") {
      throw new Error(`Invalid file extension: ${filePath}`);
    }

    return fsPromises.readFile(filePath)
  })

  if (app.isPackaged) {
    mainWindow.loadFile('../index.html')
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
