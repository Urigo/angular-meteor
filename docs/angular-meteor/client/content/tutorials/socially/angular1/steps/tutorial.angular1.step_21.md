{{#template name="tutorial.step_21.md"}}
{{> downloadPreviousStep stepName="step_20"}}

This step of the tutorial teaches us how to add mobile support for iOS and Android and how to elegantly reuse code using the Meteor packaging system.

First, let's understand Meteor's packages: 
- A folder named `packages` under the root directory defines the *local* package of our project. "Local" means packages that we develop ourselves, rather than use existing packages. 
- We use packages to separate the code that is used for for mobile and web.

In this tutorial's example we will differentiate the login part of the project: in the browser users will login using email and password and in the mobile app users will login with SMS verification.

We create seperate AngularJS modules for mobile and web in order to seperate between this code part - it's a perfect alternative for using `Meteor.isCordova` multiple times!

### Adding mobile support for the project: 

To add mobile support, select the platform(s) you want and run the following command:

    $ meteor add-platform ios
    # OR / AND
    $ meteor add-platform android

And now to run in the emulator, run:

    $ meteor run ios
    # OR
    $ meteor run android

You can also run in a real mobile device, for more instructions, read [Meteor and Cordova integration](https://github.com/meteor/meteor/wiki/Meteor-Cordova-integration).

### creating packages

To work with packages we need to create the `packages` directory:

    $ mkdir packages

We will initially work on the package that contains the mobile logic. Let's create the mobile package by running the following command:

    $ meteor create --package socially-mobile

Meteor will create for us a default package. The main file is `package.js` that look like that:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.2" filename="packages/socially-mobile/package.js"}}

As with any auto-generated code, we do not always need everything. In this case we will remove the auto generated files that we are not using for now:

`packages/socially-mobile/socially-mobile-tests.js`

`packages/socially-mobile/socially-mobile.js`

And also remove them from the `package.js` file:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.3" filename="packages/socially-mobile/package.js"}}

The package is ready and can be added to our project running: 

  `$ meteor add socially-mobile`

We make sure that AngularJS and angular-meteor are loaded before our package by adding the following dependency using the `api.use` method:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.4"}}

### Angular Mobile Module 


In this part we will create an Angular module that contains a login route and specific html for mobile. 
We are preserving the same folder structure as we had in the main project, so the files will be located under `client/lib/`. 
Here are the steps: 


Create the angualr module and name it `socially.mobile`:

{{> DiffBox tutorialName="angular-meteor" step="21.5"}}

Add a route for the login in the client side using the `$stateProvider` like we used to, and add only the login route.

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.6"}}

Create the route's view; for now we will just use a placeholder that we will implement later.

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.7"}}

### Add module's files to the package

We need to tell our `package.js` to use the files that we created above. 
- JS file will are declared using `api.addFiles` 
- AngularJS template files (`.html`) are declared using `api.addAssets`.

We also need to add the platform declaration, using the last argument of these functions.

> The available platforms are: `web.browser`, `web.cordova`, `client` (both browser and cordova) and `server`.

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.8"}}

The original route from the root project is no longer needed and can be removed:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.9"}}

Last, we want to load the `socially.mobile` module only in Cordova environment. We can update `app.js` to load the module only when running inside Cordova (`Meteor.isCordova`):

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.10"}}

Let's try to run it inside an emulator (I used iOS Simulator on Mac OS X), it should look like that:

{{tutorialImage 'angular1' 'step21_1.png' 500}}

Great! Seems that it is working: 

### Angular Web Module 
We will do a similar process to add support for browser package. The first step is to load another AngularJS module when we run in the browser:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.11"}}

We will create a package again, named `socially-browser`, and remove the default files:

    $ meteor create --package socially-browser

Make some modifications to the `package.js` file, very similar to the mobile package:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.12"}}

> Note that we load the files only in the `web.browser` platform.

Create the `socially.browser` module:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.13"}}

Add a routes file, which defines the routes that will load only in the browser:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.14"}}

Add the web browser stub view:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.15"}}

Add the browser package to our project:

  $ meteor add socially-browser

### Angular Web Code  (reuse existing)

We will use the existing code for our web login. That means 2 things: 
- Copying the original login view file from `client/users/views/login.html` to our package view (`login-browser.html`):

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.17"}}

- Moving the current `LoginCtrl` from `client/users/controllers/login.js` to our package, and update the module's name for this controller:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.18"}}

> We can also delete `client/users/views/login.html` file. It is no longer needed!

We will load the `LoginCtrl` to our package definition:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.20"}}

### Angular Mobile Code 

We need to take care of the login view for mobile only. We will add a view with two steps: 
- Capture the user's phone number 
- Enter the SMS code verification:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.21"}}

We will use an external package that extends Meteor's Accounts, called `accounts-phone` that verifies phone number with SMS message, so let's add it:

  `$ meteor add okland:accounts-phone`

And now we will add a `LoginCtrl` that uses Accounts-Phone package to verify our phone number:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.23"}}

> Note that in development mode - the SMS will not sent - and the verification code will be printed to the Meteor log.

Now we need to load the new `LoginCtrl` in the `package.js`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="21.24"}}

And that's it! we got a different view, route and module for each platform!

## Summary

In this tutorial we showed how to make our code behave differently in mobile and web platforms and load different files using Meteor's packaging system. We did this by creating separate AngularJS modules with specific code for mobile and web, and loading them into the client based on the platform that runs the application. 

{{/template}}
