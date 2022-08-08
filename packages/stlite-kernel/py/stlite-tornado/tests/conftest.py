import sys
from pathlib import Path
from unittest.mock import Mock


HERE = Path(__file__).parent.resolve()
REPO_ROOT = HERE.parent.parent.parent.parent.parent
STREAMLIT_SUBMODULE = REPO_ROOT / "streamlit"
STREAMLIT_PYTHONPATH = STREAMLIT_SUBMODULE / "lib"
sys.path.insert(0, str(STREAMLIT_PYTHONPATH))


pyodide = Mock()
sys.modules["pyodide"] = pyodide
