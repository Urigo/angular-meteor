{{#template name="tutorials.socially.angular1.step_06.md"}}
{{> downloadPreviousStep stepName="step_05"}}

In this step, we will implement the party details view, which is displayed when a user clicks on a party in the parties list.
The user will also be able to change the party's details.

To implement the party details view we will use [$meteor.object](/api/meteorObject) to fetch our data, and update it back in realtime when the user changes it.

# Controller

We'll expand the `PartyDetailsCtrl` by using the [$meteor.object](/api/meteorObject) service (add it with Angular 1's dependency injection) to bind the specific party:

{{> DiffBox tutorialName="meteor-angular1-socially" step="6.1"}}

We are sending $meteor.object a Mongo collection and the Id of the object we want to bind to.

$meteor.object returns an [AngularMeteorObject](/api/meteorObject) that contains the data.

$meteor.object accepts a selector as the second argument.

That selector can be a Mongo Selector, Object ID, or String.

In our example we used the Object's ID but it can also come in the form of `{field: query}`.

$meteor.object will find the first document that matches the selector,
as directed by the sort and skip options, exactly like Meteor's [collection.findOne](http://docs.meteor.com/#/full/findone)


# Template

In `party-details.html` let's replace the binding to the `partyId` with a binding to `party.name` and `party.description`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="6.2"}}

Now, when you run the app, navigate into a party's page, and change the inputs, the server and all the clients update immediately.
No save buttons, no round trips, it just works.

# Classic Save and Cancel buttons

In case you don't want to use the live editing that angular-meteor provides and want to present to your users a classic "Save" "Cancel" form, you can do that as well.

First, let's change our template:

{{> DiffBox tutorialName="meteor-angular1-socially" step="6.3"}}

Now let's move to the controller.

First, in the call to `$meteor.object` set the 3rd parameter to `false` so it won't auto-save the object on every change:

{{> DiffBox tutorialName="meteor-angular1-socially" step="6.4"}}

Now let's add the functions that handle the button clicks:

{{> DiffBox tutorialName="meteor-angular1-socially" step="6.5"}}

As you can see, $meteor.object returns an object from type [AngularMeteorObject](/api/meteorObject) which contains 2 functions - `save` and `reset`.

**save()** - saves the current value of the object to the server.
**reset()** - resets the current value of the object from the server.

Your controller should look like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="6.6"}}

That's it!

Simple and easy.


# Summary

We've seen the power of 3-way binding between the DOM, Angular 1 and Meteor.  In collections and in objects.

Let's move on to provide some order and structure in our application.

{{/template}}
