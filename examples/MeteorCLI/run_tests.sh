#!/bin/sh
export NODE_OPTIONS=--max-old-space-size=4096
export METEOR_PACKAGE_DIRS=../../../atmosphere-packages
cd ./bare
./run_tests.sh
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../lazy-loading
./run_tests.sh
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../universal
./run_tests.sh
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../all-in-one
./run_tests.sh
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi