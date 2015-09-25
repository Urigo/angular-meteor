VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package velocity:html-reporter@0.9.0 ./
cd examples/collectionfs
echo "######## Starting tests for example CollectionFS #######"
VELOCITY_CI=1 meteor --test
