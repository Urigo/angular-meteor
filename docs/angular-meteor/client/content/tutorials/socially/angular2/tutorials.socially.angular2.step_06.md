{{#template name="tutorials.socially.angular2.step_06.md"}}
{{> downloadPreviousStep stepName="step_05"}}  

In this step we are going to:

- add a form to the party details view
- bind a party object to the view, so that we'll be able to change party details and
then save changes to the storage

# Two-Way Data Binding

As we've already explored on the 3rd step, data can be bound to the HTML input elements
with the help of a group of special Angular 2 Control objects, otherwise called a form model.
We called this approach the _Model-Driven approach_.

Also, it was mentioned that Angular 2 has support of two-way data binding
through a special attribute, though with different syntax from Angular 1. We'll get to this shortly.

Let's change `party-details.html` into a form, so that we can edit the party details:

{{> DiffBox tutorialName="meteor-angular2-socially" step="6.1"}}

Notice we have a routerLink button on the page that redirects back to the list (from our previous step's challenge). Don't forget to load all required dependencies.

## ngModel

[ngModel](https://angular.io/docs/js/latest/api/common/NgModel-directive.html) binds a HTML form to the component's model, which can be an object of any type, in comparison to
the Model-Driven binding where the `ControlGroup` instance is used.

The syntax looks a bit different, using both square and rounded brackets: `[(ngModel)]`. `ngModel` binds to the party properties and fills out the inputs, and vice versa:

{{> DiffBox tutorialName="meteor-angular2-socially" step="6.2"}}

Let's do a little test to see how form controls and events work in Angular 2. Start by binding to `party.name` below the input, then experiment by changing the input's text.

    <label for="name">Name</label>
    <input type="text" [(ngModel)]="party.name">

    <p>{{dstache}}party.name}}</p>

Notice that it updates automatically on changes. You can contrast this to form Controls which we need to update manually using events to reach this functionality.

If you look inside of [NgModel](https://github.com/angular/angular/blob/9e44dd85ada181b11be869841da2c157b095ee07/modules/angular2/src/common/forms/directives/ng_model.ts), you'll see that it inherits the NgControl directive and extends it by emitting an event when the input element's value has been changed.

But unlike a form Control, NgModel has some limitations, e.g., it doesn't support form validators.
If you need to validate your form, you can still combine `ngModel` directives with a form model assigned to the `ngFormModel` directive, like this:

    <form #f="ngForm" [ngFormModel]="partyForm">
      <label for="name">Name</label>
      <input type="text" ngControl="name" [(ngModel)]="party.name">

      <label for="description">Description</label>
      <input type="text" ngControl="description" [(ngModel)]="party.description">

      label for="location">Location</label>
      <input type="text" ngControl="location" [(ngModel)]="party.location">

      <button type="submit">Save</button>
      <button [routerLink]="['/PartiesList']">Cancel</button>
    </form>

To get this to work, you'll also have to make use of `FormBuilder` inside of the component and build a form model, as we already did for the `PartiesForm` view in the 4th step.

But let's keep the party details view simple for now, without using form controls.

As a finishing touch, let's add a submit event handler that saves the current party:

{{> DiffBox tutorialName="meteor-angular2-socially" step="6.3"}}

# Summary

In this step, we learned:

- how two-way data binding works in Angular 2 using `[(ngModel)]`
- how to bind inputs to the view and save the data

{{/template}}
