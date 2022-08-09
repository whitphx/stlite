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
import datetime
import sys
from typing import Union, Tuple

from tornado import httputil
from tornado.routing import (
    _RuleList,
)
from tornado.escape import utf8, _unicode
from tornado.log import app_log

from typing import (
    Any,
    Optional,
    List,
    Type,
)


class RequestHandler:
    SUPPORTED_METHODS = ("GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")

    def __init__(self, request: httputil.HTTPServerRequest, **kwargs):
        self.request = request
        self._finished = False
        self._auto_finish = True
        self.clear()
        self.initialize(**kwargs)  # type: ignore

    def _initialize(self) -> None:
        pass

    initialize = _initialize

    def clear(self) -> None:
        self._headers = httputil.HTTPHeaders(
            {
                "Content-Type": "text/html; charset=UTF-8",
            }
        )
        self._write_buffer = []  # type: List[bytes]
        self._status_code = 200

    def add_header(self, name: str, value) -> None:
        self._headers[name] = value

    def set_status(self, status_code: int, reason: Optional[str] = None) -> None:
        self._status_code = status_code
        self._reason = reason

    def set_cookie(
        self,
        name: str,
        value: Union[str, bytes],
        domain: Optional[str] = None,
        expires: Optional[Union[float, Tuple, datetime.datetime]] = None,
        path: str = "/",
        expires_days: Optional[float] = None,
        **kwargs: Any
    ) -> None:
        pass

    def decode_argument(self, value: bytes, name: Optional[str] = None) -> str:
        """Decodes an argument from the request.

        The argument has been percent-decoded and is now a byte string.
        By default, this method decodes the argument as utf-8 and returns
        a unicode string, but this may be overridden in subclasses.

        This method is used as a filter for both `get_argument()` and for
        values extracted from the url and passed to `get()`/`post()`/etc.

        The name of the argument is provided if known, but may be None
        (e.g. for unnamed groups in the url regex).
        """
        try:
            return _unicode(value)
        except UnicodeDecodeError:
            raise HTTPError(
                400, "Invalid unicode in %s: %r" % (name or "url", value[:40])
            )

    @property
    def xsrf_token(self) -> bytes:
        return os.urandom(16)  # XXX: Dummy implementation

    def write(self, chunk: Union[str, bytes]) -> None:
        if self._finished:
            raise RuntimeError("Cannot write() after finish()")

        chunk = utf8(chunk)
        self._write_buffer.append(chunk)

    def _handle_request_exception(self, e: BaseException) -> None:
        if isinstance(e, Finish):
            # Not an error; just finish the request without logging.
            if not self._finished:
                self.finish(*e.args)
            return
        try:
            self.log_exception(*sys.exc_info())
        except Exception:
            # An error here should still get a best-effort send_error()
            # to avoid leaking the connection.
            app_log.error("Error in exception logger", exc_info=True)
        if self._finished:
            # Extra errors after the request has been finished should
            # be logged, but there is no reason to continue to try and
            # send a response.
            return
        if isinstance(e, HTTPError):
            self.send_error(e.status_code, exc_info=sys.exc_info())
        else:
            self.send_error(500, exc_info=sys.exc_info())

    async def _execute(
        self, transforms: List["OutputTransform"], *args: bytes, **kwargs: bytes
    ) -> None:
        """Executes this request with the given output transforms."""
        self._transforms = transforms
        try:
            if self.request.method not in self.SUPPORTED_METHODS:
                raise HTTPError(405)
            self.path_args = [self.decode_argument(arg) for arg in args]
            self.path_kwargs = dict(
                (k, self.decode_argument(v, name=k)) for (k, v) in kwargs.items()
            )
            # # If XSRF cookies are turned on, reject form submissions without
            # # the proper cookie
            # if (
            #     self.request.method
            #     not in (
            #         "GET",
            #         "HEAD",
            #         "OPTIONS",
            #     )
            #     and self.application.settings.get("xsrf_cookies")
            # ):
            #     self.check_xsrf_cookie()

            # result = self.prepare()
            # if result is not None:
            #     result = await result
            # if self._prepared_future is not None:
            #     # Tell the Application we've finished with prepare()
            #     # and are ready for the body to arrive.
            #     future_set_result_unless_cancelled(self._prepared_future, None)
            if self._finished:
                return

            # if _has_stream_request_body(self.__class__):
            #     # In streaming mode request.body is a Future that signals
            #     # the body has been completely received.  The Future has no
            #     # result; the data has been passed to self.data_received
            #     # instead.
            #     try:
            #         await self.request._body_future
            #     except iostream.StreamClosedError:
            #         return

            method = getattr(self, self.request.method.lower())
            result = method(*self.path_args, **self.path_kwargs)
            if result is not None:
                result = await result
            if self._auto_finish and not self._finished:
                self.finish()
        except Exception as e:
            try:
                self._handle_request_exception(e)
            except Exception:
                app_log.error("Exception in exception handler", exc_info=True)
            finally:
                # Unset result to avoid circular references
                result = None
            # if self._prepared_future is not None and not self._prepared_future.done():
            #     # In case we failed before setting _prepared_future, do it
            #     # now (to unblock the HTTP server).  Note that this is not
            #     # in a finally block to avoid GC issues prior to Python 3.4.
            #     self._prepared_future.set_result(None)

    def flush(self):
        chunk = b"".join(self._write_buffer)
        self._write_buffer = []
        start_line = httputil.ResponseStartLine("", self._status_code, self._reason)
        return self.request.connection.write_headers(
            start_line, self._headers, chunk
        )

    def finish(self, chunk: Optional[Union[str, bytes, dict]] = None) -> "Future[None]":
        if self._finished:
            raise RuntimeError("finish() called twice")

        if chunk is not None:
            self.write(chunk)

        self.flush()
        self.request.connection.finish()
        self._finished = True


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


class HTTPError(Exception):
    """An exception that will turn into an HTTP error response.

    Raising an `HTTPError` is a convenient alternative to calling
    `RequestHandler.send_error` since it automatically ends the
    current function.

    To customize the response sent with an `HTTPError`, override
    `RequestHandler.write_error`.

    :arg int status_code: HTTP status code.  Must be listed in
        `httplib.responses <http.client.responses>` unless the ``reason``
        keyword argument is given.
    :arg str log_message: Message to be written to the log for this error
        (will not be shown to the user unless the `Application` is in debug
        mode).  May contain ``%s``-style placeholders, which will be filled
        in with remaining positional parameters.
    :arg str reason: Keyword-only argument.  The HTTP "reason" phrase
        to pass in the status line along with ``status_code``.  Normally
        determined automatically from ``status_code``, but can be used
        to use a non-standard numeric code.
    """

    def __init__(
        self,
        status_code: int = 500,
        log_message: Optional[str] = None,
        *args: Any,
        **kwargs: Any
    ) -> None:
        self.status_code = status_code
        self.log_message = log_message
        self.args = args
        self.reason = kwargs.get("reason", None)
        if log_message and not args:
            self.log_message = log_message.replace("%", "%%")

    def __str__(self) -> str:
        message = "HTTP %d: %s" % (
            self.status_code,
            self.reason or httputil.responses.get(self.status_code, "Unknown"),
        )
        if self.log_message:
            return message + " (" + (self.log_message % self.args) + ")"
        else:
            return message


class Finish(Exception):
    """An exception that ends the request without producing an error response.

    When `Finish` is raised in a `RequestHandler`, the request will
    end (calling `RequestHandler.finish` if it hasn't already been
    called), but the error-handling methods (including
    `RequestHandler.write_error`) will not be called.

    If `Finish()` was created with no arguments, the pending response
    will be sent as-is. If `Finish()` was given an argument, that
    argument will be passed to `RequestHandler.finish()`.

    This can be a more convenient way to implement custom error pages
    than overriding ``write_error`` (especially in library code)::

        if self.current_user is None:
            self.set_status(401)
            self.set_header('WWW-Authenticate', 'Basic realm="something"')
            raise Finish()

    .. versionchanged:: 4.3
       Arguments passed to ``Finish()`` will be passed on to
       `RequestHandler.finish`.
    """

    pass
