import sys
from pathlib import Path
from unittest.mock import MagicMock

HERE = Path(__file__).parent.resolve()
REPO_ROOT = HERE / "../../../.."

STREAMLIT_SUBMODULE = REPO_ROOT / "streamlit"
STREAMLIT_PYTHONPATH = STREAMLIT_SUBMODULE / "lib"
sys.path.insert(0, str(STREAMLIT_PYTHONPATH))

sys.modules["pyodide"] = MagicMock()
sys.modules["pyodide.ffi"] = MagicMock()
