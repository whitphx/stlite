playground := packages/playground/build/*
application := packages/application/build/*
stlite_kernel := packages/stlite-kernel/dist/*
pyarrow_wheel := packages/stlite-kernel/py/stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl
tornado_wheel := packages/stlite-kernel/py/stlite-tornado/dist/stlite_tornado-0.1.0-py3-none-any.whl
blinker_wheel := packages/stlite-kernel/thirdparty/blinker/dist/blinker-1.4-py3-none-any.whl
streamlit_proto := streamlit/frontend/src/autogen
streamlit_wheel := streamlit/lib/dist/streamlit-1.9.2-py2.py3-none-any.whl

all: init application playground

.PHONY: application
application: $(application)

.PHONY: playground
playground: $(playground)

.PHONY: serve
serve: $(VENV)
	. $(VENV)/bin/activate && \
	cd packages/playground/build && \
	python -m http.server 5001

$(application): packages/application/src/*.ts packages/application/src/*.tsx $(stlite_kernel) $(streamlit_wheel)
	cd packages/application; \
	yarn build

$(playground): packages/playground/src/*.ts packages/playground/src/*.tsx packages/playground/public/* $(stlite_kernel) $(streamlit_wheel)
	cd packages/playground; \
	yarn build

$(stlite_kernel): packages/stlite-kernel/src/*.ts $(pyarrow_wheel) $(tornado_wheel) $(blinker_wheel) $(streamlit_proto)
	cd packages/stlite-kernel; \
	yarn build

$(pyarrow_wheel): $(VENV) packages/stlite-kernel/py/stlite-pyarrow/pyarrow/*.py
	. $(VENV)/bin/activate && \
	cd packages/stlite-kernel/py/stlite-pyarrow && \
	poetry build

$(tornado_wheel): $(VENV) packages/stlite-kernel/py/stlite-tornado/tornado/*.py
	. $(VENV)/bin/activate && \
	cd packages/stlite-kernel/py/stlite-tornado && \
	poetry build

$(blinker_wheel): $(VENV) packages/stlite-kernel/thirdparty/blinker/blinker/*.py
	. $(VENV)/bin/activate && \
	cd packages/stlite-kernel/thirdparty/blinker && \
	python -m build; \
	rm -rf *.egg-info

$(streamlit_proto): $(VENV) streamlit/proto/streamlit/proto/*.proto
	. $(VENV)/bin/activate && \
	cd streamlit; \
	$(MAKE) mini-init

$(streamlit_wheel): $(VENV) streamlit/lib/streamlit/**/*.py streamlit/lib/Pipfile streamlit/lib/setup.py streamlit/lib/bin/* streamlit/lib/MANIFEST.in
	. $(VENV)/bin/activate && \
	cd streamlit && \
	make distribution


.PHONY: init
init: git_submodules venv node_modules

VENV := ./.venv
NODE_MODULES := ./node_modules

.PHONY: venv
venv: $(VENV)
$(VENV):
	[ -d $(VENV) ] || python -m venv $(VENV)
	. $(VENV)/bin/activate && python -m pip install -U pip && python -m pip install build poetry
	@echo "\nPython virtualenv has been set up. Run the command below to activate.\n\n. $(VENV)/bin/activate"

.PHONY: yarn_install
yarn_install: $(NODE_MODULES)
$(NODE_MODULES):
	yarn install --frozen-lockfile

# https://gist.github.com/enil/e4af160c745057809053329df4ba1dc2
GIT=git
GIT_SUBMODULES=$(shell sed -nE 's/path = +(.+)/\1\/.git/ p' .gitmodules | paste -s -)

.PHONY: git_submodules
git_submodules: $(GIT_SUBMODULES)
$(GIT_SUBMODULES): %/.git: .gitmodules
	$(GIT) submodule init
	$(GIT) submodule update $*
	@touch $@
