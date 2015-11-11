{{#template name="tutorials.socially.angular1.step_22.md"}}
{{> downloadPreviousStep stepName="step_21"}}

Ionic is css and Javascript framework. It is highly recommended that before starting this step you will get yourself familar with its [documentation](http://ionicframework.com/docs/).

In this step we will learn how to add Ionic library into our project, and use its powerful directives to create cross platform mobile (Android & iOS) applications. 

We will achieve this by creating seperate views for web and for mobile  so be creating a separate view for the mobile applications. 

### Separate the main view file

Out current list display is relevant for browser app only. For mobile applications we want a different view. Therefore we need to move the parties list code from the project root code which is common to app and browser into a specific web code. 

Also, all the tags from the `index.html` file are based on angular-material and are only relevant for bowser code. We use the `ui-view` in the `body` tag to indicate that this is used as a view container for the other views. 

{{> DiffBox tutorialName="angular-meteor" step="22.1"}}

We will move the browser main page HTML to a new file, under the `socially-browser` package. Also, let's add a nested view called `main`, that will contain the actual page code that is relevant to the browser.

{{> DiffBox tutorialName="angular-meteor" step="22.2"}}

Next, we will update the `routes.js`file of the `socially-browser` package. We will add the main view as abstract view in order to set it as the base template, and create a view for the parties list.

{{> DiffBox tutorialName="angular-meteor" step="22.3"}}

Let's update the `routes.js` file of the root project, and use the base template we just created for the browser:

{{> DiffBox tutorialName="angular-meteor" step="22.4"}}

Now we just need to move the PartiesListCtrl from the root project to the browser project and update it's package name:

{{> DiffBox tutorialName="angular-meteor" step="22.5"}}

We changed the name of the states in the last steps, so we need to update it's usage anywhere we use states names, so update it in any file, you can see the full commit that made that change [here](https://github.com/Urigo/meteor-angular-socially/commit/df078be907d053cbd1ffa6071368a60c8f929b97).

Then next step is to update our `package.js` file and include the files we moved to the package: 

{{> DiffBox tutorialName="angular-meteor" step="22.8"}}

And now our parties list and the main layout is loaded for the browser package only.

### Using Ionic

Using ionic is pretty simple - first, we need to add a dependency in the `package.js` of our `socially-mobile`:

{{> DiffBox tutorialName="angular-meteor" step="22.10"}}

Ionic is based on AngularJS, therefore we also need to load the `ionic` as a module dependency in the `socially.mobile` module:

{{> DiffBox tutorialName="angular-meteor" step="22.11"}}

Here we create a new main page that contains the main layout of the mobile app. This is a simple navigation layout that is  copied & pasted from the Ionic documentation.

{{> DiffBox tutorialName="angular-meteor" step="22.12"}}

> The `ion-nav-view` tag is similar to the `ui-view` tag, so we can use the same view (`main`) here.

We will create a layout base for our parties list and later we will implement the whole view.

{{> DiffBox tutorialName="angular-meteor" step="22.13"}}

As with any other file, this one also need to be added to the `package.js` file :

{{> DiffBox tutorialName="angular-meteor" step="22.14"}}

Not to forget to add the routes to the `routes.js` of the `socially-mobile` module.

We will add the basic view (`socially` abstract state) and add other states that extend the view.

{{> DiffBox tutorialName="angular-meteor" step="22.15"}}

The partiesList controller does not contain all the funcitonality as in the browswr. So we will create a stripped down `PartiesListCtrl` for our mobile:

{{> DiffBox tutorialName="angular-meteor" step="22.16"}}

We will attach the new controller to our state:

{{> DiffBox tutorialName="angular-meteor" step="22.17"}}

Surely enough, include the new files in the `package.js`:

{{> DiffBox tutorialName="angular-meteor" step="22.18"}}

And now we need to create the view of the parties list for the mobile platform, using Ionic's directives and CSS.

Now we add the content of the parties list. This is pretty straight forward using Angular directives and Ionic classes:

{{> DiffBox tutorialName="angular-meteor" step="22.19"}}

The `getMainImageUrl` method is used to retrieve the, well, main image of the party. It needs to be implemented in the controller:

{{> DiffBox tutorialName="angular-meteor" step="22.20"}}

And... we're done!

We will use the techniques we learned in Step 21 of the tutorial and run the project in our favorite emulator, I used iOS so

    $ meteor run ios

And this is the result:

{{tutorialImage 'angular1' 'step22_1.png' 500}}

## Summary

In this tutorial we showed how to use Ionic and how to separate the whole view into two different application, using packages isolation and AngularJS modules.

We also used Ionic directives in order to provide user-experience of mobile platform instead of regular responsive layout of website.

Using these techniques we can create a separated code and logic for each platform, but still share some code parts (for example, AngularJS filters or Services).

{{/template}}
