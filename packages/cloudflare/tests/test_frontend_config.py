from stlite_cloudflare.adapter import AsgiHttpResponse
from stlite_cloudflare.frontend_config import with_cloudflare_frontend_config


def _index_response() -> AsgiHttpResponse:
    return AsgiHttpResponse(
        status=200,
        headers=[
            ("content-type", "text/html; charset=utf-8"),
            ("content-length", "123"),
            ("etag", '"abc"'),
        ],
        body=b'<head><script type="module" src="./static/js/index.js"></script></head>',
    )


def test_injects_cloudflare_frontend_config_into_streamlit_index():
    rewritten = with_cloudflare_frontend_config(_index_response(), path="/")

    assert rewritten.status == 200
    assert ("content-length", "123") not in rewritten.headers
    assert ("etag", '"abc"') not in rewritten.headers
    assert b"window.__streamlit" in rewritten.body
    assert rewritten.body.index(b"window.__streamlit") < rewritten.body.index(
        b'<script type="module"'
    )


def test_injects_into_index_served_at_page_paths():
    rewritten = with_cloudflare_frontend_config(
        _index_response(), path="/dataframe_demo"
    )

    assert b"window.__streamlit" in rewritten.body


def test_does_not_rewrite_non_html_response():
    response = AsgiHttpResponse(
        status=200,
        headers=[("content-type", "image/jpeg")],
        body=b"\xff\xd8\xff",
    )

    assert with_cloudflare_frontend_config(response, path="/") is response


def test_does_not_rewrite_html_served_from_asset_namespaces():
    for path in (
        "/component/my_component/index.html",
        "/app/static/page.html",
        "/media/generated.html",
        "/_stcore/whatever",
    ):
        response = _index_response()
        assert with_cloudflare_frontend_config(response, path=path) is response
