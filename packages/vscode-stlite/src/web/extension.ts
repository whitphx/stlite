import * as path from "path";
import * as vscode from "vscode";
import { parseRequirementsTxt } from "@stlite/common";
import minimatch from "minimatch";

import { PromiseDelegate } from "./promise-delegate";

declare const STLITE_VERSION: string; // This is set by webpack during the build

const config = vscode.workspace.getConfiguration("stlite");

const targetFilesConfig = config.get("targetFiles");
const ignoreFilesConfig = config.get("ignoreFiles");

const fileWatcherPattern =
  typeof targetFilesConfig === "string" ? targetFilesConfig : "**/*";
const fileWatcherIgnorePattern =
  typeof ignoreFilesConfig === "string" ? ignoreFilesConfig : undefined;
const fileWatcherIgnoreMatch = fileWatcherIgnorePattern
  ? new minimatch.Minimatch(fileWatcherIgnorePattern)
  : undefined;
const requirementsTxtPath = "requirements.txt";
const maxEntrypointCandidates = 1000;

console.log("stlite configs", {
  fileWatcherPattern,
  fileWatcherIgnorePattern,
  requirementsTxtPath,
});

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-stlite" is now active in the web extension host.');

  let panel: vscode.WebviewPanel | undefined = undefined;
  let panelInitializedPromise = new PromiseDelegate<void>();

  context.subscriptions.push(
    vscode.commands.registerCommand("stlite.start", () => {
      if (panel) {
        panel.reveal();
        return;
      }

      panel = vscode.window.createWebviewPanel(
        "stlite",
        "stlite preview",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      panel.onDidDispose(
        () => {
          panel = undefined;
        },
        undefined,
        context.subscriptions
      );

      panelInitializedPromise = new PromiseDelegate();
      panel.webview.html = getWebviewContent(STLITE_VERSION);

      panel.webview.onDidReceiveMessage(
        (message) => {
          console.debug("Received message from webview:", message);
          // NOTE: There are both types of messages from the webview,
          //       messages defined for stlite's functionality, and
          //       Streamlit's iframe messages transmitted from the `withHostCommunication` HOC and relayed by the mocked `window.parent.postMessage` in the WebView,
          switch (message.type) {
            case "init:done": {
              panelInitializedPromise.resolve();
              return;
            }
            case "GUEST_READY": {
              // Override the base URL for page links in MPA to solve the problem of https://github.com/whitphx/stlite/issues/519.
              // On vscode.dev, the base URL is set as `https://...` because `window.location.protocol` is `https://` and it is used as https://github.com/streamlit/streamlit/blob/1.19.0/frontend/src/components/core/Sidebar/SidebarNav.tsx#L106,
              // however, links with such href values in WebView panels on vscode.dev will open unnecessary new tabs
              // when clicked even if the `onClick` handler is set and `e.preventDefault()` is called.
              // So, we have to override the base URL with the `vscode-webview://` protocol, which doesn't open new tabs on vscode.dev.
              panel?.webview.postMessage({
                stCommVersion: 1,
                type: "SET_PAGE_LINK_BASE_URL",
                pageLinkBaseUrl: "vscode-webview://stlite",
              });
              return;
            }
          }
        },
        undefined,
        context.subscriptions
      );

      vscode.workspace
        .findFiles(
          fileWatcherPattern,
          fileWatcherIgnorePattern,
          maxEntrypointCandidates
        )
        .then(async (fileUris) => {
          const files: { [fileName: string]: Uint8Array } = {};
          const entrypointCandidates: (vscode.QuickPickItem & {
            relPath: string;
          })[] = [];
          await Promise.all(
            fileUris.map(async (uri) => {
              const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
              if (!workspaceFolder) {
                return;
              }

              const relPath = path.relative(
                workspaceFolder.uri.fsPath,
                uri.fsPath
              );
              const content = await vscode.workspace.fs.readFile(uri);

              files[relPath] = content;

              if (relPath.endsWith(".py")) {
                entrypointCandidates.push({
                  relPath,
                  label: relPath,
                });
              }
            })
          );

          const requirements =
            requirementsTxtPath in files
              ? parseRequirementsTxt(
                  new TextDecoder().decode(files[requirementsTxtPath])
                )
              : [];

          const sortedEntrypointCandidates = entrypointCandidates.sort(
            (a, b) => {
              const aSegs = a.relPath.split(path.sep);
              const bSegs = b.relPath.split(path.sep);
              if (aSegs.length !== bSegs.length) {
                return aSegs.length - bSegs.length;
              }
              const aBasename = aSegs[aSegs.length - 1];
              const bBasename = bSegs[bSegs.length - 1];
              return aBasename.localeCompare(bBasename);
            }
          );
          const entrypoint = await vscode.window
            .showQuickPick(sortedEntrypointCandidates, {
              canPickMany: false,
              placeHolder: "Select the entrypoint file",
            })
            .then((selectedItem) => selectedItem?.relPath);
          if (entrypoint == null) {
            panel?.dispose();
            return;
          }

          const stliteMountOpts = {
            requirements,
            entrypoint,
            files,
            allowedOriginsResp: {
              // The `withHostCommunication` HOC in Streamlit's frontend accepts messages from the parent window on these hosts.
              allowedOrigins: [
                "vscode-webview://*", // For VSCode desktop
                "https://*.vscode-cdn.net", // For vscode.dev
              ],
              useExternalAuthToken: false,
            },
          }; // NOTE: This must be JSON-encodable.
          initStlite(stliteMountOpts);
        });
    })
  );

  const fileWatcher =
    vscode.workspace.createFileSystemWatcher(fileWatcherPattern);
  context.subscriptions.push(fileWatcher);
  fileWatcher.onDidCreate(writeFile, undefined, context.subscriptions);
  fileWatcher.onDidChange(writeFile, undefined, context.subscriptions);
  fileWatcher.onDidDelete(deleteFile, undefined, context.subscriptions);

  async function initStlite(mountOptions: unknown) {
    console.debug("[stlite] Initialize: " + mountOptions);

    if (panel == null) {
      console.warn("[stlite] Panel has not been created.");
      return;
    }

    panel.webview.postMessage({
      type: "init",
      data: {
        mountOptions,
      },
    });

    await panelInitializedPromise.promise;
    console.debug("[stlite] Initialization request completed");
  }

  async function writeFile(uri: vscode.Uri) {
    console.debug("[stlite] Write file: " + uri.fsPath);

    if (panel == null) {
      return;
    }

    if (fileWatcherIgnoreMatch?.match(uri.fsPath)) {
      return;
    }

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    if (!workspaceFolder) {
      return;
    }

    const relPath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
    const content = await vscode.workspace.fs.readFile(uri);

    console.debug("[stlite] RelPath: " + relPath);

    if (relPath === requirementsTxtPath) {
      const requirements = parseRequirementsTxt(
        new TextDecoder().decode(content)
      );

      panel.webview.postMessage({
        type: "install",
        data: {
          requirements,
        },
      });
      return;
    }

    panel.webview.postMessage({
      type: "file:write",
      data: {
        path: relPath,
        content,
      },
    });
  }

  function deleteFile(uri: vscode.Uri) {
    console.debug("[stlite] Delete file: " + uri.fsPath);

    if (panel == null) {
      return;
    }

    if (fileWatcherIgnoreMatch?.match(uri.fsPath)) {
      return;
    }

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    if (!workspaceFolder) {
      return;
    }

    const relPath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);

    console.debug("[stlite]  RelPath: " + relPath);

    panel.webview.postMessage({
      type: "file:delete",
      data: {
        path: relPath,
      },
    });
  }
}

function getWebviewContent(stliteVersion: string) {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>stlite app</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@stlite/mountable@${stliteVersion}/build/stlite.css"
      />
    </head>
    <body>
      <div id="root"></div>
      <script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@${stliteVersion}/build/stlite.js"></script>
      <script>
        const vscode = acquireVsCodeApi();

        // Streamlit's withHostCommunication accesses window.parent.postMessage, which is not available in the webview, so we need to mock it.
        window.parent = {
          postMessage: (msg) => {
            vscode.postMessage(msg);
          }
        };

        let stliteCtx = null;

        window.addEventListener('message', event => {
          console.debug("event.data:", event.data);

          const message = event.data;

          switch (message.type) {
            case 'init': {
              const { mountOptions } = message.data;
              stliteCtx = stlite.mount(mountOptions, document.getElementById("root"));
              vscode.postMessage({
                type: "init:done",
              });
              break;
            }
            case 'file:write': {
              const { path, content } = message.data;
              stliteCtx.writeFile(path, content);
              break;
            }
            case 'file:delete': {
              const { path } = message.data;
              stliteCtx.unlink(path);
              break;
            }
            case 'install': {
              const { requirements } = message.data;
              stliteCtx.install(requirements);
              break;
            }
          }
        });
      </script>
    </body>
  </html>`;
}

// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
