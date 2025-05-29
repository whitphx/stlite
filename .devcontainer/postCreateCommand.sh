corepack enable

make init

EDITOR_APP_ORIGIN="https://${CODESPACE_NAME}-3030.app.github.dev"
SHARING_APP_URL="https://${CODESPACE_NAME}-3000.app.github.dev/"

for file in ~/.zshrc ~/.bashrc; do
  echo "" >> $file
  echo "export EDITOR_APP_ORIGIN=${EDITOR_APP_ORIGIN}" >> $file
  echo "export SHARING_APP_URL=${SHARING_APP_URL}" >> $file
done
