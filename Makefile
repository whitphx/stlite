all: playground

.PHONY: playground
playground: packages/playground/build

packages/playground/build: packages/playground/src/**/*.ts packages/playground/public/* packages/stlite-kernel/dist streamlit/lib/dist/streamlit-1.9.0rc1-py2.py3-none-any.whl
	cd packages/playground; \
	yarn build

packages/stlite-kernel/dist: packages/stlite-kernel/src/**/*.ts packages/stlite-kernel/py/stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl packages/stlite-kernel/py/stlite-tornado/dist/stlite_tornado-0.1.0-py3-none-any.whl packages/stlite-kernel/thirdparty/blinker/dist/blinker-1.4-py3-none-any.whl streamlit-browser/src/autogen/*
	cd packages/stlite-kernel; \
	yarn build

packages/stlite-kernel/py/stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl: packages/stlite-kernel/py/stlite-pyarrow/pyarrow/*.py
	. ./.venv/bin/activate && \
	cd packages/stlite-kernel/py/stlite-pyarrow && \
	poetry build

packages/stlite-kernel/py/stlite-tornado/dist/stlite_tornado-0.1.0-py3-none-any.whl: packages/stlite-kernel/py/stlite-tornado/tornado/**/*.py
	. ./.venv/bin/activate && \
	cd packages/stlite-kernel/py/stlite-tornado && \
	poetry build

packages/stlite-kernel/thirdparty/blinker/dist/blinker-1.4-py3-none-any.whl: packages/stlite-kernel/thirdparty/blinker/blinker/*.py
	. ./.venv/bin/activate && \
	cd packages/stlite-kernel/thirdparty/blinker && \
	python -m build; \
	rm -rf *.egg-info

streamlit-browser/src/autogen/*:
	. ./.venv/bin/activate && \
	cd streamlit; \
	make mini-devel

streamlit/lib/dist/streamlit-1.9.0rc1-py2.py3-none-any.whl: streamlit/lib/streamlit/**/*.py streamlit/lib/Pipfile streamlit/lib/setup.py streamlit/lib/bin/* streamlit/lib/MANIFEST.in
	. ./.venv/bin/activate && \
	cd streamlit && \
	make distribution

.PHONY: init
init:
	git submodule update --init
	yarn
	[ -d .venv ] || python -m venv .venv
	. ./.venv/bin/activate && python -m pip install build
	echo "Python virtualenv has been set up. Run\n. ./.venv/bin/activate"
