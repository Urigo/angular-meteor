{{#template name="tutorials.socially.angular1.step_14.md"}}
{{> downloadPreviousStep stepName="step_13"}}

In this step we will learn how to use Meteor methods and how angular-meteor enhances them with the support of promises.

Meteor methods are a way to perform more complex logic than the allow method does.
The Meteor methods are responsible for checking permissions, just like the allow method does.

In our case, we will create an invite method that invites a user to a party.

Paste the following code into the end of `parties.js` file in the model directory:

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.1"}}

Let's look at the code.

First, all Meteor methods are defined inside `Meteor.methods({});` object.

Each property of that object is a method and the name of that property in the name of the method. In our case - invite.

Then the value of the property is the function we call. In our case it takes 2 parameters - the party id and the invited user id.

First, we check validation with the the [check](http://docs.meteor.com/#check_package) function.

To use [check](http://docs.meteor.com/#check_package) we need to add the [check package](https://atmospherejs.com/meteor/check):

    meteor add check

The rest of the code is pretty much self explanatory, but important thing to notice is the Email function that sends email to the invited client.
This function can't be called from the client side so we have to put it inside an `isServer` statement.

Don't forget to add the email package to your project in the command line:

    meteor add email

Now let's call that method from the client.

Add a scope method called invite:

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.3"}}

* Parameter 1 - Meteor method name
* Parameter 2 and 3 - The Meteor method's arguments
* Return value - A promise

The promise we resolve with 'then' which defines 2 parameters:

* Parameter 1 - A function that handles success
* Parameter 2 - A function that handles failure

Now let's add a button to invite each user we want. Edit the users lists in the partyDetails template to look like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.4"}}

Now that we have the invite function working, we also want to publish the parties to the invited users.
Let's add that permission to the publish parties method (and the Counts!):

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.5"}}

Great!

Now test the app.  Create a private party with user1.  Then invite user2. Log in as user2 and check if he can see the party in his own parties list.


Now let's add the RSVP functionality so invited users can respond to invitations.

First let's add a Meteor.method to `parties.js` in the model folder (remember to place it as a property inside the Meteor.methods object):

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.6"}}

The function gets the party's id and the response ('yes', 'maybe' or 'no').

Like the invite method, first we check for all kinds of validations, then we do the wanted logic.

Now let's call that function from the partiesList.
Add an rsvp scope function to the partiesListCtrl in `partiesList.js`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.7"}}

and let's add action buttons to call the right rsvp in the HTML.

Add this code into `parties-list.html` inside the parties list itself (inside the ng-repeat):

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.8"}}

Now let's display for each party who is coming.

Just after the code you just added (still inside the parties dir-paginate) add the following code:

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.9"}}

First, take a look at the use of filter with length to find how many people responded with each response type.

Then, look at using ng-repeat inside a dir-paginate - ng-repeat on RSVPs inside party from the parties dir-paginate.

Now let's add a list of the users who haven't responded yet just below the code we just added:

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.10"}}

Again, an ng-repeat inside a dir-paginate.  This time we are calling a function that will give us all the users who haven't responded to that specific party.
Add that function inside the partiesListCtrl in the `partiesList.js` file:

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.11"}}

Here we are using underscore's `_.filter`, `_.contains` and `_.findWhere` to extract the users who are invited to the party but are not exist in the rsvps array.

Notice we are doing this check on $scope.users but we haven't initialized it yet in this controller. So add this code as well:

Change

    $meteor.subscribe('users');

With:

{{> DiffBox tutorialName="meteor-angular1-socially" step="14.12"}}

# Summary

Run the application.

Looks like we have all the functionality we need but there is a lot of mess in the display.
There are stuff that there is no need for them to show up if the user is not authorized to see or if they are empty.

So in the next chapter we are going to learn about a few simple but very useful Angular 1 directive to help us conditionally add or remove DOM.

{{/template}}
