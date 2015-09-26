{{#template name="tutorialAngular2.step_03.html"}}
{{> downloadPreviousStep stepName="step_02"}}
    
OK, so we have a nice client side application that creates and renders it's own data.

So, if we were in any framework other than Meteor, we would start implementing a series of REST endpoints to connect the server to the client.
Also, we would need to create a database and functions to connect to it.

And we haven't talked about real-time, in which case we would need to add sockets, and a local DB for cache and handle latency compensation (or just ignore those features and create a not - so - good and modern app...)

But luckily, we use Meteor!

# Data Model and Reactivity in Meteor

Meteor makes writing distributed client code as simple as talking to a local database.

Every Meteor client includes an in-memory database cache. To manage the client cache, the server publishes sets of JSON documents, and the client subscribes to these sets. As documents in a set change, the server patches each client's cache automatically.

That introduce us to a new concept - **Full Stack Reactivity**.

In an Angularish language we might call it **3 way data binding**.

The way to handle data in Meteor is through the `Mongo.Collection` class. It is used to declare MongoDB collections and to manipulate them.

Thanks to minimongo, Meteor's client-side Mongo emulator, `Mongo.Collection` can be used from both client and server code.

In short, Meteor's default setup has:

- real-time reactivity through web sockets
- two databases. One on the client for fast changes, another behind the server for official changes
- so much more!

# Declare a collection

So first, let's define our first parties collection that will store all our parties.

In a separate folder called "collections", add a file called "parties.ts". Include this:

{{> DiffBox tutorialName="angular2-tutorial" step="3.1"}}

We've just created not only a file called "parties.ts", but also a System.js module
called "collections/parties". This works is done by TypeScript compiler behind the scene.

TypeScript compiler coverts `.ts` file to ES5, then register a System.js module with the same name as
relative path of the file in the app.

That's why we use special word `export`. By this way, we tell System.js
what this module export to the outside world.

Because this file is located outside of a special folder name, like "client", this collection and the actions on it will run both on the client (minimongo) and the server (Mongo).

So, at this moment we have two modules that declare two version of our parties collection:
one — for client side and one — for server side. All synchronization between
these two version of collections is handled by Meteor.

Last thing is, again, to add the declaration file reference to this file.

    /// <reference path="../typings/angular2-meteor.d.ts" />

# Simple binding to Angular

Now that we've created the collection, our client needs to subscribe to it's changes and bind it to our `this.parties` array.
Angular2's `ng-for` directive works by default with pure arrays, hence, we'll need to get an array of documents out of our Mongo collection.
Since Mongo collections are full Mongo collections even on the client side (thanks to Meteor), we can query documents with help of `find` or `findOne` API methods.

Thus, we have at least one way to load our data model. Lets query all parties using `Parties.find()` and call fetch to retrieve them.

But first, lets import `Parties` collection:

{{> DiffBox tutorialName="angular2-tutorial" step="3.3"}}

Then, change `client/app.ts` to:

{{> DiffBox tutorialName="angular2-tutorial" step="3.4"}}

But what happens if the parties data changes on the server-side? How can we tell parties to update itself?

For now, we can use Meteor [Tracker](https://www.meteor.com/tracker), a reactive wrapper that we will run data when a change occurs. We will bind it to Angular's change detection system, [Zone.js](https://github.com/angular/zone.js).

{{> DiffBox tutorialName="angular2-meteor" step="3.2"}}

The fat arrow syntax `=>` is also from ES2015, and tells the function to run in it's parents context. In other words, it tells `this` to be the context of the class Socially.

Our `app.ts` file should now look like this:

__`client/app.ts`:__

    import {Component, View, NgFor, bootstrap} from 'angular2/angular2';

    import {Parties} from 'collections/parties';

    @Component({
      selector: 'app'
    })
    @View({
      templateUrl: "client/index.ng.html",
      directives: [NgFor]
    })
    class Socially {
      constructor () {
        Tracker.autorun(zone.bind(() => {
          this.parties = Parties.find().fetch();
        }));
      }
    }

    bootstrap(Socially);

Now every change what happens to the `this.parties` variable will automatically be saved to the local minimongo DB and synced to the MongoDB server DB and all the other clients in realtime!

# Blaze-like binding to Angular

In previous section we've loaded array of documents in the most straightforward way.
But what if assign `Parties.find()` to `this.parties`, same way as we do in a regular Meteor app
with Blaze, and Angular2 could understand how to handle it? That would be an ideal way to work
with Mongo collections. `Parties.find()` returns an instance of `Mongo.Cursor`, which can provide reactively
all documents, that have been loaded, changed or added etc, to every component.
The only thing is how can we teach Angular2 to understand Mongo cursors?

Luckily, Angular2 comes with the concept of so called differ classes - classes that are used by 
the `ng-for` directive to provide information of what has been changed in a collection to render 
this collection effectively. This concept is similar to the dirty checking in Angular 1.x but with some
differences. Angular2 now estimates difference between two arrays much more effectively and
customers can create own differs for own types. 

Angular2-Meteor package implements a special differ class for Mongo cursors.
All we need to do is to create a special binding to that class and load it into our app.

Angular2-Meteor package has own bootstrap that overrides basic bootstrap and adds
some new bindings.

Lets change `bootstrap` from `angular2/angular2` to `bootstrap` from `angular2-meteor` as follows:

    import {Component, View, NgFor} from 'angular2/angular2';

    import {bootstrap} from 'angular2-meteor';

    bootstrap(Socially);

`angular2-meteor` is an alias of the System.js module that contains all componets that comes with Angular2-Meteor package.

Now, change `app.ts` to:

    import {Component, View, NgFor} from 'angular2/angular2';

    import {bootstrap} from 'angular2-meteor';

    @Component({
      selector: 'app'
    })
    @View({
      templateUrl: "client/index.ng.html",
      directives: [NgFor]
    })
    class Socially {
      constructor () {
        this.parties = Parties.find();
      }
    }

    bootstrap(Socially);

Run your app again and you should see that it works as before.
It loads same data as before and all changes to the `this.parties` that
should happen reactively happen reactively. At the same time, this code
looks much simplier as before.

Lets stick to this approach from now on.

# Initializing Data on Server Side

But we still don't have data in that collection, so let's add some.
Let's initialize our server with the same parties we had before.

Create a new folder called 'server' and create a file called 'loadParties.ts' inside of it. Server is another special folder name in Meteor, it's contents will only run on the server.

Add the following to the file:

{{> DiffBox tutorialName="angular2-meteor" step="3.3"}}

As you can probably understand, this code runs only on the server, and when Meteor starts it initializes the DB with these sample parties.

Run the app and you should see the list of parties on the screen.

In the next chapter we will see how easy it is to manipulate the data, save and publish changes to the server, and by doing so, all the connected clients will automatically get updated.

# Inserting parties from the console

Items inside collections are called documents. Let's use the server database console to insert some documents into our collection.
In a new terminal tab, go to your app directory and type:

    meteor mongo

This opens a console into your app's local development database. At the prompt, type:

    db.parties.insert({ name: "A new party", description: "From the mongo console!" });

In your web browser, you will see the UI of your app immediately update to show the new party.
You can see that we didn't have to write any code to connect the server-side database to our front-end code — it just happened automatically.

Insert a few more parties from the database console with different text.

Now let's do the same but with remove. At the prompt, type the following command to look at all the parties and their properties:

    db.parties.find({});

Now choose one party you want to remove and copy it's id property.
Then, remove it using that id (replace N4KzMEvtm4dYvk2TF with your party's id value):

    db.parties.remove( {"_id": "N4KzMEvtm4dYvk2TF"});

Again, you will see the UI of your app immediately update with that party removed.

Try running more actions like updating an object from the console and so on.

In the next step, we'll see how to add functionality to our app's UI so that we can add parties without using the database console.

# Summary

In this chapter you saw how easy and fast it is to create a full connection between our client data, the server and all the other connected clients.

{{/template}}
