from stlite_cli._proto.models import AppData, File
from stlite_cli.export_html import (
    BASE64_DECODER_JS_SOURCE,
    escape_text_for_js_template_literal,
    export_as_html,
)


def test_escape_text_for_js_template_literal_handles_specials():
    assert escape_text_for_js_template_literal("`hi`") == "\\`hi\\`"
    assert escape_text_for_js_template_literal("Hello ${world}!") == "Hello \\${world}!"
    assert escape_text_for_js_template_literal("\\hi\\") == "\\\\hi\\\\"


def test_export_as_html_includes_decoder_only_when_binary_present():
    text_only = export_as_html(
        AppData(
            entrypoint="app.py", files={"app.py": File(text="x = 1\n")}, requirements=[]
        ),
        runtime_version="0.0.0-test",
    )
    assert BASE64_DECODER_JS_SOURCE not in text_only

    with_binary = export_as_html(
        AppData(
            entrypoint="app.py",
            files={"app.py": File(text="x = 1\n"), "blob.bin": File(data=b"\x00\x01")},
            requirements=[],
        ),
        runtime_version="0.0.0-test",
    )
    assert BASE64_DECODER_JS_SOURCE in with_binary


def test_export_as_html_keeps_non_ascii_filenames_as_literals():
    """ensure_ascii=False parity: filenames must NOT be `\\uXXXX`-escaped."""
    html = export_as_html(
        AppData(
            entrypoint="app.py",
            files={"データ.txt": File(text="x")},
            requirements=[],
        ),
        runtime_version="0.0.0-test",
    )
    assert '"データ.txt":' in html
    assert "\\u30c7" not in html


def test_export_as_html_keeps_non_ascii_requirements_as_literals():
    html = export_as_html(
        AppData(entrypoint="app.py", files={}, requirements=["パッケージ"]),
        runtime_version="0.0.0-test",
    )
    assert '"パッケージ"' in html


def test_export_as_html_optional_debug_comment():
    html_with = export_as_html(
        AppData(entrypoint="app.py", files={}, requirements=[]),
        runtime_version="0.0.0-test",
        debug_comment="from-test v1",
    )
    assert "<!-- from-test v1 -->" in html_with

    html_without = export_as_html(
        AppData(entrypoint="app.py", files={}, requirements=[]),
        runtime_version="0.0.0-test",
    )
    assert "<!--" not in html_without
