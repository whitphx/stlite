import ast
from _ast import NamedExpr
from typing import Any


def patch(code: str | ast.Module, script_path: str) -> ast.Module:
    if isinstance(code, str):
        tree = ast.parse(code, script_path, "exec")
    elif isinstance(code, ast.Module):
        tree = code
    else:
        raise ValueError("code must be a string or an ast.Module")

    tree = ast.fix_missing_locations(NodeTransformer().transform(tree))

    return tree


class NodeTransformer(ast.NodeTransformer):
    def __init__(self) -> None:
        super().__init__()

        self.imported_modules: dict[str, str] = dict()
        self.required_imports: set[str] = set()

        self.names: dict[str, str] = {}  # name -> fully qualified name

        self.targets = [
            "time.sleep",
            "streamlit.write_stream",
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
            name = alias.asname or alias.name.split(".")[0]
            self.names[name] = alias.name

            self.imported_modules[alias.name] = alias.asname or alias.name
        return node

    def visit_ImportFrom(self, node: ast.ImportFrom) -> ast.ImportFrom:
        for alias in node.names:
            # Example:
            # `from time import sleep`: node.module = "time", alias.name = "sleep", alias.asname = None
            # `from time import sleep as ts`: node.module = "time", alias.name = "sleep", alias.asname = "ts"
            name = alias.asname or alias.name
            self.names[name] = node.module + "." + alias.name
        return node

    def visit_Call(self, node: ast.Call) -> ast.AST:
        called_func = node.func
        if type(called_func) is ast.Name:
            func_name = called_func.id
            func_fully_qual_name = self.names.get(func_name)
        elif (
            type(called_func) is ast.Attribute
            and type(called_func.value) is ast.Name
            and isinstance(called_func.value.ctx, ast.Load)
        ):
            module = called_func.value.id
            method = called_func.attr
            top_level_module, *rest_modules = module.split(".")
            top_level_module_full_name = self.names.get(top_level_module)
            module_full_name = ".".join([top_level_module_full_name, *rest_modules])
            func_fully_qual_name = module_full_name + "." + method
        else:
            return node

        for target in self.targets:
            if target == func_fully_qual_name:
                return self._visit_target_call(node, target)

        return node

    def _visit_target_call(self, node: ast.Call, target: str) -> ast.AST:
        if target == "time.sleep":
            # Convert the node to `await asyncio.sleep(...)`
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
        elif target == "streamlit.write_stream":
            # Convert the node to `await st.write_stream(...)`
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

        return node

    def visit_Lambda(self, node: ast.Lambda) -> ast.Lambda:
        # Lambda can't have await, so stop the traversal by not calling generic_visit().
        return node

    # Below are node visitor methods to capture name bindings
    def _register_name(self, node: ast.Name | ast.Tuple | ast.List) -> None:
        if isinstance(node, ast.Name):
            name = node.id
            self.names[name] = name
        elif isinstance(node, ast.Tuple):
            for elt in node.elts:
                self._register_name(elt)
        elif isinstance(node, ast.List):
            for elt in node.elts:
                self._register_name(elt)

    def visit_FunctionDef(self, node: ast.FunctionDef) -> Any:
        self.names[node.name] = node.name

        # FunctionDef can't have await, so stop the traversal by not calling generic_visit().
        # TODO: Convert sync function to async function
        return node

    def visit_AsyncFunctionDef(self, node: ast.ClassDef) -> Any:
        self.names[node.name] = node.name

        self.generic_visit(node)
        return node

    def visit_ClassDef(self, node: ast.ClassDef) -> Any:
        self.names[node.name] = node.name

        self.generic_visit(node)
        return node

    def visit_Delete(self, node: ast.Del) -> Any:
        for target in node.targets:
            if isinstance(target, ast.Name):
                del self.names[target.id]

        self.generic_visit(node)
        return node

    def visit_Assign(self, node: ast.Assign) -> Any:
        for assign_target in node.targets:
            self._register_name(assign_target)

        self.generic_visit(node)
        return node

    def visit_TypeAlias(self, node: ast.ClassDef) -> Any:
        self._register_name(node.name)

        self.generic_visit(node)
        return node

    def visit_AugAssign(self, node: ast.Assign) -> Any:
        self._register_name(node.target)

        self.generic_visit(node)
        return node

    def visit_AnnAssign(self, node: ast.AnnAssign) -> Any:
        self._register_name(node.target)

        self.generic_visit(node)
        return node

    def visit_For(self, node: ast.For) -> Any:
        self._register_name(node.target)

        self.generic_visit(node)
        return node

    def visit_AsyncFor(self, node: ast.For) -> Any:
        self._register_name(node.target)

        self.generic_visit(node)
        return node

    def visit_withitem(self, node: ast.withitem) -> Any:
        self._register_name(node.optional_vars)

        self.generic_visit(node)
        return node

    def visit_NamedExpr(self, node: NamedExpr) -> Any:
        self._register_name(node.target)

        self.generic_visit(node)
        return node
