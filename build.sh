#!/bin/sh
npm install --dev
webpack
mv ./build/modules/*.d.ts ./build/
rm -rf ./build/modules
git add ./build/*