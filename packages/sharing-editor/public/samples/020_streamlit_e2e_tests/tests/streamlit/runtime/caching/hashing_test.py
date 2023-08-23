# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""st.memo/singleton hashing tests."""

import functools
import hashlib
import os
import re
import tempfile
import types
import unittest
import uuid
from dataclasses import dataclass
from enum import Enum, auto
from io import BytesIO, StringIO
from unittest.mock import MagicMock, Mock

import cffi
import numpy as np
import pandas as pd
from parameterized import parameterized
from PIL import Image

from streamlit.runtime.caching.cache_errors import UnhashableTypeError
from streamlit.runtime.caching.hashing import (
    _NP_SIZE_LARGE,
    _PANDAS_ROWS_LARGE,
    _CacheFuncHasher,
)

try:
    import keras
except ImportError:
    pass

try:
    import tensorflow as tf
except ImportError:
    pass

from streamlit.runtime.uploaded_file_manager import UploadedFile, UploadedFileRec
from streamlit.type_util import is_type

get_main_script_director = MagicMock(return_value=os.getcwd())


def get_hash(f):
    hasher = hashlib.new("md5")
    ch = _CacheFuncHasher(MagicMock())
    ch.update(hasher, f)
    return hasher.digest()


class HashTest(unittest.TestCase):
    def test_string(self):
        self.assertEqual(get_hash("hello"), get_hash("hello"))
        self.assertNotEqual(get_hash("hello"), get_hash("hellö"))

    def test_int(self):
        self.assertEqual(get_hash(145757624235), get_hash(145757624235))
        self.assertNotEqual(get_hash(10), get_hash(11))
        self.assertNotEqual(get_hash(-1), get_hash(1))
        self.assertNotEqual(get_hash(2**7), get_hash(2**7 - 1))
        self.assertNotEqual(get_hash(2**7), get_hash(2**7 + 1))

    def test_uuid(self):
        uuid1 = uuid.uuid4()
        uuid1_copy = uuid.UUID(uuid1.hex)
        uuid2 = uuid.uuid4()

        # Our hashing functionality should work with UUIDs
        # regardless of UUID factory function.

        uuid3 = uuid.uuid5(uuid.NAMESPACE_DNS, "streamlit.io")
        uuid3_copy = uuid.UUID(uuid3.hex)
        uuid4 = uuid.uuid5(uuid.NAMESPACE_DNS, "snowflake.com")

        self.assertEqual(get_hash(uuid1), get_hash(uuid1_copy))
        self.assertNotEqual(id(uuid1), id(uuid1_copy))
        self.assertNotEqual(get_hash(uuid1), get_hash(uuid2))

        self.assertEqual(get_hash(uuid3), get_hash(uuid3_copy))
        self.assertNotEqual(id(uuid3), id(uuid3_copy))
        self.assertNotEqual(get_hash(uuid3), get_hash(uuid4))

    def test_mocks_do_not_result_in_infinite_recursion(self):
        try:
            get_hash(Mock())
            get_hash(MagicMock())
        except BaseException:
            self.fail("get_hash raised an exception")

    def test_list(self):
        self.assertEqual(get_hash([1, 2]), get_hash([1, 2]))
        self.assertNotEqual(get_hash([1, 2]), get_hash([2, 2]))
        self.assertNotEqual(get_hash([1]), get_hash(1))

        # test that we can hash self-referencing lists
        a = [1, 2, 3]
        a.append(a)
        b = [1, 2, 3]
        b.append(b)
        self.assertEqual(get_hash(a), get_hash(b))

    def test_tuple(self):
        self.assertEqual(get_hash((1, 2)), get_hash((1, 2)))
        self.assertNotEqual(get_hash((1, 2)), get_hash((2, 2)))
        self.assertNotEqual(get_hash((1,)), get_hash(1))
        self.assertNotEqual(get_hash((1,)), get_hash([1]))

    def test_mappingproxy(self):
        a = types.MappingProxyType({"a": 1})
        b = types.MappingProxyType({"a": 1})
        c = types.MappingProxyType({"c": 1})

        self.assertEqual(get_hash(a), get_hash(b))
        self.assertNotEqual(get_hash(a), get_hash(c))

    def test_dict_items(self):
        a = types.MappingProxyType({"a": 1}).items()
        b = types.MappingProxyType({"a": 1}).items()
        c = types.MappingProxyType({"c": 1}).items()

        assert is_type(a, "builtins.dict_items")
        self.assertEqual(get_hash(a), get_hash(b))
        self.assertNotEqual(get_hash(a), get_hash(c))

    def test_getset_descriptor(self):
        class A:
            x = 1

        class B:
            x = 1

        a = A.__dict__["__dict__"]
        b = B.__dict__["__dict__"]
        assert is_type(a, "builtins.getset_descriptor")

        self.assertEqual(get_hash(a), get_hash(a))
        self.assertNotEqual(get_hash(a), get_hash(b))

    def test_dict(self):
        self.assertEqual(get_hash({1: 1}), get_hash({1: 1}))
        self.assertNotEqual(get_hash({1: 1}), get_hash({1: 2}))
        self.assertNotEqual(get_hash({1: 1}), get_hash([(1, 1)]))

        dict_gen = {1: (x for x in range(1))}
        with self.assertRaises(UnhashableTypeError):
            get_hash(dict_gen)

    def test_self_reference_dict(self):
        d1 = {"cat": "hat"}
        d2 = {"things": [1, 2]}

        self.assertEqual(get_hash(d1), get_hash(d1))
        self.assertNotEqual(get_hash(d1), get_hash(d2))

        # test that we can hash self-referencing dictionaries
        d2 = {"book": d1}
        self.assertNotEqual(get_hash(d2), get_hash(d1))

    def test_float(self):
        self.assertEqual(get_hash(0.1), get_hash(0.1))
        self.assertNotEqual(get_hash(23.5234), get_hash(23.5235))

    def test_bool(self):
        self.assertEqual(get_hash(True), get_hash(True))
        self.assertNotEqual(get_hash(True), get_hash(False))

    def test_none(self):
        self.assertEqual(get_hash(None), get_hash(None))
        self.assertNotEqual(get_hash(None), get_hash(False))

    def test_builtins(self):
        self.assertEqual(get_hash(abs), get_hash(abs))
        self.assertNotEqual(get_hash(abs), get_hash(type))

    def test_regex(self):
        p2 = re.compile(".*")
        p1 = re.compile(".*")
        p3 = re.compile(".*", re.I)
        self.assertEqual(get_hash(p1), get_hash(p2))
        self.assertNotEqual(get_hash(p1), get_hash(p3))

    def test_pandas_dataframe(self):
        df1 = pd.DataFrame({"foo": [12]})
        df2 = pd.DataFrame({"foo": [42]})
        df3 = pd.DataFrame({"foo": [12]})

        self.assertEqual(get_hash(df1), get_hash(df3))
        self.assertNotEqual(get_hash(df1), get_hash(df2))

        df4 = pd.DataFrame(np.zeros((_PANDAS_ROWS_LARGE, 4)), columns=list("ABCD"))
        df5 = pd.DataFrame(np.zeros((_PANDAS_ROWS_LARGE, 4)), columns=list("ABCD"))

        self.assertEqual(get_hash(df4), get_hash(df5))

    def test_pandas_series(self):
        series1 = pd.Series([1, 2])
        series2 = pd.Series([1, 3])
        series3 = pd.Series([1, 2])

        self.assertEqual(get_hash(series1), get_hash(series3))
        self.assertNotEqual(get_hash(series1), get_hash(series2))

        series4 = pd.Series(range(_PANDAS_ROWS_LARGE))
        series5 = pd.Series(range(_PANDAS_ROWS_LARGE))

        self.assertEqual(get_hash(series4), get_hash(series5))

    def test_numpy(self):
        np1 = np.zeros(10)
        np2 = np.zeros(11)
        np3 = np.zeros(10)

        self.assertEqual(get_hash(np1), get_hash(np3))
        self.assertNotEqual(get_hash(np1), get_hash(np2))

        np4 = np.zeros(_NP_SIZE_LARGE)
        np5 = np.zeros(_NP_SIZE_LARGE)

        self.assertEqual(get_hash(np4), get_hash(np5))

    def test_PIL_image(self):
        im1 = Image.new("RGB", (50, 50), (220, 20, 60))
        im2 = Image.new("RGB", (50, 50), (30, 144, 255))
        im3 = Image.new("RGB", (50, 50), (220, 20, 60))

        self.assertEqual(get_hash(im1), get_hash(im3))
        self.assertNotEqual(get_hash(im1), get_hash(im2))

        # Check for big PIL images, they converted to numpy array with size
        # bigger than _NP_SIZE_LARGE
        # 1000 * 1000 * 3 = 3_000_000 > _NP_SIZE_LARGE = 1_000_000
        im4 = Image.new("RGB", (1000, 1000), (100, 20, 60))
        im5 = Image.new("RGB", (1000, 1000), (100, 20, 60))
        im6 = Image.new("RGB", (1000, 1000), (101, 21, 61))

        im4_np_array = np.frombuffer(im4.tobytes(), dtype="uint8")
        self.assertGreater(im4_np_array.size, _NP_SIZE_LARGE)

        self.assertEqual(get_hash(im4), get_hash(im5))
        self.assertNotEqual(get_hash(im5), get_hash(im6))

    @parameterized.expand(
        [
            (BytesIO, b"123", b"456", b"123"),
            (StringIO, "123", "456", "123"),
            (
                UploadedFile,
                UploadedFileRec(0, "name", "type", b"123"),
                UploadedFileRec(0, "name", "type", b"456"),
                UploadedFileRec(0, "name", "type", b"123"),
            ),
        ]
    )
    def test_io(self, io_type, io_data1, io_data2, io_data3):
        io1 = io_type(io_data1)
        io2 = io_type(io_data2)
        io3 = io_type(io_data3)

        self.assertEqual(get_hash(io1), get_hash(io3))
        self.assertNotEqual(get_hash(io1), get_hash(io2))

        # Changing the stream position should change the hash
        io1.seek(1)
        io3.seek(0)
        self.assertNotEqual(get_hash(io1), get_hash(io3))

    def test_partial(self):
        p1 = functools.partial(int, base=2)
        p2 = functools.partial(int, base=3)
        p3 = functools.partial(int, base=2)

        self.assertEqual(get_hash(p1), get_hash(p3))
        self.assertNotEqual(get_hash(p1), get_hash(p2))

    def test_files(self):
        temp1 = tempfile.NamedTemporaryFile()
        temp2 = tempfile.NamedTemporaryFile()

        with open(__file__, "r") as f:
            with open(__file__, "r") as g:
                self.assertEqual(get_hash(f), get_hash(g))

            self.assertNotEqual(get_hash(f), get_hash(temp1))

        self.assertEqual(get_hash(temp1), get_hash(temp1))
        self.assertNotEqual(get_hash(temp1), get_hash(temp2))

    def test_file_position(self):
        with open(__file__, "r") as f:
            h1 = get_hash(f)
            self.assertEqual(h1, get_hash(f))
            f.readline()
            self.assertNotEqual(h1, get_hash(f))
            f.seek(0)
            self.assertEqual(h1, get_hash(f))

    def test_magic_mock(self):
        """MagicMocks never hash to the same thing."""
        # (This also tests that MagicMock can hash at all, without blowing the
        # stack due to an infinite recursion.)
        self.assertNotEqual(get_hash(MagicMock()), get_hash(MagicMock()))

    def test_dataclass(self):
        @dataclass(frozen=True, eq=True)
        class Data:
            foo: str

        bar = Data("bar")

        assert get_hash(bar)

    def test_enum(self):
        """The hashing function returns the same result when called with the same
        Enum members."""

        class EnumClass(Enum):
            ENUM_1 = auto()
            ENUM_2 = auto()

        # Hash values should be stable
        self.assertEqual(get_hash(EnumClass.ENUM_1), get_hash(EnumClass.ENUM_1))

        # Different enum values should produce different hashes
        self.assertNotEqual(get_hash(EnumClass.ENUM_1), get_hash(EnumClass.ENUM_2))

    def test_different_enums(self):
        """Different enum classes should have different hashes, even when the enum
        values are the same."""

        class EnumClassA(Enum):
            ENUM_1 = "hello"

        class EnumClassB(Enum):
            ENUM_1 = "hello"

        enum_a = EnumClassA.ENUM_1
        enum_b = EnumClassB.ENUM_1

        self.assertNotEqual(get_hash(enum_a), get_hash(enum_b))


class NotHashableTest(unittest.TestCase):
    """Tests for various unhashable types. Many of these types *are*
    hashable by @st.cache's hasher, and we're explicitly removing support for
    them.
    """

    def _build_cffi(self, name):
        ffibuilder = cffi.FFI()
        ffibuilder.set_source(
            "cffi_bin._%s" % name,
            r"""
                static int %s(int x)
                {
                    return x + "A";
                }
            """
            % name,
        )

        ffibuilder.cdef("int %s(int);" % name)
        ffibuilder.compile(verbose=True)

    def test_compiled_ffi_not_hashable(self):
        self._build_cffi("foo")
        from cffi_bin._foo import ffi as foo

        with self.assertRaises(UnhashableTypeError):
            get_hash(foo)

    def test_lambdas_not_hashable(self):
        with self.assertRaises(UnhashableTypeError):
            get_hash(lambda x: x.lower())

    def test_generator_not_hashable(self):
        with self.assertRaises(UnhashableTypeError):
            get_hash((x for x in range(1)))

    def test_function_not_hashable(self):
        def foo():
            pass

        with self.assertRaises(UnhashableTypeError):
            get_hash(foo)

    def test_reduce_not_hashable(self):
        class A:
            def __init__(self):
                self.x = [1, 2, 3]

        with self.assertRaises(UnhashableTypeError):
            get_hash(A().__reduce__())
