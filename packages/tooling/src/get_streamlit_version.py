import ast
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parent.parent.parent

def parse_version_from_ast(tree: ast.AST) -> str:
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "VERSION":
                    if isinstance(node.value, ast.Constant):
                        return node.value.value

    raise ValueError("Could not find VERSION in setup.py")

def get_streamlit_version() -> str:
    setup_py_path = ROOT / "streamlit" / "lib" / "setup.py"

    with open(setup_py_path, "r") as f:
        tree = ast.parse(f.read())

    return parse_version_from_ast(tree)

if __name__ == "__main__":
    print(get_streamlit_version())
