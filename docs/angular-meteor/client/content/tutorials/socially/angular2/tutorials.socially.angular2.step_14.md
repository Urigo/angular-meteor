{{#template name="tutorials.socially.angular2.step_14.md"}}
{{> downloadPreviousStep stepName="step_013"}}

In this step we will learn how to use Meteor methods.
We'll implement server side logic of the party invitation feature
using them.

Meteor methods are more secure and reliable way to 
implement complex logic on the server side in comparison to the direct
manipulations of Mongo collections.

# Invitation Method

Let's create a new file `collections/methods.ts`, and add the following lines of code there:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.1"}}

We used a special API method `Meteror.methods` to register
a new Meteor method. Again, don't forget to import just created `methods` module
in the server's `main` module to have methods defined properly:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.2"}}

As you can see, we've also done a lot of checks to verify that
all arguments passed down to the method are valid.
It includes, first of all, checking of the validity of the arguments' types, and then 
checking of the business logic assotiated with them.

Type validation checks, which are essential for the JavaScript methods dealing with the storage's data, 
are done with the help of handy Meteor's package called "check".
Run _meteor add check_ to add it.

Then, if everything is valid, we send an invitation email.
Here we are using another one handy Meteor's package "email".
Run _meteor add email_ to add it.

At this point, we are ready to add calling of the new method from the client.
Let's add a new button right after each user name or email in that 
list of users to invite in the `PartyDetails`'s template:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.3"}}

And then, change component to handle the click event and invite an user:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.4"}}

One more thing before we are done with the party owner's invitation
logic. We, of course, would like to make this list of users
change reactively, i.e. each user disappers from the list 
when invitation has been sent successfully.

It's worth to say that each party should change appropriately
when we invite an user — its `invited` array should update
in the local Mongo storage. It means if we wrap the line where 
we get the new party into the `autorun` method, this code should
re-run reactively:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.5"}}

Here comes an idea how we can update our users list.
We'll move the line that gets the users list into a 
separated method, provided with the list of IDs of already invited users;
and call it whenever we need: right in the above `autorun` method after the party assigment and in the subscription, like that:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.6"}}

Here comes test time. Let's add a couple of new users.
Then log in as an old user and add a new party.
Go to the party: you should see a list of all users including 
just created ones. Invite several of them — each items in the list 
should disappear after successful invitation.

# User Reply

Here we are going to implement a part that is
resposible for the user reply to the party invitation request.

First of all, let's make parties list a bit more secure,
which means two things: showing private parties to those who have been invited
or to owners, and elaborate routing activation defence for the party details view:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.7"}}

The next thing is a party invitee response to the invitation itself. Here as usual, 
we'll need to update the server side and UI. For the server,
let's add a new `reply` Meteor method along with already added `invite`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.8"}}

As you can see, a new property, called "rsvp", were added
above to collect user responses of this particular party.
One more thing. Let's update the party declaration file to
make TypeScript resolve and compile with no warnings:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.9"}}

For the UI, let's add three new buttons onto the party details view.
These will be "yes", "no", "may be" buttons and users responses accordingly:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.10"}}

Then, handle that click events in the PartyDetails component:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.11"}}

The last, but not the least, thing is to show statistics of the invitation responses,
which is really important for the party owner. Let's imagine that any party owner
would like to know total amount of those who declined, accepted, or still tentative.
This is a perfect case to add a new stateful pipe, which takes as 
an input a party and a one of the RSVP responses, and calculates the total number of responses
associated with this, provided as a parameter, response.
Add a new pipe to the `lib/pipes.ts` as follows:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.12"}}

Let's take a look at it closely. The pipe extends `MeteorComponent` and
uses its `autorun` method to watch for the party's updates.
Whenever the party's `rsvp` array changes, new numbers will be
displayed as required. That's the reason why this pipe is stateful:
it not only trasform one value to another, but also subscribes on the updates. 
You may have noticed as well, that new property `pure` is set to true
in the `@Pipe` decorator, which tells Angualar 2's check detection
system to check this pipe on changes too, i.e., in the same way as any other
component.

It's worth to mention the second parameter. This `args` parameter
bears a list of configuration arguments we can provide this pipe with,
separated by comma. We are going to pass only a RSVP response, hence, are taking the first
value in the list.

Let's make use of this pipe in the `PartiesList` component:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.13"}}

And then in the component itself:

{{> DiffBox tutorialName="meteor-angular2-socially" step="14.14"}}

Now is the testing time! Our test plan will be to check that some invited user is able to reply to an
invitation, and then we are going to verify that the party's statistics update properly and,
which is particularly important, reactively.

Log in as some existed user. Add a new party, go to the party and
invite some other user. Then, open new browser window in the anonymous mode along with the current window,
and log in as the invited user there. Go to the party details page, and reply, say, "no";
the party's statistics on the first page with the parties list should duly update.

# Challenge

Here is one important thing that we missed. Besides the party invitation
statistics, each user would like to know if she has already responded, in case she forgot,
to a particular invitation. This step's challenge will be to add this status
information onto the PartyDetails's view, and update it reactively.

> Hint: In order to make it reactive, you'll need to add one more handler into
> the party `autorun`, like `getUsers` in the this step above.

# Summary

We've just finished the invitation feature in this step, having added bunch of new stuff.
Socially looks now much mature with that feature loaded on. We can give themselves
a big thumbs-up for that!

Though, some places in the app can certantly be improved. For example,
we still show some private information to all invited users, but designated only for the party owner.
Let's fix in the next step.

{{/template}}
