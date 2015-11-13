{{#template name="tutorials.socially.angular2.step_09.md"}}
{{> downloadPreviousStep stepName="step_08"}} 
  
You may have noticed that all available parties were always shown on the page
at the time, independently had they been added by a logged-in user or
anonymously, for example.

In future versions of our app, we'll probably want to have an RSVP feature for parties.
Hence, it'll require to show simultaneously only public parties and parties current user has been invited to.

In this step we are going to learn how we can restrict data flow from the server side
to the client side for only desired data in Meteor based on
what user currently logged-in and some other parameters.

## Autopublish

First we need to remove the `autopublish` Meteor package.

`autopublish` is added to any new Meteor project.
Like it was mentioned before, it pushes a full copy of the database to each client.
It helped us until now, but it's not so good for privacy...

Write this command in the console:

    meteor remove autopublish

Now run the app. Oops, nothing on the page!

## Meteor.publish

Now we need to tell Meteor what parties we need to be transfered to the client side.

To do that we will use Meteor's [publish function](http://docs.meteor.com/#/full/meteor_publish).

Publication functions are worth to be placed inside the "server" folder so clients won't have access to them.

Let's create a new file named `parties.ts` insert this code inside the file:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.1"}}

As you can see, parameters of the Meteor.publish are self-explanatory:
first one is a publication name, then there goes a function that returns
a Mongo cursor, which represents a subset of the parties collection
that server will transfer to the client. This function can take parameters as well, but
we'll get to this in a minute.

We've just created a System.js module, hence, as you already know, one necessary thing is left — to import it in the `main.ts` in order to execute code inside:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.2"}}

## Meteor.subscribe

This function is an opposite of [Meteor.subscribe](http://docs.meteor.com/#/full/meteor_subscribe): the one we are goint to use on the client
to get that data.

In a regular Meteor app with Blaze, we'd add the following line to subscribe to the "parties" publications:

    Meteor.subscribe('parties');

It's very simple, isn't it. And when subscription is completed, we select parties from the collection:

    Meteor.subscribe('parties', () => {
      this.parties = Parties.find();
    });

But beyond that simplicity there go two little issues we'll need to solve.
Each subscription means that Meteor will continue synchronize (or in Meteor terms, update reactively) particular set of data, we've just subscribed to, between server and client.
If PartiesList components gets desctroyed, we need to inform Meteor to stop that synchronization, otherwise we'll get a memory leak.
It especially makes sense for single page apps, that are most usually built with Meteor.

The second point is about informing Angular 2 to perform UI refresh when new data arrive.
Or in other words, subscribe callback should run in the Angular 2's zone.

These two points were a strong reason to add a new class called `MeteorComponent`
to the Angular2-Meteor package. This class has two public methods: `subscribe` and `autorun`.
If you inherit a component of this class and make use of these methods, you won't need to worry
about cleanups — `MeteorComponent` will do them for you behind the hood when it's needed.
These methods also has a convenient boolean parameter called `autoBind`, which goes the last.
As its name suggests, we can tell `subscribe` to run the subscription callback in the change detection zone
by setting the parameter to true.

So, we are going to extend `PartiesList` component and make use of `this.subscribe`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.3"}}

Now run the app. Whoa, all parties are back!

As it's mentioned earlier, it'd be nice for the app to implement a simple security and show parties based on who owns them. Let's do it.

Firstly, we'll add a new `public` field to the party data schema in three steps: we'll update UI with new "Public" checkbox to the right of the "Location" input,
then change the `PartiesForm` component and its `addParty` method particularly to reflect changes on the UI and, lastly, we'll change initial data on the server in `loadParties.td` to contain `public` field too:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.4"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.5"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.6"}}

Secondly, we are limiting data sent to the client. Simple check is to verify that 
either the "owner" field exists and it equals to the currently logged-in user or that the party is public:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.7"}}

> `$or`, `$and` and `$exists` names are part of the MongoDB query syntax.
> If you are not familiar with it, please, read about them here: [$or](http://docs.mongodb.org/manual/reference/operator/query/or/), [$and](http://docs.mongodb.org/manual/reference/operator/query/and/) and [$exists](http://docs.mongodb.org/manual/reference/operator/query/exists/).
 
We also need to reset the database since schema of the parties inside is already invalid:

    meteor reset

Run the app again, and you will see only two items. That's because we set the third party to be private.

Log in with 2 different users in 2 different browsers.

Try to create a couple of public parties and a couple of private ones.

Now log out and check out what parties are shown. There should be only public ones!

Now log in as one of these users and verify that a couple of private parties got to the page as well.

## Subscribe with params

There is one page in our app where we'll need a parameterized publishing — it's the PartyDetails component's page.
Besides that, let's add another one cool feature to the Socially — search by location.

As you already may know, the second parameter of Meteor.publish is a callback funtion that can take a variable number 
of parameters, and they are parameters passed by the user to Meteor.subscribe on the client.

Let's create a "party" publication on the server:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.8"}}

Looks like a lot of code! But it's a wrong perception. What has been done is that privacy query, we introduced above, was moved to a separate method called `buildQuery`.
We'll need it for each parties query, hence, avoiding repeation is a sensible thing.

> Notice that we used `queryBuild.call(this)` calling syntax in order to make context of this method the same as in Meteor.publish
> and be able to use `this.userId` inside that method.

Let's subscribe to the new publication in the PartyDetails to load one specific party:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.9"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.10"}}

Run the app and click on one of the party links. You'll see that party details page loads full data as before.

Now is time for the parties search. Let's add search input and button to the right of "Add" button.
We are going to extend PartiesList component since this features is related to the parties list itself:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.11"}}

As you may guess, the next thing is to process the button click event:

{{> DiffBox tutorialName="meteor-angular2-socially" step="9.12"}}

Notice that we don't re-subscribe in the `search` method because we've loaded initially all parties available to
the current user, so we just query the loaded collection.

# Understanding Publish-Subscribe

It is very important to understand Meteor's Publish-Subscribe mechanism so you don't get confused and use it to filter things in the view!

Meteor accumulates all the data from the different subscriptions of the same collection in the client, so adding a different subscription in a different
view won't delete the data that is already in the client.

Please, read more [here](http://www.meteorpedia.com/read/Understanding_Meteor_Publish_and_Subscribe).

# Summary

In this step it's been clearly seen how powerful Meteor and Angular 2 are and how they become even more
powerful when used together. With rather few line of codes, we were able to add full privacy to the Socially plus
we've added a parties search.

Meanwhile, we've learned what is Publish-Subscribe mechanism in Meteor,
how to query particular data from the database via server side and how important this mechanism is.

{{/template}}
