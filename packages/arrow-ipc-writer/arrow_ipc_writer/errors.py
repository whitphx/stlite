"""Error types matching pyarrow's, so callers can catch either library's."""


class ArrowException(Exception):
    pass


class ArrowInvalid(ValueError, ArrowException):
    pass


class ArrowTypeError(TypeError, ArrowException):
    pass


class ArrowNotImplementedError(NotImplementedError, ArrowException):
    pass


class ArrowCapacityError(ArrowInvalid):
    pass
