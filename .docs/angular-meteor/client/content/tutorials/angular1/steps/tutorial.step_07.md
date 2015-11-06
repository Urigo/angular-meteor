{{#template name="tutorial.step_07.md"}}
{{> downloadPreviousStep stepName="step_06"}}

OK, so we have a working app, but, like a tutorial, it's not well organized.

It is really important to organize your app in a standard way, and in Meteor, the structure itself has meaning and implications.

In this step, we are going to combine Meteor's and Angular 1's standard ways of structuring an app into one unified standard structure.



# Meteor folder structure

From the `docs.meteor.com` site:

> A Meteor application is a mix of JavaScript that runs inside a client web browser, JavaScript that runs on the Meteor server inside a Node.js container, and all the supporting HTML fragments, CSS rules, and static assets.
> Meteor automates the packaging and transmission of these different components. And, it is quite flexible about how you choose to structure those components in your file tree.
>
> Files outside the **client**, **server** and **tests** subdirectories are loaded on both the client and the server!
> That's the place for model definitions and other functions.
>
> CSS files are gathered together as well: the client will get a bundle with all the CSS in your tree (excluding the server, public, and private subdirectories).
>
> In development mode, JavaScript and CSS files are sent individually to make debugging easier.

## Load order

It is best to write your application in such a way that it is insensitive to the order in which files are loaded. This can be achieved by using, for example, Meteor.startup or by moving load order sensitive code into packages, which can explicitly control both the load order of their contents and their load order with respect to other packages.
However, sometimes load order dependencies in your application are unavoidable.

The JavaScript and CSS files in an application are loaded according to these rules:

### server

Meteor gathers any files under the **private** subdirectory and makes the contents of these files available to server code via the Assets API. The **private** subdirectory is the place for any files that should be accessible to server code but not served to the client, like private data files.

Any sensitive code that you don't want served to the client, such as code containing passwords or authentication mechanisms, should be kept in the server directory.

### client

Files inside the **client** folder will run only on the client side.

There are more assets to consider on the client side. Meteor gathers all JavaScript files in your tree, with the exception of the server, public, and private subdirectories, for the client. It minifies this bundle and serves it to each new client. You're free to use a single JavaScript file for your entire application, or create a nested tree of separate files, or anything in between.


### public

Lastly, the Meteor server will serve any files under the public directory. This is the place for images, favicon.ico, robots.txt, and anything else.

### More rules

* Files in subdirectories are loaded before files in parent directories, so that files in the deepest subdirectory are loaded first, and files in the root directory are loaded last.
* Within a directory, files are loaded in alphabetical order by filename.
* After sorting as described above, all files under directories named **lib** are moved before everything else (preserving their order).
* Finally, all files that match main.* are moved after everything else (preserving their order).


# Angular 1 folder structure

There are many ways to organize and structure an Angular 1 app.

The two main approaches are:

* Sorting by file type (controllers, views, etc..)
* Sorting based on functionality (users, parties, products, etc..)

The first approach seems to work better with smaller applications and is also the current structure of the [yeoman-angular-generator](https://github.com/yeoman/generator-angular).

The second approach seems to work better for large scale applications.

As we are working close with the Meteor collections, we believe a better approach will be based on functionality, which also correlates to the Meteor's collection structure.

For more Angular 1 structuring and best practices please read this amazing [style-guide](https://github.com/johnpapa/angularjs-styleguide#application-structure).



# Re-structuring our app

So now let's re-structure our app (to see the end result and all the steps in git diff you can click [here](https://github.com/Urigo/meteor-angular-socially/compare/step_06...step_07)):

1. Create a folder named `client` under the root folder.  This is where all the code inside `Meteor.isClient` will go (without the need of Meteor.isClient anymore)
2. The first thing that needs to be loaded in the `client` folder is the Angular 1 app declaration. After that, the rest of the client code can be loaded in any order. So create a `lib` folder inside the `client` folder and move `app.js` inside. Remove the unnecessary `if (Meteor.isClient)` condition from `app.js`. Everything in the `client` folder runs only on the browser.

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.1"}}

3.The parties Mongo collection needs to run on both client and server, so let's move it out of the `client` folder. Create a folder called `model` under the root folder. Inside create a file called `parties.js` and cut this line from `app.js` - `Parties = new Mongo.Collection("parties");` - and place it in `parties.js`.

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.2"}}

4.Create a `server` folder under the root folder. Everything inside that folder will run only on the server. Now create a folder called `startup` under the `server` folder and create a file called `loadParties.js` under it. Now go to `app.js`, cut all the code inside the `if (Meteor.isServer)` statement and place it inside the `loadParties.js` file. Again, no need for the if statement anymore because all the code inside the `server` folder runs only on the server.

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.3"}}

5.Create a file called `routes.js` under the `client` folder. Cut the `.config` code that defines the routes and paste it inside that file.

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.4"}}

6.Create a folder called `parties` inside the `client` folder. and inside it create another two folders. one called `controllers` and one called `views`.
7.Create a new file inside the `client->parties->controllers` folder called `partiesList.js`. Cut the code for the `PartiesListCtrl` from `app.js` and place it in there.

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.5"}}

8.Create a new file inside the `client->parties->controllers` folder called `partyDetails.js`. Cut the code for the `PartyDetailsCtrl` from `app.js` and place it in there.

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.6"}}

9.Move `index.html` into the `client` folder.

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.7"}}

10.Move `parties-list.html` and `party-details.html` into the `client->parties->views` folder.

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.8"}}
{{> DiffBox tutorialName="meteor-angular1-socially" step="7.9"}}

11.Update the templateUrl in the routes to our templates to -  `templateUrl: 'client/parties/views/party-details.html'` and `templateUrl: 'client/parties/views/parties-list.html'`

{{> DiffBox tutorialName="meteor-angular1-socially" step="7.10"}}

As you can see, everything is still working as before.
We haven't needed to change any references in `index.html` like other frameworks. Meteor just takes care of all this.

{{/template}}
