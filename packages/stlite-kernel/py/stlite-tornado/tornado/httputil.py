import collections
from typing import Optional
from http.client import responses


# responses is unused in this file, but we re-export it to other files.
# Reference it so pyflakes doesn't complain.
responses


HTTPHeaders = dict  # Very simplified mock just for stlite where only the Streamlit server reads the header object.


class HTTPServerRequest(object):
    def __init__(self,
        method: Optional[str] = None,
        headers: Optional[HTTPHeaders] = None,
        connection: Optional["HTTPConnection"] = None,
    ) -> None:
        self.method = method
        self.headers = headers or HTTPHeaders()
        self.connection = connection


ResponseStartLine = collections.namedtuple(
    "ResponseStartLine", ["version", "code", "reason"]
)
