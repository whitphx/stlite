import ast
from contextlib import contextmanager
from enum import Enum
from typing import NamedTuple, Self, cast

# These units defines "code block" in Python. See https://docs.python.org/3/reference/executionmodel.html#structure-of-a-program
CodeBlockNode = ast.Module | ast.FunctionDef | ast.AsyncFunctionDef | ast.ClassDef
ChildCodeBlockNode = ast.FunctionDef | ast.AsyncFunctionDef | ast.ClassDef


class SpecialNameToken(Enum):
    DELETED = 1
    NONDETERMINISTIC = 2


class StaticNameResolutionStatus(Enum):
    BOUND = 1
    BOUND_BUT_AMBIGUOUS = 2
    BOUND_BUT_DELETED = 3
    NOT_FOUND = 4


FullyQualifiedName = str
NameBoundTo = FullyQualifiedName | SpecialNameToken


class WildcardImportTarget(NamedTuple):
    module: str
    attr: str

    @property
    def full_name(self) -> str:
        return self.module + "." + self.attr


class CodeBlockStaticScanner(ast.NodeVisitor):
    def __init__(
        self,
        code_block_name: str,
        parent_scanner: Self | None,
        wildcard_import_targets: set[WildcardImportTarget],
    ) -> None:
        """Scan a code block ("code block" is a Python terminology. See https://docs.python.org/3/reference/executionmodel.html).
        The `process()` method recursively instantiates this class and scans the child code blocks
        to get the information about name bindings in the code block.
        It's for emulating the name resolution behavior of the Python interpreter (https://docs.python.org/3/reference/executionmodel.html#resolution-of-names).
        """
        super().__init__()

        self.parent_scanner = parent_scanner

        self.wildcard_import_targets = wildcard_import_targets

        self.code_block_full_name: str
        if parent_scanner:
            self.code_block_full_name = (
                parent_scanner.code_block_full_name + "." + code_block_name
            )
        else:
            self.code_block_full_name = code_block_name
        self.name_bindings: dict[str, list[NameBoundTo]] = dict()
        self.child_code_blocks: list[ChildCodeBlockNode] = []

        self.code_block_node: CodeBlockNode

        self._control_flow_depth = 0

        self._processed = False

    def __repr__(self) -> str:
        return f"<CodeBlockStaticScanner(code_block_name={self.code_block_full_name}, name_bindings={self.name_bindings})>"

    def process(
        self, tree: CodeBlockNode
    ) -> dict[CodeBlockNode, "CodeBlockStaticScanner"]:
        self.code_block_node = tree

        if isinstance(tree, (ast.FunctionDef, ast.AsyncFunctionDef)):
            for arg in _get_func_args(tree):
                self._bind_name(arg)

        self.generic_visit(tree)

        node_scanner_map: dict[CodeBlockNode, CodeBlockStaticScanner] = dict()

        node_scanner_map[tree] = self
        for child_block in self.child_code_blocks:
            scanner = CodeBlockStaticScanner(
                child_block.name, self, self.wildcard_import_targets
            )
            node_scanner_map[child_block] = scanner

            child_node_scanner_map = scanner.process(child_block)
            node_scanner_map.update(child_node_scanner_map)

        self._processed = True

        return node_scanner_map

    def find_nearest_enclosing_scope(self, name: str) -> Self | None:
        if not self._processed:
            raise ValueError(
                "The code block scanner hasn't processed the code block yet."
            )

        status, _ = self.resolve_name_local_static(name)
        if status == StaticNameResolutionStatus.NOT_FOUND:
            return (
                self.parent_scanner.find_nearest_enclosing_scope(name)
                if self.parent_scanner
                else None
            )
        return self

    def resolve_name_local_static(
        self, name: str
    ) -> tuple[StaticNameResolutionStatus, str | None]:
        if not self._processed:
            raise ValueError(
                "The code block scanner hasn't processed the code block yet."
            )

        bind_history = self.name_bindings.get(name)
        if bind_history is None or len(bind_history) == 0:
            return StaticNameResolutionStatus.NOT_FOUND, None
        if len(bind_history) > 1:
            return StaticNameResolutionStatus.BOUND_BUT_AMBIGUOUS, None
        resolved = bind_history[0]
        if resolved == SpecialNameToken.DELETED:
            return StaticNameResolutionStatus.BOUND_BUT_DELETED, None
        if resolved == SpecialNameToken.NONDETERMINISTIC:
            return StaticNameResolutionStatus.BOUND_BUT_AMBIGUOUS, None
        return StaticNameResolutionStatus.BOUND, resolved

    def _bind_name(self, name: str, bound_to: NameBoundTo | None = None):
        if self._inside_control_flow:
            bound_to = SpecialNameToken.NONDETERMINISTIC
        elif bound_to is None:
            bound_to = self.code_block_full_name + "." + name
        self.name_bindings.setdefault(name, []).append(bound_to)

    def _bind_expr(self, target: ast.expr, bound_to: NameBoundTo | None = None) -> None:
        # Handle ast.expr subtypes that can appear in assignment context (see https://docs.python.org/3/library/ast.html#abstract-grammar)
        if isinstance(target, ast.Name):
            name = target.id
            self._bind_name(name, bound_to=bound_to)
        elif isinstance(target, ast.Tuple):
            for elt in target.elts:
                self._bind_expr(elt, bound_to=bound_to)
        elif isinstance(target, ast.List):
            for elt in target.elts:
                self._bind_expr(elt, bound_to=bound_to)
        elif isinstance(target, ast.Starred):
            self._bind_expr(target.value, bound_to=bound_to)
        elif isinstance(target, ast.Attribute):
            # The `a.b = c` doesn't update the binding of `a`, so not necessary to bind the name.
            pass
        elif isinstance(target, ast.Subscript):
            # The `a[b] = c` doesn't matter for the purpose of this visitor
            pass

    def _resolve_name_local_dynamic(self, name: str) -> str | None:
        bind_history = self.name_bindings.get(name)
        if bind_history is None or len(bind_history) == 0:
            return None
        resolved = bind_history[-1]
        if resolved == SpecialNameToken.DELETED:
            return None
        if resolved == SpecialNameToken.NONDETERMINISTIC:
            return None
        return resolved

    @contextmanager
    def _control_flow_flag(self, is_control_flow_syntax):
        if is_control_flow_syntax:
            self._control_flow_depth += 1
        yield
        if is_control_flow_syntax:
            self._control_flow_depth -= 1

    @property
    def _inside_control_flow(self):
        return self._control_flow_depth > 0

    def visit(self, node: ast.AST) -> None:
        is_control_flow = isinstance(
            node,
            (
                ast.For,
                ast.AsyncFor,
                ast.While,
                ast.If,
                ast.With,
                ast.AsyncWith,
                ast.Try,
                ast.TryStar,
            ),
        )
        with self._control_flow_flag(is_control_flow):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                full_qual_name = self.code_block_full_name + "." + node.name

                self._bind_name(node.name, full_qual_name)
                self.child_code_blocks.append(node)
                return

            if isinstance(node, ast.Lambda):
                # Lambda can't have await, so we can ignore them for the purpose of this visitor.
                # Stop the traversal by not calling generic_visit().
                return

            if isinstance(node, ast.Import):
                for alias in node.names:
                    # Example:
                    # `import streamlit`: alias.name = "streamlit", alias.asname = None
                    # `import streamlit as st`: alias.name = "streamlit", alias.asname = "st"
                    name = alias.asname or alias.name.split(".")[0]
                    self._bind_name(name, alias.name)
                return
            if isinstance(node, ast.ImportFrom):
                for alias in node.names:
                    # Example:
                    # `from time import sleep`: node.module = "time", alias.name = "sleep", alias.asname = None
                    # `from time import sleep as ts`: node.module = "time", alias.name = "sleep", alias.asname = "ts"
                    if node.module:
                        if alias.name == "*":
                            # For a wild-card import, add a binding for a target whose module name is matched.
                            for target in self.wildcard_import_targets:
                                if node.module == target.module:
                                    self._bind_name(target.attr, target.full_name)
                        else:
                            name = alias.asname or alias.name
                            self._bind_name(name, node.module + "." + alias.name)
                return

            if isinstance(node, (ast.Assign, ast.Delete)):
                if isinstance(node, ast.Delete):
                    bound_to = SpecialNameToken.DELETED
                else:
                    bound_to = (
                        self._resolve_name_local_dynamic(node.value.id)
                        if isinstance(node.value, ast.Name)
                        else None
                    )
                for target in node.targets:
                    self._bind_expr(target, bound_to=bound_to)
            assignment_occurs = isinstance(
                node,
                (
                    ast.AugAssign,
                    ast.AnnAssign,
                    ast.For,
                    ast.AsyncFor,
                    ast.NamedExpr,
                ),
            )
            if assignment_occurs:
                self._bind_expr(node.target)
            elif isinstance(node, ast.withitem):
                if node.optional_vars:
                    self._bind_expr(node.optional_vars)
            elif isinstance(node, ast.TypeAlias):
                self._bind_expr(node.name)

            self.generic_visit(node)


class ReturnValue(NamedTuple):
    called_function: FullyQualifiedName


class ObjAttr(NamedTuple):
    obj: ReturnValue
    attr: str


NameResolvedAs = (
    NameBoundTo | ReturnValue | ObjAttr
)  # Name resolvers try to return `NameBoundTo` as much as possible, but using `ReturnValue` or `ObjAttr` is necessary for the case where the name is bound to a function call result or an attribute of a function call result.


class NonDeterministicBindingAppearances:
    """Basically, name bindings in the control flows will be resolved as non-deterministic.
    However, an exception is when the name is bound to the same value in all the control flow branches.
    To handle this case, this class is used to keep track of the name bindings in the control flow branches.
    """

    def __init__(self, bound_item: NameResolvedAs | None) -> None:
        self.resolved_as = bound_item

    def add_appearance(self, bound_item: NameResolvedAs | None) -> None:
        if self.resolved_as != bound_item:
            self.resolved_as = SpecialNameToken.NONDETERMINISTIC

    def resolve(self) -> NameResolvedAs | None:
        return self.resolved_as


class ModuleObject(NamedTuple):
    name: str


class AttrFunctionCall(NamedTuple):
    obj: ModuleObject | ReturnValue
    attr: str


class TransformRuleAction(Enum):
    TIME_SLEEP = 1
    STREAMLIT_WRITE_STREAM = 2
    STREAMLIT_NAVIGATION_RUN = 3


class CodeBlockTransformer(ast.NodeTransformer):
    def __init__(
        self,
        code_block_name: str,
        parent_transformer: Self | None,
        rules: dict[AttrFunctionCall, TransformRuleAction],
        node_scanner_map: dict[CodeBlockNode, CodeBlockStaticScanner],
    ) -> None:
        super().__init__()

        self._code_block_node: CodeBlockNode

        self._node_scanner_map = node_scanner_map

        self.parent_transformer = parent_transformer

        self.rules = rules

        self.code_block_full_name: str
        if parent_transformer:
            self.code_block_full_name = (
                parent_transformer.code_block_full_name + "." + code_block_name
            )
        else:
            self.code_block_full_name = code_block_name

        self.name_bindings: dict[
            str, NameResolvedAs | NonDeterministicBindingAppearances
        ] = dict()  # In the traversal this class does, we are only interested in the latest binding of each name in the code block. For names bound in outer scope, we refer to the scanner object that already ran and has the static name binding information.

        self.imported_modules: dict[str, str] = dict()
        self.required_imports: set[tuple[str, str]] = set()

        self.invalidated_names: set[str] = set()

        self._control_flow_depth = 0

    def process(self, tree: CodeBlockNode) -> CodeBlockNode:
        self._code_block_node = tree

        if isinstance(tree, (ast.FunctionDef, ast.AsyncFunctionDef)):
            for arg in _get_func_args(tree):
                self._bind_name(arg)

        new_tree = self.generic_visit(tree)
        new_tree = cast(CodeBlockNode, new_tree)

        _insert_import_statement(new_tree, self.required_imports)

        return new_tree

    def _bind_name(self, name: str, bound_to: NameResolvedAs | None = None):
        if bound_to is None:
            bound_to = self.code_block_full_name + "." + name

        if self._inside_control_flow:
            self.name_bindings[name] = NonDeterministicBindingAppearances(bound_to)
        else:
            self.name_bindings[name] = bound_to

    def _bind_expr(
        self, target: ast.expr, bound_to: NameResolvedAs | None = None
    ) -> None:
        # Handle ast.expr subtypes that can appear in assignment context (see https://docs.python.org/3/library/ast.html#abstract-grammar)
        if isinstance(target, ast.Name):
            name = target.id
            self._bind_name(name, bound_to=bound_to)
        elif isinstance(target, ast.Tuple):
            for elt in target.elts:
                self._bind_expr(elt, bound_to=bound_to)
        elif isinstance(target, ast.List):
            for elt in target.elts:
                self._bind_expr(elt, bound_to=bound_to)
        elif isinstance(target, ast.Starred):
            self._bind_expr(target.value, bound_to=bound_to)
        elif isinstance(target, ast.Attribute):
            if isinstance(target.value, ast.Name):
                invalidated_name = target.value.id + "." + target.attr
                self.invalidated_names.add(invalidated_name)
        elif isinstance(target, ast.Subscript):
            # The `a[b] = c` doesn't matter for the purpose of this visitor
            pass

    def _resolve_name_local_dynamic(self, name: str) -> NameResolvedAs | None:
        bound_to = self.name_bindings.get(name)
        if bound_to == SpecialNameToken.DELETED:
            return None
        elif isinstance(bound_to, NonDeterministicBindingAppearances):
            return bound_to.resolve()
        elif bound_to == SpecialNameToken.NONDETERMINISTIC:
            return None
        return bound_to

    def _resolve_name(self, name: str) -> NameResolvedAs | None:
        scanner = self._node_scanner_map[self._code_block_node]
        if scanner is None:
            raise ValueError(
                "The code block scanner hasn't processed the code block yet."
            )
        nes_scanner = scanner.find_nearest_enclosing_scope(name)
        if nes_scanner is None:
            # NameError or UnboundLocalError
            return None

        is_local = nes_scanner.code_block_node is self._code_block_node
        if is_local and not self._inside_control_flow:
            # The case where the name is not a free variable,
            # which means it's used and defined in the same code block (see https://docs.python.org/3/reference/executionmodel.html#binding-of-names).
            # In this case, now this transformer is running or traversing
            # in the code block AST where the name is bound, `self._code_block_node`.
            # So we use the dynamic name resolver of this class in this case
            # because the AST traversal is like the actual code execution of Python at runtime
            # so the name resolution based on it should be better than the static one below.
            return self._resolve_name_local_dynamic(name)

        static_resolution_status, resolved = nes_scanner.resolve_name_local_static(name)
        # XXX: Here we use the statically resolved name.
        # This is different from the actual runtime behavior of Python interpreter
        # in that the runtime dynamically resolves name of free variables at runtime (https://docs.python.org/3/reference/executionmodel.html#interaction-with-dynamic-features).
        # However, we believe this is a good approximation enough for most cases
        # to provide a kinder support of the code auto-conversion
        # while it may be false-positive in some cases.
        # Actually existing static analyzers e.g. Pylance behave similarly.
        # One example of the false-positive case is the following code:
        # ```
        # def foo():
        #     sleep(1)
        # foo()
        # from time import sleep
        # ```
        # In this case, the name `sleep` is resolved to the function `time.sleep` statically
        # but when `foo()` is called at runtime, it raises a NameError
        # because the name `sleep` is not bound to any value at the time.
        if static_resolution_status == StaticNameResolutionStatus.BOUND:
            return resolved
        return None

    @contextmanager
    def _control_flow_flag(self, is_control_flow_syntax):
        if is_control_flow_syntax:
            self._control_flow_depth += 1
        yield
        if is_control_flow_syntax:
            self._control_flow_depth -= 1

    @property
    def _inside_control_flow(self):
        return self._control_flow_depth > 0

    def _resolve_called_object(
        self, node: ast.Call
    ) -> tuple[NameResolvedAs | None, FullyQualifiedName | None]:
        called_func = node.func
        obj_origin = None
        func_fully_qual_name = None

        # YAGNI: We now support only the following two cases (e.g. `obj.fn()` and `fn()`).
        # Especially, we don't care about the case like chained attribute access (e.g. `obj.attr.fn()`) for now.
        if type(called_func) is ast.Name:  # e.g. `fn()`
            func_name = called_func.id
            obj_origin = self._resolve_name(func_name)
            if isinstance(
                obj_origin, str
            ):  # When `fn` is resolved to a fully qualified name, e.g. `from mod imoprt fn`
                func_fully_qual_name = obj_origin
            elif isinstance(
                obj_origin, ObjAttr
            ):  # When `fn` is resolved to `obj.method`
                attr_name = obj_origin.attr
                obj_origin = obj_origin.obj
        elif type(called_func) is ast.Attribute:  # e.g. `obj.fn()` or `f().g()`
            if (
                type(called_func.value) is ast.Name  # e.g. `obj.fn()`
                and isinstance(called_func.value.ctx, ast.Load)
            ):
                obj_name = called_func.value.id
                attr_name = called_func.attr
                obj_origin = self._resolve_name(obj_name)
                if isinstance(obj_origin, str):
                    func_fully_qual_name = obj_origin + "." + attr_name
            elif isinstance(called_func.value, ast.Call):  # e.g. `f().g()``
                _, called_func_full_qual_name = self._resolve_called_object(
                    called_func.value
                )
                if called_func_full_qual_name:
                    # YAGNI: We only support this case e.g. the `f` of `f().g()` is resolved to a fully qualified name.
                    obj_origin = ReturnValue(called_function=called_func_full_qual_name)

        return obj_origin, func_fully_qual_name

    def handle_Call(self, node: ast.Call) -> ast.AST:
        original_obj, fully_qual_name = self._resolve_called_object(node)

        if not original_obj and not fully_qual_name:
            # Early return for efficiency. In this case, no rule will match below.
            return node

        for target, action in self.rules.items():
            if (
                isinstance(target.obj, ModuleObject)
                and target.obj.name + "." + target.attr == fully_qual_name
                and fully_qual_name not in self.invalidated_names
            ) or (
                isinstance(target.obj, ReturnValue)
                and isinstance(original_obj, ReturnValue)
                and target.obj.called_function == original_obj.called_function
            ):
                return self._handle_target_call(node, action)

        return node

    def _handle_target_call(
        self,
        node: ast.Call,
        action: TransformRuleAction,
    ) -> ast.AST:
        if action == TransformRuleAction.TIME_SLEEP:
            module_name = "asyncio"
            func_name = "sleep"
            module_alias_for_new_import = "__asyncio__"
            if module_name in self.imported_modules:
                module_as_name = self.imported_modules[module_name]
            else:
                module_as_name = module_alias_for_new_import
                self.required_imports.add((module_name, module_as_name))
            return ast.Await(
                value=ast.Call(
                    func=ast.Attribute(
                        value=ast.Name(id=module_as_name, ctx=ast.Load()),
                        attr=func_name,
                        ctx=ast.Load(),
                    ),
                    args=node.args,
                    keywords=node.keywords,
                )
            )
        elif action == TransformRuleAction.STREAMLIT_WRITE_STREAM:
            return ast.Await(value=node)
        elif action == TransformRuleAction.STREAMLIT_NAVIGATION_RUN:
            module_name = "stlite_lib.async_utils"
            func_name = "ensure_awaitable"
            module_alias_for_new_import = "__stlite_lib_async_utils__"
            if module_name in self.imported_modules:
                module_as_name = self.imported_modules[module_name]
            else:
                module_as_name = module_alias_for_new_import
                self.required_imports.add((module_name, module_as_name))
            return ast.Await(
                value=ast.Call(
                    func=ast.Attribute(
                        value=ast.Name(id=module_as_name, ctx=ast.Load()),
                        attr=func_name,
                        ctx=ast.Load(),
                    ),
                    args=[node],
                    keywords=[],
                ),
            )

    def visit(self, node: ast.AST) -> ast.AST:
        # Process the visited node
        is_control_flow = isinstance(
            node,
            (
                ast.For,
                ast.AsyncFor,
                ast.While,
                ast.If,
                ast.With,
                ast.AsyncWith,
                ast.Try,
                ast.TryStar,
            ),
        )
        with self._control_flow_flag(is_control_flow):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                full_qual_name = self.code_block_full_name + "." + node.name

                self._bind_name(node.name, full_qual_name)

                if isinstance(node, ast.FunctionDef):
                    # FunctionDef can't have await, so stop the traversal by not calling generic_visit().
                    # TODO: Convert sync function to async function
                    return node

                transformer = CodeBlockTransformer(
                    node.name, self, self.rules, self._node_scanner_map
                )
                return transformer.process(node)

            if isinstance(node, ast.Call):
                return self.handle_Call(node)

            if isinstance(node, (ast.Lambda, ast.Await)):
                # Lambda can't have await, so we can ignore them for the purpose of this visitor.
                # Already awaited expression doesn't need to be processed by this visitor.
                # Stop the traversal by not calling generic_visit().
                return node

            if isinstance(node, ast.Import):
                for alias in node.names:
                    # Example:
                    # `import streamlit`: alias.name = "streamlit", alias.asname = None
                    # `import streamlit as st`: alias.name = "streamlit", alias.asname = "st"
                    name = alias.asname or alias.name.split(".")[0]
                    self._bind_name(name, alias.name)

                    self.imported_modules[alias.name] = alias.asname or alias.name
                return node

            if isinstance(node, ast.ImportFrom):
                for alias in node.names:
                    # Example:
                    # `from time import sleep`: node.module = "time", alias.name = "sleep", alias.asname = None
                    # `from time import sleep as ts`: node.module = "time", alias.name = "sleep", alias.asname = "ts"
                    if node.module:
                        if alias.name == "*":
                            # For a wild-card import, add a binding for a target whose module name is matched.
                            for target in self.rules.keys():
                                if (
                                    isinstance(target.obj, ModuleObject)
                                    and node.module == target.obj.name
                                ):
                                    self._bind_name(
                                        target.attr, target.obj.name + "." + target.attr
                                    )
                        else:
                            name = alias.asname or alias.name
                            self._bind_name(name, node.module + "." + alias.name)
                return node

            if isinstance(node, (ast.Assign, ast.Delete)):
                bound_to = None
                if isinstance(node, ast.Delete):
                    bound_to = SpecialNameToken.DELETED
                else:
                    if isinstance(node.value, ast.Call):  # e.g. `a = f()`
                        _, called_func_full_qual_name = self._resolve_called_object(
                            node.value
                        )
                        if called_func_full_qual_name:
                            # If a function is called in the right-hand side of the assignment,
                            # bind the left-hand side to a token representing the return value of the function call.
                            bound_to = ReturnValue(
                                called_function=called_func_full_qual_name
                            )
                    elif isinstance(node.value, ast.Name):  # e.g. `a = b`
                        bound_to = self._resolve_name_local_dynamic(node.value.id)
                    elif isinstance(node.value, ast.Attribute):
                        if isinstance(node.value.value, ast.Name):  # e.g. `a = b.c`
                            obj_name = node.value.value.id
                            attr_name = node.value.attr
                            obj_origin = self._resolve_name(obj_name)
                            if isinstance(obj_origin, str):
                                bound_to = obj_origin + "." + attr_name
                            elif isinstance(obj_origin, ReturnValue):
                                bound_to = ObjAttr(obj=obj_origin, attr=attr_name)
                        elif isinstance(node.value.value, ast.Call):  # e.g. `a = b().c`
                            _, called_func_full_qual_name = self._resolve_called_object(
                                node.value.value
                            )
                            if called_func_full_qual_name:
                                bound_to = ReturnValue(
                                    called_function=called_func_full_qual_name
                                )
                for target in node.targets:
                    self._bind_expr(target, bound_to=bound_to)
                return node

            assignment_occurs = isinstance(
                node,
                (
                    ast.AugAssign,
                    ast.AnnAssign,
                    ast.For,
                    ast.AsyncFor,
                    ast.NamedExpr,
                ),
            )
            if assignment_occurs:
                self._bind_expr(node.target)
            elif isinstance(node, ast.withitem):
                if node.optional_vars:
                    self._bind_expr(node.optional_vars)
            elif isinstance(node, ast.TypeAlias):
                self._bind_expr(node.name)

            # Traverse the children
            self.generic_visit(node)

            return node


def _insert_import_statement(
    tree: CodeBlockNode, module_names: set[tuple[str, str]]
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


def _get_func_args(node: ast.FunctionDef | ast.AsyncFunctionDef) -> list[str]:
    params: list[str] = []
    for arg in node.args.args:
        params.append(arg.arg)
    for arg in node.args.kwonlyargs:
        params.append(arg.arg)
    for arg in node.args.posonlyargs:
        params.append(arg.arg)
    if node.args.vararg:
        params.append(
            node.args.vararg.arg,
        )
    if node.args.kwarg:
        params.append(
            node.args.kwarg.arg,
        )
    return params


def patch(code: str | ast.Module, script_path: str) -> ast.Module:
    if isinstance(code, str):
        tree = ast.parse(code, script_path, "exec")
    elif isinstance(code, ast.Module):
        tree = code
    else:
        raise ValueError("code must be a string or an ast.Module")

    transform_rules = {
        AttrFunctionCall(
            obj=ModuleObject(name="time"), attr="sleep"
        ): TransformRuleAction.TIME_SLEEP,
        AttrFunctionCall(
            obj=ModuleObject(name="streamlit"), attr="write_stream"
        ): TransformRuleAction.STREAMLIT_WRITE_STREAM,
        AttrFunctionCall(
            obj=ReturnValue(called_function="streamlit.navigation"),
            attr="run",
        ): TransformRuleAction.STREAMLIT_NAVIGATION_RUN,
    }

    wildcard_import_monitor_targets = set(
        [
            WildcardImportTarget(module=k.obj.name, attr=k.attr)
            for k in transform_rules.keys()
            if isinstance(k.obj, ModuleObject)
        ]
    )

    scanner = CodeBlockStaticScanner("__main__", None, wildcard_import_monitor_targets)
    node_scanner_map = scanner.process(tree)
    transformer = CodeBlockTransformer(
        "__main__", None, transform_rules, node_scanner_map
    )
    new_tree = transformer.process(tree)
    new_tree = ast.fix_missing_locations(new_tree)

    return cast(ast.Module, new_tree)
