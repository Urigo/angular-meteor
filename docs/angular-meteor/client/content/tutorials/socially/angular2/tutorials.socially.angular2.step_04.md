{{#template name="tutorials.socially.angular2.step_04.md"}}  
{{> downloadPreviousStep stepName="step_03"}}

Now that we have full data binding from server to client, let's interact with the data and see the updates in action.

In this chapter we are going to:

- create a new component to add or remove a party
- learn about model-driven forms and create one
- learn how to hook up form events to component methods
- implement adding & removing party event handlers

First, let's create a simple form with a button that will add a new party.

# Component Architecture

In Angular 2, we build a tree of components with the root `Socially` component and
child components stemming out of it down to the leaves. This is one of the principal
architectural differences between Angular 1 & 2.

Let's make a new component called `PartiesForm`, and put it inside it's own directory ("client/parties-form").

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.1"}}

Notice that we are exporting the class `PartiesForm` using ES6 module syntax.
By doing so, we tell TypeScript to create a System.js module with the file content inside.

As a result, you'll be able to import `PartiesForm` in any other component as follows:

    import {PartiesForm} from 'client/parties-form/parties-form';

By exporting and importing different modules, you create a modular structure of your app in ES6,
which is similar to the modules in other script languages like Python.
This is what makes programming in ES6 really awesome since application structure comes out rigid and clear.

Let's add a template for the new component.

Add a file `parties-form/parties-form.html` with the following form:

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.2"}}

We can load the new `PartiesForm` component on the page by placing the `<parties-form>` tag in the root template `app.html`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.3"}}

There is one more required step in Angular 2 to load a component. The `Socially` component is not aware of child components unless you explicitly let it know what to look for. Add the `PartiesForm` class to the View annotation of the `Socially`, like this:

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.4"}}

Here's a good example how to import and link custom components together:

- import the component class you want to use
- we add it to the list of directives to use in the `View` annotation

As soon as it's done, the imported component's directive becomes available in the template.

# Angular 2 Forms

Now let's get back to the form and make it functional.

As you may know, two-way data binding is the default data exchange mechanism between
components (controllers or directives) and views in Angular 1. In other words, if you bind an Angular 1 contoller's property to, say, an `<input>` element on some linked template,
every change to the value of this input will update that property of the controller and
vice versa.

In Angular 2, things have changed a bit. Two-way data binding is still available,
but by default. We will take a close look at two-way binding during the 6th step of the tutorial.

In this chapter, we are going to explore a new way to bind a form input element to a component in Angular 2.

We can build a form model and then two-way bind this model to input elements in the component's view.

This way looks more transparent and allows tighter control over data exchange
than binding to component properties directly.
Let's call this way _Model-Driven Forms_.

## Model-Driven Forms

First, let's construct our form model. There is a special class for this called [`FormBuilder`](https://angular.io/docs/ts/latest/api/common/FormBuilder-class.html).
First, we should import necessary dependencies, then build the model and its future fields with help of the `FormBuilder` instance:

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.5"}}

Each element of the form model is actually going to be an instance of [`Control`](https://angular.io/docs/ts/latest/api/common/Control-class.html) type.
It's a special type, which binds to a form input element and can provide data validation
in the model on demand.

Form model itself is of [`ControlGroup`](https://angular.io/docs/js/latest/api/common/ControlGroup-class.html) type. As its name says, it groups provided controls together.

Alternatively, we could write:

    this.partiesForm = fb.build({
      name: new Control('')
    });

or even create each control separately:

    this.partiesForm.controls.name = new Control('');

The first value provided is the initial value for the form control. For example:

    this.partiesForm = fb.build({
      name: ['Bob']
    });

will initialize name to _Bob_ value.

We can use `partiesForm.value` to access current state of the model:

    console.log(this.partiesForm.value);
    > { name: '', description: '', location: ''}

We could also access the control values individually.

    console.log(this.partiesForm.controls.name.value);
    > ''

Now, since `name` and `location` are required fields in our model, let's set up validation.

In Angular2, it's less then easy, just add [`Validators.required`](https://angular.io/docs/ts/latest/api/common/Validators-class.html) as a second parameter to a required control:

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.6"}}

We can check `partiesForm.valid` property to determine if the form is valid:  

    console.log(this.partiesForm.valid)
    > false

Now let's bind the form model to the form and its input elements. Here we use special
form directives: [`ngFormModel`](https://angular.io/docs/ts/latest/api/common/NgFormModel-directive.html) and [`ngControl`](https://angular.io/docs/ts/latest/api/common/NgControl-class.html), that do all the magic by binding properties, that we just defined, to the DOM elements. As was mentioned in the earlier steps, these form directives are part of the `angular2/common` package and thus available right away in each template — no need to import them into the component itself.

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.7"}}

Now each time the user types inside these inputs, the value of the `partiesForm` and its controls will be automatically updated.
Conversely, if `partiesForm` is changed outside of the HTML, the input values will be updated accordingly.

## Event Handlers

### (submit)

We just set up the form and synchronized it with the form model.

Let's start adding new parties to the `Parties` collection.
Before we start, we create a new submit button and a form submit event handler.

It's worth mentioning one more great feature that appeared in Angular 2.
It's possible now to define and use local variables in a template.

For example, to add a party we'll need to take the
current state of the form and pass it to an event handler.
Now we can take the form and print it inside the template:

    <form [ngFormModel]="partiesForm" #f="ngForm">
        ...
        {{|f.value}}
    </form>

you'll see something like:

    {name: '', description: '', location: ''}

which is exactly what we need — the form model object.

Now let's bind a submit event to the add button.
This event will trigger if the button is clicked, or if the user presses enter on the final field.

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.8"}}

In Angular 2, events are indicated by the round bracket () syntax. Here we are telling Angular to call a method `addParty` on submit and pass in the value of the form, `f`. Let's add the addParty method to our PartiesForm class.

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.9"}}

> Note: TypeScript doesn't know that controls properties are of Control type.
> That's why we are casting them to the Control type.

Open a different browser, fill out the form, submit and see how the party is added on both clients. So simple!

### (click)

Now, let's add the ability to delete parties.

Let's add an X button to each party in our party list:

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.10"}}


Here again, we are binding an event to the class context and passing in the party as a parameter.

Let's go into the class and add that method.

Add the method inside the Socially class in `app.ts`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="4.11"}}

The Mongo Collection Parties has a method called "remove". We search for the relevant party by its identifier, `_id`, and delete it.

Now try to delete a few parties. Since Meteor syncs data between clients, you can also watch them being removed from other browser clients.


# Summary

In this chapter we've seen:

- how easy it is to create a form and access its data using Angular 2's power
- how easy it is to save that data to the storage using Meteor's power

{{/template}}
