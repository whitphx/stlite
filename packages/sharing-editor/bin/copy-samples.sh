#!/bin/bash -eu

SOURCE_REPO_DIR=$1
if [ ! "$SOURCE_REPO_DIR" ]; then
  echo "Path to the cloned streamlit/docs repo must be passed"
  exit 1
fi

SAMPLES_DIR="$( cd "$( dirname "$0" )"/../public/samples && pwd )"
DIFF_DIR="$( cd "$( dirname "$0" )"/sample-diffs && pwd )"

echo SAMPLES_DIR=$SAMPLES_DIR
echo DIFF_DIR=$DIFF_DIR

mkdir -p $SAMPLES_DIR/011_component_gallery/pages
mkdir -p $SAMPLES_DIR/011_component_gallery/data
cp $SOURCE_REPO_DIR/python/api-examples-source/*.py $SAMPLES_DIR/011_component_gallery/pages/.
cp $SOURCE_REPO_DIR/python/api-examples-source/*.png $SAMPLES_DIR/011_component_gallery/pages/.
cp $SOURCE_REPO_DIR/python/api-examples-source/*.mp3 $SAMPLES_DIR/011_component_gallery/pages/.
cp -r $SOURCE_REPO_DIR/python/api-examples-source/data/* $SAMPLES_DIR/011_component_gallery/data/.
cp $SOURCE_REPO_DIR/python/api-examples-source/tutorials/*.py $SAMPLES_DIR/011_component_gallery/pages/.
cp $SOURCE_REPO_DIR/python/api-examples-source/tutorials/elements/*/*.py $SAMPLES_DIR/011_component_gallery/pages/.
cp $SOURCE_REPO_DIR/python/api-examples-source/guides/*.py $SAMPLES_DIR/011_component_gallery/pages/.
cp -r $SOURCE_REPO_DIR/python/api-examples-source/images $SAMPLES_DIR/011_component_gallery/pages/.
cp $SOURCE_REPO_DIR/python/api-examples-source/requirements.txt $SAMPLES_DIR/011_component_gallery/.
patch $SAMPLES_DIR/011_component_gallery/requirements.txt $DIFF_DIR/011_component_gallery/requirements.txt
patch $SAMPLES_DIR/011_component_gallery/pages/charts.audio-purr.py $DIFF_DIR/011_component_gallery/pages/charts.audio-purr.py
patch $SAMPLES_DIR/011_component_gallery/pages/media.logo.py $DIFF_DIR/011_component_gallery/pages/media.logo.py
patch $SAMPLES_DIR/011_component_gallery/pages/widget.download_button.py $DIFF_DIR/011_component_gallery/pages/widget.download_button.py
patch $SAMPLES_DIR/011_component_gallery/pages/widget.download_button_file.py $DIFF_DIR/011_component_gallery/pages/widget.download_button_file.py
patch $SAMPLES_DIR/011_component_gallery/pages/charts.pydeck_event_state_selections.py $DIFF_DIR/011_component_gallery/pages/charts.pydeck_event_state_selections.py

mv $SAMPLES_DIR/011_component_gallery/pages/navigation.multipage_widgets.py $SAMPLES_DIR/012_navigation.multipage_widgets/app.py

cp $SOURCE_REPO_DIR/python/api-examples-source/theming/*.py $SAMPLES_DIR/011_component_gallery/pages/.

mkdir -p $SAMPLES_DIR/012_hello
cp -r $SOURCE_REPO_DIR/python/api-examples-source/hello/* $SAMPLES_DIR/012_hello/.
patch $SAMPLES_DIR/012_hello/hello.py $DIFF_DIR/012_hello/hello.py
sed -i '' 's/==.*//' $SAMPLES_DIR/012_hello/requirements.txt

mkdir -p $SAMPLES_DIR/012_mpa-hello
cp -r $SOURCE_REPO_DIR/python/api-examples-source/mpa-hello/* $SAMPLES_DIR/012_mpa-hello/.
patch $SAMPLES_DIR/012_mpa-hello/pages/3_📊_DataFrame_Demo.py $DIFF_DIR/012_mpa-hello/pages/3_📊_DataFrame_Demo.py
sed -i '' 's/==.*//' $SAMPLES_DIR/012_mpa-hello/requirements.txt
sed -i '' 's/opencv-python-headless/opencv-python/' $SAMPLES_DIR/012_mpa-hello/requirements.txt  # Only opencv-python is available on Pyodide.

mkdir -p $SAMPLES_DIR/012_tutorials_custom-navigation
cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/custom-navigation/* $SAMPLES_DIR/012_tutorials_custom-navigation/.

mkdir -p $SAMPLES_DIR/012_tutorials_dynamic-navigation
cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/dynamic-navigation/* $SAMPLES_DIR/012_tutorials_dynamic-navigation/.
patch $SAMPLES_DIR/012_tutorials_dynamic-navigation/streamlit_app.py $DIFF_DIR/012_tutorials_dynamic-navigation/streamlit_app.py

mkdir -p $SAMPLES_DIR/012_tutorials_fragments/pages
cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/execution-flow/fragments/* $SAMPLES_DIR/012_tutorials_fragments/pages/.

mkdir -p $SAMPLES_DIR/012_utilities.switch_page
cp -r $SOURCE_REPO_DIR/python/api-examples-source/utilities.switch_page/* $SAMPLES_DIR/012_utilities.switch_page/.

mkdir -p $SAMPLES_DIR/012_widget.page_link
cp -r $SOURCE_REPO_DIR/python/api-examples-source/widget.page_link/* $SAMPLES_DIR/012_widget.page_link/.
