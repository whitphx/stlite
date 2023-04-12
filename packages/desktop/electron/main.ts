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
      sandbox: true, // https://www.electronjs.org/docs/latest/tutorial/security#4-enable-process-sandboxing
    },
  });

  const indexUrl =
    app.isPackaged || process.env.NODE_ENV === "production"
      ? "file:///index.html"
      : "http://localhost:3000/";

  // Check the IPC sender in every callback below,
  // following the security best practice, "17. Validate the sender of all IPC messages."
  // https://www.electronjs.org/docs/latest/tutorial/security#17-validate-the-sender-of-all-ipc-messages
  const isValidIpcSender = (frame: Electron.WebFrameMain): boolean => {
    return frame.url === indexUrl;
  };

  ipcMain.handle("readSitePackagesSnapshot", (ev) => {
    if (!isValidIpcSender(ev.senderFrame)) {
      throw new Error("Invalid IPC sender");
    }

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
      if (!isValidIpcSender(ev.senderFrame)) {
        throw new Error("Invalid IPC sender");
      }

      const streamlitAppDir = path.resolve(__dirname, "../streamlit_app");
      return walkRead(streamlitAppDir);
    }
  );

  mainWindow.on("closed", () => {
    ipcMain.removeHandler("readSitePackagesSnapshot");
    ipcMain.removeHandler("readStreamlitAppDirectory");
  });

  // Even when the entrypoint is a local file like the production build,
  // we use .loadURL() with an absolute URL with the `file://` schema
  // instead of passing a file path to .loadFile()
  // because absolute URLs with the file:// scheme will be resolved
  // to absolute file paths based on the special handler
  // registered through `interceptFileProtocol` below.
  mainWindow.loadURL(indexUrl);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

// Enable process sandboxing globally (https://www.electronjs.org/docs/latest/tutorial/sandbox#enabling-the-sandbox-globally),
// following the security best practice, "4. Enable process sandboxing."
// https://www.electronjs.org/docs/latest/tutorial/security#4-enable-process-sandboxing
app.enableSandbox();

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

app.on("web-contents-created", (event, contents) => {
  // Intercepts webView creation events and forbid all,
  // following the security best practice, "12. Verify WebView options before creation."
  // https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
  contents.on("will-attach-webview", (event, webPreferences, params) => {
    // Cancels all webView creation request
    event.preventDefault();
  });

  // Intercepts navigation and forbid all,
  // following the security best practice, "13. Disable or limit navigation."
  // https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
  contents.on("will-navigate", (event, navigationUrl) => {
    console.debug("will-navigate", navigationUrl);
    event.preventDefault();
  });

  // Limit new windows creation,
  // following the security best practice, "14. Disable or limit creation of new windows."
  // https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
  contents.setWindowOpenHandler(({ url }) => {
    console.error("Opening a new window is not allowed.");
    // TODO: Implement `isSafeForExternalOpen()` below with a configurable allowed list.
    // We'll ask the operating system
    // to open this event's url in the default browser.
    // DON'T pass an arbitrary URL to `shell.openExternal()` here
    // as advised at "15. Do not use shell.openExternal with untrusted content."
    // if (isSafeForExternalOpen(url)) {
    //   setImmediate(() => {
    //     shell.openExternal(url)
    //   })
    // }
    return { action: "deny" };
  });
});
