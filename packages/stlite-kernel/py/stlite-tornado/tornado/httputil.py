from typing import Optional

HTTPHeaders = dict  # Very simplified mock just for stlite where only the Streamlit server reads the header object.

class HTTPServerRequest(object):
    def __init__(self, headers: Optional[HTTPHeaders] = None) -> None:
        self.headers = headers or HTTPHeaders()
