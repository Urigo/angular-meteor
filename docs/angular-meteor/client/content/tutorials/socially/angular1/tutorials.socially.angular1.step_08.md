{{#template name="tutorials.socially.angular1.step_08.md"}}
{{> downloadPreviousStep stepName="step_07"}}

One of Meteor's most powerful packages is the Meteor account system.

Right now, our app is publishing all the parties to all the clients, and all the clients can change those parties. The changes are then reflected back to all
the other clients automatically.

This is super powerful and easy, but what about security?  We don't want any user to be able to change any party...

First thing we should do is to remove the `insecure` package that automatically added to any new Meteor application.

The 'insecure' package makes the default behaviour of Meteor collections to permit all.

By removing that package the default behaviour is changed to deny all.

Execute this command in the command line:

    $ meteor remove insecure

Now let's try to change the parties array or a specific party.  We get 

    remove failed: Access denied
    
In the console because we don't have permissions to do that.    

Now, we need to write an explicit security rule for each operation we want to allow the client to do on the Mongo collection.

So first, let's add the `accounts-password` Meteor package.
It's a very powerful package for all the user operations you can think of: login, sign-up, change password, password recovery, email confirmation and more.

    $ meteor add accounts-password

Now we will also add the `dotansimha:accounts-ui-angular` package.  This package contains all the HTML and CSS we need for the user operation forms.

Later on in this tutorial we will replace those default account-ui forms with custom Angular 1 forms.

    $ meteor add dotansimha:accounts-ui-angular

Now let's add dependency to the `accounts.ui` module in our module definition:

{{> DiffBox tutorialName="meteor-angular1-socially" step="8.4"}}

Now let's add the `login-buttons` directive (part of `accounts.ui` module) into our app, into index.html.

So the `index.html` will look like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="8.5"}}

Run the code, create an account, login, logout...

Now that we have our account system, we can start defining our security rules for the parties.

Let's go to the model folder and change the file to look like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="8.6"}}

The [collection.allow Meteor function](http://docs.meteor.com/#/full/allow) defines the permissions that the client needs to write directly to the collection (like we did until now).

In each callback of action type (insert, update, remove) the functions should return true if they think the operation should be allowed.
Otherwise they should return false, or nothing at all (undefined).

The available callbacks are:

* `insert(userId, doc)`

  The user userId wants to insert the document doc into the collection. Return true if this should be allowed.

  doc will contain the _id field if one was explicitly set by the client, or if there is an active transform. You can use this to prevent users from specifying arbitrary _id fields.

* `update(userId, doc, fieldNames, modifier)`

  The user userId wants to update a document doc. (doc is the current version of the document from the database, without the proposed update.) Return true to permit the change.

  fieldNames is an array of the (top-level) fields in doc that the client wants to modify, for example ['name', 'score'].

  modifier is the raw Mongo modifier that the client wants to execute; for example, {$set: {'name.first': "Alice"}, $inc: {score: 1}}.

  Only Mongo modifiers are supported (operations like $set and $push). If the user tries to replace the entire document rather than use $-modifiers, the request will be denied without checking the allow functions.

* `remove(userId, doc)`

  The user userId wants to remove doc from the database. Return true to permit this.


In our example:

* insert - only if the user who makes the insert is the party owner.
* update - only if the user who makes the update is the party owner.
* remove - only if the user who deletes the party is the party owner.


OK, right now none of the parties has an owner so we can't change any of them.

So let's add the following simple code to define an owner for each party that gets created.

We can use `Meteor.userId()` method which returns the current user id. 

We will use this id that add it to our new party:

{{> DiffBox tutorialName="meteor-angular1-socially" step="8.7"}}

So first we set the new party's owner to our current user's id and then insert it to the parties collection like before.

Now, start the app in 2 different browsers and login with 2 different users.

Test editing and removing your own parties, and try to do the same for parties owned by another user.

# Social login

We also want to let users login with their Facebook and Twitter accounts.

To do this, we simply need to add the right packages in the console:

    meteor add accounts-facebook accounts-twitter

Now run the app.  when you will first press the login buttons of the social login, meteor will show you a wizard that will help you define your app.

You can also skip the wizard and configure it manually like the explanation here: [http://docs.meteor.com/#meteor_loginwithexternalservice](http://docs.meteor.com/#meteor_loginwithexternalservice)

There are more social login services you can use:

* Facebook
* Github
* Google
* Meetup
* Twitter
* Weibo
* Meteor developer account


# Authentication With Routers

Now that we prevented authorized users from changing parties they don't own,
there is no reason for them to go into the party details page.

We can easily prevent them from going into that view using our routes.

We will use Meteor's API again, and we will use AngularJS `$q` to easily create promises.

Our promise will resolve it there is a user logged in, and otherwise we will reject it.

We are going to use the [resolve](https://github.com/angular-ui/ui-router/wiki#resolve) object of ui-router and ngRoute:

{{> DiffBox tutorialName="meteor-angular1-socially" step="8.9"}}

Now, if a user is not logged in to the system, it won't be able to access that route.

We also want to handle that scenario and redirect the user to the main page.

on the top of the routes file, let's add these lines (the `run` block), and we will also add a "reason" for the `reject()` call, to detect if it's our reject that cause the route error.

{{> DiffBox tutorialName="meteor-angular1-socially" step="8.10"}}

# Summary

Amazing, only a few lines of code and we have a secure application!

Please note it is possible for someone with malicious intent to override your route on the client (in the client/routes.js). 
As that is where we are validating the user is authenticated, they can remove the check and get access.
You should never restrict access to sensitive data, sensitive areas, using the client router.  
This is the reason we also made restrictions on the server using the allow/deny functionality, so even if someone gets in they cannot make updates.
While this prevents writes from happening from unintended sources, reads can still be an issue.
The next step will take care of privacy, not showing users parties they are not allowed to see.

{{/template}}