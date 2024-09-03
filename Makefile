common := packages/common/dist/*
common-react := packages/common-react/dist/*
mountable := packages/mountable/build/*
sharing := packages/sharing/build/*
sharing-common := packages/sharing-common/dist/*
sharing-editor := packages/sharing-editor/build/*
desktop := packages/desktop/build/*
kernel := packages/kernel/dist/*
stlite-lib-wheel := packages/kernel/py/stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl
streamlit_proto := streamlit/frontend/lib/src/proto.d.ts
streamlit_wheel := packages/kernel/py/streamlit/lib/dist/streamlit-1.38.0-cp312-none-any.whl
streamlit_frontend_lib_prod := streamlit/frontend/lib/dist/*

export USE_CONSTRAINTS_FILE := false  # https://github.com/streamlit/streamlit/blob/1.27.0/.github/workflows/release.yml#L67-L68

.PHONY: all
all: init mountable sharing sharing-editor


.PHONY: init
init: git_submodules venv node_modules

VENV := ./.venv
NODE_MODULES := ./node_modules

.PHONY: venv
venv: requirements.dev.txt streamlit/lib/dev-requirements.txt
	[ -d $(VENV) ] || python -m venv $(VENV)
	. $(VENV)/bin/activate && python -m pip install -U pip && python -m pip install -r requirements.dev.txt -r streamlit/lib/dev-requirements.txt
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
$(common-react): packages/common-react/src/*.ts yarn_install $(kernel)
	cd packages/common-react; \
	yarn build
	@touch $@

.PHONY: mountable
mountable: $(mountable)
$(mountable): packages/mountable/src/*.ts packages/mountable/src/*.tsx yarn_install $(kernel) $(common-react) $(streamlit_frontend_lib_prod)
	cd packages/mountable; \
	yarn build
	@touch $@

.PHONY: sharing
sharing: $(sharing)
$(sharing): packages/sharing/src/*.ts packages/sharing/src/*.tsx yarn_install $(kernel) $(sharing-common) $(common-react) $(streamlit_frontend_lib_prod)
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
$(sharing-editor): packages/sharing-editor/src/*.ts packages/sharing-editor/src/*.tsx yarn_install $(common) $(sharing-common)
	cd packages/sharing-editor; \
	yarn build
	@touch $@

.PHONY: desktop
desktop: $(desktop)
$(desktop): packages/desktop/src/*.ts packages/desktop/src/*.tsx packages/desktop/electron/*.ts yarn_install $(kernel) $(common) $(common-react) $(streamlit_frontend_lib_prod)
	cd packages/desktop; \
	yarn build
	@touch $@

.PHONY: kernel
kernel: $(kernel)
$(kernel): packages/kernel/src/*.ts $(common) $(stlite-lib-wheel) $(streamlit_wheel) $(streamlit_proto)
	cd packages/kernel; \
	yarn build
	@touch $@

.PHONY: kernel-test
kernel-test: packages/kernel/src/*.ts $(common) $(stlite-lib-wheel) $(streamlit_wheel)
	cd packages/kernel; \
	yarn test

.PHONY: stlite-lib-wheel
stlite-lib-wheel: $(stlite-lib-wheel)
$(stlite-lib-wheel): venv packages/kernel/py/stlite-lib/stlite_lib/*.py
	. $(VENV)/bin/activate && \
	cd packages/kernel/py/stlite-lib && \
	poetry build
	@touch $@

.PHONY: streamlit-proto
streamlit-proto: $(streamlit_proto)
$(streamlit_proto): venv streamlit/proto/streamlit/proto/*.proto
	. $(VENV)/bin/activate && \
	$(MAKE) -C streamlit python-init-dev-only && \
	$(MAKE) -C streamlit protobuf
	@touch $@

.PHONY: streamlit-wheel
streamlit-wheel: $(streamlit_wheel)
$(streamlit_wheel): venv $(streamlit_proto) streamlit/lib/streamlit/**/*.py streamlit/lib/Pipfile streamlit/lib/setup.py streamlit/lib/bin/* streamlit/lib/MANIFEST.in
	. $(VENV)/bin/activate && \
	PYODIDE_VERSION=`python -c "import pyodide_build; print(pyodide_build.__version__)"` && \
	PYTHON_VERSION=`python -c "import sys; print('.'.join(map(str, sys.version_info[:3])))"` && \
	PYODIDE_PYTHON_VERSION=`pyodide config get python_version` && \
	if [ "$$PYTHON_VERSION" != "$$PYODIDE_PYTHON_VERSION" ]; then \
		echo "Python version mismatch: Pyodide $$PYODIDE_VERSION includes Python $$PYODIDE_PYTHON_VERSION, but $$PYTHON_VERSION" is installed for the development in this env; \
		exit 1; \
	fi && \
	cd streamlit && SNOWPARK_CONDA_BUILD=true $(MAKE) distribution && cd .. && \
	pyodide py-compile --keep streamlit/lib/dist/streamlit-1.38.0-py2.py3-none-any.whl && \
	mkdir -p $(dir $(streamlit_wheel)) && \
	cp streamlit/lib/dist/$(notdir $(streamlit_wheel)) $(streamlit_wheel)

.PHONY: streamlit-frontend-lib
streamlit-frontend-lib: $(streamlit_frontend_lib_prod)
$(streamlit_frontend_lib_prod): yarn_install $(kernel) $(streamlit_proto) streamlit/frontend/lib/src/**/*.ts streamlit/frontend/lib/src/**/*.tsx streamlit/frontend/lib/package.json streamlit/frontend/lib/tsconfig.json
	$(MAKE) -C streamlit frontend-lib-prod

clean:
	rm -rf $(common) $(common-react) $(mountable) $(sharing) $(sharing-common) $(sharing-editor) $(desktop) $(kernel) $(stlite-lib-wheel) $(streamlit_proto) $(streamlit_wheel) $(streamlit_frontend_lib_prod)
