import * as vscode from 'vscode';

declare const STLITE_VERSION: string;  // This is set by webpack during the build

export function activate(context: vscode.ExtensionContext) {
	console.log('"vscode-stlite" is now active in the web extension host.');

	context.subscriptions.push(vscode.commands.registerCommand('vscode-stlite.start', () => {
		const panel = vscode.window.createWebviewPanel(
			'stlite',
			'stlite preview',
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
			}
		);
		panel.webview.html = getWebviewContent(STLITE_VERSION);
	}));
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
			window.parent = { postMessage: () => {} };
			</script>
			<script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@${stliteVersion}/build/stlite.js"></script>
			<script>
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

// This method is called when your extension is deactivated
export function deactivate() { }
