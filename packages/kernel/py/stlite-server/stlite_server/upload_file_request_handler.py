import logging
from typing import Callable, Dict, List

from streamlit.runtime.uploaded_file_manager import UploadedFileManager, UploadedFileRec

from .handler import Request, RequestHandler, Response
from .httputil import HTTPFile, parse_body_arguments

# /_stcore/upload_file/(optional session id)/(optional widget id)
UPLOAD_FILE_ROUTE = (
    r"/_stcore/upload_file/?(?P<session_id>[^/]*)?/?(?P<widget_id>[^/]*)?"
)
LOGGER = logging.getLogger(__name__)


# Mimic streamlit.web.server.upload_file_request_handler.UploadFileRequestHandler
class UploadFileRequestHandler(RequestHandler):
    def __init__(
        self, file_mgr: UploadedFileManager, is_active_session: Callable[[str], bool]
    ) -> None:
        self._file_mgr = file_mgr
        self._is_active_session = is_active_session

    @staticmethod
    def _require_arg(args: Dict[str, List[bytes]], name: str) -> str:
        """Return the value of the argument with the given name.

        A human-readable exception will be raised if the argument doesn't
        exist. This will be used as the body for the error response returned
        from the request.
        """
        try:
            arg = args[name]
        except KeyError:
            raise Exception(f"Missing '{name}'")

        if len(arg) != 1:
            raise Exception(f"Expected 1 '{name}' arg, but got {len(arg)}")

        # Convert bytes to string
        return arg[0].decode("utf-8")

    def post(self, request: Request, **kwargs) -> Response:
        # NOTE: The original implementation uses an async function,
        #       but it didn't make use of any async features,
        #       so we made it a regular function here for simplicity sake.

        args: Dict[str, List[bytes]] = {}
        files: Dict[str, List[HTTPFile]] = {}

        if not isinstance(request.body, bytes):
            return Response(
                status_code=400, headers={}, body="request body must be bytes"
            )

        parse_body_arguments(
            content_type=request.headers["Content-Type"],
            body=request.body,
            arguments=args,
            files=files,
        )

        try:
            session_id = self._require_arg(args, "sessionId")
            widget_id = self._require_arg(args, "widgetId")
            if not self._is_active_session(session_id):
                raise Exception(f"Invalid session_id: '{session_id}'")

        except Exception as e:
            return Response(status_code=400, headers={}, body=str(e))

        # Create an UploadedFile object for each file.
        # We assign an initial, invalid file_id to each file in this loop.
        # The file_mgr will assign unique file IDs and return in `add_file`,
        # below.
        uploaded_files: List[UploadedFileRec] = []
        for _, flist in files.items():
            for file in flist:
                uploaded_files.append(
                    UploadedFileRec(
                        id=0,
                        name=file.filename,
                        type=file.content_type,
                        data=file.body,
                    )
                )

        if len(uploaded_files) != 1:
            return Response(
                status_code=400,
                headers={},
                body=f"Expected 1 file, but got {len(uploaded_files)}",
            )

        added_file = self._file_mgr.add_file(
            session_id=session_id, widget_id=widget_id, file=uploaded_files[0]
        )

        # Return the file_id to the client. (The client will parse
        # the string back to an int.)
        return Response(status_code=200, headers={}, body=str(added_file.id))
