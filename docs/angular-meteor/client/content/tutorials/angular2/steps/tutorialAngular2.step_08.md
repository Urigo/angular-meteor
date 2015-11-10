{{#template name="tutorialAngular2.step_08.md"}}
{{> downloadPreviousStep stepName="step_07"}} 

In this section we'll look at how to implement security for an app
using Meteor and Angular2 API together.

For the Socially app, we are going to add a simple login/password login in order to
allow creation or updating parties for logged-in users only.
Also, we are going to explore how we can restrict access to views based on
user permissions using Angular2 routing API.

# User Accounts

One of Meteor's most powerful packages is the Meteor account system.

Right now, our app is publishing all the parties to all the clients, and all the clients can change those parties. The changes are then reflected back to all
the other clients automatically.

This is super powerful and easy, but what about security?  We don't want any user to be able to change any party...

First thing we should do is to remove the "insecure" package that automatically added to any new Meteor application.

The "insecure" package makes the default behaviour of Meteor collections to permit all.

By removing that package the default behaviour is changed to deny all.

Execute this command in the command line:

    meteor remove insecure

Let's try to change the parties array or a specific party. Nothing's working.

That's because now we have to write an explicit security rule for each operation we want to make on the Mongo collection.

So first, let's add the "accounts-password" Meteor package.
It's a very powerful package for all the user operations you can think of: Login, signup, change password, password recovery, email confirmation and more.

    meteor add accounts-password

If Socially weren't an Angular 2 app, our the next step would be to add the "accounts-ui" package, which is a standard Meteor package
that contains all the HTML and CSS we need for the user operation forms.

But it's a Blaze-related package and will not work in Angular 2.
It's not wrong to say as well that we'd appreciate to use Angular 2 components in Angular 2 where possible.
So, we are going to add "barbatus:ng2-meteor-accounts-ui" instead which is a simple wrapper over standard "accounts-ui" that
provides Blaze LoginButtons view as a Angular 2 component and, besides, does some necessary cleanup behind the scene.

    meteor add barbatus:ng2-meteor-accounts-ui

Let's add the `<accounts-ui>` component to the right of the party addition button in the PartiesForm template:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.1"}}

Then import all dependencies:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.2"}}

Now run the code, you'll see a login link to the right of the "add" button. Click on the link and create an account,
then try to log in and log out.

That's it! As you can see it's very easy to add basic login support with the help of Meteor.

## Parties.allow()

Now that we have our account system, we can start defining our security rules for the parties.

Let's go to the model folder and change the file to look like this:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.3"}}

What we did is we've just added security to our app using only 10 lines of code.

If you want to learn more about those parameters passed into Parties.allow or how this method works in general, please, read
the official Meteor [docs](http://docs.meteor.com/#/full/allow).

## Meteor.user()

OK, right now none of the parties has an owner so we can't change any of them.

So let's add the following simple code to define an owner for each party that gets created.

Let's take our current user's ID and set it as the owner id of the party we are creating.

Mateor's base accounts package provides two reactive functions that we are going to
use, `Meteor.user()` and `Meteor.userId()`.

For now we are going to keep it simple in this app and allow every logged-in users to change a party.
Change the code for the add button in `parties-form.ts` to save user ID as well. Also,
it'd be useful to add an alert promting user to log in if she wants to add or update a party:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.4"}}

Now, do the user check in the `party-details.ts`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.5"}}

Calling each time `Meteor.user()` or `Meteor.userId()` might seems bulky.
Also, you will likely want to use these functions in some component template.

How can you simply life here? You can try out "barbatus:ng2-meteor-accounts" package, which
wraps around all Meteor Accounts API (login with password and social logins functionality)
and exports two services for the usage in Angular 2. Besides that, it has two convenient annotations: `InjectUser` and `RequireUser`.
The second one we'll touch a bit a later, but the first one is exactly what we need.

If you place `InjectUser` above the PartyDetails it will inject a new user property to it:

__`client/parties-form/parties-form.ts`:__
    ...

    import {InjectUser} from 'meteor-accounts';

    @Component({
      selector: 'parties-form'
    })
    @View({
      templateUrl: 'client/parties-form/parties-form.html',
      directives: [FORM_DIRECTIVES, AccountsUI]
    })
    @InjectUser()
    export class PartiesForm {
      constructor() {
        ...
        console.log(this.user);
      }
      ...
    }

Call `this.user` and you will see, it returns same object as `Meteor.user()`.
New property is reactive and can be used in any template, for example:

__`client/parties-form/parties-form.html`:__

    <div *ng-if="!user">Please, log in to change party</div>
    <form [ng-form-model]="partiesForm" #f="form" (submit)="addParty(f.value)">
      ...
    </form>

As you can see, we've added a label "Please, login to change party" that is 
conditioned to be shown if `user` is not defined with help of `ng-if` attribute, and
will disappear otherwise. Don't forget to import `NgIf` dependency in the component.

# Social login

We also want to let users login with their Facebook and Twitter accounts.

To do this, we simply need to add the right packages in the console:

    meteor add accounts-facebook
    meteor add accounts-twitter

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

# Routing Permissions

Let's imagine now that we allow to see and change party details only for logged-in users.
An ideal way to implement this would be to restrict redirecting to the party details page when
someone clicks on a party link. In this case,
we don't need to check access manually in the party details component itself because the route request was denied early on.

This can be easily done again with help of "barbatus:ng2-meteor-accounts" package
that has simple `RequireUser` annotation. Just place it above `PartyDetails` 
and you will see that, if a user is not logged-in to the system, she won't be able to access that route.
Let's add package and then implement restricted access:

    meteor add barbatus:ng2-meteor-accounts

  {{> DiffBox tutorialName="meteor-angular2-socially" step="8.6"}}

Now log out and try to click on any party link. See, links don't work!

But what about more sophisticated access? Say, let's prevent from going into the PartyDetails view for those
who don't own that particular party.

It's easy implement in Angular 2 as well using `@CanActivate` annotation.
BTW, `RequireUser` itself is just a simple inheritor of `@CanActivate`.
Let's add `checkPermissions` function, where we get the current route's `partyId` parameter
and check if the corresponding party's owner is the same as currently logged-in.
And then pass it in `@CanActivate` attribute:
  
  __`client/parties-form/parties-form.ts`:__

    import {CanActivate, ComponentInstruction} from 'angular2/router';

    function checkPermissions(instruction: ComponentInstruction) {
      var partyId = instruction.params('partyId');
      var party = Parties.findOne(partyId);
      return (party && party.owner == Meteor.userId());
    }

    Component({
      selector: 'party-details'
    })
    @View({
        templateUrl: 'client/party-details/party-details.html',
        directives: [RouterLink, FORM_DIRECTIVES]
    })
    @CanActivate(checkPermissions)
    export class PartyDetails {
      ...
    }

Now log in, then add new party, log out and click on the party link.
Nothing happens meaning that access is restricted.

> Please note it is possible for someone with malicious intent to override your routing restrictions on the client.
> You should never restrict access to sensitive data, sensitive areas, using the client router only.

> This is the reason we also made restrictions on the server using the allow/deny functionality, so even if someone gets in they cannot make updates.
> While this prevents writes from happening from unintended sources, reads can still be an issue.
> The next step will take care of privacy, not showing users parties they are not allowed to see.

# Summary

Amazing, only a few lines of code and we have a secure application!

We've added two poweful features to our app:

- "accounts-ui" package that comes with features like user login, logout, registration
  and complete UI supporting them
- restricted access to the party details page for logged-in users only

{{/template}}
