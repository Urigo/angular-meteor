{{#template name="tutorials.socially.angular1.step_11.md"}}
{{> downloadPreviousStep stepName="step_11"}}

So far, we've been building our app and testing only in a web browser,
but Meteor has been designed to work across different platforms - your socially website can become an iOS or Android app in just a few commands.

## Angular 1 initialization

Before we set up PhoneGap (which is super simple with Meteor) we will need to make a small adjustment in our Angular 1 app initialization:

In `app.js` file, we will manually bootstrap our Angular 1 app according to the right platform:

{{> DiffBox tutorialName="meteor-angular1-socially" step="11.1"}}

And then we will remove

    ng-app="socially"

from `index.html`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="11.2"}}

## PhoneGap

Meteor makes it easy to set up all of the tools required to build mobile apps, but downloading all of the programs can take a while - for Android the download is about 300MB and for iOS you need to install Xcode which is about 2GB.
If you don't want to wait to download these tools, feel free to skip to the [next step](/tutorial/step_12).

### Running on an Android emulator

In the terminal, go to your app folder and type:

    meteor install-sdk android

This will help you install all of the necessary tools to build an Android app from your project.
When you are done installing everything, type:

    meteor add-platform android

After you agree to the license terms, type:

    meteor run android

After some initialization, you will see an Android emulator pop up, running your app inside a native Android wrapper.
The emulator can be somewhat slow, so if you want to see what it's really like using your app, you should run it on an actual device.

### Running on an Android device

First, complete all of the steps above to set up the Android tools on your system.
Then, make sure you have USB Debugging enabled on your phone and the phone is plugged into your computer with a USB cable.
Also, you must quit the Android emulator before running on a device.

Then, run the following command:

    meteor run android-device

The app will be built and installed on your device. If you want to point your app to the server you deployed in the previous step, run:

    meteor run android-device --mobile-server my_app_name.meteor.com

### Running on an iOS simulator (Mac Only)

If you have a Mac, you can run your app inside the iOS simulator.

Go to your app folder and type:

    meteor install-sdk ios

This will run you through the setup necessary to build an iOS app from your project. When you're done, type:

    meteor add-platform ios
    meteor run ios

You will see the iOS simulator pop up with your app running inside.

### Running on an iPhone or iPad (Mac Only; requires Apple developer account)

If you have an Apple developer account, you can also run your app on an iOS device. Run the following command:

    meteor run ios-device

This will open Xcode with a project for your iOS app. You can use Xcode to then launch the app on any device or simulator that Xcode supports.

If you want to point your app at the previously deployed server, run:

    meteor run ios-device --mobile-server my_app_name.meteor.com

Now that we have seen how easy it is to deploy our app and run it on mobile, let's get to adding some more features.

### Submit your Android app to the Play Store:

[https://github.com/meteor/meteor/wiki/How-to-submit-your-Android-app-to-Play-Store](https://github.com/meteor/meteor/wiki/How-to-submit-your-Android-app-to-Play-Store)

### Submit your iOS app to the App Store:

[https://github.com/meteor/meteor/wiki/How-to-submit-your-iOS-app-to-App-Store](https://github.com/meteor/meteor/wiki/How-to-submit-your-iOS-app-to-App-Store)

# Summary

Now you can see how easy and amazing it is to work with Meteor and PhoneGap together.

But that's just the start - because of Meteor's hot code push, after you deploy your app to the stores, once you update your code, all your apps are
instantly updated, no need to go through the stores update process!

More more detailed information:

* [https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration](https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration)

# Troubleshoot

If your application does not work for any reason, first try running meteor with the verbose flag in order to get more information about your launch. In order to do that, run the following command:

    meteor run ios --verbose
    Note: You can also run it with "android" platform.

The following are solution for common issues we encountered:

### Emulator starts, but the application does not launch
This issue caused because of permissions issue that prevents from Cordova to launch the APK/APP on the simulator.
Usually you will see on the verbose log these errors:

    "Timed out waiting for device to boot"
    "You may not have the required environment or OS to run this project"
In order to fix that issue you will need to fix the permission by running these commands:

    sudo chown -R YOUR_USERNAME /usr/local/lib/node_modules/
    sudo chmod -R 777 /usr/local/lib/node_modules/
    sudo chown -r YOUR_USERNAME ~/.meteor/
    sudo chmod -R 777 ~/.meteor/
    sudo chown -r YOUR_USERNAME YOUR_PROJECT_FOLDER
    sudo chmod -R 777 YOUR_PROJECT_FOLDER

    Replace YOUR_PROJECT_FOLDER with your project folder and YOUR_USERNAME with the user you use to run the "meteor run" command.
    
### ERROR whitelist rejection while running on iOS

* Create `mobile-config.js` and add `App.accessRule('*');`
* Re-run meteor

{{/template}}
