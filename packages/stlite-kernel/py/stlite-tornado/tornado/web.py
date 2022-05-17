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

from tornado.httpserver import HTTPServer
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
    def __init__(
        self,
        application: "Application",
        request: "httputil.HTTPServerRequest",
        **kwargs: Any
    ) -> None:
        print("RequestHandler.__init__", application, request, kwargs)
        pass


class StaticFileHandler:
    pass


class Application:
    def __init__(
        self,
        handlers: Optional[_RuleList] = None,
        default_host: Optional[str] = None,
        transforms: Optional[List[Type["OutputTransform"]]] = None,
        **settings: Any
    ) -> None:
        print("Application.__init__", handlers, default_host, transforms, settings)
        pass


    def listen(self, port: int, address: str = "", **kwargs: Any) -> HTTPServer:
        print("Application.listen", port, address, kwargs)
        pass


    def add_handlers(self, host_pattern: str, host_handlers: _RuleList) -> None:
        print("Application.add_handlers", host_pattern, host_handlers)
        pass


def addslash(fn):
    print("addslash", fn)
    return fn
