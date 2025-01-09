#!/usr/bin/env python3
"""Extract Streamlit version from setup.py for use in build process."""

import os
import re
import sys
from pathlib import Path

def get_streamlit_version():
    """Extract VERSION string from setup.py."""
    setup_py = Path(__file__).parent / "streamlit" / "lib" / "setup.py"
    
    if not setup_py.exists():
        print(f"Error: Could not find setup.py at {setup_py}", file=sys.stderr)
        sys.exit(1)
    
    try:
        content = setup_py.read_text()
        # Look for VERSION = "x.y.z" pattern
        match = re.search(r'VERSION\s*=\s*["\']([^"\']+)["\']', content)
        if match:
            return match.group(1)
        else:
            print("Error: Could not find VERSION in setup.py", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"Error reading setup.py: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    version = get_streamlit_version()
    print(version)
