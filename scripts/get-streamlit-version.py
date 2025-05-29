#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def get_streamlit_version():
    """Extract the Streamlit version from streamlit/lib/setup.py"""
    setup_py_path = Path(__file__).parent.parent / "streamlit" / "lib" / "setup.py"
    
    with open(setup_py_path, 'r') as f:
        content = f.read()
    
    match = re.search(r'VERSION = "([^"]+)"', content)
    if not match:
        raise ValueError("Could not find VERSION in streamlit/lib/setup.py")
    
    return match.group(1)

if __name__ == "__main__":
    print(get_streamlit_version())
