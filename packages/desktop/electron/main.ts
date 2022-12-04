import { app, BrowserWindow, ipcMain, protocol } from "electron";
import * as path from "path";
import * as fsPromises from "fs/promises";
import { walkRead } from "./file";

if (process.env.NODE_ENV === "development") {
  console.log("Hot-reloading Electron enabled");
  require("electron-reload")(__dirname, {
    electron: path.resolve(
      __dirname,
      process.platform === "win32"
        ? "../../node_modules/electron/dist/electron.exe"
        : "../../node_modules/.bin/electron"
    ),
  });
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("readSitePackagesSnapshot", (ev) => {
    // This archive file has to be created by ./bin/dump_snapshot.ts
    const archiveFilePath = path.resolve(
      __dirname,
      "../site-packages-snapshot.tar.gz"
    );
    return fsPromises.readFile(archiveFilePath);
  });
  ipcMain.handle(
    "readStreamlitAppDirectory",
    async (ev): Promise<Record<string, Buffer>> => {
      const streamlitAppDir = path.resolve(__dirname, "../streamlit_app");
      return walkRead(streamlitAppDir);
    }
  );

  if (app.isPackaged || process.env.NODE_ENV === "production") {
    // Use .loadURL() with an absolute URL based on "/" instead of .loadFile()
    // because absolute URLs with the file:// scheme will be resolved
    // to absolute file paths based on the special handler
    // registered through `interceptFileProtocol` below.
    mainWindow.loadURL("file:///index.html");
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
  // Resolve absolute paths based on the bundled directory.
  // It is assumed that the resource paths are absolute paths starting with "/",
  // which is configured at `package.json` with the `"homepage"` field.
  // Ref: https://github.com/electron/electron/issues/4612#issuecomment-189116655
  const bundleBasePath = path.resolve(__dirname, "..");
  protocol.interceptFileProtocol("file", function (req, callback) {
    const urlWithoutScheme = req.url.slice(7); // 7 = "file://".length
    if (path.isAbsolute(urlWithoutScheme)) {
      const resolvedFilePath = path.join(bundleBasePath, urlWithoutScheme);
      callback(path.normalize(resolvedFilePath));
    } else {
      callback(urlWithoutScheme);
    }
  });

  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
