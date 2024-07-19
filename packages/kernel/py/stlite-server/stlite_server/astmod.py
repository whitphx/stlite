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

        self.imported_modules = dict()
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

            self.imported_modules[alias.name] = alias.asname or alias.name
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
            for target in self.targets:
                if called_func.id == target.method_imported_name:
                    return self._visit_target_call(node, target)
        if (
            type(called_func) is ast.Attribute
            and type(called_func.value) is ast.Name
            and isinstance(called_func.value.ctx, ast.Load)
        ):
            module = called_func.value.id
            method = called_func.attr
            for target in self.targets:
                if module == target.module_imported_name and method == target.method:
                    return self._visit_target_call(node, target)

        return node

    def _visit_target_call(self, node: ast.Call, target: Target) -> ast.Call:
        if target.module == "time" and target.method == "sleep":
            if "asyncio" in self.imported_modules:
                asyncio_imported_module_name = self.imported_modules["asyncio"]
            else:
                asyncio_imported_module_name = "asyncio"
                self.required_imports.add("asyncio")
            return ast.Await(
                value=ast.Call(
                    func=ast.Attribute(
                        value=ast.Name(id=asyncio_imported_module_name, ctx=ast.Load()),
                        attr="sleep",
                        ctx=ast.Load(),
                    ),
                    args=node.args,
                    keywords=node.keywords,
                )
            )
        elif target.module == "streamlit" and target.method == "write_stream":
            if "streamlit" in self.imported_modules:
                st_imported_module_name = self.imported_modules["streamlit"]
            else:
                st_imported_module_name = "streamlit"
                self.required_imports.add("streamlit")
            return ast.Await(
                value=ast.Call(
                    func=ast.Attribute(
                        value=ast.Name(id=st_imported_module_name, ctx=ast.Load()),
                        attr="write_stream",
                        ctx=ast.Load(),
                    ),
                    args=node.args,
                    keywords=node.keywords,
                )
            )
