common := packages/common/dist/*
common-react := packages/common-react/dist/*
mountable := packages/mountable/build/*
sharing := packages/sharing/build/*
sharing-common := packages/sharing-common/dist/*
sharing-editor := packages/sharing-editor/build/*
desktop := packages/desktop/build/*
kernel := packages/kernel/dist/*
stlite-server-wheel := packages/kernel/py/stlite-server/dist/stlite_server-0.1.0-py3-none-any.whl
streamlit_proto := streamlit/frontend/src/lib/proto.d.ts
streamlit_wheel := packages/kernel/py/streamlit/lib/dist/streamlit-1.24.0-cp311-none-any.whl

.PHONY: all
all: init mountable sharing sharing-editor


.PHONY: init
init: git_submodules venv node_modules

VENV := ./.venv
NODE_MODULES := ./node_modules

.PHONY: venv
venv: $(VENV)
$(VENV): requirements.dev.txt
	[ -d $(VENV) ] || python -m venv $(VENV)
	. $(VENV)/bin/activate && python -m pip install -U pip && python -m pip install -r requirements.dev.txt
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

.PHONY: common
common: $(common)
$(common): packages/common/src/*.ts yarn_install
	cd packages/common; \
	yarn build
	@touch $@

.PHONY: common-react
common-react: $(common-react)
$(common-react): packages/common-react/src/*.ts yarn_install
	cd packages/common-react; \
	yarn build
	@touch $@

.PHONY: mountable
mountable: $(mountable)
$(mountable): packages/mountable/src/*.ts packages/mountable/src/*.tsx $(kernel) $(common-react)
	cd packages/mountable; \
	yarn build
	@touch $@

.PHONY: sharing
sharing: $(sharing)
$(sharing): packages/sharing/src/*.ts packages/sharing/src/*.tsx $(kernel) $(sharing-common) $(common-react) yarn_install
	cd packages/sharing; \
	yarn build
	@touch $@

.PHONY: sharing-common
sharing-common: $(sharing-common)
$(sharing-common): packages/sharing-common/src/*.ts yarn_install
	cd packages/sharing-common; \
	yarn build
	@touch $@

.PHONY: sharing-editor
sharing-editor: $(sharing-editor)
$(sharing-editor): packages/sharing-editor/src/*.ts packages/sharing-editor/src/*.tsx $(common) $(sharing-common) yarn_install
	cd packages/sharing-editor; \
	yarn build
	@touch $@

.PHONY: desktop
desktop: $(desktop)
$(desktop): packages/desktop/src/*.ts packages/desktop/src/*.tsx packages/desktop/electron/*.ts $(kernel) $(common) $(common-react) yarn_install
	cd packages/desktop; \
	yarn build
	@touch $@

.PHONY: kernel
kernel: $(kernel)
$(kernel): packages/kernel/src/*.ts $(stlite-server-wheel) $(streamlit_wheel) $(streamlit_proto)
	cd packages/kernel; \
	yarn build
	@touch $@

.PHONY: stlite-server-wheel
$(stlite-server-wheel): $(VENV) packages/kernel/py/stlite-server/stlite_server/*.py
	. $(VENV)/bin/activate && \
	cd packages/kernel/py/stlite-server && \
	poetry build
	@touch $@

$(streamlit_proto): $(VENV) streamlit/proto/streamlit/proto/*.proto
	. $(VENV)/bin/activate && \
	cd streamlit; \
	$(MAKE) mini-init
	@touch $@

.PHONY: streamlit-wheel
streamlit-wheel: $(streamlit_wheel)
$(streamlit_wheel): $(VENV) $(streamlit_proto) streamlit/lib/streamlit/**/*.py streamlit/lib/Pipfile streamlit/lib/setup.py streamlit/lib/bin/* streamlit/lib/MANIFEST.in
	. $(VENV)/bin/activate && \
	PYODIDE_VERSION=`python -c "import pyodide_build; print(pyodide_build.__version__)"` && \
	PYTHON_VERSION=`python -c "import sys; print('.'.join(map(str, sys.version_info[:3])))"` && \
	PYODIDE_PYTHON_VERSION=`pyodide config get python_version` && \
	if [ "$$PYTHON_VERSION" != "$$PYODIDE_PYTHON_VERSION" ]; then \
		echo "Python version mismatch: Pyodide $$PYODIDE_VERSION includes Python $$PYODIDE_PYTHON_VERSION, but $$PYTHON_VERSION" is installed for the development in this env; \
		exit 1; \
	fi && \
	cd streamlit && SNOWPARK_CONDA_BUILD=true $(MAKE) distribution && cd .. && \
	pyodide py-compile --keep streamlit/lib/dist/streamlit-1.24.0-py2.py3-none-any.whl && \
	mkdir -p $(dir $(streamlit_wheel)) && \
	cp streamlit/lib/dist/$(notdir $(streamlit_wheel)) $(streamlit_wheel)
