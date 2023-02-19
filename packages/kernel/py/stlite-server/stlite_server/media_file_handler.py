import logging
from urllib.parse import quote, unquote_plus, urlparse, parse_qs

from streamlit.runtime.media_file_storage import MediaFileKind, MediaFileStorageError
from streamlit.runtime.memory_media_file_storage import (
    MemoryMediaFileStorage,
    get_extension_for_mimetype,
)
from streamlit.string_util import generate_download_filename_from_title

from .handler import RequestHandler, Request

LOGGER = logging.getLogger(__name__)

# Mimic the behavior of
# streamlit.web.server.media_file_handler:MediaFileHandler
# and tornado.web:StaticFileHandler.
class MediaFileHandler(RequestHandler):
    _storage: MemoryMediaFileStorage

    def __init__(self, storage: MemoryMediaFileStorage) -> None:
        self._storage = storage

    def get(self, request: Request, path: str):
        # NOTE: The original implementation of `get` in `tornado.web:StaticFileHandler` is a bit more complex,
        #       where it tries to convert the URL param `path` to a file-system path and tries to make it an absolute path based on a given root path,
        #       but we don't need that here because the file-system is not Windows and we don't have a root path (see `{"path": ""}` at https://github.com/streamlit/streamlit/blob/1.18.1/lib/streamlit/web/server/server.py#L269).
        #       So, we just use the `path` argument as-is.
        absolute_path = path
        try:
            media_file = self._storage.get_file(absolute_path)
        except MediaFileStorageError:
            LOGGER.error("MediaFileHandler: Missing file %s", absolute_path)
            return 404, {}, "Not Found"

        headers = {}
        # Copied from tornado.web:StaticFileHandler.get_headers()
        headers["Accept-Ranges"] = "bytes"
        # NOTE: This implementation skips the `Etag` header which was set by the original StaticFileHandler,
        #       because stlite does not care about caching.
        headers["Content-Type"] = media_file.mimetype  # NOTE: The original was `self.get_content_type`, that relies on the `path` argument with `mimetypes.guess_type()`

        # Copied from streamlit.web.server.media_file_handler:MediaFileHandler.set_extra_headers()
        if media_file and media_file.kind == MediaFileKind.DOWNLOADABLE:
            filename = media_file.filename

            if not filename:
                title = parse_qs(urlparse(request.path).query).get("title", "")[0].strip()  # NOTE: The original was `self.get_argument("title", "", True)`
                title = unquote_plus(title)
                filename = generate_download_filename_from_title(title)
                filename = f"{filename}{get_extension_for_mimetype(media_file.mimetype)}"

            try:
                # Check that the value can be encoded in latin1. Latin1 is
                # the default encoding for headers.
                filename.encode("latin1")
                file_expr = 'filename="{}"'.format(filename)
            except UnicodeEncodeError:
                file_expr = 'filename*=UTF-8\'\'{}'.format(quote(filename))

            headers["Content-Disposition"] = "attachment; " + file_expr

        # This implementation ignores the `Range` header which was dealt with by the original StaticFileHandler,
        # and this always returns the full file.
        size = media_file.content_size
        headers["Content-Length"] = str(size)

        return 200, headers, media_file.content
