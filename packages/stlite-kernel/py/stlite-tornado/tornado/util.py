import asyncio
import typing
from typing import (
    Any,
    Optional,
    Dict,
    Mapping,
    List,
    Tuple,
    Match,
    Callable,
    Type,
    Sequence,
)

# Aliases for types that are spelled differently in different Python
# versions. bytes_type is deprecated and no longer used in Tornado
# itself but is left in case anyone outside Tornado is using it.
bytes_type = bytes
unicode_type = str
basestring_type = str

# versionchanged:: 6.2
# no longer our own TimeoutError, use standard asyncio class
TimeoutError = asyncio.TimeoutError


class ObjectDict(Dict[str, Any]):
    """Makes a dictionary behave like an object, with attribute-style access."""

    def __getattr__(self, name: str) -> Any:
        try:
            return self[name]
        except KeyError:
            raise AttributeError(name)

    def __setattr__(self, name: str, value: Any) -> None:
        self[name] = value


def import_object(name: str) -> Any:
    """Imports an object by name.

    ``import_object('x')`` is equivalent to ``import x``.
    ``import_object('x.y.z')`` is equivalent to ``from x.y import z``.

    >>> import tornado.escape
    >>> import_object('tornado.escape') is tornado.escape
    True
    >>> import_object('tornado.escape.utf8') is tornado.escape.utf8
    True
    >>> import_object('tornado') is tornado
    True
    >>> import_object('tornado.missing_module')
    Traceback (most recent call last):
        ...
    ImportError: No module named missing_module
    """
    if name.count(".") == 0:
        return __import__(name)

    parts = name.split(".")
    obj = __import__(".".join(parts[:-1]), fromlist=[parts[-1]])
    try:
        return getattr(obj, parts[-1])
    except AttributeError:
        raise ImportError("No module named %s" % parts[-1])


class Configurable(object):
    """Base class for configurable interfaces.

    A configurable interface is an (abstract) class whose constructor
    acts as a factory function for one of its implementation subclasses.
    The implementation subclass as well as optional keyword arguments to
    its initializer can be set globally at runtime with `configure`.

    By using the constructor as the factory method, the interface
    looks like a normal class, `isinstance` works as usual, etc.  This
    pattern is most useful when the choice of implementation is likely
    to be a global decision (e.g. when `~select.epoll` is available,
    always use it instead of `~select.select`), or when a
    previously-monolithic class has been split into specialized
    subclasses.

    Configurable subclasses must define the class methods
    `configurable_base` and `configurable_default`, and use the instance
    method `initialize` instead of ``__init__``.

    .. versionchanged:: 5.0

       It is now possible for configuration to be specified at
       multiple levels of a class hierarchy.

    """

    # Type annotations on this class are mostly done with comments
    # because they need to refer to Configurable, which isn't defined
    # until after the class definition block. These can use regular
    # annotations when our minimum python version is 3.7.
    #
    # There may be a clever way to use generics here to get more
    # precise types (i.e. for a particular Configurable subclass T,
    # all the types are subclasses of T, not just Configurable).
    __impl_class = None  # type: Optional[Type[Configurable]]
    __impl_kwargs = None  # type: Dict[str, Any]

    def __new__(cls, *args: Any, **kwargs: Any) -> Any:
        base = cls.configurable_base()
        init_kwargs = {}  # type: Dict[str, Any]
        if cls is base:
            impl = cls.configured_class()
            if base.__impl_kwargs:
                init_kwargs.update(base.__impl_kwargs)
        else:
            impl = cls
        init_kwargs.update(kwargs)
        if impl.configurable_base() is not base:
            # The impl class is itself configurable, so recurse.
            return impl(*args, **init_kwargs)
        instance = super(Configurable, cls).__new__(impl)
        # initialize vs __init__ chosen for compatibility with AsyncHTTPClient
        # singleton magic.  If we get rid of that we can switch to __init__
        # here too.
        instance.initialize(*args, **init_kwargs)
        return instance

    @classmethod
    def configurable_base(cls):
        # type: () -> Type[Configurable]
        """Returns the base class of a configurable hierarchy.

        This will normally return the class in which it is defined.
        (which is *not* necessarily the same as the ``cls`` classmethod
        parameter).

        """
        raise NotImplementedError()

    @classmethod
    def configurable_default(cls):
        # type: () -> Type[Configurable]
        """Returns the implementation class to be used if none is configured."""
        raise NotImplementedError()

    def _initialize(self) -> None:
        pass

    initialize = _initialize  # type: Callable[..., None]
    """Initialize a `Configurable` subclass instance.

    Configurable classes should use `initialize` instead of ``__init__``.

    .. versionchanged:: 4.2
       Now accepts positional arguments in addition to keyword arguments.
    """

    @classmethod
    def configure(cls, impl, **kwargs):
        # type: (Union[None, str, Type[Configurable]], Any) -> None
        """Sets the class to use when the base class is instantiated.

        Keyword arguments will be saved and added to the arguments passed
        to the constructor.  This can be used to set global defaults for
        some parameters.
        """
        base = cls.configurable_base()
        if isinstance(impl, str):
            impl = typing.cast(Type[Configurable], import_object(impl))
        if impl is not None and not issubclass(impl, cls):
            raise ValueError("Invalid subclass of %s" % cls)
        base.__impl_class = impl
        base.__impl_kwargs = kwargs

    @classmethod
    def configured_class(cls):
        # type: () -> Type[Configurable]
        """Returns the currently configured class."""
        base = cls.configurable_base()
        # Manually mangle the private name to see whether this base
        # has been configured (and not another base higher in the
        # hierarchy).
        if base.__dict__.get("_Configurable__impl_class") is None:
            base.__impl_class = cls.configurable_default()
        if base.__impl_class is not None:
            return base.__impl_class
        else:
            # Should be impossible, but mypy wants an explicit check.
            raise ValueError("configured class not found")

    @classmethod
    def _save_configuration(cls):
        # type: () -> Tuple[Optional[Type[Configurable]], Dict[str, Any]]
        base = cls.configurable_base()
        return (base.__impl_class, base.__impl_kwargs)

    @classmethod
    def _restore_configuration(cls, saved):
        # type: (Tuple[Optional[Type[Configurable]], Dict[str, Any]]) -> None
        base = cls.configurable_base()
        base.__impl_class = saved[0]
        base.__impl_kwargs = saved[1]
