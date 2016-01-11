{{#template name="tutorials.socially.angular2.step_05.md"}}
{{> downloadPreviousStep stepName="step_04"}}

In this step, you will learn:

-  how to create a layout template
-  how to build an app that has multiple views with the new Angular router.

The goal for this step is to add one more page to the app that shows the details of the selected app.

By default we have a list of parties shown on the page, but when a user clicks on a list item, the app should navigate to the new page and show selected party details.

# Import Router Dependencies

Routing functionality in Angular traditionally goes in a separate library.
In Angular 2, there is a separate module for this called [`angular2/router`](https://angular.io/docs/js/latest/api/router/).

The Angular2-Meteor package already contains `angular2/router` along with the code, so you can start importing it right out of the box.
Angular 2 routing turns out to be a rather small module in comparison to other major Angular 2 modules, besides,
it's expected that Angular 2 can be loaded directly with NPM in the future versions of Meteor (1.3+).
These were the two main reasons for adding routing to the package.

Let's import routing dependencies into our app. We'll need router providers ([`ROUTER_PROVIDERS`](https://angular.io/docs/ts/latest/api/router/ROUTER_PROVIDERS-let.html)), directives ([`ROUTER_DIRECTIVES`](https://angular.io/docs/ts/latest/api/router/ROUTER_DIRECTIVES-let.html)), and configuration ([`RouteConfig`](https://angular.io/docs/ts/latest/api/router/RouteConfig-var.html)). More on what each of these does later.

Be sure to add `ROUTER_DIRECTIVES` to the View decorator itself to import all directive dependencies into the template. `ROUTER_PROVIDERS` should be added as a dependency to the bootstrapped application in order to make them available throughout the app.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.1"}}

# Multiple Views and Layout Template

Our app is slowly growing and becoming more complex.
Until now, the app provided our users with a single view containing a list of all parties and a form to add new parties.

The next step in building the app is to add a view that will show detailed information about each of the parties in our list.

To add the detailed view, we could expand the `app.html` file to contain template code for both views, but that could get messy very quickly.

Instead, we are going to turn the Socially component into what we call a "layout template". This is a template that is common for all views in our application.
Other "partial templates" are then included into this layout template depending on the current "route" — that is, the view that is currently displayed to the user.

Another great feature of the Angular 2 router is that we can route directly to a component.
This type of routing is also known as _Component Routing_. And it makes it really easy to configure routes.

So, first, we are going to split our app into 2 main views (or pages): Parties List and Party Details.
Then, we are going to utilize `RouteConfig` annotation over the `Socially` component
to configure routes, which basically means we will wire components to unique URLs.

## Parties List

Let's move the content of Socially in `app.ts` out into a `PartiesList` component.

Create a new file called `parties-list.ts` and put it in its own component folder.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.2"}}

Move `app.html` into the parties-list directory and rename it `parties-list.html`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.3"}}

Also, let's clean-up `app.ts` to prepare it for the next steps:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.4"}}

## Party Details

Let's add another main view to the app: `PartyDetails`.
Since it's not possible yet to get party details in this component, we are only going to make stubs.

When we're finished, clicking on a party in the list should route to the `PartyDetails` component for more information.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.5"}}

And add a simple template outline for the party details:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.6"}}

At this point our front-end app structure should look like this:

    client
      \- parties-list
      \- parties-form
      \- party-details

At this point, your app will not run until our routes are configured.

# Configuring Routes

Let's configure our routes. This is how we map url paths to components.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.7"}}

We've added multiple things here. Firstly, we've imported
our two main views `PartiesList` and `PartyDetails`,
then we tied them to URLs using `@RouteConfig` annotation.

Notice also that we've added just one line for our template:

    <router-outlet></router-outlet>

This is going to be our "default layout" template. The `router-outlet` directive will
render a view on the page based on the current URL.

If `PartyDetails` view is targeted with a `partyId` parameter, it will route to the `PartyDetails` component with access to that parameter.

The last line of code that we've added to the app bootstrap method
configures the app base route by means of the dependency injection mechanism.
The same thing was usually done in Angular 1 by placing

    <base href="/">

in the app template.

If you are familiar with Angular 1, you've certainly heard about the [dependency injection](https://docs.angularjs.org/guide/di) pattern as a first-class pattern.

In Angular 1, dependency injection might seem a bit quirky, especially to newcomers from the OOP world where it works with classes.

In Angular 2, DI has radically changed, thanks to ES6 and TypeScript.
Now dependency injection in Angular 2 looks the same as in, say, Java, where it's been used and polished for many years.

What we did in the last line of code is create a provider of the `BASE_APP_HREF` type that
will resolve this type to `/` value whenever it's asked to do so. What does it mean for us?

We can use it in many situations. For example, if we have a constructor with a
parameter of `BASE_APP_HREF` type, we can create an instance with
this parameter equal to `/` value automatically inside of the constructor.

We are going to look closely behind the scenes in the _Injecting Route Parameters_ section below,
where we'll use route parameters in the `PartyDetails` component's constructor.

# RouterLink

Let's add links to the new router details view from the list of parties.

As we've already seen, each party link consists of two parts: the base `PartyDetails`
URL and a party ID, represented by the `partyId` in the configuration.
There is a special directive called `routerLink` that will help us to compose each URL.

First we'll import the directive and specify it as a view directive in the `PartiesList`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.8"}}

Now we can wrap our party in a `routerLink` and pass in the `_id` as a parameter. Note that the id is auto-generated when an item is inserted into a Mongo Collection.

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.9"}}

`routerLink` takes an array of URL parts as it was defined in the configuration and
then composes a full URL. By the first `/PartyDetails` item we instruct `routerLink` to
find URL path to the `PartyDetails` view in the root routing config.
Since each component in Angular 2 can have own routing config,
if we put `./PartiesList` there, the directive would resolve routes accordingly to
`PartiesList` routing config if any.

# Injecting Route Params

We've just added links to the `PartyDetails` view.

The next thing is to grab the `partyId` route parameter in order to load the correct party in the `PartyDetails` view.

In Angular 2, it's as simple as passing the [`RouteParams`](https://angular.io/docs/ts/latest/api/router/RouteParams-class.html) argument to the `PartyDetails` constructor:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.10"}}

Dependency injection is employed heavily here by Angular 2 to do all the work behind the scenes.
TypeScript first compiles this class with the class metadata that says what argument types this class expects in the constructor (i.e. `RouteParams`),
so Angular 2 knows what types to inject if asked to create an instance of this class.

Then, when you click on a party details link, the `router-outlet` directive will create a `RouteParams` provider that provides
parameters for the current URL. Right after that moment if a `PartyDetails` instance is created by means of the dependency injection API, it's created with `RouteParams` injected and equalled to the current URL inside the constructor.

If you want to read more about dependency injection in Angular 2, you can find an extensive overview in this [article](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html).
If you are curious about class metadata read more about it [here](http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html).

Let's now load a party instance using a received ID parameter:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.11"}}

And render the party details on the page:

{{> DiffBox tutorialName="meteor-angular2-socially" step="5.12"}}

# Challenge

Add a link back to the `PartiesList` component from `PartyDetails`.

# Summary

Let's list what we've accomplished in this step:

- split our app into two main views
- configured routing to use these views and created a layout template
- learned briefly how dependency injection works in Angular 2
- injected route parameters and loaded party details with the ID parameter

{{/template}}
