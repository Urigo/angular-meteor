{{#template name="tutorials.socially.angular2.step_03.md"}}
{{> downloadPreviousStep stepName="step_02"}}

Now we have a client side application that creates and renders it's own data.

So, if we were in any framework other than Meteor, we would likely start implementing a series of REST endpoints to connect the server to the client.
We would also need to create a database and functions to connect to it.

And we haven't even talked about real-time, in which case we would need to add sockets, a local DB for cache and handle latency compensation (or just ignore those features and create a not-so-good or less modern app...)

But luckily, we use Meteor!

# Data Model and Reactivity in Meteor

Meteor makes writing distributed client code as simple as talking to a local database.

Every Meteor client includes an in-memory database cache. To manage the client cache, the server publishes sets of JSON documents, and the client subscribes to these sets. As documents in a set change, the server patches each client's cache automatically.

That introduces us to a new concept — *Full Stack Reactivity*.

In an Angular-ish language we might call it *3 way data binding*.

The way to handle data in Meteor is through the [`Mongo.Collection`](http://docs.meteor.com/#/full/mongo_collection) class. It is used to declare MongoDB collections and manipulate them.

Thanks to [Minimongo](https://atmospherejs.com/meteor/minimongo), Meteor's client-side Mongo emulator, `Mongo.Collection` can be used from both client and server code.

In short, Meteor core's setup has:

- real-time reactivity through web sockets
- two databases. One on the client for fast changes, another behind the server for official changes
- a special protocol (called DDP) that synchronizes data between two databases
- a bunch of small things that make creating an app with Meteor easier and more developer friendly!

# Declare a Collection

So first, let's define our first parties collection that will store all our parties.

In a separate folder called "collections", add a file called "parties.ts". Include this:

{{> DiffBox tutorialName="meteor-angular2-socially" step="3.1"}}

We've just created not only a file called "parties.ts", but also a System.js module
called "collections/parties". This work is done by the TypeScript compiler behind the scenes.

The TypeScript compiler coverts `.ts` files to ES5, then registers a System.js module with the same name as
the relative path to the file in the app.

That's why we use the special word `export`. By this way, we tell System.js what we are allowing to be exported from this module into the outside world.

Meteor has a series of special folder names, including the "client" folder. All files within a folder named "client" are loaded on the client only. Likewise, files in a folder called "server" are loaded on the server only.

Because this file is located outside of any special folder name, like "client" or "server", this collection and the actions on it will run both on the client (minimongo) and the server (Mongo).

Though we only declared our model once, we have two modules that declare two versions of our parties collection:
one for client-side and one for server-side. This is often referred to as "isomorphic" or "universal javascript". All synchronization between these two versions of collections is handled by Meteor.

# Simple Binding to Angular

Now that we've created the collection, our client needs to subscribe to it's changes and bind it to our `this.parties` array.
Angular 2's `ngFor` directive works by default with pure arrays, hence, we'll just need to get an array of documents out of our Mongo collection.
Since Mongo collections are full Mongo collections even on the client side (thanks to Meteor), we can query documents with the help of [`find`](https://docs.mongodb.org/v3.0/reference/method/db.collection.find/) or [`findOne`](https://docs.mongodb.org/manual/reference/method/db.collection.findOne/) API methods.

Thus, we have at least one way to load our data model. Lets query all parties using `Parties.find()` and call fetch to retrieve them.

But first, lets import our `Parties` collection:

{{> DiffBox tutorialName="meteor-angular2-socially" step="3.2"}}

Then, change `client/app.ts` to load parties from Mongo:

{{> DiffBox tutorialName="meteor-angular2-socially" step="3.3"}}

But what happens if the parties data changes on the server-side? How can we tell parties to update itself?

For now, we can use Meteor [Tracker](https://www.meteor.com/tracker), a reactive wrapper that will run data when a change occurs:

{{> DiffBox tutorialName="meteor-angular2-socially" step="3.4"}}

As you may have noticed above, we used not only `Tracker.autorun` but we also added a new argument of `NgZone` type to the constructor and fetched parties inside of the `zone.run` method. `NgZone` is part of Angular 2's change detection system, which has become more clever and faster in Angular 2.

Think of `zone.run` for now as a equivalent of Angular 1's `scope.$apply()` syntax.
Everything that happens in the zone will be checked by Angular 2 for changes and applied to the UI. You can read more info about Zone.js [here](https://github.com/angular/zone.js).

The `zone` parameter appears in the constructor via the dependency injection resolution mechanism, which
has a new look in Angular 2. Don't worry if you're unclear about how it works — you'll learn more about the nuances in the next chapters.

The [fat arrow syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) `=>` is also a new syntax that comes in ES2015, and tells the function to run in it's parents context. In this case, it sets `this` as the context of the class Socially.

Our `app.ts` file should now look like this:

__`client/app.ts`:__

    import {NgZone, Component, View} from 'angular2/core';

    import {bootstrap} from 'angular2/bootstrap';

    import {Parties} from 'collections/parties';

    @Component({
      selector: 'app'
    })

    @View({
      templateUrl: "client/app.html"
    })

    class Socially {
      parties: Array<Object>;

      constructor (zone: NgZone) {
        Tracker.autorun(() => zone.run(() => {
          this.parties = Parties.find().fetch();
        }));
      }
    }

    bootstrap(Socially);


Every change that happens to the `this.parties` variable will automatically be saved to the local client-side Minimongo DB and synced to the server-side MongoDB and all the other clients in realtime!

# Initializing a Collection on the Server

One thing is left before we can start manipulating data and be able to check if changes are reactive.

We need to initialize the `Parties` collection for the server side. Since our collection file
`collection/parties` is turned into a System.js module by Typescript, we'll need to import it manually in order to execute code inside.

It's worth mentioning that System.js modules work on the server side the same way as on the client.
There is one special case where the package helps you. Similar to the client's `app.ts`,
if you call your main server file `main.ts`, a System.js module will be created out of this file and loaded automatically.

Let's create a new folder called "server" and add a file `main.ts` inside of it. As mentioned earlier, "server" is another special folder name in Meteor: it's contents will only run on the server.

  {{> DiffBox tutorialName="meteor-angular2-socially" step="3.5"}}

# Inserting Parties from the Console

At this point we've implemented a rendering of a list of parties on the page.
Now it's time to check if the code above really works; it shouldn't just render that list, but also render all
changes to the database on the page reactively.

In Mongo terminology, items inside collections are called documents. So, let's insert some documents into our collection by using the server database console.

In a new terminal tab, go to your app directory and type:

    meteor mongo

This opens a console into your app's local development database using [Mongo shell](https://docs.mongodb.org/manual/reference/mongo-shell/). At the prompt, type:

    db.parties.insert({ name: "A new party", description: "From the mongo console!" });

In your web browser, you will see the UI of your app immediately update to show the new party.
You can see that we didn't have to write any code to connect the server-side database to our front-end code — it just happened automatically.

Insert a few more parties from the database console with different text.

Now let's do the same but with "remove". At the prompt, type the following command to look at all the parties and their properties:

    db.parties.find({});

Choose one party you want to remove and copy it's 'id' property.
Then, remove it using that id (replace 'N4KzMEvtm4dYvk2TF' with your party's id value):

    db.parties.remove({"_id": ObjectId("N4KzMEvtm4dYvk2TF")});

Again, you will see the UI of your app immediately updates with that party removed.

Feel free to try running more actions like updating an object from the console, and so on.

# Blaze-like Binding to Angular

In the _Simple Binding to Angular_ section above we were loading a list of documents in the most straightforward way.
But what if we assign `Parties.find()` to `this.parties`, the same way as we do in a regular Meteor app
with [Blaze](https://www.meteor.com/blaze). Blaze is the default frontend framework in Meteor (check the official Meteor [tutorial](https://www.meteor.com/tutorials/blaze/templates) for more). If Angular 2 could understand Mongo methods, we would have an ideal way of dealing with Mongo collections.

`Parties.find()` returns an instance of `Mongo.Cursor`, which can reactively provide all documents, that have been added, changed or removed, to every component. But how can we teach Angular 2 to understand Mongo cursors?

Luckily, Angular 2 comes with the concept of so-called "differ classes" — classes that are used by
the `ngFor` directive to provide information about what has been changed in a collection to render
this collection efficiently.

This concept is similar to "dirty checking" in Angular 1.x but with some differences.
Thanks to some advanced algorithms Angular 2 now computes the difference between two arrays much more efficiently. We are not going to dive into those details in this tutorial. But you can read this [blog post](http://info.meteor.com/blog/comparing-performance-of-blaze-react-angular-meteor-and-angular-2-with-meteor),
which compares the speed of Angular 1 with Angular 2 in Meteor.
One more advantage of differs in Angular 2 is that customers can create their own differs for their own collection types.

The Angular2-Meteor package implements a special differ class for Mongo cursors. All we need to do is to load it into our app.

The Angular2-Meteor package has its own `bootstrap` that overrides the basic bootstrap method from `angular2/bootstrap` and adds some additional new providers. These include a provider for the differ class mentioned above.

Let's change `bootstrap` to load from `angular2-meteor` instead of `angular2/bootstrap` as follows:

    import {Component, View, NgZone} from 'angular2/core';

    import {bootstrap} from 'angular2-meteor';

    bootstrap(Socially);

`angular2-meteor` is an alias of the System.js module that contains all components that come with the Angular2-Meteor package.

Now, change `app.ts` to:

  {{> DiffBox tutorialName="meteor-angular2-socially" step="3.6"}}

Run your app again and manipulate the documents in the Mongo console.
You will see that it works as before — it loads the same data as before and all changes to the `this.parties` that
should happen reactively happen reactively. At the same time, this code looks much simpler than before.

Lets stick to this approach from now on.

# Initializing Data on Server Side

Until now we've been inserting party documents to our collection using the Mongo console.
It would be convenient though to have some initial data pre-loaded into our database. So,
let's initialize our server with the same parties as we had before.

Let's add a file called `load-parties.ts` inside of "server" folder
and implement `loadParties` method inside to load parties:

{{> DiffBox tutorialName="meteor-angular2-socially" step="3.7"}}

Then change `main.ts` to run this method on Meteor startup:

{{> DiffBox tutorialName="meteor-angular2-socially" step="3.8"}}

Now run the app and you should see the list of parties on the screen.
If not, please, run

    meteor reset

in order to remove all previous parties added before via the terminal.

In the next step, we'll see how to add functionality to our app's UI so that we can add parties on the page.

# Summary

In this chapter you saw how easy and fast it is:

- to create a full connection between our client data and the server using Meteor
- to create a simple Angular 2 UI and render a Mongo collection on the page with the help of `Angular2-Meteor`
- to load initial parties on the server side when the app launches
- and how well-structured everything looks with the help of System.js modules

{{/template}}
