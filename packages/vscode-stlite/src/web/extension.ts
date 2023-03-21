import * as path from "path";
import * as vscode from "vscode";

declare const STLITE_VERSION: string; // This is set by webpack during the build

const fileWatcherPattern = "**/*";

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-stlite" is now active in the web extension host.');

  let panel: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-stlite.start", () => {
      const stliteMountOpts = {
        requirements: [], // TODO
        entrypoint: "streamlit_app.py", // TODO: get this from the user
        files: {
          "streamlit_app.py": `import streamlit as st
st.title("Hello, World!")`,
        }, // TODO: read this from the file system
      }; // NOTE: This must be JSON-encodable.

      panel = vscode.window.createWebviewPanel(
        "stlite",
        "stlite preview",
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
          enableScripts: true,
        }
      );
      panel.webview.html = getWebviewContent(STLITE_VERSION, stliteMountOpts);
    })
  );

  async function writeFile(uri: vscode.Uri) {
    console.debug("[stlite] Write file: " + uri.fsPath);

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    if (!workspaceFolder) {
      return;
    }

    const relPath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
    const content = await vscode.workspace.fs.readFile(uri);

    console.debug("[stlite] RelPath: " + relPath);

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

  vscode.workspace.findFiles(fileWatcherPattern).then((fileUris) => {
    fileUris.forEach(async (uri) => {
      writeFile(uri);
    });

    const fileWatcher =
      vscode.workspace.createFileSystemWatcher(fileWatcherPattern);
    context.subscriptions.push(fileWatcher);

    context.subscriptions.push(fileWatcher.onDidCreate(writeFile));
    context.subscriptions.push(fileWatcher.onDidChange(writeFile));
    context.subscriptions.push(fileWatcher.onDidDelete(deleteFile));
  });
}

function getWebviewContent(stliteVersion: string, mountOpts: any) {
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
			window.parent = { postMessage: () => {} };
			</script>
			<script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@${stliteVersion}/build/stlite.js"></script>
			<script>
				const stliteCtx = stlite.mount(
					${JSON.stringify(mountOpts)},
					document.getElementById("root")
				);

				// Handle the message inside the webview
				window.addEventListener('message', event => {
					console.log("event.data:", event.data);

					const message = event.data; // The JSON data our extension sent

					switch (message.type) {
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
					}
				});
			</script>
		</body>
	</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
