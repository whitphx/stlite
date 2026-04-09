import tomllib
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parent.parent.parent

def get_streamlit_version() -> str:
    pyproject_path = ROOT / "streamlit" / "lib" / "pyproject.toml"

    with open(pyproject_path, "rb") as f:
        data = tomllib.load(f)

    return data["project"]["version"]

if __name__ == "__main__":
    print(get_streamlit_version())
