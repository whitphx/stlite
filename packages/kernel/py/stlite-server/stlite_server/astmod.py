import ast
from typing import Self


def patch(code: str | ast.Module, script_path: str) -> ast.Module:
    if isinstance(code, str):
        tree = ast.parse(code, script_path, "exec")
    elif isinstance(code, ast.Module):
        tree = code
    else:
        raise ValueError("code must be a string or an ast.Module")

    targets = {
        ("time", "sleep"),
        ("streamlit", "write_stream"),
    }
    nes_finder = NesFinder(tree, targets)
    tree = ast.fix_missing_locations(
        NodeTransformer(nes_finder=nes_finder, targets=targets).transform(tree)
    )

    return tree


type CodeBlockName = str


class CodeBlock:
    def __init__(self, name: str, parent: Self | None = None) -> None:
        self.name = name
        self.bound_names: set[str] = set()
        self.parent = parent

    def get_nearest_enclosing_scope(self, name: str) -> CodeBlockName | None:
        if name in self.bound_names:
            return self.name
        if self.parent:
            return self.parent.get_nearest_enclosing_scope(name)
        return None


class CodeBlockStack:
    def __init__(self) -> None:
        root_code_block = CodeBlock(name="__main__")
        self.stack = [root_code_block]
        self.code_blocks: dict[CodeBlockName, CodeBlock] = {
            root_code_block.name: root_code_block
        }

    def push(self, name: str) -> None:
        code_block = CodeBlock(
            name=self.get_current_code_block().name + "." + name,
            parent=self.get_current_code_block(),
        )
        self.stack.append(code_block)
        self.code_blocks[code_block.name] = code_block

    def pop(self) -> None:
        self.stack.pop()

    def get_current_code_block(self) -> CodeBlock:
        return self.stack[-1]

    def bind_name(self, name: str) -> None:
        self.get_current_code_block().bound_names.add(name)


class CodeBlockNameBindingVisitor(ast.NodeVisitor):
    def __init__(self, targets: set[tuple[str, str]]) -> None:
        super().__init__()

        self.code_block_stack = CodeBlockStack()

        self.wildcard_import_targets = targets

    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            # Example:
            # `import streamlit`: alias.name = "streamlit", alias.asname = None
            # `import streamlit as st`: alias.name = "streamlit", alias.asname = "st"
            name = alias.asname or alias.name.split(".")[0]
            self.code_block_stack.bind_name(name)

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        for alias in node.names:
            # Example:
            # `from time import sleep`: node.module = "time", alias.name = "sleep", alias.asname = None
            # `from time import sleep as ts`: node.module = "time", alias.name = "sleep", alias.asname = "ts"
            if node.module:
                if alias.name == "*":
                    # For a wild-card import, add a binding for a target whose module name is matched.
                    for module, name in self.wildcard_import_targets:
                        if node.module == module:
                            self.code_block_stack.bind_name(name)
                else:
                    name = alias.asname or alias.name
                    self.code_block_stack.bind_name(name)

    def visit_Lambda(self, node: ast.Lambda) -> None:
        # Lambda can't have await, so we can ignore them for the purpose of this visitor.
        # Stop the traversal by not calling generic_visit().
        pass

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self.code_block_stack.bind_name(node.name)

        self.code_block_stack.push(node.name)

        for arg in node.args.args:
            self.code_block_stack.bind_name(arg.arg)
        for arg in node.args.kwonlyargs:
            self.code_block_stack.bind_name(arg.arg)
        for arg in node.args.posonlyargs:
            self.code_block_stack.bind_name(arg.arg)
        if node.args.vararg:
            self.code_block_stack.bind_name(
                node.args.vararg.arg,
            )
        if node.args.kwarg:
            self.code_block_stack.bind_name(
                node.args.kwarg.arg,
            )

        self.generic_visit(node)

        self.code_block_stack.pop()

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        self.code_block_stack.bind_name(node.name)

        self.code_block_stack.push(node.name)

        for arg in node.args.args:
            self.code_block_stack.bind_name(arg.arg)
        for arg in node.args.kwonlyargs:
            self.code_block_stack.bind_name(arg.arg)
        for arg in node.args.posonlyargs:
            self.code_block_stack.bind_name(arg.arg)
        if node.args.vararg:
            self.code_block_stack.bind_name(
                node.args.vararg.arg,
            )
        if node.args.kwarg:
            self.code_block_stack.bind_name(
                node.args.kwarg.arg,
            )

        self.generic_visit(node)

        self.code_block_stack.pop()

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        self.code_block_stack.bind_name(node.name)

        self.code_block_stack.push(node.name)

        self.generic_visit(node)

        self.code_block_stack.pop()

    # Below are node visitor methods to capture name bindings
    def _bind_name(self, target: ast.expr) -> None:
        # Handle ast.expr subtypes that can appear in assignment context (see https://docs.python.org/3/library/ast.html#abstract-grammar)
        if isinstance(target, ast.Name):
            name = target.id
            self.code_block_stack.bind_name(name)
        elif isinstance(target, ast.Tuple):
            for elt in target.elts:
                self._bind_name(elt)
        elif isinstance(target, ast.List):
            for elt in target.elts:
                self._bind_name(elt)
        elif isinstance(target, ast.Starred):
            self._bind_name(target.value)
        elif isinstance(target, ast.Attribute):
            # The `a.b = c` doesn't update the binding of `a`, so not necessary to bind the name.
            pass
        elif isinstance(target, ast.Subscript):
            # The `a[b] = c` doesn't matter for the purpose of this visitor
            pass

    def visit_Delete(self, node: ast.Delete) -> None:
        for target in node.targets:
            if isinstance(target, ast.Name):
                self.code_block_stack.bind_name(target.id)

        self.generic_visit(node)

    def visit_Assign(self, node: ast.Assign) -> ast.AST:
        for assign_target in node.targets:
            self._bind_name(assign_target)

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


class NesFinder:
    def __init__(self, tree: ast.Module, targets: set[tuple[str, str]]) -> None:
        self.visitor = CodeBlockNameBindingVisitor(targets=targets)
        self.visitor.visit(tree)

    def find(self, code_block_name: CodeBlockName, name: str) -> CodeBlockName | None:
        code_block = self.visitor.code_block_stack.code_blocks.get(code_block_name)
        if not code_block:
            raise ValueError(
                f"Code block {code_block_name} not found. NesFinder() didn't visit the code block."
            )
        return code_block.get_nearest_enclosing_scope(name)


class Scope:
    def __init__(self, name: str, parent: Self | None = None) -> None:
        self.bindings: dict[str, str] = dict()
        self.name: str = name
        self.parent = parent

    def add_binding(self, name: str, fully_qualified_name: str) -> None:
        self.bindings[name] = fully_qualified_name

    def delete_binding(self, name: str) -> None:
        del self.bindings[name]


class ScopeStack:
    def __init__(self, nes_finder: NesFinder) -> None:
        root_scope = Scope(name="__main__")
        self.scope_stack: list[Scope] = [root_scope]
        self.scopes: dict[str, Scope] = {root_scope.name: root_scope}

        self.nes_finder = nes_finder

    def push(self, name: str) -> None:
        scope = Scope(
            name=self.get_current_scope().name + "." + name, parent=self.scope_stack[-1]
        )
        self.scope_stack.append(scope)
        self.scopes[scope.name] = scope

    def pop(self) -> None:
        self.scope_stack.pop()

    def get_current_scope(self) -> Scope:
        return self.scope_stack[-1]

    def add_binding(self, name: str, fully_qualified_name: str) -> None:
        self.scope_stack[-1].add_binding(name, fully_qualified_name)

    def add_local_binding(self, name: str) -> None:
        self.scope_stack[-1].add_binding(
            name, self.get_current_scope().name + "." + name
        )

    def delete_binding(self, name: str) -> None:
        self.scope_stack[-1].delete_binding(name)

    def resolve_name(self, name: str) -> str | None:
        nes_name = self.nes_finder.find(self.get_current_scope().name, name)
        if not nes_name:
            # NameError
            return None
        scope = self.scopes[nes_name]
        if not scope:
            # unexpected
            return None
        return scope.bindings.get(name)


class NodeTransformer(ast.NodeTransformer):
    def __init__(self, nes_finder: NesFinder, targets: set[tuple[str, str]]) -> None:
        super().__init__()

        self.scope_stack = ScopeStack(nes_finder=nes_finder)

        self.imported_modules: dict[str, str] = dict()
        self.required_imports: set[tuple[str, str]] = set()

        self.invalidated_names: set[str] = set()

        self.targets: set[tuple[str, str]] = targets

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
                    # For a wild-card import, add a binding for a target whose module name is matched.
                    for module, name in self.targets:
                        if node.module == module:
                            self.scope_stack.add_binding(name, module + "." + name)
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
                ".".join(target) == func_fully_qual_name
                and func_fully_qual_name not in self.invalidated_names
            ):
                return self._visit_target_call(node, target)

        return node

    def _visit_target_call(self, node: ast.Call, target: tuple[str, str]) -> ast.AST:
        if target == ("time", "sleep"):
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
        elif target == ("streamlit", "write_stream"):
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
