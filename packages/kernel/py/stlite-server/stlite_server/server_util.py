# Copied from https://github.com/streamlit/streamlit/blob/1.18.1/lib/streamlit/web/server/server_util.py#L73-L77  # noqa: E501
def make_url_path_regex(*path: str, **kwargs) -> str:
    """Get a regex of the form ^/foo/bar/baz/?$ for a path (foo, bar, baz)."""
    valid_path = [x.strip("/") for x in path if x]  # Filter out falsely components.
    path_format = r"^/%s/?$" if kwargs.get("trailing_slash", True) else r"^/%s$"
    return path_format % "/".join(valid_path)
