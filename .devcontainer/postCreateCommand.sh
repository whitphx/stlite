make init

REACT_APP_EDITOR_APP_ORIGIN="https://${CODESPACE_NAME}-3030.app.github.dev"
REACT_APP_SHARING_APP_URL="https://${CODESPACE_NAME}-3000.app.github.dev/"

for file in ~/.zshrc ~/.bashrc; do
  echo "" >> $file
  echo "export REACT_APP_EDITOR_APP_ORIGIN=${REACT_APP_EDITOR_APP_ORIGIN}" >> $file
  echo "export REACT_APP_SHARING_APP_URL=${REACT_APP_SHARING_APP_URL}" >> $file
done
