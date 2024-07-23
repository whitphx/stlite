import ast
from enum import Enum
from typing import Self


def patch(code: str | ast.Module, script_path: str) -> ast.Module:
    if isinstance(code, str):
        tree = ast.parse(code, script_path, "exec")
    elif isinstance(code, ast.Module):
        tree = code
    else:
        raise ValueError("code must be a string or an ast.Module")

    tree = ast.fix_missing_locations(NodeTransformer().transform(tree))

    return tree


class ResolvedNameType(Enum):
    DELETED = 1


class Scope:
    def __init__(self, name: str, parent: Self | None = None) -> None:
        self.bindings: dict[str, str | ResolvedNameType] = dict()
        self.name: str = parent.name + "." + name if parent else name
        self.parent = parent

    def add_binding(self, name: str, fully_qualified_name: str) -> None:
        self.bindings[name] = fully_qualified_name

    def delete_binding(self, name: str) -> None:
        self.bindings[name] = ResolvedNameType.DELETED

    def resolve_name(self, name: str) -> str | None:
        name_in_scope = self.bindings.get(name)
        if name_in_scope is ResolvedNameType.DELETED:
            return None
        elif name_in_scope:
            return name_in_scope

        if self.parent:
            return self.parent.resolve_name(name)
        return None


class ScopeStack:
    def __init__(self) -> None:
        self.scopes: list[Scope] = [Scope(name="__main__")]

    def push(self, name: str) -> None:
        scope = Scope(name=name, parent=self.scopes[-1])
        self.scopes.append(scope)

    def pop(self) -> None:
        self.scopes.pop()

    def get_scope_name(self) -> str:
        return self.scopes[-1].name

    def add_binding(self, name: str, fully_qualified_name: str) -> None:
        self.scopes[-1].add_binding(name, fully_qualified_name)

    def add_local_binding(self, name: str) -> None:
        self.scopes[-1].add_binding(name, self.get_scope_name() + "." + name)

    def delete_binding(self, name: str) -> None:
        self.scopes[-1].delete_binding(name)

    def resolve_name(self, name: str) -> str | None:
        return self.scopes[-1].resolve_name(name)


class NodeTransformer(ast.NodeTransformer):
    def __init__(self) -> None:
        super().__init__()

        self.scope_stack = ScopeStack()

        self.imported_modules: dict[str, str] = dict()
        self.required_imports: set[tuple[str, str]] = set()

        self.invalidated_names: set[str] = set()

        self.targets = {
            "time.sleep",
            "streamlit.write_stream",
        }

    def transform(self, tree: ast.Module) -> ast.Module:
        new_tree = self.visit(tree)

        _insert_import_statement(new_tree, self.required_imports)

        return new_tree

    def visit_Import(self, node: ast.Import) -> ast.Import:
        for alias in node.names:
            # Example:
            # `import streamlit`: alias.name = "streamlit", alias.asname = None
            # `import streamlit as st`: alias.name = "streamlit", alias.asname = "st"
            name = alias.asname or alias.name.split(".")[0]
            self.scope_stack.add_binding(name, alias.name)

            self.imported_modules[alias.name] = alias.asname or alias.name
        return node

    def visit_ImportFrom(self, node: ast.ImportFrom) -> ast.ImportFrom:
        for alias in node.names:
            # Example:
            # `from time import sleep`: node.module = "time", alias.name = "sleep", alias.asname = None
            # `from time import sleep as ts`: node.module = "time", alias.name = "sleep", alias.asname = "ts"
            if node.module:
                if alias.name == "*":
                    # TODO:
                    if node.module == "streamlit":
                        self.scope_stack.add_binding(
                            "write_stream", "streamlit.write_stream"
                        )
                    if node.module == "time":
                        self.scope_stack.add_binding("sleep", "time.sleep")
                else:
                    name = alias.asname or alias.name
                    self.scope_stack.add_binding(name, node.module + "." + alias.name)
        return node

    def visit_Call(self, node: ast.Call) -> ast.AST:
        called_func = node.func
        func_fully_qual_name = None
        if type(called_func) is ast.Name:
            func_name = called_func.id
            func_fully_qual_name = self.scope_stack.resolve_name(func_name)
        elif (
            type(called_func) is ast.Attribute
            and type(called_func.value) is ast.Name
            and isinstance(called_func.value.ctx, ast.Load)
        ):
            module = called_func.value.id
            method = called_func.attr
            mod_first_segment, *mod_rest_segments = module.split(".")
            if mod_first_segment_full_name := self.scope_stack.resolve_name(
                mod_first_segment
            ):
                module_full_name = ".".join(
                    [mod_first_segment_full_name, *mod_rest_segments]
                )
                func_fully_qual_name = module_full_name + "." + method

        if func_fully_qual_name is None:
            return node

        for target in self.targets:
            if (
                target == func_fully_qual_name
                and func_fully_qual_name not in self.invalidated_names
            ):
                return self._visit_target_call(node, target)

        return node

    def _visit_target_call(self, node: ast.Call, target: str) -> ast.AST:
        if target == "time.sleep":
            # Convert the node to `await asyncio.sleep(...)`
            if "asyncio" in self.imported_modules:
                asyncio_as_name = self.imported_modules["asyncio"]
            else:
                asyncio_as_name = "__asyncio__"
                self.required_imports.add(("asyncio", asyncio_as_name))
            return ast.Await(
                value=ast.Call(
                    func=ast.Attribute(
                        value=ast.Name(id=asyncio_as_name, ctx=ast.Load()),
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
                streamlit_as_name = self.imported_modules["streamlit"]
            else:
                streamlit_as_name = "streamlit"
                self.required_imports.add(("streamlit", streamlit_as_name))
            return ast.Await(
                value=ast.Call(
                    func=ast.Attribute(
                        value=ast.Name(id=streamlit_as_name, ctx=ast.Load()),
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
    def _bind_name(self, target: ast.expr, bound_to: str | None = None) -> None:
        # Handle ast.expr subtypes that can appear in assignment context (see https://docs.python.org/3/library/ast.html#abstract-grammar)
        if isinstance(target, ast.Name):
            name = target.id
            if bound_to:
                self.scope_stack.add_binding(name, bound_to)
            else:
                self.scope_stack.add_local_binding(name)
        elif isinstance(target, ast.Tuple):
            for elt in target.elts:
                self._bind_name(elt, bound_to)
        elif isinstance(target, ast.List):
            for elt in target.elts:
                self._bind_name(elt, bound_to)
        elif isinstance(target, ast.Starred):
            self._bind_name(target.value, bound_to)
        elif isinstance(target, ast.Attribute):
            if isinstance(target.value, ast.Name):
                invalidated_name = target.value.id + "." + target.attr
                self.invalidated_names.add(invalidated_name)
        elif isinstance(target, ast.Subscript):
            # The `a[b] = c` doesn't matter for the purpose of this visitor
            pass

    def visit_FunctionDef(self, node: ast.FunctionDef) -> ast.AST:
        self.scope_stack.add_local_binding(node.name)

        # FunctionDef can't have await, so stop the traversal by not calling generic_visit().
        # TODO: Convert sync function to async function
        return node

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> ast.AST:
        self.scope_stack.add_local_binding(node.name)

        self.scope_stack.push(node.name)

        for arg in node.args.args:
            self.scope_stack.add_local_binding(arg.arg)
        for arg in node.args.kwonlyargs:
            self.scope_stack.add_local_binding(arg.arg)
        for arg in node.args.posonlyargs:
            self.scope_stack.add_local_binding(arg.arg)
        if node.args.vararg:
            self.scope_stack.add_local_binding(
                node.args.vararg.arg,
            )
        if node.args.kwarg:
            self.scope_stack.add_local_binding(
                node.args.kwarg.arg,
            )

        self.generic_visit(node)

        self.scope_stack.pop()

        return node

    def visit_ClassDef(self, node: ast.ClassDef) -> ast.AST:
        self.scope_stack.add_local_binding(node.name)

        self.scope_stack.push(node.name)

        self.generic_visit(node)

        self.scope_stack.pop()

        return node

    def visit_Delete(self, node: ast.Delete) -> ast.AST:
        for target in node.targets:
            if isinstance(target, ast.Name):
                self.scope_stack.delete_binding(target.id)

        self.generic_visit(node)
        return node

    def visit_Assign(self, node: ast.Assign) -> ast.AST:
        resolved_name = (
            self.scope_stack.resolve_name(node.value.id)
            if isinstance(node.value, ast.Name)
            else None
        )
        for assign_target in node.targets:
            self._bind_name(assign_target, bound_to=resolved_name)

        self.generic_visit(node)
        return node

    def visit_TypeAlias(self, node: ast.TypeAlias) -> ast.AST:
        self._bind_name(node.name)

        self.generic_visit(node)
        return node

    def visit_AugAssign(self, node: ast.AugAssign) -> ast.AST:
        self._bind_name(node.target)

        self.generic_visit(node)
        return node

    def visit_AnnAssign(self, node: ast.AnnAssign) -> ast.AST:
        self._bind_name(node.target)

        self.generic_visit(node)
        return node

    def visit_For(self, node: ast.For) -> ast.AST:
        self._bind_name(node.target)

        self.generic_visit(node)
        return node

    def visit_AsyncFor(self, node: ast.AsyncFor) -> ast.AST:
        self._bind_name(node.target)

        self.generic_visit(node)
        return node

    def visit_withitem(self, node: ast.withitem) -> ast.AST:
        if node.optional_vars:
            self._bind_name(node.optional_vars)

        self.generic_visit(node)
        return node

    def visit_NamedExpr(self, node: ast.NamedExpr) -> ast.AST:
        self._bind_name(node.target)

        self.generic_visit(node)
        return node


def _insert_import_statement(
    tree: ast.Module, module_names: set[tuple[str, str]]
) -> None:
    """Insert an import statement of `module_names` at the top(ish) of the tree."""

    if not module_names:
        return

    import_node = ast.Import(
        names=[ast.alias(name=name, asname=asname) for name, asname in module_names]
    )

    # Search __future__ imports. If they exist, insert the import statement after them. If not, insert the import statement at the top.
    insert_index = 0
    for i, node in enumerate(tree.body):
        if isinstance(node, ast.ImportFrom) and node.module == "__future__":
            insert_index = i + 1

    tree.body.insert(insert_index, import_node)
