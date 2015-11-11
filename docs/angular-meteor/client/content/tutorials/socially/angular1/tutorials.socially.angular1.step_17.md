{{#template name="tutorials.socially.angular1.step_17.md"}}
{{> downloadPreviousStep stepName="step_16"}}

Meteor has a great support for CSS.

Like other types of files, Meteor gathers all CSS files for the client will get a bundle with all the CSS in your app.

Meteor also pre-process the CSS files and minifies them (in development it doesn't for easier debugging).

Meteor also supports [LESS](http://lesscss.org/) as its default CSS pre-processor (the package is maintained by the Meteor team themselves).

LESS extends CSS with dynamic behavior such as variables, mixins, operations and functions. It allows for more compact stylesheets and helps reduce code duplication in CSS files.

With the less package installed, .less files in your application are automatically compiled to CSS and the results are included in the client CSS bundle.

# Adding simple styling

Create a new folder called 'styles' under the 'client' folder and add a new file - main.css under that folder.

Then change the background color of our app:

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.1"}}

Run the app and see your background color changed.

# CSS Frameworks

There are many CSS frameworks that help us write less CSS.

Right now the most popular one is [Bootstrap](http://getbootstrap.com/) so we are going to use that in this tutorial.

* We are also keeping close watch on [Polymer](https://www.polymer-project.org/) and [Famo.us/angular](http://famo.us/integrations/angular) and might  update the tutorial to use those instead of Bootstrap in the future.

Let's add Bootstrap Meteor package to our project:

    meteor add twbs:bootstrap


Now let's start organizing by putting the Home link and the login buttons inside a navbar and the rest of the content inside a Bootstrap .container class.

Inside `index.html` surround the H1 and the loginButton with a header like that:

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.3"}}

Converting to Bootstrap doesn't stop here. By applying bootstrap styles to various other parts of our Socially app, our website will look better on different screens. Have a look at [Code Diff](https://github.com/Urigo/meteor-angular-socially/compare/step_16...step_17) to see how we changed the structure of the main files.

# Less

OK, simple styling works, but we want to be able to use [LESS](http://lesscss.org/).

First change the file name from main.css to `main.less`.  Now add the LESS package in the command line:

    meteor add less

Test that everything still works as before.

Now go to `main.less` and add a different background color to the navbar:

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.5"}}


Notice that we nested the .navbar inside the body. This is part of the [LESS syntax for nested rules](http://lesscss.org/features/#features-overview-feature-nested-rules).

# Designing the parties list

Now we are going to design the parties list.

Like the Javascript and HTML files, we want the specific styling of parties to be inside the 'client->parties' folder so create a folder named styles until the parties folder.

Inside that folder create a new file named 'partiesList.less'.

The first thing we need to do in a new LESS file is to import it from the main file:

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.7"}}

Now we can start writing specific LESS code inside that file.

We will make some changes in the code now to make the code more readable, and and some CSS rules to take advantage of the power of Bootstrap.

First, `angular-ui-bootstrap`, in order to to that, let's run this commands:

    meteor add angularui:angular-ui-bootstrap

Now, let's start with some cool fonts and some CSS changes to make the `index.html` look better:

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.9"}}

And verify that we have `ui.bootstrap` dependency in the module definition, because we will use `$modal` service later.

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.10"}}

Now, we will move the logic of new party creation into a new service for better coding, so let's create a new controller named `AddNewPartyCtrl` and the HTML view for that. We will later add the logic to open this view inside a modal.

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.11"}}

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.12"}}

Now we will make some changes in the `PartiesCtrl` in order to match the new structure with the `$modal`, and add some style to the Google Maps object.

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.14"}}

Now, let's update the view of the parties list and match the new logic - we will use `$modal` to open the new party page, and change some of the layout using Bootstrap's grid system.

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.13"}}

I will add new some CSS rules to make all that new structure look better.
The style rules are located in `.less` files, and the actual changes that make are available in [this commit to view](https://github.com/Urigo/meteor-angular-socially/commit/c189d59bb71aac2a60a9fc5db4f2a00f0239c68b), because the CSS is not the most relevant part in this tutorial.

And after creating those style, let's update the main `less` file to use those, and add some LESS variables to control the basic colors of the application.

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.16"}}

So now we have a good looking page with some style, the only thing we need to do is to update the page with the party details.
Let's modify the controller and the view to fit the new structure.

{{> DiffBox tutorialName="meteor-angular1-socially" step="17.17"}}

That's it! Now we have a nice style with a better looking CSS using Bootstrap and LESS!

# Summary

We learned how to use CSS, LESS and Bootstrap in Meteor.

{{/template}}
