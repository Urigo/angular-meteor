{{#template name="tutorials.socially.angular1.step_13.md"}}
{{> downloadPreviousStep stepName="step_12"}}

Our next mission is to invite users to private parties.

We have subscribed to list of all users, but we can't invite everyone.
We can't invite the owner of the party and we can't invite users who are already invited, so why not filter them out of the view?

To do so we will use the powerful [filter feature](https://docs.angularjs.org/guide/filter) of Angular 1.

Filters can work on array as well as single values.
We can aggregate any number of filters on top of each other.

Here is the list of all of Angular 1 built-in filters:
[https://docs.angularjs.org/api/ng/filter](https://docs.angularjs.org/api/ng/filter)

And here is a 3rd party library with many more filters:
[angular-filter](https://github.com/a8m/angular-filter)


Now let's create a custom filter that will filter out users that are the owners of a certain party and that are already invited to it.

Create a new folder named `filters` under the `client->parties` folder.

Under that folder create a new file named `uninvited.js` and place that code inside:

{{> DiffBox tutorialName="meteor-angular1-socially" step="13.1"}}

* First we define a filter to the 'socially' module (our app)
* The filter is named `uninvited`
* Filters always get at least one parameter and the first parameter is always the object or array that we are filtering (like the parties in the previous example)
Here we are filtering the users array, so that's the first parameter
* The second parameter is the party we want to check
* The first if statement is to make sure we passed the initializing phase of the party and it's not undefined

At this point we need to return the filtered array.

The great thing here is that thanks to Meteor we have access to the great [underscore](http://docs.meteor.com/#underscore) library.

So we use underscore's `filter` method to remove each user that either isn't the party's owner or that
is not already `_contains` (another underscore method) in the invited list.

So now let's use our new filter

Simply add the filter to the list of users and send the current party to the party parameter, inside `party-details.html`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="13.2"}}

Run the app and see the users in each party.

We still don't have invites but you can see that the filter already filters the party owners out of the list.

But some of the users don't have emails (maybe some of them may have signed in with Facebook). In that case we want to display their name and not the empty email field.

But it's only in the display so its perfect for a filter.

We want the list to simply look like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="13.4"}}

and that the filter `displayName` will handle to logic and display the user's name in the best way possible.

So let's create another custom filter `displayName`.

Create a new file under the filters folder named `displayName.js` and place that code inside:

{{> DiffBox tutorialName="meteor-angular1-socially" step="13.3"}}

Pretty simple logic but it's so much nicer to put it here and make the HTML shorter and more readable.

AngularJS can also display the return value of a function in the HTML.

To demonstrate let's add to each party in the parties list the creator's name:

Add a line that displays the user information to the parties list in `parties-list.html`,
so it will look like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="13.5"}}

And define `getPartyCreator` function in the `partiesList` component:

{{> DiffBox tutorialName="meteor-angular1-socially" step="13.6"}}

As you can see, we are using the `Meteor.users` collection here but we haven't made sure that we are subscribing to it
(If we visited the `partyDetails` controller before getting here, `partyDetails` controller would subscribe to the Meteor.users collection,
but if we weren't, we would get an empty array in Meteor.users).

So let's add a subscription to `users` in the list component as well:

{{> DiffBox tutorialName="meteor-angular1-socially" step="13.7"}}

Now we get the user object to the HTML. But we want his name, so let's put the `displayName` filter on that as well:

{{> DiffBox tutorialName="meteor-angular1-socially" step="13.8"}}

# Summary

In this chapter we learned about Angular 1 filters and how easy they are to use and to read from the HTML.

In the next step we will learn about Meteor methods, which enables us to run custom logic in the server, beyond the Mongo API and the allow/deny methods.

{{/template}}
