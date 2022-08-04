#
# Copyright 2009 Facebook
# Copyright 2022 Yuichiro Tachibana
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

import os
from typing import Union, Tuple

from tornado import httputil
from tornado.routing import (
    _RuleList,
)

from typing import (
    Any,
    Optional,
    List,
    Type,
)

class RequestHandler:
    def __init__(self, request: httputil.HTTPServerRequest, **kwargs):
        self.request = request
        self._finished = False
        self.clear()
        self.initialize(**kwargs)  # type: ignore

    def _initialize(self) -> None:
        pass

    initialize = _initialize

    def clear(self) -> None:
        self._write_buffer = []  # type: List[bytes]
        self._status_code = 200

    def add_header(self, name: str, value) -> None:
        pass

    @property
    def xsrf_token(self) -> bytes:
        return os.urandom(16)  # XXX: Dummy implementation

    def write(self, chunk: Union[str, bytes]) -> None:
        if self._finished:
            raise RuntimeError("Cannot write() after finish()")

        chunk = chunk.encode("utf8") if isinstance(chunk, str) else chunk
        self._write_buffer.append(chunk)

    def compile_result(self) -> Tuple[int, bytes]:
        """ stlite specific method.
        """
        if self._finished:
            raise RuntimeError("finish() called twice")

        self._finished = True
        return self._status_code, b"".join(self._write_buffer)


class StaticFileHandler(RequestHandler):
    pass


class Application:
    def __init__(
        self,
        handlers: Optional[_RuleList] = None,
        default_host: Optional[str] = None,
        transforms: Optional[List[Type["OutputTransform"]]] = None,
        **settings: Any
    ) -> None:
        self.handlers = handlers

    def add_handlers(self, host_pattern: str, host_handlers: _RuleList) -> None:
        pass


def addslash(fn):
    return fn
