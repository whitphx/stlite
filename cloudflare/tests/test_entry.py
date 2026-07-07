from stlite_cloudflare.adapter import AsgiHttpResponse
from stlite_cloudflare.frontend_config import with_cloudflare_frontend_config


def test_injects_cloudflare_frontend_config_into_streamlit_index():
    response = AsgiHttpResponse(
        status=200,
        headers=[
            ("content-type", "text/html; charset=utf-8"),
            ("content-length", "123"),
            ("etag", '"abc"'),
        ],
        body=b'<head><script type="module" src="./static/js/index.js"></script></head>',
    )

    rewritten = with_cloudflare_frontend_config(response)

    assert rewritten.status == 200
    assert ("content-length", "123") not in rewritten.headers
    assert ("etag", '"abc"') not in rewritten.headers
    assert b"window.__streamlit" in rewritten.body
    assert rewritten.body.index(b"window.__streamlit") < rewritten.body.index(
        b'<script type="module"'
    )


def test_does_not_rewrite_non_html_response():
    response = AsgiHttpResponse(
        status=200,
        headers=[("content-type", "image/jpeg")],
        body=b"\xff\xd8\xff",
    )

    assert with_cloudflare_frontend_config(response) is response
