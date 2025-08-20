SHELL := /bin/bash -eu -o pipefail -c

BUILD_STATE_DIR := .make

# Build State Tracking Strategy
# ---------------------------
# This Makefile uses sentinel files in $(BUILD_STATE_DIR) to track build completion
# because Make has specific requirements for reliable incremental builds:
#
# 1. Single-file targets with reliable timestamps:
#    - Make needs a single file to track when a target was last built
#    - Directory timestamps are unreliable because they update whenever any file
#      inside changes, causing unnecessary rebuilds
#    - JS/TS builds output multiple files (*.js, *.d.ts, etc.) making it hard
#      to track completion with just the output files
#
# 2. Find-based dependency tracking vs sentinel files:
#    - Find works great for dependencies (e.g., `find packages/common/src -type f -name "*.ts"`)
#      because Make just needs to know if ANY source file is newer than the target
#    - However, find can't replace sentinel files for build targets because:
#      a) Make needs ONE file to compare timestamps against
#      b) Directory-based targets would rebuild unnecessarily due to unreliable timestamps
#      c) Multiple output files need a single source of truth for build completion
#
# 3. Benefits of sentinel files:
#    - Provides a single, reliable timestamp for each build target
#    - Prevents infinite rebuild loops between dependent targets
#    - Works correctly with directory outputs and nested paths
#    - Keeps build state separate from distribution files
#
# Example of proper usage in this Makefile:
# - Dependencies: Use find to track source files
#     $(common): $(shell find packages/common/src -type f -name "*.ts")
# - Target: Use sentinel file to track completion
#     $(common): $(BUILD_STATE_DIR)/common/.built

$(if $(shell command -v uv),,@echo "WARNING: uv is not installed. Please install it first.")
$(if $(shell command -v yarn),,@echo "WARNING: yarn is not installed. Please install it first.")

STREAMLIT_WHEEL_FILE_NAME := $(shell yarn workspace @stlite/devutils get-streamlit-wheel-file-name py)
STREAMLIT_COMPILED_WHEEL_FILE_NAME := $(shell yarn workspace @stlite/devutils get-streamlit-wheel-file-name cp)

node_modules := $(BUILD_STATE_DIR)/node_modules/.built
venv := $(BUILD_STATE_DIR)/venv/.built
common := $(BUILD_STATE_DIR)/common/.built
common-react := $(BUILD_STATE_DIR)/common-react/.built
browser := $(BUILD_STATE_DIR)/browser/.built
sharing := $(BUILD_STATE_DIR)/sharing/.built
sharing-common := $(BUILD_STATE_DIR)/sharing-common/.built
sharing-editor := $(BUILD_STATE_DIR)/sharing-editor/.built
desktop := $(BUILD_STATE_DIR)/desktop/.built
kernel := $(BUILD_STATE_DIR)/kernel/.built
stlite-lib-wheel := packages/kernel/py/stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl
streamlit_proto := streamlit/frontend/protobuf/proto.d.ts
streamlit_wheel := packages/kernel/py/streamlit/lib/dist/$(STREAMLIT_COMPILED_WHEEL_FILE_NAME)
streamlit-frontend-lib := $(BUILD_STATE_DIR)/streamlit-frontend-lib/.built

# To avoid an error like "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory".
# See https://github.com/actions/virtual-environments/issues/70#issuecomment-653886422
export NODE_OPTIONS := "--max-old-space-size=6144"

export USE_CONSTRAINTS_FILE := false  # https://github.com/streamlit/streamlit/blob/1.27.0/.github/workflows/release.yml#L67-L68

.PHONY: all
all: init $(browser) $(sharing) $(sharing-editor) $(desktop)


.PHONY: init
init: git_submodules $(venv) $(node_modules)

VENV_PATH := ./.venv

.PHONY: venv
venv: $(venv)
$(venv): .python-version requirements.dev.txt streamlit/lib/dev-requirements.txt
	[ -d $(VENV_PATH) ] || uv venv $(VENV_PATH)
	uv pip install -r requirements.dev.txt -r streamlit/lib/dev-requirements.txt
	uv run pyodide xbuildenv uninstall
	uv run pyodide xbuildenv install
	@mkdir -p $(dir $@)
	@touch $@
	@echo "\nPython virtualenv has been set up. Run the command below to activate.\n\n. $(VENV_PATH)/bin/activate"

.PHONY: node_modules
node_modules: $(node_modules)
$(node_modules): package.json ./yarn.lock
	yarn install
	@mkdir -p $(dir $@)
	@touch $@

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
$(common): $(shell find packages/common/src -type f -name "*.ts") $(node_modules)
	cd packages/common && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: common-react
common-react: $(common-react)
$(common-react): $(shell find packages/common-react/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(node_modules) $(kernel) $(streamlit-frontend-lib)
	cd packages/common-react && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: browser
browser: $(browser)
$(browser): $(shell find packages/browser/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(node_modules) $(kernel) $(common) $(common-react) $(streamlit-frontend-lib)
	cd packages/browser && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: sharing
sharing: $(sharing)
$(sharing): $(shell find packages/sharing/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(shell find packages/sharing/public -type f) $(node_modules) $(kernel) $(sharing-common) $(common-react) $(streamlit-frontend-lib)
	cd packages/sharing && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: sharing-common
sharing-common: $(sharing-common)
$(sharing-common): $(shell find packages/sharing-common/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(node_modules)
	cd packages/sharing-common && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: sharing-editor
sharing-editor: $(sharing-editor)
$(sharing-editor): $(shell find packages/sharing-editor/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(node_modules) $(common) $(sharing-common)
	cd packages/sharing-editor && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: desktop
desktop: $(desktop)
$(desktop): $(shell find packages/desktop/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(shell find packages/desktop/electron -type f -name "*.ts") $(node_modules) $(kernel) $(common) $(common-react) $(streamlit-frontend-lib)
	cd packages/desktop && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: kernel
kernel: $(kernel)
$(kernel): $(shell find packages/kernel/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(common) $(stlite-lib-wheel) $(streamlit_wheel) $(streamlit_proto) $(streamlit-frontend-lib)
	cd packages/kernel && yarn build
	@mkdir -p $(dir $@)
	@touch $@

.PHONY: kernel-test
kernel-test: $(shell find packages/kernel/src -type f \( -name "*.ts" -o -name "*.tsx" \) ) $(common) $(stlite-lib-wheel) $(streamlit_wheel)
	cd packages/kernel; \
	yarn test

.PHONY: stlite-lib-wheel
stlite-lib-wheel: $(stlite-lib-wheel)
$(stlite-lib-wheel): $(venv) $(shell find packages/kernel/py/stlite-lib/stlite_lib -type f -name "*.py")
	uv --directory packages/kernel/py/stlite-lib build
	@touch $@

.PHONY: streamlit-proto
streamlit-proto: $(streamlit_proto)
$(streamlit_proto): $(venv) streamlit/proto/streamlit/proto/*.proto
	. $(VENV_PATH)/bin/activate && \
	$(MAKE) -C streamlit protobuf

.PHONY: streamlit-wheel
streamlit-wheel: $(streamlit_wheel)
$(streamlit_wheel): $(venv) $(streamlit_proto) $(shell find streamlit/lib/streamlit -type f -name "*.py") streamlit/lib/setup.py streamlit/lib/MANIFEST.in
	PYODIDE_BUILD_VERSION=`uv run python -c "import pyodide_build; print(pyodide_build.__version__)"` && \
	PYTHON_VERSION=`uv run python -c "import sys; print('.'.join(map(str, sys.version_info[:3])))"` && \
	PYODIDE_PYTHON_VERSION=`uv run pyodide config get python_version` && \
	if [ "$$PYTHON_VERSION" != "$$PYODIDE_PYTHON_VERSION" ]; then \
		echo "Python version mismatch: Pyodide $$PYODIDE_BUILD_VERSION includes Python $$PYODIDE_PYTHON_VERSION, but $$PYTHON_VERSION" is installed for the development in this env; \
		exit 1; \
	fi

	. $(VENV_PATH)/bin/activate && \
	TEMP_DIR=$$(mktemp -d) && \
	find ./streamlit/lib/streamlit/proto/ -name '*.pyi' -exec mv {} $$TEMP_DIR/ \; && \
	pushd streamlit && \
	rm -rfv lib/build lib/dist && \
	cd lib ; SNOWPARK_CONDA_BUILD=true uv run python setup.py bdist_wheel && \
	popd && \
	find $$TEMP_DIR -name '*.pyi' -exec mv {} ./streamlit/lib/streamlit/proto/ \; && \
	rmdir $$TEMP_DIR

	uv run pyodide py-compile --keep streamlit/lib/dist/$(STREAMLIT_WHEEL_FILE_NAME)
	mkdir -p $(dir $(streamlit_wheel))
	cp streamlit/lib/dist/$(notdir $(streamlit_wheel)) $(streamlit_wheel)

.PHONY: streamlit-frontend-lib
streamlit-frontend-lib: $(streamlit-frontend-lib)
$(streamlit-frontend-lib): $(node_modules) $(streamlit_proto) $(shell find streamlit/frontend/connection streamlit/frontend/utils \
  -type f ! -path '*/dist/*' \
  \( -name '*.ts' -o -name '*.tsx' -o -name 'package.json' -o -name 'tsconfig.json' \))
	yarn workspaces foreach --recursive --from '{@streamlit/connection,@streamlit/utils}' --topological run build
	@mkdir -p $(dir $@)
	@touch $@

clean:
	rm -rf $(BUILD_STATE_DIR)/*
	rm -f $(TEMP_GITKEEP)
	yarn tsc -b --clean
	rm -rf packages/*/dist/* packages/*/build/* streamlit/frontend/*/dist/*
	rm -rf $(stlite-lib-wheel) $(streamlit_proto) $(streamlit_wheel) $(streamlit_frontend_lib_prod)
	$(MAKE) -C streamlit clean
