import { AppData } from "@stlite/sharing-common";

export function exportAsHtml(appData: AppData): string {
  return `
<!DOCTYPE html>
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
      href="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.14.0/build/stlite.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.14.0/build/stlite.js"></script>
    <script>
stlite.mount(
  {
    requirements: [${appData.requirements
      .map((r) => '"' + r + '"')
      .join(", ")}],
    entrypoint: "${appData.entrypoint}",
    files: {
      "streamlit_app.py": \`
import streamlit as st
st.write("Hello World")
\`
    },
  },
  document.getElementById("root")
)
    </script>
  </body>
</html>
  `;
}
