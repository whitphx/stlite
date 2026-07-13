from __future__ import annotations

from stlite_cloudflare.adapter import AsgiHttpResponse

_MODULE_SCRIPT_MARKER = b'<script type="module" '
_CLOUDFLARE_FRONTEND_CONFIG = b"""<script>
window.__streamlit = {
  ...(window.__streamlit ?? {}),
  BACKEND_BASE_URL: new URL("/", window.location.href).toString(),
  MAIN_PAGE_BASE_URL: new URL("/", window.location.href).toString(),
}
</script>
"""


# Streamlit serves the SPA index for any path outside these namespaces; files
# under them (custom component pages, user static files) can also be text/html
# with module scripts and must be served byte-for-byte.
_NON_INDEX_PATH_PREFIXES = (
    "/_stcore/",
    "/app/static/",
    "/component/",
    "/media/",
)


def with_cloudflare_frontend_config(
    response: AsgiHttpResponse, path: str
) -> AsgiHttpResponse:
    if path.startswith(_NON_INDEX_PATH_PREFIXES):
        return response
    if not _is_html_response(response) or _MODULE_SCRIPT_MARKER not in response.body:
        return response

    body = response.body.replace(
        _MODULE_SCRIPT_MARKER,
        _CLOUDFLARE_FRONTEND_CONFIG + _MODULE_SCRIPT_MARKER,
        1,
    )
    headers = [
        (name, value)
        for name, value in response.headers
        if name.lower() not in {"content-length", "etag"}
    ]
    return AsgiHttpResponse(status=response.status, headers=headers, body=body)


def _is_html_response(response: AsgiHttpResponse) -> bool:
    return any(
        name.lower() == "content-type" and "text/html" in value.lower()
        for name, value in response.headers
    )
