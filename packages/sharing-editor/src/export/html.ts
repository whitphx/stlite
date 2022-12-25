import { AppData } from "@stlite/sharing-common";

function makeRequirementsLiteral(
  requirements: AppData["requirements"]
): string {
  return "[" + requirements.map((r) => '"' + r + '"').join(", ") + "]";
}

function makeEntrypointLiteral(entrypoint: AppData["entrypoint"]): string {
  return '"' + entrypoint + '"';
}

function makeFilesLiteral(files: AppData["files"]): string {
  let content = "";
  content += "{\n";
  Object.keys(files).forEach((fileName) => {
    content += `"${fileName}": `;
    const fileContent = files[fileName].content;
    if (fileContent?.$case === "text") {
      content += "`\n" + fileContent.text + "\n`,";
    } else if (fileContent?.$case === "data") {
      const b64 = btoa(new TextDecoder("utf8").decode(fileContent.data));
      // const str = new TextEncoder().encode(atob(b64));
      content += `new TextEncoder().encode(atob("${b64}")),\n`;
    }
  });
  content += "\n}";
  return content;
}

export function exportAsHtml(appData: AppData): string {
  const output = `
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
    requirements: ${makeRequirementsLiteral(appData.requirements)},
    entrypoint: ${makeEntrypointLiteral(appData.entrypoint)},
    files: ${makeFilesLiteral(appData.files)},
  },
  document.getElementById("root")
)
    </script>
  </body>
</html>
  `;
  return output;
}
