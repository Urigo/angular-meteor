{{#template name="tutorials.socially.angular2.step_22.md"}}
{{> downloadPreviousStep stepName="step_21"}}

In this step we'll ultimately create a new Ionic 2 app.
But before, we'll move our UI component classes to a special package
that will contain buisiness logic of the app. That's 
because our goal for this step is not simply to build a mobile app but also to make 
reuse of the data loading and manipulation code we've done so far in the Web app. 
Then, we'll move fully Web version including UI templates and specific logic from the _client_ folder to the browser package
in the way we've started in the previous step.

That's our plan. Let's do it.

# Package for Components Logic

As it was stated above, our first task is to move components'
business logic to a separate package so that we'll be able to 
use common parts, which load and process data on the client,
both in browser and mobile apps.

Let's create a new package called "socially-client" in the _packages_ folder:

    meteor create --package socially-client

> Don't forget to clean up this package from the default files as it's been done in the previous step.

We are going to move `PartyDetails` to that package now to learn how the whole process looks like.

First, we are moving `party-details.ts` file to the _party-details_ folder of the new package, then,
stripping all annotations and other browser-specific stuff off the class leaving in bare
class itself with the data loading and manipulation logic only. We also need to make a minor generalization:
we need to remove a part of the constructor that gets party ID from the routing parameters 
due to `RouteParams` is browser-specific. Instead, we are going to pass party ID directly into the constructor.
Either mobile or browser components will extend this common class and will pass all required parameters
in the parent constructor. As the result we have the class as follows:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.1"}}

In the similar fashion, we are moving other components like `PartiesList` and 
`PartiesForm` to the new package. Commits that do it: [one](https://github.com/Urigo/meteor-angular2.0-socially/commit/547b32851ba59a8987cf453b0a13e648d4271656) and [two](https://github.com/Urigo/meteor-angular2.0-socially/commit/3b32203e9dcc44f2228afe683675741356d32ead).

We'll need to move pipes to the client package as well since most of them will be common to different platforms (whether browser or mobile).
Check out this commit [here](https://github.com/Urigo/meteor-angular2.0-socially/commit/9e60b82bfc4dd0aeecd1c8bacdb084ffc43d961e).

As you can remember from the previous step, we also need to create a main file of 
the package that defines what package will export, and a file that registers a new SystemJS module:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.2"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.3"}}

We are finishing up this paragraph with changing `package.js` to contain all package files:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.4"}}

# Browser Package

When we are done moving component classes to the client package, 
we are ready to move stuff that are specific to different platforms:
component templates, component annotations (basically annotations configures components in some way),
and some specific internal logic of the components.

Let's move `PartyDetails` component to the browser package. Other components can be done in the same way.
We are simply moving _party-details_ folder of the app to the client folder of the package.
While template itself remains untouched, we remove all methods of the `PartyDetails` class except
only one `mapClicked`, which is specific to the browser app that has maps feature.
We are also correcting template URL to point out to the package that will contain it from now on:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.5"}}

Now we need to import `PartyDetails` class from the client package
and make it a base class of the current `PartyDetails` instead of `MeteorComponent`.
We'll have to take into account that the parent `PartyDetails` has party ID constructor paramater:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.6"}}

As you can see, `PartyDetails` is imported from the "socially-client" as `PartyDetailsBase` to extend the browser's `PartyDetails`.
Notice that some unnecessary imports have also removed as well.

To finish up adding files to the package, we are updating `package.js`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.7"}}

In the same way, we are moving party form and parties list components to this package.
Commits making these changes are [here](https://github.com/Urigo/meteor-angular2.0-socially/commit/83077643319396e031c751463fe9b1727e85b7d8) and [here](https://github.com/Urigo/meteor-angular2.0-socially/commit/fc7991ba7e04f548e22583a00102cd5f13240b91).
Notice that we are importing already local to this package login and form components in the `parties-list.ts`,
that's why relative paths are being used internally, i.e. starting from `./`, instead of the absolute ones.

Ionic 2 and Web apps will be too different to share same CSS styles, hence, we need to move our current Web styles from the app to the current package as well.
We are adding `main.css` as an asset in `package.js`. A commit moving styles is [here](https://github.com/Urigo/meteor-angular2.0-socially/commit/6004bbe3e5bf940a3b59835b67c70ab7db289898).

Now let's create `main.ts` to define what this package exports outside:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.8"}}

and update `package.js` and `system_config.js` to include this file:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.9"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.10"}}

Browser package now contains all UI components as the app itself.
So let's clean the app up from the old components and test whether the app
now built fully from the browser package's components will work the same in a browser as before.
But before that, we'll need to update `app.ts` to import every component from the "socially-browser":

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.11"}}

Remember "socially-browser" package is registered as "socially" SystemJS module, which
eventually allows us to use both browser and mobile packages in one app.

Lastly, we'll need to move browser specific dependencies like maps and pagination from the app to the current package while
adding "socially-client" package itself as dependency:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.12"}}

Let's remove above mentioned packages from the app itself:

    meteor remove barbatus:ng2-meteor-accounts-ui
    meteor remove barbatus:ng2-pagination
    meteor remove barbatus:ng2-google-maps

Run the app now. You'll see the same UI. Check out that everything works the same as before.

# Ionic 2 app in Mobile package

It's the time to create our new mobile app based on Ionic 2.

As you probably know, one of the most popular mobile layouts today is
a classic side menu layout on a page with three main elements: a list of some items as the body of the page,
a side menu, and a top (navigation) bar with at least one button to open or close side menu.
Ionic 2 has a lot of ready components that allows to build layouts like mentioned very easy.
If you are familiar with Ionic 1, all new changes of the Ionic 2 will look
straightforward to you. If you are new to Ionic, you can find excessive information
online how to build mobile apps with Ionic, which is one of the most popular mobile framework today.

So let's create main app template and place it in the _client_ folder of the mobile package.
To build classic layout, we'll need to add a left side menu with a list of view links to navigate, a top navigation bar, and prepare the main layout
to render each new page content during navigation:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.13"}}

As it was said above, Ionic 2 has a bunch of ready to use directives to build such classic mobile UI.
We've added menu using `<ion-menu>`; there is also a navigation directive `<ion-nav>`, which simply renders a view at a particular navigation path, similar to the `<router-outlet>`.
As you can see, it has "root" property bound to a `partiesList` class variable. In that way, we'll set the parties list view to
be the main view (or page) of the app. Besides that, this directive has a template variable `#content` set on it.
This variable is used by Ionic 2's navigation system to recognize what page content should be rendered at the current moment.
You'll see just slightly below how the same variable is used by a page component's template from other side to define what content should be rendered on this page,
thus, synchronizing with the navigation directive. 
Another part of the Ionic 2 navigation system is a special controller injected in a component's constructor, which is used to notify the navigation system what to render.
We'll take a look into that latter. If you want to know more about the navigation,
you can always refer to the official API [documentation](http://ionicframework.com/docs/v2/components/#navigation).

Now let's create a UI for the party details view. It'll look like this:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.14"}}

It has two special Ionic 2 directives worth noting: `<ion-navbar>` and `<ion-content>`.
As you can guess, the former sets up a navigation bar of this page, while
the latter applies some Ionic 2 styles to the view's content. Most importantly though, it has 
template variable `#content` set on it for the reason mentioned above.

Component class itself looks similar to the Web version with only one tangible difference: Ionic 2 navigation's
class `NavParams` is used to access navigation params:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.15"}}

In similar fashion, we create Ionic 2 version of the party form view.
This view will be a separate page in comparison to the Web version.
Commit that creates this view is [here](https://github.com/Urigo/meteor-angular2.0-socially/commit/a6847121b2f9cf728aaa17d5ee6995a037594303).

The same as for the Web version, parties list view will be the main view of the mobile app.
This page's navigation bar will have, besides "hamburger" icon for the left menu, another "plus" button to go to the party form view and 
create a new party:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.16"}}

As you can see, UI has a `<ion-list>` of parties where each `list-item` shows 
party stats and has two buttons: to remove the party and navigate to the party details view.

Below is the component's source code:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.17"}}

Let's a take a look into how navigation works in an Ionic 2 app.
There is a special Ionic 2 class called `NavController`, which has two primary methods:
`push` and `pop`. If we "push" some component on top of the navigation stack the app will 
navigate to that component, which in fact means the navigation content stub directive, we've seen earlier, will
render and show that component. `pop` is the opposite version: it simply rolls out the navigation stack in the opposite direction.

Let's build now Ionic 2 version of the login view. Since this view will be a separate page now, 
we are gong to remove `Login` component and change `LoginPage`'s template to be in Ionic 2 style as follows: 

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.18"}}

`LoginPage` component itself has rather minor changes:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.19"}}

As you can see, we've added `@Page` annotation and made use of `NavController`.

Lastly, similar to what has been done in the previous paragraph,
we need to update `package.js` to add Ionic 2 package and other dependecies.
We also synchronize it with all new file additions and removals:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.20"}}

`barbatus:ionic2-meteor` packages Ionic 2 for Meteor while adding
some customized `MeteorApp` decorator from the Ionic 2 NPM to make them work together.

> Please note that Ionic 2 adds its own solution to fix well-known 300ms click delay issue
> on the mobile Web platforms. From other side, [fastclick](https://atmospherejs.com/meteor/fastclick) package that fixes the same,
> goes as a dependency of the [mobile-experience](https://atmospherejs.com/meteor/mobile-experience), a package that is added by default to any Meteor app.
> So, you'll have to remove it from the app in order to avoid conflicts with Ionic 2.
> You can re-add, though, any other dependency, like "launch-screen", separately if you need to.

Also, don't forget  to create `main.ts` to define package exports and,
then, update `system_config.js` to reference new main module with exports.
Check out these commits: [one](https://github.com/Urigo/meteor-angular2.0-socially/commit/65da2b2f8832ac470121a9f4a9b16f82ea5ca13d) and [two](https://github.com/Urigo/meteor-angular2.0-socially/commit/17f090f6f4020828b19a18852b421cac1afff9e4).

You've probably noticed that there were used some CSS styles in the templates.
Don't forget to add them to you app as well. Corresponding commit is [here](https://github.com/Urigo/meteor-angular2.0-socially/commit/32468d2f32a88adc99090f98eda0d0f0c9a0c92d).

# One App — Two Platforms

In this paragraph we are going to pull everything together.
To reach it we'll need to solve a couple of issues.
First of all, each platform needs its own providers and
directives to be passed to the Angular 2 bootstrap.
Besides that, main app class may contain some specific configuration,
for example, routing configuration, which we'll need to take it into account as well.

To fix that, we are going to create a new package API, which will consist of three
elements: a customized boostrapping decorator, a base app class to be used for configuration,
and a special abstraton to work with navigation.
This API will be implemented by both packages, thus, allowing us ultimately to run the app for both platforms.

## Browser Platform

`Socially` component in the `app.ts` is the main app component, which is used basically 
to configure the app before the bootstrapping takes place.
In our case, it consists of the routing configuration, currently only for the Web version.
Since mobile and browser is quite different, it's not hard to guess that
bootstrapping of them as well as routing configuration will be different.

There is a special class decorator called `MeteorApp` provided by Ionic 2, which is 
supposed to bootstrap Ionic 2 app. Internally, it just adds some global Ionic 2's 
directives and providers before the Angular 2 bootstrapping.

Luckily, Angular2-Meteor contains similar decorator as well.
Though, we might need an extended verion of this decorator in order to
append additional specific to the platform providers and directives.
So instead, we are going to create and export a decorator-wrapper over
`MeteorApp` with the same name to provide some additional data.

Let's copy `app.ts` from the app's _client_ folder as is and then change it to be as follows:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.21"}}

As you can see, `MeteorApp` has been imported as `MeteorAppBase` and
then wrapped in another method with the same name. Inside, we execute `MeteorAppBase`
passing in additionally a template string and routing specific providers. 

Notice a new class `NavProvider`. That's an abstration used to access routing on the main app class's level.
Main app class, `App`, is the place where platform-wise configuration happens.
In our case, we use it to configure routing.

Since `MeteorApp`, `App`, and `NavProvider` are now the only elements we need from this package to be exported,
let's change `main.ts` accordingly:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.22"}}

Don't forget to add `app.ts` to `package.js` to make it finally appear in the package.
[This](https://github.com/Urigo/meteor-angular2.0-socially/commit/2e5107aca2c1a28ab83868d183c20e3bd71ca828) commit does it.

Having this done, we can change the main `Socially` to contain only elements of the package's API,
`MeteorApp`, `NavProvider` and `App`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.23"}}

Let's verify now that the Web version works as before. Run the app.
Click on links, try to create a new party.

We've done it! Everything works as before, at the same time, the app now is in one file only!

## Mobile Platform

Let's now create mobile version of `MeteorApp`, `NavProvider`, and `App`.
Put the following content into the `app.ts`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.24"}}

As you can see above, there are some differences in comparison to
the browser's version, and which outline mostly nuances of the Ionic 2 API usage.
First of all, `NavController` takes in `IonicApp` as parameter,
only later retriving navigation controller in `get` method with the help of the app instance, or in other words, doing it on demand.
That's because the navigation controller is taken through the navigation directive component, which
might not be still rendered at the moment of the app bootstrapping.
Also, we are importing `MeteorApp` from the Ionic2-Meteor package and, then, wrapping it in a method in order to pass in additional data.

At this point we are almost done with mobile verison as well:
don't forget only to export `app.ts` and update `package.js` to include `app.ts` and `client/app.html`, and that will be it!

Now run iOS or Android emulator as follows:

    meteor run ios

or:

    meteor run android

> It assumes that you have Xcode or any Android emulator istalled. If you don't, read step 11 how to configure mobile develoment environment
> in Meteor.

Whoa, we've got a nice Ionic 2 app! Let's test it. Go to some party details page, go back.
Click on the "add" icon in the nav bar and be transferred to the party form page.
Create a new party there and, when you are back to the main page, verify that parties list has been updated properly.

It's amazing that we have a fully functional mobile app, but
at the same time, if to hit `meteor --port 4000` simply in the terminal, we can open our Web version
in a browser running at `http://localhost:4000`. So that we have two apps running side by side!


> You've probably noticed that the type-checking is broken in our three packages long time ago
> since all used namespaces are underlined red. 
> That's because your IDE's TypeScript need to be aware of new TypeScript files from that packages, and which is
> usually fixed by adding new files to the `tsconfig.json`. In our case though, it's enough to add just `main.ts` files.
> After the first app run, Ionic2-Meteor definition files will be added to the _typings_ folder.
> These files need to be taken into account as well.

> There were two new main namespaces introduced in the app: `socially` and `socially-client`.
> To fix type-checking for them as well, you'll need to
> describe components of these namespaces in a new definition file.
> Or you can just copy it from [here](https://github.com/Urigo/meteor-angular2.0-socially/commit/1865c6246bf322c7c88e14925d0683ad6733779c).

> All new changes of the `tsconfig.json` combined looks like:

{{> DiffBox tutorialName="meteor-angular2-socially" step="22.25"}}


# Summary

In this step, we've reached out goal - to build a new mobile Socailly app using Ionic 2, while
at the same time, preserving the Web version of the app intact and making maximum possible 
reuse of the components for both versions.

{{/template}}
