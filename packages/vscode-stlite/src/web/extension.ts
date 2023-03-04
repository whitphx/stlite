import * as vscode from 'vscode';
import * as path from "path";

const WEBVIEW_APP_DIR = "build";  // TODO: Automate copying the `build` directory from `vscode-webview-app` to this package.

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-stlite" is activated in the web extension host.');

  let disposable = vscode.commands.registerCommand('vscode-stlite.start', () => {
    const panel = vscode.window.createWebviewPanel(
      'stlite',
      'stlite',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(vscode.Uri.file(context.extensionPath), WEBVIEW_APP_DIR)
        ]
      }
    );

    const indexHtmlUri = vscode.Uri.file(context.asAbsolutePath(path.join(WEBVIEW_APP_DIR, 'index.html')));
    const assetManifestJsonUri = vscode.Uri.file(context.asAbsolutePath(path.join(WEBVIEW_APP_DIR, 'asset-manifest.json')));
    const decoder = new TextDecoder();

    Promise.all([
      vscode.workspace.fs.readFile(indexHtmlUri),
      vscode.workspace.fs.readFile(assetManifestJsonUri),
    ]).then(([indexHtmlData, assetManifestJsonData]) => {
      const indexHtmlText = decoder.decode(indexHtmlData);
      const assetManifestJson = JSON.parse(decoder.decode(assetManifestJsonData));

      const pathUrlMap = Object.values<string>(assetManifestJson["entrypoints"]).reduce<{ [key: string]: vscode.Uri }>((acc, file) => {
        const onDiskPath = vscode.Uri.joinPath(context.extensionUri, WEBVIEW_APP_DIR, file);
        acc[file] = panel.webview.asWebviewUri(onDiskPath);;

        return acc;
      }, {});

      let updatedIndexHtml = indexHtmlText;
      Object.entries(pathUrlMap).forEach(([originalPath, newUrl]) => {
        updatedIndexHtml = updatedIndexHtml.replace("/" + originalPath, newUrl.toString());
      });

      panel.webview.html = updatedIndexHtml;
    }, (error) => {
      console.error(error);
    });

    panel.onDidDispose(() => {
      // Clean up
    }, null, context.subscriptions);
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
