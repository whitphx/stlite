import { AppData } from "./proto/models";
import { u8aToBase64 } from "./buffer";

// Source-of-truth string the exported HTML embeds when the project includes
// binary files. Kept independent of the runtime `base64ToU8A` in `buffer.ts`
// so that bundler reformatting and runtime-side optimizations don't drift the
// emitted HTML. The Python CLI mirrors this constant verbatim — the golden
// HTML fixture in `packages/cli/test-fixtures/` guards against either side
// drifting.
//
// SECURITY: this string is injected verbatim into a `<script>` tag in every
// HTML the `html` command produces. Any change here ends up in user-generated
// pages without further review. Treat edits as security-sensitive: keep the
// function pure (no eval, no DOM access, no fetch), accept only base64 input,
// return only Uint8Array output.
export const BASE64_DECODER_JS_SOURCE = `function base64ToU8A(base64) {
  const s = atob(base64);
  const len = s.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = s.charCodeAt(i);
  }
  return buf;
}`;

function makeRequirementsLiteral(
  requirements: AppData["requirements"],
): string {
  // JSON.stringify escapes `"` and `\` so requirements containing those don't
  // break the generated JS — JSON's string syntax is a strict subset of JS's
  // double-quoted string syntax.
  return "[" + requirements.map((r) => JSON.stringify(r)).join(", ") + "]";
}

function makeEntrypointLiteral(entrypoint: AppData["entrypoint"]): string {
  return JSON.stringify(entrypoint);
}

export function escapeTextForJsTemplateLiteral(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll("`", "\\`")
    .replaceAll("${", "\\${");
}

function makeFilesLiteral(files: AppData["files"]): {
  filesLiteral: string;
  isBase64DecoderRequired: boolean;
} {
  let isBase64DecoderRequired = false;
  let content = "";
  content += "{\n";
  Object.keys(files).forEach((fileName) => {
    content += `${JSON.stringify(fileName)}: `;
    const fileContent = files[fileName].content;
    if (fileContent?.$case === "text") {
      content +=
        "`" + escapeTextForJsTemplateLiteral(fileContent.text) + "`,\n";
    } else if (fileContent?.$case === "data") {
      // base64 alphabet is `[A-Za-z0-9+/=]` (or `[A-Za-z0-9-_,]` for our
      // base64url variant) — no chars that need escaping in a double-quoted
      // JS string literal, so a plain wrap is safe and matches the original
      // emitted shape.
      const b64 = u8aToBase64(fileContent.data);
      content += `base64ToU8A("${b64}"),\n`;
      isBase64DecoderRequired = true;
    }
  });
  content += "\n}";
  return { filesLiteral: content, isBase64DecoderRequired };
}

export interface ExportAsHtmlOptions {
  /** Version of `@stlite/browser` the exported page loads from JSDelivr. */
  runtimeVersion: string;
  /** Optional HTML comment placed at the bottom of the document. */
  debugComment?: string;
}

export function exportAsHtml(
  appData: AppData,
  options: ExportAsHtmlOptions,
): string {
  const { filesLiteral, isBase64DecoderRequired } = makeFilesLiteral(
    appData.files,
  );
  const debugComment = options.debugComment
    ? `\n  <!-- ${options.debugComment} -->`
    : "";
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Stlite app</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@stlite/browser@${options.runtimeVersion}/build/stlite.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
import { mount } from "https://cdn.jsdelivr.net/npm/@stlite/browser@${options.runtimeVersion}/build/stlite.js"
mount(
  {
    requirements: ${makeRequirementsLiteral(appData.requirements)},
    entrypoint: ${makeEntrypointLiteral(appData.entrypoint)},
    files: ${filesLiteral},
  },
  document.getElementById("root")
)
${isBase64DecoderRequired ? "\n" + BASE64_DECODER_JS_SOURCE : ""}
    </script>
  </body>${debugComment}
</html>`;
}
