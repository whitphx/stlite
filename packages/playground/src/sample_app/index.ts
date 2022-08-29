/* eslint-disable import/no-webpack-loader-syntax */

import streamlit_app_py from "!!raw-loader!./streamlit_app.py";
import page1_py from "!!raw-loader!./pages/page1.py";

const files: { [path: string]: string } = {
  "streamlit_app.py": streamlit_app_py,
  "pages/page1.py": page1_py,
}

export default files;
