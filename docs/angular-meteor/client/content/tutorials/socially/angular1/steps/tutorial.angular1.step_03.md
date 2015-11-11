{{#template name="tutorial.step_03.md"}}
{{> downloadPreviousStep stepName="step_02"}}

We now have a nice client side application that creates and renders its own data.

If we were in any framework other than Meteor, we would start implementing a series of REST endpoints to connect the server to the client.
Also, we would need to create a database and functions to connect to it.

And we haven't talked about realtime, in which case we would need to add sockets, and a local DB for cache and handle latency compensation (or just ignore those features and create a not - so - good and modern app...)

But luckily, we're using Meteor!


Meteor makes writing distributed client code as simple as talking to a local database.

Every Meteor client includes an in-memory database cache. To manage the client cache, the server publishes sets of JSON documents, and the client subscribes to these sets. As documents in a set change, the server patches each client's cache automatically.

That introduce us to a new concept - **Full Stack Reactivity**.

In an Angularish language we might call it **3 way data binding**.

The way to handle data in Meteor is through the `Mongo.Collection` class. It is used to declare MongoDB collections and to manipulate them.

Thanks to minimongo, Meteor's client-side Mongo emulator, `Mongo.Collection` can be used from both client and server code.

# Declare a collection

So first, let's define the parties collection that will store all our parties.

Add:

{{> DiffBox tutorialName="meteor-angular1-socially" step="3.1"}}

to the beginning of the `app.js` file.

Notice that this code runs outside of the `isClient` statement.

That means that this collection and the actions on it will run both on the client (minimongo) and the server (Mongo), you only have to write it once, and Meteor will take care of syncing both of them.

# Binding to Angular 1

Now that we've created the collection, our client needs to subscribe to its changes and bind it to our parties array.

To bind them we are going to use the built-in angular-meteor service called [$meteor.collection](/api/meteorCollection).

We are going to replace the declaration of `$scope.parties` with the following command inside the `PartiesListCtrl` controller:

{{> DiffBox tutorialName="meteor-angular1-socially" step="3.2"}}

This line declares a new `$scope.parties` variable (so we don't need to do something like `$scope.parties = [];` ) and then binds it to the Parties Mongo collection.

We also need to add the `$meteor` service to the controller with dependency injection.

Our `app.js` file should look like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="3.3"}}

Now every change that happens to the `$scope.parties` variable will automatically be saved to the local minimongo and synced to the MongoDB server DB and all the other clients in realtime!

But we still don't have data in that collection, so let's add some by initializing our server with the same parties we had before.

Let's create a file named `server.js`, and add this content:

{{> DiffBox tutorialName="meteor-angular1-socially" step="3.4" filename="server.js"}}

> Note that we also moved the `Mongo.Collection` line from the `app.js` because we want this line to work in both client and server, and AngularJS files are loaded in the client side only.

As you can probably understand, this code runs only on the server, and when Meteor starts it initializes the DB with these sample parties.

Run the app and you should see the list of parties on the screen.

In the next chapter we will see how easy it is to manipulate the data, save and publish changes to the server, and how by doing so, all the connected clients will automatically get updated.

# Inserting parties from the console

Items inside collections are called documents. Let's use the server database console to insert some documents into our collection.
In a new terminal tab, go to your app directory and type:

    meteor mongo

This opens a console into your app's local development database. At the prompt, type:

    db.parties.insert({ name: "A new party", description: "From the mongo console!" });

In your web browser, you will see the UI of your app immediately update to show the new party.
As you see we didn't have to write any code to connect the server-side database to our front-end code — it just happened automatically.

Insert a few more parties from the database console with different text.

Now let's do the same but with remove. At the prompt, type the following command to look at all the parties and their properties:

    db.parties.find({});

Now choose one party you want to remove and copy it's `id` property.
Remove it using that id (replace `N4KzMEvtm4dYvk2TF` with your party's id value):

    db.parties.remove( {"_id": "N4KzMEvtm4dYvk2TF"});

Again, you will see the UI of your app immediately update with that party removed.

Try running more actions like updating an object from the console and so on. Check out the mongodb documentation to explore <a href="http://docs.mongodb.org/manual/tutorial/getting-started-with-the-mongo-shell/">the mongodb shell</a>.


# Summary

In this chapter you saw how easy and fast it is to create a full connection between our client data, the server and all the other connected clients.

In the next step, we'll see how to add functionality to our app's UI so that we can add parties without using the database console.

{{/template}}
