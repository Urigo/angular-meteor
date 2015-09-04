{{#template name="tutorialAngular2.step_06.html"}}
{{> downloadPreviousStep stepName="step_05"}}  
  
In this step we'll continue looking at the Angular router & forms.

By the end, you should have an understanding of:

- **Router lifecycle hooks**
- The difference between **template driven** & **model driven** forms
- How to use **ng-model** for two way binding

# Router Lifecycle Hooks

The new Angular router offers a lot more options. Many of these stem out of the [lifecycle hooks](https://angular.github.io/router/lifecycle). These hooks are places where you can run code during different stages of a route being requested, activated, de-activated and removed.

Hooks take a function and return false if Let's have a look at our choices:

* `canActivate` - Can the route be loaded? Does the user have permission?
* `canReuse` - Can the component be re-used?
* `canDeactivate` - Is it okay to route away from this component? Do you want to save the data first?
* `onActivate` - The route is being loaded, we can also load additional data here
* `onReuse` - Reusing a cached component
* `onDeactivate` - A chance to clean up after the user has routed away from the component

Wow, that's a lot. Now let's see how easy it is to implement these router hooks.

In our previous example, we began loading our data in the constructor.

__`client/party-details/party-details.ts`:__

    export class PartyDetails {

      constructor(@Inject(RouteParams) routeParams:RouteParams) {
        this.partyId = routeParams.params.partyId;

          Tracker.autorun(zone.bind(() => {
            this.party = Parties.find(this.partyId).fetch()[0];
          }));
        }
      }

We'll move the data into an `onActivate` hook instead. But why? It works.

What if the `Parties.find()` was unsuccessful? The users page would return nothing.

By using a router lifecycle hook, the route will not change unless the data is collected.

Router lifecycle hooks are easy to use. Simply add a method to the component class with the name of the hook.

{{> DiffBox tutorialName="angular2-meteor" step="6.1"}}

If no party is found, our hook will return `undefined` and fail.

> Issue: routes currently fail if you reload while using the `HTML5LocationStrategy`

Now we can take the loaded data, add it into it's own model, and save or cancel any changes.



# Template Driven Forms

Earlier we mentioned there are two kinds of forms in Angular 2: template-driven & model-driven.

Let's change `party-details.ng.html` to a form, so that we can edit the party details.

If you completed the challenge in part 5, you should have a router-link button pointing to party-details, with a corresponding alias in the RouteConfig of `app.ts`.

{{> DiffBox tutorialName="angular2-meteor" step="6.2"}}


## ng-model

[ng-model](https://angular.io/docs/js/latest/api/forms/NgModel-class.html) binds a view's model to the controller's model. Think of it as a kind of two-way binding. Let's setup the dependencies and look at an example.

The NgModel dependency can be found in `FORM_DIRECTIVES`. First, import it and add it to your list of View directives.

{{> DiffBox tutorialName="angular2-meteor" step="6.3"}}

Now that Angular knows about NgModel, we can use it in our template.

The syntax looks a bit different: `[(ng-model)]`. Ng-model binds to `this.party` loaded in `onActivate` and the data should fill out the inputs.

{{> DiffBox tutorialName="angular2-meteor" step="6.4"}}

Let's do a little test to see how form controls and events work in Angular 2. Bind to `party.name` below the input, and change the input text.

    <label for="name">Name</label>
    <input type="text" [(ng-model)]="party.name">

    <p>{{dstache}}party.name}}</p>

Notices it updates automatically. You can contrast this to form Controls which only update on events. So essentially, ng-model is emitting an event when changed.

But unlike a form control, NgModel doesn't come with built in control or form validators. If you need to validate your form, you can still use the two input binding approaches together.

__`client/party-details/party-details.ng.html`:__

    <form #f="form" [ng-form-model]="partyDetailsForm">
      <label for="name">Name</label>
      <input type="text" ng-control="name" [(ng-model)]="party.name">

      <label for="description">Description</label>
      <input type="text" ng-control="description" [(ng-model)]="party.description">

      <button type="submit">Save</button>
      <button>Reset form</button>
      <button [router-link]="['/parties-list']">Cancel</button>
    </form>

To get this to work, you'll also have to add the corresponding ControlGroup in `party-details.ts` that matches the `[ng-form-model]`.

We'll keep our example simple for now, without using form controls.

# Challenges

- Add a submit button that saves your data changes.

- Create a reset button that resets the form to it's original value.<br/>
  **Hint: A functional programming library, [Underscore](http://underscorejs.org/),  comes built into Meteor. Use `_.clone(obj)` to make a copy of another object.**

- Use the `canDeactivate` hook to prompt the user if they want to save any changes before leaving.
That is, if the user presses the "cancel" button when changes haven't been saved yet, the user should see an alert:

    "Would you like to save changes?"
      \- "ok" -> save changes and complete the route
      \- "cancel" -> stay on the same page

**Hint: use `_.isEqual(obj1, obj2)` to compare two objects with Underscore.**

{{/template}}
