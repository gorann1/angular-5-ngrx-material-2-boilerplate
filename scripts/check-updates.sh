#!/bin/sh

if hash ncu 2>/dev/null; then
    ncu
else
    echo "This script requires the npm-check-updates package to be globally installed."
    echo "Please run: npm install -g npm-check-updates"
    echo "For any further information: https://www.npmjs.com/package/npm-check-updates"
fi
