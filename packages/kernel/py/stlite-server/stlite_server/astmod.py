import ast


def patch(code: str | ast.Module, script_path: str) -> ast.Module:
    if isinstance(code, str):
        tree = ast.parse(code, script_path, "exec")
    elif isinstance(code, ast.Module):
        tree = code
    else:
        raise ValueError("code must be a string or an ast.Module")

    _modify_ast_subtree(tree)

    ast.fix_missing_locations(tree)

    return tree


def _modify_ast_subtree(
    tree: ast.AST,
    body_attr: str = "body",
):
    # Ref: streamlit.runtime.scriptrunner.magic._modify_ast_subtree
    body = getattr(tree, body_attr)

    appeared_imports = set()
    required_imports = set()

    for node in body:
        node_type = type(node)
        if node_type is ast.Import:
            for alias in node.names:
                appeared_imports.add(alias.name)
        elif (
            node_type is ast.With
            or node_type is ast.For
            or node_type is ast.While
            or node_type is ast.Try
        ):
            _modify_ast_subtree(node)
        elif node_type is ast.Try:
            for j, inner_node in enumerate(node.handlers):
                node.handlers[j] = _modify_ast_subtree(inner_node)
            finally_node = _modify_ast_subtree(node, body_attr="finalbody")
            node.finalbody = finally_node.finalbody
            _modify_ast_subtree(node)
        elif node_type is ast.If:
            _modify_ast_subtree(node)
            _modify_ast_subtree(node, "orelse")
        elif node_type is ast.Expr or node_type is ast.Assign:
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
                        if "asyncio" not in appeared_imports:
                            required_imports.add("asyncio")
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
                        if "asyncio" not in appeared_imports:
                            required_imports.add("asyncio")

    for import_name in required_imports:
        import_node = ast.Import(names=[ast.alias(name=import_name, asname=None)])
        body.insert(0, import_node)
