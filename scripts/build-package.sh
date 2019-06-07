#!/usr/bin/env bash

if [[ -z "$(command -v jq)" ]]; then
    echo "--> Must install jq (brew install jq)"
    exit 1
fi

yarn build

if [[ "$?" != "0" ]]; then
    echo "Build failed. Stopping"
    exit 1
fi

PACKAGE_NAME=$(cat build/manifest.json | jq -r '.name')
PACKAGE_VERS=$(cat build/manifest.json | jq -r '.version')

cd ./build
tar -zcvf ../${PACKAGE_NAME}_${PACKAGE_VERS}.package ./
