{{#template name="tutorialAngular2.step_05.md"}}
{{> downloadPreviousStep stepName="step_04"}}

In this step, you will learn how to create a layout template and how to build an app that has multiple views by adding routing, using the new Angular router.

The goals for this step is to add one more page to the app that shows details of the selected app.

By default we have a list of parties shown on the page, but
when user clicks on a list item, app should navigate to the new page and show selected pary details.

# Import Router Dependencies

Routing functionality in Angular traditionally goes in a separate library.
In Angular 2, there is a separate module for this called `angular2/router` (read about routing API [here](https://angular.io/docs/js/latest/api/router/)).

Angular2-Meteor package contains `angular2/router` along with the code, so you can start importing it right out of the box.
Angular2 routing turns out to be a small fraction of all Angular2 source code (less than 100k uncompressed);
it made sense to include it by default into the package.

Let's import routing dependencies into our app. We'll need router providers,
router directives and router configuration.
The reason why we need all of them you'll know about a bit later.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.1"}}

# Multiple Views and Layout Template

Our app is slowly growing and becoming more complex.
Until now, the app provided our users with the single view, which contains a list of all parties and
a form to add parties.

The next step in building the app is to add a view that will show detailed information about each of the parties in our list.

To add the detailed view, we could expand the `app.html` file to contain template code for both views, but that would get messy very quickly.

Instead, we are going to turn the Socially component into what we call a "layout template". This is a template that is common for all views in our application.
Other "partial templates" are then included into this layout template depending on the current "route" — the view that is currently displayed to the user.

Another great features of the Angualar 2 routing is that we can route directly to a component.
This type of routing is also known as _Component Routing_. And it makes really easy to configure routes.

So, first, we are going to split our app into 2 main views (or pages): Parties List and Party Details. 
Then, we are going to utilize `RouteConfig` annotation over the `Socially` component
to configure routes, which basically means to wire components to unique URLs together.

## Parties List

Let's move the content of Socially out into a `PartiesList` component. Create a new file called `parties-list.ts` and put it in its own component folder.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.2"}}

Move `app.html` to the new `parties-list.html`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.3"}}

Also, let's clean-up `app.ts` to prepare it for the next steps:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.4"}}

At this point app structure should look like this:

    Socially
      \- PartiesList
      \- PartiesForm

## Party Details

Let's add another main view to the app: `PartyDetails`.
Since it's not possible yet to get party details in this component,
we are going to make only stubs.

Ultimately it's expected to work like this: when you click on a party in the list, it should route to this `PartyDetails` component for more party information.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.5"}}

And add a template prepared for the party details:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.6"}}

# Configuring Routes

Let's configure our routes. This is how we map url paths to components.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.7"}}

We've added multiple things here. Firstly, we've imported 
our two main views `PartiesList` and `PartyDetails`,
then we tied them to URLs using `@RouteConfig` annotation.

Notice also that we've added one line template:

    <router-outlet></router-outlet>

This is going to be our "default layout" template. `<router-outlet>` directive will
render a view on the page based on the current URL.

If `PartyDetails` view is targeted, with a `partyId` parameter, it will route to the `PartyDetails` component with access to that parameter.

The last line of code that we've added to the app bootstraper method
configures app base route by means of the dependency injection mechanism.
Same thing was usually done in Angular 1 by placing

    <base href="/">

in the app template.

If you are familiar with Angular 1, you've certantly heard about dependency injection pattern, which
is a first-class pattern there. 

In Angular 1, dependency injection might seem a bit quirky especially
to newcomers from the OOP world where it works with classes.

In Angular 2, things have radically changed, thanks to ES6 and TypeScript.
Now dependency injection in Angular 2 looks the same as in, say, Java, where
it's been used and polished for many years.

What we did in the last of code is we created a provider of the `BASE_APP_HREF` type that 
will resolve this type to `/` value whenever it's asked to do so. What does it mean for us?

We can use it in many situations. For example, if we have a constructor with a 
parameter of `BASE_APP_HREF` type, we can create an instance with 
this parameter equalled to `/` value automatically inside the contructor.

We are going to look closely at behind the scene in _Injecting Route Parameters_ section,
where we'll need route parameters in the `PartyDetails` component's contructor.

# Router-Link

The next thing we are going to add is links to the new router details view from
the list of all parties. 

As we've already seen, each party link consists of two parts: the base `PartyDetails` 
URL and a party ID, represented by the `partyId` in the configuration.
There is special directive called `<router-link>` that will help us to compose each URL.

First we'll import the directive and specify it as a view directive in the `PartiesList`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.8"}}

Now we can wrap our party in a `router-link` and pass in the `_id` as a parameter. Note that the id is auto-generated when an item is inserted into a Mongo Collection.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.9"}}

`router-link` takes an array of URL parts as it was defined in the configuration and 
then composes a full URL. By the first `/PartiesList` item we instruct `router-link` to 
find URL path to the `PartiesList` view in the root routing config.
Since each component in Angular 2 can have own routing config,
if we put `./PartiesList` there, the directive would resolve routes accordingly to
`PartiesList` routing config if any.

# Injecting Route Params

We've just added links to the `PartyDetails` view.

The next thing is to grab the `partyId` route parameter in order to load the correct party in the `PartyDetails` view.

In Angular 2, it's simple as passing `RouteParamer` argument to `PartyDetails` constructor:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.10"}}

Dependency injection is imployed heavily here by Angular 2 to do all the work behind the scene.
TypeScript first compiles this class with the class metadata that says what argument types this class expects in the constructor (i.e. `RouteParams`),
so Angular 2 knows what types to inject if asked to create an instance of this class.

Then, when you click on a party details link, `<router-outlet>` directive will create an `RouteParams` provider that provides
parameters of the current URL. Right after that moment if a `PartyDetails` instance is created by means of the dependency injection API,
it's created with `RouteParams` injected and equalled to the current URL inside the constructor.

If you want to read more about dependency injection in Angular 2, you can find excessive overview in this [article](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html).
If you are interested what class metadata is, proceed [here](http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html)

Let's now load a party instance using received ID parameter:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.11"}}

And render party details on the page:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.12"}}

# Challenge

Add a link back to the `PartiesList` component from `PartyDetails`.

# Summary

Let's list what we'done in this step:

- slit our app into two main views
- configured routing to use these views and created a layout template
- learned briefly how dependency injection works in Angular 2
- injected route parameters and loaded party details with the ID parameter

{{/template}}
