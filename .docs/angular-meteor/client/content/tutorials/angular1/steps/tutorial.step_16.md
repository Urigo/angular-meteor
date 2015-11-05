{{#template name="tutorial.step_16.md"}}
{{> downloadPreviousStep stepName="step_15"}}

Let's add location to our parties.

The most popular maps widget is Google Maps so let's use that.

First, let's add the angular-google-maps Meteor package:

    meteor add angularui:angular-google-maps


Then let's define the module dependency in our app. go to `app.js` inside the `client->lib` folder:

{{> DiffBox tutorialName="meteor-angular1-socially" step="16.1"}}

Now let's add a map the `party-details.ng.html` , first add this HTML snippet to the end of the template:

{{> DiffBox tutorialName="meteor-angular1-socially" step="16.2"}}

Here we created the google-map directive with attributes for binding the center, handling events and zoom of the map.
So let's define those variables in our scope. Go to `partyDetails.js`.

Inside we will create the $scope.map variable to hold the properties on the map:

{{> DiffBox tutorialName="meteor-angular1-socially" step="16.3"}}

To display a Google Map widget we have to define it's height and width. Let's do that now.
Create a new file named parties.css inside a new folder called `styles` placed like this `client->parties->styles` and place to following CSS code inside:

{{> DiffBox tutorialName="meteor-angular1-socially" step="16.4"}}

Now run the app and go to the party details page. You should see a new Google Map widget, but it doesn't do anything yet.

Let's add a marker that will be bound to the party's location.

Inside `party-details.ng.html`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="16.5"}}

The ui-gmap-marker directive represents a marker inside the map. We use the following attributes:

* coords - where is the scope the marker location will be bound to.
* options - object that holds the marker options. We are going to use the draggable option.
* events - handling the events on the marker. We will use the click event.
* idKey - where in the scope there exists the unique id of the object that the marker represent.

Let's extend our $scope.map variable to include handling those options:

Inside `partyDetails.js`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="16.6"}}

What happened here:

* We added the click event to the map. Every time the user clicks the map, we take the location from the click event's params and save it as the party's new location.
Notice that in the end we call $scope.$apply();  this is because that event comes outside of Angular 1 and we need to let Angular 1 know that something has change so it will run another $digest cycle.
* We defined the options object under the marker to specify the marker is draggable.
* We handled the dragend event that happens when the marker is dropped to a new location. We take the location from the event's params and save it as the party's new location.

Again, with the great Meteor platform there is no need for sync or save function. We just set it and it syncs in all other clients.

Test it to see clicking and dragging works.


# Multiple markers

Now let's add a map to the parties list to show all the parties on the map.

So let's add the directives to `parties-list.ng.html`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="16.7"}}

Add it under the search and sorting div.

You can see that the difference between the directive we used in `party-details.ng.html` is that ui-gmap-markers is plural.
The attributes we use:

* models - the scope array that the markers represent.
* coords - the property that holds the location.
* click - handler for the click event on a marker
* fit - a boolean to automatically zoom the map to fit all the markers inside
* idKey - the property that holds the unique id of the array
* doRebuildAll - a refresh option, will help us to refresh the markers in search

Now, inside `partiesList.js` let's add the following code to the parties subscription promise return:

{{> DiffBox tutorialName="meteor-angular1-socially" step="16.8"}}

* Adding to each party a function that handles a click event with the party's specific information
* Initializing the map object
* Defining a function to handle the click. navigates to the party's page.

* Don't forget to add $state to our controller's dependencies.

# Summary

Run the app.  Look at how little code we needed to add maps support to our app.

Angular 1 has a huge eco system full of great directives like the angular-google-maps one.


{{/template}}
