import * as fs from "node:fs";
import * as path from "node:path";

export interface WriteWebIndexHtmlOptions {
  /** Output directory the index.html lives in. */
  destDir: string;
  /** Entrypoint path relative to `app_files/`. */
  entrypoint: string;
  /** All project files (POSIX paths, relative to `app_files/`). */
  files: string[];
}

/**
 * Writes a minimal `index.html` into destDir that loads `@stlite/browser`
 * (assumed copied alongside as `./stlite.js`/`./stlite.css`), fetches the
 * pre-vendored site-packages snapshot + prebuilt-package list, and calls
 * `mount()` with url-based file references that the runtime fetches at boot.
 */
export function writeWebIndexHtml(options: WriteWebIndexHtmlOptions): void {
  const filesObjLines = options.files
    .map((rel) => `      "${rel}": { url: "./app_files/${rel}" },`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Stlite app</title>
    <link rel="stylesheet" href="./stlite.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
import { mount } from "./stlite.js";

// pyodideUrl is forwarded to a Web Worker that runs from a data: URL, so
// relative paths can't be resolved there. Resolve to an absolute URL on the
// main thread first.
const pyodideUrl = new URL("./pyodide/pyodide.mjs", document.baseURI).href;

const [snapshot, prebuiltText] = await Promise.all([
  fetch("./site-packages-snapshot.tar.gz").then((r) => r.arrayBuffer()),
  fetch("./prebuilt-packages.txt").then((r) => r.text()),
]);
mount(
  {
    entrypoint: ${JSON.stringify(options.entrypoint)},
    files: {
${filesObjLines}
    },
    archives: [
      {
        buffer: snapshot,
        format: "gztar",
        options: { extractDir: "/" },
      },
    ],
    prebuiltPackageNames: prebuiltText
      .split("\\n")
      .map((s) => s.trim())
      .filter(Boolean),
    pyodideUrl,
    requirements: [],
  },
  document.getElementById("root"),
);
    </script>
  </body>
</html>`;

  fs.writeFileSync(path.join(options.destDir, "index.html"), html, "utf8");
}
