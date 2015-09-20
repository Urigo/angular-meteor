velocity test-package ./ --release velocity:METEOR@1.2-rc.15_2 --driver-package=velocity:html-reporter@0.9.0-rc.4 ./
cd examples/collectionfs
echo "######## Starting tests for example CollectionFS #######"
VELOCITY_CI=1 meteor --test
