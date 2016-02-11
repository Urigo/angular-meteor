{{#template name="tutorials.whatsapp.meteor.step_06.md"}}

Right now all the chats are published to all the clients. that not very private - let’s fix that.

First thing we need to do to stop all the automatic publication of information is to remove the `autopublish` package from the Meteor server. in the Meteor command line:

    $ meteor remove autopublish

We will add now the [publish-composite](https://atmospherejs.com/reywood/publish-composite) package, which we will use later.

    $ meteor add reywood:publish-composite

Now we need to explicitly define our publications - let’s start with sending the Users information.

Create a file named `publications.js` under the `server` folder and define the query we want to send to our clients inside:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="6.3"}}

And of course we need to modify some of the client side code, we need to make sure that the client side subscribed to the Users data, so let’s add in the new chat page controller, because this view needs the users’ data:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="6.4"}}

Now let’s do a more complex publication, let’s send each client only the Chats and Messages he is a part of:

    Meteor.publish('chats', function () {
      if (! this.userId) {
        return;
      }
    
      return Chats.find({ userIds: this.userId });
    });
    
and now, let’s add the Messages from the those chats into the publication.

To do that, we need to do a joined collections publication.

To do it more easily, let’s use the `reywood:publish-composite` package we added previously.

And now let’s change the publication to add the Messages and the Users that are related to the Chats the users in participating in:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="6.5"}}

And we will add the subscription to the `chats` data in the client side:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="6.6"}}

Notice that the `this.subscribe` function is a wrapper for Meteor.Subscribe method, but it wrapped in order to work better with AngularJS.

{{/template}}
