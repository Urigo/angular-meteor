#!/bin/sh
cd tests
npm install
meteor test --driver-package=avital:mocha
