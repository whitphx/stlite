## Streamlit Hello demo

This sample app is a copy of the `streamlit hello` demo.
The source files have been copied from https://github.com/streamlit/streamlit/tree/1.51.0/lib/streamlit/hello with some modifications.

- `animation_demo.py`
  - Added `time.sleep(1/30)` in the animation loop to allow event loop processing in the _Stlite_ environment.
- `dataframe_demo.py` has been modified as follows.
  - `agri.csv.gz` is pre-downloaded and provided as a local file because accessing remote files from the _Stlite_ environment has the CORS problem.
    - This file has been downloaded at 2022-10-14 02:24:56 (JST).

## License

As written above, the source files are copied from `https://github.com/streamlit/streamlit` with some modifications,
therefore, the license applied to the source, the Apache-2.0 license, is also applied to this sample as follows.

##### Apache-2.0 license

Copyright Streamlit Inc.

Copyright Yuichiro Tachibana

Licensed under the Apache License, Version 2.0 (the “License”);
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an “AS IS” BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

See https://github.com/streamlit/streamlit/blob/develop/LICENSE
