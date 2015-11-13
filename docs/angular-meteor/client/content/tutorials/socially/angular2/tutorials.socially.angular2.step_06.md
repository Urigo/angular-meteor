{{#template name="tutorials.socially.angular2.step_06.md"}}
{{> downloadPreviousStep stepName="step_05"}}  

In this step we are going to add a form to the party details view and 
bind a party object to it, so that we'll be able to change party details and
then save changes to the storage.

# Two-Way Data Binding

As we've already explored on the 3rd step, data can be bound to the HTML input elements
with the help of a group of special Angular2 Control objects, or otherwise called a form model.
We called this approach — Model-Driven approach.

Also, it was mentioned that Angular2 has support of very well familiar to Angular 1 developers two-way data binding
through a special attribute. It has the same name as in Angular 1 but it's used with a bit
different syntax. We'll get to it in a second.

Now let's change `party-details.html` to a form, so that we can edit the party details:

{{> DiffBox tutorialName="meteor-angular2-socially" step="6.1"}}

Since we have a router-link button on the page that redirects back to the list (that was previous step's challenge), don't forget to add all required dependencies.

## ng-model

[ng-model](https://angular.io/docs/js/latest/api/forms/NgModel-class.html) binds a view form to the component's model, which can be an object of any type, in comparison to
Model-Driven binding where `ControlGroup` is used. Let's setup the dependencies and look at an example.

The NgModel dependency can be found in `FORM_DIRECTIVES`. First, import it and add it to your list of View directives.

{{> DiffBox tutorialName="meteor-angular2-socially" step="6.2"}}

Now that Angular knows about NgModel, we can use it in our template.

The syntax looks a bit different: `[(ng-model)]`. Ng-model binds to `this.party` and the data should fill out the inputs.

{{> DiffBox tutorialName="meteor-angular2-socially" step="6.3"}}

Let's do a little test to see how form controls and events work in Angular 2. Bind to `party.name` below the input, then change the input text.

    <label for="name">Name</label>
    <input type="text" [(ng-model)]="party.name">

    <p>{{dstache}}party.name}}</p>

Notice that it updates automatically. You can contrast this to form Controls which we need to update manually on events to reach this functionality.
So essentially, NgModel is emitting an event when changed.

But unlike a form Control, NgModel has some limitations, e.g., it doesn't support form validators.
But if we need to validate your form, we can still combine `ng-model` directives with a form model assigned to the `ng-form-model` directive, like this:

    <form #f="form" [ng-form-model]="partyForm">
      <label for="name">Name</label>
      <input type="text" ng-control="name" [(ng-model)]="party.name">

      <label for="description">Description</label>
      <input type="text" ng-control="description" [(ng-model)]="party.description">

      label for="location">Location</label>
      <input type="text" ng-control="location" [(ng-model)]="party.location">

      <button type="submit">Save</button>
      <button [router-link]="['/PartiesList']">Cancel</button>
    </form>

To get this to work, you'll also have to make use of `FormBuilder` inside of the component and build a form model, as we already did for the `PartiesForm` view on the 4th step.

But let's keep party details view simple for now, without using form Controls.

Lastly, let's add a submit event handler that saves the current party:

{{> DiffBox tutorialName="meteor-angular2-socially" step="6.4"}}

# Summary

In this step:

- we touched briefly how two-way data binding works in Angular2
- we extended PartyDetails view to contain a form that allows us to make changes to the party and save changes to the storage.

{{/template}}
