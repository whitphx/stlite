import ast
from dataclasses import dataclass


def patch(code: str | ast.Module, script_path: str) -> ast.Module:
    if isinstance(code, str):
        tree = ast.parse(code, script_path, "exec")
    elif isinstance(code, ast.Module):
        tree = code
    else:
        raise ValueError("code must be a string or an ast.Module")

    tree = ast.fix_missing_locations(NodeTransformer().transform(tree))

    return tree


@dataclass
class Target:
    module: str
    method: str
    module_imported_name: str | None
    method_imported_name: str | None


class NodeTransformer(ast.NodeTransformer):
    def __init__(self) -> None:
        super().__init__()

        self.appeared_imports = set()
        self.required_imports = set()

        self.targets = [
            Target(
                module="streamlit",
                method="write_stream",
                module_imported_name=None,
                method_imported_name=None,
            ),
            Target(
                module="time",
                method="sleep",
                module_imported_name=None,
                method_imported_name=None,
            ),
        ]

    def _get_module_imported_name(self, original_module_name: str) -> str | None:
        for target in self.targets:
            if target.module == original_module_name:
                return target.module_imported_name

    def _get_method_imported_name(
        self, original_module_name: str, original_method_name: str
    ) -> str | None:
        for target in self.targets:
            if (
                target.module == original_module_name
                and target.method == original_method_name
            ):
                return target.method_imported_name

    def transform(self, tree: ast.Module) -> ast.Module:
        new_tree = self.visit(tree)

        for import_name in self.required_imports:
            import_node = ast.Import(names=[ast.alias(name=import_name, asname=None)])
            new_tree.body.insert(0, import_node)

        return new_tree

    def visit_Import(self, node: ast.Import) -> ast.Import:
        for alias in node.names:
            # Example:
            # `import streamlit`: alias.name = "streamlit", alias.asname = None
            # `import streamlit as st`: alias.name = "streamlit", alias.asname = "st"
            for target in self.targets:
                if alias.name == target.module:
                    target.module_imported_name = alias.asname or alias.name

            self.appeared_imports.add(alias.name)
        return node

    def visit_ImportFrom(self, node: ast.ImportFrom) -> ast.ImportFrom:
        for alias in node.names:
            # Example:
            # `from time import sleep`: node.module = "time", alias.name = "sleep", alias.asname = None
            # `from time import sleep as ts`: node.module = "time", alias.name = "sleep", alias.asname = "ts"
            for target in self.targets:
                if node.module == target.module and alias.name == target.method:
                    target.method_imported_name = alias.asname or alias.name
        return node

    def visit_Call(self, node: ast.Call) -> ast.Call:
        called_func = node.func
        if type(called_func) is ast.Name:
            if called_func.id == self._get_method_imported_name("time", "sleep"):
                # `time.sleep()` -> `await asyncio.sleep()`
                node.func = ast.Attribute(
                    value=ast.Name(id="asyncio", ctx=ast.Load()),
                    attr="sleep",
                    ctx=ast.Load(),
                )
                node = ast.Await(value=node)
                if "asyncio" not in self.appeared_imports:
                    self.required_imports.add("asyncio")
        if (
            type(called_func) is ast.Attribute
            and type(called_func.value) is ast.Name
            and isinstance(called_func.value.ctx, ast.Load)
        ):
            module = called_func.value.id
            method = called_func.attr
            if (module, method) == (
                self._get_module_imported_name("streamlit"),
                "write_stream",
            ):
                # `st.write_stream()` -> `await st.write_stream()`
                node = ast.Await(value=node)
            elif (module, method) == (
                self._get_module_imported_name("time"),
                "sleep",
            ):
                # `time.sleep()` -> `await asyncio.sleep()`
                called_func.value.id = "asyncio"
                called_func.attr = "sleep"
                node = ast.Await(value=node)
                if "asyncio" not in self.appeared_imports:
                    self.required_imports.add("asyncio")

        return node
