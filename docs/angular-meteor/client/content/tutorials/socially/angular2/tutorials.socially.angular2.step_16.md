{{#template name="tutorials.socially.angular2.step_16.md"}}
{{> downloadPreviousStep stepName="step_15"}}
As you see, our app looks far from fancy using only 
pure HTML templates. It urgently needs graphical design improvements
to be usable. We are going to fix this issue in the next three steps starting
from the current. Ultimately, we'll try out two graphical design front-end libraries: Twitter's Bootstrap and Google's Material Design,
which are among most popular design libraries and has multiple open-source implementations on the market.

But first up, we'll add one more visual feature to the Socially: maps.
This will be quite beneficial, taking into account specifics of our app:
parties need precise locations to avoid confusions.
We are going to imploy this package of Google Maps components for Angular 2.

# Adding Location Coordinates

Having maps on board, we can make use of latitute and
longitute coordinates, which are most precise location information possible.
And of course, we'll show everything on the map to make this information
comprehensive for users.

There are two pages in the app which will be changed: main page to
show all parties' locations on the map and party details page to show and
change a particular party's location on the map. If it's done nicely,
it will certantly look terrific and attract more users to the app.

Before we start with the maps directly, we need to make some preparations.
First up, we need to extend `Party`'s with two more properties: "lat" and "lng",
which are the above mentioned latitude and longitude.
Since we have the location name and would like not to remove it since it still might be useful,
let's consider converting "location" property to an object with three properties: "name", "lat", and "lng".
It will require, though, some changes in other parts of the app, where `Party` type is used.

Let's add those changes consequently, starting from `Party` type itself:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.1"}}

Then, change the parties, that are created and added on the server initially, accordingly:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.2"}}

The PartiesForm component needs to be changed too to reflect type changes:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.3"}}

Lastly, we are updating the parties publications. It's interesting to 
see what a small change is required to update the parties search by location: it needs only to point out that "location" property has been moved to "location.name", thanks to Mongo's flexible API:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.4"}}

Now when we are done with updates, let's reset the database in case it has
parties of the old type (remember how to do it? Execute `meteor reset`). Then, run the app to make sure that everything is alright and
works as before.

# Adding Google Maps

Now is the time to upgrade above mentioned components to feature Google Maps.
Let's add a Meteor package that wraps around that Google Maps NPM package:

    meteor add barbatus:ng2-google-maps

As everything in Angular 2 now is based on the dependency injection's providers,
this package is not an exception, and has some providers that make sense to install
globally.

Setting up global dependencies:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.5"}}

The maps package contains two major directives: one is to render a HTML container with Google Maps,
another one is to visualize a map marker. Let's add a maps markup to the PartyDetails component's template:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.6"}}

It needs some explanation. Our markup now contains these two directives.
As you can see, parent map container directive has a party marker directive as a child element, so that it can be
parsed and rendered on the map. We are setting "latitude" and "longitude" on the map directive, which will fixate the map at a particular location on the page load.

You may notice as well, four new properties were added:
"lat", "lng", "centerLat", and "centerLng". "lat" and "lng" are wrappers over a party's coordinates, while "centerLat" and "centerLng" are default center coordinates.
In addition, location property binding has been corrected to reflect new type changes.

Here come changes to the component itself, including imports, new coordinates properties, and maps click event handler:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.7"}}

It's going to work in a scenario as follows:

  - when the user visit a newly created party,
    she will see a map centered at Palo Alto;
  - if she clicks on some part of the map, a new marker
    will be placed at that place;
  - if she decides to save the party changes, new location coordinates will
    be saved as well;
  - on the next visit, the map will be centered at the saved party location
    with a marker shown at this point.

That's almost it with the party details. So far, so good and simple.

The last change will be about CSS styles. To show the map container of a specific size,
we'll have to set element styles. Since we'll need styles for that for two pages, let's create
a separate CSS file for the whole app, which is, anyways, will be useful on the next steps:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.8"}}

As usual, having introduced new feature, we are finishing it up with testing.
Let's create a new party with the location name set to some existing place you know, and go to the details page. Click on the maps at the
location that corresponds to the party's location name: a new marker should appear there.
Now, click "Save" button and re-load the page: it should be loaded with the map and a marker on it at
the point you've just pointed out.

# Multiple Markers

Adding multiple markers on the parties front page should be straightforward now.
Here is the markup:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.9"}}

As you can see, we are looping through the all parties and adding a new marker for each party,
having checked if the current party has location coordinates available.
We are also setting the minimum zoom and zero central coordinates on the map to set whole Earth view point initially.

Lastly, import dependecies:

{{> DiffBox tutorialName="meteor-angular2-socially" step="16.10"}}

# Summary

It turned to be quite easy to add location cooordinates to the parties and make
changes to the UI, which included Google Maps and location markers on them.

Now we are all set to proceed to more radical visual design changes.

{{/template}}
