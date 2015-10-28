{{#template name="tutorial.step_21.md"}}
{{> downloadPreviousStep stepName="step_20"}}

In this step of the tutorial we will learn how to add mobile (iOS and Android) and how to create an awesome code re-use using Meteor packages system.

The first step is to understand Meteor's packages - folder named `packages` under the root directory will define the local package of our project.

In the packages we can define a separation for mobile, server, browser and Cordova (mobile) for each file.

In this example of the tutorial we will create a separation in the login part of the project: in the browser we will login as we used to so far, and in the mobile we will login with SMS verification.

We will create AngularJS modules in order to create separation between this code part - it's a perfect alternative for using `Meteor.isCordova` multiple times!

So first, we need to add support for mobile in our project - so let's do it.

To add mobile support, select the platform you want and run the following command:

    $ meteor add-platform ios
    # OR / AND
    $ meteor add-platform android

And now to run in the emulator, run:

    $ meteor run ios
    # OR
    $ meteor run android

You can also run in a real mobile device, for more instructions, read [Meteor and Cordova integration](https://github.com/meteor/meteor/wiki/Meteor-Cordova-integration).

So now our first step is to create the `packages` directory:

    $ mkdir packages

And now to create a new package - our first package is a package that will add the logic for the mobile only, so let's create the package by running the following command:

    $ meteor create --package socially-mobile

Meteor will create for us a default package, the main file is `package.js` that look like that:

{{> DiffBox tutorialName="angular-meteor" step="21.2" filename="packages/socially-mobile/package.js"}}

Let's make some cleanup and remove the generated files:

`packages/socially-mobile/socially-mobile-tests.js`

`packages/socially-mobile/socially-mobile.js`

And remove them from the `package.js` file:

{{> DiffBox tutorialName="angular-meteor" step="21.3" filename="packages/socially-mobile/package.js"}}

Now we need to add this package to our project, so let's run:

  $ meteor add socially-mobile

Now we need to make sure that AngularJS and angular-meteor are loaded before our package, so let's add a dependency by using `api.use` method:

{{> DiffBox tutorialName="angular-meteor" step="21.4"}}

Our next step is to add an AngularJS module that will loaded only in the mobile platform, we will keep using the same folder structure we used, so the file will locate in `client/lib/module.ng.js` inside our package, and we will create the `socially.mobile` module:

{{> DiffBox tutorialName="angular-meteor" step="21.5"}}

Now we need to add route for the login in the client side, so let's just use `$stateProvider` like we used to, and add only the login route.

We will use a view that we will create in the next step.

{{> DiffBox tutorialName="angular-meteor" step="21.6"}}

And now let's create this view, for now we will just use a placeholder that we will implement later.

{{> DiffBox tutorialName="angular-meteor" step="21.7"}}

Now, we need to declare using these files in our `package.js`, so any JS file will be declared using `api.addFiles` and any AngularJS template file (`.ng.html`) will be declared using `api.addAssets`.

We also use the platform declaration, using the last argument of these functions.

> The available platforms are: `web.browser`, `web.cordova`, `client` (both browser and cordova) and `server`.

{{> DiffBox tutorialName="angular-meteor" step="21.8"}}

Now let's remove the original route from the root project:

{{> DiffBox tutorialName="angular-meteor" step="21.9"}}

So now we have the `socially.mobile` module ready to use, but we want to load it only in Cordova environment, so let's update the `app.ng.js` and load it only when we run inside Cordova (`Meteor.isCordova`):

{{> DiffBox tutorialName="angular-meteor" step="21.10"}}

So now let's try it inside an emulator (I used iOS Simulator on Mac OS X), it should look like that:

{{tutorialImage 'angular1' 'step21_1.png' 500}}

Great! Now we will do a similar process to add support for browser package.

The first step is to load another AngularJS module when we run in the browser:

{{> DiffBox tutorialName="angular-meteor" step="21.11"}}

And we will create a package again, named `socially-browser`, and remove the default files:

    $ meteor create --package socially-browser

And make some modifications to the `package.js` file, very similar to the mobile package:

{{> DiffBox tutorialName="angular-meteor" step="21.12"}}

> Note that we load the files only in the `web.browser` platform.

And create the `socially.browser` module:

{{> DiffBox tutorialName="angular-meteor" step="21.13"}}

And add a routes file, which defined the routes that will load only in the browser:

{{> DiffBox tutorialName="angular-meteor" step="21.14"}}

And add a stub view:

{{> DiffBox tutorialName="angular-meteor" step="21.15"}}

Now we just need to add the browser package to our project:

  $ meteor add socially-browser

Now let's copy the original login view file from `client/users/views/login.ng.html` to our package view (`login-browser.ng.html`):

{{> DiffBox tutorialName="angular-meteor" step="21.17"}}

And now let's move the current `LoginCtrl` from `client/users/controllers/login.ng.js` to our package, and update the module's name for this controller:

{{> DiffBox tutorialName="angular-meteor" step="21.18"}}

> Also, now you can delete `client/users/views/login.ng.html` file, we do no longer need it!

And now we need to load the `LoginCtrl` in our package definition:

{{> DiffBox tutorialName="angular-meteor" step="21.20"}}

Now we need to take care of the login view for mobile only - we will add a view with two steps: one for the phone number and one for the SMS code verification:

{{> DiffBox tutorialName="angular-meteor" step="21.21"}}

We will use an external package that extend Meteor's Accounts, called `accounts-phone` that verifies phone number with SMS message, so let's add it:

  $ meteor add okland:accounts-phone

And now we will add a `LoginCtrl` that uses Accounts-Phone package to verify our phone number:

{{> DiffBox tutorialName="angular-meteor" step="21.23"}}

> Note that in development mode - the SMS will not sent - and the verification code will be printed to the Meteor log.

Now we need to load the new `LoginCtrl` in the `package.js`:

{{> DiffBox tutorialName="angular-meteor" step="21.24"}}

And that's it! we got a different view, route and module for each platform!

## Summary

So in this tutorial, we just implemented an isolation between mobile platforms and browser platforms.

We separated the actual files that loaded to our client depending on the platform that loaded the app.

We create an AngularJS module for each platform and loaded it, so we get a different behavior for each platform!

{{/template}}
