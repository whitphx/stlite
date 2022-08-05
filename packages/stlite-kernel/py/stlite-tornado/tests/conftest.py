import sys
from unittest.mock import Mock


pyodide = Mock()
sys.modules["pyodide"] = pyodide
