playground := packages/playground/build/*
mountable := packages/mountable/build/*
sharing := packages/sharing/build/*
sharing-common := packages/sharing-common/dist/*
sharing-editor := packages/sharing-editor/build/*
stlite_kernel := packages/stlite-kernel/dist/*
pyarrow_wheel := packages/stlite-kernel/py/stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl
tornado_wheel := packages/stlite-kernel/py/tornado/dist/tornado-6.2-py3-none-any.whl
streamlit_proto := streamlit/frontend/src/autogen
streamlit_wheel := streamlit/lib/dist/streamlit-1.12.0-py2.py3-none-any.whl

.PHONY: all
all: init mountable playground sharing sharing-editor


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
yarn_install: git_submodules $(NODE_MODULES)
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


.PHONY: mountable
mountable: $(mountable)
$(mountable): packages/mountable/src/*.ts packages/mountable/src/*.tsx $(stlite_kernel) $(streamlit_wheel)
	cd packages/mountable; \
	yarn build
	@touch $@

.PHONY: sharing
sharing: $(sharing)
$(sharing): packages/sharing/src/*.ts packages/sharing/src/*.tsx $(stlite_kernel) $(streamlit_wheel) $(sharing-common) yarn_install
	cd packages/sharing; \
	yarn build
	@touch $@

$(sharing-common): packages/sharing-common/src/*.ts yarn_install
	cd packages/sharing-common; \
	yarn build
	@touch $@

.PHONY: sharing-editor
sharing-editor: $(sharing-editor)
$(sharing-editor): packages/sharing-editor/src/*.ts packages/sharing-editor/src/*.tsx $(sharing-common) yarn_install
	cd packages/sharing-editor; \
	yarn build
	@touch $@

.PHONY: playground
playground: $(playground)
$(playground): packages/playground/src/*.ts packages/playground/src/*.tsx packages/playground/public/* $(stlite_kernel) $(streamlit_wheel)
	cd packages/playground; \
	yarn build
	@touch $@

$(stlite_kernel): packages/stlite-kernel/src/*.ts $(pyarrow_wheel) $(tornado_wheel) $(streamlit_proto)
	cd packages/stlite-kernel; \
	yarn build
	@touch $@

$(pyarrow_wheel): $(VENV) packages/stlite-kernel/py/stlite-pyarrow/pyarrow/*.py
	. $(VENV)/bin/activate && \
	cd packages/stlite-kernel/py/stlite-pyarrow && \
	poetry build

$(tornado_wheel): $(VENV) packages/stlite-kernel/py/tornado/tornado/*.py
	. $(VENV)/bin/activate && \
	cd packages/stlite-kernel/py/tornado && \
	TORNADO_EXTENSION=0 python -m build --wheel
	@touch $@

$(streamlit_proto): $(VENV) streamlit/proto/streamlit/proto/*.proto
	. $(VENV)/bin/activate && \
	cd streamlit; \
	$(MAKE) mini-init
	@touch $@

$(streamlit_wheel): $(VENV) streamlit/lib/streamlit/**/*.py streamlit/lib/Pipfile streamlit/lib/setup.py streamlit/lib/bin/* streamlit/lib/MANIFEST.in
	. $(VENV)/bin/activate && \
	cd streamlit && \
	make distribution
	@touch $@


.PHONY: serve
serve: $(VENV)
	. $(VENV)/bin/activate && \
	cd packages/playground/build && \
	python -m http.server 5001
