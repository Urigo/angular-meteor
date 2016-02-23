#!/bin/sh
npm install --only=dev
webpack
mv ./build/modules/*.d.ts ./build/
rm -rf ./build/modules
git add ./build/*