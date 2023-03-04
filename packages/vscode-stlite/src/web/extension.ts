import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-stlite" is activated in the web extension host.');

  let disposable = vscode.commands.registerCommand('vscode-stlite.start', () => {
    const panel = vscode.window.createWebviewPanel('stlite', 'stlite', vscode.ViewColumn.One, { enableScripts: true });

    panel.webview.html = getWebviewContent();

    panel.onDidDispose(() => {
      // Clean up
    }, null, context.subscriptions);
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

function getWebviewContent() {
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
        href="http://localhost:8000/build/stlite.css"
      />
    </head>
    <body>
      <div id="root"></div>
      <script src="http://localhost:8000/build/stlite.js"></script>
      <script>
        window.parent = { postMessage: function() { } };
        stlite.mount(
          \`
import streamlit as st

name = st.text_input('Your name')
st.write("Hello,", name or "world")
\`,
          document.getElementById("root")
        );
      </script>
    </body>
  </html>`;
}
