{{#template name="tutorials.socially.angular2.step_11.md"}}
{{> downloadPreviousStep stepName="step_09"}}

So far, we've been building our app and testing only in a web browser,
however Meteor has been designed to work across different platforms — your socially website can become an iOS or Android app with just a few commands.

## Cordova

Meteor uses an open-sourced framework called [Cordova](https://cordova.apache.org) to build and run Web apps on iOS or Android mobile devices.

Cordova is integrated with Meteor's toolkit, which means you won't need anything more than the `meteor` command in the terminal to build mobile Web apps. You will, however, require two necessary dependencies to install:

- an Android emulator for Android
- XCode for iOS.

In addition, Meteor has an especially useful feature for mobile apps: [hot code pushes](http://info.meteor.com/blog/meteor-hot-code-push).
After you deploy your app to the stores, once you update your code, all your apps are instantly updated; no need to go through the app/play store update process!

You can find more information about Cordova integration with Meteor [here](https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration).

### Running on Android Emulator

In the terminal, go to your app folder and type:

    meteor install-sdk android

This will help you install all of the necessary tools to build an Android app from your project.
When you are done installing everything, type:

    meteor add-platform android

After you agree to the license terms, type:

    meteor run android

After some initialization, you will see an Android emulator pop up, running your app inside of a native Android wrapper. The emulator can be somewhat slow, [Geny Motion](https://www.genymotion.com/) is a popular Android emulator alternative. However, if you want to see what it's really like using your app, you should run it on an actual device.

### Running on an Android Device

First, complete all of the steps above to set up the Android tools on your system.
Then, make sure you have USB Debugging enabled on your phone and the phone is plugged into your computer with a USB cable. You must also quit the Android emulator before running your app on a device.

Run the following command:

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

### Running on an iPhone or iPad (Mac Only)

> Requires an Apple developer account

If you have an Apple developer account, you can also run your app on an iOS device. Run the following command:

    meteor run ios-device

This will open Xcode with a project for your iOS app. You can use Xcode to then launch the app on any device or simulator that Xcode supports.

If you want to point your app to the previously deployed server, run:

    meteor run ios-device --mobile-server my_app_name.meteor.com

### Submit your Android app to the Play Store:

[https://github.com/meteor/meteor/wiki/How-to-submit-your-Android-app-to-Play-Store](https://github.com/meteor/meteor/wiki/How-to-submit-your-Android-app-to-Play-Store)

### Submit your iOS app to the App Store:

[https://github.com/meteor/meteor/wiki/How-to-submit-your-iOS-app-to-App-Store](https://github.com/meteor/meteor/wiki/How-to-submit-your-iOS-app-to-App-Store)

# Summary

Now that we have seen how easy it is to deploy our app and run it on mobile, let's get to adding some more features. In the [next step](/tutorials/angular2/search-sort-pagination-and-reactive-vars) we'll look at adding party sorting and pagination.

{{/template}}
