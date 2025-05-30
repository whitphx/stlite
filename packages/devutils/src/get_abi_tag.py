import pyodide

def get_pyodide_build_interpreter() -> str:
    # https://github.com/pyodide/pyodide-build/blob/3d95b522fb416a24dc860e23ff88e77cece506d8/pyodide_build/_py_compile.py#L45
    return "cp" + "".join(str(el) for el in pyodide.ffi.sys.version_info[:2])


def get_pyodide_build_abi_tag() -> str:
    # https://github.com/pyodide/pyodide-build/blob/3d95b522fb416a24dc860e23ff88e77cece506d8/pyodide_build/_py_compile.py#L48
    return get_pyodide_build_interpreter() + "-none-any"


if __name__ == "__main__":
    print(get_pyodide_build_abi_tag())
