{{#template name="tutorialAngular2.step_04.html"}}  
{{> downloadPreviousStep stepName="step_03"}}

Now that we have full data binding from server to client, let's interact with the data and see the updates in action.

In this chapter you will add the ability to insert a new party and delete an existing one from the UI.

First, let's create a simple form with a button that will add a new party.

# Component Architecture

In Angular 2, it's common practice to break your app into smaller components. Let's make a new component called `parties-form`, and put it inside it's own directory with the same name.

{{> DiffBox tutorialName="angular2-meteor" step="4.1"}}

Notice that we are exporting the class `PartiesForm` using ES6 module syntax. This is how files and dependencies can be passed to each other without the use of script tags in the view.

When data is `export`ed, it must also be `import`ed on the other end. We'll get to that soon.

Also note that we aren't bootstrapping this component, as it is going inside of the bootstrapped root component.

Inside `parties-form/parties-form.ng.html`, add the following form:

{{> DiffBox tutorialName="angular2-meteor" step="4.2"}}

Link to the parties-form component in `index.ng.html`

{{> DiffBox tutorialName="angular2-meteor" step="4.3"}}

And finally let your Socially Component know it should import and use the `parties-form` component.

{{> DiffBox tutorialName="angular2-meteor" step="4.4"}}

Again, first we import the class, then we add it to our list of View directives.

# Angular 2 Forms

Now let's get back to the form and make it functional.

In Angular 2, there are two main ways to create forms: we will address 'model-driven' forms in this step, but we'll also look at `template-driven` forms in step 06.

## Model Driven Forms

First up, import the form directives & controls.

{{> DiffBox tutorialName="angular2-meteor" step="4.5"}}

By now you should have the hang of it. `import`, and add it to the View directives.

Next, we can construct our form controls. For controls give you access to useful form features such as validators and much more.

{{> DiffBox tutorialName="angular2-meteor" step="4.6"}}

We are binding `this.partiesForm` here to a [Control Group](https://angular.io/docs/js/latest/api/forms/ControlGroup-class.html). Think of a control group as a wrapper for a group of form controls.

Alternatively, form controls can be created one at a time using Control, but it's easier to create them as a group.

    this.partiesForm.controls.name = new Control('');

is the same as

    this.partiesForm = new ControlGroup({
      name: new Control('')
    });

The first value provided is the initial value for the form control. For example, `this.name = new Control('Bob')` would initialize the form value to 'Bob', or `this.name = new Control()` would initialize the value to null.

    this.partiesForm.value;
    > { name: '', description: ''}

We could also access the control values individually.

    this.partiesForm.controls.name.value;
    > ''

A control can also take a Validator, which binds to the form. Name & description are both required, so let's specify that.

{{> DiffBox tutorialName="angular2-meteor" step="4.7"}}

The required validator here specifies that the form isn't valid if name or description are empty.

    this.partiesForm.value = '';
    this.partiesForm.valid
    > false

First things first, let's bind the control group to the form and the controls to the input values.

{{> DiffBox tutorialName="angular2-meteor" step="4.8"}}

Now each time the user types inside these inputs, the value of the partiesForm and its controls will be automatically updated.  Conversely, if `this.partiesForm.value` is changed outside of the HTML, the input values will be updated accordingly.

Alternatively we can bind to the form by using a local variable in the template, indicated by the '#' symbol.

__`client/parties-form/parties-form.ng.html`:__

    <form [ng-form-model]="partiesForm" #f="form">

Now calling `f.value`, or displaying {{dstache}}f.value}} will give us the value of our form.

    f.value
    > {name: '', description: ''}

## (submit)

In Angular 2, the model determines the view. Change the model, and the view automatically updates thanks to Angular 2's change detection with Zone.js.

But then how does the view trigger changes in the model? It does this through events, which are indicated by the round bracket () syntax. `(submit)` or `(click)` are examples of events.

Now let's bind a submit event to the add button provided to us by the [NgForm](https://angular.io/docs/js/latest/api/forms/NgForm-class.html) directive. This will trigger if the button is clicked, or if the user presses enter on the final field.

{{> DiffBox tutorialName="angular2-meteor" step="4.9"}}

In Angular 2, events are indicated by the round bracket () syntax. Here we are telling Angular to call a method `add` on submit and pass in the value of the form, `f`. Let's add the add method to our PartiesForm class.

{{> DiffBox tutorialName="angular2-meteor" step="4.10"}}

Open a different browser, fill out the form, submit and see how the party is added on both clients. So simple!

> As a note, if you are dealing with more complex forms, use [Form Builder](https://github.com/angular/angular/blob/master/modules/angular2/src/forms/form_builder.ts), which further simplifies the use of Controls & ControlGroups.

## (click)

Now, let's add the ability to delete parties.

Let's add an X button to each party:

{{> DiffBox tutorialName="angular2-meteor" step="4.11"}}


Here again, we are binding an event to the class context and passing in the party as a parameter.

Let's go into the class and add that function.

Add the function inside the Socially class in `app.ts`:

{{> DiffBox tutorialName="angular2-meteor" step="4.12"}}

The Mongo Collection Parties has a function called 'remove'. We search for the relevant party by its identifier, `_id`, and delete it.

And this is how the class should now look:

__`client/app.ts`:__

    class Socially {
      constructor() {
        Tracker.autorun(zone.bind(() => {
          this.parties = Parties.find().fetch();
        }));
      }
      remove(party) {
        Parties.remove(party._id);
      }
    }

Now try to delete a few parties and also watch them being removed from other browser clients.


# Summary

So now you've seen how easy it is to manipulate the data using Angular's powerful directives and sync that data with Meteor's powerful Mongo.collection API.

{{/template}}
