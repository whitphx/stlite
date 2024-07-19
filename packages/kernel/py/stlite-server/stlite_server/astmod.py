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

        self.appeared_imports = set()
        self.required_imports = set()

    def transform(self, tree: ast.Module) -> ast.Module:
        new_tree = self.visit(tree)

        for import_name in self.required_imports:
            import_node = ast.Import(names=[ast.alias(name=import_name, asname=None)])
            new_tree.body.insert(0, import_node)

        return new_tree

    def visit_Import(self, node: ast.Import) -> ast.Import:
        for alias in node.names:
            self.appeared_imports.add(alias.name)
        return node

    def visit_With(self, node: ast.With) -> ast.With:
        self.generic_visit(node)
        return node

    def visit_For(self, node: ast.For) -> ast.For:
        self.generic_visit(node)
        return node

    def visit_While(self, node: ast.While) -> ast.While:
        self.generic_visit(node)
        return node

    def visit_Try(self, node: ast.Try) -> ast.Try:
        self.generic_visit(node)
        return node

    def visit_TryStar(self, node: ast.TryStar) -> ast.TryStar:
        self.generic_visit(node)
        return node

    def visit_If(self, node: ast.If) -> ast.If:
        self.generic_visit(node)
        return node

    def visit_Match(self, node: ast.Match) -> ast.Match:
        self.generic_visit(node)
        return node

    def visit_Expr(self, node: ast.Expr) -> ast.Expr:
        return self._visit_Expr_and_Assign(node)

    def visit_Assign(self, node: ast.Assign) -> ast.Assign:
        return self._visit_Expr_and_Assign(node)

    def _visit_Expr_and_Assign(
        self, node: ast.Expr | ast.Assign
    ) -> ast.Expr | ast.Assign:
        if type(node.value) is ast.Call:
            called_func = node.value.func
            if type(called_func) is ast.Name:
                if called_func.id == "sleep":
                    # `time.sleep()` -> `await asyncio.sleep()`
                    node.value.func = ast.Attribute(
                        value=ast.Name(id="asyncio", ctx=ast.Load()),
                        attr="sleep",
                        ctx=ast.Load(),
                    )
                    node.value = ast.Await(value=node.value)
                    if "asyncio" not in self.appeared_imports:
                        self.required_imports.add("asyncio")
            if (
                type(called_func) is ast.Attribute
                and type(called_func.value) is ast.Name
                and isinstance(called_func.value.ctx, ast.Load)
            ):
                module = called_func.value.id
                method = called_func.attr
                if (module, method) == ("st", "write_stream"):
                    # `st.write_stream()` -> `await st.write_stream()`
                    node.value = ast.Await(value=node.value)
                elif (module, method) == ("time", "sleep"):
                    # C`time.sleep()` -> `await asyncio.sleep()`
                    called_func.value.id = "asyncio"
                    called_func.attr = "sleep"
                    node.value = ast.Await(value=node.value)
                    if "asyncio" not in self.appeared_imports:
                        self.required_imports.add("asyncio")
        self.generic_visit(node)
        return node
