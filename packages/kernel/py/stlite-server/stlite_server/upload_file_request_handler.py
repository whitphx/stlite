import logging
from typing import Callable, Dict, List, cast

from streamlit.runtime.memory_uploaded_file_manager import MemoryUploadedFileManager
from streamlit.runtime.uploaded_file_manager import UploadedFileManager, UploadedFileRec

from .handler import Request, RequestHandler, Response
from .httputil import HTTPFile, parse_body_arguments

LOGGER = logging.getLogger(__name__)


# Mimic streamlit.web.server.upload_file_request_handler.UploadFileRequestHandler
class UploadFileRequestHandler(RequestHandler):
    def __init__(
        self, file_mgr: UploadedFileManager, is_active_session: Callable[[str], bool]
    ) -> None:
        self._file_mgr = cast(
            MemoryUploadedFileManager, file_mgr
        )  # HACK: The upstream reference impl also has this type mismatch while it's not checked because Tornado's initialize() is not type checked.  # noqa: E501
        self._is_active_session = is_active_session

    def put(self, request: Request, **kwargs) -> Response:
        """Receive an uploaded file and add it to our UploadedFileManager."""

        args: Dict[str, List[bytes]] = {}
        files: Dict[str, List[HTTPFile]] = {}

        session_id = kwargs["session_id"]
        file_id = kwargs["file_id"]

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
            if not self._is_active_session(session_id):
                raise Exception("Invalid session_id")
        except Exception as e:
            return Response(status_code=400, headers={}, body=str(e))

        uploaded_files: List[UploadedFileRec] = []

        for _, flist in files.items():
            for file in flist:
                uploaded_files.append(
                    UploadedFileRec(
                        file_id=file_id,
                        name=file["filename"],
                        type=file["content_type"],
                        data=file["body"],
                    )
                )

        if len(uploaded_files) != 1:
            return Response(
                status_code=400,
                headers={},
                body=f"Expected 1 file, but got {len(uploaded_files)}",
            )

        self._file_mgr.add_file(session_id=session_id, file=uploaded_files[0])
        return Response(status_code=204, headers={}, body="")

    def delete(self, request: Request, **kwargs):
        """Delete file request handler."""
        session_id = kwargs["session_id"]
        file_id = kwargs["file_id"]

        self._file_mgr.remove_file(session_id=session_id, file_id=file_id)
        return Response(status_code=204, headers={}, body="")
