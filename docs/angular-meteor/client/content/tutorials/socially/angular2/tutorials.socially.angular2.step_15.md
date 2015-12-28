{{#template name="tutorials.socially.angular2.step_15.md"}}
{{> downloadPreviousStep stepName="step_14"}}

In this step we are going to show or hide 
different parts of the app's UI dependly on what
state Socially is currenly in. One of this state is whether
logged-in or anonymous user is browsing the app currently.

As you know, Angular 1 has [ng-show](https://docs.angularjs.org/api/ng/directive/ngShow) and [ng-hide](https://docs.angularjs.org/api/ng/directive/ngHide)
attribute directives for that purpose. The things became a bit different 
in Angular 2. Let's take a look at them.

# Attribute Binding

Angular 2 has one powerful thing called the attribute binding.
As you already know, one can directly bind to the component attribute directives, for example:

    <my-component [foo]="fooValue" />

This attribute binding was mentioned previously multiple times in this turorial, and especially useful for the two-way data binding.
Angular 2 team went further and implemented the same direct binding support for the
DOM element attributes, including attributes like the _hidden_ and _disabled_, and which seems logical.

The `hidden` attribute is a rather new attribute, which appeared
in the DOM as part of the HTML 5's improvements.
It's similar essentially to the old and well-known `disabled` attribute, but only 
makes an element hidden. With the presence of the `hidden` attribute and direct attribute
binding, it seems there is no need any more in the attribute directives like `ng-hide`.
There is one exception, though. Since the `hidden` is rather new, it's not supported, for example, by the older versions of Internet Explorer (less than 11th).
If you need support of the older browsers, you are forced to implement a new directive attribute similar to the `ng-hide` yourself or
make use of already existed one if any (they, for sure, will appear in the future).

There are at least two places on the main page where our app will benefit off if they are hidden in the anonymous mode: 
the party addition form and "remove" button after each party in the parties list.
So, let's toggle on and off these components with the help of the `hidden` attribute, but first let's inject 
the user property into the PartiesList component, since this is what our attribute
binding will depend on. User injection was already mentioned on the step 8th,
let's make use of it now for the practice:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.1"}}

As you can see, we've added a new `isOwner` method into the component,
thus, we allow only a party owner to remove the party.

Then, change the template to use the `hidden` attribute:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.2"}}

Don't forget to add _barbatus:ng2-meteor-accounts_ package to make it work.

Now run the app. Party addition form and "remove" buttons
should disapper if you are not logged-in. Try to log in: everything should be back now.

> Note that CSS style "display" property has priority over the `hidden`.
> So that if one of the CSS classes of any element has this property set,
> _hidden_ won't work. In this case, you'll have to wrap the element into
> some container element and assign CSS classes with the "display" there.

Now is the time of the PartyDetails component and `disabled` attribute.
As now, everybody, who has access to the party details page,
is able to change values of the inputs, but, at the same, is prohibited to save anything
(remember the parties security added on the step 8th?).
Let's disable these inputs for everybody except owners.

We are adding a `isOwner` property similar to the `isOwner` method above:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.3"}}

Notice that we check if the `party` property is available due to the `isOwner` can be used before the subscription is finished.

Then, adding new bindings in the template:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.4"}}

# Using `ngIf`

One of the important things that are worth to be mentioned 
is the difference between the `hidden` attribute and `ngIf` directive.
While the `hidden` shows and hides a DOM element that is already rendered,
`ngIf` adds new element each time or removes it. The latter seems
to be much more heavier, and, hence, should be slowly. That's why it makes sense to
`ngIf` if the decision to show or hide some part is made on the page load.
Regarding our party details page, it makes sense to show conditionally
two parts: the invitation response buttons to those who are already invited
and the invitation list to the party owners, and to everybody if the party is public.

We've added already `isOwner` property. Let's add two more: `isPublic` and `isInvited`.

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.5"}}

Then, make use of the properties in the template:

{{> DiffBox tutorialName="meteor-angular2-socially" step="15.6"}}

# Summary

In this step we've become familiar with the binding to the DOM attributes in Angular 2 and
used two of them to make our app better: `hidden` and `disabled`.

The difference between `ngIf` and `hidden` was highlighted, and based on that, `ngIf` 
was used to make the party details page securer and visually better.

{{/template}}