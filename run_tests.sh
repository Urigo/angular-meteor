#!/bin/sh

cd tests
linklocal
meteor test --driver-package=practicalmeteor:mocha
meteor test --full-app --once --driver-package=practicalmeteor:mocha
