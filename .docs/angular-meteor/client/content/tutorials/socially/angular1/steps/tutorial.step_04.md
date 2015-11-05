{{#template name="tutorial.step_04.md"}}
{{> downloadPreviousStep stepName="step_03"}}

Now that we have full data binding from server to client, let's interact with the data and see the updates in action.

In this chapter you will add the ability to insert a new party and delete an existing one from the UI.

First, let's create a simple form with a button that will add a new party, we will add it above the list, inside the "PartiesListCtrl" controller's div.

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.1"}}

Now we need to make this form functional.

## ng-model

First things first, let's bind the value of the inputs into a new party variable.

To do that we'll use the simple and powerful [ng-model](https://docs.angularjs.org/api/ng/directive/ngModel) Angular 1 directive.

Add `ng-model` to the form like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.2"}}

Now each time the user types inside these inputs, the value of the newParty scope variable will be automatically updated.  Conversely, if `$scope.newParty` is changed outside of the HTML, the input values will be updated accordingly.

## ng-click

Now let's bind a click event to the add button with Angular 1's [ng-click](https://docs.angularjs.org/api/ng/directive/ngClick) directive.

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.3"}}

`ng-click` binds the click event to an expression.
So we take the parties scope array (when accessing scope variables in the HTML, there is no need to add $scope. before them) and push the newParty variable into it.

Open a different browser, click the button and see how the party is added on both clients. So simple!


Now, let's add the ability to delete parties.

Let's add an X button to each party:

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.4"}}

This time we are binding ng-click to a scope function that gets the current party as a parameter.

Let's go into the controller and add that function.

Add the function inside the PartiesListCtrl in `app.js`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.5"}}

Now try to delete a few parties and also watch them being removed from other browser clients.

# AngularMeteorCollection functions

$meteor.collection's return value is a new collection of type [AngularMeteorCollection](/api/AngularMeteorCollection).

It is not only responsible for keeping the collection updated, it also has helper functions for saving and deleting objects.

Let's try to use these helper functions instead of the current implementation.

First let's replace our `push` with `save` in the add button action:

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.6"}}

There isn't much difference here except a small performance improvement, but now let's change our remove function:

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.7"}}

Much nicer, and gives better performance!

Also let's add a button to remove all parties:

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.8"}}

not forgetting to add this new function to the scope:

{{> DiffBox tutorialName="meteor-angular1-socially" step="4.9"}}

Again, very simple syntax.

You can read more about AngularMeteorCollection and it's helper functions in the [API reference](/api/AngularMeteorCollection).


# Summary

So now you've seen how easy it is to manipulate the data using Angular 1's powerful directives and sync that data with Meteor's powerful Mongo.collection API.

{{/template}}
