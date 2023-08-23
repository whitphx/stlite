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

import unittest
from unittest.mock import patch

from git.exc import InvalidGitRepositoryError

from streamlit.git_util import GITHUB_HTTP_URL, GITHUB_SSH_URL, GitRepo


class GitUtilTest(unittest.TestCase):
    def test_https_url_check(self):
        # standard https url with and without .git
        self.assertRegex("https://github.com/username/repo.git", GITHUB_HTTP_URL)
        self.assertRegex("https://github.com/username/repo", GITHUB_HTTP_URL)

        # with www with and without .git
        self.assertRegex("https://www.github.com/username/repo.git", GITHUB_HTTP_URL)
        self.assertRegex("https://www.github.com/username/repo", GITHUB_HTTP_URL)

        # not http
        self.assertNotRegex("http://www.github.com/username/repo.git", GITHUB_HTTP_URL)

    def test_ssh_url_check(self):
        # standard ssh url
        self.assertRegex("git@github.com:username/repo.git", GITHUB_SSH_URL)

        # no .git
        self.assertRegex("git@github.com:username/repo", GITHUB_SSH_URL)

    def test_git_repo_invalid(self):
        with patch("git.Repo") as mock:
            mock.side_effect = InvalidGitRepositoryError("Not a git repo")
            repo = GitRepo(".")
            self.assertFalse(repo.is_valid())

    def test_old_git_version(self):
        """If the installed git is older than 2.7, certain repo operations
        prompt the user for credentials. We don't want to do this, so
        repo.is_valid() returns False for old gits.
        """
        with patch("git.repo.base.Repo.GitCommandWrapperType") as git_mock, patch(
            "streamlit.git_util.os"
        ):
            git_mock.return_value.version_info = (1, 6, 4)  # An old git version
            repo = GitRepo(".")
            self.assertFalse(repo.is_valid())
            self.assertEqual((1, 6, 4), repo.git_version)

    def test_git_repo_valid(self):
        with patch("git.repo.base.Repo.GitCommandWrapperType") as git_mock, patch(
            "streamlit.git_util.os"
        ):
            git_mock.return_value.version_info = (2, 20, 3)  # A recent git version
            repo = GitRepo(".")
            self.assertTrue(repo.is_valid())
            self.assertEqual((2, 20, 3), repo.git_version)

    def test_gitpython_not_installed(self):
        with patch.dict("sys.modules", {"git": None}):
            repo = GitRepo(".")
            self.assertFalse(repo.is_valid())
