{{#template name="tutorials.socially.angular2.step_12.md"}}
{{> downloadPreviousStep stepName="step_09"}}

In this step we are going to add parties list pagination and sorting by party name, then
move parties search by party location to the server side.

Pagination simply means delivering and showing parties to the client on the page-by-page basis,
where each page has a predefined size.

Besides client side logic, it usually includes querying a specific page of parties on
the server side to deliver up to the client as well. By reducing number of documents to be trasferred at one time,
we not only increase usability of the user interface if there are too many documents in the storage,
but also decrease page load time, which plays crucial role today.

# Pagination
First off, we'll add pagination on the server side. Thanks to the simplicity of the
Mongo API combined with Meteor's power, the only change we need on the server side is to execute `Parties.find` method with some additional parameters.
On the client side, thanks to Meteor's isomorphic environment, we'll do pretty much the same — querying `Parties` with
the same parameters.

`Collection.find` has a convenient second parameter called `options`,
which is an object, with that additional parameters-fields mentioned above, used to configure collection querying.
To implement pagination we'll need to provide _sort_, _limit_, and _skip_ fields.
While  _limit_ and _skip_ clearly sound as required to set boundaries on the result set, _sort_, at the same time, may not.
We'll use _sort_ to gurantee consistency of our pagination across page changes and page loads,
since Mongo doesn't gurantee any order of documents if they are queried not sorted.
You can find more information about the _find_ method [here](http://docs.meteor.com/#/full/find).

Now, let's go to the `parties` subscription in the `server/parties.ts` file,
add `options` parameter to the subscription method, and then pass it to the
`Parties.find`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.1"}}

On the client side, we are going to define tree additional variables in the `PartiesList` component our pagination will depend on:
page size, current page number and name sort order.
Second, we'll create, based on values of that variables, a special _options_ object and pass it to the parties subscription:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.2"}}

`nameOrder` is going to contain two values, 1 and -1, to express ascending and descending orders
correspondingly. Then, as you can see, we assign it to a party property (currently, `name`) we want to sort.

As was said before, we also need to query `Parties` on the client side with same parameters and options as we use on the server, i.e., parameters and options we pass to the server side.
In reality, though, we don't need _skip_ and _limit_ options in this case, since, due to the result of the subscription,
parties collection will always have maximum of page size of documents on the client.
So, we add only sorting:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.3"}}

The last thing that we should do before we are done with the logic of pagination is 
to handle changes of the current page variable.

As you can see, we'll need to re-subscribe with new options each time the page number changes.
Thanks to Meteor, we can easily implement that with help of Meteor's reactive variables and MeteorComponent's
reactive API, which was mentioned multiple times previously in this tutorial. Particularly, we are going to use
`this.autorun` method and make `curPage` property of the `PartiesList` to be reactive, like this:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.4"}}

Reactive variables go in a separate Meteor core package. Don't forget to add it:

    meteor add reactive-var

# Pagination UI

As this paragraph name suggests, the next logical thing to do would be to implement a 
pagination UI, which consists of, at least, a list of page links at the bottom of every page,
so that the user can switch pages by clicking on these links.

Since it is not a trivial task and, as well as, not one of the goals of this tutorial,
we are going to make use of already existed package with Angular 2 pagination components.
Run the following line to add this package:

    meteor add barbatus:ng2-pagination

It consists of three main parts: pagination controls, a pagination service
and a pagination pipe. Pagination controls will simply render what is mentioned above —
a list of page links to switch between.
The pagination service is used to manipulate pagination logic programmatically, and required by the
pagination pipe. Finally, the pagination pipe is a special component, which can be added 
in any component template, with the main goal to transform a list of items
according to the current state of the pagination service and show current page of items on UI.

Pipes are a new concept introduced in Angular 2, which is essentially similar
to Angular 1's filters with some minor differences. You can read more about them [here](https://angular.io/docs/ts/latest/guide/pipes.html).
For now, what you need to know is that pagination pipe will act and look in the template
pretty much the same if we were to use a pagination filter in Angular 1.

First, let's import all the pagination parts into the `PartiesList` component, and then
set up them to be available in the component's view as follows:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.5"}}

Second, change `parties-list.html` template to:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.6"}}

As you can see, we've just added the pagination controls tag and applied pagination to the parties cursor
with the help of the pagination pipe. In the pipe definition, we provided the current page number,
the page size and a new value of total items in the list to paginate. 

This total number of items are required to be set in our case, since we don't provide a 
regular array of elements but a Mongo cursor; the pagination pipe simply won't know how to calculate its size.

We'll get back to this in the next paragraph where we'll be setting parties total size reactively.
For now, let's just set it to be 30, for the reason you'll know just in a second.

The final part is to handle user clicks on the page links. The pagination controls component
fires a special event when the user clicks on a page link, and current page changes.
Let's handle this event in the tempalte first and then in the `PartiesList` component itself:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.7"}}

As you can see, the pagination controls component fires page changed event with
special event object that contains new page number to set,
so we pass it in our event handler to process. 

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.8"}}

At this moment, when we have almost everything in place, let's check whether everything works at all.
We are going to add a lot of parties to have, at least, a couple of pages.
But, since we've chosen quite big default page size (10), it would be tedious to add all parties manually.

Thankfully, we have a nice package at hand called _anti:fake_, which will help us out with the 
generation of names, locations and other properties of new fake parties.
So, with the following lines of code we are going to have totally 30 parties
(given that we already have three):

    for (var i = 0; i < 27; i++) {
      Parties.insert({
        name: Fake.sentence(50),
        location: Fake.sentence(10),
        description: Fake.sentence(100),
        public: true
      });
    }

Now run the app. You should see a list of 10 parties shown initially and 3 pages links just at the bottom.
Play around with the pagination: click on page links to go back and forth,
then try to delete parties to check if the current page updates properly.

# Getting Total Number of Parties

As was menionted previously, we need to know total number of parties in the storage
in order to make pagination components work properly; at the same time, our parties
collection will always have no more than page number of parties on the client side.
This suggests that we have to add a new publication, which is going to publish only
total ammount of parties existed in the storage currently.

This task looks quite common and, thankfully, it's been already
implemented, for example, in this [tmeasday:publish-counts](https://github.com/percolatestudio/publish-counts) package.
Let's add it:

    meteor add tmeasday:publish-counts

This package exports `Counts` object with all API methods we are going
to use. Let's publish total number of parties as follows:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.9"}}

> Notice that we are passing `{ noReady: true }` in the last argument so
> that the publication will be ready only after our main cursor is ready - readiness.

We've just created new _numberOfParties_ publication.
Let's get it reactively on the client side using `Counts` object, and, at the same time,
introduce a new "partiesSize" property in the `PartiesList` component:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.10"}}

Then, we use this new property in the template to set up pagination properly:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.11"}}

Now, let's verify that the Socially works same as before.
Run the app. There should be same three pages of parties. That's a must check.
What's more interesting is to add a couple of new parties, thus, adding
a new 4th page. By this way, we can prove that our new "total number" publication and pagination controls work properly in one rig.

# Changing Sort Order

It's time for a new cool feature Socially users will certainly like - sorting parties list by party name.
At this moment, we know everything we need to implement it.

New dropdown with two orders to change, ascending and descending, will be our UI control for
the sorting feature. Let's add it in the front of our parties list:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.12"}}

In the `PartiesList` component, we change `nameOrder` property to
be a reactive variable and add `changeSortOrder` event handler, where we set
new sort order:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.13"}}

That's just it! Run the app and change the sort order back and forth.
What's important here is that pagination updates properly, i.e. according to a new sort order.

# Server Side Search

Before this step we had a nice feature to search parties by location,
but with the addition of pagination, it became partly broken.
At each point, there will be always no more than page number of parties shown simultaneously on the client side.
We would like, of course, to search parties accross all storage, not just accross the shown list.

To fix that, we'll need to patch our "parties" and total number" publications on the server side
to query parties with a new "location" parameter passed down from the client.
Having that fixed, it should work properly in accordance with the added pagination.

So, let's add filtering parties by the location with help of Mongo's regex API.
It is going to look like this:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.14"}}

On the client side, we are going to add a new reactive variable and set it every time
to a new value when user clicks on the search button:

{{> DiffBox tutorialName="meteor-angular2-socially" step="12.15"}}

> Notice that we don't know what size of the search to expect
> that's why we are re-setting current page to 0.

That's it! We are done with all features we wanted to implement.
Let's check it out now that everything works properly altogether: pagination, search, sorting,
removing and addition of new parties.

For example, you can try to add 30 parties in a way mentioned slightly above;
then try to remove whole 3d page of parties; then sort by the descending order; then try to search by Palo Alto — it should
find only two, in case if you have not added any other parties rather than used in this tutorial so far;
then try to remove one of the found parties and, finally, search by empty location.

This sequence of actions looks quite complecated, as well as, functionality we've added in this step,
but, it's worth to mention, with rather small amount of additional lines of code.

# Challenge

As you could see in the last code difference, 
sometimes we have to update reactive variables in a row,
which means that overuse of the reactive variables might lead to multiple re-subscriptions
we don't need, and in general tangles internal logic of the component.

This step's challenge will be to re-implement new features without reactive variables usage.
> Hint: you'll need to move the subscribing logic to a separate method
> with appropriate parameters and execute it whenever you need to re-subscribe.
> Be careful with subscriptions — you'll need
> to stop previous subscription each time in order to pereserve data consistency on the client.

# Summary

We've just witnessed in this step one important thing:
even with growing complexity of features we add,
we manage to crack every nut in a snap, thanks to we are armored 
with Meteor and Angular2 powers.

{{/template}}