{{#template name="tutorialAngular2.step_08.html"}}
{{> downloadPreviousStep stepName="step_07"}} 

In this section we'll look at using Meteor Accounts & take a quick detour into using Services in Angular 2.

# User Accounts

One of Meteor's most powerful packages is the Meteor account system.

Right now, our app is publishing all the parties to all the clients, and all the clients can change those parties. The changes are then reflected back to all
the other clients automatically.

This is super powerful and easy, but what about security?  We don't want any user to be able to change any party...

First thing we should do is to remove the 'insecure' package that automatically added to any new Meteor application.

The 'insecure' package makes the default behaviour of Meteor collections to permit all.

By removing that package the default behaviour is changed to deny all.

Execute this command in the command line:

    meteor remove insecure

Now let's try to change the parties array or a specific party.  Nothing's working.

Now, we will have to write an explicit security rule for each operation we want to make on the Mongo collection.

So first, let's add the 'accounts-password' Meteor package.
It's a very powerful package for all the user operations you can think of: Login, signup, change password, password recovery, email confirmation and more.

    meteor add accounts-password

Now we will also add the 'accounts-ui' package.  This package contains all the HTML and CSS we need for the user operation forms.

Later on in this tutorial we will replace those default account-ui forms with custom Angular forms.

    meteor add accounts-ui

Now let's add the accounts-ui template ( <code ng-non-bindable>&#123;&#123;> loginButtons &#125;&#125;</code> ) into our app, into index.html.

Unfortunately, Angular 2 doesn't currently play well with Blaze. This means that any Blaze component must be placed outside of our root app.

Note: An Angular 2 component version of `loginButtons` is in the works, and can be found [here](https://github.com/ShMcK/Angular2-Meteor-Demos/tree/master/ng2-accounts-ui).

For now, we can add `loginButtons` to our `index.html`, which will still work.

{{> DiffBox tutorialName="angular2-meteor" step="8.1"}}

Run the code, create an account, login, logout...

## Meteor.allow()

Now that we have our account system, we can start defining our security rules for the parties.

Let's go to the model folder and change the file to look like this:

{{> DiffBox tutorialName="angular2-meteor" step="8.3"}}

## Mongo Commands (insert, update, remove)

The [collection.allow Meteor function](http://docs.meteor.com/#/full/allow) defines the permissions that the client needs to write directly to the collection (like we did until now).

In each callback of action type (insert, update, remove) the functions should return true if they think the operation should be allowed.
Otherwise they should return false, or nothing at all (undefined).

The available callbacks are:

* insert(userId, doc)

The user userId wants to insert the document doc into the collection. Return true if this should be allowed.

doc will contain the _id field if one was explicitly set by the client, or if there is an active transform. You can use this to prevent users from specifying arbitrary _id fields.

* update(userId, doc, fieldNames, modifier)

The user userId wants to update a document doc. (doc is the current version of the document from the database, without the proposed update.) Return true to permit the change.

fieldNames is an array of the (top-level) fields in doc that the client wants to modify, for example ['name', 'score'].

modifier is the raw Mongo modifier that the client wants to execute; for example, {$set: {'name.first': "Alice"}, $inc: {score: 1}}.

Only Mongo modifiers are supported (operations like $set and $push). If the user tries to replace the entire document rather than use $-modifiers, the request will be denied without checking the allow functions.

* remove(userId, doc)

The user userId wants to remove doc from the database. Return true to permit this.


In our example:

* insert - only if the user who makes the insert is the party owner.
* update - only if the user who makes the update is the party owner.
* remove - only if the user who deletes the party is the party owner.


## Meteor.userId()

OK, right now none of the parties has an owner so we can't change any of them.

So let's add the following simple code to define an owner for each party that gets created.

Let's take our current user's id and set it as the owner id of the party we are creating.

If you're using TypeScript, you'll have to adjust your IParty interface:

{{> DiffBox tutorialName="angular2-meteor" step="8.4"}}

Change the code for the add button in `parties-form.ts` to to also insert a user:

{{> DiffBox tutorialName="angular2-meteor" step="8.5"}}

Do the same to `party-details.ts`:

{{> DiffBox tutorialName="angular2-meteor" step="8.6"}}


 So first we set the new party's owner to our current user's id and then push it to the parties collection like before.

Now, start the app in 2 different browsers and login with 2 different users.

Test editing and removing your own parties, and try to do the same for parties owned by another user.


This could get dangerously repetitive. This is an opportunity to see how services work in Angular 2.

## Angular 2 Services

Let's create a `PartyService` for handling party changes:

{{> DiffBox tutorialName="angular2-meteor" step="8.7"}}

Looking at this code later, it may not be clear what these parameters are, so using types can help.

{{> DiffBox tutorialName="angular2-meteor" step="8.8"}}

Finally, let's refactor our party object calls into a function.

We can use a function in the service to create our clean party objects.

{{> DiffBox tutorialName="angular2-meteor" step="8.9"}}

The resulting service should look like this:

_{{> DiffBox tutorialName="angular2-meteor" step="8.10"}}

Much cleaner.

> Note: these methods are still client-side and thus insecure. We'll talk about Meteor methods & calls later.

## Injecting an Angular 2 Service

This process should get easier, in fact, it should look this:

    constructor(public partyService:PartyService) {
    add() {
      if (this.partiesForm.valid) {
        partyService.add(this.partiesForm.value);
        ...

A note about the constructor syntax here:

* public - binds this.partyService to partyService (you can also use 'private', though it acts the same)
* partyService - the optional alias we use for PartyService
* PartyService - the target we are injecting into the class

Unfortunately, the syntax listed above isn't currently working. Keep in mind, Angular 2 is under development. To get things working, we can use the `Inject` annotation instead.

In `parties-list.ts`, `party-details.ts` and `party-form.ts` follow the instructions below.

- `import {Inject} from 'angular2/angular2';`
- `import {PartyService} from 'client/lib/party-service';`
- In the component, add  `viewBindings: [PartyService]`

```
    @Component({
        selector: 'parties-list',
        viewBindings: [PartyService]
    })
```

4. Inject partyService into the constructor and set `this.partyService` to the injected.

```
    constructor(@Inject(PartyService) partyService:PartyService) {
      this.partyService = partyService;
```

5. Access the service through `this.partyService` in your methods.

```
    this.partyService.remove(party._id)
```

I hope this syntax will clean up in the future.

In the end, it should look like this:

{{> DiffBox tutorialName="angular2-meteor" step="8.11"}}


# Challenge

Inject the PartyService into the three places it's needed.

If you have difficulties, please checkout steps [8.12](https://github.com/ShMcK/ng2-socially-tutorial/commit/84379e8326e7bb392d9aebea5fd25dd782a6b684) or [8.13](https://github.com/ShMcK/ng2-socially-tutorial/commit/b87c18b8b61a026d0d2f44691c946c2c158e03b2) in the tutorial-repo.


# Social login

We also want to let users login with their Facebook and Twitter accounts.

To do this, we simply need to add the right packages in the console:

    meteor add accounts-facebook
    meteor add accounts-twitter

Now run the app.  when you will first press the login buttons of the social login, meteor will show you a wizard that will help you define your app.

{{> DiffBox tutorialName="angular2-meteor" step="8.14"}}

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

We are going to use the `canActivate` router hook.

{{> DiffBox tutorialName="angular2-meteor" step="8.15"}}

Now, if a user is not logged in to the system, it won't be able to access that route.

The call to `Meteor.userId()` will return null if none is found, and will return a value if it is found, thus allowing the route to be activated.

We could even add a helpful alert here.

{{> DiffBox tutorialName="angular2-meteor" step="8.16"}}

* NOTE: This approach is currently not working. *

We don't need to handle any redirect because the route request was denied early on.

on the top of the routes file, let's add these lines:

# Summary

Amazing, only a few lines of code and we have a secure application!

Please note it is possible for someone with malicious intent to override your route configuration on the client.
As that is where we the user is authenticated, they can remove the check to get access.

You should never restrict access to sensitive data, sensitive areas, using the client router only.
This is the reason we also made restrictions on the server using the allow/deny functionality, so even if someone gets in they cannot make updates.
While this prevents writes from happening from unintended sources, reads can still be an issue.
The next step will take care of privacy, not showing users parties they are not allowed to see.

{{/template}}
