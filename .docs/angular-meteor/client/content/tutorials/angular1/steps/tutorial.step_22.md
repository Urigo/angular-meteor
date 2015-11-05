{{#template name="tutorial.step_22.md"}}
{{> downloadPreviousStep stepName="step_21"}}

This step of the tutorial teaches us how to add and use Ionic into our project, and use it's powerful directives to create cross platform (Android & iOS) mobile applications.

First, I recommend to get to know Ionic in it's [documentation](http://ionicframework.com/docs/).

In this tutorial's example we will differentiate the parties list view, and create a separated view for mobile platforms with Ionic.

### Separate the main view file

The first thing with separating the mobile view and the browser view is to create a different main page.

Our target is to move the parties list from the root project into the browser's code (this is the main page of our app), because the current list of only relevant to a browser view.

The first step we need to do is to remove all the tags from the `index.html` because it is based on angular-material and it is only relevant for the browser:

{{> DiffBox tutorialName="angular-meteor" step="22.1"}}

> Note that we added `ui-view` to the `body` tag in order to declare that this is will use as the container of the other views.

And let's take the browser main page HTML and put it in a new file, under the `socially-browser` package.

We will also add the nested view called `main` that will contain the actual page that related to the browser.

{{> DiffBox tutorialName="angular-meteor" step="22.2"}}

Now our next step is to update the `routes.js` file of the `socially-browser` package.

We will add the main view as abstract view in order to set it as the base template, and we will create a view for the parties list.

{{> DiffBox tutorialName="angular-meteor" step="22.3"}}

And now let's update the `routes.js` file of the root project, and use the base template we just create for the browser:

{{> DiffBox tutorialName="angular-meteor" step="22.4"}}

Now we just need to move the PartiesListCtrl from the root project to the browser project and update it's package name:

{{> DiffBox tutorialName="angular-meteor" step="22.5"}}

We changed the name of the states in the last steps, so we need to update it's usage anywhere we use states names, so update in in any file, you can see the full commit that made that change [here](https://github.com/Urigo/meteor-angular-socially/commit/df078be907d053cbd1ffa6071368a60c8f929b97).

Then next step is to update our `package.js` file and include the files we moved to the package, so let's do it:

{{> DiffBox tutorialName="angular-meteor" step="22.8"}}

And now our parties list and the main layout is loaded from the browser package only.

### Using Ionic

Use ionic is pretty simple - first, we need to add a dependency in the `package.js` of our `socially-mobile`:

{{> DiffBox tutorialName="angular-meteor" step="22.10"}}

And because Ionic is based on AngularJS, we also need to load the `ionic` module in the `socially.mobile` module:

{{> DiffBox tutorialName="angular-meteor" step="22.11"}}

Now let's create a new main page that contains the main layout of the mobile app.

We will create a simple navigation layout, I just copied & paste some code from the Ionic documentation.

{{> DiffBox tutorialName="angular-meteor" step="22.12"}}

> Note that we used `ion-nav-view` tag, which provides use the same logic of `ui-view`, so we used our main view (`main`) there.

And now let's create an layout base of our parties list, we will later implement the whole view.

{{> DiffBox tutorialName="angular-meteor" step="22.13"}}

And just like any other new files, we need to add it in the `package.js` of our package:

{{> DiffBox tutorialName="angular-meteor" step="22.14"}}

And of course, we need to add the routes to the `routes.js` of the `socially-mobile` package.

We will add the basic view (`socially` abstract state) and add other states that extends it's view.

{{> DiffBox tutorialName="angular-meteor" step="22.15"}}

Now we need to add the `PartiesListCtrl` to our mobile, we add a similar logic of the browser, but with the minimal features.

{{> DiffBox tutorialName="angular-meteor" step="22.16"}}

And let's add this controller to our state:

{{> DiffBox tutorialName="angular-meteor" step="22.17"}}

And include the new files in the `package.js`:

{{> DiffBox tutorialName="angular-meteor" step="22.18"}}

And now we need to create the view of the parties list for the mobile platform, using Ionic's directives and CSS.

We will add a list of cards with some details and image:

{{> DiffBox tutorialName="angular-meteor" step="22.19"}}

And also let's implement the `getMainImageUrl` method in the controller:

{{> DiffBox tutorialName="angular-meteor" step="22.20"}}

And we're done!

We will use the techniques we learned in Step 21 of the tutorial and run the project in our favorite emulator, I used iOS so

    $ meteor run ios

And this is the result:

{{tutorialImage 'angular1' 'step22_1.png' 500}}

## Summary

In this tutorial we showed how to use Ionic and how to separate the whole view into two different application, using packages isolation and AngularJS modules.

We also used Ionic directives in order to provide user-experience of mobile platform instead of regular responsive layout of website.

Using these techniques we can create a separated code and logic for each platform, but still share some code parts (for example, AngularJS filters or Services).

{{/template}}
