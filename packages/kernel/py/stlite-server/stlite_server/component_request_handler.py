import logging
import mimetypes
import os

from streamlit.components.v1.components import ComponentRegistry

from .handler import Request, RequestHandler, Response

_LOGGER = logging.getLogger(__name__)


# Mimic streamlit.web.server.component_request_handler.ComponentRequestHandler
class ComponentRequestHandler(RequestHandler):
    def __init__(self, registry: ComponentRegistry) -> None:
        self._registry = registry

    def get(self, request: Request, path: str) -> Response:  # type: ignore[override]
        parts = path.split("/")
        component_name = parts[0]
        component_root = self._registry.get_component_path(component_name)
        if component_root is None:
            return Response(status_code=404, headers={}, body="not found")

        # follow symlinks to get an accurate normalized path
        component_root = os.path.realpath(component_root)
        filename = "/".join(parts[1:])
        abspath = os.path.realpath(os.path.join(component_root, filename))

        # Do NOT expose anything outside of the component root.
        if os.path.commonprefix([component_root, abspath]) != component_root or (
            not os.path.normpath(abspath).startswith(
                component_root
            )  # this is a recommendation from CodeQL, probably a bit redundant
        ):
            return Response(status_code=403, headers={}, body="forbidden")

        try:
            with open(abspath, "rb") as file:
                contents = file.read()
        except OSError as e:
            _LOGGER.error(
                "ComponentRequestHandler: GET %s read error", abspath, exc_info=e
            )
            return Response(status_code=404, headers={}, body="read error")

        # NOTE: The original impl calls `self.set_extra_headers(path)` to disable cache
        #       for HTML files, but we don't need to do that here because stlite doesn't
        #       care about caching.

        return Response(
            status_code=200,
            headers={"Content-Type": self.get_content_type(abspath)},
            body=contents,
        )

    @staticmethod
    def get_content_type(abspath) -> str:
        """Returns the ``Content-Type`` header to be used for this request.
        From tornado.web.StaticFileHandler.
        """
        mime_type, encoding = mimetypes.guess_type(abspath)
        # per RFC 6713, use the appropriate type for a gzip compressed file
        if encoding == "gzip":
            return "application/gzip"
        # As of 2015-07-21 there is no bzip2 encoding defined at
        # http://www.iana.org/assignments/media-types/media-types.xhtml
        # So for that (and any other encoding), use octet-stream.
        elif encoding is not None:
            return "application/octet-stream"
        elif mime_type is not None:
            return mime_type
        # if mime_type not detected, use application/octet-stream
        else:
            return "application/octet-stream"
