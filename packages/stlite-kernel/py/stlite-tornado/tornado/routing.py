# Copyright 2015 The Tornado Authors
# Copyright 2022 Yuichiro Tachibana
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

from typing import Any, Union, Optional, Awaitable, List, Dict, Pattern, Tuple, overload


# _RuleList can either contain pre-constructed Rules or a sequence of
# arguments to be passed to the Rule constructor.
_RuleList = List[
    Union[
        "Rule",
        List[Any],  # Can't do detailed typechecking of lists.
        Tuple[Union[str, "Matcher"], Any],
        Tuple[Union[str, "Matcher"], Any, Dict[str, Any]],
        Tuple[Union[str, "Matcher"], Any, Dict[str, Any], str],
    ]
]
