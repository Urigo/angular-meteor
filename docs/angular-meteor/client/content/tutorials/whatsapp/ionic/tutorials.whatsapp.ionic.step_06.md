{{#template name="tutorials.whatsapp.ionic.step_06.md"}}
Right now all the chats are published to all the clients. that not very private…

Let’s fix that.

First thing we need to do to stop all the automatic publication of information is to remove the `autopublish` package from the Meteor server. in the Meteor command line:

    $ meteor remove autopublish

Now we need to explicitly define our publications.

Let’s start with sending the Users information.

Create a file named `publications.js` under the `server` folder and define the query we want to send to our clients inside:

{{> DiffBox tutorialName="ionic-tutorial" step="6.2"}}

Meteor will use that `[Live Query](https://www.meteor.com/livequery)` to publish changes to the connected clients every time that query updates automatically.

Now let’s do a more complex publication, let’s send each client only the Chats and Messages he is a part of:

```
  Meteor.publish('chats', function () {
       if (! this.userId) {
         return;
       }
       return Chats.find({ userIds: this.userId });
  });
```

And now, let’s add the Messages from the those chats into the publication.

To do that, we need to do a joined collections publication.

To do it more easily, let’s use the `reywood:publish-composite` package.  in the Meteor command line type:

    $ meteor add reywood:publish-composite

And now let’s change the publication to add the Messages and the Users that are related to the Chats the users in participating in:

{{> DiffBox tutorialName="ionic-tutorial" step="6.4"}}

And again, even with this complex query, Meteor will update all the connected client in real time whenever there is a change in the database.

Now that we have the publications ready, we can subscribe to them.

We can subscribe in a route’s resolve to make sure all of the information is there before entering the route.
Let’s add that to our parent `tab` state:

{{> DiffBox tutorialName="ionic-tutorial" step="6.5"}}

And we can subscribe inside a controller so it will load faster without waiting for the information.

Let’s do that inside the NewChat controller to subscribe to the users we can add to that chat:

{{> DiffBox tutorialName="ionic-tutorial" step="6.6"}}

You can download a ZIP file with the project at this point [here](https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/archive/dbb4b9cc0e3e98ef8e431f9fcc2c0c78d499fc8e.zip).

{{/template}}
