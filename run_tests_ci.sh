#!/bin/sh
npm install
cd tests
npm install
meteor test --once --driver-package=dispatch:mocha-phantomjs
