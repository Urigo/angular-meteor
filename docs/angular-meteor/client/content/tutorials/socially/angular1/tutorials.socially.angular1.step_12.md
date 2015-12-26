{{#template name="tutorials.socially.angular1.step_12.md"}}
{{> downloadPreviousStep stepName="step_11"}}

Currently we are dealing with only a few parties, but we also need to support a large number of parties.

Therefore, we want to have `pagination` support.

With pagination we can break the array of parties down to pages so the user won't have to scroll down to find a party,
but also, and even more importantly, we can fetch only a few parties at a time instead of the entire parties collection for better performance.

The interesting thing about pagination is that it is dependent on the filters we want to put on top of the collection. 
For example, if we are in page 3, but we change how we sort the collection, we should get different results. 
Same thing with search: if we start a search, there might not be enough results for 3 pages.

For Angular 1 developers this chapter will show how powerful Meteor is.
In the official Angular 1 tutorial, we added sorting and search that only worked on the client side, which in real world scenarios is not very helpful.
Now, in this chapter we are going to perform a real-time search, sort and paginate that will run all the way to the server.

# angular-meteor pagination support

What we want to achieve with angular-meteor is *server-based reactive pagination*.
That is no simple task, but using angular-meteor could make life a lot simpler.

To achieve server-based reactive pagination we need to have support for pagination on the server as well as on the client.
This means that our publish function for the parties collection would have to change and so does the way that we subscribe to that publication.
So first let's take care of our server-side:

In our `parties.js` file in the server directory we are going to add the `options` variable to the publish method like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.1"}}

Now our publish method receives an options argument which we then pass to the `Parties.find()` function call.
This will allow us to send arguments to the find function's modifier right from the subscribe call. The options object can
contain properties like `skip`, `sort` and `limit` which we will shortly use ourselves - [Collection Find](http://docs.meteor.com/#/full/find).

Let's get back to our client code. We now need to change our subscribe call with options we want to set for pagination.
What are those parameters that we want to set on the options argument? In order to have pagination in our
parties list we will need to save the current page, the number of parties per page and the sort order. So let's add these parameters to our component in `parties-list.component.js` file.

We will `perPage`, `page` and `sort` variables will later effect our subscription and we want the subscription to re-run every time one of them changes.

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.2"}}

Right now, we just use `subscribe` without any parameters, but we need to provide some arguments to the subscriptions.

In order to do that, we will add a second parameter to the `subscribe` method, and we will provide a function that returns an array of arguments for the subscription.

We will use `getReactively` in order to get the current value, and this will also make them Reactive variables, and every change of them will effect the subscription parameters.

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.3"}}

That means that `this.page` and `this.sort` are now reactive and Meteor will re-run the subscription every time one of them will change. 

Now we've built an object that contains 3 properties:

* **limit** - how many parties to send per page
* **skip**  - the number of parties we want to start with, which is the current page minus one, times the parties per page
* **sort**  - the sorting of the collection in [MongoDB syntax](http://docs.mongodb.org/manual/reference/method/cursor.sort/)

Now we also need to add the sort modifier to the way we get the collection data from the Minimongo.
That is because the sorting is not saved when the data is sent from the server to the client.
So to make sure our data is also sorted on the client, we need to define it again in the parties collection.

To do that we are going to add the `sort` variable, and use it again with `getReactively`, in order to run the helper each time the `sort` changes:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.4"}}

# pagination directive

Now we need a UI to change pages and move between them.

In Angular 1's eco system there are a lot of directives for handling pagination.

Our personal favorite is [angular-utils-pagination](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination).

To add the directive add its Meteor package to the project:

    meteor add angularutils:pagination

Add it as a dependency to our Angular app in `app.js`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.6"}}

Now let's add the directive in `parties-list.html`, change the `ng-repeat` of parties to this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.7"}}

and after the UL closes, add this directive:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.8"}}

As you can see, `dir-paginate` list takes the number of objects in a page (that we defined before) but also takes the total number of items (we will get to that soon).
With this binding it calculates which page buttons it should display inside the `dir-pagination-controls` directive.

On the `dir-pagination-controls` directive there is a method `on-page-change` and there we can call our own function.

So we call the `pageChanged` function with the new selection as a parameter.

Let's create the `pageChanged` function inside the `partiesList` component:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.9"}}

Now every time we change the page, the scope variable will change accordingly and update the bind method that watches it.

* Note that, at this point, the pagination will *not* work until we add the missing `partiesCount` variable in the next step of the tutorial.

# Getting the total count of a collection

Getting a total count of a collection might seem easy, but there is a problem:
The client only holds the number of objects that it subscribed to. This means that, if the client is not subscribed to the whole array, calling find().count on a collection will result in a partial count.

So we need access on the client to the total count even if we are not subscribed to the whole collection.

For that we can use the [tmeasday:publish-counts](https://github.com/percolatestudio/publish-counts) package. 
On the command line:

    meteor add tmeasday:publish-counts

This package helps to publish the count of a cursor in real-time, without any dependency on the subscribe method.

Inside the `server/parties.js` file, add the code that handles the count inside the `Meteor.publish("parties")` function, at the beginning of the function, before the existing return statement.
So the file should look like this now:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.11"}}

As you can see, we query only the parties that should be available to that specific client, but without the options variable so we get the full number of parties.

* We are passing `{ noReady: true }` in the last argument so that the publication will be ready only after our main cursor is ready - [readiness](https://github.com/percolatestudio/publish-counts#readiness).

With this, we have access to the Counts collection from our client.

So let's create another helper that uses `Counts`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.12"}}

Now the `partiesCount` will hold the number of parties and will send it to the directive in `parties-list.html` (which we've already defined earlier).

# Reactive variables

Meteor is relying deeply on the concept of [reactivity](http://docs.meteor.com/#/full/reactivity).

This means that, when a [reactive variable](http://docs.meteor.com/#/full/reactivevar) changes, Meteor is made aware of it via its [Tracker object](http://docs.meteor.com/#/full/tracker_autorun).

But Angular's scope variables are only watched by Angular and are not reactive vars for Meteor...

For that, angular-meteor provides the `helpers`, and each time you will defined a variable, a new `ReactiveVar` will be created and will cause the Tracker to update all the subscriptions!


# Changing the sort order reactively

We haven't placed a way to change sorting anywhere in the UI, so let's do that right now:

In our HTML template, let's add a sorting dropdown inside the UL:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.13"}}

In the component, let's implement the `updateSort` method:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.14"}}

> Note that we also created `orderProperty` in order to make sure it's available from the beginning.

And we don't have to do anything other than that, because we defined `sort` variable as helper, and when we will change it, Angular-Meteor will take care of updating the subscription for us. 

So all we have left is to sit back and enjoy our pagination working like a charm.

We've made a lot of changes, so please check the step's code [here](https://github.com/Urigo/meteor-angular-socially/compare/step_14...step_15)
to make sure you have everything needed and can run the application.

# Reactive Search

Now that we have the basis for pagination, all we have left to do is add reactive full stack searching of parties. This means that we will be able to enter a search string, have the app search for parties that match that name in the server and return only the relevant results! This is pretty awesome, and we are going to do all that in only a few lines of code. So
let's get started!

As before, let's add the server-side support. We need to add a new argument to our publish method which will hold the
requested search string. We will call it... `searchString`! Here it goes:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.15"}}

Now we are going to filter the correct results using mongo's regex ability. We are going to add this
line in those two places where we are using `find`: in publish Counts and in the return of the parties cursor:

    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },

So `server/parties.js` should look like this:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.16"}}

As you can see, this will filter all the parties whose name contains the searchString.

> We added also `if (searchString == null) searchString = '';`  so that, if we don't get that parameter, we will just return the whole collection.

Now let's move on to the client-side.
First let's place a search input into our template and bind it to a 'searchText' component variable:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.17"}}

And all we have left to do is call the subscribe method with our reactive variable, and add the `searchText` as reactive helper:

{{> DiffBox tutorialName="meteor-angular1-socially" step="12.18"}}

Wow, that is all that's needed to have a fully reactive search with pagination! Quite amazing, right?

# Summary

So now we have full pagination with search and sorting for client and server-side, with the help of Meteor's options and Angular 1's directives.

{{/template}}
