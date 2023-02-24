import logging
from urllib.parse import parse_qs, quote, unquote_plus

from streamlit.runtime.media_file_storage import MediaFileKind, MediaFileStorageError
from streamlit.runtime.memory_media_file_storage import (
    MemoryMediaFileStorage,
    get_extension_for_mimetype,
)
from streamlit.string_util import generate_download_filename_from_title

from .handler import Request, RequestHandler, Response

_LOGGER = logging.getLogger(__name__)


def get_argument(request: Request, key: str, strip: bool) -> str | None:
    arg_list = parse_qs(request.query).get(key)
    if arg_list is None:
        return None
    return arg_list[0].strip() if strip else arg_list[0]


# Mimic the behavior of
# streamlit.web.server.media_file_handler.MediaFileHandler
# and tornado.web.StaticFileHandler.
class MediaFileHandler(RequestHandler):
    _storage: MemoryMediaFileStorage

    def __init__(self, storage: MemoryMediaFileStorage) -> None:
        self._storage = storage

    def get(self, request: Request, path: str) -> Response:  # type: ignore[override]
        # NOTE: The original implementation of `get` in `tornado.web:StaticFileHandler`
        #       is a bit more complex, where it tries to convert the `path` argument
        #       to a file-system path and to make it an absolute path based on a given
        #       root path, but we don't need that here because the file-system is not
        #       Windows and we don't have a root path (see `{"path": ""}` at https://github.com/streamlit/streamlit/blob/1.18.1/lib/streamlit/web/server/server.py#L269).  # noqa: E501
        #       So, we just use the `path` argument as-is.
        absolute_path = path
        try:
            media_file = self._storage.get_file(absolute_path)
        except MediaFileStorageError:
            _LOGGER.error("MediaFileHandler: Missing file %s", absolute_path)
            return Response(404, {}, "Not Found")

        headers = {}
        # Copied from tornado.web.StaticFileHandler.get_headers()
        headers["Accept-Ranges"] = "bytes"
        # NOTE: This implementation skips the `Etag` header which was set by
        #       the original StaticFileHandler, because stlite does not care
        #       about caching.

        # NOTE: The original impl of setting the Content-Type header was
        #       `self.get_content_type` that relies on the `path` argument
        #       with `mimetypes.guess_type()`, but we can simply refer to
        #       `media_file.mimetype` here.
        headers["Content-Type"] = media_file.mimetype

        # Copied from streamlit.web.server.media_file_handler.MediaFileHandler.set_extra_headers()  # noqa: E501
        if media_file and media_file.kind == MediaFileKind.DOWNLOADABLE:
            filename = media_file.filename

            if not filename:
                title = get_argument(
                    request, "title", True
                )  # NOTE: The original was `self.get_argument("title", "", True)`
                if title is None:
                    return Response(400, {}, "Bad Request")
                title = unquote_plus(title)
                filename = generate_download_filename_from_title(title)
                filename = (
                    f"{filename}{get_extension_for_mimetype(media_file.mimetype)}"
                )

            try:
                # Check that the value can be encoded in latin1. Latin1 is
                # the default encoding for headers.
                filename.encode("latin1")
                file_expr = 'filename="{}"'.format(filename)
            except UnicodeEncodeError:
                file_expr = "filename*=UTF-8''{}".format(quote(filename))

            headers["Content-Disposition"] = "attachment; " + file_expr

        # NOTE: This implementation ignores the `Range` header which was dealt with
        #       by the original StaticFileHandler.
        #       Instead, this method always returns the full file.
        size = media_file.content_size
        headers["Content-Length"] = str(size)

        return Response(200, headers, media_file.content)
