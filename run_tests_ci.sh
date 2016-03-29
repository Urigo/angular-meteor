#!/bin/sh
cd tests
npm install
meteor test --once --driver-package dispatch:mocha-phantomjs
