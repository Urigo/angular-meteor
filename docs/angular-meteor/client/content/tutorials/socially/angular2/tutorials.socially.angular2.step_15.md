{{#template name="tutorials.socially.angular2.step_15.md"}}
{{> downloadPreviousStep stepName="step_14"}}

In this step we are going to show or hide
different parts of the app's UI depending the user's current state: either logged-in or anonymous.

# Attribute Binding

As you may know, Angular 1 has [ng-show](https://docs.angularjs.org/api/ng/directive/ngShow) and [ng-hide](https://docs.angularjs.org/api/ng/directive/ngHide)
attribute directives for controlling the visibility of content.
We'll look at how visibility is handled differently in Angular 2.

Angular 2 binds an attribute to an element's property.
As you already know, one can directly bind to the component attribute directives, for example:

    <my-component [foo]="fooValue" />

The Angular 2 team went further and implemented the same direct binding support for the
DOM element attributes, including additional attributes like _hidden_ and _disabled_, and which seems logical.

### [hidden]

The `hidden` attribute arrived in the DOM with HTML 5.
It's essentially similar to the old and well-known `disabled` attribute, but only
makes an element hidden. With the presence of the `hidden` attribute and direct attribute
binding, it seems there is no further need for attribute directives like `ng-hide`.
There is one exception, though.

> The DOM property `hidden` is rather new, and not supported by older versions of Internet Explorer (less than 11).
> If you need to support older browsers, you must implement a new directive attribute similar to the `ng-hide`
> yourself or make use of an already existing directive. There are sure to be solutions in the future.

A user who hasn't logged-in does not have all the same permissions; we can hide functionality that anonymous users cannot access such as the "add party" form and the "remove" button for each party in the parties list.

Let's toggle on and off these components with the help of the `hidden` attribute, but first let's inject
the user property into the PartiesList component, since this is what our attribute
binding will depend on. User injection was already mentioned in step 8,
so let's make practical use of it now:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.1"}}

As you can see, we've added a new `isOwner` method to the component,
thus, we allow only a party owner to remove the party.

Then, change the template to use the `hidden` attribute:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.2"}}

Now run the app. Make sure you have added _barbatus:ng2-meteor-accounts_ for it to work.

The "add party" form and "remove" buttons should disappear if you are not logged-in. Try to log in: everything should be visible again.

> Note: CSS's `display` property has priority over the `hidden` property.
> If one of the CSS classes of any element has this property set,
> `hidden` gets over-ruled. In this case, you'll have to wrap the element into
> a container element such as a `<div>` and assign CSS classes with the "display" on that parent container.

### [disabled]

Next let's add the `disabled` attribute to the PartyDetails component.
Currently, all users have access to the party details page and can
change the values of the inputs, though they are still prohibited from saving anything
(remember the parties security added in step 8?).
Let's disable these inputs for users that are not owners.

We will get an `isOwner` property when the party owner matches the logged-in user id:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.3"}}

`isOwner` can be used before the subscription has finished, so we must check if the `party` property is available before checking if the party owner matches.

Then, let's add our new `[disabled]` condition to the party details template:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.4"}}

# Using `ngIf`

It's important to know the difference between the `hidden` attribute and `ngIf` directive.
While `hidden` shows and hides a DOM element that is already rendered,
`ngIf` adds or removes an element from the DOM, making it both heavier and slower.
It makes sense to use `ngIf` if the decision to show or hide some part of the UI is made during page loading.

Regarding our party details page, we'll show or hide with the help of `ngIf`.
We'll show or hide the invitation response buttons to those who are already invited,
and the invitation list to the party owners and to everybody if the party is public.

We've already added our `isOwner` variable. Let's add two more: `isPublic` and `isInvited`.

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.5"}}

Then, make use of the properties in the template:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.6"}}

# Summary

In this step we've become familiar with the binding to the DOM attributes in Angular 2 and
used two of the attributes to make our app better: `hidden` and `disabled`.

The difference between `ngIf` and `hidden` was highlighted, and based on that, `ngIf`
was used to make the party details page securer and visually better.

{{/template}}
