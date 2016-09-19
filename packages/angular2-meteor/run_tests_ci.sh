#!/bin/sh
cd tests
npm install
meteor remove practicalmeteor:mocha
meteor test --once --driver-package=dispatch:mocha-phantomjs
