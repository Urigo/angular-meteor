#!/bin/sh
(cd examples/MeteorCLI && sh run_tests.sh)
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
(cd examples/angularjs && sh run_tests.sh)
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
(cd examples/angularcli-meteor && sh run_tests.sh)
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
