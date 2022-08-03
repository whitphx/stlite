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
        self.initialize(**kwargs)  # type: ignore

    @property
    def xsrf_token(self) -> bytes:
        return os.urandom(16)  # XXX: Dummy implementation

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
