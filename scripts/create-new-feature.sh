#!/bin/sh

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPT_PATH/wizard && node createNewFeature.js && cd ../