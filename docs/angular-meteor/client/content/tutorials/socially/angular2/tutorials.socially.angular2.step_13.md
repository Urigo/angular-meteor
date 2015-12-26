{{#template name="tutorials.socially.angular2.step_13.md"}}
{{> downloadPreviousStep stepName="step_012"}}

In this and next steps we are going to implement
party invitations feature, which is essential for the social apps like ours.

Particularly, in this step we'll be realizing mostly UI
part of that feature, and will do it with the help of Angular 2 pipes.
On the next step, we'll take on the server part using
Meteor methods.

# Rendering Users

Each party owner will be able to invite multiple guests to
a party, hence, it's logical if she can manipulate those data
on the party details page. It means that we are going to
change `PartyDetails` component in this step.

First of all, we'll need to take a list of all users to invite
and render it on the page. Since we've made the app secure on the step 8th by removing the _insecure_ package,
to get a list of users — same as for the parties — we'll need to create 
a new publication, and then subscribe to load data. 

Let's create a new file `server/users.ts` and add a new publication there:

{{> DiffBox tutorialName="meteor-angular2-socially" step="13.1"}}

Then, import users publications to be defined on the server at the start time:

{{> DiffBox tutorialName="meteor-angular2-socially" step="13.2"}}

As you can see, above we've introduced a new party property — "invited", which
is going to be an array of all user IDs invited to the party.
Don't forget to update `party.d.ts` declaration file to reflect changes of the party type.
Notice also that we've made use of a special Mongo selector `$nin` to sift out 
users that have been already invited to this party so far.
We're also removing each party's owner from that list due to no need.

Now, let's load uninvited users of a particular party into the `PartyDetails` component:

{{> DiffBox tutorialName="meteor-angular2-socially" step="13.3"}}

Then, render uninvited users on the `PartyDetails`'s page:

{{> DiffBox tutorialName="meteor-angular2-socially" step="13.4"}}

# Implementing Pipes

In the previous paragraph we rendered a list of user emails.
In Meteor's basic accounts package an email is considered a primary
user ID by default. At the same time, everything is configurable, which means there is way for a user to set a name to be 
identified with during the registration.
Considering user names are more visually appealing than emails,
let's render them instead of emails in that list of uninvited users
checking if the name set for each user.

For that purpose we could create a private component method
and call it each time in the template to get the right display name, i.e., name or email. Intead,
we'll implement a special pipe that does the same, at the same time,
we'll learn how to create stateless pipes. One of the advantages of this
approach in comparison to class methods is that we can use same pipe
in any other component.
You are likely familiar with Angular 2 pipes if
you read the previous step. If not — you are welcome to know more about them [here](https://angular.io/docs/ts/latest/guide/pipes.html).

Let's add a new folder "client/lib" and place there a new file `lib/pipes.ts`
with the content as follows:

{{> DiffBox tutorialName="meteor-angular2-socially" step="13.5"}}

As you can see, there are a couple of things to remember in order to create a pipe:
one needs to define a class with implemented method `transform` inside,
then one needs to place a pipe metadata upon this class with the help of
the `@Pipe` decorator to notify Angular 2 that this class essentially is a pipe.

To make use of the created pipe, change markup of the `PartyDetails`'s template to:

{{> DiffBox tutorialName="meteor-angular2-socially" step="13.6"}}

And, finally, import new pipe into the component and add it to the view decorator:

{{> DiffBox tutorialName="meteor-angular2-socially" step="13.7"}}

To test that user names are displayed properly along with emails,
we'll need to re-configure the user creation form of the accounts dialog to contain
user name property as well.

According to the accounts API, it can be configured via the `Accounts.ui.config` method.
Place the following line before the main app class:

{{> DiffBox tutorialName="meteor-angular2-socially" step="13.8"}}

Now, let's test it! Add a couple of new users with names and emails,
log in as some already existed user and check out that a party's users to 
invite shown with proper user IDs.

# Challenge

In order to cement knowledge of the pipes, try to create
a current user status pipe, which transforms current user to the three values relatively to a some party:
owner, invited and uninvited. This will be helpful on the next step,
where we'll get to the implemention of the invitation feature and will change
current UI for the security reasons.

# Summary

If you were familiar with Angular 1's filters concept,
you would say that Angular 2's pipes are very similar.
This is true and not. While the view syntax and aims they are
used for are the same, there are some important differences.
The main one is that Angular 2 can now efficiently handle 
_stateful_ pipes, whereas stateful filters were discouraged in Angular 1.
Another thing to note is that Angular 2 pipes are defined in the unique and elegant Angular 2 way, i.e.,
using classes and class metadata, same as for components and thier views.

{{/template}}
