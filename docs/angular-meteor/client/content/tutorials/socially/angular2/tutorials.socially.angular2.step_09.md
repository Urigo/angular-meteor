{{#template name="tutorials.socially.angular2.step_09.md"}}
{{> downloadPreviousStep stepName="step_08"}}

You may have noticed that all available parties were always shown on the page
at the time, regardless of whether they had been added by a logged-in user or
anonymously.

In future versions of our app, we'll probably want to have a RSVP feature for parties,
which should only display:

- public parties
- parties the current user has been invited to

In this step we are going to learn how we can restrict data flow from the server side
to the client side for only desired data in Meteor, based on the user currently logged-in and some other parameters.

## Autopublish

First we need to remove the `autopublish` Meteor package.

`autopublish` is added to any new Meteor project.
Like it was mentioned before, it pushes a full copy of the database to each client.
It helped us rapidly developer our app, but it's not so good for privacy...

Write this command in the console:

    meteor remove autopublish

Now run the app. Oops, nothing on the page!

## Meteor.publish

Data in Meteor is published from the server and subscribed to by the client.

We need to tell Meteor what parties we want transferred to the client side.

To do that we will use Meteor's [publish function](http://docs.meteor.com/#/full/meteor_publish).

Publication functions are placed inside the "server" folder so clients won't have access to them.

Let's create a new file named inside of "server" called `parties.ts`. Here we can specify which parties to pass to the client.

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.1"}}

As you can see, parameters of the Meteor.publish are self-explanatory:
first one is a publication name, then there goes a function that returns
a Mongo cursor, which represents a subset of the parties collection
that server will transfer to the client.

The publish function can take parameters as well, but
we'll get to that in a minute.

We've just created a System.js module, hence, as you already know, one necessary thing is left — to import it in the `main.ts` in order to execute code inside:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.2"}}

## Meteor.subscribe

[Meteor.subscribe](http://docs.meteor.com/#/full/meteor_subscribe) is the receiving end of Meteor.publish on the client.

In a regular Meteor app with Blaze, we'd add the following line to subscribe to the "parties" publications:

    Meteor.subscribe('parties');

It's very simple, isn't it? And when the subscription is completed, we select parties from the collection:

    Meteor.subscribe('parties', () => {
      this.parties = Parties.find();
    });

But beyond that simplicity there are two small issues we'll need to solve:

1) Ending a subscription.

Each subscription means that Meteor will continue synchronizing (or in Meteor terms, updating reactively) the particular set of data, we've just subscribed to, between server and client.
If the PartiesList component gets destroyed, we need to inform Meteor to stop that synchronization, otherwise we'll produce a memory leak.

2) Updating Angular 2's UI

We must inform Angular 2 to perform a UI refresh when new data arrives. In other words, we should setup a subscribe callback to run in Angular 2's zone.

These two points were a strong reason to add a new class called `MeteorComponent`
to the Angular2-Meteor package. `MeteorComponent` has two public methods: `subscribe` and `autorun`.
If you inherit a component of this class and make use of these methods, you won't need to worry
about cleanups: `MeteorComponent` will do them for you behind the hood when it's needed.

These methods also have a convenient boolean parameter called `autoBind`, which goes lastly.
As its name suggests, we can tell `subscribe` to run the subscription callback in the change detection zone
by setting the parameter to true.

So, we are going to extend the `PartiesList` component and make use of `this.subscribe`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.3"}}

Now run the app. Whoa, we've just made all the parties come back using pub/sub!

As it's mentioned earlier, it'd be nice for the app to implement some basic security and show parties based on who owns them. Let's do it.

Firstly, we'll add a new `public` field to the party data several steps:

1. update party in `typings/party.d.ts` to include `public: boolean`;
2. add UI with the new "Public" checkbox to the right of the "Location" input;
3. change the `PartiesForm` component and its `addParty` method particularly to reflect changes on the UI;
4. change the initial data on the server in `loadParties.ts` to contain the `public` field as well:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.4"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.5"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.6"}}

Next, we are limiting data sent to the client. A simple check is to verify that either
the party is public or the "owner" field exists and is equal to the currently logged-in user:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.7"}}

> `$or`, `$and` and `$exists` names are part of the MongoDB query syntax.
> If you are not familiar with it, please, read about them here: [$or](http://docs.mongodb.org/manual/reference/operator/query/or/), [$and](http://docs.mongodb.org/manual/reference/operator/query/and/) and [$exists](http://docs.mongodb.org/manual/reference/operator/query/exists/).

We also need to reset the database since schema of the parties inside is already invalid:

    meteor reset

Let's check to make sure everything is working.

Run the app again, and you will see only two items. That's because we set the third party to be private.

Log in with 2 different users in 2 different browsers. Try to create a couple of public parties and a couple of private ones. Now log out and check out what parties are shown. Only public parties should be visible.

Now log in as a party owner user and verify that a couple of private parties got to the page as well.

## Subscribe with Params

There is one page in our app so far where we'll need parameterized publishing — the `PartyDetails` component's page.
Besides that, let's add another cool feature to Socially, party search by location.

As you already know, the second parameter of Meteor.publish is a callback function that can take a variable number
of parameters, and these parameters are passed by the user to `Meteor.subscribe` on the client.

Let's elaborate our "party" publication on the server. We want to publish both a list of parties and a single party.

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.8"}}

Looks like a lot of code, but it does something powerful. The privacy query, we introduced above, was moved to a separate method called `buildQuery`. We'll need this function to avoid repetition with each different parties query.

> Notice that we used `buildQuery.call(this)` calling syntax in order to make context of this method the same as in Meteor.publish and be able to use `this.userId` inside that method.

Let's subscribe to the new publication in the PartyDetails to load one specific party:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.9"}}

As you can see above, the `party` property is undefined initially, which
means at the moment the template is being rendered it's also undefined.
The Angular 2 rendering engine doesn't check availability of template variables while rendering,
as opposed to how templates are rendered in Blaze.

We can add an `ngIf` directive to conditionally display the form when the party data is available:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.10"}}

Run the app and click on one of the party links. You'll see that the party details page loads with full data as before.

# Search

Now it's time for the parties search. Let's add a search input and button to the right of the "Add" button.
We are going to extend the `PartiesList` component since this features is related to the parties list itself:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.11"}}

As you may have guessed, the next thing is to process the button click event:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.12"}}

Notice that we don't re-subscribe in the `search` method because we've already loaded all parties available to
the current user from the published parties, so we just query the loaded collection.

# Understanding Publish-Subscribe

It is very important to understand Meteor's Publish-Subscribe mechanism so you don't get confused and use it to filter things in the view!

Meteor accumulates all the data from the different subscriptions of the same collection in the client, so adding a different subscription in a different view won't delete the data that is already in the client.

Please, read more about Pub/Sub in Meteor [here](http://www.meteorpedia.com/read/Understanding_Meteor_Publish_and_Subscribe).

# Summary

In this step we've clearly seen how powerful Meteor and Angular 2 are and how they become even more
powerful when used together. With rather few lines of code, we were able to add full privacy to Socially as well as
search capabilities.

Meanwhile, we've learned about:

- the importance of removing `autopublish`;
- the Publish-Subscribe mechanism in Meteor;
- how to query particular data from the database via the server side.

In the [next step](/tutorials/angular2/deploying-your-app), we'll look at how quick and easy it is to deploy your Meteor app.

{{/template}}
