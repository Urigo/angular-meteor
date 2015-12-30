{{#template name="migration.angular1.bottom-up.md"}}

## Bottom-Up Migration

This migration approach lets you migrate full component (both logic and view) at a time.

The first step that we need to do is add the required packages for our project.

```bash
meteor add pbastowski:angular-babel@1.0.7
meteor add pbastowski:angular2-now@1.0.2
meteor add angular-with-blaze@1.3.2
meteor add urigo:angular-blaze-template@0.3.0
meteor add angularui:angular-ui-router@0.2.15
meteor add dotansimha:angular-reactive-component@0.0.4
```

or in one command

```bash
meteor add pbastowski:angular-babel@1.0.7 pbastowski:angular2-now@1.0.2 angular-with-blaze@1.3.2 urigo:angular-blaze-template@0.3.0 angularui:angular-ui-router@0.2.15 dotansimha:angular-reactive-component@0.0.4
```

> Please make sure that the installed angular package is newer than 1.3.1. If it's not, change the version in `.meteor/versions` file.

The first coding step is to bootstrap our angular application:

{{> DiffBox tutorialName="migration-angular1" step="0.1"}}

Everything here is a normal angular application bootstrap, except for the `run` function.

We will see later that we need to instantiate the angular components ourselves from outside of angular.
In order to make it possible, we need to store the injector of our app in an accessible location such as `window`.

Let's review again the **todos** app structure and our migration path in detail.

<img src="/migration-images/bottom-up.jpg" style="height: 500px; width: auto"/>

Our next step is to convert the `todos-item` logic and view to a full angular component.
Then we need to attach the new component to `list` template.

Let's start with creating a new angular component:

{{> DiffBox tutorialName="migration-angular1" step="1.1" filename="client/components/todos-item/todos-item.js"}}

We will discuss later about all the pieces here and see how they are all connected.

The class is stored in `window` for future access (like the injector).

{{> DiffBox tutorialName="migration-angular1" step="1.1" filename="client/components/todos-item/todos-item.ng.html"}}

The component above is a regular empty angular component. Nothing special yet.

Normally when you write angular application you don't need the `.ng.html` suffix.
But in order for your app to work properly when blaze and angular are combined, we need this suffix.
This is the way we tell the blaze compiler to ignore this file.
The angular templates compiler will pick only files with `.ng.html` suffix.
This way, both compilers won't collide.

> Later on, when we remove the blaze templates completely, we will rename all of our templates.

Before we start implementing our component logic, let's see how to attach it to the `list` blaze template.

You can't attach the component directly to the template:

*list.html*
```html
{{|#each todos}}
  <todos-item></todos-item>
{{|/each}}
```

This will not work because this template is out of the angular context.
Instead, we will use the `todos-item.html` template to be our connector to angular.

We will change `todos-item.html` to the following:

{{> DiffBox tutorialName="migration-angular1" step="1.2"}}

`removable` element will be our placeholder for the element we will create for our component later.

Another problem is that we need to instantiate the component manually.

> when you write angular apps, angular does it for you. But since we want to instantiate it from blaze,
we have to do it ourselves.

{{> DiffBox tutorialName="migration-angular1" step="1.3"}}

We told blaze to instantiate the component whenever the `todos-item.html` template is rendered.

Let's break this code to pieces to understand what is going on:

```javascript
var $rootScope = window.ngInjector.get('$rootScope');
var $templateCache = window.ngInjector.get('$templateCache');
var $compile = window.ngInjector.get('$compile');
```

We use the injector of our module that we stored in window to inject the required dependencies for our component instantiation.

```javascript
this.scope = $rootScope.$new();
```

We create a new scope for the component.

```javascript
var controller = window.ngInjector.instantiate(window.TodosItem, {data: this.data, $scope: this.scope});
```

We use the injector to instantiate our angular component.

We send to the instantiate method an object that will be injected to the component constructor.

> This is the reason why we stored The `TodosItem` class in window.

```javascript
var template = $templateCache.get(window.TodosItem.templateUrl);
```

Before we talked about `angular-meteor` angular templates compiler that handles `.ng.html` files.
What it does actually is wrap the template in javascript code that puts the template in the template cache of angular.

So now we can use `$templateCache.get` to retrieve the template from the cache.

```javascript
this.scope.todosItem = controller;
```

This will help us use the new `controllerAs` style.
We want this behavior because we want to reduce the `$scope` using to a minimum.

```javascript
this.elem = $compile(template)(this.scope);
```

Next, we will compile our template and link it to the scope we created before.
This will create an element that can be attached to the DOM.

```javascript
this.scope.$digest();
```

We want that the scope will be digested at least once before we attach the component to the DOM.
Any watchers that were added will run and perform their actions.

```javascript
this.$('removable').replaceWith(this.elem);
```

Our last step is to attach the element to the DOM. We replace the placeholder element with our element.

Before we jump to the actual component logic implementation, let's talk about what happens when blaze marks `todos-item` template for destruction.

Normally, blaze will remove the element from the DOM and release any helpers/resources that applied during the template lifecycle.

But, We did two things that blaze can't handle itself:

1. We created an angular scope.
2. We replaced the element from the DOM.

So in order to create a proper lifecycle to our component, we will destroy the scope and remove the element from the DOM
when the template is marked for destruction:

{{> DiffBox tutorialName="migration-angular1" step="1.4"}}

Now we are ready to start our component implementation.
We will follow the instructions in the templates section of this guide.

First of, we need to gather the following information of our component:
1. which browser events are handled?
2. which data/fields are reactive (bound for changes)?

For the `todos-item` here is the information gathered:

##### events

- item finish checkbox change
- item title input focus
- item title input blur
- item title input keyup (for title changes)
- delete item click and mousedown

##### reactive data

- item finish state (local and remote)
- item editing state (local)
- item title (local and remote)

> We will create helpers only for remote data (data in collections). local data changes can be implemented with angular.

We need to extract the fields from the data and store them in our controller.

> We injected the blaze data object to our controller for that reason.

{{> DiffBox tutorialName="migration-angular1" step="1.5"}}

But now we have a problem: `checked` and `text` can be changed remotely so we will store them as helpers:

{{> DiffBox tutorialName="migration-angular1" step="1.6"}}

And in order to make reactive possible we will attach the reactive context to our scope:

{{> DiffBox tutorialName="migration-angular1" step="1.7"}}

Now we'll construct the template:

{{> DiffBox tutorialName="migration-angular1" step="1.8"}}

This is the layout of our template, but it currently lacks the connection to the data and the events.

##### connecting the checked field (finish state)

{{> DiffBox tutorialName="migration-angular1" step="1.9"}}

Now the input is linked to the task finish state and whenever it changes remotely, the helper will update the data and the
input will automatically be updated as well.

But if you try to change the state locally, the changes will be reflected to the local model
but not remotely. We need to bound the local model to the remote model:

{{> DiffBox tutorialName="migration-angular1" step="1.10" filename="client/components/todos-item/todos-item.js"}}

{{> DiffBox tutorialName="migration-angular1" step="1.10" filename="client/components/todos-item/todos-item.ng.html"}}

We told angular to listen to the input changes and whenever there is a change, run the `check` method which updates the collection.

Now let's change the template to update the classes when the task is finished:

{{> DiffBox tutorialName="migration-angular1" step="1.11"}}

We used the `ngClass` directive to update the class attribute when the model changes.

##### connecting the task title

We will do the same for the task title:


{{> DiffBox tutorialName="migration-angular1" step="1.12" filename="client/components/todos-item/todos-item.js"}}

{{> DiffBox tutorialName="migration-angular1" step="1.12" filename="client/components/todos-item/todos-item.ng.html"}}

We used the way to detect the changes as we did before with the `checked` field. But now we have 2 problems:

1. If we want to put a validator on the title (let's say title can be at least 5 characters long),
we need to implement this validation ourselves.
2. In blaze the input changes are  throttled to 300ms for performance issues. and we need to implement it as well.

So we are going to change this specific implementation to ease our lives:

We will remove the `ngChange` directive from the `input` and add a watcher for the model changes:

{{> DiffBox tutorialName="migration-angular1" step="1.13" filename="client/components/todos-item/todos-item.js"}}

{{> DiffBox tutorialName="migration-angular1" step="1.13" filename="client/components/todos-item/todos-item.ng.html"}}

Let's add some validation to the title (Not on the original app):

{{> DiffBox tutorialName="migration-angular1" step="1.14" filename="client/components/todos-item/todos-item.js"}}

{{> DiffBox tutorialName="migration-angular1" step="1.14" filename="client/components/todos-item/todos-item.ng.html"}}


Now you can see that you can't type a title shorter than 5 characters.

We will use the `ngModelOptions` directive to handle the throttle:

{{> DiffBox tutorialName="migration-angular1" step="1.15"}}

We told angular to update the model only when the user is typing (`default` event) and to throttle the model updates to 300ms.
In addition, the model updates instantly whenever the input loses focus (`blur` event).

##### adding the editing state

First we need to add the events to the title `input`, and then update the classes of the div:

{{> DiffBox tutorialName="migration-angular1" step="1.16"}}

##### deleting a task

First we add the method to the controller:

{{> DiffBox tutorialName="migration-angular1" step="1.17"}}

Then attach it to the events (mousedown and click):

{{> DiffBox tutorialName="migration-angular1" step="1.18"}}

**Now we've completely converted the blaze component to angular.**

But we have last change to make.
When the template is destroyed the helpers will still be running. This will cause some issues so we need to stop the helpers.

{{> DiffBox tutorialName="migration-angular1" step="1.19"}}

Before we told blaze to destroy the scope when the template is destroyed.
We take this to our advantage and stop the helpers when the scope is destroyed.

On the first step, we added the `dotansimha:angular-reactive-component` package.
This package attaches the scope to the reactive context and stops the helpers when the scope is destroyed.

We will use it and replace the code we wrote:

*client/components/todos-item/todos-item.js*
```javascript
class TodosItem extends ReactiveComponent {
  constructor($scope, $reactive, data) {
    super(arguments);
    this._id = data._id;
    this.listId = data.listId;

    this.helpers({
      checked: () => Todos.findOne(data._id).checked,
      text: () => Todos.findOne(data._id).text
    });

    $scope.$watch("listItem.text", () => {
      Todos.update(this._id, {$set: {text: this.text}});
    });
  }
}
```

Now we can mark `todos-item` as finished and move on to the next component.

> You can check out the [commits comparison](https://github.com/ozsay/blaze2angular/compare/f4b898519a4d5783d86439afb0e191e7a8fc03a3...628923d5be3b321d69aafa9b989630a3bdf2f0ff) for the full change list.

We will use the same principles to convert the `list` component.
Please follow [this commits comparison](https://github.com/) to check out the change list.
This comparison doesn't include the implementation of the actual `todos` list nor the animations (`_uiHooks`). We will cover them next.

{{/template}}
