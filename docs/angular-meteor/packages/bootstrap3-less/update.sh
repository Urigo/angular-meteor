#!/bin/bash

BOOTSTRAP_ROOT=$1
BOOTSTRAP_DIRS="less js fonts"
BOOTSTRAP_JS="transition alert button carousel collapse dropdown modal tooltip popover scrollspy tab affix"
METEOR_PACKAGE_FILE=package.js

# check if the path is given and exists
if [ ! -d $BOOTSTRAP_GIT_ROOT ]
then
	echo "You must have a copy of bootstraps git repository and give a valid path as parameter to this script"
	exit 1
fi





# check if all reaquired directories exist
for DIR in $BOOTSTRAP_DIRS
do
	if [ ! -d "$BOOTSTRAP_ROOT/$DIR" ]
	then
		echo "The required directory '$DIR' wasn't found in your bootstrap copy"
		exit 2
	fi
done

echo "bootstrap installation found, delete old files..."
rm lib/less/*.less* lib/js/*.js lib/fonts/*





echo "copy files from bootstrap installation..."
cp $BOOTSTRAP_ROOT/js/*.js lib/js
cp $BOOTSTRAP_ROOT/fonts/* lib/fonts
cp $BOOTSTRAP_ROOT/less/* lib/less
# versions of meteor after v0.7.0.1 (excluding) want .import.less instead of .lessimport
rename "s/\\.less/\\.import.less/" lib/less/*.less





echo "generate package.js file"

echo "Package.describe({ summary: 'Bootstrap 3, with Less files.' });" > $METEOR_PACKAGE_FILE
echo >> $METEOR_PACKAGE_FILE
echo "Package.on_use(function (api) {" >> $METEOR_PACKAGE_FILE
echo "  api.use('jquery', 'client');" >> $METEOR_PACKAGE_FILE
echo "  api.use('less', 'client');" >> $METEOR_PACKAGE_FILE

echo >> $METEOR_PACKAGE_FILE
echo "  // javascript" >> $METEOR_PACKAGE_FILE
for JSFILE in $BOOTSTRAP_JS
do
	echo "add javascript file '$JSFILE.js'"
	echo "  api.add_files('lib/js/$JSFILE.js', 'client');" >> $METEOR_PACKAGE_FILE
done

echo >> $METEOR_PACKAGE_FILE
echo "  // fonts" >> $METEOR_PACKAGE_FILE
for FONTFILE in lib/fonts/*
do
	echo "add font file '$FONTFILE' to $METEOR_PACKAGE_FILE"
	echo "  api.add_files('$FONTFILE', 'client');" >> $METEOR_PACKAGE_FILE
done

echo "});" >> $METEOR_PACKAGE_FILE



echo "done!"
