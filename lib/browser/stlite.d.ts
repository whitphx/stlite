import type { IHostConfigResponse } from '@streamlit/connection/src/types';

declare interface CanvasInterface {
    	setCanvas2D(canvas: HTMLCanvasElement): void;
    	getCanvas2D(): HTMLCanvasElement | undefined;
    	setCanvas3D(canvas: HTMLCanvasElement): void;
    	getCanvas3D(): HTMLCanvasElement | undefined;
}

declare type DetailedMountOptions = SimplifiedStliteKernelOptions & MakeToastKernelCallbacksOptions;

declare interface EmscriptenFile {
    data: string | ArrayBufferView;
    opts?: Record<string, string>;
}

declare interface EmscriptenFileUrl {
    url: string;
    opts?: Record<string, string>;
}

declare type FSNode = {
    	timestamp: number;
    	rdev: number;
    	contents: Uint8Array;
    	mode: number;
};

declare type FSStream = {
    	tty?: boolean;
    	seekable?: boolean;
    	stream_ops: FSStreamOps;
    	node: FSNode;
};

declare type FSStreamOps = FSStreamOpsGen<FSStream>;

declare type FSStreamOpsGen<T> = {
    	open: (a: T) => void;
    	close: (a: T) => void;
    	fsync: (a: T) => void;
    	read: (a: T, b: Uint8Array, offset: number, length: number, pos: number) => number;
    	write: (a: T, b: Uint8Array, offset: number, length: number, pos: number) => number;
};

declare interface FSType {
    	unlink: (path: string) => void;
    	mkdirTree: (path: string, mode?: number) => void;
    	chdir: (path: string) => void;
    	symlink: (target: string, src: string) => FSNode;
    	createDevice: ((parent: string, name: string, input?: (() => number | null) | null, output?: ((code: number) => void) | null) => FSNode) & {
        		major: number;
        	};
    	closeStream: (fd: number) => void;
    	open: (path: string, flags: string | number, mode?: number) => FSStream;
    	makedev: (major: number, minor: number) => number;
    	mkdev: (path: string, dev: number) => FSNode;
    	filesystems: any;
    	stat: (path: string, dontFollow?: boolean) => any;
    	readdir: (path: string) => string[];
    	isDir: (mode: number) => boolean;
    	isMountpoint: (mode: FSNode) => boolean;
    	lookupPath: (path: string, options?: {
        		follow_mount?: boolean;
        	}) => {
        		node: FSNode;
        	};
    	isFile: (mode: number) => boolean;
    	writeFile: (path: string, contents: any, o?: {
        		canOwn?: boolean;
        	}) => void;
    	chmod: (path: string, mode: number) => void;
    	utime: (path: string, atime: number, mtime: number) => void;
    	rmdir: (path: string) => void;
    	mount: (type: any, opts: any, mountpoint: string) => any;
    	write: (stream: FSStream, buffer: any, offset: number, length: number, position?: number) => number;
    	close: (stream: FSStream) => void;
    	ErrnoError: {
        		new (errno: number): Error;
        	};
    	registerDevice<T>(dev: number, ops: FSStreamOpsGen<T>): void;
    	syncfs(dir: boolean, oncomplete: (val: void) => void): void;
    	findObject(a: string, dontResolveLastLink?: boolean): any;
    	readFile(a: string): Uint8Array;
}

declare type InFuncType = () => null | undefined | string | ArrayBuffer | Uint8Array | number;

declare type LoadedPackages = Record<string, string>;

declare interface MakeToastKernelCallbacksOptions {
    disableProgressToasts?: boolean;
    disableErrorToasts?: boolean;
}

export declare function mount(options: MountOptions, container?: HTMLElement): {
    unmount: () => void;
    install: (requirements: string[]) => Promise<unknown>;
    writeFile: (path: string, data: string | ArrayBufferView, opts?: Record<string, unknown>) => Promise<unknown>;
    renameFile: (oldPath: string, newPath: string) => Promise<unknown>;
    unlink: (path: string) => Promise<unknown>;
    readFile: (path: string, opts?: Record<string, unknown>) => Promise<unknown>;
};

declare type MountOptions = string | DetailedMountOptions;

declare type NativeFS = {
    	syncfs: () => Promise<void>;
};

declare interface PackageData {
    	name: string;
    	version: string;
    	fileName: string;
    	/** @experimental */
    	packageType: PackageType;
}

declare type PackageType = "package" | "cpython_module" | "shared_library" | "static_library";

declare class PyAsyncGenerator extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyAsyncGenerator } from "pyodide/ffi"` instead */
declare interface PyAsyncGenerator extends PyAsyncGeneratorMethods {
}

declare class PyAsyncGeneratorMethods {
    	/**
     	 * Throws an exception into the Generator.
     	 *
     	 * See the documentation for :js:meth:`AsyncGenerator.throw`.
     	 *
     	 * @param exc Error The error to throw into the generator. Must be an
     	 * instanceof ``Error``.
     	 * @returns An Object with two properties: ``done`` and ``value``. When the
     	 * generator yields ``some_value``, ``return`` returns ``{done : false, value
     	 * : some_value}``. When the generator raises a
     	 * ``StopIteration(result_value)`` exception, ``return`` returns ``{done :
     	 * true, value : result_value}``.
     	 */
    	throw(exc: any): Promise<IteratorResult<any, any>>;
    	/**
     	 * Throws a :py:exc:`GeneratorExit` into the generator and if the
     	 * :py:exc:`GeneratorExit` is not caught returns the argument value ``{done:
     	 * true, value: v}``. If the generator catches the :py:exc:`GeneratorExit` and
     	 * returns or yields another value the next value of the generator this is
     	 * returned in the normal way. If it throws some error other than
     	 * :py:exc:`GeneratorExit` or :py:exc:`StopAsyncIteration`, that error is
     	 * propagated. See the documentation for :js:meth:`AsyncGenerator.throw`
     	 *
     	 * @param v The value to return from the generator.
     	 * @returns An Object with two properties: ``done`` and ``value``. When the
     	 * generator yields ``some_value``, ``return`` returns ``{done : false, value
     	 * : some_value}``. When the generator raises a :py:exc:`StopAsyncIteration`
     	 * exception, ``return`` returns ``{done : true, value : result_value}``.
     	 */
    	return(v: any): Promise<IteratorResult<any, any>>;
}

declare class PyAsyncIterable extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyAsyncIterable } from "pyodide/ffi"` instead */
declare interface PyAsyncIterable extends PyAsyncIterableMethods {
}

declare class PyAsyncIterableMethods {
    	/**
     	 * This translates to the Python code ``aiter(obj)``. Return an async iterator
     	 * associated to the proxy. See the documentation for :js:data:`Symbol.asyncIterator`.
     	 *
     	 * This will be used implicitly by ``for(await let x of proxy){}``.
     	 */
    	[Symbol.asyncIterator](): AsyncIterator<any, any, any>;
}

declare class PyAsyncIterator extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyAsyncIterator } from "pyodide/ffi"` instead */
declare interface PyAsyncIterator extends PyAsyncIteratorMethods {
}

declare class PyAsyncIteratorMethods {
    	/** @private */
    	[Symbol.asyncIterator](): this;
    	/**
     	 * This translates to the Python code ``anext(obj)``. Returns the next value
     	 * of the asynchronous iterator. The argument will be sent to the Python
     	 * iterator (if it's a generator for instance).
     	 *
     	 * This will be used implicitly by ``for(let x of proxy){}``.
     	 *
     	 * @param arg The value to send to a generator. The value will be assigned as
     	 * a result of a yield expression.
     	 * @returns An Object with two properties: ``done`` and ``value``. When the
     	 * iterator yields ``some_value``, ``next`` returns ``{done : false, value :
     	 * some_value}``. When the giterator is done, ``next`` returns
     	 * ``{done : true }``.
     	 */
    	next(arg?: any): Promise<IteratorResult<any, any>>;
}

declare class PyAwaitable extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyAwaitable } from "pyodide/ffi"` instead */
declare interface PyAwaitable extends Promise<any> {
}

declare class PyBuffer extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyBuffer;
}

/** @deprecated Use `import type { PyBuffer } from "pyodide/ffi"` instead */
declare interface PyBuffer extends PyBufferMethods {
}

declare class PyBufferMethods {
    	/**
     	 * Get a view of the buffer data which is usable from JavaScript. No copy is
     	 * ever performed.
     	 *
     	 * We do not support suboffsets, if the buffer requires suboffsets we will
     	 * throw an error. JavaScript nd array libraries can't handle suboffsets
     	 * anyways. In this case, you should use the :js:meth:`~PyProxy.toJs` api or
     	 * copy the buffer to one that doesn't use suboffsets (using e.g.,
     	 * :py:func:`numpy.ascontiguousarray`).
     	 *
     	 * If the buffer stores big endian data or half floats, this function will
     	 * fail without an explicit type argument. For big endian data you can use
     	 * :js:meth:`~PyProxy.toJs`. :js:class:`DataView` has support for big endian
     	 * data, so you might want to pass ``'dataview'`` as the type argument in that
     	 * case.
     	 *
     	 * @param type The type of the :js:attr:`~pyodide.ffi.PyBufferView.data` field
     	 * in the output. Should be one of: ``"i8"``, ``"u8"``, ``"u8clamped"``,
     	 * ``"i16"``, ``"u16"``, ``"i32"``, ``"u32"``, ``"i32"``, ``"u32"``,
     	 * ``"i64"``, ``"u64"``, ``"f32"``, ``"f64"``, or ``"dataview"``. This argument
     	 * is optional, if absent :js:meth:`~pyodide.ffi.PyBuffer.getBuffer` will try
     	 * to determine the appropriate output type based on the buffer format string
     	 * (see :std:ref:`struct-format-strings`).
     	 */
    	getBuffer(type?: string): PyBufferView;
}

/** @deprecated Use `import type { PyBufferView } from "pyodide/ffi"` instead */
declare class PyBufferView {
    	/**
     	 * The offset of the first entry of the array. For instance if our array
     	 * is 3d, then you will find ``array[0,0,0]`` at
     	 * ``pybuf.data[pybuf.offset]``
     	 */
    	offset: number;
    	/**
     	 * If the data is read only, you should not modify it. There is no way for us
     	 * to enforce this, but it may cause very weird behavior. See
     	 * :py:attr:`memoryview.readonly`.
     	 */
    	readonly: boolean;
    	/**
     	 * The format string for the buffer. See :ref:`struct-format-strings`
     	 * and :py:attr:`memoryview.format`.
     	 */
    	format: string;
    	/**
     	 * How large is each entry in bytes? See :py:attr:`memoryview.itemsize`.
     	 */
    	itemsize: number;
    	/**
     	 * The number of dimensions of the buffer. If ``ndim`` is 0, the buffer
     	 * represents a single scalar or struct. Otherwise, it represents an
     	 * array. See :py:attr:`memoryview.ndim`.
     	 */
    	ndim: number;
    	/**
     	 * The total number of bytes the buffer takes up. This is equal to
     	 * :js:attr:`buff.data.byteLength <TypedArray.byteLength>`. See
     	 * :py:attr:`memoryview.nbytes`.
     	 */
    	nbytes: number;
    	/**
     	 * The shape of the buffer, that is how long it is in each dimension.
     	 * The length will be equal to ``ndim``. For instance, a 2x3x4 array
     	 * would have shape ``[2, 3, 4]``. See :py:attr:`memoryview.shape`.
     	 */
    	shape: number[];
    	/**
     	 * An array of of length ``ndim`` giving the number of elements to skip
     	 * to get to a new element in each dimension. See the example definition
     	 * of a ``multiIndexToIndex`` function above. See :py:attr:`memoryview.strides`.
     	 */
    	strides: number[];
    	/**
     	 * The actual data. A typed array of an appropriate size backed by a segment
     	 * of the WASM memory.
     	 *
     	 * The ``type`` argument of :js:meth:`~pyodide.ffi.PyBuffer.getBuffer` determines
     	 * which sort of :js:class:`TypedArray` or :js:class:`DataView` to return. By
     	 * default :js:meth:`~pyodide.ffi.PyBuffer.getBuffer` will look at the format string
     	 * to determine the most appropriate option. Most often the result is a
     	 * :js:class:`Uint8Array`.
     	 *
     	 * .. admonition:: Contiguity
     	 *    :class: warning
     	 *
     	 *    If the buffer is not contiguous, the :js:attr:`~PyBufferView.readonly`
     	 *    TypedArray will contain data that is not part of the buffer. Modifying
     	 *    this data leads to undefined behavior.
     	 *
     	 * .. admonition:: Read only buffers
     	 *    :class: warning
     	 *
     	 *    If :js:attr:`buffer.readonly <PyBufferView.readonly>` is ``true``, you
     	 *    should not modify the buffer. Modifying a read only buffer leads to
     	 *    undefined behavior.
     	 *
     	 */
    	data: TypedArray;
    	/**
     	 * Is it C contiguous? See :py:attr:`memoryview.c_contiguous`.
     	 */
    	c_contiguous: boolean;
    	/**
     	 * Is it Fortran contiguous? See :py:attr:`memoryview.f_contiguous`.
     	 */
    	f_contiguous: boolean;
    	/**
     	 * @private
     	 */
    	_released: boolean;
    	/**
     	 * @private
     	 */
    	_view_ptr: number;
    	/** @private */
    	constructor();
    	/**
     	 * Release the buffer. This allows the memory to be reclaimed.
     	 */
    	release(): void;
}

declare class PyCallable extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyCallable;
}

/** @deprecated Use `import type { PyCallable } from "pyodide/ffi"` instead */
declare interface PyCallable extends PyCallableMethods {
    	(...args: any[]): any;
}

declare class PyCallableMethods {
    	/**
     	 * The ``apply()`` method calls the specified function with a given this
     	 * value, and arguments provided as an array (or an array-like object). Like
     	 * :js:meth:`Function.apply`.
     	 *
     	 * @param thisArg The ``this`` argument. Has no effect unless the
     	 * :js:class:`~pyodide.ffi.PyCallable` has :js:meth:`captureThis` set. If
     	 * :js:meth:`captureThis` is set, it will be passed as the first argument to
     	 * the Python function.
     	 * @param jsargs The array of arguments
     	 * @returns The result from the function call.
     	 */
    	apply(thisArg: any, jsargs: any): any;
    	/**
     	 * Calls the function with a given this value and arguments provided
     	 * individually. See :js:meth:`Function.call`.
     	 *
     	 * @param thisArg The ``this`` argument. Has no effect unless the
     	 * :js:class:`~pyodide.ffi.PyCallable` has :js:meth:`captureThis` set. If
     	 * :js:meth:`captureThis` is set, it will be passed as the first argument to
     	 * the Python function.
     	 * @param jsargs The arguments
     	 * @returns The result from the function call.
     	 */
    	call(thisArg: any, ...jsargs: any): any;
    	/**
     	 * Call the Python function. The first parameter controls various parameters
     	 * that change the way the call is performed.
     	 *
     	 * @param options
     	 * @param options.kwargs If true, the last argument is treated as a collection
     	 *                       of keyword arguments.
     	 * @param options.promising If true, the call is made with stack switching
     	 *                          enabled. Not needed if the callee is an async
     	 *                          Python function.
     	 * @param options.relaxed If true, extra arguments are ignored instead of
     	 *                        raising a :py:exc:`TypeError`.
     	 * @param jsargs Arguments to the Python function.
     	 * @returns
     	 */
    	callWithOptions({ relaxed, kwargs, promising, }: {
        		relaxed?: boolean;
        		kwargs?: boolean;
        		promising?: boolean;
        	}, ...jsargs: any): any;
    	/**
     	 * Call the function with keyword arguments. The last argument must be an
     	 * object with the keyword arguments.
     	 */
    	callKwargs(...jsargs: any): any;
    	/**
     	 * Call the function in a "relaxed" manner. Any extra arguments will be
     	 * ignored. This matches the behavior of JavaScript functions more accurately.
     	 *
     	 * Any extra arguments will be ignored. This matches the behavior of
     	 * JavaScript functions more accurately. Missing arguments are **NOT** filled
     	 * with `None`. If too few arguments are passed, this will still raise a
     	 * TypeError.
     	 *
     	 * This uses :py:func:`pyodide.code.relaxed_call`.
     	 */
    	callRelaxed(...jsargs: any): any;
    	/**
     	 * Call the function with keyword arguments in a "relaxed" manner. The last
     	 * argument must be an object with the keyword arguments. Any extra arguments
     	 * will be ignored. This matches the behavior of JavaScript functions more
     	 * accurately.
     	 *
     	 * Missing arguments are **NOT** filled with ``None``. If too few arguments are
     	 * passed, this will still raise a :py:exc:`TypeError`. Also, if the same argument is
     	 * passed as both a keyword argument and a positional argument, it will raise
     	 * an error.
     	 *
     	 * This uses :py:func:`pyodide.code.relaxed_call`.
     	 */
    	callKwargsRelaxed(...jsargs: any): any;
    	/**
     	 * Call the function with stack switching enabled. The last argument must be
     	 * an object with the keyword arguments. Functions called this way can use
     	 * :py:meth:`~pyodide.ffi.run_sync` to block until an
     	 * :py:class:`~collections.abc.Awaitable` is resolved. Only works in runtimes
     	 * with JS Promise integration.
     	 *
     	 * .. admonition:: Experimental
     	 *    :class: warning
     	 *
     	 *    This feature is not yet stable.
     	 *
     	 * @experimental
     	 */
    	callPromising(...jsargs: any): Promise<any>;
    	/**
     	 * Call the function with stack switching enabled. The last argument must be
     	 * an object with the keyword arguments. Functions called this way can use
     	 * :py:meth:`~pyodide.ffi.run_sync` to block until an
     	 * :py:class:`~collections.abc.Awaitable` is resolved. Only works in runtimes
     	 * with JS Promise integration.
     	 *
     	 * .. admonition:: Experimental
     	 *    :class: warning
     	 *
     	 *    This feature is not yet stable.
     	 *
     	 * @experimental
     	 */
    	callPromisingKwargs(...jsargs: any): Promise<any>;
    	/**
     	 * The ``bind()`` method creates a new function that, when called, has its
     	 * ``this`` keyword set to the provided value, with a given sequence of
     	 * arguments preceding any provided when the new function is called. See
     	 * :js:meth:`Function.bind`.
     	 *
     	 * If the :js:class:`~pyodide.ffi.PyCallable` does not have
     	 * :js:meth:`captureThis` set, the ``this`` parameter will be discarded. If it
     	 * does have :js:meth:`captureThis` set, ``thisArg`` will be set to the first
     	 * argument of the Python function. The returned proxy and the original proxy
     	 * have the same lifetime so destroying either destroys both.
     	 *
     	 * @param thisArg The value to be passed as the ``this`` parameter to the
     	 * target function ``func`` when the bound function is called.
     	 * @param jsargs Extra arguments to prepend to arguments provided to the bound
     	 * function when invoking ``func``.
     	 * @returns
     	 */
    	bind(thisArg: any, ...jsargs: any): PyProxy;
    	/**
     	 * Returns a :js:class:`~pyodide.ffi.PyProxy` that passes ``this`` as the first argument to the
     	 * Python function. The returned :js:class:`~pyodide.ffi.PyProxy` has the internal ``captureThis``
     	 * property set.
     	 *
     	 * It can then be used as a method on a JavaScript object. The returned proxy
     	 * and the original proxy have the same lifetime so destroying either destroys
     	 * both.
     	 *
     	 * For example:
     	 *
     	 * .. code-block:: pyodide
     	 *
     	 *    let obj = { a : 7 };
     	 *    pyodide.runPython(`
     	 *      def f(self):
     	 *        return self.a
     	 *    `);
     	 *    // Without captureThis, it doesn't work to use f as a method for obj:
     	 *    obj.f = pyodide.globals.get("f");
     	 *    obj.f(); // raises "TypeError: f() missing 1 required positional argument: 'self'"
     	 *    // With captureThis, it works fine:
     	 *    obj.f = pyodide.globals.get("f").captureThis();
     	 *    obj.f(); // returns 7
     	 *
     	 * @returns The resulting :js:class:`~pyodide.ffi.PyProxy`. It has the same lifetime as the
     	 * original :js:class:`~pyodide.ffi.PyProxy` but passes ``this`` to the wrapped function.
     	 *
     	 */
    	captureThis(): PyProxy;
}

declare class PyContainsMethods {
    	/**
     	 * This translates to the Python code ``key in obj``.
     	 *
     	 * @param key The key to check for.
     	 * @returns Is ``key`` present?
     	 */
    	has(key: any): boolean;
}

declare class PyDict extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyDict } from "pyodide/ffi"` instead */
declare interface PyDict extends PyProxyWithGet, PyProxyWithSet, PyProxyWithHas, PyProxyWithLength, PyIterable {
}

declare class PyGenerator extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyGenerator } from "pyodide/ffi"` instead */
declare interface PyGenerator extends PyGeneratorMethods {
}

declare class PyGeneratorMethods {
    	/**
     	 * Throws an exception into the Generator.
     	 *
     	 * See the documentation for :js:meth:`Generator.throw`.
     	 *
     	 * @param exc Error The error to throw into the generator. Must be an
     	 * instanceof ``Error``.
     	 * @returns An Object with two properties: ``done`` and ``value``. When the
     	 * generator yields ``some_value``, ``return`` returns ``{done : false, value
     	 * : some_value}``. When the generator raises a
     	 * ``StopIteration(result_value)`` exception, ``return`` returns ``{done :
     	 * true, value : result_value}``.
     	 */
    	throw(exc: any): IteratorResult<any, any>;
    	/**
     	 * Throws a :py:exc:`GeneratorExit` into the generator and if the
     	 * :py:exc:`GeneratorExit` is not caught returns the argument value ``{done:
     	 * true, value: v}``. If the generator catches the :py:exc:`GeneratorExit` and
     	 * returns or yields another value the next value of the generator this is
     	 * returned in the normal way. If it throws some error other than
     	 * :py:exc:`GeneratorExit` or :py:exc:`StopIteration`, that error is propagated. See
     	 * the documentation for :js:meth:`Generator.return`.
     	 *
     	 * @param v The value to return from the generator.
     	 * @returns An Object with two properties: ``done`` and ``value``. When the
     	 * generator yields ``some_value``, ``return`` returns ``{done : false, value
     	 * : some_value}``. When the generator raises a
     	 * ``StopIteration(result_value)`` exception, ``return`` returns ``{done :
     	 * true, value : result_value}``.
     	 */
    	return(v: any): IteratorResult<any, any>;
}

declare class PyGetItemMethods {
    	/**
     	 * This translates to the Python code ``obj[key]``.
     	 *
     	 * @param key The key to look up.
     	 * @returns The corresponding value.
     	 */
    	get(key: any): any;
    	/**
     	 * Returns the object treated as a json adaptor.
     	 *
     	 * With a JsonAdaptor:
     	 *  1. property access / modification / deletion is implemented with
     	 *     :meth:`~object.__getitem__`, :meth:`~object.__setitem__`, and
     	 *     :meth:`~object.__delitem__` respectively.
     	 *  2. If an attribute is accessed and the result implements
     	 *     :meth:`~object.__getitem__` then the result will also be a json
     	 *     adaptor.
     	 *
     	 * For instance, ``JSON.stringify(proxy.asJsJson())`` acts like an
     	 * inverse to Python's :py:func:`json.loads`.
     	 */
    	asJsJson(): PyProxy & {};
}

declare class PyIterable extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyIterable } from "pyodide/ffi"` instead */
declare interface PyIterable extends PyIterableMethods {
}

declare class PyIterableMethods {
    	/**
     	 * This translates to the Python code ``iter(obj)``. Return an iterator
     	 * associated to the proxy. See the documentation for
     	 * :js:data:`Symbol.iterator`.
     	 *
     	 * This will be used implicitly by ``for(let x of proxy){}``.
     	 */
    	[Symbol.iterator](): Iterator<any, any, any>;
}

declare class PyIterator extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyIterator } from "pyodide/ffi"` instead */
declare interface PyIterator extends PyIteratorMethods {
}

declare class PyIteratorMethods {
    	/** @private */
    	[Symbol.iterator](): this;
    	/**
     	 * This translates to the Python code ``next(obj)``. Returns the next value of
     	 * the generator. See the documentation for :js:meth:`Generator.next` The
     	 * argument will be sent to the Python generator.
     	 *
     	 * This will be used implicitly by ``for(let x of proxy){}``.
     	 *
     	 * @param arg The value to send to the generator. The value will be assigned
     	 * as a result of a yield expression.
     	 * @returns An Object with two properties: ``done`` and ``value``. When the
     	 * generator yields ``some_value``, ``next`` returns ``{done : false, value :
     	 * some_value}``. When the generator raises a :py:exc:`StopIteration`
     	 * exception, ``next`` returns ``{done : true, value : result_value}``.
     	 */
    	next(arg?: any): IteratorResult<any, any>;
}

declare class PyLengthMethods {
    	/**
     	 * The length of the object.
     	 */
    	get length(): number;
}

declare class PyMutableSequence extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyMutableSequence } from "pyodide/ffi"` instead */
declare interface PyMutableSequence extends PyMutableSequenceMethods {
}

declare class PyMutableSequenceMethods {
    	/**
     	 * The :js:meth:`Array.reverse` method reverses a :js:class:`PyMutableSequence` in
     	 * place.
     	 * @returns A reference to the same :js:class:`PyMutableSequence`
     	 */
    	reverse(): PyMutableSequence;
    	/**
     	 * The :js:meth:`Array.sort` method sorts the elements of a
     	 * :js:class:`PyMutableSequence` in place.
     	 * @param compareFn A function that defines the sort order.
     	 * @returns A reference to the same :js:class:`PyMutableSequence`
     	 */
    	sort(compareFn?: (a: any, b: any) => number): PyMutableSequence;
    	/**
     	 * The :js:meth:`Array.splice` method changes the contents of a
     	 * :js:class:`PyMutableSequence` by removing or replacing existing elements and/or
     	 * adding new elements in place.
     	 * @param start Zero-based index at which to start changing the
     	 * :js:class:`PyMutableSequence`.
     	 * @param deleteCount An integer indicating the number of elements in the
     	 * :js:class:`PyMutableSequence` to remove from ``start``.
     	 * @param items The elements to add to the :js:class:`PyMutableSequence`, beginning from
     	 * ``start``.
     	 * @returns An array containing the deleted elements.
     	 */
    	splice(start: number, deleteCount?: number, ...items: any[]): any[];
    	/**
     	 * The :js:meth:`Array.push` method adds the specified elements to the end of
     	 * a :js:class:`PyMutableSequence`.
     	 * @param elts The element(s) to add to the end of the :js:class:`PyMutableSequence`.
     	 * @returns The new length property of the object upon which the method was
     	 * called.
     	 */
    	push(...elts: any[]): any;
    	/**
     	 * The :js:meth:`Array.pop` method removes the last element from a
     	 * :js:class:`PyMutableSequence`.
     	 * @returns The removed element from the :js:class:`PyMutableSequence`; undefined if the
     	 * :js:class:`PyMutableSequence` is empty.
     	 */
    	pop(): any;
    	/**
     	 * The :js:meth:`Array.shift` method removes the first element from a
     	 * :js:class:`PyMutableSequence`.
     	 * @returns The removed element from the :js:class:`PyMutableSequence`; undefined if the
     	 * :js:class:`PyMutableSequence` is empty.
     	 */
    	shift(): any;
    	/**
     	 * The :js:meth:`Array.unshift` method adds the specified elements to the
     	 * beginning of a :js:class:`PyMutableSequence`.
     	 * @param elts The elements to add to the front of the :js:class:`PyMutableSequence`.
     	 * @returns The new length of the :js:class:`PyMutableSequence`.
     	 */
    	unshift(...elts: any[]): any;
    	/**
     	 * The :js:meth:`Array.copyWithin` method shallow copies part of a
     	 * :js:class:`PyMutableSequence` to another location in the same :js:class:`PyMutableSequence`
     	 * without modifying its length.
     	 * @param target Zero-based index at which to copy the sequence to.
     	 * @param start Zero-based index at which to start copying elements from.
     	 * @param end Zero-based index at which to end copying elements from.
     	 * @returns The modified :js:class:`PyMutableSequence`.
     	 */
    	copyWithin(target: number, start?: number, end?: number): any;
    	/**
     	 * The :js:meth:`Array.fill` method changes all elements in an array to a
     	 * static value, from a start index to an end index.
     	 * @param value Value to fill the array with.
     	 * @param start Zero-based index at which to start filling. Default 0.
     	 * @param end Zero-based index at which to end filling. Default
     	 * ``list.length``.
     	 * @returns
     	 */
    	fill(value: any, start?: number, end?: number): any;
}

declare class PyodideAPI {
    	/** @hidden */
    	static version: string;
    	/** @hidden */
    	static loadPackage: (names: string | PyProxy | Array<string>, options?: {
        		messageCallback?: (message: string) => void;
        		errorCallback?: (message: string) => void;
        		checkIntegrity?: boolean;
        	}) => Promise<Array<PackageData>>;
    	/** @hidden */
    	static loadedPackages: LoadedPackages;
    	/** @hidden */
    	static ffi: {
        		PyProxy: typeof PyProxy;
        		PyProxyWithLength: typeof PyProxyWithLength;
        		PyProxyWithGet: typeof PyProxyWithGet;
        		PyProxyWithSet: typeof PyProxyWithSet;
        		PyProxyWithHas: typeof PyProxyWithHas;
        		PyDict: typeof PyDict;
        		PyIterable: typeof PyIterable;
        		PyAsyncIterable: typeof PyAsyncIterable;
        		PyIterator: typeof PyIterator;
        		PyAsyncIterator: typeof PyAsyncIterator;
        		PyGenerator: typeof PyGenerator;
        		PyAsyncGenerator: typeof PyAsyncGenerator;
        		PyAwaitable: typeof PyAwaitable;
        		PyCallable: typeof PyCallable;
        		PyBuffer: typeof PyBuffer;
        		PyBufferView: typeof PyBufferView;
        		PythonError: typeof PythonError;
        		PySequence: typeof PySequence;
        		PyMutableSequence: typeof PyMutableSequence;
        	};
    	/** @hidden */
    	static setStdin: typeof setStdin;
    	/** @hidden */
    	static setStdout: typeof setStdout;
    	/** @hidden */
    	static setStderr: typeof setStderr;
    	/**
     	 *
     	 * An alias to the global Python namespace.
     	 *
     	 * For example, to access a variable called ``foo`` in the Python global
     	 * scope, use ``pyodide.globals.get("foo")``
     	 */
    	static globals: PyProxy;
    	/**
     	 * An alias to the `Emscripten File System API
     	 * <https://emscripten.org/docs/api_reference/Filesystem-API.html>`_.
     	 *
     	 * This provides a wide range of POSIX-`like` file/device operations, including
     	 * `mount
     	 * <https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.mount>`_
     	 * which can be used to extend the in-memory filesystem with features like `persistence
     	 * <https://emscripten.org/docs/api_reference/Filesystem-API.html#persistent-data>`_.
     	 *
     	 * While all the file systems implementations are enabled, only the default
     	 * ``MEMFS`` is guaranteed to work in all runtime settings. The implementations
     	 * are available as members of ``FS.filesystems``:
     	 * ``IDBFS``, ``NODEFS``, ``PROXYFS``, ``WORKERFS``.
     	 */
    	static FS: FSType;
    	/**
     	 * An alias to the `Emscripten Path API
     	 * <https://github.com/emscripten-core/emscripten/blob/main/src/library_path.js>`_.
     	 *
     	 * This provides a variety of operations for working with file system paths, such as
     	 * ``dirname``, ``normalize``, and ``splitPath``.
     	 */
    	static PATH: any;
    	/**
     	 * APIs to set a canvas for rendering graphics.
     	 * @summaryLink :ref:`canvas <js-api-pyodide-canvas>`
     	 * @omitFromAutoModule
     	 */
    	static canvas: CanvasInterface;
    	/**
     	 * A map from posix error names to error codes.
     	 */
    	static ERRNO_CODES: {
        		[code: string]: number;
        	};
    	/**
     	 * An alias to the Python :ref:`pyodide <python-api>` package.
     	 *
     	 * You can use this to call functions defined in the Pyodide Python package
     	 * from JavaScript.
     	 */
    	static pyodide_py: PyProxy;
    	/**
     	 * Inspect a Python code chunk and use :js:func:`pyodide.loadPackage` to install
     	 * any known packages that the code chunk imports. Uses the Python API
     	 * :func:`pyodide.code.find\_imports` to inspect the code.
     	 *
     	 * For example, given the following code as input
     	 *
     	 * .. code-block:: python
     	 *
     	 *    import numpy as np
     	 *    x = np.array([1, 2, 3])
     	 *
     	 * :js:func:`loadPackagesFromImports` will call
     	 * ``pyodide.loadPackage(['numpy'])``.
     	 *
     	 * @param code The code to inspect.
     	 * @param options Options passed to :js:func:`pyodide.loadPackage`.
     	 * @param options.messageCallback A callback, called with progress messages
     	 *    (optional)
     	 * @param options.errorCallback A callback, called with error/warning messages
     	 *    (optional)
     	 * @param options.checkIntegrity If true, check the integrity of the downloaded
     	 *    packages (default: true)
     	 */
    	static loadPackagesFromImports(code: string, options?: {
        		messageCallback?: (message: string) => void;
        		errorCallback?: (message: string) => void;
        		checkIntegrity?: boolean;
        	}): Promise<Array<PackageData>>;
    	/**
     	 * Runs a string of Python code from JavaScript, using :py:func:`~pyodide.code.eval_code`
     	 * to evaluate the code. If the last statement in the Python code is an
     	 * expression (and the code doesn't end with a semicolon), the value of the
     	 * expression is returned.
     	 *
     	 * @param code The Python code to run
     	 * @param options
     	 * @param options.globals An optional Python dictionary to use as the globals.
     	 *        Defaults to :js:attr:`pyodide.globals`.
     	 * @param options.locals An optional Python dictionary to use as the locals.
     	 *        Defaults to the same as ``globals``.
     	 * @param options.filename An optional string to use as the file name.
     	 *        Defaults to ``"<exec>"``. If a custom file name is given, the
     	 *        traceback for any exception that is thrown will show source lines
     	 *        (unless the given file name starts with ``<`` and ends with ``>``).
     	 * @returns The result of the Python code translated to JavaScript. See the
     	 *          documentation for :py:func:`~pyodide.code.eval_code` for more info.
     	 * @example
     	 * async function main(){
     	 *   const pyodide = await loadPyodide();
     	 *   console.log(pyodide.runPython("1 + 2"));
     	 *   // 3
     	 *
     	 *   const globals = pyodide.toPy({ x: 3 });
     	 *   console.log(pyodide.runPython("x + 1", { globals }));
     	 *   // 4
     	 *
     	 *   const locals = pyodide.toPy({ arr: [1, 2, 3] });
     	 *   console.log(pyodide.runPython("sum(arr)", { locals }));
     	 *   // 6
     	 * }
     	 * main();
     	 */
    	static runPython(code: string, options?: {
        		globals?: PyProxy;
        		locals?: PyProxy;
        		filename?: string;
        	}): any;
    	/**
     	 * Run a Python code string with top level await using
     	 * :py:func:`~pyodide.code.eval_code_async` to evaluate the code. Returns a promise which
     	 * resolves when execution completes. If the last statement in the Python code
     	 * is an expression (and the code doesn't end with a semicolon), the returned
     	 * promise will resolve to the value of this expression.
     	 *
     	 * For example:
     	 *
     	 * .. code-block:: pyodide
     	 *
     	 *    let result = await pyodide.runPythonAsync(`
     	 *        from js import fetch
     	 *        response = await fetch("./pyodide-lock.json")
     	 *        packages = await response.json()
     	 *        # If final statement is an expression, its value is returned to JavaScript
     	 *        len(packages.packages.object_keys())
     	 *    `);
     	 *    console.log(result); // 79
     	 *
     	 * .. admonition:: Python imports
     	 *    :class: warning
     	 *
     	 *    Since pyodide 0.18.0, you must call :js:func:`loadPackagesFromImports` to
     	 *    import any python packages referenced via ``import`` statements in your
     	 *    code. This function will no longer do it for you.
     	 *
     	 * @param code The Python code to run
     	 * @param options
     	 * @param options.globals An optional Python dictionary to use as the globals.
     	 * Defaults to :js:attr:`pyodide.globals`.
     	 * @param options.locals An optional Python dictionary to use as the locals.
     	 *        Defaults to the same as ``globals``.
     	 * @param options.filename An optional string to use as the file name.
     	 *        Defaults to ``"<exec>"``. If a custom file name is given, the
     	 *        traceback for any exception that is thrown will show source lines
     	 *        (unless the given file name starts with ``<`` and ends with ``>``).
     	 * @returns The result of the Python code translated to JavaScript.
     	 */
    	static runPythonAsync(code: string, options?: {
        		globals?: PyProxy;
        		locals?: PyProxy;
        		filename?: string;
        	}): Promise<any>;
    	/**
     	 * Registers the JavaScript object ``module`` as a JavaScript module named
     	 * ``name``. This module can then be imported from Python using the standard
     	 * Python import system. If another module by the same name has already been
     	 * imported, this won't have much effect unless you also delete the imported
     	 * module from :py:data:`sys.modules`. This calls
     	 * :func:`~pyodide.ffi.register_js_module`.
     	 *
     	 * Any attributes of the JavaScript objects which are themselves objects will
     	 * be treated as submodules:
     	 * ```pyodide
     	 * pyodide.registerJsModule("mymodule", { submodule: { value: 7 } });
     	 * pyodide.runPython(`
     	 *     from mymodule.submodule import value
     	 *     assert value == 7
     	 * `);
     	 * ```
     	 * If you wish to prevent this, try the following instead:
     	 * ```pyodide
     	 * const sys = pyodide.pyimport("sys");
     	 * sys.modules.set("mymodule", { obj: { value: 7 } });
     	 * pyodide.runPython(`
     	 *     from mymodule import obj
     	 *     assert obj.value == 7
     	 *     # attempting to treat obj as a submodule raises ModuleNotFoundError:
     	 *     # "No module named 'mymodule.obj'; 'mymodule' is not a package"
     	 *     from mymodule.obj import value
     	 * `);
     	 * ```
     	 *
     	 * @param name Name of the JavaScript module to add
     	 * @param module JavaScript object backing the module
     	 */
    	static registerJsModule(name: string, module: object): void;
    	/**
     	 * Unregisters a JavaScript module with given name that has been previously
     	 * registered with :js:func:`pyodide.registerJsModule` or
     	 * :func:`~pyodide.ffi.register_js_module`. If a JavaScript module with that
     	 * name does not already exist, will throw an error. Note that if the module has
     	 * already been imported, this won't have much effect unless you also delete the
     	 * imported module from :py:data:`sys.modules`. This calls
     	 * :func:`~pyodide.ffi.unregister_js_module`.
     	 *
     	 * @param name Name of the JavaScript module to remove
     	 */
    	static unregisterJsModule(name: string): void;
    	/**
     	 * Convert a JavaScript object to a Python object as best as possible.
     	 *
     	 * This is similar to :py:meth:`~pyodide.ffi.JsProxy.to_py` but for use from
     	 * JavaScript. If the object is immutable or a :js:class:`~pyodide.ffi.PyProxy`,
     	 * it will be returned unchanged. If the object cannot be converted into Python,
     	 * it will be returned unchanged.
     	 *
     	 * See :ref:`type-translations-jsproxy-to-py` for more information.
     	 *
     	 * @param obj The object to convert.
     	 * @param options
     	 * @returns The object converted to Python.
     	 */
    	static toPy(obj: any, { depth, defaultConverter, }?: {
        		/**
         		 *  Optional argument to limit the depth of the conversion.
         		 */
        		depth: number;
        		/**
         		 * Optional argument to convert objects with no default conversion. See the
         		 * documentation of :py:meth:`~pyodide.ffi.JsProxy.to_py`.
         		 */
        		defaultConverter?: (value: any, converter: (value: any) => any, cacheConversion: (input: any, output: any) => void) => any;
        	}): any;
    	/**
     	 * Imports a module and returns it.
     	 *
     	 * If `name` has no dot in it, then `pyimport(name)` is approximately
     	 * equivalent to:
     	 * ```js
     	 * pyodide.runPython(`import ${name}; ${name}`)
     	 * ```
     	 * except that `name` is not introduced into the Python global namespace. If
     	 * the name has one or more dots in it, say it is of the form `path.name`
     	 * where `name` has no dots but path may have zero or more dots. Then it is
     	 * approximately the same as:
     	 * ```js
     	 * pyodide.runPython(`from ${path} import ${name}; ${name}`);
     	 * ```
     	 *
     	 * @param mod_name The name of the module to import
     	 *
     	 * @example
     	 * pyodide.pyimport("math.comb")(4, 2) // returns 4 choose 2 = 6
     	 */
    	static pyimport(mod_name: string): any;
    	/**
     	 * Unpack an archive into a target directory.
     	 *
     	 * @param buffer The archive as an :js:class:`ArrayBuffer` or :js:class:`TypedArray`.
     	 * @param format The format of the archive. Should be one of the formats
     	 * recognized by :py:func:`shutil.unpack_archive`. By default the options are
     	 * ``'bztar'``, ``'gztar'``, ``'tar'``, ``'zip'``, and ``'wheel'``. Several
     	 * synonyms are accepted for each format, e.g., for ``'gztar'`` any of
     	 * ``'.gztar'``, ``'.tar.gz'``, ``'.tgz'``, ``'tar.gz'`` or ``'tgz'`` are
     	 * considered to be
     	 * synonyms.
     	 *
     	 * @param options
     	 * @param options.extractDir The directory to unpack the archive into. Defaults
     	 * to the working directory.
     	 */
    	static unpackArchive(buffer: TypedArray | ArrayBuffer, format: string, options?: {
        		extractDir?: string;
        	}): void;
    	/**
     	 * Mounts a :js:class:`FileSystemDirectoryHandle` into the target directory.
     	 * Currently it's only possible to acquire a
     	 * :js:class:`FileSystemDirectoryHandle` in Chrome.
     	 *
     	 * @param path The absolute path in the Emscripten file system to mount the
     	 * native directory. If the directory does not exist, it will be created. If
     	 * it does exist, it must be empty.
     	 * @param fileSystemHandle A handle returned by
     	 * :js:func:`navigator.storage.getDirectory() <getDirectory>` or
     	 * :js:func:`window.showDirectoryPicker() <showDirectoryPicker>`.
     	 */
    	static mountNativeFS(path: string, fileSystemHandle: FileSystemDirectoryHandle): Promise<NativeFS>;
    	/**
     	 * Mounts a host directory into Pyodide file system. Only works in node.
     	 *
     	 * @param emscriptenPath The absolute path in the Emscripten file system to
     	 * mount the native directory. If the directory does not exist, it will be
     	 * created. If it does exist, it must be empty.
     	 * @param hostPath The host path to mount. It must be a directory that exists.
     	 */
    	static mountNodeFS(emscriptenPath: string, hostPath: string): void;
    	/**
     	 * Tell Pyodide about Comlink.
     	 * Necessary to enable importing Comlink proxies into Python.
     	 */
    	static registerComlink(Comlink: any): void;
    	/**
     	 * Sets the interrupt buffer to be ``interrupt_buffer``. This is only useful
     	 * when Pyodide is used in a webworker. The buffer should be a
     	 * :js:class:`SharedArrayBuffer` shared with the main browser thread (or another
     	 * worker). In that case, signal ``signum`` may be sent by writing ``signum``
     	 * into the interrupt buffer. If ``signum`` does not satisfy 0 < ``signum`` < 65
     	 * it will be silently ignored.
     	 *
     	 * You can disable interrupts by calling ``setInterruptBuffer(undefined)``.
     	 *
     	 * If you wish to trigger a :py:exc:`KeyboardInterrupt`, write ``SIGINT`` (a 2)
     	 * into the interrupt buffer.
     	 *
     	 * By default ``SIGINT`` raises a :py:exc:`KeyboardInterrupt` and all other signals
     	 * are ignored. You can install custom signal handlers with the signal module.
     	 * Even signals that normally have special meaning and can't be overridden like
     	 * ``SIGKILL`` and ``SIGSEGV`` are ignored by default and can be used for any
     	 * purpose you like.
     	 */
    	static setInterruptBuffer(interrupt_buffer: TypedArray): void;
    	/**
     	 * Throws a :py:exc:`KeyboardInterrupt` error if a :py:exc:`KeyboardInterrupt` has
     	 * been requested via the interrupt buffer.
     	 *
     	 * This can be used to enable keyboard interrupts during execution of JavaScript
     	 * code, just as :c:func:`PyErr_CheckSignals` is used to enable keyboard interrupts
     	 * during execution of C code.
     	 */
    	static checkInterrupt(): void;
    	/**
     	 * Turn on or off debug mode. In debug mode, some error messages are improved
     	 * at a performance cost.
     	 * @param debug If true, turn debug mode on. If false, turn debug mode off.
     	 * @returns The old value of the debug flag.
     	 */
    	static setDebug(debug: boolean): boolean;
    	/**
     	 *
     	 * @param param0
     	 * @returns
     	 */
    	static makeMemorySnapshot({ serializer, }?: {
        		serializer?: (obj: any) => any;
        	}): Uint8Array;
}

declare interface PyodideArchive {
    buffer: Parameters<PyodideInterface["unpackArchive"]>[0];
    format: Parameters<PyodideInterface["unpackArchive"]>[1];
    options?: Parameters<PyodideInterface["unpackArchive"]>[2];
}

declare interface PyodideArchiveUrl {
    url: string;
    format: Parameters<PyodideInterface["unpackArchive"]>[1];
    options?: Parameters<PyodideInterface["unpackArchive"]>[2];
}

declare type PyodideConvertiblePrimitive = string | number | boolean | null | undefined;

/** @hidden */
declare type PyodideInterface = typeof PyodideAPI;

/** @deprecated Use `import type { PyProxy } from "pyodide/ffi"` instead */
declare interface PyProxy {
    	[x: string]: any;
}

declare class PyProxy {
    	/** @private */
    	$$flags: number;
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
    	/**
     	 * @hideconstructor
     	 */
    	constructor();
    	/** @hidden */
    	get [Symbol.toStringTag](): string;
    	/**
     	 * The name of the type of the object.
     	 *
     	 * Usually the value is ``"module.name"`` but for builtins or
     	 * interpreter-defined types it is just ``"name"``. As pseudocode this is:
     	 *
     	 * .. code-block:: python
     	 *
     	 *    ty = type(x)
     	 *    if ty.__module__ == 'builtins' or ty.__module__ == "__main__":
     	 *        return ty.__name__
     	 *    else:
     	 *        ty.__module__ + "." + ty.__name__
     	 *
     	 */
    	get type(): string;
    	/**
     	 * Returns `str(o)` (unless `pyproxyToStringRepr: true` was passed to
     	 * :js:func:`~globalThis.loadPyodide` in which case it will return `repr(o)`)
     	 */
    	toString(): string;
    	/**
     	 * Destroy the :js:class:`~pyodide.ffi.PyProxy`. This will release the memory. Any further attempt
     	 * to use the object will raise an error.
     	 *
     	 * In a browser supporting :js:data:`FinalizationRegistry`, Pyodide will
     	 * automatically destroy the :js:class:`~pyodide.ffi.PyProxy` when it is garbage collected, however
     	 * there is no guarantee that the finalizer will be run in a timely manner so
     	 * it is better to destroy the proxy explicitly.
     	 *
     	 * @param options
     	 * @param options.message The error message to print if use is attempted after
     	 *        destroying. Defaults to "Object has already been destroyed".
     	 *
     	 */
    	destroy(options?: {
        		message?: string;
        		destroyRoundtrip?: boolean;
        	}): void;
    	/**
     	 * Make a new :js:class:`~pyodide.ffi.PyProxy` pointing to the same Python object.
     	 * Useful if the :js:class:`~pyodide.ffi.PyProxy` is destroyed somewhere else.
     	 */
    	copy(): PyProxy;
    	/**
     	 * Converts the :js:class:`~pyodide.ffi.PyProxy` into a JavaScript object as best as possible. By
     	 * default does a deep conversion, if a shallow conversion is desired, you can
     	 * use ``proxy.toJs({depth : 1})``. See :ref:`Explicit Conversion of PyProxy
     	 * <type-translations-pyproxy-to-js>` for more info.
     	 * @param options
     	 * @return The JavaScript object resulting from the conversion.
     	 */
    	toJs({ depth, pyproxies, create_pyproxies, dict_converter, default_converter, eager_converter, }?: {
        		/** How many layers deep to perform the conversion. Defaults to infinite */
        		depth?: number;
        		/**
         		 * If provided, :js:meth:`toJs` will store all PyProxies created in this
         		 * list. This allows you to easily destroy all the PyProxies by iterating
         		 * the list without having to recurse over the generated structure. The most
         		 * common use case is to create a new empty list, pass the list as
         		 * ``pyproxies``, and then later iterate over ``pyproxies`` to destroy all of
         		 * created proxies.
         		 */
        		pyproxies?: PyProxy[];
        		/**
         		 * If false, :js:meth:`toJs` will throw a
         		 * :py:exc:`~pyodide.ffi.ConversionError` rather than producing a
         		 * :js:class:`~pyodide.ffi.PyProxy`.
         		 */
        		create_pyproxies?: boolean;
        		/**
         		 * A function to be called on an iterable of pairs ``[key, value]``. Convert
         		 * this iterable of pairs to the desired output. For instance,
         		 * :js:func:`Object.fromEntries` would convert the dict to an object,
         		 * :js:func:`Array.from` converts it to an :js:class:`Array` of pairs, and
         		 * ``(it) => new Map(it)`` converts it to a :js:class:`Map` (which is the
         		 * default behavior).
         		 */
        		dict_converter?: (array: Iterable<[
        			key: string,
        			value: any
        		]>) => any;
        		/**
         		 * Optional argument to convert objects with no default conversion. See the
         		 * documentation of :meth:`~pyodide.ffi.to_js`.
         		 */
        		default_converter?: (obj: PyProxy, convert: (obj: PyProxy) => any, cacheConversion: (obj: PyProxy, result: any) => void) => any;
        		/**
         		 * Optional callback to convert objects which gets called after ``str``,
         		 * ``int``, ``float``, ``bool``, ``None``, and ``JsProxy`` are converted but
         		 * *before* any default conversions are applied to standard data structures.
         		 *
         		 * Its arguments are the same as `dict_converter`.
         		 * See the documentation of :meth:`~pyodide.ffi.to_js`.
         		 */
        		eager_converter?: (obj: PyProxy, convert: (obj: PyProxy) => any, cacheConversion: (obj: PyProxy, result: any) => void) => any;
        	}): any;
}

declare class PyProxyWithGet extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyProxyWithGet } from "pyodide/ffi"` instead */
declare interface PyProxyWithGet extends PyGetItemMethods {
}

declare class PyProxyWithHas extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyProxyWithHas } from "pyodide/ffi"` instead */
declare interface PyProxyWithHas extends PyContainsMethods {
}

declare class PyProxyWithLength extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyProxyWithLength } from "pyodide/ffi"` instead */
declare interface PyProxyWithLength extends PyLengthMethods {
}

declare class PyProxyWithSet extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PyProxyWithSet } from "pyodide/ffi"` instead */
declare interface PyProxyWithSet extends PySetItemMethods {
}

declare class PySequence extends PyProxy {
    	/** @private */
    	static [Symbol.hasInstance](obj: any): obj is PyProxy;
}

/** @deprecated Use `import type { PySequence } from "pyodide/ffi"` instead */
declare interface PySequence extends PySequenceMethods {
}

declare class PySequenceMethods {
    	/** @hidden */
    	get [Symbol.isConcatSpreadable](): boolean;
    	/**
     	 * See :js:meth:`Array.join`. The :js:meth:`Array.join` method creates and
     	 * returns a new string by concatenating all of the elements in the
     	 * :py:class:`~collections.abc.Sequence`.
     	 *
     	 * @param separator A string to separate each pair of adjacent elements of the
     	 * Sequence.
     	 *
     	 * @returns  A string with all Sequence elements joined.
     	 */
    	join(separator?: string): string;
    	/**
     	 * See :js:meth:`Array.slice`. The :js:meth:`Array.slice` method returns a
     	 * shallow copy of a portion of a :py:class:`~collections.abc.Sequence` into a
     	 * new array object selected from ``start`` to ``stop`` (`stop` not included)
     	 * @param start Zero-based index at which to start extraction. Negative index
     	 * counts back from the end of the Sequence.
     	 * @param stop Zero-based index at which to end extraction. Negative index
     	 * counts back from the end of the Sequence.
     	 * @returns A new array containing the extracted elements.
     	 */
    	slice(start?: number, stop?: number): any;
    	/**
     	 * See :js:meth:`Array.lastIndexOf`. Returns the last index at which a given
     	 * element can be found in the Sequence, or -1 if it is not present.
     	 * @param elt Element to locate in the Sequence.
     	 * @param fromIndex Zero-based index at which to start searching backwards,
     	 * converted to an integer. Negative index counts back from the end of the
     	 * Sequence.
     	 * @returns The last index of the element in the Sequence; -1 if not found.
     	 */
    	lastIndexOf(elt: any, fromIndex?: number): number;
    	/**
     	 * See :js:meth:`Array.indexOf`. Returns the first index at which a given
     	 * element can be found in the Sequence, or -1 if it is not present.
     	 * @param elt Element to locate in the Sequence.
     	 * @param fromIndex Zero-based index at which to start searching, converted to
     	 * an integer. Negative index counts back from the end of the Sequence.
     	 * @returns The first index of the element in the Sequence; -1 if not found.
     	 */
    	indexOf(elt: any, fromIndex?: number): number;
    	/**
     	 * See :js:meth:`Array.forEach`. Executes a provided function once for each
     	 * ``Sequence`` element.
     	 * @param callbackfn A function to execute for each element in the ``Sequence``. Its
     	 * return value is discarded.
     	 * @param thisArg A value to use as ``this`` when executing ``callbackFn``.
     	 */
    	forEach(callbackfn: (elt: any) => void, thisArg?: any): void;
    	/**
     	 * See :js:meth:`Array.map`. Creates a new array populated with the results of
     	 * calling a provided function on every element in the calling ``Sequence``.
     	 * @param callbackfn A function to execute for each element in the ``Sequence``. Its
     	 * return value is added as a single element in the new array.
     	 * @param thisArg A value to use as ``this`` when executing ``callbackFn``.
     	 */
    	map<U>(callbackfn: (elt: any, index: number, array: any) => U, thisArg?: any): U[];
    	/**
     	 * See :js:meth:`Array.filter`. Creates a shallow copy of a portion of a given
     	 * ``Sequence``, filtered down to just the elements from the given array that pass
     	 * the test implemented by the provided function.
     	 * @param predicate A function to execute for each element in the array. It
     	 * should return a truthy value to keep the element in the resulting array,
     	 * and a falsy value otherwise.
     	 * @param thisArg A value to use as ``this`` when executing ``predicate``.
     	 */
    	filter(predicate: (elt: any, index: number, array: any) => boolean, thisArg?: any): any[];
    	/**
     	 * See :js:meth:`Array.some`. Tests whether at least one element in the
     	 * ``Sequence`` passes the test implemented by the provided function.
     	 * @param predicate A function to execute for each element in the
     	 * ``Sequence``. It should return a truthy value to indicate the element
     	 * passes the test, and a falsy value otherwise.
     	 * @param thisArg A value to use as ``this`` when executing ``predicate``.
     	 */
    	some(predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): boolean;
    	/**
     	 * See :js:meth:`Array.every`. Tests whether every element in the ``Sequence``
     	 * passes the test implemented by the provided function.
     	 * @param predicate A function to execute for each element in the
     	 * ``Sequence``. It should return a truthy value to indicate the element
     	 * passes the test, and a falsy value otherwise.
     	 * @param thisArg A value to use as ``this`` when executing ``predicate``.
     	 */
    	every(predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): boolean;
    	/**
     	 * See :js:meth:`Array.reduce`. Executes a user-supplied "reducer" callback
     	 * function on each element of the Sequence, in order, passing in the return
     	 * value from the calculation on the preceding element. The final result of
     	 * running the reducer across all elements of the Sequence is a single value.
     	 * @param callbackfn A function to execute for each element in the ``Sequence``. Its
     	 * return value is discarded.
     	 */
    	reduce(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any) => any, initialValue?: any): any;
    	/**
     	 * See :js:meth:`Array.reduceRight`. Applies a function against an accumulator
     	 * and each value of the Sequence (from right to left) to reduce it to a
     	 * single value.
     	 * @param callbackfn A function to execute for each element in the Sequence.
     	 * Its return value is discarded.
     	 */
    	reduceRight(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any) => any, initialValue: any): any;
    	/**
     	 * See :js:meth:`Array.at`. Takes an integer value and returns the item at
     	 * that index.
     	 * @param index Zero-based index of the Sequence element to be returned,
     	 * converted to an integer. Negative index counts back from the end of the
     	 * Sequence.
     	 * @returns The element in the Sequence matching the given index.
     	 */
    	at(index: number): any;
    	/**
     	 * The :js:meth:`Array.concat` method is used to merge two or more arrays.
     	 * This method does not change the existing arrays, but instead returns a new
     	 * array.
     	 * @param rest Arrays and/or values to concatenate into a new array.
     	 * @returns A new Array instance.
     	 */
    	concat(...rest: ConcatArray<any>[]): any[];
    	/**
     	 * The  :js:meth:`Array.includes` method determines whether a Sequence
     	 * includes a certain value among its entries, returning true or false as
     	 * appropriate.
     	 * @param elt
     	 * @returns
     	 */
    	includes(elt: any): any;
    	/**
     	 * The :js:meth:`Array.entries` method returns a new iterator object that
     	 * contains the key/value pairs for each index in the ``Sequence``.
     	 * @returns A new iterator object.
     	 */
    	entries(): IterableIterator<[
    		number,
    		any
    	]>;
    	/**
     	 * The :js:meth:`Array.keys` method returns a new iterator object that
     	 * contains the keys for each index in the ``Sequence``.
     	 * @returns A new iterator object.
     	 */
    	keys(): IterableIterator<number>;
    	/**
     	 * The :js:meth:`Array.values` method returns a new iterator object that
     	 * contains the values for each index in the ``Sequence``.
     	 * @returns A new iterator object.
     	 */
    	values(): IterableIterator<any>;
    	/**
     	 * The :js:meth:`Array.find` method returns the first element in the provided
     	 * array that satisfies the provided testing function.
     	 * @param predicate A function to execute for each element in the
     	 * ``Sequence``. It should return a truthy value to indicate a matching
     	 * element has been found, and a falsy value otherwise.
     	 * @param thisArg A value to use as ``this`` when executing ``predicate``.
     	 * @returns The first element in the ``Sequence`` that satisfies the provided
     	 * testing function.
     	 */
    	find(predicate: (value: any, index: number, obj: any[]) => any, thisArg?: any): any;
    	/**
     	 * The :js:meth:`Array.findIndex` method returns the index of the first
     	 * element in the provided array that satisfies the provided testing function.
     	 * @param predicate A function to execute for each element in the
     	 * ``Sequence``. It should return a truthy value to indicate a matching
     	 * element has been found, and a falsy value otherwise.
     	 * @param thisArg A value to use as ``this`` when executing ``predicate``.
     	 * @returns The index of the first element in the ``Sequence`` that satisfies
     	 * the provided testing function.
     	 */
    	findIndex(predicate: (value: any, index: number, obj: any[]) => any, thisArg?: any): number;
    	toJSON(this: any): unknown[];
    	/**
     	 * Returns the object treated as a json adaptor.
     	 *
     	 * With a JsonAdaptor:
     	 *  1. property access / modification / deletion is implemented with
     	 *     :meth:`~object.__getitem__`, :meth:`~object.__setitem__`, and
     	 *     :meth:`~object.__delitem__` respectively.
     	 *  2. If an attribute is accessed and the result implements
     	 *     :meth:`~object.__getitem__` then the result will also be a json
     	 *     adaptor.
     	 *
     	 * For instance, ``JSON.stringify(proxy.asJsJson())`` acts like an
     	 * inverse to Python's :py:func:`json.loads`.
     	 */
    	asJsJson(): PyProxy & {};
}

declare class PySetItemMethods {
    	/**
     	 * This translates to the Python code ``obj[key] = value``.
     	 *
     	 * @param key The key to set.
     	 * @param value The value to set it to.
     	 */
    	set(key: any, value: any): void;
    	/**
     	 * This translates to the Python code ``del obj[key]``.
     	 *
     	 * @param key The key to delete.
     	 */
    	delete(key: any): void;
}

declare class PythonError extends Error {
    	/**
     	 * The address of the error we are wrapping. We may later compare this
     	 * against sys.last_exc.
     	 * WARNING: we don't own a reference to this pointer, dereferencing it
     	 * may be a use-after-free error!
     	 * @private
     	 */
    	__error_address: number;
    	/**
     	 * The name of the Python error class, e.g, :py:exc:`RuntimeError` or
     	 * :py:exc:`KeyError`.
     	 */
    	type: string;
    	constructor(type: string, message: string, error_address: number);
}

declare function setStderr(options?: {
    	batched?: (output: string) => void;
    	raw?: (charCode: number) => void;
    	write?: (buffer: Uint8Array) => number;
    	isatty?: boolean;
}): void;

declare function setStdin(options?: {
    	stdin?: InFuncType;
    	read?: (buffer: Uint8Array) => number;
    	error?: boolean;
    	isatty?: boolean;
    	autoEOF?: boolean;
}): void;

declare function setStdout(options?: {
    	batched?: (output: string) => void;
    	raw?: (charCode: number) => void;
    	write?: (buffer: Uint8Array) => number;
    	isatty?: boolean;
}): void;

declare type SimplifiedStliteKernelOptions = Partial<{
    entrypoint: string;
    requirements: StliteKernelOptions["requirements"];
    prebuiltPackageNames: StliteKernelOptions["prebuiltPackageNames"];
    files: Record<string, EmscriptenFile | EmscriptenFileUrl | EmscriptenFile["data"]>;
    archives: StliteKernelOptions["archives"];
    hostConfig: StliteKernelOptions["hostConfigResponse"];
    pyodideUrl: StliteKernelOptions["pyodideUrl"];
    wheelUrls: StliteKernelOptions["wheelUrls"];
    streamlitConfig: StliteKernelOptions["streamlitConfig"];
    idbfsMountpoints: StliteKernelOptions["idbfsMountpoints"];
    workerType: StliteKernelOptions["workerType"];
    sharedWorker: StliteKernelOptions["sharedWorker"];
    env: StliteKernelOptions["env"];
}>;

declare interface StliteKernelOptions {
    /**
     * The file path on the Pyodide File System (Emscripten FS) to be set as a target of the `run` command.
     */
    entrypoint: string;
    /**
     * A list of package names to be install at the booting-up phase.
     */
    requirements: string[];
    /**
     * A list of prebuilt package names to be install at the booting-up phase via `pyodide.loadPackage()`.
     * These packages basically can be installed via the `requirements` option,
     * but some are only installable via this option such as `openssl`.
     */
    prebuiltPackageNames: string[];
    /**
     * Files to mount.
     */
    files: Record<string, EmscriptenFile | EmscriptenFileUrl>;
    /**
     * Archives to unpack and mount.
     */
    archives: Array<PyodideArchive | PyodideArchiveUrl>;
    /**
     * The URL of `pyodide.js` or `pyodide.mjs` to be loaded in the worker.
     * If not specified, the default one is used.
     */
    pyodideUrl?: string;
    wheelUrls?: {
        stliteLib: string;
        streamlit: string;
    };
    /**
     * In the original Streamlit, the `hostConfig` endpoint returns a value of this type
     * and the frontend app fetches it (https://github.com/streamlit/streamlit/blob/1.30.0/frontend/app/src/connection/WebsocketConnection.tsx#L696-L703)
     * and passes it to the `onHostConfigResp` callback to configure the app (https://github.com/streamlit/streamlit/blob/1.30.0/frontend/app/src/App.tsx#L393-L415).
     * Instead, in stlite, this value can be configured through this property,
     * which is passed to the `ConnectionManager` class to call `onHostConfigResp` from it.
     * One of the usages in stlite is to configure the `allowedOrigins` property
     * for VSCode extension to use the iframe messaging to solve the problem of https://github.com/whitphx/stlite/issues/519
     * by sending the `SET_PAGE_LINK_BASE_URL` message to the app in a WebView panel to override the URL scheme of the links.
     * Note that Streamlit's iframe messaging referred to here is different from the iframe messaging mechanism implemented for the iframe embedded on stlite sharing.
     */
    hostConfigResponse?: IHostConfigResponse;
    /**
     * The `pathname` that will be used as both
     * a base path of the custom component URLs
     * ana the path of the main page in MPA.
     *
     * If not specified, the value of `window.location.pathname` at the time of the class initialization is used.
     * This default is good enough for most cases, however,
     * it may be a problem if the server is configured to return the main page even if the URL is pointing to the subpath.
     * In such a setting, problems like https://github.com/whitphx/stlite/issues/171 may happen,
     * so explicitly setting `basePath` is recommended.
     */
    basePath?: string;
    /**
     * Streamlit configurations described in https://docs.streamlit.io/library/advanced-features/configuration.
     * These values can be configured through this property as key-value pairs.
     * The keys are the same as the ones passed to the `streamlit run` shell command as `--` options (flags).
     * For example, `--logger.level info` is passed as `{ "logger.level": "info" }`.
     */
    streamlitConfig?: StreamlitConfig;
    idbfsMountpoints?: WorkerInitialData["idbfsMountpoints"];
    moduleAutoLoad?: WorkerInitialData["moduleAutoLoad"];
    onModuleAutoLoad?: (packagesToLoad: string[], installPromise: Promise<PackageData[]>) => void;
    onProgress?: (message: string) => void;
    onLoad?: () => void;
    onError?: (error: Error) => void;
    workerType?: WorkerOptions["type"];
    sharedWorker?: boolean;
    env?: Record<string, string>;
    /**
     * Set to true to load the python language server libraries
     * And enable methods like getCodeCompletions
     */
    languageServer?: boolean;
    /**
     * The worker to be used, which can be optionally passed.
     * Desktop apps with NodeJS-backed worker is one use case.
     */
    worker?: globalThis.Worker;
}

declare interface StreamlitConfig {
    [key: string]: PyodideConvertiblePrimitive;
}

/** @deprecated Use `import type { TypedArray } from "pyodide/ffi"` instead */
declare type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;

declare interface WorkerInitialData {
    entrypoint: string;
    files: Record<string, EmscriptenFile | EmscriptenFileUrl>;
    archives: Array<PyodideArchive | PyodideArchiveUrl>;
    requirements: string[];
    prebuiltPackageNames: string[];
    pyodideUrl?: string;
    wheels?: {
        stliteLib: string;
        streamlit: string;
    };
    streamlitConfig?: StreamlitConfig;
    idbfsMountpoints?: string[];
    nodefsMountpoints?: Record<string, string>;
    moduleAutoLoad: boolean;
    env?: Record<string, string>;
    languageServer?: boolean;
}

export { }
