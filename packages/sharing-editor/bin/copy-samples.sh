SOURCE_REPO_DIR=$1
if [ ! "$SOURCE_REPO_DIR" ]; then
  echo "Path to the cloned streamlit/docs repo must be passed"
  exit 1
fi

SAMPLES_DIR="$( cd "$( dirname "$0" )"/../public/samples && pwd )"
DIFF_DIR="$( cd "$( dirname "$0" )"/sample-diffs && pwd )"

echo SHARING_EDITOR_DIR=$SHARING_EDITOR_DIR
echo DIFF_DIR=$DIFF_DIR

cp $SOURCE_REPO_DIR/python/api-examples-source/*.py $SAMPLES_DIR/011_component_gallery/pages/.
patch $SAMPLES_DIR/011_component_gallery/pages/charts.audio-purr.py $DIFF_DIR/011_component_gallery/pages/charts.audio-purr.py
patch $SAMPLES_DIR/011_component_gallery/pages/media.logo.py $DIFF_DIR/011_component_gallery/pages/media.logo.py
patch $SAMPLES_DIR/011_component_gallery/pages/status.toast2.py $DIFF_DIR/011_component_gallery/pages/status.toast2.py
patch $SAMPLES_DIR/011_component_gallery/pages/widget.download_button.py $DIFF_DIR/011_component_gallery/pages/widget.download_button.py

cp $SOURCE_REPO_DIR/python/api-examples-source/theming/*.py $SAMPLES_DIR/011_component_gallery/pages/.

cp -r $SOURCE_REPO_DIR/python/api-examples-source/hello/* $SAMPLES_DIR/012_hello/.
patch $SAMPLES_DIR/012_hello/hello.py $DIFF_DIR/012_hello/hello.py
sed -i '' 's/==.*//' $SAMPLES_DIR/012_hello/requirements.txt

cp -r $SOURCE_REPO_DIR/python/api-examples-source/mpa-hello/* $SAMPLES_DIR/012_mpa-hello/.
patch $SAMPLES_DIR/012_mpa-hello/pages/1_📈_Plotting_Demo.py $DIFF_DIR/012_mpa-hello/pages/1_📈_Plotting_Demo.py
patch $SAMPLES_DIR/012_mpa-hello/pages/3_📊_DataFrame_Demo.py $DIFF_DIR/012_mpa-hello/pages/3_📊_DataFrame_Demo.py
sed -i '' 's/==.*//' $SAMPLES_DIR/012_mpa-hello/requirements.txt

cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/custom-navigation/* $SAMPLES_DIR/012_tutorials_custom-navigation/.

cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/dynamic-navigation/* $SAMPLES_DIR/012_tutorials_dynamic-navigation/.
patch $SAMPLES_DIR/012_tutorials_dynamic-navigation/streamlit_app.py $DIFF_DIR/012_tutorials_dynamic-navigation/streamlit_app.py

cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/execution-flow/fragments/* $SAMPLES_DIR/012_tutorials_fragments/pages/.
patch $SAMPLES_DIR/012_tutorials_fragments/pages/tutorial-fragment-multiple-container.py $DIFF_DIR/012_tutorials_fragments/pages/tutorial-fragment-multiple-container.py
patch $SAMPLES_DIR/012_tutorials_fragments/pages/tutorial-fragment-rerun.py $DIFF_DIR/012_tutorials_fragments/pages/tutorial-fragment-rerun.py
patch $SAMPLES_DIR/012_tutorials_fragments/pages/tutorial-fragment-streaming.py $DIFF_DIR/012_tutorials_fragments/pages/tutorial-fragment-streaming.py

cp -r $SOURCE_REPO_DIR/python/api-examples-source/utilities.switch_page/* $SAMPLES_DIR/012_utilities.switch_page/.

cp -r $SOURCE_REPO_DIR/python/api-examples-source/widget.page_link/* $SAMPLES_DIR/012_widget.page_link/.
