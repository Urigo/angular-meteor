#!/bin/sh
gulp 'build'
cd tests
meteor test --driver-package=avital:mocha
