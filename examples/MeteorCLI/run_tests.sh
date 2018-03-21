#!/bin/sh
export NODE_OPTIONS=--max-old-space-size=4096
export METEOR_PACKAGE_DIRS=../../../atmosphere-packages
cd ./bare
sh run_tests.sh
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../lazy-loading
sh run_tests.sh
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../universal
sh run_tests.sh
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../all-in-one
sh run_tests.sh
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi