import { AppData, u8aToBase64, base64ToU8A } from "@stlite/sharing-common";

function makeRequirementsLiteral(
  requirements: AppData["requirements"]
): string {
  return "[" + requirements.map((r) => '"' + r + '"').join(", ") + "]";
}

function makeEntrypointLiteral(entrypoint: AppData["entrypoint"]): string {
  return '"' + entrypoint + '"';
}

function makeFilesLiteral(files: AppData["files"]): {
  filesLiteral: string;
  isBase64DecoderRequired: boolean;
} {
  let isBase64DecoderRequired = false;
  let content = "";
  content += "{\n";
  Object.keys(files).forEach((fileName) => {
    content += `"${fileName}": `;
    const fileContent = files[fileName].content;
    if (fileContent?.$case === "text") {
      content += "`\n" + fileContent.text.replaceAll("`", "\\`") + "\n`,";
    } else if (fileContent?.$case === "data") {
      const b64 = u8aToBase64(fileContent.data);
      content += `${base64ToU8A.name}("${b64}"),\n`;
      isBase64DecoderRequired = true;
    }
  });
  content += "\n}";
  return { filesLiteral: content, isBase64DecoderRequired };
}

export function exportAsHtml(appData: AppData): string {
  const { filesLiteral, isBase64DecoderRequired } = makeFilesLiteral(
    appData.files
  );
  const output = `<!DOCTYPE html>
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
    files: ${filesLiteral},
  },
  document.getElementById("root")
)
${isBase64DecoderRequired ? "\n" + base64ToU8A.toString() : ""}
    </script>
  </body>
</html>`;
  return output;
}
