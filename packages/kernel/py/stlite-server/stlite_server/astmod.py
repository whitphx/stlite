import ast


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
            self.names[name] = alias.name

            self.imported_modules[alias.name] = alias.asname or alias.name
        return node

    def visit_ImportFrom(self, node: ast.ImportFrom) -> ast.ImportFrom:
        for alias in node.names:
            # Example:
            # `from time import sleep`: node.module = "time", alias.name = "sleep", alias.asname = None
            # `from time import sleep as ts`: node.module = "time", alias.name = "sleep", alias.asname = "ts"
            if node.module:
                name = alias.asname or alias.name
                self.names[name] = node.module + "." + alias.name
        return node

    def visit_Call(self, node: ast.Call) -> ast.AST:
        called_func = node.func
        func_fully_qual_name = None
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
            mod_first_segment, *mod_rest_segments = module.split(".")
            if mod_first_segment_full_name := self.names.get(mod_first_segment):
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
    def _register_name(self, node: ast.expr) -> None:
        # Handle ast.expr subtypes that can appear in assignment context (see https://docs.python.org/3/library/ast.html#abstract-grammar)
        if isinstance(node, ast.Name):
            name = node.id
            self.names[name] = name
        elif isinstance(node, ast.Tuple):
            for elt in node.elts:
                self._register_name(elt)
        elif isinstance(node, ast.List):
            for elt in node.elts:
                self._register_name(elt)
        elif isinstance(node, ast.Starred):
            self._register_name(node.value)
        elif isinstance(node, ast.Attribute):
            if isinstance(node.value, ast.Name):
                invalidated_name = node.value.id + "." + node.attr
                self.invalidated_names.add(invalidated_name)
        elif isinstance(node, ast.Subscript):
            # The `a[b] = c` doesn't matter for the purpose of this visitor
            pass

    def visit_FunctionDef(self, node: ast.FunctionDef) -> ast.AST:
        self.names[node.name] = node.name

        # FunctionDef can't have await, so stop the traversal by not calling generic_visit().
        # TODO: Convert sync function to async function
        return node

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> ast.AST:
        self.names[node.name] = node.name

        self.generic_visit(node)
        return node

    def visit_ClassDef(self, node: ast.ClassDef) -> ast.AST:
        self.names[node.name] = node.name

        self.generic_visit(node)
        return node

    def visit_Delete(self, node: ast.Delete) -> ast.AST:
        for target in node.targets:
            if isinstance(target, ast.Name):
                del self.names[target.id]

        self.generic_visit(node)
        return node

    def visit_Assign(self, node: ast.Assign) -> ast.AST:
        for assign_target in node.targets:
            self._register_name(assign_target)

        self.generic_visit(node)
        return node

    def visit_TypeAlias(self, node: ast.TypeAlias) -> ast.AST:
        self._register_name(node.name)

        self.generic_visit(node)
        return node

    def visit_AugAssign(self, node: ast.AugAssign) -> ast.AST:
        self._register_name(node.target)

        self.generic_visit(node)
        return node

    def visit_AnnAssign(self, node: ast.AnnAssign) -> ast.AST:
        self._register_name(node.target)

        self.generic_visit(node)
        return node

    def visit_For(self, node: ast.For) -> ast.AST:
        self._register_name(node.target)

        self.generic_visit(node)
        return node

    def visit_AsyncFor(self, node: ast.AsyncFor) -> ast.AST:
        self._register_name(node.target)

        self.generic_visit(node)
        return node

    def visit_withitem(self, node: ast.withitem) -> ast.AST:
        if node.optional_vars:
            self._register_name(node.optional_vars)

        self.generic_visit(node)
        return node

    def visit_NamedExpr(self, node: ast.NamedExpr) -> ast.AST:
        self._register_name(node.target)

        self.generic_visit(node)
        return node


def _insert_import_statement(tree: ast.Module, module_names: list[str]) -> None:
    """Insert an import statement of `module_names` at the top(ish) of the tree."""

    if not module_names:
        return

    import_node = ast.Import(
        names=[ast.alias(name=module_name, asname=None) for module_name in module_names]
    )

    # Search __future__ imports. If they exist, insert the import statement after them. If not, insert the import statement at the top.
    insert_index = 0
    for i, node in enumerate(tree.body):
        if isinstance(node, ast.ImportFrom) and node.module == "__future__":
            insert_index = i + 1

    tree.body.insert(insert_index, import_node)
