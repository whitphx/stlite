import * as path from "path";
import * as vscode from "vscode";
import { parseRequirementsTxt } from "@stlite/common";

import { PromiseDelegate } from "./promise-delegate";

declare const STLITE_VERSION: string; // This is set by webpack during the build

const fileWatcherPattern = "**/*";
const requirementsTxtPath = "requirements.txt";

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-stlite" is now active in the web extension host.');

  let panel: vscode.WebviewPanel | undefined = undefined;
  let panelInitializedPromise = new PromiseDelegate<void>();

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-stlite.start", () => {
      if (panel) {
        panel.reveal();
        return;
      }

      panel = vscode.window.createWebviewPanel(
        "stlite",
        "stlite preview",
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
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

      panel.webview.html = getWebviewContent(STLITE_VERSION);
      panelInitializedPromise = new PromiseDelegate();

      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.type) {
            case "init:done": {
              panelInitializedPromise.resolve();
              return;
            }
          }
        },
        undefined,
        context.subscriptions
      );

      vscode.workspace.findFiles(fileWatcherPattern).then(async (fileUris) => {
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

        const entrypoint = await vscode.window
          .showQuickPick(entrypointCandidates, {
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
        }; // NOTE: This must be JSON-encodable.
        initStlite(stliteMountOpts);

        const fileWatcher =
          vscode.workspace.createFileSystemWatcher(fileWatcherPattern);
        context.subscriptions.push(fileWatcher);

        fileWatcher.onDidCreate(writeFile, undefined, context.subscriptions);
        fileWatcher.onDidChange(writeFile, undefined, context.subscriptions);
        fileWatcher.onDidDelete(deleteFile, undefined, context.subscriptions);
      });
    })
  );

  async function initStlite(mountOptions: unknown) {
    console.debug("[stlite] Initialize: " + mountOptions);

    panel?.webview.postMessage({
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

      panel?.webview.postMessage({
        type: "install",
        data: {
          requirements,
        },
      });
      return;
    }

    panel?.webview.postMessage({
      type: "file:write",
      data: {
        path: relPath,
        content,
      },
    });
  }

  function deleteFile(uri: vscode.Uri) {
    console.debug("[stlite] Delete file: " + uri.fsPath);

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    if (!workspaceFolder) {
      return;
    }

    const relPath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);

    console.debug("[stlite]  RelPath: " + relPath);

    panel?.webview.postMessage({
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
      <script>
      // Streamlit's withHostCommunication accesses window.parent.postMessage, which is not available in the webview, so we need to mock it.
      window.parent = { postMessage: () => {} };
      // Calling history.pushState inside WebView causes a page transition on the parent editor window, so we need to mock it.
      window.history.pushState = () => {};
      </script>
      <script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@${stliteVersion}/build/stlite.js"></script>
      <script>
        const vscode = acquireVsCodeApi();

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
