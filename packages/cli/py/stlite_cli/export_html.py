import base64
import json
from typing import Optional

import betterproto

from stlite_cli._proto.models import AppData

# Mirrors `BASE64_DECODER_JS_SOURCE` exported from
# packages/sharing-common/src/export-html.ts. That TS file is the canonical
# source — keep this byte-identical to it. Drift between the two is caught
# by the golden HTML fixture under packages/cli/test-fixtures/.
BASE64_DECODER_JS_SOURCE = """function base64ToU8A(base64) {
  const s = atob(base64);
  const len = s.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = s.charCodeAt(i);
  }
  return buf;
}"""


def escape_text_for_js_template_literal(text: str) -> str:
    return text.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def _make_requirements_literal(requirements: list[str]) -> str:
    # json.dumps escapes `"` and `\` so requirements containing those don't
    # break the generated JS — JSON's string syntax is a strict subset of JS's
    # double-quoted string syntax. ensure_ascii=False matches JS's
    # JSON.stringify, which keeps non-ASCII characters as literals rather than
    # `\uXXXX` escapes — required for byte-identical output across runtimes.
    return (
        "[" + ", ".join(json.dumps(r, ensure_ascii=False) for r in requirements) + "]"
    )


def _make_entrypoint_literal(entrypoint: str) -> str:
    return json.dumps(entrypoint, ensure_ascii=False)


def _make_files_literal(files: dict) -> tuple[str, bool]:
    is_base64_decoder_required = False
    parts = ["{\n"]
    for name, file in files.items():
        parts.append(f"{json.dumps(name, ensure_ascii=False)}: ")
        which, _ = betterproto.which_one_of(file, "content")
        if which == "text":
            parts.append("`" + escape_text_for_js_template_literal(file.text) + "`,\n")
        else:
            # base64 alphabet has no chars that need escaping in a
            # double-quoted JS string literal.
            b64 = base64.b64encode(file.data).decode("ascii")
            parts.append(f'base64ToU8A("{b64}"),\n')
            is_base64_decoder_required = True
    parts.append("\n}")
    return "".join(parts), is_base64_decoder_required


def export_as_html(
    app_data: AppData,
    *,
    runtime_version: str,
    debug_comment: Optional[str] = None,
) -> str:
    files_literal, is_decoder_required = _make_files_literal(app_data.files)
    decoder_section = "\n" + BASE64_DECODER_JS_SOURCE if is_decoder_required else ""
    debug_html = f"\n  <!-- {debug_comment} -->" if debug_comment else ""

    return f"""<!DOCTYPE html>
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
      href="https://cdn.jsdelivr.net/npm/@stlite/browser@{runtime_version}/build/stlite.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
import {{ mount }} from "https://cdn.jsdelivr.net/npm/@stlite/browser@{runtime_version}/build/stlite.js"
mount(
  {{
    requirements: {_make_requirements_literal(app_data.requirements)},
    entrypoint: {_make_entrypoint_literal(app_data.entrypoint)},
    files: {files_literal},
  }},
  document.getElementById("root")
)
{decoder_section}
    </script>
  </body>{debug_html}
</html>"""
