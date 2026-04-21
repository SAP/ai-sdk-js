#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

rm -rf "$SCRIPT_DIR/dist" "$SCRIPT_DIR/deployment"
cp -r "$REPO_ROOT/sample-code/dist" "$SCRIPT_DIR/dist"

pnpm --dir "$REPO_ROOT" \
  --config.node-linker=hoisted \
  --config.public-hoist-pattern='*' \
  --filter @sap-ai-sdk/smoke-tests \
  deploy --legacy --prod --ignore-scripts \
  tests/smoke-tests/deployment

NPM_REGISTRY_MIRROR_URL="${NPM_REGISTRY_MIRROR_URL:-https://common.repositories.cloud.sap/artifactory/api/npm/build.releases.npm/}"

registry_host="${NPM_REGISTRY_MIRROR_URL#https://}"
registry_host="${registry_host#http://}"

cd "$SCRIPT_DIR/deployment"
npm config set registry "$NPM_REGISTRY_MIRROR_URL"
npm config set @sap-ai-sdk:registry https://registry.npmjs.org/
npm config set "//$registry_host:_authToken" "$NPM_REGISTRY_MIRROR_TOKEN"

# Generate npm-compatible lockfile to ensure cf does not re-resolve dependencies
npm shrinkwrap
mv npm-shrinkwrap.json package-lock.json
npm config set ignore-scripts true
