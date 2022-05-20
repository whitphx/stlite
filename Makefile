playground := packages/playground/build/*
stlite_kernel := packages/stlite-kernel/dist/*
pyarrow_wheel := packages/stlite-kernel/py/stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl
tornado_wheel := packages/stlite-kernel/py/stlite-tornado/dist/stlite_tornado-0.1.0-py3-none-any.whl
blinker_wheel := packages/stlite-kernel/thirdparty/blinker/dist/blinker-1.4-py3-none-any.whl
streamlit_proto := streamlit/frontend/src/autogen
streamlit_wheel := streamlit/lib/dist/streamlit-1.9.0rc1-py2.py3-none-any.whl

all: playground

.PHONY: playground
playground: $(playground)

.PHONY: serve
serve:
	. ./.venv/bin/activate && \
	cd packages/playground/build && \
	python -m http.server 5001

$(playground): packages/playground/src/*.ts packages/playground/src/*.tsx packages/playground/public/* $(stlite_kernel) $(streamlit_wheel)
	cd packages/playground; \
	yarn build

$(stlite_kernel): packages/stlite-kernel/src/*.ts $(pyarrow_wheel) $(tornado_wheel) $(blinker_wheel) $(streamlit_proto)
	cd packages/stlite-kernel; \
	yarn build

$(pyarrow_wheel): packages/stlite-kernel/py/stlite-pyarrow/pyarrow/*.py
	. ./.venv/bin/activate && \
	cd packages/stlite-kernel/py/stlite-pyarrow && \
	poetry build

$(tornado_wheel): packages/stlite-kernel/py/stlite-tornado/tornado/*.py
	. ./.venv/bin/activate && \
	cd packages/stlite-kernel/py/stlite-tornado && \
	poetry build

$(blinker_wheel): packages/stlite-kernel/thirdparty/blinker/blinker/*.py
	. ./.venv/bin/activate && \
	cd packages/stlite-kernel/thirdparty/blinker && \
	python -m build; \
	rm -rf *.egg-info

$(streamlit_proto): streamlit/proto/streamlit/proto/*.proto
	. ./.venv/bin/activate && \
	cd streamlit; \
	$(MAKE) mini-init

$(streamlit_wheel): streamlit/lib/streamlit/**/*.py streamlit/lib/Pipfile streamlit/lib/setup.py streamlit/lib/bin/* streamlit/lib/MANIFEST.in
	. ./.venv/bin/activate && \
	cd streamlit && \
	make distribution

.PHONY: init
init:
	git submodule update --init
	yarn install --frozen-lockfile
	[ -d .venv ] || python -m venv .venv
	. ./.venv/bin/activate && python -m pip install build
	@echo "\nPython virtualenv has been set up. Run the command below to activate.\n\n. ./.venv/bin/activate"
