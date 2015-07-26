{{#template name="sharedStep07"}}

# Running your app on Android or iOS

> Currently, Meteor on Windows does not support mobile builds. If you are using Meteor on Windows, you should skip this step.

So far, we've been building our app and testing only in a web browser, but Meteor has been designed to work across different platforms - your simple todo list website can become an iOS or Android app in just a few commands.

Meteor makes it easy to set up all of the tools required to build mobile apps, but downloading all of the programs can take a while - for Android the download is about 300MB and for iOS you need to install Xcode which is about 2GB. If you don't want to wait to download these tools, feel free to skip to the next step.

{{#if specialContent}}
  {{> Template.dynamic template=specialContent}}
{{/if}}

### Running on an iOS simulator (Mac Only)

If you have a Mac, you can run your app inside the iOS simulator.

Go to your app folder and type:

```bash
meteor install-sdk ios
```

This will run you through the setup necessary to build an iOS app from your project. When you're done, type:

```bash
meteor add-platform ios
meteor run ios
```

You will see the iOS simulator pop up with your app running inside.

### Running on an Android emulator

In the terminal, go to your app folder and type:

```bash
meteor install-sdk android
```

This will help you install all of the necessary tools to build an Android app from your project. When you are done installing everything, type:

```bash
meteor add-platform android
```

After you agree to the license terms, type:

```bash
meteor run android
```

After some initialization, you will see an Android emulator pop up, running your app inside a native Android wrapper. The emulator can be somewhat slow, so if you want to see what it's really like using your app, you should run it on an actual device.

### Running on an Android device

First, complete all of the steps above to set up the Android tools on your system. Then, make sure you have [USB Debugging enabled on your phone](http://developer.android.com/tools/device.html#developer-device-options) and the phone is plugged into your computer with a USB cable. Also, you must quit the Android emulator before running on a device.

Then, run the following command:

```bash
meteor run android-device
```

The app will be built and installed on your device. If you want to point your app to the server you deployed in the previous step, run:

```bash
meteor run android-device --mobile-server my_app_name.meteor.com
```

### Running on an iPhone or iPad (Mac Only; requires Apple developer account)

If you have an Apple developer account, you can also run your app on an iOS device. Run the following command:

```bash
meteor run ios-device
```

This will open Xcode with a project for your iOS app. You can use Xcode to then launch the app on any device or simulator that Xcode supports.

If you want to point your app at the previously deployed server, run:

```bash
meteor run ios-device --mobile-server my_app_name.meteor.com
```

Now that we have seen how easy it is to deploy our app and run it on mobile, let's get to adding some more features.

{{/template}}
