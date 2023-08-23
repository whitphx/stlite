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

"""version unit test."""

import unittest
from unittest import mock

import requests_mock
from packaging.version import Version as PkgVersion

from streamlit import version
from streamlit.version import (
    PYPI_STREAMLIT_URL,
    _get_installed_streamlit_version,
    _get_latest_streamlit_version,
    should_show_new_version_notice,
)


class VersionTest(unittest.TestCase):
    def test_get_installed_streamlit_version(self):
        self.assertIsInstance(_get_installed_streamlit_version(), PkgVersion)

    def test_get_latest_streamlit_version(self):
        with requests_mock.mock() as m:
            m.get(PYPI_STREAMLIT_URL, json={"info": {"version": "1.2.3"}})
            self.assertEqual(PkgVersion("1.2.3"), _get_latest_streamlit_version())

    def test_should_show_new_version_notice_skip(self):
        with mock.patch(
            "streamlit.version._get_latest_streamlit_version"
        ) as get_latest:
            version.CHECK_PYPI_PROBABILITY = 0
            self.assertFalse(should_show_new_version_notice())
            get_latest.assert_not_called()

    def test_should_show_new_version_notice_outdated(self):
        with mock.patch(
            "streamlit.version._get_latest_streamlit_version"
        ) as get_latest, mock.patch(
            "streamlit.version._get_installed_streamlit_version"
        ) as get_installed:

            version.CHECK_PYPI_PROBABILITY = 1
            get_installed.side_effect = [PkgVersion("1.0.0")]
            get_latest.side_effect = [PkgVersion("1.2.3")]

            self.assertTrue(should_show_new_version_notice())
            get_installed.assert_called_once()
            get_latest.assert_called_once()

    def test_should_show_new_version_notice_uptodate(self):
        with mock.patch(
            "streamlit.version._get_latest_streamlit_version"
        ) as get_latest, mock.patch(
            "streamlit.version._get_installed_streamlit_version"
        ) as get_installed:

            version.CHECK_PYPI_PROBABILITY = 1
            get_installed.side_effect = [PkgVersion("1.2.3")]
            get_latest.side_effect = [PkgVersion("1.2.3")]

            self.assertFalse(should_show_new_version_notice())
            get_installed.assert_called_once()
            get_latest.assert_called_once()

    def test_should_show_new_version_notice_prerelease(self):
        with mock.patch(
            "streamlit.version._get_latest_streamlit_version"
        ) as get_latest, mock.patch(
            "streamlit.version._get_installed_streamlit_version"
        ) as get_installed:

            version.CHECK_PYPI_PROBABILITY = 1
            get_installed.side_effect = [PkgVersion("1.2.3")]
            get_latest.side_effect = [PkgVersion("1.0.0")]

            self.assertFalse(should_show_new_version_notice())
            get_installed.assert_called_once()
            get_latest.assert_called_once()

    def test_should_show_new_version_notice_error(self):
        with mock.patch(
            "streamlit.version._get_latest_streamlit_version"
        ) as get_latest, mock.patch(
            "streamlit.version._get_installed_streamlit_version"
        ) as get_installed:

            version.CHECK_PYPI_PROBABILITY = 1
            get_installed.side_effect = [PkgVersion("1.2.3")]
            get_latest.side_effect = RuntimeError("apocalypse!")

            self.assertFalse(should_show_new_version_notice())
            get_installed.assert_called_once()
            get_latest.assert_called_once()
