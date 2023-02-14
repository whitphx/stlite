import sys
from pathlib import Path
from unittest.mock import Mock

HERE = Path(__file__).parent.resolve()
REPO_ROOT = HERE / "../../../.."

STREAMLIT_SUBMODULE = REPO_ROOT / "streamlit"
STREAMLIT_PYTHONPATH = STREAMLIT_SUBMODULE / "lib"
sys.path.insert(0, str(STREAMLIT_PYTHONPATH))

TORNADO_SUBMODULE = HERE / "../../tornado"
TORNADO_PYTHONPATH = TORNADO_SUBMODULE
sys.path.insert(0, str(TORNADO_PYTHONPATH))

PYARROW_DIR = HERE / "../../stlite-pyarrow"
PYARROW_PYTHONPATH = PYARROW_DIR
sys.path.insert(0, str(PYARROW_PYTHONPATH))

sys.modules["pyodide"] = Mock()
sys.modules["pyodide.ffi"] = Mock()
