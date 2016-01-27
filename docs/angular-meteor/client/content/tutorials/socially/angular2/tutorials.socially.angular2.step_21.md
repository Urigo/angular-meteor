{{#template name="tutorials.socially.angular2.step_21.md"}}

We already know very well that one of the great
advantages of Meteor is one isomorphic JavaScript environment
across server and client sides. When it's said "client side",
most of us assume Web browsers, which is only partly true for Meteor, where
"client side" includes mobile platforms as well.
Meteor has full support of only one Cordova mobile platform currently,
which executes JavaScript and run apps in Web UI components of different mobile operation systems.

Our goal for this and next steps is to build a fully functional mobile app with an unique and mobile-friend UI design,
while, at the same time, to make reuse of already existed components as much as possible.
We'll choose Ionic 2 framework as our main framework for mobile development in Cordova.

In this particular step, we'll learn how to separate one UI component's code between different platforms using Meteor packages.
Since some components' logic might significally differ on different platforms, such code separation
will certantly be useful for your future apps, independly what mobile framework you prefer to work with.

# Code Separation Using Packages

As you can guess from the above, each Meteor package allows us to add source code to a specific platform.
Let's see how we are going to use this feature to implement multiple login components for different platforms.

On the mobile app, we'll let user to be authenticated by her mobile phone number.
Authentication process itself will consists of two steps: requesting a verification code provided user phone number and sending back to the server received code as a proof of phone number ownership.
Due to lack of the space on a mobile screen, such logic makes sense to implement on a separate page, where the user will be navigated to login.

On the Web app at the same time, we'd like to preserve same logic as it was before: user will login using Meteor accounts dialog.

Let's get it started. First of all, we'll need to run the following command:

    mkdir packages

It will simply create a folder called "packages", which is specially treated by Meteor.
If Meteor discovers this folder in the app structure, it always checks it for the presence of any package already added in the app.
This is especially usefull for the package development, when you desire to test quickly new changes before its publishing.
Though, we are not going to publish our future packages — they will be used for the private purposes only.

Now, let's launch the terminal inside of the packages folder and create two packages there:
one for the new mobile app and another for the old browser one:

    meteor create --package socially-mobile

    meteor create --package socially-browser

There will be created two new folders. If you look inside one of them you'll see a couple of new files added, which are worth noting.
First of all, it's a `package.js` file with the content as follows:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.1"}}

Secondly, Meteor adds two default files in each newly created package, e.g.:
`socially-mobile-tests.js` and `socially-mobile.js`.
As you can see, they are added to the package with the special API function:

    api.addFiles("socially-mobile.js")

Last parameter of this function is a platform name, where we want to add this file.
By default, it is "client", which includes both Web and Cordova platforms.
There are separate options available for each platform: `client.browser` and `client.cordova`.

As we are set to create our own package structure, let's clean up new packages from these files added by default.
Also, we'll need to remove `ecmascript` and add `urigo:angular2-meteor` instead to support
TypeScript compilation, and be able to import any of the Angular2-Meteor components inside the package:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.2"}}

Now, you need to repeat all the actions above for the browser package as well.

When you've done with it, packages are ready to be added to Socially:

    meteor add socially-mobile

    meteor add socially-browser

Now, let's clarify a couple of things before we are all set to start adding login components into these two packages.
Most importantly, we need to understand how to import components platform-wise. 

From one side, it's compelling to use Meteor's global varibales such as `Meteor.isCordova` to check 
what platform is in action now. Unfortunately, we won't be able to import components conditionally: conditional imports are not supported in ES6 yet.
Though, we can certantly use these globals in other places (and already doing so if you look inside of Meteor methods we have so far).

From other side as it's mentioned above, we can add files in a package to a some specific platform we want.
We can leverage this by registering multiple SystemJS modules with same aliases (remember, all ES6 modules are SystemJS modules behind the scene in our app) as well as creating new components that have same names for each platform.
Since only one set of files for one platform will always be executed at one time, it gives us an opportunity to import components 100% transparently, i.e., without any checks needed!

if it's still not clear how everything pulls together, don't worry —
we are going to plunge our hands into implementation details, and ultimately you will understand all nuances. 

First thing to do is to move already existed browser login component to the newly created browser package.

# Browser Login

Login component markup for the Web app currently consists of only one `<accounts-ui>` directive.
Let's create two new files in the browser package: `login.html` and `login.ts`.
Then, add that markup to the `login.html` and create new `Login` component with "login" selector in `login.ts`.
We are going to keep components as usual in their separate folders in the "client" folder:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.3"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.4"}}

As you can see, the template URL used above is quite different to what we put before in the app's components.
That's because each package's assets are distributed at an unique path in Meteor, and each of them looks like the one above, i.e.,
with `packages/package_name` prefix.

Let's create a new file and register new SystemJS module "socially". 
This module will be an entry point to access all components that browser package exports outside.
As now it has only one login component:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.5"}}

Finally, we'll need to add everything to the package using `api.AddFiles` with platform param set to "web.browser":

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.6"}}

Before we'll be able to test new package and component out, we'll make use of them inside the `PartiesList` component.
We are going to load `Login` from new `socially` namespace, and add to the list of used directives:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.7"}}

Lastly, change directive name in the tempate to `<login>`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.8"}}

Here we are. Let's run the app now as usually with "meteor" command and see what will happen.
If nothing has happened and parties list page has the same view as before: we can be sure that components loading from packages works at least for 
the browser platform.

# Mobile Login

As we discussed above, our mobile login will be quite different from the browser one.
Mobile authentication will be based from now on a verification of some code provided via the user phone.

Similar functionality is already implemented in at least in one package, so
we are going to add it to the app and focus more on new UI components that
should be added.

Let's add mobile accounts package:

    meteor add okland:accounts-phone

We also mentioned earlier that it makes sense to create a separate page in the
mobile app with new login components. Given all the mentioned above, we can sum up it into some change plan as follows:

  - mobile login component will contain simply a link to the new login page 
  - login page component will contain event hooks and codes verification logic
  - we'll need to change Socially's router configuration by adding new login route

Let's do it. First off, we are going to repeate same steps we did above for the browser package
in order to add a simple login component that wraps up only one link.
It's important to note that steps include registering a new SystemJS module and configuring `package.js`
file but excludes any manipulation of the `PartiesList`. `PartiesList` is where our browser and mobile parts meet together or,
in other words, this is how we make code reuse — one of our major goals in this step.

Source code of the new mobile `Login` component:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.9"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.10"}}

As you can see, in the `login.ts` we also re-exporting components
from the future `login-page.ts`. It's because we are going to add
login module as an entry point for the package, in the same fashion as for browser package.

Source code of new `LoginPage` component:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.11"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.12"}}

Now, register mobile SytemJS module:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.13"}}

Lastly, add all files in the package definition file:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.14"}}

The last thing to do before we will be able to test mobile version is 
to add new route to the login page. We are going to change route config of 
main app component `Socially` in `app.ts`. But small thing to note before.
We'll need to point out `LoginPage` component as part of the route configuration.
Since browser app doesn't have any login page we'll make a little trick to void any
conditional checks:

{{> DiffBox tutorialName="meteor-angular2-socially" step="21.15"}}

As you can see, we import both components: `LoginPage` and `Login`.
When mobile platform is running `LoginPage` is not null, thus, we have a legit new route.
In case of the browser, `LoginPage` is null, and `Login` will be applied creating new page hook at
the specified path. But, it doesn't matter to us since we are not going to use login route in the browser version.

Testing time. This time we are interested in running a mobile app in one of the emulators.
If you are not yet familiar how to add platforms in Meteor or run emulators, please check 11th step out.

Let's run new mobile verison of the app by hitting "meteor run ios" in the terminal.
When you hit it, iOS emulator is about to be launched with our app running inside.
There should be a "Login" link to left of the "Search" button, click on it — it should navigate to the new login page with
phone number input on it.

# Summary

In this step we learned a new technique of how to separate code between platforms using packages.
We are going to use it quite a lot in the next step, where we'll finally create a mobile app with
real mobile UX using Ionic 2 while making reuse of almost all components we've create in the Web app so far.

{{/template}}
