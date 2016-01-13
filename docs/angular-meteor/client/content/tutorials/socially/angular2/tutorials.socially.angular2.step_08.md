{{#template name="tutorials.socially.angular2.step_08.md"}}
{{> downloadPreviousStep stepName="step_07"}}

In this section we'll look at how to:

- implement security for an app using Meteor and Angular 2 API together.
- setup user accounts in meteor using a login and password
- setup OAuth login for Facebook & Twitter
- restrict access to views based on user permissions

# Removing Insecure

Right now, our app is publishing all parties to all clients, allowing any client to change those parties. The changes are then reflected back to all the other clients automatically.

This is super powerful and easy, but what about security?  We don't want any user to be able to change any party...

For quick and easy setup, Meteor automatically includes a package called `insecure`. As the name implies, the packages provides a default behavior to Meteor collections allowing all reads and writes.

The first thing we should do is to remove the "insecure" package. By removing that package, the default behavior is changed to deny all.

Execute this command in the command line:

    meteor remove insecure
    > insecure removed from your project

Let's try to change the parties array or a specific party. Nothing's working.

That's because now we have to write an explicit security rule for each operation we want to make on the Mongo collection.

We can assume we will allow a user to alter data if any of the following are true:

- the user is logged in
- the user created the party
- the user is an admin

# User Accounts

One of Meteor's most powerful packages is the [Meteor accounts](https://www.meteor.com/accounts) system.

Add the "accounts-password" Meteor package. It's a very powerful package for all the user operations you can think of: login, signup, change password, password recovery, email confirmation and more.

    meteor add accounts-password

If Socially were just a Meteor app without Angular 2, the next step would be to add the ["accounts-ui"](https://atmospherejs.com/meteor/accounts-ui) package, which is a standard Meteor package that contains all the HTML and CSS we need for the user operation forms. But "accounts-ui" is a Blaze-related package and will not work in Angular 2.

It's not wrong to say as well that we'd appreciate using Angular 2 components in Angular 2 where possible.
So, we are going to add ["barbatus:ng2-meteor-accounts-ui"](https://atmospherejs.com/barbatus/ng2-meteor-accounts-ui) instead which is a simple wrapper over the standard "accounts-ui" that exports a Blaze-based LoginButtons view as an Angular 2 component and, besides, does some necessary cleanup behind the scenes.

    meteor add barbatus:ng2-meteor-accounts-ui

Let's add the `<accounts-ui>` tag to the right of the party form in the PartiesList's template:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.1"}}

Then, import the dependencies:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.2"}}

And typings:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.3"}}

Run the code, you'll see a login link to the right of the "Add" button. Click on the link and then "create  account" to sign up. Try to log in and log out.

That's it! As you can see, it's very easy to add basic login support with the help of the Meteor accounts package.

## Parties.allow()

Now that we have our account system, we can start defining our security rules for the parties.

Let's go to the "collection" folder and specify what actions are allowed:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.4"}}

In only 10 lines of code we've specified that inserts, updates and removes can only be completed if a user is logged in.

If you want to learn more about those parameters passed into Parties.allow or how this method works in general, please, read the official Meteor [docs on allow](http://docs.meteor.com/#/full/allow).

## Meteor.user()

Let's work on ensuring only the party creator (owner) can change the party data.

First we must define an owner for each party that gets created. We do this by taking our current user's ID and setting it as the owner ID of the created party.

Meteor's base accounts package provides two reactive functions that we are going to
use, [`Meteor.user()`](http://docs.meteor.com/#/full/meteor_user) and [`Meteor.userId()`](http://docs.meteor.com/#/full/meteor_users).

For now, we are going to keep it simple in this app and allow every logged-in user to change a party.
Change the click handler of the "Add" button in the `parties-form.ts`, `addParty`, to save the user ID as well. Also, it'd be useful to add an alert prompting the user to log in if she wants to add or update a party:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.5"}}

> Notice that you'll need to update the Party type in the `party.d.ts` definition file with the optional new property: `owner?: string`.

Let's do the user check in `party-details.ts`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.6"}}

> Notice that you should also update your `tsconfig.json` to include the declaration file.


Typing each time `Meteor.user()` or `Meteor.userId()` might seems tedious.
Not to mention that there is no way to use these functions in the component templates currently.

# RequireUser

How can you simply life here? You can try out "barbatus:ng2-meteor-accounts" package, which
wraps around all Meteor Accounts API (login with password and social logins features)
and exports two services for the usage in Angular 2. Besides that, it has two convenient annotations: `InjectUser` and `RequireUser`.

    meteor add barbatus:ng2-meteor-accounts

Now you can specify if a component can be accessed only when a user is logged in using the `@RequireUser` annotation.

{{> DiffBox tutorialName="meteor-angular2-socially" step="8.7"}}

# InjectUser

If you place `@InjectUser` above the PartiesForm it will inject a new user property:

__`client/parties-form/parties-form.ts`__:

    ...
    import {MeteorComponent} from 'angular2-meteor';
    import {AccountsUI} from 'meteor-accounts-ui'
    import {InjectUser} from 'meteor-accounts';

    @Component({
      selector: 'parties-form'
    })
    @View({
      templateUrl: 'client/parties-form/parties-form.html',
      directives: [AccountsUI]
    })
    @InjectUser()
    export class PartiesForm extends MeteorComponent {
      constructor() {
        super();
        ...
        console.log(this.user);
      }
      ...
    }

> Notice that you have to extend `PartiesForm` with `MeteorComponent` to make the user property reactive.
> That's because this class adds a few Meteor specific methods to a child inheritor, used to implement reactivity (as above) or Meteor's pub/sub data transfer.
> We'll learn more about MeteorComponent later on the next step, where we'll be subscribing to server publications.

Call `this.user` and you will see that it returns the same object as `Meteor.user()`.
The new property is reactive and can be used in any template, for example:

__`client/parties-form/parties-form.html`__:

    <div *ngIf="!user">Please, log in to change party</div>
    <form [ngFormModel]="partiesForm" #f="form" (submit)="addParty(f.value)">
      ...
    </form>

As you can see, we've added a label "Please, login to change party" that is
conditioned to be shown if `user` is not defined with help of an `ngIf` attribute, and
will be hidden otherwise.

# Social Login

We also want to let users be able to login quickly with their Facebook or Twitter accounts.

To do this, we simply need to add the right packages in the console:

    meteor add accounts-facebook
    meteor add accounts-twitter

Now run the app. When you first press the login buttons of the social login, meteor will show you a wizard that will help you configure your OAuth logins.

You can also skip the wizard and configure it manually like the explanation here: [http://docs.meteor.com/#meteor_loginwithexternalservice](http://docs.meteor.com/#meteor_loginwithexternalservice)

There are additional social login services you can use:

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
someone clicks on a party link. In this case, we don't need to check access manually in the party details component itself because the route request is denied early on.

This can be easily done again with help of "barbatus:ng2-meteor-accounts" package
that has a simple `RequireUser` annotation. Just place it above `PartyDetails`
and you will see if a user is not logged-in to the system, that user won't be able to access the route.
Let's add the package and then implement restricted access:

    meteor add barbatus:ng2-meteor-accounts

  {{> DiffBox tutorialName="meteor-angular2-socially" step="8.8"}}

Now log out and try to click on any party link. See, links don't work!

But what about more sophisticated access? Say, let's prevent access into the PartyDetails view for those
who don't own that particular party.

It's easy to implement in Angular 2 as well using [`@CanActivate`](https://angular.io/docs/ts/latest/api/router/CanActivate-decorator.html) annotation
(BTW, `RequireUser` itself is just a simple inheritor of `@CanActivate`).

Let's add a `checkPermissions` function, where we get the current route's `partyId` parameter
and check if the corresponding party's owner is the same as the currently logged-in user.
And then pass the partyId into the `@CanActivate` attribute:

  __`client/party-details/party-details.ts`__:

    import {CanActivate, ComponentInstruction} from 'angular2/router';

    function checkPermissions(instruction: ComponentInstruction) {
      var partyId = instruction.params['partyId'];
      var party = Parties.findOne(partyId);
      return (party && party.owner == Meteor.userId());
    }

    Component({
      selector: 'party-details'
    })
    @View({
        templateUrl: 'client/party-details/party-details.html',
        directives: [RouterLink]
    })
    @CanActivate(checkPermissions)
    export class PartyDetails {
      ...
    }

Now log in, then add a new party, log out and click on the party link.
Nothing happens meaning that access is restricted to party owners.

Please note it is possible for someone with malicious intent to override your routing restrictions on the client.
You should never restrict access to sensitive data, sensitive areas, using the client router only.

This is the reason we also made restrictions on the server using the allow/deny functionality, so even if someone gets in they cannot make updates.
While this prevents writes from happening from unintended sources, reads can still be an issue.
The next step will take care of privacy, not showing users parties they are not allowed to see.

# Summary

Amazing, only a few lines of code and we have a much more secure application!

We've added two powerful features to our app:

- the "accounts-ui" package that comes with features like user login, logout, registration
  and complete UI supporting them;
- restricted access to the party details page, with access available for logged-in users only.

{{/template}}
