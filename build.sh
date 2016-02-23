#!/bin/sh
webpack
mv ./build/modules/*.d.ts ./build/
rm -rf ./build/modules
git add ./build/*