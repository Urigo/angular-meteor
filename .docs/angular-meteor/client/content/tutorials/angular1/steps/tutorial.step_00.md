{{#template name="tutorial.step_00.md"}}

Let's start building our Meteor-Angular socially app.

This is an introductory step - you will:

1. Become familiar with the most important source code files
2. Learn how to start the Meteor server
3. Connect an Angular FrontEnd
4. Run the application in the browser

But first - let's install Meteor!

Open your command line and paste this command:

    $ curl https://install.meteor.com/ | sh

> If you are on a Windows machine, go [here](https://www.meteor.com/install) to install

Now let's create your first app - type this into the command line:

    $ meteor create socially

Now let's see what we got. Go into the folder:

    $ cd socially

and run the app like so:

    $ meteor

    => Started proxy
    => Started MongoDB.
    => Started your app.
    >=> App running at: http://localhost:3000/

Use your browser to go to [http://localhost:3000/](http://localhost:3000/)
and look at the amazing app that's running on your computer!

We now have a fully functional app which includes both a server and a client.

The default Meteor app starts life with three files, one `js`, one `html` and one `css` file. Each named with the application name you used in the `create` command above. In our case this is `socially`.

We are going to add our own files for this tutorial. So let's start by deleting the following files:

    $ rm socially.css	socially.html	socially.js

And let's start building our app.
First, create a new `index.html` file and place this code inside. Then run the app again:

{{> DiffBox tutorialName="angular-meteor" step="0.1"}}

Note that there is no `<html>` tag and no `<head>` tag - it's very simple.


This is because of how Meteor structures and serves files to the client.

Meteor scans all the HTML files in your application and concatenates them together.

It will create the `HTML`, `HEAD` and `BODY` tags by itself and place in there everything it needs to run the app.

Then it will search for all the HTML files containing `HEAD` or `BODY` tags and concatenate their content into the main file.



So in our case, Meteor found our `index.html` file, found the `BODY` tag inside and added it's content to the `BODY` tag of the main generated file.

> (right-click -> inspect element on the page to see the generated file)


# Adding AngularJS

Time to add AngularJS to our stack!

First things first, let's add the AngularJS package to Meteor (we will discuss Meteor packages further later in this tutorial)



Back in the command line, launch this command:

    $ meteor add angular

This package takes care of connecting Angular to Meteor and includes the latest AngularJS library code.

That's it! Now we can use AngularJS's power in our Meteor app.

To start simple, create a new file called `index.ng.html` under the main folder, this will be our main `HTML` template page.

> We are using the `.ng.html` file extension so that Blaze - Meteor's templating system - won't compile and override our AngularJS expressions.

Then move the `p` tag into it:

{{> DiffBox tutorialName="angular-meteor" step="0.2"}}

Now let's include that file into our main `index.html` file:

{{> DiffBox tutorialName="angular-meteor" step="0.3"}}

But if you load this in your browser, **you won't see anything**. That's because we still need to **create the actual Angular app**, which we'll do next.

> It's very important to note - the **paths are always absolute, not relative!**  so if `index.ng.html` was inside a folder named `client`, you would have to place the whole path from the route app, doesn't matter where you're calling the file from.

E.g. if `index.ng.html` was in a folder named `client` your include would look like:

    <div ng-include="'client/index.ng.html'"></div>

# Building The AngularJS App

AngularJS apps are actually individual modules. So let's create our app module.

Create a new `app.js` file.

Here you see another example of Meteor's power and simplicity - no need to include this file anywhere. Meteor will take care of it by going through all the files in the `socially` folder and including them automatically.

One of Meteor's goals is to break down the barrier between client and server, so the code you write can run everywhere! (more on that later).
But we need Angular's power only in the client side, so how can we do that?

There are a few ways to tell Meteor to run code only on the client/server/phone side, let's start with the simplest way - [Meteor.isClient](http://docs.meteor.com/#/full/meteor_isclient) variable.

{{> DiffBox tutorialName="angular-meteor" step="0.4"}}

Now everything inside this `if` statement will only run on the client side.

Let's continue defining our AngularJS application module. Give it the name `socially` and add `angular-meteor` module as a dependency:

{{> DiffBox tutorialName="angular-meteor" step="0.5"}}

And use the same application name in the `ng-app` directive in `index.html`:

{{> DiffBox tutorialName="angular-meteor" step="0.6"}}

Now run the app.

Everything is the same, so now inside our `index.ng.html` let's use Angular:

{{> DiffBox tutorialName="angular-meteor" step="0.7"}}

Run the app again and the screen should look like this:

    Nothing here yet!

Angular interpreted the expression like any other Angular application.

# Experiments
Try adding a new expression to the index.ng.html that will do some math:

    <p>1 + 2 = {{dstache}} 1 + 2 }}</p>

# Done!
Go to [step 1](/tutorial/step_01) to add some content to our application.

{{/template}}
