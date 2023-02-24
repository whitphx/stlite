# `parse_body_arguments()` whose original impl was in tornado.httputil
# and its dependent functions are copied from Tornado to here, with some modifications.

import email.utils
import logging
import urllib.parse
from functools import lru_cache
from typing import Dict, Generator, List, NamedTuple, Optional, Tuple, Union

LOGGER = logging.getLogger(__name__)


class HTTPFile(NamedTuple):
    filename: str
    body: bytes
    content_type: str


def parse_qs_bytes(
    qs: Union[str, bytes], keep_blank_values: bool = False, strict_parsing: bool = False
) -> Dict[str, List[bytes]]:
    """Parses a query string like urlparse.parse_qs,
    but takes bytes and returns the values as byte strings.

    Keys still become type str (interpreted as latin1 in python3!)
    because it's too painful to keep them as byte strings in
    python3 and in practice they're nearly always ascii anyway.
    """
    # This is gross, but python3 doesn't give us another way.
    # Latin1 is the universal donor of character encodings.
    if isinstance(qs, bytes):
        qs = qs.decode("latin1")
    result = urllib.parse.parse_qs(
        qs, keep_blank_values, strict_parsing, encoding="latin1", errors="strict"
    )
    encoded = {}
    for k, v in result.items():
        encoded[k] = [i.encode("latin1") for i in v]
    return encoded


def parse_body_arguments(
    content_type: str,
    body: bytes,
    arguments: Dict[str, List[bytes]],
    files: Dict[str, List[HTTPFile]],
    headers: Optional[Dict] = None,
) -> None:
    """Parses a form request body.

    Supports ``application/x-www-form-urlencoded`` and
    ``multipart/form-data``.  The ``content_type`` parameter should be
    a string and ``body`` should be a byte string.  The ``arguments``
    and ``files`` parameters are dictionaries that will be updated
    with the parsed contents.
    """
    if content_type.startswith("application/x-www-form-urlencoded"):
        if headers and "Content-Encoding" in headers:
            LOGGER.warning(
                "Unsupported Content-Encoding: %s", headers["Content-Encoding"]
            )
            return
        try:
            # real charset decoding will happen in RequestHandler.decode_argument()
            uri_arguments = parse_qs_bytes(body, keep_blank_values=True)
        except Exception as e:
            LOGGER.warning("Invalid x-www-form-urlencoded body: %s", e)
            uri_arguments = {}
        for name, values in uri_arguments.items():
            if values:
                arguments.setdefault(name, []).extend(values)
    elif content_type.startswith("multipart/form-data"):
        if headers and "Content-Encoding" in headers:
            LOGGER.warning(
                "Unsupported Content-Encoding: %s", headers["Content-Encoding"]
            )
            return
        try:
            fields = content_type.split(";")
            for field in fields:
                k, sep, v = field.strip().partition("=")
                if k == "boundary" and v:
                    parse_multipart_form_data(utf8(v), body, arguments, files)
                    break
            else:
                raise ValueError("multipart boundary not found")
        except Exception as e:
            LOGGER.warning("Invalid multipart/form-data: %s", e)


def parse_multipart_form_data(
    boundary: bytes,
    data: bytes,
    arguments: Dict[str, List[bytes]],
    files: Dict[str, List[HTTPFile]],
) -> None:
    """Parses a ``multipart/form-data`` body.

    The ``boundary`` and ``data`` parameters are both byte strings.
    The dictionaries given in the arguments and files parameters
    will be updated with the contents of the body.

    .. versionchanged:: 5.1

       Now recognizes non-ASCII filenames in RFC 2231/5987
       (``filename*=``) format.
    """
    # The standard allows for the boundary to be quoted in the header,
    # although it's rare (it happens at least for google app engine
    # xmpp).  I think we're also supposed to handle backslash-escapes
    # here but I'll save that until we see a client that uses them
    # in the wild.
    if boundary.startswith(b'"') and boundary.endswith(b'"'):
        boundary = boundary[1:-1]
    final_boundary_index = data.rfind(b"--" + boundary + b"--")
    if final_boundary_index == -1:
        LOGGER.warning("Invalid multipart/form-data: no final boundary")
        return
    parts = data[:final_boundary_index].split(b"--" + boundary + b"\r\n")
    for part in parts:
        if not part:
            continue
        eoh = part.find(b"\r\n\r\n")
        if eoh == -1:
            LOGGER.warning("multipart/form-data missing headers")
            continue
        headers = HTTPHeaders_parse(part[:eoh].decode("utf-8"))
        disp_header = headers.get("Content-Disposition", "")
        disposition, disp_params = _parse_header(disp_header)
        if disposition != "form-data" or not part.endswith(b"\r\n"):
            LOGGER.warning("Invalid multipart/form-data")
            continue
        value = part[eoh + 4 : -2]
        if not disp_params.get("name"):
            LOGGER.warning("multipart/form-data value missing name")
            continue
        name = disp_params["name"]
        if disp_params.get("filename"):
            ctype = headers.get("Content-Type", "application/unknown")
            files.setdefault(name, []).append(
                HTTPFile(
                    filename=disp_params["filename"], body=value, content_type=ctype
                )
            )
        else:
            arguments.setdefault(name, []).append(value)


@lru_cache(1000)
def _normalize_header(name: str) -> str:
    """Map a header name to Http-Header-Case.

    >>> _normalize_header("coNtent-TYPE")
    'Content-Type'
    """
    return "-".join([w.capitalize() for w in name.split("-")])


def HTTPHeaders_parse_line(line: str) -> Tuple[str, str]:
    """Updates the dictionary with a single header line.

    >>> h = HTTPHeaders()
    >>> h.parse_line("Content-Type: text/html")
    >>> h.get('content-type')
    'text/html'
    """
    _last_key = None
    if line[0].isspace():
        # continuation of a multi-line header
        if _last_key is None:
            raise RuntimeError("first header line cannot start with whitespace")
    else:
        try:
            name, value = line.split(":", 1)
        except ValueError:
            raise RuntimeError("no colon in header line")
        norm_name = _normalize_header(name)
        _last_key = norm_name
        return norm_name, value.strip()


def HTTPHeaders_parse(headers: str) -> Dict:
    """Returns a dictionary from HTTP header text.

    >>> h = HTTPHeaders.parse("Content-Type: text/html\\r\\nContent-Length: 42\\r\\n")
    >>> sorted(h.items())
    [('Content-Length', '42'), ('Content-Type', 'text/html')]

    .. versionchanged:: 5.1

        Raises `HTTPInputError` on malformed headers instead of a
        mix of `KeyError`, and `ValueError`.

    """
    h = dict()
    # RFC 7230 section 3.5: a recipient MAY recognize a single LF as a line
    # terminator and ignore any preceding CR.
    for line in headers.split("\n"):
        if line.endswith("\r"):
            line = line[:-1]
        if line:
            name, value = HTTPHeaders_parse_line(line)
            h[name] = value
    return h


def _parseparam(s: str) -> Generator[str, None, None]:
    while s[:1] == ";":
        s = s[1:]
        end = s.find(";")
        while end > 0 and (s.count('"', 0, end) - s.count('\\"', 0, end)) % 2:
            end = s.find(";", end + 1)
        if end < 0:
            end = len(s)
        f = s[:end]
        yield f.strip()
        s = s[end:]


def _parse_header(line: str) -> Tuple[str, Dict[str, str]]:
    r"""Parse a Content-type like header.

    Return the main content-type and a dictionary of options.

    >>> d = "form-data; foo=\"b\\\\a\\\"r\"; file*=utf-8''T%C3%A4st"
    >>> ct, d = _parse_header(d)
    >>> ct
    'form-data'
    >>> d['file'] == r'T\u00e4st'.encode('ascii').decode('unicode_escape')
    True
    >>> d['foo']
    'b\\a"r'
    """
    parts = _parseparam(";" + line)
    key = next(parts)
    # decode_params treats first argument special, but we already stripped key
    params = [("Dummy", "value")]
    for p in parts:
        i = p.find("=")
        if i >= 0:
            name = p[:i].strip().lower()
            value = p[i + 1 :].strip()
            params.append((name, native_str(value)))
    decoded_params = email.utils.decode_params(params)
    decoded_params.pop(0)  # get rid of the dummy again
    pdict = {}
    for name, decoded_value in decoded_params:
        value = email.utils.collapse_rfc2231_value(decoded_value)
        if len(value) >= 2 and value[0] == '"' and value[-1] == '"':
            value = value[1:-1]
        pdict[name] = value
    return key, pdict


def utf8(value: Union[str, bytes]) -> bytes:
    """Converts a string argument to a byte string.

    If the argument is already a byte string or None, it is returned unchanged.
    Otherwise it must be a unicode string and is encoded as utf8.
    """
    if isinstance(value, bytes):
        return value
    if not isinstance(value, str):
        raise TypeError("Expected bytes, unicode, or None; got %r" % type(value))
    return value.encode("utf-8")


def to_unicode(value: Union[str, bytes]) -> str:
    """Converts a string argument to a unicode string.

    If the argument is already a unicode string or None, it is returned
    unchanged.  Otherwise it must be a byte string and is decoded as utf8.
    """
    if isinstance(value, str):
        return value
    if not isinstance(value, bytes):
        raise TypeError("Expected bytes, unicode, or None; got %r" % type(value))
    return value.decode("utf-8")


native_str = to_unicode
