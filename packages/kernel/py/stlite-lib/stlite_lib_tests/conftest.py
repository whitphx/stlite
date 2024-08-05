import sys
from unittest.mock import MagicMock

sys.modules["pyodide"] = MagicMock()
sys.modules["pyodide.ffi"] = MagicMock()
