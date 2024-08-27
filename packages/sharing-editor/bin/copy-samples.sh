SOURCE_REPO_DIR=$1
if [ ! "$SOURCE_REPO_DIR" ]; then
  echo "Path to the cloned streamlit/docs repo must be passed"
  exit 1
fi

SHARING_EDITOR_DIR="$( cd "$( dirname "$0" )"/.. && pwd )"
DIFF_DIR="$( cd "$( dirname "$0" )"/sample-diffs && pwd )"

echo SHARING_EDITOR_DIR=$SHARING_EDITOR_DIR
echo DIFF_DIR=$DIFF_DIR

cp $SOURCE_REPO_DIR/python/api-examples-source/*.py $SHARING_EDITOR_DIR/public/samples/011_component_gallery/pages/.
patch $SHARING_EDITOR_DIR/public/samples/011_component_gallery/pages/charts.audio-purr.py $DIFF_DIR/011_component_gallery/pages/charts.audio-purr.py
patch $SHARING_EDITOR_DIR/public/samples/011_component_gallery/pages/media.logo.py $DIFF_DIR/011_component_gallery/pages/media.logo.py
patch $SHARING_EDITOR_DIR/public/samples/011_component_gallery/pages/status.toast2.py $DIFF_DIR/011_component_gallery/pages/status.toast2.py
patch $SHARING_EDITOR_DIR/public/samples/011_component_gallery/pages/widget.download_button.py $DIFF_DIR/011_component_gallery/pages/widget.download_button.py

cp $SOURCE_REPO_DIR/python/api-examples-source/theming/*.py $SHARING_EDITOR_DIR/public/samples/011_component_gallery/pages/.

cp -r $SOURCE_REPO_DIR/python/api-examples-source/hello/* $SHARING_EDITOR_DIR/public/samples/012_hello/.
patch $SHARING_EDITOR_DIR/public/samples/012_hello/hello.py $DIFF_DIR/012_hello/hello.py
sed -i '' 's/==.*//' $SHARING_EDITOR_DIR/public/samples/012_hello/requirements.txt

cp -r $SOURCE_REPO_DIR/python/api-examples-source/mpa-hello/* $SHARING_EDITOR_DIR/public/samples/012_mpa-hello/.
patch $SHARING_EDITOR_DIR/public/samples/012_mpa-hello/pages/1_📈_Plotting_Demo.py $DIFF_DIR/012_mpa-hello/pages/1_📈_Plotting_Demo.py
patch $SHARING_EDITOR_DIR/public/samples/012_mpa-hello/pages/3_📊_DataFrame_Demo.py $DIFF_DIR/012_mpa-hello/pages/3_📊_DataFrame_Demo.py
sed -i '' 's/==.*//' $SHARING_EDITOR_DIR/public/samples/012_mpa-hello/requirements.txt

cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/custom-navigation/* $SHARING_EDITOR_DIR/public/samples/012_tutorials_custom-navigation/.

cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/dynamic-navigation/* $SHARING_EDITOR_DIR/public/samples/012_tutorials_dynamic-navigation/.
patch $SHARING_EDITOR_DIR/public/samples/012_tutorials_dynamic-navigation/streamlit_app.py $DIFF_DIR/012_tutorials_dynamic-navigation/streamlit_app.py

cp -r $SOURCE_REPO_DIR/python/api-examples-source/tutorials/execution-flow/fragments/* $SHARING_EDITOR_DIR/public/samples/012_tutorials_fragments/pages/.
patch $SHARING_EDITOR_DIR/public/samples/012_tutorials_fragments/pages/tutorial-fragment-multiple-container.py $DIFF_DIR/012_tutorials_fragments/pages/tutorial-fragment-multiple-container.py
patch $SHARING_EDITOR_DIR/public/samples/012_tutorials_fragments/pages/tutorial-fragment-rerun.py $DIFF_DIR/012_tutorials_fragments/pages/tutorial-fragment-rerun.py
patch $SHARING_EDITOR_DIR/public/samples/012_tutorials_fragments/pages/tutorial-fragment-streaming.py $DIFF_DIR/012_tutorials_fragments/pages/tutorial-fragment-streaming.py

cp -r $SOURCE_REPO_DIR/python/api-examples-source/utilities.switch_page/* $SHARING_EDITOR_DIR/public/samples/012_utilities.switch_page/.

cp -r $SOURCE_REPO_DIR/python/api-examples-source/widget.page_link/* $SHARING_EDITOR_DIR/public/samples/012_widget.page_link/.
