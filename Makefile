BUILD_STATE_DIR := .make

common := $(BUILD_STATE_DIR)/common/.built
common-react := $(BUILD_STATE_DIR)/common-react/.built
mountable := $(BUILD_STATE_DIR)/mountable/.built
sharing := $(BUILD_STATE_DIR)/sharing/.built
sharing-common := $(BUILD_STATE_DIR)/sharing-common/.built
sharing-editor := $(BUILD_STATE_DIR)/sharing-editor/.built
desktop := $(BUILD_STATE_DIR)/desktop/.built
kernel := $(BUILD_STATE_DIR)/kernel/.built
stlite-lib-wheel := packages/kernel/py/stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl
streamlit_proto := streamlit/frontend/lib/src/proto.d.ts
streamlit_wheel := packages/kernel/py/streamlit/lib/dist/streamlit-1.40.1-cp312-none-any.whl
streamlit_frontend_lib_prod := streamlit/frontend/lib/dist/*

export USE_CONSTRAINTS_FILE := false  # https://github.com/streamlit/streamlit/blob/1.27.0/.github/workflows/release.yml#L67-L68

.PHONY: all
all: init mountable sharing sharing-editor


.PHONY: init
init: git_submodules venv yarn_install

VENV := ./.venv
NODE_MODULES := ./node_modules

.PHONY: venv
venv: requirements.dev.txt streamlit/lib/dev-requirements.txt
	[ -d $(VENV) ] || uv venv $(VENV)
	. $(VENV)/bin/activate && uv pip install -r requirements.dev.txt -r streamlit/lib/dev-requirements.txt
	@echo "\nPython virtualenv has been set up. Run the command below to activate.\n\n. $(VENV)/bin/activate"

.PHONY: yarn_install
yarn_install: $(NODE_MODULES)
$(NODE_MODULES): ./yarn.lock
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
$(common): $(shell find packages/common/src -type f -name "*.ts") yarn_install
	cd packages/common && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: common-react
common-react: $(common-react)
$(common-react): $(shell find packages/common-react/src -type f -name "*.ts") yarn_install $(kernel)
	cd packages/common-react && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: mountable
mountable: $(mountable)
$(mountable): $(shell find packages/mountable/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(shell find packages/mountable/public -type f) yarn_install $(kernel) $(common) $(common-react)
	cd packages/mountable && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: sharing
sharing: $(sharing)
$(sharing): $(shell find packages/sharing/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(shell find packages/sharing/public -type f) yarn_install $(kernel) $(sharing-common) $(common-react)
	cd packages/sharing && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: sharing-common
sharing-common: $(sharing-common)
$(sharing-common): $(shell find packages/sharing-common/src -type f -name "*.ts") yarn_install
	cd packages/sharing-common && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: sharing-editor
sharing-editor: $(sharing-editor)
$(sharing-editor): $(shell find packages/sharing-editor/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) yarn_install $(common) $(sharing-common)
	cd packages/sharing-editor && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: desktop
desktop: $(desktop)
$(desktop): packages/desktop/src/*.ts packages/desktop/src/*.tsx packages/desktop/electron/*.ts yarn_install $(kernel) $(common) $(common-react)
	cd packages/desktop && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: kernel
kernel: $(kernel)
$(kernel): packages/kernel/src/*.ts $(common) $(stlite-lib-wheel) $(streamlit_wheel) $(streamlit_proto)
	cd packages/kernel && yarn build
	@mkdir -p $(dir $@)
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
	uv build
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
	TEMP_DIR=$$(mktemp -d) && \
	mv ./streamlit/lib/streamlit/proto/*.pyi $$TEMP_DIR/ && \
	SNOWPARK_CONDA_BUILD=true $(MAKE) -C streamlit distribution && \
	mv $$TEMP_DIR/*.pyi ./streamlit/lib/streamlit/proto/ && \
	rmdir $$TEMP_DIR && \
	pyodide py-compile --keep streamlit/lib/dist/streamlit-1.40.1-py2.py3-none-any.whl && \
	mkdir -p $(dir $(streamlit_wheel)) && \
	cp streamlit/lib/dist/$(notdir $(streamlit_wheel)) $(streamlit_wheel)

.PHONY: streamlit-frontend-lib
streamlit-frontend-lib: $(streamlit_frontend_lib_prod)
$(streamlit_frontend_lib_prod): yarn_install $(kernel) $(streamlit_proto) streamlit/frontend/lib/src/**/*.ts streamlit/frontend/lib/src/**/*.tsx streamlit/frontend/lib/package.json streamlit/frontend/lib/tsconfig.json
	$(MAKE) -C streamlit frontend-lib-prod

clean:
	# Preserve .gitkeep while cleaning build state files
	cp $(BUILD_STATE_DIR)/.gitkeep /tmp/.gitkeep.tmp || true
	rm -rf $(BUILD_STATE_DIR)/*
	mkdir -p $(BUILD_STATE_DIR)
	cp /tmp/.gitkeep.tmp $(BUILD_STATE_DIR)/.gitkeep || true
	rm -f /tmp/.gitkeep.tmp
	rm -rf packages/*/dist/* packages/*/build/*
	rm -rf $(stlite-lib-wheel) $(streamlit_proto) $(streamlit_wheel) $(streamlit_frontend_lib_prod)
