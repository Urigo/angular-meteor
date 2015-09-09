{{#template name="tutorialAngular2.step_05.html"}}
{{> downloadPreviousStep stepName="step_04"}}

In this step, you will learn how to create a layout template and how to build an app that has multiple views by adding routing, using the new Angular router.

The goals for this step:

* When you navigate to `index.html`, you will be redirected to the `Socially` component and the party list should appear in the browser.
* When you click on a party link the URL should change to one specific to that party and the stub of a party detail page is displayed.

# Dependencies

The routing functionality added by this step is provided by the new [angular-router](https://angular.io/docs/js/latest/api/router/) module, aka the "Component router", which is distributed separately from the core Angular framework.

We will install angular-router with the help of [a package I've put together](https://atmospherejs.com/shmck/angular2-router).

> The API for the new Angular router is changing rapidly. I will try to keep this tutorial updated, but expect possible breaking changes.

Type in the command line:

    $ meteor add shmck:angular2-router
    
It will now be added to our list of packages.    
    
{{> DiffBox tutorialName="angular2-meteor" step="5.1"}}

Let's import and add the package dependencies into our app.

{{> DiffBox tutorialName="angular2-meteor" step="5.2"}}

Let's make a checklist of what we need to get our router working. We'll go over each of these soon enough:

* imports from `'angular2/router'`
* `@RouteConfig()` which will specify our routes soon
* View directives adding `ROUTER_DIRECTIVES`, which include `RouterOutlet` and `RouterLink`
* inject `ROUTER_BINDINGS` into the child components
* a location in the view where components will be created, the `<router-outlet></router-outlet>`

Be sure to declare the base route in `index.html` (required when using the HTML5LocationStrategy, rather than the HashLocationStategy). 

{{> DiffBox tutorialName="angular2-meteor" step="5.3"}}

# Multiple Views, Routing and Layout Template

Our app is slowly growing and becoming more complex.
Until now, the app provided our users with a single view (the list of all parties), and all of the template code was located in the `index.ng.html` file.

The next step in building the app is to add a view that will show detailed information about each of the parties in our list.

To add the detailed view, we could expand the `index.ng.html` file to contain template code for both views, but that would get messy very quickly.

Instead, we are going to turn the Socially component into what we call a "layout template". This is a template that is common for all views in our application.
Other "partial templates" are then included into this layout template depending on the current "route" — the view that is currently displayed to the user.

Application routes in Angular 2 are declared via the [RouteConfig](https://angular.io/docs/js/latest/api/router/RouteConfig-var.html) annotation.
This service makes it easy to wire together components and the current URL location in the browser.
Using this feature we can implement deep linking, which lets us utilize the browser's history (back and forward navigation) and bookmarks.

## Root App

In the new Angular router, we don't route to templates or controllers. Instead, we route directly to components. Because of this, we're going to have to re-factor our app a bit.

Let's move the content of Socially out into a `party-list` component. Create a new file called `parties-list.ts` and put it in its own component folder. We'll also import some router directives to use later.

_{{> DiffBox tutorialName="angular2-meteor" step="5.4"}}

`app.ts` should be looking a lot cleaner now.

{{> DiffBox tutorialName="angular2-meteor" step="5.5"}}

Notice the View is now point to a `template` declared within the `.ts` file. This is an alternative to specifying our `templateUrl` path.

Our template here is the `<router-outlet></router-outlet>`. This is where the route components will be located on the page when the url changes.

Move the `index.ng.html` file into the parties-list folder and rename it `parties-list.ng.html`.

{{> DiffBox tutorialName="angular2-meteor" step="5.6"}}


Good. Now our app structure looks like this:

    Socially
      \- PartiesList
      \- PartiesForm

Think of dependencies in Angular as a trees. The final line:

    bootstrap(Socially, [
      ROUTER_BINDINGS
    ]);

Here, the dependencies such as `ROUTER_BINDINGS` are passed to all of Socially's components on bootstrapping.

## Party Details

Before configuring our routes, let's setup one more component: `party-details`. When you click on a party in the list, it should route to this PartyDetails component for more party information.

{{> DiffBox tutorialName="angular2-meteor" step="5.8"}}

And a template with placeholders for the component:

{{> DiffBox tutorialName="angular2-meteor" step="5.9"}}

# Configuring Routes

Let's configure our routes. This is how we map url paths to components.

{{> DiffBox tutorialName="angular2-meteor" step="5.10"}}

Here the default path url will launch PartyList within the `<router-outlet>` and redirect to the '/parties' url.

If `party-details` is targeted, with a `partyId` parameter, it will route to the PartyDetails component with access to that parameter.

# Router-Link

Let's see how we move around different urls using the `<router-link>`. First we'll have to import and declare our dependencies.

Now we can wrap our party in a `router-link` and pass in the `_id` as a parameter. Note that the id is auto-generated when an item is inserted into a Mongo Collection.

{{> DiffBox tutorialName="angular2-meteor" step="5.11"}}

This route syntax may look complicated, but that is because it is very flexible.

- The preceding `/` indicates that the route path we are linking to is an absolute path (routing supports multiple hierarchies of routers, but we don't need that in our simple app).
- Routes are placed in an array to allow for more complicated route paths and mixing route paths and parameters.

Make sure you imported the `RouterLink` and specified it as a view directive.

{{> DiffBox tutorialName="angular2-meteor" step="5.12"}} 
 
Let's update our party-details view to use dynamic bindings to see if everything is working.

{{> DiffBox tutorialName="angular2-meteor" step="5.13"}}

Great, now we just have to pass in the route params from the RouterLink.

# Injecting Route Params

As we are moving from the `party-list` to a specific party's `party-details`, we will need to grab the route parameters and load the correct party. Let's do this in `party-details.ts`.

{{> DiffBox tutorialName="angular2-meteor" step="5.14"}}

Several things are happening here.

- First we must import our dependencies for `Inject` and `RouteParams`.
- Next, we inject `RouteParams` into our `PartyDetails` class and give it an alias of `routeParams`.
- We catch the `partyId` from the routeParams
- Finally, we set `this.party` to fetch the selected party from the Mongo Collection `Parties`.

So now we can route to pages with the data loading. But if you route to a party-details page and press 'reload', the data fails.

We will see a better way to handle this kind of routing in the next step.

# Challenge

Add a link back to the `PartyList` component from `PartyDetails`.

# Summary

We've seen only a glimpse of the power & flexibility of Angular 2's new router.

In the next unit we'll look at another router feature: **LifeCycle Hooks**.

{{/template}}
